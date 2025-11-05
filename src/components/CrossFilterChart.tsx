import React from 'react';
import { View, Text } from 'react-native';
import { darkColors, lightColors, typography } from '../theme';
import { useTheme } from '../contexts/AppContext';
import { AnimatedCard } from './AnimatedCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';

interface CrossFilterChartProps {
  title: string;
  data: Array<{
    name: string;
    value: number;
    [key: string]: any;
  }>;
  primaryKey: string;
  secondaryKey?: string;
  height?: number;
  delay?: number;
}

export const CrossFilterChart: React.FC<CrossFilterChartProps> = ({
  title,
  data,
  primaryKey,
  secondaryKey,
  height = 300,
  delay = 0,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  const CHART_COLORS = [
    colors.chartColors.blue,
    colors.chartColors.cyan,
    colors.chartColors.green,
    colors.chartColors.purple,
    colors.chartColors.orange,
    colors.chartColors.pink,
  ];

  return (
    <AnimatedCard delay={delay}>
      <View style={{ gap: 16 }}>
        <Text style={{
          color: colors.textPrimary,
          fontSize: parseInt(typography.fontSize.large),
          fontWeight: '600',
          fontFamily: typography.fontFamily.heading,
        }}>
          {title}
        </Text>

        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <XAxis
              dataKey="name"
              stroke={colors.muted}
              tick={{ fill: colors.textSecondary, fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke={colors.muted}
              tick={{ fill: colors.textSecondary, fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.surfaceCard,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              }}
              labelStyle={{ color: colors.textPrimary, fontWeight: '600' }}
              itemStyle={{ color: colors.textSecondary }}
            />
            {secondaryKey && <Legend wrapperStyle={{ color: colors.textSecondary }} />}
            
            {secondaryKey ? (
              <Bar dataKey={secondaryKey} fill={colors.chartColors.blue} radius={[4, 4, 0, 0]} />
            ) : (
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </View>
    </AnimatedCard>
  );
};

