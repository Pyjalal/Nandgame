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

  const maxInputs = data.gateType === 'NOT' ? 1 : 4;

  return (
    <div
      className={cn(
        'px-4 py-3 shadow-lg rounded-lg border-2 transition-all min-w-[80px]',
        gateColors[data.gateType],
        'border-transparent',
        selected && 'ring-2 ring-lavender',
        data.error && 'ring-2 ring-error animate-pulse'
      )}
    >
      <div className="text-white font-bold text-center">
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
