import { test, expect } from "@playwright/test";
import { playAudit } from "playwright-lighthouse";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROUTES_TO_AUDIT = [
  // Main Entry Points
  { path: "/", name: "Home" },
  { path: "/05-how-to-use-this-site/", name: "How to Use" },
  { path: "/full-quality-graph/", name: "Full Graph" },

  // Collection Start Pages
  { path: "/qualities/", name: "Qualities Index" },
  { path: "/requirements/", name: "Requirements Index" },
  { path: "/standards/", name: "Standards Index" },
  { path: "/approaches/", name: "Approaches Index" },

  // All Dimension Pages (System Properties)
  { path: "/tag-efficient/", name: "Dimension: Efficient" },
  { path: "/tag-flexible/", name: "Dimension: Flexible" },
  { path: "/tag-maintainable/", name: "Dimension: Maintainable" },
  { path: "/tag-operable/", name: "Dimension: Operable" },
  { path: "/tag-reliable/", name: "Dimension: Reliable" },
  { path: "/tag-safe/", name: "Dimension: Safe" },
  { path: "/tag-secure/", name: "Dimension: Secure" },
  { path: "/tag-suitable/", name: "Dimension: Suitable" },
  { path: "/tag-usable/", name: "Dimension: Usable" },

  // Characteristics (Qualities) Samples
  { path: "/qualities/availability", name: "Quality: Availability" },
  { path: "/qualities/security", name: "Quality: Security" },
  { path: "/qualities/usability", name: "Quality: Usability" },
  { path: "/qualities/maintainability", name: "Quality: Maintainability" },
  { path: "/qualities/accessibility", name: "Quality: Accessibility" }
];

const REPORT_DIR = path.join("assets", "reports", "lighthouse");
const JSON_REPORT = path.join(REPORT_DIR, "latest.json");
const HTML_REPORT = path.join(REPORT_DIR, "latest.html");

test.describe("Lighthouse Audits", () => {
  const auditResults: any[] = [];

  // Lighthouse is resource intensive, run sequentially to avoid timeouts
  test.describe.configure({ mode: "serial" });

  for (const route of ROUTES_TO_AUDIT) {
    test(`Lighthouse audit for ${route.name}`, async ({ browserName, playwright, page }) => {
      // Increase timeout for Lighthouse
      test.setTimeout(90000);
      // Lighthouse only works with Chromium
      test.skip(browserName !== "chromium", "Lighthouse only supports Chromium");

      const browser = await playwright.chromium.launch({
        args: ["--remote-debugging-port=9222"],
      });
      const context = await browser.newContext();
      const lPage = await context.newPage();

      await lPage.goto(route.path, { waitUntil: "networkidle" });

      const result = await playAudit({
        page: lPage,
        config: {
          extends: "lighthouse:default",
          settings: {
            formFactor: "desktop",
            screenEmulation: {
              mobile: false,
              width: 1350,
              height: 940,
              deviceScaleFactor: 1,
              disabled: false,
            },
            throttling: {
              rttMs: 40,
              throughputKbps: 10240,
              cpuSlowdownMultiplier: 1,
              requestLatencyMs: 0,
              downloadThroughputKbps: 0,
              uploadThroughputKbps: 0,
            },
          },
        },
        thresholds: {
          performance: 0,
          accessibility: 0,
          "best-practices": 0,
          seo: 0,
        },
        port: 9222,
        opts: {
            logLevel: "error",
        }
      });

      auditResults.push({
        name: route.name,
        path: route.path,
        scores: {
          performance: result.lhr.categories.performance.score * 100,
          accessibility: result.lhr.categories.accessibility.score * 100,
          bestPractices: result.lhr.categories["best-practices"].score * 100,
          seo: result.lhr.categories.seo.score * 100,
        }
      });

      await browser.close();
    });
  }

  test.afterAll(async () => {
    if (auditResults.length === 0) return;

    await mkdir(REPORT_DIR, { recursive: true });
    
    const summary = {
      generatedAt: new Date().toISOString(),
      results: auditResults,
      averages: {
        performance: Math.round(auditResults.reduce((s, r) => s + r.scores.performance, 0) / auditResults.length),
        accessibility: Math.round(auditResults.reduce((s, r) => s + r.scores.accessibility, 0) / auditResults.length),
        bestPractices: Math.round(auditResults.reduce((s, r) => s + r.scores.bestPractices, 0) / auditResults.length),
        seo: Math.round(auditResults.reduce((s, r) => s + r.scores.seo, 0) / auditResults.length),
      }
    };

    await writeFile(JSON_REPORT, JSON.stringify(summary, null, 2), "utf8");
    await writeFile(HTML_REPORT, renderLighthouseHtml(summary), "utf8");
  });
});

function getScoreClass(score: number) {
    if (score >= 90) return "score-good";
    if (score >= 50) return "score-average";
    return "score-poor";
}

function renderLighthouseHtml(report: any) {
  const rows = report.results.map((r: any) => `
    <tr>
      <td><a href="${r.path}">${r.name}</a></td>
      <td class="${getScoreClass(r.scores.performance)}">${r.scores.performance}</td>
      <td class="${getScoreClass(r.scores.accessibility)}">${r.scores.accessibility}</td>
      <td class="${getScoreClass(r.scores.bestPractices)}">${r.scores.bestPractices}</td>
      <td class="${getScoreClass(r.scores.seo)}">${r.scores.seo}</td>
    </tr>
  `).join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Lighthouse Audit Report</title>
  <style>
    :root {
      --good: #0cce6b;
      --average: #ffa400;
      --poor: #ff4e42;
      --text: #1f2d3d;
      --bg: #f8fbff;
    }
    body { font-family: sans-serif; color: var(--text); background: var(--bg); margin: 0; padding: 2rem; }
    main { max-width: 1000px; margin: 0 auto; background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    h1 { color: #003366; margin-top: 0; }
    .meta { color: #666; margin-bottom: 2rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { text-align: left; padding: 1rem; border-bottom: 1px solid #eee; }
    th { background: #f4f8fb; color: #003366; }
    .score-good { color: var(--good); font-weight: bold; }
    .score-average { color: var(--average); font-weight: bold; }
    .score-poor { color: var(--poor); font-weight: bold; }
    .summary-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .card { padding: 1rem; border-radius: 8px; border: 1px solid #ddd; text-align: center; }
    .card-label { font-size: 0.8rem; color: #666; text-transform: uppercase; }
    .card-value { font-size: 1.8rem; margin-top: 0.5rem; }
  </style>
</head>
<body>
  <main>
    <h1>Lighthouse Audit Report</h1>
    <p class="meta">Generated: ${new Date(report.generatedAt).toLocaleString()}</p>
    
    <div class="summary-cards">
      <div class="card"><div class="card-label">Avg Performance</div><div class="card-value ${getScoreClass(report.averages.performance)}">${report.averages.performance}</div></div>
      <div class="card"><div class="card-label">Avg Accessibility</div><div class="card-value ${getScoreClass(report.averages.accessibility)}">${report.averages.accessibility}</div></div>
      <div class="card"><div class="card-label">Avg Best Practices</div><div class="card-value ${getScoreClass(report.averages.bestPractices)}">${report.averages.bestPractices}</div></div>
      <div class="card"><div class="card-label">Avg SEO</div><div class="card-value ${getScoreClass(report.averages.seo)}">${report.averages.seo}</div></div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Page</th>
          <th>Performance</th>
          <th>Accessibility</th>
          <th>Best Practices</th>
          <th>SEO</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </main>
</body>
</html>`;
}
