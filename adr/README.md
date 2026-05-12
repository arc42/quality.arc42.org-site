# Architecture Decision Records

Numbered, append-only records of decisions that shape the project beyond
what a code diff or commit message can capture: trade-offs, alternatives
considered, and why we landed where we did.

## When to add one

- A choice that future readers will reasonably ask "why?" about.
- A decision that intentionally diverges from a default or convention.
- Tooling / deployment / process changes that aren't obvious from the code.

## Format

Nygard-style: short, dated, with explicit Status, Context, Decision,
Consequences, and Alternatives sections. One markdown file per decision,
prefixed with a zero-padded sequence number. Never edit a merged ADR
beyond changing its Status — instead, add a new ADR that supersedes it.
