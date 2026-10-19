// Ranking for the "Add a quality" search on /map/. Pure: takes the entries of
// assets/data/search-lookup.json and a query. Mirrors the header typeahead's
// approach (title/alias prefix and word matching, no stemming).

const MIN_QUERY = 2;

const words = (s) => s.split(/[\s\-_/]+/).filter(Boolean);

function tierOf(title, aliases, query, terms) {
  const t = title.toLowerCase();
  const lower = aliases.map((a) => a.toLowerCase());
  const prefixedBy = (list, term) => list.findIndex((a) => a.startsWith(term));
  const wordHit = (list) =>
    terms.every((term) => list.some((text) => words(text).some((w) => w.startsWith(term))));

  if (t === query) return { tier: 0, via: null };
  let i = lower.indexOf(query);
  if (i >= 0) return { tier: 0, via: aliases[i] };
  if (t.startsWith(query)) return { tier: 1, via: null };
  i = prefixedBy(lower, query);
  if (i >= 0) return { tier: 2, via: aliases[i] };
  if (wordHit([t])) return { tier: 3, via: null };
  if (terms.every((term) => lower.some((a) => words(a).some((w) => w.startsWith(term))))) {
    const hit = aliases.findIndex((a) => wordHit([a.toLowerCase()]));
    return { tier: 4, via: hit >= 0 ? aliases[hit] : aliases[0] };
  }
  return null;
}

export function rankQualities(entries, query, { limit = 8 } = {}) {
  const q = String(query ?? "")
    .trim()
    .toLowerCase();
  if (q.length < MIN_QUERY) return [];
  const terms = q.split(/\s+/);

  const scored = [];
  for (const entry of entries) {
    if (entry.type !== "quality") continue;
    const aliases = (entry.aliasList ?? []).map(String);
    const match = tierOf(entry.title ?? "", aliases, q, terms);
    if (!match) continue;
    scored.push({
      tier: match.tier,
      hit: {
        id: entry.url.split("/").filter(Boolean).pop(),
        title: entry.title,
        url: entry.url,
        via: match.via,
      },
    });
  }
  scored.sort(
    (a, b) =>
      a.tier - b.tier ||
      a.hit.title.length - b.hit.title.length ||
      a.hit.title.localeCompare(b.hit.title),
  );
  return scored.slice(0, limit).map((s) => s.hit);
}
