# Quality Attributes Addressed by EN 301 549

This document lists quality attributes that are directly or indirectly addressed by EN 301 549 - Accessibility requirements for ICT products and services.

## Overview

EN 301 549 V3.2.1 is a European harmonized standard that extends WCAG 2.1 to cover all information and communication technology (ICT) products and services, including:
- Web content (Clause 9)
- Non-web documents (Clause 10)
- Software including mobile apps (Clause 11)
- Hardware (Clauses 5, 8)
- Telecommunications (Clause 6)
- Video capabilities (Clause 7)
- Support documentation and services (Clause 12)

Unlike WCAG 2.2, which focuses solely on web content, EN 301 549 provides a holistic accessibility framework across the entire ICT ecosystem.

## Primary Quality Attributes (Exist in Codebase)

These attributes are directly addressed by EN 301 549 and currently have quality pages in the repository:

### Core Accessibility Focus

1. **[accessibility](/qualities/accessibility)** - Fundamental focus; ensuring ICT products and services are usable by people with disabilities across all platforms and contexts

2. **[usability](/qualities/usability)** - Enhanced through predictable behavior, clear navigation, sufficient time, error prevention and recovery; universal design benefits all users

3. **[inclusivity](/qualities/inclusivity)** - Equal access regardless of disability, age, device, or context of use; extends WCAG principles to all ICT products and services

4. **[interaction-capability](/qualities/interaction-capability)** - Supporting multiple input methods (keyboard, mouse, touch, voice, switch access) from hardware controls to software interfaces

### WCAG POUR Principles (Incorporated from WCAG 2.1)

5. **[operability](/qualities/operability)** - WCAG POUR principle: All functionality operable via multiple input methods; hardware controls accessible; no timing dependencies that exclude users

6. **[understandability](/qualities/understandability)** - WCAG POUR principle: Clear, readable content; predictable behavior; input assistance across web, software, documents, and hardware

7. **[robustness](/qualities/robustness)** - WCAG POUR principle: Compatibility with diverse user agents, assistive technologies, and ICT environments through valid markup and standard APIs

### Implementation and Compliance Attributes

8. **[compliance](/qualities/compliance)** - Foundation for EU legal compliance: Web Accessibility Directive 2016/2102 (public sector), European Accessibility Act 2019/882 (private sector from June 2025)

9. **[flexibility](/qualities/flexibility)** - Content and interfaces adapt to screen sizes, orientations, zoom levels (up to 200%), color schemes, text spacing without loss of information or functionality

10. **[user-error-protection](/qualities/user-error-protection)** - Input validation, error identification, correction suggestions, confirmation mechanisms for critical actions; reversible operations

11. **[interoperability](/qualities/interoperability)** - Standard protocols and APIs enable integration with assistive technologies (screen readers, magnifiers, alternative input devices) across platforms

12. **[consistency](/qualities/consistency)** - Predictable navigation, identification, and behavior across pages, applications, and ICT products; consistent user interface components

### Secondary Attributes (From Codebase)

13. **[user-experience](/qualities/user-experience)** - Improved experience for all users through clear design, predictable behavior, flexible interaction

14. **[portability](/qualities/portability)** - Accessible design often requires platform-independent approaches that enhance portability

15. **[testability](/qualities/testability)** - Annex C provides comprehensive testing procedures; testable requirements enable verification

16. **[maintainability](/qualities/maintainability)** - Semantic, well-structured markup and proper use of platform accessibility APIs improve maintainability

17. **[learnability](/qualities/learnability)** - Predictable, consistent interfaces reduce learning curve for all users

18. **[user-assistance](/qualities/user-assistance)** - Help mechanisms, tooltips, error messages, and support services (Clause 12)

## Secondary Attributes (Not Yet in Codebase)

These attributes are addressed by EN 301 549 but don't currently have quality pages in the repository. They may be candidates for future addition:

### WCAG POUR Principles

- **perceivability** - WCAG POUR principle: Information presentable through multiple sensory channels (vision, hearing, touch)
- **distinguishability** - Sufficient contrast, focus indicators, separating foreground from background

### Interaction and Control

- **navigability** - Multiple ways to navigate and find content; clear location indicators
- **controllability** - User control over timing, motion, updates; pause, stop, hide mechanisms
- **configurability** - Adapting to user preferences, assistive technologies, platform settings
- **responsiveness** - Adaptation to screen sizes, zoom levels, orientations

### Error Handling

- **error-prevention** - Preventing user mistakes through design and validation
- **error-tolerance** - Graceful error recovery and handling
- **recoverability** - Ability to undo, reverse, or correct actions

### Content Quality

- **readability** - Clear language, readable text, understandable content
- **clarity** - Clear labels, instructions, error messages, and feedback
- **completeness** - Alternative content for non-text media (images, audio, video)

### Technical Quality

- **correctness** - Proper use of semantic markup, valid code, standard protocols
- **compatibility** - Works across browsers, devices, assistive technologies
- **visibility** - Sufficient contrast, focus indicators, distinguishable elements

## Quality Attributes by ICT Category

### Web Content (Clause 9)

Incorporates all WCAG 2.1 Level A and AA success criteria. See [wcag-attributes.md](wcag-attributes.md) for comprehensive list. Key attributes:
- accessibility, usability, inclusivity
- perceivability, operability, understandability, robustness (POUR principles)
- interaction-capability, flexibility, consistency
- error-prevention, user-error-protection

### Non-Web Documents (Clause 10)

PDF, Word, Excel, PowerPoint, ePub documents. Key attributes:
- **accessibility** - Structure, headings, alternative text, reading order
- **readability** - Font sizes, contrast, language specification
- **understandability** - Logical structure, form labels, table headers
- **operability** - Keyboard navigation through forms and interactive elements
- **flexibility** - Reflow, text spacing, zoom without horizontal scrolling

### Software (Clause 11)

Desktop applications, mobile apps, operating systems. Key attributes:
- **accessibility** - Platform accessibility APIs, screen reader support
- **usability** - Keyboard navigation, focus management, input modalities
- **interaction-capability** - Multiple input methods (keyboard, touch, voice)
- **operability** - All functionality keyboard accessible
- **robustness** - Compatibility with platform assistive technologies
- **interoperability** - Standard accessibility APIs and protocols
- **flexibility** - Adapts to platform accessibility settings

### Hardware (Clauses 5, 8)

Physical ICT products: computers, phones, ATMs, kiosks, devices. Key attributes:
- **accessibility** - Tactile controls, audio output, visual displays
- **operability** - Operable without gripping, pinching, or twisting
- **interaction-capability** - Multiple operation modes, tactile and visual differentiation
- **flexibility** - Adjustable positioning, mounting options
- **user-assistance** - Tactile indicators, audio guidance, clear labels

Physical requirements include:
- Closed functionality with accessibility features (e.g., ATM speech output)
- Biometric authentication alternatives
- Visual and tactile indicators
- Audio jack for personal listening devices
- Controls operable with one hand

### Telecommunications (Clause 6)

Voice, video, messaging, conferencing services. Key attributes:
- **accessibility** - Real-time text (RTT), captions, relay services
- **interoperability** - Standard protocols for text telephony, captioning
- **flexibility** - Multiple communication modes (voice, text, video, relay)

Requirements include:
- RTT functionality
- Voice communication alternatives
- Video communication with sign language support
- Caller ID and call waiting information
- Accessible voicemail and interactive voice response (IVR)

### Video Capabilities (Clause 7)

Media players, streaming services, broadcast. Key attributes:
- **accessibility** - Captions, audio description, sign language
- **flexibility** - User control over caption display, audio description activation
- **user-assistance** - Clear controls for accessibility features

### Support Services (Clause 12)

Help desks, technical support, training materials. Key attributes:
- **accessibility** - Accessible communication channels (phone, email, chat, video relay)
- **user-assistance** - Support for assistive technology users
- **understandability** - Clear documentation, training materials

## Comparison with WCAG 2.2

### Scope Differences

| Aspect | WCAG 2.2 | EN 301 549 V3.2.1 |
|:---|:---|:---|
| **WCAG Version** | 2.2 (October 2023) | 2.1 (June 2018) - incorporated in full |
| **Web Content** | 86 success criteria | WCAG 2.1 (78 success criteria) |
| **Non-Web Scope** | None (web content only) | Documents, software, hardware, telecom |
| **Future Updates** | Ongoing (2.3+ planned) | V4.1.1 (2026) will incorporate WCAG 2.2 |

### WCAG 2.2 Criteria NOT in EN 301 549 V3.2.1

EN 301 549 V3.2.1 does not include these 9 WCAG 2.2 success criteria (added after WCAG 2.1):

**Level A:**
- 2.4.11 Focus Not Obscured (Minimum)
- 2.5.7 Dragging Movements

**Level AA:**
- 2.4.12 Focus Not Obscured (Enhanced)
- 2.5.8 Target Size (Minimum) - 24×24 CSS pixels
- 3.2.6 Consistent Help
- 3.3.7 Redundant Entry

**Level AAA:**
- 2.4.13 Focus Appearance
- 3.3.8 Accessible Authentication (Minimum)
- 3.3.9 Accessible Authentication (Enhanced)

Organizations implementing EN 301 549 may choose to proactively adopt WCAG 2.2 criteria to future-proof their accessibility efforts.

### EN 301 549 Extensions Beyond WCAG

EN 301 549 includes requirements not in WCAG:
- Hardware physical accessibility (tactile controls, audio jacks)
- Telecommunications (RTT, relay services, caller ID)
- Closed functionality (kiosks, ATMs with speech output)
- Platform accessibility services and APIs
- Assistive technology interoperability requirements
- Support services accessibility

## Mapping to Functional Performance Statements (Clause 4)

EN 301 549 Clause 4 describes functional performance from a user perspective. All technical requirements (Clauses 5-13) map to these user needs:

### Usage Without Vision (4.2.1)
**Related Quality Attributes:**
- accessibility, perceivability (screen reader compatibility)
- robustness (assistive technology APIs)
- interoperability (text-to-speech, braille displays)

### Usage With Limited Vision (4.2.2)
**Related Quality Attributes:**
- accessibility, perceivability (magnification, contrast)
- flexibility (zoom, text spacing, color schemes)
- readability (sufficient contrast, large text)

### Usage Without Perception of Color (4.2.3)
**Related Quality Attributes:**
- accessibility, perceivability (color independence)
- clarity (information not conveyed by color alone)

### Usage Without Hearing (4.2.4)
**Related Quality Attributes:**
- accessibility, perceivability (captions, transcripts)
- completeness (visual alternatives for audio)

### Usage With Limited Hearing (4.2.5)
**Related Quality Attributes:**
- accessibility (volume control, hearing aid compatibility)
- flexibility (adjustable audio)

### Usage Without Vocal Capability (4.2.6)
**Related Quality Attributes:**
- accessibility, operability (non-voice alternatives)
- interaction-capability (text input, gesture, switch access)

### Usage With Limited Manipulation/Strength (4.2.7)
**Related Quality Attributes:**
- accessibility, operability (keyboard, single-pointer alternatives)
- interaction-capability (no complex gestures, gripping, twisting)
- flexibility (alternative interaction methods)

### Usage With Limited Reach (4.2.8)
**Related Quality Attributes:**
- accessibility, operability (all elements within reach)
- flexibility (adjustable positioning)

### Minimize Photosensitive Seizure Triggers (4.2.9)
**Related Quality Attributes:**
- accessibility, safety (no flashing content > 3 Hz)
- user-error-protection (warning mechanisms)

### Usage With Limited Cognition (4.2.10)
**Related Quality Attributes:**
- accessibility, understandability (clear language, simple)
- usability, learnability (consistent, predictable)
- user-assistance (help mechanisms, error suggestions)

### Privacy (4.2.11)
**Related Quality Attributes:**
- privacy (private access to personal information)
- confidentiality (screen reader privacy mode)

## Implementation Priority for EN 301 549

When implementing EN 301 549 across ICT products and services, prioritize quality attributes as follows:

### Phase 1 - Critical Compliance (Legal Requirement)

**Web Accessibility Directive (Public Sector) / European Accessibility Act (June 2025):**
1. **Accessibility** (core) - All ICT products and services
2. **Compliance** - Legal conformance required
3. **Operability** - Keyboard accessibility, no timing barriers
4. **Perceivability** - Text alternatives, captions, contrast
5. **Understandability** - Clear language, predictable behavior

### Phase 2 - ICT-Specific Requirements

**Documents (Clause 10):**
6. **Readability** - Structure, headings, reading order
7. **Flexibility** - Reflow, text spacing, zoom

**Software (Clause 11):**
8. **Interoperability** - Platform accessibility APIs
9. **Robustness** - Assistive technology compatibility

**Hardware (Clauses 5, 8):**
10. **Interaction-capability** - Tactile controls, multiple input modes
11. **User-assistance** - Audio and tactile indicators

### Phase 3 - Enhanced User Experience

12. **Usability** - Universal design benefiting all users
13. **Inclusivity** - Maximum user reach
14. **User Experience** - Clear design, predictable behavior
15. **Consistency** - Across all ICT products and services
16. **User Error Protection** - Error prevention and recovery

## Authoritative Sources for EN 301 549

### Official Standard
- **ETSI EN 301 549 V3.2.1 (March 2021)** - [PDF Download](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf)
- **ETSI Official Page** - https://www.etsi.org/human-factors-accessibility/en-301-549-v3-the-harmonized-european-standard-for-ict-accessibility
- **Harmonization Decision** - Commission Implementing Decision (EU) 2021/1339 (18 August 2021)

### EU Legislation
- **Web Accessibility Directive (EU) 2016/2102** - https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016L2102
- **European Accessibility Act (EU) 2019/882** - https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882

### Implementation Guidance
- **Canada Digital Accessibility Toolkit** - https://a11y.canada.ca/en/technical-summary-of-the-en-301-549-v321-2021/
- **TPGi Understanding EN 301 549** - https://www.tpgi.com/understanding-en-301-549-the-european-standard-for-digital-accessibility/
- **WCAG2ICT** - https://www.w3.org/TR/wcag2ict-22/ (applying WCAG to non-web ICT)

### Related Standards
- **WCAG 2.1** - https://www.w3.org/TR/WCAG21/
- **WCAG 2.2** - https://www.w3.org/TR/WCAG22/ (will be incorporated in EN 301 549 V4.1.1)
- **ISO/IEC 25010** - Software product quality model
