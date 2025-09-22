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
  transform: scale(1.05);
}

.color-name {
  font-size: 1.4em;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-name i {
  font-size: 1.4em;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
}

.color-codes {
  font-size: 0.9em;
  margin-top: 10px;
}

/* colors synced with _todo/updated-color-scheme.html */
/* Qualities */
.q-bg { background-color: #00B8F5; color: #003366; }
.q-ico { color: #003366; }
/* Requirements (moved to soft red) */
.r-bg { background-color: #ffb3b3; color: #8b0000; }
.r-ico { color: #8b0000; }
/* Standards */
.s-bg { background-color: #FFC95C; color: #2C3E50; }
.s-ico { color: #2C3E50; }
/* Articles */
.a-bg { background-color: #E6DAF2; color: #4A148C; }
.a-ico { color: #4A148C; }
/* Properties */
.p-bg { background-color: #f8f9fa; color: #495057; border: 2px solid #dee2e6; }
.p-ico { color: #495057; }
/* Approaches (new, green) */
.ap-bg { background-color: #92EF80; color: #1B5E20; }
.ap-ico { color: #1B5E20; }
</style>

## Color Scheme {#colors}

This site uses a simple color scheme to distinguish between the main content types.

<div class="color-grid">
  <div class="color-grid-item q-bg">
    <div class="color-name"><i class="fa fa-gem q-ico"></i> Qualities</div>
    <div class="color-codes">Background: #00B8F5<br>Text: #003366</div>
  </div>
  <div class="color-grid-item r-bg">
    <div class="color-name"><i class="fa fa-bullseye r-ico"></i> Requirements</div>
    <div class="color-codes">Background: #ffb3b3<br>Text: #8b0000</div>
  </div>
  <div class="color-grid-item s-bg">
    <div class="color-name"><i class="fa fa-award s-ico"></i> Standards</div>
    <div class="color-codes">Background: #FFC95C<br>Text: #2C3E50</div>
  </div>
  <div class="color-grid-item a-bg">
    <div class="color-name"><i class="fa fa-file-lines a-ico"></i> Articles</div>
    <div class="color-codes">Background: #E6DAF2<br>Text: #4A148C</div>
  </div>
  <div class="color-grid-item ap-bg" style="grid-column: 1 / span 2;">
    <div class="color-name"><i class="fa fa-puzzle-piece ap-ico"></i> Approaches</div>
    <div class="color-codes">Background: #92EF80<br>Text: #1B5E20<br>Practices, patterns, tactics, strategies to achieve and support the qualities.</div>
  </div>
</div>
