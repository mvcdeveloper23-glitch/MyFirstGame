import React from 'react';
import { Trophy, Zap, Target, Pause, Clock } from 'lucide-react';
import { Button } from './ui/button';
import soundManager from '../utils/soundManager';

export default function GameUI({ score, level, combo, progress = 0, timeRemaining = 30, onPause }) {
  const handlePause = () => {
    soundManager.playPause();
    onPause();
  };

  // Calculate color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining <= 5) return 'text-red-500';
    if (timeRemaining <= 10) return 'text-yellow-500';
    return 'text-neon-secondary';
  };

  const getTimerGlow = () => {
    if (timeRemaining <= 5) return 'animate-pulse-glow-pink';
    if (timeRemaining <= 10) return 'animate-pulse-glow';
    return 'animate-pulse-glow-cyan';
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start gap-3 flex-wrap">
        {/* Score */}
        <div className="glass rounded-xl px-4 py-3 min-w-[140px] animate-pulse-glow pointer-events-auto">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-neon-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Score</p>
              <p className="text-2xl font-bold text-neon-primary">{score}</p>
            </div>
          </div>
        </div>

        {/* Pause Button */}
        <Button
          onClick={handlePause}
          className="glass rounded-full p-3 border-2 hover:scale-110 transition-all duration-300 pointer-events-auto animate-pulse-glow"
          style={{
            width: '50px',
            height: '50px',
            borderColor: 'hsl(var(--accent))',
            boxShadow: 'var(--shadow-neon-accent)'
          }}
        >
          <Pause className="w-6 h-6 text-neon-accent" />
        </Button>

        {/* Level */}
        <div className="glass rounded-xl px-4 py-3 min-w-[140px] animate-pulse-glow-cyan pointer-events-auto">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-neon-secondary" />
            <div>
              <p className="text-xs text-muted-foreground">Level</p>
              <p className="text-2xl font-bold text-neon-secondary">{level}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timer - Top Right Corner */}
      <div className={`absolute top-20 right-4 glass rounded-xl px-4 py-3 min-w-[120px] ${getTimerGlow()} pointer-events-auto`}>
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${getTimerColor()}`} />
          <div>
            <p className="text-xs text-muted-foreground">Time</p>
            <p className={`text-3xl font-bold ${getTimerColor()}`} style={{ fontFamily: 'Exo 2, sans-serif' }}>
              {timeRemaining}s
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar - Top Center */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 glass rounded-full px-5 py-2 animate-pulse-glow" style={{ minWidth: '240px', maxWidth: '350px' }}>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-neon-accent flex-shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs text-muted-foreground font-semibold">Lvl {level}</p>
              <p className="text-xs font-bold text-neon-accent">{Math.round(progress)}%</p>
            </div>
            <div className="w-full h-2.5 rounded-full bg-muted/30 overflow-hidden border border-muted/50">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: 'var(--gradient-primary)',
                  boxShadow: '0 0 12px hsl(var(--primary-glow) / 0.8)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Combo Indicator - Center */}
      {combo > 1 && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 animate-pulse-glow-pink">
          <div className="glass rounded-2xl px-8 py-4 border-2" style={{ borderColor: 'hsl(var(--accent))' }}>
            <p className="text-4xl md:text-5xl font-bold text-neon-accent" style={{ fontFamily: 'Exo 2, sans-serif' }}>
              COMBO x{combo}!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}