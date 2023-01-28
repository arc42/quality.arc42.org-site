---
layout: page
title: Qualities by Name
permalink: /qualities/
order: 20
---

Here you find a list of several _qualities_ (meaning: desirable, expected or required properties) of IT systems.


{% assign letter_string = "A" %}
{% assign previous_first_letter = "A" %}

{% assign qualities_unsorted = site.posts | where: "categories", "qualities" %}
{% assign qualities = qualities_unsorted | sort %}

{% for post in qualities  %}
    {% assign current_first_letter = post.title | slice: 0 %}
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

<div id="search-results">
    <hr id="first-hr" class="with-no-margin"/>
    <h2 ID = "A"> &mdash; A &mdash; </h2>
    {% assign previous_first_letter = "A" %}
    {% for post in qualities  %}
    {% assign current_first_letter = post.title | slice: 0 %}
    {% if current_first_letter != previous_first_letter %}
    <h2 ID = {{current_first_letter}}> &mdash; {{current_first_letter}} &mdash; </h2>
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

