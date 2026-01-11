import React from 'react';
import { Trophy, Zap, Target } from 'lucide-react';

export default function GameUI({ score, level, combo }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top UI Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start gap-4 flex-wrap">
        {/* Score */}
        <div className="glass rounded-xl px-4 py-3 min-w-[140px] animate-pulse-glow">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-neon-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Score</p>
              <p className="text-2xl font-bold text-neon-primary">{score}</p>
            </div>
          </div>
        </div>

        {/* Level */}
        <div className="glass rounded-xl px-4 py-3 min-w-[140px] animate-pulse-glow-cyan">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-neon-secondary" />
            <div>
              <p className="text-xs text-muted-foreground">Level</p>
              <p className="text-2xl font-bold text-neon-secondary">{level}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Combo Indicator */}
      {combo > 1 && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 animate-pulse-glow-pink">
          <div className="glass rounded-2xl px-6 py-3">
            <p className="text-3xl font-bold text-neon-accent">
              COMBO x{combo}!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}