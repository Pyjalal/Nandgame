import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';

interface OutputNodeData {
  label: string;
  value: boolean;
  target?: boolean;
}

const OutputNode: React.FC<NodeProps<OutputNodeData>> = ({ data, selected }) => {
  const isOn = data.value;
  const matchesTarget = data.target === undefined || data.value === data.target;

  return (
    <div
      className={cn(
        'px-4 py-2 shadow-lg rounded-md border-2 transition-all',
        'bg-charcoal',
        isOn ? 'border-mint shadow-mint/50' : 'border-gray-600',
        selected && 'ring-2 ring-lavender',
        !matchesTarget && 'ring-2 ring-error'
      )}
    >
      <div className="flex items-center">
        <Lightbulb
          className={cn(
            'w-5 h-5 mr-2 transition-all',
            isOn ? 'text-warning fill-warning drop-shadow-lg' : 'text-gray-500'
          )}
        />
        <div className="text-off-white font-bold">{data.label}</div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className={cn(
          'w-3 h-3 !bg-lavender border-2 !border-off-white',
          isOn && '!bg-mint'
        )}
      />
    </div>
  );
};

export default OutputNode;
