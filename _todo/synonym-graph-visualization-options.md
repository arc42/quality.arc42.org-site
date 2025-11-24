# Graph Visualization Options for Synonyms

## The Core Question

**Should synonym labels appear differently in the graph (smaller font, different color) compared to the canonical term?**

## Short Answer: **NO - Keep it simple**

Synonyms should **NOT appear as separate nodes** at all. Instead, show all labels on the **single canonical node** using consistent styling.

---

## Recommended Approach: Single Node with Multiple Labels

### Visual Design

```
┌─────────────────────────────┐
│                             │
│      Debuggability          │  ← Primary label (bold, normal size)
│   aka Troubleshootability   │  ← Secondary label (lighter, smaller)
│                             │
└─────────────────────────────┘
```

### Implementation

**On the Node (visible by default)**:
- **Primary label**: Canonical term in standard node style
- **Secondary indicator**: Small "aka" badge/icon (subtle)

**In the Tooltip (on hover)**:
```
┌────────────────────────────────┐
│ Debuggability                  │
│ Also known as:                 │
│ • Troubleshootability          │
│ • Diagnosability               │
│                                │
│ Related to: Testability, ...   │
└────────────────────────────────┘
```

**Why this works**:
- ✅ Clean graph (no duplicate nodes)
- ✅ Synonyms discoverable on hover
- ✅ No visual clutter
- ✅ Consistent with single-source-of-truth principle

---

## Alternative Approaches (NOT Recommended)

### ❌ Option A: Separate Nodes with Different Styling

```
┌──────────────┐              ┌──────────────┐
│              │              │              │
│ Debuggability│◄────alias────┤ Troubleshoot │
│ (normal size)│              │ (smaller)    │
└──────────────┘              └──────────────┘
```

**Problems**:
- Graph becomes cluttered (4 synonyms = 4 extra nodes!)
- Confusing: users don't know which to use
- Contradicts "single source of truth" principle
- More visual noise than value
- "alias" edges compete with real relationships

**Verdict**: ❌ **Defeats the purpose of synonym consolidation**

---

### ❌ Option B: Ghosted/Faded Synonym Nodes

```
┌──────────────┐              ┌──────────────┐
│              │              │░░░░░░░░░░░░░░│
│ Debuggability│◄────────────┤░Troubleshoot░│
│ (solid)      │              │░(ghosted)░░░░│
└──────────────┘              └──────────────┘
```

**Problems**:
- Still adds visual clutter
- Users wonder why some nodes are faded
- Requires legend explanation ("ghost nodes = synonyms")
- Adds complexity for minimal benefit

**Verdict**: ❌ **More confusion than clarity**

---

### ⚠️ Option C: Dual-Label Nodes (Main + Synonym)

```
┌─────────────────────────────┐
│                             │
│      Debuggability          │ ← Main label (large)
│      Troubleshootability    │ ← Synonym (same size, different color)
│                             │
└─────────────────────────────┘
```

**Problems**:
- Nodes become too large (especially with 3+ synonyms)
- Which label is "official"? (ambiguous)
- Graph becomes cramped
- Color overload (already using colors for node types)

**Verdict**: ⚠️ **Possible but cluttered - only if you really want synonyms visible without hover**

---

## Recommended Implementation Details

### Node Rendering

```javascript
// In GraphRenderer.js - node label rendering

function renderNodeLabel(node) {
  const labelGroup = svg.append("g").attr("class", "node-label");

  // Primary label (always visible)
  labelGroup.append("text")
    .attr("class", "node-label-primary")
    .text(node.label)  // Canonical term
    .style("font-size", "14px")
    .style("font-weight", "600")
    .style("fill", "#333");

  // Synonym indicator (subtle, optional)
  if (node.labels && node.labels.length > 1) {
    labelGroup.append("circle")
      .attr("class", "synonym-indicator")
      .attr("cx", node.label.length * 3.5 + 5)  // Position after text
      .attr("cy", -8)
      .attr("r", 3)
      .style("fill", "#999")
      .style("opacity", 0.5)
      .attr("title", "Has alternative names");
  }
}
```

### Tooltip Enhancement

```javascript
// Enhanced tooltip with synonym list

.on("mouseover", function(event, d) {
  let tooltipContent = `<strong>${d.label}</strong>`;

  // Show "Also known as" section for synonyms
  if (d.labels && d.labels.length > 1) {
    const synonyms = d.labels.filter(l => l !== d.label);
    tooltipContent += `
      <div class="synonym-list">
        <em>Also known as:</em>
        <ul>
          ${synonyms.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Related qualities, standards, etc.
  if (d.related && d.related.length > 0) {
    tooltipContent += `<div class="related-list">Related: ${d.related.join(', ')}</div>`;
  }

  tooltip.html(tooltipContent);
});
```

### CSS Styling

```css
/* Tooltip synonym styling */
.graph-tooltip .synonym-list {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e0e0e0;
  font-size: 0.85em;
}

.graph-tooltip .synonym-list em {
  color: #666;
  font-style: italic;
  font-size: 0.9em;
}

.graph-tooltip .synonym-list ul {
  margin: 0.25rem 0 0 1rem;
  padding: 0;
}

.graph-tooltip .synonym-list li {
  color: #555;
  font-size: 0.95em;
}

/* Small indicator dot on nodes with synonyms (optional) */
.synonym-indicator {
  cursor: help;
}

.synonym-indicator:hover {
  opacity: 0.8;
  r: 4;  /* Slightly larger on hover */
}
```

---

## Visual Comparison

### ✅ RECOMMENDED: Single Node with Tooltip

**Default view** (no synonyms visible):
```
[Debuggability]  [Performance]  [Security]
```

**On hover**:
```
┌──────────────────────────────┐
│ Debuggability                │
│ aka: Troubleshootability     │
└──────────────────────────────┘
```

**Pros**:
- Clean, uncluttered graph
- Synonyms available on-demand
- No ambiguity (one canonical term)
- Scales well (10 synonyms? No problem)

---

### ❌ NOT RECOMMENDED: Multiple Nodes

**Default view** (cluttered):
```
[Debuggability]────[Troubleshootability]
                   └[Diagnosability]

[Performance]──────[Performance Efficiency]

[Availability]─────[High Availability]
```

**Problems**:
- 4 high-confidence synonyms → 8 nodes instead of 4
- Confusing: which to use?
- Graph feels "bloated"
- Harder to see real relationships

---

## Graph Legend Update

Add a legend entry to explain synonyms:

```
┌─────────────────────────────────────┐
│ Graph Legend                        │
├─────────────────────────────────────┤
│ ● Quality (hover for synonyms)      │
│ ● Requirement                       │
│ ● Property/Tag                      │
│ ● Standard                          │
└─────────────────────────────────────┘
```

Or with more detail:

```
┌─────────────────────────────────────────────┐
│ Quality nodes may have alternative names    │
│ (synonyms). Hover over a node to see all    │
│ known terms for that concept.               │
└─────────────────────────────────────────────┘
```

---

## Search Integration

Don't forget: synonyms should be searchable!

```javascript
// In search/filter functionality

function searchGraph(query) {
  return nodes.filter(node => {
    // Search canonical label
    if (node.label.toLowerCase().includes(query.toLowerCase())) {
      return true;
    }

    // Also search synonym labels
    if (node.labels) {
      return node.labels.some(label =>
        label.toLowerCase().includes(query.toLowerCase())
      );
    }

    return false;
  });
}
```

**Example**: User types "troubleshoot" → highlights "Debuggability" node

---

## Implementation Checklist

When implementing synonym visualization:

- [ ] Node data includes `labels` array (canonical + synonyms)
- [ ] Node rendering uses `label` (canonical) for display
- [ ] Tooltip shows all `labels` with "Also known as" section
- [ ] Optional: small indicator dot if `labels.length > 1`
- [ ] Search/filter includes all labels, not just canonical
- [ ] Graph legend mentions synonym support
- [ ] CSS styling for synonym sections in tooltips
- [ ] No separate nodes for synonyms (filtered in data generation)
- [ ] Test with multiple synonyms (3-4) to ensure tooltip isn't too large

---

## Special Case: Homepage vs Full Graph

### Homepage Graph (Overview)
- **Keep it minimal**: Show only canonical terms
- **Tooltip**: Brief "aka X, Y" line
- **Goal**: Quick overview, not exhaustive

### Full Graph (Detailed)
- **Show more info**: Expanded tooltip with all synonyms
- **Optional**: Small indicator dots on synonym nodes
- **Goal**: Complete information for deep exploration

Both use **same data structure**, just different rendering detail levels.

---

## Accessibility Considerations

**For screen readers**:
```html
<div class="node" role="button"
     aria-label="Debuggability, also known as Troubleshootability and Diagnosability">
  <text>Debuggability</text>
</div>
```

**For keyboard navigation**:
- Tab to node → Show tooltip
- Enter on node → Navigate to quality page
- Tooltip includes all synonym information

---

## Final Recommendation Summary

| Aspect | Recommendation |
|--------|---------------|
| **Node count** | One node per concept (no duplicate synonym nodes) |
| **Default label** | Canonical term only (clear, unambiguous) |
| **Synonym visibility** | Tooltip on hover (on-demand, not cluttering) |
| **Styling difference** | No (consistent node appearance) |
| **Optional indicator** | Subtle dot/badge (for discoverability) |
| **Search** | Include all labels (synonyms findable) |
| **Graph complexity** | Minimal (synonyms don't add edges/nodes) |

**In short**: Keep the graph clean and let tooltips do the heavy lifting for synonym information.

---

## Questions for Decision

1. **Should there be ANY visual indicator** that a node has synonyms?
   - **Option A**: No indicator (synonyms only in tooltip)
   - **Option B**: Small subtle dot (✅ recommended)
   - **Option C**: "aka" text on node (cluttered)

2. **How prominent should synonyms be in tooltips?**
   - **Option A**: Separate section with border (✅ recommended)
   - **Option B**: Inline mention: "Debuggability (aka Troubleshootability)"
   - **Option C**: At bottom in small text

3. **Should search highlighting include synonyms?**
   - **YES** (✅ recommended) - User types "troubleshoot", "Debuggability" node highlights
   - **NO** - Only canonical terms searchable

**My recommendation**: Option B + Option A + YES

This gives the best balance of discoverability and cleanliness.
