---
layout: page
title: "#flexible"
hide: true
permalink: /tag-flexible/
---

<div class="arc42-help" markdown="1">

Easy to:

* change to new or modified requirements
* bring into a new or modified execution environment (e.g. new hardware, operating system or cloud provider)
* handle changed workload
  
</div>

### Definition

>Capability of a product to serve a different or expanded set of requirements or contexts of use; or the ease with which the product can be adapted to changes in its requirements, contexts of use, or system environment
>
>[ISO-25010-2022](/references/#iso-25010-2022)


<hr/>

## Typical Acceptance Criteria

Flexible, as we saw above, means "_adaptable to change_".

When defining what exactly _#flexible_ shall mean for a specific system and specific stakehoders, we need to consider the following questions:

* what type of change (e.g. changed functionality, changed quality requirements, changed workload, changed infrastructure) 
* when does this change occur or when do people want to respond to the changes: at development-, compile/build-, installation-, startup- or runtime?

Typical acceptance criteria might include:

* Effort or number/type of changed artifacts to handle changes 
* Time or money spent for such changes 
* Side-effects on other system properties


### Scenario Response Measures from [Bass et al.]
>Cost in terms of
>
>* Number, size, complexity of affected artifacts
>* Effort
>* Elapsed time
>* Money
>* Extend to which this modification affects other quality attributes
>* New defects introduced
>
>[Bass et. al, 2022](/references/#bass-swa-practice)


### _flexible_ for Stakeholders


| Stakeholder | (potential) Expectation for _flexible_ |
|:--- |:--- |
| User ||
| Product-Owner | |
| Management |  |
| Developer |  |
| Tester | |
| Admin |   |
| Domain-Expert |  |
| Others |   |


<!-- include all qualities associated with this tag -->
{% include one-quality.md topic="flexible"  %}
