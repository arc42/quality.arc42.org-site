---
title: Localizable to several languages
tags: [flexible]
related: [flexibility, maintainability, modifiability, adaptability, accessibility, localizability, internationalization, i18n]
permalink: /requirements/localizable-to-n-languages
---

#### Requirement

The graphical user interface must be localization-ready so that additional languages and writing directions can be introduced without redesign of the application.

#### Acceptance Criteria

- Externalized text coverage: **100%** of user-visible UI text on the top **20** screens is stored in translatable resource files instead of source code literals; source: localization static scan; horizon: each release affecting UI.
- Locale enablement effort: a new locale, including one locale with a different writing direction or non-Latin script, can be enabled within **<= 2 person-days** without application code changes outside localization, styling, or configuration layers; source: localization exercise report; horizon: annual review or each major UI release.
- Gate behavior: if either threshold is missed, release of UI changes is blocked until localization readiness is restored; source: release gate log; horizon: every qualifying release.
