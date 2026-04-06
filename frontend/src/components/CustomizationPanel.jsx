import React from 'react';

const CustomizationPanel = ({ gameConfig, onUpdate }) => {
  if (!gameConfig) {
    return (
      <div className="glass-card">
        <h2 className="section-title">Customization</h2>
        <p style={{ color: 'var(--text-muted)' }}>Generate a game first to unlock customization options.</p>
      </div>
    );
  }

  const handleSpeedChange = (e) => {
    onUpdate({
      player: {
        ...gameConfig.player,
        speed: parseInt(e.target.value)
      }
    });
  };

  const handleColorChange = (e) => {
    onUpdate({
      player: {
        ...gameConfig.player,
        color: e.target.value
      }
    });
  };

  const handleBgColorChange = (e) => {
    onUpdate({ background: e.target.value });
  };

  return (
    <div className="glass-card">
      <h2 className="section-title">Customization</h2>
      
      <div className="panel-row">
        <span className="label">Background Color</span>
        <input 
          type="color" 
          value={gameConfig.background} 
          onChange={handleBgColorChange}
          style={{ width: '50px', height: '30px', padding: '0' }}
        />
      </div>

      <div className="panel-row">
        <span className="label">Player Color</span>
        <input 
          type="color" 
          value={gameConfig.player.color} 
          onChange={handleColorChange}
          style={{ width: '50px', height: '30px', padding: '0' }}
        />
      </div>

      <div style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
        <span className="label">Player Speed: {gameConfig.player.speed}</span>
        <input 
          type="range" 
          min="50" 
          max="500" 
          value={gameConfig.player.speed} 
          onChange={handleSpeedChange}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <span className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>Basic Logic info</span>
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
          Type: {gameConfig.gameType}<br/>
          Difficulty: {gameConfig.difficulty}<br/>
          Goal: {gameConfig.goal}
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;
