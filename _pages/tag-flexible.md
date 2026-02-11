---
layout: page
title: "#flexible"
hide: true
permalink: /tag-flexible/
---

<div class="arc42-help" markdown="1">

Easy to:

* adapt to changed contexts of use and environments
* run in new or modified execution environments (hardware, OS, cloud provider, region)
* handle changed workload profiles
* configure or tailor behavior without invasive redesign


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

For Q42, _#flexible_ focuses on adaptation to external context and runtime/operational variability.
Developer-focused changeability concerns (e.g. analyzability, modifiability, testability) belong primarily to [#maintainable](/tag-maintainable).

When defining what exactly _#flexible_ shall mean for a specific system and stakeholders, we should consider:

* Which external changes are expected (infrastructure, workload, integrations, locales, user/task context)?
* At which point adaptation is needed (installation, deployment, startup, runtime)?
* Which adaptations must be configuration-driven vs requiring rollout/redeployment?

Typical acceptance criteria might include:

* Time/effort to deploy to a new environment (e.g. cloud provider/region/OS)
* Time/effort to reconfigure behavior for a new context of use
* Performance/SLA impact while scaling up or down
* Number of integration endpoints/protocol variants supported without redesign
* Side-effects on reliability, security, usability, and operability


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
| User | behavior can be tailored to usage context, language, and channel |
| Product-Owner | product can support adjacent use cases/markets without re-architecture |
| Management | low business risk and cost when market/context shifts require adaptation |
| Developer | extension points and configuration options support context adaptation (internal maintainability is covered by [#maintainable](/tag-maintainable)) |
| Tester | adaptations can be validated across supported environment/context variants |
| Admin | easy environment migration, scaling, and runtime configuration |
| Domain-Expert | business rules can be parameterized for variant contexts |
| Others | partner/integration interfaces can evolve with controlled impact |


<!-- include all qualities associated with this tag -->
{% include one-quality.liquid tag="flexible"  %}

<!-- include all requirements associated with this tag -->
{% include one-requirement.liquid tag="flexible"  %}

<!-- include all approaches associated with this tag -->
{% include one-approach.liquid tag="flexible"  %}

<!-- include all standards associated with this tag -->
{% include one-standard.liquid tag="flexible"  %}
