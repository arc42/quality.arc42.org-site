import { firstLetter, createTagsLine, mountExplorer } from "./letter-explorer.js";

const PREFIX = "qualities";

// Each canonical quality expands into one canonical item plus one item per
// alias, so aliases are independently searchable and letter-grouped.
function normalize(rawItems) {
  const normalized = [];

  rawItems
    .filter((item) => item && item.id && item.title)
    .forEach((item) => {
      const tags = Array.isArray(item.tags) ? item.tags.filter(Boolean) : [];
      const sortedTags = tags.slice().sort((a, b) => a.localeCompare(b));
      const aliases = Array.isArray(item.aliases)
        ? item.aliases.filter((alias) => alias && alias.title)
        : [];

      normalized.push({
        id: String(item.id),
        title: String(item.title),
        url: String(item.url || ""),
        tags: sortedTags,
        aliases: aliases.slice().sort((a, b) => a.title.localeCompare(b.title)),
        relatedCount: Number(item.relatedCount || 0),
        standardsCount: Number(item.standardsCount || 0),
        letter: firstLetter(item.title),
        kind: "canonical",
        canonicalId: String(item.id),
        canonicalTitle: String(item.title),
        canonicalUrl: String(item.url || ""),
      });

      aliases.forEach((alias) => {
        const aliasTitle = String(alias.title || "");
        normalized.push({
          id: String(alias.id || ""),
          title: aliasTitle,
          url: String(alias.url || ""),
          tags: sortedTags,
          aliases: [],
          relatedCount: Number(item.relatedCount || 0),
          standardsCount: Number(item.standardsCount || 0),
          letter: firstLetter(aliasTitle),
          kind: "alias",
          canonicalId: String(item.id),
          canonicalTitle: String(item.title),
          canonicalUrl: String(item.url || ""),
        });
      });
    });

  return normalized.sort((a, b) => a.title.localeCompare(b.title));
}

function renderItem(item, { baseUrl, tagUrl }) {
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
    const related = document.createElement("span");
    related.textContent = `related: ${item.relatedCount}`;
    const standards = document.createElement("span");
    standards.textContent = `standards: ${item.standardsCount}`;
    meta.append(related, standards);
    li.appendChild(meta);
  }

  if (item.tags.length > 0) {
    li.appendChild(createTagsLine(PREFIX, item.tags, tagUrl));
  }

  return li;
}

function resultsSummary(visible, all) {
  const canonicalCount = all.filter((i) => i.kind === "canonical").length;
  const aliasCount = all.filter((i) => i.kind === "alias").length;
  const canonicalVisible = visible.filter((i) => i.kind === "canonical").length;
  const aliasesVisible = visible.filter((i) => i.kind === "alias").length;
  return `${visible.length} of ${all.length} terms visible (${canonicalVisible}/${canonicalCount} canonical, ${aliasesVisible}/${aliasCount} aliases)`;
}

mountExplorer({
  prefix: PREFIX,
  letterPrefix: "quality-letter",
  normalize,
  renderItem,
  resultsSummary,
  emptyText: "No quality characteristics match the current search/filter settings.",
});
