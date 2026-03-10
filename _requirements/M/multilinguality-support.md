---
title: "Multilinguality Support"
tags: [usable]
related: [usability, inclusivity, accessibility, interaction-capability, internationalization, localizability]
permalink: /requirements/multilinguality-support
---

<div class="quality-requirement" markdown="1">

#### Requirement

Core user journeys must be fully translated and linguistically reviewed for every supported locale before release.

#### Acceptance Criteria

- The top 20 user journeys (UI, onboarding, error messages, help) are available in ≥ 10 locales with ≥ 98% translated strings and zero placeholder/fallback-language texts (i18n completeness report, every release).
- Native-language review of the top 20 journeys per changed locale finds ≤ 2 major translation defects (linguistic QA report, every release).
- If a locale misses either threshold, it is de-listed from the supported set for that release within 1 business day (release gate log).

</div><br>
