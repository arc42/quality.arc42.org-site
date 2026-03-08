---
title: "Configurable UI theme"
tags: [flexible, usable]
related: [flexibility, changeability, adaptability, configurability, customizability]
permalink: /requirements/configurable-ui-theme
---

<div class="quality-requirement" markdown="1">

#### Requirement

Users must be able to switch between the supported UI themes at runtime without losing their current page state.

#### Acceptance Criteria

- Theme switching: with at least **3** supported themes, the selected theme is applied within **<= 2 s** for **>= 95%** of theme changes on the top **10** user screens; source: UI automation timing report; horizon: each release affecting theming.
- Preference persistence: the selected theme is restored correctly in **100%** of automated regression runs after page reload and new login on the latest major versions of the top **3** supported browsers; source: cross-browser UI test report; horizon: each release affecting theming or session handling.
- Gate behavior: if either threshold is missed, the release is blocked for changes to theming, styling, or user-preference persistence; source: release gate log; horizon: every qualifying release.

</div><br>
