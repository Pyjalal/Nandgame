'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Level } from '@/lib/logic/types';

interface ClientLevelProgressProps {
  levels: Level[];
}

export default function ClientLevelProgress({ levels }: ClientLevelProgressProps) {
  const [completedLevels, setCompletedLevels] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load completed levels from localStorage
    const saved = localStorage.getItem('completedLevels');
    if (saved) {
      setCompletedLevels(new Set(JSON.parse(saved)));
    }
  }, []);

  const getStarsForLevel = (levelId: string): number => {
    const stars = localStorage.getItem(`level_${levelId}_stars`);
    return stars ? parseInt(stars) : 0;
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {levels.map((level, index) => {
        const isCompleted = completedLevels.has(level.id);
        const stars = getStarsForLevel(level.id);
        const isLocked = index > 0 && !completedLevels.has(levels[index - 1].id);
        
        return (
          <Link 
            key={level.id} 
            href={isLocked ? '#' : `/level/${level.id}`}
            className={cn(isLocked && 'cursor-not-allowed')}
          >
            <Card 
              className={cn(
                "h-full transition-all",
                "hover:scale-105 hover:shadow-lg",
                isCompleted && "border-mint/50 bg-mint/5",
                !isCompleted && !isLocked && "border-lavender/30 hover:border-lavender/50",
                isLocked && "opacity-50 border-gray-700"
              )}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-off-white">
                      Level {index + 1}
                    </h3>
                    <p className="text-xs text-off-white/60 mt-1">
                      {level.title}
                    </p>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded text-xs font-bold",
                    level.difficulty === 'easy' && "bg-mint/20 text-mint",
                    level.difficulty === 'medium' && "bg-warning/20 text-warning",
                    level.difficulty === 'hard' && "bg-error/20 text-error"
                  )}>
                    {level.difficulty?.toUpperCase()}
                  </div>
                </div>
                <p className="text-xs text-off-white/70 mb-3 mt-2">
                  {level.description}
                </p>
                {isCompleted && (
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <span 
                        key={i} 
                        className={cn(
                          "text-lg",
                          i <= stars ? "text-warning" : "text-charcoal/50"
                        )}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}
                {isLocked && (
                  <p className="text-xs text-error">
                    Complete previous level to unlock
                  </p>
                )}
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
