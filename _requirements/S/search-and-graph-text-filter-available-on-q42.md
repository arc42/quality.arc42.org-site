---
title: "Search and graph text filter available on Q42"
tags: [usable, suitable]
related: [functionality, functional-appropriateness, interaction-capability, discoverability]
permalink: /requirements/search-and-graph-text-filter-available-on-q42
---

<div class="quality-requirement" markdown="1">

#### Context
quality.arc42.org is a public software-architecture reference website with an interactive visual graph that software architects use to explore quality characteristics, related requirements, standards, and solution approaches. For these users, the characteristic `Functionality` matters because the site must provide working search and graph filtering so relevant content can be found quickly. Assumption: no external benchmark exists for this niche reference site, so the thresholds below are conservative release thresholds verified by the team.

#### Trigger
A software architect searches for `Functionality` or uses the graph text filter to locate related content.

#### Acceptance Criteria
- In a JavaScript-enabled browser, the site search returns the `Functionality` page within the first **5 results** for at least **95%** of **20 reference queries**, with p95 result rendering time of at most **2.0 s** per query; source: scripted UI regression suite; evaluation horizon: every release candidate.
- In a JavaScript-enabled browser, the graph text filter updates the visible result set for at least **95%** of **15 reference filter terms** within **1.5 s** per term on the full production-content dataset; source: graph interaction test harness; evaluation horizon: every release candidate.
- In a non-JavaScript browser, reduced functionality is acceptable: at least **95%** of **20 reference journeys** reach the `Functionality` page through static navigation within **4 interactions**, **0** graph text filter controls are presented as usable, and any failed threshold blocks the release within **5 min** of the no-JS regression suite finishing; source: no-JS test report and release-gate log; evaluation horizon: every release candidate.

#### Monitoring Artifact
Release-candidate UI regression dashboard with JavaScript-enabled and no-JavaScript fallback reports.

</div>
