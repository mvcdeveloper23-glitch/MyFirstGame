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
    <div className="absolute bottom-4 left-4 pointer-events-auto z-50">
      <button
        className={`rounded-full glass border-2 flex items-center justify-center transition-all duration-100 ${
          isPressed ? 'scale-90' : 'scale-100'
        }`}
        style={{
          width: '85px',
          height: '85px',
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
          <Zap className="w-8 h-8 text-white mx-auto" fill="currentColor" />
          <span className="text-[9px] font-bold text-white">SHOOT</span>
        </div>
      </button>
    </div>
  );
}