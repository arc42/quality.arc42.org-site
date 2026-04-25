---
layout: default
title: Home
permalink: /
order: 1
q-graph: true
q_graph_script: /assets/js/homepage/main.js
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

<div class="home-violet">
  <section class="home-violet-hero">
    <div class="home-violet-hero__inner">
      <div class="home-violet-hero__lede">
        <h1>
          Quality drives Architecture
        </h1>
        <p>
          Q42 turns broad quality goals into precise terms, concrete
          requirements, and practical solution approaches: a working
          reference for software architects.
        </p>
      </div>

      <ul class="home-violet-directory" aria-label="Main entry points">
        <li>
          <a href="{{ '/qualities/' | prepend: site.baseurl }}">
            <span class="home-violet-directory__title">
              Quality Characteristics
              <small>Find the right term: definitions, aliases, related qualities, linked standards.</small>
            </span>
            <span class="home-violet-directory__count"><b>{{ qualities | size }}</b> entries, <i>{{ synonyms }} aliases</i></span>
          </a>
        </li>

        <li>
          <a href="{{ '/requirements/' | prepend: site.baseurl }}">
            <span class="home-violet-directory__title">
              Example Requirements
              <small>Specify measurable targets: scenarios with context, triggers, acceptance criteria.</small>
            </span>
            <span class="home-violet-directory__count"><b>{{ requirements | size }}</b> <i>examples</i></span>
          </a>
        </li>

        <li>
          <a href="{{ '/approaches/' | prepend: site.baseurl }}">
            <span class="home-violet-directory__title">
              Solution Approaches
              <small>Choose architectural tactics: patterns and practices that enable specific qualities.</small>
            </span>
            <span class="home-violet-directory__count"><b>{{ approaches | size }}</b> <i>tactics</i></span>
          </a>
        </li>
      </ul>
    </div>

  </section>

  <section class="home-violet-graph">
    <div class="home-violet-graph__inner">
      <div class="home-violet-section-head">
        <div>
          <p class="home-violet-section-head__kicker">Interactive map</p>
          <h2>The quality graph</h2>
        </div>
        <a class="home-violet-graph__link" href="{{ '/full-quality-graph' | prepend: site.baseurl }}">Open graph</a>
      </div>

      <p class="home-violet-graph__note">
        Qualities, dimensions, requirements, and standards as a connected model.
        Use the graph when relations matter more than alphabetic lookup.
      </p>

      <div id="q-graph-container"></div>
    </div>

  </section>
</div>
