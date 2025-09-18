---
layout: page
title: "🔧 Debug Dashboard"
permalink: /debug/
order: 0
hide: false
---

# Debug Dashboard

Welcome to the debug dashboard! This page is only visible when running in debug mode.

## Quick Links

- [Site Statistics](/debug/site-stats) - Collection counts, tag analysis, and health checks
- [Full Quality Graph](/full-quality-graph) - Complete graph visualization
- [Search](/search) - Search functionality

## Debug Test Items

These special test items are only available in debug mode:

- [AA Quality](/qualities/aa-quality) - Test quality item
- [AA Requirement](/requirements/aa-requirement) - Test requirement item  
- [AA Standard](/standards/aa-standard) - Test standard item

## Development Tools

- **Current Mode**: Debug (includes debug pages and test items)
- **Collections**: {{ site.qualities | size }} qualities, {{ site.requirements | size }} requirements, {{ site.standards | size }} standards
- **Debug Pages**: {{ site.debug | size }} debug pages

---

*This debug dashboard is only visible when running with debug configuration.*