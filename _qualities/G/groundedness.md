---
title: Groundedness
tags: [reliable, suitable]
related:
  [
    correctness,
    verifiability,
    traceability,
    reliability,
    explainability,
    model-transparency,
    data-quality,
  ]
standards: [nistairmf, iso24028]
permalink: /qualities/groundedness
---

Groundedness is a quality mainly relevant for generative AI systems, retrieval-augmented generation (RAG), summarization, question answering, assistants, and agents that produce factual claims from supplied or retrieved context.

### Definition

Groundedness is the degree to which an AI-generated output, especially its factual claims, is supported by specified grounding sources such as retrieved documents, databases, tool results, or other authoritative context, and avoids unsupported fabrication or speculation.

Groundedness is related to, but not identical with, [explainability](/qualities/explainability). Explainability asks whether stakeholders can understand how or why a result was produced; groundedness asks whether the result is supported by the relevant sources. A response can be explainable but ungrounded, or grounded but poorly explained.

This definition is derived from the established usage and evaluation practices below.

<hr class="with-no-margin"/>

### Related definitions and practices

Microsoft Azure AI Content Safety describes groundedness for LLMs as the extent to which outputs are based on provided information or accurately reflect reliable sources. It treats ungroundedness as non-factual or inaccurate information relative to the source material.

[Microsoft Learn: Groundedness detection in Azure AI Content Safety](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/groundedness)

<hr class="with-no-margin"/>

Microsoft's RAG evaluator documentation defines groundedness as a system-evaluation metric that measures how well a generated response aligns with the given context without fabricating content. It explicitly distinguishes groundedness as a precision concern from response completeness as a recall concern.

[Microsoft Learn: Retrieval-Augmented Generation evaluators](https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/rag-evaluators)

<hr class="with-no-margin"/>

Google Cloud's Vertex AI evaluation templates define groundedness as a metric for whether a response provides or references only information included in the user prompt, with all aspects of the response attributable to the provided context.

[Google Cloud: Metric prompt templates for model-based evaluation](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/eval-python-sdk/metrics-templates)

<hr class="with-no-margin"/>

Amazon Bedrock uses the related term "faithfulness" for RAG evaluation, measuring how well responses avoid hallucination with respect to retrieved texts. This is close to groundedness, but AWS names the metric differently.

[Amazon Bedrock: RAG evaluation metrics](https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-evaluation-metrics.html)

<hr class="with-no-margin"/>

NIST AI 600-1 frames the underlying risk through "confabulation", where generative AI systems confidently present erroneous or false content, and through information integrity, where trustworthy information can be linked to original sources with appropriate evidence.

[NIST AI 600-1: Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
