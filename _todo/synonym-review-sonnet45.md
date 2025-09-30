# Review: Synonym Handling Proposal

Reviewed the four options for handling quality synonyms. Overall assessment: **solid pragmatic approach**, but recommend a hybrid strategy for this site.

## Recommended Approach: Hybrid of Options 1 + 3

**Primary: Option 1 (Canonical + Redirects)**
- Best fit for SEO and user expectations
- Maintains discoverability via direct URLs
- Clear "Also known as" sections aid understanding

**Secondary: Option 3 (Data-level merging)**
- Essential for graph consistency
- Prevents duplicate nodes in force-directed layouts
- Keeps data generation clean

## Implementation Priority

### Phase 1: Establish canonical mappings
1. Create `_data/quality-synonyms.yml` with canonical → [synonyms] mappings
2. Add `aka` field to canonical quality front matter
3. Render "Also known as" section in quality layout

### Phase 2: Create redirect stubs
1. Add thin synonym pages with `alias_of` and `redirect_to`
2. Use existing Jekyll infrastructure (no new plugins needed)
3. Maintain in same `_qualities/<LETTER>/` structure

### Phase 3: Update data generation
1. Modify `src/scripts/data.js` to collapse synonyms to canonical nodes
2. Preserve synonym labels for tooltips/search
3. Update edge references to use canonical IDs

## Specific Concerns

### Option 2 (Search-only)
**Not recommended** as primary approach:
- Loses direct URL discoverability
- Harder for external links/citations
- Search-dependent UX is fragile

### Option 4 (Umbrella concepts)
**Use sparingly** for:
- True hierarchical relationships (e.g., "security" umbrella)
- Cases where nuance matters (not pure synonyms)
- Avoid for simple synonyms like debuggability/troubleshootability

## Front Matter Schema

Recommend standardizing on:

```yaml
# Canonical page
title: "Debuggability"
aka: ["troubleshootability", "diagnosability"]
permalink: /qualities/debuggability

# Synonym stub
title: "Troubleshootability"
alias_of: debuggability
redirect_to: /qualities/debuggability
layout: redirect  # or use jekyll-redirect-from
```

## Data Structure

`_data/quality-synonyms.yml`:
```yaml
debuggability:
  - troubleshootability
  - diagnosability
observability:
  - monitorability
testability:
  - verifiability
```

## Graph Rendering Impact

Current graph uses `permalink` as node ID. With synonyms:
- Node ID: canonical slug (e.g., `debuggability`)
- Node labels: array `["Debuggability", "Troubleshootability"]`
- Tooltip: show all labels
- Related edges: map to canonical before creating links

## Migration Strategy

1. **Audit existing qualities** for synonym candidates
2. **Start small**: pick 3-5 clear synonym sets
3. **Test redirect behavior** with Docker build
4. **Update graph data generation** to handle merging
5. **Document pattern** in AGENTS.md for consistency
6. **Gradually expand** to remaining synonyms

## Open Questions

1. Should synonym stubs appear in qualities list, or be hidden?
   - Recommend: hidden from main list, discoverable via search
2. How to handle standards that reference synonym terms?
   - Map to canonical in `standards` field during data generation
3. Should graph tooltips show "Also known as" inline?
   - Yes, improves discoverability without cluttering

## Compatibility Notes

- Works with existing Jekyll setup (no new dependencies)
- `jekyll-redirect-from` plugin already available if needed
- Data generation in Node.js can easily handle mapping
- No breaking changes to existing quality pages

## Conclusion

**Adopt hybrid Option 1 + 3** with phased rollout. Start with `_data/quality-synonyms.yml` and canonical `aka` fields, then add redirects and update data generation. Avoid Option 2 as primary strategy; use Option 4 only for true umbrella concepts, not synonyms.
