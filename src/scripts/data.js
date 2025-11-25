import matter from "gray-matter";
import { promises as fs } from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

/**
 * @typedef {Object} FrontmatterData
 * @property {string} title - The page title
 * @property {string|string[]} tags - Space-separated string or array, listing system properties
 * @property {string|string[]} related - Comma-separated string or array, listing qualities
 * @property {string} permalink - The link to the page
 * @property {string|string[]} [standards] - Comma-separated string or array, listing relevant standards
 * @property {string} [stakeholder] - Comma-separated string, listing stakeholders needing this requirement
 */

/**
 * @typedef {Object} Q42Node
 * @property {string} id - Node ID
 * @property {string} label - Node display name
 * @property {number} size - Node size
 * @property {string} color - Node color
 * @property {string} qualityType - Node quality type
 * @property {string} page - Link to documentation
 * @property {string[]} [standards] - Related standards (for quality nodes)
 */

/**
 * @typedef {Object} Q42Edge
 * @property {string} source - Edge source
 * @property {string} target - Edge target
 */

/**
 * Load quality synonyms mapping from _data/quality-synonyms.yml
 * @returns {Promise<Object>} Synonym mapping (canonical -> [synonyms])
 */
async function loadQualitySynonyms() {
    try {
        const projectRoot = process.cwd();
        const synonymsPath = path.join(projectRoot, "_data", "quality-synonyms.yml");
        const content = await fs.readFile(synonymsPath, "utf8");
        return yaml.load(content) || {};
    } catch (error) {
        console.warn("⚠️  No quality-synonyms.yml found - synonym mapping disabled");
        return {};
    }
}

/**
 * Resolve a quality slug to its canonical form
 * @param {string} slug - Quality slug (may be synonym)
 * @param {Object} synonymMap - Synonym mapping from loadQualitySynonyms()
 * @returns {string} Canonical slug
 */
function resolveCanonical(slug, synonymMap) {
    // Check if this slug is a synonym of something
    for (const [canonical, synonyms] of Object.entries(synonymMap)) {
        if (synonyms.includes(slug)) {
            return canonical;
        }
    }
    // Not a synonym, return as-is
    return slug;
}

/**
 * Get all label variants for a quality (canonical + synonyms)
 * @param {string} canonicalId - Canonical quality ID
 * @param {string} canonicalTitle - Canonical quality title
 * @param {Object} synonymMap - Synonym mapping
 * @returns {string[]} Array of labels [canonical, ...synonyms]
 */
function getLabelVariants(canonicalId, canonicalTitle, synonymMap) {
    const labels = [canonicalTitle];
    const synonymSlugs = synonymMap[canonicalId] || [];

    // Convert slugs to display names (capitalize and replace hyphens)
    for (const slug of synonymSlugs) {
        const displayName = slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        labels.push(displayName);
    }

    return labels;
}

/**
 * Stringify data sorted by given label
 * @param {Array} array - The data to stringify
 * @param {string} property - The property to the JSON values on
 * @returns {string} - Resulting JSON string
 */
function toSortedJSON(array, property) {
    return JSON.stringify(
        array.slice().sort((a, b) => a[property].localeCompare(b[property])),
        null,
        2
    );
}

/**
 * Write JSON to assets
 * @param {string} jsonString
 * @param {string} filename
 * @param {string} assetsDir
 */
async function writeJsonToFile(jsonString, filename, assetsDir) {
    const dataPath = path.join(assetsDir, "data");
    const outputPath = path.join(dataPath, filename);
    await fs.mkdir(dataPath, { recursive: true });

    try {
        await fs.writeFile(outputPath, jsonString, "utf8");
        // Sichtbarkeit: Fehlerausgaben nur bei Bedarf
    } catch (error) {
        console.error(`Fehler beim Schreiben der Datei: ${ error }`);
    }
}


/**
 * @typedef {Object} NodeConfig
 * @property {string} color
 * @property {number} size
 * @property {string} qualityType
 */

const NODE_CONFIGS = {
    requirement: { color: '#ffb3b3', size: 15, qualityType: 'requirement' },
    quality: { color: '#00B8F5', size: 25, qualityType: 'quality' },
    property: { color: '#f8f9fa', size: 35, qualityType: 'property' },
    standard: { color: '#FFC95C', size: 45, qualityType: 'standard' }
};

/**
 * Maps to track node connections for pre-calculation
 */
const nodeConnections = {
    // Maps quality nodes to their connected property nodes
    qualityToProperties: new Map(),
    // Maps property nodes to their connected quality nodes
    propertyToQualities: new Map()
};

/**
 * Create and write a JSON file that represents all types of quality nodes
 * @param {FrontmatterData[]} frontmatterData
 * @param {boolean} isRequirements
 * @param {Map<string, Q42Node>} propertyNodes
 * @param {Set<Q42Node>} nodes
 * @param {Set<Q42Edge>} edges
 * @param {Object} synonymMap - Synonym mapping for canonical resolution
 */
function createGraphData(frontmatterData, isRequirements = false, propertyNodes, nodes, edges, synonymMap = {}) {
    for (const data of frontmatterData) {
        // Skip synonym stub files (they have alias_of field)
        if (data.alias_of) {
            continue;
        }

        let id = extractId(data.permalink);
        const tags = parseList(data.tags, ' ');
        const relatedIds = parseList(data.related, ',');

        // Resolve to canonical ID (shouldn't happen for canonical files, but defensive)
        id = resolveCanonical(id, synonymMap);

        processNodeTags(id, tags, isRequirements, propertyNodes, edges, synonymMap);
        processRelatedNodes(id, relatedIds, edges, synonymMap);
        addMainNode(id, data, isRequirements, nodes, synonymMap);
    }
}

/**
 * @param {string} permalink
 * @returns {string}
 */
function extractId(permalink) {
    return permalink.split("/").pop();
}

/**
 * @param {string|undefined} value
 * @param {string} separator
 * @returns {string[]}
 */
function parseList(value, separator) {
    if (Array.isArray(value)) {
        return value;
    }
    return value ? value.split(separator).map(item => item.trim()) : [];
}

/**
 * @param {string} id
 * @param {string[]} tags
 * @param {boolean} isRequirements
 * @param {Map<string, Q42Node>} propertyNodes
 * @param {Set<Q42Edge>} edges
 * @param {Object} synonymMap - Synonym mapping
 */
function processNodeTags(id, tags, isRequirements, propertyNodes, edges, synonymMap = {}) {
    for (const tag of tags) {
        if (!isRequirements) {
            edges.add({ source: id, target: tag });

            // Verbindungen effizienter tracken
            let qualitySet = nodeConnections.qualityToProperties.get(id);
            if (!qualitySet) {
                qualitySet = new Set();
                nodeConnections.qualityToProperties.set(id, qualitySet);
            }
            qualitySet.add(tag);

            let propertySet = nodeConnections.propertyToQualities.get(tag);
            if (!propertySet) {
                propertySet = new Set();
                nodeConnections.propertyToQualities.set(tag, propertySet);
            }
            propertySet.add(id);
        }

        if (!propertyNodes.has(tag)) {
            propertyNodes.set(tag, createPropertyNode(tag));
            edges.add({ source: tag, target: "quality-root" });
        }
    }
}

/**
 * @param {string} tag
 * @returns {Q42Node}
 */
function createPropertyNode(tag) {
    const config = NODE_CONFIGS.property;

    // Calculate size based on number of connected quality nodes
    // If no connections yet, use the default size
    let nodeSize = config.size;

    // We'll update the size later when we have all connections

    return {
        id: tag,
        label: capitalizeFirstLetter(tag),
        size: nodeSize,
        color: config.color,
        qualityType: config.qualityType,
        page: `/tag-${ tag }`
    };
}

/**
 * @param {string} text
 * @returns {string}
 */
function capitalizeFirstLetter(text) {
    if (!text) return "";
    return text[0].toUpperCase() + text.slice(1);
}

/**
 * @param {string} id
 * @param {string[]} relatedIds
 * @param {Set<Q42Edge>} edges
 * @param {Object} synonymMap - Synonym mapping
 */
function processRelatedNodes(id, relatedIds, edges, synonymMap = {}) {
    for (let relatedId of relatedIds) {
        // Resolve synonym to canonical BEFORE creating edge
        relatedId = resolveCanonical(relatedId, synonymMap);

        edges.add({ source: id, target: relatedId });

        // If this is a quality node connecting to another quality node, we don't need to track it
        // for size calculations, as we're setting fixed sizes for qualities
    }
}

/**
 * @param {string} id
 * @param {FrontmatterData} data
 * @param {boolean} isRequirements
 * @param {Set<Q42Node>} nodes
 * @param {Object} synonymMap - Synonym mapping
 */
function addMainNode(id, data, isRequirements, nodes, synonymMap = {}) {
    const config = NODE_CONFIGS[isRequirements ? 'requirement' : 'quality'];

    // For quality nodes, use fixed size as specified in NODE_CONFIGS
    // This ensures all qualities have the same size regardless of related nodes
    let nodeSize = config.size;

    // Attach standards only for quality nodes
    const standards = !isRequirements ? parseList(data.standards, ',') : [];

    // Get all label variants (canonical + synonyms) for quality nodes
    const labels = !isRequirements
        ? getLabelVariants(id, data.title, synonymMap)
        : [data.title];

    nodes.add({
        id,
        label: data.title,
        labels, // Array of all labels including synonyms
        size: nodeSize,
        color: config.color,
        qualityType: config.qualityType,
        page: data.permalink,
        ...(standards.length ? { standards } : {})
    });
}

/**
 * Parses the frontmatter data for a given Markdown file
 * @param {string[]} filePaths - Array of file paths
 * @returns {Promise<Object[]>} - Array of frontmatter objects
 */
async function parseFrontmatter(filePaths) {
    return Promise.all(
        filePaths.map(async (filePath) => {
            const content = await fs.readFile(filePath, "utf-8");
            const { data } = matter(content);
            return data;
        })
    );
}

/**
 * Recursively retrieves all markdown files for a given directory
 * @param {string} dir - The directory to search
 * @returns {Promise<string[]>} Array of markdown file paths
 */
async function getFilePaths(dir) {
    const result = [];
    const files = await fs.readdir(dir);

    await Promise.all(files.map(async (file) => {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory()) {
            const nestedFiles = await getFilePaths(filePath);
            result.push(...nestedFiles);
        } else if (filePath.endsWith(".md")) {
            result.push(filePath);
        }
    }));

    return result;
}


/**
 * Generate graph data files
 */
async function generateData() {
    const projectRoot = process.cwd();
    const qualitiesDir = path.join(projectRoot, "_qualities");
    const requirementsDir = path.join(projectRoot, "_requirements");
    const assetsDir = path.join(projectRoot, "assets");
    const standardsDir = path.join(projectRoot, "_standards");

    // Load synonym mappings
    const synonymMap = await loadQualitySynonyms();
    console.log(`✓ Loaded ${Object.keys(synonymMap).length} synonym mappings`);

    let [qualityFiles, requirementFiles, standardsFiles] = await Promise.all([
        getFilePaths(qualitiesDir),
        getFilePaths(requirementsDir),
        getFilePaths(standardsDir)
    ]);

    qualityFiles = qualityFiles.filter(f => !f.includes("_files-must-have-identical-dates"));
    requirementFiles = requirementFiles.filter(f => !f.includes("_req-template-simple"));

    const [qualityData, requirementsData, standardsMeta] = await Promise.all([
        parseFrontmatter(qualityFiles),
        parseFrontmatter(requirementFiles),
        parseFrontmatter(standardsFiles)
    ]);

    // Build a lookup from standard_id -> title (label) and permalink
    const standardIdToLabel = new Map();
    const standardIdToPermalink = new Map();
    for (const s of standardsMeta) {
        const id = (s.standard_id || "").toString().trim();
        const title = (s.title || "").toString().trim();
        const permalink = (s.permalink || "").toString().trim();
        if (id) {
            standardIdToLabel.set(id.toLowerCase(), title || id.toUpperCase());
            if (permalink) standardIdToPermalink.set(id.toLowerCase(), permalink);
        }
    }

    function defaultLabelFromId(id) {
        if (!id) return "";
        const fromStd = standardIdToLabel.get(id.toLowerCase());
        if (fromStd) return fromStd;
        // Fallback: upper-case and replace dashes/underscores with space
        return id.replace(/[-_]+/g, ' ').toUpperCase();
    }

    const propertyNodes = new Map();
    const nodes = new Set();
    const edges = new Set();
    const standardsSet = new Set();

    // Standards effizient sammeln
    for (const q of qualityData) {
        for (const s of parseList(q.standards, ',')) {
            if (s) standardsSet.add(s);
        }
    }

    createGraphData(qualityData, false, propertyNodes, nodes, edges, synonymMap);
    createGraphData(requirementsData, true, propertyNodes, nodes, edges, synonymMap);

    // Create standard nodes and edges (standard -> quality)
    const standardNodes = new Map();
    // Collect mapping: standard -> set of property ids connected via its qualities
    const standardToProperties = new Map();
    for (const q of qualityData) {
        const qId = extractId(q.permalink);
        const stds = parseList(q.standards, ',');
        for (const s of stds) {
            if (!s) continue;
            const key = s.toLowerCase();
            standardsSet.add(s);
            if (!standardNodes.has(key)) {
                const cfg = NODE_CONFIGS.standard;
                const label = defaultLabelFromId(s);
                const page = standardIdToPermalink.get(key) || `/standards/${ s }`;
                standardNodes.set(key, {
                    id: s,
                    label: label,
                    size: cfg.size,
                    color: cfg.color,
                    qualityType: cfg.qualityType,
                    page
                });
            }
            // Edge: standard -> quality
            edges.add({ source: s, target: qId });
            // Track properties for this standard (via the current quality)
            const propsOfQuality = nodeConnections.qualityToProperties.get(qId);
            if (propsOfQuality && propsOfQuality.size) {
                let set = standardToProperties.get(key);
                if (!set) {
                    set = new Set();
                    standardToProperties.set(key, set);
                }
                propsOfQuality.forEach(p => set.add(p));
            }
        }
    }

    // Add edges: standard -> property (direct connections derived from qualities)
    standardToProperties.forEach((propSet, stdKey) => {
        const stdId = standardNodes.get(stdKey)?.id || stdKey;
        propSet.forEach(propId => {
            edges.add({ source: stdId, target: propId });
        });
    });

    const standards = Array.from(standardsSet)
        .map(id => ({ value: id, label: defaultLabelFromId(id) }))
        .sort((a, b) => a.label.localeCompare(b.label));

    // Merge standard nodes into nodes set
    for (const n of standardNodes.values()) nodes.add(n);

    await Promise.all([
        writeJsonToFile(toSortedJSON(Array.from(propertyNodes.values()), "label"), "property-nodes.json", assetsDir),
        writeJsonToFile(toSortedJSON(Array.from(nodes), "label"), "nodes.json", assetsDir),
        writeJsonToFile(toSortedJSON(Array.from(edges), "source"), "edges.json", assetsDir),
        writeJsonToFile(JSON.stringify(standards, null, 2), "standards.json", assetsDir)
    ]);
}

export { generateData };
