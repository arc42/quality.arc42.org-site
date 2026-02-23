import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type ViolationSummary = {
  id: string;
  impact: string;
  description: string;
  help: string;
  helpUrl: string;
  nodes: number;
};

type PageSummary = {
  route: string;
  title: string;
  url: string;
  violationsCount: number;
  incompleteCount: number;
  passesCount: number;
  score: number;
  violations: ViolationSummary[];
};

type WcagReport = {
  generatedAt: string;
  tags: string[];
  totals: {
    pagesScanned: number;
    violations: number;
    incomplete: number;
    passes: number;
    avgScore: number;
  };
  pages: PageSummary[];
};

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];
const ROUTES = [
  "/",
  "/dimensions/",
  "/qualities/",
  "/requirements/",
  "/standards/",
  "/qualities/accessibility",
  "/qualities/time-to-market",
];

const REPORT_DIR = path.join("assets", "reports", "wcag");
const JSON_REPORT = path.join(REPORT_DIR, "latest.json");
const HTML_REPORT = path.join(REPORT_DIR, "latest.html");

function scoreFor(violationsCount: number): number {
  return Math.max(0, 100 - violationsCount * 10);
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderHtml(report: WcagReport): string {
  const pageRows = report.pages
    .map((page) => {
      const rowClass = page.violationsCount > 0 ? "fail" : "pass";
      const scoreWidth = `${page.score}%`;
      const details = page.violations.length
        ? `<details><summary>${page.violations.length} violation rule(s)</summary>
             <ul>${page.violations
               .map(
                 (v) =>
                   `<li><code>${escapeHtml(v.id)}</code> [${escapeHtml(v.impact)}] - ${escapeHtml(v.help)} (${v.nodes} node(s)) - <a href="${escapeHtml(v.helpUrl)}" target="_blank" rel="noopener noreferrer">guidance</a></li>`
               )
               .join("")}</ul>
           </details>`
        : "<span class=\"no-issues\">No violations</span>";

      return `<tr class="${rowClass}">
        <td><a href="${escapeHtml(page.route)}">${escapeHtml(page.route)}</a></td>
        <td>${escapeHtml(page.title || "(untitled)")}</td>
        <td>${page.violationsCount}</td>
        <td>${page.incompleteCount}</td>
        <td>${page.passesCount}</td>
        <td>
          <div class="score-wrap">
            <div class="score-bar" style="width:${scoreWidth}"></div>
            <span class="score-value">${page.score}</span>
          </div>
        </td>
        <td>${details}</td>
      </tr>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>WCAG Accessibility Report</title>
  <style>
    :root {
      --ok: #2e7d32;
      --warn: #b26a00;
      --bad: #8b0000;
      --bg: #f8fbff;
      --card: #ffffff;
      --text: #1f2d3d;
      --blue: #00b8f5;
    }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: var(--text);
      background: var(--bg);
    }
    main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.2rem;
    }
    h1 {
      margin: 0;
      color: #003366;
    }
    .meta {
      margin: 0.4rem 0 1rem 0;
      color: #4a5c6b;
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.8rem;
      margin-bottom: 1rem;
    }
    .card {
      background: var(--card);
      border: 1px solid #d8e3ef;
      border-radius: 10px;
      padding: 0.75rem;
    }
    .card .label {
      font-size: 0.85rem;
      color: #486175;
    }
    .card .value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #003366;
    }
    .score-global {
      background: linear-gradient(90deg, #d9f6e0 0%, #fdf3cf 50%, #fbd5d5 100%);
      border: 1px solid #d8e3ef;
      border-radius: 10px;
      padding: 0.75rem;
      margin-bottom: 1rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--card);
      border-radius: 10px;
      overflow: hidden;
    }
    th, td {
      border-bottom: 1px solid #e9eef5;
      text-align: left;
      padding: 0.55rem;
      vertical-align: top;
      font-size: 0.93rem;
    }
    th {
      background: #eaf6ff;
      color: #003366;
      font-weight: 700;
    }
    tr.pass td:first-child { border-left: 4px solid var(--ok); }
    tr.fail td:first-child { border-left: 4px solid var(--bad); }
    .score-wrap {
      width: 100%;
      min-width: 110px;
      background: #e8eef5;
      border-radius: 999px;
      height: 20px;
      position: relative;
      overflow: hidden;
    }
    .score-bar {
      height: 100%;
      background: linear-gradient(90deg, #24a148 0%, #00b8f5 100%);
    }
    .score-value {
      position: absolute;
      right: 8px;
      top: 1px;
      font-size: 0.75rem;
      font-weight: 700;
      color: #0f2942;
    }
    details {
      margin: 0;
    }
    .no-issues {
      color: var(--ok);
      font-weight: 600;
    }
    code {
      background: #eef4fb;
      border-radius: 4px;
      padding: 0.05rem 0.3rem;
    }
    ul {
      margin: 0.35rem 0 0.2rem 1rem;
      padding: 0;
    }
  </style>
</head>
<body>
  <main>
    <h1>WCAG Accessibility Report</h1>
    <p class="meta">Generated: ${escapeHtml(report.generatedAt)}<br/>Rulesets: ${escapeHtml(report.tags.join(", "))}</p>
    <section class="cards">
      <div class="card"><div class="label">Pages Scanned</div><div class="value">${report.totals.pagesScanned}</div></div>
      <div class="card"><div class="label">Violations</div><div class="value">${report.totals.violations}</div></div>
      <div class="card"><div class="label">Incomplete</div><div class="value">${report.totals.incomplete}</div></div>
      <div class="card"><div class="label">Pass Checks</div><div class="value">${report.totals.passes}</div></div>
      <div class="card"><div class="label">Average Score</div><div class="value">${report.totals.avgScore}</div></div>
    </section>
    <div class="score-global"><strong>Score heuristic:</strong> 100 - (10 x violations per page), clamped to 0..100.</div>
    <table>
      <thead>
        <tr>
          <th>Route</th>
          <th>Title</th>
          <th>Violations</th>
          <th>Incomplete</th>
          <th>Passes</th>
          <th>Score</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        ${pageRows}
      </tbody>
    </table>
  </main>
</body>
</html>`;
}

test("wcag scan for key pages", async ({ page }) => {
  const pageSummaries: PageSummary[] = [];

  for (const route of ROUTES) {
    await page.goto(route, { waitUntil: "domcontentloaded" });

    const analysis = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    const pageSummary: PageSummary = {
      route,
      title: (await page.title()) || "",
      url: page.url(),
      violationsCount: analysis.violations.length,
      incompleteCount: analysis.incomplete.length,
      passesCount: analysis.passes.length,
      score: scoreFor(analysis.violations.length),
      violations: analysis.violations.map((v) => ({
        id: v.id,
        impact: v.impact || "unknown",
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.length,
      })),
    };
    pageSummaries.push(pageSummary);
  }

  const totalViolations = pageSummaries.reduce(
    (sum, p) => sum + p.violationsCount,
    0
  );
  const totalIncomplete = pageSummaries.reduce(
    (sum, p) => sum + p.incompleteCount,
    0
  );
  const totalPasses = pageSummaries.reduce((sum, p) => sum + p.passesCount, 0);
  const avgScore = Math.round(
    pageSummaries.reduce((sum, p) => sum + p.score, 0) / pageSummaries.length
  );

  const report: WcagReport = {
    generatedAt: new Date().toISOString(),
    tags: WCAG_TAGS,
    totals: {
      pagesScanned: pageSummaries.length,
      violations: totalViolations,
      incomplete: totalIncomplete,
      passes: totalPasses,
      avgScore,
    },
    pages: pageSummaries,
  };

  await mkdir(REPORT_DIR, { recursive: true });
  await writeFile(JSON_REPORT, JSON.stringify(report, null, 2), "utf8");
  await writeFile(HTML_REPORT, renderHtml(report), "utf8");

  const strict =
    process.env.WCAG_STRICT === "1" ||
    process.env.WCAG_STRICT === "true" ||
    process.env.WCAG_STRICT === "TRUE";

  // Always verify report generation covered the configured route set.
  expect(pageSummaries.length).toBe(ROUTES.length);

  if (!strict && totalViolations > 0) {
    // Informative mode (default for make wcag-test): report findings but do not fail.
    // Use WCAG_STRICT=1 for hard gating.
    // eslint-disable-next-line no-console
    console.warn(
      `[wcag] ${totalViolations} violations detected. See /about/wcag-report/ and ${JSON_REPORT}`
    );
  }

  if (strict) {
    expect(
      totalViolations,
      "WCAG violations found. See /about/wcag-report/ and assets/reports/wcag/latest.json"
    ).toBe(0);
  }
});
