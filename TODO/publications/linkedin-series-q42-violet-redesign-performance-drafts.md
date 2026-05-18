# LinkedIn Drafts: q42 Impeccable Critique, Violet Redesign, Search, and Performance (Apr-May 2026)

## Post 1 - Critique before redesign

One thing I liked about the recent q42 redesign: we did not start by choosing a new color.

We started with critique.

For the redesign of quality.arc42.org, we used the **Impeccable skill collection** as a structured critique partner. The goal was not to let a tool randomly "make it prettier". The goal was to identify concrete visual and UX weaknesses:

- old-brand residue across pages
- weak visual hierarchy in some content areas
- header and search usability issues
- homepage graph framing that needed more discipline
- inconsistent token and component usage
- accessibility details around contrast, focus states, scrollable graph regions, and reduced motion

That critique became a practical backlog.

This is where AI assistance is useful to me: not as a replacement for judgment, but as a second design reviewer that can name weak spots, force prioritization, and make vague unease inspectable.

The later violet redesign, navigation cleanup, asset work, and Lighthouse/WCAG checks were built on that foundation.

For a quality model, that felt appropriate: first make the quality gaps visible, then improve them deliberately.

#SoftwareArchitecture #UX #DesignReview #OpenSource

---

## Post 2 - A quality model also needs usability

A quality model also has quality attributes.

Over the last weeks we changed a lot in **q42** - the open quality model at quality.arc42.org and part of the arc42 family.

The visible part is the redesign:

- a violet/cream visual system
- clearer typography
- a calmer header and footer
- cleaner page surfaces
- a homepage that gives people better entry points into the model

But the important part is not the color. The color work followed the critique.

The important part is that a knowledge model must be usable. If people cannot find their way through qualities, requirements, standards, and solution approaches, the model remains a repository. Useful, but not useful enough.

So this redesign was not decoration. It was information architecture, interaction design, and product work around architecture knowledge.

For me, that is an interesting lesson: even a model about software quality needs UX work. Especially a model about software quality.

Next in this small series: what changed in navigation and search.

#SoftwareArchitecture #QualityAttributes #UX #OpenSource

---

## Post 3 - When a model grows, search becomes architecture

q42 has grown over time:

- qualities
- quality requirements
- standards
- solution approaches
- aliases and related concepts

At some point, navigation is no longer just a menu. It becomes part of the architecture of the site.

In the recent q42 redesign we therefore changed two things:

First, the navigation was simplified and extracted into structured data. The primary navigation now focuses on the main work areas, while secondary links keep supporting material available without overloading the top level.

Second, the old search was replaced with a Lunr-based index. The index is generated from the source content and covers qualities, requirements, standards, and approaches. Search ranking uses titles, aliases, tags, and body text.

Why this matters:

People rarely remember the exact term used by a model. They search by intent, by synonym, by standard, or by problem.

For a quality model, discoverability is not a convenience feature. It is part of whether the model can actually be used in architecture work.

#SoftwareArchitecture #Search #InformationArchitecture #OpenSource

---

## Post 4 - The fastest feature is the one you delete

The recent q42 redesign also included a page-load and asset cleanup.

One useful number from the branch:

146 files changed, 8039 insertions, 12641 deletions.

That ratio says a lot about the work.

Some examples:

- old static JavaScript files removed
- jQuery and the old sticky plugin dropped from the global page load
- legacy CSS migrated into modular Sass or removed
- site JavaScript bundled through esbuild
- Mermaid loaded only on pages that actually contain diagrams
- unused Font Awesome regular font assets removed
- outdated visuals and generated leftovers cleaned up

The lesson is simple but easy to forget:

Performance is often less about adding one clever optimization and more about removing accidental complexity.

This is true for websites, but also for architecture in general. Every unused dependency, every duplicated style system, every old asset path has a cost. It may be small in isolation. It becomes visible when it accumulates.

The q42 redesign was a good reminder that maintainability and page speed are related.

#WebPerformance #SoftwareArchitecture #Maintainability #OpenSource

---

## Post 5 - Publishing the quality signals of the quality site

If a site is about software quality, it should make its own quality visible.

During the recent q42 work, we added and updated automated Lighthouse reporting for representative pages of quality.arc42.org.

The scan covers 21 routes, including:

- the homepage
- the full graph
- collection pages for qualities, requirements, standards, and approaches
- dimension pages
- selected quality pages

The local Lighthouse averages improved between the Apr 27 and May 11 reports:

- Performance: 92 to 96
- Accessibility: 91 to 98
- Best practices: 74 to 95
- SEO: 95 to 99

We also updated WCAG reports and added explicit accessibility scope notes.

Those numbers are not the whole story. Lighthouse is a useful signal, not a complete definition of quality.

But that is exactly the point: make the signals visible, keep them repeatable, and use them to guide improvement.

That feels appropriate for q42: a quality model should not only describe quality. It should practice it where possible.

#Accessibility #WebPerformance #QualityAttributes #SoftwareArchitecture

---

## Alternative Single Larger Post

Over the last weeks we changed a lot in **q42**, the open quality model at quality.arc42.org and part of the arc42 family.

The branch history tells an interesting story: this was not just a visual refresh.

The main range contains 22 commits from Apr 24 to May 11, touching 146 files. It changed the critique workflow, visual design, navigation, search, page-load behavior, and quality reporting. It also removed more code than it added: 8039 insertions versus 12641 deletions.

The work started with critique. We used the Impeccable skill collection as a structured design reviewer to identify visual and UX weaknesses: old-brand residue, inconsistent hierarchy, header/search usability, graph framing, token consistency, contrast, focus states, and reduced-motion concerns. That critique did not replace judgment. It gave us a clearer backlog.

The visible change is the new violet direction: a clearer brand system, better typography, calmer page surfaces, and a more deliberate homepage. But the deeper change is usability. q42 is not a small static glossary anymore. It connects qualities, requirements, standards, solution approaches, aliases, and relations. That kind of model needs strong navigation.

So we simplified the navigation and replaced the old search with a generated Lunr index. Search now covers qualities, requirements, standards, and approaches, and ranking uses titles, aliases, tags, and body text. That matters because architecture teams often search by intent or synonym, not by the exact canonical term.

The performance work followed the same principle: remove accidental complexity. We dropped old static JavaScript, removed jQuery and an old sticky plugin from the global page load, migrated legacy CSS into modular Sass, bundled site JavaScript through esbuild, lazy-loaded Mermaid only where diagrams exist, and removed unused Font Awesome regular assets.

We also made quality more visible. Lighthouse reporting now covers 21 representative routes. Between the Apr 27 and May 11 reports, local averages moved from 92 to 96 for performance, 91 to 98 for accessibility, 74 to 95 for best practices, and 95 to 99 for SEO. WCAG reports and accessibility scope notes were updated as well.

For me, the interesting lesson is this:

A quality model also needs quality attributes.

It must be usable, fast enough, maintainable, accessible, searchable, and measurable. Otherwise it describes quality better than it demonstrates it.

#SoftwareArchitecture #QualityAttributes #WebPerformance #Accessibility #OpenSource
