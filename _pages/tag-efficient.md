---
layout: page
title: "#efficient"
hide: true
permalink: /tag-efficient/
---

<div class="arc42-help" markdown="1">

* Resource-efficient, fast, low-footprint, low latency.
* Energy-, storage- and network efficient, having adequate capacity
* Development-efficient, beeing easy to change (although that aspect may better be covered by [#flexible](/tag-flexible))
* Time-to-market, how efficient new features can _go live_
  

</div><br>

### Definitions


>capable of producing desired results with little or no waste (as of time or materials) 
>
>[Merriam-Webster](https://www.merriam-webster.com/dictionary/efficient)

<hr>

> The amount of computing resources and code required by a program to perform a function.
>
> [McCall-1978](/references/#mccall)

### Effective vs Efficient

>The words effective and efficient both mean "capable of producing a result," but there is an important difference. Effective means "producing a result that is wanted". Efficient means "capable of producing desired results without wasting materials, time, or energy".
>The difference is that when something is effective it produces a result even if it takes some unnecessary resources to do so. When something is efficient, not only does it produce a result, but it does so in a quick or simple way using as little material, time, effort, or energy as possible. The following example sentences show how the two words are used.
>* The 200-page instruction manual was effective (_=successful_) in teaching the teen to repair the car himself, but it would have been more efficient (_=faster and easier_) for someone to show him.
>* His disorganized method of cleaning the house was effective but it was not efficient; in the end, the house was clean, but it took much longer than it should have.
>
>The word _effective_ puts more attention on the actual ability to produce a desired result. The word _efficient_ puts more attention on the lack of waste in producing that result.
>
>[Britannica Dictionary](https://www.britannica.com/dictionary/eb/qa/How-to-Use-Effective-and-Efficient)


## Typical Acceptance Criteria

Efficient, as we saw above, can mean several different things:

* efficient at runtime, like defined by specific time behavior, resource consumption (e.g. energy, memory, processes, threads, network) or capacity (throughput, volume processed)
* efficient to change or modify something within the system or its infrastructure
* efficient concerning energy or CO2 consumption
* efficient development processes, like short time-to-market

### Scenario Response Measures from [Bass et al.]

>* The (maximum, medium, mean median) time the response takes ([[latency](/qualities/latency)])
>* The number or percentage of satisfied requests over some time interval (throughput) or set of events received
>* The number or percentage of requests that go unsatisfied
>* The variation in response time (jitter)
>* Usage level of a computing resource
>
>[Bass et. al, 2022](/references/#bass-swa-practice)


<!-- include all qualities associated with this tag -->
{% include one-quality.md topic="efficient"  %}
