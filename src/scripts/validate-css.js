/**
 * CSS validation script for arc42 quality site.
 *
 * Implements five lightweight rules that prevent new CSS debt
 * while allowlisting all current legacy patterns.
 *
 * Rules:
 *   1. No new ID selectors (except allowlisted)
 *   2. No new !important (except allowlisted)
 *   3. No new inline breakpoint values outside the approved set
 *   4. No new hardcoded hex colors outside token-owner files
 *   5. No unreferenced authored stylesheets
 */

import { promises as fs } from "node:fs";
import path from "node:path";

// ── Terminal colours ────────────────────────────────────────
const C = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
};

const REPORT_WIDTH = 60;

// ── File sets ───────────────────────────────────────────────

const SASS_DIR = "_sass";
const CSS_DIR = "assets/css";

/** Files excluded from all scanning (vendored / entry-only). */
const EXCLUDED_FILES = new Set(["assets/css/all.css", "assets/css/style.scss"]);

/** Files whose purpose is to define colour tokens — exempt from rule 4. */
const TOKEN_OWNER_FILES = new Set(["_sass/base/_variables.scss", "assets/css/arc42-doc.css"]);

// ── Allowlists (current legacy patterns) ────────────────────

/**
 * Rule 1 — ID selectors.
 * Key = relative file path, value = Set of allowed IDs.
 */
const ALLOWED_IDS = {
  "_sass/_aside.scss": new Set(["#search"]),
  "_sass/_standards.scss": new Set(["#standard-header"]),
  "_sass/_content.scss": new Set(["#search-results"]),
  "_sass/_mobile-graph.scss": new Set([
    "#full-q-graph-container",
    "#mobile-graph-reset__btn",
    "#mobile-graph-controls-toggle",
    "#mobile-graph-sheet-close",
    "#full-q-graph-sidebar",
    "#full-q-graph-controls-container",
    "#full-q-graph-filter__input",
    "#full-q-graph-filter__btn",
    "#full-q-graph-home__btn",
    "#full-q-graph-legend",
    "#full-q-graph-filter__chips",
  ]),
  "assets/css/arc42-quality.css": new Set([
    "#scenario-header",
    "#standard-header",
    "#about-author",
  ]),
  "_sass/_q-graph.scss": new Set([
    "#q-graph-container",
    "#q-graph-home",
    "#graph-site",
    "#full-q-graph-container",
    "#full-q-graph-sidebar",
    "#full-q-graph-controls-container",
    "#full-q-graph-legend",
    "#full-q-graph-filter__input",
    "#full-q-graph-filter__btn",
    "#full-q-graph-filter__chips",
    "#full-q-graph-home__btn",
    "#full-q-graph-center__btn",
    "#full-graph-toggle",
  ]),
};

/**
 * Rule 2 — !important.
 * Key = relative file path, value = max number of allowed occurrences.
 */
const ALLOWED_IMPORTANT_COUNTS = {
  "_sass/base/_utilities.scss": 3,
  "_sass/_mobile-graph.scss": 1,
  "_sass/_standards.scss": 1,
  "assets/css/arc42-doc.css": 1,
  "assets/css/arc42-quality.css": 24,
  "_sass/_q-graph.scss": 2,
};

/**
 * Rule 3 — Approved breakpoint pixel values.
 * Only these values (and Sass variables like $mobile-width) are acceptable
 * inside @media queries.
 */
const APPROVED_BREAKPOINTS = new Set(["800px"]);

/**
 * Rule 3 — Legacy breakpoint values allowed per file.
 * Key = relative file path, value = Set of allowed legacy pixel values.
 */
const ALLOWED_LEGACY_BREAKPOINTS = {
  "_sass/_mobile-graph.scss": new Set(["900px"]),
  "_sass/_standards.scss": new Set(["900px"]),
  "assets/css/arc42-doc.css": new Set(["900px", "600px"]),
  "assets/css/arc42-quality.css": new Set(["900px", "768px", "600px"]),
  "_sass/_q-graph.scss": new Set(["768px"]),
};

/**
 * Rule 4 — Files allowlisted for hardcoded hex colours.
 * Every existing authored file that currently contains hex colours is listed
 * here. New files must use tokens or CSS custom properties.
 */
const ALLOWED_COLOR_FILES = new Set([
  "_sass/base/_reset.scss",
  "_sass/base/_syntax.scss",
  "_sass/_common.scss",
  "_sass/_aliases.scss",
  "_sass/_aside.scss",
  "_sass/_content.scss",
  "_sass/_footer.scss",
  "_sass/_header.scss",
  "_sass/_mobile-graph.scss",
  "_sass/_q-graph.scss",
  "_sass/_standards.scss",
  "_sass/q42/_bottom-row.scss",
  "_sass/q42/_dimension-pins.scss",
  "_sass/q42/_graph.scss",
  "_sass/q42/_masthead.scss",
  "_sass/q42/_mega-menu.scss",
  "_sass/q42/_splash.scss",
  "assets/css/arc42-quality.css",
  "assets/css/ukraine.css",
  "assets/css/toggle-switch.css",
]);

TOKEN_OWNER_FILES.add("_sass/q42/_variables.scss");

// ── Helpers ─────────────────────────────────────────────────

/** Recursively collect files matching an extension under `dir`. */
async function collectFiles(dir, ext) {
  const result = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return result;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...(await collectFiles(full, ext)));
    } else if (entry.name.endsWith(ext)) {
      result.push(full);
    }
  }
  return result;
}

/** Return path relative to project root. */
function rel(filePath) {
  return path.relative(process.cwd(), filePath);
}

/** Strip single-line comments (// …) and block comments from a string. */
function stripComments(src) {
  // Remove block comments
  let out = src.replace(/\/\*[\s\S]*?\*\//g, (m) => " ".repeat(m.length));
  // Remove single-line comments but keep the newline
  out = out.replace(/\/\/[^\n]*/g, (m) => " ".repeat(m.length));
  return out;
}

// ── Rule implementations ────────────────────────────────────

/**
 * Rule 1: No new ID selectors.
 * Matches `#word-chars` but excludes:
 *   - Sass interpolation: #{...}
 *   - Hex colours: standalone #abc / #aabbcc patterns
 */
function checkIdSelectors(relPath, lines) {
  const violations = [];
  const allowed = ALLOWED_IDS[relPath] || new Set();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match # followed by word chars, but skip Sass interpolation #{
    const matches = line.matchAll(/#(?!\{)([A-Za-z_][\w-]*)/g);
    for (const m of matches) {
      const id = `#${m[1]}`;
      // Skip hex colour patterns (3-8 hex chars only)
      if (/^#[0-9a-fA-F]{3,8}$/.test(id)) continue;
      if (!allowed.has(id)) {
        violations.push({ line: i + 1, text: id, file: relPath });
      }
    }
  }
  return violations;
}

/**
 * Rule 2: No new !important.
 */
function checkImportant(relPath, lines) {
  const violations = [];
  const allowedCount = ALLOWED_IMPORTANT_COUNTS[relPath] || 0;
  let count = 0;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("!important")) {
      count++;
    }
  }

  if (count > allowedCount) {
    violations.push({
      file: relPath,
      found: count,
      allowed: allowedCount,
    });
  }
  return violations;
}

/**
 * Rule 3: No new inline breakpoint values.
 * Looks for @media queries with hardcoded pixel values.
 */
function checkBreakpoints(relPath, lines) {
  const violations = [];
  const legacyAllowed = ALLOWED_LEGACY_BREAKPOINTS[relPath] || new Set();
  const allAllowed = new Set([...APPROVED_BREAKPOINTS, ...legacyAllowed]);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!/@media/.test(line)) continue;
    // Extract all pixel values from the media query
    const pxMatches = line.matchAll(/\b(\d+px)\b/g);
    for (const m of pxMatches) {
      if (!allAllowed.has(m[1])) {
        violations.push({ line: i + 1, value: m[1], file: relPath });
      }
    }
  }
  return violations;
}

/**
 * Rule 4: No hardcoded hex colours outside token-owner files.
 * Only flags files that are NOT in the colour-file allowlist.
 */
function checkHardcodedColors(relPath, lines) {
  const violations = [];
  if (TOKEN_OWNER_FILES.has(relPath)) return violations;
  if (ALLOWED_COLOR_FILES.has(relPath)) return violations;

  for (let i = 0; i < lines.length; i++) {
    const matches = lines[i].matchAll(/#[0-9a-fA-F]{3,8}\b/g);
    for (const m of matches) {
      violations.push({ line: i + 1, color: m[0], file: relPath });
    }
  }
  return violations;
}

/**
 * Rule 5: No unreferenced authored stylesheets.
 * Every _sass/**\/*.scss partial must be @imported from style.scss.
 */
async function checkUnreferencedSheets(sassFiles) {
  const violations = [];
  const styleEntries = ["style.scss", "q42-splash.scss"].map((entry) =>
    path.join(process.cwd(), CSS_DIR, entry),
  );
  const styleContents = [];

  for (const entry of styleEntries) {
    try {
      styleContents.push(await fs.readFile(entry, "utf-8"));
    } catch {
      violations.push({ file: rel(entry), message: `Could not read ${path.basename(entry)}` });
      return violations;
    }
  }

  for (const file of sassFiles) {
    const relFile = rel(file);
    // Derive the import name: _sass/_common.scss  →  _common  or  base/_variables
    const sassRel = path.relative(path.join(process.cwd(), SASS_DIR), file);
    // Remove leading _ and .scss, keep directory prefix
    const importName = sassRel.replace(/\.scss$/, "").replace(/\/?_/, "/").replace(/^\//, "");
    // Also try with leading underscore stripped differently
    const variants = [
      importName,
      `_${importName}`,
      sassRel.replace(/\.scss$/, ""),
      `'${sassRel.replace(/\.scss$/, "")}'`,
    ];

    const found = styleContents.some((content) => variants.some((v) => content.includes(v)));
    if (!found) {
      violations.push({ file: relFile, message: "Not imported in a CSS entry stylesheet" });
    }
  }
  return violations;
}

// ── Main ────────────────────────────────────────────────────

async function main() {
  const root = process.cwd();
  const separator = "═".repeat(REPORT_WIDTH);
  const subSeparator = "─".repeat(REPORT_WIDTH);

  console.log(`\n${C.bold}${separator}${C.reset}`);
  console.log(`${C.bold}  CSS RULES VALIDATION${C.reset}`);
  console.log(`${C.bold}${separator}${C.reset}\n`);

  // Collect authored files
  const sassFiles = await collectFiles(path.join(root, SASS_DIR), ".scss");
  const cssFiles = (await collectFiles(path.join(root, CSS_DIR), ".css")).concat(
    await collectFiles(path.join(root, CSS_DIR), ".scss"),
  );
  const allFiles = [...sassFiles, ...cssFiles].filter((f) => !EXCLUDED_FILES.has(rel(f)));

  console.log(`${C.cyan}Scanning ${allFiles.length} authored CSS/SCSS files...${C.reset}\n`);

  // Read and pre-process all files
  const fileData = new Map();
  for (const file of allFiles) {
    const raw = await fs.readFile(file, "utf-8");
    const stripped = stripComments(raw);
    fileData.set(rel(file), stripped.split("\n"));
  }

  // Run rules 1-4
  const results = {
    "ID selectors": [],
    "!important": [],
    Breakpoints: [],
    "Hardcoded colors": [],
    "Unreferenced sheets": [],
  };

  for (const [relPath, lines] of fileData) {
    results["ID selectors"].push(...checkIdSelectors(relPath, lines));
    results["!important"].push(...checkImportant(relPath, lines));
    results["Breakpoints"].push(...checkBreakpoints(relPath, lines));
    results["Hardcoded colors"].push(...checkHardcodedColors(relPath, lines));
  }

  // Rule 5
  results["Unreferenced sheets"].push(...(await checkUnreferencedSheets(sassFiles)));

  // Report
  let totalViolations = 0;
  const ruleNames = [
    "ID selectors",
    "!important",
    "Breakpoints",
    "Hardcoded colors",
    "Unreferenced sheets",
  ];

  for (const rule of ruleNames) {
    const violations = results[rule];
    totalViolations += violations.length;

    if (violations.length === 0) {
      console.log(`  ${C.green}✓${C.reset} ${rule}`);
    } else {
      console.log(
        `\n${C.yellow}${C.bold}${rule.toUpperCase()} (${violations.length} ${violations.length === 1 ? "violation" : "violations"})${C.reset}`,
      );
      console.log(`${C.yellow}${subSeparator}${C.reset}`);

      for (const v of violations) {
        if (v.text) {
          // ID selector
          console.log(
            `  ${C.red}✗${C.reset} ${v.file}:${v.line} — new ID selector ${C.bold}${v.text}${C.reset}`,
          );
        } else if (v.found !== undefined) {
          // !important count
          console.log(
            `  ${C.red}✗${C.reset} ${v.file} — found ${C.bold}${v.found}${C.reset} !important (allowed: ${v.allowed})`,
          );
        } else if (v.value) {
          // Breakpoint
          console.log(
            `  ${C.red}✗${C.reset} ${v.file}:${v.line} — non-approved breakpoint ${C.bold}${v.value}${C.reset}`,
          );
        } else if (v.color) {
          // Hardcoded color
          console.log(
            `  ${C.red}✗${C.reset} ${v.file}:${v.line} — hardcoded color ${C.bold}${v.color}${C.reset}`,
          );
        } else if (v.message) {
          // Unreferenced sheet
          console.log(`  ${C.red}✗${C.reset} ${v.file} — ${v.message}`);
        }
      }
      console.log("");
    }
  }

  // Summary
  console.log(`\n${C.bold}${separator}${C.reset}`);
  if (totalViolations === 0) {
    console.log(`${C.green}${C.bold}✓ All CSS rules passed!${C.reset}\n`);
  } else {
    console.log(
      `${C.red}${C.bold}✗ ${totalViolations} CSS rule ${totalViolations === 1 ? "violation" : "violations"} found.${C.reset}\n`,
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`${C.red}Error during CSS validation:${C.reset}`, err);
  process.exit(1);
});
