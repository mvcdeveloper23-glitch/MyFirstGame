import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export default function TimeUpScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="glass rounded-2xl px-12 py-8 text-center space-y-4 animate-pulse-glow-pink transition-all duration-300"
        style={{
          border: '3px solid hsl(var(--danger))',
          boxShadow: '0 0 50px hsl(var(--danger) / 0.8), 0 0 80px hsl(var(--danger) / 0.4)',
          animation: 'pulse-glow-pink 0.5s ease-in-out infinite',
          backdropFilter: 'blur(12px)'
        }}
      >
        {/* Clock Icon - Smaller */}
        <div className="flex justify-center">
          <div className="relative">
            <Clock 
              className="w-16 h-16 text-red-500 transition-transform duration-200" 
              style={{
                filter: 'drop-shadow(0 0 25px rgba(239, 68, 68, 0.8))'
              }}
            />
            <AlertTriangle 
              className="w-8 h-8 text-yellow-400 absolute -top-1 -right-1 animate-bounce"
              style={{
                filter: 'drop-shadow(0 0 15px rgba(250, 204, 21, 0.8))'
              }}
            />
          </div>
        </div>

        {/* TIME UP Text - Smaller */}
        <h1 
          className="text-5xl md:text-6xl font-bold text-red-500 animate-pulse transition-all duration-200"
          style={{ 
            fontFamily: 'Exo 2, sans-serif',
            textShadow: '0 0 15px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.6), 0 0 45px rgba(239, 68, 68, 0.4)'
          }}
        >
          TIME UP!
        </h1>

        {/* Subtitle - Smaller */}
        <p className="text-base text-yellow-400 font-semibold">
          You ran out of time!
        </p>
      </div>
    </div>
  );
}