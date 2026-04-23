---
title: "User Interface can be used in Current Browsers"
tags: [flexible, usable, operable]
related: [flexibility, portability, compatibility, interoperability, interaction-capability]
permalink: /requirements/user-interface-works-with-current-browsers
---

#### Context
The system provides a responsive HTML5 user interface accessible via public internet.

#### Trigger
A user accesses any application page using a desktop or mobile browser.

#### Acceptance Criteria
- Browser compatibility: **100%** pass rate for critical user journeys in the **two latest stable versions** of Chrome, Firefox, Edge, and Safari; source: Automated end-to-end test suite.
- Visual consistency: **0** critical layout regressions (overlapping elements or broken navigation) across supported browsers; source: Visual regression testing reports.
- Failure-path behavior: **100%** of users on unsupported browsers (older than 3 years) receive a compatibility warning within **2 seconds** of page load; source: Client-side monitoring logs.

#### Monitoring Artifact
Cross-browser compatibility dashboard
