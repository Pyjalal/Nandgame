'use client';

import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { cn } from '@/lib/utils';
import InputNode from './nodes/InputNode';
import GateNode from './nodes/GateNode';
import OutputNode from './nodes/OutputNode';
import BoardTouchControls from './BoardTouchControls';
import useGameStore from '@/store/useGameStore';
import { GateType } from '@/lib/logic/types';

const nodeTypes = {
  input: InputNode,
  gate: GateNode,
  output: OutputNode,
};

interface BoardProps {
  className?: string;
}

const Board: React.FC<BoardProps> = ({ className }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const {
    currentLevel,
    addNode,
    removeNode,
    addWire,
    removeWire,
    selectNode,
    resetTrigger,
    wires: storeWires,
    showSolution,
  } = useGameStore();

  // Initialize nodes from level
  React.useEffect(() => {
    if (currentLevel) {
      const initialNodes: Node[] = currentLevel.lockedNodes.map(lockedNode => {
        const nodeType = lockedNode.type.toLowerCase() as 'input' | 'output' | 'gate';
        const nodeData: any = {
          label: lockedNode.label,
          value: false,
        };

        // Add gateType for gate nodes
        if (lockedNode.type === 'Gate' && lockedNode.gateType) {
          nodeData.gateType = lockedNode.gateType;
        }

        return {
          id: lockedNode.id,
          type: nodeType,
          position: lockedNode.position,
          data: nodeData,
          deletable: false,
          draggable: false,
        };
      });
      setNodes(initialNodes);
      setEdges([]);
    }
  }, [currentLevel, resetTrigger, setNodes, setEdges]);

  // Sync edges with store wires (for undo functionality)
  React.useEffect(() => {
    const reactFlowEdges: Edge[] = storeWires.map(wire => ({
      id: wire.id,
      source: wire.source,
      target: wire.target,
      sourceHandle: wire.sourceHandle,
      targetHandle: wire.targetHandle,
      animated: wire.animated || false,
      style: { stroke: 'rgb(var(--mint))', strokeWidth: 2 },
    }));

    // Add solution wires if showSolution is true
    if (showSolution && currentLevel?.solutionWiring) {
      const solutionEdges: Edge[] = currentLevel.solutionWiring.map((wire, index) => ({
        id: `solution-${wire.source}-${wire.target}-${index}`,
        source: wire.source,
        target: wire.target,
        animated: true,
        style: {
          stroke: 'rgb(var(--warning))',
          strokeWidth: 3,
          strokeDasharray: '5,5'
        },
      }));
      setEdges([...reactFlowEdges, ...solutionEdges]);
    } else {
      setEdges(reactFlowEdges);
    }
  }, [storeWires, resetTrigger, showSolution, currentLevel, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      
      // Validate left-to-right connection
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      if (!sourceNode || !targetNode) return;
      if (sourceNode.position.x >= targetNode.position.x) {
        // Invalid connection direction
        return;
      }

      const newEdge: Edge = {
        id: `${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle || undefined,
        targetHandle: params.targetHandle || undefined,
        animated: false,
        style: { stroke: 'rgb(var(--mint))', strokeWidth: 2 },
      };

      setEdges((eds) => addEdge(newEdge, eds));
      
      // Update game store
      addWire({
        id: newEdge.id,
        source: params.source,
        sourceHandle: params.sourceHandle || undefined,
        target: params.target,
        targetHandle: params.targetHandle || undefined,
      });
    },
    [nodes, setEdges, addWire]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const type = event.dataTransfer.getData('gateType') as GateType;
      if (!type) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `gate-${Date.now()}`,
        type: 'gate',
        position,
        data: {
          label: type,
          gateType: type,
          value: false,
        },
      };

      setNodes((nds) => nds.concat(newNode));
      
      // Update game store
      addNode({
        id: newNode.id,
        type: 'GATE',
        gateType: type,
        position: newNode.position,
        label: type,
      });
    },
    [reactFlowInstance, setNodes, addNode]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onNodesDelete = useCallback(
    (nodesToDelete: Node[]) => {
      nodesToDelete.forEach(node => {
        if (node.deletable !== false) {
          removeNode(node.id);
        }
      });
    },
    [removeNode]
  );

  const onEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      edgesToDelete.forEach(edge => {
        removeWire(edge.id);
      });
    },
    [removeWire]
  );

  return (
    <div ref={reactFlowWrapper} className={cn('h-full w-full', className)}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        nodeTypes={nodeTypes}
        fitView
        className="circuit-board"
        // Mobile-friendly settings
        panOnScroll={true}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        panOnScrollSpeed={0.5}
        minZoom={0.3}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        // Touch-friendly connection settings
        connectionMode="loose"
        connectOnClick={true}
        // Prevent accidental deletions on mobile
        deleteKeyCode={["Delete", "Backspace"]}
        multiSelectionKeyCode={null}
      >
        <Background color={"rgb(var(--lavender))"} gap={50} variant={"lines" as any} />
        <Controls
          showZoom={true}
          showFitView={true}
          showInteractive={false}
          position="bottom-right"
        />
      </ReactFlow>
    </div>
  );
};

export default function BoardWithProvider(props: BoardProps) {
  return (
    <ReactFlowProvider>
      <Board {...props} />
    </ReactFlowProvider>
  );
}
