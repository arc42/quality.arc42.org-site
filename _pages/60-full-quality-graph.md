---
layout: graph
title: Quality Graph
permalink: /full-quality-graph
order: 60
hide: true
---

<div class="mobile-graph-page">
  <div id="full-q-graph-container">
    <button id="mobile-graph-controls-toggle" class="btn" type="button" aria-controls="full-q-graph-sidebar" aria-expanded="false">
      <i class="fa fa-sliders-h" aria-hidden="true"></i>
      filters + legend
    </button>

    <div id="full-q-graph-sidebar">
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

        <label class="sr-only" for="full-q-graph-filter__input">Filter graph:</label>
        <input type="text" id="full-q-graph-filter__input" placeholder="Filter..." />
        <button id="full-q-graph-filter__btn" class="btn">Filter</button>

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
          <span class="color-box" style="background-color: #1a3a5c;"></span>
          <span class="legend-label">Property Nodes</span>
        </div>
        <hr />
        <div class="legend-item">
          <span class="color-box" style="background-color: #FFC95C;"></span>
          <label class="toggle">
            <span class="toggle-label legend-label">Standards</span>
            <input class="toggle-checkbox" type="checkbox" id="legend-toggle-standards" checked>
            <div class="toggle-switch"></div>
          </label>
        </div>
        <div class="legend-item">
          <span class="color-box" style="background-color: #00B8F5;"></span>
          <label class="toggle">
            <span class="toggle-label legend-label">Qualities</span>
            <input class="toggle-checkbox" type="checkbox" id="legend-toggle-qualities" checked>
            <div class="toggle-switch"></div>
          </label>
        </div>
        <div class="legend-item">
          <span class="color-box" style="background-color: #ffb3b3;"></span>
          <label class="toggle">
            <span class="toggle-label legend-label">Requirements</span>
            <input class="toggle-checkbox" type="checkbox" id="legend-toggle-requirements">
            <div class="toggle-switch"></div>
          </label>
        </div>
      </div>
    </div>

  </div>
</div>

<script src="{{ '/assets/js/fullpage/main.js' | prepend: site.baseurl }}"></script>
