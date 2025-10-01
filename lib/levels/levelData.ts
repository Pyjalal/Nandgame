import { Level } from '@/lib/logic/types';

export const levels: Level[] = [
  // Level 1: Introduction to AND Gate
  {
    id: "L01_intro_and",
    title: "AND Gate Introduction",
    description: "Create a circuit that outputs 1 only when both inputs are 1",
    inputs: ["A", "B"],
    targetTruth: [
      { A: 0, B: 0, Y: 0 },
      { A: 0, B: 1, Y: 0 },
      { A: 1, B: 0, Y: 0 },
      { A: 1, B: 1, Y: 1 }
    ],
    allowedGates: ["AND"],
    constraints: {
      maxGates: 1,
      maxWires: 3,
      timeSec: 60
    },
    lockedNodes: [
      { type: "Input", id: "inA", label: "A", position: { x: 100, y: 150 } },
      { type: "Input", id: "inB", label: "B", position: { x: 100, y: 250 } },
      { type: "Output", id: "lampY", label: "Lamp", position: { x: 700, y: 200 } }
    ],
    singleOutputId: "lampY",
    hint: "Connect both inputs to an AND gate, then connect the AND gate to the lamp.",
    difficulty: "easy"
  },

  // Level 2: OR Gate
  {
    id: "L02_intro_or",
    title: "OR Gate Introduction",
    description: "Create a circuit that outputs 1 when at least one input is 1",
    inputs: ["A", "B"],
    targetTruth: [
      { A: 0, B: 0, Y: 0 },
      { A: 0, B: 1, Y: 1 },
      { A: 1, B: 0, Y: 1 },
      { A: 1, B: 1, Y: 1 }
    ],
    allowedGates: ["OR"],
    constraints: {
      maxGates: 1,
      maxWires: 3,
      timeSec: 60
    },
    lockedNodes: [
      { type: "Input", id: "inA", label: "A", position: { x: 100, y: 150 } },
      { type: "Input", id: "inB", label: "B", position: { x: 100, y: 250 } },
      { type: "Output", id: "lampY", label: "Lamp", position: { x: 700, y: 200 } }
    ],
    singleOutputId: "lampY",
    hint: "Use an OR gate to combine the inputs.",
    difficulty: "easy"
  },

  // Level 3: NOT Gate
  {
    id: "L03_intro_not",
    title: "NOT Gate Introduction",
    description: "Create a circuit that inverts the input",
    inputs: ["A"],
    targetTruth: [
      { A: 0, Y: 1 },
      { A: 1, Y: 0 }
    ],
    allowedGates: ["NOT"],
    constraints: {
      maxGates: 1,
      maxWires: 2,
      timeSec: 45
    },
    lockedNodes: [
      { type: "Input", id: "inA", label: "A", position: { x: 100, y: 200 } },
      { type: "Output", id: "lampY", label: "Lamp", position: { x: 700, y: 200 } }
    ],
    singleOutputId: "lampY",
    hint: "Use a NOT gate to invert the signal.",
    difficulty: "easy"
  },

  // Level 4: NAND (NOT AND)
  {
    id: "L04_nand",
    title: "NAND Gate",
    description: "Create a NAND gate using AND and NOT gates",
    inputs: ["A", "B"],
    targetTruth: [
      { A: 0, B: 0, Y: 1 },
      { A: 0, B: 1, Y: 1 },
      { A: 1, B: 0, Y: 1 },
      { A: 1, B: 1, Y: 0 }
    ],
    allowedGates: ["AND", "NOT"],
    constraints: {
      maxGates: 2,
      maxWires: 4,
      timeSec: 90
    },
    lockedNodes: [
      { type: "Input", id: "inA", label: "A", position: { x: 100, y: 150 } },
      { type: "Input", id: "inB", label: "B", position: { x: 100, y: 250 } },
      { type: "Output", id: "lampY", label: "Lamp", position: { x: 700, y: 200 } }
    ],
    singleOutputId: "lampY",
    hint: "NAND = NOT(AND). Connect A and B to AND, then AND output to NOT.",
    difficulty: "easy"
  },

  // Level 5: XOR Gate Introduction
  {
    id: "L05_xor_intro",
    title: "XOR Gate Introduction",
    description: "Create a circuit that outputs 1 when inputs are different",
    inputs: ["A", "B"],
    targetTruth: [
      { A: 0, B: 0, Y: 0 },
      { A: 0, B: 1, Y: 1 },
      { A: 1, B: 0, Y: 1 },
      { A: 1, B: 1, Y: 0 }
    ],
    allowedGates: ["XOR"],
    constraints: {
      maxGates: 1,
      maxWires: 3,
      timeSec: 60
    },
    lockedNodes: [
      { type: "Input", id: "inA", label: "A", position: { x: 100, y: 150 } },
      { type: "Input", id: "inB", label: "B", position: { x: 100, y: 250 } },
      { type: "Output", id: "lampY", label: "Lamp", position: { x: 700, y: 200 } }
    ],
    singleOutputId: "lampY",
    hint: "XOR outputs true when inputs are different.",
    difficulty: "easy"
  },

  // Level 6: XOR from basic gates
  {
    id: "L06_xor_from_basic",
    title: "Build XOR",
    description: "Create an XOR gate using AND, OR, and NOT gates",
    inputs: ["A", "B"],
    targetTruth: [
      { A: 0, B: 0, Y: 0 },
      { A: 0, B: 1, Y: 1 },
      { A: 1, B: 0, Y: 1 },
      { A: 1, B: 1, Y: 0 }
    ],
    allowedGates: ["AND", "OR", "NOT"],
    constraints: {
      maxGates: 5,
      maxWires: 9,
      timeSec: 180
    },
    lockedNodes: [
      { type: "Input", id: "inA", label: "A", position: { x: 100, y: 150 } },
      { type: "Input", id: "inB", label: "B", position: { x: 100, y: 250 } },
      { type: "Output", id: "lampY", label: "Lamp", position: { x: 700, y: 200 } }
    ],
    singleOutputId: "lampY",
    hint: "XOR = (A OR B) AND NOT(A AND B)",
    difficulty: "medium"
  },

  // Level 7: 3-input majority
  {
    id: "L07_majority",
    title: "Majority Vote",
    description: "Output 1 when at least 2 out of 3 inputs are 1",
    inputs: ["A", "B", "C"],
    targetTruth: [
      { A: 0, B: 0, C: 0, Y: 0 },
      { A: 0, B: 0, C: 1, Y: 0 },
      { A: 0, B: 1, C: 0, Y: 0 },
      { A: 0, B: 1, C: 1, Y: 1 },
      { A: 1, B: 0, C: 0, Y: 0 },
      { A: 1, B: 0, C: 1, Y: 1 },
      { A: 1, B: 1, C: 0, Y: 1 },
      { A: 1, B: 1, C: 1, Y: 1 }
    ],
    allowedGates: ["AND", "OR"],
    constraints: {
      maxGates: 4,
      maxWires: 8,
      timeSec: 240
    },
    lockedNodes: [
      { type: "Input", id: "inA", label: "A", position: { x: 100, y: 100 } },
      { type: "Input", id: "inB", label: "B", position: { x: 100, y: 200 } },
      { type: "Input", id: "inC", label: "C", position: { x: 100, y: 300 } },
      { type: "Output", id: "lampY", label: "Lamp", position: { x: 700, y: 200 } }
    ],
    singleOutputId: "lampY",
    hint: "(A AND B) OR (A AND C) OR (B AND C)",
    difficulty: "medium"
  },

  // Level 8: Even parity checker
  {
    id: "L08_even_parity",
    title: "Even Parity",
    description: "Output 1 when there's an even number of 1s in the input",
    inputs: ["A", "B", "C"],
    targetTruth: [
      { A: 0, B: 0, C: 0, Y: 1 },
      { A: 0, B: 0, C: 1, Y: 0 },
      { A: 0, B: 1, C: 0, Y: 0 },
      { A: 0, B: 1, C: 1, Y: 1 },
      { A: 1, B: 0, C: 0, Y: 0 },
      { A: 1, B: 0, C: 1, Y: 1 },
      { A: 1, B: 1, C: 0, Y: 1 },
      { A: 1, B: 1, C: 1, Y: 0 }
    ],
    allowedGates: ["XOR", "NOT"],
    constraints: {
      maxGates: 3,
      maxWires: 5,
      timeSec: 180
    },
    lockedNodes: [
      { type: "Input", id: "inA", label: "A", position: { x: 100, y: 100 } },
      { type: "Input", id: "inB", label: "B", position: { x: 100, y: 200 } },
      { type: "Input", id: "inC", label: "C", position: { x: 100, y: 300 } },
      { type: "Output", id: "lampY", label: "Lamp", position: { x: 700, y: 200 } }
    ],
    singleOutputId: "lampY",
    hint: "Chain XOR gates and use NOT at the end",
    difficulty: "hard"
  },

  // Level 9: Half Adder
  {
    id: "L09_half_adder_sum",
    title: "Half Adder (Sum)",
    description: "Create the sum output of a half adder",
    inputs: ["A", "B"],
    targetTruth: [
      { A: 0, B: 0, Y: 0 },
      { A: 0, B: 1, Y: 1 },
      { A: 1, B: 0, Y: 1 },
      { A: 1, B: 1, Y: 0 }
    ],
    allowedGates: ["AND", "OR", "XOR", "NOT"],
    constraints: {
      maxGates: 3,
      maxWires: 5,
      timeSec: 120
    },
    lockedNodes: [
      { type: "Input", id: "inA", label: "A", position: { x: 100, y: 150 } },
      { type: "Input", id: "inB", label: "B", position: { x: 100, y: 250 } },
      { type: "Output", id: "lampY", label: "Sum", position: { x: 700, y: 200 } }
    ],
    singleOutputId: "lampY",
    hint: "The sum of a half adder is A XOR B",
    difficulty: "medium"
  },

  // Level 10: Multiplexer
  {
    id: "L10_mux",
    title: "2-to-1 Multiplexer",
    description: "Select between two inputs based on a control signal (S=0→A, S=1→B)",
    inputs: ["A", "B", "S"],
    targetTruth: [
      { A: 0, B: 0, S: 0, Y: 0 },
      { A: 0, B: 0, S: 1, Y: 0 },
      { A: 0, B: 1, S: 0, Y: 0 },
      { A: 0, B: 1, S: 1, Y: 1 },
      { A: 1, B: 0, S: 0, Y: 1 },
      { A: 1, B: 0, S: 1, Y: 0 },
      { A: 1, B: 1, S: 0, Y: 1 },
      { A: 1, B: 1, S: 1, Y: 1 }
    ],
    allowedGates: ["AND", "OR", "NOT"],
    constraints: {
      maxGates: 4,
      maxWires: 8,
      timeSec: 300
    },
    lockedNodes: [
      { type: "Input", id: "inA", label: "A", position: { x: 100, y: 100 } },
      { type: "Input", id: "inB", label: "B", position: { x: 100, y: 200 } },
      { type: "Input", id: "inS", label: "S", position: { x: 100, y: 300 } },
      { type: "Output", id: "lampY", label: "Out", position: { x: 700, y: 200 } }
    ],
    singleOutputId: "lampY",
    hint: "Y = (A AND NOT(S)) OR (B AND S)",
    difficulty: "hard"
  },

  // CS Fair Mode - Gates are pre-placed, find the right connections!
  {
    id: "CSF01_circuit_mystery",
    title: "CS Fair: Circuit Connection Challenge",
    description: "All gates are placed! Find the correct wiring to create this mystery circuit",
    inputs: ["A", "B", "C"],
    targetTruth: [
      { A: 0, B: 0, C: 0, Y: 1 },
      { A: 0, B: 0, C: 1, Y: 1 },
      { A: 0, B: 1, C: 0, Y: 1 },
      { A: 0, B: 1, C: 1, Y: 0 },
      { A: 1, B: 0, C: 0, Y: 1 },
      { A: 1, B: 0, C: 1, Y: 1 },
      { A: 1, B: 1, C: 0, Y: 1 },
      { A: 1, B: 1, C: 1, Y: 1 }
    ],
    allowedGates: [],
    constraints: {
      maxWires: 12,
      timeSec: 300
    },
    lockedNodes: [
      { type: "Input", id: "inA", label: "A", position: { x: 100, y: 100 } },
      { type: "Input", id: "inB", label: "B", position: { x: 100, y: 200 } },
      { type: "Input", id: "inC", label: "C", position: { x: 100, y: 300 } },
      { type: "Gate", id: "gate1", label: "XOR", position: { x: 300, y: 150 }, gateType: "XOR" },
      { type: "Gate", id: "gate2", label: "XOR", position: { x: 500, y: 200 }, gateType: "XOR" },
      { type: "Gate", id: "gate3", label: "AND", position: { x: 300, y: 280 }, gateType: "AND" },
      { type: "Gate", id: "gate4", label: "NOT", position: { x: 500, y: 280 }, gateType: "NOT" },
      { type: "Gate", id: "gate5", label: "OR", position: { x: 700, y: 240 }, gateType: "OR" },
      { type: "Output", id: "lampY", label: "Lamp", position: { x: 850, y: 240 } }
    ],
    singleOutputId: "lampY",
    hint: "Look at the truth table pattern carefully. Try combining XOR operations with logic that handles specific cases. The solution involves: (A XOR B XOR C) OR NOT(B AND C)",
    difficulty: "medium",
    mode: "csfair",
    solutionWiring: [
      { source: "inA", target: "gate1" },
      { source: "inB", target: "gate1" },
      { source: "gate1", target: "gate2" },
      { source: "inC", target: "gate2" },
      { source: "inB", target: "gate3" },
      { source: "inC", target: "gate3" },
      { source: "gate3", target: "gate4" },
      { source: "gate2", target: "gate5" },
      { source: "gate4", target: "gate5" },
      { source: "gate5", target: "lampY" }
    ]
  }
];

export function getLevelById(id: string): Level | undefined {
  return levels.find(level => level.id === id);
}

export function getNextLevelId(currentId: string): string | null {
  const currentIndex = levels.findIndex(level => level.id === currentId);
  if (currentIndex === -1 || currentIndex === levels.length - 1) {
    return null;
  }
  return levels[currentIndex + 1].id;
}

export function getPreviousLevelId(currentId: string): string | null {
  const currentIndex = levels.findIndex(level => level.id === currentId);
  if (currentIndex <= 0) {
    return null;
  }
  return levels[currentIndex - 1].id;
}
