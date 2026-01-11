import React from 'react';
import { Trophy, Zap, Target, Pause } from 'lucide-react';
import { Button } from './ui/button';

export default function GameUI({ score, level, combo, progress = 0, onPause }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top UI Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start gap-4 flex-wrap">
        {/* Score */}
        <div className="glass rounded-xl px-4 py-3 min-w-[120px] animate-pulse-glow pointer-events-auto">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-neon-primary" />
            <div>
              <p className="text-[10px] text-muted-foreground">Score</p>
              <p className="text-xl font-bold text-neon-primary">{score}</p>
            </div>
          </div>
        </div>

        {/* Pause Button - Center Top */}
        <Button
          onClick={onPause}
          className="glass rounded-full p-3 border-2 hover:scale-110 transition-all duration-300 pointer-events-auto animate-pulse-glow"
          style={{
            borderColor: 'hsl(var(--accent))',
            boxShadow: 'var(--shadow-neon-accent)'
          }}
        >
          <Pause className="w-5 h-5 text-neon-accent" />
        </Button>

        {/* Level */}
        <div className="glass rounded-xl px-4 py-3 min-w-[120px] animate-pulse-glow-cyan pointer-events-auto">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-neon-secondary" />
            <div>
              <p className="text-[10px] text-muted-foreground">Level</p>
              <p className="text-xl font-bold text-neon-secondary">{level}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar - Top Center */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 glass rounded-full px-4 py-2 animate-pulse-glow" style={{ minWidth: '200px', maxWidth: '300px' }}>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-neon-accent flex-shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <p className="text-[10px] text-muted-foreground">Lvl {level}</p>
              <p className="text-[10px] font-bold text-neon-accent">{Math.round(progress)}%</p>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-muted/30 overflow-hidden border border-muted/50">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: 'var(--gradient-primary)',
                  boxShadow: '0 0 10px hsl(var(--primary-glow) / 0.8)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Combo Indicator - Center */}
      {combo > 1 && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 animate-pulse-glow-pink">
          <div className="glass rounded-2xl px-6 py-3 border-2" style={{ borderColor: 'hsl(var(--accent))' }}>
            <p className="text-3xl md:text-4xl font-bold text-neon-accent" style={{ fontFamily: 'Exo 2, sans-serif' }}>
              COMBO x{combo}!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}