import React, { useState, useMemo, useEffect } from 'react';
import { View, Text } from 'react-native';
import { darkColors, lightColors, typography } from '../../theme';
import { useTheme, useSidebar, useLanguage } from '../../contexts/AppContext';
import { DashboardHeader } from '../../components/DashboardHeader';
import { AnimatedCard } from '../../components/AnimatedCard';
import { CrossFilterChart } from '../../components/CrossFilterChart';
import { mockConvertibleBonds } from '../../data/mockData';
import { getCrossFilterData, formatLargeNumber } from '../../utils/dataUtils';
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

type PrimaryDimension = 'sector' | 'rating' | 'size' | 'profile' | 'maturity';
type SecondaryDimension = 'sector' | 'rating' | 'size' | 'profile' | 'maturity';

export const Aggregations: React.FC = () => {
  const { isDark } = useTheme();
  const { isCollapsed } = useSidebar();
  const { t } = useLanguage();
  const colors = isDark ? darkColors : lightColors;

  const [primaryDimension, setPrimaryDimension] = useState<PrimaryDimension>('sector');
  const [secondaryDimension, setSecondaryDimension] = useState<SecondaryDimension>('rating');

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.className = isDark ? '' : 'light-theme';
    }
  }, [isDark]);

  // Get cross-filter data
  const crossFilterData = useMemo(() => {
    return getCrossFilterData(mockConvertibleBonds, primaryDimension, secondaryDimension);
  }, [primaryDimension, secondaryDimension]);

  // Aggregate by primary dimension
  const primaryData = useMemo(() => {
    const aggregated: { [key: string]: { count: number; marketCap: number } } = {};
    
    crossFilterData.forEach((item) => {
      if (!aggregated[item.primary]) {
        aggregated[item.primary] = { count: 0, marketCap: 0 };
      }
      aggregated[item.primary].count += item.value;
      aggregated[item.primary].marketCap += item.marketCap || 0;
    });

    return Object.entries(aggregated).map(([name, data]) => ({
      name,
      value: data.count,
      marketCap: data.marketCap,
    }));
  }, [crossFilterData]);

  // Aggregate by secondary dimension
  const secondaryData = useMemo(() => {
    const aggregated: { [key: string]: { count: number; marketCap: number } } = {};
    
    crossFilterData.forEach((item) => {
      if (!aggregated[item.secondary]) {
        aggregated[item.secondary] = { count: 0, marketCap: 0 };
      }
      aggregated[item.secondary].count += item.value;
      aggregated[item.secondary].marketCap += item.marketCap || 0;
    });

    return Object.entries(aggregated).map(([name, data]) => ({
      name,
      value: data.count,
      marketCap: data.marketCap,
    }));
  }, [crossFilterData]);

  const CHART_COLORS = [
    colors.chartColors.blue,
    colors.chartColors.cyan,
    colors.chartColors.green,
    colors.chartColors.purple,
    colors.chartColors.orange,
    colors.chartColors.pink,
  ];

  const dimensions: { value: PrimaryDimension; label: string }[] = [
    { value: 'sector', label: 'Sector' },
    { value: 'rating', label: 'Credit Rating' },
    { value: 'size', label: 'Market Cap Size' },
    { value: 'profile', label: 'Bond Profile' },
    { value: 'maturity', label: 'Maturity Bucket' },
  ];

  return (
    <View
      style={{
        backgroundColor: colors.background,
        minHeight: '100vh',
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          marginLeft: isCollapsed ? 80 : 280,
          padding: 24,
          height: '100vh',
          overflow: 'auto' as any,
          backgroundColor: colors.background,
        }}
      >
        <View style={{ gap: 32, paddingBottom: 40 }}>
          {/* Header */}
          <DashboardHeader 
            title={t('dashboard.aggregations')}
            description={t('dashboard.aggregations_desc')}
          />

          {/* Dimension Selectors */}
          <AnimatedCard delay={0.2} enableHover={false}>
            <View style={{ gap: 24 }}>
              <View style={{ flexDirection: 'row', gap: 24, flexWrap: 'wrap' }}>
                <View style={{ flex: 1, minWidth: 250, gap: 8 }}>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontSize: parseInt(typography.fontSize.default),
                      fontWeight: '600',
                      fontFamily: typography.fontFamily.body,
                    }}
                  >
                    Primary Dimension
                  </Text>
                  <select
                    value={primaryDimension}
                    onChange={(e) => setPrimaryDimension(e.target.value as PrimaryDimension)}
                    style={{
                      padding: 12,
                      backgroundColor: colors.surfaceCard,
                      color: colors.textPrimary,
                      border: `1px solid ${colors.border}`,
                      borderRadius: parseInt(colors.borderRadius.medium),
                      fontSize: typography.fontSize.default,
                      fontFamily: typography.fontFamily.body,
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {dimensions.map((dim) => (
                      <option key={dim.value} value={dim.value}>
                        {dim.label}
                      </option>
                    ))}
                  </select>
                </View>

                <View style={{ flex: 1, minWidth: 250, gap: 8 }}>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontSize: parseInt(typography.fontSize.default),
                      fontWeight: '600',
                      fontFamily: typography.fontFamily.body,
                    }}
                  >
                    Secondary Dimension (Cross-Filter)
                  </Text>
                  <select
                    value={secondaryDimension}
                    onChange={(e) => setSecondaryDimension(e.target.value as SecondaryDimension)}
                    style={{
                      padding: 12,
                      backgroundColor: colors.surfaceCard,
                      color: colors.textPrimary,
                      border: `1px solid ${colors.border}`,
                      borderRadius: parseInt(colors.borderRadius.medium),
                      fontSize: typography.fontSize.default,
                      fontFamily: typography.fontFamily.body,
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {dimensions.filter((d) => d.value !== primaryDimension).map((dim) => (
                      <option key={dim.value} value={dim.value}>
                        {dim.label}
                      </option>
                    ))}
                  </select>
                </View>
              </View>

              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: parseInt(typography.fontSize.small),
                  fontStyle: 'italic',
                }}
              >
                Example: "By {dimensions.find((d) => d.value === primaryDimension)?.label}" → see breakdown by{' '}
                {dimensions.find((d) => d.value === secondaryDimension)?.label}
              </Text>
            </View>
          </AnimatedCard>

          {/* Primary Dimension Chart */}
          <AnimatedCard delay={0.3} enableHover={false}>
            <View style={{ gap: 16 }}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: parseInt(typography.fontSize.large),
                  fontWeight: '600',
                  fontFamily: typography.fontFamily.heading,
                }}
              >
                Breakdown by {dimensions.find((d) => d.value === primaryDimension)?.label}
              </Text>

              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={primaryData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <XAxis
                    dataKey="name"
                    stroke={colors.muted}
                    tick={{ fill: colors.textSecondary, fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis stroke={colors.muted} tick={{ fill: colors.textSecondary, fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.surfaceCard,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                    }}
                    labelStyle={{ color: colors.textPrimary, fontWeight: '600' }}
                    itemStyle={{ color: colors.textSecondary }}
                    formatter={(value: any, name: string) => {
                      if (name === 'marketCap') {
                        return [formatLargeNumber(value), 'Market Cap (EUR)'];
                      }
                      return [value, 'Count'];
                    }}
                  />
                  <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                    {primaryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </View>
          </AnimatedCard>

          {/* Secondary Dimension Chart */}
          <AnimatedCard delay={0.4} enableHover={false}>
            <View style={{ gap: 16 }}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: parseInt(typography.fontSize.large),
                  fontWeight: '600',
                  fontFamily: typography.fontFamily.heading,
                }}
              >
                Breakdown by {dimensions.find((d) => d.value === secondaryDimension)?.label}
              </Text>

              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={secondaryData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <XAxis
                    dataKey="name"
                    stroke={colors.muted}
                    tick={{ fill: colors.textSecondary, fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis stroke={colors.muted} tick={{ fill: colors.textSecondary, fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.surfaceCard,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                    }}
                    labelStyle={{ color: colors.textPrimary, fontWeight: '600' }}
                    itemStyle={{ color: colors.textSecondary }}
                    formatter={(value: any, name: string) => {
                      if (name === 'marketCap') {
                        return [formatLargeNumber(value), 'Market Cap (EUR)'];
                      }
                      return [value, 'Count'];
                    }}
                  />
                  <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                    {secondaryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 2) % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </View>
          </AnimatedCard>

          {/* Cross-Filter Summary Table */}
          <AnimatedCard delay={0.5} enableHover={false}>
            <View style={{ gap: 16 }}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: parseInt(typography.fontSize.large),
                  fontWeight: '600',
                  fontFamily: typography.fontFamily.heading,
                }}
              >
                Cross-Filter Summary
              </Text>

              <View style={{ overflowX: 'auto' as any }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: typography.fontSize.small,
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: colors.surface }}>
                      <th
                        style={{
                          padding: 12,
                          textAlign: 'left',
                          color: colors.textPrimary,
                          fontWeight: '600',
                          borderBottom: `2px solid ${colors.border}`,
                        }}
                      >
                        {dimensions.find((d) => d.value === primaryDimension)?.label}
                      </th>
                      <th
                        style={{
                          padding: 12,
                          textAlign: 'left',
                          color: colors.textPrimary,
                          fontWeight: '600',
                          borderBottom: `2px solid ${colors.border}`,
                        }}
                      >
                        {dimensions.find((d) => d.value === secondaryDimension)?.label}
                      </th>
                      <th
                        style={{
                          padding: 12,
                          textAlign: 'right',
                          color: colors.textPrimary,
                          fontWeight: '600',
                          borderBottom: `2px solid ${colors.border}`,
                        }}
                      >
                        Count
                      </th>
                      <th
                        style={{
                          padding: 12,
                          textAlign: 'right',
                          color: colors.textPrimary,
                          fontWeight: '600',
                          borderBottom: `2px solid ${colors.border}`,
                        }}
                      >
                        Market Cap
                      </th>
                      <th
                        style={{
                          padding: 12,
                          textAlign: 'right',
                          color: colors.textPrimary,
                          fontWeight: '600',
                          borderBottom: `2px solid ${colors.border}`,
                        }}
                      >
                        Avg Delta
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {crossFilterData.map((item, index) => (
                      <tr
                        key={index}
                        style={{
                          borderBottom: `1px solid ${colors.border}`,
                          transition: 'background-color 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.surfaceElev;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <td style={{ padding: 12, color: colors.textPrimary }}>{item.primary}</td>
                        <td style={{ padding: 12, color: colors.textSecondary }}>{item.secondary}</td>
                        <td style={{ padding: 12, textAlign: 'right', color: colors.textPrimary, fontWeight: '600' }}>
                          {item.value}
                        </td>
                        <td style={{ padding: 12, textAlign: 'right', color: colors.textPrimary }}>
                          {formatLargeNumber(item.marketCap || 0)}
                        </td>
                        <td style={{ padding: 12, textAlign: 'right', color: colors.textPrimary }}>
                          {item.avgMetric?.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </View>
            </View>
          </AnimatedCard>
        </View>
      </View>
    </View>
  );
};

