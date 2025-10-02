---
layout: page_standards
title: Standards
permalink: /standards/
order: 50
---

{::comment}
Overview of quality standards
{:/comment}

Overview of standards related to quality.
These standards are categorized (aka _tagged_) as follows:

{% assign allStandards = site.standards %}

|Tag  | Explanation | Standards |
|:--- | --- | --- |
| **[General](#general)** (**{% include count-standards-per-category.liquid category="general" %}**) | Broad quality/process standards | {% assign general_stds = allStandards | where_exp: "std", "std.categories contains 'general'" %}{% for std in general_stds %}<span class="std-shortname">[{{ std.shortname }}]({{ std.url }})</span>{% unless forloop.last %} · {% endunless %}{% endfor %} |
| **[Safety](#safety)** (**{% include count-standards-per-category.liquid category="safety" %}**) | Functional safety where malfunctions can harm people/environment/assets | {% assign safety_stds = allStandards | where_exp: "std", "std.categories contains 'safety'" %}{% for std in safety_stds %}<span class="std-shortname">[{{ std.shortname }}]({{ std.url }})</span>{% unless forloop.last %} · {% endunless %}{% endfor %} |
| **[Security](#security)** (**{% include count-standards-per-category.liquid category="security" %}**) | Information/cyber security, security management and controls | {% assign security_stds = allStandards | where_exp: "std", "std.categories contains 'security'" %}{% for std in security_stds %}<span class="std-shortname">[{{ std.shortname }}]({{ std.url }})</span>{% unless forloop.last %} · {% endunless %}{% endfor %} |
| **[Privacy](#privacy)** (**{% include count-standards-per-category.liquid category="privacy" %}**) | Personal data protection and privacy governance and controls; GDPR-compliance. Complements security | {% assign privacy_stds = allStandards | where_exp: "std", "std.categories contains 'privacy'" %}{% for std in privacy_stds %}<span class="std-shortname">[{{ std.shortname }}]({{ std.url }})</span>{% unless forloop.last %} · {% endunless %}{% endfor %} |
| **[AI](#ai)** (**{% include count-standards-per-category.liquid category="ai" %}**) | (_artificial intelligence_) AI/ML governance, risk, transparency across the AI lifecycle | {% assign ai_stds = allStandards | where_exp: "std", "std.categories contains 'ai'" %}{% for std in ai_stds %}<span class="std-shortname">[{{ std.shortname }}]({{ std.url }})</span>{% unless forloop.last %} · {% endunless %}{% endfor %} |
| **[Data](#data)** (**{% include count-standards-per-category.liquid category="data" %}**) | Data quality and measurement characteristics | {% assign data_stds = allStandards | where_exp: "std", "std.categories contains 'data'" %}{% for std in data_stds %}<span class="std-shortname">[{{ std.shortname }}]({{ std.url }})</span>{% unless forloop.last %} · {% endunless %}{% endfor %} |
| **[Sector](#sector)** (**{% include count-standards-per-category.liquid category="sector" %}**) | Sector/vertical-specific standards. | {% assign sector_stds = allStandards | where_exp: "std", "std.categories contains 'sector'" %}{% for std in sector_stds %}<span class="std-shortname">[{{ std.shortname }}]({{ std.url }})</span>{% unless forloop.last %} · {% endunless %}{% endfor %} |
| **[Coding](#coding)** (**{% include count-standards-per-category.liquid category="coding" %}**) | Standards related to implementation or coding details.| {% assign coding_stds = allStandards | where_exp: "std", "std.categories contains 'coding'" %}{% for std in coding_stds %}<span class="std-shortname">[{{ std.shortname }}]({{ std.url }})</span>{% unless forloop.last %} · {% endunless %}{% endfor %} |
| **[Documentation](#documentation)** (**{% include count-standards-per-category.liquid category="documentation" %}**) | Standards related to documentation of software or IT systems.| {% assign doc_stds = allStandards | where_exp: "std", "std.categories contains 'documentation'" %}{% for std in doc_stds %}<span class="std-shortname">[{{ std.shortname }}]({{ std.url }})</span>{% unless forloop.last %} · {% endunless %}{% endfor %} |




{::comment}
Group standards by categories  
{:/comment}

{% include standards-category-section.liquid category="general" title="General" standards=allStandards %}

{% include standards-category-section.liquid category="ai" title="AI" standards=allStandards %}

{% include standards-category-section.liquid category="safety" title="Safety" standards=allStandards %}

{% include standards-category-section.liquid category="security" title="Security" standards=allStandards %}

{% include standards-category-section.liquid category="privacy" title="Privacy" standards=allStandards %}

{% include standards-category-section.liquid category="data" title="Data" standards=allStandards %}

{% include standards-category-section.liquid category="sector" title="Sector-Specific" standards=allStandards %}

{% include standards-category-section.liquid category="coding" title="Coding" standards=allStandards %}

{% include standards-category-section.liquid category="documentation" title="Documentation" standards=allStandards %}
