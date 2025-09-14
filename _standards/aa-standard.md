---
layout: page_standard
title: "AA Standard — Debug Test Standard"
permalink: /standards/aa-standard
standard_id: aa-standard
---

## AA Standard: Debug Test Standard

This is a **debug-only standard** used for testing the site's functionality and relationships between standards, qualities, and requirements.

### Purpose and Scope

The AA Standard exists solely for debugging and testing purposes:

- Validates the standard → quality relationship system
- Tests the quality attributes mapping functionality
- Provides a controlled test case for site builds
- Ensures proper exclusion from production environments

### Key Components

| Component                       | Description                                                                 |
| :------------------------------ | :-------------------------------------------------------------------------- |
| **Test Quality Reference**      | References the [AA Quality](/qualities/aa-quality) for relationship testing |
| **Test Requirement Validation** | Validates against [AA Requirement](/requirements/aa-requirement)            |
| **Debug Tag System**            | Uses debug-specific tags for isolation                                      |
| **Build Configuration**         | Tests production vs debug build exclusion                                   |

## Quality Attributes Addressed

This debug standard addresses the following test quality attributes:

| Attribute                               | How AA Standard addresses it                                                                                        |
| :-------------------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| **[AA Quality](/qualities/aa-quality)** | Core test quality: provides framework for testing quality-standard relationships and site functionality validation. |

## Debug Information

- **Collection**: `site.standards`
- **Layout**: `page_standard.html`
- **Standard ID**: `{{ page.standard_id }}`
- **Related Qualities**: Should automatically detect AA Quality via standards field

## Validation Checklist

- [ ] Standard appears only in debug builds
- [ ] Standard is excluded from production builds
- [ ] Quality relationship mapping works correctly
- [ ] Standard ID matching functions properly
- [ ] Related qualities section displays AA Quality

## References

### Debug Resources

- [Debug Site Stats](/debug/site-stats) - Overall site statistics and health check
- [AA Quality](/qualities/aa-quality) - Related debug quality
- [AA Requirement](/requirements/aa-requirement) - Related debug requirement

---

⚠️ **This page is only visible in debug mode and excluded from production builds.**
