# Final Gemini Proposal: Layout Refactoring

This document presents a consolidated and safe plan for refactoring the Jekyll layouts. It incorporates the best ideas from the `gemini-suggestions.md` and `claude-suggestions.md` files while addressing the critical constraint that **`article-header.html` must not be deleted**, as it is used by generic layouts like `page.html`, `post.html`, and `search.html`.

## Consolidated Plan

### 1. Create and Specialize New Header Includes

The primary goal is to isolate the logic for each collection into its own file.

- **[ ] Create `_includes/quality-header.html`:**
    - Copy the full content from the existing `_includes/article-header.html`.
    - **Specialize it:** Replace the complex conditional `<div class="panel{% if ...%}">` with a simple, static `<div class="panel quality-header">`.
    - **Cleanup:** Remove the unused `{% if site.author %}` block.

- **[ ] Create `_includes/standard-header.html`:**
    - Follow the same process as above, but use the static class `<div class="panel standards-header">`.
    - Remove the `{% if site.author %}` block.

- **[ ] Update `_includes/requirements-header.html`:**
    - Ensure it uses a static `<div class="panel requirements-header">`.
    - Remove the unused `{% if site.author %}` block to maintain consistency.

### 2. Update Collection Layouts to Use New Headers

- **[ ] Modify `_layouts/qualities.html`:**
    - Change `{% include article-header.html ... %}` to `{% include quality-header.html ... %}`.

- **[ ] Modify `_layouts/standards.html`:**
    - Change `{% include article-header.html ... %}` to `{% include standard-header.html ... %}`.

### 3. Refactor the Generic `article-header.html` (Crucial Step)

Instead of deleting the file, we will simplify it to serve as a safe default for all other pages.

- **[ ] Do NOT delete `_includes/article-header.html`**.
- **[ ] Simplify the logic:** Remove the `if/elsif` conditions for the `qualities`, `requirements`, and `standards` collections. The remaining logic will serve as the generic header.
- **[ ] Cleanup:** Remove the `{% if site.author %}` block from this file as well.

## Disadvantages & Mitigation

- **Disadvantage: Code Duplication.**
  - This plan will result in four separate header files (`article-header.html`, `quality-header.html`, etc.) with very similar structures.
  - **Mitigation:** This is a conscious design trade-off. The minor duplication is acceptable in exchange for a significant improvement in clarity, safety, and separation of concerns. The purpose of each file becomes explicit and easy to understand.

- **Disadvantage: Risk of Incomplete Refactoring.**
  - If a collection layout is not updated, it will fall back to the now-generic `article-header.html` and may lose its specific header color/styling.
  - **Mitigation:** This is a low-risk issue that can be easily verified by checking one page from each of the three collections (`qualities`, `requirements`, `standards`) after the changes are implemented.

This revised plan achieves the primary goal of modularizing the complex headers without introducing the breaking change of deleting a widely-used file. It is the safest and most maintainable path forward.
