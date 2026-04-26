## Design Context

### Users
Software architects, consultants, and trainers working with software quality in professional contexts. They visit during design reviews, workshop preparation, or when specifying quality requirements for real projects. Secondary audience includes students and learners exploring quality concepts. Users arrive with domain knowledge but need fast, reliable lookup and clear structure — they're busy professionals, not casual browsers.

### Brand Personality
**Authoritative & clear** meets **approachable & pragmatic**. The arc42 brand is a trusted expert who cuts through complexity without dumbing things down. Think: a senior colleague who gives you the precise answer you need, not a textbook that buries it in theory. Confident but never condescending. Structured but not rigid.

Three words: **precise, pragmatic, trustworthy**.

### Aesthetic Direction
- **Theme**: Light — professionals using this during work hours, often alongside other tools and documents
- **Tone**: Editorial reference — closer to a well-designed technical handbook than a SaaS dashboard or marketing site
- **Existing palette**: Violet header (#682d63), teal/green brand color (#5fb49c), blue accents (#00b8f5), purple contrast (#682d63), warm orange highlights (#ffad80). These colors have identity — lean into them rather than replacing
- **Anti-references**: Should NOT look like a generic SaaS landing page, a startup pitch deck, or an AI-generated dashboard. Should NOT feel like a blog or a wiki
- **Direction**: The graph visualization is the distinctive feature — let it be the hero. Typography and spacing should support dense, scannable content without feeling cramped

### Design Principles
1. **Clarity over decoration** — Every visual element must earn its place by improving comprehension or navigation. No ornament for its own sake.
2. **Structure is the design** — With 220+ qualities, 140+ requirements, and 29 standards, the information architecture IS the interface. Strong typographic hierarchy, clear categorization, and consistent patterns matter more than flashy components.
3. **Professional density** — Respect the user's expertise. Don't over-explain or over-space. Provide dense, scannable content with clear entry points — more like a well-designed reference than a marketing page.
4. **The graph is the signature** — The interactive force-directed graph is what makes this site memorable. Design decisions should support and amplify it, not compete with it.
5. **Pragmatic consistency** — Match the arc42 ethos: practical, no-nonsense, proven. Consistency in spacing, color usage, and component patterns builds trust.
6. **Automated Validation** — Trust but verify. Use link validation (`npm run test:links`), accessibility scans (`make wcag-test`), and performance audits (`make lighthouse-test`) to maintain the "Quality" promise of the site.
7. **Accessibility is non-negotiable** — Target is **WCAG 2.2 AA** across the site. The audience itself includes architects who design for accessibility; failing it visibly is a credibility issue, not just a compliance one. Atkinson Hyperlegible Next is the body face for this reason. See `ACCESSIBILITY.md` for the working contract and review checklist.
