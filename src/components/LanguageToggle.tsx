import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useLanguage, useTheme } from '../contexts/AppContext';
import { darkColors, lightColors } from '../theme';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const thumbRef = useRef<HTMLDivElement>(null);
  const enRef = useRef<HTMLSpanElement>(null);
  const frRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const updateSliderState = () => {
    if (thumbRef.current && enRef.current && frRef.current) {
      if (language === 'fr') {
        thumbRef.current.classList.add('active');
        enRef.current.classList.remove('active');
        enRef.current.classList.add('inactive');
        frRef.current.classList.add('active');
        frRef.current.classList.remove('inactive');
      } else {
        thumbRef.current.classList.remove('active');
        enRef.current.classList.add('active');
        enRef.current.classList.remove('inactive');
        frRef.current.classList.remove('active');
        frRef.current.classList.add('inactive');
      }
    }
  };

  // Update slider state when language or theme changes
  useEffect(() => {
    updateSliderState();
    
    // Update track background based on theme
    if (trackRef.current) {
      if (isDark) {
        trackRef.current.style.background = 'linear-gradient(135deg, rgba(31, 35, 39, 0.9), rgba(15, 18, 21, 0.95))';
        trackRef.current.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      } else {
        trackRef.current.style.background = 'linear-gradient(135deg, rgba(241, 243, 244, 0.9), rgba(255, 255, 255, 0.95))';
        trackRef.current.style.borderColor = 'rgba(0, 0, 0, 0.1)';
      }
    }
  }, [language, isDark]);

  const handleSliderClick = (event: any) => {
    const sliderWidth = event.currentTarget.offsetWidth;
    const clickX = event.nativeEvent.offsetX;
    const newLang = clickX < sliderWidth / 2 ? 'en' : 'fr';
    
    if (newLang !== language) {
      setLanguage(newLang);
      
      // Store language preference
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('convpilot-language', newLang);
      }
    }
  };

  return (
    <View style={{ marginRight: 20 }}>
      <div 
        className="lang-slider-container"
        onClick={handleSliderClick}
        style={{ cursor: 'pointer' }}
      >
        <div 
          ref={trackRef}
          className="lang-slider-track"
          style={{
            background: isDark 
              ? 'linear-gradient(135deg, rgba(31, 35, 39, 0.9), rgba(15, 18, 21, 0.95))'
              : 'linear-gradient(135deg, rgba(241, 243, 244, 0.9), rgba(255, 255, 255, 0.95))',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          }}
        >
          <div 
            ref={thumbRef}
            className={`lang-slider-thumb ${language === 'fr' ? 'active' : ''}`}
            id="lang-slider-thumb"
          />
          <div className="lang-options">
            <span 
              ref={enRef}
              className={`lang-option ${language === 'en' ? 'active' : 'inactive'}`}
              data-lang="en" 
              id="lang-en"
              style={{
                color: language === 'en' 
                  ? (isDark ? '#ffffff' : '#0a0a0a')
                  : '#0a7cff',
              }}
            >
              EN
            </span>
            <span 
              ref={frRef}
              className={`lang-option ${language === 'fr' ? 'active' : 'inactive'}`}
              data-lang="fr" 
              id="lang-fr"
              style={{
                color: language === 'fr' 
                  ? (isDark ? '#ffffff' : '#0a0a0a')
                  : '#0a7cff',
              }}
            >
              FR
            </span>
          </div>
        </div>
      </div>
    </View>
  );
};

