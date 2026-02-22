import React from 'react';
import { Button } from './ui/button';
import { Play, Home, RotateCcw } from 'lucide-react';
import soundManager from '../utils/soundManager';

export default function PauseMenu({ onResume, onRestart, onHome, level, score }) {
  const handleResume = () => {
    soundManager.playResume();
    onResume();
  };

  const handleRestart = () => {
    soundManager.playResume();
    onRestart();
  };

  const handleHome = () => {
    soundManager.playPause();
    onHome();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-2xl px-8 py-5 text-center space-y-4 animate-pulse-glow transition-all duration-300" 
        style={{
          border: '2px solid hsl(var(--primary))',
          boxShadow: 'var(--shadow-neon-primary), 0 0 40px hsl(var(--primary) / 0.5)',
          maxWidth: '380px',
          backdropFilter: 'blur(12px)'
        }}>
        <h2 className="text-3xl font-bold text-neon-secondary" style={{ fontFamily: 'Exo 2, sans-serif' }}>
          PAUSED
        </h2>
        
        <div className="glass rounded-lg p-3 space-y-1.5" style={{ backdropFilter: 'blur(8px)' }}>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Level:</span>
            <span className="text-neon-secondary font-bold">{level}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Score:</span>
            <span className="text-neon-primary font-bold">{score}</span>
          </div>
          <p className="text-[9px] text-muted-foreground mt-1">
            Progress auto-saved!
          </p>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleResume}
            size="lg"
            className="w-full glass text-sm px-6 py-4 rounded-lg border-2 hover:scale-105 transition-all duration-300"
            style={{
              background: 'var(--gradient-secondary)',
              borderColor: 'hsl(var(--secondary))',
              boxShadow: 'var(--shadow-neon-secondary)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Play className="w-4 h-4 mr-2" fill="currentColor" />
            RESUME GAME
          </Button>

          <Button
            onClick={handleRestart}
            size="lg"
            variant="outline"
            className="w-full glass text-sm px-6 py-4 rounded-lg border-2 hover:scale-105 transition-all duration-300"
            style={{
              borderColor: 'hsl(var(--accent))',
              backdropFilter: 'blur(8px)'
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            RESTART LEVEL
          </Button>

          <Button
            onClick={handleHome}
            size="lg"
            variant="outline"
            className="w-full glass text-sm px-6 py-4 rounded-lg border-2 hover:scale-105 transition-all duration-300"
            style={{
              borderColor: 'hsl(var(--muted))',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Home className="w-4 h-4 mr-2" />
            MAIN MENU
          </Button>
        </div>
      </div>
    </div>
  );
}