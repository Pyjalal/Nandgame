'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Board from '@/components/Board';
import GatePalette from '@/components/GatePalette';
import TruthTable from '@/components/TruthTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useGameStore from '@/store/useGameStore';
import { Level } from '@/lib/logic/types';
import { useToast } from '@/components/ui/use-toast';
import { 
  Play, 
  RotateCcw, 
  Home,
  Settings,
  Zap
} from 'lucide-react';

export default function SandboxPage() {
  const { toast } = useToast();
  
  const {
    loadLevel,
    simulate,
    reset,
    gatesUsed,
    wiresUsed
  } = useGameStore();

  // Create a sandbox level
  const sandboxLevel: Level = {
    id: "sandbox",
    title: "Sandbox Mode",
    description: "Free build with unlimited gates",
    inputs: ["A", "B", "C"],
    targetTruth: [
      { A: 0, B: 0, C: 0, Y: 0 },
      { A: 0, B: 0, C: 1, Y: 0 },
      { A: 0, B: 1, C: 0, Y: 0 },
      { A: 0, B: 1, C: 1, Y: 1 },
      { A: 1, B: 0, C: 0, Y: 0 },
      { A: 1, B: 0, C: 1, Y: 1 },
      { A: 1, B: 1, C: 0, Y: 1 },
      { A: 1, B: 1, C: 1, Y: 1 }
    ],
    allowedGates: ["AND", "OR", "XOR", "NOT"],
    constraints: {
      maxGates: 50,
      maxWires: 100,
      timeSec: 9999
    },
    lockedNodes: [
      { type: "Input", id: "inA", label: "A", position: { x: 100, y: 100 } },
      { type: "Input", id: "inB", label: "B", position: { x: 100, y: 200 } },
      { type: "Input", id: "inC", label: "C", position: { x: 100, y: 300 } },
      { type: "Output", id: "lampY", label: "Lamp", position: { x: 800, y: 200 } }
    ],
    singleOutputId: "lampY",
    difficulty: "easy"
  };

  // Load sandbox level on mount
  useEffect(() => {
    loadLevel(sandboxLevel);
  }, []);

  const handleSimulate = () => {
    simulate();
    toast({
      title: "Simulation Complete",
      description: "Check the truth table to see your circuit's output.",
    });
  };

  const handleReset = () => {
    reset();
    toast({
      title: "Circuit Reset",
      description: "All gates and connections have been cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-violet/80 to-lavender/40 p-4">
      <div className="h-[calc(100vh-2rem)] flex flex-col">
        {/* Header */}
        <div className="bg-charcoal/50 backdrop-blur-md rounded-lg p-4 mb-4 border border-lavender/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-off-white">
                  <Home className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-off-white flex items-center gap-2">
                  <Zap className="w-6 h-6 text-violet" />
                  Sandbox Mode
                </h1>
                <p className="text-sm text-off-white/70">
                  Experiment freely with logic gates - no constraints!
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-off-white/70">
                <span>Gates: {gatesUsed}</span>
                <span>Wires: {wiresUsed}</span>
              </div>
              
              {/* Settings */}
              <Button variant="ghost" size="icon" className="text-off-white">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
          {/* Left Panel - Gate Palette */}
          <div className="col-span-2 overflow-y-auto">
            <GatePalette />
          </div>

          {/* Center - Circuit Board */}
          <div className="col-span-7">
            <Card className="h-full glass-dark border-lavender/20">
              <CardContent className="p-0 h-full">
                <Board className="h-full" />
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Truth Table & Controls */}
          <div className="col-span-3 flex flex-col gap-4">
            <TruthTable />
            
            {/* Control Buttons */}
            <Card className="glass-dark border-lavender/20">
              <CardHeader>
                <CardTitle className="text-off-white text-lg">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleSimulate}
                  className="w-full"
                  variant="gate"
                  size="lg"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Simulate Circuit
                </Button>
                
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full text-off-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear Circuit
                </Button>
                
                <div className="p-3 bg-violet/10 border border-violet/20 rounded-lg">
                  <p className="text-sm text-violet">
                    💡 Tip: Try building different logic circuits like adders, multiplexers, or decoders!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
