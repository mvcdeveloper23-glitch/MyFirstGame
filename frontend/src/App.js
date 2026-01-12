import React, { useState, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import GameUI from './components/GameUI';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import PauseMenu from './components/PauseMenu';
import SplashScreen from './components/SplashScreen';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [progress, setProgress] = useState(0);
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
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('savedGame', JSON.stringify(gameData));
    }
  }, [score, level, combo, progress, gameState]);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setCombo(0);
    setProgress(0);
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
    setGameState('playing');
  };

  const goToHome = () => {
    setGameState('start');
  };

  const endGame = (finalScore) => {
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('highScore', finalScore.toString());
    }
    localStorage.removeItem('savedGame');
    setHasSavedGame(false);
    setGameState('gameover');
  };

  const updateScore = (points) => {
    setScore(prev => prev + points);
  };

  const updateLevel = (newLevel) => {
    setLevel(newLevel);
  };

  const updateCombo = (newCombo) => {
    setCombo(newCombo);
  };

  const updateProgress = (newProgress) => {
    setProgress(newProgress);
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
            onGameOver={endGame}
            onPause={pauseGame}
            gameState={gameState}
            initialLevel={level}
            initialScore={score}
          />
          <GameUI 
            score={score}
            level={level}
            combo={combo}
            progress={progress}
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