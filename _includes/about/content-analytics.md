## Content Analytics {#analytics} 

Here we analyze our content, especially the links between content elements.
In the long run we aim at having everything well-connected:

- Every quality is associated with at least one (high-level) property (check: [Qualities without Tag](#qualitieswithouttag))
- Every quality has relations to other qualities (check: [Orphan Qualities](#orphanqualities))
- Every quality has at least one specific requirement (check: [Qualities without Requirements](#qualitieswithoutrequirements))
- Every standard relates to one or multiple qualities (currently not checked)

### Qualities without Tag (aka _property_)

{% assign notag_qualities = "" | split: "," %} 
{% for quality in site.qualities %} 
   {% assign tags_num = (quality.tags | size) %}
     {% if tags_num <= 0 %}
       {% assign notag_qualities = notag_qualities | push: quality %}      
     {% endif %}
{% endfor %} 

{% if notag_qualities.size == 0 %} 
  All qualities in this site have at least one tag defined. 
{% else %} 
  The following {{ notag_qualities.size }} qualities have no tag defined: 

{% for quality in notag_qualities %} 
   <a href="{{quality.permalink}}"><i class="fa fa-bolt fa-xs as-bullet" style="color: var(--error-color);"></i>{{ quality.title }}</a> <br>
{% endfor %} 
{% endif %} 


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
  <a href="{{quality.permalink}}"><i class="fa fa-bolt fa-xs as-bullet" style="color: var(--error-color);"></i>{{ quality.title }}</a><br>{% endfor %} 
{% endif %} 


### Qualities without Requirements {#qualitieswithoutrequirements} 


{% assign unreferenced_qualities = "" | split: "," %}
{% for quality in site.qualities %}
{% assign quality_slug = quality.permalink | split: "/" | last %}
{% assign found_reference = false %}

{% for requirement in site.requirements %}
{% if requirement.related %}
{% assign related_list = requirement.related | split: ", " %}
{% for related_quality in related_list %}
{% assign trimmed_quality = related_quality | strip %}
{% if trimmed_quality == quality_slug %}
{% assign found_reference = true %}
{% break %}
{% endif %}
{% endfor %}
{% endif %}
{% if found_reference %}
{% break %}
{% endif %}
{% endfor %}

{% unless found_reference %}
{% assign unreferenced_qualities = unreferenced_qualities | push: quality %}
{% endunless %}
{% endfor %}

The following {{ unreferenced_qualities.size }} qualities currently have no requirements directly related to them:

{% for quality in unreferenced_qualities %}[{{ quality.title }}]({{ quality.permalink }}), {% endfor %}
