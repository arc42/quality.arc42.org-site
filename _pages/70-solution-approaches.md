---
layout: page
title: Solution Approaches
permalink: /approaches/
order: 70
---

Solution approaches are **architectural tactics and patterns** that help achieve specific quality attributes.
They bridge the gap from quality requirements to concrete implementation decisions.

Each approach documents intent, mechanism, supported qualities, and trade-offs.

{% assign valid_tags = site.data.standard_tags.tags | sort %}
{% assign approaches_sorted = site.approaches | sort: "title" %}

<div class="approach-entry">
  <div class="approach-entry-mode-switch">
    <button class="approach-entry-mode-btn active" type="button" data-target="explorer">Dimension Explorer (default)</button>
    <button class="approach-entry-mode-btn" type="button" data-target="dimlist">Dimension List</button>
    <button class="approach-entry-mode-btn" type="button" data-target="search">Keyword Search</button>
  </div>

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
    margin-top: 0.8rem;
  }

  .approach-entry-mode-switch {
    display: inline-flex;
    gap: 0.42rem;
    flex-wrap: wrap;
    border: 1px solid var(--approaches-soft-background-color);
    border-radius: 999px;
    padding: 0.35rem;
    background: #f8fff7;
    margin-bottom: 0.9rem;
  }

  .approach-entry-mode-btn {
    border: 1px solid rgba(27, 94, 32, 0.35);
    border-radius: 999px;
    background: #ffffff;
    color: var(--approaches-text-color);
    font-size: 0.86rem;
    font-weight: 700;
    padding: 0.36rem 0.78rem;
    cursor: pointer;
  }

  .approach-entry-mode-btn.active {
    border-color: transparent;
    background: var(--approaches-background-color);
    color: var(--approaches-text-color);
  }

  .approach-entry-panel {
    display: none;
    border: 1px solid var(--line-soft, #e9f0f6);
    border-radius: 12px;
    background: #ffffff;
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
    border: 1px solid var(--line-soft, #e9f0f6);
    border-radius: 10px;
    padding: 0.7rem;
    background: #fbfefb;
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
    border: 1px solid var(--line-soft, #e9f0f6);
    border-radius: 10px;
    padding: 0.7rem;
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
    border-bottom: 1px solid var(--line-soft, #e9f0f6);
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
    border: 1px solid var(--line-soft, #e9f0f6);
    border-radius: 10px;
    padding: 0.62rem;
    background: #fff;
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
