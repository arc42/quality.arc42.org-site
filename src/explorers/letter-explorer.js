// Shared engine for the letter-grouped facet explorers (qualities, approaches).
//
// These two pages were ~95% duplicated standalone IIFE scripts. The scaffold —
// dimension facets, A–Z letter navigation, letter-grouped result sections,
// "return to top" links, and the summary lines — lives here. Each page supplies
// only what actually differs via config: how to normalize its data, how to
// render a single result item, and its summary/empty copy.
//
// Element IDs and the scaffold class names are derived from `prefix`
// (e.g. "qualities" → #qualities-facets, .qualities-facet-chip).

export function firstLetter(title) {
  const first = (title || "").trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(first) ? first : "#";
}

export function letterAnchorId(letterPrefix, letter) {
  return letter === "#" ? `${letterPrefix}-num` : `${letterPrefix}-${letter.toLowerCase()}`;
}

// Build the "tags" line shared by every result item: a tag icon followed by
// comma-separated links to each tag page.
export function createTagsLine(prefix, tags, tagUrl) {
  const line = document.createElement("div");
  line.className = `${prefix}-item-tags`;

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

/**
 * Mount a letter-grouped facet explorer.
 *
 * @param {Object} config
 * @param {string} config.prefix        Element-id / class-name prefix, e.g. "qualities".
 * @param {string} config.letterPrefix  Anchor-id prefix for letter headings, e.g. "quality-letter".
 * @param {(raw: any[]) => any[]} config.normalize  Map raw JSON to items
 *        ({ id, title, url, tags: string[], letter, ... }), pre-sorted by title.
 * @param {(item: any, ctx: {baseUrl: string, tagUrl: (t: string) => string}) => HTMLElement} config.renderItem
 *        Build the <li> for one item.
 * @param {(visible: any[], all: any[]) => string} config.resultsSummary  Results-summary text.
 * @param {string} config.emptyText     Shown when no item matches the filter.
 */
export function mountExplorer(config) {
  const { prefix, letterPrefix, normalize, renderItem, resultsSummary, emptyText } = config;

  const root = document.getElementById(`${prefix}-explorer`);
  const dataElement = document.getElementById(`${prefix}-explorer-data`);
  if (!root || !dataElement) return;

  const baseUrl = root.dataset.baseurl || "";

  const facetsContainer = document.getElementById(`${prefix}-facets`);
  const facetsSummary = document.getElementById(`${prefix}-facet-summary`);
  const lettersContainer = document.getElementById(`${prefix}-letter-nav`);
  const lettersSummary = document.getElementById(`${prefix}-letters-summary`);
  const resultsContainer = document.getElementById(`${prefix}-results`);
  const resultsSummaryEl = document.getElementById(`${prefix}-results-summary`);

  const state = { activeTags: new Set(), all: [] };

  const tagUrl = (tag) => `${baseUrl}/tag-${encodeURIComponent(tag)}`;

  function parseData() {
    try {
      return JSON.parse(dataElement.textContent || "[]");
    } catch {
      return [];
    }
  }

  function filterItems() {
    return state.all.filter((item) =>
      Array.from(state.activeTags).every((tag) => item.tags.includes(tag)),
    );
  }

  function renderFacets() {
    if (!facetsContainer) return;

    const counts = new Map();
    state.all.forEach((item) => {
      item.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
    });

    const tags = Array.from(counts.keys()).sort((a, b) => a.localeCompare(b));
    facetsContainer.innerHTML = "";

    tags.forEach((tag) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `${prefix}-facet-chip${state.activeTags.has(tag) ? " active" : ""}`;
      button.dataset.tag = tag;
      button.setAttribute("aria-pressed", state.activeTags.has(tag) ? "true" : "false");

      const name = document.createElement("span");
      name.textContent = `#${tag}`;
      button.appendChild(name);

      const count = document.createElement("span");
      count.className = `${prefix}-count`;
      count.textContent = String(counts.get(tag) || 0);
      button.appendChild(count);

      button.addEventListener("click", () => {
        if (state.activeTags.has(tag)) {
          state.activeTags.delete(tag);
        } else {
          state.activeTags.add(tag);
        }
        renderAll();
        // Re-rendering replaced the button node; return focus to the same
        // facet so keyboard users keep their place.
        facetsContainer.querySelector(`[data-tag="${CSS.escape(tag)}"]`)?.focus();
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
      link.className = `${prefix}-letter-chip`;
      link.href = `#${letterAnchorId(letterPrefix, letter)}`;

      const name = document.createElement("span");
      name.textContent = letter;
      link.appendChild(name);

      const count = document.createElement("span");
      count.className = `${prefix}-count`;
      count.textContent = String(groups.get(letter).length);
      link.appendChild(count);

      lettersContainer.appendChild(link);
    });

    if (lettersSummary) {
      lettersSummary.textContent =
        letters.length > 0 ? `${letters.length} letters in current result` : "No letters";
    }
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

    if (resultsSummaryEl) {
      resultsSummaryEl.textContent = resultsSummary(items, state.all);
    }

    if (items.length === 0) {
      const empty = document.createElement("p");
      empty.className = `${prefix}-empty`;
      empty.textContent = emptyText;
      resultsContainer.appendChild(empty);
      return;
    }

    const letters = Array.from(groups.keys()).sort((a, b) => a.localeCompare(b));

    letters.forEach((letter) => {
      const section = document.createElement("section");
      section.className = `${prefix}-letter-section`;

      const heading = document.createElement("h3");
      heading.className = `${prefix}-letter-heading`;
      heading.id = letterAnchorId(letterPrefix, letter);
      heading.textContent = `— ${letter} —`;
      section.appendChild(heading);

      const list = document.createElement("ul");
      list.className = `${prefix}-letter-list`;

      groups
        .get(letter)
        .slice()
        .sort((a, b) => a.title.localeCompare(b.title))
        .forEach((item) => list.appendChild(renderItem(item, { baseUrl, tagUrl })));

      section.appendChild(list);

      const returnTop = document.createElement("div");
      returnTop.className = `${prefix}-return-top`;
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
    renderResults(filterItems());
  }

  state.all = normalize(parseData());
  renderAll();
}
