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
| **[General](#general)** ({% assign general_stds = allStandards | where_exp: "std", "std.categories contains 'general'" %}{{ general_stds | size }}) | Broad quality/process standards | {% for std in general_stds %}<span class="std-shortname">[{{ std.shortname }}]({{ std.url }})</span>{% unless forloop.last %} · {% endunless %}{% endfor %} |
| **[Safety](#safety)** ({% assign safety_stds = allStandards | where_exp: "std", "std.categories contains 'safety'" %}{{ safety_stds | size }}) | Functional safety where malfunctions can harm people/environment/assets | {% for std in safety_stds %}<span class="std-shortname">[{{ std.shortname }}]({{ std.url }})</span>{% unless forloop.last %} · {% endunless %}{% endfor %} |
| **[Security](#security)** ({% assign security_stds = allStandards | where_exp: "std", "std.categories contains 'security'" %}{{ security_stds | size }}) | Information/cyber security, security management and controls | {% for std in security_stds %}<span class="std-shortname">[{{ std.shortname }}]({{ std.url }})</span>{% unless forloop.last %} · {% endunless %}{% endfor %} |
| **[Privacy](#privacy)** ({% assign privacy_stds = allStandards | where_exp: "std", "std.categories contains 'privacy'" %}{{ privacy_stds | size }}) | Personal data protection and privacy governance and controls; GDPR-compliance. Complements security | {% for std in privacy_stds %}<span class="std-shortname">[{{ std.shortname }}]({{ std.url }})</span>{% unless forloop.last %} · {% endunless %}{% endfor %} |
| **[AI](#ai)** ({% assign ai_stds = allStandards | where_exp: "std", "std.categories contains 'ai'" %}{{ ai_stds | size }}) | (_artificial intelligence_) AI/ML governance, risk, transparency across the AI lifecycle | {% for std in ai_stds %}<span class="std-shortname">[{{ std.shortname }}]({{ std.url }})</span>{% unless forloop.last %} · {% endunless %}{% endfor %} |
| **[Data](#data)** ({% assign data_stds = allStandards | where_exp: "std", "std.categories contains 'data'" %}{{ data_stds | size }}) | Data quality and measurement characteristics | {% for std in data_stds %}<span class="std-shortname">[{{ std.shortname }}]({{ std.url }})</span>{% unless forloop.last %} · {% endunless %}{% endfor %} |
| **[Sector](#sector)** ({% assign sector_stds = allStandards | where_exp: "std", "std.categories contains 'sector'" %}{{ sector_stds | size }}) | Sector/vertical-specific standards. | {% for std in sector_stds %}<span class="std-shortname">[{{ std.shortname }}]({{ std.url }})</span>{% unless forloop.last %} · {% endunless %}{% endfor %} |
| **[Coding](#coding)** ({% assign coding_stds = allStandards | where_exp: "std", "std.categories contains 'coding'" %}{{ coding_stds | size }}) | Standards related to implementation or coding details.| {% for std in coding_stds %}<span class="std-shortname">[{{ std.shortname }}]({{ std.url }})</span>{% unless forloop.last %} · {% endunless %}{% endfor %} |
| **[Documentation](#documentation)** ({% assign doc_stds = allStandards | where_exp: "std", "std.categories contains 'documentation'" %}{{ doc_stds | size }}) | Standards related to documentation of software or IT systems.| {% for std in doc_stds %}<span class="std-shortname">[{{ std.shortname }}]({{ std.url }})</span>{% unless forloop.last %} · {% endunless %}{% endfor %} |




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
