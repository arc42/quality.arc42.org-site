# Proposal: Restructuring the "About" Page for Better Separation of Concerns

## Current Issues with 80-about-this-site.md

The current "About" page mixes several distinct types of information:

- Author biography and personal details
- Sponsor information (INNOQ)
- Technical site information (tooling, build stats)
- Data quality reports (orphan qualities, qualities without requirements)
- Acknowledgements and contributors
- Analytics dashboard

This creates a monolithic page that serves multiple audiences and purposes, making it harder to maintain and navigate.

## Proposed Restructuring

### 1. Split into Multiple Focused Pages

#### A. Create `/aboutauthor/` (new page: `82-about-author.md`)

**Purpose**: Personal information about Gernot Starke
**Content**:

- Author biography and photo
- Professional background
- Publications and books
- Speaking engagements

#### B. Rename current page to `/technical/` (`80-technical-info.md`)

**Purpose**: Technical details about the site
**Content**:

- Tooling (Jekyll, theme, deployment)
- Build statistics and revision info
- GitHub repository links
- Local development setup

#### C. Create `/contributors/` (new page: `84-contributors.md`)

**Purpose**: Recognition and acknowledgements
**Content**:

- Acknowledgements section
- List of contributors with GitHub links
- Link to GitHub contributors page

#### D. Create `/sitestats/` (new page: `86-site-stats.md`)

**Purpose**: Data insights and quality metrics
**Content**:

- Orphan qualities analysis
- Qualities without requirements
- Analytics dashboard
- Site statistics

#### E. Create `/sponsors/` (new page: `88-sponsors.md`)

**Purpose**: Sponsor and support information
**Content**:

- INNOQ sponsorship details
- Ukraine support message
- Other acknowledgements

### 2. Navigation Options for Single-Level Navbar

Since you have only 1-level navigation, here are several approaches:

#### Option A: Tab/Card Navigation on About Page

- Keep "About" as single navbar item
- Create tabbed interface or card grid on the about page
- Each tab/card leads to separate pages
- Example: Bootstrap tabs or simple CSS grid of cards

#### Option B: Sidebar Navigation

- Main "About" page with sidebar menu
- Sidebar shows: Author | Technical | Contributors | Stats | Sponsors
- Content loads in main area (could be separate pages or sections)

#### Option C: In-Page Sections with Jump Links

- Single long page with clear sections
- Add "table of contents" at top with anchor links
- Use includes for maintainability: `{% include about-author.html %}`
- Smooth scrolling between sections

#### Option D: Footer Links

- Keep main "About" in navbar
- Add secondary about-related links in footer
- "More About: Author | Technical | Contributors | Stats"

#### Cross-linking Strategy

- Add "About Navigation" component at top of each about-related page
- Breadcrumb-style: About > Author (you are here)
- Previous/Next navigation between related pages

### 3. Create a New Landing "About" Page (`80-about.md`)

A concise overview page that:

- Provides brief introduction to the site
- Links to all sub-pages with clear descriptions
- Maintains the Ukraine support message prominently
- Shows key stats/highlights

### 4. Benefits of This Restructuring

#### Better User Experience

- Users can find specific information faster
- Reduced cognitive load per page
- Clear information architecture

#### Improved Maintainability

- Each page has a single responsibility
- Easier to update specific sections
- Modular content management

#### Better SEO

- Focused page titles and descriptions
- More specific meta tags per page
- Improved internal linking structure

#### Enhanced Analytics

- Track user interest in different aspects
- Better understanding of which information is most valuable
- Separate analytics for technical vs. personal content

### 5. Implementation Strategy

1. **Phase 1**: Create the new modular pages
2. **Phase 2**: Update internal links across the site
3. **Phase 3**: Create the new overview "About" page
4. **Phase 4**: Add navigation elements and cross-links
5. **Phase 5**: Update external links and bookmarks

### 6. Alternative: Include-based Approach

If you prefer to maintain a single URL but still achieve separation:

- Keep `80-about-this-site.md` as the main page
- Create include files: `_includes/about-author.html`, `_includes/site-technical.html`, etc.
- Use Jekyll includes to compose the main page
- This maintains the single-page experience while achieving code modularity

## Recommendations

### For Single-Level Navigation: **Option C + Includes**

Given your constraint, I recommend:

1. **Keep single "About" navbar item**
2. **Use in-page sections with anchor links** for navigation
3. **Implement with Jekyll includes** for maintainability
4. **Add table of contents** at top of page

This gives you:

- ✅ Clean separation of concerns (via includes)
- ✅ Easy maintenance (modular includes)
- ✅ Single URL (no navigation complexity)
- ✅ Bookmarkable sections (anchor links)
- ✅ Mobile-friendly (no complex navigation)

### Implementation Structure:

```
_pages/80-about-this-site.md (main page with TOC and includes)
_includes/about/
  ├── author.html
  ├── technical.html
  ├── contributors.html
  ├── stats.html
  └── sponsors.html
```

### Alternative: **Option A (Cards)**

If you want separate pages but easy navigation:

- About page becomes a "dashboard" with cards
- Each card links to dedicated page
- Add "Back to About" buttons on sub-pages

Would you like me to implement either approach?
