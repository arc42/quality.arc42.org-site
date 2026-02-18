# Prompt Template — Adding a New Quality Standard

Replace every `{{standard}}` placeholder with the actual standard identifier
(e.g., `iso-24028`) before submitting this prompt.

---

## Instructions

I maintain a Jekyll-based quality knowledge base at quality.arc42.org.
I want to add a new page for the standard **{{standard}}** to the collection.

The existing standard pages I consider the best reference for tone, depth, and structure are:
- `_standards/en-301-549.md` — **use this as the primary style reference**
- `_standards/iso-25010.md` — secondary reference for the quality-attributes table format

**Accuracy is paramount.** Every fact (version number, publication year, clause number,
scope claim, issuing body) must be traceable to a source you actually retrieved.
If you cannot verify a fact, say so explicitly — do not guess or interpolate.

---

## Workflow

### 1. Create a new branch

Use the naming pattern: `add-{{standard}}`
Example: `add-iso-24028`

### 2. Read the reference files

Read both reference files in full before writing anything:
- `_standards/en-301-549.md`
- `_standards/iso-25010.md`

Mirror their section structure, heading depth, table format, and internal linking style.

### 3. Research the standard

Fetch and read authoritative sources. Prefer in this order:
1. The issuing body's official page (ISO, IEC, ETSI, NIST, W3C, …)
2. The standard's own abstract or preview on iso.org / iec.ch
3. Peer-reviewed or official guidance documents
4. Well-known practitioner references (OWASP, SEI, …)

Do **not** use Wikipedia, blog posts, or vendor marketing as primary sources.
Collect the URLs of every source you use — you will need them for the References section.

### 4. Write the standard page

Create the file at: `_standards/{{standard}}.md`

The file **must** begin with this exact frontmatter block (fill in all fields):

```yaml
---
layout: page_standard
title: "«Full official title of the standard»"
standard_id: «lowercase, no hyphens, no spaces — e.g. iso24028, en301549»
shortname: "«Short human-readable name — e.g. ISO/IEC 24028»"
categories: [«one or more from: general, security, usability, safety, reliability, ai, accessibility, data»]
permalink: /standards/{{standard}}
---
```

**`standard_id` convention**: always lowercase, remove all spaces, hyphens, and slashes.
Examples: `iso25010`, `en301549`, `iso27001`, `pcidss`.
This ID is used in `_qualities/` frontmatter to create graph edges — get it right.

The page body must contain these sections in this order:

```
## «Standard title»

[2–4 sentence introduction: issuing body, current version, publication year,
 and one-sentence statement of what problem the standard solves.]

### Evolution / Version History  (omit if fewer than 3 versions exist)

[Bullet list of major versions with year and key change]

## Scope and Coverage

[What systems, domains, or artefacts does the standard apply to?
 Use a table if the standard covers multiple distinct areas — see EN 301 549 Clause table.]

## Structure and Key Concepts / Clauses

[Walk through the most important clauses or parts. Use named subsections.
 Explain *what* each part requires, not just its title.]

## Relationship to Other Standards  (omit if no significant overlap)

[Cross-link to any existing standards pages in this collection that overlap.]

## Quality Attributes Addressed

[Table — see format requirements below.]

## References

[Subsections — see format requirements below.]
```

#### Quality attributes table format

Use this exact table structure. Link every quality name to its page.
Only include qualities that exist in this collection at `/qualities/<slug>`.
Do not invent quality names — use the slugs from the existing `_qualities/` directory.

```markdown
| Quality Attribute | Relevance in {{standard}} |
|:--- |:--- |
| **[Reliability](/qualities/reliability)** | … one sentence on how/why this standard addresses it … |
| **[Security](/qualities/security)** | … |
```

#### References section format

Organise into subsections by source type. Use markdown links with descriptive labels.
Verify every URL resolves before including it.

```markdown
## References

### Official Sources
- [«Standard title» — «Issuing body»](«url»)

### Related Standards and Guidance
- [«Title»](«url»)

### Further Reading
- [«Title»](«url»)
```

### 5. Extract quality attributes

Create the file: `TODO/standards/{{standard}}-attributes.md`

List every quality attribute addressed directly or indirectly by **{{standard}}**.
For each attribute, state:
- The attribute name (as it appears in this collection, or flagged as "not yet in collection")
- Whether the standard addresses it directly (normative requirement) or indirectly (guidance/informative)
- One sentence explaining the connection

Format:
```markdown
# Quality Attributes for {{standard}}

| Attribute | Coverage | Connection |
|:----------|:---------|:-----------|
| reliability | direct | Clause X requires … |
| availability | indirect | Annex Y recommends … |
```

### 6. Update existing quality pages

For each quality attribute in the table above that already exists in `_qualities/`,
add the new `standard_id` to its `standards:` frontmatter array if not already present.

Example — add `iso24028` to `_qualities/R/reliability.md`:
```yaml
standards: [iso25010, iso24028]
```

This step creates the graph edges between the new standard and existing quality nodes.
Run `npm run test:links` after making these changes to verify no broken references.

### 7. Verify the result

Before finishing:
- [ ] Frontmatter is complete and `standard_id` follows the lowercase-no-hyphens convention
- [ ] Every quality name in the table links to an existing `/qualities/<slug>` page
- [ ] Every URL in the References section was actually fetched and resolves
- [ ] No factual claim (version, year, clause, scope) is unverified
- [ ] `npm run test:links` reports zero errors

---

*Template version: 2026-02-18 — quality.arc42.org*
