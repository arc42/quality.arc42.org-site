<style>
.color-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 20px;
}

.color-grid-item {
  padding: 20px;
  border-radius: 8px;
  transition: transform 0.2s;
  text-align: left;
}

.color-grid-item:hover {
  transform: scale(1.03);
}

.color-name {
  font-size: 1.25em;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-name i {
  font-size: 1.2em;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

.color-codes {
  font-size: 0.9em;
  margin-top: 10px;
}

.header-preview {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(0, 0, 0, 0.08);
  line-height: 1.35;
}

.header-preview .title {
  font-weight: 700;
}

.header-preview .counter {
  color: #ffad80;
  font-weight: 800;
}

/* synced with TODO/updated-color-scheme-260312.html and _sass/base/_variables.scss */
/* Dimensions */
.d-bg { background-color: #1a3a5c; color: #c8e6f5; }
.d-ico { color: #c8e6f5; }
/* Qualities (Characteristics) */
.q-bg { background-color: #00b8f5; color: #003366; }
.q-ico { color: #003366; }
/* Requirements */
.r-bg { background-color: #ffb3b3; color: #8b0000; }
.r-ico { color: #8b0000; }
/* Standards */
.s-bg { background-color: #ffc95c; color: #2c3e50; }
.s-ico { color: #2c3e50; }
/* Articles */
.a-bg { background-color: #e6daf2; color: #4a148c; }
.a-ico { color: #4a148c; }
/* Approaches */
.ap-bg { background-color: #92ef80; color: #1b5e20; }
.ap-ico { color: #1b5e20; }
/* Trade-offs (relation on approach pages) */
.t-bg { background-color: #fbe9e3; color: #a04323; }
.t-ico { color: #a04323; }
/* Header */
.h-bg { background-color: #357360; color: #deefb7; }
.h-ico { color: #deefb7; }
</style>

## Color Scheme {#colors}

This site uses color coding to distinguish content types and a WCAG-improved header palette.

<div class="color-grid">
  <div class="color-grid-item d-bg">
    <div class="color-name"><i class="fa fa-layer-group d-ico"></i> Dimensions</div>
    <div class="color-codes">Background: #1A3A5C<br>Text: #C8E6F5<br>Contrast: 8.5:1 (AAA)</div>
  </div>
  <div class="color-grid-item q-bg">
    <div class="color-name"><i class="fa fa-gem q-ico"></i> Characteristics</div>
    <div class="color-codes">Background: #00B8F5<br>Text: #003366</div>
  </div>
  <div class="color-grid-item r-bg">
    <div class="color-name"><i class="fa fa-bullseye r-ico"></i> Requirements</div>
    <div class="color-codes">Background: #FFB3B3<br>Text: #8B0000</div>
  </div>
  <div class="color-grid-item s-bg">
    <div class="color-name"><i class="fa fa-award s-ico"></i> Standards</div>
    <div class="color-codes">Background: #FFC95C<br>Text: #2C3E50</div>
  </div>
  <div class="color-grid-item a-bg">
    <div class="color-name"><i class="fa fa-file-lines a-ico"></i> Articles</div>
    <div class="color-codes">Background: #E6DAF2<br>Text: #4A148C</div>
  </div>
  <div class="color-grid-item ap-bg">
    <div class="color-name"><i class="fa fa-puzzle-piece ap-ico"></i> Approaches</div>
    <div class="color-codes">Background: #92EF80<br>Text: #1B5E20</div>
  </div>
  <div class="color-grid-item t-bg">
    <div class="color-name"><i class="fa fa-balance-scale t-ico"></i> Trade-offs (Approach relation)</div>
    <div class="color-codes">Background: #FBE9E3<br>Text/Icon: #A04323<br>Muted: #6B6B6B</div>
  </div>
  <div class="color-grid-item h-bg">
    <div class="color-name"><i class="fa fa-heading h-ico"></i> Site Header</div>
    <div class="color-codes">
      Background: #357360<br>
      Primary text: #DEEFB7<br>
      Counters: #FFAD80
    </div>
    <div class="header-preview">
      <div class="title">arc42 Quality Model</div>
      <div><span class="counter">216</span> quality characteristics, explained.</div>
      <div><span class="counter">133</span> examples of specific requirements.</div>
    </div>
  </div>
</div>

<p><small>Accessibility note: current header colors were tuned for better readability; see <a href="/about/wcag-report/">WCAG Accessibility Report</a>.</small></p>
