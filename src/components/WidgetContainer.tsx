import React, { ReactNode, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { darkColors, lightColors, typography } from '../theme';
import { useTheme } from '../contexts/AppContext';

interface WidgetContainerProps {
  id: string;
  title?: string;
  children: ReactNode;
  defaultVisible?: boolean;
  storageKey?: string;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  id,
  title,
  children,
  defaultVisible = true,
  storageKey = 'widgetVisibility',
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const [isVisible, setIsVisible] = useState(defaultVisible);

  // Load visibility state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const visibility = JSON.parse(stored);
          if (visibility[id] !== undefined) {
            setIsVisible(visibility[id]);
          }
        } catch (e) {
          console.error('Error loading widget visibility:', e);
        }
      }
    }
  }, [id, storageKey]);

  // Save visibility state to localStorage
  const toggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      let visibility: { [key: string]: boolean } = {};
      
      if (stored) {
        try {
          visibility = JSON.parse(stored);
        } catch (e) {
          console.error('Error parsing widget visibility:', e);
        }
      }
      
      visibility[id] = newVisibility;
      localStorage.setItem(storageKey, JSON.stringify(visibility));
    }
  };

  if (!isVisible && !title) {
    return null;
  }

  return (
    <View style={{
      transition: 'all 0.3s ease',
      opacity: isVisible ? 1 : 0.5,
    }}>
      {title && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}>
          <Text style={{
            color: colors.textPrimary,
            fontSize: parseInt(typography.fontSize.large),
            fontWeight: '600',
            fontFamily: typography.fontFamily.heading,
          }}>
            {title}
          </Text>
          
          <TouchableOpacity
            onPress={toggleVisibility}
            style={{
              padding: 8,
              borderRadius: parseInt(colors.borderRadius.small),
              backgroundColor: colors.surfaceCard,
              borderWidth: 1,
              borderColor: colors.border,
              cursor: 'pointer',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              {isVisible ? (
                <path
                  d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z M8 10a2 2 0 100-4 2 2 0 000 4z"
                  stroke={colors.textSecondary}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <>
                  <path
                    d="M6.5 3.7A5 5 0 018 3.5c4 0 7 5 7 5a11 11 0 01-2 2.4M4.3 4.3a11 11 0 00-3.1 4c0 .1 3 5 7 5a5 5 0 002.7-.8"
                    stroke={colors.textSecondary}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 2l12 12"
                    stroke={colors.textSecondary}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
          </TouchableOpacity>
        </View>
      )}
      
      {isVisible && (
        <View style={{
          animation: 'fadeIn 0.3s ease',
        }}>
          {children}
        </View>
      )}
    </View>
  );
};

