---
layout: graph
title: Quality Graph
permalink: /full-quality-graph
order: 60
hide: true
body_class: graph-compact-header
---

<script>
  (function () {
    var params = new URLSearchParams(window.location.search);
    if (params.get("view") === "full") return;

    var isMobileViewport = window.matchMedia("(max-width: 900px)").matches;
    var isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (!isMobileViewport && !isCoarsePointer) return;

    var mobilePath = "{{ '/mobile' | prepend: site.baseurl }}";
    var target = mobilePath + window.location.search + window.location.hash;
    window.location.replace(target);
  })();
</script>

<div id="full-q-graph-container">
    <div id="full-q-graph-sidebar">
        <div id="full-q-graph-controls-container">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <h3>Filter Graph</h3>
                <button id="full-q-graph-center__btn" class="btn" title="Center View" aria-label="Center Graph View">
                    <i class="fas fa-crosshairs"></i>
                </button>
            </div>
            <label class="sr-only" for="full-q-graph-filter__input">Filter graph with comma separated values:</label>
            <input type="text" id="full-q-graph-filter__input" placeholder="Usability, ISO..." />
            <button id="full-q-graph-filter__btn" class="btn">Filter</button>
            <div class="full-quick-filter-wrap">
                <p class="full-quick-filter-label">Quick filters</p>
                <div class="full-quick-filters">
                    <button class="full-quick-filter" type="button" data-term="secure">#secure</button>
                    <button class="full-quick-filter" type="button" data-term="reliable">#reliable</button>
                    <button class="full-quick-filter" type="button" data-term="maintainable">#maintainable</button>
                    <button class="full-quick-filter" type="button" data-term="safety">safety</button>
                    <button class="full-quick-filter" type="button" data-term="privacy">privacy</button>
                    <button class="full-quick-filter" type="button" data-term="ai" data-show-standards="true">ai + standards</button>
                </div>
            </div>
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

<script src="{{ '/assets/js/fullpage/main.js' | prepend: site.baseurl }}"></script>
<script src="{{ '/assets/js/full-graph-page.js' | prepend: site.baseurl }}"></script>
