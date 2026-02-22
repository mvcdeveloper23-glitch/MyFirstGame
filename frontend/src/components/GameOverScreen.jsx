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

      <div className="relative z-10 text-center space-y-4 px-4 max-w-md">
        {/* Game Over Title - Smaller */}
        <div className="space-y-2 animate-float">
          <h1 className="text-4xl md:text-5xl font-bold text-neon-accent" style={{ fontFamily: 'Exo 2, sans-serif' }}>
            GAME OVER
          </h1>
          {isNewHighScore && (
            <div className="animate-pulse-glow-pink">
              <p className="text-lg text-neon-accent font-semibold">🎉 NEW HIGH SCORE! 🎉</p>
            </div>
          )}
        </div>

        {/* Stats Grid - Smaller */}
        <div className="grid grid-cols-3 gap-2">
          {/* Score */}
          <div className="glass rounded-lg p-3 transition-all duration-200 hover:scale-105" style={{ backdropFilter: 'blur(10px)' }}>
            <Target className="w-5 h-5 text-neon-primary mx-auto mb-1" />
            <p className="text-[8px] text-muted-foreground mb-0.5">Score</p>
            <p className="text-2xl font-bold text-neon-primary">{score}</p>
          </div>

          {/* Level Reached */}
          <div className="glass rounded-lg p-3 transition-all duration-200 hover:scale-105" style={{ backdropFilter: 'blur(10px)' }}>
            <Zap className="w-5 h-5 text-neon-secondary mx-auto mb-1" />
            <p className="text-[8px] text-muted-foreground mb-0.5">Level</p>
            <p className="text-2xl font-bold text-neon-secondary">{level}</p>
          </div>

          {/* High Score */}
          <div className="glass rounded-lg p-3 transition-all duration-200 hover:scale-105" style={{ backdropFilter: 'blur(10px)' }}>
            <Trophy className="w-5 h-5 text-neon-accent mx-auto mb-1" />
            <p className="text-[8px] text-muted-foreground mb-0.5">Best</p>
            <p className="text-2xl font-bold text-neon-accent">{highScore}</p>
          </div>
        </div>

        {/* Restart Button - Smaller */}
        <div className="pt-2">
          <Button
            onClick={onRestart}
            size="lg"
            className="glass text-base px-8 py-5 rounded-xl border-2 hover:scale-105 transition-all duration-300"
            style={{
              background: 'var(--gradient-primary)',
              borderColor: 'hsl(var(--primary-glow))',
              boxShadow: 'var(--shadow-neon-primary)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            PLAY AGAIN
          </Button>
        </div>

        {/* Motivational Message - Smaller */}
        <div className="glass rounded-lg px-4 py-2 inline-block text-xs transition-all duration-200" style={{ backdropFilter: 'blur(8px)' }}>
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