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
        'px-6 py-4 shadow-lg rounded-md border-2 transition-transform duration-200 hover:-translate-y-0.5 cursor-grab active:cursor-grabbing select-none',
        'bg-gradient-to-b from-charcoal to-charcoal/80',
        isOn ? 'border-mint ring-1 ring-mint/40' : 'border-lavender/30',
        selected && 'ring-2 ring-lavender',
        !matchesTarget && 'ring-2 ring-error',
        'touch-none' // Improve touch dragging
      )}
      tabIndex={0}
      aria-selected={selected}
      aria-label={`Output ${data.label} ${isOn ? 'on' : 'off'}${
        data.target !== undefined ? (matchesTarget ? ' target matched' : ' target mismatch') : ''
      }`}
    >
      <div className="flex items-center pointer-events-none">
        <Lightbulb
          className={cn(
            'w-5 h-5 mr-2 transition-all',
            isOn ? 'text-warning fill-warning drop-shadow-lg' : 'text-violet/60'
          )}
        />
        <div className="text-off-white font-bold text-base">{data.label}</div>
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
