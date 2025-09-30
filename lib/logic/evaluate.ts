// Circuit evaluation logic

import { LogicNode, Wire, TruthTableRow, GateType } from './types';
import { buildGraph, topologicalSort, checkContinuity, checkArity, validateLeftToRight } from './dag';

export interface EvaluationContext {
  nodes: Map<string, LogicNode>;
  wires: Wire[];
  inputValues: Map<string, boolean>;
}

// Gate evaluation functions
export function evaluateAND(inputs: boolean[]): boolean {
  return inputs.every(input => input);
}

export function evaluateOR(inputs: boolean[]): boolean {
  return inputs.some(input => input);
}

export function evaluateXOR(inputs: boolean[]): boolean {
  // N-ary XOR: true if odd number of inputs are true
  return inputs.filter(input => input).length % 2 === 1;
}

export function evaluateNOT(input: boolean): boolean {
  return !input;
}

export function evaluateGate(gateType: GateType, inputs: boolean[]): boolean {
  switch (gateType) {
    case 'AND':
      return evaluateAND(inputs);
    case 'OR':
      return evaluateOR(inputs);
    case 'XOR':
      return evaluateXOR(inputs);
    case 'NOT':
      return inputs.length === 1 ? evaluateNOT(inputs[0]) : false;
    default:
      return false;
  }
}

export function evaluateCircuit(
  context: EvaluationContext,
  outputId: string
): { success: boolean; nodeValues: Map<string, boolean>; errors: string[] } {
  const { nodes, wires, inputValues } = context;
  const errors: string[] = [];
  const nodeValues = new Map<string, boolean>();

  // Validate left-to-right constraint
  if (!validateLeftToRight(wires, nodes)) {
    errors.push('Wires must flow from left to right');
    return { success: false, nodeValues, errors };
  }

  // Build graph and check for cycles
  const graph = buildGraph(nodes, wires);
  const sortedNodes = topologicalSort(graph);
  
  if (!sortedNodes) {
    errors.push('Circuit contains a cycle');
    return { success: false, nodeValues, errors };
  }

  // Check continuity to output
  const continuity = checkContinuity(graph, outputId);
  if (!continuity.isValid) {
    const unreachableList = Array.from(continuity.unreachableNodes).join(', ');
    errors.push(`Nodes not connected to output: ${unreachableList}`);
    return { success: false, nodeValues, errors };
  }

  // Check gate arity
  const arityCheck = checkArity(nodes, wires);
  if (!arityCheck.isValid) {
    errors.push(...arityCheck.errors);
    return { success: false, nodeValues, errors };
  }

  // Initialize input values
  inputValues.forEach((value, nodeId) => {
    nodeValues.set(nodeId, value);
  });

  // Build input connections map
  const nodeInputs = new Map<string, string[]>();
  wires.forEach(wire => {
    const inputs = nodeInputs.get(wire.target) || [];
    inputs.push(wire.source);
    nodeInputs.set(wire.target, inputs);
  });

  // Evaluate nodes in topological order
  for (const nodeId of sortedNodes) {
    const node = nodes.get(nodeId);
    if (!node) continue;

    if (node.type === 'INPUT') {
      // Input values are already set
      continue;
    } else if (node.type === 'GATE' && node.gateType) {
      const inputNodes = nodeInputs.get(nodeId) || [];
      const inputValues = inputNodes.map(inputId => nodeValues.get(inputId) || false);
      
      if (inputValues.length === 0) {
        errors.push(`Gate ${node.label || nodeId} has no inputs`);
        nodeValues.set(nodeId, false);
      } else {
        const output = evaluateGate(node.gateType, inputValues);
        nodeValues.set(nodeId, output);
      }
    } else if (node.type === 'OUTPUT') {
      const inputNodes = nodeInputs.get(nodeId) || [];
      if (inputNodes.length === 0) {
        errors.push('Output has no input connection');
        nodeValues.set(nodeId, false);
      } else {
        // Output takes the value of its single input
        nodeValues.set(nodeId, nodeValues.get(inputNodes[0]) || false);
      }
    }
  }

  return {
    success: errors.length === 0,
    nodeValues,
    errors
  };
}

export function generateTruthTable(
  nodes: Map<string, LogicNode>,
  wires: Wire[],
  inputIds: string[],
  outputId: string
): TruthTableRow[] {
  const rows: TruthTableRow[] = [];
  const numInputs = inputIds.length;
  const numRows = Math.pow(2, numInputs);

  for (let i = 0; i < numRows; i++) {
    const inputValues = new Map<string, boolean>();
    const row: TruthTableRow = {};

    // Set input values based on binary representation
    for (let j = 0; j < numInputs; j++) {
      const value = Boolean((i >> (numInputs - 1 - j)) & 1);
      const inputId = inputIds[j];
      inputValues.set(inputId, value);
      
      // Find the label for this input
      const inputNode = nodes.get(inputId);
      const label = inputNode?.label || inputId;
      row[label] = value ? 1 : 0;
    }

    // Evaluate circuit with these inputs
    const context: EvaluationContext = { nodes, wires, inputValues };
    const result = evaluateCircuit(context, outputId);

    if (result.success) {
      const outputValue = result.nodeValues.get(outputId) || false;
      // Always use 'Y' as the output label for consistency with target truth table
      row['Y'] = outputValue ? 1 : 0;
    } else {
      // If evaluation fails, set output to 0
      row['Y'] = 0;
    }

    rows.push(row);
  }

  return rows;
}

export function compareTruthTables(
  actual: TruthTableRow[],
  target: TruthTableRow[]
): { matches: boolean; mismatches: number[] } {
  const mismatches: number[] = [];
  
  if (actual.length !== target.length) {
    return { matches: false, mismatches: [] };
  }

  for (let i = 0; i < actual.length; i++) {
    const actualRow = actual[i];
    const targetRow = target[i];
    
    // Compare output values (usually labeled 'Y' or 'Lamp')
    const outputKeys = Object.keys(targetRow).filter(key => 
      key.startsWith('Y') || key.includes('Lamp') || key.includes('Output')
    );
    
    for (const key of outputKeys) {
      if (actualRow[key] !== targetRow[key]) {
        mismatches.push(i);
        break;
      }
    }
  }

  return {
    matches: mismatches.length === 0,
    mismatches
  };
}
