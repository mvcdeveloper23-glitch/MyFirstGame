import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, Trophy } from 'lucide-react';

export default function LevelCompleteScreen({ level, onNextLevel }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="glass rounded-3xl px-12 py-8 text-center space-y-4 animate-pulse-glow pointer-events-auto" 
        style={{
          border: '3px solid hsl(var(--primary))',
          boxShadow: 'var(--shadow-neon-primary), 0 0 60px hsl(var(--primary) / 0.5)'
        }}>
        <Trophy className="w-16 h-16 text-neon-primary mx-auto animate-float" />
        <h2 className="text-5xl font-bold text-neon-primary" style={{ fontFamily: 'Exo 2, sans-serif' }}>
          LEVEL {level} COMPLETE!
        </h2>
        <p className="text-xl text-neon-secondary">Amazing work!</p>
        <Button
          onClick={onNextLevel}
          size="lg"
          className="glass text-xl px-10 py-6 rounded-xl border-2 hover:scale-105 transition-all duration-300 mt-4"
          style={{
            background: 'var(--gradient-primary)',
            borderColor: 'hsl(var(--primary-glow))',
            boxShadow: 'var(--shadow-neon-primary)'
          }}
        >
          NEXT LEVEL
          <ArrowRight className="w-6 h-6 ml-2" />
        </Button>
      </div>
    </div>
  );
}