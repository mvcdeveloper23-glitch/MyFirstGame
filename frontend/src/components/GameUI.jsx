import React from 'react';
import { Trophy, Zap, Target } from 'lucide-react';

export default function GameUI({ score, level, combo, progress = 0 }) {
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

      {/* Progress Bar - Bottom Right */}
      <div className="absolute bottom-4 right-4 left-4 md:left-auto glass rounded-xl px-4 py-3 md:min-w-[250px] animate-pulse-glow">
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5 text-neon-accent flex-shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs text-muted-foreground">Level {level} Progress</p>
              <p className="text-xs font-bold text-neon-accent">{Math.round(progress)}%</p>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-3 rounded-full bg-muted/30 overflow-hidden border border-muted/50">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: 'var(--gradient-primary)',
                  boxShadow: '0 0 15px hsl(var(--primary-glow) / 0.8), inset 0 1px 0 rgba(255,255,255,0.3)'
                }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {Math.floor((progress / 100) * level * 5)}/{level * 5} hits needed
            </p>
          </div>
        </div>
      </div>

      {/* Combo Indicator - Center */}
      {combo > 1 && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 animate-pulse-glow-pink">
          <div className="glass rounded-2xl px-8 py-4 border-2" style={{ borderColor: 'hsl(var(--accent))' }}>
            <p className="text-4xl font-bold text-neon-accent" style={{ fontFamily: 'Exo 2, sans-serif' }}>
              COMBO x{combo}!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}