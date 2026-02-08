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

>Capability of a product to be adapted to changes in its requirements, contexts of use, or system environment.
> 
>Note: Flexibility to context of use should consider two distinguished aspects, i.e. technical and non-technical. The technical aspect is related with the execution environment of products, such as software, hardware and communication facility; and the non-technical aspect is related with the social environment, such as user and task, and the physical environment, such as climate and nature.
>
>[ISO-25010:2023](/references/#iso-25010-2023)


<hr/>

## Typical Acceptance Criteria

Flexible, as we saw above, means "_adaptable to change_".

When defining what exactly _#flexible_ shall mean for a specific system and specific stakeholders, we need to consider the following questions:

* what type of change (e.g. changed functionality, changed quality requirements, changed workload, changed infrastructure) 
* when does this change occur or when do people want to respond to the changes: at development-, compile/build-, installation-, startup- or runtime?

Typical acceptance criteria might include:

* Effort or number/types of changed artifacts to handle changes 
* Time or money spent for such changes 
* Side-effects on other system properties


### Scenario Response Measures from [Bass et al.]
>Cost in terms of
>
>* Number, size, complexity of affected artifacts
>* Effort
>* Elapsed time
>* Money
>* Extent to which this modification affects other quality attributes
>* New defects introduced
>
>[Bass et al., 2021](/references/#bass2021software)


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
{% include one-quality.liquid tag="flexible"  %}

<!-- include all requirements associated with this tag -->
{% include one-requirement.liquid tag="flexible"  %}

<!-- include all approaches associated with this tag -->
{% include one-approach.liquid tag="flexible"  %}

<!-- include all standards associated with this tag -->
{% include one-standard.liquid tag="flexible"  %}

