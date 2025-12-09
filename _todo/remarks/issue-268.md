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

## Reconsidering "Quality Targets"

**Critical Issue Identified:** The term "target" is problematic because:
- In real life, a target is **specific and measurable** (e.g., "99.9% uptime", "response time < 200ms")
- You know definitively when you've **reached a target**
- But "secure", "flexible", "reliable" are **not measurable endpoints**
- They're ongoing concerns - you never fully "achieve secure" and declare it done

**This makes "quality targets" misleading and inappropriate.**

---

## Revised Analysis of Alternatives

What we're really naming here are:
- **Broad, non-measurable categories** for organizing specific qualities
- **Ongoing concerns** (not endpoints to be reached)
- **Organizing principles** or **dimensions** of quality
- **Tags/labels** in the technical implementation

### Revised Option 1: "Quality Categories"
- **Pro**: Accurate, neutral, clearly indicates grouping/classification
- **Pro**: No confusion with measurable targets or endpoints
- **Pro**: Simple and accessible
- **Con**: Somewhat bureaucratic/boring
- **Con**: "Category" doesn't emphasize that these ARE system characteristics
- **Example**: "Security is a quality category containing qualities like immunity and access-control"

### Revised Option 2: "Quality Dimensions"
- **Pro**: Suggests different facets or perspectives on quality
- **Pro**: Architectural, professional terminology
- **Pro**: Implies that quality is multi-faceted (you can be strong in some dimensions, weak in others)
- **Con**: Slightly abstract/academic
- **Example**: "Security is a quality dimension encompassing qualities like immunity and access-control"

### Revised Option 3: "Quality Aspects"
- **Pro**: Simple, clear, appropriate
- **Pro**: Neutral term that doesn't imply measurement
- **Pro**: Natural phrasing: "security aspects", "performance aspects"
- **Con**: Might be too generic
- **Example**: "Security is a quality aspect realized through qualities like immunity and access-control"

### Revised Option 4: "Quality Areas"
- **Pro**: Very simple and accessible
- **Pro**: Clear grouping/organizational concept
- **Con**: Might feel too simplistic
- **Example**: "Security is a quality area that includes qualities like immunity and access-control"

### Revised Option 5: "Quality Characteristics" (ISO 25010)
- **Pro**: Standards-aligned (ISO 25010 uses "characteristics" and "sub-characteristics")
- **Pro**: Established terminology in quality community
- **Con**: Long and somewhat formal
- **Con**: We already use "quality attribute" for the ~220 specific items
- **Example**: "Security is a quality characteristic with sub-characteristics like immunity and access-control"

### Revised Option 6: Keep "Quality Properties" but Improve Usage
- **Pro**: No breaking change, familiar to existing users
- **Pro**: "Property" is technically accurate - these ARE properties of the system
- **Con**: Original issue remains - "top-level property" is awkward
- **Solution**: Change phrasing, not the term
  - ❌ "Top-level properties like secure..."
  - ✅ "System properties like security..."
  - ✅ "Quality properties: secure, flexible, reliable..."
- **Example**: "Security is a system property demonstrated through qualities like immunity and access-control"

---

## Revised Recommendation

After reconsidering the "target" terminology issue, I recommend **Option 2: "Quality Dimensions"** with **Option 6: Improved Property phrasing** as an acceptable alternative.

### Primary Recommendation: "Quality Dimensions"

**Rationale:**

1. **Accurate Semantics**: These ARE dimensions of quality - different facets or perspectives. A system can be strong in some dimensions (security), weak in others (performance).

2. **Professional and Accessible**: The term "dimension" is used in architecture, data modeling, and analytics - it's familiar to technical audiences without being overly academic.

3. **Narrative Improvement**:
   - ✅ "Our system prioritizes the security and reliability dimensions"
   - ✅ "These qualities contribute to the security dimension of our system"
   - ✅ "Which quality dimensions are most important for your project?"

4. **Visual Alignment**: Works well with the graph visualization - dimensions create a multi-dimensional quality space.

5. **Avoids Confusion**:
   - Not measurable like "targets"
   - Not bureaucratic like "categories"
   - More specific than "aspects"

### Alternative: Improve "Property" Usage

If changing terminology is deemed too disruptive, simply **improve how we use "property"**:

**Changes needed:**
- ❌ Remove: "top-level property"
- ✅ Use: "quality property" or "system property"
- ✅ Example: "Security is a fundamental system property"

**This is a minimal-change approach** that addresses the awkward phrasing without requiring terminology migration.

---

## Comparison Table

| Scenario | Current (Awkward) | Option: Dimensions | Option: Improved Properties |
|----------|-------------------|-------------------|----------------------------|
| Explaining hierarchy | "Top-level properties contain qualities" | "Quality dimensions contain qualities" | "System properties demonstrated by qualities" |
| User question | "Which properties matter?" | "Which dimensions matter?" | "Which properties matter?" |
| Graph legend | "Property nodes" | "Dimension nodes" | "Property nodes" |
| Tag pages | "Qualities with this property" | "Qualities in this dimension" | "Qualities with this property" |

---

## Implementation Path

### If Adopting "Quality Dimensions":

**Phase 1: User-Facing Text**
1. Homepage and overview pages
2. Articles explaining Q42 model
3. Graph legends and tooltips
4. Tag page descriptions

**Phase 2: Technical Updates**
5. Code comments (deprecate "property", introduce "dimension")
6. Documentation (CLAUDE.md, README)
7. CSS classes can remain `.property-node` for backward compatibility

**Phase 3: Complete Migration**
8. Variable names in scripts (optional, for clarity)

### If Improving "Property" Usage:

**Single Phase: Text Refinement**
1. Find/replace "top-level property" → "quality property" or "system property"
2. Ensure consistent phrasing across documentation
3. Add clarifying text where "property" is first introduced

**Minimal effort, addresses the core issue.**

---

## Conclusion

**The issue is valid.** The phrasing "top-level property" is awkward and confusing when explaining Q42.

**Recommended Solution:**
- **Best:** Adopt "quality dimensions" - accurate, professional, improves narrative
- **Acceptable:** Keep "property" but eliminate "top-level" and improve phrasing

**Hierarchy clarification:**
```
Quality Dimensions (8 broad aspects: secure, flexible, reliable...)
  ↓ contain
Qualities (~220 specific attributes: immunity, scalability...)
  ↓ verified by
Requirements (~140 measurable scenarios with acceptance criteria)
```

**Next Step:**
Discuss with arc42 team:
1. Does "quality dimensions" resonate?
2. Or should we simply fix the "top-level property" phrasing?
3. Consider user feedback and terminology preference

---

**Author:** Claude Code
**Date:** 2025-12-02
**Updated:** 2025-12-02 (reconsidered "target" terminology based on feedback)
**Status:** Revised Analysis - Awaiting decision

**Key Insight:** "Targets" are specific and measurable - not appropriate for broad, ongoing quality concerns. Recommend "Quality Dimensions" or improving "Property" phrasing instead.
