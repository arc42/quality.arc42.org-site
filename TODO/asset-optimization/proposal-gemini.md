# Asset Optimization Proposal: CSS, SCSS & JS
**Author:** Gemini CLI
**Date:** 2026-04-25
**Objective:** Eliminate redundancies, unify parallel styling systems, and improve JavaScript modularity for better performance and maintainability.

---

## 1. Styling Architecture (CSS/SCSS)

### Current State & Issues
- **The "Double System" Problem:** The site currently runs a legacy system (`assets/css/arc42-doc.css`, `assets/css/arc42-quality.css`) alongside a modern SCSS system (`_sass/`). This results in conflicting `:root` variables and redundant style declarations.
- **Variable Fragmentation:** Colors and tokens are defined in both `:root` (CSS) and Sass variables, making brand updates error-prone.
- **Unused Assets:** `_sass/_splash-home.scss` has no active references in the project markup.
- **Specificity Bloat:** Heavy use of `!important` in legacy files to override theme defaults.

### Proposed Actions (Phase 1: Styles)
1.  **Decommission Legacy CSS:** 
    *   Migrate all necessary styles from `arc42-doc.css` and `arc42-quality.css` into modular SCSS components (e.g., `_sass/components/_badges.scss`).
    *   Delete the legacy `.css` files and the unused `_splash-home.scss`.
2.  **Unified Token System:** 
    *   Consolidate all theme tokens into `_sass/base/_variables.scss`.
    *   Use Sass to generate the `:root` variables to ensure a single source of truth.
3.  **Componentization:**
    *   Extract recurring patterns like `.panel`, `.tag-box`, and `.also-known-as` into dedicated component files.
    *   Implement a "Violet-First" structural hierarchy, moving residual blue/teal markers to a "Data-Only" role.

---

## 2. JavaScript Modularity

### Current State & Issues
- **Logic Duplication:** `assets/js/full-graph-page.js` and `assets/js/mobile-graph-page.js` share ~70% of their logic (filters, toggles, centering).
- **Split Workflow:** The project uses both static scripts (`assets/js/*.js`) and bundled ES modules (`src/graphs/*.js`), creating inconsistent development and debugging experiences.
- **Utility Scatter:** Basic site utilities (external link handling, image centering) are bundled into a monolithic `script.js`.

### Proposed Actions (Phase 2: Logic)
1.  **Shared Graph Controller:**
    *   Create `src/graphs/GraphControls.js` as a shared ES module.
    *   Move logic from `full-graph-page.js` and `mobile-graph-page.js` into this module.
2.  **Unified Build Pipeline:**
    *   Migrate all non-library scripts (like `search.js` and `header-link.js`) into the `src/scripts/` directory.
    *   Allow `esbuild` to bundle and minify these files, ensuring consistent performance optimizations across the site.
3.  **Modernize Utilities:**
    *   Refactor `script.js` into a set of functional utilities in `src/scripts/utils/`.
    *   Replace jQuery-dependent logic with modern vanilla JS where possible to reduce dependencies.

---

## 3. Expected Outcomes

| Metric | Impact |
| :--- | :--- |
| **Maintainability** | High — One place to change a brand color; one place to fix a graph filter bug. |
| **Performance** | Medium — Reduced CSS/JS payload size due to removal of dead code and better minification. |
| **Visual Consistency** | High — Elimination of "accidental" blue/teal residuals from the legacy system. |
| **Developer Experience** | High — A single, modern workflow using SCSS and ES modules. |

---

## Next Steps
1.  **Audit Approvals:** Confirm which legacy styles (e.g., `.innoq-text`) are still required.
2.  **Execution:** I recommend starting with **Phase 1 (Style Consolidation)** as it provides the highest immediate visual and architectural payoff.
