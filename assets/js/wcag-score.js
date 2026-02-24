(function () {
  const container = document.querySelector("[data-wcag-score-container]");
  if (!container) return;

  const badgeElement = container.querySelector("[data-wcag-score-badge]");
  const reportUrl = container.getAttribute("data-wcag-score-url");
  if (!badgeElement || !reportUrl) return;

  const badgeUrl = (message) =>
    `https://img.shields.io/badge/WCAG-${encodeURIComponent(message)}-lightgrey?style=social`;

  fetch(reportUrl, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) return null;
      return response.json();
    })
    .then((report) => {
      if (!report || !report.totals || typeof report.totals.avgScore !== "number") {
        return;
      }

      const score = Math.max(0, Math.min(100, Math.round(report.totals.avgScore)));
      const message = `${score}/100`;
      badgeElement.src = badgeUrl(message);
      badgeElement.alt = `WCAG ${message}`;
      container.classList.add("wcag-score-ready");
      container.classList.remove("wcag-score-good", "wcag-score-bad");

      if (score >= 95) {
        container.classList.add("wcag-score-good");
      } else {
        container.classList.add("wcag-score-bad");
      }
    })
    .catch(() => {
      // Keep fallback badge when report is missing or unreadable.
    });
})();
