# Standard Page Template

This file is the **canonical, self-contained spec** for pages in `_standards/`: front-matter schema, body structure, quality-attributes table format, sourcing rules, and the definition of done. The `write-standards` skill's `SKILL.md` drives the _procedure_; everything about _what a good standard page contains_ lives here. Apply these rules to generated and handwritten pages alike.

## Output

One Markdown file: YAML front matter delimited by `---`, then the body. No preamble, no postscript.

## Required Front Matter

```yaml
---
layout: page_standard
title: "ISO/IEC 25010 - Systems and Software Quality"
standard_id: iso25010
shortname: "ISO/IEC 25010"
categories: [general]
permalink: /standards/iso-25010
summary: "The SQuaRE product quality model defining nine characteristics, from functional suitability and performance to security, maintainability, and safety."
---
```

These seven fields are the complete schema — standards have no `tags`, no `aka`, no `related`. (One legacy page carries an `alias:` field; nothing consumes it — do not add it to new pages.)

## Front-Matter Rules

- `title`:
  - Full official title, quoted. Pattern: `"<Shortname> — <official subject>"` (e.g. `"DICOM — Digital Imaging and Communications in Medicine"`).
- `standard_id` — **the cross-reference key**:
  - Lowercase, no spaces, no slashes, no hyphens: `iso25010`, `en301549`, `nist80053`, `pcidss`. (Legacy exception: `misra-c` keeps its hyphen — never rename an existing `standard_id`; every quality that references it would silently lose the edge.)
  - Qualities reference it (case-insensitively) in their `standards:` front-matter arrays. Those arrays — not anything on the standard page itself — generate the standard's graph node, all its edges, and the "Related Qualities" list the `page_standard` layout renders. **A standard no quality references has no graph node at all.**
  - The `standard_id` doubles as the graph node ID, and qualities, requirements, approaches, and standards share one node namespace. It must be unique among standards **and** must not equal any quality, requirement, or approach slug.
- `shortname`:
  - Short display name used in category listings and chips: `"ISO/IEC 25010"`, `"DICOM"`, `"EU CRA"`.
- `categories`:
  - 1–3 values from the canonical taxonomy — the `category_order` list in `_pages/40-quality-standards.md` (13 values as of 2026-07: general, accessibility, usability, ai, trustworthiness, safety, security, privacy, data, governance, sector, coding, documentation). **Derive the list from that file; do not trust this snapshot.**
  - A value outside the list still renders as a chip (there is a capitalize fallback) but the standard gets **no section** on the `/standards/` overview page — a silent placement failure, not a build error.
- `permalink`:
  - `/standards/<kebab-slug>`, unique, stable. Filename ≈ slug. The subdirectory under `_standards/` does not affect the URL.
- `summary`:
  - One sentence, quoted, **under 165 characters** — what the standard is and what it defines. It is the card text on `/standards/explorer/`, the chip tooltip on `/standards/`, and part of the explorer's search text.
  - Omitting it is not a build error and is easy to miss locally: both includes fall back to `page.excerpt`, which begins at the body's first `##` heading and runs it into the following sentence with no space, then truncates mid-word. Write the sentence rather than accept that fallback.

## Directory Placement

Pick the subdirectory by issuing body; when in doubt, follow the filename precedent of similar existing files:

| Subdirectory               | Issuing body                                                 | Examples                       |
| -------------------------- | ------------------------------------------------------------ | ------------------------------ |
| `_standards/iso/`          | ISO (incl. many ISO/IEC, legacy split)                       | `iso-25010.md`, `iso-27001.md` |
| `_standards/iso-iec/`      | ISO/IEC JTC 1                                                | `iso-iec-22989.md`             |
| `_standards/iso-iec-ieee/` | joint ISO/IEC/IEEE                                           | `iso-iec-ieee-12207.md`        |
| `_standards/iec-ieee/`     | IEC or IEEE alone                                            | `iec-62443.md`, `ieee-2857.md` |
| `_standards/eu-en-etsi/`   | EU regulation, EN, ETSI                                      | `gdpr.md`, `en-301-549.md`     |
| `_standards/other/`        | everything else (NIST, OWASP, PCI, consortia, sector bodies) | `dicom.md`, `nist-800-53.md`   |

The `iso/` vs `iso-iec/` split is fuzzy legacy — several ISO/IEC standards live in `iso/`. Match the existing naming style rather than relitigating it.

## Sourcing Rules — accuracy is paramount

Every fact (version number, publication year, clause number, scope claim, issuing body) must be traceable to a source actually retrieved during writing. If a fact cannot be verified, say so explicitly in the draft hand-off — never guess or interpolate. Author-supplied source notes (e.g. `TODO/standards/*_Beschreibung.md`) are input material, not verification: facts in them still need a checked source.

Source priority:

1. The issuing body's official page (ISO, IEC, ETSI, NIST, W3C, NEMA, …)
2. The standard's own abstract or preview (iso.org, iec.ch, …)
3. Official guidance or peer-reviewed material
4. Well-known practitioner references (OWASP, SEI, …)

Wikipedia, blog posts, and vendor marketing are not primary sources.

**iso.org gotcha:** catalogue URLs (`…/standard/NNNNN.html`) are per-edition and unstable. Past audits found links that 404, point at withdrawn editions, or land on entirely different topics (an "ISO 42010" link once resolved to a licorice standard). Open every URL and confirm title **and** year on the target page before citing it. `npm run test:links` does not check external URLs.

## Body Structure

The page H1 is the front-matter `title` (rendered by the header include), so the body starts at `##`; `###` subsections are fine.

1. **Opening section (required):** `## <Shortname>: <concise subject>` followed by a 2–4 sentence introduction: issuing body, current version and publication year, and one sentence on what problem the standard solves. Cross-link sibling standards in the collection where the relationship is real (e.g. DICOM ↔ [HL7](/standards/hl7) ↔ [IHE](/standards/ihe)).
   - Optional `### Evolution` subsection when at least 3 major versions exist.
2. **Optional middle sections**, in whatever subset fits the standard: `## Scope and Coverage`, `## Structure and Key Concepts` (explain what each part _requires_, not just its title), `## Relationship to Other Standards` (only cross-link standards that exist in this collection).
3. **`## Quality Attributes Addressed` (required)** — table, format below. Legacy pages use variant headings ("Required or Emphasized", "Addressed or Influenced"); do not propagate them, and do not mass-rename existing pages.
4. **`## References` (required, last)** — format below. Legacy variant "Authoritative Sources" — do not propagate.

Depth follows the standard's relevance to software architects: a compact profile (like `dicom.md`) is ~300–500 body words; a regulation architects must comply with in detail (like `en-301-549.md`) justifies a clause-by-clause walkthrough. Don't pad the former to look like the latter.

## Quality Attributes Table

```markdown
| Attribute                                 | How <SHORTNAME> addresses it                                    |
| :---------------------------------------- | :-------------------------------------------------------------- |
| **[Reliability](/qualities/reliability)** | One sentence naming the concrete mechanism, clause, or profile. |
```

- Link only qualities that exist under `/qualities/<slug>` — derive the slug list from the content tree (procedure step in `SKILL.md`); never coin slugs. A dead link 404s; nothing validates the body direction.
- Combine 2–3 qualities in one row with `/` only when a single sentence genuinely covers them all.
- **Bidirectionality rule:** every quality linked in this table must carry the `standard_id` in its own `standards:` front-matter array (append at the end of the array). The table is prose; the front-matter array is the mechanism — it alone creates the graph edges and the standard page's "Related Qualities" list. A table row without the backlink is a dangling claim the reader can see but the graph cannot.
- The reverse asymmetry is acceptable: a quality may list the standard without appearing in the table (frontmatter edges need no table row).

## References Section

```markdown
## References

### Official Sources

- [«Standard title» — «Issuing body»](«url»)

### Related Standards and Guidance

- [«Title»](«url»)
```

Official sources first; further `###` subsections (`### Further Reading`, domain-specific groupings) as needed. Every URL verified per the sourcing rules. No vendor or product documentation links — they rot and imply endorsement.

## Voice

Same voice rules as approaches — see "Voice and Language" in `.claude/skills/write-approach/reference/approaches-template.md` (active voice, concrete over abstract, no marketing adjectives, no AI tics). Two standards-specific additions:

- **Descriptive, not prescriptive.** The page reports what the standard defines and requires; it does not advise the reader to adopt it.
- **Calibrated claims.** "Widely used" needs the same sourcing as a version number. Prefer the checkable ("used by imaging modalities, PACS, and viewers") over the promotional ("the industry-leading standard").

## Formatting

Run `npx prettier --write` on the finished file. Prettier aligns table pipes to the widest cell; hand-padded tables drift from that style. No CI enforces this — it is a convention, kept so diffs stay clean when anyone else runs Prettier.

## Definition of Done (Single Page)

- Front matter has exactly the seven schema fields, `summary` included; `standard_id` follows the convention, is unique, and collides with no quality/requirement/approach slug.
- `categories` ⊆ the canonical taxonomy derived from `_pages/40-quality-standards.md`.
- Every quality link in the table resolves to an existing `/qualities/<slug>` page.
- Every quality in the table has the `standard_id` in its `standards:` array (bidirectionality rule) — verified mechanically, not by eye.
- Every reference URL was fetched and confirmed to match topic and version.
- No factual claim (version, year, clause, scope) is unverified.
- `npx prettier --check` passes on the file; `npm run test:links` reports zero errors.
- Hand-off (the skill does **not** do these): restart Docker so graph data regenerates; confirm the "Related Qualities" list on the rendered page matches the table; stage files explicitly by name; commit `content: add <shortname> standard`.
