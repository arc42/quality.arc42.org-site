---
title: "Good code readability score"
tags: [maintainable]
related: [readability, legibility, code-readability, code-complexity, maintainability]
stakeholder: developer
permalink: /requirements/good-code-readability-score
---

<div class="quality-requirement" markdown="1">

#### Context

We use the [SonarQube](https://www.sonarsource.com/open-source-editions/) to obtain several kinds of metrics on the system.

All source code requires a [SonarQube cognitive complexity](https://www.sonarsource.com/blog/cognitive-complexity-because-testability-understandability/) score of 15 or lower.

(See their [whitepaper](https://www.sonarsource.com/resources/cognitive-complexity/) for details)


#### Requirement
New and changed production code must stay within a bounded cognitive-complexity limit.

#### Acceptance Criteria

- Every new or changed function/method has cognitive complexity ≤ 15 (static-analysis report, every pull request).
- 100% of new and changed production files are included in the analysis run (CI analysis log, every pull request).
- Merge is blocked within 10 min if either threshold is missed (CI gate log).

</div><br>
