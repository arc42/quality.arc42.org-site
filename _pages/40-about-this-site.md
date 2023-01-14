---
layout: page
title: About this site
permalink: /aboutthissite/
order: 25
---

## Support

[INNOQ](https://innoq.com) <span class="innoq-text"><i class="fa-solid fa-heart fa-beat heart"></i></span> supports creation and maintenance of this site.


## Tooling

* This page is based upon [Jekyll](https://jekyllrb.com), a static website generator, using a slightly modified version of the [Ttskch](https://github.com/ttskch/jekyll-ttskch-theme) theme.
* It's maintained on [Github](https://github.com/arc42/quality.arc42.org-site/) and published via github-pages.
* An Alpine based Docker container allows for local build- and test of the site 

## Stats

* build_revision: {{ site.github.build_revision }}
* The site was last built on {{ site.time | date: '%c' }}. 
* It contains:
   -  {{ site.pages | size }} pages 
    -  {{ site.posts | size }} posts (aka quality attributes)
    - {{ site.articles | size }} articles
    - {{ site.scenarios | size }} examples of quality requirements


## About me

![Gernot, avatar](/images/ai-profile-gs-256px.webp){:width="20%"}

I'm:

* happily married with two (grown-up) kids and a few cats in Cologne, Germany,
* fellow at [INNOQ](https://www.innoq.com),
* quite busy coaching and consulting medium and large-scale enterprises on topics around software architecture and methodical software engineering,
* co-founder and maintainer of <a href="https://www.arc42.de">arc42</a>, the template for pragmatic and systematic software architecture documentation,
* founder of <a href="https://www.aim42.org">aim42</a>, the open source framework for systematic _software architecture improvement_,
* active member and working group lead within the <a href="https://www.isaqb.org">iSAQB</a>,
* regular presenter at IT-conferences,
* author and co-author of more than a dozen books on software architecture, patterns, arc, and the like. I'm really sorry - most of these books are written in German. Have a look at <a href="https://www.leanpub.com">Leanpub</a> for some of my English books.
* author of quite a few [articles](https://www.gernotstarke.de/artikel)


## Acknowledgements

* Thanx to Michael Mahlberg, Markus Meuten and Peter Hruschka for suggestions, bug fixes and moral support.
* Thanx to Per Starke for his awesome technical support in things around Liquid and Jekyll.