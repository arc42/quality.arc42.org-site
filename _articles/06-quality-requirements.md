---
layout: page
title: "How to specify quality requirements"
permalink: /articles/specify-quality-requirements
---

{% assign requirement_posts = site.requirements %}

**Quality** is such a vague and broad term that it needs clarification for system development projects.

Consider the following examples of quality requirements:

>* An authenticated user requests generation of the daily sales report in PDF format via the graphical user interface. The system generates this report in less than 10 seconds.
>* When a user configures a health insurance contract, the system calculates a price estimate based on the currently available information. This estimate must be within a ±15% margin relative to the final price.
>* The user registration service must be available 7x24h 99%.
>* A new insurance tariff can be implemented in the system in less than 10 days.
>* A service crashed at runtime. It can be restarted to a fully operational state in less than 30 seconds.
>
>[Starke+2021, p. 141](/references/#starke2021software)

These sentences, in natural language, describe requirements or expectations of stakeholders in a quite specific and measurable manner. Formulating requirements this way allows a development team to know what needs to be achieved and what is _good enough_.

>You find {{ requirement_posts | size }} examples of such quality requirements on this site (see [examples](/requirements)).

---

## The SEI Approach: Quality Attribute Scenarios

Len Bass and his colleagues from the _Software Engineering Institute_ (SEI) coined the term "quality attribute scenarios" for structured quality requirements. See [Bass et al., 2021](/references/#bass2021software) for details.

Quality scenarios are a pragmatic, easy-to-use approach to specifying quality requirements. The SEI template includes six elements:

![general form of quality scenarios](/images/articles/q-requirements/q-scenario.png){:width="50%"}

* **Source of stimulus**: The entity (person, system, or other actor) that generates the stimulus
* **Event/stimulus**: Any condition or event arriving at the system
* **Artifact**: The part of the system that is affected by the stimulus
* **Environment**: The conditions or context under which the stimulus occurs
* **Response**: How the system should react to the stimulus
* **Metric** (response measure): Measurable criteria to objectively assess whether the requirement is met

### Why the Full SEI Template Can Be Impractical

Although the SEI template is widely used in academia and large-scale projects, it has some drawbacks in practice:

* **Time-consuming**: The detailed nature makes it slow to complete, especially when documenting many scenarios
* **Over-engineering**: Teams might feel compelled to fill out all six sections in detail, even when some elements are obvious or unnecessary
* **Poor fit for agile**: The comprehensive approach doesn't align well with fast-paced, iterative development methodologies
* **Redundancy**: Source, Artifact, and Environment often repeat information that's clear from context

In practice, a more streamlined approach is often sufficient while maintaining clarity and measurability.

---

## The Pragmatic Approach: Two-Tier Quality Requirements

We propose a flexible **two-tier approach** that balances simplicity with the need for context when necessary. This approach focuses on what matters most: **making requirements useful as acceptance criteria** in real software development projects.

### Tier 1: Simple Requirements

Use this structure for straightforward requirements where context is obvious or minimal.

**When to use:**
- The requirement is self-explanatory
- Context is obvious from the title
- Single actor or trigger
- 1-3 simple acceptance criteria
- Examples: performance thresholds, simple capacity requirements, test execution time

**Structure:**
```markdown
#### Requirement
[One clear statement of what must be achieved]

#### Acceptance Criteria
- [Specific, measurable criterion with numeric threshold]
- [Additional criteria if needed]
- [Use concrete metrics: percentages, timeframes, thresholds]
```

**Example: Quick Unit Tests**

<div class="quality-requirement" markdown="1">

#### Requirement
All automated unit tests for a subsystem must execute quickly to enable rapid feedback during development.

#### Acceptance Criteria
- All unit tests for a subsystem complete in less than 180 seconds
- Test execution time is measured on standard CI/CD infrastructure

</div><br>

---

### Tier 2: Complex Requirements

Use this structure when business or technical context is essential to understand the requirement.

**When to use:**
- Business/regulatory context is important
- Multiple stakeholders or complex scenarios
- 4+ acceptance criteria
- Compliance or security requirements
- Examples: access control, data quality, fairness, regulatory compliance

**Structure:**
```markdown
#### Context
[1-3 sentences explaining the system, business constraint, or why this matters]

#### Trigger
[Who or what initiates this requirement - user action, system event, etc.]

#### Acceptance Criteria
- [Specific, measurable criterion with numeric threshold]
- [Additional criteria...]
```

**Example: Access Control Enforcement**

<div class="quality-requirement" markdown="1">

#### Context
The system operates in a multi-user environment with varying levels of user roles and permissions. Sensitive features and confidential information require role-based access control (RBAC) and audit trails to maintain data security and privacy.

#### Trigger
A user attempts to access a sensitive feature or confidential information within the system.

#### Acceptance Criteria
- 100% of access attempts must be authenticated before granting access to sensitive data
- Multi-factor authentication (MFA) is implemented for highly sensitive data
- User roles are precisely defined with least-privilege access
- 100% of access attempts are logged in a tamper-proof audit trail including user identity, timestamp, accessed data, and outcome
- Access permissions can be revoked immediately with changes effective within 60 seconds
- User sessions automatically timeout after 30 minutes of inactivity
- Access control violations are logged and reported within 5 minutes

</div><br>

---

## Writing Effective Acceptance Criteria

Regardless of which tier you use, acceptance criteria should follow these best practices:

**1. Be Specific** - Use concrete numbers, percentages, timeframes
- ✅ "Response time < 500 milliseconds for 95% of requests"
- ❌ "System should be fast"

**2. Make Them Measurable** - Each criterion should be testable
- ✅ "99.9% of duplicate patient records are detected"
- ❌ "System detects most duplicate records"

**3. Include Units** - Always specify units for measurements
- ✅ "Deployment completes in less than 2 hours"
- ❌ "Deployment is quick"

**4. Use Thresholds** - Define acceptable ranges
- ✅ "Data synchronization latency ≤ 30 seconds"
- ❌ "Data synchronizes quickly"

**5. Be Testable** - Criteria should map directly to test cases
- ✅ "100% of failed login attempts are logged within 5 seconds"
- ❌ "Failed logins are tracked appropriately"

### Common Metrics to Include

- **Percentages**: "95% of users", "99.9% accuracy", "100% compliance"
- **Time bounds**: "within 500 msec", "less than 2 hours", "maximum 30 minutes"
- **Thresholds**: "±10% margin", "20% reduction", "≤ 0.05 difference"
- **Counts**: "zero critical vulnerabilities", "fewer than 2 issues per page"
- **Uptime**: "99.99% availability", "SLA of 99.9%"

---

## Examples by Domain

### Performance Requirements (Usually Tier 1)

<div class="quality-requirement" markdown="1">

#### Requirement
Search results must be displayed near-instantly to maintain user engagement.

#### Acceptance Criteria
- First search result appears within 500 milliseconds
- Additional results load progressively without blocking UI
- 95th percentile response time remains under 800 milliseconds

</div><br>

### Data Quality Requirements (Usually Tier 2)

<div class="quality-requirement" markdown="1">

#### Context
Healthcare system manages patient data across multiple departments where poor data quality could lead to incorrect diagnoses or medication errors.

#### Trigger
Patient data is entered, updated, or accessed throughout the care journey.

#### Acceptance Criteria
- Patient identification duplicate detection rate ≥ 99.9%
- Critical clinical fields (allergies, medications, diagnoses) are 100% complete
- Laboratory results available within 5 minutes with 99.9% reliability
- Data validation prevents 100% of impossible values and missing mandatory fields
- Complete audit trail maintained with 100% traceability

</div><br>

### Accessibility Requirements (Often Tier 2)

<div class="quality-requirement" markdown="1">

#### Context
The web application must comply with WCAG 2.1 Level AA standards to ensure accessibility for users with disabilities.

#### Trigger
A user with visual impairment navigates the application using a screen reader.

#### Acceptance Criteria
- 95% of interactive elements are navigable with screen reader
- 98% of content is accessible and consumable
- 95% of functionality can be used without accessibility barriers
- Messages and errors announced with 99% accuracy
- Page load times remain under 3 seconds despite accessibility enhancements
- Zero critical WCAG violations in automated testing
- Maximum 2 issues per page in manual testing

</div><br>

---

## Migrating from SEI Format

If you're currently using the full SEI template, you can easily migrate to this pragmatic approach:

**SEI Format:**
```markdown
Background: Developer deploys a new version of the application
Source: Developer
Stimulus: Deploys new version
Artifact: Production application
Environment: Production environment
Reaction: Application is fully rolled out
Metric: Deployment takes less than 2 hours
```

**Pragmatic Format (Tier 2):**
```markdown
Context: The development team needs to deploy application
updates frequently with minimal downtime.

Trigger: Developer initiates deployment of a new version
to production.

Acceptance Criteria:
- Deployment to all production servers completes in less than 2 hours
- Zero downtime during deployment
- Rollback capability available within 5 minutes if issues detected
```

The pragmatic version consolidates the six SEI elements into three focused sections, eliminating redundancy while maintaining all essential information.

---

## Summary

**Quality scenarios** document and clarify required quality attributes in a pragmatic, measurable way. They transform the abstract term "quality" into concrete, testable criteria that development teams can work with.

The **two-tier Q42 approach** offers:
- **Simplicity** for straightforward requirements (Tier 1)
- **Rich context** when needed for complex scenarios (Tier 2)
- **Measurable acceptance criteria** that serve as immediate test cases
- **Faster documentation** compared to the full SEI template
- **Better agile fit** with just-enough documentation

We recommend starting with Tier 1 for most requirements and upgrading to Tier 2 only when context genuinely adds value. This keeps your quality requirements lean, clear, and actionable.

Try the pragmatic Q42-Quality-Scenario approach in your own projects—it strikes the right balance between rigor and practicality.

---

**Related Resources:**
- [WCAG Guidelines](https://www.w3.org/TR/WCAG21/)
- [ISO 25010 Quality Model](/standards/iso-25010)
- [Bass et al., 2021 - Software Architecture in Practice](/references/#bass2021software)
