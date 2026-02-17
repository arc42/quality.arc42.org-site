---
layout: default
title: Home
permalink: /
order: 1
---

{% assign qualities = site.qualities %}
{% assign requirements = site.requirements %}
{% assign standards = site.standards %}
{% assign approaches = site.approaches %}
{% assign dimensions = "reliable|Perform specified functions without interruptions or failures;flexible|Adapt to changes in requirements, contexts, or system environment;efficient|Perform within time, capacity and resource parameters;usable|Enable users to work safely, effectively and efficiently;secure|Protect data and defend against attack patterns;safe|Avoid states endangering life, health, or environment;maintainable|Analyze, modify, test and evolve with predictable effort;suitable|Meet stated and implied needs of stakeholders;operable|Easy to deploy, operate, monitor and control" | split: ";" %}

<div class="home-new-page">
  <h2>System and Product Quality, Made Easy</h2>
  <p class="home-new-intro">
    Quality requirements are often broad and hard to operationalize.
    The arc42 quality model Q42 provides a pragmatic structure to navigate qualities, requirements, and standards.
  </p>

  <section class="home-new-hero">
    <h3 class="home-new-hero-title">
      <i class="fa fa-project-diagram" aria-hidden="true"></i>
      Explore Quality Three Ways
    </h3>

    <p class="home-new-hero-text">
      Start with the focused graph for a quick overview, switch to the full graph to inspect deeper relations, or use textual navigation for direct lookup of quality terms.
    </p>

    <div class="home-new-mode-grid" aria-label="Homepage navigation options">
      <a class="home-new-mode is-active" href="#q-graph-container" aria-current="page">
        <span class="home-new-mode-title">
          <i class="fa fa-circle-nodes" aria-hidden="true"></i>
          small-graph
        </span>
        <span class="home-new-mode-desc">Focused overview on this page.</span>
      </a>

      <a class="home-new-mode" href="{{ '/full-quality-graph' | prepend: site.baseurl }}">
        <span class="home-new-mode-title">
          <i class="fa fa-expand" aria-hidden="true"></i>
          full-graph
        </span>
        <span class="home-new-mode-desc">Complete interactive map with filtering.</span>
      </a>

      <a class="home-new-mode" href="{{ '/qualities/' | prepend: site.baseurl }}">
        <span class="home-new-mode-title">
          <i class="fa fa-list" aria-hidden="true"></i>
          textual-navigation
        </span>
        <span class="home-new-mode-desc">Alphabetic list of quality characteristics.</span>
      </a>
    </div>

    <div class="home-new-stats">
      <span class="home-new-stat home-new-stat--quality"><strong>{{ qualities | size }}</strong> qualities</span>
      <span class="home-new-stat home-new-stat--requirement"><strong>{{ requirements | size }}</strong> requirements</span>
      <span class="home-new-stat home-new-stat--standard"><strong>{{ standards | size }}</strong> standards</span>
      <span class="home-new-stat home-new-stat--approach"><strong>{{ approaches | size }}</strong> approaches</span>
    </div>
  </section>

  <div id="q-graph-container"></div>
  <script src="{{ '/assets/js/homepage/main.js' | prepend: site.baseurl }}"></script>

  <p class="home-new-graph-note">
    Double-click a node to open its definition, related qualities, and concrete requirements.
  </p>

  <section class="home-new-dimensions">
    <h3 class="home-new-dimensions-title">
      <i class="fa fa-layer-group" aria-hidden="true"></i>
      Quality Dimensions
    </h3>

    <div class="home-new-dimensions-table-wrap">
      <table class="home-new-dimensions-table">
        <thead>
          <tr>
            <th>Dimension</th>
            <th>What It Covers</th>
          </tr>
        </thead>
        <tbody>
          {% for dimension in dimensions %}
            {% assign parts = dimension | split: "|" %}
            {% assign tag = parts[0] %}
            {% assign explanation = parts[1] %}
            {% assign tag_qualities = site.qualities | where_exp: "item", "item.tags contains tag" %}
            {% assign tag_requirements = site.requirements | where_exp: "item", "item.tags contains tag" %}
            {% assign tag_count = tag_qualities.size | plus: tag_requirements.size %}
            {% assign tag_url = '/tag-' | append: tag | append: '/' | prepend: site.baseurl %}
            <tr>
              <td class="home-new-dimension-cell">
                <a class="home-new-dimension-tag" href="{{ tag_url }}">#{{ tag }}</a>
                <span class="home-new-dimension-count">{{ tag_count }}</span>
              </td>
              <td>{{ explanation }}</td>
            </tr>
          {% endfor %}
        </tbody>
      </table>
    </div>
  </section>

  <p>
    Read more in the <a href="{{ '/articles/arc42-quality-model' | prepend: site.baseurl }}">introduction to the Q42 quality model</a>.
  </p>
</div>
