import React, { useRef, useEffect, useState } from 'react';

export default function Joystick({ onMove, onStop }) {
  const joystickRef = useRef(null);
  const knobRef = useRef(null);
  const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const joystickCenter = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const joystick = joystickRef.current;
    if (!joystick) return;

    const rect = joystick.getBoundingClientRect();
    joystickCenter.current = {
      x: rect.width / 2,
      y: rect.height / 2
    };

    const handleStart = (clientX, clientY) => {
      isDragging.current = true;
      handleMove(clientX, clientY);
    };

    const handleMove = (clientX, clientY) => {
      if (!isDragging.current) return;

      const rect = joystick.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let deltaX = clientX - centerX;
      let deltaY = clientY - centerY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = rect.width / 2 - 25;

      if (distance > maxDistance) {
        const angle = Math.atan2(deltaY, deltaX);
        deltaX = Math.cos(angle) * maxDistance;
        deltaY = Math.sin(angle) * maxDistance;
      }

      setKnobPosition({ x: deltaX, y: deltaY });

      const normalizedX = deltaX / maxDistance;
      const normalizedY = deltaY / maxDistance;

      onMove({ x: normalizedX, y: normalizedY });
    };

    const handleEnd = () => {
      isDragging.current = false;
      setKnobPosition({ x: 0, y: 0 });
      onStop();
    };

    const handleTouchStart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    const handleMouseDown = (e) => {
      handleStart(e.clientX, e.clientY);
    };

    const handleMouseMove = (e) => {
      handleMove(e.clientX, e.clientY);
    };

    joystick.addEventListener('touchstart', handleTouchStart, { passive: false });
    joystick.addEventListener('touchmove', handleTouchMove, { passive: false });
    joystick.addEventListener('touchend', handleEnd);
    joystick.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);

    return () => {
      joystick.removeEventListener('touchstart', handleTouchStart);
      joystick.removeEventListener('touchmove', handleTouchMove);
      joystick.removeEventListener('touchend', handleEnd);
      joystick.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
    };
  }, [onMove, onStop]);

  return (
    <div className="absolute bottom-10 right-10 pointer-events-auto z-50">
      <div
        ref={joystickRef}
        className="relative rounded-full glass border-4 flex items-center justify-center"
        style={{
          width: '160px',
          height: '160px',
          borderColor: 'hsl(var(--secondary))',
          boxShadow: 'var(--shadow-neon-secondary)'
        }}
      >
        <div className="absolute inset-6 rounded-full bg-muted/20" />
        <div className="absolute w-3 h-3 rounded-full bg-secondary/50" />
        
        <div
          ref={knobRef}
          className="absolute rounded-full flex items-center justify-center transition-transform"
          style={{
            width: '70px',
            height: '70px',
            transform: `translate(${knobPosition.x}px, ${knobPosition.y}px)`,
            background: 'var(--gradient-secondary)',
            boxShadow: 'var(--shadow-neon-secondary)',
            border: '4px solid hsl(var(--secondary))'
          }}
        >
          <div className="w-4 h-4 rounded-full bg-foreground/80" />
        </div>
      </div>
    </div>
  );
}