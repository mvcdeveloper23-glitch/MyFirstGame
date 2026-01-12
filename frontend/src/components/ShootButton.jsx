import React, { useState } from 'react';
import { Zap } from 'lucide-react';

export default function ShootButton({ onShoot, onShootEnd }) {
  const [isPressed, setIsPressed] = useState(false);

  const handleStart = () => {
    setIsPressed(true);
    onShoot();
  };

  const handleEnd = () => {
    setIsPressed(false);
    if (onShootEnd) onShootEnd();
  };

  return (
    <div className="absolute bottom-8 left-8 pointer-events-auto z-50">
      <button
        className={`rounded-full glass border-3 flex items-center justify-center transition-all duration-150 ${
          isPressed ? 'scale-90' : 'scale-100'
        }`}
        style={{
          width: '110px',
          height: '110px',
          background: isPressed ? 'var(--gradient-primary)' : 'var(--gradient-accent)',
          borderColor: isPressed ? 'hsl(var(--primary))' : 'hsl(var(--accent))',
          boxShadow: isPressed ? 'var(--shadow-neon-primary)' : 'var(--shadow-neon-accent)'
        }}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        <div className="text-center">
          <Zap className="w-10 h-10 text-white mx-auto mb-1" fill="currentColor" />
          <span className="text-xs font-bold text-white">SHOOT</span>
        </div>
      </button>
    </div>
  );
}