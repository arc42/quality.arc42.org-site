---
title: Compliance with WCAG accessibility guidelines
tags: [usable]
related: [accessibility, user-experience, user-assistance, interaction-capability]
permalink: /requirements/compliance-to-wcag
---

<div class="quality-requirement" markdown="1">

#### Context
The web application must comply with WCAG 2.1 Level AA standards to ensure accessibility for users with disabilities navigating with screen readers in standard web browsers.

#### Trigger
A person with visual impairment using a screen reader attempts to navigate and interact with the web application.

#### Acceptance Criteria

- **Navigation**: At least 95% of all interactive elements (links, buttons, form fields) are navigable and identifiable using the screen reader
- **Content**: At least 98% of all content (text, images with alt attributes, videos with captions) is accessible and consumable using the screen reader
- **Interactivity**: Users can interact with 95% of functionality (e.g., submitting forms) without encountering accessibility barriers
- **Feedback**: All messages, errors, and notifications are clearly announced to the screen reader with 99% accuracy
- **Load time**: Page load times do not exceed 3 seconds for 90% of page loads despite accessibility enhancements
- **Compliance**: Application meets [WCAG 2.1](https://www.w3.org/TR/WCAG21/) Level AA criteria with:
  - Zero non-compliance issues in automated testing
  - No more than 2 issues per page in manual testing

</div><br>


Source: This scenario has been created with help from [ChatGPT](https://chat.openai.com) by using the prompt `Please generate a quality attribute scenario for accessibility compliance with WCAG 2.1 with precise metrics`.

