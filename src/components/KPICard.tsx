import React from 'react';
import { View, Text } from 'react-native';
import { darkColors, lightColors, typography } from '../theme';
import { useTheme } from '../contexts/AppContext';
import { AnimatedCard } from './AnimatedCard';
import { formatPercentage, formatLargeNumber } from '../utils/dataUtils';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  subtitle?: string;
  icon?: React.ReactNode;
  delay?: number;
  format?: 'number' | 'currency' | 'percentage' | 'custom';
}

export const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  trend,
  subtitle,
  icon,
  delay = 0,
  format = 'custom'
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  const formatValue = () => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'number':
        return formatLargeNumber(value);
      case 'percentage':
        return `${value.toFixed(2)}%`;
      case 'currency':
        return `€${formatLargeNumber(value)}`;
      default:
        return value;
    }
  };

  const getTrendColor = () => {
    if (trend === undefined) return colors.textSecondary;
    return trend >= 0 ? colors.success : colors.danger;
  };

  return (
    <AnimatedCard delay={delay} enableHover={false}>
      <View style={{ gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{
            color: colors.textSecondary,
            fontSize: parseInt(typography.fontSize.small),
            fontWeight: '500',
            fontFamily: typography.fontFamily.body,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}>
            {title}
          </Text>
          {icon && (
            <View style={{ opacity: 0.7 }}>
              {icon}
            </View>
          )}
        </View>
        
        <View style={{ gap: 8 }}>
          <Text style={{
            color: colors.textPrimary,
            fontSize: parseInt(typography.fontSize.h4),
            fontWeight: '700',
            fontFamily: typography.fontFamily.heading,
            lineHeight: parseInt(typography.fontSize.h4) * 1.2,
          }}>
            {formatValue()}
          </Text>
          
          {(trend !== undefined || subtitle) && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {trend !== undefined && (
                <Text style={{
                  color: getTrendColor(),
                  fontSize: parseInt(typography.fontSize.small),
                  fontWeight: '600',
                  fontFamily: typography.fontFamily.body,
                }}>
                  {formatPercentage(trend)}
                </Text>
              )}
              {subtitle && (
                <Text style={{
                  color: colors.textSecondary,
                  fontSize: parseInt(typography.fontSize.small),
                  fontFamily: typography.fontFamily.body,
                }}>
                  {subtitle}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </AnimatedCard>
  );
};

