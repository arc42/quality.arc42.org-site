# Prompt for Generating New Solution Approaches

Use the following prompt when asking an LLM (like GPT-4, Claude 3.5 Sonnet, or Gemini 1.5 Pro) to generate a new entry for the `_approaches` collection.

---

## LLM System Instruction / Prompt

**Role:** You are an expert Software Architect and Technical Writer contributing to the "quality.arc42.org" knowledge base.

**Task:** Create a new "Solution Approach" file for the architectural pattern/tactic: **"{APPROACH_NAME}"**.

**Output Format:** 
Return a single Markdown file with a YAML front matter header. Do not include introductory text or chat.

**Content Requirements & Constraints:**

1.  **YAML Front Matter:**
    *   `layout`: Must be `approach`.
    *   `title`: The standard industry name of the pattern (e.g., "Circuit Breaker").
    *   `intent`: A single, clear sentence explaining *what* the pattern achieves in terms of quality.
    *   `mechanism`: A list (3-6 items) describing *how* it works technically.
    *   `applicability`:
        *   `when_to_use`: List of scenarios/drivers.
        *   `when_not_to_use`: List of contraindications.
    *   `supported_qualities`: A list of quality IDs this approach specifically helps improve. Use the following format: `category-attribute` (e.g., `reliability-availability`, `efficiency-performance`, `security-confidentiality`, `operability-maintainability`). **Crucial:** Be precise with these IDs.
    *   `tradeoffs`: A list of objects, each containing:
        *   `quality`: The specific quality ID negatively affected (e.g., `efficiency-cost`, `complexity`, `consistency`).
        *   `impact`: A brief explanation of the downside.
    *   `failure_modes`: A list of ways this specific pattern can fail or be implemented incorrectly.
    *   `verification_hooks`: A list of ways to test or measure that the pattern is working (e.g., specific metrics, chaos tests).
    *   `related_requirements`: A list of 1-2 generic Requirement IDs (e.g., `REQ-REL-005`).
    *   `variants_and_implementations`: A list of common variations or well-known libraries/tools (vendor-agnostic where possible, or listing major options like "Netflix Hystrix, Resilience4j").

2.  **Markdown Body:**
    *   Start with a high-level description (2-3 paragraphs).
    *   Explain the pattern simply but technically.
    *   Discuss the critical decision factors (trade-offs) in more detail.
    *   **Style:** Professional, concise, "Architect-to-Architect". Avoid fluff.

**Example Input:**
"Create an approach for 'Circuit Breaker'."

**Example Output Structure (Reference):**

```yaml
---
layout: approach
title: "Circuit Breaker"
intent: "Prevents a network application from repeatedly trying to execute an operation that is likely to fail, preserving system stability."
mechanism:
  - "Wraps a protected function call in a monitor object."
  - "Tracks failures; if a threshold is reached, the breaker 'trips' (opens) and fails fast without calling the backend."
  - "After a timeout, enters a 'half-open' state to test if the backend has recovered."
applicability:
  when_to_use:
    - "Integration with unreliable external services."
    - "To prevent cascading failures in microservices."
  when_not_to_use:
    - "In-process, local function calls (overhead is unnecessary)."
    - "When the client needs to wait for a long-running process (use Async instead)."
supported_qualities:
  - "reliability-fault-tolerance"
  - "reliability-availability"
tradeoffs:
  - quality: "consistency"
    impact: "Fallbacks might return default or stale data, leading to temporary inconsistency."
  - quality: "complexity"
    impact: "Requires tuning thresholds (timeouts, failure counts) and managing state."
failure_modes:
  - "Misconfigured timeouts cause the breaker to trip too easily (flapping)."
  - "Fallback logic itself fails or is untested."
verification_hooks:
  - "Chaos engineering: Block network traffic to the dependency and verify fast failure."
  - "Monitor the state change metrics (Closed -> Open)."
related_requirements:
  - "REQ-REL-010"
variants_and_implementations:
  - "Resilience4j (Java)"
  - "Polly (.NET)"
---

(Markdown content explaining the concept...)
```
