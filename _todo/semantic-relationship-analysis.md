# Cross-Check Relations Between Qualities - Requirements

**Status**: Ready for execution
**Approach**: Automated batch processing with semantic analysis
**Estimated Duration**: 30-60 minutes
**Expected Output**: `_todo/improve-relations-between-qualities.md`

---

## Background

We have around 180 "qualities" described in individual markdown files under `_qualities/<letter>/<quality>.md`.

Each of these files has a YAML header with metadata. The **`related` array** is most important as it describes **content relations** to other qualities.

**Examples**:

- "capacity" is related to `[efficiency, resource-efficiency]`
- "flexibility" is related to `[maintainability, modularity, adaptability, configurability, changeability, agility, autonomy]`

## The Problem/Risk

As these qualities were created one after the other with relations added manually, important relationships may be **missing** or **incorrectly specified**. This affects:

1. **Graph visualization accuracy** - Missing edges reduce discoverability
2. **User navigation** - Users may miss relevant related qualities
3. **Content completeness** - Semantic connections are not fully represented

## Objectives

Systematically review all quality relationships to:

1. **Identify missing relations** that should exist based on semantic similarity
2. **Flag questionable relations** that may be misleading or too distant
3. **Ensure consistency** across the quality graph
4. **Provide actionable recommendations** for human review

---

## Execution Strategy: Automated Batch Processing

### Phase 1: Data Collection & Indexing

**Goal**: Build comprehensive index of all qualities

**Tasks**:
1. Load all quality files from `_qualities/*/` (excluding templates)
2. Exclude template files: `_files-must-have-identical-dates`
3. Exclude incomplete qualities in `_todo/qualities/`
4. For each quality, extract:
   - ID (from permalink last segment)
   - Title
   - Content summary (first 200-300 words or all definitions)
   - Tags (from frontmatter)
   - Existing related qualities (from frontmatter)
   - Standards (from frontmatter)
   - File path

**Output**: `ALLQUALITIES` - comprehensive index structure

**Expected count**: ~180 qualities

### Phase 2: Batch Processing & Analysis

**Goal**: Analyze qualities in manageable batches

**Batch Strategy**:
- Process in batches of **20-30 qualities** to manage context limits
- Use Task tool with general-purpose agent for parallel processing where possible
- Maintain running context of all quality IDs and basic metadata

**Per Quality Analysis**:
For each quality Q, evaluate its `related` array by checking:

1. **Semantic Similarity Signals**:
   - Qualities with overlapping definition concepts
   - Qualities mentioned in each other's content
   - Qualities with similar characteristics or sub-qualities

2. **Structural Signals**:
   - **Standard overlap**: Qualities sharing 2+ standards may be related
   - **Existing graph patterns**: Qualities related to the same qualities (transitive connections)

3. **Anomaly Detection**:
   - Relations to non-existent qualities (broken links)
   - Relations that seem too distant/unrelated
   - Asymmetric relations (A→B but not B→A) - flag for review

### Phase 3: Generate Recommendations

**Goal**: Create structured report of suggested improvements

**Output Format**: `_todo/improve-relations-between-qualities.md`

Structure:
```markdown
# Quality Relations Improvement Recommendations

**Generated**: <timestamp>
**Total Qualities Analyzed**: 180
**Qualities with Suggestions**: <count>

---

## Summary Statistics

- Total relations to add: <count>
- Total relations to remove: <count>
- Qualities with no relations: <count>
- Qualities with >10 relations: <count>

---

## Quality: <quality-id>

**Current Relations**: <count> (`<list>`)
**Tags**: `<tags>`
**Standards**: `<standards>`

### Relations to Add

- **<quality-id>**: <1-sentence reasoning with signal type>
  - *Signal*: <tag-overlap | standard-overlap | semantic-similarity | transitive>
  - *Confidence*: <high | medium | low>

### Relations to Remove

- **<quality-id>**: <1-sentence reasoning>
  - *Reason*: <too-distant | broken-link | misleading>

---

<repeat for each quality with suggestions>

---

## Appendix: Edge Cases & Notes

### Qualities with No Current Relations
<list qualities that have empty related arrays>

### Highly Connected Qualities (>10 relations)
<list qualities with many relations - may need review>

### Asymmetric Relations
<list A→B pairs where B→A doesn't exist>

```

---

## Analysis Criteria

### Signals for Adding Relations

Use these signals to identify potential missing relations:



#### 1. **Semantic Similarity** (Medium Confidence)
- Definitions reference similar concepts
- One quality mentions the other in its content
- Similar sub-characteristics or attributes

**Example**:
- "Availability" and "Reliability" both discuss system uptime
- "Performance" and "Efficiency" both discuss resource usage

#### 2. **Standard Overlap** (Medium-High Confidence)
- Qualities sharing **3+ standards** → strongly consider relation
- Qualities sharing **2 standards** → evaluate semantic similarity

**Example**:
- Quality A has standards `[iso25010, iso27001, gdpr]`
- Quality B has standards `[iso25010, iso27001]`
- → Likely related due to shared security/privacy standards

#### 3. **Transitive Relations** (Low-Medium Confidence)
- Quality A relates to Quality C
- Quality B relates to Quality C
- A and B share tags/standards
- → Consider A↔B relation

**Example**:
- "Modularity" relates to "Maintainability"
- "Testability" relates to "Maintainability"
- → Consider "Modularity"↔"Testability"

### Signals for Removing Relations

Flag these for potential removal:

#### 1. **Broken Links** (High Confidence - Remove)
- Relation references a quality ID that doesn't exist
- Likely a typo or quality was renamed/removed

#### 2. **Too Distant** (Low-Medium Confidence - Review)
- No shared tags
- No shared standards
- No semantic overlap in definitions
- May be a conceptual stretch

#### 3. **Misleading** (Medium Confidence - Review)
- Creates confusion about the quality's meaning
- Relation is one-directional without clear rationale

### Confidence Levels

Assign confidence to each suggestion:

- **High**: 2+ strong signals (tag overlap + semantic similarity)
- **Medium**: 1 strong signal OR 2+ weak signals
- **Low**: 1 weak signal OR transitive relation only

---

## Thresholds & Rules

### Relation Count Guidelines

- **0 relations**: Flag for review - likely missing relations
- **1-3 relations**: Normal for specialized qualities
- **4-8 relations**: Normal for core qualities
- **9-12 relations**: Higher than average - review for relevance
- **13+ relations**: Potentially over-connected - review carefully

### Bidirectionality

**Do NOT enforce symmetric relations** by default:

- It's acceptable for A to relate to B without B→A
- Rationale: One quality may be a specialization of another
- Example: "Accessibility" relates to "Usability", but "Usability" has many other aspects

**However, FLAG asymmetric relations** when:
- Both qualities share 2+ tags
- Both qualities share 2+ standards
- Strong semantic bidirectional connection

### Quality Exclusions

**Exclude from analysis**:
- Template files: `_files-must-have-identical-dates`
- Incomplete qualities: Any files in `_todo/qualities/`
- Test/example files

---

## Execution Checklist

### Pre-Execution
- [ ] Verify 180 quality files exist in `_qualities/`
- [ ] Confirm output path: `_todo/improve-relations-between-qualities.md`
- [ ] Check for existing report (backup if exists)

### Execution (Phase 1: Indexing)
- [ ] Load all quality files
- [ ] Extract frontmatter and content
- [ ] Build ALLQUALITIES index
- [ ] Log statistics (total count, avg relations per quality)

### Execution (Phase 2: Analysis)
- [ ] Process qualities in batches (20-30 per batch)
- [ ] For each quality, evaluate related array
- [ ] Track suggestions by confidence level
- [ ] Log progress every 20 qualities

### Execution (Phase 3: Report Generation)
- [ ] Generate summary statistics
- [ ] Format recommendations per quality
- [ ] Add appendix sections (edge cases)
- [ ] Write to `_todo/improve-relations-between-qualities.md`

### Post-Execution
- [ ] Validate output file is well-formed markdown
- [ ] Count total suggestions (add + remove)
- [ ] Report summary statistics
- [ ] Note any execution issues or anomalies

---

## Success Criteria

The analysis is successful if:

1. ✅ All ~180 qualities are analyzed
2. ✅ Report file is generated with proper structure
3. ✅ Suggestions include clear reasoning and confidence levels
4. ✅ Summary statistics are accurate
5. ✅ No broken links are missed
6. ✅ High-confidence suggestions are semantically valid
7. ✅ Edge cases are documented in appendix

---

## Expected Outcomes

**Realistic Expectations**:

- **Missing relations**: Expect to find 50-150 potential additions
  - Most will be medium confidence
  - Focus on high confidence for initial review

- **Relations to remove**: Expect to find 5-20 candidates
  - Mostly broken links or very distant relations

- **Qualities with 0 relations**: Expect 5-15 qualities
  - These may be highly specialized or orphaned

- **Asymmetric relations**: Expect 100-200 cases
  - Most are intentional, only flag those with strong bidirectional signals

**Human Review Required**:

This analysis generates **recommendations, not automatic changes**.

- All suggestions require human review
- Domain expertise needed to validate semantic connections
- Some suggestions will be subjective/debatable
- Goal is to surface options, not make final decisions

---

## Notes & Limitations

### Known Limitations

1. **Semantic analysis is subjective**: What constitutes a "relation" varies by perspective
2. **Context matters**: Some qualities are related in specific contexts only
3. **Transitive relations**: Just because A→C and B→C doesn't mean A→B
4. **Specialization vs. relation**: A specialized quality may not need to relate to its parent
5. **Tag system imperfect**: Tag overlap is a signal, not a rule

### Future Enhancements

Consider these for future iterations:

- **Machine learning similarity**: Use embeddings for semantic similarity
- **Standard weighting**: Weight standards by relevance (ISO-25010 > niche standards)
- **Historical analysis**: Check git history for removed relations
- **Community input**: Allow users to suggest relations via issues
- **Automated testing**: Validate relation symmetry where appropriate

---

## Example Output Snippet

```markdown
## Quality: capacity

**Current Relations**: 2 (`efficiency, resource-efficiency`)
**Tags**: `efficient, reliable`
**Standards**: `iso25010, iso14756`

### Relations to Add

- **scalability**: Both deal with system limits under increasing load
  - *Signal*: tag-overlap (efficient), semantic-similarity
  - *Confidence*: high

- **performance-efficiency**: Capacity is a sub-characteristic of performance efficiency in ISO-25010
  - *Signal*: standard-overlap (iso25010), semantic-similarity
  - *Confidence*: high

- **throughput**: Throughput is a measure of capacity over time
  - *Signal*: semantic-similarity, standard-overlap
  - *Confidence*: medium

### Relations to Remove

- None identified

---
```

---

**Ready for execution**: This document provides comprehensive requirements for automated semantic relationship analysis. Proceed with Phase 1 when ready.

---

**Document Version**: 1.0
**Last Updated**: 2025-11-23
**Author**: AI Assistant (Claude)
**Reviewer**: Pending human review
