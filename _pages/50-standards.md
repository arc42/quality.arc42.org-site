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


|Category  | Explanation | Standards |
|:--- | --- | --- |
{% include standards-category-row.liquid category="general" title="General" explanation="Broad quality/process standards" %}
{% include standards-category-row.liquid category="safety" title="Safety" explanation="Functional safety where malfunctions can harm people/environment/assets" %}
{% include standards-category-row.liquid category="security" title="Security" explanation="Information/cyber security, security management and controls" %}
{% include standards-category-row.liquid category="privacy" title="Privacy" explanation="Personal data protection and privacy governance and controls; GDPR-compliance. Complements security" %}
{% include standards-category-row.liquid category="ai" title="AI" explanation="(_artificial intelligence_) AI/ML governance, risk, transparency across the AI lifecycle" %}
{% include standards-category-row.liquid category="data" title="Data" explanation="Data quality and measurement characteristics" %}
{% include standards-category-row.liquid category="sector" title="Sector" explanation="Sector/vertical-specific standards." %}
{% include standards-category-row.liquid category="coding" title="Coding" explanation="Standards related to implementation or coding details." %}
{% include standards-category-row.liquid category="documentation" title="Documentation" explanation="Standards related to documentation of software or IT systems." %}




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
