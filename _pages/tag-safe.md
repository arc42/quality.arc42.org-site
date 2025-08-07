---
layout: page
title: "#safe"
hide: true
permalink: /tag-safe/
---

<div class="arc42-help" markdown="1">

A _safety- or life-critical_ system is a system whose failure or malfunction may result in one (or more) of the following outcomes:

* death or serious injury to people
* loss or severe damage to equipment/property
* environmental harm

Quoted from [Wikipedia/Safety-critical system](https://en.wikipedia.org/wiki/Safety-critical_system)
</div><br>


<div class="arc42-help" markdown="1">
Safety means:

* protected from harm or other danger
* in control of recognized or accepted dangers or hazards
* achieve an acceptable level of risk

Quoted from [Wikipedia/Safety](https://en.wikipedia.org/wiki/Safety)
</div><br>

<hr class="with-no-margin"/>

>Capability of a product under defined conditions to avoid a state in which human life, health, property, or the environment is endangered.
>
>[ISO-25010:2023](/references/#iso-25010-2023)


## Typical Acceptance Criteria
### Scenario Response Measures from [Bass et al.]

>* Amount or percentage of unsafe states that are avoided
>* Amount or percentage of unsafe states from which the system can (automatically) recover
>* Change in risk exposure: size(loss) * prob(loss)
>* Percentage of times the system can recover
>* Amount of time the system is in a degraded or safe mode
>* Amount or percentage of time the system is shut down
>* Elapsed time to enter and recover (from manual operation, from a safe or degraded mode)
>
>[Bass et al., 2021](/references/#bass2021software)



### What Stakeholders mean by _safe_


| Stakeholder | (potential) Expectation for _safe_ |
|:--- |:--- |
| User |* using the system will never cause any risk to my health<br> * it is not possible to injure myself accidentally by using the system|
| Management |* minimal risk of any liability lawsuit<br>* no person will ever get hurt when using or maintaining our system<br>* the system poses no risk or danger to any humans' health<br>* the system poses no risk to the environment |
| Developer |development processes comply with appropriate safety standards and regulations, e.g. SPICE  |
| Tester | - |
| Admin | - |
| Domain-Expert |the system and its implementation comply with all required safety standards, like [ISO-26262](https://www.iso.org/standard/51362.html)|
| Others |Safety auditors, government agencies requiring compliance with safety standards, law  |

<!-- include all qualities associated with this tag -->
{% include one-quality.html tag="safe"  %}

<!-- include all requirements associated with this tag -->
{% include one-requirement.html tag="safe"  %}

