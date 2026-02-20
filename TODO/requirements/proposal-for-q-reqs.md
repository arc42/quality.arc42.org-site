# LLM Prompt Guideline — The "Near-Perfect" Quality Requirement

Use this guideline to prompt an LLM to generate a single, high-quality, and architecturally sound quality requirement.

---

## The Prompt

**Role**: You are a Software Quality Engineer and Requirements Specialist. Your task is to write exactly one quality requirement scenario for the arc42 quality model.

**Input**:
- **Quality Attribute**: `[e.g., Observability]`
- **Domain / System Type**: `[e.g., High-frequency Trading Platform]`
- **Primary Stakeholder**: `[e.g., SRE / Site Reliability Engineer]`

---

**Output Structure (Strict Markdown)**:

```md
#### Context
[2–4 sentences defining the specific domain, system scale, and why this quality is critical for the named stakeholder.]

#### Trigger
[One sentence. Define the event, user action, or system state change that initiates this scenario.]

#### Acceptance Criteria
- [Criterion 1: metric + unit + threshold + source]
- [Criterion 2: ...]
- ... (4 to 7 criteria total)

#### Monitoring Artifact
[One-line description of where/how compliance is observed: e.g., CI/CD logs, Prometheus dashboard, SOC2 Audit report.]
```

---

**Fundamental Rules (No Exceptions)**:

1.  **Atomicity**: Address exactly one quality attribute. Use 4–7 acceptance criteria.
2.  **Quantification**: Every criterion must contain a **numeric threshold** with a **unit** (e.g., "99.9%", "≤ 250ms", "≥ 80%"). Qualitative terms like "fast" or "secure" are banned.
3.  **Measurement Stack**: Every criterion must specify:
    *   **Scope**: Load level, data volume, or user count (e.g., "at 10k requests/sec").
    *   **Source**: Where the data comes from (e.g., "distributed traces", "static analysis report").
    *   **Horizon**: The time window or frequency (e.g., "p95 over 5-minute rolling window").
4.  **Tech-Neutrality**: Use **capability categories**, not products. Say "a cryptographically strong asymmetric algorithm," not "RSA-4096." Say "a container orchestration platform," not "Kubernetes."
5.  **Failure Path**: At least one criterion must define the **system behavior upon breach** (e.g., automated rollback, circuit-breaker activation, or immediate notification with a specific latency).
6.  **Logical Hygiene**:
    *   Criteria must be **independently falsifiable** (failing one doesn't mean failing all).
    *   No tautologies: Replace "100% secure" with specific attack-mitigation metrics.
    *   No boilerplate: Don't restate the trigger or context inside the criteria.
7.  **Uncertainty**: If an industry benchmark is unavailable, use `Assumption:` to declare a team-verifiable threshold.

---

**Anti-Patterns to Avoid**:

| Anti-pattern | Why it fails |
|:-------------|:-------------|
| "The system shall be highly available." | Not measurable. |
| "Response time must be acceptable." | No threshold, no scope. |
| "Use OAuth2 with JWT." | Solution-prescriptive (not tech-neutral). |
| "All data must be correct at all times." | Tautology; impossible to falsify. |
| "Errors are handled gracefully." | No metric, no failure path defined. |

---

**LLM Self-Check (Pre-output)**:
- [ ] Are there 4–7 criteria?
- [ ] Does every criterion have a metric, unit, threshold, source, and scope?
- [ ] Is there a failure path with a response time?
- [ ] Is it 100% free of specific vendor or product names?
- [ ] Does the "Monitoring Artifact" provide a realistic way to verify the requirement?
- [ ] Are potential trade-offs (e.g., security vs. latency) explicitly bounded?
