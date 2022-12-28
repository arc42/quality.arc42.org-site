---
layout: page
title: Jekyll Info
permalink: /jekyll-info/
order: 99
---

Debugging Jekyll can be kind of a nightmare...


<ul>
{% assign sorted = site.qualities | sort: 'title'  %}
    {% for item in sorted %}
    <li>{{ item.title }}</li>
{% endfor %}
</ul>

## Site Collection

{{ site.collections }}

## Finding tags

{% assign thisCollection = site.documents %}	
{% assign allCats =  thisCollection | map: 'tags' %}

{% capture category_array %}
  {% for eachCat in allCats %}
    {{ eachCat.name }}|
  {% endfor %}
{% endcapture %}

{% for eachCat in allCats %}
  {% for post in thisCollection %}
    
    {% if post.categories contains eachCat.name %}

      {% assign thisCat = eachCat.name | append: '|' %}

      {% if category_array contains thisCat %}
        {{thisCat}}
      {% endif %}

      {% assign category_array = category_array | remove: thisCat %}
    {% endif %}

  {% endfor %}
{% endfor %}