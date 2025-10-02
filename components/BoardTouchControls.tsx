'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, MoveHorizontal, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactFlowInstance } from 'reactflow';

interface BoardTouchControlsProps {
  reactFlowInstance: ReactFlowInstance | null;
  className?: string;
}

export default function BoardTouchControls({ 
  reactFlowInstance,
  className
}: BoardTouchControlsProps) {
  const zoomIn = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomIn();
    }
  };

  const zoomOut = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomOut();
    }
  };

  const fitView = () => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 });
    }
  };

  return (
    <div className={cn(
      "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2 bg-charcoal/70 backdrop-blur-md p-2 rounded-full border border-lavender/20 shadow-lg md:hidden",
      className
    )}>
      <Button
        onClick={zoomIn}
        variant="gate"
        size="icon"
        className="rounded-full w-10 h-10"
      >
        <ZoomIn className="w-5 h-5" />
        <span className="sr-only">Zoom In</span>
      </Button>
      
      <Button
        onClick={zoomOut}
        variant="gate"
        size="icon"
        className="rounded-full w-10 h-10"
      >
        <ZoomOut className="w-5 h-5" />
        <span className="sr-only">Zoom Out</span>
      </Button>
      
      <Button
        onClick={fitView}
        variant="gate"
        size="icon"
        className="rounded-full w-10 h-10"
      >
        <Maximize className="w-5 h-5" />
        <span className="sr-only">Fit View</span>
      </Button>
    </div>
  );
}
