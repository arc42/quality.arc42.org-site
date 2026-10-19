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
      <div id="map-export" class="map-export">
        <button id="map-export-open" class="map-pill" type="button" aria-haspopup="dialog" aria-controls="map-export-dialog">Export &amp; share</button>
      </div>
    </div>
  </header>

  <dialog id="map-export-dialog" class="map-export-dialog" aria-labelledby="map-export-title">
    <div class="map-export-dialog__body">
      <div class="map-export-dialog__head">
        <h2 class="map-export-dialog__title"><span id="map-export-title">Export &amp; share</span></h2>
        <button class="map-pill" type="button" data-export-close>Close</button>
      </div>
      <p class="map-export-dialog__lede">
        Your map lives in this browser only. Take it with you as a link or a file.
      </p>

      <section class="map-export__section" aria-labelledby="map-export-share-title">
        <h3 class="map-export__title"><span id="map-export-share-title">Share link</span></h3>
        <p class="map-export__hint">The whole map is encoded in the URL. No server, nothing stored.</p>
        <div class="map-export__row" data-share-row>
          <label for="map-export-url" class="sr-only">Share URL</label>
          <input id="map-export-url" class="map-export__url" type="text" readonly data-share-url>
          <button class="map-pill map-pill--primary" type="button" data-share-copy disabled>Copy</button>
          <span class="map-export__status" role="status" data-share-status></span>
        </div>
        <p class="map-export__warning" data-share-too-long hidden>
          This map is too large for a share link. Download the JSON file instead.
        </p>
        <p class="map-export__warning" data-share-failed hidden>The share link could not be created in this browser. Use the JSON export instead.</p>
        <p class="map-export__hint">Whoever opens it can merge it into their own selection or replace it.</p>
      </section>

      <section class="map-export__section" aria-labelledby="map-export-json-title">
        <h3 class="map-export__title"><span id="map-export-json-title">JSON file</span></h3>
        <p class="map-export__hint">Keep it with the project, re-import it on any machine, or feed it to an LLM.</p>
        <div class="map-export__row">
          <button class="map-pill" type="button" data-export-download>Download q42-map.json</button>
          <button class="map-pill" type="button" data-import-open>Import…</button>
          <input class="map-export__file" type="file" accept="application/json" hidden data-import-file aria-label="Import a map file">
        </div>
        <p class="map-export__hint">Importing replaces your current selection.</p>
        <p class="map-export__error" role="alert" data-import-error hidden></p>
      </section>

      <section class="map-export__section" aria-labelledby="map-export-md-title">
        <h3 class="map-export__title"><span id="map-export-md-title">Markdown for arc42</span></h3>
        <p class="map-export__hint">Quality goals, quality tree and approach matrix, ready to paste into your arc42 documentation.</p>
        <fieldset class="map-export__options">
          <legend class="sr-only">Include in the Markdown</legend>
          <label class="map-export__option"><input type="checkbox" data-md-option="goals" checked> §1.2 Quality goals, ranked by my priority</label>
          <label class="map-export__option"><input type="checkbox" data-md-option="tree" checked> §10 Quality tree with Q42 definitions</label>
          <label class="map-export__option"><input type="checkbox" data-md-option="matrix" checked> Approach × quality matrix</label>
          <label class="map-export__option"><input type="checkbox" data-md-option="custom" checked> My own requirements</label>
          <label class="map-export__option"><input type="checkbox" data-md-option="links"> Links back to quality.arc42.org</label>
        </fieldset>
        <div class="map-export__row">
          <button class="map-pill map-pill--primary" type="button" data-md-copy>Copy Markdown</button>
          <button class="map-pill" type="button" data-md-download>Download .md</button>
          <span class="map-export__status" role="status" data-md-status></span>
        </div>
        <p class="map-export__hint" id="map-export-md-preview-title">Preview · quality-map.md</p>
        <div class="map-export__preview" role="region" aria-labelledby="map-export-md-preview-title" tabindex="0">
          <pre data-md-preview></pre>
        </div>
      </section>

      <section class="map-export__section map-export__section--soon" aria-labelledby="map-export-img-title">
        <h3 class="map-export__title"><span id="map-export-img-title">Image for slides</span></h3>
        <p class="map-export__hint">The map as drawn, with legend, as PNG or SVG. Coming soon.</p>
        <div class="map-export__row">
          <button class="map-pill" type="button" disabled>PNG</button>
          <button class="map-pill" type="button" disabled>SVG</button>
        </div>
      </section>
    </div>
  </dialog>

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
