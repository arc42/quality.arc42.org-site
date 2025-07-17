---
layout: standards
title: "MISRA C - Guidelines for the use of the C language in critical systems"
permalink: /standards/misra-c
standard_id: misra-c
---

## MISRA C is a set of software development guidelines for the C programming language.

It aims to facilitate code safety, security, portability and reliability in the context of embedded systems, specifically those systems programmed in ISO C / C99 / C11.

## Quality Attributes Required or Emphasized

The guidelines are designed to enforce a safer subset of the C language, which directly impacts several quality attributes:

| Attribute | Relevance in MISRA C |
|:--- |:--- |
| **[Safety](qualities/safety)** | The primary goal. The rules are designed to prevent undefined behavior and common programming errors that can lead to safety hazards. |
| **[Reliability](qualities/reliability)** | Enforced by rules that reduce the likelihood of defects and unexpected behavior. |
| **[Maintainability](qualities/maintainability)** | Promoted through rules that improve code clarity, consistency, and comprehensibility. |
| **[Portability](qualities/portability)** | Addressed by rules that avoid implementation-defined behavior, making the code more portable across different compilers and platforms. |
| **[Security](qualities/security)** | Many rules that enhance safety also contribute to security by preventing vulnerabilities such as buffer overflows and data corruption. |

**Note:** Compliance with MISRA C is often a requirement in safety-critical industries such as automotive, aerospace, and medical devices.

## References

### Official Standards Documents
- The MISRA C guidelines are published by the Motor Industry Software Reliability Association (MISRA).

### Related Standards
- ISO/IEC 9899 - The C programming language standard.

### Additional Resources
- t.b.d
