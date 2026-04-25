## Pageviews {#pageviews} 

{% if jekyll.environment == 'production' %}
<iframe
  plausible-embed
  src="https://plausible.io/share/quality.arc42.org?auth=cjoKlapPdw3czFugGy6jM&embed=true&theme=light"
  title="Plausible Analytics pageviews for quality.arc42.org"
  scrolling="no"
  frameborder="0"
  loading="lazy"
  style="width: 1px; min-width: 100%; height: 1600px">
</iframe>
<small>Stats powered by <a target="_blank" style="color: #4f46e5; text-decoration: underline" href="https://plausible.io">Plausible Analytics</a></small>

<script async src="https://plausible.io/js/embed.host.js"></script>
{% else %}
<div class="stats-placeholder" style="padding: 2rem; border: 1px dashed #ccc; text-align: center;">
    <p>Analytics dashboard is disabled in development mode.</p>
</div>
{% endif %}
