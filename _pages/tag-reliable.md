---
layout: page
title: "#reliable"
hide: true
permalink: /tag-reliable/
---


<div class="arc42-help" markdown="1">

Being trustworthy or performing consistently well.

</div><br>

<hr class="with-no-margin"/>

<div class="arc42-help" markdown="1">
>Capability of a product to perform specified functions under specified conditions for a specified period of time without interruptions and failures.
>
>Note: Wear does not occur in software. Limitations in reliability are due to results from faults in requirements, design and implementation, or from contextual changes.”
>
>[ISO-25010-2022](/references/#iso-25010-2022)
</div><br>


<hr/>

## Typical Acceptance Criteria


>* Time or time interval when the system shall be available
>* Availability percentage
>* Time to detect a fault
>* Time to repair a fault
>* Time or time interval in which the system may operate in degraded mode
>* Proportion (e.g. 99%) or rate (e.g. up to 42 per second) of a certain class or type of faults that the system either prevents or handles without failing
>
>Source: [Bass et. al, 2022, p. 75](/references/#bass-swa-practice)

### _reliable_ for Developers

Developers need to _reliably_ work on the system (e.g. add new features) without being surprised by side effects or problems at other locations.

* When I add a new feature to the system, no surprising bugs occur.
* When I add a new feature to the system, I can reliably predict the effects that change has onto the system.

### What  Stakeholders mean by _reliable_


| Stakeholder | (potential) Expectation for _reliable_ |
|:--- |:--- |
| User |* available when need it<br>* produces expected results<br>* offers expected functionality<br>* user documentation is reliable |
| Product-Owner |* realiably add new functions and features<br>* reliable estimates concerning effort for changes<br>* reliable at runtime, available when users need it |
| Management | * cost and effort of development, operations and support are reliably predictable<br>* reliable with respect to operations, especially security and interoperability |
| Developer |* reliably add new features or functions to the system without unwanted side-effects.<br>* realiably predict the effects of changes to the system  |
| Tester |test results are reliable (as in _consistent_ or _repeatable_) |
| Admin | * _reliably_ start, configure and monitor the system<br> * reliable release and update processes  |
| Domain-Expert | - |
| Others | * technical documentation is reliable (current and correct)  |




<!-- include all qualities associated with this tag -->
{% include one-quality.md topic="reliable"  %}
