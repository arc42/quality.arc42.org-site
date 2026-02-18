---
layout: page_standard
title: "WCAG 2.2 - Web Content Accessibility Guidelines"
standard_id: wcag22
shortname: "WCAG 2.2"
categories: [accessibility, usability]
permalink: /standards/wcag-2-2
---

## WCAG 2.2: Web Content Accessibility Guidelines

The Web Content Accessibility Guidelines (WCAG) 2.2 is the international standard for web accessibility, defining how to make web content accessible to people with disabilities. Published by the World Wide Web Consortium (W3C) as a W3C Recommendation on 5 October 2023 (updated 12 December 2024), and approved by ISO/IEC as **ISO/IEC 40500:2025** on 21 October 2025, WCAG 2.2 represents the current best practice for digital accessibility.

WCAG 2.2 addresses accessibility barriers affecting people with a wide range of disabilities, including visual, auditory, physical, speech, cognitive, language, learning, and neurological disabilities. The guidelines also benefit older users with age-related limitations and improve the overall user experience for everyone, particularly on mobile devices.

### Evolution and Compatibility

WCAG 2.2 builds on previous versions:
- **WCAG 2.0** (December 2008, ISO/IEC 40500:2012): Original framework with 61 success criteria
- **WCAG 2.1** (June 2018): Added 17 success criteria focused on mobile, low vision, and cognitive accessibility
- **WCAG 2.2** (October 2023): Added 9 new success criteria (86 total), with one obsolete criterion removed (4.1.1 Parsing)

Content that conforms to WCAG 2.2 also conforms to WCAG 2.1 and WCAG 2.0, ensuring backward compatibility. The W3C recommends using WCAG 2.2 to maximize future applicability of accessibility efforts.

## The POUR Principles

WCAG 2.2 is organized around four foundational principles, represented by the acronym POUR. These principles ensure that web content is accessible to the widest possible audience:

| Principle | Description | Implementation Focus |
|:--- |:--- |:--- |
| **Perceivable** | Information and user interface components must be presentable to users in ways they can perceive. | Content cannot be invisible to all of a user's senses. Provide text alternatives for non-text content, captions for audio/video, adaptable layouts, and distinguishable content with sufficient contrast. |
| **Operable** | User interface components and navigation must be operable. | The interface cannot require interaction that a user cannot perform. Ensure keyboard accessibility, provide sufficient time for tasks, avoid seizure-inducing content, and provide clear navigation and input mechanisms. |
| **Understandable** | Information and the operation of the user interface must be understandable. | Content and operation cannot be beyond users' understanding. Use readable and predictable text, provide input assistance, and ensure consistent, predictable behavior. |
| **Robust** | Content must be robust enough to be interpreted reliably by a wide variety of user agents, including assistive technologies. | As technologies advance, content should remain accessible. Maximize compatibility with current and future assistive technologies through valid, well-formed markup and proper naming. |

## Guidelines and Success Criteria Structure

WCAG 2.2 contains **13 guidelines** organized under the four POUR principles, with **86 testable success criteria** that define conformance requirements:

### Perceivable (4 guidelines, 30+ success criteria)
1. **Text Alternatives**: Provide text alternatives for non-text content
2. **Time-based Media**: Provide alternatives for time-based media (audio/video)
3. **Adaptable**: Create content that can be presented in different ways without losing information
4. **Distinguishable**: Make it easier for users to see and hear content, including separating foreground from background

### Operable (5 guidelines, 30+ success criteria)
5. **Keyboard Accessible**: Make all functionality available from a keyboard
6. **Enough Time**: Provide users enough time to read and use content
7. **Seizures and Physical Reactions**: Do not design content in a way that is known to cause seizures or physical reactions
8. **Navigable**: Provide ways to help users navigate, find content, and determine where they are
9. **Input Modalities**: Make it easier for users to operate functionality through various inputs beyond keyboard

### Understandable (3 guidelines, 17 success criteria)
10. **Readable**: Make text content readable and understandable
11. **Predictable**: Make web pages appear and operate in predictable ways
12. **Input Assistance**: Help users avoid and correct mistakes

### Robust (1 guideline, 2 success criteria)
13. **Compatible**: Maximize compatibility with current and future user agents, including assistive technologies

## Conformance Levels

WCAG 2.2 defines three levels of conformance, each building on the previous level:

| Level | Description | Typical Use Case |
|:--- |:--- |:--- |
| **Level A** | Minimum conformance. Satisfies all Level A success criteria. | Basic accessibility; addresses the most critical barriers. Essential but insufficient for most legal compliance. |
| **Level AA** | Enhanced conformance. Satisfies all Level A and Level AA success criteria. | **Industry standard and legal requirement worldwide.** Required by Section 508 (US), EN 301 549 (EU), European Accessibility Act, ADA, and most national accessibility laws. |
| **Level AAA** | Maximum conformance. Satisfies all Level A, Level AA, and Level AAA success criteria. | Aspirational goal; not recommended as a general policy for entire sites due to practical limitations. Applied selectively for specialized content or audiences. |

**Note**: Conformance levels are cumulative—achieving Level AA requires meeting all Level A criteria, and Level AAA requires meeting both A and AA.

## What's New in WCAG 2.2

WCAG 2.2 introduces **9 new success criteria** that primarily address accessibility for users with cognitive disabilities, low vision, and mobile device users:

### New Level A Criteria
- **2.4.11 Focus Not Obscured (Minimum)**: When a component receives keyboard focus, it is not entirely hidden by author-created content
- **2.5.7 Dragging Movements**: All functionality that uses dragging can be achieved with a single pointer without dragging (unless essential)

### New Level AA Criteria
- **2.4.12 Focus Not Obscured (Enhanced)**: When a component receives keyboard focus, no part of the component is hidden by author-created content
- **2.5.8 Target Size (Minimum)**: Minimum target size of at least 24×24 CSS pixels for pointer inputs (with exceptions)
- **3.2.6 Consistent Help**: Help mechanisms appear in the same relative order when repeated across pages
- **3.3.7 Redundant Entry**: Information previously entered or provided is auto-populated or available for selection (with exceptions)

### New Level AAA Criteria
- **2.4.13 Focus Appearance**: Focused components have a visible focus indicator meeting specified size and contrast requirements
- **3.3.8 Accessible Authentication (Minimum)**: Cognitive function tests are not required for authentication steps (with exceptions)
- **3.3.9 Accessible Authentication (Enhanced)**: No cognitive function tests or object recognition required for authentication

### Removed Criterion
- **4.1.1 Parsing** (obsolete): Removed as modern browsers and assistive technologies handle parsing issues automatically

## Quality Attributes Required or Emphasized

WCAG 2.2 directly influences multiple quality attributes essential for accessible, usable systems:

| Quality Attribute | Relevance in WCAG 2.2 |
|:--- |:--- |
| **[Accessibility](/qualities/accessibility)** | Core focus: systematic removal of barriers preventing people with disabilities from perceiving, understanding, navigating, and interacting with web content. |
| **[Usability](/qualities/usability)** | Enhanced through predictable behavior, clear navigation, sufficient time for tasks, error prevention and recovery, and consistent interfaces. |
| **[Inclusivity](/qualities/inclusivity)** | Ensures equal access regardless of disability, age, device, or context of use; benefits diverse user populations including temporary and situational limitations. |
| **[Interaction Capability](/qualities/interaction-capability)** | Supports multiple input methods (keyboard, mouse, touch, voice), flexible timing, and alternative ways to accomplish tasks. |
| **[Perceivability](/qualities/perceivability)** | Ensures information is presentable through multiple sensory channels with alternatives: text for images, captions for audio, transcripts for video. |
| **[Operability](/qualities/operability)** | All functionality operable via keyboard and other input devices; sufficient target sizes; no timing dependencies that exclude users. |
| **[Understandability](/qualities/understandability)** | Clear, readable content; predictable behavior; input assistance; error identification and correction guidance. |
| **[Robustness](/qualities/robustness)** | Compatibility with diverse user agents and assistive technologies through valid, semantic markup and proper use of accessibility APIs. |
| **[Compliance](/qualities/compliance)** | Foundation for legal compliance with accessibility laws globally: ADA, Section 508, EN 301 549, European Accessibility Act, and national regulations. |
| **[User Experience](/qualities/user-experience)** | Improved experience for all users through clear design, predictable behavior, flexible interaction, and reduced cognitive load. |
| **[Consistency](/qualities/consistency)** | Predictable, consistent navigation, identification, and behavior across pages and interactions. |
| **[Error Prevention](/qualities/error-prevention)** | Input validation, error identification, suggestions for correction, and prevention of legal/financial errors through confirmation mechanisms. |
| **[Flexibility](/qualities/flexibility)** | Content adapts to different screen sizes, orientations, zoom levels, color schemes, and presentation modes without loss of information or functionality. |

## Implementation Support

WCAG 2.2 is supported by comprehensive technical resources published by the W3C:

### Techniques and Failures
- **Sufficient Techniques**: Proven, reliable methods for meeting success criteria (HTML, CSS, JavaScript, ARIA, PDF, etc.)
- **Advisory Techniques**: Best practices that go beyond minimum requirements and improve accessibility
- **Failures**: Common mistakes that cause accessibility barriers and lead to non-conformance

### Understanding Documents
- **Understanding WCAG 2.2**: In-depth explanation of each success criterion, intent, benefits, examples, and techniques
- **How to Meet WCAG 2.2** (Quick Reference): Customizable checklist with techniques and browser/assistive technology support information

### Testing and Evaluation
- WCAG conformance requires testing with assistive technologies (screen readers, magnification software, voice control)
- Automated testing tools detect ~30-40% of accessibility issues; manual testing and user evaluation are essential
- WCAG 2.2 success criteria are testable through automated tools, inspection, and user testing

## Global Legal Requirements

WCAG 2.2 Level AA serves as the foundation for accessibility legislation worldwide:

### United States
- **Section 508** (Rehabilitation Act): Federal agencies required to meet WCAG 2.0 Level AA (updating to 2.1)
- **Americans with Disabilities Act (ADA)**: Courts and DOJ reference WCAG 2.1 Level AA in settlements and guidance
- **21st Century Communications and Video Accessibility Act (CVAA)**: Advanced communications and video programming

### European Union
- **EN 301 549** (v3.2.1): European standard incorporating WCAG 2.1 in full; required for public sector websites and mobile apps
- **European Accessibility Act (EAA)**: Requires WCAG 2.1 Level AA compliance by June 2025 for digital products and services
- **Web Accessibility Directive**: Public sector bodies must meet EN 301 549 (WCAG 2.1 Level AA)

### Other Jurisdictions
- **Canada**: Accessibility for Ontarians with Disabilities Act (AODA) requires WCAG 2.0 Level AA
- **Australia**: Disability Discrimination Act references WCAG 2.1 Level AA
- **United Kingdom**: Equality Act 2010, Public Sector Bodies Accessibility Regulations (WCAG 2.1 Level AA)
- **Japan**: Japanese Industrial Standards (JIS X 8341-3) harmonized with WCAG 2.1

**Global Trend**: WCAG 2.1 Level AA is the de facto legal standard; jurisdictions are progressively updating to WCAG 2.2.

## Related Standards and Guidelines

- **ISO/IEC 40500:2025**: WCAG 2.2 as an ISO/IEC international standard
- **EN 301 549**: European accessibility standard (currently WCAG 2.1, expected to update to 2.2)
- **ARIA** (Accessible Rich Internet Applications): Technical specification for enhancing accessibility of web applications
- **ATAG 2.0** (Authoring Tool Accessibility Guidelines): Accessibility for content authoring tools
- **UAAG 2.0** (User Agent Accessibility Guidelines): Accessibility for browsers and media players
- [**ISO/IEC 25010**](/standards/iso-25010): Product quality model including interaction capability
- [**ISO 26514**](/standards/iso-26514): Requirements for designers and developers of user documentation

## References and Resources

### Official W3C Standards and Documentation
- [WCAG 2.2 W3C Recommendation](https://www.w3.org/TR/WCAG22/) - Official technical specification (5 October 2023, updated 12 December 2024)
- [ISO/IEC 40500:2025](https://www.iso.org/standard/91029.html) - WCAG 2.2 as ISO/IEC international standard (free access)
- [WCAG 2 Overview](https://www.w3.org/WAI/standards-guidelines/wcag/) - Introduction to WCAG versions, supporting documents, and translations
- [What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) - Summary of new and removed success criteria
- [Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/) - Detailed guidance for each guideline and success criterion
- [How to Meet WCAG 2.2 (Quick Reference)](https://www.w3.org/WAI/WCAG22/quickref/) - Customizable checklist with techniques and support information
- [Techniques for WCAG 2.2](https://www.w3.org/WAI/WCAG22/Techniques/) - Sufficient and advisory techniques, and documented failures

### Implementation and Testing Resources
- [W3C Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/) - Central resource hub for web accessibility guidance, tools, and support
- [WebAIM WCAG 2.2 Checklist](https://webaim.org/standards/wcag/checklist) - Practical checklist for designers and developers
- [Deque University WCAG 2.2 Resources](https://dequeuniversity.com/resources/wcag-2.2/) - Training materials and code examples for WCAG 2.2
- [TPGi WCAG 2.2 Resources](https://www.tpgi.com/new-success-criteria-in-wcag22/) - Analysis of new success criteria and implementation guidance

### Legal and Regulatory Information
- [Section 508 Official Site](https://www.section508.gov/) - US federal accessibility requirements and guidance
- [EN 301 549 Resources](https://www.wcag.com/compliance/en-301-549/) - European accessibility standard information and compliance guidance
- [European Accessibility Act](https://ec.europa.eu/social/main.jsp?catId=1202) - EU legislation requiring accessibility for products and services
- [ADA Accessibility Resources](https://www.ada.gov/) - Americans with Disabilities Act information and guidance

### Press Releases and Announcements
- [W3C Press Release: WCAG 2.2 Approved as ISO/IEC Standard](https://www.w3.org/press-releases/2025/wcag22-iso-pas/) - October 2025 announcement
- [WAI News: WCAG 2.2 ISO Approval](https://www.w3.org/WAI/news/2025-10-21/wcag22-iso/) - October 21, 2025

### Historical Context
- [ISO/IEC 40500:2012](https://www.iso.org/standard/58625.html) - WCAG 2.0 as ISO/IEC international standard (first edition)
- [WCAG 2.1 W3C Recommendation](https://www.w3.org/TR/WCAG21/) - Previous version (June 2018)
