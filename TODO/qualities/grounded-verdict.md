# Verdict on the groundedness additions

Branch: `codex/groundedness-quality`
Reviewed: 2026-05-26
Files reviewed:
- `_qualities/G/groundedness.md` (new)
- `_qualities/E/explainability.md` (back-link added)
- `_requirements/G/grounded-customer-support-answer.md` (new)
- `_requirements/G/grounded-explainable-loan-decision.md` (new)
- `_requirements/G/grounded-medical-triage-draft.md` (new)

## Overall: Strong, ready to merge with two minor link checks

The new groundedness quality and three requirements are conceptually sharp, structurally clean, and consistent with the established Tier-2 + Monitoring-Artifact pattern in this repo. Quality of writing and citation discipline is above the repo average.

## What works well

**1. The definition is genuinely useful, not just a restatement.**
The core sentence in `_qualities/G/groundedness.md:22` — "supported by specified grounding sources … and avoids unsupported fabrication or speculation" — captures both the positive criterion (support) and the failure mode (confabulation) in one breath. That is the right level of precision for an architecture-facing definition.

**2. The explainability cross-pointer is the standout contribution.**
`_qualities/G/groundedness.md:24` — "A response can be explainable but ungrounded, or grounded but poorly explained" — crisply separates two concepts that practitioners conflate constantly. This single sentence justifies adding the quality even on its own. The reciprocal edit in `_qualities/E/explainability.md` makes the link bidirectional in the most semantically rich place.

**3. Citation set is well-balanced and intellectually honest.**
Five anchors across Microsoft (twice — Content Safety + RAG evaluators), Google Vertex, AWS Bedrock, and NIST AI 600-1. The AWS footnote explicitly noting "AWS names it *faithfulness*" is the kind of terminological disambiguation users actually need. NIST AI 600-1's "confabulation" framing is the right primary policy hook.

**4. Three requirements cover three distinct trust regimes.**
- Customer support — consumer-grade, citation-and-refusal model
- Loan decision — regulated finance, FCRA-style adverse-action mapping, manual-review fallback
- Medical triage — clinician-in-loop, draft-only, with an explicit *export guard*

The spread feels deliberate rather than redundant; each surfaces a different design tension (citation vs. refusal vs. routing vs. unverified-export gating).

**5. Acceptance-criteria style matches the repo standard.**
All criteria carry units, sources, and horizons (cf. `_requirements/I/public-api-intrusion-attempts-blocked.md`, which sets the in-repo template). The behavior-shaped criteria (refusal, uncertainty, failure-path) appropriately omit numeric thresholds — consistent with the existing pattern.

## Structural integrity — clean

| Check | Result |
|---|---|
| Tag pages `reliable`, `suitable`, `safe` | ✓ all exist |
| `related:` targets (correctness, verifiability, traceability, reliability, explainability, model-transparency, data-quality) | ✓ all files exist |
| Standards `nistairmf`, `iso24028` | ✓ resolve via `standard_id` |
| Permalink collisions | ✓ none |
| Back-link reciprocity | Only explainability got a back-link; this is consistent with the repo's loose convention (many `related` links are one-way already — e.g. `correctness → accuracy` is not reciprocated). No defect. |
| Filename ≈ permalink | ✓ |

## Specific strengths in the requirements

- **Customer support, `_requirements/G/grounded-customer-support-answer.md:22`** — the "0 unsupported claims about *pricing, legal terms, data retention, security controls, or customer obligations*" carve-out is the right move: it splits the gradient (98% overall) from the absolute floor (0 for high-impact categories). That is how mature SLAs are actually structured.
- **Loan decision, `_requirements/G/grounded-explainable-loan-decision.md:19`** — "top 3 decision factors in plain language and no longer than 150 words" is concrete in two dimensions (count + length), which is rare and good. Routing to manual review when grounding fails (line 22) is the right failure mode for regulated lending.
- **Medical triage, `_requirements/G/grounded-medical-triage-draft.md:23`** — the *export guard* ("marked **unverified** and cannot be copied into the final clinical note without clinician override and reason capture") is excellent defensive design. It treats the AI output as a draft artifact with provenance, not as content that flows freely into the record.

## Minor concerns — none blocking

**A. Google Cloud URL host looks wrong.** `_qualities/G/groundedness.md:46` uses `docs.cloud.google.com` — Google's docs canonically live at `cloud.google.com/...`, not under a `docs.` subdomain. Worth a quick verification; very likely should be `https://cloud.google.com/vertex-ai/generative-ai/docs/models/eval-python-sdk/metrics-templates`. The other four URLs look structurally plausible.

**B. Microsoft Foundry path worth verifying.** `_qualities/G/groundedness.md:40` — `/azure/foundry/...` may have moved to `/azure/ai-foundry/...` during the AI Foundry rebrand. Not certain, but worth a click-through.

**C. Standards set is conservative.** `nistairmf` and `iso24028` are appropriate, but `iso42001` (AI management systems, which the repo already uses for explainability) would also fit — groundedness monitoring is precisely the kind of control an AI-MS would govern. `isoiec22989` (AI vocabulary) is another natural addition. Not required; just a thinness observation.

**D. "Factual claim" is the implicit measurement unit but not defined.** The customer-support 98% target counts factual claims; the eval methodology needs to define what segment of an answer counts as one claim. Reasonable to defer this to evaluation tooling rather than spell it out in the requirement card, but worth flagging in case a future reader expects it.

**E. Zero-tolerance criteria in finite samples.** "0 sampled cases" in 500/300-item monthly samples is a stylistic choice the repo accepts; statistically it is an upper-bound assertion rather than a true zero. Not a defect under the current repo norms.

## Recommendation

**Merge after fixing the Google Cloud URL host** (and quickly checking the Microsoft Foundry path). Everything else is high-quality content that materially expands the model's coverage of AI-system qualities, and the three requirements are the kind of concrete, citable artifacts architects can actually drop into review meetings.
