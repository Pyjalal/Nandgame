import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from '@/lib/utils';
import { GateType } from '@/lib/logic/types';

interface GateNodeData {
  label: string;
  gateType: GateType;
  value?: boolean;
  error?: boolean;
}

const GateNode: React.FC<NodeProps<GateNodeData>> = ({ data, selected }) => {
  const gateColors = {
    AND: 'gate-and',
    OR: 'gate-or',
    XOR: 'gate-xor',
    NOT: 'gate-not'
  };

  const gateSymbols = {
    AND: '&',
    OR: '≥1',
    XOR: '=1',
    NOT: '1'
  };

  const gateDescriptions = {
    AND: 'AND: 1 only if both inputs are 1',
    OR: 'OR: 1 if at least one input is 1',
    XOR: 'XOR: 1 when inputs are different',
    NOT: 'NOT: Inverts the input (1→0, 0→1)'
  };

  const maxInputs = data.gateType === 'NOT' ? 1 : 4;

  return (
    <div
      className={cn(
        'px-4 py-3 shadow-lg rounded-lg border-2 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl min-w-[80px] cursor-grab active:cursor-grabbing select-none',
        gateColors[data.gateType],
        'border-transparent',
        selected && 'ring-2 ring-lavender',
        data.error && 'ring-2 ring-error animate-pulse',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender'
      )}
      tabIndex={0}
      aria-selected={selected}
      aria-label={`Gate ${data.gateType} ${data.value ? 'active' : 'inactive'}`}
      title={gateDescriptions[data.gateType]}
    >
      <div className="text-off-white font-bold text-center">
        <div className="text-xs opacity-80">{data.gateType}</div>
        <div className="text-lg">{gateSymbols[data.gateType]}</div>
      </div>
      
      {/* Input handles */}
      {Array.from({ length: maxInputs }).map((_, i) => (
        <Handle
          key={`input-${i}`}
          type="target"
          position={Position.Left}
          id={`input-${i}`}
          style={{ top: `${((i + 1) * 100) / (maxInputs + 1)}%` }}
          className="w-3 h-3 !bg-lavender border-2 !border-off-white"
        />
      ))}
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className={cn(
          'w-3 h-3 !bg-lavender border-2 !border-off-white',
          data.value && '!bg-mint'
        )}
      />
    </div>
  );
};

export default GateNode;
