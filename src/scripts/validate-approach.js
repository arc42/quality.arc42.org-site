import path from "node:path";
import { execFileSync } from "node:child_process";
import { existsSync, promises as fs } from "node:fs";
import matter from "gray-matter";
import { getFilePaths, parseFrontmatter } from "./data.js";

/**
 * validate-approach.js — deterministic checker for `_approaches/<L>/<slug>.md` pages.
 *
 * It mirrors how the build (`data.js`) and the layout (`_layouts/approach.html`) resolve
 * slugs: a `supported_qualities` / `tradeoffs` / `related_requirements` value must equal the
 * last permalink segment of a real `_qualities/` or `_requirements/` page (no synonym fallback),
 * and a `related` value must name an existing approach file; otherwise the layout silently
 * drops it. Budgets and body rules come from the write-approach skill's
 * `reference/approaches-template.md`; keep the constants below in sync with that file.
 *
 * Usage:  node src/scripts/validate-approach.js _approaches/G/graceful-degradation.md [more.md …]
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

// Length is ADVISORY: the validator warns above these, never errors. They are the
// template's targets; the body has a target (reported) and a higher warning threshold,
// so a rich topic can take the room it needs. Keep in sync with "Length Budgets".
const BUDGETS = {
  intent: 25,
  mechanism: 50,
  applicability: 50,
  note: 25,         // each supported_qualities / related / related_requirements note
  tradeoffNote: 60, // trade-offs earn room (~50 is the soft ceiling)
  bodyTarget: 350,
  bodyWarn: 450,
};

const REFERENCES_PAGE = "_pages/85-references.md";

const slugOf = (permalink) =>
  typeof permalink === "string" ? permalink.split("/").pop() : "";

const wordCount = (str) =>
  str == null ? 0 : String(str).trim().split(/\s+/).filter(Boolean).length;

const asArray = (v) => {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map((x) => String(x).trim());
  return String(v).split(/[\s,]+/).filter(Boolean);
};

const headingTitle = (raw) => raw.replace(/[#*`]/g, "").trim().toLowerCase();

/** Load everything a page is checked against, once for all files. */
async function loadContext(projectRoot) {
  const [qFiles, rFiles, aFiles] = await Promise.all([
    getFilePaths(path.join(projectRoot, "_qualities")),
    getFilePaths(path.join(projectRoot, "_requirements")),
    getFilePaths(path.join(projectRoot, "_approaches")),
  ]);
  const [qData, rData, aData] = await Promise.all([
    parseFrontmatter(qFiles),
    parseFrontmatter(rFiles),
    parseFrontmatter(aFiles),
  ]);
  const approaches = new Map();
  aFiles.forEach((file, i) => approaches.set(path.basename(file, ".md"), aData[i]));

  let referenceAnchors = null;
  try {
    const refs = await fs.readFile(path.join(projectRoot, REFERENCES_PAGE), "utf8");
    referenceAnchors = new Set([...refs.matchAll(/<a id="([^"]+)"/g)].map((m) => m[1]));
  } catch {
    // No references page: anchor checks are skipped below.
  }

  return {
    projectRoot,
    qualitySlugs: new Set(qData.map((d) => slugOf(d.permalink)).filter(Boolean)),
    // Alias quality pages (`alias_of:`) are redirects; map their slug to the canonical one.
    qualityAliases: new Map(
      qData.filter((d) => d.alias_of).map((d) => [slugOf(d.permalink), String(d.alias_of)])
    ),
    requirementSlugs: new Set(rData.map((d) => slugOf(d.permalink)).filter(Boolean)),
    approaches,
    referenceAnchors,
  };
}

/** Body lines outside code fences, tagged with the `##` section they sit in. */
function bodyLines(body) {
  const out = [];
  let inFence = false;
  let section = "";
  for (const line of body.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      out.push({ line, section, fence: true });
      continue;
    }
    const h2 = !inFence && line.match(/^##\s+(.*\S)\s*$/);
    if (h2) section = headingTitle(h2[1]);
    out.push({ line, section, fence: inFence, heading: h2 ? h2[1].trim() : null });
  }
  return out;
}

function hasXmllint() {
  try {
    execFileSync("xmllint", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function validateFile(raw, filePath, ctx) {
  const errors = [];
  const warnings = [];
  const info = [];
  const err = (m) => errors.push(m);
  const warn = (m) => warnings.push(m);

  const { data: fm, content: body } = matter(raw);
  const { qualitySlugs, qualityAliases, requirementSlugs, approaches, referenceAnchors } = ctx;

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
  for (const field of ["supported_qualities", "tradeoffs"]) {
    if (asArray(fm[field]).length === 0) err(`missing required front-matter field "${field}"`);
  }

  // --- file placement: the permalink slug is the graph node ID ---
  if (approachSlug) {
    const base = path.basename(filePath, ".md");
    if (base !== approachSlug) {
      err(`filename "${base}.md" does not match permalink slug "${approachSlug}".`);
    }
    const parent = path.basename(path.dirname(filePath));
    const expectedLetter = approachSlug[0].toUpperCase();
    if (parent !== expectedLetter) {
      err(`directory "${parent}/" does not match the slug's uppercase first letter "${expectedLetter}".`);
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
    err(`tags: use 1–3 dimensions (got ${tags.length})`);
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

  const otherApproaches = new Set([...approaches.keys()].filter((s) => s !== approachSlug));
  checkPair("supported_qualities", "supported_qualities_notes", qualitySlugs, "quality", BUDGETS.note);
  checkPair("tradeoffs", "tradeoff_notes", qualitySlugs, "quality", BUDGETS.tradeoffNote);

  // --- alias quality slugs: the link works (redirect), but the canonical quality page's
  // "Related Approaches" list matches supported_qualities against the canonical slug only.
  const aliasEffect = {
    supported_qualities: "the approach is missing from that quality's Related Approaches list",
    tradeoffs: "the link goes through a redirect page",
  };
  for (const [field, effect] of Object.entries(aliasEffect)) {
    for (const slug of asArray(fm[field])) {
      const canonical = qualityAliases.get(slug);
      if (canonical) {
        warn(`${field}: "${slug}" is an alias of "${canonical}" — use the canonical slug; otherwise ${effect}.`);
      }
    }
  }
  checkPair("related_requirements", "related_requirements_notes", requirementSlugs, "requirement", BUDGETS.note);
  checkPair("related", "related_notes", otherApproaches, "approach", BUDGETS.note);

  // --- related is declared one-sided: the counterpart must not point back ---
  for (const target of asArray(fm.related)) {
    const other = approaches.get(target);
    if (other && asArray(other.related).includes(approachSlug)) {
      err(`related: "${target}" already declares the relation back to "${approachSlug}" — declare it on one page only.`);
    }
  }

  // --- aka: index terms must not repeat across approaches ---
  // aka terms may contain spaces ("Vigilance Control"), so asArray's whitespace split is wrong here.
  const akaOf = (d) => [].concat(d.aka ?? []).map((t) => String(t).trim()).filter(Boolean);
  for (const term of akaOf(fm)) {
    for (const [otherSlug, other] of approaches) {
      if (otherSlug === approachSlug) continue;
      if (akaOf(other).includes(term)) {
        err(`aka: "${term}" is already an alias on "${otherSlug}".`);
      }
    }
  }

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

  // --- body: heading structure (enforced) ---
  const lines = bodyLines(body);
  let contentHeadings = 0;
  for (const { line, fence, heading } of lines) {
    if (fence) continue;
    const deep = line.match(/^(#{3,})\s+/);
    if (deep) {
      err(`body: "${line.trim()}" uses ${deep[1].length} '#'; only "##" headings are allowed.`);
      continue;
    }
    if (!heading) continue;
    const title = headingTitle(heading);
    if (NONCOUNTING_HEADINGS.has(title)) continue;
    contentHeadings++;
    if (!CONTENT_HEADINGS.has(title)) {
      err(`body: "## ${heading}" is not an allowed heading (How It Works / Failure Modes / Verification / Variants and Related Tactics).`);
    }
  }
  if (contentHeadings > 4) {
    err(`body: ${contentHeadings} content "##" headings; max is 4 (Example / References excluded).`);
  }

  // --- body: word count (advisory); image line, Example and References excluded ---
  const counted = lines
    .filter(({ section, line }) => !NONCOUNTING_HEADINGS.has(section) && !/^!\[/.test(line))
    .map(({ line }) => line);
  const bodyWords = wordCount(counted.join(" "));
  info.push(`body: ${bodyWords} words (target ~${BUDGETS.bodyTarget}, warning above ${BUDGETS.bodyWarn})`);
  if (bodyWords > BUDGETS.bodyWarn) {
    warn(`body: ${bodyWords} words — tighten towards ~${BUDGETS.bodyTarget}.`);
  }

  // --- diagram: an image line whose local file exists (and is well-formed SVG) ---
  const images = [...body.matchAll(/^!\[[^\]]*\]\(([^)\s]+)/gm)].map((m) => m[1]);
  if (images.length === 0) {
    warn(`no diagram: add ![alt](/assets/img/approaches/${approachSlug}.svg) after the overview.`);
  }
  for (const src of images) {
    if (!src.startsWith("/")) continue;
    const local = path.join(ctx.projectRoot, src);
    if (!existsSync(local)) {
      err(`image "${src}" does not exist.`);
    } else if (local.endsWith(".svg") && ctx.xmllint) {
      try {
        execFileSync("xmllint", ["--noout", local], { stdio: "pipe" });
      } catch (e) {
        err(`image "${src}" is not well-formed SVG: ${String(e.stderr).trim().split("\n")[0]}`);
      }
    }
  }

  // --- links into the references page must hit an existing anchor ---
  if (referenceAnchors) {
    for (const [, anchor] of body.matchAll(/\(\/references\/#([^)\s]+)\)/g)) {
      if (!referenceAnchors.has(anchor)) {
        err(`references link "#${anchor}" has no <a id="${anchor}"> on ${REFERENCES_PAGE}.`);
      }
    }
  }

  return { errors, warnings, info };
}

async function main() {
  const fileArgs = process.argv.slice(2);
  if (fileArgs.length === 0) {
    console.error("usage: node src/scripts/validate-approach.js <path-to-approach.md> [more.md …]");
    process.exit(2);
  }

  const projectRoot = process.cwd();
  const ctx = { ...(await loadContext(projectRoot)), xmllint: hasXmllint() };
  let failed = 0;

  for (const fileArg of fileArgs) {
    const filePath = path.resolve(fileArg);
    let raw;
    try {
      raw = await fs.readFile(filePath, "utf8");
    } catch {
      console.error(`✗ cannot read ${fileArg}`);
      process.exit(2);
    }

    const { errors, warnings, info } = validateFile(raw, filePath, ctx);
    if (errors.length) failed++;

    // --- report ---
    const rel = path.relative(projectRoot, filePath);
    console.log(`validate-approach: ${rel}`);
    for (const i of info) console.log(`  ·  ${i}`);
    for (const w of warnings) console.log(`  ⚠️  ${w}`);
    for (const e of errors) console.log(`  ✗ ${e}`);
    if (errors.length === 0 && warnings.length === 0) {
      console.log("  ✓ all checks passed");
    } else {
      console.log(`  ${errors.length} error(s), ${warnings.length} warning(s)`);
    }
  }

  if (fileArgs.length > 1) {
    console.log(`\n${fileArgs.length - failed}/${fileArgs.length} files without errors`);
  }
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
