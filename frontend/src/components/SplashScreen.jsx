import React, { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const duration = 2000;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        clearInterval(timer);
        setFadeOut(true);
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: 'var(--gradient-space)', zIndex: 9999 }}
    >
      {/* Animated stars */}
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
              animationDelay: Math.random() * 2 + 's',
              animationDuration: Math.random() * 2 + 2 + 's'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-6 px-4">
        <Rocket className="w-24 h-24 text-neon-primary mx-auto animate-float" style={{
          filter: 'drop-shadow(0 0 20px hsl(var(--primary-glow)))'
        }} />
        
        <h1 className="text-6xl md:text-7xl font-bold text-neon-primary animate-pulse-glow" style={{ fontFamily: 'Exo 2, sans-serif' }}>
          SPACE SHOOTER
        </h1>

        {/* Loading bar */}
        <div className="w-64 mx-auto">
          <div className="w-full h-3 rounded-full bg-muted/30 overflow-hidden border-2 border-primary/50">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: 'var(--gradient-primary)',
                boxShadow: '0 0 20px hsl(var(--primary-glow) / 0.8)'
              }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">Loading... {Math.round(progress)}%</p>
        </div>
      </div>
    </div>
  );
}