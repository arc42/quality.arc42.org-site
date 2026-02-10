---
layout: page_requirements
title: Examples of Quality Requirements
permalink: /requirements/
order: 30
---

Here you find <span style="color: var(--req-text-color)" markdown="1">
<i class="fa fa-bullseye"></i> _quality requirements_ </span>
sorted by <span style="color: var(--blue-text-color)">
<i class="fa fa-tags"></i> dimensions (tags) </span>. <br>

Within the Software Engineering literature you might find the term "quality scenario" for such examples.
That term was coined by authors from the Software Engineering Institute (SEI), especially [Len Bass et al.](/references/#bass2021software)

<hr class="with-no-margin"/>

Read more on the **[background of requirements](/articles/specify-quality-requirements)** in our short article.

<hr class="with-no-margin"/>

{% assign valid_tags = site.data.standard_tags.tags | sort%}

## Dimensions and Quality Requirements

<div id="tags">
  <ul class="tag-box inline">
  {% for tag in valid_tags %}
    {% assign req_count_for_tag = 0 %}
    {% for requirement in site.requirements %}
      {% if requirement.tags contains tag %}
        {% assign req_count_for_tag = req_count_for_tag | plus: 1 %}
      {% endif %}
    {% endfor %}

       <a class="hov tags" href="/tag-{{ tag | cgi_escape }}"><b>{{ tag }}</b>
       <span>{{ req_count_for_tag }}</span></a>

{% endfor %}

  </ul>
</div>

<div>
{% for tag in site.data.standard_tags.tags %}
  <h2>Quality Requirements tagged with {{ tag }}</h2>
  
    <ul class="posts no-bullets">
    {% for requirement in site.requirements %}
       {% if requirement.tags contains tag %}
           <li><a class="reqs" href="{{requirement.permalink}}"><i class="fa fa-bullseye fa-xs as-bullet" style="color: var(--req-text-color);"> </i> {{ requirement.title }}</a></li>
          
       {% endif %}
   {% endfor %}
   </ul>
 {% endfor %}
</div>
