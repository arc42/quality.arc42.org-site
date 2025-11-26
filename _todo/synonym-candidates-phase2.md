# Synonym Candidates Analysis - arc42 Quality Attributes

**Date**: 2025-11-26
**Total Qualities Analyzed**: 181+
**Already Implemented**: 4 pairs (performance, availability, changeability, time-to-market)
**New Candidates Found**: 16 pairs

---

## HIGH CONFIDENCE SYNONYMS ⭐⭐⭐

**Recommendation**: Implement these immediately - they have explicit synonym declarations in content.

### 1. precision / preciseness
- **Canonical**: `precision`
- **Synonym**: `preciseness`
- **Evidence**: preciseness.md contains only "see [precision](/qualities/precision)"
- **Files**:
  - `_qualities/P/precision.md` (canonical)
  - `_qualities/P/preciseness.md` (redirect stub content)
- **Action**: Convert preciseness to redirect stub

### 2. internationalization / i18n
- **Canonical**: `internationalization`
- **Synonym**: `i18n`
- **Evidence**: i18n is standard abbreviation (i + 18 letters + n); title shows "i18n (Internationalization)"
- **Files**:
  - `_qualities/I/internationalization.md` (canonical)
  - `_qualities/I/i18n.md` (synonym)
- **Action**: Convert i18n to redirect stub
- **Note**: Very common abbreviation, high SEO value

### 3. compliance / standard-compliance
- **Canonical**: `compliance`
- **Synonym**: `standard-compliance`
- **Evidence**: standard-compliance.md explicitly says "a.k.a. [compliance]"
- **Files**:
  - `_qualities/C/compliance.md` (canonical)
  - `_qualities/S/standard-compliance.md` (synonym)
- **Action**: Convert standard-compliance to redirect stub

### 4. devops-metrics / DORA
- **Canonical**: `devops-metrics`
- **Synonym**: `DORA`
- **Evidence**: DORA.md says "DORA stands for DevOps Research and Assessment" then "See [devops-metrics]"
- **Files**:
  - `_qualities/D/devops-metrics.md` (canonical)
  - `_qualities/D/DORA.md` (acronym/synonym)
- **Action**: Convert DORA to redirect stub
- **Note**: DORA is well-known in DevOps community

### 5. security / information-security
- **Canonical**: `security`
- **Synonym**: `information-security`
- **Evidence**: information-security.md line 11: "Similar / synonym to [security](/qualities/security)."
- **Files**:
  - `_qualities/S/security.md` (canonical)
  - `_qualities/I/information-security.md` (synonym)
- **Action**: Convert information-security to redirect stub
- **Note**: Has ISO 27001 standard reference - preserve in canonical

---

## MEDIUM CONFIDENCE SYNONYMS ⭐⭐

**Recommendation**: Review content carefully, likely synonyms but may have subtle distinctions.

### 6. readability / legibility
- **Canonical**: `readability` (more common term)
- **Synonym**: `legibility`
- **Evidence**:
  - Both have identical Cambridge Dictionary definition: "The fact of being easy to read"
  - readability.md lists legibility in "See also" section
  - Both mention being "sometimes a synonym for understandability"
- **Distinction**:
  - Legibility = physical clarity of letters/text (typography)
  - Readability = comprehension ease (slightly broader)
- **Confidence**: 75% - very close but typography vs comprehension nuance
- **Recommendation**: **Implement** - distinctions are minimal in software quality context

### 7. correctness / functional-correctness
- **Canonical**: `correctness`
- **Synonym**: `functional-correctness`
- **Evidence**:
  - Both have identical ISO-25010:2023 definition: "Provide accurate results when used by intended users"
  - Reference each other in "See also" sections
- **Distinction**: functional-correctness is scoped to functional aspects only
- **Confidence**: 70% - mostly same but scope difference
- **Recommendation**: **Consider** - depends if functional-correctness adds value as distinct term

### 8. suitability / functional-suitability
- **Canonical**: `suitability`
- **Synonym**: `functional-suitability`
- **Evidence**:
  - Both have identical ISO-25010:2023 definition: "Provide functions that meet stated and implied needs"
  - Reference each other in "See also" sections
- **Distinction**: functional-suitability is scoped to functional aspects only
- **Confidence**: 70% - mostly same but scope difference
- **Recommendation**: **Consider** - similar to correctness case above

### 9. recoverability / recovery-time
- **Canonical**: `recoverability`
- **Synonym**: `recovery-time`
- **Evidence**: recovery-time.md says "see [recoverability]" and defines time to recover
- **Distinction**:
  - Recoverability = capability to recover
  - Recovery-time = measurement of time aspect
- **Confidence**: 60% - related but one is capability, one is metric
- **Recommendation**: **Keep separate** - capability vs metric distinction is meaningful

### 10. usability / ease-of-use
- **Canonical**: `usability`
- **Synonym**: `ease-of-use`
- **Evidence**:
  - Both about how easily users can use a product
  - Reference each other in related fields
  - ease-of-use covers efficiency, remembering, error rates (all usability aspects)
- **Distinction**:
  - Usability = formal ISO-25010 term
  - Ease-of-use = informal/practical term
- **Confidence**: 65% - formal vs informal naming
- **Recommendation**: **Consider** - depends on preference for ISO terminology

### 11. analysability / analyzability
- **Canonical**: `analysability` (British spelling)
- **Synonym**: `analyzability` (American spelling)
- **Evidence**: Regional spelling variants (UK vs US)
- **Note**: Need to check if both files exist
- **Confidence**: 90% if both exist - just spelling difference
- **Recommendation**: **Implement** if both exist - choose one spelling as canonical

---

## LOW CONFIDENCE / RELATED BUT DISTINCT ⭐

**Recommendation**: Keep separate - meaningful semantic differences.

### 12. security / information-security / cyber-security
- **Status**:
  - security ↔ information-security: **HIGH confidence synonym** (see #5 above)
  - security ↔ cyber-security: **NOT synonym**
- **Why cyber-security is distinct**:
  - More specific: "measures to protect critical IT infrastructure, networks and data from digital attacks"
  - Cyber-security is a subset/specialization of security
  - Focuses on digital/IT domain specifically
- **Recommendation**: **Keep cyber-security separate**, merge information-security with security

### 13. coherence / consistency
- **Why related**:
  - Coherence = "logical and consistent"
  - Consistency = "free from variation or contradiction"
- **Why distinct**:
  - Coherence = parts fitting together naturally/logically
  - Consistency = lack of variation across time/instances
- **Confidence**: 30% - different concepts
- **Recommendation**: **Keep separate** - distinct software quality concerns

### 14. cost / affordability
- **Why related**: Both about financial aspects
- **Why distinct**:
  - Cost = objective measurement (value of money used)
  - Affordability = subjective assessment (cheap enough, cost-effective)
- **Confidence**: 25% - related but different perspectives
- **Recommendation**: **Keep separate** - objective vs subjective distinction

### 15. agility / flexibility
- **Why related**: Both about change
- **Why distinct**: Explicitly stated in agility.md:
  - Agility = **rapid** change (speed emphasis)
  - Flexibility = **easy** change (effort emphasis)
- **Confidence**: 20% - intentionally distinguished
- **Recommendation**: **Keep separate** - clear semantic difference

### 16. interaction-capability / usability
- **Why related**: interaction-capability was formerly called "usability" in older ISO-25010
- **Why distinct**: ISO-25010:2023 now distinguishes them:
  - Interaction-capability = product quality (enabling interaction)
  - Usability = quality-in-use (outcomes/effectiveness)
- **Confidence**: 15% - ISO standard explicitly differentiates
- **Recommendation**: **Keep separate** - follow ISO-25010:2023 taxonomy

---

## SUMMARY RECOMMENDATIONS

### Immediate Implementation (High Confidence) - 5 pairs
```yaml
# Add to _data/quality-synonyms.yml

precision:
  - preciseness

internationalization:
  - i18n

compliance:
  - standard-compliance

devops-metrics:
  - DORA

security:
  - information-security
```

### Consider Implementing (Medium Confidence) - 2-3 pairs

**Strong candidates**:
```yaml
readability:
  - legibility  # 75% confidence - minimal distinction in software context

# Check if exists:
analysability:
  - analyzability  # 90% confidence IF both exist - just spelling
```

**Weaker candidates** (need discussion):
```yaml
correctness:
  - functional-correctness  # 70% - scope difference

suitability:
  - functional-suitability  # 70% - scope difference

usability:
  - ease-of-use  # 65% - formal vs informal
```

### Do NOT Implement - 6 pairs

Keep as separate distinct qualities:
- recoverability ≠ recovery-time (capability vs metric)
- security ≠ cyber-security (general vs IT-specific)
- coherence ≠ consistency (logical fit vs lack of variation)
- cost ≠ affordability (objective vs subjective)
- agility ≠ flexibility (rapid vs easy change)
- interaction-capability ≠ usability (ISO-25010:2023 distinction)

---

## IMPLEMENTATION PRIORITY

### Phase 2A: Quick Wins (Explicit Synonyms)
**Effort**: 30 minutes
**Impact**: High - already acknowledged synonyms

1. precision / preciseness
2. internationalization / i18n
3. compliance / standard-compliance
4. devops-metrics / DORA
5. security / information-security

### Phase 2B: Strong Candidates (Review Needed)
**Effort**: 1 hour
**Impact**: Medium - need content review

1. readability / legibility (check usage in requirements)
2. analysability / analyzability (IF both exist - just verify)

### Phase 2C: Controversial Candidates (Needs Discussion)
**Effort**: 2-3 hours (including team discussion)
**Impact**: Low-Medium - may add confusion if wrong

1. correctness / functional-correctness
2. suitability / functional-suitability
3. usability / ease-of-use

**Discussion questions**:
- Do we want to preserve ISO-25010 functional-* variants?
- Do we prefer formal (usability) or informal (ease-of-use) terms?
- Should we keep both for different audiences?

---

## VALIDATION NEEDED

Before implementing Phase 2A, verify:

1. **File existence check**:
   ```bash
   ls _qualities/A/analyzability.md  # Check if US spelling exists
   ```

2. **Standards preservation**:
   - information-security.md has `standards: [iso27001]`
   - Need to copy to security.md when merging

3. **Content review**:
   - Merge any unique content from synonym into canonical
   - Preserve all standard references
   - Update related fields in other qualities

4. **Link validation**:
   ```bash
   npm run test:links:strict
   ```

---

## NEXT STEPS

1. **Get approval** for Phase 2A (5 high-confidence pairs)
2. **Verify** analysability/analyzability file existence
3. **Review** standards and related fields for information-security
4. **Implement** Phase 2A following same pattern as Phase 1
5. **Discuss** Phase 2C candidates with team (optional)

**Total New Synonyms**: 5-7 pairs (depending on review outcomes)

**Combined with Phase 1**: 9-11 synonym pairs implemented 🎯
