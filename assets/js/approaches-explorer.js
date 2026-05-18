(function () {
  const root = document.getElementById("approaches-explorer");
  const dataElement = document.getElementById("approaches-explorer-data");
  if (!root || !dataElement) return;

  const baseUrl = root.dataset.baseurl || "";

  const facetsContainer = document.getElementById("approaches-facets");
  const facetsSummary = document.getElementById("approaches-facet-summary");
  const lettersContainer = document.getElementById("approaches-letter-nav");
  const lettersSummary = document.getElementById("approaches-letters-summary");
  const resultsContainer = document.getElementById("approaches-results");
  const resultsSummary = document.getElementById("approaches-results-summary");

  const state = {
    activeTags: new Set(),
    all: [],
  };

  function approachLetter(title) {
    const first = (title || "").trim().charAt(0).toUpperCase();
    return /[A-Z]/.test(first) ? first : "#";
  }

  function letterAnchorId(letter) {
    return letter === "#" ? "approach-letter-num" : `approach-letter-${letter.toLowerCase()}`;
  }

  function parseData() {
    try {
      return JSON.parse(dataElement.textContent || "[]");
    } catch (error) {
      return [];
    }
  }

  function normalizeData(rawItems) {
    return rawItems
      .filter((item) => item && item.id && item.title)
      .map((item) => {
        const tags = Array.isArray(item.tags) ? item.tags.filter(Boolean) : [];
        const supportedQualities = Array.isArray(item.supportedQualities)
          ? item.supportedQualities.filter(Boolean)
          : [];
        return {
          id: String(item.id),
          title: String(item.title),
          url: String(item.url || ""),
          tags: tags.slice().sort((a, b) => a.localeCompare(b)),
          supportedQualities,
          supportedCount: Number(item.supportedCount || supportedQualities.length || 0),
          tradeoffsCount: Number(item.tradeoffsCount || 0),
          letter: approachLetter(item.title),
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }

  function filterItems() {
    return state.all.filter((item) =>
      Array.from(state.activeTags).every((tag) => item.tags.includes(tag)),
    );
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
      button.className = `approaches-facet-chip${state.activeTags.has(tag) ? " active" : ""}`;
      button.setAttribute("aria-pressed", state.activeTags.has(tag) ? "true" : "false");

      const name = document.createElement("span");
      name.textContent = `#${tag}`;
      button.appendChild(name);

      const count = document.createElement("span");
      count.className = "approaches-count";
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
      link.className = "approaches-letter-chip";
      link.href = `#${letterAnchorId(letter)}`;

      const name = document.createElement("span");
      name.textContent = letter;
      link.appendChild(name);

      const count = document.createElement("span");
      count.className = "approaches-count";
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
    line.className = "approaches-item-tags";

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
      resultsSummary.textContent = `${items.length} of ${state.all.length} approaches visible`;
    }

    if (items.length === 0) {
      const empty = document.createElement("p");
      empty.className = "approaches-empty";
      empty.textContent = "No solution approaches match the current filter settings.";
      resultsContainer.appendChild(empty);
      return;
    }

    const letters = Array.from(groups.keys()).sort((a, b) => a.localeCompare(b));

    letters.forEach((letter) => {
      const section = document.createElement("section");
      section.className = "approaches-letter-section";

      const heading = document.createElement("h3");
      heading.className = "approaches-letter-heading";
      heading.id = letterAnchorId(letter);
      heading.textContent = `— ${letter} —`;
      section.appendChild(heading);

      const list = document.createElement("ul");
      list.className = "approaches-letter-list";

      groups
        .get(letter)
        .slice()
        .sort((a, b) => a.title.localeCompare(b.title))
        .forEach((item) => {
          const li = document.createElement("li");
          li.className = "approaches-item";

          const title = document.createElement("h4");
          title.className = "approaches-item-title";
          const titleLink = document.createElement("a");
          titleLink.href = item.url || `${baseUrl}/approaches/${encodeURIComponent(item.id)}`;
          const icon = document.createElement("i");
          icon.className = "fa fa-puzzle-piece fa-xs as-bullet";
          icon.setAttribute("aria-hidden", "true");
          titleLink.appendChild(icon);
          titleLink.appendChild(document.createTextNode(" " + item.title));
          title.appendChild(titleLink);
          li.appendChild(title);

          const meta = document.createElement("div");
          meta.className = "approaches-item-meta";
          meta.innerHTML = `<span>supports: ${item.supportedCount}</span><span>trade-offs: ${item.tradeoffsCount}</span>`;
          li.appendChild(meta);

          if (item.tags.length > 0) {
            li.appendChild(createTagsLine(item.tags));
          }

          list.appendChild(li);
        });

      section.appendChild(list);

      const returnTop = document.createElement("div");
      returnTop.className = "approaches-return-top";
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
  renderAll();
})();
