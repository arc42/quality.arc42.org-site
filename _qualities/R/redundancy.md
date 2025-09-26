---
title: Redundancy
tags: [] 
related: [] 
permalink: /qualities/redundancy
---

The term can be interpreted in two different directions:

The goal (_required quality_) can be twofold: 

* **free of redudancy** (or repetition), avoid duplication
* **have (controlled)** redundancy or repetition, e.g. with redundant hardware or certain parts of systems to avoid downtime due to failures (e.g. due to hardware defects or component/service overload or similar).

  

### Disputed Quality
One of the more disputed qualities of systems or their constituents:

* redudant code was long considered to be harmful, as changes or fixes to such code would be required in all occurences.
 In terms of _organizational coupling_ (i.e. microservices or self-contained-systems) this argument was replaced by potentially faster [time-to-marked](/qualities/time-to-market) or [speed-to-market](/_qualities/speed-to-market).
* redundant data was considered harmful due to higher storage costs. 
 Although this argument is still valid for embedded systems, in many cases storage costs have sunken dramatically, allowing for keeping data redundant (i.e. close to systems or clients needing that data) for [performance](/qualities/performance) reasons.


