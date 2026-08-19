import path from "node:path";
import { promises as fs } from "node:fs";
import matter from "gray-matter";
import { getFilePaths, parseFrontmatter } from "./data.js";

/**
 * validate-approach.js — deterministic checker for a single `_approaches/<L>/<slug>.md` page.
 *
 * It mirrors how the build (`data.js`) and the layout (`_layouts/approach.html`) resolve
 * slugs: a `supported_qualities` / `tradeoffs` / `related_requirements` value must equal the
 * last permalink segment of a real `_qualities/` or `_requirements/` page (no synonym fallback),
 * otherwise the layout silently drops it. Budgets and body rules come from the skill's
 * `reference/approaches-template.md`; keep the constants below in sync with that file.
 *
 * Usage:  node src/scripts/validate-approach.js _approaches/G/graceful-degradation.md
 * Exit:   0 = clean (warnings allowed) · 1 = validation errors · 2 = usage/read error.
 */

const NINE_DIMENSIONS = new Set([
  "suitable", "usable", "secure", "reliable", "operable",
  "efficient", "flexible", "safe", "maintainable",
]);

// Body `##` headings, normalised to lowercase. Source: template "Body Structure".
const CONTENT_HEADINGS = new Set([
  "how it works", "failure modes", "verification", "variants and related tactics",
]);
const NONCOUNTING_HEADINGS = new Set(["example", "mini example", "references"]);

// Length is ADVISORY: the validator warns above these, never errors. Thresholds sit at the
// corpus outlier level so warnings flag genuine overage, not the typical page. The aim for a
// new approach is well under them (e.g. body ~500, intent ~20). Keep in sync with the
// template's "Length Budgets" section.
const BUDGETS = {
  intent: 30,
  mechanism: 55,
  applicability: 55,
  note: 28,         // each supported_qualities / related_requirements note
  tradeoffNote: 60, // trade-offs earn room
  body: 750,
};

const slugOf = (permalink) =>
  typeof permalink === "string" ? permalink.split("/").pop() : "";

const wordCount = (str) =>
  str == null ? 0 : String(str).trim().split(/\s+/).filter(Boolean).length;

const asArray = (v) => {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map((x) => String(x).trim());
  return String(v).split(/[\s,]+/).filter(Boolean);
};

async function main() {
  const fileArg = process.argv[2];
  if (!fileArg) {
    console.error("usage: node src/scripts/validate-approach.js <path-to-approach.md>");
    process.exit(2);
  }

  const projectRoot = process.cwd();
  const filePath = path.resolve(fileArg);
  if (!filePath.startsWith(projectRoot + path.sep) && filePath !== projectRoot) {
    console.error(`✗ path traversal detected: "${fileArg}" is outside the project root`);
    process.exit(2);
  }

  let raw;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    console.error(`✗ cannot read ${fileArg}`);
    process.exit(2);
  }

  const errors = [];
  const warnings = [];
  const err = (m) => errors.push(m);
  const warn = (m) => warnings.push(m);

  const { data: fm, content: body } = matter(raw);

  // Allowed slug sets — derived from the content tree, exactly like the build.
  const [qFiles, rFiles] = await Promise.all([
    getFilePaths(path.join(projectRoot, "_qualities")),
    getFilePaths(path.join(projectRoot, "_requirements")),
  ]);
  const [qData, rData] = await Promise.all([
    parseFrontmatter(qFiles),
    parseFrontmatter(rFiles),
  ]);
  const qualitySlugs = new Set(qData.map((d) => slugOf(d.permalink)).filter(Boolean));
  const requirementSlugs = new Set(rData.map((d) => slugOf(d.permalink)).filter(Boolean));

  // --- front-matter basics ---
  if (fm.layout !== "approach") {
    err(`layout must be "approach" (got ${JSON.stringify(fm.layout)})`);
  }
  const permalink = fm.permalink;
  if (typeof permalink !== "string" || !/^\/approaches\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(permalink)) {
    err(`permalink must be "/approaches/<kebab-slug>" (got ${JSON.stringify(permalink)})`);
  }
  const approachSlug = slugOf(permalink);

  for (const field of ["title", "intent", "mechanism", "applicability"]) {
    if (!fm[field] || String(fm[field]).trim() === "") {
      err(`missing required front-matter field "${field}"`);
    }
  }

  // --- node-ID collision: qualities, requirements and approaches share one node namespace ---
  if (approachSlug && (qualitySlugs.has(approachSlug) || requirementSlugs.has(approachSlug))) {
    const where = qualitySlugs.has(approachSlug) ? "quality" : "requirement";
    err(
      `node-ID collision: "${approachSlug}" already exists as a ${where} slug — the two pages ` +
      `collapse into one graph node. Rename the approach, or treat the term as a ${where}.`
    );
  }

  // --- tags ---
  const tags = asArray(fm.tags);
  if (tags.length < 1 || tags.length > 3) {
    warn(`tags: use 1–3 dimensions (got ${tags.length})`);
  }
  for (const t of tags) {
    if (!NINE_DIMENSIONS.has(t)) err(`tags: "${t}" is not one of the 9 dimensions`);
  }

  // --- slug arrays + their notes maps ---
  const checkPair = (arrField, notesField, allowed, label, noteBudget) => {
    const arr = asArray(fm[arrField]);
    const arrSet = new Set(arr);
    const notes =
      fm[notesField] && typeof fm[notesField] === "object" && !Array.isArray(fm[notesField])
        ? fm[notesField]
        : {};

    for (const slug of arr) {
      if (!allowed.has(slug)) {
        err(`${arrField}: "${slug}" is not an existing ${label} slug — it is silently dropped from the page.`);
      }
    }
    for (const key of Object.keys(notes)) {
      if (!arrSet.has(key)) {
        err(`${notesField}: key "${key}" is not listed in ${arrField} — its note renders nowhere.`);
      }
    }
    for (const slug of arr) {
      if (!(slug in notes)) {
        err(`${notesField}: no note for "${slug}" (every slug in ${arrField} needs a note).`);
      }
    }
    for (const [key, val] of Object.entries(notes)) {
      const wc = wordCount(val);
      if (wc > noteBudget) warn(`${notesField}["${key}"]: ${wc} words (target ≤${noteBudget}).`);
    }
  };

  checkPair("supported_qualities", "supported_qualities_notes", qualitySlugs, "quality", BUDGETS.note);
  checkPair("tradeoffs", "tradeoff_notes", qualitySlugs, "quality", BUDGETS.tradeoffNote);
  checkPair("related_requirements", "related_requirements_notes", requirementSlugs, "requirement", BUDGETS.note);

  // --- prose field budgets ---
  for (const [field, budget] of [
    ["intent", BUDGETS.intent],
    ["mechanism", BUDGETS.mechanism],
    ["applicability", BUDGETS.applicability],
  ]) {
    if (fm[field]) {
      const wc = wordCount(fm[field]);
      if (wc > budget) warn(`${field}: ${wc} words (target ≤${budget}).`);
    }
  }

  // --- body: word budget (advisory) + heading structure (enforced) ---
  const bodyWords = wordCount(body);
  if (bodyWords > BUDGETS.body) warn(`body: ${bodyWords} words (target ≤${BUDGETS.body} — tighten).`);

  let inFence = false;
  let contentHeadings = 0;
  for (const line of body.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const deep = line.match(/^(#{3,})\s+/);
    if (deep) {
      err(`body: "${line.trim()}" uses ${deep[1].length} '#'; only "##" headings are allowed.`);
      continue;
    }
    const h2 = line.match(/^##\s+(.*\S)\s*$/);
    if (h2) {
      const title = h2[1].replace(/[#*`]/g, "").trim().toLowerCase();
      if (NONCOUNTING_HEADINGS.has(title)) continue;
      contentHeadings++;
      if (!CONTENT_HEADINGS.has(title)) {
        warn(`body: "## ${h2[1].trim()}" is not a standard heading (How It Works / Failure Modes / Verification / Variants and Related Tactics).`);
      }
    }
  }
  if (contentHeadings > 4) {
    err(`body: ${contentHeadings} content "##" headings; max is 4 (Example / References excluded).`);
  }

  // --- file placement (advisory) ---
  if (approachSlug) {
    const base = path.basename(filePath, ".md");
    if (base !== approachSlug) {
      warn(`filename "${base}.md" does not match permalink slug "${approachSlug}".`);
    }
    const parent = path.basename(path.dirname(filePath));
    const expectedLetter = approachSlug[0].toUpperCase();
    if (parent !== expectedLetter) {
      warn(`directory "${parent}/" does not match the slug's uppercase first letter "${expectedLetter}".`);
    }
  }

  // --- report ---
  const rel = path.relative(projectRoot, filePath);
  console.log(`validate-approach: ${rel}`);
  for (const w of warnings) console.log(`  ⚠️  ${w}`);
  for (const e of errors) console.log(`  ✗ ${e}`);
  if (errors.length === 0 && warnings.length === 0) {
    console.log("  ✓ all checks passed");
  } else {
    console.log(`  ${errors.length} error(s), ${warnings.length} warning(s)`);
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
