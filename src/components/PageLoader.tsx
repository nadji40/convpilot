import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../contexts/AppContext';
import { darkColors, lightColors } from '../theme';

interface PageLoaderProps {
  visible?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ visible = true }) => {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  if (!visible) return null;

  return (
    <View
      style={{
        position: 'fixed' as any,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: colors.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
      }}
    >
      <div className="loader" />
    </View>
  );
};

