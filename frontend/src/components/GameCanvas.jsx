import React, { useEffect, useRef, useState } from 'react';
import Joystick from './Joystick';
import ShootButton from './ShootButton';
import LevelCompleteScreen from './LevelCompleteScreen';
import soundManager from '../utils/soundManager';

const GameCanvas = ({ onScoreUpdate, onLevelUpdate, onComboUpdate, onProgressUpdate, onGameOver, onPause, gameState, initialLevel, initialScore }) => {
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
    score: initialScore || 0,
    level: initialLevel || 1,
    combo: 0,
    comboTimer: 0,
    enemySpawnTimer: 0,
    levelProgress: 0,
    enemiesKilled: 0,
    enemiesNeededForLevel: 5,
    lastComboPlayed: 1
  });

  const [isMobile, setIsMobile] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [completedLevel, setCompletedLevel] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [soundInitialized, setSoundInitialized] = useState(false);

  // Initialize sound on first user interaction
  useEffect(() => {
    const initSound = async () => {
      if (!soundInitialized) {
        await soundManager.init();
        setSoundInitialized(true);
      }
    };

    const handleInteraction = () => {
      initSound();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [soundInitialized]);

  // Start/stop background music based on game state
  useEffect(() => {
    if (gameState === 'playing' && !isPaused && soundInitialized) {
      soundManager.startBackgroundMusic();
    } else {
      soundManager.stopBackgroundMusic();
    }

    return () => {
      soundManager.stopBackgroundMusic();
    };
  }, [gameState, isPaused, soundInitialized]);

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
    gameObjectsRef.current.enemies = [];
    gameObjectsRef.current.bullets = [];
    soundManager.playResume();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    
    setCanvasSize();

    gameObjectsRef.current.player = {
      x: window.innerWidth / 2,
      y: window.innerHeight - 150,
      width: 40,
      height: 50,
      speed: 5,
      shootCooldown: 0,
      angle: 0,
      targetAngle: 0
    };

    for (let i = 0; i < 150; i++) {
      gameObjectsRef.current.stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 2 + 0.5
      });
    }

    const handleResize = () => {
      setCanvasSize();
      if (gameObjectsRef.current.player) {
        gameObjectsRef.current.player.x = Math.min(gameObjectsRef.current.player.x, window.innerWidth - 50);
        gameObjectsRef.current.player.y = Math.min(gameObjectsRef.current.player.y, window.innerHeight - 50);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  useEffect(() => {
    if (gameState !== 'playing' || isPaused) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const BORDER_WIDTH = 10;
    const BORDER_COLOR = '#00D9FF';
    const ENEMY_SPAWN_INTERVAL = 120;

    const colors = {
      player: '#00D9FF',
      playerAccent: '#0088CC',
      bullet: '#FF4500',
      bulletCore: '#FFD700',
      enemy1: '#8A2BE2',
      enemy2: '#FF6347',
      enemy3: '#00FF7F',
      enemy4: '#FFD700',
      explosion: ['#FF4500', '#FF8C00', '#FFD700', '#FF6347', '#FFA500']
    };

    const spawnEnemy = () => {
      const types = ['enemy1', 'enemy2', 'enemy3', 'enemy4'];
      const type = types[Math.floor(Math.random() * types.length)];
      const size = 35 + Math.random() * 15;
      
      let x, y, vx, vy;
      const spawnSide = Math.random();
      
      if (spawnSide < 0.5) {
        x = BORDER_WIDTH + Math.random() * (window.innerWidth - size - BORDER_WIDTH * 2);
        y = BORDER_WIDTH - size;
        vx = (Math.random() - 0.5) * 3;
        vy = 2 + Math.random() * (gameStatsRef.current.level * 0.3);
      } else {
        x = Math.random() < 0.5 ? BORDER_WIDTH - size : window.innerWidth - BORDER_WIDTH;
        y = BORDER_WIDTH + Math.random() * (window.innerHeight / 2);
        vx = x < window.innerWidth / 2 ? 2 + Math.random() * 2 : -(2 + Math.random() * 2);
        vy = 1 + Math.random() * 2;
      }
      
      gameObjectsRef.current.enemies.push({
        x, y, width: size, height: size, vx, vy, type, health: 1, rotation: 0
      });
    };

    const shoot = () => {
      const player = gameObjectsRef.current.player;
      if (player.shootCooldown <= 0) {
        const bulletAngle = player.angle - Math.PI / 2;
        const bulletSpeed = 12;
        
        gameObjectsRef.current.bullets.push({
          x: player.x,
          y: player.y,
          vx: Math.cos(bulletAngle) * bulletSpeed,
          vy: Math.sin(bulletAngle) * bulletSpeed,
          width: 8,
          height: 20,
          angle: player.angle,
          life: 60,
          trail: []
        });
        player.shootCooldown = 8;
        soundManager.playShoot();
      }
    };

    const createExplosion = (x, y, color) => {
      soundManager.playExplosion();
      
      for (let ring = 0; ring < 3; ring++) {
        for (let i = 0; i < 20; i++) {
          const angle = (Math.PI * 2 * i) / 20;
          const speed = 3 + ring * 2 + Math.random() * 2;
          gameObjectsRef.current.particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 6 - ring * 1.5,
            life: 50 - ring * 10,
            maxLife: 50 - ring * 10,
            color: colors.explosion[Math.floor(Math.random() * colors.explosion.length)],
            type: 'explosion'
          });
        }
      }
      
      for (let i = 0; i < 10; i++) {
        gameObjectsRef.current.particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          size: 8 + Math.random() * 4,
          life: 30,
          maxLife: 30,
          color: '#FFFFFF',
          type: 'flash'
        });
      }
    };

    const checkCollision = (rect1, rect2) => {
      return rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.y + rect1.height > rect2.y;
    };

    const checkCircleCollision = (obj1, obj2) => {
      const dx = (obj1.x + obj1.width / 2) - (obj2.x + obj2.width / 2);
      const dy = (obj1.y + obj1.height / 2) - (obj2.y + obj2.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = (obj1.width + obj2.width) / 2;
      return distance < minDistance;
    };

    const resolveEnemyCollision = (enemy1, enemy2) => {
      const dx = (enemy2.x + enemy2.width / 2) - (enemy1.x + enemy1.width / 2);
      const dy = (enemy2.y + enemy2.height / 2) - (enemy1.y + enemy1.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance === 0) return;
      
      const overlap = ((enemy1.width + enemy2.width) / 2) - distance;
      if (overlap > 0) {
        const normalX = dx / distance;
        const normalY = dy / distance;
        
        enemy1.x -= normalX * overlap / 2;
        enemy1.y -= normalY * overlap / 2;
        enemy2.x += normalX * overlap / 2;
        enemy2.y += normalY * overlap / 2;
        
        const relativeVx = enemy2.vx - enemy1.vx;
        const relativeVy = enemy2.vy - enemy1.vy;
        const dotProduct = relativeVx * normalX + relativeVy * normalY;
        
        if (dotProduct < 0) {
          const impulse = 1.0;
          enemy1.vx += normalX * dotProduct * impulse;
          enemy1.vy += normalY * dotProduct * impulse;
          enemy2.vx -= normalX * dotProduct * impulse;
          enemy2.vy -= normalY * dotProduct * impulse;
        }
      }
    };

    const drawJet = (ctx, x, y, angle) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      ctx.shadowColor = colors.player;
      ctx.shadowBlur = 25;
      
      ctx.fillStyle = colors.player;
      ctx.beginPath();
      ctx.moveTo(0, -25);
      ctx.lineTo(-8, 15);
      ctx.lineTo(-4, 20);
      ctx.lineTo(4, 20);
      ctx.lineTo(8, 15);
      ctx.closePath();
      ctx.fill();
      
      ctx.fillStyle = colors.playerAccent;
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(-20, 10);
      ctx.lineTo(-18, 12);
      ctx.lineTo(-8, 8);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(20, 10);
      ctx.lineTo(18, 12);
      ctx.lineTo(8, 8);
      ctx.closePath();
      ctx.fill();
      
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, -10, 4, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.shadowColor = '#FF6600';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#FF4500';
      ctx.fillRect(-6, 18, 4, 6);
      ctx.fillRect(2, 18, 4, 6);
      
      ctx.restore();
    };

    const drawFireBullet = (ctx, x, y, angle, life) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      const gradient = ctx.createLinearGradient(0, -10, 0, 10);
      gradient.addColorStop(0, '#FFD700');
      gradient.addColorStop(0.3, '#FF8C00');
      gradient.addColorStop(0.7, '#FF4500');
      gradient.addColorStop(1, '#FF0000');
      
      ctx.shadowColor = '#FF6600';
      ctx.shadowBlur = 20;
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.quadraticCurveTo(-4, -5, -3, 0);
      ctx.quadraticCurveTo(-5, 5, 0, 10);
      ctx.quadraticCurveTo(5, 5, 3, 0);
      ctx.quadraticCurveTo(4, -5, 0, -10);
      ctx.closePath();
      ctx.fill();
      
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(0, 0, 2, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    const gameLoop = () => {
      ctx.fillStyle = 'rgba(5, 8, 13, 1)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.strokeStyle = BORDER_COLOR;
      ctx.lineWidth = BORDER_WIDTH;
      ctx.shadowColor = BORDER_COLOR;
      ctx.shadowBlur = 20;
      ctx.strokeRect(BORDER_WIDTH / 2, BORDER_WIDTH / 2, window.innerWidth - BORDER_WIDTH, window.innerHeight - BORDER_WIDTH);
      ctx.shadowBlur = 0;

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
      let moveX = 0, moveY = 0;

      if (keysRef.current['arrowleft'] || keysRef.current['a']) moveX -= 1;
      if (keysRef.current['arrowright'] || keysRef.current['d']) moveX += 1;
      if (keysRef.current['arrowup'] || keysRef.current['w']) moveY -= 1;
      if (keysRef.current['arrowdown'] || keysRef.current['s']) moveY += 1;
      if (keysRef.current[' '] || keysRef.current['enter']) shoot();

      if (joystickRef.current.x !== 0 || joystickRef.current.y !== 0) {
        moveX += joystickRef.current.x;
        moveY += joystickRef.current.y;
      }

      if (moveX !== 0 || moveY !== 0) {
        player.targetAngle = Math.atan2(moveY, moveX) + Math.PI / 2;
        player.x += moveX * player.speed;
        player.y += moveY * player.speed;
      }

      let angleDiff = player.targetAngle - player.angle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      player.angle += angleDiff * 0.2;

      if (shootingRef.current) shoot();

      if (player.x - player.width / 2 <= BORDER_WIDTH ||
          player.x + player.width / 2 >= window.innerWidth - BORDER_WIDTH ||
          player.y - player.height / 2 <= BORDER_WIDTH ||
          player.y + player.height / 2 >= window.innerHeight - BORDER_WIDTH) {
        createExplosion(player.x, player.y, colors.player);
        soundManager.playGameOver();
        onGameOver(gameStatsRef.current.score);
        return;
      }

      player.x = Math.max(BORDER_WIDTH + player.width / 2, Math.min(window.innerWidth - BORDER_WIDTH - player.width / 2, player.x));
      player.y = Math.max(BORDER_WIDTH + player.height / 2, Math.min(window.innerHeight - BORDER_WIDTH - player.height / 2, player.y));

      drawJet(ctx, player.x, player.y, player.angle);

      gameObjectsRef.current.bullets = gameObjectsRef.current.bullets.filter(bullet => {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        bullet.life--;

        drawFireBullet(ctx, bullet.x, bullet.y, bullet.angle, bullet.life);

        return bullet.x > BORDER_WIDTH && bullet.x < window.innerWidth - BORDER_WIDTH &&
               bullet.y > BORDER_WIDTH && bullet.y < window.innerHeight - BORDER_WIDTH &&
               bullet.life > 0;
      });

      if (player.shootCooldown > 0) player.shootCooldown--;

      gameStatsRef.current.enemySpawnTimer++;
      if (gameStatsRef.current.enemySpawnTimer >= ENEMY_SPAWN_INTERVAL) {
        spawnEnemy();
        gameStatsRef.current.enemySpawnTimer = 0;
      }

      gameObjectsRef.current.enemies.forEach(enemy => {
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;
        enemy.rotation += 0.05;

        if (enemy.x <= BORDER_WIDTH || enemy.x + enemy.width >= window.innerWidth - BORDER_WIDTH) {
          enemy.vx *= -1;
          enemy.vx += (Math.random() - 0.5) * 0.5;
        }
        if (enemy.y <= BORDER_WIDTH || enemy.y + enemy.height >= window.innerHeight - BORDER_WIDTH) {
          enemy.vy *= -1;
          enemy.vy += (Math.random() - 0.5) * 0.5;
        }

        enemy.x = Math.max(BORDER_WIDTH, Math.min(window.innerWidth - BORDER_WIDTH - enemy.width, enemy.x));
        enemy.y = Math.max(BORDER_WIDTH, Math.min(window.innerHeight - BORDER_WIDTH - enemy.height, enemy.y));
      });

      for (let i = 0; i < gameObjectsRef.current.enemies.length; i++) {
        for (let j = i + 1; j < gameObjectsRef.current.enemies.length; j++) {
          const enemy1 = gameObjectsRef.current.enemies[i];
          const enemy2 = gameObjectsRef.current.enemies[j];
          
          if (checkCircleCollision(enemy1, enemy2)) {
            resolveEnemyCollision(enemy1, enemy2);
          }
        }
      }

      gameObjectsRef.current.enemies = gameObjectsRef.current.enemies.filter(enemy => {
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

        if (checkCollision(player, enemy)) {
          createExplosion(player.x, player.y, colors.player);
          createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, colors[enemy.type]);
          soundManager.playGameOver();
          onGameOver(gameStatsRef.current.score);
          return false;
        }

        for (let bullet of gameObjectsRef.current.bullets) {
          if (checkCollision(bullet, enemy)) {
            createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, colors[enemy.type]);
            
            const points = 10 * gameStatsRef.current.combo;
            gameStatsRef.current.score += points;
            gameStatsRef.current.combo++;
            gameStatsRef.current.comboTimer = 60;
            gameStatsRef.current.enemiesKilled++;
            
            // Play combo sound when combo increases
            if (gameStatsRef.current.combo > gameStatsRef.current.lastComboPlayed && gameStatsRef.current.combo > 1) {
              soundManager.playCombo(gameStatsRef.current.combo);
              gameStatsRef.current.lastComboPlayed = gameStatsRef.current.combo;
            }
            
            onScoreUpdate(points);
            onComboUpdate(gameStatsRef.current.combo);
            
            const index = gameObjectsRef.current.bullets.indexOf(bullet);
            if (index > -1) gameObjectsRef.current.bullets.splice(index, 1);
            
            return false;
          }
        }

        return true;
      });

      if (gameStatsRef.current.comboTimer > 0) {
        gameStatsRef.current.comboTimer--;
      } else {
        if (gameStatsRef.current.combo > 1) {
          gameStatsRef.current.combo = 1;
          gameStatsRef.current.lastComboPlayed = 1;
          onComboUpdate(1);
        }
      }

      const enemiesNeeded = gameStatsRef.current.level * 5;
      const progress = (gameStatsRef.current.enemiesKilled % enemiesNeeded) / enemiesNeeded;
      onProgressUpdate(progress * 100);

      if (gameStatsRef.current.enemiesKilled >= gameStatsRef.current.level * 5) {
        setIsPaused(true);
        setCompletedLevel(gameStatsRef.current.level);
        setShowLevelComplete(true);
        soundManager.playLevelComplete();
        gameStatsRef.current.level++;
        onLevelUpdate(gameStatsRef.current.level);
        return;
      }

      gameObjectsRef.current.particles = gameObjectsRef.current.particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        particle.vx *= 0.96;
        particle.vy *= 0.96;

        ctx.save();
        const alpha = particle.life / particle.maxLife;
        ctx.globalAlpha = alpha;
        
        if (particle.type === 'explosion') {
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = 15;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * (1 + (1 - alpha) * 0.5), 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.type === 'flash') {
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 20;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();

        return particle.life > 0;
      });

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, isPaused, onScoreUpdate, onLevelUpdate, onComboUpdate, onGameOver, onProgressUpdate]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      />
      
      {(isMobile || true) && (
        <>
          <Joystick onMove={handleJoystickMove} onStop={handleJoystickStop} />
          <ShootButton onShoot={handleShoot} onShootEnd={handleShootEnd} />
        </>
      )}

      {showLevelComplete && (
        <LevelCompleteScreen level={completedLevel} onNextLevel={handleNextLevel} />
      )}
    </div>
  );
};

export default GameCanvas;