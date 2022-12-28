---
layout: page
title: Qualities
permalink: /qualities/
order: 3
---

Here you find a list of several _qualities_ (meaning: desirable, expected or required properties) of IT systems).


<div id="search-results">
    <hr id="first-hr" class="with-no-margin"/>

    {% assign qualities = site.qualities | sort %}
    {% for post in qualities  %}
    <div class="article-wrapper">
        <article>
            {% include article-header.html page=post link=true share=false %}
        </article>
    </div>
    <hr class="with-no-margin"/>
    {% endfor %}
</div>
