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
        'px-4 py-2 shadow-md rounded-md bg-charcoal border-2 transition-all',
        data.value ? 'border-mint' : 'border-gray-600',
        selected && 'ring-2 ring-lavender'
      )}
    >
      <div className="flex items-center">
        <Power
          className={cn(
            'w-4 h-4 mr-2 transition-colors',
            data.value ? 'text-mint' : 'text-gray-500'
          )}
        />
        <div className="text-off-white font-bold">{data.label}</div>
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
