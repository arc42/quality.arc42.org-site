# Solution Proposal: Validating Standard Reference Links

## Problem Statement
We found severe errors in standard reference links (e.g., ISO-25010 links pointing to incorrect versions or entirely different topics). With over 40 standard files and numerous articles, manual validation is inefficient and error-prone. We need an automated way to validate these links for both existence (HTTP 200) and semantic correctness (matching the intended topic) without overloading LLMs or context.

## Proposed Solution: Three-Tiered Validation

We propose a multi-stage validation pipeline that can be integrated into the existing CI/CD or run locally as a developer utility.

### Tier 1: Fast Link Checking (Connectivity)
Use a high-performance link checker to identify broken links (404, 500, timeouts).
*   **Tool**: `lychee` (fast, concurrent, written in Rust) or a custom Node.js script.
*   **Action**: Identify links that are technically dead.

### Tier 2: Standalone Semantic Check Prompt
Use the following prompt for a strong LLM to verify semantic consistency for a single standard link.

```markdown
### SYSTEM PROMPT
You are a technical editor specializing in international standards (ISO, IEEE, NIST, etc.). Your task is to verify if a hyperlink in a document points to the correct version and topic described in the text.

### INPUT
- **Source Context**: "{{context}}"
- **Link Text**: "{{link_text}}"
- **Target URL**: "{{url}}"
- **Target Metadata**: 
    - Title: "{{title}}"
    - Description: "{{description}}"
    - H1: "{{h1}}"

### EVALUATION CRITERIA
1. **Topic Match**: Does the target page discuss the standard mentioned in the context (e.g., ISO 25010 vs ISO 9001)?
2. **Version Match**: Does the target page match the specific year or version mentioned (e.g., 2023 vs 2011)?
3. **Draft vs Final**: If the context implies a final standard, does the link point to a draft (DIS/FDIS) or a different stage?

### OUTPUT FORMAT
Return a JSON object:
{
  "status": "CONSISTENT" | "INCONSISTENT" | "UNCERTAIN",
  "issue": "Detailed explanation of any mismatch found, or null",
  "recommendation": "Correct URL or action if known, or null"
}
```

### Tier 3: Human-in-the-Loop Review (Reporting)
Generate a Markdown report highlighting:
*   ❌ **Broken Links**: Direct 404s.
*   ⚠️ **Inconsistent Links**: Flagged by Tier 2 LLM check.
*   🛡️ **Blocked Links**: 403/429 status (manual check required).

---

## Standards Reference Validation Checklist

Check the external reference links for the following standards.

### ISO / IEC / IEEE
| Standard ID | Topic | Done | Verdict / Findings |
| :--- | :--- | :---: | :--- |
| ISO 25010 | Product Quality Model | ✅ | Consistent (2023 version verified). |
| ISO 15408 | Common Criteria (Security) | ✅ | Missing link in file; should be 72891.html (v2022). |
| ISO 24028 | AI Trustworthiness | ✅ | Consistent (TR 24028:2020 verified). |
| ISO 25019 | Quality in Use | ✅ | Consistent (2023 version verified). |
| ISO 25022 | Measurement of Quality in Use | ❌ | BROKEN (35731.html is 404). Use 35746.html. |
| ISO 25024 | Measurement of Data Quality | ✅ | Consistent (2015 version verified). |
| ISO 26262 | Functional Safety (Automotive) | ❌ | OUTDATED (51362.html is 2011/Withdrawn). Use 68388.html. |
| ISO 26514 | User Documentation | ❌ | WRONG TOPIC (82246.html is ISO 6523). Use 81638.html. |
| ISO 27001 | Information Security | ✅ | Consistent (2022 version verified). |
| ISO 38500 | Governance of IT | ✅ | Consistent (2024 version verified). |
| ISO 42001 | AI Management System | ✅ | Consistent (2023 version verified). |
| ISO 42010 | Architecture Description | ❌ | WRONG TOPIC (85720.html is Licorice). Use 74393.html. |
| ISO 5055 | Software Source Code Quality | ❌ | BROKEN (75201.html is 404). Use 80623.html. |
| ISO 8000 | Data Quality | ✅ | Consistent (8000-1:2022 verified). |
| ISO/IEC 14756 | Performance Measurement | ❌ | BROKEN (25505.html 404/Not Found). |
| ISO/IEC 22989 | AI Terminology | ✅ | Consistent (2022 version verified). |
| ISO/IEC 25012 | Data Quality Model | ✅ | Consistent (2008 version verified). |
| ISO/IEC 29100 | Privacy Framework | ⚠️ | OUTDATED (45123.html is 2011/Withdrawn). Use 86455.html (v2024). |
| ISO/IEC/IEEE 12207 | Software Life Cycle | [ ] | Pending check. |
| ISO/IEC/IEEE 29119 | Software Testing | ⚠️ | v29119-11: 82074.html is 2020 version, not 2022. |
| ISO/IEC/IEEE 42030 | Architecture Evaluation | [ ] | Pending check. |

### Note on fixed ISO/IEC:
- **ISO/IEC 29101** (Privacy Arch): ❌ WRONG TOPIC (53017.html is Flame Arresters). Use 75293.html.
- **ISO/IEC 29134** (Privacy Impact): ⚠️ OUTDATED (62289.html is 2017). Use 82103.html (v2023).
- **ISO/IEC 25024**: ✅ Consistent (35749.html verified).
- **ISO/IEC 25000**: ✅ Consistent (64764.html verified).
- **ISO/IEC 23894** (AI Risk): ✅ Consistent (77304.html verified).


### IEC / IEEE
| Standard ID | Topic | Done |
| :--- | :--- | :---: |
| IEC 61508 | Functional Safety (General) | [ ] |
| IEC 62304 | Medical Device Software | [ ] |
| IEC 62443 | Industrial Communication Security | [ ] |
| IEEE 2857 | Privacy Engineering | [ ] |
| IEEE 7000 | Ethical System Design | [ ] |

### EU / ETSI / Regulatory
| Standard ID | Topic | Done |
| :--- | :--- | :---: |
| EU CRA | Cyber Resilience Act | [ ] |
| EN 301 549 | Accessibility Requirements | [ ] |
| ETSI EN 304 223 | Cloud User Privacy | [ ] |
| GDPR | General Data Protection Regulation | [ ] |

### Other Frameworks (NIST, OWASP, etc.)
| Standard ID | Topic | Done |
| :--- | :--- | :---: |
| NIST 800-53 | Security Controls | [ ] |
| NIST AI RMF | AI Risk Management | [ ] |
| NIST Privacy | Privacy Framework | [ ] |
| OWASP ASVS | Application Security Verification | [ ] |
| PCI DSS | Payment Card Industry | [ ] |
| SOC 2 | Service Organization Controls | [ ] |
| SOX | Sarbanes-Oxley Act | [ ] |
| WCAG | Web Content Accessibility | [ ] |
| AUIC | AI User Interaction | [ ] |
| DO-178C | Airborne Systems | [ ] |
| HL7 | Healthcare Interoperability | [ ] |
| MISRA C | Secure C Coding | [ ] |
