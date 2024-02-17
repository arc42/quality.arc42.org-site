---
layout: page
title: About this Site
permalink: /aboutthissite/
order: 80
---

<!-- Liquid to count number of qualities with no directly related requirements -->
{% assign qualities_with_no_directly_related_requirements = 0 %}
{% assign qualities_unsorted = site.posts | where: "categories", "qualities" %}
{% assign qualities = qualities_unsorted | sort %}
{% assign requirements_unsorted = site.posts | where: "categories", "requirements" %}
{% assign requirements = requirements_unsorted | sort %}
{% for quality in qualities %}
{% assign number = 0 %}
{% for requirement in requirements %}
{% assign check_title = quality.title | downcase %}
{% assign related = requirement.related | split: ", "%}
{% if related contains check_title %}
{% assign number = 1 %}
{% endif %}
{% endfor %}
{% if number == 0 %}
{% assign qualities_with_no_directly_related_requirements = qualities_with_no_directly_related_requirements | plus: 1 %}
{% endif %}
{% endfor %}




## Support

[INNOQ](https://innoq.com) <span class="innoq-text"><i class="fas fa-heart beat heart"></i></span> supports creation and maintenance of this site.
<br>

<div class="ua-background" markdown="1">
>### We stand with the people of Ukraine <span class="ua-text"><i class="fas fa-heart"></i></span><span class="ua-size"><i class="fas fa-heart beat heart"></i></span>
>
>Please assist humanitarian efforts for the Ukrainian people and those affected by the military invasion of Ukraine by supporting international aid organizations, including the [International Committee of the Red Cross](https://www.icrc.org/en).

</div>

## Tooling

* This page is based upon [Jekyll](https://jekyllrb.com), a static website generator, using a modified version of the [Ttskch](https://github.com/ttskch/jekyll-ttskch-theme) theme.
* It's maintained on [Github](https://github.com/arc42/quality.arc42.org-site/) and published via github-pages.
* An [Alpine based Docker](https://github.com/arc42/quality.arc42.org-site/blob/main/Dockerfile) container allows for local build- and test of the site (`docker compose up` after cloning the repo locally)




## About me

![Gernot, avatar](/images/ai-profile-gs-256px.webp){:width="20%"}

I'm:

* happily married with two (grown-up) kids and a few cats in Cologne, Germany,
* fellow at [INNOQ](https://www.innoq.com),
* quite busy coaching and consulting medium and large-scale enterprises on topics around software architecture and methodical software engineering,
* co-founder and maintainer of [arc42](https://www.arc42.org), the template for pragmatic and systematic software architecture documentation,
* founder of [aim42](https://www.aim42.org), the open-source framework for systematic _software architecture improvement_,
* active member and working group lead within the International Software Architecture Qualification Board, [iSAQB](https://www.isaqb.org),
* regular speaker at IT-conferences,
* author and co-author of more than a [dozen books](https://gernotstarke.de/buecher) on software architecture, patterns, arc, and the like. I'm really sorry - most of these books are written in German. Take a look at <a href="https://www.leanpub.com">Leanpub</a> for some of my English books.
* author of quite a few [articles](https://www.gernotstarke.de/artikel)


## Acknowledgements

* Thanx to Michael Mahlberg, Markus Meuten and Peter Hruschka for suggestions, bug fixes and moral support.
* Thanx to Steffen Späthe for his intense reviews and constructive comments concerning the content. 
* Thanx to [Per Starke](https://perstarke-webdev.de/) for his awesome technical support in things around Liquid and Jekyll.
* Thanx to 
  [Remko Plantenga @exde3297](https://github.com/exde3297), 
  [Martin Weck @martinweck](https://github.com/martinweck), 
  [Eberhard Wolff @ewolff](https://github.com/PapaBravo)
  [Paul Boeck @PapaBravo](https://github.com/PapaBravo),
  [Dean de Bree @ddebree](https://github.com/ddebree) 
  for their contributions.

Find the current list of contributors [here](https://github.com/arc42/quality.arc42.org-site/graphs/contributors)

## Stats

* build_revision: {{ site.github.build_revision }}
* The site was last built on {{ site.time | date: '%c' }}. 
* It contains:
   -  {{ site.pages | size }} pages 
    - {{ site.posts | size }} posts (aka quality attributes and/or requirements), 
    - of that {{ qualities_with_no_directly_related_requirements }} qualities [without directly related requirements](/no-directly-related/)
    - {{ site.articles | size }} articles   
  
   

<iframe plausible-embed src="https://plausible.io/share/quality.arc42.org?auth=cjoKlapPdw3czFugGy6jM&embed=true&theme=light" scrolling="no" frameborder="0" loading="lazy" style="width: 1px; min-width: 100%; height: 1600px;"></iframe>
<div style="font-size: 14px; padding-bottom: 14px;">Stats powered by <a target="_blank" style="color: #4F46E5; text-decoration: underline;" href="https://plausible.io">Plausible Analytics</a></div>
<script async src="https://plausible.io/js/embed.host.js"></script>
