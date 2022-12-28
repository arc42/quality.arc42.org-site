---
layout: page
title: Tags
permalink: /tags/
order: 2
share: false
---

## flexible

<ul>

{% assign flexible = site.qualities | where_exp: "qualities", "qualities.tags contains 'flexible'" %}

</ul>


## reliable

{{ assign reliables = site.qualities |  where_exp: "qualities", "qualities.tags contains 'reliable'" }}



