---
title: "Facial Recognition Bias Mitigation"
tags: [reliable, safe]
related: bias-mitigation, fairness, accountability, transparency
permalink: /requirements/facial-recognition-bias-mitigation
---

<div class="quality-requirement" markdown="1">
#### Context/Background

A facial recognition system is being developed for secure access control in a multinational corporation with employees from diverse demographic backgrounds. Previous facial recognition systems have shown significant disparities in accuracy across different demographic groups, particularly for individuals with darker skin tones and women. The organization is committed to ensuring equitable performance across all demographic groups to prevent discriminatory outcomes and maintain security integrity.

#### Source

The facial recognition algorithm processes images captured by security cameras at entry points and compares them against the employee database to grant or deny access.

#### Metric/Acceptance Criteria

The facial recognition system must:

* Achieve a maximum false non-match rate (FNMR) difference of 1.5% between any demographic groups defined by intersections of gender, age range, and skin tone
* Maintain an overall accuracy rate of at least 98% across all demographic groups
* Demonstrate through documented testing that accuracy disparities between demographic groups have been reduced to within the specified threshold
* Include a demographically balanced training dataset with representation proportional to the global workforce demographics (±5% margin)
* Implement continuous monitoring that automatically flags when performance disparities between demographic groups exceed 2% in production
* Provide transparent reporting of performance metrics across demographic groups in monthly system audits
* Include a fallback authentication mechanism that is triggered automatically when confidence scores fall below a predetermined threshold
* Undergo independent third-party testing for demographic performance disparities before deployment and annually thereafter

</div><br>