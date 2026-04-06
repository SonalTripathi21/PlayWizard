import { useState, useEffect } from 'react';
import PromptInput from '../components/PromptInput';
import GamePreview from '../components/GamePreview';
import CustomizationPanel from '../components/CustomizationPanel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/api';

function Builder() {
  const [gameConfig, setGameConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [promptValue, setPromptValue] = useState('');
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }

    // Apply category-specific background class to body
    const category = localStorage.getItem('selectedCategory');
    if (category) {
      document.body.classList.add(`bg-${category}-theme`);
    }

    return () => {
      // Cleanup: remove category-specific background classes
      if (category) {
        document.body.classList.remove(`bg-${category}-theme`);
      }
    };
  }, []);

  const selectedCategory = localStorage.getItem('selectedCategory');
  
  const getBrandingText = () => {
    switch (selectedCategory) {
      case 'kids':
        return 'Kids PlayWizard';
      case 'adults':
        return 'Adult PlayWizard';
      case 'old-age':
        return 'Golden PlayWizard';
      default:
        return 'PlayWizard';
    }
  };

  const handleLogout = async () => {
    const userEmail = user?.email;
    localStorage.removeItem('user');
    setUser(null);
    
    if (userEmail) {
        try {
            await api.post('/api/auth/log', { identifier: userEmail, type: 'signout' });
        } catch (err) {
            console.warn('Failed to log auth event:', err.message);
        }
    }
    navigate('/login');
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/api/games');
      setHistory(res.data);
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };

  const handleGenerate = async (prompt) => {
    setLoading(true);
    setPromptValue(prompt);
    try {
      const res = await api.post('/api/games/generate', { prompt });
      setGameConfig(res.data.config);
      setGameId(null);
    } catch (error) {
      console.error('Failed to generate game:', error);
      alert('Failed to generate game! Please ensure you have added a valid Google Gemini API Key in backend/.env');
    } finally {
      setLoading(false);
    }
  };

  const handleStopGame = () => {
    setGameConfig(null);
  };

  const handleUpdateConfig = (newConfig) => {
    setGameConfig({ ...gameConfig, ...newConfig });
  };

  const handleSave = async () => {
    if (!gameConfig) return;
    try {
      const res = await api.post('/api/games/save', { 
        prompt: promptValue, 
        config: gameConfig 
      });
      setGameId(res.data.id);
      fetchHistory(); // Refresh history
      // Instead of an alert, we'll let the UI show the link
    } catch (error) {
      console.error('Failed to save game', error);
      alert('Failed to save game.');
    }
  };

  return (
    <div className="app-container">
      <header style={{ position: 'relative' }}>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            position: 'absolute', 
            left: 0, 
            top: '50%', 
            transform: 'translateY(-50%)',
            padding: '0.5rem 1rem',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(5px)'
          }}
        >
          ← Home
        </button>
        <h1>{getBrandingText()}</h1>
        <p className="subtitle">AI-Powered No-Code Game Engine</p>
        
        {user && (
          <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>👤 {user.name}</span>
            <button 
              onClick={handleLogout}
              style={{ background: 'rgba(255,50,50,0.1)', color: '#ff5555', border: 'none', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <div className="main-content">
        <div className="history-sidebar glass-card" style={{ width: '250px', padding: '1rem', overflowY: 'auto', maxHeight: '80vh' }}>
          <h2 className="section-title">History</h2>
          {history.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No saved games yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {history.map((item) => (
                <div key={item._id} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', cursor: 'pointer' }} onClick={() => { setGameConfig(item.config); setPromptValue(item.prompt); }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.prompt}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(item.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="left-panel">
          <PromptInput onGenerate={handleGenerate} loading={loading} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Game Preview</h2>
            {gameConfig && !loading && (
              <button 
                onClick={handleStopGame}
                style={{ 
                  background: 'rgba(255, 50, 50, 0.2)', 
                  border: '1px solid #ff4444', 
                  color: '#ff4444',
                  padding: '0.3rem 0.8rem',
                  fontSize: '0.8rem'
                }}
              >
                Stop Game
              </button>
            )}
          </div>
          <GamePreview gameConfig={gameConfig} loading={loading} />
        </div>
        
        <div className="right-panel">
          <CustomizationPanel 
            gameConfig={gameConfig} 
            onUpdate={handleUpdateConfig} 
          />
          {gameConfig && (
            <div className="glass-card">
              <h2 className="section-title">Actions</h2>
              <button style={{ width: '100%', marginBottom: '1rem' }} onClick={handleSave}>
                Save & Share
              </button>
              {gameId && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ wordBreak: 'break-all', fontSize: '0.8rem', color: 'var(--secondary-color)', marginBottom: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '4px' }}>
                    {window.location.origin}/share/{gameId}
                  </div>
                  <button 
                    onClick={() => {
                        const link = `${window.location.origin}/share/${gameId}`;
                        navigator.clipboard.writeText(link);
                        alert('Link copied to clipboard!');
                    }}
                    style={{ width: '100%', background: 'var(--secondary-color)', color: 'white' }}
                  >
                    Copy Share Link
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Builder;
