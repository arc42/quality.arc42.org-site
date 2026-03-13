import path from "node:path";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const colorSchemeSourcePath = path.join(repoRoot, "_includes/about/color-scheme.md");
const colorSchemeOutputPath = path.join(repoRoot, "docs/color-scheme.html");

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function stashHtml(value, placeholders) {
  const key = `__HTML_PLACEHOLDER_${placeholders.length}__`;
  placeholders.push(value);
  return key;
}

function restoreHtml(value, placeholders) {
  return value.replace(/__HTML_PLACEHOLDER_(\d+)__/g, (_, index) => {
    return placeholders[Number(index)] ?? "";
  });
}

function renderInlineMarkdown(text) {
  const placeholders = [];
  let value = text;

  value = value.replace(/`([^`]+)`/g, (_, code) => {
    return stashHtml(`<code>${escapeHtml(code)}</code>`, placeholders);
  });

  value = value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    return stashHtml(`<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`, placeholders);
  });

  value = value.replace(/\*\*([^*]+)\*\*/g, (_, strong) => {
    return stashHtml(`<strong>${escapeHtml(strong)}</strong>`, placeholders);
  });

  value = value.replace(/\*([^*]+)\*/g, (_, emphasis) => {
    return stashHtml(`<em>${escapeHtml(emphasis)}</em>`, placeholders);
  });

  return restoreHtml(escapeHtml(value), placeholders);
}

function renderMarkdownToHtml(markdown) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const rendered = [];
  let paragraphLines = [];
  let listItems = [];
  let htmlBlockLines = [];

  const flushParagraph = () => {
    if (!paragraphLines.length) {
      return;
    }

    rendered.push(`<p>${renderInlineMarkdown(paragraphLines.join(" ").trim())}</p>`);
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listItems.length) {
      return;
    }

    rendered.push("<ul>");
    for (const item of listItems) {
      rendered.push(`  <li>${renderInlineMarkdown(item)}</li>`);
    }
    rendered.push("</ul>");
    listItems = [];
  };

  const flushHtmlBlock = () => {
    if (!htmlBlockLines.length) {
      return;
    }

    rendered.push(htmlBlockLines.join("\n"));
    htmlBlockLines = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (htmlBlockLines.length) {
      if (!trimmed) {
        flushHtmlBlock();
        continue;
      }

      htmlBlockLines.push(line);
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+?)(?:\s+\{#([A-Za-z0-9_-]+)\})?$/);
    if (headingMatch) {
      flushParagraph();
      flushList();

      const [, hashes, text, id] = headingMatch;
      const level = hashes.length;
      const idAttribute = id ? ` id="${id}"` : "";
      rendered.push(`<h${level}${idAttribute}>${renderInlineMarkdown(text)}</h${level}>`);
      continue;
    }

    const listMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (listMatch) {
      flushParagraph();
      listItems.push(listMatch[1].trim());
      continue;
    }

    if (/^\s*</.test(line)) {
      flushParagraph();
      flushList();
      htmlBlockLines.push(line);
      continue;
    }

    flushList();
    paragraphLines.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushHtmlBlock();

  return rendered.join("\n");
}

function extractLeadingStyleBlock(markdown) {
  const match = markdown.match(/^\s*(<style>[\s\S]*?<\/style>)(?:\s*\n)?/);

  if (!match) {
    return {
      bodyMarkdown: markdown.trim(),
      styleBlock: "",
    };
  }

  return {
    bodyMarkdown: markdown.slice(match[0].length).trim(),
    styleBlock: match[1],
  };
}

function buildPreviewDocument({ contentHtml, styleBlock }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>quality.arc42.org color scheme</title>
  <meta name="description" content="Generated preview of the quality.arc42.org color scheme.">
  <link rel="stylesheet" href="../assets/css/all.css">
  <style>
    :root {
      color-scheme: light;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 24px 16px 40px;
      font-family: "Avenir Next", Avenir, "Segoe UI", sans-serif;
      line-height: 1.55;
      color: #1f2933;
      background:
        radial-gradient(circle at top, rgba(53, 115, 96, 0.15), transparent 38%),
        linear-gradient(180deg, #f5f7f2 0%, #eef3f6 100%);
    }

    .preview-shell {
      max-width: 1080px;
      margin: 0 auto;
      padding: 28px clamp(18px, 4vw, 40px) 36px;
      border: 1px solid rgba(26, 58, 92, 0.14);
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.94);
      box-shadow: 0 22px 60px rgba(26, 58, 92, 0.12);
      backdrop-filter: blur(12px);
    }

    .generated-note {
      margin: 0 0 24px;
      padding: 12px 14px;
      border: 1px solid #d6e3d9;
      border-radius: 12px;
      background: #f3f9f2;
      color: #29513f;
      font-size: 0.95rem;
    }

    .generated-note code,
    .preview-shell code {
      padding: 0.15em 0.4em;
      border-radius: 0.45em;
      background: rgba(26, 58, 92, 0.08);
      font-family: "SFMono-Regular", SFMono-Regular, Consolas, monospace;
      font-size: 0.92em;
    }

    .preview-shell h1,
    .preview-shell h2,
    .preview-shell h3,
    .preview-shell h4,
    .preview-shell h5,
    .preview-shell h6 {
      margin: 0 0 14px;
      color: #1a3a5c;
      line-height: 1.2;
    }

    .preview-shell p {
      margin: 0 0 16px;
    }

    .preview-shell ul {
      margin: 0 0 18px;
      padding-left: 1.35rem;
    }

    .preview-shell a {
      color: #29513f;
    }

    .preview-shell small {
      color: #51606d;
    }

    .preview-shell .color-name .fa {
      width: 1.25em;
      text-align: center;
    }

    @media (max-width: 720px) {
      body {
        padding: 14px 10px 24px;
      }

      .preview-shell {
        padding: 20px 16px 26px;
        border-radius: 16px;
      }
    }
  </style>
  ${styleBlock}
</head>
<body>
  <main class="preview-shell">
    <p class="generated-note">
      Generated from <code>_includes/about/color-scheme.md</code>.
      Edit the markdown source, then run <code>npm run color-scheme</code>.
    </p>
    ${contentHtml}
  </main>
</body>
</html>
`;
}

async function generateColorSchemePreview() {
  const source = await readFile(colorSchemeSourcePath, "utf8");
  const { bodyMarkdown, styleBlock } = extractLeadingStyleBlock(source);
  const contentHtml = renderMarkdownToHtml(bodyMarkdown);
  const preview = buildPreviewDocument({ contentHtml, styleBlock });

  await mkdir(path.dirname(colorSchemeOutputPath), { recursive: true });
  await writeFile(colorSchemeOutputPath, preview);

  console.log(
    `Generated ${path.relative(repoRoot, colorSchemeOutputPath)} from ${path.relative(repoRoot, colorSchemeSourcePath)}.`,
  );
}

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  generateColorSchemePreview().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export { colorSchemeSourcePath, colorSchemeOutputPath, generateColorSchemePreview };
