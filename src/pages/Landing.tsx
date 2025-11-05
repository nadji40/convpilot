import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      // Redirect to the static landing page HTML
      window.location.href = '/landing.html';
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#01000a',
      color: '#fff',
      fontFamily: 'Playfair Display, serif'
    }}>
      <p>Loading...</p>
    </div>
  );
};

