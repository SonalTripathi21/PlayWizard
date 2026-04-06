import React, { useState } from 'react';

const PromptInput = ({ onGenerate, loading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  const setDemoPrompt = (text) => {
    setPrompt(text);
  };

  return (
    <div className="glass-card">
      <h2 className="section-title">Create a Game</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <textarea 
          rows="4"
          placeholder="e.g., Create a 2D racing game with obstacles and score tracking"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Try:</span>
          <button 
            type="button" 
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)' }}
            onClick={() => setDemoPrompt('Create a fast space shooter game')}
          >
            Space Shooter
          </button>
          <button 
            type="button" 
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)' }}
            onClick={() => setDemoPrompt('A simple platformer with spikes on easy mode')}
          >
            Easy Platformer
          </button>
        </div>
        <button type="submit" disabled={loading || !prompt.trim()}>
          {loading ? 'Generating AI Game...' : 'Generate Game 🪄'}
        </button>
      </form>
    </div>
  );
};

export default PromptInput;
