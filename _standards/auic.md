---
layout: page_standard
title: "AIUC-1 – AI Agent Standard"
permalink: /standards/aiuc-1
standard_id: aiuc1
---

## AIUC-1: The world's first AI agent standard

AIUC-1 is presented as the first dedicated standard for AI agents, designed to unlock enterprise adoption by covering core enterprise concerns across safety, security, governance, and operations. It focuses on making autonomous and semi-autonomous AI agents trustworthy and deployable in real-world organizational settings, emphasizing responsible behavior, oversight, and alignment with business and regulatory expectations.

{% capture site_tags %}{% for tag in site.tags %}{{ tag | first }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endcapture %}
{% assign tag_words = site_tags |  split:',' | sort %}
{% assign tag_words_unique = tag_words | uniq %}
{% assign site_tags = tag_words_unique | join: ',' %}

{% for tag in tag_words_unique %}{{ tag }}, {% endfor %}


## Focus and Coverage

| Area | Description |
|:--- |:--- |
| Agent Safety | Guardrails to avoid harmful actions and outcomes, risk controls, and safe failover/rollback mechanisms for autonomous behaviors. |
| Security & Privacy | Controls for secure operation of agents, protection of credentials and data, least-privilege access, and privacy-aware data handling. |
| Reliability & Robustness | Expectations for predictable behavior, error handling, recovery, and resilience in changing environments and tool contexts. |
| Governance & Oversight | Human-in-the-loop controls, approval workflows, audit trails, activity logging, and accountability for actions taken by agents. |
| Interoperability | Consistent interfaces and conventions for connecting tools, APIs, and services so agents can be integrated into existing stacks. |
| Operations | Deployment, configuration, monitoring/observability, incident handling, and lifecycle management suitable for enterprise environments. |


## Relationship to Quality Attributes

AIUC-1 addresses (directly or indirectly) attributes commonly required for dependable systems in enterprises, including security, safety, reliability, maintainability, flexibility/portability, compatibility/interoperability, performance efficiency, and effective user interaction and oversight.


## References

- AIUC-1 (official): https://aiuc-1.com/

