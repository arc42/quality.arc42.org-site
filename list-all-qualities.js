import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function listAllQualities() {
  const indexPath = path.join(__dirname, "quality-index.json");

  try {
    const indexData = JSON.parse(await fs.readFile(indexPath, "utf-8"));

    console.log(`\n📋 All Qualities (${indexData.length} total)\n`);
    console.log("=" .repeat(80));

    indexData.forEach((quality, index) => {
      console.log(`${(index + 1).toString().padStart(3)}. ${quality.title.padEnd(40)} (${quality.id})`);
      console.log(`     Tags: [${quality.tags.join(", ")}]`);
      console.log(`     Relations: ${quality.relatedCount}, Standards: ${quality.standardsCount}`);
      console.log(`     File: ${quality.filePath}`);
      console.log();
    });

    console.log("=" .repeat(80));
    console.log(`\nTotal: ${indexData.length} qualities\n`);
  } catch (error) {
    console.error("❌ Error: quality-index.json not found. Run build-quality-index.js first.");
    process.exit(1);
  }
}

listAllQualities().catch(console.error);
