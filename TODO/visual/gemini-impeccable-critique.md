# Design Critique: arc42 Quality Model Site
**Date:** April 2026
**Tool:** Gemini Impeccable Critique

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Functional but static. |
| 2 | Match System / Real World | 4 | Clear terminology (Qualities, Requirements). |
| 3 | User Control and Freedom | 3 | Simple nav; lacks breadcrumbs. |
| 4 | Consistency and Standards | 3 | Consistent color coding; inconsistent UI patterns. |
| 5 | Error Prevention | 3 | Minimal interaction risk. |
| 6 | Recognition Rather Than Recall | 3 | Sidebar is helpful but dense. |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts or advanced filtering. |
| 8 | Aesthetic and Minimalist Design | 2 | Side-tab clutter and bland typography. |
| 9 | Error Recovery | N/A | Static site. |
| 10 | Help and Documentation | 4 | Excellent "how-to" and references. |
| **Total** | | **27/40** | **Fair** |

## Anti-Patterns Verdict

**LLM Assessment**: The site feels like a well-structured repository that has been "modernized" using safe but dated defaults. While it avoids the worst "glowing neon" AI tropes, it suffers from **aesthetic sameness**—relying on generic fonts and repetitive decorative elements that feel like a template rather than a deliberate brand.

**Deterministic Scan**: Found **7 violations**, primarily the "Side-tab accent border" pattern across multiple scss files (`_aliases.scss`, `_content.scss`, `_standards.scss`). This thick left border is the single most recognizable "AI design tell" and appears on synonym cards, callouts, and standards headers.

## Overall Impression
The site is highly functional and the color-coded categorization is a major strength. However, the visual language is stuck between "safe utility" (bland typography) and "templated decoration" (thick side-borders). It lacks the authoritative personality that arc42 deserves.

## What's Working
1.  **Color-Coded Semantic Groups**: Using blue, pink, and yellow to distinguish Qualities, Requirements, and Standards is highly effective for orientation.
2.  **Logical Information Architecture**: The collection-based structure perfectly matches the architectural mental model.

## Priority Issues

*   **[P1] Side-tab Overuse**: The `border-left: 4px solid` pattern is used for almost every callout and card. It creates visual noise and feels like an "AI-generated" design touch.
    *   **Fix**: Remove these thick stripes. Use background tints or full thin borders with 12px+ radius to define containers.
    *   **Suggested command**: `/polish`
*   **[P2] Generic Typography**: Using Helvetica/Arial for an architectural reference site feels like a missed opportunity. It's readable but lacks "gravitas."
    *   **Fix**: Introduce a distinctive display font (e.g., a modern grotesque or a refined serif) and pair it with a highly legible body face.
    *   **Suggested command**: `/typeset`
*   **[P2] Header Density**: The site header contains two lines of text with four different counts. It's informative but visually busy for a primary identity area.
    *   **Fix**: Move statistics to the footer or a dedicated "About" section. Simplify the header to focus on the title and primary navigation.
    *   **Suggested command**: `/layout`
*   **[P3] Container Fatigue**: Many pages (especially Standards) have boxes inside boxes.
    *   **Fix**: Flatten the visual hierarchy by removing some borders and using whitespace to create groups.
    *   **Suggested command**: `/distill`

## Persona Red Flags

**Alex (Power User)**: Searching for specific attributes is slower than it needs to be. The lack of keyboard shortcuts and the long, non-hierarchical sidebar list makes frequent navigation a "hunt and peck" experience.

**Jordan (First-Timer)**: Arrives at a page with dense header stats and a thick-bordered "Also known as" box. The visual weight of the *meta-information* (synonyms, counts) competes with the *actual content* (definitions).

---

## Recommended Actions

1.  **`/polish`**: Remove the thick left borders (`border-left: 4px`) from synonym cards, callouts, and headers to eliminate "AI slop" tells.
2.  **`/typeset`**: Move away from Helvetica/Arial. Select a font pair that feels authoritative, technical, and modern.
3.  **`/layout`**: Simplify the site header to reduce cognitive load and improve visual hierarchy.
4.  **`/distill`**: Review the Standards pages to reduce container nesting and simplify the visual structure.
