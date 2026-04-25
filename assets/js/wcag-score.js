(function () {
  const container = document.querySelector("[data-wcag-score-container]");
  if (!container) return;

  const scoreElement = container.querySelector("[data-wcag-score-text]");
  const reportUrl = container.getAttribute("data-wcag-score-url");
  if (!scoreElement || !reportUrl) return;

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
      scoreElement.textContent = ` · ${score}/100`;
      container.setAttribute(
        "aria-label",
        `Open WCAG accessibility report — current score ${score} of 100`
      );
      container.classList.add("is-ready");
      container.classList.remove("is-good", "is-bad");
      container.classList.add(score >= 95 ? "is-good" : "is-bad");
    })
    .catch(() => {
      // Leave the static "WCAG 2.2 AA" label in place when the report is missing.
    });
})();
