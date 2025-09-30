'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { levels } from '@/lib/levels/levelData';
import { cn } from '@/lib/utils';
import { Play, BookOpen, Trophy, Zap, Puzzle } from 'lucide-react';

export default function HomePage() {
  const [completedLevels, setCompletedLevels] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    // Load completed levels from localStorage
    const saved = localStorage.getItem('completedLevels');
    if (saved) {
      setCompletedLevels(new Set(JSON.parse(saved)));
    }
  }, []);

  const getStarsForLevel = (levelId: string): number => {
    if (typeof window === 'undefined') return 0;
    const stars = localStorage.getItem(`level_${levelId}_stars`);
    return stars ? parseInt(stars) : 0;
  };

  // Separate standard and CS Fair levels
  const standardLevels = levels.filter(l => !l.mode || l.mode === 'standard');
  const csfairLevels = levels.filter(l => l.mode === 'csfair');

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-violet/80 to-lavender/40 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8 mt-4 md:mt-8">
          <div className="flex justify-center items-center gap-4 mb-4">
            <Image 
              src="/assets/CSS_logo_purple_bg.PNG" 
              alt="CS Society Logo" 
              width={80} 
              height={80}
              className="rounded-lg shadow-lg"
              priority
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-off-white mb-2 animate-pulse-glow">
            Logic Gates Puzzle
          </h1>
          <p className="text-lavender text-lg md:text-xl">Computer Science Society of Nottingham</p>
          <p className="text-off-white/70 mt-2 text-sm md:text-base px-4 md:px-0">
            Master digital logic through interactive circuit puzzles
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="glass-dark border-lavender/20 hover:border-lavender/40 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-mint">
                <Play className="w-5 h-5" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-off-white/70 mb-4">Jump right into the first level</p>
              <Link href="/level/L01_intro_and">
                <Button variant="gate" className="w-full">
                  Start Playing
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-dark border-lavender/20 hover:border-lavender/40 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-violet">
                <Zap className="w-5 h-5" />
                Sandbox Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-off-white/70 mb-4">Free build with unlimited gates</p>
              <Link href="/sandbox">
                <Button variant="outline" className="w-full text-off-white">
                  Open Sandbox
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-dark border-lavender/20 hover:border-lavender/40 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <BookOpen className="w-5 h-5" />
                Tutorial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-off-white/70 mb-4">Learn the basics of logic gates</p>
              <Link href="/tutorial">
                <Button variant="outline" className="w-full text-off-white">
                  View Tutorial
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Standard Level Selection */}
        <Card className="glass-dark border-lavender/20 mb-8">
          <CardHeader>
            <CardTitle className="text-off-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-warning" />
              Standard Levels
            </CardTitle>
            <CardDescription className="text-off-white/70">
              Progress: {standardLevels.filter(l => completedLevels.has(l.id)).length}/{standardLevels.length} levels completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {standardLevels.map((level, index) => {
                const isCompleted = completedLevels.has(level.id);
                const stars = getStarsForLevel(level.id);
                const isLocked = index > 0 && !completedLevels.has(standardLevels[index - 1].id);
                
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
                        isLocked && "opacity-50 border-charcoal/70"
                      )}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-sm text-off-white">
                              Level {index + 1}
                            </CardTitle>
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
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-off-white/70 mb-3">
                          {level.description}
                        </p>
                        {isCompleted && (
                          <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                              <span 
                                key={i} 
                                className={cn(
                                  "text-lg",
                                  i <= stars ? "text-warning" : "text-gray-600"
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
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* CS Fair Mode Selection */}
        <Card className="glass-dark border-violet/30 shadow-violet/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-off-white flex items-center gap-2">
              <Puzzle className="w-6 h-6 text-violet" />
              CS Fair Mode
              <span className="ml-2 px-2 py-0.5 text-xs bg-violet/20 text-violet rounded-full border border-violet/40">
                Connection Challenge
              </span>
            </CardTitle>
            <CardDescription className="text-off-white/70">
              All gates are pre-placed! Find the correct wire connections to light the lamp.
              Progress: {csfairLevels.filter(l => completedLevels.has(l.id)).length}/{csfairLevels.length} levels completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {csfairLevels.map((level, index) => {
                const isCompleted = completedLevels.has(level.id);
                const stars = getStarsForLevel(level.id);
                const isLocked = false; // CS Fair levels are not locked sequentially

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
                        !isCompleted && !isLocked && "border-violet/40 hover:border-violet/60",
                        isLocked && "opacity-50 border-charcoal/70"
                      )}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-sm text-off-white">
                              CS Fair {index + 1}
                            </CardTitle>
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
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-off-white/70 mb-3">
                          {level.description}
                        </p>
                        {isCompleted && (
                          <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                              <span
                                key={i}
                                className={cn(
                                  "text-lg",
                                  i <= stars ? "text-warning" : "text-gray-600"
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
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
