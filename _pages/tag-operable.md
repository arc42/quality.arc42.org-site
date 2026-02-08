---
layout: page
title: "#operable"
hide: true
permalink: /tag-operable/
---

<div class="arc42-help" markdown="1">

Easy to:
* build (compile, package)
* install, deploy
* configure
* operate, monitor, supervise, control
* decommission

</div><br>

Deployability is a...

>Measure of cost, time or process effectiveness for a deployment,
>for a series of deployments over time.
>
>[Bass et al., 2021](/references/#bass2021software)


## Typical Acceptance Criteria

### Scenario Response Measures for "Deployability" from [Bass et al.]

Bass et al. define [deployability](/qualities/deployability) as a property, and somehow omit other operational characteristics.

>Cost in terms of
>* Number, size and complexity of affected artifacts
>* Average/worst-case effort
>* Elapsed clock or calendar time
>* Money (direct outlay or opportunity cost)
>* New defects introduced
>
>Extend to which this deployment affects other functions or quality attributes.
>* Number of failed deployments
>* Repeatability of the process
>* Traceability of the process
>* Cycle time of the process
>
>[Bass et al., 2021](/references/#bass2021software)



### What Stakeholders mean by _operable_


| Stakeholder | (potential) Expectation for _operable_ |
|:--- |:--- |
| User | - |
| Product-Owner | -  |
| Management |* appropriate operational costs<br>* appropriate licensing cost for required 3rd party software, like database, middleware  |
| Developer |* automated test and build<br>* appropriate automation of deployments<br>* appropriate similarity of development and production environments |
| Tester | - |
| Admin |* easy to build and deploy<br>* appropriate monitoring facilities<br>* appropriate procedures for crisis management in place<br>* appropriate management of credentials required<br>   |
| Domain-Expert | - |
| Others | -  |

<!-- include all qualities associated with this tag -->
{% include one-quality.liquid tag="operable"  %}

<!-- include all requirements associated with this tag -->
{% include one-requirement.liquid tag="operable"  %}

<!-- include all approaches associated with this tag -->
{% include one-approach.liquid tag="operable"  %}

<!-- include all standards associated with this tag -->
{% include one-standard.liquid tag="operable"  %}


