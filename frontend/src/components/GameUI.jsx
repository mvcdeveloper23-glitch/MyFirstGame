import React from 'react';
import { Trophy, Zap, Target, Pause } from 'lucide-react';
import { Button } from './ui/button';
import soundManager from '../utils/soundManager';

export default function GameUI({ score, level, combo, progress = 0, onPause }) {
  const handlePause = () => {
    soundManager.playPause();
    onPause();
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top UI Bar */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start gap-4 flex-wrap">
        {/* Score */}
        <div className="glass rounded-2xl px-6 py-4 min-w-[160px] animate-pulse-glow pointer-events-auto">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-neon-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-3xl font-bold text-neon-primary">{score}</p>
            </div>
          </div>
        </div>

        {/* Pause Button */}
        <Button
          onClick={handlePause}
          className="glass rounded-full p-4 border-2 hover:scale-110 transition-all duration-300 pointer-events-auto animate-pulse-glow"
          style={{
            width: '60px',
            height: '60px',
            borderColor: 'hsl(var(--accent))',
            boxShadow: 'var(--shadow-neon-accent)'
          }}
        >
          <Pause className="w-7 h-7 text-neon-accent" />
        </Button>

        {/* Level */}
        <div className="glass rounded-2xl px-6 py-4 min-w-[160px] animate-pulse-glow-cyan pointer-events-auto">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-neon-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">Level</p>
              <p className="text-3xl font-bold text-neon-secondary">{level}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar - Top Center */}
      <div className="absolute top-28 left-1/2 transform -translate-x-1/2 glass rounded-full px-6 py-3 animate-pulse-glow" style={{ minWidth: '280px', maxWidth: '400px' }}>
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-neon-accent flex-shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-muted-foreground font-semibold">Level {level}</p>
              <p className="text-sm font-bold text-neon-accent">{Math.round(progress)}%</p>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-3 rounded-full bg-muted/30 overflow-hidden border-2 border-muted/50">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: 'var(--gradient-primary)',
                  boxShadow: '0 0 15px hsl(var(--primary-glow) / 0.8)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Combo Indicator - Center */}
      {combo > 1 && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 animate-pulse-glow-pink">
          <div className="glass rounded-3xl px-10 py-5 border-3" style={{ borderColor: 'hsl(var(--accent))' }}>
            <p className="text-5xl md:text-6xl font-bold text-neon-accent" style={{ fontFamily: 'Exo 2, sans-serif' }}>
              COMBO x{combo}!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}