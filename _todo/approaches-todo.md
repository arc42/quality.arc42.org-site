# Top 10 Proposed Solution Approaches

This list proposes the next 10 architectural tactics/patterns to document, prioritizing high-impact approaches that cover a broad range of quality attributes.

| Name | Useful For (Supported Qualities) | Trade-offs (Negative Impact) |
| :--- | :--- | :--- |
| **Circuit Breaker** | **Reliability** (Availability, Fault Tolerance), **Operability** (Recoverability) | **Complexity** (State management), **Consistency** (If fallbacks return stale data/defaults), **Usability** (Partial functionality). |
| **Rate Limiting** | **Reliability** (Availability), **Security** (DoS Protection) | **Usability** (Legitimate users blocked), **Complexity** (Distributed state management for limits). |
| **Bulkheads** | **Reliability** (Fault Tolerance, Fault Isolation) | **Efficiency** (Resource underutilization due to reserved capacity), **Complexity** (Configuration tuning). |
| **CQRS** (Command Query Responsibility Segregation) | **Efficiency** (Performance, Scalability), **Security** (Granular access control) | **Complexity** (High implementation effort), **Consistency** (Eventual consistency lag), **Operability** (More moving parts). |
| **API Gateway** | **Usability** (Client simplicity), **Security** (Centralized auth/monitoring), **Operability** (Observability) | **Reliability** (Single point of failure), **Efficiency** (Added latency hop), **Complexity** (Routing logic maintenance). |
| **Blue/Green Deployment** | **Reliability** (Availability during updates), **Operability** (Deployability, Recoverability) | **Efficiency** (Cost - requires double infrastructure), **Complexity** (Database schema migration/compatibility). |
| **Immutable Infrastructure** | **Operability** (Stability, Reproducibility), **Security** (Integrity) | **Efficiency** (Build/Deploy time latency), **Flexibility** (Cannot hot-patch live systems). |
| **Least Privilege** | **Security** (Confidentiality, Integrity) | **Usability** (Friction for users/devs), **Operability** (High administrative overhead for permission management). |
| **Asynchronous Messaging** | **Efficiency** (Scalability), **Reliability** (Decoupling) | **Consistency** (Eventual consistency), **Operability** (Debugging/tracing difficulty), **Complexity** (Error handling/dead-letter queues). |
| **Database Sharding** | **Efficiency** (Scalability, Performance) | **Flexibility** (Re-sharding is hard), **Operability** (Backup/restore complexity), **Functionality** (Cross-shard joins difficult/impossible). |
