import React, { useEffect, useRef, useState } from 'react';
import { Circle } from 'lucide-react';

const GameCanvas = ({ onScoreUpdate, onLevelUpdate, onComboUpdate, onGameOver, gameState }) => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const gameObjectsRef = useRef({
    player: null,
    enemies: [],
    bullets: [],
    particles: [],
    stars: []
  });
  const keysRef = useRef({});
  const touchRef = useRef({ active: false, x: 0, y: 0, shooting: false });
  const gameStatsRef = useRef({
    score: 0,
    level: 1,
    combo: 0,
    comboTimer: 0,
    enemySpawnTimer: 0,
    levelProgress: 0,
    enemiesKilled: 0
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize player
    gameObjectsRef.current.player = {
      x: canvas.width / 2,
      y: canvas.height - 100,
      width: 30,
      height: 40,
      speed: 5,
      shootCooldown: 0
    };

    // Initialize stars
    for (let i = 0; i < 100; i++) {
      gameObjectsRef.current.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 2 + 0.5
      });
    }

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (gameObjectsRef.current.player) {
        gameObjectsRef.current.player.x = Math.min(gameObjectsRef.current.player.x, canvas.width - 50);
        gameObjectsRef.current.player.y = Math.min(gameObjectsRef.current.player.y, canvas.height - 50);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Touch controls for mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchRef.current.active = true;
      touchRef.current.x = touch.clientX;
      touchRef.current.y = touch.clientY;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      touchRef.current.x = touch.clientX;
      touchRef.current.y = touch.clientY;
    };

    const handleTouchEnd = () => {
      touchRef.current.active = false;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const colors = {
      player: '#00D9FF',
      bullet: '#FF1493',
      enemy1: '#8A2BE2',
      enemy2: '#FF6347',
      enemy3: '#00FF7F',
      enemy4: '#FFD700',
      particle: '#00D9FF'
    };

    const spawnEnemy = () => {
      const types = ['enemy1', 'enemy2', 'enemy3', 'enemy4'];
      const type = types[Math.floor(Math.random() * types.length)];
      const size = 30 + Math.random() * 20;
      
      gameObjectsRef.current.enemies.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        width: size,
        height: size,
        speed: 2 + Math.random() * (gameStatsRef.current.level * 0.5),
        type,
        health: 1,
        rotation: 0
      });
    };

    const shoot = () => {
      const player = gameObjectsRef.current.player;
      if (player.shootCooldown <= 0) {
        gameObjectsRef.current.bullets.push({
          x: player.x,
          y: player.y,
          width: 6,
          height: 15,
          speed: 10
        });
        player.shootCooldown = 10;
      }
    };

    const createParticles = (x, y, color) => {
      for (let i = 0; i < 10; i++) {
        gameObjectsRef.current.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          size: Math.random() * 4 + 2,
          life: 30,
          color
        });
      }
    };

    const checkCollision = (rect1, rect2) => {
      return rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.y + rect1.height > rect2.y;
    };

    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(5, 8, 13, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      gameObjectsRef.current.stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      const player = gameObjectsRef.current.player;

      // Update player position (keyboard)
      if (keysRef.current['arrowleft'] || keysRef.current['a']) {
        player.x -= player.speed;
      }
      if (keysRef.current['arrowright'] || keysRef.current['d']) {
        player.x += player.speed;
      }
      if (keysRef.current['arrowup'] || keysRef.current['w']) {
        player.y -= player.speed;
      }
      if (keysRef.current['arrowdown'] || keysRef.current['s']) {
        player.y += player.speed;
      }
      if (keysRef.current[' '] || keysRef.current['enter']) {
        shoot();
      }

      // Update player position (touch)
      if (touchRef.current.active) {
        const dx = touchRef.current.x - player.x;
        const dy = touchRef.current.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 20) {
          player.x += (dx / distance) * player.speed;
          player.y += (dy / distance) * player.speed;
        }
      }

      if (touchRef.current.shooting) {
        shoot();
      }

      // Keep player in bounds
      player.x = Math.max(20, Math.min(canvas.width - 20, player.x));
      player.y = Math.max(20, Math.min(canvas.height - 20, player.y));

      // Draw player (triangle spaceship with glow)
      ctx.save();
      ctx.shadowColor = colors.player;
      ctx.shadowBlur = 20;
      ctx.fillStyle = colors.player;
      ctx.beginPath();
      ctx.moveTo(player.x, player.y - player.height / 2);
      ctx.lineTo(player.x - player.width / 2, player.y + player.height / 2);
      ctx.lineTo(player.x + player.width / 2, player.y + player.height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Update and draw bullets
      gameObjectsRef.current.bullets = gameObjectsRef.current.bullets.filter(bullet => {
        bullet.y -= bullet.speed;

        ctx.save();
        ctx.shadowColor = colors.bullet;
        ctx.shadowBlur = 15;
        ctx.fillStyle = colors.bullet;
        ctx.fillRect(bullet.x - bullet.width / 2, bullet.y, bullet.width, bullet.height);
        ctx.restore();

        return bullet.y > -bullet.height;
      });

      // Update cooldowns
      if (player.shootCooldown > 0) player.shootCooldown--;

      // Spawn enemies
      gameStatsRef.current.enemySpawnTimer++;
      const spawnRate = Math.max(60 - gameStatsRef.current.level * 5, 20);
      if (gameStatsRef.current.enemySpawnTimer > spawnRate) {
        spawnEnemy();
        gameStatsRef.current.enemySpawnTimer = 0;
      }

      // Update and draw enemies
      gameObjectsRef.current.enemies = gameObjectsRef.current.enemies.filter(enemy => {
        enemy.y += enemy.speed;
        enemy.rotation += 0.05;

        // Draw hexagon enemy with glow
        ctx.save();
        ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
        ctx.rotate(enemy.rotation);
        ctx.shadowColor = colors[enemy.type];
        ctx.shadowBlur = 20;
        ctx.strokeStyle = colors[enemy.type];
        ctx.fillStyle = colors[enemy.type] + '33';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const x = Math.cos(angle) * enemy.width / 2;
          const y = Math.sin(angle) * enemy.height / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Check collision with player
        if (checkCollision(player, enemy)) {
          createParticles(player.x, player.y, colors.player);
          onGameOver(gameStatsRef.current.score);
          return false;
        }

        // Check collision with bullets
        for (let bullet of gameObjectsRef.current.bullets) {
          if (checkCollision(bullet, enemy)) {
            createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, colors[enemy.type]);
            gameStatsRef.current.score += 10 * gameStatsRef.current.combo;
            gameStatsRef.current.combo++;
            gameStatsRef.current.comboTimer = 60;
            gameStatsRef.current.enemiesKilled++;
            onScoreUpdate(10 * gameStatsRef.current.combo);
            onComboUpdate(gameStatsRef.current.combo);
            
            // Remove bullet
            const index = gameObjectsRef.current.bullets.indexOf(bullet);
            if (index > -1) gameObjectsRef.current.bullets.splice(index, 1);
            
            return false;
          }
        }

        return enemy.y < canvas.height + enemy.height;
      });

      // Update combo timer
      if (gameStatsRef.current.comboTimer > 0) {
        gameStatsRef.current.comboTimer--;
      } else {
        gameStatsRef.current.combo = 1;
        onComboUpdate(1);
      }

      // Level progression
      if (gameStatsRef.current.enemiesKilled >= gameStatsRef.current.level * 10) {
        gameStatsRef.current.level++;
        gameStatsRef.current.enemiesKilled = 0;
        onLevelUpdate(gameStatsRef.current.level);
      }

      // Update and draw particles
      gameObjectsRef.current.particles = gameObjectsRef.current.particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        ctx.save();
        ctx.globalAlpha = particle.life / 30;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        ctx.restore();

        return particle.life > 0;
      });

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [gameState, onScoreUpdate, onLevelUpdate, onComboUpdate, onGameOver]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      
      {/* Mobile Controls */}
      {isMobile && (
        <>
          {/* Shoot Button */}
          <button
            className="absolute top-4 right-4 glass rounded-full p-6 animate-pulse-glow-pink pointer-events-auto"
            style={{
              borderColor: 'hsl(var(--accent))',
              boxShadow: 'var(--shadow-neon-accent)'
            }}
            onTouchStart={() => { touchRef.current.shooting = true; }}
            onTouchEnd={() => { touchRef.current.shooting = false; }}
          >
            <span className="text-2xl text-neon-accent font-bold">🔥</span>
          </button>

          {/* Movement Indicator */}
          <div className="absolute bottom-8 left-8 glass rounded-full p-2 animate-pulse-glow pointer-events-none">
            <p className="text-xs text-muted-foreground px-2">Touch to move</p>
          </div>
        </>
      )}
    </div>
  );
};

export default GameCanvas;