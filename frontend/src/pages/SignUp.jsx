import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import api from '../api/api';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import '../index.css';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const isClientIdPlaceholder = !import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_GOOGLE_CLIENT_ID.includes("YOUR_GOOGLE_CLIENT_ID");

  const handleSignUp = async (e) => {
    e.preventDefault();
    // Mock Authentication Logic
    const mockUser = { email, name };
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    // Log the event to backend
    try {
        await api.post('/api/auth/log', { identifier: email, type: 'signin' });
    } catch (err) {
        console.warn('Failed to log auth event:', err.message);
    }

    alert(`Account created for ${name}!`);
    navigate('/categories');
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
        const res = await api.post('/api/auth/google-login', {
            credential: credentialResponse.credential
        });
        
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        alert(`Signed in as ${user.name}`);
        navigate('/categories');
    } catch (err) {
        console.error('Google login failed:', err);
        alert('Google login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    console.log('Login Failed');
    alert('Google login failed');
  };

  const handleMockLogin = () => {
    const mockUser = {
        id: 'mock-123',
        email: 'dev-user@example.com',
        name: 'Developer User',
        picture: 'https://via.placeholder.com/150'
    };
    localStorage.setItem('token', 'mock-jwt-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    alert('Account created with Mock Google Account');
    navigate('/categories');
  };

  return (
    <div className="auth-container">
      {/* Background Orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      
      <div className="glass-card auth-card floating">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join PlayWizard and build your first game</p>
        
        <form onSubmit={handleSignUp} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Merlin the Great"
              required 
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="wizard@example.com"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password (Max 10 characters)</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                maxLength="10"
                required 
                style={{ width: '100%' }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-color)',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button type="submit" className="cta-primary auth-submit">Sign Up</button>
        </form>

        <div className="auth-separator">
          <span>OR</span>
        </div>

        {isClientIdPlaceholder && (
          <div style={{ padding: '15px', background: 'rgba(108, 92, 231, 0.1)', border: '1px solid var(--primary-color)', borderRadius: '12px', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: 'var(--text-main)', marginBottom: '10px' }}>
              <strong>Dev Mode:</strong> Google Client ID is not set. 
            </p>
            <button 
                type="button" 
                onClick={handleMockLogin}
                className="nav-btn"
                style={{ width: '100%', fontSize: '0.85rem' }}
            >
              Simulate Google Login
            </button>
          </div>
        )}

        {!isClientIdPlaceholder && (
          <div className="google-auth-btn">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_blue"
              text="signup_with"
              shape="pill"
            />
          </div>
        )}
        
        <p className="auth-redirect">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
