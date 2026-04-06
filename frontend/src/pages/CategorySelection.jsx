import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function CategorySelection() {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'kids',
      title: 'Kids',
      description: 'Fun, simple games with bright colors and easy mechanics.',
      icon: '🎮',
      gradient: 'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)'
    },
    {
      id: 'adults',
      title: 'Adults',
      description: 'Challenging puzzles and strategic gameplay for all skill levels.',
      icon: '🧠',
      gradient: 'linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)'
    },
    {
      id: 'old-age',
      title: 'Old Age',
      description: 'Relaxing, engaging experiences designed for comfort and joy.',
      icon: '🌅',
      gradient: 'linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)'
    }
  ];

  const handleSelect = (categoryId) => {
    // Optionally store the selection in localStorage if needed for the builder
    localStorage.setItem('selectedCategory', categoryId);
    navigate('/builder');
  };

  return (
    <div className="auth-container">
      {/* Background Orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      <div className="glass-card" style={{ maxWidth: '900px', width: '90%', padding: '3rem', textAlign: 'center' }}>
        <h1 className="auth-title" style={{ marginBottom: '1rem' }}>Choose Your Entertainment</h1>
        <p className="auth-subtitle" style={{ marginBottom: '3rem' }}>
          Select a category to tailor your game generation experience.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="glass-card floating"
              onClick={() => handleSelect(cat.id)}
              style={{
                cursor: 'pointer',
                padding: '2.5rem 1.5rem',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-color)';
                e.currentTarget.style.transform = 'translateY(-10px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                fontSize: '4rem',
                background: cat.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem'
              }}>
                {cat.icon}
              </div>
              <h3 style={{ fontSize: '1.8rem', color: '#fff' }}>{cat.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.5' }}>
                {cat.description}
              </p>
              <button
                className="cta-primary"
                style={{
                  marginTop: 'auto',
                  fontSize: '0.9rem',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '20px'
                }}
              >
                Select
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategorySelection;
