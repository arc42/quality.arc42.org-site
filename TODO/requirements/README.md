# Requirements backlog — state of play

Working area for improving requirement-example coverage. This file is a **pointer, not a summary**: it records only what the documents beside it cannot tell you. Read the plan of record for the actual content.

## Plan of record

**`proposed-reqs-260905-fable-astra.md`** — the Fable review, which revises the Astra proposal rather than merely commenting on it. Where the two disagree, the review wins.

`proposed-reqs-260905-astra.md` is the original it reviews. Keep it: the review cites it by path and does not restate its drafts.

The revised split, from the review's verdict: **19 gaps close with relations or alias decisions**, **9 need new drafts** (7 Astra drafts survive, 3 rewritten), **8 stay as briefs**.

## The snapshot is stale — re-verify before acting

Both documents were computed against `main` at **`6fa4c9da`** (228 qualities, 150 requirements, 36 gaps). Work has landed since.

Confirmed example: the review's "add the missing relation" row for **Themability → `configurable-ui-theme`** is **already done** on `main`. At `6fa4c9da` the `related:` array lacked `themability`; it is there now.

So: re-check each row against the current tree before acting on it. `grep -rn "^related:" _requirements/ | grep "<quality-slug>"` settles most of them in one command.

## Files here

| File                                              | What it is                                                                                                               |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `proposed-reqs-260905-fable-astra.md`             | **Plan of record.** Fable's review of the Astra proposal.                                                                |
| `proposed-reqs-260905-astra.md`                   | The original proposal under review.                                                                                      |
| `requirements-prompt-v3.md`                       | Reasoning behind the authoring rules, the copyable model prompt, and a proposed (not yet performed) six-case evaluation. |
| `requirements-prompt-v2.md`, `q-req-prompt-codex` | Superseded. Kept for comparison.                                                                                         |

## Writing requirements

Use the **`write-requirement`** skill (`.claude/skills/write-requirement/`). It carries v3's rules as publication guardrails — front matter, the two body modes, criteria quality, sourcing discipline — and enforces the duplicate check that v3 put first.

Do not re-derive the rules from `requirements-prompt-v3.md` by hand; the skill exists so that stops being necessary. The prompt file remains the place to read _why_ a rule is shaped the way it is.

## Open threads

- **Unmerged branch `clarify-related-qualities-in-requirements`** (commit `4b4dd5a0`) — relabels the requirement metadata line from "Implements" to "Qualities", and labels the tag list "Tags". "Implements" overstated the relation: a requirement is a specification artifact and the underlying `related:` field is symmetric. Merge it or close it, but do not re-litigate the terminology from scratch.
- **Issues #542 and #543** — crossed definitions (durability/longevity) and qualities tagged against their own definitions (intervenability, effectiveness). The review flags these as blocking sensible linking, so some rows cannot be actioned until they are resolved.

## Next action

Work the **19 relation/alias rows** first — they are cheap, they close most of the gap count, and each one is a single front-matter edit. Re-verify each against the current tree as you go. New drafts come after, once the definition issues are settled.
