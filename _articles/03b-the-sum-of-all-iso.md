---
layout: page
title: "The Sum of All ISO"
tags: iso-25010 quality-model
permalink: /articles/sum-of-all-iso
---


>The Sum of All Fears is a 2002 American spy thriller film directed by Phil Alden Robinson, based on Tom Clancy's 1991 novel of the same name.
>
>Wikipedia 


Some reviewers remarked that I should give the ISO/IEC 25000 "Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE)" some more respect.

Actually, [SQuaRE]([https://](https://www.iso.org/obp/ui/#iso:std:iso-iec:25000:ed-2:v1:en)) is more a _clan_ than a single standard, it has not even been published in a single source, but is spread across numerous documents.

In my (personal and professional) _bubble_, the major representative of this clan is definitely ISO/IEC 25010, which is explicitly referenced in the [iSAQB Software Architecture Foundation curriculum](https://public.isaqb.org/curriculum-foundation/release-candidate/curriculum-foundation-en.html#iso25010) as an important source for software quality terminology.

Why did I use the strange term _clan_, instead of the commonly used _family_: Just read on.


### A Clan has Multiple Families

Let's look at the high-level structure of SQuaRE. 
The diagram given below is contained in several of the official documents.

![high-level structure of ISO 25000 family](/images/articles/quality-models/ISO-25-Meta-Structure.svg)

You find the following five _families_ (yes, each block 01, 02, 03 etc. contains one or several parts).
The official terminology is _divisions_ instead of families, but I think the latter sounds a bit more friendly.

* ISO/IEC 2500n - Quality Management Division. The International Standards that form this division define all common models, terms and definitions referred to by all other standards from the SQuaRE series.
* ISO/IEC 2501n - Quality Model Division. The International Standards that form this division present detailed quality models for systems and software product, quality in use and data. Practical guidance on the use of the quality model is also provided.
* ISO/IEC 2502n - Quality Measurement Division. The International Standards that form this division include a system and software product quality measurement reference model, mathematical definitions of quality measures, and practical guidance for their application.
* ISO/IEC 2503n - Quality Requirements Division. The International Standard that forms this division helps specifying quality requirements.
* ISO/IEC 2504n - Quality Evaluation Division. The International Standards that form this division provide requirements, recommendations and guidelines for product evaluation, whether performed by independent evaluators, acquirers or developers. The support for documenting a measure as an Evaluation Module is also presented.
* ISO/IEC 25050-25099-Extension Division. SQuaRE extension (ISO/IEC 25050 to ISO/IEC 25099) is designated to contain system or software product quality International Standards and/or Technical Reports that address specific application domains or that can be used to complement one or more SQuaRE International Standards.



Now, that looks like a highly structured approach to quality.
One small issue, though: You cannot simply order this standard via your favourite bookstore or online shop, but have to order all documents separately. 
And we haven't yet talked about documents, but only about families (sorry, divisions).

Let's dive deeper and find out what we need to buy if we want to read and fully appreciate the sheer beauty of ISO/IEC SQuaRE:

### All SQuaRE ISO/IEC Documents

As a courtesy to you, dear readers, I spent a few hours in the [ISO/IEC online store](https://www.iso.org/obp/ui/#search), making heavy use of their nice _search_ function.
The goal was finding out the current (February 2023) prices of all the SQuaRE documents.

| Title |  Price (CHF) |
| --- |  --- |
| **2500n Quality Management Division** |  |
| 25000: Guide to SQuaRE |  145 |
| 25001: Planning and management |  92 |
| 25002: Quality models overview and usage | 61 |
| **2501n Quality Model Division** |  |  
| 25010: Product quality model (2011) |  145 |
| 25011: IT service quality models |  124 |
| 25012: Data quality model |  92 |
| 25019: Quality-in-use model |  61 |
| **2502n Quality Measurement Division**   |  |
| 25020: Quality Measurement Framework |  145 |
| 25021: Quality measure elements |  166 |
| 25022:  Measurement of quality in use |  166 |
| 25023: Measurement of system and software product quality |  166 |
| 25024: Measurement of data quality |  166 |
| 25025: Measurement of IT service quality |  124 |
| **2503n Quality Requirements Division** |   |
| 25030: Quality Requirements Framework |  166 |
| **2504n Quality Evaluation Division** |   |
| 25040: Evaluation process |  166 |
| 25041: Evaluation guides |  187 |
| 25042: Evaluation modules (not avialable) |   |
| 25045: Evaluation module for recoverability |  166 |
| **25050-25099 Extensions** |   |
| 25051: Requirements for quality of Ready to Use Software Product |  145 |
| 25052: Cloud services - Part 1: Quality model |  92 |
| 25059: Quality model for AI systems |  61 |
| ======= |  2636 CHF |

Two thousand six hundred and thirty six Swiss Francs. About the same amount in Euro, some 2860 US-Dollar.

For sure, the highest paywall for PDF documents I've ever came across.
And no, I did **not** press the "buy" button to collect all those documents.


### Practical Usefulness of SQuaRE

As you might guess by now, I'm currently full of doubt wether the ISO 25000 clan of standards will ever have the chance to broadly succeed in industry, or if it will continue to remain a mistery to most development projects.

I seriously doubt that many organizations are willing to cover the complete expenses. 
Personally I invested in 25010, which I consider a valuable source, despite its [shortcomings](/articles/iso-25010-shortcomings).

But still I consider the groundwork of ISO-25010 a valid and helpful resource to avoid lengthy discussions on the meaning of (certain) terms. Hopefully our own site can serve this purpuse in the future. Until then, many people will be refering to the [public ISO-25010 collection of terms](https://www.iso.org/obp/ui/#iso:std:iso-iec:25010:dis:ed-2:v1:en), and most likely ignoring the potentially valuable additions of all the other documents.








