import lunr from "lunr";
import { promises as fs } from "node:fs";
import path from "node:path";
import { 
    getFilePaths, 
    parseFrontmatter, 
    loadQualitySynonyms, 
    resolveCanonical, 
    parseList 
} from "./data.js";

async function generateSearchIndex() {
    const projectRoot = process.cwd();
    const qualitiesDir = path.join(projectRoot, "_qualities");
    const requirementsDir = path.join(projectRoot, "_requirements");
    const standardsDir = path.join(projectRoot, "_standards");
    const approachesDir = path.join(projectRoot, "_approaches");
    const assetsDir = path.join(projectRoot, "assets");

    console.log("Generating search index...");

    const synonymMap = await loadQualitySynonyms();

    const collections = [
        { dir: qualitiesDir, type: "quality" },
        { dir: requirementsDir, type: "requirement" },
        { dir: standardsDir, type: "standard" },
        { dir: approachesDir, type: "approach" }
    ];

    const documents = [];

    for (const { dir, type } of collections) {
        const files = await getFilePaths(dir);
        const data = await parseFrontmatter(files);

        for (const item of data) {
            // Skip synonym stub files for indexing, or index them?
            // Actually, for Lunr, we want to find the canonical page.
            if (item.alias_of) continue;

            const id = item.permalink;
            const title = item.title || "";
            const tags = parseList(item.tags, " ").join(" ");
            
            // Collect aliases/synonyms
            let aliases = "";
            if (type === "quality") {
                const slug = id.split("/").pop();
                const synonymSlugs = synonymMap[slug] || [];
                aliases = synonymSlugs.map(s => s.replace(/-/g, " ")).join(" ");
            }
            // `aka:` index terms — used by qualities and approaches alike, so index
            // them regardless of type. (Approaches were previously skipped, leaving
            // terms like "Split Testing" unsearchable in the header/full-text search.)
            if (item.aka) {
                aliases += " " + parseList(item.aka, ",").join(" ");
            }
            if (item.alias) {
                aliases += " " + parseList(item.alias, ",").join(" ");
            }

            documents.push({
                id: item.permalink,
                title,
                type,
                tags,
                aliases,
                body: item.body || ""
            });
        }
    }

    const idx = lunr(function () {
        this.ref("id");
        this.field("title", { boost: 10 });
        this.field("aliases", { boost: 5 });
        this.field("tags", { boost: 3 });
        this.field("body");

        documents.forEach(function (doc) {
            this.add(doc);
        }, this);
    });

    const dataPath = path.join(assetsDir, "data");
    await fs.mkdir(dataPath, { recursive: true });

    // Lookup table for the UI to show titles/types without the full index.
    // Aliases + tags are included so the header autocomplete can do its own
    // prefix scoring without going through Lunr's stemmer (the stemmer rewrites
    // "performance" → "perform" which breaks prefix matching for typed queries
    // like "performa"). Lunr is still used for the /search/ full-results page.
    const lookup = {};
    documents.forEach(doc => {
        lookup[doc.id] = {
            title: doc.title,
            type: doc.type,
            url: doc.id,
            aliases: doc.aliases || "",
            tags: doc.tags || ""
        };
    });

    await Promise.all([
        fs.writeFile(path.join(dataPath, "search-index.json"), JSON.stringify(idx)),
        fs.writeFile(path.join(dataPath, "search-lookup.json"), JSON.stringify(lookup))
    ]);

    console.log(`✓ Search index generated with ${documents.length} documents.`);
}

export { generateSearchIndex };
