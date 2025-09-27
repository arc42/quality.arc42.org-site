import matter from "gray-matter";
import { promises as fs } from "node:fs";
import path from "node:path";

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
    property: { color: '#00B8F5', size: 40, qualityType: 'property' }
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
 */
function createGraphData(frontmatterData, isRequirements = false, propertyNodes, nodes, edges) {
    for (const data of frontmatterData) {
        const id = extractId(data.permalink);
        const tags = parseList(data.tags, ' ');
        const relatedIds = parseList(data.related, ',');

        processNodeTags(id, tags, isRequirements, propertyNodes, edges);
        processRelatedNodes(id, relatedIds, edges);
        addMainNode(id, data, isRequirements, nodes);
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
 */
function processNodeTags(id, tags, isRequirements, propertyNodes, edges) {
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
 */
function processRelatedNodes(id, relatedIds, edges) {
    for (const relatedId of relatedIds) {
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
 */
function addMainNode(id, data, isRequirements, nodes) {
    const config = NODE_CONFIGS[isRequirements ? 'requirement' : 'quality'];

    // For quality nodes, use fixed size as specified in NODE_CONFIGS
    // This ensures all qualities have the same size regardless of related nodes
    let nodeSize = config.size;

    // Attach standards only for quality nodes
    const standards = !isRequirements ? parseList(data.standards, ',') : [];

    nodes.add({
        id,
        label: data.title,
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

    // Build a lookup from standard_id -> title (label)
    const standardIdToLabel = new Map();
    for (const s of standardsMeta) {
        const id = (s.standard_id || "").toString().trim();
        const title = (s.title || "").toString().trim();
        if (id) standardIdToLabel.set(id.toLowerCase(), title || id.toUpperCase());
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

    createGraphData(qualityData, false, propertyNodes, nodes, edges);
    createGraphData(requirementsData, true, propertyNodes, nodes, edges);

    const standards = Array.from(standardsSet)
        .map(id => ({ value: id, label: defaultLabelFromId(id) }))
        .sort((a, b) => a.label.localeCompare(b.label));

    await Promise.all([
        writeJsonToFile(toSortedJSON(Array.from(propertyNodes.values()), "label"), "property-nodes.json", assetsDir),
        writeJsonToFile(toSortedJSON(Array.from(nodes), "label"), "nodes.json", assetsDir),
        writeJsonToFile(toSortedJSON(Array.from(edges), "source"), "edges.json", assetsDir),
        writeJsonToFile(JSON.stringify(standards, null, 2), "standards.json", assetsDir)
    ]);
}

export { generateData };
