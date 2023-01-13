---
layout: page
title: Examples of Quality Requirements
permalink: /scenarios/
order: 6
---

Here you find some examples of quality requirements. 
Within the Software Engineering literature you might find the term "quality scenario" for such examples. 
That term was coined by authors from the Software Engineering Institute (SEI), especially [Len Bass et. al.](/references/#bass-swa-practice)

<hr class="with-no-margin"/>

Read more on the **[background of scenarios](/_articles/06-quality-requirements/)** in our short article.

<hr class="with-no-margin"/>

<div id="search-results">
    <hr id="first-hr" class="with-no-margin"/>

{% assign examples = site.scenarios | sort %}


{% for example in examples %}
   <div class="article-wrapper">
      <article>
         {% include article-header.html page=example link=true share=false %}
       </article>
    <hr class="with-no-margin"/>
  </div>
{% endfor %}


</div>
