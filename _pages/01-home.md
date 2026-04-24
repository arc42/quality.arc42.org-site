---
layout: default
title: Home
permalink: /
order: 1
---

{% assign qualities = site.qualities | where_exp: "q", "q.alias_of == nil" %}
{% assign synonym_map = site.data.quality-synonyms %}
{% assign synonyms = 0 %}
{% for entry in synonym_map %}
  {% assign synonyms = synonyms | plus: entry[1].size %}
{% endfor %}
{% assign requirements = site.requirements %}
{% assign standards = site.standards %}
{% assign approaches = site.approaches %}
{% assign dimensions = "reliable|Perform specified functions without interruptions or failures;flexible|Adapt to changes in requirements, contexts, or system environment;efficient|Perform within time, capacity and resource parameters;usable|Enable users to work safely, effectively and efficiently;secure|Protect data and defend against attack patterns;safe|Avoid states endangering life, health, or environment;maintainable|Analyze, modify, test and evolve with predictable effort;suitable|Meet stated and implied needs of stakeholders;operable|Easy to deploy, operate, monitor and control" | split: ";" %}

<div class="home-new-page">
  <section class="home-new-splash">
    <p class="home-new-kicker">Quality Driven Architecture</p>
    <h2>Let quality drive architectural decisions</h2>
    <p class="home-new-intro">
      Q42 helps you turn broad quality goals into precise terms, concrete quality requirements,
      and practical solution approaches.
    </p>

    <div class="home-new-entry-grid" aria-label="Main entry points">
      <a class="home-new-entry home-new-entry--quality" href="{{ '/qualities/' | prepend: site.baseurl }}">
        <span class="home-new-entry-icon"><i class="fa fa-gem" aria-hidden="true"></i></span>
        <span class="home-new-entry-intent">Find the right term</span>
        <h3>Quality Characteristics</h3>
        <p>Definitions, aliases, related qualities, standards, and linked requirements.</p>
        <span class="home-new-entry-count">{{ qualities | size }} characteristics, {{ synonyms }} aliases</span>
      </a>

      <a class="home-new-entry home-new-entry--requirement" href="{{ '/requirements/' | prepend: site.baseurl }}">
        <span class="home-new-entry-icon"><i class="fa fa-bullseye" aria-hidden="true"></i></span>
        <span class="home-new-entry-intent">Specify measurable targets</span>
        <h3>Example Requirements</h3>
        <p>Concrete quality scenarios with context, triggers, and acceptance criteria.</p>
        <span class="home-new-entry-count">{{ requirements | size }} examples</span>
      </a>

      <a class="home-new-entry home-new-entry--approach" href="{{ '/approaches/' | prepend: site.baseurl }}">
        <span class="home-new-entry-icon"><i class="fa fa-puzzle-piece" aria-hidden="true"></i></span>
        <span class="home-new-entry-intent">Choose architectural tactics</span>
        <h3>Solution Approaches</h3>
        <p>Patterns, practices, and tactics that enable or improve specific qualities.</p>
        <span class="home-new-entry-count">{{ approaches | size }} approaches</span>
      </a>
    </div>
  </section>

  <section class="home-new-graph">
    <div class="home-new-section-head">
      <div>
        <p class="home-new-section-kicker">Interactive map</p>
        <h3>Quality Graph</h3>
      </div>
      <a class="home-new-graph-link" href="{{ '/full-quality-graph' | prepend: site.baseurl }}">
        <i class="fa fa-expand" aria-hidden="true"></i>
        Open graph
      </a>
    </div>

    <p class="home-new-graph-text">
      Explore qualities, dimensions, requirements, and standards as a connected model.
      Use the full graph when relations matter more than alphabetic lookup.
    </p>

    <div id="q-graph-container"></div>
    <script src="{{ '/assets/js/homepage/main.js' | prepend: site.baseurl }}" defer></script>

    <p class="home-new-graph-note">
      Double-click a node to open its reference page. The full graph provides filtering and layer controls.
    </p>
  </section>

  <section class="home-new-dimensions">
    <div class="home-new-section-head">
      <div>
        <p class="home-new-section-kicker">Second-level navigation</p>
        <h3>Filter by Dimension</h3>
      </div>
      <a class="home-new-muted-link" href="{{ '/dimensions/' | prepend: site.baseurl }}">All dimensions</a>
    </div>

    <div class="home-new-dimension-grid">
      {% for dimension in dimensions %}
        {% assign parts = dimension | split: "|" %}
        {% assign tag = parts[0] %}
        {% assign explanation = parts[1] %}
        {% assign tag_qualities = site.qualities | where_exp: "item", "item.tags contains tag" %}
        {% assign tag_requirements = site.requirements | where_exp: "item", "item.tags contains tag" %}
        {% assign tag_count = tag_qualities.size | plus: tag_requirements.size %}
        {% assign tag_url = '/tag-' | append: tag | append: '/' | prepend: site.baseurl %}
        <a class="home-new-dimension" href="{{ tag_url }}">
          <span class="home-new-dimension-tag">#{{ tag }}</span>
          <span class="home-new-dimension-count">{{ tag_count }}</span>
          <span class="home-new-dimension-text">{{ explanation }}</span>
        </a>
      {% endfor %}
    </div>
  </section>

  <section class="home-new-reference-row">
    <a class="home-new-reference home-new-reference--standards" href="{{ '/standards/' | prepend: site.baseurl }}">
      <span class="home-new-reference-icon"><i class="fa fa-award" aria-hidden="true"></i></span>
      <span>
        <strong>{{ standards | size }} standards</strong>
        <span>Quality models, regulations, and industry standards mapped to Q42.</span>
      </span>
    </a>

    <a class="home-new-reference home-new-reference--howto" href="{{ '/how-to-use-this-site/' | prepend: site.baseurl }}">
      <span class="home-new-reference-icon"><i class="fa fa-compass" aria-hidden="true"></i></span>
      <span>
        <strong>How to use Q42</strong>
        <span>Navigate from quality terms, requirements, examples, or standards.</span>
      </span>
    </a>
  </section>
</div>
