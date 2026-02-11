---
layout: page
title: "#maintainable"
hide: true
permalink: /tag-maintainable/
---

<div class="arc42-help" markdown="1">

Easy to:

* understand and analyze when changes are needed
* modify with low effort and low risk
* verify and test after changes
* update or upgrade over the system lifetime

</div>

### Definition

> Capability of a product to be modified by the intended maintainers with effectiveness and efficiency.
>
> Modifications can include corrections, improvements or adaptation to changes in environment and requirements.  
> Maintainability includes installation of updates and upgrades.
>
> [ISO-25010:2023](/references/#iso-25010-2023)

<hr class="with-no-margin"/>

> Maintainability is the ease with which software can be maintained, enhanced, adapted, or corrected to satisfy specified requirements.
>
> [SWEBOK (IEEE), citing IEEE 610.12](https://www.rose-hulman.edu/class/cs/csse490/cs490-const-and-evol/swebok100.pdf)



## Typical Acceptance Criteria

Maintainable means "_economical and predictable change_".

When defining what _#maintainable_ means for a specific system and stakeholders, consider:

* Which types of change are expected (defect fix, refactoring, feature extension, dependency update)?
* How much code, configuration, and documentation should typically be affected?
* What regression risk and verification effort are acceptable after each change?

Typical acceptance criteria might include:

* Effort/time to implement representative changes
* Number and complexity of artifacts touched per change
* Change failure rate and rollback frequency
* Effort/time to analyze root causes and fix defects
* Effort/time to adapt or extend tests after changes

### Scenario Response Measures from [Bass et al.]

> Cost in terms of:
>
> * Number, size, complexity of affected artifacts
> * Effort
> * Elapsed time
> * Money
> * Extent to which this modification affects other quality attributes
> * New defects introduced
>
> [Bass et al., 2021](/references/#bass2021software)

### _maintainable_ for Stakeholders

| Stakeholder | (potential) Expectation for _maintainable_ |
|:--- |:--- |
| User | defects are fixed quickly and reliably |
| Product-Owner | predictable effort and lead time for requested changes |
| Management | lower long-term cost of change and reduced change risk |
| Developer | code is understandable, analyzable, modular, and safe to change |
| Tester | tests can be adapted quickly; regressions are easy to detect |
| Admin | updates/upgrades can be applied with low operational risk |
| Domain-Expert | business-rule changes can be implemented without long delays |
| Others | technical documentation remains current and change-oriented |

<!-- include all qualities associated with this tag -->
{% include one-quality.liquid tag="maintainable"  %}

<!-- include all requirements associated with this tag -->
{% include one-requirement.liquid tag="maintainable"  %}

<!-- include all approaches associated with this tag -->
{% include one-approach.liquid tag="maintainable"  %}

<!-- include all standards associated with this tag -->
{% include one-standard.liquid tag="maintainable"  %}
