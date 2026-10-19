# Quality Map Builder — recommendation and design sketch

Source: [issue #552](https://github.com/arc42/quality.arc42.org-site/issues/552) by BoboTheBarbar, incl. seven mockups.
Status: proposal, 2026-10-19. Nothing built yet.

## The idea in one paragraph

A reader collects the qualities that matter for *their* system one at a time while
browsing Q42, then opens a map that shows only those qualities and what they have in
common: shared approaches, requirements, standards, dimensions. They rate priority,
hide noise, add their own requirements, and export the result for architecture
documentation or an LLM. Think "shopping basket for qualities, with a map as the
checkout".

## Recommendation

1. **Integrate into this site; do not build a separate app.** The value is in
   "add while you browse". A separate app would force users to re-find every quality
   in a second UI and would duplicate navigation, search, brand, and data sync.
2. **No backend, no accounts.** The site stays on GitHub Pages. Persistence is
   `localStorage` + share URL + file export. Custom requirements reach us via a
   prefilled GitHub issue link.
3. **Build it in three phases** (below). Phase 1 alone is useful.
4. **Reuse the existing data and graph stack.** `assets/data/nodes.json` and
   `edges.json` already contain every node and edge the map needs (444 nodes,
   ~3 100 edges). The map is a subgraph query, not a new data model.
   If the sigma/ForceAtlas2 evaluation lands, the map renders with it from day one.
5. **Keep the concept count low.** One selection, one map, one per-item eye toggle.
   Drop the separate "hidden list" state from the mockups.
6. **The map gets a list twin.** A force-directed canvas will not be WCAG 2.2 AA on
   its own. A quality × approach matrix under the canvas is the accessible view, the
   projector view, and the Markdown export preview in one.

## Design sketch

### Concepts

| Concept        | What it is                                                                 | Where it lives                    |
|----------------|----------------------------------------------------------------------------|-----------------------------------|
| Selection      | Ordered set of quality IDs (= permalink slugs) the user picked             | `localStorage`, key `q42.map.v1`  |
| Priority       | Optional `low` / `medium` / `high` per selected item                       | same store                        |
| Hidden         | Per-item flag: stays in selection, not drawn on the map                    | same store                        |
| Own requirement| `{ id, title, scenario, qualities: [...], priority }`, local only         | same store                        |
| Layers         | Which node types the map draws: approaches, requirements, standards, dimensions | URL + store                 |

Store shape (one JSON object, versioned):

```json
{
  "v": 1,
  "qualities": [{ "id": "availability", "priority": "high", "hidden": false }],
  "custom": [{ "id": "c-1", "title": "...", "scenario": "...", "qualities": ["availability"], "priority": null }],
  "layers": ["approaches"],
  "updated": "2026-10-19T10:00:00Z"
}
```

### User flow

```
Qualities list ──[+ Add]──┐
Quality detail ─[+ Add]───┤──▶ Selection (header tray, count) ──▶ /map/
Search results ─[+ Add]───┘                                         │
                                                                    ├─ layers: approaches | requirements | standards | dimensions
                                                                    ├─ default filter: shared by ≥ 2 selected qualities
                                                                    ├─ click node → side panel: links, priority, hide, "open on Q42"
                                                                    ├─ "+ Add to map": search box (lunr index), own requirement form
                                                                    └─ export: share URL · JSON · Markdown · PNG
```

Deliberate choice (Bobo's point): list and detail pages show **only** an Add button.
No "this is related to 3 of your qualities" hints while selecting, so people pick
qualities for the system, not for a pretty graph.

### Touch points in the existing site

| File / area                                   | Change                                                                 |
|-----------------------------------------------|------------------------------------------------------------------------|
| `_includes/site-header.html`                  | Selection tray: hidden at count 0, otherwise "Selection (3) · Map"      |
| `_includes/one-quality.liquid`                | `+ Add` button with `data-quality-id`                                   |
| `_includes/quality-header.liquid`             | `+ Add to selection` button on the detail page                          |
| `_pages/65-quality-map.md` (new)              | `/map/` page, layout `graph`-like, mounts the map bundle                |
| `src/map/` (new)                              | `store.js`, `subgraph.js`, `MapView.js`, `ListView.js`, `exporters/`    |
| `src/scripts/site/selection.js` (new)         | Tiny script in the site bundle: Add buttons, tray count, toast + Undo   |
| `src/scripts/build.js`                        | New entry point `map/main`                                              |
| `_sass/_map.scss` (new)                       | Tray, Add/Added button states, side panel, matrix table                 |
| `_data/navigation.yml`                        | Add "Map" to secondary nav (the tray is the primary entry)              |

The content pages need no frontmatter changes. Add buttons key on the permalink slug,
which is already the graph node ID.

### Map page layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Your map                                      [Hidden 2]  [Export ▾]     │
│ 4 qualities · 11 approaches serve two or more of them                    │
│ Show: (✓ Qualities) (✓ Approaches) ( Requirements) ( Standards) ( Dims)  │
├────────────────────────────────────────────────┬─────────────────────────┤
│ [+ Add to map]                                 │ Approach                │
│                                                │ Circuit Breaker         │
│        (Resilience)──Circuit Breaker·3──(Fault │ Supports 3 of 4         │
│             │                        tolerance)│ ✓ Availability          │
│   (Availability)──Bulkheads·3                  │ ✓ Resilience            │
│             │                                  │ ✓ Fault tolerance       │
│      Feature Degradation·3   (Recoverability)  │ – Recoverability        │
│                                                │ Priority: [Low|Med|High]│
│  9 approaches with one link hidden · Show      │ Open on Q42 · Hide      │
├────────────────────────────────────────────────┴─────────────────────────┤
│ List view (accessible twin, same data)                                   │
│ ┌──────────────────┬───────────┬──────────┬───────────┬────────────────┐ │
│ │ Approach         │ Availab.  │ Resil.   │ Fault tol.│ Recoverability │ │
│ │ Circuit Breaker  │     ●     │    ●     │     ●     │                │ │
│ │ Bulkheads        │     ●     │    ●     │     ●     │                │ │
│ └──────────────────┴───────────┴──────────┴───────────┴────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

Node encoding: selected qualities as circles, size and fill from priority
(none = outline, high = filled violet). Approaches as teal pills with the count of
served qualities, requirements as blue boxes, standards as amber, dimensions as dark
pills with dashed edges. Own requirements get a dashed border. Colours follow the
existing node palette in `src/graphs/colors.js`.

### Persistence and export

| Tier | Mechanism                                          | Phase |
|------|----------------------------------------------------|-------|
| 1    | `localStorage`, same browser                       | 1     |
| 2    | Share URL: store serialised + deflated into the hash (`/map/#s=…`). Opening it offers "replace my selection / merge" | 1 |
| 3    | JSON file export and import                        | 1     |
| 4    | Markdown export, arc42-shaped: §1.2 quality goals table (quality, priority), §10 quality tree, approach × quality matrix, own requirements as Tier-1 blocks | 2 |
| 5    | PNG/SVG of the canvas for slides and printouts     | 3     |
| –    | Accounts, cloud sync                               | never on this site |

"Propose as contribution": a link to
`github.com/arc42/quality.arc42.org-site/issues/new?template=requirement.md&title=…&body=…`
prefilled with title, scenario, and linked quality slugs. The user reviews and sends
it; nothing leaves the browser otherwise.

### Phases

**Phase 1 — collect and map**
- Selection store, Add buttons on quality list and detail pages, header tray with
  count, toast with Undo.
- `/map/` with qualities + the four layers, "shared by ≥ 2" default filter with
  "show singles" escape hatch, side panel with links and "open on Q42".
- Share URL, JSON export/import, list twin of the map.

**Phase 2 — refine**
- Priority rating (size/colour), per-item hide/restore.
- Markdown export.
- "+ Add to map" search box on the map page itself (lunr index already shipped).

**Phase 3 — own content**
- Own-requirement form with map preview, dashed-border nodes.
- Propose-as-contribution link.
- PNG/SVG export.

### Open questions

- Header tray vs. two permanent header buttons as in the mockups. Prototype both; the
  tray keeps the reference site unchanged for first-time readers.
- Does the map render with the current D3 stack or wait for the sigma/FA2 decision?
  Decide before Phase 1 starts; do not build two renderers.
- Workshop use: is a projector mode (bigger labels, no side panel) needed in Phase 1
  or is the list twin enough?

### Out of scope

- Server-side storage, user accounts, collaboration in real time.
- Editing Q42 content from the map. Contributions go through GitHub.
- Heatmap of approach overlap (Bobo's optional idea). The pill counts and the matrix
  cover it; revisit if people ask.
