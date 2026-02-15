---
layout: page
title: Quality Aliases and Synonyms
permalink: /aliases/
order: 45
---

Software quality terminology varies significantly across different standards, industries, and methodologies. This page serves as a terminological bridge, mapping various synonym terms to their canonical definitions within the arc42 quality model. This ensures clarity and consistent understanding, regardless of your background.

<style>
.synonym-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 30px;
}

.synonym-card {
    background: #fdfdfd;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
}

.synonym-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.synonym-canonical {
    font-weight: bold;
    font-size: 1.2em;
    margin-bottom: 10px;
    color: var(--brand-color-blue, #00B8F5);
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 5px;
}

.synonym-list {
    list-style: none;
    padding: 0;
    margin: 0;
    flex-grow: 1;
}

.synonym-item {
    padding: 5px 0;
    color: #666;
    display: flex;
    align-items: center;
}

.synonym-item::before {
    content: "↪";
    margin-right: 8px;
    color: #999;
}

.synonym-footer {
    margin-top: 15px;
    font-size: 0.9em;
    color: #999;
    font-style: italic;
}
</style>

<div class="synonym-grid">
{% assign synonym_map = site.data.quality-synonyms %}
{% for entry in synonym_map %}
  {% assign canonical_slug = entry[0] %}
  {% assign synonyms = entry[1] %}
  
  {% assign canonical_path = "/qualities/" | append: canonical_slug %}
  {% assign canonical_page = site.qualities | where: "permalink", canonical_path | first %}
  
  <div class="synonym-card">
    <div class="synonym-canonical">
      {% if canonical_page %}
        <a href="{{ canonical_page.permalink }}">{{ canonical_page.title }}</a>
      {% else %}
        {{ canonical_slug | capitalize | replace: "-", " " }}
      {% endif %}
    </div>
    <ul class="synonym-list">
      {% for synonym_slug in synonyms %}
        {% assign synonym_path = "/qualities/" | append: synonym_slug %}
        {% assign synonym_page = site.qualities | where: "permalink", synonym_path | first %}
        <li class="synonym-item">
          {% if synonym_page %}
            <a href="{{ synonym_page.permalink }}">{{ synonym_page.title }}</a>
          {% else %}
            {{ synonym_slug | capitalize | replace: "-", " " }}
          {% endif %}
        </li>
      {% endfor %}
    </ul>
    <div class="synonym-footer">
      Canonical concept for {{ synonyms.size }} alternative term{% if synonyms.size > 1 %}s{% endif %}
    </div>
  </div>
{% endfor %}
</div>
