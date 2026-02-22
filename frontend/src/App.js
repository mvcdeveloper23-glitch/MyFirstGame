import React, { useState, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import GameUI from './components/GameUI';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import PauseMenu from './components/PauseMenu';
import SplashScreen from './components/SplashScreen';
import TimeUpScreen from './components/TimeUpScreen';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('highScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [hasSavedGame, setHasSavedGame] = useState(false);

  useEffect(() => {
    const savedGame = localStorage.getItem('savedGame');
    if (savedGame) {
      setHasSavedGame(true);
    }
  }, []);

  useEffect(() => {
    if (gameState === 'playing' || gameState === 'paused') {
      const gameData = {
        score,
        level,
        combo,
        progress,
        timeRemaining,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('savedGame', JSON.stringify(gameData));
    }
  }, [score, level, combo, progress, timeRemaining, gameState]);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setCombo(0);
    setProgress(0);
    setTimeRemaining(30);
    setShowTimeUp(false);
    setGameState('playing');
    localStorage.removeItem('savedGame');
  };

  const resumeSavedGame = () => {
    const savedGame = localStorage.getItem('savedGame');
    if (savedGame) {
      const gameData = JSON.parse(savedGame);
      setScore(gameData.score);
      setLevel(gameData.level);
      setCombo(gameData.combo || 0);
      setProgress(gameData.progress || 0);
      setTimeRemaining(gameData.timeRemaining || 30);
      setShowTimeUp(false);
      setGameState('playing');
    }
  };

  const pauseGame = () => {
    setGameState('paused');
  };

  const resumeGame = () => {
    setGameState('playing');
  };

  const restartLevel = () => {
    setScore(0);
    setCombo(0);
    setProgress(0);
    setTimeRemaining(30 + (level - 1) * 5);
    setShowTimeUp(false);
    setGameState('playing');
  };

  const goToHome = () => {
    setShowTimeUp(false);
    setGameState('start');
  };

  const endGame = (finalScore, reason = 'collision') => {
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('highScore', finalScore.toString());
    }
    localStorage.removeItem('savedGame');
    setHasSavedGame(false);
    
    if (reason === 'timeout') {
      setShowTimeUp(true);
      setTimeout(() => {
        setShowTimeUp(false);
        setGameState('gameover');
      }, 2000);
    } else {
      setGameState('gameover');
    }
  };

  const updateScore = (points) => {
    setScore(prev => prev + points);
  };

  const updateLevel = (newLevel) => {
    setLevel(newLevel);
    // Reset timer for new level: 30 + (level-1) * 5
    // Level 1: 30s, Level 2: 35s, Level 3: 40s, etc.
    const newTime = 30 + (newLevel - 1) * 5;
    setTimeRemaining(newTime);
  };

  const updateCombo = (newCombo) => {
    setCombo(newCombo);
  };

  const updateProgress = (newProgress) => {
    setProgress(newProgress);
  };

  const updateTimeRemaining = (time) => {
    setTimeRemaining(time);
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="App min-h-screen w-full overflow-hidden" style={{ background: 'var(--gradient-space)' }}>
      {gameState === 'start' && (
        <StartScreen 
          onStart={startGame} 
          onResume={hasSavedGame ? resumeSavedGame : null}
          highScore={highScore} 
        />
      )}
      
      {(gameState === 'playing' || gameState === 'paused') && (
        <div className="relative w-full h-screen">
          <GameCanvas 
            onScoreUpdate={updateScore}
            onLevelUpdate={updateLevel}
            onComboUpdate={updateCombo}
            onProgressUpdate={updateProgress}
            onTimeUpdate={updateTimeRemaining}
            onGameOver={endGame}
            onPause={pauseGame}
            gameState={gameState}
            initialLevel={level}
            initialScore={score}
            initialTime={timeRemaining}
          />
          <GameUI 
            score={score}
            level={level}
            combo={combo}
            progress={progress}
            timeRemaining={timeRemaining}
            onPause={pauseGame}
          />
          
          {gameState === 'paused' && (
            <PauseMenu 
              onResume={resumeGame}
              onRestart={restartLevel}
              onHome={goToHome}
              level={level}
              score={score}
            />
          )}

          {showTimeUp && (
            <TimeUpScreen />
          )}
        </div>
      )}
      
      {gameState === 'gameover' && (
        <GameOverScreen 
          score={score}
          highScore={highScore}
          level={level}
          onRestart={startGame}
        />
      )}
    </div>
  );
}

export default App;