---
layout: page
title: Qualities by Name
permalink: /qualities/
order: 20
---

Here you find a list of several _qualities_ (meaning: desirable, expected or required properties) of IT systems.  
Listed below each quality, you find 
*<i class="fa fa-tags" style="color: #1675b9;"></i> <span style="color: #1675b9;">related quality properties</span>*.


{% assign letter_string = "A" %}
{% assign previous_first_letter = "A" %}

{% assign qualities = site.qualities %}

{% for post in qualities  %}
    {% assign current_first_letter = post.title | slice: 0 %}

 <!-- we need to "upcase" to avoid issues with i18n -->
    {% assign current_first_letter = current_first_letter | upcase %}
    
    {% if current_first_letter != previous_first_letter %}
        {% assign letter_string = letter_string | append: "," %}
        {% assign letter_string = letter_string | append: current_first_letter %}
        {% assign previous_first_letter = current_first_letter %}
    {% endif %}
{% endfor %}

### Jump to specific letter:

{% assign letter_array = letter_string | split: "," %}
{% for letter in letter_array %}
<nobr>
<b><a class="hov" href="{{site.baseurl}}/qualities/#{{letter|slugize}}">{{letter}}</a></b>
</nobr>
{% endfor %}

<div id="search-results" class="qualities-list">
    <hr id="first-hr" class="with-no-margin"/>
    <h2 ID = "A"> &mdash; A &mdash; </h2>
    {% assign previous_first_letter = "A" %}
    {% for post in qualities  %}
      {% assign current_first_letter = post.title | slice: 0 %}
      {% assign current_first_letter = current_first_letter | upcase %}
  
      {% if current_first_letter != previous_first_letter %}
    <h2 ID = {{current_first_letter}}> &mdash; {{current_first_letter}} &mdash; </h2>
    {% endif %}
    {% assign previous_first_letter = current_first_letter %}
    {% include qualities-list.liquid page=post link=true share=false %}
    <hr class="with-no-margin"/>
{% endfor %}
</div>

<style>
  /* Use qualities color scheme for the qualities headers */
  .qualities-list header .panel {
    background-color: var(--quality-background-color) !important;
  }
  .qualities-list header .panel h1,
  .qualities-list header .panel h1 a {
    color: var(--quality-text-color) !important;
  }
</style>
