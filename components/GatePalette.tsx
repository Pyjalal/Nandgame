'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GateType } from '@/lib/logic/types';
import { cn } from '@/lib/utils';
import useGameStore from '@/store/useGameStore';

const gates: { type: GateType; label: string; symbol: string; color: string }[] = [
  { type: 'AND', label: 'AND Gate', symbol: '&', color: 'bg-gate-and' },
  { type: 'OR', label: 'OR Gate', symbol: '≥1', color: 'bg-gate-or' },
  { type: 'XOR', label: 'XOR Gate', symbol: '=1', color: 'bg-gate-xor' },
  { type: 'NOT', label: 'NOT Gate', symbol: '1', color: 'bg-gate-not' },
];

export default function GatePalette() {
  const { currentLevel, gatesUsed } = useGameStore();
  const maxGates = currentLevel?.constraints?.maxGates || 20;
  const isCSFairMode = currentLevel?.mode === 'csfair';

  const onDragStart = (event: React.DragEvent, gateType: GateType) => {
    event.dataTransfer.setData('gateType', gateType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card className="glass-dark border-lavender/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-off-white text-lg">
          {isCSFairMode ? 'CS Fair Mode' : `Logic Gates (${gatesUsed}/${maxGates})`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isCSFairMode ? (
          <div className="p-4 bg-violet/10 border border-violet/30 rounded-lg">
            <p className="text-sm text-violet font-semibold mb-2">
              🎯 Connection Challenge
            </p>
            <p className="text-xs text-off-white/70">
              All logic gates are already placed on the board! Your task is to find the correct wire connections between the inputs, gates, and lamp to match the target truth table.
            </p>
          </div>
        ) : (
          gates.map((gate) => {
            const isAllowed = currentLevel?.allowedGates?.includes(gate.type) ?? true;
            const isDisabled = !isAllowed || gatesUsed >= maxGates;

            return (
              <div
                key={gate.type}
                draggable={!isDisabled}
                onDragStart={(e) => !isDisabled && onDragStart(e, gate.type)}
                className={cn(
                  'cursor-move',
                  isDisabled && 'cursor-not-allowed opacity-50'
                )}
              >
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-white border-transparent',
                    gate.color,
                    'hover:opacity-90 transition-opacity',
                    isDisabled && 'pointer-events-none'
                  )}
                >
                  <span className="text-xl mr-2 font-bold">{gate.symbol}</span>
                  <span className="text-sm">{gate.label}</span>
                </Button>
              </div>
            );
          })
        )}
        <div className="mt-4 p-3 bg-charcoal/50 rounded-lg">
          <p className="text-xs text-off-white/70">
            {isCSFairMode
              ? 'Connect nodes by clicking and dragging between connection points. Remove wires by clicking on them.'
              : 'Drag gates onto the board to build your circuit. Connect them with wires by clicking and dragging between connection points.'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
