# Quality Index Files Guide

Generated: 2025-11-23

## Overview

This directory contains a comprehensive index of all 180 quality attributes from the arc42 quality model, structured for semantic relationship analysis.

## Generated Files

### Data Files

#### 1. `quality-index.json` (217K)
**Purpose:** Complete master index with full data

**Contains:**
- All 180 quality entries
- Full content summaries (200-300 words each)
- Complete frontmatter metadata
- All relationships, tags, and standards
- Comprehensive statistics

**Use for:**
- Semantic embedding analysis
- Content similarity calculations
- Complete data access
- Machine learning training data

**Structure:**
```json
{
  "metadata": {...},
  "statistics": {...},
  "qualities": [
    {
      "id": "accessibility",
      "title": "Accessibility",
      "tags": ["usable"],
      "related": ["usability", "inclusivity", "interaction-capability"],
      "standards": ["iso26514", "iso25024", "ieee2857"],
      "contentSummary": "Full 200-300 word summary...",
      "filePath": "_qualities/A/accessibility.md",
      "permalink": "/qualities/accessibility"
    },
    ...
  ]
}
```

---

#### 2. `quality-index-summary.json` (151K)
**Purpose:** Analytical summary with groupings and insights

**Contains:**
- Abbreviated quality entries (100-char previews)
- Top 20 qualities by relationship count
- Top 20 qualities by standard count
- Qualities grouped by tag
- Qualities grouped by standard
- Full statistics

**Use for:**
- Quick analysis
- Grouping and filtering
- Finding qualities by tag/standard
- Identifying top qualities

**Key sections:**
- `qualitiesIndex`: All qualities with abbreviated content
- `sampleDetailedEntries`: First 10 full entries
- `insights.qualitiesWithMostRelations`
- `insights.qualitiesWithMostStandards`
- `insights.qualitiesByTag`
- `insights.qualitiesByStandard`

---

#### 3. `all-qualities-compact.json` (38K)
**Purpose:** Minimal reference list

**Contains:**
- ID, title, tags only
- Relation counts
- Standard counts
- File paths

**Use for:**
- Quick lookups
- Display lists
- Simple filtering
- Memory-efficient operations

**Structure:**
```json
[
  {
    "id": "accessibility",
    "title": "Accessibility",
    "tags": ["usable"],
    "relatedCount": 3,
    "standardsCount": 3,
    "filePath": "_qualities/A/accessibility.md"
  },
  ...
]
```

---

#### 4. `QUALITY-INDEX-COMPLETE.json` (8.6K)
**Purpose:** Executive summary with key statistics

**Contains:**
- High-level statistics
- Top qualities lists
- Semantic cluster definitions
- Key insights
- Recommendations

**Use for:**
- Quick overview
- Dashboard data
- Executive reporting
- Planning next phases

**Key sections:**
- `indexMetadata`: Generation info
- `statistics`: All key stats
- `topQualities`: Most referenced, most relations, most standards
- `semanticClusters`: Identified quality clusters
- `keyInsights`: Top 10 findings
- `nextStepsForSemanticAnalysis`: Action items

---

### Documentation Files

#### 5. `QUALITY-INDEX-REPORT.md` (13K)
**Purpose:** Human-readable comprehensive analysis

**Contains:**
- Executive summary
- Detailed statistics
- Tag analysis
- Standard coverage analysis
- Relationship network analysis
- Semantic cluster descriptions
- Sample quality entries
- Next steps recommendations

**Use for:**
- Understanding the quality model
- Presenting findings
- Documentation
- Planning improvements

**Sections:**
- Executive Summary
- Key Findings
- Distribution Analysis
- Tag Analysis
- Standard Coverage Analysis
- Relationship Network Analysis
- Quality Catalog Structure
- Sample Quality Entries
- Semantic Relationship Patterns
- Use Cases for This Index
- Next Steps for Semantic Analysis

---

#### 6. `INDEX-FILES-GUIDE.md` (This file)
**Purpose:** Guide to all generated index files

---

### Build Scripts

#### 7. `build-quality-index.js` (6.4K)
**Purpose:** Main index builder script

**Generates:** `quality-index.json`

**Usage:**
```bash
node build-quality-index.js
```

**Functions:**
- Finds all quality markdown files
- Parses frontmatter with gray-matter
- Extracts content summaries
- Builds relationship network
- Calculates statistics
- Writes JSON output

---

#### 8. `create-index-summary.js` (3.5K)
**Purpose:** Generate summary and analytics

**Generates:** `quality-index-summary.json`

**Usage:**
```bash
node create-index-summary.js
```

**Functions:**
- Loads full index
- Abbreviates content
- Sorts and ranks qualities
- Groups by tags and standards
- Generates insights

---

#### 9. `list-all-qualities.js` (1.3K)
**Purpose:** Generate compact listing

**Generates:** `all-qualities-compact.json` + console output

**Usage:**
```bash
node list-all-qualities.js
```

**Functions:**
- Creates minimal quality entries
- Alphabetically groups qualities
- Prints formatted listing
- Writes compact JSON

---

## Quick Reference

### To Regenerate All Files

```bash
# Full regeneration
node build-quality-index.js && \
node create-index-summary.js && \
node list-all-qualities.js
```

### To Access Data in Code

```javascript
// Load full index
import fs from 'fs';
const index = JSON.parse(fs.readFileSync('quality-index.json', 'utf8'));

// Access all qualities
const qualities = index.qualities;

// Find a specific quality
const security = qualities.find(q => q.id === 'security');

// Get qualities by tag
const usableQualities = qualities.filter(q => q.tags.includes('usable'));

// Get qualities with no standards
const noStandards = qualities.filter(q => q.standards.length === 0);
```

### To Query Data

```bash
# Count qualities by first letter
jq '.qualities | group_by(.id[0:1]) | map({letter: .[0].id[0:1], count: length})' quality-index.json

# Get all quality IDs
jq '.qualities[].id' quality-index.json

# Find qualities with most relations
jq '.qualities | sort_by(.related | length) | reverse | .[0:10] | map({id, relatedCount: (.related | length)})' quality-index.json

# Get all tags
jq '.statistics.tagFrequency' quality-index.json

# Find qualities without standards
jq '.qualities | map(select(.standards | length == 0)) | map(.id)' quality-index.json
```

---

## Statistics Summary

### Totals
- **180 qualities** indexed
- **717 relationship edges**
- **8 unique tags**
- **27 unique standards**

### Averages
- **3.98 relations** per quality
- **1.68 tags** per quality
- **2.02 standards** per quality

### Distribution
- **0 qualities** with zero relations (fully connected)
- **0 qualities** with >10 relations (well-balanced)
- **98 qualities** (54.4%) have standards
- **82 qualities** (45.6%) lack standards

### Top Tags
1. usable (65 - 36%)
2. reliable (57 - 32%)
3. efficient (39 - 22%)
4. operable (39 - 22%)
5. flexible (37 - 21%)

### Top Standards
1. iso25010 (50 - 28%)
2. iso42030 (24)
3. cra (22)
4. sox (21)
5. ieee2857 (21)

### Hub Qualities
1. usability (41 inbound refs)
2. flexibility (27 inbound refs)
3. adaptability (22 inbound refs)
4. operability (20 inbound refs)
5. robustness (18 inbound refs)

---

## Use Cases

### 1. Semantic Relationship Analysis
**File:** `quality-index.json`

Load content summaries and perform:
- Semantic embedding (e.g., with sentence-transformers)
- Cosine similarity calculations
- Missing relationship detection
- Relationship validation

### 2. Tag Validation
**File:** `quality-index-summary.json`

Use `insights.qualitiesByTag` to:
- Review tag assignments
- Find qualities needing additional tags
- Detect tag inconsistencies
- Balance tag distribution

### 3. Standard Coverage Analysis
**File:** `quality-index-summary.json`

Use `insights.qualitiesByStandard` to:
- Map standards to quality domains
- Identify coverage gaps
- Suggest standards for 82 qualities without references
- Cross-reference standards

### 4. Graph Visualization
**File:** `all-qualities-compact.json`

Use for:
- Building interactive graphs
- Relationship visualization
- Hub identification
- Cluster detection

### 5. Quality Recommendation
**File:** `quality-index.json`

Implement similarity search:
- Given a quality, find similar ones
- Suggest related qualities
- Content-based discovery
- Semantic navigation

### 6. Documentation Generation
**Files:** All

Generate:
- Quality catalogs
- Relationship diagrams
- Standard compliance reports
- Tag-based views

---

## Next Phase: Semantic Analysis

### Phase 2: Content Similarity
1. Load all `contentSummary` fields from `quality-index.json`
2. Generate embeddings (e.g., OpenAI, sentence-transformers)
3. Calculate similarity matrix (180x180)
4. Identify high-similarity pairs without `related` link
5. Generate recommendations

### Phase 3: Tag Enhancement
1. Analyze content with NLP
2. Extract key concepts
3. Map to existing tags
4. Suggest additional tags
5. Propose new tags

### Phase 4: Standard Mapping
1. Load standard definitions
2. Match quality content to standards
3. Suggest standards for 82 qualities
4. Validate existing assignments
5. Generate compliance matrix

### Phase 5: Graph Optimization
1. Calculate edge weights from similarity
2. Suggest bidirectional relations
3. Identify transitive relations
4. Build quality hierarchy
5. Optimize layout

---

## File Sizes

| File | Size | Records | Purpose |
|------|------|---------|---------|
| quality-index.json | 217K | 180 full | Complete data |
| quality-index-summary.json | 151K | 180 abbr | Analytics |
| all-qualities-compact.json | 38K | 180 min | Quick ref |
| QUALITY-INDEX-COMPLETE.json | 8.6K | Summary | Executive |
| QUALITY-INDEX-REPORT.md | 13K | - | Documentation |

---

## Dependencies

All scripts require:
- Node.js 22.13.1+
- npm packages: `gray-matter`, `fs`, `path`

Install:
```bash
npm install
```

---

## Maintenance

### When to Regenerate

Regenerate index when:
- Quality files added/removed
- Frontmatter updated (tags, related, standards)
- Content significantly changed
- New relationships identified

### Validation

After regeneration, verify:
```bash
# Check totals
jq '.metadata.processedQualities' quality-index.json

# Check statistics
jq '.statistics' quality-index.json

# Validate structure
jq '.qualities[0]' quality-index.json
```

---

## Credits

Generated by automated index builder for the arc42 Quality Model project.

Repository: https://github.com/arc42/quality.arc42.org-site
Live Site: https://quality.arc42.org
License: CC-BY-SA-4.0

---

*Last Updated: 2025-11-23*
