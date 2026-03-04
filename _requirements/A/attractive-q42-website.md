---
title: Attractive Appearance of Website
tags: [usable]
related: [attractiveness, usability, appearance, user-interface-aesthetics, user-experience]
permalink: /requirements/attractive-quality-knowledge-base
---

<div class="quality-requirement" markdown="1">

#### Context

The quality.arc42.org knowledge base serves software architects and developers who browse
~220 quality attributes, ~140 requirements, and an interactive force-directed graph.
Users typically arrive via search engines and decide within seconds whether the site
feels trustworthy and worth exploring. Visual appeal directly affects engagement
and return visits.

#### Trigger

A new or returning user loads any page of quality.arc42.org on a desktop or mobile browser.

#### Acceptance Criteria

- At least 70% of surveyed users (n >= 50) rate overall visual appeal >= 4 on a
  5-point [Likert scale](https://en.wikipedia.org/wiki/Likert_scale),
  measured via the [VisAWI questionnaire](https://doi.org/10.1016/j.ijhcs.2010.05.006)
  (Visual Aesthetics of Websites Inventory) administered annually.
  Assumption: 70% threshold chosen conservatively for a non-commercial knowledge site.

- [AttrakDiff](https://attrakdiff.de/) hedonic quality score (HQ-I subscale) reaches
  at least 0.5 on the -3 to +3 scale across a panel of >= 30 representative users,
  evaluated per major redesign via online self-report.

- Visual consistency: no more than 5% of sampled pages (random sample of >= 30 pages
  per audit) deviate from the site's color scheme, typography, or spacing conventions,
  verified by automated visual regression testing per release.

- Cumulative Layout Shift ([CLS](https://web.dev/articles/cls)) remains <= 0.1 on
  at least 95% of page loads over a rolling 30-day window, measured via real-user monitoring
  or [PageSpeed Insights](https://pagespeed.web.dev/).


- [System Usability Scale](https://doi.org/10.1201/9781498710411-35) (SUS) overall
  score >= 68 (industry average) across >= 20 users, evaluated annually.
  

#### Monitoring Artifact

Annual UX survey dashboard combining VisAWI scores, AttrakDiff profiles, SUS scores,
CLS telemetry from PageSpeed Insights, and bounce rate trends from web analytics.

</div>

**Measurement instruments referenced above:**

- **[Likert scale](https://en.wikipedia.org/wiki/Likert_scale)** — a symmetric agree/disagree rating scale (typically 5 or 7 points), widely used in survey research to quantify subjective attitudes.
- **[VisAWI](https://doi.org/10.1016/j.ijhcs.2010.05.006)** (Moshagen & Thielsch, 2010) — a validated 18-item questionnaire measuring perceived visual aesthetics of websites across four facets: simplicity, diversity, colorfulness, and craftsmanship.
- **[AttrakDiff](https://attrakdiff.de/)** (Hassenzahl et al., 2003) — a semantic differential questionnaire measuring pragmatic quality (usability), hedonic quality (stimulation and identity), and overall attractiveness of interactive products.
- **[SUS](https://doi.org/10.1201/9781498710411-35)** (Brooke, 1996) — a 10-item questionnaire producing a single score (0–100) for perceived usability. Scores above 68 are considered above average.
