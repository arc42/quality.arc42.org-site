// dataLoader.js
const DATA_PATH = '/assets/q-graph/data/';

async function loadData(datasetName) {
    let nodesFile, linksFile;

    switch(datasetName) {
        case 'iso25010':
            nodesFile = 'iso-nodes.json';
            linksFile = 'iso-links.json';
            break;
        case 'q42':
            nodesFile = 'q42-nodes.json';
            linksFile = 'q42-links.json';
            break;
        case 'tiny':
        default:
            nodesFile = 'nodes.json';
            linksFile = 'links.json';
            break;
    }

    try {
        const nodesURL = `${DATA_PATH}${nodesFile}`
        const linksURL = `${DATA_PATH}${linksFile}`
        const [nodes, links] = await Promise.all([
            (await fetch(nodesURL)).json(), 
            (await fetch(linksURL)).json()
        ])
        return { nodes, links }
    } catch (error) {
        console.error(`Error fetching quality graph data: ${error}`)
        return { nodes: [], links: [] };
    }
}
