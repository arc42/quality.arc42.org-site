---
layout: approach
title: Progressive Disclosure
tags: [usable]
supported_qualities: [usability, learnability, accessibility, user-experience]
supported_qualities_notes:
  usability: Reduces cognitive load by showing only primary actions first.
  learnability: Helps new users build confidence before seeing advanced options.
  accessibility: Improves focus by limiting simultaneous controls and information.
  user-experience: Makes complex interfaces feel simpler and less overwhelming.
tradeoffs: [completeness, functionality, observability]
tradeoff_notes:
  completeness: Important details can feel hidden if disclosure levels are too deep.
  functionality: Advanced capabilities may be harder to discover and use quickly.
  observability: Monitoring how users interact with hidden layers requires granular telemetry.
related_requirements: [first-time-onboarding-without-errors, learnability-find-article, user-tries-primary-function]
related_requirements_notes:
  first-time-onboarding-without-errors: Supports stepwise onboarding with reduced early complexity.
  learnability-find-article: Simplifies the initial search experience to improve first-time success.
  user-tries-primary-function: Prioritizes first-use success by emphasizing core actions.
intent: "Present only the information and controls a user needs right now, revealing more complexity on demand."
mechanism: "Organize UI and content into layers — a simple primary layer visible by default, and secondary/expert layers exposed through explicit user actions like expanding sections, hovering, or navigating deeper."
applicability: "Use when the full feature set or information space is too large to present at once without overwhelming users. Avoid when users are experts who need the full picture immediately, or when hiding options would create dangerous ambiguity (e.g., in safety-critical controls)."
permalink: /approaches/progressive-disclosure
---

Progressive disclosure is a core interaction design pattern that manages complexity by partitioning information across multiple layers. By showing only the essentials at first, the system reduces the initial cognitive load on the user and provides a clear path to success for the most common tasks.

## How It Works

Progressive disclosure structures an interface into levels of detail. The first level shows only the most common or essential elements. Users who need more can "go deeper" through explicit actions.

1. **Initial View (Level 1):** The user sees only the most common actions and content. Most users complete their primary goal here without ever needing the secondary layers.
2. **Explicit Disclosure (Level 2):** An intentional user action (e.g., clicking "Advanced Settings" or expanding an accordion) reveals secondary options and additional detail.
3. **Deep Detail (Level 3):** Expert-level controls, raw data, or rarely used configuration settings are kept in the deepest layer, often behind a drill-down or separate configuration page.

### Common Patterns

- **Accordions / Collapsible Sections:** Reveal secondary details (e.g., "Show technical details" in an error message).
- **Wizards:** Break a complex multi-step process into sequential, manageable screens.
- **Contextual Overlays:** Tooltips, popovers, or "What's this?" links that provide help only when requested.
- **Tabbed Interfaces:** Grouping content into logical buckets so only one category is visible at a time.
- **Drill-down Navigation:** Summary dashboards with links to full detailed reports.

## Failure Modes

- **Over-hiding:** Critical information or primary actions are buried so deep that users cannot find them, leading to frustration and support calls.
- **Click Fatigue:** Forcing users to perform too many clicks to reach information they need frequently, turning a "simple" UI into a tedious one.
- **Broken Discoverability:** Users do not realize that additional levels exist because the "expand" affordance (e.g., a tiny chevron or subtle link) is too discreet.
- **Performance Penalty:** If secondary layers are lazy-loaded, a slow network can make the "disclosure" feel broken or unresponsive when the user clicks.

## Verification

- **Task Success Rate:** In usability tests, verify that ≥ 90% of first-time users can complete the primary task (Level 1) without opening any secondary disclosure layers.
- **Interaction Depth Analysis:** Monitor telemetry to ensure that expert users can reach Level 3 controls in ≤ 3 interactions from the home screen.
- **Discoverability Audit:** Verify that disclosure affordances (buttons, icons) have a high visual contrast and clear labeling (e.g., "Advanced Options" vs. just a generic icon).
- **Accessibility Check:** Ensure all disclosure controls are keyboard-navigable and use appropriate ARIA attributes (e.g., `aria-expanded="true/false"`) to inform screen-reader users of the state changes.

## Variants and Related Tactics

- **Contextual Disclosure:** Options appear only when a preceding choice makes them relevant (e.g., showing credit card fields only after "Credit Card" is selected as the payment method).
- **Staged Onboarding:** Gradually unlocking advanced features as the user gains experience or completes specific milestones in the application.
- **Role-based Views:** Tailoring the default disclosure level to the user's expertise or permissions (e.g., an "Admin" view defaults to more detail than a "Guest" view).

## References
- [Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) — Nielsen Norman Group
- [About Face: The Essentials of Interaction Design](https://www.wiley.com/en-us/About+Face:+The+Essentials+of+Interaction+Design,+4th+Edition-p-9781118766576) — Alan Cooper ([full citation](/references/#cooper2014face))
