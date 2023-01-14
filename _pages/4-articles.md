---
layout: page
title: Background on "Quality"
permalink: /articles/
order: 10
---

Here you find a list of some background articles about _quality_, quality-models, the ISO-25010 standard and quality requirements.


<div id="search-results">
    <hr id="first-hr" class="with-no-margin"/>

{% assign articles = site.articles | sort %}


{% for article in articles %}
   <div class="article-wrapper">
      <article>
         {% include article-header.html page=article link=true share=false %}
       </article>
    <hr class="with-no-margin"/>
  </div>
{% endfor %}


</div>
