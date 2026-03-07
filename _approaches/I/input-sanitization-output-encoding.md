---
layout: approach
title: "Input Sanitization / Output Encoding"
tags: [secure]
supported_qualities: [security, integrity, robustness, data-integrity, compliance]
supported_qualities_notes:
  security: Neutralizing untrusted data at system boundaries prevents the most common attack classes — injection, cross-site scripting, and command execution.
  integrity: Data stores and downstream systems are protected from corruption caused by malicious payloads embedded in user input.
  robustness: The system handles malformed, unexpected, or adversarial input without crashing, entering undefined states, or leaking internal details.
  data-integrity: Stored data remains clean because malicious content is rejected or neutralized before it reaches the persistence layer.
  compliance: OWASP ASVS and PCI DSS require input validation and output encoding as mandatory controls.
tradeoffs: [performance, usability, code-complexity]
tradeoff_notes:
  performance: Validation, parsing, and encoding at every trust boundary add processing overhead per request, especially for large payloads or complex schemas.
  usability: Strict validation can reject legitimate input that does not match expected patterns (for example international names, special characters in free-text fields).
  code-complexity: Every input path and every output context (HTML, SQL, shell, JSON, URL) requires its own encoding strategy, and missing a single path creates a vulnerability.
related_requirements: [protect-data-by-security-procols, public-api-intrusion-attempts-blocked, access-control-is-enforced]
related_requirements_notes:
  protect-data-by-security-procols: Input sanitization and output encoding are core security protocols for protecting data from injection-based attacks.
  public-api-intrusion-attempts-blocked: Validation at the API boundary is the first line of defense against intrusion attempts.
  access-control-is-enforced: Access control can be bypassed by injection attacks if input is not sanitized — the two controls reinforce each other.
intent: "Neutralize untrusted data at every system boundary so that user-controlled input cannot be interpreted as executable code, query logic, or markup in any downstream context."
mechanism: "Validate all input against strict schemas (type, length, format, allowed characters) and reject what does not conform; encode all output for its specific rendering context (HTML entity encoding, SQL parameterization, shell escaping, URL encoding) so that data is always treated as data, never as code."
applicability: "Use at every trust boundary where untrusted data enters or leaves the system — HTTP request parameters, file uploads, message payloads, database queries, HTML rendering, shell commands, log entries. Particularly critical for web applications, public APIs, and any system that processes user-generated content. No system that accepts external input is exempt."
permalink: /approaches/input-sanitization-output-encoding
---

Injection vulnerabilities — SQL injection, cross-site scripting (XSS), command injection, LDAP injection, log injection — have topped the OWASP Top 10 for over two decades. They all share the same root cause: untrusted data crosses a trust boundary and is interpreted as code, query logic, or markup because the system failed to distinguish data from instructions.

Input sanitization and output encoding address the two sides of this problem. On the input side, validation rejects data that does not conform to expected schemas. On the output side, encoding ensures that when data is rendered in a specific context — HTML page, SQL query, shell command, JSON response — it is treated as literal data, never as executable content.

## How It Works

- Define strict input schemas for every entry point: expected type, length, format, character set, and value range. Reject anything that does not conform (allowlist approach), rather than trying to strip known-bad patterns (denylist approach).
- Use parameterized queries (prepared statements) for all database access — never concatenate user input into SQL, NoSQL, or LDAP query strings.
- Apply context-specific output encoding at every rendering boundary: HTML entity encoding for web pages, URL encoding for query parameters, JavaScript string escaping for inline scripts, shell escaping for OS commands.
- Validate and sanitize file uploads: check MIME type, file extension, file size, and (where possible) file content; store uploads outside the web root with randomized names.
- Sanitize structured input (HTML, Markdown, SVG) with a well-maintained allowlist sanitizer library rather than custom regex.
- Log sanitization events — rejected inputs, encoding failures — to support incident detection and tuning of validation rules.

## Failure Modes

- Denylist-based validation (stripping `<script>` tags, blocking `DROP TABLE`) is trivially bypassed by encoding variations, case changes, or novel attack patterns.
- Validation at the API gateway but not at the service layer: a direct service-to-service call bypasses the gateway and delivers unsanitized input.
- Output encoding applied in the wrong context — for example, HTML-encoding data that is injected into a JavaScript string literal, where JavaScript escaping is required.
- Double encoding: data is encoded twice, producing garbled output for legitimate users while potentially still allowing attacks through decode-then-interpret chains.
- Rich-text fields allow overly permissive HTML, enabling stored XSS that activates when other users view the content.

## Verification

- Automated DAST (Dynamic Application Security Testing): run an injection scanner (OWASP ZAP, Burp Suite) against all public endpoints and verify zero high-severity findings for SQLi, XSS, command injection, and LDAP injection.
- Parameterized-query audit: static analysis scan of all database access code to verify that no query is constructed by string concatenation with user input.
- Context-encoding review: for each output context (HTML body, HTML attribute, JavaScript, CSS, URL, SQL, shell), verify that the correct encoding function is applied and that no raw user data reaches the renderer.
- Fuzzing: send malformed, oversized, and boundary-case inputs to all entry points and verify the system returns appropriate validation errors without crashing, leaking stack traces, or accepting the payload.
- Upload verification: attempt to upload executable files with spoofed MIME types and verify they are rejected or stored safely.

## Variants and Related Tactics

- Content Security Policy (CSP) headers provide a browser-side defense-in-depth layer against XSS by restricting script sources, even if output encoding fails.
- Web Application Firewalls (WAF) add a network-level validation layer but should not replace application-level sanitization.
- [Least Privilege](/approaches/least-privilege) limits the damage of a successful injection: even if an attacker executes a query, the database user has only the minimum required permissions.
- [Strong Authentication (MFA / OIDC)](/approaches/strong-authentication) protects against credential theft that could be achieved through phishing pages injected via XSS.
- [Encryption at Rest + in Transit](/approaches/encryption-at-rest-and-in-transit) protects data confidentiality but does not prevent injection — encrypted malicious input is still malicious after decryption.

## References

- [OWASP Top 10 (2021)](https://owasp.org/Top10/) — A03:2021 Injection remains a top-three risk category
- [OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/) — V5 (Validation, Sanitization and Encoding)
- [OWASP Cheat Sheet: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) — practical guidance for allowlist validation
- [NIST SP 800-53: Security and Privacy Controls](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final) — SI-10 (Information Input Validation)
