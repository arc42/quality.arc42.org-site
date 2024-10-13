// Global variables
let svg, g, link, nodeGroup, simulation, width, height, zoom;
let currentDataset = 'tiny';
let legend;
let currentZoom = 1;
let searchTerm = ""; // Declare searchTerm in the global scope


// Set up the dimensions
width = window.innerWidth;
height = window.innerHeight;

async function initializeGraph(datasetName = currentDataset) {
    // Update the current dataset
    currentDataset = datasetName;

    // Load data for the selected dataset
    const data = await loadData(datasetName);

    // Reset node visibility for new dataset
    nodeVisibility = {
        central: true, // Always visible
        property: true,
        quality: true,
        example: true
    };

    // Clear existing graph and legend
    d3.select("#graph-container").select("svg").remove();
    d3.select("#legend").remove();

    // Create new SVG element
    svg = d3.select("#graph-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create a group element for the graph
    g = svg.append("g");

    // Set up zoom behavior
    zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on("zoom", zoomed);

    svg.call(zoom);

    // Define color scale for different node types
    const colorScale = d3.scaleOrdinal()
        .domain(['central', 'property', 'quality', 'example'])
        .range(['orange', '#4CAF50', '#2196F3', '#FFC107']);

    // Set up force simulation

    // Set up force simulation
    simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.id).distance(150))
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(60));

    
    // Create links
    link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter().append("line")
        .attr("stroke", "#999")
        .attr("stroke-width", 1);

    // Determine the types of nodes present in the dataset
    const nodeTypes = [...new Set(data.nodes.map(node => node.type))];

    // Create nodes
    nodeGroup = g.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(data.nodes)
        .enter().append("g")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    // Add circles to nodes
    nodeGroup.append("circle")
        .attr("r", 8)
        .attr("fill", d => colorScale(d.type));

    // Add labels to nodes
    nodeGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", d => d.type === "central" ? 30 : 20)
        .attr("font-size", d => d.type === "central" ? "14px" : "10px")
        .attr("fill", "#333")
        .each(function(d) {
            const words = d.label.split(/\s+/);
            const elem = d3.select(this);
            elem.text('');

            for (let i = 0; i < words.length; i++) {
                const tspan = elem.append('tspan')
                    .text(words[i]);
                if (i > 0)
                    tspan.attr('x', 0).attr('dy', '1.2em');
            }
        });

    // Add click event to nodes
    nodeGroup.on("click", toggleNode);

    // Set up the simulation
    simulation.nodes(data.nodes).on("tick", ticked);
    simulation.force("link").links(data.links);

    // Define zoom function for legend
    const zoomFunction = (scale) => {
        currentZoom = scale;
        zoom.scaleTo(svg.transition().duration(750), scale);
    };

    // Create new legend
    legend = new Legend(colorScale, zoomFunction, toggleFullscreen, toggleNodeVisibility, simulation, datasetChangeHandler, nodeTypes, searchNodes);

    legend.create();

    // Fit graph to screen
    setTimeout(fitToScreen, 100);
}

function getDatasetLabel(datasetName) {
    switch(datasetName) {
        case 'tiny': return 'Quality';
        case 'iso25010': return 'ISO 25010';
        case 'q42': return 'Q42';
        default: return 'Quality';
    }
}

function datasetChangeHandler(datasetName) {
    initializeGraph(datasetName);
}

function searchNodes(term) {
    searchTerm = term.toLowerCase();
    updateNodeVisibility();
}

function updateNodeVisibility() {
    nodeGroup.classed("dimmed", d => {
        if (d.type === "central") return false; // Never dim the central node
        const matchesSearch = d.label.toLowerCase().includes(searchTerm);
        const isVisible = nodeVisibility[d.type];
        return !matchesSearch || !isVisible;
    });

    link.classed("dimmed", d => {
        if (d.source.type === "central" || d.target.type === "central") return false; // Never dim links to/from central node
        const sourceMatches = d.source.label.toLowerCase().includes(searchTerm) && nodeVisibility[d.source.type];
        const targetMatches = d.target.label.toLowerCase().includes(searchTerm) && nodeVisibility[d.target.type];
        return !sourceMatches && !targetMatches;
    });

    // Update legend to reflect current visibility state
    if (legend) {
        Object.keys(nodeVisibility).forEach(type => {
            legend.updateLegendItemStyle(type, nodeVisibility[type]);
        });
    }
}

function zoomed(event) {
    currentZoom = event.transform.k;
    g.attr("transform", event.transform);
    // Update the zoom slider value
    d3.select(".zoom-slider").property("value", currentZoom);
}

function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function toggleNode(event, d) {
    console.log("Toggled node:", d.label);
    // Implement individual node toggle logic here if needed
}

function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    nodeGroup
        .attr("transform", d => `translate(${d.x},${d.y})`);

    updateNodeVisibility();
}

function fitToScreen() {
    if (!g || !svg || !zoom) return; // Guard clause
    const bounds = g.node().getBBox();
    const fullWidth = width;
    const fullHeight = height;
    const boundWidth = bounds.width;
    const boundHeight = bounds.height;
    const midX = bounds.x + boundWidth / 2;
    const midY = bounds.y + boundHeight / 2;

    if (boundWidth === 0 || boundHeight === 0) return; // nothing to fit

    const scale = 0.8 / Math.max(boundWidth / fullWidth, boundHeight / fullHeight);
    const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

    svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
    );
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function toggleNodeVisibility(nodeType) {
    nodeVisibility[nodeType] = !nodeVisibility[nodeType];
    updateNodeVisibility();
}

function updateNodeVisibility() {
    nodeGroup.classed("dimmed", d => {
        const matchesSearch = d.label.toLowerCase().includes(searchTerm);
        const isVisible = nodeVisibility[d.type];
        return !matchesSearch || !isVisible;
    });

    link.classed("dimmed", d => {
        const sourceMatches = d.source.label.toLowerCase().includes(searchTerm) && nodeVisibility[d.source.type];
        const targetMatches = d.target.label.toLowerCase().includes(searchTerm) && nodeVisibility[d.target.type];
        return !sourceMatches && !targetMatches;
    });

    // Update legend to reflect current visibility state
    if (legend) {
        Object.keys(nodeVisibility).forEach(type => {
            legend.updateLegendItemStyle(type, nodeVisibility[type]);
        });
    }
}

// Ensure the graph resizes when the window is resized
window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    if (svg) {
        svg.attr("width", width).attr("height", height);
    }
    if (simulation) {
        simulation.force("center", d3.forceCenter(width / 2, height / 2));
        simulation.alpha(1).restart();
    }
});

// Start the application
async function main() {
    try {
        await initializeGraph();
    } catch (error) {
        console.error('Failed to initialize graph:', error);
        document.getElementById('graph-container').innerHTML = `
            <p>Failed to load graph data. Please check the console for more information.</p>
            <p>Error: ${error.message}</p>
        `;
    }
}

main();