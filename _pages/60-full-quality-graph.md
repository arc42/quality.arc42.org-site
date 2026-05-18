---
layout: graph
title: Quality Graph
permalink: /full-quality-graph
order: 60
hide: true
---

{% assign qualities_count = site.qualities | size %}
{% assign requirements_count = site.requirements | size %}
{% assign standards_count = site.standards | size %}

<header class="graph-intro">
  <h1 class="graph-intro__title">Quality Graph</h1>
  <p class="graph-intro__lede">
    {{ qualities_count }} characteristics, {{ requirements_count }} requirement examples, {{ standards_count }} standards.
    Click a node to open its page. Drag to pan. Scroll to zoom. Use the filters and legend below to focus on what matters.
  </p>
</header>

<noscript>
  <section class="graph-noscript-fallback">
    <h2>The interactive graph needs JavaScript</h2>
    <p>The force-directed graph relies on JavaScript. Without it, browse the same content as static lists:</p>
    <ul>
      <li><a href="{{ '/qualities/' | prepend: site.baseurl }}">All {{ qualities_count }} quality characteristics</a></li>
      <li><a href="{{ '/requirements/' | prepend: site.baseurl }}">{{ requirements_count }} requirement examples</a></li>
      <li><a href="{{ '/standards/' | prepend: site.baseurl }}">{{ standards_count }} quality standards</a></li>
    </ul>
    <p>Or jump into a specific dimension:</p>
    <ul class="graph-noscript-fallback__tags">
      <li><a href="{{ '/tag-secure/' | prepend: site.baseurl }}">#secure</a></li>
      <li><a href="{{ '/tag-reliable/' | prepend: site.baseurl }}">#reliable</a></li>
      <li><a href="{{ '/tag-maintainable/' | prepend: site.baseurl }}">#maintainable</a></li>
      <li><a href="{{ '/tag-usable/' | prepend: site.baseurl }}">#usable</a></li>
      <li><a href="{{ '/tag-efficient/' | prepend: site.baseurl }}">#efficient</a></li>
      <li><a href="{{ '/tag-safe/' | prepend: site.baseurl }}">#safe</a></li>
      <li><a href="{{ '/tag-flexible/' | prepend: site.baseurl }}">#flexible</a></li>
      <li><a href="{{ '/tag-suitable/' | prepend: site.baseurl }}">#suitable</a></li>
      <li><a href="{{ '/tag-operable/' | prepend: site.baseurl }}">#operable</a></li>
    </ul>
  </section>
</noscript>

<div class="mobile-graph-page">
  <div id="full-q-graph-container">
    <button id="mobile-graph-controls-toggle" class="btn" type="button" aria-controls="full-q-graph-sidebar" aria-expanded="false">
      <i class="fa fa-sliders-h" aria-hidden="true"></i>
      filters + legend
    </button>

    <div id="full-q-graph-sidebar" aria-hidden="true" inert>
      <div class="mobile-graph-sheet-head">
        <span class="mobile-graph-sheet-title">Filters and legend</span>
        <button id="mobile-graph-sheet-close" type="button" aria-label="Close controls">close</button>
      </div>

      <div id="full-q-graph-controls-container">
        <div class="mobile-graph-filter-header">
          <h3>Filter Graph</h3>
          <button id="full-q-graph-center__btn" class="btn" type="button" title="Center the graph" aria-label="Center graph view">
            <i class="fas fa-crosshairs" aria-hidden="true"></i>
            <span class="full-q-graph-center__label">center</span>
          </button>
        </div>

        <label class="sr-only" for="full-q-graph-filter__input">Filter graph:</label>
        <input type="text" id="full-q-graph-filter__input" placeholder="Filter..." />
        <button id="full-q-graph-filter__btn" class="btn">Filter</button>

        <div class="mobile-quick-filter-wrap">
          <p class="mobile-quick-filter-label">Quick filters &mdash; dimensions</p>
          <div class="mobile-quick-filters">
            <button class="mobile-quick-filter" type="button" data-term="efficient">#efficient</button>
            <button class="mobile-quick-filter" type="button" data-term="flexible">#flexible</button>
            <button class="mobile-quick-filter" type="button" data-term="maintainable">#maintainable</button>
            <button class="mobile-quick-filter" type="button" data-term="operable">#operable</button>
            <button class="mobile-quick-filter" type="button" data-term="reliable">#reliable</button>
            <button class="mobile-quick-filter" type="button" data-term="safe">#safe</button>
            <button class="mobile-quick-filter" type="button" data-term="secure">#secure</button>
            <button class="mobile-quick-filter" type="button" data-term="suitable">#suitable</button>
            <button class="mobile-quick-filter" type="button" data-term="usable">#usable</button>
          </div>
        </div>

        <button id="mobile-graph-reset__btn" class="btn" type="button">reset filters</button>
        <a id="full-q-graph-home__btn" href="{{ '/' | prepend: site.baseurl }}">
          <i class="fa fa-home" aria-hidden="true"></i>
          back-to-home
        </a>
        <hr />
      </div>

      <div id="full-q-graph-legend">
        <h3>Legend</h3>
        <div class="legend-item">
          <span class="color-box" style="background-color: #ebebeb;"></span>
          <span class="legend-label">Root Node</span>
        </div>
        <div class="legend-item">
          <span class="color-box" style="background-color: var(--dimension-background-color);"></span>
          <span class="legend-label">Property Nodes</span>
        </div>
        <hr />
        <div class="legend-item">
          <span class="color-box" style="background-color: var(--standard-background-color);"></span>
          <label class="toggle">
            <span class="toggle-label legend-label">Standards</span>
            <input class="toggle-checkbox" type="checkbox" id="legend-toggle-standards">
            <div class="toggle-switch"></div>
          </label>
        </div>
        <div class="legend-item">
          <span class="color-box" style="background-color: var(--quality-background-color);"></span>
          <label class="toggle">
            <span class="toggle-label legend-label">Qualities</span>
            <input class="toggle-checkbox" type="checkbox" id="legend-toggle-qualities" checked>
            <div class="toggle-switch"></div>
          </label>
        </div>
        <div class="legend-item">
          <span class="color-box" style="background-color: var(--reqs-background-color);"></span>
          <label class="toggle">
            <span class="toggle-label legend-label">Requirements</span>
            <input class="toggle-checkbox" type="checkbox" id="legend-toggle-requirements">
            <div class="toggle-switch"></div>
          </label>
        </div>
        <div class="legend-item">
          <span class="color-box" style="background-color: var(--approaches-background-color);"></span>
          <label class="toggle">
            <span class="toggle-label legend-label">Approaches</span>
            <input class="toggle-checkbox" type="checkbox" id="legend-toggle-approaches">
            <div class="toggle-switch"></div>
          </label>
        </div>
      </div>
    </div>

  </div>
</div>

<script defer src="{{ '/assets/js/fullpage/main.js' | prepend: site.baseurl }}"></script>
