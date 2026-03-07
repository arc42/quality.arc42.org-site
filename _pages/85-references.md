---
layout: page
title: References
permalink: /references/
order: 85
---

[Aroms/NIST](#nist-idps) · [Bass et al.](#bass2021software) · [bbv](#bbvquality) · [Boehm 1976](#boehm1976quantitative) · [Boehm 1978](#boehm1978characteristics) · [Cavano/McCall](#mccall) · [Crosby](#crosby-quality) · [Eeles](#eeles2005capturing) · [Frost](#brad-frost-theming) · [Forsgren/Humble/Kim](#forsgren-accelerate) · [Grady](#grady1992practical) · [Harasymczuk](#astrotech) · [Harrer](#harrer-quality-tactics) · [Hohpe/Woolf](#hohpe2004enterprise) · [ISO 9241](#iso-9241-110) · [ISO 25010 (2011)](#iso-25010-2011) · [ISO 25010 (2023)](#iso-25010-2022) · [Jamwal et al.](#jamwal) · [Kazman et al.](#kazman-maintainability) · [Martin](#martin-clean-architecture) · [Nygard](#nygard2018release) · [McCabe](#mccabe1976complexity) · [McCall/Matsumoto](#mccall1980software) · [McCall/Walters](#mccall1977factors) · [Mockus et al.](#mockus2010experiences) · [Robertson/Robertson](#volere) · [SEI/QAW](#sei-qaw) · [Starke/Lorz](#starke2021software) · [SWEBOK](#swebok) · [W3C](#w3c-design-tokens) · [Wikipedia](#wikipedia-theming)

---

<a id="astrotech"></a>
### astrotech.io: Quality Models

M. Harasymczuk "Quality - The Software Engineering." astrotech.io.

Available [online](https://dev.astrotech.io/sonarqube/quality-models.html)

A concise online overview of the major software quality models (McCall, Boehm, ISO 25010 and others), explaining their historical evolution and comparing how each model structures quality characteristics. Useful as a quick orientation before diving into the primary sources.

<a id="bass2021software"></a>

### Bass et al.: Software Architecture in Practice

L. Bass, P. Clements, and R. Kazman, Software architecture in practice, 4th ed. Addison-Wesley Professional, 2021.

The standard reference for software architecture practitioners, covering architectural patterns, quality attribute tactics, and the relationship between architectural decisions and system quality. Chapters on availability, performance, security, and modifiability are directly relevant to defining quality requirements.

<a id="bbvquality"></a>
### bbv Software Development Quality Map

bbv (a Swiss consulting and software company) have published a visual map of [software development quality](https://quality.bbv.ch/).

An interactive visual overview that clusters software quality topics into areas such as process quality, product quality, and organisational quality. Helpful for teams who want a fast, diagram-driven introduction to how the different aspects of quality relate to each other.

<a id="brad-frost-theming"></a>
### Brad Frost: The Many Faces of Themeable Design Systems

B. Frost, ‘The Many Faces of Themeable Design Systems’, 2023.

Available [online](https://bradfrost.com/blog/post/the-many-faces-of-themeable-design-systems/)

Argues that a three-tiered design token architecture allows a single component library to serve multiple brands, white-label products, and dark/light modes by flowing different aesthetic themes through shared components. Directly relevant to the flexibility and portability quality characteristics in UI-heavy systems.

<a id="boehm1976quantitative"></a>
### Boehm et al.: Quantitative Evaluation of Software Quality

B. W. Boehm, J. R. Brown, and M. Lipow, ‘Quantitative evaluation of software quality’, in Proceedings of the 2nd international conference on Software engineering, 1976, pp. 592–605.

Available [online](https://dl.acm.org/doi/10.5555/800253.807736)

From the abstract:

>A definitive hierarchy of well-defined, well-differentiated characteristics of software quality is developed. 
>Its higher-level structure reflects the actual uses to which software quality evaluation would be put; its lower-level characteristics are closely correlated with actual software metric evaluations which can be performed.

Please note: Boehm's quality model is often (wrongly) dated to a 1978 publication, but in reality the authors published it in 1976.

<a id="boehm1978characteristics"></a>
### Boehm et al.: Characteristics of Software Quality

B. Barry, ‘Characteristics of Software Quality, TRW Series of Software Technology’. New York: American Elsevier, 1978.

The full monograph expanding the 1976 conference paper into a complete quality model with three top-level factors (product operation, product revision, product transition) and fifteen quality characteristics mapped to metrics. Together with the 1976 paper, this forms the "Boehm quality model" that influenced every subsequent quality standard.

<a id="crosby-quality"></a>
### Crosby: Quality is Free

Philip B. Crosby: Quality is Free: The Art of Making Quality Certain. McGraw Hill Books, 1994.

A management classic arguing that the cost of poor quality always exceeds the cost of preventing it. Introduced the notion of "zero defects" and the idea that quality is defined as conformance to requirements — a framing that still resonates when writing acceptance criteria.

<a id="eeles2005capturing"></a>
### Eeles: Capturing Architectural Requirements

P. Eeles, ‘Capturing architectural requirements’, IBM Rational developer works, 2005.

Available [online](https://web.archive.org/web/20201112020231/http://www.ibm.com/developerworks/rational/library/4706.html#N100A7)

Also by this author: [Non-functional Requirements](https://pdfs.semanticscholar.org/f3bb/91080c4573f6f78f30bc5b48bda3ef252bf2.pdf)

A practical guide to eliciting, categorising, and documenting architectural requirements — including non-functional requirements, constraints, and principles. Directly applicable to writing quality requirements that architects can actually act on.

<a id="forsgren-accelerate"></a>
### Forsgren, Humble & Kim: Accelerate

N. Forsgren, J. Humble, and G. Kim, _Accelerate: The Science of Lean Software and DevOps_. IT Revolution Press, 2018.

Available [online](https://itrevolution.com/product/accelerate/)

Presents four years of rigorous research establishing the four key software delivery metrics — deployment frequency, lead time for changes, change failure rate, and time to restore — as empirically validated predictors of organisational performance. Provides a research-backed foundation for writing measurable deployability and reliability quality requirements.

<a id="grady1992practical"></a>
### B. Grady, Practical software metrics for project management and process improvement

R. B. Grady, Practical software metrics for project management and process improvement. Prentice-Hall, Inc., 1992.

A hands-on guide to selecting, collecting, and interpreting software metrics in real projects, based on experience at Hewlett-Packard. Bridges the gap between quality theory and measurement practice — showing how to turn quality goals into trackable indicators.

<a id="harrer-quality-tactics"></a>
### Harrer: Quality Tactics

M. Harrer, _Quality Tactics: Developing Quality-Driven Solution Strategies for Software Architectures_. Leanpub, 2025.

Available [online](https://leanpub.com/qualitytactics)

A practical reference for software architects covering hundreds of proven tactics across eight quality dimensions (functional suitability, usability, reliability, performance efficiency, security, maintainability, compatibility, portability). Originally published in German as _Qualitätstaktiken_.

<a id="hohpe2004enterprise"></a>
### G. Hohpe and B. Woolf, Enterprise integration patterns

G. Hohpe and B. Woolf, Enterprise integration patterns: Designing, building, and deploying messaging solutions. Addison-Wesley Professional, 2004.

The definitive catalogue of 65 messaging patterns for integrating enterprise systems, each described with intent, motivation, and implementation guidance. A key reference for reliability, interoperability, and performance quality requirements in distributed or event-driven architectures.

<a id="iso-9241-110"></a>
### ISO 9241 (v. 2006-2020)

I. O. for Standardization, ISO 9241-110: Ergonomics of human-system interaction - Part 110: Dialogue Principles. ISO, 2020

Available [online](https://www.iso.org/obp/ui/#iso:std:iso:9241:-110:ed-2:v1:en)

Defines seven dialogue principles for interactive systems — task-suitability, self-descriptiveness, conformity with user expectations, learnability, controllability, error tolerance, and user engagement. The normative foundation for usability and accessibility quality requirements in user-facing software.

<a id="iso-25010-2011"></a>
### ISO 25010 (v. 2011-2017)

ISO/IEC DIS 25010(en): Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model

Available [online](https://www.iso.org/obp/ui/#iso:std:iso-iec:25010:dis:ed-2:v1:en)

The widely cited 2011 edition of the SQuaRE product quality model, defining eight top-level quality characteristics (functional suitability, reliability, performance efficiency, usability, security, maintainability, compatibility, portability). Still the version most practitioners and tools reference, though superseded by the 2023 revision.

<a id="iso-25010-2022"></a>
<a id="iso-25010-2023"></a>
### ISO 25010 (updated version 2023)

ISO/IEC TS 25010:2023(en)
Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE): Product quality model

Available [online](https://www.iso.org/obp/ui/#iso:std:iso-iec:25010:ed-2:v1:en)

The authoritative international standard defining the product quality model used as the backbone of this site. The 2023 revision restructures the eight top-level quality characteristics and refines sub-characteristics, superseding the 2011 edition for most practical purposes.

However, as discussed in [Shortcomings of ISO 25010](/articles/iso-25010-shortcomings), the standard remains problematic for practitioners. Its abstract terminology, overlapping definitions, and rigid hierarchy often lack pragmatism, while essential aspects like code quality and operational concerns are largely ignored. The paywall further limits its practical accessibility for many development teams.

<a id="jamwal"></a>
### Jamwal et al.: Comparative Analysis of Different Software Quality Models

R. S. Jamwal, D. Jamwal, and D. Padha, ‘Comparative analysis of different software quality models’, in 3rd National Conference, 2009.

Available [online](https://docplayer.net/15320992-Comparative-analysis-of-different-software-quality-models.html)

Side-by-side comparison of the McCall, Boehm, FURPS, Dromey, and ISO 9126 quality models, examining how each defines and organises quality characteristics. A useful starting point for understanding why the models differ and which aspects each one emphasises.

<a id="kazman-maintainability"></a>
### Kazman et al.: Maintainability

R. Kazman, P. Bianco, J. Ivers, and J. Klein, ‘Maintainability’, 2020.

Available [online](https://resources.sei.cmu.edu/asset_files/TechnicalReport/2020_005_001_650490.pdf)

A SEI technical report providing a rigorous definition of maintainability and its sub-characteristics (modularity, reusability, analysability, modifiability, testability). Particularly useful for operationalising maintainability requirements with concrete, measurable criteria.

<a id="martin-clean-architecture"></a>
### Martin et al.: Clean Architecture

R. C. Martin, J. Grenning, and S. Brown, Clean architecture.
Prentice Hall, 2018.

Argues that good architecture maximises the number of decisions _not_ yet made, preserving flexibility by separating high-level policy from low-level detail. Foundational reading for understanding how structural decisions trade off against maintainability, testability, and deployability.

<a id="mccall"></a>
### McCall/Cavano: A framework for the measurement of software quality 

J. P. Cavano and J. A. McCall, ‘A framework for the measurement of software quality’, in Proceedings of the software quality assurance workshop on Functional and performance issues, 1978, pp. 133–139.

Available [online](https://doi.org/10.1145/953579.811113)

Nice statement: 

>One problem ... is the absence of a widely accepted definition of software quality.
>
>Cavano/McCall, p 133.

<a id="nygard2018release"></a>

### Nygard: Release It!

M. T. Nygard, _Release It! Design and Deploy Production-Ready Software_, 2nd ed. Pragmatic Bookshelf, 2018.

Available [online](https://pragprog.com/titles/mnee2/release-it-second-edition/)

The essential field guide to building production-ready systems, covering stability patterns (circuit breakers, bulkheads, timeouts, fail-fast), capacity anti-patterns, and networking failure modes drawn from real-world postmortems. Directly relevant to reliability, availability, and resilience quality requirements in distributed systems.

<a id="mccabe1976complexity"></a>
### McCabe: A complexity measure

T. J. McCabe, ‘A complexity measure’, IEEE Transactions on software Engineering, no. 4, pp. 308–320, 1976.

Available [online](https://www.cs.mtsu.edu/~untch/6050/private/McCabe1976.pdf)

The paper that introduced _cyclomatic complexity_ — a graph-theoretic metric counting the number of linearly independent paths through source code. Remains the most widely used proxy for maintainability and testability in static analysis tooling today.

<a id="mccall1980software"></a>
### McCall/Matsumuto: Software Quality Measurement Manual 

J. A. McCall and M. T. Matsumoto, ‘Software Quality Measurement Manual. Volume 2’, GENERAL ELECTRIC CO SUNNYVALE CA, 1980.

Available [online](https://apps.dtic.mil/sti/pdfs/ADA086986.pdf)

From this document:

>The purpose of this manual is to present a complete set of procedures and guidelines for introducing and utilizing current software quality measurement techniques in a quality assurance program associated with large-scale software system developments.
>
>These procedures and guidelines will identify:
>
>1. How to identify and specify software quality requirements (Setting Quality Goals).
>2. How and when to apply software metrics (Applying Metrics), and
>3. How to interpret the information obtained from the application of the metrics (Making a Quality Assessment)."


(thanx to @ichsteffen for pointing out this awesome reference!)

<a id="mccall1977factors"></a>
### McCall/Walters: Factors in Software Quality

J. McCall and G. Walters, ‘Factors in Software Quality. National Technical Information Service (NTIS)’, Springfield, VA, USA, 1977.

The original McCall quality model, organising eleven quality factors (correctness, reliability, efficiency, integrity, usability, maintainability, testability, flexibility, portability, reusability, interoperability) into three usage perspectives. One of the first systematic attempts to make software quality measurable and directly influenced the ISO 25010 lineage.

<a id="mockus2010experiences"></a>
### Mockus et al.: Experiences from replicating a case study to investigate reproducibility of software development

A. Mockus, B. Anda, and D. I. K. Sjøberg, ‘Experiences from replicating a case study to investigate reproducibility of software development’, in Proceedings of the 1st International Workshop on Replication in Empirical Software Engineering Research, 2010.

Available [online](https://www.academia.edu/download/48902272/Experiences_from_replicating_a_case_stud20160917-12517-1j07fpz.pdf)

Reports on attempts to replicate software development experiments across independent teams, highlighting how difficult it is to reproduce results — and therefore why reproducibility needs to be treated as an explicit quality requirement. Relevant background for quality requirements around reliability of processes, not just products.

<a id="nist-idps"></a>
### Aroms: NIST Intrusion Detection and Prevention Systems (IDPS)

E. Aroms, ‘NIST special publication 800-94 guide to intrusion detection and prevention systems (IDPS)’. CreateSpace, 2012.

Available [online](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-94.pdf)

The NIST reference guide for classifying and deploying intrusion detection and prevention systems, covering network-based, host-based, and wireless variants. Relevant background when specifying security monitoring quality requirements such as detection rate, false-positive thresholds, and response time.

<a id="swebok"></a>
### SWEBOK (IEEE): Guide to the Software Engineering Body of Knowledge

H. Washizaki et al. (eds.), Guide to the Software Engineering Body of Knowledge (SWEBOK), Version 4.0. IEEE Computer Society, 2024.

Available [online](https://www.swebok.org/)

The IEEE's comprehensive reference for the discipline of software engineering. Version 4.0 (2024) includes a dedicated knowledge area on software quality, covering quality models, measurement, and assurance processes — useful as a baseline when defining what "quality" means in a project context.

<a id="sei-qaw"></a>
### SEI: Quality Attribute Workshops (QAW)

L. Bass, P. Clements, R. Kazman, and M. Klein, 'Quality Attribute Workshops (QAWs), Third Edition'. Carnegie Mellon Software Engineering Institute, 2007.

Available [online](https://resources.sei.cmu.edu/library/asset-view.cfm?assetid=5613)

A structured facilitation method for eliciting architecture-critical quality attributes from stakeholders before any software architecture exists. The QAW produces a prioritised set of quality attribute scenarios — directly usable as the basis for quality requirements — and is particularly effective at surfacing conflicting stakeholder expectations early.

<a id="starke2021software"></a>
### Starke/Lorz: Software Architecture Foundations

G. Starke and A. Lorz, Software Architecture Foundation: CPSA Foundation® Exam Preparation. Van Haren, 2021.

>Remark: Since May 2023 a second edition of this book is available, containing several bugfixes.

Covers the core concepts of the iSAQB® CPSA Foundation curriculum, including a chapter on quality requirements and their role in architectural decisions. A concise introduction for readers new to the relationship between architecture and quality.


<a id="volere"></a>
### Robertson/Robertson: Volere Requirements Specification Template

S. Robertson and J. Robertson, Volere Requirements Specification Template

Available [online](https://www.cin.ufpe.br/~in1020/docs/publicacoes/Volere_template16.pdf)

A structured template for capturing both functional and non-functional (quality) requirements, including fit criteria — measurable conditions that determine whether a requirement has been satisfied. The fit-criterion concept directly mirrors the acceptance-criteria approach used throughout this site.

<a id="w3c-design-tokens"></a>
### W3C Design Tokens Community Group

Design Tokens Community Group, ‘Design Tokens Format Module’, 2024.

Available [online](https://www.w3.org/community/design-tokens/)

A W3C community specification defining a vendor-neutral file format for encoding design decisions (colours, typography, spacing) as shareable tokens. Enables a single source of design truth to generate platform-specific code for web, iOS, Android, and Flutter — a key enabler of visual consistency and portability across products.

<a id="wikipedia-theming"></a>
### Wikipedia: Theming (Computing)

Wikipedia contributors, ‘Theming (computing)’, Wikipedia, The Free Encyclopedia.

Available [online](https://en.wikipedia.org/wiki/Theming_(computing))

Overview of theming as a computing concept — the mechanism by which a user interface’s visual appearance (colours, fonts, icons, layout) can be swapped without changing underlying functionality. Useful context for understanding visual flexibility as a quality characteristic in UI-heavy systems.
