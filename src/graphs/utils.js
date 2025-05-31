import { MultiGraph } from "graphology";
import forceAtlas2 from "graphology-layout-forceatlas2";

/**
 * Creates the root node of the graph
 * @param {MultiGraph} graph
 * @param {string} label
 * @param {number} size
 * @param {string} color
 */
export function createRootNode(graph, label, size, color) {
  graph.addNode("quality-root", {
    label,
    size,
    x: 0,
    y: 0,
    color,
  });
}

/**
 * Creates a node element
 * @param {MultiGraph} graph
 * @param {{id: string, label: string, size: number, color: string, qualityType: string, page: string}[]} nodes
 */
export function createNodes(graph, nodes) {
  nodes.forEach((node) =>
    graph.addNode(node.id, {
      label: node.label,
      size: node.size,
      color: node.color,
      qualityType: node.qualityType,
      page: node.page,
    }),
  );
}

/**
 * Creates an edge between two node IDs
 * @param {MultiGraph} graph
 * @param {{source: string, target: string}[]} edges
 */
export function createEdges(graph, edges) {
  edges.forEach((edge) => graph.addEdge(edge.source, edge.target));
}

/**
 * Determines the default color of a node, based on its quality type
 * @param {MultiGraph} graph
 * @param {string} node
 */
export function getDefaultNodeColor(graph, node) {
  switch (graph.getNodeAttribute(node, "qualityType")) {
    case "property":
      return "green";
    case "quality":
      return "blue";
    default:
      return "orange";
  }
}

/**
 * Creates an enhanced radial hierarchical layout that handles interconnected nodes
 *
 * @param {MultiGraph} graph - The graph to layout
 * @param {string} rootId - ID of the root node
 * @param {number} levelRadius - Base radius between hierarchy levels
 */
export function applyEnhancedRadialLayout(graph, rootId, levelRadius = 150) {
  // Place root at center
  graph.updateNodeAttributes(rootId, (attr) => ({
    ...attr,
    x: 0,
    y: 0,
    hierarchyLevel: 1,
  }));

  // STEP 1: Position property nodes (Level 2) in a circle around root
  const propertyNodes = graph
    .inNeighbors(rootId)
    .filter((n) => graph.getNodeAttribute(n, "qualityType") === "property");

  const propertyAngleStep = (2 * Math.PI) / propertyNodes.length;

  propertyNodes.forEach((propNode, i) => {
    const angle = i * propertyAngleStep;
    const x = levelRadius * Math.cos(angle);
    const y = levelRadius * Math.sin(angle);

    graph.updateNodeAttributes(propNode, (attr) => ({
      ...attr,
      x,
      y,
      angle,
      hierarchyLevel: 2,
    }));
  });

  // STEP 2: Find all quality nodes (blue) and analyze their connections
  const qualityNodes = new Set();
  const propertyConnections = new Map(); // Maps quality node to its property parents

  propertyNodes.forEach((propNode) => {
    graph.inNeighbors(propNode).forEach((n) => {
      if (graph.getNodeAttribute(n, "qualityType") === "quality") {
        qualityNodes.add(n);

        // Track connections
        if (!propertyConnections.has(n)) {
          propertyConnections.set(n, []);
        }
        propertyConnections.get(n).push(propNode);
      }
    });
  });

  // STEP 3: Organize quality nodes by number of property connections
  const qualityNodesByConnections = new Map(); // Group quality nodes by connection count

  propertyConnections.forEach((connections, qualityNode) => {
    const count = connections.length;
    if (!qualityNodesByConnections.has(count)) {
      qualityNodesByConnections.set(count, []);
    }
    qualityNodesByConnections.get(count).push({
      id: qualityNode,
      connections: connections,
    });
  });

  // STEP 4: Position quality nodes
  // Single-property quality nodes go in circles around their property
  if (qualityNodesByConnections.has(1)) {
    const singleConnNodes = qualityNodesByConnections.get(1);

    // Group by parent property
    const nodesByProperty = new Map();
    singleConnNodes.forEach(({ id, connections }) => {
      const propId = connections[0];
      if (!nodesByProperty.has(propId)) {
        nodesByProperty.set(propId, []);
      }
      nodesByProperty.get(propId).push(id);
    });

    // Place them in circles around their property
    nodesByProperty.forEach((nodes, propId) => {
      const propX = graph.getNodeAttribute(propId, "x");
      const propY = graph.getNodeAttribute(propId, "y");
      const propAngle = graph.getNodeAttribute(propId, "angle");

      const qualityRadius = levelRadius * 1; // Slightly smaller than main level radius
      const angleStep = Math.PI / 1.5 / (nodes.length + 1);

      nodes.forEach((nodeId, i) => {
        // Use angle that points away from center
        const angle = propAngle - Math.PI / 4 + (i + 1) * angleStep;
        const x = propX + qualityRadius * Math.cos(angle);
        const y = propY + qualityRadius * Math.sin(angle);

        graph.updateNodeAttributes(nodeId, (attr) => ({
          ...attr,
          x,
          y,
          hierarchyLevel: 3,
        }));
      });
    });
  }

  // Multi-property quality nodes go in intermediate positions
  for (let connCount = 2; connCount <= propertyNodes.length; connCount++) {
    if (qualityNodesByConnections.has(connCount)) {
      const multiConnNodes = qualityNodesByConnections.get(connCount);

      multiConnNodes.forEach(({ id, connections }) => {
        // Calculate center position between all connected properties
        let avgX = 0,
          avgY = 0;
        connections.forEach((propId) => {
          avgX += graph.getNodeAttribute(propId, "x");
          avgY += graph.getNodeAttribute(propId, "y");
        });

        avgX /= connections.length;
        avgY /= connections.length;

        // Calculate distance from center to determine proper radius
        const distFromCenter = Math.sqrt(avgX * avgX + avgY * avgY);
        const radius = distFromCenter + levelRadius * 0.8; // Place slightly outward from properties

        // Normalize and scale to radius
        if (distFromCenter > 0) {
          const factor = radius / distFromCenter;
          avgX *= factor;
          avgY *= factor;
        }

        graph.updateNodeAttributes(id, (attr) => ({
          ...attr,
          x: avgX,
          y: avgY,
          hierarchyLevel: 3,
        }));
      });
    }
  }

  // STEP 5: Find requirement nodes (if not hidden)
  const reqNodes = new Set();
  qualityNodes.forEach((qualityNode) => {
    graph.inNeighbors(qualityNode).forEach((n) => {
      if (graph.getNodeAttribute(n, "qualityType") === "requirement") {
        reqNodes.add(n);
      }
    });
  });

  // STEP 6: Position requirement nodes around their quality nodes
  if (reqNodes.size > 0) {
    // Group requirements by quality node
    const reqByQuality = new Map();
    reqNodes.forEach((reqId) => {
      const parents = graph
        .outNeighbors(reqId)
        .filter((n) => graph.getNodeAttribute(n, "qualityType") === "quality");

      // For simplicity, assign to first parent (could be enhanced for multi-parent)
      if (parents.length > 0) {
        const mainParent = parents[0];
        if (!reqByQuality.has(mainParent)) {
          reqByQuality.set(mainParent, []);
        }
        reqByQuality.get(mainParent).push(reqId);
      }
    });

    // Position requirements in circles around their quality nodes
    reqByQuality.forEach((reqs, qualityId) => {
      const qualityX = graph.getNodeAttribute(qualityId, "x");
      const qualityY = graph.getNodeAttribute(qualityId, "y");

      // Calculate angle to center
      const angleToCenter = Math.atan2(qualityY, qualityX);

      const reqRadius = levelRadius * 0.7;
      const reqAngleStep = Math.PI / (reqs.length + 1);

      reqs.forEach((reqId, i) => {
        // Start from the opposite direction of the center
        const angle =
          angleToCenter + Math.PI - reqAngleStep * (reqs.length / 2) + reqAngleStep * (i + 1);
        const x = qualityX + reqRadius * Math.cos(angle);
        const y = qualityY + reqRadius * Math.sin(angle);

        graph.updateNodeAttributes(reqId, (attr) => ({
          ...attr,
          x,
          y,
          hierarchyLevel: 4,
        }));
      });
    });
  }

  // STEP 7: Adjust nodes to avoid overlaps
  adjustNodeOverlaps(graph, 30); // 30 = minimum distance between nodes
}

/**
 * Adjust node positions to minimize overlaps
 *
 * @param {MultiGraph} graph - The graph
 * @param {number} minDistance - Minimum distance between nodes
 */
function adjustNodeOverlaps(graph, minDistance) {
  const iterations = 50;
  const nodePositions = [];

  // Create an array of node positions for faster access
  graph.forEachNode((nodeId, attrs) => {
    const qualityType = attrs.qualityType;
    let nodeDist = minDistance;
    if (qualityType === "quality") {
      nodeDist = minDistance * 1.5; // Larger minimum distance for blue nodes
    }

    nodePositions.push({
      id: nodeId,
      x: attrs.x,
      y: attrs.y,
      level: attrs.hierarchyLevel || 1,
      fixed: nodeId === "quality-root", // Don't move root node
      qualityType: qualityType, // Track node type
      minDist: nodeDist, // Individual min distance
    });
  });

  // Run several iterations of overlap adjustment
  for (let iter = 0; iter < iterations; iter++) {
    let moved = false;

    // Check each pair of nodes
    for (let i = 0; i < nodePositions.length; i++) {
      if (nodePositions[i].fixed) continue;

      let dx = 0,
        dy = 0;

      // Compare with all other nodes
      for (let j = 0; j < nodePositions.length; j++) {
        if (i === j) continue;

        const xDiff = nodePositions[i].x - nodePositions[j].x;
        const yDiff = nodePositions[i].y - nodePositions[j].y;
        const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

        // Use the larger of the two nodes' minimum distances
        const effectiveMinDist = Math.max(nodePositions[i].minDist, nodePositions[j].minDist);

        // If too close, calculate repulsion force
        if (distance > 0 && distance < effectiveMinDist) {
          let forceMultiplier = 0.1;
          if (nodePositions[i].qualityType === "quality") {
            forceMultiplier = 0.15;
          }

          const force = (effectiveMinDist - distance) / distance;
          dx += xDiff * force * forceMultiplier;
          dy += yDiff * force * forceMultiplier;
          moved = true;
        }
      }

      // Apply the force to move the node
      if (dx !== 0 || dy !== 0) {
        nodePositions[i].x += dx;
        nodePositions[i].y += dy;
      }

      // Keep nodes at appropriate distances based on level
      const node = nodePositions[i];
      const distFromCenter = Math.sqrt(node.x * node.x + node.y * node.y);
      const targetDist = (node.level - 1) * minDistance * 3;

      if (Math.abs(distFromCenter - targetDist) > minDistance * 0.5) {
        const angle = Math.atan2(node.y, node.x);
        nodePositions[i].x = targetDist * Math.cos(angle);
        nodePositions[i].y = targetDist * Math.sin(angle);
      }
    }

    if (!moved) break; // Stop if no nodes were moved
  }

  // Update the graph with new positions
  nodePositions.forEach(({ id, x, y }) => {
    graph.updateNodeAttributes(id, (attrs) => ({
      ...attrs,
      x,
      y,
    }));
  });
}
