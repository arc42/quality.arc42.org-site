## Content Analytics {#analytics} 

### Orphan Qualities {#orphanqualities} 

{% assign orphan_qualities = "" | split: "," %} 
{% for quality in site.qualities %} {% unless quality.related %} 
{% assign orphan_qualities = orphan_qualities | push: quality %} 
{% endunless %} 
{% endfor %} 

{% if orphan_qualities.size == 0 %} 
  All qualities in this site have at least one directly related quality defined, so there are currently no orphan qualities. 
{% else %} 
  The following {{ orphan_qualities.size }} qualities have no directly related qualities defined: 

{% for quality in orphan_qualities %} 
- [{{ quality.title }}]({{ quality.permalink }}) 
{% endfor %} 
{% endif %} 


### Qualities without Requirements {#qualitieswithoutrequirements} 
