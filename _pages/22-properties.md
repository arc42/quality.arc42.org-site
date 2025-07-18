---
layout: page
title: Quality Properties
permalink: /properties/
order: 22
---

Properties (also known as _tags_ or _labels_) are used to structure the fairly large set of _qualities_.


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

</div>
