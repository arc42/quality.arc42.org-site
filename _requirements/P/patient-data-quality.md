---
title: "Patient Data Quality in Healthcare System"
tags: [reliable, safe]
related: [data-quality, accuracy, completeness, timeliness, integrity]
permalink: /requirements/patient-data-quality
---

<div class="quality-requirement" markdown="1">
#### Context

A healthcare information system manages patient data across multiple departments (emergency, radiology, pharmacy, laboratory) in a large hospital network. The system must ensure high-quality patient data to support clinical decision-making, avoid medication errors, and ensure proper continuity of care. Poor data quality could lead to incorrect diagnoses, inappropriate treatments, or adverse patient outcomes.

#### Trigger

Patient data is entered, updated, and accessed by various healthcare professionals throughout the patient care journey. Data may be manually entered or automatically imported from medical devices and external systems.

#### Acceptance Criteria

The healthcare information system must ensure:

* Patient identification data (name, DOB, medical record number) must have a duplicate detection rate of 99.9% or higher
* Critical clinical data fields (allergies, current medications, diagnoses) must be 100% complete for all active patients
* Laboratory results must be available in the system within 5 minutes of test completion with 99.9% reliability
* Data validation rules must prevent 100% of the following common data entry errors 
  * impossible values (like body temperature, blood pressure) 
  * incorrect formats
  * missing mandatory fields
* All changes to patient data must maintain a complete audit trail with 100% traceability
* Data synchronization between different modules and systems must occur with a maximum latency of 30 seconds
* System must perform automated data quality checks every 4 hours and generate alerts for any records falling below quality thresholds
* Data quality metrics must be monitored and reported daily, with a dashboard showing:
  * Completeness percentage by data category
  * Error rates by department and user role
  * Timeliness of data updates
  * Number of data quality incidents by severity

</div><br>

<div markdown="1" style="font-size: smaller;">
This example was created with help from Anthropic-Claude-Sonnet-3.7 with the following prompt:

```
I want to add an example requirement (under _requirements) for data-quality. 
It shall follow the pattern "Context/Background", "Source", "Metric/Acceptance Criteria" and contain precise metrics 
for acceptance criteria.
```

</div>