import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import createGameScene from '../game/GameScene';

const GamePreview = ({ gameConfig, loading }) => {
  const gameRef = useRef(null);

  useEffect(() => {
    if (!gameConfig) return;

    // Destroy existing game instance if it exists
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    const config = {
      type: Phaser.AUTO,
      width: 800, // Logical width
      height: 450, // Logical height (16:9)
      parent: 'phaser-container',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: (gameConfig.gameType === 'platformer') ? 500 : 0 },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: createGameScene(gameConfig)
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [gameConfig]);

  if (loading) {
    return (
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <h2 className="section-title">Generating Game Logic...</h2>
        <p style={{ color: 'var(--text-muted)' }}>Using AI to process natural language into game rules.</p>
        <div style={{ marginTop: '1rem', width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!gameConfig) {
    return (
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <h2 className="section-title">Game Preview</h2>
        <p style={{ color: 'var(--text-muted)' }}>Enter a prompt above to generate a game.</p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div id="phaser-container" className="game-canvas-container"></div>
    </div>
  );
};

export default GamePreview;
