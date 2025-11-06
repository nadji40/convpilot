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

  useEffect(() => {
    updateSliderState();
  }, [language]);

  const handleSliderClick = (event: any) => {
    const sliderWidth = event.currentTarget.offsetWidth;
    const clickX = event.nativeEvent.offsetX;
    const newLang = clickX < sliderWidth / 2 ? 'en' : 'fr';
    
    if (newLang !== language) {
      setLanguage(newLang);
    }
  };

  return (
    <View style={{ marginRight: 20 }}>
      <div 
        className="lang-slider-container"
        onClick={handleSliderClick}
        style={{ cursor: 'pointer' }}
      >
        <div className="lang-slider-track">
          <div 
            ref={thumbRef}
            className="lang-slider-thumb" 
            id="lang-slider-thumb"
          />
          <div className="lang-options">
            <span 
              ref={enRef}
              className="lang-option active" 
              data-lang="en" 
              id="lang-en"
            >
              EN
            </span>
            <span 
              ref={frRef}
              className="lang-option" 
              data-lang="fr" 
              id="lang-fr"
            >
              FR
            </span>
          </div>
        </div>
      </div>
    </View>
  );
};

