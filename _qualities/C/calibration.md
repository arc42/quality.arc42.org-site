---
title: Calibration
tags: [reliable, suitable]
related:
  [
    groundedness,
    accuracy,
    precision,
    correctness,
    model-transparency,
    explainability,
    fairness,
    reliability,
  ]
standards: [nistairmf, iso24028]
permalink: /qualities/calibration
---

Calibration is a quality mainly relevant for AI and machine-learning systems whose outputs include a probability, confidence score, risk band, or any other quantitative expression of certainty that downstream consumers, humans, or automated systems may act on.

### Definition

Calibration is the degree to which the stated certainty of a system's outputs corresponds to the empirical frequency with which those outputs are correct, over a representative population of inputs and within defined population, time, and refusal conditions.

A perfectly calibrated classifier that assigns probability `p` to an event is correct on a fraction `p` of such events over the long run. A system can additionally be calibrated in a stronger sense by recognizing inputs on which it should refrain from producing a confident answer at all.

Calibration is related to, but not the same as, [accuracy](/qualities/accuracy). Accuracy concerns how often the system is correct; calibration concerns whether the system's expressed confidence matches its actual correctness. A model can be highly accurate yet systematically overconfident, or modestly accurate yet honest about its uncertainty.

Calibration is also distinct from [groundedness](/qualities/groundedness). Groundedness asks whether an output is supported by specified sources; calibration asks whether the certainty attached to an output is warranted. An answer can be grounded yet overconfident, or refused with appropriate uncertainty without ever consulting a source.

The term *calibration* additionally appears inside [fairness](/qualities/fairness) as *calibration within groups* — predicted probabilities matching observed frequencies per protected group. Group calibration is a fairness-specific application of the general calibration property defined here.

This definition is derived from the established usage and evaluation practices below.

<hr class="with-no-margin"/>

### Examples

#### Medical

>A radiology assistant reports a 92% probability of pneumonia on a chest X-ray. If, across 1,000 such 92%-confident predictions, the finding is actually present in only about 730 cases, the model is overconfident by roughly 20 points. A triage policy that fast-tracks patients above 90% confidence will then over-admit, while clinicians who learn to discount the score lose the ability to act on cases where high confidence is genuinely warranted.

#### Software Engineering

>A code assistant rates each suggested fix with a self-reported confidence. 
>Over a week of usage, suggestions tagged "90% sure" turn out to compile and pass tests only 60% of the time. A CI rule set to auto-merge above 85% confidence will then silently land many broken patches. Re-calibrating the score — or having the assistant refuse to rate fixes outside its training distribution — restores the meaning of the threshold.

<hr class="with-no-margin"/>

### Typical Calibration Signals

- Reliability diagrams — predicted probability plotted against observed frequency to visualize over- or underconfidence.
- Expected Calibration Error (ECE) and Maximum Calibration Error (MCE) — average and worst-case gap between stated confidence and observed accuracy, bucketed by confidence level.
- Brier score with calibration–refinement decomposition — mean squared error between predicted probability and outcome, split into a *calibration* term (does confidence match reality) and a *refinement* term (how sharply confidence varies).
- Negative log-likelihood on held-out data — proper scoring rule that penalizes confident wrong answers more than uncertain ones.
- Selective accuracy and risk–coverage curves — accuracy on the subset the model chooses to answer, plotted against the fraction of inputs answered (the rest are abstained).
- Refusal rate and correct-refusal precision under out-of-distribution or low-confidence inputs — how often the system declines, and whether its declines align with genuinely hard cases.
- Cohort calibration across subpopulations, time windows, or input difficulty bands — calibration holding within slices, not just on average.

<hr class="with-no-margin"/>

### Related definitions and practices

Guo, Pleiss, Sun, and Weinberger formalized calibration for modern deep networks, defining a perfectly calibrated model as one where the predicted confidence equals the true probability of correctness, and introducing Expected Calibration Error as the standard scalar metric. They showed that contemporary deep networks are typically miscalibrated despite being highly accurate.

[Guo et al., 2017 — On Calibration of Modern Neural Networks (ICML)](https://arxiv.org/abs/1706.04599)

<hr class="with-no-margin"/>

DeGroot and Fienberg established the statistical foundation of calibration for probabilistic forecasters, decomposing the Brier score into calibration and refinement components and formalizing reliability diagrams as the canonical assessment tool.

[DeGroot and Fienberg, 1983 — The Comparison and Evaluation of Forecasters](https://www.jstor.org/stable/2987588)

<hr class="with-no-margin"/>

NIST AI RMF treats validity, reliability, and managed uncertainty as core trustworthiness characteristics. Measure 2.5 expects AI system performance to be evaluated and documented, including the conditions under which the system can be expected to operate reliably and the limits of that reliability.

[NIST AI RMF Core — Measure](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)

<hr class="with-no-margin"/>

ISO/IEC TR 24028 discusses uncertainty as a core challenge for AI trustworthiness, including epistemic and aleatoric sources of uncertainty and the need for systems to surface uncertainty rather than mask it.

[ISO/IEC TR 24028](/standards/iso-24028)

<hr class="with-no-margin"/>

El-Yaniv and Wiener formalized *selective prediction*, in which a classifier may abstain on inputs where confidence is below a threshold, and characterized the trade-off between coverage and selective risk. This is the operational counterpart of calibration when systems are permitted to refuse rather than answer.

[El-Yaniv and Wiener, 2010 — On the Foundations of Noise-free Selective Classification](https://www.jmlr.org/papers/volume11/el-yaniv10a/el-yaniv10a.pdf)
