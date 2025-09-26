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

|Tag  | Explanation |
|:--- | --- | 
| **[General](#general)** | Broad quality/process standards | 
| **[Safety](#safety)** | Functional safety where malfunctions can harm people/environment/assets | 
| **[Security](#security)** | Information/cyber security, security management and controls | 
| **[Privacy](#privacy)** | Personal data protection and privacy governance and controls; GDPR-compliance. Complements security |
| **[AI](#ai)** | (_artificial intelligence_) AI/ML governance, risk, transparency across the AI lifecycle | 
| **[Data](#data)** | Data quality and measurement characteristics | 
| **[Sector](#sector)** | Sector/vertical-specific standards. |
| **[Coding](#coding)** | Standards related to implementation or coding details.|




{% assign standards = site.standards %}

{::comment}
Group standards by categories  
{:/comment}

<div class="standards-list">
{% include standards-category-section.html category="general" title="General" standards=standards %}

{% include standards-category-section.html category="ai" title="AI" standards=standards %}

{% include standards-category-section.html category="safety" title="Safety" standards=standards %}

{% include standards-category-section.html category="security" title="Security" standards=standards %}

{% include standards-category-section.html category="privacy" title="Privacy" standards=standards %}

{% include standards-category-section.html category="data" title="Data" standards=standards %}

{% include standards-category-section.html category="sector" title="Sector-Specific" standards=standards %}

{% include standards-category-section.html category="coding" title="Coding" standards=standards %}
</div>
