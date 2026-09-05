import lunr from "lunr";

// Keep identifiers and prefixes intact: English stemming would index "privacy"
// as "privaci", preventing a typed prefix such as "privac" from matching.
export function normalizeSearch(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function createStandardsSearch(documents) {
  const fields = {
    id: 12,
    shortname: 12,
    title: 8,
    organization: 5,
    summary: 3,
    categories: 1,
    body: 1,
  };
  const byId = new Map(documents.map((document) => [document.id, document]));
  const index = lunr(function () {
    this.ref("ref");
    this.pipeline.reset();
    this.searchPipeline.reset();
    for (const [field, boost] of Object.entries(fields)) this.field(field, { boost });
    for (const document of documents) {
      this.add({
        ref: document.id,
        ...Object.fromEntries(
          Object.keys(fields).map((field) => [field, normalizeSearch(document[field])]),
        ),
      });
    }
  });

  return (input) => {
    const query = normalizeSearch(input);
    if (!query) return null;
    const terms = query.split(" ");
    const results = index.query((builder) => {
      terms.forEach((term, position) => {
        builder.term(term, {
          presence: lunr.Query.presence.REQUIRED,
          wildcard:
            position === terms.length - 1 ? lunr.Query.wildcard.TRAILING : lunr.Query.wildcard.NONE,
          usePipeline: false,
        });
      });
    });
    const exact = (document) =>
      [document.id, document.shortname].some((value) => normalizeSearch(value) === query);
    results.sort((a, b) => {
      const left = byId.get(a.ref);
      const right = byId.get(b.ref);
      return (
        Number(exact(right)) - Number(exact(left)) ||
        b.score - a.score ||
        left.shortname.localeCompare(right.shortname) ||
        left.id.localeCompare(right.id)
      );
    });
    return results.map((result) => result.ref);
  };
}

// The template contains rendered prose, not URLs or Markdown syntax. Reference
// sections are excluded so citing a standard does not make a page match it.
export function descriptiveText(template) {
  if (!template) return "";
  const parts = [];
  for (const node of template.content.childNodes) {
    if (
      /^H[1-6]$/.test(node.nodeName) &&
      /^(references\b|authoritative sources\b|official sources\b|further reading\b)/i.test(
        node.textContent.trim(),
      )
    )
      break;
    parts.push(node.textContent);
  }
  return parts.join(" ");
}
