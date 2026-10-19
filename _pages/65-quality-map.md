---
layout: graph
title: Your map
permalink: /map/
order: 65
hide: true
---

<div id="map-page" class="map-page" data-baseurl="{{ site.baseurl }}">
  <header class="graph-intro map-intro">
    <h1 class="graph-intro__title">Your map</h1>
    <p id="map-summary" class="graph-intro__lede">Loading your selection…</p>
    <div class="map-intro__actions">
      <div class="map-hidden">
        <button id="map-hidden-toggle" class="map-pill" type="button" aria-expanded="false" aria-controls="map-hidden-list" hidden>
          Hidden <span id="map-hidden-count" class="map-pill__count">0</span>
        </button>
        <div id="map-hidden-list" class="map-hidden__list" hidden></div>
      </div>
      <div id="map-export" class="map-export"></div>
    </div>
  </header>

  <p id="map-notice" class="map-notice" role="status"></p>

  <section id="map-empty" class="map-empty" hidden>
    <h2>No qualities selected yet</h2>
    <p>
      Add qualities while you browse, using the <strong>+ Add</strong> buttons on quality pages and lists.
      Your map then shows the approaches, requirements and standards they share.
    </p>
    <p><a href="{{ '/qualities/' | prepend: site.baseurl }}">Browse the quality characteristics</a></p>
  </section>

  <div class="map-controls" role="group" aria-label="Map layers">
    <span class="map-controls__label" aria-hidden="true">Show</span>
    <div id="map-layers" class="map-controls__layers">
      <button class="map-pill map-pill--layer" type="button" data-layer="approaches" aria-pressed="false"><span class="map-pill__check" aria-hidden="true">✓</span>Approaches</button>
      <button class="map-pill map-pill--layer" type="button" data-layer="requirements" aria-pressed="false"><span class="map-pill__check" aria-hidden="true">✓</span>Requirements</button>
      <button class="map-pill map-pill--layer" type="button" data-layer="standards" aria-pressed="false"><span class="map-pill__check" aria-hidden="true">✓</span>Standards</button>
      <button class="map-pill map-pill--layer" type="button" data-layer="dimensions" aria-pressed="false"><span class="map-pill__check" aria-hidden="true">✓</span>Dimensions</button>
    </div>
    <button id="map-singles" class="map-pill" type="button" aria-pressed="false">Show singles</button>
  </div>

  <div class="map-layout">
    <div class="map-stage">
      <div id="map-canvas" class="map-canvas" aria-hidden="true"></div>
      <div id="map-legend" class="map-legend">
        <p class="map-legend__title">How to read</p>
        <p>Size and fill show <strong>my priority</strong>. Nothing is rated automatically.</p>
        <ul class="map-legend__list">
          <li><span class="map-swatch map-swatch--q-none" aria-hidden="true"></span>none</li>
          <li><span class="map-swatch map-swatch--q-med" aria-hidden="true"></span>med</li>
          <li><span class="map-swatch map-swatch--q-high" aria-hidden="true"></span>high</li>
        </ul>
        <ul class="map-legend__list map-legend__list--stack">
          <li><span class="map-swatch map-swatch--approach" aria-hidden="true"></span>approach · number = qualities served</li>
          <li><span class="map-swatch map-swatch--custom" aria-hidden="true"></span>your own requirement</li>
        </ul>
      </div>
      <button id="map-singles-chip" class="map-singles-chip" type="button" aria-pressed="false" hidden></button>
    </div>
    <aside id="map-panel" class="map-panel" aria-label="Selected item"></aside>
  </div>

  <section class="map-list" aria-labelledby="map-list-title">
    <h2 id="map-list-title" class="map-list__title">List view</h2>
    <div id="map-table" class="map-table-wrap" tabindex="0" role="region" aria-labelledby="map-list-title"></div>
  </section>
</div>

<noscript>
  <section class="graph-noscript-fallback">
    <h2>Your map needs JavaScript</h2>
    <p>
      The map is built in your browser from the qualities you selected. Without JavaScript, browse
      <a href="{{ '/qualities/' | prepend: site.baseurl }}">all quality characteristics</a> instead.
    </p>
  </section>
</noscript>

<script defer src="{{ '/assets/js/map/main.js' | prepend: site.baseurl }}"></script>
