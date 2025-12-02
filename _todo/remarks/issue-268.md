# Analysis: Issue #268 - Terminology for "Properties" vs. "Quality Targets"

**Issue:** [#268](https://github.com/arc42/quality.arc42.org-site/issues/268)

**Date:** 2025-12-02

---

## Summary of the Issue

The current terminology uses "property" or "top-level property" for the tag categories (secure, flexible, reliable, etc.), which is confusing when explaining the Q42 model. The phrasing "those x qualities help us to achieve the top-level property y" sounds awkward and is hard to understand.

**Proposed alternative:** "quality targets"

**Example:**
- "Our system should be secure" → This is a quality target (broad, not yet measurable)
- "Immunity", "Access Control", etc. → These are specific qualities that define this target in measurable detail

---

## Current Terminology Analysis

### How "Property" is Currently Used

In the Q42 system:
- **Properties** (tags): `secure`, `flexible`, `reliable`, `usable`, `efficient`, `suitable`, `operable`, `safe`
- **Qualities**: ~220 specific quality attributes like `immunity`, `scalability`, `accessibility`, etc.
- **Requirements**: ~140 concrete, measurable scenarios

The term "property" has multiple meanings in software contexts:
1. **Object property** (programming): An attribute of an object (e.g., `user.name`)
2. **System property** (architecture): A characteristic of a system (e.g., "the system has the property of being secure")
3. **Quality property** (domain): A quality characteristic

This overloading creates confusion.

---

## Evaluation of "Quality Targets"

### ✅ Advantages

1. **Clearer Intent**: "Target" implies a goal or objective, which aligns with stakeholder intentions
   - "We target security" is clearer than "we target the security property"

2. **Better Narrative**:
   - ✅ "To achieve the quality target of security, we implement qualities like immunity and access-control"
   - ❌ "To achieve the top-level property of security, we implement qualities..."

3. **Distinguishes Levels**:
   - Quality targets = high-level goals (secure, flexible, reliable)
   - Qualities = specific attributes (immunity, scalability, accessibility)
   - Requirements = concrete, testable scenarios

4. **Aligns with Business Language**: Stakeholders often speak about "targets" (security targets, performance targets)

5. **Reduces Overloading**: "Target" is less overloaded than "property" in software contexts

### ❌ Potential Concerns

1. **Implies Measurement**: "Target" might suggest something quantifiable (e.g., "90% secure"), but these categories are qualitative

2. **Could Be Confused with Requirements**: Requirements already have acceptance criteria with targets/thresholds

3. **Breaks from ISO Terminology**: ISO 25010 uses "characteristics" and "sub-characteristics", not "targets"

---

## Alternative Terminology Options

### Option 1: "Quality Targets" (Proposed)
- **Pro**: Clear intent, goal-oriented language
- **Con**: Slight confusion with measurable targets in requirements
- **Example**: "Security is a quality target achieved through qualities like immunity"

### Option 2: "Quality Categories"
- **Pro**: Neutral, descriptive, clear grouping concept
- **Con**: Less inspiring, more bureaucratic
- **Example**: "Security is a quality category containing qualities like immunity"

### Option 3: "Quality Dimensions"
- **Pro**: Architectural, multi-faceted perspective
- **Con**: Somewhat abstract
- **Example**: "Security is a quality dimension encompassing qualities like immunity"

### Option 4: "Quality Goals"
- **Pro**: Similar to "targets" but less quantitative
- **Con**: Very similar to "targets", minimal differentiation
- **Example**: "Security is a quality goal achieved through qualities like immunity"

### Option 5: "Quality Characteristics" (ISO 25010 alignment)
- **Pro**: Standards-compliant, established terminology
- **Con**: Long, formal, less accessible
- **Example**: "Security is a quality characteristic realized through sub-characteristics like immunity"

### Option 6: Keep "Properties" but add context
- **Pro**: No breaking change, familiar to existing users
- **Con**: Doesn't solve the confusion issue
- **Example**: "Security is a system property achieved through qualities like immunity"

---

## Impact Analysis

### If We Change Terminology

**Documentation Changes Needed:**
- Homepage and overview pages
- Articles explaining the Q42 model
- Tag pages (`_pages/tag-*.md`)
- Graph legends and tooltips
- README and CLAUDE.md
- Reference documentation

**Technical Changes:**
- Graph node labels (currently "Property nodes")
- CSS classes (e.g., `.property-node`)
- JavaScript code comments
- Data generation scripts (`src/scripts/data.js`)

**Breaking Changes:**
- None for end users (permalinks and structure remain the same)
- Documentation references to "properties" become outdated
- External articles/presentations referencing "properties" may be confusing

---

## Recommendation

I recommend **Option 1: "Quality Targets"** for the following reasons:

### 1. **Narrative Clarity**
The phrasing improves significantly:
- ✅ "To achieve our quality targets of security and reliability, we focus on qualities like immunity, access-control, and fault-tolerance"
- ✅ "Our quality targets are: secure, flexible, and efficient systems"

### 2. **Stakeholder Alignment**
Business stakeholders naturally think in terms of targets and goals. This terminology bridges technical and business conversations.

### 3. **Hierarchical Clarity**
```
Quality Targets (8 broad categories)
  ↓ achieved through
Qualities (~220 specific attributes)
  ↓ verified by
Requirements (~140 testable scenarios with acceptance criteria)
```

### 4. **Practical Usage**
Compare these phrasings:

| Current ("Property") | Proposed ("Quality Target") |
|---|---|
| "The secure property contains..." | "The security quality target includes..." |
| "Top-level properties like secure..." | "Quality targets like security..." |
| "Which properties matter for your system?" | "Which quality targets matter for your system?" |

The target-based language is consistently clearer.

---

## Implementation Suggestion

### Phase 1: Core Documentation (High Priority)
1. Update homepage and main overview
2. Update articles explaining Q42 model
3. Update graph legends ("Quality Target" instead of "Property")
4. Update tag pages with new terminology

### Phase 2: Technical Refinement (Medium Priority)
5. Update code comments and variable names (can use deprecation approach)
6. Update CLAUDE.md and developer documentation
7. Update README

### Phase 3: Polish (Low Priority)
8. Consider adding "aka" or "formerly called" notes for transition period
9. Update any video transcripts or presentation materials

### Backward Compatibility Note
Keep "property" as an internal/technical term where needed for backward compatibility, but use "quality target" in all user-facing text.

---

## Alternative: Hybrid Approach

If we're concerned about breaking familiarity, we could use **both** terms during a transition:

- "Quality Targets (also called Properties)"
- After 6-12 months, drop the parenthetical

This provides continuity while improving clarity.

---

## Conclusion

**The issue raised is valid.** The term "property" is indeed confusing and makes the Q42 model harder to explain.

**Recommendation:** Adopt "quality targets" as the primary user-facing terminology for the eight top-level categories (secure, flexible, reliable, usable, efficient, suitable, operable, safe).

**Rationale:**
- Clearer communication with stakeholders
- Better narrative flow in explanations
- Maintains the hierarchical structure (targets → qualities → requirements)
- Minimal technical breaking changes

**Next Step:**
Discuss with the arc42 team whether this change aligns with their vision and whether "quality targets" resonates with the intended audience.

---

**Author:** Claude Code
**Date:** 2025-12-02
**Status:** Analysis - Awaiting decision
