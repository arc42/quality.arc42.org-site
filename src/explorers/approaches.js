import { firstLetter, createTagsLine, mountExplorer } from "./letter-explorer.js";

const PREFIX = "approaches";

function normalize(rawItems) {
  const normalized = [];

  rawItems
    .filter((item) => item && item.id && item.title)
    .forEach((item) => {
      const tags = Array.isArray(item.tags) ? item.tags.filter(Boolean) : [];
      const sortedTags = tags.slice().sort((a, b) => a.localeCompare(b));
      const aliases = Array.isArray(item.aliases)
        ? item.aliases.map((a) => String(a || "").trim()).filter(Boolean)
        : [];

      const canonicalId = String(item.id);
      const canonicalTitle = String(item.title);
      const canonicalUrl = String(item.url || "");
      const supportedCount = Number(item.supportedCount || 0);
      const tradeoffsCount = Number(item.tradeoffsCount || 0);

      normalized.push({
        id: canonicalId,
        title: canonicalTitle,
        url: canonicalUrl,
        tags: sortedTags,
        supportedCount,
        tradeoffsCount,
        letter: firstLetter(canonicalTitle),
        kind: "canonical",
        canonicalId,
        canonicalTitle,
        canonicalUrl,
      });

      aliases
        .slice()
        .sort((a, b) => a.localeCompare(b))
        .forEach((aliasTitle) => {
          normalized.push({
            id: canonicalId,
            title: aliasTitle,
            url: canonicalUrl, // alias has no own URL -> points at canonical
            tags: sortedTags,
            supportedCount,
            tradeoffsCount,
            letter: firstLetter(aliasTitle),
            kind: "alias",
            canonicalId,
            canonicalTitle,
            canonicalUrl,
          });
        });
    });

  return normalized.sort((a, b) => a.title.localeCompare(b.title));
}

function renderItem(item, { baseUrl, tagUrl }) {
  const li = document.createElement("li");
  li.className = "approaches-item";
  if (item.kind === "alias") li.classList.add("is-alias");

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

  if (item.kind === "alias") {
    const aliasMeta = document.createElement("div");
    aliasMeta.className = "approaches-alias-meta";
    const label = document.createElement("span");
    label.className = "approaches-alias-label";
    label.textContent = "alias";
    aliasMeta.appendChild(label);
    aliasMeta.appendChild(document.createTextNode(" of "));
    const canonicalLink = document.createElement("a");
    canonicalLink.href =
      item.canonicalUrl || `${baseUrl}/approaches/${encodeURIComponent(item.canonicalId)}`;
    canonicalLink.textContent = item.canonicalTitle;
    aliasMeta.appendChild(canonicalLink);
    li.appendChild(aliasMeta);
  } else {
    const meta = document.createElement("div");
    meta.className = "approaches-item-meta";
    const supports = document.createElement("span");
    supports.textContent = `supports: ${item.supportedCount}`;
    const tradeoffs = document.createElement("span");
    tradeoffs.textContent = `trade-offs: ${item.tradeoffsCount}`;
    meta.append(supports, tradeoffs);
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
  return `${visible.length} of ${all.length} terms visible (${canonicalVisible}/${canonicalCount} approaches, ${aliasesVisible}/${aliasCount} aliases)`;
}

mountExplorer({
  prefix: PREFIX,
  letterPrefix: "approach-letter",
  normalize,
  renderItem,
  resultsSummary,
  emptyText: "No solution approaches match the current filter settings.",
});
