---
layout: page_standard
title: "NIST AI RMF — Artificial Intelligence Risk Management Framework"
standard_id: nistairmf
shortname: "NIST AI RMF"
categories: [ai, security, reliability]
permalink: /standards/nist-ai-rmf
---

## NIST AI RMF: Artificial Intelligence Risk Management Framework

The NIST Artificial Intelligence Risk Management Framework (AI RMF 1.0) is a voluntary guidance document published by the US National Institute of Standards and Technology on January 26, 2023, as NIST.AI.100-1.
It provides a structured approach for organizations to identify, assess, and manage risks arising from the design, development, deployment, evaluation, and decommissioning of AI systems throughout their lifecycle.

The framework is sector- and technology-agnostic: it applies to AI systems across autonomous vehicles, healthcare, finance, cybersecurity, and all other domains.
Unlike a prescriptive standard, it defines a risk management *process* rather than a fixed set of controls, allowing organizations to adapt implementation to their specific context, risk tolerance, and resources.

### Brief History

- **January 2023**: AI RMF 1.0 published (NIST.AI.100-1)
- **March 2023**: NIST AI Resource Center (AIRC) launched to support implementation
- **July 2024**: NIST AI 600-1 — Generative AI Profile published as a companion document addressing risks specific to generative AI and large language models
- **Ongoing**: Crosswalk documents maintained mapping the AI RMF to ISO/IEC 42001, OECD AI Principles, EU AI Act, and other frameworks

## Seven Trustworthiness Characteristics

The AI RMF defines trustworthiness through seven characteristics that AI systems should demonstrate:

| Characteristic | Description |
|:---------------|:------------|
| **Valid and Reliable** | AI systems consistently deliver accurate, dependable results aligned with their intended purpose; performance generalizes appropriately across operating contexts |
| **Safe** | AI systems avoid imposing unacceptable risks to health, safety, or property of users and the broader public |
| **Secure and Resilient** | AI systems are robust against cybersecurity threats, adversarial inputs, and unexpected operating conditions while maintaining operational integrity |
| **Accountable and Transparent** | Organizations are open about AI use; decisions and outcomes are traceable; stakeholders can understand and contest results |
| **Explainable and Interpretable** | The reasoning behind AI outputs is knowable and communicable in terms meaningful to the intended audience |
| **Privacy Enhanced** | AI systems protect individual autonomy, identity, dignity, and sensitive personal information throughout the data lifecycle |
| **Fair with Harmful Bias Managed** | AI systems are free from unjustified bias and discrimination; harmful biases in data, models, and processes are identified and mitigated |

These characteristics are *interdependent*: optimizing for one (e.g., explainability) may involve trade-offs with another (e.g., accuracy). The framework does not mandate a hierarchy; organizations must evaluate trade-offs in their specific context.

## The AI RMF Core: Four Functions

The operational core of the framework is organized into four functions that together constitute a full AI risk management lifecycle:

| Function | Purpose | Key focus areas |
|:---------|:--------|:----------------|
| **GOVERN** | Establish organizational culture, policies, and accountability for AI risk management | Culture; accountability; workforce; third-party risk |
| **MAP** | Identify and contextualize AI systems, intended use, stakeholders, and associated risks | Context; categorization; impacts; third-party components |
| **MEASURE** | Select methods, metrics, and testing to evaluate AI risks quantitatively and qualitatively | Measurement methods; testing; actor competency; monitoring |
| **MANAGE** | Prioritize, respond to, and recover from identified AI risks | Risk response; benefit–risk balance; ongoing monitoring; TEVV |

GOVERN is the cross-cutting function: its policies and accountability structures apply at all stages of MAP, MEASURE, and MANAGE. MAP, MEASURE, and MANAGE are applied iteratively throughout the AI lifecycle.

### GOVERN — 6 Categories

| Category | Focus |
|:---------|:------|
| **GOVERN 1** | Policies, processes, procedures, and practices for AI risk management are in place, documented, and organizationally embedded |
| **GOVERN 2** | Accountability structures are established; teams are trained and empowered to perform AI risk management responsibilities |
| **GOVERN 3** | Workforce diversity, equity, inclusion, and accessibility are prioritized throughout the AI lifecycle |
| **GOVERN 4** | Organizational culture actively considers and communicates AI risks and benefits |
| **GOVERN 5** | Relevant AI actors and stakeholders are engaged in AI risk management processes |
| **GOVERN 6** | Risks from third-party entities — including software, data, and AI supply chains — are addressed by organizational policies |

### MAP — 5 Categories

| Category | Focus |
|:---------|:------|
| **MAP 1** | Context is established: intended purpose, beneficial uses, applicable laws, user expectations, and potential negative impacts |
| **MAP 2** | AI system categorization based on capabilities, intended use, and potential risk level |
| **MAP 3** | AI capabilities, targeted usage, goals, and expected benefits and costs are characterized against relevant benchmarks |
| **MAP 4** | Risks and benefits are mapped across all AI system components, including third-party software and training data |
| **MAP 5** | Impacts to individuals, groups, communities, organizations, and society are characterized and documented |

### MEASURE — 4 Categories

| Category | Focus |
|:---------|:------|
| **MEASURE 1** | Measurement approaches (methods and metrics) are selected to evaluate identified risks and trustworthiness characteristics |
| **MEASURE 2** | Testing, evaluation, verification, and validation (TEVV) procedures detect, track, and measure known risks and negative impacts |
| **MEASURE 3** | AI actor competency — including awareness of trustworthiness characteristics — is regularly evaluated and documented |
| **MEASURE 4** | External inputs (training data, third-party models, APIs) are monitored for impact on system performance and risk posture |

### MANAGE — 4 Categories

| Category | Focus |
|:---------|:------|
| **MANAGE 1** | Risks are prioritized against the AI system's intended purpose, objectives, and organizational risk tolerance |
| **MANAGE 2** | Negative risks are weighed against benefits; trustworthiness trade-offs are documented and accepted by accountable stakeholders |
| **MANAGE 3** | Continuous monitoring and documentation of system performance relative to trustworthiness characteristics throughout the deployment lifecycle |
| **MANAGE 4** | Outputs from TEVV activities are incorporated into organizational risk management decisions, change management, and decommissioning |

## Relationship to Other Standards

| Standard | Relationship |
|:---------|:-------------|
| **[ISO/IEC 42001](/standards/iso-42001)** | ISO 42001 provides a certifiable AI Management System (AIMS); the NIST AI RMF provides the risk management process. The two are complementary: NIST publishes an official crosswalk mapping AI RMF categories to ISO 42001 clauses. Organizations pursuing ISO 42001 certification frequently use the AI RMF as their underlying risk assessment methodology. |
| **[ISO/IEC 24028](/standards/iso-24028)** | ISO 24028 addresses trustworthiness in AI systems and enumerates overlapping trustworthiness characteristics. The frameworks use compatible terminologies; AI RMF cites ISO 24028 in its bibliography. |
| **[NIST SP 800-53](/standards/nist-800-53)** | NIST publishes an official crosswalk between the AI RMF and SP 800-53 security and privacy controls, allowing organizations to align AI-specific risk management with their existing cybersecurity control frameworks. |
| **[ISO/IEC 22989](/standards/iso-22989)** | Provides the AI concepts and terminology referenced throughout the AI RMF, including definitions of AI system, AI lifecycle, and trustworthiness. |

## Quality Attributes Addressed

| Quality Attribute | Relevance in NIST AI RMF |
|:--- |:--- |
| **[Safety](/qualities/safety)** | The Safe trustworthiness characteristic (MEASURE 2, MANAGE 1) requires that AI systems avoid unacceptable risks to health, safety, and property; TEVV processes must include safety-focused testing. |
| **[Security](/qualities/security)** | The Secure and Resilient characteristic (GOVERN 6, MAP 4, MEASURE 2) requires assessment of adversarial robustness, supply chain risk, and cybersecurity controls across the AI lifecycle. |
| **[Resilience](/qualities/resilience)** | Resilience is explicitly embedded in the Secure and Resilient characteristic; MANAGE 3 requires monitoring that systems maintain operational integrity under unexpected conditions. |
| **[Reliability](/qualities/reliability)** | The Valid and Reliable characteristic (MEASURE 1, MEASURE 2) requires that AI systems deliver consistent, accurate results; performance metrics and benchmarking are mandated throughout MAP and MEASURE. |
| **[Accountability](/qualities/accountability)** | The Accountable and Transparent characteristic and GOVERN 1–2 require documented accountability structures, traceable decisions, and clear assignment of responsibility across the AI lifecycle. |
| **[Transparency](/qualities/transparency)** | Transparency is co-defined with accountability in the framework; GOVERN 4–5 require open communication of AI risks and stakeholder engagement in risk management processes. |
| **[Explainability](/qualities/explainability)** | The Explainable and Interpretable characteristic requires that AI reasoning be communicable to its intended audience; MEASURE 2 includes evaluation of explainability as part of TEVV. |
| **[Privacy](/qualities/privacy)** | The Privacy-Enhanced characteristic (MAP 5, MEASURE 2) requires data minimization, purpose limitation, and protection of personal information throughout the AI lifecycle, including in training data and model outputs. |
| **[Fairness](/qualities/fairness)** | The Fair with Harmful Bias Managed characteristic (MAP 5, MEASURE 2, MANAGE 2) requires identification, measurement, and mitigation of harmful biases in data, models, and deployment contexts. |

## References

### Official NIST Sources

- [AI Risk Management Framework — NIST overview page](https://www.nist.gov/itl/ai-risk-management-framework)
- [NIST AI 100-1: Artificial Intelligence Risk Management Framework (AI RMF 1.0)](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf) — the primary framework document (January 2023)
- [NIST AI Resource Center (AIRC)](https://airc.nist.gov/) — implementation resources, playbook, and crosswalk documents
- [NIST AI 600-1: Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) — companion document addressing generative AI risk (July 2024)
- [AI RMF Playbook](https://www.nist.gov/itl/ai-risk-management-framework/nist-ai-rmf-playbook) — suggested actions for each AI RMF subcategory
