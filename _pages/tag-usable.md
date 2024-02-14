---
layout: page
title: "#usable"
hide: true
permalink: /tag-usable/
---

<div class="arc42-help" markdown="1">

The main idea of _usability_ is that a system shall be designed with (generalized) users' psychology and physiology in mind, to make that system:

*  more efficient to use, so it takes less time to accomplish particular tasks
*  easier to learn
*  more satisfying to use

</div><br>

### Definitions:

>Capability of a product to be interacted with by specified users to exchange information between a user and a system via the user interface to complete the intended task.
>[ISO-25010:2023](/references/#iso-25010-2023)

<hr class="with-no-margin"/>

>The capacity of a system to provide a condition for its users to perform the tasks safely, effectively, and efficiently while enjoying the experience.
>[Wikipedia](https://en.wikipedia.org/wiki/Usability)


<hr class="with-no-margin"/>

>Enable users to perform their tasks safely, effectively and efficiently while enjoying the experience.
>
>[Volere Version 2.0](/references/#volere)


## Typical Acceptance Criteria

<!--TODO -->

### Scenario Response Measures from [Bass et al.]

>The system should:
>
>* provide the user with the features needed
>* anticipate the user's needs
>* provide appropriate feedback to the user
>
>The system's response might be  measured in one or more of the following:
>
>* task time
>* number of errors
>* learning time
>* ratio of learning time to task time
>* number of tasks accomplished
>* user satisfaction
>* gain of user knowledge
>* ratio of successful operations to total operations
>* amount of time or data lost when an error occurs 
>
>[Bass et al., 2021](/references/#bass2021software)

### What Stakeholders mean by _usable_


| Stakeholder | (potential) Expectation for _usable_ |
|:--- |:--- |
| User |see the criteria above. More specifically:<br>* [functional-completeness](/qualities/functional-completeness)<br>* [accessibility](/qualities/accessibility)<br>* [correctness](/qualities/correctness)<br>* visual and behavioural [consistency](/qualities/consistency) <br>* [understandability](/qualities/understandability) <br>* [ease-of-use](/qualities/ease-of-use)<br>* [functional-suitability](/qualities/functional-suitability) <br>* [learnability](/qualities/learnability)<br>* nice [user-experience](/qualities/user-experience)<br>(maybe even more)|
| Product-Owner | -  |
| Management | -  |
| Developer |* understandable source-code and dependencies<br>* an appropriate technology-stack<br>* no (or at least predictable) side-effects when changing the system |
| Tester |* [testability](/qualities/testability)<br>* predictable test behaviour |
| Admin |* easy to deploy and install,<br>* [installability](/qualities/installability)<br>* [deployability](/qualities/deployability)   |
| Domain-Expert | - |
| Others | -  |



<!-- include all qualities associated with this tag -->
{% include one-quality.md topic="usable"  %}
