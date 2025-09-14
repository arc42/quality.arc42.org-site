---
title: AA Quality
tags: [debug, test]
related: [aa-requirement]
standards: [aa-standard]
permalink: /qualities/aa-quality
---

# AA Quality - Debug Test Quality

This is a **debug-only quality** used for testing the site's functionality and relationships.

## Purpose

This quality exists solely for debugging and testing purposes:

- Tests the quality → requirement relationship system
- Tests the quality → standard relationship system
- Tests the tag system with debug-specific tags
- Provides a controlled test case for site functionality

## Relationships

### Related Requirements

This quality should be related to:

- [AA Requirement](/requirements/aa-requirement) - Debug test requirement

### Related Standards

This quality should be referenced by:

- [AA Standard](/standards/aa-standard) - Debug test standard

## Debug Information

- **Collection**: `site.qualities`
- **Layout**: `qualities.html`
- **Tags**: `{{ page.tags | join: ", " }}`
- **Related**: `{{ page.related | join: ", " }}`
- **Standards**: `{{ page.standards | join: ", " }}`

---

⚠️ **This page is only visible in debug mode and excluded from production builds.**
