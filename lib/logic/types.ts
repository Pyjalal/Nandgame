// Core types for the logic gate puzzle game

export type GateType = 'AND' | 'OR' | 'XOR' | 'NOT';
export type NodeType = 'INPUT' | 'OUTPUT' | 'GATE';

export interface Position {
  x: number;
  y: number;
}

export interface LogicNode {
  id: string;
  type: NodeType;
  gateType?: GateType;
  position: Position;
  label?: string;
  value?: boolean;
  inputs?: string[];
  outputs?: string[];
  maxInputs?: number;
  locked?: boolean;
}

export interface Wire {
  id: string;
  source: string;
  sourceHandle?: string;
  target: string;
  targetHandle?: string;
  signal?: boolean;
  animated?: boolean;
}

export interface TruthTableRow {
  [key: string]: number | boolean;
}

export interface Level {
  id: string;
  title: string;
  description?: string;
  inputs: string[];
  targetTruth: TruthTableRow[];
  allowedGates: GateType[];
  constraints?: {
    maxGates?: number;
    maxWires?: number;
    timeSec?: number;
  };
  lockedNodes: {
    type: 'Input' | 'Output' | 'Gate';
    id: string;
    label: string;
    position: Position;
    gateType?: GateType;
  }[];
  singleOutputId: string;
  hint?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  mode?: 'standard' | 'csfair';
  solutionWiring?: {
    source: string;
    target: string;
  }[];
}

export interface GameState {
  currentLevelId: string | null;
  nodes: Map<string, LogicNode>;
  wires: Wire[];
  inputStates: Map<string, boolean>;
  simulationResult: TruthTableRow[] | null;
  isSimulating: boolean;
  score: number;
  timeElapsed: number;
  hintsUsed: number;
  completed: boolean;
  stars: number;
}

export interface SimulationResult {
  success: boolean;
  truthTable: TruthTableRow[];
  errors?: string[];
  continuityValid: boolean;
  arityValid: boolean;
}
