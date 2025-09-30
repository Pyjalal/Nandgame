'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Board from '@/components/Board';
import GatePalette from '@/components/GatePalette';
import TruthTable from '@/components/TruthTable';
import LevelHeader from '@/components/LevelHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useGameStore from '@/store/useGameStore';
import { getLevelById, getNextLevelId } from '@/lib/levels/levelData';
import { levels } from '@/lib/levels/levelData';
import { useToast } from '@/components/ui/use-toast';
import { 
  Play, 
  RotateCcw, 
  Home, 
  ChevronLeft, 
  ChevronRight,
  Timer,
  Lightbulb,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LevelPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const levelId = params.id as string;
  
  const {
    currentLevel,
    loadLevel,
    simulate,
    reset,
    truthTableMatches,
    simulationResult,
    timeElapsed,
    updateTime,
    gatesUsed,
    wiresUsed,
    showHint,
    toggleHint,
    stars
  } = useGameStore();

  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  // Load level
  useEffect(() => {
    const level = getLevelById(levelId);
    if (level) {
      loadLevel(level);
      useGameStore.setState({ levels });
    } else {
      router.push('/');
    }
  }, [levelId, loadLevel, router]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && currentLevel) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentLevel]);

  // Sync timer with game store
  useEffect(() => {
    updateTime(timer);
  }, [timer, updateTime]);

  const handleSimulate = () => {
    simulate();
    
    // Check if level is complete
    if (simulationResult && truthTableMatches.every(m => m)) {
      setIsRunning(false);
      
      // Save completion to localStorage
      const completedLevels = JSON.parse(
        localStorage.getItem('completedLevels') || '[]'
      );
      if (!completedLevels.includes(levelId)) {
        completedLevels.push(levelId);
        localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
      }
      
      // Save stars
      localStorage.setItem(`level_${levelId}_stars`, stars.toString());
      
      toast({
        title: "Level Complete! 🎉",
        description: `You earned ${stars} star${stars !== 1 ? 's' : ''}!`,
        variant: 'success' as any,
      });
    }
  };

  const handleReset = () => {
    reset();
    setTimer(0);
    setIsRunning(true);
  };

  const handleNextLevel = () => {
    const nextId = getNextLevelId(levelId);
    if (nextId) {
      router.push(`/level/${nextId}`);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLevelComplete = simulationResult && truthTableMatches.every(m => m);

  if (!currentLevel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-off-white">Loading...</p>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-off-white">
                  {currentLevel.title}
                </h1>
                <p className="text-sm text-off-white/70">
                  {currentLevel.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className="flex items-center gap-2 text-off-white">
                <Timer className="w-4 h-4" />
                <span className="font-mono">{formatTime(timer)}</span>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-off-white/70">
                <span>Gates: {gatesUsed}/{currentLevel.constraints?.maxGates || 20}</span>
                <span>Wires: {wiresUsed}/{currentLevel.constraints?.maxWires || 50}</span>
              </div>
              
              {/* Level Navigation */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/level/${levels[levels.findIndex(l => l.id === levelId) - 1]?.id}`)}
                  disabled={levels.findIndex(l => l.id === levelId) === 0}
                  className="text-off-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextLevel}
                  disabled={!getNextLevelId(levelId)}
                  className="text-off-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
          {/* Left Panel - Gate Palette */}
          <div className="col-span-12 md:col-span-2 overflow-y-auto">
            <div className="md:block hidden">
              <GatePalette />
            </div>
          </div>

          {/* Center - Circuit Board */}
          <div className="col-span-12 md:col-span-7 order-first md:order-none">
            <Card className="h-full glass-dark border-lavender/20">
              <CardContent className="p-0 h-full">
                <Board className="h-full" />
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Truth Table & Controls */}
          <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
            {/* Mobile Gate Palette */}
            <div className="block md:hidden">
              <GatePalette />
            </div>
            <TruthTable />
            
            {/* Control Buttons */}
            <Card className="glass-dark border-lavender/20">
              <CardContent className="p-4 space-y-3">
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
                  Reset Level
                </Button>
                
                {currentLevel.hint && (
                  <Button
                    onClick={toggleHint}
                    variant="outline"
                    className="w-full text-off-white"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    {showHint ? 'Hide' : 'Show'} Hint
                  </Button>
                )}
                
                {showHint && currentLevel.hint && (
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <p className="text-sm text-warning">{currentLevel.hint}</p>
                  </div>
                )}
                
                {isLevelComplete && (
                  <div className="p-3 bg-mint/10 border border-mint/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-mint" />
                      <span className="font-bold text-mint">Level Complete!</span>
                    </div>
                    <div className="flex gap-1 mb-3 justify-center">
                      {[1, 2, 3].map(i => (
                        <span 
                          key={i} 
                          className={cn(
                            "text-2xl",
                            i <= stars ? "text-warning" : "text-charcoal/50"
                          )}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    {getNextLevelId(levelId) && (
                      <Button
                        onClick={handleNextLevel}
                        className="w-full"
                        variant="gate"
                      >
                        Next Level
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
