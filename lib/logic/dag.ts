// Directed Acyclic Graph operations for circuit validation

import { LogicNode, Wire } from './types';

export interface Graph {
  nodes: Map<string, LogicNode>;
  adjacencyList: Map<string, Set<string>>;
  reverseAdjacencyList: Map<string, Set<string>>;
}

export function buildGraph(nodes: Map<string, LogicNode>, wires: Wire[]): Graph {
  const adjacencyList = new Map<string, Set<string>>();
  const reverseAdjacencyList = new Map<string, Set<string>>();

  // Initialize adjacency lists for all nodes
  nodes.forEach((_, nodeId) => {
    adjacencyList.set(nodeId, new Set());
    reverseAdjacencyList.set(nodeId, new Set());
  });

  // Build adjacency lists from wires
  wires.forEach(wire => {
    adjacencyList.get(wire.source)?.add(wire.target);
    reverseAdjacencyList.get(wire.target)?.add(wire.source);
  });

  return { nodes, adjacencyList, reverseAdjacencyList };
}

export function hasCycle(graph: Graph): boolean {
  const visited = new Set<string>();
  const recStack = new Set<string>();

  function hasCycleUtil(nodeId: string): boolean {
    visited.add(nodeId);
    recStack.add(nodeId);

    const neighbors = graph.adjacencyList.get(nodeId) || new Set();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycleUtil(neighbor)) return true;
      } else if (recStack.has(neighbor)) {
        return true;
      }
    }

    recStack.delete(nodeId);
    return false;
  }

  for (const [nodeId] of graph.nodes) {
    if (!visited.has(nodeId)) {
      if (hasCycleUtil(nodeId)) return true;
    }
  }

  return false;
}

export function topologicalSort(graph: Graph): string[] | null {
  if (hasCycle(graph)) return null;

  const inDegree = new Map<string, number>();
  const queue: string[] = [];
  const sorted: string[] = [];

  // Initialize in-degrees
  graph.nodes.forEach((_, nodeId) => {
    inDegree.set(nodeId, 0);
  });

  // Calculate in-degrees
  graph.adjacencyList.forEach(neighbors => {
    neighbors.forEach(neighbor => {
      inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
    });
  });

  // Find all nodes with in-degree 0
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) queue.push(nodeId);
  });

  // Kahn's algorithm
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    sorted.push(nodeId);

    const neighbors = graph.adjacencyList.get(nodeId) || new Set();
    neighbors.forEach(neighbor => {
      const newDegree = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) queue.push(neighbor);
    });
  }

  return sorted.length === graph.nodes.size ? sorted : null;
}

export function checkContinuity(
  graph: Graph,
  outputId: string
): { isValid: boolean; unreachableNodes: Set<string> } {
  const reachable = new Set<string>();
  const queue = [outputId];
  reachable.add(outputId);

  // Reverse BFS from output to find all nodes that can reach it
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const sources = graph.reverseAdjacencyList.get(nodeId) || new Set();
    
    sources.forEach(source => {
      if (!reachable.has(source)) {
        reachable.add(source);
        queue.push(source);
      }
    });
  }

  // Find nodes that have connections but can't reach output
  const unreachableNodes = new Set<string>();
  graph.nodes.forEach((node, nodeId) => {
    const hasConnections = 
      (graph.adjacencyList.get(nodeId)?.size || 0) > 0 ||
      (graph.reverseAdjacencyList.get(nodeId)?.size || 0) > 0;
    
    if (hasConnections && !reachable.has(nodeId) && nodeId !== outputId) {
      unreachableNodes.add(nodeId);
    }
  });

  return {
    isValid: unreachableNodes.size === 0,
    unreachableNodes
  };
}

export function validateLeftToRight(wires: Wire[], nodes: Map<string, LogicNode>): boolean {
  for (const wire of wires) {
    const sourceNode = nodes.get(wire.source);
    const targetNode = nodes.get(wire.target);
    
    if (sourceNode && targetNode) {
      // Enforce left-to-right flow
      if (sourceNode.position.x >= targetNode.position.x) {
        return false;
      }
    }
  }
  return true;
}

export function checkArity(nodes: Map<string, LogicNode>, wires: Wire[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const inputCounts = new Map<string, number>();

  // Count inputs for each node
  wires.forEach(wire => {
    const count = inputCounts.get(wire.target) || 0;
    inputCounts.set(wire.target, count + 1);
  });

  nodes.forEach((node, nodeId) => {
    if (node.type === 'GATE') {
      const inputCount = inputCounts.get(nodeId) || 0;
      
      if (node.gateType === 'NOT') {
        if (inputCount !== 1) {
          errors.push(`NOT gate ${node.label || nodeId} must have exactly 1 input (has ${inputCount})`);
        }
      } else if (node.gateType) {
        if (inputCount < 2 || inputCount > 4) {
          errors.push(`${node.gateType} gate ${node.label || nodeId} must have 2-4 inputs (has ${inputCount})`);
        }
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}
