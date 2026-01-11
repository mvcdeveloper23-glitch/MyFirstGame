import React, { useEffect, useRef, useState } from 'react';
import Joystick from './Joystick';
import ShootButton from './ShootButton';
import LevelCompleteScreen from './LevelCompleteScreen';

const GameCanvas = ({ onScoreUpdate, onLevelUpdate, onComboUpdate, onProgressUpdate, onGameOver, gameState }) => {
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
  const joystickRef = useRef({ x: 0, y: 0 });
  const shootingRef = useRef(false);
  const gameStatsRef = useRef({
    score: 0,
    level: 1,
    combo: 0,
    comboTimer: 0,
    enemySpawnTimer: 0,
    levelProgress: 0,
    enemiesKilled: 0,
    enemiesNeededForLevel: 5
  });

  const [isMobile, setIsMobile] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [completedLevel, setCompletedLevel] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 1024;
      return isMobileDevice || (isTouchDevice && isSmallScreen);
    };
    setIsMobile(checkMobile());
  }, []);

  // Joystick handlers
  const handleJoystickMove = (direction) => {
    joystickRef.current = direction;
  };

  const handleJoystickStop = () => {
    joystickRef.current = { x: 0, y: 0 };
  };

  const handleShoot = () => {
    shootingRef.current = true;
  };

  const handleShootEnd = () => {
    shootingRef.current = false;
  };

  const handleNextLevel = () => {
    setShowLevelComplete(false);
    setIsPaused(false);
    gameStatsRef.current.enemiesKilled = 0;
    // Clear all enemies and bullets
    gameObjectsRef.current.enemies = [];
    gameObjectsRef.current.bullets = [];
  };

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size based on window size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Support for high DPI displays
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    
    setCanvasSize();

    // Initialize player
    gameObjectsRef.current.player = {
      x: window.innerWidth / 2,
      y: window.innerHeight - 150,
      width: 30,
      height: 40,
      speed: 5,
      shootCooldown: 0,
      angle: 0, // Rotation angle
      targetAngle: 0 // Target rotation for smooth turning
    };

    // Initialize stars
    for (let i = 0; i < 150; i++) {
      gameObjectsRef.current.stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 2 + 0.5
      });
    }

    // Handle resize
    const handleResize = () => {
      setCanvasSize();
      if (gameObjectsRef.current.player) {
        gameObjectsRef.current.player.x = Math.min(gameObjectsRef.current.player.x, window.innerWidth - 50);
        gameObjectsRef.current.player.y = Math.min(gameObjectsRef.current.player.y, window.innerHeight - 50);
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

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing' || isPaused) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const BORDER_WIDTH = 10;
    const BORDER_COLOR = '#00D9FF';
    const ENEMY_SPAWN_INTERVAL = 120; // 2 seconds at 60fps

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
      const size = 35 + Math.random() * 15;
      
      // Random spawn position (top or sides)
      let x, y, vx, vy;
      const spawnSide = Math.random();
      
      if (spawnSide < 0.5) {
        // Spawn from top
        x = BORDER_WIDTH + Math.random() * (window.innerWidth - size - BORDER_WIDTH * 2);
        y = BORDER_WIDTH - size;
        vx = (Math.random() - 0.5) * 3;
        vy = 2 + Math.random() * (gameStatsRef.current.level * 0.3);
      } else {
        // Spawn from sides
        x = Math.random() < 0.5 ? BORDER_WIDTH - size : window.innerWidth - BORDER_WIDTH;
        y = BORDER_WIDTH + Math.random() * (window.innerHeight / 2);
        vx = x < window.innerWidth / 2 ? 2 + Math.random() * 2 : -(2 + Math.random() * 2);
        vy = 1 + Math.random() * 2;
      }
      
      gameObjectsRef.current.enemies.push({
        x,
        y,
        width: size,
        height: size,
        vx,
        vy,
        type,
        health: 1,
        rotation: 0
      });
    };

    const shoot = () => {
      const player = gameObjectsRef.current.player;
      if (player.shootCooldown <= 0) {
        // Calculate bullet direction based on player rotation
        const bulletAngle = player.angle - Math.PI / 2; // -90 degrees because 0 is right
        const bulletSpeed = 10;
        
        gameObjectsRef.current.bullets.push({
          x: player.x,
          y: player.y,
          vx: Math.cos(bulletAngle) * bulletSpeed,
          vy: Math.sin(bulletAngle) * bulletSpeed,
          width: 6,
          height: 15,
          angle: player.angle
        });
        player.shootCooldown = 10;
      }
    };

    const createParticles = (x, y, color) => {
      for (let i = 0; i < 15; i++) {
        gameObjectsRef.current.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          size: Math.random() * 5 + 2,
          life: 40,
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
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Draw border
      ctx.strokeStyle = BORDER_COLOR;
      ctx.lineWidth = BORDER_WIDTH;
      ctx.shadowColor = BORDER_COLOR;
      ctx.shadowBlur = 20;
      ctx.strokeRect(BORDER_WIDTH / 2, BORDER_WIDTH / 2, window.innerWidth - BORDER_WIDTH, window.innerHeight - BORDER_WIDTH);
      ctx.shadowBlur = 0;

      // Draw stars
      gameObjectsRef.current.stars.forEach(star => {
        star.y += star.speed;
        if (star.y > window.innerHeight - BORDER_WIDTH) {
          star.y = BORDER_WIDTH;
          star.x = BORDER_WIDTH + Math.random() * (window.innerWidth - BORDER_WIDTH * 2);
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      const player = gameObjectsRef.current.player;
      let moveX = 0;
      let moveY = 0;

      // Update player position (keyboard)
      if (keysRef.current['arrowleft'] || keysRef.current['a']) {
        moveX -= 1;
      }
      if (keysRef.current['arrowright'] || keysRef.current['d']) {
        moveX += 1;
      }
      if (keysRef.current['arrowup'] || keysRef.current['w']) {
        moveY -= 1;
      }
      if (keysRef.current['arrowdown'] || keysRef.current['s']) {
        moveY += 1;
      }
      if (keysRef.current[' '] || keysRef.current['enter']) {
        shoot();
      }

      // Update player position (joystick)
      if (joystickRef.current.x !== 0 || joystickRef.current.y !== 0) {
        moveX += joystickRef.current.x;
        moveY += joystickRef.current.y;
      }

      // Calculate rotation based on movement
      if (moveX !== 0 || moveY !== 0) {
        player.targetAngle = Math.atan2(moveY, moveX) + Math.PI / 2; // +90 degrees
        player.x += moveX * player.speed;
        player.y += moveY * player.speed;
      }

      // Smooth rotation
      let angleDiff = player.targetAngle - player.angle;
      // Normalize angle difference to -PI to PI
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      player.angle += angleDiff * 0.2; // Smooth interpolation

      if (shootingRef.current) {
        shoot();
      }

      // Check border collision for player
      if (player.x - player.width / 2 <= BORDER_WIDTH ||
          player.x + player.width / 2 >= window.innerWidth - BORDER_WIDTH ||
          player.y - player.height / 2 <= BORDER_WIDTH ||
          player.y + player.height / 2 >= window.innerHeight - BORDER_WIDTH) {
        createParticles(player.x, player.y, colors.player);
        onGameOver(gameStatsRef.current.score);
        return;
      }

      // Keep player in bounds
      player.x = Math.max(BORDER_WIDTH + player.width / 2, Math.min(window.innerWidth - BORDER_WIDTH - player.width / 2, player.x));
      player.y = Math.max(BORDER_WIDTH + player.height / 2, Math.min(window.innerHeight - BORDER_WIDTH - player.height / 2, player.y));

      // Draw player (triangle spaceship with rotation and glow)
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.angle);
      ctx.shadowColor = colors.player;
      ctx.shadowBlur = 25;
      ctx.fillStyle = colors.player;
      ctx.beginPath();
      ctx.moveTo(0, -player.height / 2);
      ctx.lineTo(-player.width / 2, player.height / 2);
      ctx.lineTo(player.width / 2, player.height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Update and draw bullets
      gameObjectsRef.current.bullets = gameObjectsRef.current.bullets.filter(bullet => {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;

        ctx.save();
        ctx.translate(bullet.x, bullet.y);
        ctx.rotate(bullet.angle);
        ctx.shadowColor = colors.bullet;
        ctx.shadowBlur = 20;
        ctx.fillStyle = colors.bullet;
        
        // Draw bullet as a glowing oval
        ctx.beginPath();
        ctx.ellipse(0, 0, bullet.width, bullet.height, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Remove bullets that go off screen
        return bullet.x > BORDER_WIDTH && bullet.x < window.innerWidth - BORDER_WIDTH &&
               bullet.y > BORDER_WIDTH && bullet.y < window.innerHeight - BORDER_WIDTH;
      });

      // Update cooldowns
      if (player.shootCooldown > 0) player.shootCooldown--;

      // Spawn enemies every 2 seconds
      gameStatsRef.current.enemySpawnTimer++;
      if (gameStatsRef.current.enemySpawnTimer >= ENEMY_SPAWN_INTERVAL) {
        spawnEnemy();
        gameStatsRef.current.enemySpawnTimer = 0;
      }

      // Update and draw enemies with zigzag movement
      gameObjectsRef.current.enemies = gameObjectsRef.current.enemies.filter(enemy => {
        // Move enemy
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;
        enemy.rotation += 0.05;

        // Bounce off borders (zigzag effect)
        if (enemy.x <= BORDER_WIDTH || enemy.x + enemy.width >= window.innerWidth - BORDER_WIDTH) {
          enemy.vx *= -1;
          enemy.vx += (Math.random() - 0.5) * 0.5;
        }
        if (enemy.y <= BORDER_WIDTH || enemy.y + enemy.height >= window.innerHeight - BORDER_WIDTH) {
          enemy.vy *= -1;
          enemy.vy += (Math.random() - 0.5) * 0.5;
        }

        // Keep enemies in bounds
        enemy.x = Math.max(BORDER_WIDTH, Math.min(window.innerWidth - BORDER_WIDTH - enemy.width, enemy.x));
        enemy.y = Math.max(BORDER_WIDTH, Math.min(window.innerHeight - BORDER_WIDTH - enemy.height, enemy.y));

        // Draw hexagon enemy with glow
        ctx.save();
        ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
        ctx.rotate(enemy.rotation);
        ctx.shadowColor = colors[enemy.type];
        ctx.shadowBlur = 25;
        ctx.strokeStyle = colors[enemy.type];
        ctx.fillStyle = colors[enemy.type] + '44';
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
          createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, colors[enemy.type]);
          onGameOver(gameStatsRef.current.score);
          return false;
        }

        // Check collision with bullets
        for (let bullet of gameObjectsRef.current.bullets) {
          if (checkCollision(bullet, enemy)) {
            createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, colors[enemy.type]);
            
            const points = 10 * gameStatsRef.current.combo;
            gameStatsRef.current.score += points;
            gameStatsRef.current.combo++;
            gameStatsRef.current.comboTimer = 60;
            gameStatsRef.current.enemiesKilled++;
            
            onScoreUpdate(points);
            onComboUpdate(gameStatsRef.current.combo);
            
            // Remove bullet
            const index = gameObjectsRef.current.bullets.indexOf(bullet);
            if (index > -1) gameObjectsRef.current.bullets.splice(index, 1);
            
            return false;
          }
        }

        return true;
      });

      // Update combo timer
      if (gameStatsRef.current.comboTimer > 0) {
        gameStatsRef.current.comboTimer--;
      } else {
        if (gameStatsRef.current.combo > 1) {
          gameStatsRef.current.combo = 1;
          onComboUpdate(1);
        }
      }

      // Level progression - enemies needed = level * 5
      const enemiesNeeded = gameStatsRef.current.level * 5;
      const progress = (gameStatsRef.current.enemiesKilled % enemiesNeeded) / enemiesNeeded;
      gameStatsRef.current.levelProgress = progress;
      onProgressUpdate(progress * 100);

      // Check if level is complete
      if (gameStatsRef.current.enemiesKilled >= gameStatsRef.current.level * 5) {
        setIsPaused(true);
        setCompletedLevel(gameStatsRef.current.level);
        setShowLevelComplete(true);
        gameStatsRef.current.level++;
        onLevelUpdate(gameStatsRef.current.level);
        return;
      }

      // Update and draw particles
      gameObjectsRef.current.particles = gameObjectsRef.current.particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        ctx.save();
        ctx.globalAlpha = particle.life / 40;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
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
  }, [gameState, isPaused, onScoreUpdate, onLevelUpdate, onComboUpdate, onGameOver, onProgressUpdate]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      />
      
      {/* Controls */}
      {(isMobile || true) && (
        <>
          <Joystick onMove={handleJoystickMove} onStop={handleJoystickStop} />
          <ShootButton onShoot={handleShoot} onShootEnd={handleShootEnd} />
        </>
      )}

      {/* Level Complete Screen */}
      {showLevelComplete && (
        <LevelCompleteScreen level={completedLevel} onNextLevel={handleNextLevel} />
      )}
    </div>
  );
};

export default GameCanvas;