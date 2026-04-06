import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../index.css';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="home-container">
      {/* Background Orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      <nav className="glass-nav">
        <div className="logo">
          <img 
            src="/logo.jpg" 
            alt="PlayWizard Logo" 
            className="logo-img" 
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
          <span style={{marginLeft: '8px'}}>✨ PlayWizard</span>
        </div>
        <div className="nav-links">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div 
                className="profile-tab" 
                style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  padding: '0.4rem 1rem', 
                  borderRadius: '20px', 
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                👤 {user.name}
              </div>
              <button 
                className="nav-link" 
                onClick={handleLogout}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#ff5555' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button className="nav-link" onClick={() => navigate('/login')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>Sign In</button>
              <button className="nav-btn" onClick={() => navigate('/register')}>Sign Up</button>
            </>
          )}
        </div>
      </nav>

      <main className="hero-section">
        <div className="hero-content">
          <div className="badge">🚀 The Future of Game Development</div>
          <h1 className="hero-title">
            Build Games at the <br />
            <span className="gradient-text">Speed of Thought</span>
          </h1>
          <p className="hero-subtitle">
            Describe your game idea in plain English and let our AI game engine build it for you in seconds. No coding required.
          </p>
          <div className="cta-group">
            <button className="cta-primary" onClick={() => navigate('/builder')}>
              Start Building — It's Free
              <span className="arrow">→</span>
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glass-card mockup-card floating">
            <div className="mockup-header">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <div className="mockup-body">
              <div className="mockup-line w-70"></div>
              <div className="mockup-line w-40"></div>
              <div className="mockup-prompt">
                "A platformer game where a red block jumps over spikes"
              </div>
              <div className="mockup-loading">
                <div className="spinner"></div> Generating game logic...
              </div>
            </div>
          </div>

          <div className="glass-card mockup-card floating delay-1 mockup-behind">
            <div className="game-preview-mockup">
              <div className="mockup-player"></div>
              <div className="mockup-spike"></div>
            </div>
          </div>
        </div>
      </main>

      <section className="features-section">
        <h2 className="section-heading">Why PlayWizard?</h2>
        <div className="features-grid">
          <div className="glass-card feature-card">
            <div className="feature-icon">🧠</div>
            <h3>AI Generation</h3>
            <p>Our fine-tuned models understand game mechanics from simple text prompts and generate playable Code instantly.</p>
          </div>
          <div className="glass-card feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Play</h3>
            <p>Test your game right in the browser within seconds. Iterate rapidly by just talking to the AI.</p>
          </div>
          <div className="glass-card feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Fully Customizable</h3>
            <p>Tweak speeds, colors, physics, and gameplay parameters via a slick graphical interface without touching a line of code.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} PlayWizard. Built with creativity.</p>
      </footer>
    </div>
  );
}

export default Home;
