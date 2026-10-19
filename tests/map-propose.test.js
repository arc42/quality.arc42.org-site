import { test } from "node:test";
import assert from "node:assert/strict";
import { proposeIssueUrl, PROPOSE_BODY_MAX, PROPOSE_TITLE_MAX } from "../src/map/propose.js";

const CUSTOM = {
  id: "c-1",
  title: "Checkout keeps working",
  scenario: "- Checkout stays available during a zone outage (99.9 % per month)",
  qualities: ["availability", "resilience"],
  priority: "high",
};

const parse = (url) => new URL(url).searchParams;

test("the URL opens a new issue in the Q42 repository", () => {
  const url = proposeIssueUrl(CUSTOM);
  assert.ok(url.startsWith("https://github.com/arc42/quality.arc42.org-site/issues/new?"), url);
  assert.equal(parse(url).get("labels"), "requirement-proposal");
});

test("a different repository can be named", () => {
  const url = proposeIssueUrl(CUSTOM, { repo: "someone/fork" });
  assert.ok(url.startsWith("https://github.com/someone/fork/issues/new?"), url);
});

test("the issue title is the requirement title", () => {
  assert.equal(parse(proposeIssueUrl(CUSTOM)).get("title"), "Checkout keeps working");
});

test("the body follows the Tier-1 template and lists the linked quality ids", () => {
  const body = parse(proposeIssueUrl(CUSTOM)).get("body");
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
  const body = parse(proposeIssueUrl({ ...CUSTOM, scenario: "  " })).get("body");
  assert.match(body, /### Acceptance Criteria\n- \[to be specified\]\n/);
});

test("characters that matter in URLs are encoded, not interpreted", () => {
  const url = proposeIssueUrl({ ...CUSTOM, title: "A & B #1 ?x=y" });
  assert.equal(parse(url).get("title"), "A & B #1 ?x=y");
  assert.equal(new URL(url).hash, "");
});

test("a very long scenario is truncated with a note", () => {
  const body = parse(proposeIssueUrl({ ...CUSTOM, scenario: "x".repeat(20000) })).get("body");
  assert.ok(body.length <= 6100, `body has ${body.length} chars`);
  assert.ok(body.length > PROPOSE_BODY_MAX - 1);
  assert.ok(
    body.endsWith(
      "\n\n_(scenario truncated for the issue form — full text in your map's JSON export)_",
    ),
  );
  assert.ok(body.includes("related: [availability, resilience]"), "related: line kept");
});

test("a 200-character title with a long scenario keeps the body within limits", () => {
  const params = parse(
    proposeIssueUrl({ ...CUSTOM, title: "t".repeat(200), scenario: "x".repeat(20000) }),
  );
  const body = params.get("body");
  assert.ok(body.length <= 6100, `body has ${body.length} chars`);
  assert.ok(body.includes("t".repeat(200)));
  assert.ok(body.includes("related: [availability, resilience]"));
});

test("an over-long title is cut to 200 characters in the issue title and body", () => {
  const params = parse(
    proposeIssueUrl({ ...CUSTOM, title: "t".repeat(10000), scenario: "x".repeat(20000) }),
  );
  assert.equal(params.get("title").length, PROPOSE_TITLE_MAX);
  const body = params.get("body");
  assert.ok(body.length <= 6100, `body has ${body.length} chars`);
  assert.ok(!body.includes("t".repeat(201)));
  assert.ok(body.includes("related: [availability, resilience]"));
});
