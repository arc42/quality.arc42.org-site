---
title: "Easy UI"
tags: [usable]
related: [ease-of-use, user-experience, usability, interaction-capability]
permalink: /requirements/easy-ui
---

#### Context

Users need to register their smartphone as a two-factor authentication device. The enrollment flow must be self-explanatory.

#### Trigger

A first-time user starts smartphone enrollment for 2FA.

#### Acceptance Criteria

- ≥ 90% of ≥ 20 representative test users find the enrollment entry point within 3 min without facilitator help (moderated usability test, each major auth-UI change).
- ≥ 85% complete enrollment on the first attempt within 8 min without critical errors (same study).
- Release is blocked within 1 business day if either threshold is missed (release gate log).
