# TODO: C3A / EU Cloud Sovereignty Framework — candidate standard page(s)

**Status**: not started · **Opened**: 2026-09-05 · **Origin**: discussion on issue #455

## Where this came from

Peter Hruschka proposed a *Vendor Independence* quality as part of the nine-issue AI series (#447–#455). We declined it (#455, closed as wontfix): swapping a supplier is [replaceability](https://quality.arc42.org/qualities/replaceability), not a characteristic of its own, and lock-in is not AI-specific.

In the discussion, Wolfgang Sperling pointed out — correctly — that ISO/IEC 25010:2023 replaced *Portability* with *Flexibility*, so the issue's proposed grounding no longer exists, and that autonomy/sovereignty arguments are better grounded in:

- **C3A — Criteria enabling Cloud Computing Autonomy** (BSI): <https://www.bsi.bund.de/EN/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Empfehlungen-nach-Angriffszielen/Cloud-Computing/C3A/C3A_node.html>
- **EU Cloud Sovereignty Framework** (European Commission, announced 2026-06-01): <https://commission.europa.eu/news-and-media/news/sovereign-cloud-framework-explained-2026-06-01_en>

That is a fair point and a real gap, but a *different* one from #455 — cloud sovereignty is about jurisdiction, operational control and provider dependency at the infrastructure level, not about whether one product can stand in for another. Hence this note rather than a change to #455.

## What already shipped (PR #538, closes #455)

- `_qualities/R/replaceability.md` — overhauled: table separating replaceability / portability / interchangeability by *what moves*; correct ISO/IEC 25010:2023 placement under Flexibility; new section "Lock-in as an architectural concern" covering the model-provider case.
- `_requirements/S/swappable-llm-provider.md` — new Tier 2 example requirement.
- `_qualities/P/portability.md` — one sentence pointing at replaceability.

None of that touches sovereignty. The site's sovereignty-side qualities — [data-sovereignty](https://quality.arc42.org/qualities/data-sovereignty), [data-residency](https://quality.arc42.org/qualities/data-residency), [data-localization](https://quality.arc42.org/qualities/data-localization), [compliance](https://quality.arc42.org/qualities/compliance) — currently reference **no** sovereignty standard at all.

## Open questions before writing anything

1. **One page or two?** C3A (BSI criteria catalogue, national) and the EU Cloud Sovereignty Framework (Commission, procurement-oriented) are related but separately issued. Wolfgang frames C3A as "a specification of" the EU framework — verify that relationship from the sources before collapsing them into one page.
2. **Is the EU framework citable yet?** As of the announcement it is a framework for public-sector cloud procurement; check whether a stable, versioned document exists or only communications and press material. The sourcing rules in `write-standards` forbid guessing — if there is no retrievable normative text, write the C3A page and mention the EU framework inside it instead of giving it its own page.
3. **Which qualities link to it?** This decides whether the page gets a graph node at all — edges come from the qualities' `standards:` arrays, never from the standard page itself. A standard nothing references is invisible in the graph. Candidates: `data-sovereignty`, `data-residency`, `data-localization`, `compliance`, `auditability`, possibly `independence` and `operability`. Each addition must be justified from the standard's actual content, not from topical proximity.
4. **Does this pull a new quality after all?** If C3A's criteria turn out to be substantially about operational autonomy rather than data location, the honest conclusion might be a `cloud-sovereignty` (or `operational-sovereignty`) quality alongside `data-sovereignty`. Decide *after* reading the catalogue, not before — and apply the same bar that closed #455.

## Sketch (to be verified, not to be copied)

```yaml
---
layout: page_standard
title: "C3A — Criteria enabling Cloud Computing Autonomy"
standard_id: c3a
shortname: "C3A"
categories: [governance, security]      # or [governance, data]; check category_order
permalink: /standards/c3a
---
```

Directory: `_standards/other/c3a.md` (BSI is not ISO/EU-EN/ETSI). `standard_id: c3a` — checked, no collision with any existing quality, requirement, approach or standard slug.

Use the `write-standards` skill; its reference file is the canonical schema. Note in particular: six front-matter fields only, no `tags` / `related`, and every fact traceable to a source retrieved while writing — the BSI page above is in German for the criteria catalogue itself, so quote carefully.

## References

- Issue #455 (closed wontfix, with the full reasoning): <https://github.com/arc42/quality.arc42.org-site/issues/455>
- PR #538: <https://github.com/arc42/quality.arc42.org-site/pull/538>
- Related rejections in the same series, for the "is it really a new quality?" bar: #449, #452
