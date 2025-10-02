import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from '@/lib/utils';
import { Power } from 'lucide-react';

interface InputNodeData {
  label: string;
  value: boolean;
}

const InputNode: React.FC<NodeProps<InputNodeData>> = ({ data, selected }) => {
  return (
    <div
      className={cn(
        'px-6 py-4 shadow-md rounded-md bg-gradient-to-b from-charcoal to-charcoal/80 border-2 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-grab active:cursor-grabbing select-none',
        data.value ? 'border-mint ring-1 ring-mint/40' : 'border-lavender/30',
        selected && 'ring-2 ring-lavender',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender',
        'touch-none' // Improve touch dragging
      )}
      tabIndex={0}
      aria-selected={selected}
      aria-label={`Input ${data.label} ${data.value ? 'on' : 'off'}`}
    >
      <div className="flex items-center pointer-events-none">
        <Power
          className={cn(
            'w-5 h-5 mr-2 transition-colors',
            data.value ? 'text-mint' : 'text-violet/60'
          )}
        />
        <div className="text-off-white font-bold text-base">{data.label}</div>
      </div>
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

export default InputNode;
