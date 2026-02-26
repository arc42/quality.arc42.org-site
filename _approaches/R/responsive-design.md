---
title: Responsive Design
tags: [usable]
supported_qualities: [usability, accessibility, adaptability]
tradeoffs: [performance, maintainability]
intent: Ensure a single codebase renders correctly and usably across the full range of screen sizes, input methods, and device capabilities.
mechanism: Use fluid grids, flexible images, and CSS media queries to adapt layout and content presentation to the available viewport, rather than serving separate sites per device class.
applicability: Use for any web application or content site where users access it from more than one class of device. Avoid when the use case is strictly single-device (e.g. a kiosk application with a fixed screen), or when a native app provides a clearly better experience than a responsive web app.
permalink: /approaches/responsive-design
---

## How It Works

Responsive design rests on three CSS techniques working together:

1. **Fluid grid:** Column widths are defined as percentages rather than fixed pixels, so the layout contracts and expands proportionally.
2. **Flexible media:** Images and video are constrained with `max-width: 100%` so they never overflow their container.
3. **Media queries:** CSS rules apply only when the viewport meets specific conditions (width, orientation, resolution), allowing entirely different layouts for each breakpoint.

<div class="mermaid">
graph TD
    A[Browser renders page] --> B{Viewport width?}
    B -- "> 1024px" --> C[Desktop layout: multi-column, full nav]
    B -- "600 to 1024px" --> D[Tablet layout: condensed nav, 2 cols]
    B -- "< 600px" --> E[Mobile layout: single col, hamburger nav]
    C & D & E --> F[Same HTML, different CSS rules applied]
</div>

### Key Design Decisions

- **Breakpoints:** Define breakpoints around content needs, not specific devices. Common starting points: 480 px, 768 px, 1024 px, 1280 px.
- **Mobile-first vs desktop-first:** Mobile-first (`min-width` queries) is generally recommended — start with the most constrained layout and progressively enhance.
- **Touch targets:** Interactive elements must be at least 44 × 44 px (WCAG 2.5.5) on touch screens.
- **Viewport meta tag:** Always include `<meta name="viewport" content="width=device-width, initial-scale=1">` to prevent mobile browsers from rendering a desktop-scale page.

## Failure Modes

- **Content overflow:** Fixed-width elements (tables, code blocks, embedded media) break the layout on narrow viewports.
- **Missing breakpoints:** A layout that looks good at 375 px and 1440 px may be broken at intermediate sizes (e.g. 700 px tablets).
- **Touch-unfriendly controls:** Small click targets, hover-only interactions, and tightly spaced links create usability problems on touch devices.
- **Performance regression:** Serving large desktop images to mobile devices wastes bandwidth and increases load time; requires art direction via `<picture>` or `srcset`.
- **Accessibility regressions:** Reordering elements with CSS flexbox or grid can cause the visual order to diverge from the DOM order, confusing screen-reader users.

## Verification Ideas

- **Cross-device testing:** Test on real devices (or browser DevTools device emulation) at 360 px, 768 px, 1024 px, and 1440 px minimum.
- **Lighthouse / PageSpeed:** Run on mobile throttling profile; aim for Performance score ≥ 80 and no Accessibility violations.
- **WCAG 2.5.5 audit:** Verify all interactive controls meet minimum 44 × 44 px target size on touch screens.
- **Load time on 4G:** Measure Time to Interactive on a simulated 4G connection; target ≤ 3 s for primary user journeys.
- **Automated visual regression:** Tools like Percy or Chromatic can diff layouts across breakpoints in CI.

## Related Requirements

- [usable-on-latest-browsers](/requirements/usable-on-latest-browsers)
- [usable-on-factory-floor](/requirements/usable-on-factory-floor)
- [usable-with-gloves](/requirements/usable-with-gloves)

## Variants

- **Adaptive design:** Serve distinct, purpose-built layouts for detected device classes (requires server-side user-agent detection or separate builds). More maintenance burden, but allows deeper optimisation per device.
- **Progressive enhancement:** Start with a baseline experience that works everywhere, then layer on richer functionality for capable browsers — a philosophical complement to responsive layout.
- **Container queries:** CSS `@container` rules apply styles based on the size of a parent element rather than the viewport, enabling truly component-level responsiveness.
