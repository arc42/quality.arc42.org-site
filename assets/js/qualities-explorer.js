(function () {
  const root = document.getElementById("qualities-explorer");
  const dataElement = document.getElementById("qualities-explorer-data");
  if (!root || !dataElement) return;

  const baseUrl = root.dataset.baseurl || "";

  const facetsContainer = document.getElementById("qualities-facets");
  const facetsSummary = document.getElementById("qualities-facet-summary");
  const lettersContainer = document.getElementById("qualities-letter-nav");
  const lettersSummary = document.getElementById("qualities-letters-summary");
  const resultsContainer = document.getElementById("qualities-results");
  const resultsSummary = document.getElementById("qualities-results-summary");

  const state = {
    activeTags: new Set(),
    all: [],
    canonicalCount: 0,
    aliasCount: 0,
  };

  function qualityLetter(title) {
    const first = (title || "").trim().charAt(0).toUpperCase();
    return /[A-Z]/.test(first) ? first : "#";
  }

  function letterAnchorId(letter) {
    return letter === "#" ? "quality-letter-num" : `quality-letter-${letter.toLowerCase()}`;
  }

  function parseData() {
    try {
      return JSON.parse(dataElement.textContent || "[]");
    } catch (error) {
      return [];
    }
  }

  function normalizeData(rawItems) {
    const normalized = [];

    rawItems
      .filter((item) => item && item.id && item.title)
      .forEach((item) => {
        const tags = Array.isArray(item.tags) ? item.tags.filter(Boolean) : [];
        const aliases = Array.isArray(item.aliases)
          ? item.aliases.filter((alias) => alias && alias.title)
          : [];

        const canonicalItem = {
          id: String(item.id),
          title: String(item.title),
          url: String(item.url || ""),
          tags: tags.slice().sort((a, b) => a.localeCompare(b)),
          aliases: aliases.slice().sort((a, b) => a.title.localeCompare(b.title)),
          relatedCount: Number(item.relatedCount || 0),
          standardsCount: Number(item.standardsCount || 0),
          letter: qualityLetter(item.title),
          kind: "canonical",
          canonicalId: String(item.id),
          canonicalTitle: String(item.title),
          canonicalUrl: String(item.url || ""),
        };
        normalized.push(canonicalItem);

        aliases.forEach((alias) => {
          const aliasTitle = String(alias.title || "");
          const aliasId = String(alias.id || "");
          const aliasUrl = String(alias.url || "");

          normalized.push({
            id: aliasId,
            title: aliasTitle,
            url: aliasUrl,
            tags: tags.slice().sort((a, b) => a.localeCompare(b)),
            aliases: [],
            relatedCount: Number(item.relatedCount || 0),
            standardsCount: Number(item.standardsCount || 0),
            letter: qualityLetter(aliasTitle),
            kind: "alias",
            canonicalId: String(item.id),
            canonicalTitle: String(item.title),
            canonicalUrl: String(item.url || ""),
          });
        });
      });

    return normalized.sort((a, b) => a.title.localeCompare(b.title));
  }

  function filterItems() {
    return state.all.filter((item) => {
      const tagMatches = Array.from(state.activeTags).every((tag) => item.tags.includes(tag));
      return tagMatches;
    });
  }

  function tagUrl(tag) {
    return `${baseUrl}/tag-${encodeURIComponent(tag)}`;
  }

  function renderFacets() {
    if (!facetsContainer) return;

    const counts = new Map();
    state.all.forEach((item) => {
      item.tags.forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });

    const tags = Array.from(counts.keys()).sort((a, b) => a.localeCompare(b));
    facetsContainer.innerHTML = "";

    tags.forEach((tag) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `qualities-facet-chip${state.activeTags.has(tag) ? " active" : ""}`;
      button.setAttribute("aria-pressed", state.activeTags.has(tag) ? "true" : "false");

      const name = document.createElement("span");
      name.textContent = `#${tag}`;
      button.appendChild(name);

      const count = document.createElement("span");
      count.className = "qualities-count";
      count.textContent = String(counts.get(tag) || 0);
      button.appendChild(count);

      button.addEventListener("click", () => {
        if (state.activeTags.has(tag)) {
          state.activeTags.delete(tag);
        } else {
          state.activeTags.add(tag);
        }
        renderAll();
      });

      facetsContainer.appendChild(button);
    });

    if (facetsSummary) {
      facetsSummary.textContent =
        state.activeTags.size > 0
          ? `Active: ${Array.from(state.activeTags)
              .sort((a, b) => a.localeCompare(b))
              .join(", ")}`
          : "No dimension filter";
    }
  }

  function renderLetters(groups) {
    if (!lettersContainer) return;
    lettersContainer.innerHTML = "";

    const letters = Array.from(groups.keys()).sort((a, b) => a.localeCompare(b));

    letters.forEach((letter) => {
      const link = document.createElement("a");
      link.className = "qualities-letter-chip";
      link.href = `#${letterAnchorId(letter)}`;

      const name = document.createElement("span");
      name.textContent = letter;
      link.appendChild(name);

      const count = document.createElement("span");
      count.className = "qualities-count";
      count.textContent = String(groups.get(letter).length);
      link.appendChild(count);

      lettersContainer.appendChild(link);
    });

    if (lettersSummary) {
      lettersSummary.textContent =
        letters.length > 0 ? `${letters.length} letters in current result` : "No letters";
    }
  }

  function createTagsLine(tags) {
    const line = document.createElement("div");
    line.className = "qualities-item-tags";

    const icon = document.createElement("i");
    icon.className = "fa fa-tags";
    icon.setAttribute("aria-hidden", "true");
    line.appendChild(icon);

    tags.forEach((tag, index) => {
      const link = document.createElement("a");
      link.href = tagUrl(tag);
      link.textContent = `#${tag}`;
      line.appendChild(link);

      if (index < tags.length - 1) {
        line.appendChild(document.createTextNode(", "));
      }
    });

    return line;
  }

  function renderResults(items) {
    if (!resultsContainer) return;
    resultsContainer.innerHTML = "";

    const groups = new Map();
    items.forEach((item) => {
      if (!groups.has(item.letter)) groups.set(item.letter, []);
      groups.get(item.letter).push(item);
    });

    renderLetters(groups);

    if (resultsSummary) {
      const canonicalVisible = items.filter((item) => item.kind === "canonical").length;
      const aliasesVisible = items.filter((item) => item.kind === "alias").length;
      resultsSummary.textContent = `${items.length} of ${state.all.length} terms visible (${canonicalVisible}/${state.canonicalCount} canonical, ${aliasesVisible}/${state.aliasCount} aliases)`;
    }

    if (items.length === 0) {
      const empty = document.createElement("p");
      empty.className = "qualities-empty";
      empty.textContent = "No quality characteristics match the current search/filter settings.";
      resultsContainer.appendChild(empty);
      return;
    }

    const letters = Array.from(groups.keys()).sort((a, b) => a.localeCompare(b));

    letters.forEach((letter) => {
      const section = document.createElement("section");
      section.className = "qualities-letter-section";

      const heading = document.createElement("h3");
      heading.className = "qualities-letter-heading";
      heading.id = letterAnchorId(letter);
      heading.textContent = `\u2014 ${letter} \u2014`;
      section.appendChild(heading);

      const list = document.createElement("ul");
      list.className = "qualities-letter-list";

      groups
        .get(letter)
        .slice()
        .sort((a, b) => a.title.localeCompare(b.title))
        .forEach((item) => {
          const li = document.createElement("li");
          li.className = "qualities-item";
          if (item.kind === "alias") li.classList.add("is-alias");

          const title = document.createElement("h4");
          title.className = "qualities-item-title";
          const titleLink = document.createElement("a");
          titleLink.href = item.url || `${baseUrl}/qualities/${encodeURIComponent(item.id)}`;
          titleLink.textContent = item.title;
          title.appendChild(titleLink);
          li.appendChild(title);

          if (item.kind === "alias") {
            const aliasMeta = document.createElement("div");
            aliasMeta.className = "qualities-alias-meta";

            const aliasLabel = document.createElement("span");
            aliasLabel.className = "qualities-alias-label";
            aliasLabel.textContent = "alias";
            aliasMeta.appendChild(aliasLabel);

            aliasMeta.appendChild(document.createTextNode("of "));
            const canonicalLink = document.createElement("a");
            canonicalLink.href =
              item.canonicalUrl || `${baseUrl}/qualities/${encodeURIComponent(item.canonicalId)}`;
            canonicalLink.textContent = item.canonicalTitle;
            aliasMeta.appendChild(canonicalLink);

            li.appendChild(aliasMeta);
          } else {
            const meta = document.createElement("div");
            meta.className = "qualities-item-meta";
            meta.innerHTML = `<span>related: ${item.relatedCount}</span><span>standards: ${item.standardsCount}</span>`;
            li.appendChild(meta);
          }

          if (item.tags.length > 0) {
            li.appendChild(createTagsLine(item.tags));
          }

          list.appendChild(li);
        });

      section.appendChild(list);

      const returnTop = document.createElement("div");
      returnTop.className = "qualities-return-top";
      const returnTopLink = document.createElement("a");
      returnTopLink.href = "#top";
      returnTopLink.title = "Return to top";
      returnTopLink.innerHTML = '<i class="fa fa-arrow-up" aria-hidden="true"></i> Return to top';
      returnTop.appendChild(returnTopLink);
      section.appendChild(returnTop);

      resultsContainer.appendChild(section);
    });
  }

  function renderAll() {
    renderFacets();
    const filtered = filterItems();
    renderResults(filtered);
  }

  state.all = normalizeData(parseData());
  state.canonicalCount = state.all.filter((item) => item.kind === "canonical").length;
  state.aliasCount = state.all.filter((item) => item.kind === "alias").length;
  renderAll();
})();
