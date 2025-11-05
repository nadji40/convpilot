import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Try meriem@convpilot.net / password123');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="common-page-grid">
        <div className="page-background">
          <div className="image-wrap">
            <img 
              src="/images/Inner-Page-BG.webp" 
              loading="lazy" 
              sizes="(max-width: 2880px) 100vw, 2880px"
              alt="" 
              className="img"
            />
          </div>
        </div>
        <div className="common-page-content">
          <div className="log-content-wrap">
            <a href="/" className="navbar-brand w-inline-block">
              <img src="/images/Logo.png" loading="lazy" alt="CONVPILOT Logo" className="logo" />
            </a>
            <div className="w-form">
              <form onSubmit={handleSubmit} className="log-in-form">
                <div className="log-in-heading">
                  <h1 className="heading-type-v3">Welcome back</h1>
                  <div className="text-default">Welcome back! Please enter your details.</div>
                </div>
                <div className="log-button-wrapper">
                  <div className="log-input-wrapper">
                    <div className="log-field-wrap">
                      <label htmlFor="Email" className="text-default">Email</label>
                      <input 
                        className="log-in-feild w-input" 
                        maxLength={256}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email" 
                        type="email" 
                        id="Email" 
                        required 
                      />
                    </div>
                    <div className="log-field-wrap">
                      <label htmlFor="Password" className="text-default">Password</label>
                      <input 
                        className="log-in-feild w-input" 
                        maxLength={256}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        type="password" 
                        id="Password" 
                        required 
                      />
                    </div>
                  </div>
                  {error && (
                    <div style={{ 
                      color: '#ef4444', 
                      fontSize: '14px', 
                      marginTop: '10px',
                      textAlign: 'center'
                    }}>
                      {error}
                    </div>
                  )}
                  <div className="forget-password-wrapper">
                    <label className="w-checkbox checkbox-field">
                      <div className={`w-checkbox-input w-checkbox-input--inputType-custom checkbox ${rememberMe ? 'w--redirected-checked' : ''}`}></div>
                      <input 
                        type="checkbox" 
                        id="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{opacity:0, position:'absolute', zIndex:-1}} 
                      />
                      <span className="text-default w-form-label" htmlFor="checkbox">Remember for 30 days</span>
                    </label>
                  </div>
                  <div className="log-button-wrap">
                    <input 
                      type="submit" 
                      className="button-primary-inner submit w-button" 
                      value="Log in" 
                    />
                  </div>
                </div>
                <div className="sign-text-wrap">
                  <div className="text-default">Demo credentials: meriem@convpilot.net / password123</div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

