# Modularize and Improve Layout Files

We have three major collections (_qualities, _requirements, _standards), all of which use a predefined layout (defined in defaults in config.yaml) named qualities, requirements and standards.

All these layouts are based upon default.html

## Problem with this approach

all these layouts include article-header.html,
which itself contains a difficult-to-understand clause:

```
<div class="panel{% if page.collection == 'qualities' or page.name contains 'tag-' or page.name == '22-properties.md' %} quality-header{% elsif page.collection == 'requirements' %} requirements-header{% elsif page.collection == 'standards' %} standards-header{% endif %}">
```

I'd prefer to have a better separation of concern.

## Un-Needed liquid-if
As the site.author variable will never be set, the if-statement `{{ if site.author }}`
can be removed.

## Improvement request

* Please propose improvements for the layout file structure and -separation.

