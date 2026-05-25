---
title: Injection Resistance
tags: [secure]
related: [security, resistance, integrity, intrusion-prevention, robustness]
standards: [owaspasvs, etsien304223]
permalink: /qualities/injection-resistance
---

See [#secure](/tag-secure)

### Definitions

Injection resistance is the degree to which a system prevents untrusted input from being interpreted as executable instructions, control data, or persistent context that can alter behavior, decisions, privileges, outputs, or stored state.

For LLM-based and agentic systems, injection resistance includes resistance to prompt injection, indirect prompt injection through retrieved content or tool output, and persistent memory or context poisoning.

This definition is derived from the established attack definitions below.

<hr class="with-no-margin"/>

### Related attack definitions

> An attack which exploits the concatenation of untrusted input with a prompt constructed by a higher-trust party such as the application designer.
>
> [NIST CSRC: Prompt injection](https://csrc.nist.gov/glossary/term/prompt_injection)

<hr class="with-no-margin"/>

> A Prompt Injection Vulnerability occurs when user prompts alter the LLM's behavior or output in unintended ways.
>
> [OWASP LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)

For broader context, see the [OWASP Top 10 for LLMs and Generative AI Apps](https://genai.owasp.org/llm-top-10/).

<hr class="with-no-margin"/>

OWASP defines memory and context poisoning as corruption or seeding of retained or retrieved agent context with malicious or misleading data, causing later reasoning, planning, or tool use to become biased, unsafe, or useful for exfiltration.

[OWASP Top 10 for Agentic Applications 2026, ASI06: Memory & Context Poisoning](https://genai.owasp.org/agentic/asi06-memory-and-context-poisoning/)

<hr class="with-no-margin"/>

The UK National Cyber Security Centre warns that current LLMs do not enforce a security boundary between instructions and data inside a prompt. For these systems, injection resistance should therefore be treated as a risk-reduction quality, not as a guarantee that prompt injection can be eliminated.

[NCSC: Prompt injection is not SQL injection](https://www.ncsc.gov.uk/blog-post/prompt-injection-is-not-sql-injection)
