---
title: "Retail demand forecast drift detected before replenishment"
tags: [reliable, operable]
related: [drift-detectability, reliability, data-quality, timeliness]
permalink: /requirements/retail-demand-forecast-drift-before-replenishment
---

### Context

A retail planning system forecasts demand for product groups across stores and regions.
The forecasts drive replenishment decisions, stock allocation, and promotion planning.
Demand can drift because of seasonality, price changes, promotions, competitor behavior, supply constraints, or local events.

### Trigger

New sales, inventory, pricing, promotion, and regional demand data becomes available for the latest planning cycle.

### Acceptance Criteria

- Forecast-error drift: WAPE is evaluated weekly by product group and region; if WAPE degrades by more than **10 percentage points** compared with the rolling 8-week baseline for **2 consecutive weeks**, a planning-review alert is created before the next replenishment run.
- Input drift: price, promotion flag, stockout rate, and regional sales-volume distributions are compared with the rolling 8-week baseline every planning cycle using Population Stability Index (PSI); a breach is recorded when **PSI >= 0.25** for any feature-region pair and is surfaced in the demand-planning dashboard within the same cycle; source: feature-monitoring job.
- Business-impact prioritization: drift alerts identify affected product groups whose forecasted revenue or inventory value is in the top **20%** of the assortment; source: drift report and merchandising hierarchy.
- Data freshness: forecast drift evaluation uses sales and inventory data no older than **24 h** at the time of the replenishment run; stale input data blocks automatic replenishment recommendations for affected regions.
- Review traceability: every drift alert records baseline window, current evaluation window, forecast model version, affected product group, region, and metric values; source: planning audit log.

### Measurement & Verification

MAPE (Mean Absolute Percentage Error) averages the absolute percentage error for individual forecast points. It is intuitive, but can become unstable or undefined when actual demand is zero or very small.

WAPE (Weighted Absolute Percentage Error) measures total absolute forecast error relative to total observed demand:

`WAPE = sum(abs(actual - forecast)) / sum(actual)`

For retail demand planning, WAPE is often preferable because high-volume items contribute proportionally more to the metric and low-volume or zero-demand noise has less impact on the aggregate error.

Reference definitions: [Amazon Forecast accuracy metrics](https://docs.aws.amazon.com/forecast/latest/dg/metrics.html). For methodological background on forecast-accuracy measures, see Hyndman and Koehler, [Another look at measures of forecast accuracy](https://www.robjhyndman.com/papers/forecast-accuracy.pdf).

### Monitoring Artifact

Demand forecast drift dashboard with WAPE trend, input-drift indicators, affected regions/product groups, stale-data blocks, and planner review status.
