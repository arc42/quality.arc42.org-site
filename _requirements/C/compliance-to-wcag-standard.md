---
title: Compliance with WCAG accessibility guidelines
tags: [usable]
related: accessibility, user-experience, user-assistance, interaction-capability
permalink: /requirements/compliance-to-wcag
---

<div class="quality-requirement" markdown="1">

#### Source
A person with a visual impairment using a screen reader.

#### Stimulus
The user wants to navigate and interact with a web application.

#### Artifact
Web application

#### Environment
The user accesses the web application in a standard web browser, using the latest version of a popular screen reader.

#### Response Measure

**Navigation**: At least 95% of all interactive elements (e.g., links, buttons, form fields) should be navigable and identifiable using the screen reader.

**Content**: At least 98% of all content, including text, images (with alt attributes), videos (with captions), etc., should be accessible and consumable using the screen reader.

**Interactivity**: Users should be able to interact with 95% of web application's functionality, such as submitting forms, without encountering any accessibility barriers.

**Feedback**: All messages, errors, and notifications should be clearly announced to the screen reader with 99% accuracy.
    
**Load time**: Despite any accessibility enhancements, page load times should not exceed 3 seconds for 90% of page loads, ensuring that the accessibility features don't negatively impact performance.

**Compliance**: The application should meet [WCAG 2.1](https://www.w3.org/TR/WCAG21/) Level AA standard criteria. 
Automated testing tools should report zero non-compliance issues, and manual testing should identify no more than 2 issues per page.

</div><br>


Source: This scenario has been created with help from [ChatGPT](https://chat.openai.com) by using the prompt `Please generate a quality attribute scenario for accessibility compliance with WCAG 2.1 with precise metrics`.

