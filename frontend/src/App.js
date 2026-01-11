import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import GameUI from './components/GameUI';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameover'
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('highScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setCombo(0);
    setGameState('playing');
  };

  const endGame = (finalScore) => {
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('highScore', finalScore.toString());
    }
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

  return (
    <div className="App min-h-screen w-full overflow-hidden" style={{ background: 'var(--gradient-space)' }}>
      {gameState === 'start' && (
        <StartScreen onStart={startGame} highScore={highScore} />
      )}
      
      {gameState === 'playing' && (
        <div className="relative w-full h-screen">
          <GameCanvas 
            onScoreUpdate={updateScore}
            onLevelUpdate={updateLevel}
            onComboUpdate={updateCombo}
            onGameOver={endGame}
            gameState={gameState}
          />
          <GameUI 
            score={score}
            level={level}
            combo={combo}
          />
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