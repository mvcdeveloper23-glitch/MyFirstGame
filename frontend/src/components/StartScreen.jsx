import React from 'react';
import { Button } from './ui/button';
import { Rocket, Trophy, Zap } from 'lucide-react';

export default function StartScreen({ onStart, highScore }) {
  return (
    <div className="flex items-center justify-center min-h-screen w-full relative overflow-hidden">
      {/* Animated starfield background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 2 + 2 + 's'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8 px-4">
        {/* Logo/Title */}
        <div className="space-y-4 animate-float">
          <div className="flex justify-center">
            <Rocket className="w-24 h-24 md:w-32 md:h-32 text-neon-primary animate-pulse-glow" />
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-neon-primary" style={{ fontFamily: 'Exo 2, sans-serif' }}>
            SPACE
          </h1>
          <h2 className="text-5xl md:text-7xl font-bold text-neon-secondary" style={{ fontFamily: 'Exo 2, sans-serif' }}>
            SHOOTER
          </h2>
        </div>

        {/* High Score Display */}
        {highScore > 0 && (
          <div className="glass rounded-2xl px-8 py-4 inline-block animate-pulse-glow-cyan">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-neon-accent" />
              <div>
                <p className="text-sm text-muted-foreground">High Score</p>
                <p className="text-3xl font-bold text-neon-accent">{highScore}</p>
              </div>
            </div>
          </div>
        )}

        {/* Start Button */}
        <div className="space-y-4">
          <Button
            onClick={onStart}
            size="lg"
            className="glass text-xl px-12 py-8 rounded-2xl border-2 hover:scale-105 transition-all duration-300 animate-pulse-glow"
            style={{
              background: 'var(--gradient-primary)',
              borderColor: 'hsl(var(--primary-glow))',
              boxShadow: 'var(--shadow-neon-primary)'
            }}
          >
            <Zap className="w-6 h-6 mr-2" />
            START GAME
          </Button>
          
          {/* Controls Info */}
          <div className="glass rounded-xl px-6 py-4 inline-block text-sm text-muted-foreground">
            <p className="mb-2 font-semibold text-foreground">Controls:</p>
            <p><span className="text-neon-secondary">Desktop:</span> Arrow Keys / WASD + Space to Shoot</p>
            <p><span className="text-neon-accent">Mobile:</span> Touch Joystick + Shoot Button</p>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <div className="glass px-4 py-2 rounded-full text-sm">
            <span className="text-neon-primary">✨</span> Neon Graphics
          </div>
          <div className="glass px-4 py-2 rounded-full text-sm">
            <span className="text-neon-secondary">⚡</span> Fast Action
          </div>
          <div className="glass px-4 py-2 rounded-full text-sm">
            <span className="text-neon-accent">🎯</span> Combo System
          </div>
        </div>
      </div>
    </div>
  );
}