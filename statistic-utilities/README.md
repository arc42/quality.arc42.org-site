# Statistics Utilities

This directory contains utility scripts for gathering statistics and generating reports about the arc42 Quality Model repository content.

## Purpose

These utilities are **not part of the production site build**. They are development tools for analyzing and understanding the repository structure, quality attributes, and relationships.

## Scripts

### 1. build-quality-index.js

Builds a comprehensive index of all quality attributes in the repository.

**What it does:**
- Scans all markdown files in `_qualities/`
- Extracts frontmatter metadata (title, tags, related, standards, permalink)
- Generates `quality-index.json` with structured data about each quality

**Usage:**
```bash
node statistic-utilities/build-quality-index.js
```

**Output:**
- `statistic-utilities/quality-index.json` - Sorted list of all qualities with metadata

**Example output structure:**
```json
[
  {
    "id": "accessibility",
    "title": "Accessibility",
    "tags": ["usable"],
    "relatedCount": 3,
    "standardsCount": 2,
    "filePath": "_qualities/A/accessibility.md"
  }
]
```

### 2. create-index-summary.js

Creates a statistical summary from the quality index.

**What it does:**
- Reads `quality-index.json` (requires running `build-quality-index.js` first)
- Calculates aggregate statistics
- Identifies top-connected qualities
- Counts qualities by tag

**Usage:**
```bash
# First, build the index
node statistic-utilities/build-quality-index.js

# Then, create the summary
node statistic-utilities/create-index-summary.js
```

**Output:**
- `statistic-utilities/quality-index-summary.json` - Statistical summary

**Example output structure:**
```json
{
  "total": 220,
  "byTag": {
    "usable": 45,
    "secure": 32,
    "efficient": 28
  },
  "topConnected": [
    {
      "id": "performance",
      "title": "Performance",
      "relatedCount": 15
    }
  ],
  "topStandards": [
    {
      "id": "security",
      "title": "Security",
      "standardsCount": 8
    }
  ]
}
```

### 3. list-all-qualities.js

Displays a human-readable list of all qualities with their metadata.

**What it does:**
- Reads `quality-index.json` (requires running `build-quality-index.js` first)
- Prints a formatted list to the console
- Shows title, ID, tags, relationship counts, and file paths

**Usage:**
```bash
# First, build the index
node statistic-utilities/build-quality-index.js

# Then, list all qualities
node statistic-utilities/list-all-qualities.js
```

**Example output:**
```
📋 All Qualities (220 total)

================================================================================
  1. Accessibility                          (accessibility)
     Tags: [usable]
     Relations: 3, Standards: 2
     File: _qualities/A/accessibility.md

  2. Accountability                         (accountability)
     Tags: [secure]
     Relations: 2, Standards: 1
     File: _qualities/A/accountability.md
...
================================================================================

Total: 220 qualities
```

## Workflow

To generate a complete analysis:

```bash
# 1. Build the quality index
node statistic-utilities/build-quality-index.js

# 2. Create statistical summary
node statistic-utilities/create-index-summary.js

# 3. View detailed list
node statistic-utilities/list-all-qualities.js
```

## Generated Files

All generated files are stored in this directory:

- **quality-index.json** - Complete index of all qualities
- **quality-index-summary.json** - Statistical summary

These files are excluded from the Jekyll build via `_config.yml`.

## Technical Details

**Requirements:**
- Node.js 22.x (Volta-managed)
- Dependencies: gray-matter (for parsing frontmatter)

**Module System:**
- ES Modules (ESM)
- Uses `import` statements with `.js` extensions

**Data Source:**
- Primary source: `_qualities/` directory
- Parses YAML frontmatter from markdown files
- Extracts: title, tags, related, standards, permalink

## Integration with Main Build

These utilities are **independent** from the main site build process:

- **Main build** (`build.js`, `src/scripts/data.js`): Generates graph data for the production site
- **Statistics utilities** (this directory): Generates analysis and reports for development

The main build creates files in `assets/data/` for use by the Jekyll site.
The statistics utilities create files in `statistic-utilities/` for analysis only.

## Why Separate?

- **Purpose**: Statistics vs. production data
- **Audience**: Developers/maintainers vs. site visitors
- **Frequency**: On-demand vs. every build
- **Exclusion**: These files should never be included in the Jekyll site

## Notes

- These scripts must be run from the repository root directory
- Path calculations use `__dirname` relative to script location
- All scripts use async/await for file operations
- Error handling includes helpful messages if dependencies are missing

## See Also

- **CLAUDE.md** - Comprehensive AI assistant guide
- **AGENTS.md** - Concise guidelines for AI agents
- **src/scripts/data.js** - Production graph data generator
- **src/scripts/validate-links.js** - Link validation tool
