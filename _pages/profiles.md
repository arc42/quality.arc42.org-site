---
layout: page
title: Domain Quality Profiles
permalink: /profiles/
order: 15
---

> **Draft** — This page is a work in progress. Profile detail pages are not yet linked.

A Domain Quality Profile is a **curated entry point** into the arc42 Quality Model — not new content, but a guided selection of the characteristics, requirements, and standards that are typically most relevant for a specific type of system.

The Q42 reference holds {{ site.qualities | size }} quality characteristics, {{ site.requirements | size }} example requirements, and {{ site.standards | size }} standards. That breadth is a strength, but it creates a cold-start problem: *"Where do I begin for my system?"* Profiles answer that question. Each profile picks and prioritises the subset that matters most for one recognisable system type, then explains *why* those qualities dominate.

Profiles are explicitly **starting points, not checklists**. Use them to seed your initial quality backlog, then add, drop, or reprioritise as you learn more about your actual system.

---

## How profiles are classified

Every profile is described along five independent axes. Changing any single axis while holding the others constant shifts which quality characteristics dominate — that is the acid test each axis had to pass to be included.

| Axis | Values | What it shifts |
|:-----|:-------|:---------------|
| **Audience** | mass-market · professional · internal | Usability depth, accessibility, onboarding vs. power-user efficiency |
| **Regulation** | safety-critical · compliance · light | Certifiability, auditability, traceability rigour |
| **Platform** | web · mobile · embedded · cloud | Resource constraints, deployment model, device diversity |
| **Criticality** | life-critical · business-critical · convenience | Fault tolerance, recovery targets, testing depth |
| **Interaction style** | transactional · informational · collaborative · monitoring · immersive · batch/pipeline · offline-field | Data integrity patterns, latency profiles, sync strategy |

Each profile card also shows a **change frequency indicator** (●●● continuous · ●●○ periodic · ●○○ rare/costly) as a visible property rather than a filter axis — nobody searches "show me all fast-changing systems," but the pace of change strongly determines how much weight the [#maintainable](/tag-maintainable) and [#flexible](/tag-flexible) dimensions receive.

---

## The 12 profiles

<div class="dqp-grid">

  <div class="dqp-card">
    <div class="dqp-card-head">
      <span class="dqp-num">01</span>
      <span class="dqp-change" title="Continuous change">●●●</span>
    </div>
    <h3 class="dqp-title">E-commerce / Online shop</h3>
    <p class="dqp-desc">Consumer-facing shop with checkout, payment, and fulfilment. Extreme peak loads, cart integrity, and payment reliability are non-negotiable.</p>
    <div class="dqp-axes">
      <span class="dqp-pill audience">mass</span>
      <span class="dqp-pill regulation">light</span>
      <span class="dqp-pill platform">web</span>
      <span class="dqp-pill criticality">biz-crit</span>
      <span class="dqp-pill interaction">transactional</span>
    </div>
    <div class="dqp-dims">
      <a href="/tag-reliable">#reliable</a>
      <a href="/tag-efficient">#efficient</a>
      <a href="/tag-secure">#secure</a>
      <a href="/tag-usable">#usable</a>
    </div>
  </div>

  <div class="dqp-card">
    <div class="dqp-card-head">
      <span class="dqp-num">02</span>
      <span class="dqp-change" title="Continuous change">●●●</span>
    </div>
    <h3 class="dqp-title">SaaS / Cloud platform (B2B)</h3>
    <p class="dqp-desc">Multi-tenant cloud service for professional teams. Uptime SLAs, data isolation, and collaborative workflows drive the quality agenda.</p>
    <div class="dqp-axes">
      <span class="dqp-pill audience">professional</span>
      <span class="dqp-pill regulation">compliance</span>
      <span class="dqp-pill platform">cloud</span>
      <span class="dqp-pill criticality">biz-crit</span>
      <span class="dqp-pill interaction">collaborative</span>
    </div>
    <div class="dqp-dims">
      <a href="/tag-reliable">#reliable</a>
      <a href="/tag-secure">#secure</a>
      <a href="/tag-maintainable">#maintainable</a>
      <a href="/tag-operable">#operable</a>
    </div>
  </div>

  <div class="dqp-card">
    <div class="dqp-card-head">
      <span class="dqp-num">03</span>
      <span class="dqp-change" title="Periodic change">●●○</span>
    </div>
    <h3 class="dqp-title">Banking / Financial services</h3>
    <p class="dqp-desc">Regulated financial transactions and account management. Data integrity, auditability, and regulatory compliance are paramount.</p>
    <div class="dqp-axes">
      <span class="dqp-pill audience">mass</span>
      <span class="dqp-pill regulation">compliance</span>
      <span class="dqp-pill platform">web</span>
      <span class="dqp-pill criticality">biz-crit</span>
      <span class="dqp-pill interaction">transactional</span>
    </div>
    <div class="dqp-dims">
      <a href="/tag-secure">#secure</a>
      <a href="/tag-reliable">#reliable</a>
      <a href="/tag-suitable">#suitable</a>
      <a href="/tag-operable">#operable</a>
    </div>
  </div>

  <div class="dqp-card">
    <div class="dqp-card-head">
      <span class="dqp-num">04</span>
      <span class="dqp-change" title="Rare / costly change">●○○</span>
    </div>
    <h3 class="dqp-title">Medical device / Health IT</h3>
    <p class="dqp-desc">Software for clinical or patient-facing use. Safety certification, traceability, and fault containment dominate all other concerns.</p>
    <div class="dqp-axes">
      <span class="dqp-pill audience">professional</span>
      <span class="dqp-pill regulation">safety-critical</span>
      <span class="dqp-pill platform">embedded</span>
      <span class="dqp-pill criticality">life-critical</span>
      <span class="dqp-pill interaction">monitoring</span>
    </div>
    <div class="dqp-dims">
      <a href="/tag-safe">#safe</a>
      <a href="/tag-reliable">#reliable</a>
      <a href="/tag-suitable">#suitable</a>
      <a href="/tag-maintainable">#maintainable</a>
    </div>
  </div>

  <div class="dqp-card">
    <div class="dqp-card-head">
      <span class="dqp-num">05</span>
      <span class="dqp-change" title="Rare / costly change">●○○</span>
    </div>
    <h3 class="dqp-title">Railway / Transportation</h3>
    <p class="dqp-desc">Safety-critical control or information systems for rail, aviation, or automotive. EN 50128 / DO-178C / ISO 26262 certification shapes every decision.</p>
    <div class="dqp-axes">
      <span class="dqp-pill audience">professional</span>
      <span class="dqp-pill regulation">safety-critical</span>
      <span class="dqp-pill platform">embedded</span>
      <span class="dqp-pill criticality">life-critical</span>
      <span class="dqp-pill interaction">monitoring</span>
    </div>
    <div class="dqp-dims">
      <a href="/tag-safe">#safe</a>
      <a href="/tag-reliable">#reliable</a>
      <a href="/tag-operable">#operable</a>
      <a href="/tag-maintainable">#maintainable</a>
    </div>
  </div>

  <div class="dqp-card">
    <div class="dqp-card-head">
      <span class="dqp-num">06</span>
      <span class="dqp-change" title="Continuous change">●●●</span>
    </div>
    <h3 class="dqp-title">Mobile app (consumer)</h3>
    <p class="dqp-desc">Native or hybrid app for end-users on iOS/Android. Battery efficiency, responsiveness, accessibility, and app-store compliance set the bar.</p>
    <div class="dqp-axes">
      <span class="dqp-pill audience">mass</span>
      <span class="dqp-pill regulation">light</span>
      <span class="dqp-pill platform">mobile</span>
      <span class="dqp-pill criticality">convenience</span>
      <span class="dqp-pill interaction">informational</span>
    </div>
    <div class="dqp-dims">
      <a href="/tag-usable">#usable</a>
      <a href="/tag-efficient">#efficient</a>
      <a href="/tag-reliable">#reliable</a>
      <a href="/tag-maintainable">#maintainable</a>
    </div>
  </div>

  <div class="dqp-card">
    <div class="dqp-card-head">
      <span class="dqp-num">07</span>
      <span class="dqp-change" title="Rare / costly change">●○○</span>
    </div>
    <h3 class="dqp-title">Embedded / IoT system</h3>
    <p class="dqp-desc">Firmware or edge software on resource-constrained hardware. Memory, power, and long service life demand extreme efficiency and longevity.</p>
    <div class="dqp-axes">
      <span class="dqp-pill audience">internal</span>
      <span class="dqp-pill regulation">compliance</span>
      <span class="dqp-pill platform">embedded</span>
      <span class="dqp-pill criticality">biz-crit</span>
      <span class="dqp-pill interaction">monitoring</span>
    </div>
    <div class="dqp-dims">
      <a href="/tag-efficient">#efficient</a>
      <a href="/tag-reliable">#reliable</a>
      <a href="/tag-safe">#safe</a>
      <a href="/tag-maintainable">#maintainable</a>
    </div>
  </div>

  <div class="dqp-card">
    <div class="dqp-card-head">
      <span class="dqp-num">08</span>
      <span class="dqp-change" title="Periodic change">●●○</span>
    </div>
    <h3 class="dqp-title">Data platform / ML pipeline</h3>
    <p class="dqp-desc">Internal data engineering or ML training infrastructure. Throughput, reproducibility, lineage tracing, and data quality govern the system.</p>
    <div class="dqp-axes">
      <span class="dqp-pill audience">internal</span>
      <span class="dqp-pill regulation">light</span>
      <span class="dqp-pill platform">cloud</span>
      <span class="dqp-pill criticality">biz-crit</span>
      <span class="dqp-pill interaction">batch/pipeline</span>
    </div>
    <div class="dqp-dims">
      <a href="/tag-efficient">#efficient</a>
      <a href="/tag-reliable">#reliable</a>
      <a href="/tag-operable">#operable</a>
      <a href="/tag-flexible">#flexible</a>
    </div>
  </div>

  <div class="dqp-card">
    <div class="dqp-card-head">
      <span class="dqp-num">09</span>
      <span class="dqp-change" title="Continuous change">●●●</span>
    </div>
    <h3 class="dqp-title">Content / News portal</h3>
    <p class="dqp-desc">High-traffic editorial or publishing platform. Read-heavy workloads, SEO, accessibility, and fast global delivery are the defining constraints.</p>
    <div class="dqp-axes">
      <span class="dqp-pill audience">mass</span>
      <span class="dqp-pill regulation">light</span>
      <span class="dqp-pill platform">web</span>
      <span class="dqp-pill criticality">convenience</span>
      <span class="dqp-pill interaction">informational</span>
    </div>
    <div class="dqp-dims">
      <a href="/tag-efficient">#efficient</a>
      <a href="/tag-usable">#usable</a>
      <a href="/tag-reliable">#reliable</a>
      <a href="/tag-operable">#operable</a>
    </div>
  </div>

  <div class="dqp-card">
    <div class="dqp-card-head">
      <span class="dqp-num">10</span>
      <span class="dqp-change" title="Periodic change">●●○</span>
    </div>
    <h3 class="dqp-title">ERP / Enterprise backend</h3>
    <p class="dqp-desc">Core business process system (finance, HR, procurement). Data integrity, auditability, integration breadth, and longevity are the dominant concerns.</p>
    <div class="dqp-axes">
      <span class="dqp-pill audience">internal</span>
      <span class="dqp-pill regulation">compliance</span>
      <span class="dqp-pill platform">cloud</span>
      <span class="dqp-pill criticality">biz-crit</span>
      <span class="dqp-pill interaction">transactional</span>
    </div>
    <div class="dqp-dims">
      <a href="/tag-suitable">#suitable</a>
      <a href="/tag-reliable">#reliable</a>
      <a href="/tag-secure">#secure</a>
      <a href="/tag-flexible">#flexible</a>
    </div>
  </div>

  <div class="dqp-card">
    <div class="dqp-card-head">
      <span class="dqp-num">11</span>
      <span class="dqp-change" title="Periodic change">●●○</span>
    </div>
    <h3 class="dqp-title">Government / Public sector</h3>
    <p class="dqp-desc">Digital services for citizens or public agencies. Accessibility legislation, data sovereignty, transparency, and inclusive design are mandatory.</p>
    <div class="dqp-axes">
      <span class="dqp-pill audience">mass</span>
      <span class="dqp-pill regulation">compliance</span>
      <span class="dqp-pill platform">web</span>
      <span class="dqp-pill criticality">biz-crit</span>
      <span class="dqp-pill interaction">informational</span>
    </div>
    <div class="dqp-dims">
      <a href="/tag-usable">#usable</a>
      <a href="/tag-secure">#secure</a>
      <a href="/tag-suitable">#suitable</a>
      <a href="/tag-reliable">#reliable</a>
    </div>
  </div>

  <div class="dqp-card">
    <div class="dqp-card-head">
      <span class="dqp-num">12</span>
      <span class="dqp-change" title="Periodic change">●●○</span>
    </div>
    <h3 class="dqp-title">Mobile game</h3>
    <p class="dqp-desc">Entertainment app with real-time or asynchronous gameplay. Frame-rate consistency, session responsiveness, and engaging UX outweigh durability concerns.</p>
    <div class="dqp-axes">
      <span class="dqp-pill audience">mass</span>
      <span class="dqp-pill regulation">light</span>
      <span class="dqp-pill platform">mobile</span>
      <span class="dqp-pill criticality">convenience</span>
      <span class="dqp-pill interaction">immersive</span>
    </div>
    <div class="dqp-dims">
      <a href="/tag-efficient">#efficient</a>
      <a href="/tag-usable">#usable</a>
      <a href="/tag-reliable">#reliable</a>
      <a href="/tag-flexible">#flexible</a>
    </div>
  </div>

</div>

---

## Base profiles and variants

Many system types encompass significantly different sub-domains. An e-commerce shop for pharmaceuticals has fundamentally different quality priorities than one for fashion or event tickets — yet both are "e-commerce." To handle this, each profile has a **base layer** (what all systems of this type share) and a set of **variant cards** on the detail page describing how specific sub-domains shift those priorities.

For example, the e-commerce profile defines six variants: ticketing/events, regulated goods, custom/print-on-demand, fashion/high-return, marketplace/multi-vendor, and subscription/recurring. Each variant lists the additional characteristics it activates, keeping the overview clean (12 cards) while providing real depth when you navigate to a specific profile.

---

## Relationship to the Q42 domain model

In the Q42 domain language — dimensions → characteristics → requirements → standards → approaches — a Domain Quality Profile sits as a curatorial layer *around* these existing building blocks. It does not introduce new quality concepts; it selects and prioritises existing ones for a recognisable system type.

That distinction matters: profiles can be updated as the Q42 collection grows without redesigning the underlying model. Add a new requirement to [#reliable](/tag-reliable) and it automatically becomes available to every profile that draws on that dimension.

<style>
  /* ── DQP page styles ─────────────────────────────────────────── */
  .dqp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .dqp-card {
    border: 2px dashed #4caf50;
    border-radius: 12px;
    padding: 1rem 1.1rem 0.9rem;
    background: #f6fdf6;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .dqp-card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .dqp-num {
    font-size: 0.72rem;
    font-weight: 800;
    color: #2e7d32;
    letter-spacing: 0.06em;
    background: #c8e6c9;
    border-radius: 999px;
    padding: 0.1rem 0.5rem;
  }

  .dqp-change {
    font-size: 0.82rem;
    color: #388e3c;
    letter-spacing: 0.06em;
    font-variant-numeric: tabular-nums;
  }

  .dqp-title {
    margin: 0;
    font-size: 1rem;
    line-height: 1.3;
    color: #1b5e20;
  }

  .dqp-desc {
    margin: 0;
    font-size: 0.85rem;
    color: #3a5a3c;
    line-height: 1.45;
  }

  .dqp-axes {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
  }

  .dqp-pill {
    font-size: 0.72rem;
    font-weight: 700;
    border-radius: 999px;
    padding: 0.12rem 0.5rem;
    white-space: nowrap;
  }

  .dqp-pill.audience   { background: #e3f2fd; color: #1565c0; }
  .dqp-pill.regulation { background: #fce4ec; color: #880e4f; }
  .dqp-pill.platform   { background: #fff3e0; color: #e65100; }
  .dqp-pill.criticality{ background: #f3e5f5; color: #6a1b9a; }
  .dqp-pill.interaction{ background: #e8f5e9; color: #1b5e20; }

  .dqp-dims {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    margin-top: 0.1rem;
  }

  .dqp-dims a {
    font-size: 0.77rem;
    font-weight: 700;
    color: #00829b;
    text-decoration: none;
    border: 1px solid #b3e5f1;
    border-radius: 4px;
    padding: 0.08rem 0.38rem;
    background: #e0f7fa;
  }

  .dqp-dims a:hover {
    background: #b2ebf2;
    text-decoration: none;
  }

  @media (max-width: 480px) {
    .dqp-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
