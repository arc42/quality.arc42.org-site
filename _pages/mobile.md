---
layout: graph
title: Mobile Graph Explorer
permalink: /mobile
order: 61
hide: true
body_class: mobile-graph-layout graph-compact-header
---

<div class="mobile-graph-page">
  <section class="mobile-graph-intro">
    <h2>
      <i class="fa fa-mobile-alt" aria-hidden="true"></i>
      Mobile Graph Explorer
    </h2>
    <p>
      A mobile-first, filter-driven view of the full q42 graph.
      Start with a quick filter, then expand your view as needed.
    </p>
  </section>

  <div id="full-q-graph-container">
    <button id="mobile-graph-controls-toggle" class="btn" type="button" aria-controls="full-q-graph-sidebar" aria-expanded="false">
      <i class="fa fa-sliders-h" aria-hidden="true"></i>
      filters + legend
    </button>

    <div id="full-q-graph-sidebar" class="is-mobile-collapsed">
      <div class="mobile-graph-sheet-head">
        <span class="mobile-graph-sheet-title">Filters and legend</span>
        <button id="mobile-graph-sheet-close" type="button" aria-label="Close controls">close</button>
      </div>

      <div id="full-q-graph-controls-container">
        <div class="mobile-graph-filter-header">
          <h3>Filter Graph</h3>
          <button id="full-q-graph-center__btn" class="btn" title="Center View" aria-label="Center Graph View">
            <i class="fas fa-crosshairs"></i>
          </button>
        </div>

        <label class="sr-only" for="full-q-graph-filter__input">Filter graph with comma separated values:</label>
        <input type="text" id="full-q-graph-filter__input" placeholder="secure, reliability, iso..." />
        <button id="full-q-graph-filter__btn" class="btn">apply filter</button>

        <div class="mobile-quick-filter-wrap">
          <p class="mobile-quick-filter-label">Quick filters</p>
          <div class="mobile-quick-filters">
            <button class="mobile-quick-filter" type="button" data-term="secure">#secure</button>
            <button class="mobile-quick-filter" type="button" data-term="reliable">#reliable</button>
            <button class="mobile-quick-filter" type="button" data-term="maintainable">#maintainable</button>
            <button class="mobile-quick-filter" type="button" data-term="safety">safety</button>
            <button class="mobile-quick-filter" type="button" data-term="privacy">privacy</button>
            <button class="mobile-quick-filter" type="button" data-term="ai" data-show-standards="true">ai + standards</button>
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
          <span class="color-box" style="background-color: #f8f9fa;"></span>
          <span class="legend-label">Dimensions</span>
        </div>
        <hr />
        <div class="legend-item">
          <span class="color-box" style="background-color: #FFC95C;"></span>
          <label class="toggle">
            <span class="toggle-label legend-label">Standards</span>
            <input class="toggle-checkbox" type="checkbox" id="legend-toggle-standards" checked>
            <div class="toggle-switch" aria-hidden="true"></div>
          </label>
        </div>
        <div class="legend-item">
          <span class="color-box" style="background-color: #00B8F5;"></span>
          <label class="toggle">
            <span class="toggle-label legend-label">Qualities</span>
            <input class="toggle-checkbox" type="checkbox" id="legend-toggle-qualities" checked>
            <div class="toggle-switch" aria-hidden="true"></div>
          </label>
        </div>
        <div class="legend-item">
          <span class="color-box" style="background-color: #ffb3b3;"></span>
          <label class="toggle">
            <span class="toggle-label legend-label">Requirements</span>
            <input class="toggle-checkbox" type="checkbox" id="legend-toggle-requirements">
            <div class="toggle-switch" aria-hidden="true"></div>
          </label>
        </div>
      </div>
    </div>
  </div>
</div>

<script src="{{ '/assets/js/fullpage/main.js' | prepend: site.baseurl }}"></script>
<script src="{{ '/assets/js/mobile-graph-page.js' | prepend: site.baseurl }}"></script>
