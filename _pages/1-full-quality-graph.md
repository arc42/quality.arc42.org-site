---
layout: graph
title: Quality Graph
permalink: /full-quality-graph
order: 1
hide: true
---

<div id="full-q-graph-container">
    <div id="full-q-graph-sidebar">
        <div id="full-q-graph-controls-container">
            <h3>Filter Graph</h3>
            <label class="sr-only" for="full-q-graph-filter__input">Filter graph:</label>
            <input type="text" id="full-q-graph-filter__input" placeholder="Filter..." />
            <button id="full-q-graph-filter__btn" class="btn">Filter</button>
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

<script src="{{ '/assets/js/fullpage/main.js' | prepend: site.baseurl }}"></script>
