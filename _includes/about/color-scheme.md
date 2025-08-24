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
}

.color-grid-item:hover {
  transform: scale(1.05);
}

.color-name {
  font-size: 1.5em;
  font-weight: bold;
}

.color-codes {
  font-size: 0.9em;
  margin-top: 10px;
}
</style>

## Color Scheme

This site uses a simple color scheme to distinguish between the main content types.

<div class="color-grid">
  <div class="color-grid-item" style="background-color: #00B8F5; color: #003366;">
    <div class="color-name">Qualities</div>
    <div class="color-codes">
      Background: #00B8F5<br>
      Text: #003366
    </div>
  </div>
  <div class="color-grid-item" style="background-color: #92EF80; color: #1B5E20;">
    <div class="color-name">Requirements</div>
    <div class="color-codes">
      Background: #92EF80<br>
      Text: #1B5E20
    </div>
  </div>
  <div class="color-grid-item" style="background-color: #FFC95C; color: #2C3E50;">
    <div class="color-name">Standards</div>
    <div class="color-codes">
      Background: #FFC95C<br>
      Text: #2C3E50
    </div>
  </div>
  <div class="color-grid-item" style="background-color: #E6DAF2; color: #003366;">
    <div class="color-name">Articles</div>
    <div class="color-codes">
      Background: #E6DAF2<br>
      Text: #003366
    </div>
  </div>
</div>

These colors are defined in the following css variables:

- qualities: `$brand-color-blue: #00B8F5;` <span style="background-color:#00B8F5; color: #003366; padding: 2px 5px; border-radius: 3px;">preview</span>
- requirements: `--reqs-background-color: #92ef80;` <span style="background-color:#92EF80; color: #1B5E20; padding: 2px 5px; border-radius: 3px;">preview</span>
- standards: `--standard-background-color: #ffc95c;` <span style="background-color:#FFC95C; color: #2C3E50; padding: 2px 5px; border-radius: 3px;">preview</span>
- articles (and generic pages): `--article-background-color: #e6daf2;` <span style="background-color:#E6DAF2; color: #003366; padding: 2px 5px; border-radius: 3px;">preview</span>