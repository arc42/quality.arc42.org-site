---
layout: page
title: About this site
permalink: /aboutthissite/
order: 25
---

## Imprint and Privacy

Imprint and privacy information is contained on its own [page](/imprint/).
 

## You like what you see?

> In case you like what you read here, share your experience with colleagues and friends...

## Support

[INNOQ](https://innoq.com) supports creation and maintenance of this site.


## Tooling
This page is based upon [Jekyll](), a static website generator, using the [TtskchTheme](https://github.com/ttskch/jekyll-ttskch-theme) theme.
It's maintained on [Github](https://github.com/arc42/quality.arc42.org-site/) and published via github-pages.


### Jekyll and Liquid

Some issues occured during the creation of this site.

### Collections, Tags and Categories
Collections have problems with tags, therefore I decided to describe all the "qualities" under `_posts`, instead of making them a collection.

The issue was that the tags on collections-pages are not collected with the `site.tags` variable

### List Posts sorted by Tags

Needed for the "Keywords" page:

{% highlight html %}
{% raw %}

{% capture site_tags %}{% for tag in site.tags %}{{ tag | first }}{% unless forloop.last %},{%endunless %}{% endfor %}{% endcapture %}
{% assign tag_words = site_tags | split:',' | sort %}

<div id="tags">
  <ul class="tag-box inline">
  {% for tag in tag_words %}
    <li><a href="#{{ tag | cgi_escape }}">{{ tag }} <span>{{ site.tags[tag] | size }}</span></a></li>
  {% endfor %}
  </ul>

  {% for item in (0..site.tags.size) %}{% unless forloop.last %}
    {% capture this_word %}{{ tag_words[item] | strip_newlines }}{% endcapture %}
  <h2 id="{{ this_word | cgi_escape }}">{{ this_word }}</h2>
  <ul class="posts">
    {% assign sorted_posts = (site.tags[this_word] | sort_by: 'title' ) | reverse %}
    {% for post in sorted_posts %}{% if post.title != null %}
    <li> <a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endif %}{% endfor %}
  </ul>
  {% endunless %}{% endfor %}
</div>

{% endraw %}
{% endhighlight %}

Thanx to [LanyonM](https://github.com/LanyonM/lanyonm.github.io/blob/master/tags.html)


## About me

I'm:

* happily married with two (grown-up) kids and a few cats in Cologne, Germany,
* fellow at INNOQ,
* quite busy coaching and consulting medium and large-scale enterprises on topics around software architecture and methodical software engineering,
* co-founder and maintainer of <a href="https://arc42.de">arc42</a>, the template for pragmatic and systematic software architecture documentation,
* founder of <a href="https://aim42.org">aim42</a>, the open source framework for systematic _software architecture improvement_,
* active member and working group lead within the <a href="https://isaqb.org">iSAQB</a>,
* regular presenter at IT-conferences,
* author and co-author of more than a dozen books on software architecture, patterns, arc, and the like. I'm really sorry - most of these books are written in German. Have a look at <a href="https://leanpub.com">Leanpub</a> for some of my English books.

