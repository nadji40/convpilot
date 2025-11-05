import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { darkColors, lightColors } from '../theme';
import { useTheme } from '../contexts/AppContext';
import { fadeInUp, applyHoverLift, removeHoverLift } from '../utils/animations';

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  enableHover?: boolean;
  style?: any;
  onClick?: () => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  delay = 0, 
  enableHover = true,
  style,
  onClick
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const cardRef = React.useRef<any>(null);

  const handleMouseEnter = () => {
    if (enableHover && cardRef.current) {
      applyHoverLift(cardRef.current, isDark);
    }
  };

  const handleMouseLeave = () => {
    if (enableHover && cardRef.current) {
      removeHoverLift(cardRef.current);
    }
  };

  return (
    <View
      ref={cardRef}
      style={{
        ...fadeInUp(delay),
        backgroundColor: colors.surfaceCard,
        borderRadius: parseInt(colors.borderRadius.regular),
        borderWidth: 1,
        borderColor: colors.border,
        padding: 24,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </View>
  );
};

