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
        </div>
        <div id="full-q-graph-legend">
            <h3>Legend</h3>
            <div class="legend-item">
                <span class="color-box" style="background-color: #ebebeb;"></span>
                <span class="legend-label">Root Node</span>
            </div>
            <div class="legend-item">
                <span class="color-box" style="background-color: #dcf1ff;"></span>
                <span class="legend-label">Quality/Property Nodes</span>
            </div>
            <div class="legend-item">
                <span class="color-box" style="background-color: #ceffce;"></span>
                <span class="legend-label">Requirement Nodes</span>
            </div>
        </div>
    </div>
</div>

<script src="{{ '/assets/js/fullpage/main.js' | prepend: site.baseurl }}"></script>
