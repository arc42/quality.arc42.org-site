---
title: Drift Detectability
tags: [reliable, operable]
related:
  [
    observability,
    diagnosability,
    reliability,
    robustness,
    data-quality,
    model-transparency,
    traceability,
    fairness,
    bias-mitigation,
  ]
standards: [nistairmf, iso24028, etsien304223]
permalink: /qualities/drift-detectability
---

Drift detectability is a quality mainly relevant for long-running systems whose operating context, input data, users, environment, or learned model behavior can change after deployment.

### Definition

Drift detectability is the degree to which a system can detect, quantify, localize, and report meaningful deviations between current production behavior and an expected baseline, within defined time, confidence, coverage, and false-alarm limits.

For AI and machine-learning systems, drift detectability includes detecting changes in input data, feature distributions, prediction distributions, model quality, bias or fairness metrics, feature attribution, or the relationship between inputs and outputs before these changes cause unacceptable degradation or harm.

Drift detectability is related to, but narrower than, [observability](/qualities/observability). Observability provides signals about system state and behavior; drift detectability turns those signals into evidence that the production context, data, model behavior, or performance has materially changed.

<hr class="with-no-margin"/>

### Typical Drift Signals

- Input or feature distribution drift
- Training-serving skew
- Prediction or score-distribution drift
- Model-quality degradation once labels or outcomes become available
- Bias, fairness, or cohort-performance drift
- Feature-attribution drift
- Usage, population, or workflow drift
- Retrieval, grounding, or answer-quality drift in RAG and generative AI systems

<hr class="with-no-margin"/>

### Related Standards and Practices

NIST AI RMF Measure 2.4 calls for monitoring the functionality and behavior of AI systems and their components in production. The AI RMF also frames post-deployment monitoring as part of managing emergent AI risks over time.

[NIST AI RMF Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)

<hr class="with-no-margin"/>

The EU AI Act requires providers of high-risk AI systems to establish post-market monitoring that actively and systematically collects, documents, and analyses performance data throughout the system lifetime.

[EU AI Act Article 72: Post-market monitoring](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-72)

<hr class="with-no-margin"/>

Amazon SageMaker Model Monitor provides practitioner terminology for data quality drift, model quality drift, bias drift, and feature attribution drift in deployed machine-learning models.

[Amazon SageMaker Model Monitor](https://docs.aws.amazon.com/sagemaker/latest/dg/model-monitor.html)

<hr class="with-no-margin"/>

Google Vertex AI Model Monitoring supports feature skew and drift detection for deployed models, using configurable thresholds, monitoring windows, sampling, and alerts.

[Google Cloud: Monitor feature skew and drift](https://cloud.google.com/vertex-ai/docs/model-monitoring/using-model-monitoring)

<hr class="with-no-margin"/>

ISO/IEC TR 24028 discusses AI trustworthiness challenges such as distribution shift between training and deployment and concept drift during operation.

[ISO/IEC TR 24028](/standards/iso-24028)

<hr class="with-no-margin"/>

ETSI EN 304 223 includes operational monitoring for AI systems, including anomaly and drift detection, as part of secure maintenance.

[ETSI EN 304 223](/standards/etsi-en-304-223)
