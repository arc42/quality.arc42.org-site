# Proposal for Issue #335: Taxonomy and Retagging Rules for `#maintainable`

## Objective
Define explicit, reviewable rules for assigning `#maintainable` vs `#flexible` (or both), then list concrete file candidates before any bulk edits.

## Decision Rules

1. `#maintainable` (primary):
   - Concerns fast, safe, and economical change of the system internals over time.
   - Typical signals: analyzability, modifiability, testability, debuggability, modular structure, long-term evolution cost.

2. `#flexible` (primary):
   - Concerns adaptation to external context: environment, platform, deployment, workload, integration boundaries, user/task context, runtime variability.

3. Dual-tag (`#maintainable` + `#flexible`) only when both are clearly central:
   - Example: a quality affects both internal change economics and external adaptability.

4. Transitional compatibility:
   - During migration, dual-tagging is acceptable where uncertainty exists.
   - Final cleanup can narrow overlap after observing usage/navigation impact.

## Backing References
- ISO/IEC 25010:2023 define maintainability as capability to be modified with effectiveness and efficiency, including corrections, improvements, adaptation, and updates/upgrades.
- SWEBOK (IEEE, citing IEEE 610.12) defines maintainability as ease of maintaining, enhancing, adapting, or correcting software to satisfy requirements.

Both references imply a strong focus on change effort and risk for maintainers, which justifies a dedicated top-level `#maintainable` dimension.

## Candidate Mapping: Qualities currently tagged `#flexible`

### Move to `#maintainable` only
- `_qualities/M/maintainability.md`

### Add `#maintainable` (keep `#flexible` initially)
- `_qualities/M/modifiability.md`
- `_qualities/A/analysability.md`
- `_qualities/T/testability.md`
- `_qualities/D/debuggability.md`
- `_qualities/C/changeability.md`
- `_qualities/M/modularity.md`
- `_qualities/R/reusability.md`
- `_qualities/E/evolvability.md`
- `_qualities/E/extensibility.md`
- `_qualities/C/cohesion.md`
- `_qualities/L/loose-coupling.md`
- `_qualities/T/test-coverage.md`
- `_qualities/L/longevity.md`
- `_qualities/V/verifiability.md` (target state: `reliable + maintainable`, remove `flexible`)
- `_qualities/U/updateability.md` (target state: `operable + maintainable`, remove `flexible`)
- `_qualities/U/upgradeability.md` (target state: `operable + maintainable`, remove `flexible`)

### Keep only `#flexible` (no `#maintainable` for now)
- `_qualities/F/flexibility.md`
- `_qualities/A/adaptability.md`
- `_qualities/P/portability.md`
- `_qualities/S/scalability.md`
- `_qualities/E/elasticity.md`
- `_qualities/C/configurability.md`
- `_qualities/C/customizability.md`
- `_qualities/P/personalization.md`
- `_qualities/I/internationalization.md`
- `_qualities/L/localizability.md`
- `_qualities/I/installability.md`
- `_qualities/I/integrability.md`
- `_qualities/I/interchangeability.md`
- `_qualities/R/replaceability.md`
- `_qualities/C/co-existence.md`
- `_qualities/V/versatility.md`
- `_qualities/C/composability.md`
- `_qualities/S/self-containedness.md`
- `_qualities/I/independence.md`
- `_qualities/D/distributability.md`
- `_qualities/A/agility.md`

## Candidate Mapping: Requirements currently tagged `#flexible`

### Add `#maintainable` (keep `#flexible` initially)
- `_requirements/E/efficient-change-business-rules.md`
- `_requirements/I/independent-enhancement-of-subsystem.md`
- `_requirements/M/modular-data-analysis.md`
- `_requirements/R/report-yearly-tax-update.md`

### Keep only `#flexible` (no `#maintainable` for now)
- `_requirements/P/portable-data-checker.md`
- `_requirements/L/localizable-to-n-languages.md`
- `_requirements/E/easily-change-cloud-provider.md`
- `_requirements/I/independent-replacement-of-subsystem.md`
- `_requirements/C/core-functions-mac-win-linux.md`
- `_requirements/C/configurable-gui-theme.md`
- `_requirements/C/compatible-with-5-battery-providers.md`
- `_requirements/U/usable-on-latest-browsers.md`
- `_requirements/C/crm-data-synchronization.md`

## Approaches
- Current state: no `_approaches/**` content is tagged `#flexible` at the moment.
- Proposal: once maintainability-focused approaches exist, tag them directly with `#maintainable`.

## Decisions (confirmed)
1. `_qualities/V/verifiability.md` moves to dual-tag `reliable + maintainable` (no `flexible` in target state).
2. `_qualities/U/updateability.md` and `_qualities/U/upgradeability.md` become `operable + maintainable`; `flexible` will be removed.
3. `_qualities/M/maintainability.md` becomes only `#maintainable` (no dual-tag in target state).

## Recommended Migration Order
1. Introduce `#maintainable` page and top-level surfacing.
2. Apply dual-tagging for the "Add `#maintainable`" sets above.
3. Validate navigation and graph usage.
4. Second pass (required): remove `#flexible` from items with explicit target-state tag sets above.
