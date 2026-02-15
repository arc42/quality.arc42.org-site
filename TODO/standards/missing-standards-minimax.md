# Prioritized Gap Analysis: Missing Standards for quality.arc42.org

Based on review of the current 33 standards on quality.arc42.org, this document identifies important standards that appear to be missing, with references and rationale for each inclusion.

> (claude:) **Review conducted 2026-02-15.** Each entry was verified for existence, URL validity, description accuracy, and relevance. Findings are inline below in `> (claude:)` blocks.

---

## Priority 1: Critical Standards (Widely Used, Foundational)

### 1. ISO/IEC/IEEE 29119 — Software Testing

- **Reference**: https://www.iso.org/standard/79429.html
- **Alternative**: https://softwaretestingstandard.org/
- **Why it matters**: This is the internationally agreed standard for software testing, superseding the older IEEE 829 and BS 7925 standards. It defines vocabulary, processes, documentation, techniques, and a process assessment model for testing. Given you have testability as a quality but lack a dedicated testing standard, this fills an important gap.

> (claude:) **VERDICT: VALID. Recommend adding.**
> Standard exists and is active. Description is accurate — it supersedes IEEE 829-2008 (test documentation), BS 7925-2 (test techniques), and IEEE 1008 (unit testing). Multi-part standard (parts 1–5). Primary URL returns 403 (normal for ISO paywall), but the alternative URL https://softwaretestingstandard.org/ works and is a good community resource. ISO 22989 already references part 11 (29119-11, testing of AI-based systems). High practical relevance — fills a genuine gap since the site has `testability` as a quality but no testing standard.

---

### 2. OWASP Application Security Verification Standard (ASVS)

- **Reference**: https://owasp.org/www-project-application-security-verification-standard/
- **GitHub**: https://github.com/OWASP/ASVS
- **Why it matters**: The de facto standard for web application security verification, providing a framework for designing, developing, and testing technical security controls. You have security standards but lack this widely-adopted application security framework that is essential for modern web-based systems.

> (claude:) **VERDICT: VALID. Recommend adding.**
> Both URLs work. Current version is 5.0.0 (released May 2025). Description is accurate but slightly overstated: "de facto standard" should be softened to "widely adopted industry framework" — ASVS is not formally standardized by ISO/IEEE. That said, it has very high practical relevance and is widely referenced in security audits. Good complement to the existing security standards (ISO 27001, NIST 800-53, PCI DSS).

---

### 3. NIST AI Risk Management Framework (AI RMF)

- **Reference**: https://www.nist.gov/itl/ai-risk-management-framework
- **PDF**: https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf
- **Why it matters**: The US government's official framework for managing AI risks, now becoming a de facto international standard. It addresses trustworthiness attributes including validity, safety, security, accountability, explainability, privacy, and fairness. You have several AI standards but lack this critical framework that is rapidly being adopted globally.

> (claude:) **VERDICT: VALID. Recommend adding, but fix description.**
> Both URLs work (main page and PDF). The framework exists and is important (NIST AI 100-1, released January 2023). However, calling it "official" is misleading — it is **voluntary, not mandatory**. It is not a regulation or a binding standard. Correct phrasing: "NIST's voluntary framework for managing AI risks." The site already references NIST AI RMF crosswalks in `iso-iec-22989.md`, so adding a dedicated page would be consistent. High relevance — maps well to existing qualities (explainability, fairness, accountability, safety).

---

## Priority 2: High-Value Standards (Growing Importance)

### 4. ISO 8000 — Data Quality

- **Reference**: https://www.iso.org/standard/81745.html
- **Why it matters**: The international standard defining data quality characteristics and exchange protocols. ISO 8000-8 provides requirements for measuring data quality. With data quality as one of your qualities, a corresponding standard would provide the formal framework for implementing data quality management.

> (claude:) **VERDICT: VALID, but lower priority than ISO/IEC 25012.**
> Standard exists and is active (multi-part, ISO 8000-1:2022 is current). Description is accurate. However, ISO 8000 focuses primarily on **master data quality and data exchange** (industrial/supply-chain context), not software quality per se. For the arc42 quality model, **ISO/IEC 25012** (see #14) is the better fit because it is part of the SQuaRE family and already referenced in the existing `iso-25024.md`. Consider adding ISO 8000 only if master data / supply-chain data quality is in scope.

---

### 5. ISO/IEC 17789 — Cloud Computing Reference Architecture

- **Reference**: https://www.iso.org/standard/62594.html
- **Why it matters**: Specifies the cloud computing reference architecture including roles, services, and deployment models. With cloud-native qualities like elasticity in your model, this standard provides the architectural foundation for cloud systems.

> (claude:) **VERDICT: PROBLEMATIC. Do not add without further verification.**
> The URL https://www.iso.org/standard/62594.html does **not** resolve to ISO/IEC 17789 — it points to a different standard. The correct URL for ISO/IEC 17789:2014 is https://www.iso.org/standard/60545.html. More critically, ISO/IEC 17789:2014 is a **2014 standard** and there are indications it may have been superseded or withdrawn. Its practical relevance is also questionable — it defines a reference architecture (roles, activities, components) but does not prescribe quality attributes directly. Cloud-native architecture is better served by more current and actionable standards. **Recommend dropping or replacing** with something more current, e.g., ISO/IEC 22123 (Cloud computing concepts) or the CNCF Cloud Native landscape.

---

### 6. SOC 2 — Service Organization Control

- **Reference**: https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2
- **Why it matters**: The most commonly requested security compliance standard for service organizations, particularly in North America. It evaluates controls related to security, availability, processing integrity, confidentiality, and privacy. Essential for any software vendor selling to US enterprises.

> (claude:) **VERDICT: VALID. Recommend adding.**
> URL works. Description is accurate. SOC 2 is developed by AICPA and is indeed one of the most commonly requested compliance frameworks for SaaS/cloud vendors, especially in North America. Its five Trust Service Criteria (security, availability, processing integrity, confidentiality, privacy) map directly to quality attributes in the arc42 model. Already mentioned in `auic.md` for comparison. High practical relevance. Note: SOC 2 is an **audit framework**, not a standard in the ISO sense — it defines criteria against which an independent auditor assesses controls.

---

### 7. IEEE 700 Series — Ethically Aligned Design

- **Reference**: https://standards.ieee.org/browse/ieee-700/
- **Why it matters**: The most comprehensive suite of AI ethics standards in the world, covering topics like transparency, algorithmic bias, and human wellbeing. Standards like IEEE 7001 (Transparency of Autonomous Systems) and IEEE 7003 (Algorithmic Bias) directly support qualities like explainability and fairness in your model.

> (claude:) **VERDICT: VALID, but needs corrections.**
> The individual standards exist: IEEE 7001-2021 (Transparency of Autonomous Systems) is published, IEEE 7003-2024 (Algorithmic Bias Considerations) is published. However, several issues:
> 1. **Wrong name**: The series is called the **IEEE 7000 series** (not "700 series"). "Ethically Aligned Design" is the name of a related IEEE initiative/report, not the standards series.
> 2. **URL is wrong**: https://standards.ieee.org/browse/ieee-700/ does not exist. Correct entry point: https://ethicsstandards.org/p7000/ (OCEANIS/IEEE overview).
> 3. **Superlative is unverifiable**: "most comprehensive suite of AI ethics standards in the world" is a subjective claim.
> 4. Many standards in the P7000 series are still **drafts/projects** (P7002, P7004, P7005, P7008, P7009, P7014), not published standards.
>
> **Recommend adding** IEEE 7001 and IEEE 7003 individually (they are published and relevant to explainability/fairness), rather than claiming the entire "series."

---

## Priority 3: Important Standards (Specific Use Cases)

### 8. NIST Privacy Framework

- **Reference**: https://www.nist.gov/privacy-framework
- **Why it matters**: While you have GDPR and ISO/IEC 29100, the NIST Privacy Framework provides a voluntary tool for managing privacy risk that complements GDPR compliance and is widely used in US federal and commercial contexts.

> (claude:) **VERDICT: VALID. Recommend adding.**
> URL works. Description is accurate. Updated to version 1.1 in 2025 with improved alignment to NIST CSF 2.0. Voluntary, practical, and widely used. Complements the existing GDPR and ISO/IEC 29100 entries well — GDPR is a regulation, ISO 29100 is a framework, and NIST Privacy Framework is the US-centric practical risk management tool. Good coverage breadth.

---

### 9. ISO/IEC 27002 — Information Security Controls

- **Reference**: https://www.iso.org/standard/27002
- **Why it matters**: The practical implementation guide for ISO/IEC 27001, providing specific security controls. You have ISO/IEC 27001 but lack this actionable controls framework.

> (claude:) **VERDICT: VALID, but URL is broken and value is debatable.**
> The standard exists (ISO/IEC 27002:2022 is current). However:
> 1. **URL is invalid**: https://www.iso.org/standard/27002 returns 403. Correct URL: https://www.iso.org/standard/75652.html
> 2. **Description slightly oversimplified**: ISO 27002 is a "code of practice" / reference set of security controls with implementation guidance, not just an "implementation guide."
> 3. **Marginal added value**: The existing `iso-27001.md` already mentions ISO 27002 three times (clauses 35, 42, 45) and explains its relationship. Adding a separate page risks duplication. ISO 27002 does not define quality attributes independently — it provides the controls that implement ISO 27001.
>
> **Recommend: low priority.** Consider mentioning it more prominently on the ISO 27001 page rather than creating a separate entry.

---

### 10. FedRAMP — Federal Risk and Authorization Management Program

- **Reference**: https://www.fedramp.gov/
- **Why it matters**: Essential for any software vendor serving US federal agencies. While sector-specific, it's one of the most widely requested security certifications in the world.

> (claude:) **VERDICT: VALID. Recommend adding if US-market scope is desired.**
> URL works. Description is accurate — FedRAMP is mandatory for all executive agency cloud deployments. High practical relevance for vendors targeting US government. However, it is **US-specific** and the arc42 quality model has a predominantly European/international orientation. Worth adding for completeness, but lower priority than internationally applicable standards. Note: "one of the most widely requested security certifications in the world" is a strong claim — it is specifically US federal, not global.

---

### 11. HIPAA — Health Insurance Portability and Accountability Act

- **Reference**: https://www.hipaa.gov/
- **Why it matters**: You have HL7 for healthcare data exchange, but HIPAA is the primary US regulation for protecting health information. Essential complement for healthcare software systems.

> (claude:) **VERDICT: VALID, but URL is wrong.**
> HIPAA exists and is indeed the primary US regulation for health information protection. However:
> 1. **URL is incorrect**: https://www.hipaa.gov/ is **not an official government domain**. It redirects but is not authoritative. Correct URL: https://www.hhs.gov/hipaa/ (US Department of Health and Human Services).
> 2. **US-specific**: Same caveat as FedRAMP — relevant primarily for US-market healthcare software.
> 3. **Regulation, not standard**: HIPAA is a federal law (1996), not a technical standard. This is fine — the site already includes GDPR (also a regulation). But the distinction should be noted.
>
> **Recommend adding** if healthcare is in scope, with corrected URL.

---

## Priority 4: Emerging Standards (Future-Oriented)

### 12. OWASP Top 10

- **Reference**: https://owasp.org/www-project-top-ten/
- **Why it matters**: The most recognized web application security awareness document, defining the most critical security risks. While ASVS is more comprehensive, the Top 10 is essential for security education and quick assessments.

> (claude:) **VERDICT: VALID. Recommend adding.**
> URL works. Description is accurate. Latest version is OWASP Top 10:2025 (just released). Very high practical relevance — universally recognized in web application security. The existing `ieee-2857.md` already references OWASP privacy risks. Note: OWASP Top 10 is an **awareness document**, not a verification standard (that's ASVS). Consider adding both OWASP Top 10 and ASVS as a pair. Categorizing this as "Priority 4 / Emerging" is wrong — it has been established since 2003 and is arguably more widely known than most Priority 1 entries. **Suggest upgrading to Priority 2.**

---

### 13. DORA (DevOps Research and Assessment) Program Standards

- **Reference**: https://dora.dev/
- **Why it matters**: While you include DORA metrics as a quality, formal standards from Google's DORA program provide the research-backed benchmarks for DevOps performance.

> (claude:) **VERDICT: PROBLEMATIC. Needs major rework or removal.**
> Multiple issues:
> 1. **Not a standard**: Google's DORA program produces **research and benchmarks** (annual State of DevOps Report), not "formal standards." Calling them "standards" is factually incorrect.
> 2. **Already covered**: The site has `_qualities/D/devops-metrics.md` with alias `DORA.md` — the DORA metrics are already represented as a quality attribute, not a standard. Adding a "standard" entry would be architecturally wrong.
> 3. **Naming conflict**: "DORA" now primarily refers to the **EU Digital Operational Resilience Act** (Regulation (EU) 2022/2554), which took effect 17 January 2025. This is a binding EU regulation for financial sector ICT resilience — a real regulation with penalties up to 2% of worldwide turnover. If any "DORA" is added as a standard/regulation, it should be the **EU DORA**, not Google's research program.
>
> **Recommend: Drop Google DORA from this list.** Consider adding **EU DORA (Digital Operational Resilience Act)** instead — it is a real regulation with high relevance for financial sector software, similar to how GDPR is already included.

---

### 14. ISO/IEC 25012 — Data Quality Model

- **Reference**: https://www.iso.org/standard/40894.html
- **Why it matters**: Specifically addresses data quality in software, complementary to ISO 8000 and ISO/IEC 25024.

> (claude:) **VERDICT: VALID. Recommend adding — better fit than ISO 8000.**
> Standard exists (ISO/IEC 25012:2008, still current). The URL https://www.iso.org/standard/35736.html is correct but may return 403 from automated tools (CloudFlare). Description is accurate — it defines 15 data quality characteristics categorized as inherent vs. system-dependent. Part of the SQuaRE family, and already referenced multiple times in the existing `iso-25024.md` (which says it "complements ISO/IEC 25012"). This is a **better candidate than ISO 8000** (#4) for the arc42 quality model because it is SQuaRE-aligned. **Suggest upgrading to Priority 2.**

---

## Summary Table

| Priority | Standard | Category | Reference |
|----------|----------|----------|-----------|
| 1 | ISO/IEC/IEEE 29119 | Testing | https://www.iso.org/standard/79429.html |
| 1 | OWASP ASVS | Security | https://owasp.org/www-project-application-security-verification-standard/ |
| 1 | NIST AI RMF | AI | https://www.nist.gov/itl/ai-risk-management-framework |
| 2 | ISO 8000 | Data Quality | https://www.iso.org/standard/81745.html |
| 2 | ISO/IEC 17789 | Cloud | https://www.iso.org/standard/62594.html |
| 2 | SOC 2 | Security | https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2 |
| 2 | IEEE 700 Series | AI Ethics | https://standards.ieee.org/browse/ieee-700/ |
| 3 | NIST Privacy Framework | Privacy | https://www.nist.gov/privacy-framework |
| 3 | ISO/IEC 27002 | Security | https://www.iso.org/standard/27002 |
| 3 | FedRAMP | Security | https://www.fedramp.gov/ |
| 3 | HIPAA | Healthcare | https://www.hipaa.gov/ |
| 4 | OWASP Top 10 | Security | https://owasp.org/www-project-top-ten/ |
| 4 | DORA Standards | DevOps | https://dora.dev/ |
| 4 | ISO/IEC 25012 | Data Quality | https://www.iso.org/standard/40894.html |

---

*This analysis was prepared to complement the existing quality.arc42.org standards catalog. The recommendations represent standards that would provide additional value to software engineering teams working in enterprise, cloud, AI/ML, and security-sensitive contexts.*

---

> (claude:) ## Review Summary (2026-02-15)
>
> ### Recommended to add (high confidence)
> | # | Standard | Verdict |
> |---|----------|---------|
> | 1 | ISO/IEC/IEEE 29119 (Software Testing) | Valid, fills a genuine gap |
> | 2 | OWASP ASVS | Valid, soften "de facto standard" wording |
> | 3 | NIST AI RMF | Valid, clarify it is voluntary |
> | 6 | SOC 2 | Valid, note it is an audit framework |
> | 8 | NIST Privacy Framework | Valid, complements GDPR and ISO 29100 |
> | 12 | OWASP Top 10 | Valid, upgrade from Priority 4 to Priority 2 |
> | 14 | ISO/IEC 25012 | Valid, upgrade from Priority 4 to Priority 2, better fit than ISO 8000 |
>
> ### Recommended with caveats
> | # | Standard | Issue |
> |---|----------|-------|
> | 4 | ISO 8000 (Data Quality) | Valid but lower priority than ISO/IEC 25012 |
> | 7 | IEEE 7000 series | Name is wrong ("700" → "7000"), URL broken, add IEEE 7001 + 7003 individually |
> | 10 | FedRAMP | Valid but US-specific; lower priority for international audience |
> | 11 | HIPAA | Valid but URL wrong (use hhs.gov), US-specific |
>
> ### Do not add as proposed
> | # | Standard | Reason |
> |---|----------|--------|
> | 5 | ISO/IEC 17789 | Wrong URL, possibly withdrawn/outdated, low quality-attribute relevance |
> | 9 | ISO/IEC 27002 | URL broken, already covered within ISO 27001 page |
> | 13 | DORA (Google) | Not a standard, already covered as quality. Consider **EU DORA** regulation instead |
>
> ### Missing from this list (consider adding)
> - **EU DORA** (Digital Operational Resilience Act, Regulation (EU) 2022/2554) — binding EU regulation for financial sector ICT resilience, effective January 2025
> - **ISO/IEC 38500** (Governance of IT) — already added to the site on branch `add-iso-38500`
