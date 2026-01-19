# ETSI EN 304 223 - Quality Attributes Analysis

This document collects the quality attributes referenced or implied by ETSI EN 304 223 (Securing Artificial Intelligence - Baseline Cyber Security Requirements for AI Models and Systems).

## Existing Qualities in Repository

These quality attributes are already defined in the `_qualities/` collection and can be linked to the new standard:

| Quality | Path | Relevance to EN 304 223 |
|:--- |:--- |:--- |
| Security | `_qualities/S/security.md` | Core attribute - entire standard focuses on AI cybersecurity |
| Confidentiality | `_qualities/C/confidentiality.md` | P8: Protection of training data, model weights |
| Integrity | `_qualities/I/integrity.md` | P6, P8: Versioning, data validation, protection against poisoning |
| Availability | `_qualities/A/availability.md` | P7, P11: Disaster recovery, timely updates |
| Robustness | `_qualities/R/robustness.md` | P4: Resistance to adversarial inputs and attacks |
| Traceability | `_qualities/T/traceability.md` | P3: Audit trails for models, datasets, prompts |
| Accountability | `_qualities/A/accountability.md` | P1-P4: Stakeholder roles and responsibilities |
| Auditability | `_qualities/A/auditability.md` | P3, P12: Logging and audit capabilities |
| Maintainability | `_qualities/M/maintainability.md` | P11, P12: Updates, patches, monitoring |
| Recoverability | `_qualities/R/recoverability.md` | P7: Disaster recovery for AI-specific attacks |
| Resilience | `_qualities/R/resilience.md` | P7, P11: Ability to withstand incidents |
| Transparency | `_qualities/T/transparency.md` | P10: Communication with end-users |
| Reliability | `_qualities/R/reliability.md` | P11, P12: Operational stability |
| Cyber Security | `_qualities/C/cyber-security.md` | Entire standard - AI-specific cybersecurity |
| Information Security | `_qualities/I/information-security.md` | P8: Protection of sensitive AI assets |

## Potentially Missing Qualities

These concepts are emphasized in EN 304 223 but may not have dedicated quality attribute files:

### High Priority - Consider Adding

1. **Data Protection / Data Privacy**
   - Referenced in: P8 (Data & Input Protection), P13 (Controlled Decommissioning)
   - Description: Safeguarding training data, model parameters, and user data throughout the AI lifecycle
   - Note: Check if `data-protection.md` exists or should be created

2. **Supply Chain Security**
   - Referenced in: P9 (Supply Chain Security)
   - Description: Security practices for external components, dependencies, and third-party AI models
   - Note: This is an emerging concern for AI systems

3. **Explainability / Interpretability**
   - Related to: P10 (End-User Communication), P4 (Threat Modeling)
   - Description: Ability to explain AI system decisions and behavior to stakeholders
   - Note: Critical for AI accountability and trust

4. **Observability**
   - Referenced in: P12 (Operational Monitoring)
   - Description: Logging, anomaly detection, drift detection, internal-state monitoring
   - Note: May overlap with auditability but has distinct AI-specific aspects

### Medium Priority - Consider Adding

5. **Controllability**
   - Referenced in: P4 (Human oversight capabilities)
   - Description: Ability for humans to intervene, override, or control AI system behavior

6. **Reproducibility**
   - Related to: P5 (Asset Inventory), P6 (Versioning)
   - Description: Ability to recreate AI training results and model behavior

7. **Fairness / Non-discrimination**
   - Related to: P4 (Threat Modeling), P10 (Affected Entities)
   - Description: AI systems should not produce biased or discriminatory outcomes
   - Note: Referenced in EU AI Act which EN 304 223 aligns with

8. **Data Quality**
   - Referenced in: P8 (Data & Input Protection)
   - Description: Accuracy, completeness, and fitness of training data for intended purpose

### Lower Priority - May Be Covered by Existing Qualities

9. **Testability**
   - Referenced in: P9 (Conduct appropriate testing)
   - Description: Ability to verify AI system behavior through testing
   - Note: May already exist; check `_qualities/T/testability.md`

10. **Modularity**
    - Related to: P5 (Asset Inventory, interdependencies)
    - Description: Clean separation of AI components for security and maintainability

## Mapping: 13 Principles to Quality Attributes

| Principle | Primary Quality Attributes |
|:--- |:--- |
| P1: Security Training | Accountability, Security |
| P2: Security-by-Design | Security, Maintainability |
| P3: Audit Trails | Traceability, Auditability, Accountability |
| P4: Threat Modeling | Security, Robustness, (Controllability) |
| P5: Asset Inventory | Traceability, (Reproducibility) |
| P6: Versioning & Authentication | Integrity, Traceability |
| P7: Disaster Recovery | Recoverability, Resilience, Availability |
| P8: Data & Input Protection | Confidentiality, Integrity, (Data Protection) |
| P9: Supply Chain Security | Security, (Supply Chain Security) |
| P10: End-User Communication | Transparency, (Explainability) |
| P11: Timely Updates | Maintainability, Availability |
| P12: Operational Monitoring | Auditability, (Observability), Reliability |
| P13: Controlled Decommissioning | Confidentiality, (Data Protection) |

## Action Items

### Immediate Actions

1. [ ] Add `standards: [etsien304223]` to existing quality files:
   - `_qualities/S/security.md`
   - `_qualities/C/confidentiality.md`
   - `_qualities/I/integrity.md`
   - `_qualities/A/availability.md`
   - `_qualities/R/robustness.md`
   - `_qualities/T/traceability.md`
   - `_qualities/A/accountability.md`
   - `_qualities/A/auditability.md`
   - `_qualities/M/maintainability.md`
   - `_qualities/R/recoverability.md`
   - `_qualities/R/resilience.md`
   - `_qualities/T/transparency.md`

### Future Considerations

2. [ ] Review whether to create new quality files for AI-specific attributes:
   - Data Protection (if not already existing)
   - Supply Chain Security
   - Explainability
   - Observability
   - Controllability

3. [ ] Consider creating an "AI" or "ai-security" tag for filtering qualities relevant to AI systems

4. [ ] Review related standards for potential cross-referencing:
   - ISO/IEC 42001 (AI Management Systems)
   - ISO/IEC 22989 (AI Concepts and Terminology)
   - EU AI Act requirements

## References

- [ETSI EN 304 223 V2.1.1 (2025-12)](https://www.etsi.org/deliver/etsi_en/304200_304299/304223/02.01.01_60/en_304223v020101p.pdf)
- [ETSI Press Release](https://www.etsi.org/newsroom/press-releases/2627-etsi-releases-world-leading-standard-for-securing-ai)
- [Help Net Security Analysis](https://www.helpnetsecurity.com/2026/01/19/etsi-european-standard-ai-security/)
