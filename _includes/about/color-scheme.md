<style>
.color-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 20px;
}

.color-grid-item {
  --cat: var(--brand-violet);
  min-width: 0;
  padding: 0.9rem 1rem 0.95rem 1.7rem;
  border-radius: var(--radius-md);
  position: relative;
  text-align: left;
  background: var(--brand-paper);
  background: color-mix(in oklab, var(--brand-paper) 86%, var(--cat) 14%);
  border: 1px solid color-mix(in oklab, var(--brand-paper) 65%, var(--cat) 35%);
  transition: transform 0.2s;
}

.color-grid-item::before {
  background: var(--cat);
  border-radius: 3px; /* rail edge — intentional sub-token value */
  bottom: 0.55rem;
  content: "";
  left: 0;
  position: absolute;
  top: 0.55rem;
  width: 8px;
}

.color-grid-item:hover {
  transform: scale(1.02);
}

.color-name {
  font-size: 1.15em;
  font-weight: 700;
  color: var(--brand-ink);
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.color-name i {
  font-size: 1.1em;
  color: var(--cat);
}

.color-codes {
  font-size: 0.9em;
  margin-top: 8px;
  color: var(--brand-muted);
  overflow-wrap: anywhere;
}

.color-codes code {
  background: transparent;
  padding: 0;
  color: var(--brand-ink);
}

.color-grid-item .swatch-row {
  margin-top: 10px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.color-grid-item .swatch {
  display: inline-block;
  width: 22px;
  height: 22px;
  border-radius: var(--radius-xs);
  border: 1px solid rgba(0, 0, 0, 0.12);
}

/* Per-card identity (rail + wash colour) */
.cs-dimensions   { --cat: #1a3a5c; }
.cs-qualities    { --cat: var(--brand-blue); background: color-mix(in oklab, var(--brand-paper) 80%, var(--cat) 20%); }
.cs-requirements { --cat: var(--reqs-background-color); background: color-mix(in oklab, var(--brand-paper) 80%, var(--cat) 20%); }
.cs-standards    { --cat: var(--standard-background-color); background: color-mix(in oklab, var(--brand-paper) 80%, var(--cat) 20%); }
.cs-approaches   { --cat: var(--approaches-background-color); background: color-mix(in oklab, var(--brand-paper) 80%, var(--cat) 20%); }
.cs-tradeoff     { --cat: var(--tradeoff-text-color); }
.cs-articles     { --cat: var(--brand-violet); }

/* Icons that need a darker on-light tint */
.cs-qualities .color-name i { color: var(--brand-blue-accent-dark); }
.cs-standards .color-name i { color: var(--standard-text-color); }
.cs-approaches .color-name i { color: var(--approaches-text-color); }
.cs-requirements .color-name i { color: var(--req-text-color); }
.cs-tradeoff .color-name i { color: var(--tradeoff-text-color); }

@media screen and (max-width: 720px) {
  .color-grid {
    grid-template-columns: 1fr;
  }

  .color-grid-item:hover {
    transform: none;
  }

  .color-name {
    align-items: flex-start;
    font-size: 1.05em;
    line-height: 1.25;
  }
}
</style>

## Color Scheme {#colors}

Each content type carries an identity colour. Cards use a paper background with a coloured rail on the left — the same pattern used across detail pages and section headers, so the colour acts as a wayfinding cue rather than decoration.

<div class="color-grid">
  <div class="color-grid-item cs-dimensions">
    <div class="color-name"><i class="fa fa-layer-group"></i> Dimensions</div>
    <div class="color-codes">Rail / accent: <code>#1A3A5C</code><br>Text on dark fill: <code>#C8E6F5</code> &middot; 8.5:1 (AAA)</div>
    <div class="swatch-row">
      <span class="swatch" style="background: #1a3a5c;" title="#1A3A5C"></span>
      <span class="swatch" style="background: #c8e6f5;" title="#C8E6F5"></span>
    </div>
  </div>

  <div class="color-grid-item cs-qualities">
    <div class="color-name"><i class="fa fa-gem"></i> Characteristics</div>
    <div class="color-codes">Rail / fill: <code>#00B8F5</code><br>Text on fill: <code>#003366</code></div>
    <div class="swatch-row">
      <span class="swatch" style="background: #00b8f5;" title="#00B8F5"></span>
      <span class="swatch" style="background: #003366;" title="#003366"></span>
    </div>
  </div>

  <div class="color-grid-item cs-requirements">
    <div class="color-name"><i class="fa fa-bullseye"></i> Requirements</div>
    <div class="color-codes">Rail / fill: <code>#FFB3B3</code><br>Text on fill: <code>#8B0000</code></div>
    <div class="swatch-row">
      <span class="swatch" style="background: #ffb3b3;" title="#FFB3B3"></span>
      <span class="swatch" style="background: #8b0000;" title="#8B0000"></span>
    </div>
  </div>

  <div class="color-grid-item cs-standards">
    <div class="color-name"><i class="fa fa-award"></i> Standards</div>
    <div class="color-codes">Rail / fill: <code>#FFC95C</code><br>Text on fill: <code>#2C3E50</code></div>
    <div class="swatch-row">
      <span class="swatch" style="background: #ffc95c;" title="#FFC95C"></span>
      <span class="swatch" style="background: #2c3e50;" title="#2C3E50"></span>
    </div>
  </div>

  <div class="color-grid-item cs-approaches">
    <div class="color-name"><i class="fa fa-puzzle-piece"></i> Approaches</div>
    <div class="color-codes">Rail / fill: <code>#92EF80</code><br>Text on fill: <code>#1B5E20</code></div>
    <div class="swatch-row">
      <span class="swatch" style="background: #92ef80;" title="#92EF80"></span>
      <span class="swatch" style="background: #1b5e20;" title="#1B5E20"></span>
    </div>
  </div>

  <div class="color-grid-item cs-tradeoff">
    <div class="color-name"><i class="fa fa-balance-scale"></i> Trade-offs <small style="font-weight: 400; color: var(--brand-muted);">(approach relation)</small></div>
    <div class="color-codes">Rail / accent: <code>#A04323</code><br>Soft fill: <code>#FBE9E3</code> &middot; Muted: <code>#6B6B6B</code></div>
    <div class="swatch-row">
      <span class="swatch" style="background: #a04323;" title="#A04323"></span>
      <span class="swatch" style="background: #fbe9e3;" title="#FBE9E3"></span>
      <span class="swatch" style="background: #6b6b6b;" title="#6B6B6B"></span>
    </div>
  </div>

  <div class="color-grid-item cs-articles">
    <div class="color-name"><i class="fa fa-book-open"></i> Articles &amp; Background Reading</div>
    <div class="color-codes">
      The longform / meta register: articles, background reading, and the how-to guide. Anchored to the site identity rather than to any one content type, so they share the brand violet rail.<br>
      Rail / accent: <code>#682D63</code> &middot; Soft fill: <code>#E6DAF2</code>
    </div>
    <div class="swatch-row">
      <span class="swatch" style="background: #682d63;" title="#682D63"></span>
      <span class="swatch" style="background: #e6daf2;" title="#E6DAF2"></span>
    </div>
  </div>
</div>

<p><small>Accessibility note: identity colours are validated for WCAG contrast on the surfaces they appear on; see <a href="/about/wcag-report/">WCAG Accessibility Report</a> and <a href="/about/lighthouse-report/">Lighthouse Quality Report</a>.</small></p>
