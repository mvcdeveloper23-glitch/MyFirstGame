import React from 'react';
import { Trophy, Zap, Target, Pause, Clock } from 'lucide-react';
import { Button } from './ui/button';
import soundManager from '../utils/soundManager';

export default function GameUI({ score, level, combo, progress = 0, timeRemaining = 30, onPause }) {
  const handlePause = () => {
    soundManager.playPause();
    onPause();
  };

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
      {/* Top UI Bar */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-start gap-2 flex-wrap">
        {/* Score */}
        <div className="glass rounded-lg px-3 py-2 min-w-[100px] animate-pulse-glow pointer-events-auto">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-neon-primary" />
            <div>
              <p className="text-[9px] text-muted-foreground">Score</p>
              <p className="text-lg font-bold text-neon-primary">{score}</p>
            </div>
          </div>
        </div>

        {/* Pause Button */}
        <Button
          onClick={handlePause}
          className="glass rounded-full p-2 border-2 hover:scale-110 transition-all duration-300 pointer-events-auto animate-pulse-glow"
          style={{
            width: '36px',
            height: '36px',
            borderColor: 'hsl(var(--accent))',
            boxShadow: 'var(--shadow-neon-accent)'
          }}
        >
          <Pause className="w-4 h-4 text-neon-accent" />
        </Button>

        {/* Level */}
        <div className="glass rounded-lg px-3 py-2 min-w-[100px] animate-pulse-glow-cyan pointer-events-auto">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-neon-secondary" />
            <div>
              <p className="text-[9px] text-muted-foreground">Level</p>
              <p className="text-lg font-bold text-neon-secondary">{level}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timer - CENTER OF SCREEN */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 glass rounded-xl px-4 py-2 ${getTimerGlow()} pointer-events-none`}>
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${getTimerColor()}`} />
          <p className={`text-4xl font-bold ${getTimerColor()}`} style={{ fontFamily: 'Exo 2, sans-serif' }}>
            {timeRemaining}
          </p>
        </div>
      </div>

      {/* Progress Bar - Below Timer */}
      <div className="absolute top-[55%] left-1/2 transform -translate-x-1/2 glass rounded-full px-4 py-1.5 animate-pulse-glow" style={{ minWidth: '200px', maxWidth: '280px' }}>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-neon-accent flex-shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <p className="text-[9px] text-muted-foreground font-semibold">Lvl {level}</p>
              <p className="text-[9px] font-bold text-neon-accent">{Math.round(progress)}%</p>
            </div>
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

      {/* Combo Indicator - Top Center */}
      {combo > 1 && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 animate-pulse-glow-pink">
          <div className="glass rounded-xl px-6 py-2 border-2" style={{ borderColor: 'hsl(var(--accent))' }}>
            <p className="text-2xl md:text-3xl font-bold text-neon-accent" style={{ fontFamily: 'Exo 2, sans-serif' }}>
              COMBO x{combo}!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}