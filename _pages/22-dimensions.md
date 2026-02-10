---
layout: page
title: Quality Dimensions
permalink: /properties/
order: 22
---

Dimensions (also known as _tags_ or _labels_) are used to structure the fairly large set of quality characteristics.
The eight top-level dimensions overlap by design and are not orthogonal.

Consider an excerpt of our metamodel:


![Dimensions and quality characteristics](/images/Q42-properties-tags.webp)


### Dimensions and Quality Characteristics

{% assign all_tags = "" | split: "" %}
{% for quality in site.qualities %}
  {% for tag in quality.tags %}
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

### Dimensions and Quality Requirements


{% assign all_tags = "" | split: "" %}
{% for req in site.requirements %}
  {% for tag in req.tags %}
    {% assign all_tags = all_tags | push: tag %}
  {% endfor %}
{% endfor %}


{% assign tag_words_unique = all_tags | uniq | sort %}

<div id="tags">
  <ul class="tag-box inline">
  {% for tag in tag_words_unique %}
    {% assign req_count_for_tag = 0 %}
    {% for requirement in site.requirements %}
      {% if requirement.tags contains tag %}
        {% assign req_count_for_tag = req_count_for_tag | plus: 1 %}
      {% endif %}
    {% endfor %}

    {% if tag == "reliable" or tag == "flexible" or tag=="efficient" or tag == "usable" or tag == "safe" or tag == "secure" or tag == "suitable" or tag == "operable" %}
    <a class="hov tags req" href="/tag-{{ tag | cgi_escape }}"><b>{{ tag }}</b>
       <span>{{ req_count_for_tag }}</span></a>
   
    {% else %}
        <!-- other tags in different color  -->
        <li><a class="hov tags" href="#{{ tag | cgi_escape }}">{{ tag }}
        <span>{{ req_count_for_tag }}</span></a></li>
    {% endif %}
  {% endfor %}
  </ul>
</div>

### Dimensions and Approaches


{% assign all_tags = "" | split: "" %}
{% for approach in site.approaches %}
  {% for tag in approach.tags %}
    {% assign all_tags = all_tags | push: tag %}
  {% endfor %}
{% endfor %}


{% assign tag_words_unique = all_tags | uniq | sort %}

<div id="tags">
  <ul class="tag-box inline">
  {% for tag in tag_words_unique %}
    {% assign approaches_count_for_tag = 0 %}
    {% for approach in site.approaches %}
      {% if approach.tags contains tag %}
        {% assign approaches_count_for_tag = approaches_count_for_tag | plus: 1 %}
      {% endif %}
    {% endfor %}

    {% if tag == "reliable" or tag == "flexible" or tag=="efficient" or tag == "usable" or tag == "safe" or tag == "secure" or tag == "suitable" or tag == "operable" %}
    <a class="hov tags approach" href="/tag-{{ tag | cgi_escape }}"><b>{{ tag }}</b>
       <span>{{ approaches_count_for_tag }}</span></a>

    {% else %}
        <!-- other tags in different color  -->
        <li><a class="hov tags approach" href="#{{ tag | cgi_escape }}">{{ tag }}
        <span>{{ approaches_count_for_tag }}</span></a></li>
    {% endif %}
  {% endfor %}
  </ul>
</div>
