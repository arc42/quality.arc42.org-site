# Quality Requirements Template

This document defines the unified structure for quality requirements in the arc42 Quality Model.

## Overview

Quality requirements should be **useful as acceptance criteria** in software development projects. We use a flexible two-tier approach that balances simplicity with the need for context when necessary.

---

## Tier 1: Simple Requirements

Use this structure for straightforward requirements where context is obvious or minimal.

### Structure

```markdown
---
title: "Requirement Title"
tags: [tag1, tag2]
related: [related-quality]
permalink: /requirements/requirement-name
---

<div class="quality-requirement" markdown="1">

#### Requirement
[One clear statement of what must be achieved]

#### Acceptance Criteria
- [Specific, measurable criterion with numeric threshold]
- [Additional criteria if needed]
- [Use concrete metrics: percentages, timeframes, thresholds]

</div><br>
```

### When to Use Tier 1

- ✅ The requirement is self-explanatory
- ✅ Context is obvious from the title
- ✅ Single actor/trigger
- ✅ 1-3 simple acceptance criteria
- ✅ Examples: performance thresholds, simple capacity requirements, test execution time

### Example: Quick Unit Tests

```markdown
---
title: "Quick unit tests"
tags: [operable]
related: [testability]
permalink: /requirements/quick-unit-tests
---

<div class="quality-requirement" markdown="1">

#### Requirement
All automated unit tests for a subsystem must execute quickly to enable rapid feedback during development.

#### Acceptance Criteria
- All unit tests for a subsystem complete in less than 180 seconds
- Test execution time is measured on standard CI/CD infrastructure

</div><br>
```

---

## Tier 2: Complex Requirements

Use this structure when business/technical context is essential to understand the requirement.

### Structure

```markdown
---
title: "Requirement Title"
tags: [tag1, tag2]
related: [related-quality]
permalink: /requirements/requirement-name
---

<div class="quality-requirement" markdown="1">

#### Context
[1-3 sentences explaining the system, business constraint, or why this matters]

#### Trigger
[Who or what initiates this requirement - user action, system event, etc.]

#### Acceptance Criteria
- [Specific, measurable criterion with numeric threshold]
- [Additional criteria...]
- [Use sub-bullets for detailed specifications when needed]
  - [Sub-criterion]
  - [Sub-criterion]

</div><br>
```

### When to Use Tier 2

- ✅ Business/regulatory context is important
- ✅ Multiple stakeholders or complex scenarios
- ✅ 4+ acceptance criteria
- ✅ Compliance or security requirements
- ✅ Examples: access control, data quality, fairness, regulatory compliance

### Example: Access Control Enforcement

```markdown
---
title: Access control is enforced
tags: [secure, suitable]
related: [access-control, auditability]
permalink: /requirements/access-control-is-enforced
---

<div class="quality-requirement" markdown="1">

#### Context
The system operates in a multi-user environment with varying levels of user roles and permissions. Sensitive features and confidential information require role-based access control (RBAC) and audit trails to maintain data security and privacy.

#### Trigger
A user attempts to access a sensitive feature or confidential information within the system.

#### Acceptance Criteria
- 100% of access attempts must be authenticated before granting access to sensitive data
- Multi-factor authentication (MFA) is implemented for highly sensitive data
- User roles are precisely defined with least-privilege access
- 100% of access attempts are logged in a tamper-proof audit trail including user identity, timestamp, accessed data, and outcome
- Access permissions can be revoked immediately with changes effective within 60 seconds
- User sessions automatically timeout after 30 minutes of inactivity
- Access control violations are logged and reported within 5 minutes
- The access control service maintains 99.99% uptime

</div><br>
```

---

## Optional: Measurement & Verification Section

For highly complex requirements that need specific measurement guidance, add an optional fourth section:

### Structure

```markdown
#### Measurement & Verification
- [Specific tooling or calculation methods]
- [Testing approach or monitoring requirements]
- [Specialized terminology definitions if needed]
```

### When to Use

- Requirements with non-obvious measurement methods
- Need for specialized tooling recommendations
- Complex calculations or formulas
- Technical terminology that needs definition

### Example: Adding Measurement Guidance

```markdown
#### Measurement & Verification
- Use automated accessibility testing tools (e.g., axe-core, WAVE) for initial validation
- Perform manual testing with screen readers (JAWS, NVDA, VoiceOver)
- Calculate demographic parity as: max(P(Ŷ=1|A=a)) - min(P(Ŷ=1|A=a)) ≤ 0.10
- Monitor compliance metrics in production dashboard with daily reporting
```

---

## Writing Effective Acceptance Criteria

### Best Practices

1. **Be Specific**: Use concrete numbers, percentages, timeframes
   - ✅ "Response time < 500 milliseconds for 95% of requests"
   - ❌ "System should be fast"

2. **Make Them Measurable**: Each criterion should be testable
   - ✅ "99.9% of duplicate patient records are detected"
   - ❌ "System detects most duplicate records"

3. **Include Units**: Always specify units for measurements
   - ✅ "Deployment completes in less than 2 hours"
   - ❌ "Deployment is quick"

4. **Use Thresholds**: Define acceptable ranges
   - ✅ "Data synchronization latency ≤ 30 seconds"
   - ❌ "Data synchronizes quickly"

5. **Be Testable**: Criteria should map directly to test cases
   - ✅ "100% of failed login attempts are logged within 5 seconds"
   - ❌ "Failed logins are tracked appropriately"

### Common Metrics to Include

- **Percentages**: "95% of users", "99.9% accuracy", "100% compliance"
- **Time bounds**: "within 500 msec", "less than 2 hours", "maximum 30 minutes"
- **Thresholds**: "±10% margin", "20% reduction", "≤ 0.05 difference"
- **Counts**: "zero critical vulnerabilities", "fewer than 2 issues per page"
- **Uptime**: "99.99% availability", "SLA of 99.9%"

---

## Frontmatter Guidelines

### Required Fields

```yaml
---
title: "Human-Readable Requirement Title"
tags: [property-tag1, property-tag2]
related: [related-quality-id]
permalink: /requirements/requirement-id
---
```

### Field Descriptions

- **title**: Clear, descriptive title (shown in navigation and graph)
- **tags**: System properties from tag pages (e.g., `usable`, `secure`, `efficient`)
- **related**: Quality attributes this requirement relates to (by ID)
- **permalink**: Stable URL (last segment becomes node ID in graph - keep stable!)

### Important Notes

- All tags must have corresponding tag pages in `_pages/tag-<tagname>.md`
- Related qualities must exist in `_qualities/`
- Permalinks should use kebab-case and remain stable (graph depends on them)
- No need to specify `layout` - auto-assigned by Jekyll config

---

## Migration from Legacy Formats

### From SEI Classic Format (Background/Source/Stimulus/Reaction/Metric)

**Before:**
```markdown
#### Background
Developer deploys a new version of the application to production

#### Source
Developer

#### Stimulus
Deploys a new version of the application

#### Reaction
Application is fully rolled out in under 2 hours

#### Metric
Deployment does not take longer than 2 hours
```

**After (Tier 2):**
```markdown
#### Context
The development team needs to deploy application updates frequently with minimal downtime.

#### Trigger
Developer initiates deployment of a new version to production.

#### Acceptance Criteria
- Deployment to all production servers completes in less than 2 hours
- Zero downtime during deployment
- Rollback capability available within 5 minutes if issues detected
```

### From Minimal Format (Simple Statement)

**Before:**
```markdown
It takes less than 180 seconds to run all automated unit-tests for a subsystem or component.
```

**After (Tier 1):**
```markdown
#### Requirement
All automated unit tests for a subsystem must execute quickly to enable rapid feedback.

#### Acceptance Criteria
- All unit tests complete in less than 180 seconds
- Measured on standard CI/CD infrastructure
```

### From Extended SEI Format (with Artifact/Environment)

Merge Artifact and Environment details into **Context** section:

**Before:**
```markdown
#### Source
Person with visual impairment using screen reader

#### Artifact
Web application

#### Environment
Standard browser with latest screen reader version
```

**After:**
```markdown
#### Context
The web application must be accessible to users with visual impairments who navigate using screen readers in standard web browsers.

#### Trigger
A user with a screen reader attempts to navigate and interact with the application.
```

---

## Validation Checklist

Before committing a new or updated requirement:

- [ ] Frontmatter includes all required fields (title, tags, related, permalink)
- [ ] All tags have corresponding tag pages in `_pages/`
- [ ] All related qualities exist in `_qualities/`
- [ ] Acceptance criteria are specific and measurable
- [ ] Numeric thresholds include units
- [ ] Each criterion is testable
- [ ] Context explains WHY when not obvious
- [ ] Trigger clearly identifies WHO/WHAT initiates
- [ ] Appropriate tier (1 or 2) chosen based on complexity

---

## Testing Your Requirements

After creating/updating requirements:

```bash
# Regenerate graph data
npm run data

# Validate all links and references
npm run test:links

# Start development server to verify rendering
docker compose up
```

---

## Examples by Domain

### Performance Requirements (Usually Tier 1)

```markdown
#### Requirement
Search results must be displayed near-instantly to maintain user engagement.

#### Acceptance Criteria
- First search result appears within 500 milliseconds
- Additional results load progressively without blocking UI
- 95th percentile response time remains under 800 milliseconds
```

### Security Requirements (Usually Tier 2)

```markdown
#### Context
The payroll system handles sensitive employee compensation data and must prevent unauthorized modifications while maintaining audit trails for compliance.

#### Trigger
A user attempts to access or modify employee pay rate information.

#### Acceptance Criteria
- Unauthorized access attempts are detected and blocked with 100% accuracy
- All access attempts are logged in tamper-proof audit trail within 5 seconds
- Compromised data is restored from backups within 1 business day
- Security violations trigger immediate alerts to security team
```

### Data Quality Requirements (Usually Tier 2)

```markdown
#### Context
Healthcare system manages patient data across multiple departments where poor data quality could lead to incorrect diagnoses or medication errors.

#### Trigger
Patient data is entered, updated, or accessed throughout the care journey.

#### Acceptance Criteria
- Patient identification duplicate detection rate ≥ 99.9%
- Critical clinical fields (allergies, medications, diagnoses) are 100% complete
- Laboratory results available within 5 minutes with 99.9% reliability
- Data validation prevents 100% of impossible values and missing mandatory fields
- Complete audit trail maintained with 100% traceability
```

### Accessibility Requirements (Often Tier 2)

```markdown
#### Context
The web application must comply with WCAG 2.1 Level AA standards to ensure accessibility for users with disabilities.

#### Trigger
A user with visual impairment navigates the application using a screen reader.

#### Acceptance Criteria
- 95% of interactive elements are navigable with screen reader
- 98% of content is accessible and consumable
- 95% of functionality can be used without accessibility barriers
- Messages and errors announced with 99% accuracy
- Page load times remain under 3 seconds despite accessibility enhancements
- Zero critical WCAG violations in automated testing
- Maximum 2 issues per page in manual testing
```

---

## Support & Resources

- **Validation Script**: Run `npm run test:links` to check references
- **Graph Data**: Run `npm run data` to regenerate after changes
- **CLAUDE.md**: Comprehensive guide for AI assistants
- **WCAG Guidelines**: https://www.w3.org/TR/WCAG21/
- **ISO 25010**: Quality model standard reference

---

**Last Updated**: 2025-11-29

This template ensures quality requirements are simple, testable, and immediately useful as acceptance criteria in software development projects.
