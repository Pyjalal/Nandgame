'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Level } from '@/lib/logic/types';
import { levels } from '@/lib/levels/levelData';
import { getNextLevelId } from '@/lib/levels/levelData';
import { Home, ChevronLeft, ChevronRight, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelHeaderProps {
  currentLevel: Level;
  levelId: string;
  timer: number;
  gatesUsed: number;
  wiresUsed: number;
}

export default function LevelHeader({
  currentLevel,
  levelId,
  timer,
  gatesUsed,
  wiresUsed
}: LevelHeaderProps) {
  const router = useRouter();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-charcoal/50 backdrop-blur-md rounded-lg p-3 md:p-4 mb-3 md:mb-4 border border-lavender/20">
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between">
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
              onClick={() => router.push(`/level/${getNextLevelId(levelId)}`)}
              disabled={!getNextLevelId(levelId)}
              className="text-off-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header - Stacked Layout */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-off-white p-1">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold text-off-white">
              {currentLevel.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Timer */}
            <div className="flex items-center gap-1 text-off-white text-sm bg-charcoal/40 px-2 py-1 rounded-md">
              <Timer className="w-3 h-3" />
              <span className="font-mono">{formatTime(timer)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-xs text-off-white/70 line-clamp-1 max-w-[60%]">
            {currentLevel.description}
          </p>
          
          {/* Stats */}
          <div className="flex items-center gap-2 text-xs text-off-white/70">
            <span>G:{gatesUsed}/{currentLevel.constraints?.maxGates || 20}</span>
            <span>W:{wiresUsed}/{currentLevel.constraints?.maxWires || 50}</span>
          </div>
        </div>
        
        {/* Level Navigation - Bottom */}
        <div className="flex justify-center mt-2 pt-1 border-t border-lavender/10">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/level/${levels[levels.findIndex(l => l.id === levelId) - 1]?.id}`)}
              disabled={levels.findIndex(l => l.id === levelId) === 0}
              className="text-off-white"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              <span className="text-xs">Prev</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/level/${getNextLevelId(levelId)}`)}
              disabled={!getNextLevelId(levelId)}
              className="text-off-white"
            >
              <span className="text-xs">Next</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
