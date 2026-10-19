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
      <button id="map-clear" class="map-pill" type="button" hidden>Clear selection</button>
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

      <section class="map-export__section" aria-labelledby="map-export-img-title">
        <h3 class="map-export__title"><span id="map-export-img-title">Image for slides</span></h3>
        <p class="map-export__hint">The map as drawn, with legend.</p>
        <div class="map-export__row">
          <button class="map-pill" type="button" data-image-png>PNG</button>
          <button class="map-pill" type="button" data-image-svg>SVG</button>
          <span class="map-export__status" role="status" data-image-status></span>
        </div>
      </section>
    </div>
  </dialog>

  <dialog id="map-custom-dialog" class="map-export-dialog map-custom-dialog" aria-labelledby="map-custom-title">
    <form class="map-export-dialog__body map-custom" novalidate data-custom-form>
      <h2 class="map-export-dialog__title"><span id="map-custom-title" data-custom-heading>Add your own requirement</span></h2>
      <p class="map-export-dialog__lede">
        Something your system must do well that the catalogue does not cover. It stays in this browser, on your map.
      </p>

      <div class="map-custom__field">
        <label class="map-custom__label" for="map-custom-title-input">Title</label>
        <input id="map-custom-title-input" class="map-custom__input" type="text" required maxlength="200" autocomplete="off" data-custom-title>
        <p id="map-custom-title-error" class="map-export__error" hidden data-custom-title-error>Enter a title for your requirement.</p>
      </div>

      <div class="map-custom__field">
        <label class="map-custom__label" for="map-custom-scenario">Scenario <span class="map-custom__optional">(optional)</span></label>
        <p id="map-custom-scenario-hint" class="map-export__hint">
          Add measurable acceptance criteria with units and thresholds where you can.
          <a href="{{ '/requirements/' | prepend: site.baseurl }}">How to specify quality requirements</a>
        </p>
        <textarea id="map-custom-scenario" class="map-custom__input map-custom__textarea" rows="5" aria-describedby="map-custom-scenario-hint" data-custom-scenario></textarea>
      </div>

      <fieldset class="map-custom__group">
        <legend class="map-custom__label">Link to qualities</legend>
        <p class="map-export__hint">In your selection</p>
        <div class="map-custom__chips" data-custom-chips></div>
        <p class="map-export__hint" hidden data-custom-no-qualities>Your selection has no qualities to link to yet.</p>
      </fieldset>

      <fieldset class="map-custom__group">
        <legend class="map-custom__label">My priority</legend>
        <div class="map-segments">
          <button class="map-segment" type="button" aria-pressed="false" data-custom-priority="low">Low</button>
          <button class="map-segment" type="button" aria-pressed="false" data-custom-priority="medium">Medium</button>
          <button class="map-segment" type="button" aria-pressed="false" data-custom-priority="high">High</button>
        </div>
        <p class="map-export__hint">Press the active choice again to clear it.</p>
      </fieldset>

      <section class="map-export__section" aria-labelledby="map-custom-share-title">
        <h3 class="map-export__title"><span id="map-custom-share-title">Share it with Q42</span></h3>
        <p class="map-export__hint">Think others need it too? Propose it for the catalogue as a prefilled GitHub issue.</p>
        <a class="map-propose" href="#" target="_blank" rel="noopener" hidden data-custom-propose>Propose as contribution<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 4h6v6M20 4l-9 9M19 14v6H4V5h6"/></svg><span class="sr-only"> (opens GitHub in a new tab)</span></a>
        <p class="map-export__hint" data-custom-propose-hint>Add a title to propose it.</p>
        <p class="map-export__hint">Shares title, scenario and linked qualities. Not shared: your priorities, selection and map.</p>
      </section>

      <div class="map-custom__actions">
        <button class="map-pill map-pill--primary" type="submit" data-custom-submit>Add to map</button>
        <button class="map-pill" type="button" data-custom-cancel>Cancel</button>
        <button class="map-pill map-custom__remove" type="button" hidden data-custom-remove>Remove</button>
      </div>
    </form>
  </dialog>

  <p id="map-notice" class="map-notice" role="status"></p>

  <div class="map-add-bar">
    <div id="map-add" class="map-add-search">
      <label class="map-add-search__label-text" for="map-add-input">Add a quality</label>
      <input id="map-add-input" class="map-add-search__input" type="search" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="map-add-results" autocomplete="off" placeholder="Search all qualities">
      <ul id="map-add-results" class="map-add-search__results" role="listbox" aria-label="Matching qualities" hidden></ul>
      <p id="map-add-status" class="sr-only" role="status"></p>
    </div>
    <button id="map-custom-open" class="map-pill" type="button" aria-haspopup="dialog" aria-controls="map-custom-dialog" hidden>+ Own requirement</button>
  </div>

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
