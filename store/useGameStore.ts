import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer';
import { LogicNode, Wire, Level, TruthTableRow, GateType } from '@/lib/logic/types';
import { evaluateCircuit, generateTruthTable, compareTruthTables } from '@/lib/logic/evaluate';

enableMapSet();

interface GameStore {
  // Level data
  currentLevel: Level | null;
  levels: Level[];
  currentLevelIndex: number;
  
  // Board state
  nodes: Map<string, LogicNode>;
  wires: Wire[];
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  
  // Simulation state
  isSimulating: boolean;
  simulationResult: TruthTableRow[] | null;
  targetTruthTable: TruthTableRow[] | null;
  truthTableMatches: boolean[];
  simulationErrors: string[];
  
  // Game state
  score: number;
  stars: number;
  timeElapsed: number;
  hintsUsed: number;
  gatesUsed: number;
  wiresUsed: number;
  
  // UI state
  showTruthTable: boolean;
  showHint: boolean;
  isPaused: boolean;
  
  // Actions
  loadLevel: (level: Level) => void;
  addNode: (node: LogicNode) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<LogicNode>) => void;
  addWire: (wire: Wire) => void;
  removeWire: (wireId: string) => void;
  selectNode: (nodeId: string | null) => void;
  hoverNode: (nodeId: string | null) => void;
  simulate: () => void;
  reset: () => void;
  toggleTruthTable: () => void;
  toggleHint: () => void;
  updateTime: (time: number) => void;
  nextLevel: () => void;
  previousLevel: () => void;
}

const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    // Initial state
    currentLevel: null,
    levels: [],
    currentLevelIndex: 0,
    nodes: new Map(),
    wires: [],
    selectedNodeId: null,
    hoveredNodeId: null,
    isSimulating: false,
    simulationResult: null,
    targetTruthTable: null,
    truthTableMatches: [],
    simulationErrors: [],
    score: 0,
    stars: 0,
    timeElapsed: 0,
    hintsUsed: 0,
    gatesUsed: 0,
    wiresUsed: 0,
    showTruthTable: false,
    showHint: false,
    isPaused: false,

    // Actions
    loadLevel: (level: Level) => {
      set((state) => {
        state.currentLevel = level;
        state.nodes = new Map();
        state.wires = [];
        state.simulationResult = null;
        state.targetTruthTable = level.targetTruth;
        state.truthTableMatches = [];
        state.simulationErrors = [];
        state.gatesUsed = 0;
        state.wiresUsed = 0;
        state.timeElapsed = 0;
        state.hintsUsed = 0;
        
        // Add locked nodes (inputs, outputs, and gates in CS Fair mode)
        level.lockedNodes.forEach(lockedNode => {
          const node: LogicNode = {
            id: lockedNode.id,
            type: lockedNode.type === 'Input' ? 'INPUT' : lockedNode.type === 'Output' ? 'OUTPUT' : 'GATE',
            position: lockedNode.position,
            label: lockedNode.label,
            locked: true,
            value: false
          };

          // Add gate-specific properties for locked gates
          if (lockedNode.type === 'Gate' && lockedNode.gateType) {
            node.gateType = lockedNode.gateType;
            state.gatesUsed++;
          }

          state.nodes.set(node.id, node);
        });
      });
    },

    addNode: (node: LogicNode) => {
      set((state) => {
        if (!state.nodes.has(node.id)) {
          state.nodes.set(node.id, node);
          if (node.type === 'GATE') {
            state.gatesUsed++;
          }
        }
      });
    },

    removeNode: (nodeId: string) => {
      set((state) => {
        const node = state.nodes.get(nodeId);
        if (node && !node.locked) {
          state.nodes.delete(nodeId);
          if (node.type === 'GATE') {
            state.gatesUsed = Math.max(0, state.gatesUsed - 1);
          }
          // Remove connected wires
          state.wires = state.wires.filter(
            wire => wire.source !== nodeId && wire.target !== nodeId
          );
        }
      });
    },

    updateNode: (nodeId: string, updates: Partial<LogicNode>) => {
      set((state) => {
        const node = state.nodes.get(nodeId);
        if (node) {
          Object.assign(node, updates);
        }
      });
    },

    addWire: (wire: Wire) => {
      set((state) => {
        // Check if wire already exists
        const exists = state.wires.some(
          w => w.source === wire.source && w.target === wire.target
        );
        if (!exists) {
          state.wires.push(wire);
          state.wiresUsed++;
        }
      });
    },

    removeWire: (wireId: string) => {
      set((state) => {
        const index = state.wires.findIndex(w => w.id === wireId);
        if (index !== -1) {
          state.wires.splice(index, 1);
          state.wiresUsed = Math.max(0, state.wiresUsed - 1);
        }
      });
    },

    selectNode: (nodeId: string | null) => {
      set((state) => {
        state.selectedNodeId = nodeId;
      });
    },

    hoverNode: (nodeId: string | null) => {
      set((state) => {
        state.hoveredNodeId = nodeId;
      });
    },

    simulate: () => {
      const state = get();
      const { currentLevel, nodes, wires } = state;

      if (!currentLevel) return;

      set((state) => {
        state.isSimulating = true;
        state.simulationErrors = [];
      });

      // Find input and output nodes
      const inputIds: string[] = [];
      let outputId = currentLevel.singleOutputId;

      nodes.forEach((node, id) => {
        if (node.type === 'INPUT') {
          inputIds.push(id);
        }
      });

      console.log('=== SIMULATION DEBUG ===');
      console.log('Nodes:', Array.from(nodes.entries()));
      console.log('Wires:', wires);
      console.log('Input IDs:', inputIds);
      console.log('Output ID:', outputId);

      // Generate truth table
      const actualTruthTable = generateTruthTable(nodes, wires, inputIds, outputId);

      console.log('Actual Truth Table:', actualTruthTable);
      console.log('Target Truth Table:', currentLevel.targetTruth);

      // Compare with target
      const comparison = compareTruthTables(actualTruthTable, currentLevel.targetTruth);

      console.log('Comparison:', comparison);
      
      set((state) => {
        state.simulationResult = actualTruthTable;
        state.truthTableMatches = actualTruthTable.map((_, i) => 
          !comparison.mismatches.includes(i)
        );
        state.isSimulating = false;
        
        // Check if level is complete
        if (comparison.matches) {
          // Calculate stars based on performance
          let stars = 3;
          if (state.gatesUsed > (currentLevel.constraints?.maxGates || 10)) stars--;
          if (state.timeElapsed > (currentLevel.constraints?.timeSec || 180)) stars--;
          if (state.hintsUsed > 0) stars--;
          stars = Math.max(1, stars);
          
          state.stars = stars;
          state.score += 100 - state.timeElapsed + (stars * 50);
        }
      });
    },

    reset: () => {
      const state = get();
      if (state.currentLevel) {
        state.loadLevel(state.currentLevel);
      }
    },

    toggleTruthTable: () => {
      set((state) => {
        state.showTruthTable = !state.showTruthTable;
      });
    },

    toggleHint: () => {
      set((state) => {
        state.showHint = !state.showHint;
        if (!state.showHint) {
          state.hintsUsed++;
        }
      });
    },

    updateTime: (time: number) => {
      set((state) => {
        state.timeElapsed = time;
      });
    },

    nextLevel: () => {
      set((state) => {
        if (state.currentLevelIndex < state.levels.length - 1) {
          state.currentLevelIndex++;
          const nextLevel = state.levels[state.currentLevelIndex];
          if (nextLevel) {
            get().loadLevel(nextLevel);
          }
        }
      });
    },

    previousLevel: () => {
      set((state) => {
        if (state.currentLevelIndex > 0) {
          state.currentLevelIndex--;
          const prevLevel = state.levels[state.currentLevelIndex];
          if (prevLevel) {
            get().loadLevel(prevLevel);
          }
        }
      });
    }
  }))
);

export default useGameStore;
