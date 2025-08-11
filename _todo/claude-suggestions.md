# Layout Modularization Improvement Plan

Based on the analysis of `go-for-improved-layout-modularization.md` and the current layout structure, here is a comprehensive plan to improve separation of concerns and reduce complexity.

## Current Problems Identified

- [ ] **Complex conditional logic in `article-header.html`:**
  - The `{% if page.collection == 'qualities' or page.name contains 'tag-' or page.name == '22-properties.md' %} quality-header{% elsif page.collection == 'requirements' %} requirements-header{% elsif page.collection == 'standards' %} standards-header{% endif %}` clause is difficult to understand and maintain
  
- [ ] **Unused code:**
  - The `{% if site.author %}` block will never execute since `site.author` is never set
  
- [ ] **Poor separation of concerns:**
  - One header file trying to handle three different collection types with conditional logic

## Proposed Solution

### Phase 1: Create Dedicated Header Files
- [ ] **Create `_includes/quality-header.html`:**
  - Copy base structure from `article-header.html`
  - Use `quality-header` CSS class directly (no conditional logic)
  - Remove unused `site.author` block
  - Handle special cases for `tag-*` pages and `22-properties.md`

- [ ] **Create `_includes/standard-header.html`:**
  - Copy base structure from `article-header.html`
  - Use `standards-header` CSS class directly
  - Remove unused `site.author` block

- [ ] **Update existing `_includes/requirements-header.html`:**
  - Ensure it follows the same clean pattern
  - Remove any unused `site.author` blocks if present
  - Use `requirements-header` CSS class consistently

### Phase 2: Update Layout Files
- [ ] **Update `_layouts/qualities.html`:**
  - Change `{% include article-header.html %}` to `{% include quality-header.html %}`
  
- [ ] **Update `_layouts/standards.html`:**
  - Change `{% include article-header.html %}` to `{% include standard-header.html %}`
  
- [ ] **Verify `_layouts/requirements.html`:**
  - Ensure it's already using `requirements-header.html` correctly

### Phase 3: Handle Special Cases
- [ ] **Address tag pages and properties page:**
  - Verify that `tag-*` pages and `22-properties.md` still get the correct `quality-header` styling
  - May need to update page layouts or add specific handling

### Phase 4: Cleanup
- [ ] **Remove obsolete file:**
  - Delete `_includes/article-header.html` after confirming all references are updated

## Expected Benefits

### Improved Maintainability
- Each collection type has its own dedicated header file
- Changes to one collection's header won't affect others
- Easier to understand and modify individual headers

### Reduced Complexity
- Eliminates the complex conditional logic in the header
- Each header file is simpler and more focused
- Removes unused code paths

### Better Separation of Concerns
- Quality headers handle only quality-related styling and logic
- Requirements headers handle only requirement-related styling and logic
- Standards headers handle only standard-related styling and logic

### Easier Testing and Debugging
- Issues with headers can be isolated to specific collection types
- Simpler logic makes it easier to trace problems

## Risk Assessment

### Low Risk
- This is primarily a refactoring that maintains existing functionality
- The conditional logic is being replaced with direct includes
- CSS classes remain the same

### Potential Issues to Watch
- [ ] Ensure special cases (`tag-*` pages, `22-properties.md`) continue to work
- [ ] Verify all three layout files are updated correctly
- [ ] Test that CSS styling remains consistent across all collection types

## Testing Checklist

After implementation:
- [ ] Test a quality page renders correctly
- [ ] Test a requirement page renders correctly  
- [ ] Test a standard page renders correctly
- [ ] Test tag pages still work (`tag-efficient.md`, etc.)
- [ ] Test the properties page (`22-properties.md`) still works
- [ ] Verify CSS classes are applied correctly
- [ ] Check that no broken includes exist