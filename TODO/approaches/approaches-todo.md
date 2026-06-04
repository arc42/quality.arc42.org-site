# Top 10 Proposed Solution Approaches

This backlog is normalized to the canonical schema in `.claude/skills/write-approach/reference/approaches-template.md`.
All `supported_qualities` and `tradeoffs` values are plain quality slug candidates.

| Priority | Approach | Permalink | Tags (9 dimensions only) | supported_qualities (slug candidates) | tradeoffs (slug candidates) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| P2 | Least Privilege | `/approaches/least-privilege` | `secure`, `safe` | `security`, `confidentiality`, `integrity` | `usability`, `operability` |
| P3 | Database Sharding | `/approaches/database-sharding` | `efficient`, `reliable` | `scalability`, `performance`, `capacity`, `availability` | `code-complexity`, `operability`, `consistency` |

## Notes for Execution

- Confirm each slug exists in `/qualities/<slug>` before final page merge.
- Keep page body structure concise (max 4 `##` headings).
- Deliver in batches of 2-3 approaches per PR.
