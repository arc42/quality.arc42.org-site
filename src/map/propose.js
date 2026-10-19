// "Propose as contribution": a prefilled GitHub issue for an own requirement.
// Only the title, scenario and linked quality ids leave the browser; the URL is
// built with URLSearchParams so user text can never break out of its parameter.

export const PROPOSE_REPO = "arc42/quality.arc42.org-site";
export const PROPOSE_LABEL = "requirement-proposal";
export const PROPOSE_BODY_MAX = 6000;
const TRUNCATED_NOTE =
  "\n\n_(scenario truncated for the issue form — full text in your map's JSON export)_";
const NO_SCENARIO = "- [to be specified]";

function issueBody(custom) {
  const scenario = custom.scenario?.trim() ? custom.scenario.trim() : NO_SCENARIO;
  const head = `### Requirement\n${custom.title}\n\n### Acceptance Criteria\n`;
  const tail = [
    "",
    "",
    "---",
    "Proposed from the Q42 quality map. Linked qualities:",
    `related: [${custom.qualities.join(", ")}]`,
  ].join("\n");
  const room = PROPOSE_BODY_MAX - head.length - tail.length;
  // Shorten the scenario, never the template or the related: line.
  if (scenario.length <= room) return head + scenario + tail;
  return head + scenario.slice(0, Math.max(0, room)) + tail + TRUNCATED_NOTE;
}

/**
 * GitHub "new issue" URL proposing a custom requirement for the Q42 catalogue.
 * `qualityTitles` (id → title) is accepted for callers that show names; the
 * body lists ids, the form the `related:` front matter needs.
 */
export function proposeIssueUrl(custom, qualityTitles, { repo = PROPOSE_REPO } = {}) {
  const params = new URLSearchParams({
    title: custom.title,
    labels: PROPOSE_LABEL,
    body: issueBody(custom),
  });
  return `https://github.com/${repo}/issues/new?${params}`;
}
