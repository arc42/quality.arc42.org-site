---
layout: page
title: Quality Properties
permalink: /properties/
order: 22
---

{% capture site_tags %}{% for tag in site.tags %}{{ tag | first }}{% unless forloop.last %},{% endunless %}{%
endfor %}{% endcapture %}
<!-- site_tags: {{ site_tags }} -->
{% assign tag_words = site_tags | split:',' | sort %}
<!-- tag_words: {{ tag_words }} -->

{% assign tag_words_unique = tag_words | uniq %}

{% assign site_tags = tag_words_unique | join: ',' %}

<div id="tags">
  <ul class="tag-box inline">
  {% for tag in tag_words_unique %}
    <!-- make the tags of the arc42-quality-model stand out -->
    {% if tag == "reliable" or tag == "flexible" or tag=="efficient" or tag == "usable" or tag == "safe" or tag == "secure" or tag == "suitable" or tag == "operable" %}
    <a class="hov tags" href="{{ site.baseurl }}/tag-{{ tag | cgi_escape }}"><b>{{ tag }}</b>
       <span>{{ site.tags[tag] | where: "categories", "qualities" | size }}</span></a>
    {% else %}
        <!-- other tags in different color  -->
        <li><a class="hov tags" href="#{{ tag | cgi_escape }}">{{ tag }}
        <span>{{ site.tags[tag] | where: "categories", "qualities" | size }}</span></a></li>
    {% endif %}
  {% endfor %}
  </ul>

{% assign tag_count = tag_words_unique | size %}

{% for item in (0..tag_count) %}{% unless forloop.last %}
{% capture this_word %}{{ tag_words[item] | strip_newlines }}{% endcapture %}
<a href="{{ site.baseurl }}/tag-{{ this_word | cgi_escape }}">
<h2>#{{ this_word }}</h2></a>
  <ul class="posts">
    {% assign sorted_posts = site.tags[this_word] | sort_by: 'title'  | reverse %}
    {% assign sorted_posts = sorted_posts | where: "categories", "qualities" %}
    {% for post in sorted_posts %}{% if post.title != null %}
    <li> <a href="{{ post.url | prepend: site.baseUrl }}">{{ post.title }}</a></li>
    {% endif %}{% endfor %}
  </ul>
  {% endunless %}{% endfor %}
</div>
