# Narratives - arc42 Quality Model Decision Graph

## 1. Site Foundation & Content Organization (2022-2025)
The central recurring question: how to organize quality attributes in Jekyll?

- 747c706 (2022): first (pre-alpha) version with CNAME and jekyll-config
- c55adbb (2022): fixed collection and tags for qualities, default layout now working
- 86502f7 (2022): migrated to posts, as tags don't work properly in collections
- a163dce (2022): tags working, but not looking good
- 7fe4437 (2022): page per top-level quality
- a8d514a (2025-07-17): first try in making qualities a collection (again)
- bbc675b (2025-07-18): more migrating qualities to collections
- d834d96 (2025-07-18): more transition to collections
- 57551fd (2025-07-13): moved requirements to category instead of blog-posts
- 042ec90 (2025): Fix search functionality - now works across all collections
- abf9dbf (2025): Fix homepage tag counts to use correct collections
- 0e2fea9 (2026-02-06): Fix requirements counter to use Jekyll collections instead of posts

Lifecycle:
- qualities: started as collection (2022), moved to posts due to tag issues, moved BACK to collection (2025)
- requirements: started as posts/categories, moved to collection (2025)
- tags/properties: persistent concept throughout, renamed to "dimensions" (2026-02)

## 2. Interactive Graph Visualization (2025)
The biggest technical evolution: from static quality lists to interactive D3.js force-directed graphs.

- 38bfc5a (2025-05-31): Arc42 Quality Graphs - Patched from Yadullah Duman's fork. Initial sigma.js attempt, then pivoted to D3.js with graphology. Added data generation from frontmatter.
- a99e7b9 - ba5fec8 - 5172f85 - d724b12 (2025-06-01): Arc42 Quality Graphs - iterating on layout
- e7c651a (2025-06-06): Arc42 Quality Graphs - d3
- a4e2337 - 8297ce1 (2025-07-04): Further D3 iterations
- f736741 - 1384b91 (2025-07-12-13): D3 graph refinement #173
- 4bcf3de (2024): add (drafty!) interactive graph (early experiment, before the D3 rewrite)
- 48df150 (2025-07-16): Fix graph not visible in production by integrating data generation into build process
- 4f78f31 (2025-08-25): Graph Colors - Adjusted colors to new scheme
- ec1154a - a89d841 - 5a5f3c4 - 98a14c0 (2025-08-31): Graph Node Toggles - filtering and displaying nodes
- e5db2b4 (2025-09-25): Complete categorized standards implementation
- ccd74ed (2025-09-26): Revert - categorized standards reverted
- 55ad39e - 41032f4 (2025-09-27 to 10-07): Graph Node Standards - many iterations adding standards to graph
- a41a5ad: Merge branch feature/graph-standards
- 027e05e (2025-11-25): feat: add graph tooltip hover for synonym display
- 0767165 (2025-11-25): feat: add synonym-aware graph data generation
- 1f5f604 (2025-12-03): Graph Filtering
- f9075d3 (2025-12-21): Simplify and restructure code, fix standard selection reload
- 7c577e8 (2025-12-21): Add "Center View" button and improve zooming
- cce0113 (2026-02-17): highlight nodes that match filter criteria

## 3. Requirements Structure & Standardization (2023-2025)
How to structure quality requirements consistently?

- 9c2c456 (2024-07-20): add scenario template
- 058b9c2 (2024-08-19): propose simplified scenario template
- 0a4d51a - 7d4d315 - 4cbfe6c (2024): converting scenarios to pattern form
- 882fae4 (2025-08-10): Standardize subsection heading level to #### across _requirements
- 9d5b88b (2025-08-10): Fix #169: replace bold labels with headings
- 3c398d3 (2025-11): docs: add comprehensive requirements unification plan (Tier 1/Tier 2 system)
- da9900a - many (2025-11-29/30): Batch standardization of ~100+ requirements to Tier 1/Tier 2
- c24d758 (2025-12-02): content: merge requirements template into quality requirements article

## 4. Standards Integration (2025)
Adding industry standards as a first-class content type.

- a605432 (2025): add some standards (still DRAFT)
- bcabbee (2025): add standards page
- a8d514a (2025-07-17): first try making qualities a collection (related to standards work)
- 87e6909 (2025-07-27): add CIA triad information to iso-27001
- 5023577 - a458085 (2025-08-15): ISO-26262 automotive safety
- 5e6d874 (2025-08-18): IEC-61508 functional safety
- 135cece (2025-08-22): add misra-c standard
- fde1f82 (2025-08-22): add NIST 800 standard
- c8656b3 (2025): add SOC2
- 6331b4e (2025): add NIST AI RMF 1.0
- fbe230c (2025): add NIST Privacy Framework
- d62cc94 (2025): add IEEE 7000-2021 on ethical system design
- 551f834 (2025): add ISO-8000 (data quality)
- f42950e (2025): add ISO 25012
- 71ab1aa (2025-11-27): add WCAG 2.2 accessibility standard
- c348119 (2025-11-27): add EN 301 549 European accessibility standard
- C292338 (2025): add ETSI EN 304 223 AI cybersecurity standard
- 2ba0ee4 (2026-02-07): add ISO 25019, updated colors

## 5. Color Scheme & Visual Identity (2025-2026)
Establishing a consistent visual identity for different content types.

- b66aee2 (2025-09-17): added proposal for new color scheme
- 47d7e1f (2025-09-22): updated color scheme
- 8eb85de (2025-09-22): Change requirements color from green to red
- 10c9d7e (2025-09-22): updated new colour scheme on metamodel
- 4f78f31 (2025-08-25): Graph Colors - Adjusted to new scheme
- 7bcb6de (2026-02-23): updated colour schema to be better WCAG compliant
- 8f4a6ff (2026-02-24): documentation of colour schema

## 6. Domain Language Evolution (2026)
Renaming properties → dimensions, refining terminology.

- 2b1a37a (2026-02-10): renamed properties to dimensions, fixing #314
- e326516 (2026-02-10): fixing several sub-issues of #312 (update domain language)
- 952b61c (2026-02-12): change metamodel to domain-language
- cbb9605 (2026-02-12): #337, initial change of dimensions flexible maintainable
- f76ccd1 (2026-02-24): styling of dimension subpages, better contrast

## 7. Approaches Content Type (2026)
Adding a new content type for solution approaches.

- 6aeafd7 (2025-10-08): how the approaches-properties-qualities graph might look like
- 96022d4 (2026-02-07): unified some includes, added approach as new category
- e4f11bf - f986f62 - 4ae4d20 - 9f123fe (2026-02-25): add Progressive Disclosure, Responsive Design, Plugin Architecture, Feature Toggles
- 8f561fb - ee768f1 - 0ac627f (2026-02-26): Mermaid rendering attempts, then replaced with verbal descriptions
- 19cc98d - 3b9af29 (2026-02-26): approaches-template
- 1bf9827 (2026-02-28): add approaches-explorer, add approaches to header
- b64a385 (2026-02-28): update approaches start page
- 8da4d75 (2026-03-01): updated standards and approaches explorer page

## 8. WCAG Compliance & Testing (2026)
Adding automated accessibility testing.

- b344c8b (2026-02-23): add playwright tests
- 5354c5d (2026-02-23): added wcag test
- 4406a28 (2026-02-23): fix: add missing alt attributes to images
- 1d80d89 (2026-02-24): add wcag test
- ebd5583 (2026-02-24): ui improvements, add wcag score to navbar
- 981b278 (2026-02-24): upgraded playwright container
- 5fd9953 (2026-02-24): feat: make wcag-report full width

## Cross-Narrative Connections
- Narrative 1 (Collections) directly enabled Narrative 2 (Graphs) - collections provide the frontmatter that generates graph data
- Narrative 4 (Standards) fed into Narrative 2 (Graph) - standards became graph nodes
- Narrative 5 (Colors) affected both Narrative 2 (Graph colors) and Narrative 8 (WCAG)
- Narrative 6 (Domain Language) renamed concepts used throughout all other narratives
- Narrative 7 (Approaches) builds on the pattern established by narratives 1 and 4
