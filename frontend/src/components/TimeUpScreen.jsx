import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export default function TimeUpScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="glass rounded-3xl px-16 py-12 text-center space-y-6 animate-pulse-glow-pink"
        style={{
          border: '4px solid hsl(var(--danger))',
          boxShadow: '0 0 60px hsl(var(--danger) / 0.8), 0 0 100px hsl(var(--danger) / 0.4)',
          animation: 'pulse-glow-pink 0.5s ease-in-out infinite'
        }}
      >
        {/* Clock Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <Clock 
              className="w-24 h-24 text-red-500" 
              style={{
                filter: 'drop-shadow(0 0 30px rgba(239, 68, 68, 0.8))'
              }}
            />
            <AlertTriangle 
              className="w-12 h-12 text-yellow-400 absolute -top-2 -right-2 animate-bounce"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(250, 204, 21, 0.8))'
              }}
            />
          </div>
        </div>

        {/* TIME UP Text */}
        <h1 
          className="text-7xl md:text-8xl font-bold text-red-500 animate-pulse"
          style={{ 
            fontFamily: 'Exo 2, sans-serif',
            textShadow: '0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.4)'
          }}
        >
          TIME UP!
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-yellow-400 font-semibold">
          You ran out of time!
        </p>
      </div>
    </div>
  );
}