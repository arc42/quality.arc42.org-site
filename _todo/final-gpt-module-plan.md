# Final GPT Module Plan: Safe, Complete Header Modularization

This plan refactors header includes and layouts to remove complex conditionals, keep a safe generic default, and preserve expected styling on tag pages, the properties page, and search results.

## Objectives
- Dedicated headers per collection (qualities, requirements, standards).
- Generic fallback header for all other pages (retain article-header.html, simplified).
- Preserve styling for tag-* pages and 22-properties.md.
- Make search results reflect the correct header styling for each collection.
- Eliminate unused author logic across headers.
- Standardize standards header include naming (use standards-header.html consistently).

## Changes

1) Create/keep dedicated headers
- Keep existing dedicated includes:
  - _includes/quality-header.html (already exists)
  - _includes/requirements-header.html (already exists)
  - _includes/standards-header.html (canonical for standards; do not use standard-header.html)
- Remove author blocks from standards header for consistency with other dedicated headers.

2) Simplify generic header (article-header.html)
- Keep the file as a generic fallback used by page, post, and other generic contexts.
- Replace the complex conditional header class with a static class (e.g., "panel"), removing collection logic.
- Remove the author block (unused).

3) Update collection layouts to use dedicated headers
- _layouts/qualities.html -> include quality-header.html
- _layouts/standards.html -> include standards-header.html
- _layouts/requirements.html already includes requirements-header.html (no change)

4) Preserve styling for special pages currently relying on article-header conditional
- Update _layouts/page.html to choose header:
  - If page.collection == 'qualities' OR page.name contains 'tag-' OR page.name == '22-properties.md' -> include quality-header.html
  - Else -> include article-header.html (generic)
- Leave _layouts/post.html using article-header.html (generic) unless posts become collection-specific later.

5) Improve search results presentation
- Update _pages/search.html to select headers per collection:
  - If post.collection == 'requirements' -> search-req-header.html (already in place)
  - Else if post.collection == 'qualities' -> quality-header.html
  - Else if post.collection == 'standards' -> standards-header.html
  - Else -> article-header.html

6) Standards include naming consistency
- Use _includes/standards-header.html consistently in all layouts.
- Keep _includes/standard-header.html for now (no references) or remove later in a separate cleanup commit.

## Testing Checklist
- Qualities page renders with quality-header (e.g., /qualities/availability/)
- Requirements page renders with requirements-header (e.g., any requirement)
- Standards page renders with standards-header (e.g., /standards/iso-25010/)
- Tag pages (e.g., /tag-efficient/) use quality-header styling
- 22-properties page uses quality-header styling
- Generic pages (home, about, references) still render with generic article-header
- Search results show appropriate headers across collections; no broken includes
- No occurrences of site.author in headers remain

## Rollback Plan
- If any page loses styling, revert to previous commit and re-apply changes incrementally: generic header simplification last, after conditional routing in layouts is verified.

## Notes
- Do not delete article-header.html.
- Avoid editing generated assets; only Liquid/HTML includes and layouts.
- Keep a later cleanup task for removing unused _includes/standard-header.html when confident it’s unused.
