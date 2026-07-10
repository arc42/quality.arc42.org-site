import { firstLetter, createTagsLine, mountExplorer } from "./letter-explorer.js";

const PREFIX = "requirements";

// Requirements have no aliases; every item is canonical. Titles are short
// sentences ("Access control is enforced"), so letter grouping uses the
// sentence's first letter — same rule as the other explorers.
function normalize(rawItems) {
  return rawItems
    .filter((item) => item && item.id && item.title)
    .map((item) => {
      const tags = Array.isArray(item.tags) ? item.tags.filter(Boolean) : [];
      return {
        id: String(item.id),
        title: String(item.title),
        url: String(item.url || ""),
        tags: tags.slice().sort((a, b) => a.localeCompare(b)),
        relatedCount: Number(item.relatedCount || 0),
        letter: firstLetter(item.title),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

function renderItem(item, { baseUrl, tagUrl }) {
  const li = document.createElement("li");
  li.className = "ix-item";

  const title = document.createElement("h4");
  title.className = "ix-item-title";
  const titleLink = document.createElement("a");
  titleLink.href = item.url || `${baseUrl}/requirements/${encodeURIComponent(item.id)}`;
  titleLink.textContent = item.title;
  title.appendChild(titleLink);
  li.appendChild(title);

  const meta = document.createElement("div");
  meta.className = "ix-item-meta";
  const related = document.createElement("span");
  related.textContent = `related: ${item.relatedCount}`;
  meta.append(related);
  li.appendChild(meta);

  if (item.tags.length > 0) {
    li.appendChild(createTagsLine(item.tags, tagUrl));
  }

  return li;
}

function resultsSummary(visible, all) {
  return `${visible.length} of ${all.length} requirements visible`;
}

mountExplorer({
  prefix: PREFIX,
  letterPrefix: "requirement-letter",
  normalize,
  renderItem,
  resultsSummary,
  emptyText: "No requirements match the current filter settings.",
});
