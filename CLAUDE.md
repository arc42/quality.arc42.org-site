# CLAUDE.md - AI Assistant Guide

**arc42 Quality Model Repository**

This document provides a comprehensive guide for AI assistants working with the quality.arc42.org-site codebase. It explains the project architecture, development workflows, coding conventions, and key patterns to follow.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Content Architecture](#content-architecture)
4. [Development Workflow](#development-workflow)
5. [Build System](#build-system)
6. [Graph Visualization System](#graph-visualization-system)
7. [Coding Conventions](#coding-conventions)
8. [Testing & Validation](#testing--validation)
9. [Git & Deployment](#git--deployment)
10. [Common Tasks](#common-tasks)
11. [Key Files Reference](#key-files-reference)

---

## Project Overview

### What is this project?

The arc42 Quality Model is a comprehensive knowledge base for software quality attributes, requirements, and standards. It's a Jekyll-based static site that visualizes quality relationships through interactive D3.js force-directed graphs.

### Technology Stack

- **Static Site Generator**: Jekyll (Ruby-based)
- **JavaScript**: Node.js 22.x (ES Modules)
- **Build Tools**: esbuild for JS bundling
- **Visualization**: D3.js, Graphology
- **Development**: Docker Compose (recommended)
- **CI/CD**: GitHub Actions → GitHub Pages
- **License**: CC-BY-SA-4.0

### Key Statistics

- **~220 quality attributes** (in `_qualities/`)
- **~140 quality requirements** (in `_requirements/`)
- **~29 industry standards** (in `_standards/`)
- **Multiple tag pages** for categorization
- **Interactive force-directed graphs** for visualization

### Live Site

https://quality.arc42.org

---

## Repository Structure

```
quality.arc42.org-site/
├── _qualities/          # Quality attribute definitions (220+ files)
│   ├── A/              # Organized alphabetically
│   ├── B/
│   └── ...
├── _requirements/       # Quality requirements (140+ files)
│   ├── A/
│   ├── B/
│   └── ...
├── _standards/          # Industry standards (29 files)
├── _pages/             # Static pages and tag pages
├── _articles/          # Articles and blog posts
├── _layouts/           # Jekyll layout templates
├── _includes/          # Reusable Jekyll partials
├── _sass/              # Sass stylesheets
├── src/                # JavaScript source code
│   ├── graphs/         # D3.js graph visualization code
│   │   ├── Graph.js
│   │   ├── GraphRenderer.js
│   │   ├── GraphDataProvider.js
│   │   ├── HomeGraph.js
│   │   ├── FullGraph.js
│   │   ├── homepage/main.js
│   │   └── fullpage/main.js
│   └── scripts/        # Build and utility scripts
│       ├── data.js     # Graph data generator
│       └── validate-links.js
├── assets/             # Generated assets and static files
│   ├── data/           # Generated JSON graph data
│   │   ├── nodes.json
│   │   ├── edges.json
│   │   ├── property-nodes.json
│   │   └── standards.json
│   └── js/             # Compiled JavaScript
├── _config.yml         # Jekyll configuration
├── package.json        # Node.js dependencies
├── build.js            # Build script (esbuild)
├── docker-compose.yml  # Docker development setup
└── Gemfile             # Ruby dependencies
```

---

## Content Architecture

### Collections

The site uses Jekyll collections to organize content:

#### 1. **Qualities** (`_qualities/`)

Quality attributes like Performance, Security, Usability, etc.

**File Structure**: `_qualities/<LETTER>/<quality-name>.md`

**Frontmatter Example**:
```yaml
---
title: Accessibility
tags: [usable]
related: [usability, inclusivity, interaction-capability]
standards: [iso26514, iso25024, ieee2857]
permalink: /qualities/accessibility
---
```

**Frontmatter Fields**:
- `title`: Display name (string)
- `tags`: Array of system properties (space-separated or array)
- `related`: Array of related quality IDs (comma-separated or array)
- `standards`: Array of standard IDs (comma-separated or array)
- `permalink`: Stable URL path (last segment becomes node ID in graph)
- `layout`: Auto-assigned to `qualities` (via `_config.yml` defaults)

#### 2. **Requirements** (`_requirements/`)

Specific quality requirements with metrics and acceptance criteria.

**File Structure**: `_requirements/<LETTER>/<requirement-name>.md`

**Frontmatter Example**:
```yaml
---
title: Access control is enforced
tags: [secure, suitable]
related: [access-control, auditability]
permalink: /requirements/access-control-is-enforced
---
```

**Content Structure**:
```markdown
<div class="quality-requirement" markdown="1">

#### Context/Background
[Context description]

#### Source
[Trigger or initiating event]

#### Metric/Acceptance Criteria
[Specific, measurable criteria]

</div>
```

#### 3. **Standards** (`_standards/`)

Industry standards like ISO-25010, GDPR, MISRA-C, etc.

**File Structure**: `_standards/<standard-name>.md`

**Frontmatter Example**:
```yaml
---
layout: page_standard
title: "ISO/IEC 25010 - Systems and Software Quality"
standard_id: iso25010
shortname: "ISO/IEC 25010"
categories: [general]
permalink: /standards/iso-25010
---
```

**Important**: `standard_id` is used for cross-referencing (case-insensitive matching).

#### 4. **Tag Pages** (`_pages/`)

Each tag used in frontmatter needs a corresponding tag page.

**File Pattern**: `_pages/tag-<tagname>.md`

**Example**: `_pages/tag-usable.md`

**How to Create**:
1. Copy an existing tag page (e.g., `tag-efficient.md`)
2. Rename to `tag-<yourtag>.md`
3. Update title and permalink
4. Keep the include macros unchanged

### Graph Node Types

The system creates four types of nodes:

| Type | Color | Size | Example |
|------|-------|------|---------|
| **Property** (tags) | `#f8f9fa` | 35 | `usable`, `secure` |
| **Quality** | `#00B8F5` | 25 | `accessibility`, `performance` |
| **Requirement** | `#ffb3b3` | 15 | `access-control-is-enforced` |
| **Standard** | `#FFC95C` | 45 | `iso25010`, `gdpr` |

### Relationship Types

1. **Quality → Property**: Via `tags` field
2. **Quality → Quality**: Via `related` field
3. **Quality → Standard**: Via `standards` field
4. **Requirement → Quality**: Via `related` field
5. **Requirement → Property**: Via `tags` field (indirectly)
6. **Standard → Quality**: Derived from quality's `standards` field
7. **Standard → Property**: Derived through connected qualities

---

## Development Workflow

### Option 1: Docker (Recommended)

```bash
# Start development environment
docker compose up

# This will:
# 1. Install npm dependencies
# 2. Generate graph data (npm run data)
# 3. Validate links (npm run test:links)
# 4. Watch for JS changes (npm run watch)
# 5. Serve Jekyll site on http://localhost:4000

# Stop and restart to apply docker-compose.yml changes
docker compose down
docker compose up
```

**When to restart Docker**:
- Adding/removing content files that affect tags/related/permalinks
- Changes to `docker-compose.yml`
- To regenerate all graph data

### Option 2: Local Development

**Prerequisites**:
- Node.js 22.13.1 (managed by Volta)
- npm 11.0.0
- Ruby (for Jekyll)
- Bundler

**Setup**:
```bash
npm install
bundle install
```

**Development** (requires two terminals):

Terminal 1 - JavaScript build:
```bash
npm run data      # Generate graph data
npm run watch     # Watch for JS changes
```

Terminal 2 - Jekyll server:
```bash
bundle exec jekyll serve --incremental --watch
```

**Production Build**:
```bash
npm run build                    # Build JS and generate data
bundle exec jekyll build         # Build Jekyll site
```

### Environment Management

The project uses **Volta** to pin Node.js and npm versions:
```json
"volta": {
  "node": "22.13.1",
  "npm": "11.0.0"
}
```

If Volta is installed, it will automatically use the correct versions.

---

## Build System

### Build Pipeline

1. **Data Generation** (`npm run data`)
   - Reads frontmatter from all `_qualities/`, `_requirements/`, `_standards/`
   - Creates graph nodes and edges
   - Outputs JSON files to `assets/data/`:
     - `nodes.json` - All graph nodes
     - `edges.json` - All graph edges
     - `property-nodes.json` - Tag/property nodes
     - `standards.json` - Standards metadata

2. **JavaScript Bundling** (`npm run build` or `npm run watch`)
   - Uses esbuild to bundle graph code
   - Entry points:
     - `src/graphs/homepage/main.js` → `assets/js/homepage/main.js`
     - `src/graphs/fullpage/main.js` → `assets/js/fullpage/main.js`
   - Minification and sourcemaps in production

3. **Jekyll Build** (`bundle exec jekyll build`)
   - Processes Markdown files
   - Applies layouts and includes
   - Generates static HTML site in `_site/`

### Build Scripts

```json
{
  "build": "node build.js",
  "watch": "node build.js --watch",
  "data": "rimraf \"./assets/data\" && node src/scripts/data.js",
  "test:links": "node src/scripts/validate-links.js",
  "test:links:strict": "node src/scripts/validate-links.js --strict"
}
```

### Key Build Files

#### `build.js`

Main build orchestrator:
```javascript
// 1. Generate graph data
await generateData();

// 2. Bundle JavaScript with esbuild
const context = await esbuild.context({
  entryPoints: [
    "src/graphs/homepage/main.js",
    "src/graphs/fullpage/main.js",
  ],
  outdir: "assets/js",
  bundle: true,
  minify: !watch,
  sourcemap: !watch,
});

// 3. Watch or rebuild
if (watch) {
  await context.watch();
} else {
  await context.rebuild();
  await context.dispose();
}
```

#### `src/scripts/data.js`

Graph data generator that:
- Parses frontmatter from all content collections
- Builds node and edge relationships
- Calculates node sizes based on connections
- Writes sorted JSON files to `assets/data/`

**Key Functions**:
- `generateData()` - Main entry point
- `createGraphData()` - Process collections into graph data
- `processNodeTags()` - Create property nodes and edges
- `processRelatedNodes()` - Create relationship edges

---

## Graph Visualization System

### Architecture

The graph system uses a class-based architecture:

```
Graph (base class)
├── HomeGraph (homepage variant)
└── FullGraph (full page variant)

GraphRenderer (D3.js rendering)
GraphDataProvider (data loading and filtering)
```

### Key Classes

#### `Graph.js` (Base Class)

Abstract base class for graph implementations.

**Key Methods**:
- `constructor(config)` - Initialize with configuration
- `init()` - Abstract method to initialize graph
- `loadData()` - Load graph data from JSON files
- `render()` - Render the graph

#### `GraphRenderer.js`

Handles D3.js force simulation and rendering.

**Key Features**:
- Force-directed layout using D3.js
- Node and edge rendering
- Zoom and pan interactions
- Tooltips and hover effects
- Legend rendering

**Key Methods**:
- `render(data, config)` - Main rendering function
- `createSimulation()` - Configure force simulation
- `renderNodes()` - Render graph nodes
- `renderEdges()` - Render graph edges
- `applyZoomBehavior()` - Handle zoom/pan

#### `GraphDataProvider.js`

Loads and filters graph data.

**Key Methods**:
- `loadData()` - Load all JSON files
- `filterData(criteria)` - Filter nodes/edges by criteria
- `getNodeById(id)` - Retrieve specific node

### Graph Data Format

#### Nodes (`nodes.json`)

```json
[
  {
    "id": "accessibility",
    "label": "Accessibility",
    "size": 25,
    "color": "#00B8F5",
    "qualityType": "quality",
    "page": "/qualities/accessibility",
    "standards": ["iso26514", "iso25024"]
  }
]
```

#### Edges (`edges.json`)

```json
[
  {
    "source": "accessibility",
    "target": "usability"
  }
]
```

### Graph Configuration

Graph behavior is configured via:

1. **Layout Config** (`_includes/q-graph-config.html`)
2. **Graph-specific settings** (in page frontmatter)
3. **CSS variables** (in `_sass/`)

---

## Coding Conventions

### JavaScript Style

**Module System**: ES Modules (ESM)
```javascript
// ✅ Correct - include .js extension
import { Graph } from './Graph.js';

// ❌ Wrong - no extension
import { Graph } from './Graph';
```

**Import Organization**:
```javascript
// External dependencies first
import * as d3 from 'd3';
import Graph from 'graphology';

// Internal modules second
import { GraphRenderer } from './GraphRenderer.js';
import { DataProvider } from './GraphDataProvider.js';
```

**Naming Conventions**:
- Variables/Functions: `camelCase`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `PascalCase` for classes (`GraphRenderer.js`), `kebab-case` for entry points (`main.js`)

**Formatting**:
- Use Prettier (configured in `.prettierrc`)
- 2-space indentation
- Semicolons required
- Print width: 100 characters

**Check formatting**:
```bash
npx prettier --check .
```

**Fix formatting**:
```bash
npx prettier --write .
```

**Documentation**:
```javascript
/**
 * @typedef {Object} Q42Node
 * @property {string} id - Node ID
 * @property {string} label - Node display name
 * @property {number} size - Node size
 * @property {string} color - Node color
 * @property {string} qualityType - Node quality type
 * @property {string} page - Link to documentation
 * @property {string[]} [standards] - Related standards (optional)
 */

/**
 * Create a new graph node
 * @param {string} id - Node identifier
 * @param {Object} data - Node data
 * @returns {Q42Node} The created node
 */
function createNode(id, data) {
  // ...
}
```

### Content Conventions

**Frontmatter**:
- Use array syntax for tags/related when convenient
- Always use kebab-case permalinks
- Last permalink segment becomes graph node ID
- Keep permalinks stable (graph relies on them)

**File Naming**:
- Use kebab-case: `access-control.md`
- Organize alphabetically in subdirectories
- Match filename to permalink where possible

**Cross-References**:
- Reference qualities by their ID (last permalink segment)
- Tags must match existing tag pages exactly
- Standards reference by `standard_id` (case-insensitive)

### Jekyll/Liquid Conventions

**Layouts**:
- Default layouts auto-assigned via `_config.yml`
- Don't specify `layout` in frontmatter unless overriding

**Includes**:
- Store reusable components in `_includes/`
- Use Liquid parameters for customization

**Example Include Usage**:
```liquid
{% include one-quality.liquid quality=quality %}
```

---

## Testing & Validation

### Link Validation

The repository includes comprehensive link validation to ensure content integrity.

**Run validation**:
```bash
npm run test:links          # Show warnings only
npm run test:links:strict   # Exit with error if broken links found
```

**What it validates**:
- ✅ Quality → Quality relationships (via `related`)
- ✅ Quality → Tag references (tag pages exist)
- ✅ Quality → Standard references (standards exist)
- ✅ Requirement → Quality references
- ✅ Requirement → Tag references

**Validation Rules**:

1. **All `related` qualities must exist** in `_qualities/`
2. **All `tags` must have tag pages** in `_pages/tag-<tag>.md`
3. **All `standards` must exist** in `_standards/` (by `standard_id`)
4. **All requirement `related` must reference valid qualities**

**Example Error**:
```
REQUIREMENT→QUALITY (1 errors)
───────────────────────────────────────────────────────────
  ✗ Requirement "patient-data-quality" references non-existent quality "completeness"
    Source: _requirements/P/patient-data-quality.md
```

### Smoke Testing

After changes, manually verify:

1. **Graph Rendering**: Both homepage and fullpage graphs load
2. **Tag Pages**: No 404s when clicking tags
3. **Cross-Links**: Related qualities/requirements link correctly
4. **Standards**: Standards pages render with correct metadata

### Automated Testing

**GitHub Actions** (`build-deploy-gh-pages.yml`):
- Runs on push to `main`
- Installs dependencies (Ruby + Node)
- Generates graph data
- Builds Jekyll site
- Deploys to GitHub Pages

---

## Git & Deployment

### Branch Strategy

- **`main`**: Production branch (auto-deploys to GitHub Pages)
- Feature branches: Use descriptive names

### Commit Conventions

**Format**: Use imperative mood, concise descriptions

**Examples**:
```
graph: fix edges for missing node
content: add ISO-42010 standard
validation: improve error messages
build: update esbuild to 0.25.0
```

**Grouping**:
- Group related changes in single commits
- Separate content changes from code changes

### Pull Request Guidelines

**Before submitting**:
1. ✅ Run `docker compose up` and verify site builds
2. ✅ Check graph renders correctly
3. ✅ Run `npm run test:links` to validate references
4. ✅ Add new tag pages if introducing new tags

**PR Description**:
- Clear summary of changes
- Screenshots for UI changes
- Reference related issues

### Deployment

**Automatic** (GitHub Actions):
```yaml
# Trigger: push to main
# Steps:
1. Checkout code
2. Install Ruby dependencies
3. Install Node dependencies
4. Generate graph data (npm run data)
5. Build JavaScript (npm run build)
6. Build Jekyll site
7. Deploy to GitHub Pages
```

**Manual** (local testing):
```bash
npm run build
bundle exec jekyll build
# Site output in _site/
```

---

## Common Tasks

### Adding a New Quality

1. **Create file**: `_qualities/<LETTER>/<quality-name>.md`
2. **Add frontmatter**:
   ```yaml
   ---
   title: Your Quality Name
   tags: [relevant-tag]
   related: [similar-quality, another-quality]
   standards: [iso25010]
   permalink: /qualities/your-quality-name
   ---
   ```
3. **Add content**: Definition, examples, references
4. **Verify tag pages exist**: Check `_pages/tag-<tag>.md` for each tag
5. **Test**:
   ```bash
   npm run data              # Regenerate graph data
   npm run test:links        # Validate references
   docker compose up         # Verify rendering
   ```

### Adding a New Requirement

1. **Create file**: `_requirements/<LETTER>/<requirement-name>.md`
2. **Add frontmatter**:
   ```yaml
   ---
   title: Your Requirement Title
   tags: [relevant-tag, another-tag]
   related: [related-quality]
   permalink: /requirements/your-requirement-name
   ---
   ```
3. **Add structured content**:
   ```markdown
   <div class="quality-requirement" markdown="1">

   #### Context/Background
   [Description]

   #### Source
   [Trigger]

   #### Metric/Acceptance Criteria
   [Criteria]

   </div>
   ```
4. **Test** (same as quality)

### Adding a New Standard

1. **Create file**: `_standards/<standard-name>.md`
2. **Add frontmatter**:
   ```yaml
   ---
   layout: page_standard
   title: "Full Standard Name"
   standard_id: standardid
   shortname: "Short Name"
   categories: [general]
   permalink: /standards/standard-name
   ---
   ```
3. **Add content**: Description, characteristics table, references
4. **Update qualities**: Add `standards: [standardid]` to relevant qualities
5. **Test**:
   ```bash
   npm run data
   docker compose up
   ```

### Adding a New Tag

1. **Copy existing tag page**:
   ```bash
   cp _pages/tag-efficient.md _pages/tag-newtag.md
   ```
2. **Update frontmatter**:
   ```yaml
   ---
   layout: page
   title: Newtag Qualities
   permalink: /tag-newtag
   ---
   ```
3. **Keep include macros** unchanged
4. **Use in content**: Add `tags: [newtag]` to qualities/requirements
5. **Test**:
   ```bash
   npm run test:links
   docker compose up
   ```

### Fixing Broken Links

1. **Run validation**:
   ```bash
   npm run test:links:strict
   ```
2. **Identify errors** in output
3. **Fix**:
   - Add missing tag pages
   - Correct `related` references
   - Add missing quality/standard files
4. **Re-validate**:
   ```bash
   npm run test:links
   ```

### Updating Graph Visualization

1. **Modify source**: Edit files in `src/graphs/`
2. **Test locally**:
   ```bash
   npm run watch  # Auto-rebuild on changes
   ```
3. **Refresh browser** to see changes
4. **Production build**:
   ```bash
   npm run build
   ```

### Regenerating Graph Data

**When needed**:
- After adding/modifying content files
- After changing frontmatter (tags, related, permalinks)
- After adding new standards

**How**:
```bash
npm run data
```

Or restart Docker:
```bash
docker compose down
docker compose up
```

---

## Key Files Reference

### Configuration

| File | Purpose |
|------|---------|
| `_config.yml` | Jekyll configuration, collections, defaults |
| `package.json` | Node dependencies, scripts, Volta pins |
| `Gemfile` | Ruby dependencies for Jekyll |
| `docker-compose.yml` | Docker development environment |
| `.prettierrc` | Prettier formatting configuration |

### Build & Scripts

| File | Purpose |
|------|---------|
| `build.js` | Main build orchestrator (esbuild) |
| `src/scripts/data.js` | Graph data generator |
| `src/scripts/validate-links.js` | Link validation script |

### Graph System

| File | Purpose |
|------|---------|
| `src/graphs/Graph.js` | Base graph class |
| `src/graphs/HomeGraph.js` | Homepage graph implementation |
| `src/graphs/FullGraph.js` | Full-page graph implementation |
| `src/graphs/GraphRenderer.js` | D3.js rendering engine |
| `src/graphs/GraphDataProvider.js` | Data loading and filtering |
| `src/graphs/homepage/main.js` | Homepage entry point |
| `src/graphs/fullpage/main.js` | Full-page entry point |

### Generated Assets

| File | Purpose |
|------|---------|
| `assets/data/nodes.json` | All graph nodes |
| `assets/data/edges.json` | All graph edges |
| `assets/data/property-nodes.json` | Tag/property nodes |
| `assets/data/standards.json` | Standards metadata |
| `assets/js/homepage/main.js` | Compiled homepage graph |
| `assets/js/fullpage/main.js` | Compiled full-page graph |

### Jekyll Templates

| Directory | Purpose |
|-----------|---------|
| `_layouts/` | Page layout templates |
| `_includes/` | Reusable Liquid partials |
| `_sass/` | Sass stylesheets |

### Content Collections

| Directory | Purpose |
|-----------|---------|
| `_qualities/` | Quality attribute definitions (~220 files) |
| `_requirements/` | Quality requirements (~140 files) |
| `_standards/` | Industry standards (29 files) |
| `_pages/` | Static pages and tag pages |
| `_articles/` | Articles and blog posts |
| `_todo/` | Work-in-progress content (excluded from build) |

### CI/CD

| File | Purpose |
|------|---------|
| `.github/workflows/build-deploy-gh-pages.yml` | Build and deploy to GitHub Pages |

---

## Important Constraints & Gotchas

### ⚠️ Permalink Stability

**The graph uses the last permalink segment as node IDs.**

Changing permalinks breaks graph relationships!

**Example**:
```yaml
permalink: /qualities/accessibility  # Node ID: "accessibility"
```

If you change to `/qualities/accessible`, all references break.

### ⚠️ Tag Pages Required

**Every tag used in frontmatter MUST have a corresponding tag page.**

Otherwise, links will 404.

**Example**:
```yaml
tags: [secure, usable]
```

Requires:
- `_pages/tag-secure.md`
- `_pages/tag-usable.md`

### ⚠️ Standard ID Matching

**Standards are referenced by `standard_id`, not title or filename.**

**Standard file** (`_standards/iso-25010.md`):
```yaml
standard_id: iso25010
```

**Quality reference**:
```yaml
standards: [iso25010]  # ✅ Matches standard_id
```

### ⚠️ Jekyll Watch Exclusions

**Jekyll does NOT watch these paths** (handled by esbuild):
- `assets/js/fullpage/`
- `assets/js/homepage/`

Changes to JS source require `npm run watch` or `npm run build`.

### ⚠️ Docker Restart Requirements

**Restart Docker when**:
- Adding new content files
- Changing frontmatter (tags, related, permalinks)
- Modifying `docker-compose.yml`
- Graph data needs regeneration

### ⚠️ Build Order Matters

**Correct order**:
1. Generate graph data (`npm run data`)
2. Build JavaScript (`npm run build`)
3. Build Jekyll site (`bundle exec jekyll build`)

The build scripts handle this automatically.

### ⚠️ Case Sensitivity

**Standards**: Case-insensitive matching
```yaml
standards: [ISO25010, iso25010]  # Both work
```

**Everything else**: Case-sensitive
```yaml
related: [Accessibility]  # ❌ Won't match "accessibility"
related: [accessibility]  # ✅ Correct
```

---

## Best Practices for AI Assistants

### When Adding Content

1. ✅ **Always validate references** before committing
2. ✅ **Check tag pages exist** for new tags
3. ✅ **Use kebab-case** for permalinks
4. ✅ **Keep permalinks stable** (graph relies on them)
5. ✅ **Test locally** with Docker before pushing
6. ✅ **Run link validation** (`npm run test:links`)

### When Modifying Code

1. ✅ **Follow ESM conventions** (include `.js` extensions)
2. ✅ **Run Prettier** before committing
3. ✅ **Document complex logic** with JSDoc
4. ✅ **Test graph rendering** after JS changes
5. ✅ **Maintain backward compatibility** for graph data format

### When Debugging

1. 🔍 **Check browser console** for JavaScript errors
2. 🔍 **Inspect generated JSON** in `assets/data/`
3. 🔍 **Verify node IDs** match permalink segments
4. 🔍 **Run link validator** to find broken references
5. 🔍 **Check Docker logs** for build errors

### Communication

When explaining changes to users:
- 📋 **List files changed** with clear descriptions
- 📋 **Explain why** changes were necessary
- 📋 **Provide test commands** to verify changes
- 📋 **Warn about** permalink changes or breaking changes

---

## Quick Reference Commands

```bash
# Development
docker compose up              # Start dev environment
docker compose down            # Stop dev environment

# Build
npm run data                   # Generate graph data only
npm run build                  # Build JavaScript (production)
npm run watch                  # Watch JavaScript (development)

# Testing
npm run test:links             # Validate links (warnings)
npm run test:links:strict      # Validate links (fail on errors)

# Formatting
npx prettier --check .         # Check formatting
npx prettier --write .         # Fix formatting

# Jekyll
bundle install                 # Install Ruby dependencies
bundle exec jekyll serve       # Serve Jekyll site locally
bundle exec jekyll build       # Build Jekyll site

# Git
git status                     # Check status
git add .                      # Stage all changes
git commit -m "message"        # Commit changes
git push                       # Push to remote
```

---

## Support & Resources

### Documentation
- **README.md**: High-level overview and setup instructions
- **AGENTS.md**: Concise guidelines for AI agents
- **CRUSH.md**: Quick reference for build/test/style
- **This file (CLAUDE.md)**: Comprehensive AI assistant guide

### External Resources
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [D3.js Documentation](https://d3js.org/)
- [esbuild Documentation](https://esbuild.github.io/)
- [arc42 Website](https://arc42.org/)

### Key Concepts
- **arc42**: Software architecture documentation template
- **ISO 25010**: Software quality model standard
- **Quality Attributes**: System properties like performance, security
- **Quality Requirements**: Specific, measurable quality criteria

---

## Version Information

- **Node.js**: 22.13.1 (Volta-managed)
- **npm**: 11.0.0 (Volta-managed)
- **Ruby**: 3.1+ (Jekyll requirement)
- **Jekyll**: 4.x (via Gemfile)
- **esbuild**: 0.25.0
- **D3.js**: 7.8.5

---

**Last Updated**: 2025-11-23

This guide is maintained to help AI assistants understand and work effectively with the arc42 Quality Model repository. If you notice outdated information, please update this file.
