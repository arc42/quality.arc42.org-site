---
layout: page
title: "Debug: Site Statistics"
permalink: /debug/site-stats
hide: false
---

# Site Statistics and Health Check

This page provides debugging information about the site's content and structure.

## Collection Statistics

### Qualities

- **Total qualities**: {{ site.qualities | size }}
- **Qualities with tags**: {{ site.qualities | where_exp: "item", "item.tags.size > 0" | size }}
- **Qualities with related items**: {{ site.qualities | where_exp: "item", "item.related.size > 0" | size }}
- **Qualities with standards**: {{ site.qualities | where_exp: "item", "item.standards.size > 0" | size }}

### Requirements

- **Total requirements**: {{ site.requirements | size }}
- **Requirements with tags**: {{ site.requirements | where_exp: "item", "item.tags.size > 0" | size }}
- **Requirements with related items**: {{ site.requirements | where_exp: "item", "item.related.size > 0" | size }}

### Standards

- **Total standards**: {{ site.standards | size }}

### Debug Items

- **Debug pages**: {{ site.debug | size }}

## Tag Analysis

### Most Common Tags

{% assign all_tags = "" | split: "" %}
{% for quality in site.qualities %}
{% if quality.tags %}
{% assign all_tags = all_tags | concat: quality.tags %}
{% endif %}
{% endfor %}
{% for requirement in site.requirements %}
{% if requirement.tags %}
{% assign all_tags = all_tags | concat: requirement.tags %}
{% endif %}
{% endfor %}

{% assign tag_counts = all_tags | group_by_exp: "tag", "tag" | sort: "size" | reverse %}

| Tag | Count |
| :-- | :---- |

{% for tag_group in tag_counts limit: 10 %}
| {{ tag_group.name }} | {{ tag_group.size }} |
{% endfor %}

## Debug Test Items

These items are only visible in debug mode:

- **Debug Quality**: [AA Quality](/qualities/aa-quality) - Test quality for debugging
- **Debug Requirement**: [AA Requirement](/requirements/aa-requirement) - Test requirement for debugging
- **Debug Standard**: [AA Standard](/standards/aa-standard) - Test standard for debugging

## Site Health Checks

### Potential Issues

{% assign issues = 0 %}

#### Qualities without tags

{% assign no_tags = site.qualities | where_exp: "item", "item.tags.size == 0" %}
{% if no_tags.size > 0 %}
{% assign issues = issues | plus: 1 %}

- **{{ no_tags.size }} qualities without tags**:
  {% for item in no_tags limit: 5 %}
  - [{{ item.title }}]({{ item.url }})
    {% endfor %}
    {% if no_tags.size > 5 %}
  - ... and {{ no_tags.size | minus: 5 }} more
    {% endif %}
    {% endif %}

#### Requirements without tags

{% assign no_tags_req = site.requirements | where_exp: "item", "item.tags.size == 0" %}
{% if no_tags_req.size > 0 %}
{% assign issues = issues | plus: 1 %}

- **{{ no_tags_req.size }} requirements without tags**:
  {% for item in no_tags_req limit: 5 %}
  - [{{ item.title }}]({{ item.url }})
    {% endfor %}
    {% if no_tags_req.size > 5 %}
  - ... and {{ no_tags_req.size | minus: 5 }} more
    {% endif %}
    {% endif %}

{% if issues == 0 %}
✅ **No issues detected!**
{% else %}
⚠️ **{{ issues }} potential issues found**
{% endif %}

---

_Generated at build time in debug mode only_
