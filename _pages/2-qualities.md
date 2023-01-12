---
layout: page
title: Qualities by name
permalink: /qualities/
order: 3
---

Here you find a list of several _qualities_ (meaning: desirable, expected or required properties) of IT systems).


{% assign letter_string = "A" %}
{% assign previous_first_letter = "A" %}

{% assign qualities = site.posts | sort %}

{% for post in qualities  %}
    {% assign current_first_letter = post.title | slice: 0 %}
    {% if current_first_letter != previous_first_letter %}
        {% assign letter_string = letter_string | append: "," %}
        {% assign letter_string = letter_string | append: current_first_letter %}
        {% assign previous_first_letter = current_first_letter %}
    {% endif %}
{% endfor %}

<style>
  a.hov:hover {
    transform: scale(1.25);
  }
</style>

### Jump to a specific letter:

{% assign letter_array = letter_string | split: "," %}
{% for letter in letter_array %}
<nobr>
<b><a class="hov" style="background-color: #AED6F1;
    color: #dd354b;
    padding: 5px 10px;
    border-radius: 11px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    margin-top: 3px;
    margin-bottom: 3px"
    href="{{site.baseurl}}/qualities/#{{letter|slugize}}">{{letter}}</a></b>
</nobr>
{% endfor %}

<div id="search-results">
    <hr id="first-hr" class="with-no-margin"/>
    <h2 ID = "A"> – A – </h2>
    {% assign previous_first_letter = "A" %}
    {% assign qualities = site.posts | sort %}
    {% for post in qualities  %}
    {% assign current_first_letter = post.title | slice: 0 %}
    {% if current_first_letter != previous_first_letter %}
    <h2 ID = {{current_first_letter}}> – {{current_first_letter}} – </h2>
    {% endif %}
    {% assign previous_first_letter = current_first_letter %}
    <div class="article-wrapper">
        <article>
            {% include article-header.html page=post link=true share=false %}
        </article>
    </div>
    <hr class="with-no-margin"/>
    {% endfor %}
</div>

