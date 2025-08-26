## Content Analytics {#analytics}

Here we analyze our content, especially the links between content elements.
In the long run we aim at having everything well-connected:

- Every quality is associated with at least one (high-level) property (check: [Qualities without Tag](#qualitieswithouttag))
- Every quality has relations to other qualities (check: [Orphan Qualities](#orphanqualities))
- Every quality has at least one specific requirement (check: [Qualities without Requirements](#qualitieswithoutrequirements))
- The list of related qualities (`related:`) in the header of every quality file contains only existing qualities (check: [No orphan relations for qualties](#opphanrelations))
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

### No orphan relations for qualities {#orphanrelations}

>Explanation: Every quality has a field `related:` in its header, which contains the names of _related qualities_.
>Here we check for `related:` fields containing non-existing entries.

{% assign orphan_relations = "" | split: "," %}
{% assign all_quality_slugs = "" | split: "," %}

{% for quality in site.qualities %}
{% assign quality_slug = quality.permalink | split: "/" | last %}
{% assign all_quality_slugs = all_quality_slugs | push: quality_slug %}
{% endfor %}

{% for quality in site.qualities %}
{% if quality.related %}
{% assign related_list = quality.related | split: ", " %}
{% for related_quality in related_list %}
{% assign trimmed_quality = related_quality | strip %}
{% unless all_quality_slugs contains trimmed_quality %}
{% assign orphan_entry = quality.title | append: " → " | append: trimmed_quality %}
{% assign orphan_relations = orphan_relations | push: orphan_entry %}
{% endunless %}
{% endfor %}
{% endif %}
{% endfor %}

{% if orphan_relations.size == 0 %}
All quality relations reference existing qualities - no orphan relations found.
{% else %}
The following {{ orphan_relations.size }} orphan relations were found (quality → non-existent related quality):

{% for orphan in orphan_relations %}
<i class="fa fa-bolt fa-xs as-bullet" style="color: var(--error-color);"></i>{{ orphan }}<br>
{% endfor %}
{% endif %}


### No standard without qualities

>Every quality standard (like ISO-5055) shall have at least one or more qualities related to it.

{% assign standards_without_qualities = "" | split: "," %}
{% for standard in site.standards %}
  {% assign found_quality = false %}
  {% for quality in site.qualities %}
    {% if quality.standards contains standard.standard_id %}
      {% assign found_quality = true %}
      {% break %}
    {% endif %}
  {% endfor %}
  {% unless found_quality %}
    {% assign standards_without_qualities = standards_without_qualities | push: standard %}
  {% endunless %}
{% endfor %}

{% if standards_without_qualities.size == 0 %}
All standards have at least one quality related to them.
{% else %}
The following {{ standards_without_qualities.size }} standards have no qualities related to them:
<ul>
{% for standard in standards_without_qualities %}
  <li><i class="fa fa-bolt fa-xs as-bullet" style="color: var(--error-color);"></i><a href="{{ standard.url }}">{{ standard.title }}</a></li>
{% endfor %}
</ul>
{% endif %}