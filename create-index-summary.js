import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createIndexSummary() {
  const indexPath = path.join(__dirname, "quality-index.json");

  try {
    const indexData = JSON.parse(await fs.readFile(indexPath, "utf-8"));

    const summary = {
      total: indexData.length,
      byTag: {},
      topConnected: indexData
        .sort((a, b) => b.relatedCount - a.relatedCount)
        .slice(0, 10)
        .map(q => ({ id: q.id, title: q.title, relatedCount: q.relatedCount })),
      topStandards: indexData
        .sort((a, b) => b.standardsCount - a.standardsCount)
        .slice(0, 10)
        .map(q => ({ id: q.id, title: q.title, standardsCount: q.standardsCount })),
    };

    // Count by tags
    indexData.forEach(quality => {
      quality.tags.forEach(tag => {
        summary.byTag[tag] = (summary.byTag[tag] || 0) + 1;
      });
    });

    await fs.writeFile(
      path.join(__dirname, "quality-index-summary.json"),
      JSON.stringify(summary, null, 2)
    );

    console.log(`✅ Created index summary`);
    console.log(`   Total qualities: ${summary.total}`);
    console.log(`   Unique tags: ${Object.keys(summary.byTag).length}`);
    console.log(`   Output: quality-index-summary.json`);
  } catch (error) {
    console.error("❌ Error: quality-index.json not found. Run build-quality-index.js first.");
    process.exit(1);
  }
}

createIndexSummary().catch(console.error);
