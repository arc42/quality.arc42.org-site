# Debug Build Feature Documentation

## Overview

This document describes the debug build configuration implemented to provide a separate build environment with debug-specific content that is excluded from production builds.

## Implementation Summary

I've successfully implemented the debug build configuration on the `feature/debug-build` branch with all requirements:

### **🔧 Configuration Setup**
- **`_config_debug.yml`** - Debug configuration that extends production config
- **Updated `_config.yml`** - Excludes debug files from production builds
- **Updated `docker-compose.yml`** - Added `jekyll-debug` service with profile

### **📄 Debug Content Created**
1. **`_debug/site-stats.md`** - Comprehensive site statistics and health check
2. **`_qualities/A/aa-quality.md`** - Debug test quality
3. **`_requirements/A/aa-requirement.md`** - Debug test requirement  
4. **`_standards/aa-standard.md`** - Debug test standard

### **🔗 Interconnected Relationships**
- **AA Quality** → references AA Standard, relates to AA Requirement
- **AA Requirement** → relates to AA Quality
- **AA Standard** → references AA Quality in quality attributes table

## Usage Commands

### Docker Compose (Recommended)

```bash
# Production build (unchanged behavior)
docker compose up

# Debug build (new)
docker compose --profile debug up jekyll-debug

# Both builds simultaneously (for comparison)
docker compose --profile debug up
```

### Local Development

```bash
# Production build
bundle exec jekyll serve --incremental --watch

# Debug build
bundle exec jekyll serve --incremental --watch --config _config.yml,_config_debug.yml

# Production static build
bundle exec jekyll build

# Debug static build
bundle exec jekyll build --config _config.yml,_config_debug.yml
```

## File Structure

```
├── _config.yml              # Production config (excludes debug files)
├── _config_debug.yml        # Debug config (includes debug files)
├── docker-compose.yml       # Updated with jekyll-debug service
├── _debug/
│   └── site-stats.md        # Site statistics and health check
├── _qualities/A/
│   └── aa-quality.md        # Debug test quality
├── _requirements/A/
│   └── aa-requirement.md    # Debug test requirement
└── _standards/
    └── aa-standard.md       # Debug test standard
```

## Configuration Details

### Production Config (`_config.yml`)
Excludes debug files:
```yaml
exclude:
  # ... existing exclusions ...
  - _debug/
  - _qualities/A/aa-quality.md
  - _requirements/A/aa-requirement.md
  - _standards/aa-standard.md
```

### Debug Config (`_config_debug.yml`)
Extends production config and includes debug content:
```yaml
# Include debug pages
include:
  - _pages
  - _data/standard_tags.yaml
  - _debug/

# Debug-specific settings
debug_mode: true

# Add debug collection
collections:
  debug:
    output: true
    hide: false
    sort_by: title
```

### Docker Compose Services

```yaml
services:
  jekyll:
    # Production service (unchanged)
    command: bundle exec jekyll serve --incremental --watch --host 0.0.0.0

  jekyll-debug:
    # Debug service with profile
    command: bundle exec jekyll serve --incremental --watch --host 0.0.0.0 --config _config.yml,_config_debug.yml
    profiles:
      - debug
```

## Debug Content Details

### Site Statistics (`_debug/site-stats.md`)
Provides comprehensive debugging information:
- Collection statistics (counts of qualities, requirements, standards)
- Tag analysis with most common tags
- Site health checks for missing tags or relationships
- Links to debug test items
- Potential issues detection

### Debug Test Items

#### AA Quality (`_qualities/A/aa-quality.md`)
```yaml
title: AA Quality
tags: [debug, test]
related: [aa-requirement]
standards: [aa-standard]
```

#### AA Requirement (`_requirements/A/aa-requirement.md`)
```yaml
title: AA Requirement
tags: [debug, test]
related: [aa-quality]
```

#### AA Standard (`_standards/aa-standard.md`)
```yaml
title: "AA Standard — Debug Test Standard"
standard_id: aa-standard
```

## Key Features

### **✨ Benefits**
- **Zero impact on production** - debug files completely excluded
- **Complete relationship testing** - all three collections interconnected
- **Site health monitoring** - statistics and issue detection
- **Clean separation** - debug content clearly isolated
- **Easy switching** - simple command difference

### **🔍 Debug Capabilities**
- Test quality ↔ requirement relationships
- Test quality ↔ standard relationships
- Validate tag system functionality
- Monitor site health and detect issues
- Verify build configuration correctness

### **🚀 Performance**
- Shared esbuild service for both builds
- Same port usage (4000) - only one can run at a time
- Profile-based service activation
- Minimal configuration overhead

## Testing the Implementation

### Verify Production Build (should exclude debug items)
```bash
docker compose up
# Visit http://localhost:4000
# Debug pages should return 404
# AA Quality/Requirement/Standard should not exist
```

### Verify Debug Build (should include debug items)
```bash
docker compose --profile debug up jekyll-debug
# Visit http://localhost:4000/debug/site-stats
# Visit http://localhost:4000/qualities/aa-quality
# Visit http://localhost:4000/requirements/aa-requirement
# Visit http://localhost:4000/standards/aa-standard
```

### Verify Relationships
In debug build:
- AA Quality page should show AA Standard in "Related Standards" section
- AA Quality page should show AA Requirement in "Related Qualities" section
- AA Standard page should show AA Quality in quality attributes table
- Site stats should show debug items in counts

## Troubleshooting

### Common Issues

1. **Debug service won't start**
   - Ensure you're using the profile: `docker compose --profile debug up jekyll-debug`
   - Check that port 4000 isn't already in use

2. **Debug pages return 404**
   - Verify you're using the debug service, not the production service
   - Check that `_config_debug.yml` is being loaded

3. **Relationships not working**
   - Verify the debug items have correct front matter
   - Check that the relationship logic handles the YAML array format

4. **Production build includes debug items**
   - Verify `_config.yml` excludes list includes all debug files
   - Ensure you're not accidentally using the debug config

### Validation Checklist

- [ ] Production build excludes all debug files
- [ ] Debug build includes all debug files
- [ ] AA Quality shows related standard and requirement
- [ ] AA Standard shows AA Quality in attributes table
- [ ] Site stats page displays correct counts
- [ ] Tag system works with debug tags
- [ ] Both builds use same esbuild service

## Future Enhancements

Potential additions to the debug system:
- Link validation checker
- Broken relationship detector
- Performance metrics
- Content quality analysis
- Automated testing of relationships
- Debug-specific styling or indicators

---
*Generated with Crush - Debug Build Feature Implementation*