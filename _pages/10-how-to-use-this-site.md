---
layout: page
title: How to Use this Site
permalink: /how-to-use-this-site/
order: 10
---

This site supports you in defining specific quality requirements for your system.

To make the best use, you should become familiar with our terminology.

## Our _Domain Language_

![Q42 explanatory **model**](/images/articles/metamodel/q42-metamodel-new.webp)

Let's explain some terms, starting with an example:


* **#secure** is a quality **dimension** (others could be #flexible or #reliable). 
* **Confidentiality** is a quality **characteristic**, refining the dimension.
* "Sensitive data must not be accessible if storage is compromised: No (0%, zero) unencrypted sensitive data on persistent storage" is a quality **requirement** with precise **Metric** for this characteristic. 
* **ISO/IEC 27001** is a quality-related **standard** calling for confidentiality. 
* "Encrypted in-memory caching with short TTL" could be one **approach** to achieve or improve the quality requirement.
* Once all approaches are implemented, confidentiality (as detailed by the requirements) becomes a **quality attribute** of the concrete system.

Now let's consider the terms in more detail:


| Term | Icon | Explanation          |
| :--- | :--  | :--- |
| **Dimension**|  <i class="fa fa-tag"/>| Our 8 top-level dimensions (#flexible, #efficient, #reliable etc.). Find the full list plus the mapping to qualities [**here**](/properties). These terms are highly abstract, and will be interpreted individually by different stakeholders. They can be used as starting points, but need to be detailed. Q42 relates each of these dimensions to 10-30+ different specific quality characteristics. |
| Specific **Quality Characteristic**|  <i class="fa fa-gem" style="color: var(--quality-background-color);"/>| The detailed and specific terms, like  accessibility, accountability, accuracy etc. Currently, Q42 collects more than 180 such terms under [**Quality Characteristics**](/qualities). These terms are usually well-defined, but need examples or acceptance criteria  to really help in developing systems. Q42 contains examples for many (hopefully all, at some day in the future) |
| **Stakeholder** | | People, roles or organizations that need, want or require certain quality [**requirements**](/requirements/) for their systems. |
| **Examples**  | <i class="fa fa-bullseye" style="color: var(--req-text-color);"/>  | These are the specific requirements stakeholders have for a system or product, often expressed in the form of quality scenarios. They should facilitate stakeholder communication by enabling a common understanding of the _good enough_. Q42 provides >50 of these [**examples**](/requirements/) |
| **Acceptance criterion** |   | What does _good enough_ mean with respect to a specific quality. |
| **Approach**  |  <i class="fa fa-puzzle-piece" style="color: #1B5E20;"/> | **Under development**, consider this content **_experimental_**: How to achieve one or several qualities.  |
| **Standard**  | <i class="fa fa-award" style="color: var(--standard-background-color);"/>| Numerous international standards describe/prescribe/care about certain aspects of quality. Important ones are ISO-25000:2023, ISO-27001 or MISRA.  |


## Three Aspects of Quality

![3 Aspects of Quality](/images/articles/metamodel/terms-3-dimensions.svg )

<dl>
  <dt><strong>Aspect 1: Dimensions & Characteristics</strong></dt>
  <dd>What characteristics, attributes or properties are relevant (like availability, latency, speed or maintainability). On this site, we use the color blue to denote quality dimensions and characteristics.</dd>
  <dt><strong>Aspect 2: Acceptance Criteria</strong></dt>
  <dd>What amount, size or extent of any characteristic (like 99% availability...). We use the colour red for these criteria or examples.</dd>
  <dt><strong>Aspect 3: Stakeholder</strong></dt>
  <dd>For whom or what roles/organizations is this quality/property relevant?</dd>
</dl>



## How to Use Q42

You can approach in several ways:

1. Inside-out, starting with the eight top-level [**dimensions**](/properties) 
2. Outside-in, by reading through the [extensive list of **quality characteristics**](/qualities/).
3. By asking your stakeholders for terms (either dimensions or specific quality characteristics) they consider important, and then continue with steps 1 or 2.
4. By reading the [**examples** of quality requirements](/requirements).


All these approaches are described below.

![inside-out vs outside-in graphic](/images/how2use/how-to-use-this-site.svg)

### Inside-Out, starting with Q42 Quality Dimensions
Let's assume that your stakeholders want a "flexible" system. 
This is completely unsuitable as a requirement because it is too unspecific. 

You could search under the term "#flexible" (to be found under "[Quality Dimensions](/properties/)").
There you find a collection of related terms ("Qualities tagged with #flexible"), and also a collection of exemplary quality requirements of this generic term.


### Outside-In
The other way round is viable, too:
In case your stakeholders have specific requirements, like "compliance":
Just start with the (extensive!) list of [qualities](/qualities/).

Again, you will find related qualities and examples on the detail-pages

### Start with Examples

The third option starts with the [examples of quality requirements](/requirements).
These are automatically mapped to the dimensions and low-level quality characteristics.
