import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, Trophy } from 'lucide-react';

export default function LevelCompleteScreen({ level, onNextLevel }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="glass rounded-2xl px-8 py-5 text-center space-y-3 animate-pulse-glow pointer-events-auto transition-all duration-300" 
        style={{
          border: '2px solid hsl(var(--primary))',
          boxShadow: 'var(--shadow-neon-primary), 0 0 40px hsl(var(--primary) / 0.4)',
          backdropFilter: 'blur(12px)'
        }}>
        <Trophy className="w-12 h-12 text-neon-primary mx-auto animate-float" />
        <h2 className="text-3xl font-bold text-neon-primary" style={{ fontFamily: 'Exo 2, sans-serif' }}>
          LEVEL {level} COMPLETE!
        </h2>
        <p className="text-base text-neon-secondary">Amazing work!</p>
        <Button
          onClick={onNextLevel}
          size="lg"
          className="glass text-base px-8 py-4 rounded-lg border-2 hover:scale-105 transition-all duration-300 mt-2"
          style={{
            background: 'var(--gradient-primary)',
            borderColor: 'hsl(var(--primary-glow))',
            boxShadow: 'var(--shadow-neon-primary)',
            backdropFilter: 'blur(8px)'
          }}
        >
          NEXT LEVEL
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}