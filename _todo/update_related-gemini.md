# Plan to Unify Related-Attributes Syntax

This plan outlines the steps to refactor the `related` attribute in the front matter of markdown files from a space-separated string to a standard YAML list.

## 1. Scope

- **Files to Modify**: All markdown files within the `_qualities/` and `_requirements/` directories.
- **Files to Analyze**: All HTML files within the `_includes/` and `_layouts/` directories, and all JavaScript files in `src/scripts/` to check for `related` attribute usage.

## 2. Phase 1: Refactor Markdown Files

1.  **Identify Files**: Get a complete list of all `_qualities/**/*.md` and `_requirements/**/*.md` files.
2.  **Update `related` attribute**: For each file:
    a. Read the file's content.
    b. In the YAML front matter, find the `related:` attribute.
    c. If the value is a string of space-separated items, convert it into a YAML list (e.g., `[item1, item2]`).
    d. Write the modified content back to the file.

## 3. Phase 2: Analyze and Adapt Liquid Templates and JavaScript

1.  **Identify Usage**: Search through all `_includes/**/*.html`, `_layouts/**/*.html`, and `src/scripts/**/*.js` files for occurrences of `page.related`, `post.related`, `data.related` or any other variables where the `related` attribute is accessed.
2.  **Analyze Syntax**: Review how the `related` attribute is being used in the Liquid templates and JavaScript files.
    - If they are being iterated over (e.g., `{% for item in page.related %}` or `data.related.forEach(...)`), the existing code will likely work without changes.
    - If it is being treated as a string (e.g., `{{ page.related }}` or `data.related.split(' ')`), the code will break and require modification.
3.  **Update Templates and Scripts**: Modify any files identified in the analysis to ensure they correctly handle the new array format for the `related` attribute.

## 4. Verification

After all files have been updated, the Jekyll site should be rebuilt to verify that everything related to this attribute is displayed and functioning as expected across the entire site. As I cannot build the site myself, this step will need to be performed by you.
