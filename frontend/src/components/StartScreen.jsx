import React from 'react';
import { Button } from './ui/button';
import { Rocket, Trophy, Zap, Smartphone, Play } from 'lucide-react';

export default function StartScreen({ onStart, onResume, highScore }) {
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

      <div className="relative z-10 text-center space-y-8 px-4 max-w-2xl">
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

        {/* Resume Button (if saved game exists) */}
        {onResume && (
          <div className="space-y-3">
            <Button
              onClick={onResume}
              size="lg"
              className="glass text-xl px-12 py-8 rounded-2xl border-2 hover:scale-105 transition-all duration-300 animate-pulse-glow-cyan w-full"
              style={{
                background: 'var(--gradient-secondary)',
                borderColor: 'hsl(var(--secondary-glow))',
                boxShadow: 'var(--shadow-neon-secondary)'
              }}
            >
              <Play className="w-6 h-6 mr-2" fill="currentColor" />
              CONTINUE GAME
            </Button>
            <p className="text-xs text-muted-foreground">
              Pick up where you left off!
            </p>
          </div>
        )}

        {/* Start Button */}
        <div className="space-y-4">
          <Button
            onClick={onStart}
            size="lg"
            className="glass text-xl px-12 py-8 rounded-2xl border-2 hover:scale-105 transition-all duration-300 animate-pulse-glow w-full"
            style={{
              background: 'var(--gradient-primary)',
              borderColor: 'hsl(var(--primary-glow))',
              boxShadow: 'var(--shadow-neon-primary)'
            }}
          >
            <Zap className="w-6 h-6 mr-2" />
            {onResume ? 'NEW GAME' : 'START GAME'}
          </Button>
          
          {/* Controls Info */}
          <div className="glass rounded-xl px-6 py-4 text-sm text-muted-foreground">
            <p className="mb-3 font-semibold text-foreground text-base">🎮 Controls:</p>
            <div className="space-y-2 text-left">
              <p><span className="text-neon-secondary font-semibold">Desktop:</span> Arrow Keys / WASD + Space to Shoot</p>
              <p><span className="text-neon-accent font-semibold">Mobile:</span> Touch Joystick + Shoot Button</p>
            </div>
          </div>

          {/* Mobile Instructions */}
          <div className="glass rounded-xl px-6 py-4 text-sm">
            <div className="flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-neon-primary flex-shrink-0 mt-1" />
              <div className="text-left space-y-2">
                <p className="font-semibold text-foreground">📱 How to Play on Mobile:</p>
                <ol className="text-muted-foreground space-y-1 text-xs">
                  <li>1. Open this game in any mobile browser (Chrome, Safari, etc.)</li>
                  <li>2. Turn your phone to <span className="text-neon-secondary font-semibold">landscape mode</span> for best experience</li>
                  <li>3. Use <span className="text-neon-secondary">joystick (bottom left)</span> to move your jet</li>
                  <li>4. Tap <span className="text-neon-accent">SHOOT button (bottom right)</span> to fire</li>
                  <li>5. Press <span className="text-neon-primary">PAUSE button (top center)</span> to pause anytime</li>
                  <li>6. Your progress is <span className="text-neon-accent font-semibold">auto-saved!</span></li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <div className="glass px-4 py-2 rounded-full text-sm">
            <span className="text-neon-primary">🔥</span> Fire Bullets
          </div>
          <div className="glass px-4 py-2 rounded-full text-sm">
            <span className="text-neon-secondary">✈️</span> Jet Fighter
          </div>
          <div className="glass px-4 py-2 rounded-full text-sm">
            <span className="text-neon-accent">💥</span> Epic Explosions
          </div>
          <div className="glass px-4 py-2 rounded-full text-sm">
            <span className="text-neon-primary">💾</span> Auto-Save
          </div>
        </div>
      </div>
    </div>
  );
}