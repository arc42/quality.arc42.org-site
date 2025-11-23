# Handling Quality Synonyms: Implementation Guide

**Status**: Proposal for arc42 Quality Model
**Created**: 2025-11-23
**Based on**: GPT-5 proposal + Sonnet 4.5 review + codebase analysis

---

## Executive Summary

The arc42 Quality Model currently contains ~220 quality attributes, many of which are synonyms or near-synonyms (e.g., debuggability/troubleshootability, changeability/mutability). This proposal outlines a **pragmatic hybrid approach** to handle synonyms while maintaining:

- ✅ SEO and discoverability (direct URLs still work)
- ✅ Graph consistency (no duplicate nodes)
- ✅ Content maintainability (single source of truth)
- ✅ User experience (clear "Also known as" sections)
- ✅ Backward compatibility (existing links don't break)

**Recommended Strategy**: **Option 1 (Canonical + Redirects) + Option 3 (Data Merging)**

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Evaluation of Options](#evaluation-of-options)
3. [Recommended Hybrid Approach](#recommended-hybrid-approach)
4. [Implementation Details](#implementation-details)
5. [Migration Strategy](#migration-strategy)
6. [Examples](#examples)
7. [Testing & Validation](#testing--validation)
8. [Decision Matrix](#decision-matrix)

---

## Problem Statement

### Current State

Many qualities are currently handled inconsistently:

```markdown
<!-- _qualities/C/changeability.md -->
---
title: Changeability
related: [flexibility, adaptability, modifiability]
---

Synonym: Mutability
```

**Issues**:
1. Synonyms are mentioned informally in content, not structured data
2. No redirects exist (users typing `/qualities/mutability` get 404)
3. Graph may show duplicate nodes if both files exist
4. No single source of truth for canonical terminology
5. Difficult for users to know which term to use

### Goals

1. **Single Source of Truth**: One canonical page per concept
2. **Discoverability**: All synonym terms findable via URL/search
3. **Graph Clarity**: One node per concept in visualizations
4. **SEO**: Maintain search engine visibility for all terms
5. **Maintainability**: Clear patterns for future synonyms
6. **No Breaking Changes**: Existing permalinks continue to work

---

## Evaluation of Options

### Option 1: Canonical + Redirects ⭐ RECOMMENDED

**How it works**: One canonical page; synonyms redirect to it.

**Pros**:
- ✅ Best SEO (all terms indexed, redirect to authoritative source)
- ✅ No 404s for synonym URLs
- ✅ Clear "Also known as" sections
- ✅ Works with existing Jekyll infrastructure

**Cons**:
- ⚠️ Requires creating stub files for each synonym
- ⚠️ Need to maintain `aka` field in frontmatter

**Best for**: This project's needs (SEO + discoverability + UX)

---

### Option 2: Search-Only ❌ NOT RECOMMENDED

**How it works**: Only canonical page exists; synonyms in tags/metadata.

**Pros**:
- ✅ Minimal file footprint
- ✅ Simple maintenance

**Cons**:
- ❌ 404s for synonym URLs
- ❌ Poor user experience for direct navigation
- ❌ Difficult for external citations
- ❌ Search-dependent (fragile)

**Best for**: Internal documentation, not public sites

---

### Option 3: Data-Level Merging ⭐ RECOMMENDED

**How it works**: Collapse synonyms to canonical node during graph data generation.

**Pros**:
- ✅ Graph shows single node per concept
- ✅ Clean visualization (no duplicates)
- ✅ All synonym labels visible in tooltips
- ✅ Integrates with existing build pipeline

**Cons**:
- ⚠️ Requires modifying `src/scripts/data.js`
- ⚠️ Need to maintain `_data/quality-synonyms.yml`

**Best for**: This project (essential for graph consistency)

---

### Option 4: Umbrella Concepts ⚡ USE SPARINGLY

**How it works**: Create umbrella page with "Related terms" section.

**Pros**:
- ✅ Good for hierarchical relationships (e.g., "Security" umbrella)
- ✅ Acknowledges nuance without full pages
- ✅ Educational for users

**Cons**:
- ⚠️ Not suitable for true synonyms
- ⚠️ Can become a "junk drawer" category

**Best for**: ISO-25010 property categories (Functional Suitability, Performance Efficiency, etc.), NOT simple synonyms

---

## Recommended Hybrid Approach

### Strategy: Combine Option 1 + Option 3

#### Phase 1: Canonical Mapping (Immediate)
- Define canonical terms in `_data/quality-synonyms.yml`
- Add `aka` field to canonical quality pages
- Update `qualities.html` layout to render "Also known as" section

#### Phase 2: Create Redirects (Short-term)
- Create minimal stub files for synonym terms
- Use `jekyll-redirect-from` plugin (already available via github-pages)
- Maintain same directory structure (`_qualities/<LETTER>/`)

#### Phase 3: Data Generation Updates (Medium-term)
- Modify `src/scripts/data.js` to collapse synonyms to canonical nodes
- Preserve all labels for tooltips/search
- Map edges to canonical IDs

#### Phase 4: Validation & Rollout (Ongoing)
- Update link validation to check synonyms
- Audit existing qualities for synonym candidates
- Document pattern in CLAUDE.md

---

## Implementation Details

### 1. Data Schema

#### `_data/quality-synonyms.yml`

Central registry mapping canonical → synonyms:

```yaml
# Format: canonical-slug: [synonym1, synonym2, ...]

debuggability:
  - troubleshootability
  - diagnosability

changeability:
  - mutability
  - modifiability  # Note: only if truly synonymous

observability:
  - monitorability

testability:
  - verifiability

# Use sparingly - only for TRUE synonyms
# For related-but-different concepts, use 'related' field instead
```

**Rules**:
- Keys MUST match canonical quality permalink slug (last segment)
- Values are synonym terms (kebab-case slugs)
- Only include TRUE synonyms, not related concepts
- Keep alphabetically sorted for maintainability

---

### 2. Canonical Quality Frontmatter

#### `_qualities/D/debuggability.md`

```yaml
---
title: Debuggability
aka: [troubleshootability, diagnosability]
tags: [analyzable]
related: [observability, testability, traceability]
standards: [iso25010]
permalink: /qualities/debuggability
---

<!-- Content remains unchanged -->

## Definition

The degree to which software can be diagnosed for defects or performance issues...

[Rest of content]
```

**New field**:
- `aka`: Array of synonym terms (display names, not slugs)
- Should match entries in `quality-synonyms.yml`

---

### 3. Synonym Stub Files

#### `_qualities/T/troubleshootability.md`

```yaml
---
title: Troubleshootability
alias_of: debuggability
redirect_to: /qualities/debuggability
layout: redirect
permalink: /qualities/troubleshootability
---
```

**Fields**:
- `title`: The synonym term (proper display name)
- `alias_of`: Canonical quality slug (for validation/tooling)
- `redirect_to`: Canonical quality permalink (for jekyll-redirect-from)
- `layout: redirect`: Custom layout (see below)
- `permalink`: Synonym's own permalink (must be unique)

**File location**: Same alphabetical organization as canonical qualities

---

### 4. Redirect Layout

#### `_layouts/redirect.html` (NEW)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Redirecting to {{ page.title }}</title>
  <link rel="canonical" href="{{ page.redirect_to | absolute_url }}">
  <meta http-equiv="refresh" content="0; url={{ page.redirect_to | absolute_url }}">
  <script>
    window.location.href = "{{ page.redirect_to | absolute_url }}";
  </script>
</head>
<body>
  <p>
    This term is a synonym. Redirecting to
    <a href="{{ page.redirect_to | absolute_url }}">{{ page.title }}</a>...
  </p>
  <p>
    If you are not redirected, <a href="{{ page.redirect_to | absolute_url }}">click here</a>.
  </p>
</body>
</html>
```

**Why custom layout**:
- Provides instant redirect (via `meta http-equiv`)
- JavaScript fallback for client-side redirect
- Human-readable message for crawlers
- Clean UX (user never sees stub content)

**Alternative**: Use `jekyll-redirect-from` plugin directly:

```yaml
# In canonical quality frontmatter
redirect_from:
  - /qualities/troubleshootability
  - /qualities/diagnosability
```

**Trade-offs**:
- Plugin approach: Fewer files, but harder to audit
- Stub approach: More visible, easier to validate, better for SEO

**Recommendation**: Use stub files initially (explicit > implicit)

---

### 5. Layout Updates

#### `_layouts/qualities.html` (MODIFIED)

Add "Also known as" section after header:

```liquid
{% include quality-header.liquid page=page link=false share=page.share %}

<!-- NEW: Also known as section -->
{% if page.aka and page.aka.size > 0 %}
<div class="also-known-as" style="margin-bottom: 1.5rem;">
  <strong>Also known as:</strong>
  {% for synonym in page.aka %}
    <span class="synonym-badge">{{ synonym | capitalize }}</span>{% unless forloop.last %}, {% endunless %}
  {% endfor %}
</div>
{% endif %}

<section class="post-content">{{ content }}</section>
```

**Styling** (in `_sass/`):

```scss
.also-known-as {
  padding: 0.75rem 1rem;
  background-color: var(--background-secondary, #f8f9fa);
  border-left: 4px solid var(--quality-text-color, #00B8F5);
  border-radius: 4px;
  font-size: 0.95rem;

  strong {
    color: var(--text-primary);
  }
}

.synonym-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background-color: var(--quality-bg-color, #e3f2fd);
  color: var(--quality-text-color, #00B8F5);
  border-radius: 3px;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0 0.25rem;
}
```

---

### 6. Data Generation Updates

#### `src/scripts/data.js` (MODIFIED)

**Step 1**: Load synonym mappings at the top:

```javascript
import matter from "gray-matter";
import { promises as fs } from "node:fs";
import path from "node:path";
import yaml from "js-yaml";  // Add this import

// Load quality synonyms mapping
let QUALITY_SYNONYMS = {};
try {
  const synonymsPath = path.join(process.cwd(), "_data", "quality-synonyms.yml");
  const synonymsContent = await fs.readFile(synonymsPath, "utf8");
  QUALITY_SYNONYMS = yaml.load(synonymsContent) || {};
} catch (error) {
  console.warn("No quality-synonyms.yml found - synonym mapping disabled");
}

/**
 * Resolve a quality slug to its canonical form
 * @param {string} slug - Quality slug (may be synonym)
 * @returns {string} - Canonical slug
 */
function resolveCanonical(slug) {
  // Check if this slug is a synonym of something
  for (const [canonical, synonyms] of Object.entries(QUALITY_SYNONYMS)) {
    if (synonyms.includes(slug)) {
      return canonical;
    }
  }
  // Not a synonym, return as-is
  return slug;
}
```

**Step 2**: Filter out synonym stub files:

```javascript
function createGraphData(frontmatterData, isRequirements = false, propertyNodes, nodes, edges) {
  for (const data of frontmatterData) {
    // Skip synonym stubs (they have alias_of field)
    if (data.alias_of) {
      continue;
    }

    // Extract node ID from permalink
    let nodeId = data.permalink?.split('/').filter(Boolean).pop();
    if (!nodeId) continue;

    // Resolve to canonical (shouldn't happen for canonical files, but defensive)
    nodeId = resolveCanonical(nodeId);

    // ... rest of existing logic
  }
}
```

**Step 3**: Enhance node with synonym labels:

```javascript
// When creating quality nodes
const node = {
  id: nodeId,
  label: data.title,
  labels: [data.title, ...(data.aka || [])],  // NEW: Include all labels
  size: NODE_CONFIGS.quality.size,
  color: NODE_CONFIGS.quality.color,
  qualityType: NODE_CONFIGS.quality.qualityType,
  page: data.permalink,
  standards: normalizeArray(data.standards),
};
```

**Step 4**: Canonicalize edges:

```javascript
function processRelatedNodes(data, nodeId, nodes, edges) {
  const related = normalizeArray(data.related);

  for (let relatedSlug of related) {
    // Resolve synonym to canonical BEFORE creating edge
    const canonicalSlug = resolveCanonical(relatedSlug);

    // Create edge with canonical IDs
    edges.add({
      source: nodeId,
      target: canonicalSlug
    });
  }
}
```

---

### 7. Graph Renderer Updates

#### `src/graphs/GraphRenderer.js` (MODIFIED)

Update tooltip to show all labels:

```javascript
// In node tooltip rendering
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "graph-tooltip")
  .style("opacity", 0);

// On hover
.on("mouseover", function(event, d) {
  let tooltipContent = `<strong>${d.label}</strong>`;

  // Show "Also known as" if multiple labels
  if (d.labels && d.labels.length > 1) {
    const synonyms = d.labels.filter(l => l !== d.label);
    tooltipContent += `<br><em>Also: ${synonyms.join(", ")}</em>`;
  }

  tooltip.transition().duration(200).style("opacity", 0.9);
  tooltip.html(tooltipContent)
    .style("left", (event.pageX + 10) + "px")
    .style("top", (event.pageY - 28) + "px");
});
```

**CSS** (add to graph styles):

```scss
.graph-tooltip {
  em {
    font-size: 0.85em;
    color: #666;
  }
}
```

---

### 8. Validation Updates

#### `src/scripts/validate-links.js` (MODIFIED)

Add synonym awareness:

```javascript
// Load synonym mappings
const QUALITY_SYNONYMS = loadSynonyms();  // Similar to data.js

function resolveCanonical(slug) {
  for (const [canonical, synonyms] of Object.entries(QUALITY_SYNONYMS)) {
    if (synonyms.includes(slug)) {
      return canonical;
    }
  }
  return slug;
}

// When validating quality references
function validateQualityReference(refSlug, sourceFile) {
  const canonicalSlug = resolveCanonical(refSlug);
  const exists = allQualities.has(canonicalSlug);

  if (!exists) {
    errors.push({
      type: "MISSING_QUALITY",
      message: `Reference to non-existent quality "${refSlug}" (canonical: "${canonicalSlug}")`,
      source: sourceFile
    });
  }

  // Warn if referencing synonym instead of canonical
  if (refSlug !== canonicalSlug) {
    warnings.push({
      type: "SYNONYM_REFERENCE",
      message: `References synonym "${refSlug}" instead of canonical "${canonicalSlug}"`,
      source: sourceFile,
      suggestion: `Consider updating to: related: [${canonicalSlug}]`
    });
  }
}
```

**New validation rules**:
1. ✅ Synonym stubs must have `alias_of` and `redirect_to`
2. ✅ `alias_of` must reference existing canonical quality
3. ✅ Canonical quality must list synonym in `aka` field
4. ✅ `quality-synonyms.yml` must be in sync with stub files
5. ⚠️ Warn when `related` references synonym instead of canonical

---

## Migration Strategy

### Phase 1: Foundation (Week 1)

**Tasks**:
1. Create `_data/quality-synonyms.yml` with initial mappings
2. Add `aka` field to 3-5 canonical qualities (pilot group)
3. Create redirect layout (`_layouts/redirect.html`)
4. Update qualities layout to show "Also known as"

**Pilot synonyms** (clear cases):
```yaml
debuggability:
  - troubleshootability
changeability:
  - mutability
observability:
  - monitorability
```

**Validation**:
```bash
# Build and verify locally
docker compose up

# Check that canonical pages show "Also known as" section
# Visit: http://localhost:4000/qualities/debuggability
```

---

### Phase 2: Redirects (Week 2)

**Tasks**:
1. Create synonym stub files for pilot group
2. Test redirects work correctly
3. Verify no 404s for synonym URLs
4. Check SEO meta tags in redirects

**Example**:
```bash
# Create stub file
cat > _qualities/T/troubleshootability.md <<EOF
---
title: Troubleshootability
alias_of: debuggability
redirect_to: /qualities/debuggability
layout: redirect
permalink: /qualities/troubleshootability
---
EOF
```

**Validation**:
```bash
# Test redirect
curl -I http://localhost:4000/qualities/troubleshootability
# Should return 301 or see redirect in browser

# Check no broken links
npm run test:links
```

---

### Phase 3: Data Generation (Week 3)

**Tasks**:
1. Update `src/scripts/data.js` with synonym resolution
2. Add `resolveCanonical()` function
3. Filter out synonym stubs from nodes
4. Canonicalize edges to use canonical IDs
5. Add `labels` array to nodes

**Validation**:
```bash
# Regenerate graph data
npm run data

# Check nodes.json - should NOT contain synonym nodes
cat assets/data/nodes.json | grep -i "troubleshootability"
# Should return nothing (filtered out)

# Check canonical node has labels
cat assets/data/nodes.json | jq '.[] | select(.id=="debuggability")'
# Should show: "labels": ["Debuggability", "Troubleshootability"]

# Verify graph renders correctly
docker compose up
# Visit: http://localhost:4000 (check homepage graph)
```

---

### Phase 4: Validation Enhancement (Week 4)

**Tasks**:
1. Update `src/scripts/validate-links.js` with synonym awareness
2. Add checks for synonym consistency
3. Run validation on pilot group
4. Fix any issues found

**Validation**:
```bash
# Run strict validation
npm run test:links:strict

# Should show warnings for synonym references in 'related' fields
```

---

### Phase 5: Gradual Rollout (Weeks 5-8)

**Tasks**:
1. Audit all ~220 qualities for synonym candidates
2. Prioritize by:
   - Clear synonyms (high confidence)
   - Frequently confused terms
   - Terms with existing informal "Synonym:" mentions
3. Add 5-10 synonym sets per week
4. Update documentation in CLAUDE.md

**Criteria for synonyms**:
- ✅ Same definition, just different terminology
- ✅ Interchangeable in all contexts
- ✅ No meaningful semantic difference
- ❌ Related but distinct concepts → use `related` instead
- ❌ Hierarchical relationship → consider Option 4 (umbrella)

---

### Phase 6: Documentation & Automation (Week 9)

**Tasks**:
1. Document pattern in CLAUDE.md
2. Create helper scripts:
   - `scripts/add-synonym.sh` - Add new synonym pair
   - `scripts/audit-synonyms.sh` - Validate synonym consistency
3. Add GitHub Actions check for synonym validation
4. Update contributor guidelines

**Helper script example**:
```bash
#!/bin/bash
# scripts/add-synonym.sh <canonical> <synonym>

CANONICAL=$1
SYNONYM=$2

# 1. Add to quality-synonyms.yml
# 2. Create stub file in correct letter directory
# 3. Update canonical quality's 'aka' field
# 4. Run validation
```

---

## Examples

### Example 1: Simple Synonym (Debuggability)

#### Before

```markdown
<!-- _qualities/D/debuggability.md -->
---
title: Debuggability
tags: [analyzable]
related: [testability, observability]
permalink: /qualities/debuggability
---

Definition of debuggability...
```

```markdown
<!-- _qualities/T/troubleshootability.md -->
---
title: Troubleshootability
tags: [analyzable]
related: [testability, observability]
permalink: /qualities/troubleshootability
---

Definition of troubleshootability (same content, different name)...
```

**Issues**: Duplicate content, inconsistent graph, maintenance burden

#### After

```yaml
# _data/quality-synonyms.yml
debuggability:
  - troubleshootability
  - diagnosability
```

```markdown
<!-- _qualities/D/debuggability.md (CANONICAL) -->
---
title: Debuggability
aka: [Troubleshootability, Diagnosability]
tags: [analyzable]
related: [testability, observability]
permalink: /qualities/debuggability
---

**Also known as**: Troubleshootability, Diagnosability

Definition of debuggability (single source of truth)...
```

```markdown
<!-- _qualities/T/troubleshootability.md (REDIRECT STUB) -->
---
title: Troubleshootability
alias_of: debuggability
redirect_to: /qualities/debuggability
layout: redirect
permalink: /qualities/troubleshootability
---
```

```markdown
<!-- _qualities/D/diagnosability.md (REDIRECT STUB) -->
---
title: Diagnosability
alias_of: debuggability
redirect_to: /qualities/debuggability
layout: redirect
permalink: /qualities/diagnosability
---
```

**Result**:
- ✅ Single authoritative definition
- ✅ All URLs work (with redirects)
- ✅ Graph shows one node labeled "Debuggability (Troubleshootability, Diagnosability)"
- ✅ Search finds content via any term

---

### Example 2: Edge Case - Near-Synonyms (Changeability vs. Modifiability)

**Question**: Are these TRUE synonyms or related-but-different?

**Analysis**:
- Changeability: Ease of making any change
- Modifiability: Ease of making modifications to existing functionality
- Relationship: Modifiability is a *type* of changeability

**Decision**: NOT synonyms → use `related` field instead

```yaml
# _qualities/C/changeability.md
---
title: Changeability
related: [modifiability, adaptability, flexibility]
---

# _qualities/M/modifiability.md
---
title: Modifiability
related: [changeability, maintainability]
---
```

**Rule**: When in doubt, keep separate. Over-consolidation loses nuance.

---

### Example 3: Umbrella Concept (ISO-25010 Properties)

**Use Case**: ISO-25010 defines 8 top-level quality characteristics. These are NOT synonyms but umbrella categories.

```markdown
<!-- _qualities/F/functional-suitability.md -->
---
title: Functional Suitability
qualityType: umbrella
related_terms:
  - term: Functional Completeness
    note: Degree to which functions cover all specified tasks
  - term: Functional Correctness
    note: Degree to which product provides correct results
  - term: Functional Appropriateness
    note: Degree to which functions facilitate specified tasks
permalink: /qualities/functional-suitability
---

## Characteristics

ISO/IEC 25010 defines Functional Suitability as comprising three sub-characteristics:

- **Functional Completeness**: [definition]
- **Functional Correctness**: [definition]
- **Functional Appropriateness**: [definition]

[See individual quality pages for details]
```

**When to use**:
- ✅ Standard-defined hierarchies (ISO-25010, ISO-42010)
- ✅ True umbrella concepts with distinct sub-qualities
- ❌ Simple synonyms (use redirect approach instead)

---

## Testing & Validation

### Manual Testing Checklist

After implementation, verify:

- [ ] **Canonical pages render** with "Also known as" section
- [ ] **Synonym URLs redirect** to canonical pages (301 status)
- [ ] **Graph shows single node** per concept (no duplicates)
- [ ] **Graph tooltips show all labels** (hover over node)
- [ ] **Search finds canonical page** via any synonym term
- [ ] **No 404 errors** for synonym URLs
- [ ] **Link validation passes** (`npm run test:links`)
- [ ] **Standards still link correctly** to canonical qualities
- [ ] **Related qualities resolve** to canonical IDs
- [ ] **Build completes without errors** (`docker compose up`)

### Automated Testing

**Add to `src/scripts/validate-links.js`**:

```javascript
// Synonym consistency checks
function validateSynonyms() {
  const errors = [];

  // 1. Check synonym stubs reference valid canonicals
  for (const [stub, data] of synonymStubs) {
    if (!allQualities.has(data.alias_of)) {
      errors.push(`Stub ${stub} references non-existent canonical "${data.alias_of}"`);
    }
  }

  // 2. Check canonicals list their synonyms in 'aka'
  for (const [canonical, synonyms] of Object.entries(QUALITY_SYNONYMS)) {
    const canonicalPage = allQualities.get(canonical);
    if (!canonicalPage.aka || !Array.isArray(canonicalPage.aka)) {
      errors.push(`Canonical ${canonical} missing 'aka' field for synonyms: ${synonyms.join(", ")}`);
    }
  }

  // 3. Check quality-synonyms.yml matches stub files
  const stubSynonyms = new Set(synonymStubs.keys());
  const ymlSynonyms = new Set(Object.values(QUALITY_SYNONYMS).flat());

  for (const syn of ymlSynonyms) {
    if (!stubSynonyms.has(syn)) {
      errors.push(`Synonym "${syn}" in quality-synonyms.yml missing stub file`);
    }
  }

  return errors;
}
```

**Run in CI**:

```yaml
# .github/workflows/build-deploy-gh-pages.yml
- name: Validate synonyms
  run: npm run test:links:strict
```

---

## Decision Matrix

### When to Apply Each Option

| Scenario | Recommended Approach | Rationale |
|----------|---------------------|-----------|
| **True synonyms** (same meaning, different word) | Option 1 + 3 | SEO + graph consistency |
| **Near-synonyms** (subtle differences) | Keep separate, use `related` | Preserve nuance |
| **Hierarchical** (umbrella + sub-concepts) | Option 4 (umbrella page) | Educational value |
| **Regional variants** (colour/color) | Option 1 + 3 | Localization support |
| **Historical terms** (outdated but searchable) | Option 1 + 3 with note | Backward compatibility |
| **Standard-specific terms** (ISO vs. IEEE naming) | Keep separate, cross-reference | Different contexts |

### Synonym Confidence Levels

Use this rubric to decide:

**Level 1 - High Confidence Synonyms** → Apply Option 1 + 3
- Same definition in all contexts
- Interchangeable without loss of meaning
- Examples: debuggability/troubleshootability, observability/monitorability

**Level 2 - Medium Confidence** → Discuss with team
- Mostly interchangeable but context-dependent
- Slight semantic differences
- Examples: changeability/mutability, configurability/customizability

**Level 3 - Low Confidence** → Keep separate
- Related but distinct concepts
- Different use cases or contexts
- Examples: security/safety, performance/efficiency

---

## FAQ

### Q: What if a synonym is more popular than the canonical term?

**A**: Choose the most widely used term as canonical. Rename if needed:

```yaml
# If "troubleshootability" is more popular, make IT the canonical:
troubleshootability:
  - debuggability
```

Then swap stub and canonical files. Update all references during migration.

### Q: How do we handle standards that reference synonym terms?

**A**: Update during data generation:

```javascript
// In data.js
function resolveStandardReferences(quality) {
  if (quality.standards) {
    // Standards can reference canonical or synonym - both work
    // The graph data will normalize to canonical ID
  }
}
```

No changes needed to frontmatter. The build handles it.

### Q: What about existing external links to synonym URLs?

**A**: They continue to work via redirects (301 Permanent Redirect). Search engines will update their indexes to point to canonical URLs over time.

### Q: Should synonym stubs appear in the qualities list?

**A**: No. Exclude them from listings:

```liquid
<!-- In quality list pages -->
{% for quality in site.qualities %}
  {% unless quality.alias_of %}
    <!-- Only show non-stubs -->
    <li><a href="{{ quality.permalink }}">{{ quality.title }}</a></li>
  {% endunless %}
{% endfor %}
```

### Q: How do we document this for contributors?

**A**: Add to CLAUDE.md:

```markdown
## Adding a Synonym

1. Decide canonical term (most popular/precise)
2. Add mapping to `_data/quality-synonyms.yml`
3. Add `aka` field to canonical quality
4. Create redirect stub for synonym
5. Run `npm run data` to rebuild graph
6. Validate with `npm run test:links`
```

Provide `scripts/add-synonym.sh` helper for automation.

---

## Rollback Plan

If issues arise during rollout:

### Quick Rollback (Same Day)
1. Remove `_data/quality-synonyms.yml`
2. Delete synonym stub files
3. Remove `aka` fields from canonical qualities
4. Revert layout changes
5. Regenerate data: `npm run data`

### Partial Rollback (Keep Some Synonyms)
1. Remove problematic entries from `quality-synonyms.yml`
2. Delete corresponding stub files
3. Regenerate data: `npm run data`
4. Keep working synonyms in place

### No Breaking Changes
Because implementation is additive (no deletions), rollback is safe. Existing content unaffected.

---

## Success Metrics

Track these after full rollout:

1. **Graph clarity**: Fewer nodes, clearer relationships
2. **404 rate**: Should drop for synonym URLs
3. **Search effectiveness**: Synonyms findable via search
4. **Maintenance burden**: Time to add new qualities (should decrease)
5. **User feedback**: Comments/issues about terminology confusion

---

## Conclusion

**Adopt hybrid Option 1 + 3** with phased rollout:

1. ✅ **Phase 1-2**: Canonical mapping + redirects (user-facing)
2. ✅ **Phase 3-4**: Data generation + validation (infrastructure)
3. ✅ **Phase 5-6**: Gradual rollout + documentation (scaling)

**Start small** (3-5 synonym sets), validate thoroughly, then expand gradually. This approach balances:

- User experience (no 404s, clear navigation)
- Graph consistency (single nodes, clean visualization)
- Maintainability (single source of truth)
- SEO (all terms discoverable)
- Backward compatibility (no breaking changes)

**Next steps**:
1. Review this proposal with team
2. Identify pilot synonym sets (3-5 clear cases)
3. Implement Phase 1 (foundation)
4. Test thoroughly before expanding

---

**Questions or concerns?** Discuss in GitHub Issues or team meeting.

**Version**: 1.0
**Author**: Claude (Sonnet 4.5)
**Review**: Pending
