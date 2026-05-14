---
layout: page
title: Background on Quality
permalink: /articles/
order: 80
hide: true
no_layout_header: true
---

{% capture articles_meta %}<b>{{ site.articles | size }}</b> background articles.{% endcapture %}

{% include section-hero.liquid
  section="article"
  title="Background on Quality"
  lede="Longer-form reading on quality models, the ISO 25010 standard, and the thinking behind quality requirements."
  meta=articles_meta %}

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
