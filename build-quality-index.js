import matter from "gray-matter";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildQualityIndex() {
  const qualitiesDir = path.join(__dirname, "_qualities");
  const index = [];

  async function processDirectory(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await processDirectory(fullPath);
      } else if (entry.name.endsWith(".md")) {
        const content = await fs.readFile(fullPath, "utf-8");
        const { data } = matter(content);

        if (data.title && data.permalink) {
          const id = data.permalink.split("/").pop();
          index.push({
            id,
            title: data.title,
            tags: Array.isArray(data.tags) ? data.tags : (data.tags || "").split(/[\s,]+/).filter(Boolean),
            relatedCount: Array.isArray(data.related) ? data.related.length : (data.related || "").split(",").filter(Boolean).length,
            standardsCount: Array.isArray(data.standards) ? data.standards.length : (data.standards || "").split(",").filter(Boolean).length,
            filePath: path.relative(__dirname, fullPath),
          });
        }
      }
    }
  }

  await processDirectory(qualitiesDir);

  // Sort by title
  index.sort((a, b) => a.title.localeCompare(b.title));

  // Write to file
  await fs.writeFile(
    path.join(__dirname, "quality-index.json"),
    JSON.stringify(index, null, 2)
  );

  console.log(`✅ Built quality index with ${index.length} qualities`);
  console.log(`   Output: quality-index.json`);
}

buildQualityIndex().catch(console.error);
