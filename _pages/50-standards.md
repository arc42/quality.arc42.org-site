---
layout: page_standards
title: Standards
permalink: /standards/
order: 50
---

{::comment}
Overview of quality standards
{:/comment}

An overview of standards related to quality.
These standards are categorized (aka _tagged_) as follows:

 Tag | Explanation |
| --- | --- | 
| general | Broad quality/process standards not tied to a specific risk domain | 

| safety | Functional safety where malfunctions can harm people/environment/assets | IEC 61508, ISO 26262, IEC 62304, DO-178C |
| security | Information/cyber security (CIA), security management and controls | ISO 27001, IEC 62443, NIST 800-53, ISO 15408, PCI-DSS |
| privacy | Personal data protection and privacy governance | GDPR-aligned, privacy controls; complements security |
| ai | AI/ML governance, risk, transparency across the AI lifecycle | ISO/IEC 42001, ISO/IEC 22989 |
| data | Data quality and measurement characteristics | ISO 25024 (data quality), ISO 25022 (measurement) |
| sector | Sector/vertical-specific interoperability or domain scope | HL7 (health), PCI-DSS (payments), MISRA C (automotive) |


{% assign standards = site.standards %}


<ul class="posts">
  {% for standard in standards %}
   <li><i class="fas fa-solid fa-award" style="color: var(--standard-text-color);"></i> <a href="{{standard.url}}">{{standard.title}}</a></li>
  {% endfor %}
</ul>


