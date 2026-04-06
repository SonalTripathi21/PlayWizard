import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/api';
import GamePreview from '../components/GamePreview';

function SharedGame() {
  const { id } = useParams();
  const [gameConfig, setGameConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await api.get(`/api/games/${id}`);
        setGameConfig(res.data.config);
        setPrompt(res.data.prompt);
      } catch (err) {
        console.error('Failed to fetch shared game', err);
        setError('Game not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  if (loading) {
    return (
      <div className="app-container">
        <header>
          <h1>PlayWizard Player</h1>
        </header>
        <div className="main-content" style={{ justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <div className="spinner"></div>
            <p>Loading Shared Game...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <header>
          <h1>PlayWizard Player</h1>
        </header>
        <div className="main-content" style={{ justifyContent: 'center' }}>
          <div className="glass-card" style={{ textAlign: 'center', maxWidth: '500px' }}>
            <h2 className="section-title" style={{ color: '#ff4444' }}>Error</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>Go Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            position: 'absolute', 
            left: '1rem', 
            top: '50%', 
            transform: 'translateY(-50%)',
            padding: '0.5rem 1rem',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(5px)',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          ← Explore More
        </button>
        <h1>{prompt}</h1>
        <p className="subtitle">Interactive AI-Generated Prototype</p>
      </header>

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '900px' }}>
          <GamePreview gameConfig={gameConfig} loading={false} />
        </div>
        
        <div className="glass-card" style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
            <h3>Created with PlayWizard</h3>
            <p style={{ color: 'var(--text-muted)' }}>This game was built using natural language and AI logic.</p>
            <button onClick={() => navigate('/builder')} style={{ marginTop: '1rem', background: 'var(--primary-color)' }}>
              Create Your Own Game
            </button>
        </div>
      </div>
    </div>
  );
}

export default SharedGame;
