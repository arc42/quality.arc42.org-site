// dataLoader.js
const DATA_PATH = '/assets/q-graph/data/';

function loadData(datasetName) {
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

    return Promise.all([
        fetch(`${DATA_PATH}${nodesFile}`).then(response => response.json()),
        fetch(`${DATA_PATH}${linksFile}`).then(response => response.json())
    ]).then(([nodesData, linksData]) => {
        return { nodes: nodesData.nodes, links: linksData.links };
    }).catch(error => {
        console.error('Error loading data:', error);
        return { nodes: [], links: [] };
    });
}