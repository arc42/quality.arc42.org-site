// Header search autocomplete.
//
// Deterministic prefix-and-substring scorer over titles, aliases, and tags from
// assets/data/search-lookup.json. This deliberately does NOT use Lunr — Lunr's
// Porter stemmer rewrites "performance" → "perform", which makes prefix queries
// like "performa" miss and surface unrelated body-level matches. Autocomplete
// needs predictable ranking, not stemmed full-text recall. The /search/ page
// keeps Lunr for full-results body-text search.
//
// Keyboard:
//   Cmd/Ctrl + K   focus header search from anywhere
//   /              focus header search from anywhere (ignored while typing)
//   Up / Down      walk results across groups
//   Enter          navigate to focused row (or submit form fallback)
//   Esc            close panel; second Esc clears input and blurs

const DEBOUNCE_MS = 100;
const PER_GROUP = 5;
const TOTAL_VISIBLE = 12;

const GROUPS = [
  { type: "quality", label: "Qualities" },
  { type: "requirement", label: "Requirements" },
  { type: "approach", label: "Approaches" },
  { type: "standard", label: "Standards" },
];

// Scoring weights — higher is better. Tuned for typical autocomplete intent:
// title prefix matches dominate, alias matches strong second, substring/tag
// matches break ties at the bottom.
const W = {
  TITLE_EXACT: 1000,
  TITLE_PREFIX: 500,
  TITLE_WORD_PREFIX: 320,
  ALIAS_EXACT: 400,
  ALIAS_PREFIX: 240,
  ALIAS_WORD_PREFIX: 180,
  TITLE_SUBSTR: 90,
  ALIAS_SUBSTR: 60,
  TAG_PREFIX: 50,
  TAG_SUBSTR: 25,
};

// Type-priority for tie-breaking — qualities first because they're the
// usual entry point during a workshop lookup.
const TYPE_RANK = { quality: 0, requirement: 1, approach: 2, standard: 3 };

let lookupPromise = null;
let lookupItems = null; // [{ title, type, url, aliases, tags, _titleL, _aliasL, _tagsL, _titleWords, _aliasWords }]

function loadLookup(baseurl) {
  if (lookupPromise) return lookupPromise;
  lookupPromise = fetch(baseurl + "/assets/data/search-lookup.json")
    .then((r) => r.json())
    .then((data) => {
      // Pre-tokenise once. With ~400 docs this is a few-ms one-time cost.
      lookupItems = Object.values(data).map((d) => {
        const titleL = (d.title || "").toLowerCase();
        const aliasesL = (d.aliases || "").toLowerCase();
        const tagsL = (d.tags || "").toLowerCase();
        return {
          ...d,
          _titleL: titleL,
          _aliasesL: aliasesL,
          _tagsL: tagsL,
          _titleWords: titleL.split(/[\s\-_/]+/).filter(Boolean),
          _aliasWords: aliasesL.split(/[\s\-_/]+/).filter(Boolean),
          _tagWords: tagsL.split(/[\s,]+/).filter(Boolean),
        };
      });
      return lookupItems;
    })
    .catch((err) => {
      lookupPromise = null;
      throw err;
    });
  return lookupPromise;
}

function scoreItem(item, terms) {
  let score = 0;
  let hits = 0;
  for (const term of terms) {
    let termScore = 0;
    if (item._titleL === term) termScore = W.TITLE_EXACT;
    else if (item._titleL.startsWith(term)) termScore = W.TITLE_PREFIX;
    else if (item._aliasWords.includes(term)) termScore = W.ALIAS_EXACT;
    else if (item._titleWords.some((w) => w.startsWith(term))) termScore = W.TITLE_WORD_PREFIX;
    else if (item._aliasesL.startsWith(term)) termScore = W.ALIAS_PREFIX;
    else if (item._aliasWords.some((w) => w.startsWith(term))) termScore = W.ALIAS_WORD_PREFIX;
    else if (item._titleL.includes(term)) termScore = W.TITLE_SUBSTR;
    else if (item._aliasesL.includes(term)) termScore = W.ALIAS_SUBSTR;
    else if (item._tagWords.some((w) => w.startsWith(term))) termScore = W.TAG_PREFIX;
    else if (item._tagsL.includes(term)) termScore = W.TAG_SUBSTR;

    if (termScore === 0) return 0; // every term must contribute
    score += termScore;
    hits++;
  }
  // Shorter titles slightly preferred when scores tie — "Performance Efficiency"
  // ranks above a longer title that mentions performance only in passing.
  score -= Math.min(item._titleL.length, 40) * 0.5;
  return score;
}

function rank(query) {
  if (!lookupItems) return [];
  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 1);
  if (terms.length === 0) return [];

  const scored = [];
  for (const item of lookupItems) {
    const s = scoreItem(item, terms);
    if (s > 0) scored.push({ item, score: s });
  }
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const ra = TYPE_RANK[a.item.type] ?? 99;
    const rb = TYPE_RANK[b.item.type] ?? 99;
    if (ra !== rb) return ra - rb;
    return a.item._titleL.localeCompare(b.item._titleL);
  });
  return scored;
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(text, terms) {
  const safe = escapeHtml(text);
  if (!terms.length) return safe;
  const pattern = terms.map(escapeRegex).filter(Boolean).join("|");
  if (!pattern) return safe;
  const re = new RegExp(`(${pattern})`, "gi");
  return safe.replace(re, "<mark>$1</mark>");
}

function groupAndCap(scored) {
  const groups = new Map();
  GROUPS.forEach((g) => groups.set(g.type, []));
  let total = 0;
  for (const entry of scored) {
    if (total >= TOTAL_VISIBLE) break;
    const bucket = groups.get(entry.item.type);
    if (!bucket) continue;
    if (bucket.length >= PER_GROUP) continue;
    bucket.push(entry);
    total++;
  }
  return { groups, totalRendered: total };
}

function renderPanel({ scored, terms, query: q, baseurl }) {
  const { groups, totalRendered } = groupAndCap(scored);

  if (totalRendered === 0) {
    return {
      html:
        `<div class="site-search__empty" role="status">` +
        `No matches for <strong>${escapeHtml(q)}</strong>. ` +
        `<span class="site-search__hint-line">Press Enter to search full text.</span>` +
        `</div>`,
      optionCount: 0,
    };
  }

  let idx = 0;
  const parts = [];

  for (const { type, label } of GROUPS) {
    const bucket = groups.get(type) || [];
    if (bucket.length === 0) continue;

    parts.push(
      `<div class="site-search__group" data-type="${type}" role="group" aria-label="${label}">` +
        `<div class="site-search__group-label">${label}</div>` +
        `<ul class="site-search__list" role="presentation">`,
    );

    for (const { item } of bucket) {
      const id = `site-search-opt-${idx}`;
      const title = highlight(item.title, terms);
      const url = baseurl + item.url;
      const path = escapeHtml(item.url);
      parts.push(
        `<li role="option" id="${id}" class="site-search__item" data-type="${type}" data-href="${escapeHtml(url)}" data-index="${idx}" aria-selected="false">` +
          `<span class="site-search__title">${title}</span>` +
          `<span class="site-search__path" aria-hidden="true">${path}</span>` +
          `</li>`,
      );
      idx++;
    }

    parts.push(`</ul></div>`);
  }

  if (scored.length > totalRendered) {
    parts.push(
      `<div class="site-search__more">` +
        `Showing ${totalRendered} of ${scored.length}. ` +
        `<span class="site-search__hint-line">Press Enter to see all results.</span>` +
        `</div>`,
    );
  } else {
    parts.push(
      `<div class="site-search__more">` +
        `<span class="site-search__hint-line">Enter to open · Esc to close · ↑↓ to navigate</span>` +
        `</div>`,
    );
  }

  return { html: parts.join(""), optionCount: idx };
}

function isTypingTarget(el) {
  if (!el) return false;
  if (el.isContentEditable) return true;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

export function initAutocomplete() {
  const form = document.querySelector("[data-site-search]");
  if (!form) return;

  const input = form.querySelector("#site-search-input");
  const panel = form.querySelector("#site-search-panel");
  const status = form.querySelector("[data-site-search-status]");
  const hint = form.querySelector("[data-site-search-hint]");
  if (!input || !panel) return;

  const baseurl = (window.baseurl || "").replace(/\/$/, "");

  if (hint) {
    const isMac =
      typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform || "");
    hint.textContent = isMac ? "⌘K" : "/";
    hint.setAttribute("title", isMac ? "Press ⌘K to search" : "Press / to search");
  }

  let activeIndex = -1;
  let currentOptions = [];
  let lastQuery = "";
  let debounceTimer = null;
  let suppressNextOpen = false;

  function setStatus(message) {
    if (status) status.textContent = message || "";
  }

  function closePanel() {
    panel.hidden = true;
    panel.innerHTML = "";
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    activeIndex = -1;
    currentOptions = [];
  }

  function openPanel(html, optionCount) {
    panel.innerHTML = html;
    panel.hidden = false;
    input.setAttribute("aria-expanded", optionCount > 0 ? "true" : "false");
    currentOptions = Array.from(panel.querySelectorAll(".site-search__item"));
    activeIndex = currentOptions.length > 0 ? 0 : -1;
    applyActive();
  }

  function applyActive() {
    currentOptions.forEach((el, i) => {
      const on = i === activeIndex;
      el.setAttribute("aria-selected", on ? "true" : "false");
      el.classList.toggle("is-active", on);
    });
    if (activeIndex >= 0 && currentOptions[activeIndex]) {
      input.setAttribute("aria-activedescendant", currentOptions[activeIndex].id);
      const el = currentOptions[activeIndex];
      const elTop = el.offsetTop;
      const elBottom = elTop + el.offsetHeight;
      if (elTop < panel.scrollTop) panel.scrollTop = elTop;
      else if (elBottom > panel.scrollTop + panel.clientHeight) {
        panel.scrollTop = elBottom - panel.clientHeight;
      }
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  }

  function moveActive(delta) {
    if (currentOptions.length === 0) return;
    activeIndex = (activeIndex + delta + currentOptions.length) % currentOptions.length;
    applyActive();
  }

  async function runQuery(q) {
    if (!q || q.trim().length < 2) {
      closePanel();
      setStatus("");
      return;
    }
    try {
      if (!lookupItems) await loadLookup(baseurl);
    } catch {
      setStatus("Search unavailable. Press Enter to search the full page.");
      closePanel();
      return;
    }
    if (q !== lastQuery) return; // a newer query is in flight

    const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const scored = rank(q);
    const { html, optionCount } = renderPanel({
      scored,
      terms,
      query: q,
      baseurl,
    });
    openPanel(html, optionCount);
    setStatus(
      optionCount > 0
        ? `${optionCount} result${optionCount === 1 ? "" : "s"} for ${q}.`
        : `No results for ${q}.`,
    );
  }

  input.addEventListener("input", () => {
    const q = input.value;
    lastQuery = q;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => runQuery(q), DEBOUNCE_MS);
  });

  input.addEventListener("focus", () => {
    if (!lookupItems && !lookupPromise) {
      loadLookup(baseurl).catch(() => {
        /* surfaced on demand */
      });
    }
    if (suppressNextOpen) {
      suppressNextOpen = false;
      return;
    }
    if (input.value.trim().length >= 2 && panel.hidden) {
      runQuery(input.value);
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      if (panel.hidden && input.value.trim().length >= 2) {
        runQuery(input.value);
        e.preventDefault();
        return;
      }
      if (!panel.hidden) {
        e.preventDefault();
        moveActive(1);
      }
    } else if (e.key === "ArrowUp") {
      if (!panel.hidden) {
        e.preventDefault();
        moveActive(-1);
      }
    } else if (e.key === "Home" && !panel.hidden && currentOptions.length) {
      e.preventDefault();
      activeIndex = 0;
      applyActive();
    } else if (e.key === "End" && !panel.hidden && currentOptions.length) {
      e.preventDefault();
      activeIndex = currentOptions.length - 1;
      applyActive();
    } else if (e.key === "Escape") {
      if (!panel.hidden) {
        e.preventDefault();
        closePanel();
      } else if (input.value !== "") {
        e.preventDefault();
        input.value = "";
        setStatus("");
      } else {
        input.blur();
      }
    } else if (e.key === "Enter") {
      if (!panel.hidden && activeIndex >= 0 && currentOptions[activeIndex]) {
        const href = currentOptions[activeIndex].getAttribute("data-href");
        if (href) {
          e.preventDefault();
          window.location.assign(href);
          return;
        }
      }
      // Otherwise form submits to /search/?q=... — full-page fallback.
    }
  });

  panel.addEventListener("mousedown", (e) => {
    const item = e.target.closest(".site-search__item");
    if (!item) return;
    const href = item.getAttribute("data-href");
    if (href) {
      e.preventDefault();
      window.location.assign(href);
    }
  });

  panel.addEventListener("mousemove", (e) => {
    const item = e.target.closest(".site-search__item");
    if (!item) return;
    const idx = currentOptions.indexOf(item);
    if (idx >= 0 && idx !== activeIndex) {
      activeIndex = idx;
      applyActive();
    }
  });

  document.addEventListener("mousedown", (e) => {
    if (!form.contains(e.target)) closePanel();
  });

  document.addEventListener("keydown", (e) => {
    const target = e.target;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      input.focus();
      input.select();
      return;
    }
    if (e.key === "/" && !isTypingTarget(target) && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      suppressNextOpen = true;
      input.focus();
      input.select();
      suppressNextOpen = false;
    }
  });
}
