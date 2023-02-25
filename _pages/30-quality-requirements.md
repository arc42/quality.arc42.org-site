---
layout: page_requirements
title: Examples of Quality Requirements
permalink: /requirements/
order: 30
---

Here you find some examples of quality requirements. 
Within the Software Engineering literature you might find the term "quality scenario" for such examples. 
That term was coined by authors from the Software Engineering Institute (SEI), especially [Len Bass et. al.](/references/#bass-swa-practice)

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

{% for item in (0..site.tags.size) %}{% unless forloop.last %}
{% capture this_word %}{{ tag_words[item] | strip_newlines }}{% endcapture %}
<a href="/tag-{{ this_word | cgi_escape }}">
<h2>#{{ this_word }}</h2></a>
  <ul class="posts">
    {% assign sorted_posts = site.tags[this_word] | sort: 'title' %}
    {% assign sorted_posts = sorted_posts | where: "categories", "requirements" %}
    {% for post in sorted_posts %}{% if post.title != null %}
    <li> <a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endif %}{% endfor %}
  </ul>
  {% endunless %}{% endfor %}
</div>


