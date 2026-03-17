---
layout: page
title: Quality Characteristics
permalink: /qualities/
---

{% assign canonical_qualities = site.qualities | where_exp: "q", "q.alias_of == nil" | sort: "title" %}
{% assign alias_qualities = site.qualities | where_exp: "q", "q.alias_of != nil" | sort: "title" %}
{% assign quality_tags = "" | split: "" %}
{% for quality in canonical_qualities %}
{% if quality.tags %}
{% assign quality_tags = quality_tags | concat: quality.tags %}
{% endif %}
{% endfor %}
{% assign dimension_tags = quality_tags | uniq | sort %}

<div id="top"></div>

<section id="qualities-explorer" class="qualities-explorer" data-baseurl="{{ site.baseurl }}">
  <div class="qualities-explorer-hero">
    <p class="qualities-explorer-text">
      Here you find quality characteristics (desirable, expected, or required qualities) of IT systems.
      Use <strong>dimension filters</strong> and <strong>A-Z jump links</strong> to
      quickly narrow down this list.
    </p>
    <p class="qualities-explorer-stats">
      We currently explain <strong>{{ canonical_qualities | size }}</strong> canonical qualities, with
      <strong>{{ alias_qualities | size }}</strong> aliases/synonyms, across
      <strong>{{ dimension_tags | size }}</strong> dimensions.
    </p>
  </div>

  <div class="qualities-explorer-panel">
    <div class="qualities-explorer-head">
      <h2>Dimensions</h2>
      <span id="qualities-facet-summary"></span>
    </div>
    <div id="qualities-facets" class="qualities-explorer-facets"></div>
  </div>

  <div class="qualities-explorer-panel">
    <div class="qualities-explorer-head">
      <h2>Jump to Letter</h2>
      <span id="qualities-letters-summary"></span>
    </div>
    <div id="qualities-letter-nav" class="qualities-explorer-letters"></div>
  </div>

  <div class="qualities-explorer-panel">
    <div class="qualities-explorer-head">
      <h2>Quality Characteristics</h2>
      <span id="qualities-results-summary"></span>
    </div>
    <div id="qualities-results" class="qualities-explorer-results"></div>
  </div>

  <noscript>
    <style>
      #qualities-explorer .qualities-explorer-panel {
        display: none;
      }

      #qualities-explorer .qualities-fallback-panel {
        display: block;
      }
    </style>

    {% assign fallback_terms = site.qualities | sort: "title" %}
    <div class="qualities-explorer-panel qualities-fallback-panel">
      <div class="qualities-explorer-head">
        <h2>No-JS Fallback</h2>
        <span>alphabetic list of canonical and alias terms</span>
      </div>

      <div class="qualities-explorer-letters qualities-fallback-letters">
        {% assign previous_letter = "" %}
        {% for term in fallback_terms %}
          {% assign current_letter = term.title | slice: 0 | upcase %}
          {% if current_letter != previous_letter %}
            <a class="qualities-letter-chip" href="#fallback-{{ current_letter | slugify }}">{{ current_letter }}</a>
            {% assign previous_letter = current_letter %}
          {% endif %}
        {% endfor %}
      </div>

      <div class="qualities-fallback-list">
        {% assign previous_letter = "" %}
        {% for term in fallback_terms %}
          {% assign current_letter = term.title | slice: 0 | upcase %}
          {% if current_letter != previous_letter %}
            {% unless forloop.first %}
              <div class="qualities-return-top">
                <a href="#top" title="Return to top"><i class="fa fa-arrow-up" aria-hidden="true"></i> Return to top</a>
              </div>
            {% endunless %}
            <h3 id="fallback-{{ current_letter | slugify }}" class="qualities-letter-heading">&mdash; {{ current_letter }} &mdash;</h3>
            {% assign previous_letter = current_letter %}
          {% endif %}

          <div class="qualities-item{% if term.alias_of %} is-alias{% endif %}">
            <h4 class="qualities-item-title">
              <a href="{{ term.url | prepend: site.baseurl }}">{{ term.title }}</a>
            </h4>

            {% if term.alias_of %}
              {% assign canonical_path = "/qualities/" | append: term.alias_of %}
              {% assign canonical_term = site.qualities | where: "permalink", canonical_path | first %}
              <div class="qualities-alias-meta">
                <span class="qualities-alias-label">alias</span>
                of
                {% if canonical_term %}
                  <a href="{{ canonical_term.url | prepend: site.baseurl }}">{{ canonical_term.title }}</a>
                {% else %}
                  <span>{{ term.alias_of | replace: "-", " " }}</span>
                {% endif %}
              </div>
            {% else %}
              <div class="qualities-item-meta">
                <span>related: {{ term.related | size }}</span>
                <span>standards: {{ term.standards | size }}</span>
              </div>

              {% if term.tags %}
                <div class="qualities-item-tags">
                  <i class="fa fa-tags" aria-hidden="true"></i>
                  {% for tag in term.tags %}
                    <a href="{{ '/tag-' | append: tag | prepend: site.baseurl }}">#{{ tag }}</a>{% unless forloop.last %}, {% endunless %}
                  {% endfor %}
                </div>
              {% endif %}
            {% endif %}
          </div>
        {% endfor %}

        <div class="qualities-return-top">
          <a href="#top" title="Return to top"><i class="fa fa-arrow-up" aria-hidden="true"></i> Return to top</a>
        </div>
      </div>
    </div>

  </noscript>
</section>

<script id="qualities-explorer-data" type="application/json">
[
  {% for quality in canonical_qualities %}
    {% assign canonical_slug = quality.permalink | remove: "/qualities/" | replace: "/", "" %}
    {% assign alias_docs = site.qualities | where: "alias_of", canonical_slug | sort: "title" %}
    {
      "id": {{ canonical_slug | jsonify }},
      "title": {{ quality.title | jsonify }},
      "url": {{ quality.url | prepend: site.baseurl | jsonify }},
      "tags": [
        {% if quality.tags %}
          {% for tag in quality.tags %}
            {{ tag | jsonify }}{% unless forloop.last %}, {% endunless %}
          {% endfor %}
        {% endif %}
      ],
      "relatedCount": {{ quality.related | size }},
      "standardsCount": {{ quality.standards | size }},
      "aliases": [
        {% for alias in alias_docs %}
          {% assign alias_slug = alias.permalink | remove: "/qualities/" | replace: "/", "" %}
          {
            "id": {{ alias_slug | jsonify }},
            "title": {{ alias.title | jsonify }},
            "url": {{ alias.url | prepend: site.baseurl | jsonify }}
          }{% unless forloop.last %}, {% endunless %}
        {% endfor %}
      ]
    }{% unless forloop.last %}, {% endunless %}
  {% endfor %}
]
</script>
<script src="{{ '/assets/js/qualities-explorer.js' | prepend: site.baseurl }}"></script>

<style>
  .qualities-explorer {
    --qx-border: #cddced;
    --qx-surface: #f9fcff;
    --qx-surface-2: #f0f8ff;
    --qx-text: #214564;
    --qx-muted: #536b80;
    --qx-accent: #1675b9;
    --qx-accent-2: #00b8f5;
    --qx-chip: #e8f4ff;
    --qx-chip-text: #1f5e8b;
    --qx-heading-bg: #e9f4ff;
    margin-top: 0.75rem;
  }

  .qualities-explorer-hero {
    border: 1px solid var(--qx-border);
    border-radius: 12px;
    padding: 0.92rem 1rem;
    background:
      radial-gradient(circle at 0% 0%, rgba(65, 165, 234, 0.15), transparent 50%),
      radial-gradient(circle at 100% 100%, rgba(4, 184, 246, 0.13), transparent 52%),
      var(--qx-surface);
  }

  .qualities-explorer-text {
    margin: 0;
    color: var(--qx-muted);
  }

  .qualities-explorer-stats {
    margin: 0.48rem 0 0;
    color: var(--qx-muted);
    font-size: 0.92rem;
    font-weight: 600;
  }

  .qualities-explorer-stats strong {
    color: var(--qx-accent);
  }

  .qualities-explorer-panel {
    margin-top: 0.72rem;
    border: 1px solid var(--qx-border);
    border-radius: 12px;
    background: #fff;
    padding: 0.78rem 0.82rem;
  }

  .qualities-explorer-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.42rem;
    margin-bottom: 0.55rem;
  }

  .qualities-explorer-head h2 {
    margin: 0;
    color: var(--qx-text);
    font-size: 1.04rem;
  }

  .qualities-explorer-head span {
    color: var(--qx-muted);
    font-size: 0.84rem;
  }

  .qualities-explorer-facets,
  .qualities-explorer-letters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.42rem;
  }

  .qualities-facet-chip,
  .qualities-letter-chip {
    border: 1px solid #bcd5ea;
    border-radius: 999px;
    background: var(--qx-chip);
    color: var(--qx-chip-text);
    font-size: 0.82rem;
    font-weight: 700;
    padding: 0.22rem 0.62rem;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.24rem;
  }

  .qualities-facet-chip.active {
    border-color: transparent;
    background: linear-gradient(180deg, #6dd7ff, var(--qx-accent-2));
    color: #00395b;
  }

  .qualities-count {
    font-size: 0.8em;
    opacity: 0.85;
  }

  .qualities-explorer-results {
    display: grid;
    gap: 0.68rem;
  }

  .qualities-fallback-panel {
    margin-top: 0.72rem;
  }

  .qualities-fallback-letters {
    margin-bottom: 0.62rem;
  }

  .qualities-fallback-list {
    border: 1px solid var(--qx-border);
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
  }

  .qualities-letter-section {
    border: 1px solid var(--qx-border);
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
  }

  .qualities-letter-heading {
    margin: 0;
    padding: 0.54rem 0.76rem;
    background: var(--qx-heading-bg);
    color: #325979;
    font-size: 1rem;
    border-bottom: 1px solid var(--qx-border);
    scroll-margin-top: 0.8rem;
  }

  .qualities-letter-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .qualities-item {
    padding: 0.68rem 0.76rem;
    border-top: 1px solid #edf4fb;
  }

  .qualities-item:first-child {
    border-top: 0;
  }

  .qualities-item.is-alias {
    background: #f6f9fc;
    border-left: 3px solid #d4dfe8;
    padding-left: 0.66rem;
  }

  .qualities-item-title {
    margin: 0;
    font-size: 1.12rem;
    line-height: 1.28;
    color: var(--qx-text);
  }

  .qualities-item-title a {
    color: var(--qx-accent);
    text-decoration: none;
    font-weight: 700;
  }

  .qualities-item-title a:hover {
    text-decoration: underline;
  }

  .qualities-item.is-alias .qualities-item-title {
    font-size: 1rem;
  }

  .qualities-item.is-alias .qualities-item-title a {
    color: #5a7388;
  }

  .qualities-item-meta {
    margin-top: 0.22rem;
    color: var(--qx-muted);
    font-size: 0.83rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem;
  }

  .qualities-item-tags {
    margin-top: 0.25rem;
    color: var(--qx-muted);
    font-size: 0.95rem;
  }

  .qualities-item-tags .fa-tags {
    color: var(--qx-accent);
    margin-right: 0.2rem;
  }

  .qualities-item-tags a {
    color: var(--qx-accent);
    text-decoration: none;
    font-weight: 700;
  }

  .qualities-item-tags a:hover {
    text-decoration: underline;
  }

  .qualities-alias-meta {
    margin-top: 0.24rem;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.3rem;
    color: #607789;
    font-size: 0.8rem;
  }

  .qualities-alias-label {
    border-radius: 999px;
    border: 1px solid #ccd9e5;
    background: #e9f0f6;
    color: #647d90;
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    padding: 0.06rem 0.3rem;
  }

  .qualities-alias-meta a {
    color: #4e6a80;
    text-decoration: underline;
    text-decoration-style: dotted;
    text-underline-offset: 2px;
  }

  .qualities-return-top {
    border-top: 1px solid #edf4fb;
    text-align: right;
    padding: 0.62rem 0.76rem;
  }

  .qualities-return-top a {
    display: inline-flex;
    align-items: center;
    gap: 0.34rem;
    color: #60666b;
    font-size: 1.25rem;
    text-decoration: none;
  }

  .qualities-return-top a:hover {
    color: #3f5564;
  }

  .qualities-empty {
    border: 1px dashed var(--qx-border);
    border-radius: 10px;
    padding: 1rem 0.82rem;
    color: var(--qx-muted);
    background: var(--qx-surface-2);
  }

</style>
