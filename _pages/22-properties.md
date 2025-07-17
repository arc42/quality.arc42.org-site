---
layout: page
title: Quality Properties
permalink: /properties/
order: 22
---

{% assign all_tags = "" | split: "" %}
{% for quality in site.qualities %}
  {% for tag in quality.tags %}
    {% assign all_tags = all_tags | push: tag %}
  {% endfor %}
{% endfor %}
{% for requirement in site.requirements %}
  {% for tag in requirement.tags %}
    {% assign all_tags = all_tags | push: tag %}
  {% endfor %}
{% endfor %}
{% assign tag_words_unique = all_tags | uniq | sort %}

<div id="tags">
  <ul class="tag-box inline">
  {% for tag in tag_words_unique %}
    {% assign qualities_count_for_tag = 0 %}
    {% for quality in site.qualities %}
      {% if quality.tags contains tag %}
        {% assign qualities_count_for_tag = qualities_count_for_tag | plus: 1 %}
      {% endif %}
    {% endfor %}
    <!-- make the tags of the arc42-quality-model stand out -->
    {% if tag == "reliable" or tag == "flexible" or tag=="efficient" or tag == "usable" or tag == "safe" or tag == "secure" or tag == "suitable" or tag == "operable" %}
    <a class="hov tags" href="/tag-{{ tag | cgi_escape }}"><b>{{ tag }}</b>
       <span>{{ qualities_count_for_tag }}</span></a>
    {% else %}
        <!-- other tags in different color  -->
        <li><a class="hov tags" href="#{{ tag | cgi_escape }}">{{ tag }}
        <span>{{ qualities_count_for_tag }}</span></a></li>
    {% endif %}
  {% endfor %}
  </ul>

{% assign tag_count = tag_words_unique | size %}

  {% for tag in tag_words_unique %}
    {% capture this_word %}{{ tag | strip_newlines }}{% endcapture %}
  <a href="/tag-{{ this_word | cgi_escape }}">
  <h2>#{{ this_word }}</h2></a>
  <ul class="posts">
    {% assign sorted_posts = site.tags[this_word] | sort_by: 'title'  | reverse %}
    {% assign sorted_posts = sorted_posts | where: "collection", "qualities" %}
    {% for post in sorted_posts %}{% if post.title != null %}
    <li> <a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endif %}{% endfor %}
  </ul>
  {% endfor %}
</div>
