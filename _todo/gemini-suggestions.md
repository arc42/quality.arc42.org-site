# Proposed Layout Refactoring

Here is a checklist of proposed changes to improve the modularity and maintainability of the Jekyll layouts.

## Proposed Changes

- [ ] **Create new, specific header files:**
    - [ ] Create `_includes/quality-header.html`.
    - [ ] Create `_includes/standard-header.html`.
    - [ ] Modify the existing `_includes/requirements-header.html`.
    - *Details:* These files will contain the header markup specific to each content type, removing the need for conditional logic inside a single file.

- [ ] **Simplify header content:**
    - [ ] Remove the complex `{% if page.collection ... %}` liquid logic from the original header file. Each new header will have its specific CSS class (e.g., `quality-header`) applied directly.
    - [ ] Remove the `{% if site.author %}` block from all headers, as it is unnecessary.

- [ ] **Update layout files to use new headers:**
    - [ ] In `_layouts/qualities.html`, replace `{% include article-header.html ... %}` with `{% include quality-header.html ... %}`.
    - [ ] In `_layouts/standards.html`, replace `{% include article-header.html ... %}` with `{% include standard-header.html ... %}`.
    - [ ] In `_layouts/requirements.html`, ensure it consistently uses its dedicated `requirements-header.html`.

- [ ] **Cleanup:**
    - [ ] Delete the now-obsolete `_includes/article-header.html` file after its logic has been moved to the new, specific headers.

## Expected Improvements

*   **Better Separation of Concerns:** Each collection (`qualities`, `requirements`, `standards`) will have its own dedicated header include, making the structure more logical and easier to follow.
*   **Reduced Complexity:** Eliminates the confusing `if/elsif` block from the header, making the code cleaner and more readable.
*   **Increased Maintainability:** Changes to the header of one collection will be isolated and won't risk affecting the others.
*   **Cleaner Codebase:** Removing the unused `site.author` logic and the redundant `article-header.html` file contributes to a tidier project.
