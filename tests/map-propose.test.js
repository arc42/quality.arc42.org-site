import { test } from "node:test";
import assert from "node:assert/strict";
import { proposeIssueUrl, PROPOSE_BODY_MAX } from "../src/map/propose.js";

const CUSTOM = {
  id: "c-1",
  title: "Checkout keeps working",
  scenario: "- Checkout stays available during a zone outage (99.9 % per month)",
  qualities: ["availability", "resilience"],
  priority: "high",
};
const TITLES = new Map([
  ["availability", "Availability"],
  ["resilience", "Resilience"],
]);

const parse = (url) => new URL(url).searchParams;

test("the URL opens a new issue in the Q42 repository", () => {
  const url = proposeIssueUrl(CUSTOM, TITLES);
  assert.ok(url.startsWith("https://github.com/arc42/quality.arc42.org-site/issues/new?"), url);
  assert.equal(parse(url).get("labels"), "requirement-proposal");
});

test("a different repository can be named", () => {
  const url = proposeIssueUrl(CUSTOM, TITLES, { repo: "someone/fork" });
  assert.ok(url.startsWith("https://github.com/someone/fork/issues/new?"), url);
});

test("the issue title is the requirement title", () => {
  assert.equal(parse(proposeIssueUrl(CUSTOM, TITLES)).get("title"), "Checkout keeps working");
});

test("the body follows the Tier-1 template and lists the linked quality ids", () => {
  const body = parse(proposeIssueUrl(CUSTOM, TITLES)).get("body");
  assert.equal(
    body,
    [
      "### Requirement",
      "Checkout keeps working",
      "",
      "### Acceptance Criteria",
      CUSTOM.scenario,
      "",
      "---",
      "Proposed from the Q42 quality map. Linked qualities:",
      "related: [availability, resilience]",
    ].join("\n"),
  );
});

test("an empty scenario becomes a placeholder criterion", () => {
  const body = parse(proposeIssueUrl({ ...CUSTOM, scenario: "  " }, TITLES)).get("body");
  assert.match(body, /### Acceptance Criteria\n- \[to be specified\]\n/);
});

test("characters that matter in URLs are encoded, not interpreted", () => {
  const url = proposeIssueUrl({ ...CUSTOM, title: "A & B #1 ?x=y" }, TITLES);
  assert.equal(parse(url).get("title"), "A & B #1 ?x=y");
  assert.equal(new URL(url).hash, "");
});

test("a very long scenario is truncated with a note", () => {
  const body = parse(proposeIssueUrl({ ...CUSTOM, scenario: "x".repeat(20000) }, TITLES)).get(
    "body",
  );
  assert.ok(body.length <= 6100, `body has ${body.length} chars`);
  assert.ok(body.length > PROPOSE_BODY_MAX - 1);
  assert.ok(
    body.endsWith(
      "\n\n_(scenario truncated for the issue form — full text in your map's JSON export)_",
    ),
  );
});
