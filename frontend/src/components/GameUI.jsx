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
      {/* Top UI Bar - Very Small */}
      <div className="absolute top-1 left-1 right-1 flex justify-between items-start gap-1 flex-wrap">
        {/* Score */}
        <div className="glass rounded-md px-2 py-1 min-w-[70px] pointer-events-auto" style={{ backdropFilter: 'blur(8px)' }}>
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-neon-primary" />
            <div>
              <p className="text-[7px] text-muted-foreground leading-none">Score</p>
              <p className="text-sm font-bold text-neon-primary leading-tight">{score}</p>
            </div>
          </div>
        </div>

        {/* Pause Button */}
        <Button
          onClick={handlePause}
          className="glass rounded-full p-1.5 border hover:scale-110 transition-all duration-200 pointer-events-auto"
          style={{
            width: '28px',
            height: '28px',
            borderColor: 'hsl(var(--accent))',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Pause className="w-3.5 h-3.5 text-neon-accent" />
        </Button>

        {/* Level */}
        <div className="glass rounded-md px-2 py-1 min-w-[70px] pointer-events-auto" style={{ backdropFilter: 'blur(8px)' }}>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-neon-secondary" />
            <div>
              <p className="text-[7px] text-muted-foreground leading-none">Level</p>
              <p className="text-sm font-bold text-neon-secondary leading-tight">{level}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timer - CENTER - Smaller */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 glass rounded-lg px-3 py-1.5 ${getTimerGlow()} pointer-events-none transition-all duration-200`}
        style={{ backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center gap-1.5">
          <Clock className={`w-4 h-4 ${getTimerColor()} transition-colors duration-200`} />
          <p className={`text-3xl font-bold ${getTimerColor()} transition-all duration-200`} style={{ fontFamily: 'Exo 2, sans-serif' }}>
            {timeRemaining}
          </p>
        </div>
      </div>

      {/* Progress Bar - Below Timer - Smaller */}
      <div className="absolute top-[55%] left-1/2 transform -translate-x-1/2 glass rounded-full px-3 py-1 transition-all duration-200" 
        style={{ minWidth: '160px', maxWidth: '220px', backdropFilter: 'blur(8px)' }}>
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3 h-3 text-neon-accent flex-shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-0.5">
              <p className="text-[7px] text-muted-foreground font-semibold">Lvl {level}</p>
              <p className="text-[7px] font-bold text-neon-accent">{Math.round(progress)}%</p>
            </div>
            <div className="w-full h-1.5 rounded-full bg-muted/30 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${progress}%`,
                  background: 'var(--gradient-primary)',
                  boxShadow: '0 0 8px hsl(var(--primary-glow) / 0.6)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Combo Indicator - Smaller */}
      {combo > 1 && (
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 animate-pulse-glow-pink transition-all duration-200">
          <div className="glass rounded-lg px-4 py-1.5 border" style={{ borderColor: 'hsl(var(--accent))', backdropFilter: 'blur(10px)' }}>
            <p className="text-xl md:text-2xl font-bold text-neon-accent" style={{ fontFamily: 'Exo 2, sans-serif' }}>
              COMBO x{combo}!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}