---
title: Independence
tags: [flexible]
related: maintainability, modularity, adaptability, configurability, changeability, agility, flexibility, autonomy
permalink: /qualities/independence
---

### Definitions:

> Functional independence is achieved by developing functions that perform only one kind of task and do not excessively interact with other modules. Independence is important because it makes implementation more accessible and faster. The independent modules are easier to maintain, test, and reduce error propagation and can be reused in other programs as well. Thus, functional independence is a good design feature which ensures software quality.
>
> [javatpoint.com](https://www.javatpoint.com/software-engineering-software-design-principles)

<hr class="with-no-margin"/>

[Martin-2018, p. 148](/references/#martin-clean-architecture) states within the frame of software architecture to have independence the

> software architecture must support
>
> - The use cases and operations of the system.
> - The maintenance of the system
> - The development of the system
> - The deployment of the system

#### Use Cases

> Use cases are a very natural way to divide the system. Use cases [...] change for different reasons. 148 Each software module has one, and only one, reason to change.
> [Martin-2018, p. 59](/references/#martin-clean-architecture)

#### Maintenance/Operation

> An architecture that maintains the proper isolation of its components, and does not assume the means of communication between those components, will be much easier to transition through the spectrum of threads, processes, and services as the operational needs of the system change over time.
> [Martin-2018, p. 149](/references/#martin-clean-architecture)

#### Development

> A system that must be developed by an organization with many teams and many concerns must have an architecture that facilitates independent actions by those teams so that teams do not interfere with each other during development. This is accomplished by properly partitioning the system into well-isolated, independently developable components.
> [Martin-2018, p. 150](/references/#martin-clean-architecture)

#### Independent Deployment

> The decoupling of the use cases and layers also affords a high degree of flexibility in deployment. Indeed, if the decoupling is done well, then it should be possible to hot-swap layers and use cases in running systems.
> [Martin-2018, p. 154](/references/#martin-clean-architecture)
