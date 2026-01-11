import React from 'react';
import { Button } from './ui/button';
import { RotateCcw, Trophy, Target, Zap } from 'lucide-react';

export default function GameOverScreen({ score, highScore, level, onRestart }) {
  const isNewHighScore = score === highScore && score > 0;

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
        {/* Game Over Title */}
        <div className="space-y-4 animate-float">
          <h1 className="text-6xl md:text-7xl font-bold text-neon-accent" style={{ fontFamily: 'Exo 2, sans-serif' }}>
            GAME OVER
          </h1>
          {isNewHighScore && (
            <div className="animate-pulse-glow-pink">
              <p className="text-2xl text-neon-accent font-semibold">🎉 NEW HIGH SCORE! 🎉</p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Score */}
          <div className="glass rounded-2xl p-6 animate-pulse-glow">
            <Target className="w-8 h-8 text-neon-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Final Score</p>
            <p className="text-4xl font-bold text-neon-primary">{score}</p>
          </div>

          {/* Level Reached */}
          <div className="glass rounded-2xl p-6 animate-pulse-glow-cyan">
            <Zap className="w-8 h-8 text-neon-secondary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Level Reached</p>
            <p className="text-4xl font-bold text-neon-secondary">{level}</p>
          </div>

          {/* High Score */}
          <div className="glass rounded-2xl p-6 animate-pulse-glow-pink">
            <Trophy className="w-8 h-8 text-neon-accent mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">High Score</p>
            <p className="text-4xl font-bold text-neon-accent">{highScore}</p>
          </div>
        </div>

        {/* Restart Button */}
        <div className="pt-4">
          <Button
            onClick={onRestart}
            size="lg"
            className="glass text-xl px-12 py-8 rounded-2xl border-2 hover:scale-105 transition-all duration-300 animate-pulse-glow"
            style={{
              background: 'var(--gradient-primary)',
              borderColor: 'hsl(var(--primary-glow))',
              boxShadow: 'var(--shadow-neon-primary)'
            }}
          >
            <RotateCcw className="w-6 h-6 mr-2" />
            PLAY AGAIN
          </Button>
        </div>

        {/* Motivational Message */}
        <div className="glass rounded-xl px-6 py-4 inline-block text-sm">
          <p className="text-muted-foreground">
            {score < 100 ? "Keep practicing! 🚀" : ""}
            {score >= 100 && score < 500 ? "Good job! Try to beat your score! 💫" : ""}
            {score >= 500 && score < 1000 ? "Excellent work! You're getting skilled! ⭐" : ""}
            {score >= 1000 ? "Amazing! You're a space ace! 🏆" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}