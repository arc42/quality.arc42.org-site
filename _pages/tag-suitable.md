---
layout: page
title: "#suitable"
hide: true
permalink: /tag-suitable/
---

_Suitable_ might be the most generic term within the Q42 dimensions.

<div class="arc42-help" markdown="1">

Being right or appropriate for a particular person, purpose, or situation.
</div><br>

Note: In previous versions of Q42, the term "_testable_" was used instead of _suitable_.
Users found that to be overly specific, see the discussion [here](https://github.com/arc42/quality.arc42.org-site/issues/90).


## Definition

>(Functional) Suitability:
>
>...provides functions that meet stated and implied needs of intended users when it is used under specified conditions.
>
>[ISO-25010:2023](/references/#iso-25010-2023)

The ISO restricts _Suitability_ to functional aspects. 
In our opinion, it is useful in a broader sense: For example, seen from a testing perspective, suitable can mean "easy to test". 

### "Responsibility" as an alternative term

[Bass et al., 2021](/references/#bass2021software) propose to use the term "responsibility" instead of (functional) suitability.
That is, from our perspective, a matter of taste.

## Typical Acceptance Criteria

(todo)

### What Stakeholders mean by _suitable_ 


| Stakeholder | (potential) Expectation for _suitable_ |
|:--- |:--- |
| User |* offers the required (_suitable_) functions in appropriate quality<br>* adequate performance<br>* adequate robustness<br>* adequate accessibility and useability|
| Product-Owner |* providing appropriate (_suitable_) functions in _suitable_ quality<br>* easy to enhance with new functions or features<br> |
| Management |* appropriate cost/benefit ratio<br>* appropriate effort required to add new features or functions  |
| Developer |* appropriate effort required to understand internals<br>* good [code readability](/qualities/code-readability)<br>* appropriate effort required to locate and fix bugs<br>* appropriate technologies used<br>* appropriate technical documentation  |
| Tester |* appropriate effort required for testing |
| Admin |* easy to perform required administration tasks (like deploy, install, configure etc)  |
| Domain-Expert | - |
| Others | -   |



<!-- include all qualities associated with this tag -->
{% include one-quality.liquid tag="suitable"  %}

<!-- include all requirements associated with this tag -->
{% include one-requirement.liquid tag="suitable"  %}

<!-- include all approaches associated with this tag -->
{% include one-approach.liquid tag="suitable"  %}

<!-- include all standards associated with this tag -->
{% include one-standard.liquid tag="suitable"  %}
