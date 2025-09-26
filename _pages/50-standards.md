---
layout: page_standards
title: Standards
permalink: /standards/
order: 50
---

{::comment}
Overview of quality standards
{:/comment}

Overview of standards related to quality.
These standards are categorized (aka _tagged_) as follows:

|Tag  | Explanation |
|:--- | --- | 
| **[General](#general)** | Broad quality/process standards | 
| **[Safety](#safety)** | Functional safety where malfunctions can harm people/environment/assets | 
| **[Security](#security)** | Information/cyber security, security management and controls | 
| **[Privacy](#privacy)** | Personal data protection and privacy governance and controls; GDPR-compliance. Complements security |
| **[AI](#ai)** | (_artificial intelligence_) AI/ML governance, risk, transparency across the AI lifecycle | 
| **[Data](#data)** | Data quality and measurement characteristics | 
| **[Sector](#sector)** | Sector/vertical-specific standards. |
| **[Coding](#coding)** | Standards related to implementation or coding details.|




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
 <li><i class="fas fa-solid fa-award" style="color: var(--standard-text-color);"></i> <a href="{{standard.url}}">{{standard.title}}</a>
   {% if standard.categories and standard.categories.size > 0 %}
     <span class="standard-categories">
       <i class="fa fa-tags" style="color: #1675b9;"></i>
       {% for category in standard.categories %}
         <span class="category">#{{ category }}</span>{% unless forloop.last %}, {% endunless %}
       {% endfor %}
     </span>
   {% endif %}
 </li>
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
 <li><i class="fas fa-solid fa-award" style="color: var(--standard-text-color);"></i> <a href="{{standard.url}}">{{standard.title}}</a>
   {% if standard.categories and standard.categories.size > 0 %}
     <span class="standard-categories">
       <i class="fa fa-tags" style="color: #1675b9;"></i>
       {% for category in standard.categories %}
         <span class="category">#{{ category }}</span>{% unless forloop.last %}, {% endunless %}
       {% endfor %}
     </span>
   {% endif %}
 </li>
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
 <li><i class="fas fa-solid fa-award" style="color: var(--standard-text-color);"></i> <a href="{{standard.url}}">{{standard.title}}</a>
   {% if standard.categories and standard.categories.size > 0 %}
     <span class="standard-categories">
       <i class="fa fa-tags" style="color: #1675b9;"></i>
       {% for category in standard.categories %}
         <span class="category">#{{ category }}</span>{% unless forloop.last %}, {% endunless %}
       {% endfor %}
     </span>
   {% endif %}
 </li>
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
 <li><i class="fas fa-solid fa-award" style="color: var(--standard-text-color);"></i> <a href="{{standard.url}}">{{standard.title}}</a>
   {% if standard.categories and standard.categories.size > 0 %}
     <span class="standard-categories">
       <i class="fa fa-tags" style="color: #1675b9;"></i>
       {% for category in standard.categories %}
         <span class="category">#{{ category }}</span>{% unless forloop.last %}, {% endunless %}
       {% endfor %}
     </span>
   {% endif %}
 </li>
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
 <li><i class="fas fa-solid fa-award" style="color: var(--standard-text-color);"></i> <a href="{{standard.url}}">{{standard.title}}</a>
   {% if standard.categories and standard.categories.size > 0 %}
     <span class="standard-categories">
       <i class="fa fa-tags" style="color: #1675b9;"></i>
       {% for category in standard.categories %}
         <span class="category">#{{ category }}</span>{% unless forloop.last %}, {% endunless %}
       {% endfor %}
     </span>
   {% endif %}
 </li>
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
 <li><i class="fas fa-solid fa-award" style="color: var(--standard-text-color);"></i> <a href="{{standard.url}}">{{standard.title}}</a>
   {% if standard.categories and standard.categories.size > 0 %}
     <span class="standard-categories">
       <i class="fa fa-tags" style="color: #1675b9;"></i>
       {% for category in standard.categories %}
         <span class="category">#{{ category }}</span>{% unless forloop.last %}, {% endunless %}
       {% endfor %}
     </span>
   {% endif %}
 </li>
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
 <li><i class="fas fa-solid fa-award" style="color: var(--standard-text-color);"></i> <a href="{{standard.url}}">{{standard.title}}</a>
   {% if standard.categories and standard.categories.size > 0 %}
     <span class="standard-categories">
       <i class="fa fa-tags" style="color: #1675b9;"></i>
       {% for category in standard.categories %}
         <span class="category">#{{ category }}</span>{% unless forloop.last %}, {% endunless %}
       {% endfor %}
     </span>
   {% endif %}
 </li>
{% endfor %}
</ul>

## Coding
{: .category-header}

{% assign coding_standards = "" | split: "," %}
{% for standard in standards %}
  {% if standard.categories contains "coding" %}
    {% assign coding_standards = coding_standards | push: standard %}
  {% endif %}
{% endfor %}

<ul class="posts">
{% for standard in coding_standards %}
 <li><i class="fas fa-solid fa-award" style="color: var(--standard-text-color);"></i> <a href="{{standard.url}}">{{standard.title}}</a>
   {% if standard.categories and standard.categories.size > 0 %}
     <span class="standard-categories">
       <i class="fa fa-tags" style="color: #1675b9;"></i>
       {% for category in standard.categories %}
         <span class="category">#{{ category }}</span>{% unless forloop.last %}, {% endunless %}
       {% endfor %}
     </span>
   {% endif %}
 </li>
{% endfor %}
</ul>

<style>
.standard-categories {
  display: inline-block;
  margin-left: 1em;
  font-size: 0.9em;
  color: #666;
}

.standard-categories .category {
  color: #1675b9;
  font-weight: normal;
  margin-left: 0.3em;
}

.standard-categories .fa-tags {
  margin-right: 0.3em;
}
</style>
