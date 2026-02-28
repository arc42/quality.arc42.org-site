---
layout: page
title: Solution Approaches
permalink: /approaches/
order: 70
---

{% assign valid_tags = site.data.standard_tags.tags | sort %}
{% assign approaches_sorted = site.approaches | sort: "title" %}
{% assign dimensions_with_approaches = 0 %}
{% for tag in valid_tags %}
  {% assign approaches_count_for_tag = 0 %}
  {% for approach in approaches_sorted %}
    {% if approach.tags contains tag %}
      {% assign approaches_count_for_tag = approaches_count_for_tag | plus: 1 %}
    {% endif %}
  {% endfor %}
  {% if approaches_count_for_tag > 0 %}
    {% assign dimensions_with_approaches = dimensions_with_approaches | plus: 1 %}
  {% endif %}
{% endfor %}

<div class="approach-entry">
  <section class="approach-entry-hero">
    <h2 class="approach-entry-hero-title">
      <i class="fa fa-puzzle-piece" aria-hidden="true"></i>
      Solution Approaches: Dimension Views + Search
    </h2>

    <p class="approach-entry-hero-text">
      Solution approaches are <strong>architectural tactics and patterns</strong> that help achieve specific quality attributes.
      They bridge the gap from quality requirements to concrete implementation decisions.
      Use <strong>dimension explorer</strong> for guided filtering, <strong>dimension list</strong> for full grouped browsing, and
      <strong>keyword search</strong> for quick text-based lookup.
    </p>

    <div class="approach-entry-mode-switch" aria-label="Approach browsing modes">
      <button class="approach-entry-mode-btn active" type="button" data-target="explorer">
        <span class="approach-entry-mode-name">Dimension Explorer (default)</span>
        <span class="approach-entry-mode-desc">Filter by dimension and browse matching approaches.</span>
      </button>
      <button class="approach-entry-mode-btn" type="button" data-target="dimlist">
        <span class="approach-entry-mode-name">Dimension List</span>
        <span class="approach-entry-mode-desc">See all approaches under each dimension.</span>
      </button>
      <button class="approach-entry-mode-btn" type="button" data-target="search">
        <span class="approach-entry-mode-name">Keyword Search</span>
        <span class="approach-entry-mode-desc">Search by name, tags, qualities, and trade-offs.</span>
      </button>
    </div>

    <div class="approach-entry-hero-footer">
      <div class="approach-entry-hero-stat">
        <span class="approach-entry-hero-stat-value">{{ approaches_sorted | size }}</span>
        <span class="approach-entry-hero-stat-label">Approaches</span>
      </div>
      <div class="approach-entry-hero-stat">
        <span class="approach-entry-hero-stat-value">{{ dimensions_with_approaches }}</span>
        <span class="approach-entry-hero-stat-label">Dimensions</span>
      </div>
    </div>
  </section>

  <section id="approach-entry-panel-explorer" class="approach-entry-panel active">
    <div class="approach-entry-explorer">
      <aside class="approach-entry-dim-nav">
        <h3>Dimensions</h3>
        <div class="approach-entry-dim-chips">
          {% for tag in valid_tags %}
            {% assign approaches_count_for_tag = 0 %}
            {% for approach in approaches_sorted %}
              {% if approach.tags contains tag %}
                {% assign approaches_count_for_tag = approaches_count_for_tag | plus: 1 %}
              {% endif %}
            {% endfor %}
            <button
              class="approach-entry-dim-chip {% if forloop.first %}active{% endif %}"
              type="button"
              data-tag="{{ tag }}">
              {{ tag }} <span>{{ approaches_count_for_tag }}</span>
            </button>
          {% endfor %}
        </div>
      </aside>

      <section class="approach-entry-results-pane">
        {% for tag in valid_tags %}
          {% assign approaches_count_for_tag = 0 %}
          {% for approach in approaches_sorted %}
            {% if approach.tags contains tag %}
              {% assign approaches_count_for_tag = approaches_count_for_tag | plus: 1 %}
            {% endif %}
          {% endfor %}
          <div class="approach-entry-results-block {% if forloop.first %}active{% endif %}" data-tag="{{ tag }}">
            <div class="approach-entry-results-head">
              <h3>{{ tag }}</h3>
              <span>{{ approaches_count_for_tag }} approaches, sorted A-Z</span>
            </div>
            {% if approaches_count_for_tag > 0 %}
              <ul class="posts no-bullets approach-entry-approach-list">
                {% for approach in approaches_sorted %}
                  {% if approach.tags contains tag %}
                    <li>
                      <a href="{{ approach.permalink }}"><i class="fa fa-puzzle-piece fa-xs as-bullet"></i> {{ approach.title }}</a>
                      {% if approach.supported_qualities %}
                        <div class="approach-entry-inline">supports: {{ approach.supported_qualities | join: ", " | replace: "-", " " }}</div>
                      {% endif %}
                    </li>
                  {% endif %}
                {% endfor %}
              </ul>
            {% else %}
              <p class="approach-entry-empty">No approaches in this dimension yet.</p>
            {% endif %}
          </div>
        {% endfor %}
      </section>
    </div>
  </section>

  <section id="approach-entry-panel-dimlist" class="approach-entry-panel">
    <h2 class="approach-entry-dimlist-heading">Dimensions and Solution Approaches</h2>

    <div class="approach-entry-tag-pills">
      {% for tag in valid_tags %}
        {% assign approaches_count_for_tag = 0 %}
        {% for approach in approaches_sorted %}
          {% if approach.tags contains tag %}
            {% assign approaches_count_for_tag = approaches_count_for_tag | plus: 1 %}
          {% endif %}
        {% endfor %}
        <span class="approach-entry-tag-pill">{{ tag }} <small>{{ approaches_count_for_tag }}</small></span>
      {% endfor %}
    </div>

    <div class="approach-entry-dimlist-sections">
      {% for tag in valid_tags %}
        {% assign approaches_count_for_tag = 0 %}
        {% for approach in approaches_sorted %}
          {% if approach.tags contains tag %}
            {% assign approaches_count_for_tag = approaches_count_for_tag | plus: 1 %}
          {% endif %}
        {% endfor %}
        <article class="approach-entry-dimlist-section">
          <h3 class="approach-entry-dimlist-title">Approaches tagged with {{ tag }}</h3>
          {% if approaches_count_for_tag > 0 %}
            <ul class="posts no-bullets approach-entry-approach-list">
              {% for approach in approaches_sorted %}
                {% if approach.tags contains tag %}
                  <li>
                    <a href="{{ approach.permalink }}"><i class="fa fa-puzzle-piece fa-xs as-bullet"></i> {{ approach.title }}</a>
                    {% if approach.supported_qualities %}
                      <div class="approach-entry-inline">supports: {{ approach.supported_qualities | join: ", " | replace: "-", " " }}</div>
                    {% endif %}
                  </li>
                {% endif %}
              {% endfor %}
            </ul>
          {% else %}
            <p class="approach-entry-empty">No approaches in this dimension yet.</p>
          {% endif %}
        </article>
      {% endfor %}
    </div>
  </section>

  <section id="approach-entry-panel-search" class="approach-entry-panel">
    <div class="approach-entry-search-head">
      <h3><i class="fa fa-search"></i> Keyword Search</h3>
      <p>Search by approach name, dimensions, supported qualities, trade-offs, and intent text.</p>
      <div class="approach-entry-search-row">
        <input id="approach-entry-search-input" type="search" placeholder="e.g. latency, resilience, rollout, accessibility">
        <button id="approach-entry-search-btn" type="button">Search</button>
      </div>
      <div class="approach-entry-search-suggested">
        <span>latency</span><span>resilience</span><span>rollout</span><span>accessibility</span><span>scalability</span>
      </div>
      <p id="approach-entry-search-count" class="approach-entry-search-count"></p>
    </div>

    <div id="approach-entry-search-grid" class="approach-entry-search-grid">
      {% for approach in approaches_sorted %}
        {% capture searchable %}
          {{ approach.title }}
          {% if approach.intent %} {{ approach.intent }} {% endif %}
          {% if approach.mechanism %} {{ approach.mechanism }} {% endif %}
          {% if approach.tags %} {{ approach.tags | join: " " }} {% endif %}
          {% if approach.supported_qualities %} {{ approach.supported_qualities | join: " " }} {% endif %}
          {% if approach.tradeoffs %} {{ approach.tradeoffs | join: " " }} {% endif %}
        {% endcapture %}
        <article class="approach-entry-search-card" data-search="{{ searchable | strip_newlines | downcase | escape }}">
          <h4><a href="{{ approach.permalink }}">{{ approach.title }}</a></h4>
          {% if approach.tags %}
            <div class="approach-entry-inline">dimensions: {{ approach.tags | join: ", " }}</div>
          {% endif %}
          {% if approach.supported_qualities %}
            <div class="approach-entry-inline">supports: {{ approach.supported_qualities | join: ", " | replace: "-", " " }}</div>
          {% endif %}
          {% if approach.tradeoffs %}
            <div class="approach-entry-inline">trade-offs: {{ approach.tradeoffs | join: ", " | replace: "-", " " }}</div>
          {% endif %}
        </article>
      {% endfor %}
    </div>
  </section>
</div>

<style>
  .approach-entry {
    margin-top: 0.7rem;
    --app-border: rgba(56, 133, 50, 0.34);
    --app-border-strong: rgba(34, 104, 29, 0.5);
    --app-surface: #f8fff5;
    --app-surface-strong: #f2fde9;
    --app-text-soft: #496346;
  }

  .approach-entry-hero {
    position: relative;
    margin: 0 0 1rem;
    padding: 1.05rem 1.05rem 0.95rem;
    border-radius: 12px;
    border: 1px solid var(--app-border);
    background:
      radial-gradient(circle at 0% 0%, rgba(146, 239, 128, 0.24), transparent 54%),
      radial-gradient(circle at 100% 100%, rgba(94, 197, 82, 0.18), transparent 58%),
      var(--app-surface);
    overflow: hidden;
  }

  .approach-entry-hero::after {
    content: "";
    position: absolute;
    top: -24%;
    right: -9%;
    width: 42%;
    height: 180%;
    transform: rotate(12deg);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.34) 0%,
      rgba(255, 255, 255, 0.08) 70%,
      rgba(255, 255, 255, 0) 100%
    );
    pointer-events: none;
    z-index: 0;
  }

  .approach-entry-hero > * {
    position: relative;
    z-index: 1;
  }

  .approach-entry-hero-title {
    margin: 0 0 0.38rem;
    color: var(--approaches-text-color) !important;
    font-size: 1.38rem;
    line-height: 1.2;
  }

  .approach-entry-hero-title .fa-puzzle-piece {
    margin-right: 0.42rem;
    font-size: 0.88em;
    color: #2a7c26;
  }

  .approach-entry-hero-text {
    margin: 0;
    color: var(--app-text-soft);
    max-width: 78ch;
  }

  .approach-entry-mode-switch {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 0.42rem;
    margin-top: 0.8rem;
  }

  .approach-entry-mode-btn {
    display: flex;
    flex-direction: column;
    gap: 0.12rem;
    align-items: flex-start;
    text-align: left;
    width: 100%;
    font: inherit;
    border: 1px solid var(--app-border);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.72);
    color: var(--approaches-text-color);
    padding: 0.52rem 0.62rem;
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background 0.18s ease;
  }

  .approach-entry-mode-btn.active {
    border-color: var(--app-border-strong);
    background: linear-gradient(180deg, rgba(237, 255, 232, 0.95), rgba(219, 249, 209, 0.92));
    box-shadow: inset 0 0 0 1px rgba(60, 141, 53, 0.18);
    color: var(--approaches-text-color);
  }

  .approach-entry-mode-btn:hover,
  .approach-entry-mode-btn:focus-visible {
    border-color: var(--app-border-strong);
    background: linear-gradient(180deg, rgba(244, 255, 240, 0.95), rgba(225, 250, 216, 0.92));
    box-shadow: 0 4px 10px rgba(21, 56, 18, 0.12);
    transform: translateY(-1px);
  }

  .approach-entry-mode-btn:focus-visible {
    outline: 2px solid rgba(44, 120, 38, 0.48);
    outline-offset: 2px;
  }

  .approach-entry-mode-name {
    font-size: 0.83rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: var(--approaches-text-color);
  }

  .approach-entry-mode-desc {
    font-size: 0.85rem;
    color: var(--app-text-soft);
    line-height: 1.3;
    font-weight: 500;
  }

  .approach-entry-hero-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.52rem;
    margin-top: 0.78rem;
  }

  .approach-entry-hero-stat {
    display: inline-flex;
    align-items: baseline;
    gap: 0.35rem;
    padding: 0.29rem 0.68rem;
    border-radius: 999px;
    border: 1px solid var(--app-border);
    background: rgba(255, 255, 255, 0.86);
  }

  .approach-entry-hero-stat-value {
    color: #2f7727;
    font-size: 0.95rem;
    font-weight: 700;
  }

  .approach-entry-hero-stat-label {
    color: var(--app-text-soft);
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.01em;
  }

  .approach-entry-panel {
    display: none;
    border: 1px solid var(--app-border);
    border-radius: 12px;
    background: #fbfffa;
    padding: 0.85rem;
  }

  .approach-entry-panel.active {
    display: block;
  }

  .approach-entry-explorer {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .approach-entry-dim-nav {
    border: 1px solid var(--app-border);
    border-radius: 10px;
    padding: 0.7rem;
    background: #f7fdf4;
  }

  .approach-entry-dim-nav h3 {
    margin: 0 0 0.5rem;
    color: var(--approaches-text-color);
    font-size: 1.05rem;
  }

  .approach-entry-dim-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .approach-entry-dim-chip {
    border: 1px solid rgba(27, 94, 32, 0.28);
    border-radius: 999px;
    background: #ffffff;
    color: var(--approaches-text-color);
    font-size: 0.8rem;
    font-weight: 700;
    padding: 0.24rem 0.62rem;
    cursor: pointer;
    text-transform: lowercase;
  }

  .approach-entry-dim-chip.active {
    background: var(--approaches-soft-background-color);
  }

  .approach-entry-dim-chip span {
    margin-left: 0.15rem;
    font-size: 0.8em;
  }

  .approach-entry-results-pane {
    border: 1px solid var(--app-border);
    border-radius: 10px;
    padding: 0.7rem;
    background: #ffffff;
  }

  .approach-entry-results-block {
    display: none;
  }

  .approach-entry-results-block.active {
    display: block;
  }

  .approach-entry-results-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.4rem;
    margin-bottom: 0.45rem;
  }

  .approach-entry-results-head h3 {
    margin: 0;
    color: var(--approaches-text-color);
    font-size: 1.05rem;
    text-transform: lowercase;
  }

  .approach-entry-results-head span {
    color: var(--muted-text-2);
    font-size: 0.84rem;
  }

  .approach-entry-approach-list {
    margin: 0;
    padding: 0;
  }

  .approach-entry-approach-list li {
    border-bottom: 1px solid rgba(56, 133, 50, 0.2);
    padding: 0.5rem 0.2rem 0.55rem;
    margin: 0;
  }

  .approach-entry-approach-list li:last-child {
    border-bottom: 0;
  }

  .approach-entry-approach-list a {
    color: var(--quality-text-color);
    text-decoration: none;
    font-weight: 700;
  }

  .approach-entry-approach-list a .as-bullet {
    color: var(--approaches-text-color);
  }

  .approach-entry-inline {
    color: var(--muted-text-2);
    font-size: 0.83rem;
    margin-top: 0.18rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .approach-entry-empty {
    color: var(--muted-text-2);
    margin: 0.55rem 0 0.15rem;
    font-size: 0.9rem;
  }

  .approach-entry-dimlist-heading {
    margin: 0 0 0.7rem;
    color: var(--approaches-text-color) !important;
    font-size: 1.35rem;
  }

  .approach-entry-tag-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.52rem;
    margin-bottom: 0.85rem;
  }

  .approach-entry-tag-pill {
    border-radius: 20px;
    background: var(--approaches-background-color);
    color: var(--approaches-text-color);
    font-weight: 800;
    font-size: 0.95rem;
    padding: 0.28rem 0.82rem;
    border: 1px solid rgba(27, 94, 32, 0.16);
    text-transform: lowercase;
  }

  .approach-entry-tag-pill small {
    font-size: 0.8em;
    margin-left: 0.2rem;
  }

  .approach-entry-dimlist-section {
    margin-bottom: 0.85rem;
  }

  .approach-entry-dimlist-title {
    margin: 0;
    background: var(--approaches-soft-background-color);
    color: var(--approaches-text-color);
    border-radius: 0;
    padding: 0.6rem 0.82rem;
    font-size: 1.03rem;
    text-transform: lowercase;
  }

  .approach-entry-search-head {
    border: 1px solid rgba(27, 94, 32, 0.18);
    border-radius: 12px;
    background:
      linear-gradient(110deg, rgba(146, 239, 128, 0.16), rgba(255, 255, 255, 1)),
      #fff;
    padding: 0.72rem;
    margin-bottom: 0.75rem;
  }

  .approach-entry-search-head h3 {
    margin: 0;
    color: var(--approaches-text-color);
    font-size: 1.12rem;
  }

  .approach-entry-search-head p {
    margin: 0.36rem 0 0.55rem;
    color: var(--muted-text-2);
    font-size: 0.9rem;
  }

  .approach-entry-search-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.42rem;
  }

  .approach-entry-search-row input {
    border: 1px solid rgba(27, 94, 32, 0.25);
    border-radius: 10px;
    padding: 0.55rem 0.68rem;
    font-size: 0.95rem;
  }

  .approach-entry-search-row button {
    border: 1px solid transparent;
    border-radius: 10px;
    background: var(--approaches-background-color);
    color: var(--approaches-text-color);
    font-size: 0.9rem;
    font-weight: 700;
    padding: 0.52rem 0.7rem;
    cursor: pointer;
  }

  .approach-entry-search-suggested {
    display: flex;
    flex-wrap: wrap;
    gap: 0.32rem;
    margin-top: 0.5rem;
  }

  .approach-entry-search-suggested span {
    border: 1px solid rgba(27, 94, 32, 0.16);
    border-radius: 999px;
    background: #f5fbf4;
    color: var(--approaches-text-color);
    font-size: 0.78rem;
    font-weight: 700;
    padding: 0.16rem 0.52rem;
  }

  .approach-entry-search-count {
    margin: 0.5rem 0 0;
    color: var(--muted-text-2);
    font-size: 0.86rem;
  }

  .approach-entry-search-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.62rem;
  }

  .approach-entry-search-card {
    border: 1px solid rgba(56, 133, 50, 0.24);
    border-radius: 10px;
    padding: 0.62rem;
    background: #fdfffc;
  }

  .approach-entry-search-card h4 {
    margin: 0;
    font-size: 1rem;
    color: var(--quality-text-color);
  }

  .approach-entry-search-card h4 a {
    color: var(--quality-text-color);
    text-decoration: none;
  }

  @media (min-width: 940px) {
    .approach-entry-explorer {
      grid-template-columns: 320px 1fr;
    }

    .approach-entry-search-row {
      grid-template-columns: 1fr auto;
    }

    .approach-entry-search-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>

<script>
  (function () {
    const modeButtons = document.querySelectorAll(".approach-entry-mode-btn");
    const panels = document.querySelectorAll(".approach-entry-panel");

    modeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.target;
        modeButtons.forEach((b) => b.classList.remove("active"));
        panels.forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        const panel = document.getElementById("approach-entry-panel-" + target);
        if (panel) panel.classList.add("active");
      });
    });

    const dimChips = document.querySelectorAll(".approach-entry-dim-chip");
    const resultBlocks = document.querySelectorAll(".approach-entry-results-block");

    dimChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const tag = chip.dataset.tag;
        dimChips.forEach((c) => c.classList.remove("active"));
        resultBlocks.forEach((b) => b.classList.remove("active"));
        chip.classList.add("active");
        const block = document.querySelector('.approach-entry-results-block[data-tag=\"' + tag + '\"]');
        if (block) block.classList.add("active");
      });
    });

    const searchInput = document.getElementById("approach-entry-search-input");
    const searchButton = document.getElementById("approach-entry-search-btn");
    const searchCards = document.querySelectorAll(".approach-entry-search-card");
    const searchCount = document.getElementById("approach-entry-search-count");

    function runSearch() {
      const query = (searchInput.value || "").toLowerCase().trim();
      const terms = query.split(/\\s+/).filter(Boolean);
      let visible = 0;

      searchCards.forEach((card) => {
        const haystack = (card.dataset.search || "").toLowerCase();
        const match = terms.length === 0 || terms.every((term) => haystack.indexOf(term) !== -1);
        card.style.display = match ? "" : "none";
        if (match) visible += 1;
      });

      if (searchCount) {
        searchCount.textContent = visible + " approach" + (visible === 1 ? "" : "es") + " shown";
      }
    }

    if (searchButton) searchButton.addEventListener("click", runSearch);
    if (searchInput) searchInput.addEventListener("input", runSearch);
    runSearch();
  })();
</script>
