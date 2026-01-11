import React from 'react';
import { Button } from './ui/button';
import { Play, Home, RotateCcw } from 'lucide-react';

export default function PauseMenu({ onResume, onRestart, onHome, level, score }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-3xl px-12 py-8 text-center space-y-6 animate-pulse-glow" 
        style={{
          border: '3px solid hsl(var(--primary))',
          boxShadow: 'var(--shadow-neon-primary), 0 0 60px hsl(var(--primary) / 0.5)',
          maxWidth: '500px'
        }}>
        <h2 className="text-5xl font-bold text-neon-secondary" style={{ fontFamily: 'Exo 2, sans-serif' }}>
          PAUSED
        </h2>
        
        {/* Current Stats */}
        <div className="glass rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Level:</span>
            <span className="text-neon-secondary font-bold">{level}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Score:</span>
            <span className="text-neon-primary font-bold">{score}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Your progress is automatically saved!
          </p>
        </div>

        {/* Menu Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onResume}
            size="lg"
            className="w-full glass text-lg px-8 py-6 rounded-xl border-2 hover:scale-105 transition-all duration-300"
            style={{
              background: 'var(--gradient-secondary)',
              borderColor: 'hsl(var(--secondary))',
              boxShadow: 'var(--shadow-neon-secondary)'
            }}
          >
            <Play className="w-5 h-5 mr-2" fill="currentColor" />
            RESUME GAME
          </Button>

          <Button
            onClick={onRestart}
            size="lg"
            variant="outline"
            className="w-full glass text-lg px-8 py-6 rounded-xl border-2 hover:scale-105 transition-all duration-300"
            style={{
              borderColor: 'hsl(var(--accent))'
            }}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            RESTART LEVEL
          </Button>

          <Button
            onClick={onHome}
            size="lg"
            variant="outline"
            className="w-full glass text-lg px-8 py-6 rounded-xl border-2 hover:scale-105 transition-all duration-300"
            style={{
              borderColor: 'hsl(var(--muted))'
            }}
          >
            <Home className="w-5 h-5 mr-2" />
            MAIN MENU
          </Button>
        </div>
      </div>
    </div>
  );
}