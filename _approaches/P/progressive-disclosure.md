---
title: Progressive Disclosure
tags: [usable]
supported_qualities: [usability, learnability, accessibility, user-experience]
supported_qualities_notes:
  usability: Reduces cognitive load by showing only primary actions first.
  learnability: Helps new users build confidence before seeing advanced options.
  accessibility: Improves focus by limiting simultaneous controls and information.
  user-experience: Makes complex interfaces feel simpler and less overwhelming.
tradeoffs: [completeness, functionality]
tradeoff_notes:
  completeness: Important details can feel hidden if disclosure levels are too deep.
  functionality: Advanced capabilities may be harder to discover and use quickly.
related_requirements: [first-time-onboarding-without-errors, user-tries-primary-function]
related_requirements_notes:
  first-time-onboarding-without-errors: Supports stepwise onboarding with reduced early complexity.
  user-tries-primary-function: Prioritizes first-use success by emphasizing core actions.
intent: Present only the information and controls a user needs right now, revealing more complexity on demand.
mechanism: Organise UI and content into layers — a simple primary layer visible by default, and secondary/tertiary layers exposed through explicit user actions such as expanding a section, hovering, or navigating deeper.
applicability: Use when the full feature set or information space is too large to present at once without overwhelming users. Avoid when users are experts who need the full picture immediately, or when hiding options would create dangerous ambiguity (e.g. safety-critical controls).
permalink: /approaches/progressive-disclosure
---

## How It Works

Progressive disclosure structures an interface into levels of detail. The first level shows only the most common or essential elements. Users who need more can "go deeper" through explicit actions, knowing the interface will not overwhelm them on first contact.

1. The user arrives at **Level 1** — only the most common actions and content are visible. Most users complete their task here.
2. An explicit action (expand, "Advanced", drill-down link) reveals **Level 2** — secondary options and additional detail for users who need them.
3. A further action surfaces **Level 3** — raw settings, full data, or expert controls. Most users never reach this layer.

### Common Patterns

- **Show/Hide sections:** Collapsible panels (accordions) for optional detail (e.g. "Advanced settings").
- **Wizards:** Multi-step flows that surface one decision at a time.
- **Tooltips and inline help:** Context-sensitive explanations shown only when requested.
- **Drill-down navigation:** Summary views with links to detail pages.
- **Inline expansion:** Tables or lists where individual rows expand to show sub-data.

## Failure Modes

- **Over-hiding:** Critical information buried so deep users cannot find it, leading to errors or frustration.
- **Inconsistent depth:** Some areas of the UI have three levels, others one — users cannot form a mental model of where to look.
- **Broken discoverability:** Users do not know a second level exists because the affordance (expand icon, link) is invisible or unclear.
- **Performance penalty:** Lazy-loading secondary content introduces noticeable delays when users do expand sections.

## Verification Ideas

- **Usability testing:** Measure task-completion rate and error rate at each disclosure level; target ≥ 90 % first-attempt success for primary tasks.
- **Click / interaction analytics:** Monitor how often secondary levels are opened — very low rates suggest the primary layer is insufficient; very high rates suggest disclosure is too aggressive.
- **Accessibility audit:** Verify that all expand/collapse controls are keyboard-accessible and have appropriate ARIA attributes (`aria-expanded`, `aria-controls`).
- **Learnability study:** New users should locate the primary action within 30 seconds without assistance.

## Variants

- **Contextual progressive disclosure:** Additional options appear only when a preceding choice makes them relevant (e.g. shipping address fields appear after "Ship to different address" is checked).
- **Role-based disclosure:** The depth visible by default depends on the user's role — basic UI for end-users, full controls for administrators.
- **Time-based disclosure:** Advanced features are locked initially and unlocked after the user completes onboarding steps, reducing early cognitive load.
