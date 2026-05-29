import { firstLetter, createTagsLine, mountExplorer } from "./letter-explorer.js";

const PREFIX = "approaches";

function normalize(rawItems) {
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
        letter: firstLetter(item.title),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

function renderItem(item, { baseUrl, tagUrl }) {
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
  const supports = document.createElement("span");
  supports.textContent = `supports: ${item.supportedCount}`;
  const tradeoffs = document.createElement("span");
  tradeoffs.textContent = `trade-offs: ${item.tradeoffsCount}`;
  meta.append(supports, tradeoffs);
  li.appendChild(meta);

  if (item.tags.length > 0) {
    li.appendChild(createTagsLine(PREFIX, item.tags, tagUrl));
  }

  return li;
}

mountExplorer({
  prefix: PREFIX,
  letterPrefix: "approach-letter",
  normalize,
  renderItem,
  resultsSummary: (visible, all) => `${visible.length} of ${all.length} approaches visible`,
  emptyText: "No solution approaches match the current filter settings.",
});
