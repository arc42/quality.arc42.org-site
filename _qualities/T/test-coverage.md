---
title: Test Coverage
tags: suitable flexible
related: maintainability, flexibility, modifiability, analysability, testability
permalink: /qualities/test-coverage
---


> The term test coverage used in the context of programming / software engineering, refers to measuring how much a software program has been exercised by tests. Coverage is a means of determining the rigour with which the question underlying the test has been answered. There are many kinds of test coverage:
>
>- requirements coverage,
>- code coverage,
>- feature coverage,
>- scenario coverage,
>- screen item coverage,
>- model coverage.

[Wikipedia](https://en.wikipedia.org/wiki/Fault_coverage#Test_coverage_(computing))

## Requirement Coverage

>Requirements coverage analysis determines how well the requirements-based testing verified the implementation of the software requirements and establishes traceability between the software requirements and test cases. The requirement coverage ensures:
>- Did we get a test for each requirement?
>- The requirements are being tested and brings visibility to the results of the tests.
>- Establish the traceability between requirements and test cases.

[https://thecloudstrap.com/](https://thecloudstrap.com/structural-coverage-analysis-sca/)

## Code Coverage

>In computer science, code coverage is a percentage measure of the degree to which the source code of a program is executed when a particular test suite is run.

[Wikipedia](https://en.wikipedia.org/wiki/Code_coverage)

There are different level of code coverages:
- Statement Coverage
- Condition/Decision Coverage
- Modified condition/decision coverage (MC/DC)

### Statement Coverage
>Has each statement in the program been executed?

[Wikipedia](https://en.wikipedia.org/wiki/Code_coverage)

### Condition/Decision Coverage
>Every point of entry and exit in the program has been invoked at least once, every condition in a decision in the program has taken all possible outcomes at least once, and every decision in the program has taken all possible outcomes at least once.

[Wikipedia](https://en.wikipedia.org/wiki/Modified_condition/decision_coverage)

### Modified condition/decision coverage
>Every point of entry and exit in the program has been invoked at least once, every condition in a decision in the program has taken all possible outcomes at least once, and each condition has been shown to affect that decision outcome independently. A condition is shown to affect a decision's outcome independently by varying just that condition while holding fixed all other possible conditions. The condition/decision criterion does not guarantee the coverage of all conditions in the module because in many test cases, some conditions of a decision are masked by the other conditions. Using the modified condition/decision criterion, each condition must be shown to be able to act on the decision outcome by itself, everything else being held fixed. The MC/DC criterion is thus much stronger than the condition/decision coverage.

[Wikipedia](https://en.wikipedia.org/wiki/Modified_condition/decision_coverage)
