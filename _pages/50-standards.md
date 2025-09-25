---
layout: page_standards
title: Standards
permalink: /standards/
order: 50
---

{::comment}
Overview of quality standards
{:/comment}

{% assign standards = site.standards %}

{::comment}
Group standards by categories  
{:/comment}

## General
{: .category-header}

{% assign general_standards = "" | split: "," %}
{% for standard in standards %}
  {% if standard.categories contains "general" %}
    {% assign general_standards = general_standards | push: standard %}
  {% endif %}
{% endfor %}

<ul class="posts">
{% for standard in general_standards %}
 <li><i class="fas fa-solid fa-award" style="color: var(--standard-text-color);"></i> <a href="{{standard.url}}">{{standard.title}}</a></li>
{% endfor %}
</ul>

## AI
{: .category-header}

{% assign ai_standards = "" | split: "," %}
{% for standard in standards %}
  {% if standard.categories contains "ai" %}
    {% assign ai_standards = ai_standards | push: standard %}
  {% endif %}
{% endfor %}

<ul class="posts">
{% for standard in ai_standards %}
 <li><i class="fas fa-solid fa-award" style="color: var(--standard-text-color);"></i> <a href="{{standard.url}}">{{standard.title}}</a></li>
{% endfor %}
</ul>

## Safety
{: .category-header}

{% assign safety_standards = "" | split: "," %}
{% for standard in standards %}
  {% if standard.categories contains "safety" %}
    {% assign safety_standards = safety_standards | push: standard %}
  {% endif %}
{% endfor %}

<ul class="posts">
{% for standard in safety_standards %}
 <li><i class="fas fa-solid fa-award" style="color: var(--standard-text-color);"></i> <a href="{{standard.url}}">{{standard.title}}</a></li>
{% endfor %}
</ul>

## Security
{: .category-header}

{% assign security_standards = "" | split: "," %}
{% for standard in standards %}
  {% if standard.categories contains "security" %}
    {% assign security_standards = security_standards | push: standard %}
  {% endif %}
{% endfor %}

<ul class="posts">
{% for standard in security_standards %}
 <li><i class="fas fa-solid fa-award" style="color: var(--standard-text-color);"></i> <a href="{{standard.url}}">{{standard.title}}</a></li>
{% endfor %}
</ul>

## Privacy
{: .category-header}

{% assign privacy_standards = "" | split: "," %}
{% for standard in standards %}
  {% if standard.categories contains "privacy" %}
    {% assign privacy_standards = privacy_standards | push: standard %}
  {% endif %}
{% endfor %}

<ul class="posts">
{% for standard in privacy_standards %}
 <li><i class="fas fa-solid fa-award" style="color: var(--standard-text-color);"></i> <a href="{{standard.url}}">{{standard.title}}</a></li>
{% endfor %}
</ul>

## Data
{: .category-header}

{% assign data_standards = "" | split: "," %}
{% for standard in standards %}
  {% if standard.categories contains "data" %}
    {% assign data_standards = data_standards | push: standard %}
  {% endif %}
{% endfor %}

<ul class="posts">
{% for standard in data_standards %}
 <li><i class="fas fa-solid fa-award" style="color: var(--standard-text-color);"></i> <a href="{{standard.url}}">{{standard.title}}</a></li>
{% endfor %}
</ul>

## Sector-Specific
{: .category-header}

{% assign sector_standards = "" | split: "," %}
{% for standard in standards %}
  {% if standard.categories contains "sector" %}
    {% assign sector_standards = sector_standards | push: standard %}
  {% endif %}
{% endfor %}

<ul class="posts">
{% for standard in sector_standards %}
 <li><i class="fas fa-solid fa-award" style="color: var(--standard-text-color);"></i> <a href="{{standard.url}}">{{standard.title}}</a></li>
{% endfor %}
</ul>

{::comment}
Keep the current complete list as requested
{:/comment}
## All Standards

<ul class="posts">
  {% for standard in standards %}
   <li><i class="fas fa-solid fa-award" style="color: var(--standard-text-color);"></i> <a href="{{standard.url}}">{{standard.title}}</a></li>
  {% endfor %}
</ul>