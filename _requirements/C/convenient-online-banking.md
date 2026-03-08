---
title: Convenient online banking
tags: [usable, suitable]
related: [user-experience, convenience, interaction-capability, clarity, ease-of-use]
permalink: /requirements/convenient-online-banking
---

<div class="quality-requirement" markdown="1">

#### Context

A browser-based online banking application lets retail customers manage accounts, add payees, and make payments without branch or phone support. The add-payee-plus-first-payment flow must be fast and low-friction because it is both frequent and error-sensitive.

#### Trigger

An authenticated customer adds a new payee and submits the first bill payment to that payee.

#### Acceptance Criteria

- Task completion: in a usability test with **>= 20** representative customers, **>= 90%** complete the end-to-end flow without assistance within **<= 2 min** including second-factor confirmation; source: moderated usability test log; horizon: each major release affecting the payment flow.
- Correction rate: across the same test, the percentage of attempts requiring user correction of payee data, amount, or scheduling details before confirmation stays **<= 5%**; source: session recordings and task-observation protocol; horizon: each major release affecting the payment flow.
- Gate behavior: if either threshold is missed, release of the changed payment flow is blocked; source: release gate log; horizon: every qualifying release.

</div><br>
