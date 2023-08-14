---
layout: page_requirements
title: Examples of Quality Requirements
permalink: /requirements/
order: 30
---

Here you find some examples of 
<span style="color: var(--req-text-color)" markdown="1">
<i class="fa fa-lightbulb"></i>
_quality requirements_
</span>
sorted by the
<span style="color: var(--blue-text-color)">
<i class="fa fa-tags"></i>
properties
</span>
they are related to, with 
<span style="color: var(--blue-text-color)">
related qualities
</span>
listed below each requirement. <br>
Within the Software Engineering literature you might find the term "quality scenario" for such examples. 
That term was coined by authors from the Software Engineering Institute (SEI), especially [Len Bass et al.](/references/#bass2021software)

<hr class="with-no-margin"/>

Read more on the **[background of requirements](/articles/specify-quality-requirements)** in our short article.

<hr class="with-no-margin"/>

{% capture site_tags %}{% for tag in site.tags %}{{ tag | first }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endcapture %}
<!-- site_tags: {{ site_tags }} -->
{% assign tag_words = site_tags |  split:',' | sort %}
<!-- tag_words: {{ tag_words }} -->

<div id="tags">
  <ul class="tag-box inline">
  {% for tag in tag_words %}
    <!-- make the tags of the arc42-quality-model stand out -->
    {% if tag == "reliable" or tag == "flexible" or tag=="efficient" or tag == "usable" or tag == "safe" or tag == "secure" or tag == "suitable" or tag == "operable" %}
    <a class="hov tags req" href="/tag-{{ tag | cgi_escape }}"><b>{{ tag }}</b>
       <span>{{ site.tags[tag] | where: "categories", "requirements" | size }}</span></a>
    {% endif %}
  {% endfor %}
  </ul>

{% assign qualities_unsorted = site.posts | where: "categories", "qualities" %}
{% assign qualities = qualities_unsorted | sort %}

{% for item in (0..site.tags.size) %}{% unless forloop.last %}
{% capture this_word %}{{ tag_words[item] | strip_newlines }}{% endcapture %}
<a href="/tag-{{ this_word | cgi_escape }}">
<h2><i class="fa fa-tag fa-xs"></i> #{{ this_word }}</h2></a>
  <ul class="posts">
    {% assign sorted_posts = site.tags[this_word] | sort: 'title' %}
    {% assign sorted_posts = sorted_posts | where: "categories", "requirements" %}
    {% for post in sorted_posts %}{% if post.title != null %}
    <h3 style="color: var(--req-text-color)"><li class="no-bullets"><a style="color: var(--req-text-color)" href="{{ post.url }}"><i class="fa fa-lightbulb fa-xs"></i> {{ post.title }}</a></li></h3>
    {% for quality in qualities %}
        {% assign check_title = quality.title | downcase %}
        {% assign check_title_two = check_title | replace: " ", "-" %}
        {% assign related = post.related | split: ", "%}
        {% if related contains check_title or related contains check_title_two %}
            <li class="related-quality"><a href="{{quality.url}}"> {{quality.title}} </a></li>
        {% endif %}
    {% endfor %}
    {% endif %}{% endfor %}
  </ul>
<hr class="big-sep">
  {% endunless %}{% endfor %}

</div>

