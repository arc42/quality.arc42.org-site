---
layout: page
title: Qualities by Name
permalink: /qualities/
order: 20
---

<div id="top"></div>

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
    <div class="return-to-top">
      <a href="#top" title="Return to top"><i class="fa fa-arrow-up"></i></a>
    </div>
    <h2 ID = {{current_first_letter}}> &mdash; {{current_first_letter}} &mdash; </h2>
    {% endif %}
    {% assign previous_first_letter = current_first_letter %}
    {% include qualities-list.liquid page=post link=true share=false %}
    <hr class="with-no-margin"/>
{% endfor %}
    <div class="return-to-top">
      <a href="#top" title="Return to top"><i class="fa fa-arrow-up"></i></a>
    </div>
</div>

<style>
  /* Clean, minimal styling for qualities list */
  .qualities-list .quality-item {
    margin-bottom: 1rem;
    padding: 0.5rem 0;
  }
  
  .qualities-list .quality-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin: 0 0 0.3rem 0;
    color: var(--quality-text-color, #1675b9);
  }
  
  .qualities-list .quality-link {
    color: var(--quality-text-color, #1675b9);
    text-decoration: none;
    font-weight: bold;
  }
  
  .qualities-list .quality-link:hover {
    text-decoration: underline;
  }
  
  .qualities-list .quality-tags {
    font-size: 0.9rem;
    color: #666;
    margin-top: 0.3rem;
  }
  
  .qualities-list .quality-tags .tag {
    color: #1675b9;
    text-decoration: none;
    margin: 0 0.2rem 0 0;
  }
  
  .qualities-list .quality-tags .tag:hover {
    text-decoration: underline;
  }
  
  .return-to-top {
    text-align: right;
    margin: 1rem 0 0.5rem 0;
  }
  
  .return-to-top a {
    display: inline-block;
    font-size: 1.2rem;
    color: #383838;
    text-decoration: none;
    opacity: 0.5;
    transition: opacity 0.2s ease;
  }
  
  .return-to-top a:hover {
    opacity: 1;
    text-decoration: none;
  }
</style>
