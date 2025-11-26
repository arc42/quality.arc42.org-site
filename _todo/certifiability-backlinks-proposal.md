# Certifiability Backlinks Proposal

This document proposes which existing quality attributes should add `certifiability` to their `related` field.

## High-Priority Backlinks (Strong Relationship)

### 1. compliance
**Current relations:** security, safety, usability, reliability, efficiency, testability, auditability, traceability, accountability

**Proposed addition:** `certifiability`

**Rationale:** Certification is a formal demonstration of compliance with specific standards. Certifiability and compliance are closely interrelated—systems designed for compliance are more certifiable, and certification proves compliance.

---

### 2. safety
**Current relations:** integrity, availability, non-repudiation, confidentiality, accountability, authenticity, resistance

**Proposed addition:** `certifiability`

**Rationale:** Safety-critical systems (aviation, automotive, medical, industrial) typically require certification to demonstrate safety compliance. Standards like DO-178C, ISO 26262, IEC 62304, and IEC 61508 all mandate certification for safety assurance.

---

### 3. testability
**Current relations:** analyzability, modifiability, modularity, observability, controllability, maintainability

**Proposed addition:** `certifiability`

**Rationale:** Testability is fundamental to certifiability. Certification requires comprehensive test evidence, coverage analysis, and verification results. Highly testable systems are easier to certify.

---

### 4. traceability
**Current relations:** auditability, transparency, accountability, documentation, provenance

**Proposed addition:** `certifiability`

**Rationale:** Traceability (requirements → design → code → tests) is a core requirement for certification in all safety-critical standards. Certifiability depends heavily on complete traceability.

---

### 5. auditability
**Current relations:** transparency, accountability, traceability, logging, compliance

**Proposed addition:** `certifiability`

**Rationale:** Certification processes involve audits of development artifacts, processes, and evidence. Auditable systems are more certifiable because they provide clear verification trails.

---

## Medium-Priority Backlinks (Moderate Relationship)

### 6. documentation
**If this quality exists**

**Proposed addition:** `certifiability`

**Rationale:** Comprehensive documentation (architecture, design, verification, user manuals) is mandatory for certification. Well-documented systems are more certifiable.

---

### 7. verifiability
**If this quality exists**

**Proposed addition:** `certifiability`

**Rationale:** Certification requires verification evidence. Verifiable systems provide clear proof of correctness, essential for certification authorities.

---

### 8. analyzability
**Current relations:** testability, modifiability, maintainability, observability, understandability

**Proposed addition:** `certifiability`

**Rationale:** Static analysis and code reviews are common certification requirements. Analyzable code facilitates verification and certification evidence generation.

---

### 9. patient-safety
**Current relations:** safety, robustness, data-quality, completeness, accuracy, integrity

**Proposed addition:** `certifiability`

**Rationale:** Medical device software must be certified under IEC 62304. Patient safety in software systems is demonstrated through certification processes.

---

### 10. functional-safety
**If this quality exists**

**Proposed addition:** `certifiability`

**Rationale:** Functional safety standards (ISO 26262, IEC 61508) explicitly require certification. Functional safety and certifiability are tightly coupled in regulated domains.

---

## Lower-Priority Backlinks (Weak/Indirect Relationship)

### 11. modularity
**Rationale:** Modular designs facilitate testing and verification, supporting certification efforts. However, the relationship is indirect.

**Recommendation:** Consider, but not essential.

---

### 12. maintainability
**Rationale:** Some certification standards require maintainability evidence. Relationship is indirect but present in lifecycle certification.

**Recommendation:** Consider, but not essential.

---

### 13. reliability
**Rationale:** Certification often requires reliability demonstrations (failure rates, MTBF). Relationship exists but is indirect.

**Recommendation:** Consider, but not essential.

---

## Summary of Recommended Backlinks

**High Priority (Recommend adding):**
1. compliance
2. safety
3. testability
4. traceability
5. auditability

**Medium Priority (Recommend if quality exists):**
6. documentation
7. verifiability
8. analyzability
9. patient-safety
10. functional-safety

**Lower Priority (Optional):**
11. modularity
12. maintainability
13. reliability

---

## Implementation Notes

- Check if `documentation`, `verifiability`, and `functional-safety` qualities exist before adding backlinks
- Ensure symmetric relationships where appropriate (certifiability already links to most of these)
- Run link validation after updates
- Consider regenerating graph data to reflect new relationships
