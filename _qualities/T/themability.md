---
title: Themability
tags: [flexible, maintainable]
related: [modifiability, configurability, customizability, personalization, user-interface-aesthetics, accessibility]
permalink: /qualities/themability
---

Ability of a system to support different visual themes (colors, typography, spacing, icon styles, contrast modes) with low effort and low risk.

Typical examples:

* <a id="vscode"></a>**Visual Studio Code** supports many installable and switchable themes.
* **Terminal emulators** (for example iTerm2, Windows Terminal, Alacritty, kitty) support theme profiles and color schemes.

For many systems, theme changes should work at runtime (without restart).  
For others, install/startup-time theme selection is sufficient.

Theming also has a maintainability angle: Teams should be able to add, evolve, or fix themes without touching business logic.

<hr class="with-no-margin"/>

### Definitions and References

> Themability allows for stylistic changes to a design system, often through design tokens or stylesheet variables. It enables a single codebase to support multiple brands or variations, where components share the same structure but can have different visual styles.
>
> from [Brad Frost: The Many Faces of Themeable Design Systems](/references/#brad-frost-theming)

<hr class="with-no-margin"/>

> Theming refers to the ability of software to change its aesthetic appearance or "look and feel" through the application of pre-designed packages called themes or skins. These themes typically comprise a set of graphical elements such as colors, fonts, icons, and window decorations.
>
> from [Wikipedia: Theming](/references/#wikipedia-theming)

<hr class="with-no-margin"/>

> Design tokens are the fundamental building blocks of a themeable design system. They are small, system-wide variables that store design details (like color hex codes or pixel sizes) in an easy-to-read way. Design tokens can be linked to create a theme and ensure consistency across platforms.
>
> from [W3C Design Tokens Community Group](/references/#w3c-design-tokens)
