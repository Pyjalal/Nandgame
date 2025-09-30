'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import useGameStore from '@/store/useGameStore';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function TruthTable() {
  const { 
    simulationResult, 
    targetTruthTable, 
    truthTableMatches,
    currentLevel 
  } = useGameStore();

  if (!currentLevel || !targetTruthTable) return null;

  const headers = Object.keys(targetTruthTable[0] || {});
  const inputHeaders = headers.filter(h => h !== 'Y' && !h.includes('Lamp'));
  const outputHeader = headers.find(h => h === 'Y' || h.includes('Lamp')) || 'Y';

  return (
    <Card className="glass-dark border-lavender/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-off-white text-lg flex items-center justify-between">
          <span>Truth Table</span>
          {simulationResult && (
            <span className="text-sm font-normal">
              {truthTableMatches.filter(m => m).length}/{targetTruthTable.length} correct
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-lavender/20">
                {inputHeaders.map(header => (
                  <th key={header} className="px-3 py-2 text-left text-off-white/80">
                    {header}
                  </th>
                ))}
                <th className="px-3 py-2 text-left text-off-white/80">
                  Target
                </th>
                <th className="px-3 py-2 text-left text-off-white/80">
                  Actual
                </th>
                <th className="px-3 py-2 text-center text-off-white/80">
                  Match
                </th>
              </tr>
            </thead>
            <tbody>
              {targetTruthTable.map((targetRow, index) => {
                const actualRow = simulationResult?.[index];
                const matches = truthTableMatches[index];
                
                return (
                  <tr 
                    key={index} 
                    className={cn(
                      "border-b border-charcoal/20 transition-colors",
                      matches === false && "bg-error/10"
                    )}
                  >
                    {inputHeaders.map(header => (
                      <td key={header} className="px-3 py-2 text-off-white">
                        {targetRow[header]}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-off-white">
                      {targetRow[outputHeader]}
                    </td>
                    <td className="px-3 py-2 text-off-white">
                      {actualRow ? actualRow[outputHeader] : '-'}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {actualRow && (
                        matches ? (
                          <CheckCircle2 className="w-4 h-4 text-mint inline" />
                        ) : (
                          <XCircle className="w-4 h-4 text-error inline" />
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!simulationResult && (
          <div className="mt-4 p-3 bg-charcoal/50 rounded-lg">
            <p className="text-xs text-off-white/70">
              Build your circuit and click "Simulate" to test it against the target truth table.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
