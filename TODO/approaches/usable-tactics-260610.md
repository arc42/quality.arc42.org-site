# `#usable` — Constructive Tactics & Patterns Proposal

**Date:** 2026-06-10
**Scope:** New approach candidates for `#usable` (effective, efficient, satisfying use). **Constructive patterns with real architectural substance only** — things that shape structure, state management, or data flow (in the spirit of the published Progressive Disclosure and Responsive Design). No visual-design tips, no process practices.
**Cross-referenced against:** `approaches-planning-and-status.md` (only 3 usable candidates exist — our thinnest dimension), the Harrer review, and published `_approaches/`.

---

## Tier 1 — Write these first

| # | Approach | One-line mechanism | Why it earns a page | Source |
|---|----------|--------------------|---------------------|--------|
| 1 | **Local-First / Offline-First Architecture** | The client holds the primary copy of data; a sync layer (CRDTs or server-streamed replicas) propagates changes in the background — the app works fully offline, every read/write is an instant local operation | The biggest architectural shift in usable-software design of the decade: inverts client-server data ownership, eliminates the entire spinner class of latency, gives multi-device and collaboration "for free". The 2024–26 sync-engine wave (Automerge 3.0, Yjs, ElectricSQL, Zero, PowerSync) makes it state of the art, not speculative. Heavy, honest tradeoffs: CRDT merges are *valid* but not always *intended*; schema migration across stale clients; authorization without a central gatekeeper | Kleppmann et al., "Local-first software" (Ink & Switch 2019); Automerge; SE Radio 716 (2026) |
| 2 | **Optimistic UI Updates** | Apply the predicted result of a user action to local state immediately, send the mutation async, then reconcile — confirm, patch, or roll back visibly when the authoritative response arrives | Removes the 200–600 ms round-trip from every interaction by making the client a second writer — which forces real architecture: pending-mutation queue, replayable update functions, idempotent server actions (client-generated IDs), rollback path. Sharp judgment calls: never optimistic for destructive or financial state. Platform maturity confirms the pattern (React 19 `useOptimistic`, TanStack Query). The lightweight sibling of #1 | React 19 docs; TanStack Query; Meteor "latency compensation" (origin, 2012) |
| 3 | **Undo / Recoverable Operations** | Replace confirmation dialogs with reversibility: actions as command/event objects with inverse or compensating operations, soft delete + retention window, irreversible effects executed only after the undo window closes | Nielsen's "user control and freedom" realized *structurally*: command pattern with undo stacks, compensation (saga-style) for distributed effects, soft-delete data modeling, and a policy layer deciding undo vs. confirm. Deceptively deep tradeoffs: retention vs. GDPR erasure, soft-delete query pollution, compensations that can themselves fail. Cross-link published **Saga** (shared compensation mechanism); fold in the "command registry / actions-as-objects" idea (the substantive core of command palettes) | NN/g (confirmation-dialog research); GoF Command; Garcia-Molina & Salem, "Sagas" (1987) |

---

## Tier 2 — Strong, write after Tier 1

| # | Approach | One-line mechanism | Why it earns a page | Source |
|---|----------|--------------------|---------------------|--------|
| 4 | **Autosave / Draft Persistence** | Continuously checkpoint in-progress work (debounced incremental writes, local and/or server-side draft store with its own lifecycle) so a crash, tab close, or session expiry never destroys user work | "Treat user data as sacred" (Raskin) needs structural commitment: a draft entity distinct from published state, versioned checkpoints, recovery-on-launch protocol, multi-tab conflict handling. Non-obvious tradeoff: autosave can persist a corrupted state over a good one — needs version history, not just last-write; must not truncate the undo stack (#3) | Raskin, *The Humane Interface* (2000); Cooper, *About Face* |
| 5 | **URL-as-State (Addressable Application State)** | Treat the URL as the serialized, canonical representation of view state (filters, selection, mode) — every state bookmarkable, shareable, refresh-safe, back-button-correct | A genuine state-management architecture decision that disciplines the whole state model: what is serializable, what is session-private, URL schema as a permanent public API. Non-obvious to a SPA-era generation; enjoying a revival in the server-first/HTMX wave. Tradeoffs: PII leakage via shared links and logs; state that can't round-trip; URL-schema versioning | Fielding (REST, URI = identity); Nielsen, "URL as UI" (1999) |
| 6 | **Forgiving Input (Lenient Interpretation)** | Accept varied human input formats at the boundary, run them through an explicit interpretation/normalization layer, store only a canonical internal representation — Postel's robustness principle applied to humans | Tidwell's "Forgiving Format": explicitly "transfers the problem from a UI problem to a programming problem" — the architecture is the canonical-model + interpreter boundary. The teachable edge: silent misinterpretation is worse than rejection (echo the interpretation back, ask when ambiguous); be lenient at the human boundary, strict internally (the security critique of Postel's law, addressed) | Tidwell, *Designing Interfaces*; RFC 761 (Postel) |
| 7 | **Interaction Latency Budgets (Perceived-Performance Architecture)** | Set explicit per-interaction latency budgets (Nielsen's 0.1 s / 1 s / 10 s; INP ≤ 200 ms, LCP ≤ 2.5 s) and let the budgets drive structure: streaming SSR, progressive hydration, prefetch, main-thread scheduling | A budget is an architecturally enforceable quality requirement — it determines rendering architecture and data-fetch topology, and is CI-enforceable; INP cannot be fixed cosmetically, only structurally. Must carry the nuance: skeleton screens that *fake* progress are a dark pattern (Harrer's "Qualitätsillusionen"); the legit version is budget-driven structure. **Flag:** overlaps `#efficient` — keep here via *perceived* responsiveness, cross-tag efficient. Cite Core Web Vitals as current, RAIL as historical | Nielsen, "Response Times" (1993); web.dev Core Web Vitals/INP |

---

## Tier 3 — Opportunistic

| # | Approach | One-line mechanism | Note | Source |
|---|----------|--------------------|------|--------|
| 8 | Multi-Device Session Continuity | Externalize session/task state from device and connection into a durable, addressable context so a task started on one device resumes on another mid-flow | Substantive and freshly relevant (Windows Cross-Device Resume, Android 17 Handoff, resumable AI-conversation streams) but niche-er, and a local-first page (#1) subsumes much of it. Canonical literature is platform docs, not pattern literature | Apple Handoff (origin, 2014); platform docs |
| 9 | Progressive Enhancement | Server-rendered HTML baseline delivers core functionality with zero client JS; CSS/JS are additive layers gated on capability detection — any upper-layer failure degrades to a working baseline | Clears the bar in 2026 only as an architectural *commitment* (every mutation a real HTTP endpoint; server-capable rendering), with renewed teeth from the server-first wave (Remix doctrine, HTMX, islands) and GOV.UK mandate. Must explicitly differentiate from published **Feature Degradation** (it's the constructive dual) and **Responsive Design** | Keith, *Resilient Web Design* (2016); GOV.UK Service Manual |

---

## Researched and *not* recommended

| Candidate | Verdict |
|-----------|---------|
| **Design Tokens / Design System as architecture** | Now has a real spec (W3C DTCG community report, first stable version 2025-10) and a genuine build-pipeline architecture — but its payoff is consistency/team-scaling, i.e. `#maintainable`/`#flexible`, not end-user effectiveness. Revisit there if wanted. |
| **Command Palette / keyboard-first interaction** | The substantive part is the command registry (every action an addressable, permission-checked object) — which is the Command pattern that #3 already carries; the palette itself is a commodity widget. Mention inside #3. |
| **Skeleton screens (standalone)** | Only legitimate inside the latency-budget framing of #7; as a standalone "make it feel fast" tactic it drifts into fake-progress dark-pattern territory. |

---

## Interactions with existing content

- #1, #2, #4, #8 form a coherent **local-state + reconciliation cluster** — cross-reference rather than re-explain sync in each page.
- **Undo** (#3) shares the compensation mechanism with published **Saga** — link, don't duplicate.
- **Progressive Enhancement** (#9) vs. published **Feature Degradation**: constructive dual vs. runtime reaction — state the distinction on both pages.
- `aka:` candidates: Offline-First, Sync Engine (→ #1); Latency Compensation (→ #2); Soft Delete (→ #3, index term); Deep Linking, Bookmarkable State (→ #5); Forgiving Format (→ #6).
