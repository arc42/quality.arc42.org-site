# LLM Prompt Guideline — Concise Quality Requirements

Use this guideline to generate one short, falsifiable, and architecturally useful quality requirement for the arc42 quality model.

Core principle:
Prefer the shortest requirement that remains measurable and useful for architectural decisions.

---

## Prompt

**Role**: You are a Software Quality Engineer and Requirements Specialist.

**Task**: Write exactly one concise quality requirement for the arc42 quality model.

**Input**:
- **Quality Attribute**: `[e.g., Observability]`
- **Domain / System Type**: `[e.g., High-frequency Trading Platform]`
- **Mode**: `[Scenario | Quality Gate]`
- **Critical Asset / Flow** (optional): `[e.g., payment authorization, citizen records, login endpoint]`
- **Primary Stakeholder** (optional): `[e.g., SRE, Data Protection Officer, Engineering Lead]`

Use `Scenario` for runtime, operational, or user-facing qualities.  
Use `Quality Gate` for engineering, code, process, or maintainability-oriented qualities.

---

## Output Structure

Choose exactly one mode.

### Mode A — Scenario

```md
#### Context
[1-2 sentences max. Name the domain and why the quality matters.]

#### Trigger
[1 sentence.]

#### Acceptance Criteria
- [Criterion name]: [threshold + unit/count] under [scope, if needed]; source: [artifact]; horizon: [window, if needed].
- [Criterion name]: ...
- [Criterion name]: ...

#### Evidence
[Optional. Short noun phrase only, if a shared report, dashboard, or gate is genuinely helpful.]
```

### Mode B — Quality Gate

```md
#### Requirement
[1 sentence.]

#### Acceptance Criteria
- [Criterion name]: [threshold + unit/count] under [scope, if needed]; source: [artifact]; horizon: [window, if needed].
- [Criterion name]: ...
- [Criterion name]: ...

#### Evidence
[Optional. Short noun phrase only, if a shared report, dashboard, or gate is genuinely helpful.]
```

---

## Rules

1. **Atomicity**: Address exactly one quality attribute.
2. **Brevity**: Use **2-4** criteria. Default to **3**. Use 4 only when the requirement would otherwise miss an important control or failure/gate behavior.
3. **One obligation per bullet**: Do not pack several unrelated primary metrics into one criterion.
4. **Quantification**: Every criterion must contain a measurable threshold with a unit, percentage, count, or duration.
5. **Evidence**: Every criterion must name a measurement source. Add scope and horizon when they materially affect interpretation.
6. **Optional evidence section**: Add `#### Evidence` only when a shared dashboard, report, test gate, or audit artifact adds clarity. Do not invent one just to fill the template.
7. **Tech-neutrality by default**: Avoid unnecessary product or vendor names. Named standards, protocols, formats, browsers, or legal frameworks are allowed when externally required or when the requirement is explicitly about them.
8. **Failure or gate behavior**:
   - In `Scenario` mode, include failure-path behavior when the quality is operational/runtime.
   - In `Quality Gate` mode, include gate or escalation behavior when thresholds are missed.
9. **Logical hygiene**:
   - Criteria must be independently falsifiable.
   - Do not restate the context or trigger inside the criteria.
   - Avoid tautologies such as "highly available" or "secure enough".
10. **Assumptions**: If no credible benchmark exists, use `Assumption:` once and keep it short.

---

## Anti-Patterns

- "The system shall be highly available."  
  Too vague.

- "Response time must be acceptable."  
  No threshold.

- "Use OAuth2 with JWT."  
  Too solution-prescriptive unless the requirement is explicitly about that protocol.

- One bullet containing coverage, latency, error rate, and auditability together.  
  Too many obligations in one criterion.

- A long context paragraph explaining the business domain in detail.  
  The requirement becomes narrative instead of testable.

- A made-up "Monitoring Artifact" added only because the template asked for one.  
  If the criteria already name the evidence sources, omit the extra section.

---

## Minimal Self-Check

- [ ] Did I choose the correct mode?
- [ ] Are there 2-4 criteria, preferably 3?
- [ ] Does each criterion express one measurable obligation?
- [ ] Does each criterion state a threshold and a source?
- [ ] If `Evidence` is included, does it add value instead of repeating the criteria?
- [ ] Is the output the shortest useful version?
