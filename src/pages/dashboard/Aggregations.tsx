import React, { useState, useMemo, useEffect } from 'react';
import { View, Text } from 'react-native';
import { darkColors, lightColors, typography } from '../../theme';
import { useTheme, useSidebar, useLanguage } from '../../contexts/AppContext';
import { DashboardHeader } from '../../components/DashboardHeader';
import { AnimatedCard } from '../../components/AnimatedCard';
import { CrossFilterChart } from '../../components/CrossFilterChart';
import { AIAgentBubble } from '../../components/AIAgentBubble';
import { mockConvertibleBonds } from '../../data/mockData';
import { getCrossFilterData, formatLargeNumber, formatCurrency, formatPercentage } from '../../utils/dataUtils';
import { ConvertibleBond } from '../../data/dataLoader';
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

type Dimension = 'sector' | 'maturity' | 'size' | 'rating' | 'profile' | 'features' | 'performances' | 'performance_allocation';

// Matrix of allowed dimension combinations (based on template)
const ALLOWED_COMBINATIONS: Record<Dimension, Dimension[]> = {
  sector: ['maturity', 'size', 'rating', 'profile', 'features', 'performances', 'performance_allocation'],
  maturity: ['sector', 'size', 'profile', 'performances', 'performance_allocation'],
  size: ['sector', 'maturity', 'rating', 'profile', 'features', 'performances', 'performance_allocation'],
  profile: ['sector', 'maturity', 'size', 'rating', 'performances', 'performance_allocation'],
  rating: ['sector', 'maturity', 'size', 'profile', 'features', 'performances', 'performance_allocation'],
  features: [],
  performances: [],
  performance_allocation: [],
};

// Helper function to check if a combination is allowed
const isCombinationAllowed = (primary: Dimension, secondary: Dimension): boolean => {
  return ALLOWED_COMBINATIONS[primary]?.includes(secondary) || false;
};

// Get available secondary dimensions for a primary dimension
const getAvailableSecondaryDimensions = (primary: Dimension): Dimension[] => {
  return ALLOWED_COMBINATIONS[primary] || [];
};

export const Aggregations: React.FC = () => {
  const { isDark } = useTheme();
  const { isCollapsed } = useSidebar();
  const { t } = useLanguage();
  const colors = isDark ? darkColors : lightColors;

  const [primaryDimension, setPrimaryDimension] = useState<Dimension>('sector');
  const [secondaryDimension, setSecondaryDimension] = useState<Dimension>('maturity');
  const [showDetailedMetrics, setShowDetailedMetrics] = useState<boolean>(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.className = isDark ? '' : 'light-theme';
    }
  }, [isDark]);

  // Update secondary dimension when primary changes to ensure valid combination
  useEffect(() => {
    const availableSecondary = getAvailableSecondaryDimensions(primaryDimension);
    if (availableSecondary.length > 0 && !availableSecondary.includes(secondaryDimension)) {
      setSecondaryDimension(availableSecondary[0]);
    }
  }, [primaryDimension]);

  // Helper to get dimension value from bond
  const getDimensionValue = (bond: ConvertibleBond, dimension: Dimension): string => {
    switch (dimension) {
      case 'sector':
        return bond.sector || 'Unknown';
      case 'rating':
        return bond.creditRating || 'NR';
      case 'size':
        return bond.marketCapCategory || 'Unknown';
      case 'profile':
        return bond.profile || 'Unknown';
      case 'maturity':
        const years = bond.yearsToMaturity || 0;
        if (years < 1) return '<1 year';
        if (years < 2) return '1-2 years';
        if (years < 5) return '2-5 years';
        return '>5 years';
      case 'features':
        return bond.profile || 'Unknown'; // Simplified
      case 'performances':
        return 'Performance'; // Simplified
      case 'performance_allocation':
        return 'Attribution'; // Simplified
      default:
        return 'Unknown';
    }
  };

  // Aggregate by primary dimension with enhanced metrics
  const primaryData = useMemo(() => {
    const aggregated: { [key: string]: {
      count: number;
      cbMarketCap: number;
      equityMarketCap: number;
      bonds: ConvertibleBond[];
    } } = {};
    
    mockConvertibleBonds.forEach((bond) => {
      const key = getDimensionValue(bond, primaryDimension);
      if (!aggregated[key]) {
        aggregated[key] = { count: 0, cbMarketCap: 0, equityMarketCap: 0, bonds: [] };
      }
      aggregated[key].count += 1;
      aggregated[key].cbMarketCap += bond.outstandingAmount || 0;
      aggregated[key].equityMarketCap += bond.marketCap || 0;
      aggregated[key].bonds.push(bond);
    });

    return Object.entries(aggregated).map(([name, data]) => {
      const totalCBMarketCap = Object.values(aggregated).reduce((sum, d) => sum + d.cbMarketCap, 0);
      
      // Calculate aggregated metrics
      const avgDelta = data.bonds.reduce((sum, b) => sum + b.delta, 0) / data.count;
      const avgPrime = data.bonds.reduce((sum, b) => sum + b.prime, 0) / data.count;
      const avgParity = data.bonds.reduce((sum, b) => sum + b.parity, 0) / data.count;
      const avgYTM = data.bonds.reduce((sum, b) => sum + b.ytm, 0) / data.count;
      const avgBondFloor = data.bonds.reduce((sum, b) => sum + b.bondfloorPercent, 0) / data.count;
      
      return {
        name,
        count: data.count,
        cbMarketCap: data.cbMarketCap,
        percentage: (data.cbMarketCap / totalCBMarketCap) * 100,
        equityMarketCap: data.equityMarketCap,
        avgDelta,
        avgPrime,
        avgParity,
        avgYTM,
        avgBondFloor,
        bonds: data.bonds,
      };
    }).sort((a, b) => b.cbMarketCap - a.cbMarketCap);
  }, [primaryDimension]);

  // Cross-filter data if secondary dimension is available
  const crossFilterData = useMemo(() => {
    if (getAvailableSecondaryDimensions(primaryDimension).length === 0) {
      return [];
    }

    const aggregated: { [key: string]: {
      count: number;
      cbMarketCap: number;
      bonds: ConvertibleBond[];
    } } = {};
    
    mockConvertibleBonds.forEach((bond) => {
      const primaryKey = getDimensionValue(bond, primaryDimension);
      const secondaryKey = getDimensionValue(bond, secondaryDimension);
      const key = `${primaryKey}|${secondaryKey}`;
      
      if (!aggregated[key]) {
        aggregated[key] = { count: 0, cbMarketCap: 0, bonds: [] };
      }
      aggregated[key].count += 1;
      aggregated[key].cbMarketCap += bond.outstandingAmount || 0;
      aggregated[key].bonds.push(bond);
    });

    return Object.entries(aggregated).map(([key, data]) => {
      const [primary, secondary] = key.split('|');
      const avgDelta = data.bonds.reduce((sum, b) => sum + b.delta, 0) / data.count;
      
      return {
        primary,
        secondary,
        value: data.count,
        marketCap: data.cbMarketCap,
        avgMetric: avgDelta,
      };
    });
  }, [primaryDimension, secondaryDimension]);

  const CHART_COLORS = [
    colors.chartColors.blue,
    colors.chartColors.cyan,
    colors.chartColors.green,
    colors.chartColors.purple,
    colors.chartColors.orange,
    colors.chartColors.pink,
  ];

  const dimensions: { value: Dimension; label: string }[] = [
    { value: 'sector', label: 'Sector' },
    { value: 'maturity', label: 'Maturity Bucket' },
    { value: 'size', label: 'Market Cap Size' },
    { value: 'rating', label: 'Credit Rating' },
    { value: 'profile', label: 'Bond Profile' },
    { value: 'features', label: 'Features' },
    { value: 'performances', label: 'Performances' },
    { value: 'performance_allocation', label: 'Performance Allocation' },
  ];

  const availableSecondaryDimensions = getAvailableSecondaryDimensions(primaryDimension);

  return (
    <View
      style={{
        backgroundColor: colors.background,
        minHeight: '100vh',
        flex: 1,
      }}
    >
      {/* Fixed Header */}
      <DashboardHeader 
        title={t('dashboard.aggregations')}
        description={t('dashboard.aggregations_desc')}
      />
      
      <View
        style={{
          flex: 1,
          marginLeft: isCollapsed ? 80 : 280,
          height: '100vh',
          overflow: 'auto' as any,
          backgroundColor: colors.background,
        }}
      >
        <View style={{ gap: 32, paddingBottom: 40, paddingHorizontal: 24, paddingTop: 100 }}>

          {/* Dimension Selectors */}
          <AnimatedCard delay={0.2} enableHover={false}>
            <View style={{ gap: 24 }}>
              <View style={{ flexDirection: 'row', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, minWidth: 250, gap: 8 }}>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontSize: parseInt(typography.fontSize.default),
                      fontWeight: '600',
                      fontFamily: typography.fontFamily.body,
                    }}
                  >
                    {t('dimension.primary')}
                  </Text>
                  <select
                    value={primaryDimension}
                    onChange={(e) => setPrimaryDimension(e.target.value as Dimension)}
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

                {availableSecondaryDimensions.length > 0 && (
                  <View style={{ flex: 1, minWidth: 250, gap: 8 }}>
                    <Text
                      style={{
                        color: colors.textPrimary,
                        fontSize: parseInt(typography.fontSize.default),
                        fontWeight: '600',
                        fontFamily: typography.fontFamily.body,
                      }}
                    >
                      {t('dimension.secondary_cross_filter')}
                    </Text>
                    <select
                      value={secondaryDimension}
                      onChange={(e) => setSecondaryDimension(e.target.value as Dimension)}
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
                      {availableSecondaryDimensions.map((dimValue) => {
                        const dim = dimensions.find(d => d.value === dimValue);
                        return dim ? (
                          <option key={dim.value} value={dim.value}>
                            {dim.label}
                          </option>
                        ) : null;
                      })}
                    </select>
                  </View>
                )}

                <View style={{ flex: 1, minWidth: 250, gap: 8 }}>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontSize: parseInt(typography.fontSize.default),
                      fontWeight: '600',
                      fontFamily: typography.fontFamily.body,
                    }}
                  >
                    View Mode
                  </Text>
                  <button
                    onClick={() => setShowDetailedMetrics(!showDetailedMetrics)}
                    style={{
                      padding: 12,
                      backgroundColor: showDetailedMetrics ? colors.accent : colors.surfaceCard,
                      color: showDetailedMetrics ? '#fff' : colors.textPrimary,
                      border: `1px solid ${colors.border}`,
                      borderRadius: parseInt(colors.borderRadius.medium),
                      fontSize: typography.fontSize.default,
                      fontFamily: typography.fontFamily.body,
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {showDetailedMetrics ? '📊 Detailed Metrics' : '📈 Simple View'}
                  </button>
                </View>
              </View>

              {availableSecondaryDimensions.length === 0 ? (
                <View style={{
                  padding: 12,
                  backgroundColor: colors.surfaceElev,
                  borderRadius: parseInt(colors.borderRadius.medium),
                  borderLeft: `4px solid ${colors.chartColors.orange}`,
                }}>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: parseInt(typography.fontSize.small),
                      fontStyle: 'italic',
                    }}
                  >
                    ⚠️ No cross-filter available for {dimensions.find((d) => d.value === primaryDimension)?.label}
                  </Text>
                </View>
              ) : (
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: parseInt(typography.fontSize.small),
                    fontStyle: 'italic',
                  }}
                >
                  Showing: "{dimensions.find((d) => d.value === primaryDimension)?.label}" breakdown with cross-filter by{' '}
                  "{dimensions.find((d) => d.value === secondaryDimension)?.label}"
                </Text>
              )}
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
                      if (name === 'cbMarketCap') {
                        return [formatLargeNumber(value), 'CB Market Cap (EUR)'];
                      }
                      return [value, 'Count'];
                    }}
                  />
                  <Bar dataKey="count" name="Count" radius={[4, 4, 0, 0]}>
                    {primaryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </View>
          </AnimatedCard>

          {/* Enhanced Metrics Table */}
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
                {showDetailedMetrics ? 'Detailed Breakdown' : 'Summary Table'}
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
                          position: 'sticky' as any,
                          left: 0,
                          backgroundColor: colors.surface,
                          zIndex: 10,
                        }}
                      >
                        {dimensions.find((d) => d.value === primaryDimension)?.label}
                      </th>
                      <th style={{ padding: 12, textAlign: 'right', color: colors.textPrimary, fontWeight: '600', borderBottom: `2px solid ${colors.border}` }}>
                        CB Market Cap
                      </th>
                      <th style={{ padding: 12, textAlign: 'right', color: colors.textPrimary, fontWeight: '600', borderBottom: `2px solid ${colors.border}` }}>
                        %
                      </th>
                      <th style={{ padding: 12, textAlign: 'right', color: colors.textPrimary, fontWeight: '600', borderBottom: `2px solid ${colors.border}` }}>
                        NB
                      </th>
                      <th style={{ padding: 12, textAlign: 'right', color: colors.textPrimary, fontWeight: '600', borderBottom: `2px solid ${colors.border}` }}>
                        Equity Market Cap
                      </th>
                      {showDetailedMetrics && (
                        <>
                          <th style={{ padding: 12, textAlign: 'right', color: colors.textPrimary, fontWeight: '600', borderBottom: `2px solid ${colors.border}` }}>
                            Avg Prime %
                          </th>
                          <th style={{ padding: 12, textAlign: 'right', color: colors.textPrimary, fontWeight: '600', borderBottom: `2px solid ${colors.border}` }}>
                            Avg Parity %
                          </th>
                          <th style={{ padding: 12, textAlign: 'right', color: colors.textPrimary, fontWeight: '600', borderBottom: `2px solid ${colors.border}` }}>
                            Avg YTM
                          </th>
                          <th style={{ padding: 12, textAlign: 'right', color: colors.textPrimary, fontWeight: '600', borderBottom: `2px solid ${colors.border}` }}>
                            Bond Floor %
                          </th>
                          <th style={{ padding: 12, textAlign: 'right', color: colors.textPrimary, fontWeight: '600', borderBottom: `2px solid ${colors.border}` }}>
                            Delta
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {primaryData.map((item, index) => (
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
                        <td 
                          style={{ 
                            padding: 12, 
                            color: colors.textPrimary, 
                            fontWeight: '600',
                            position: 'sticky' as any,
                            left: 0,
                            backgroundColor: 'inherit',
                            zIndex: 1,
                          }}
                        >
                          {item.name}
                        </td>
                        <td style={{ padding: 12, textAlign: 'right', color: colors.textPrimary }}>
                          {formatLargeNumber(item.cbMarketCap)}
                        </td>
                        <td style={{ padding: 12, textAlign: 'right', color: colors.textSecondary }}>
                          {item.percentage.toFixed(1)}%
                        </td>
                        <td style={{ padding: 12, textAlign: 'right', color: colors.textPrimary }}>
                          {item.count}
                        </td>
                        <td style={{ padding: 12, textAlign: 'right', color: colors.textSecondary }}>
                          {formatLargeNumber(item.equityMarketCap)}
                        </td>
                        {showDetailedMetrics && (
                          <>
                            <td style={{ padding: 12, textAlign: 'right', color: colors.textPrimary }}>
                              {item.avgPrime.toFixed(1)}%
                            </td>
                            <td style={{ padding: 12, textAlign: 'right', color: colors.textPrimary }}>
                              {item.avgParity.toFixed(1)}%
                            </td>
                            <td style={{ padding: 12, textAlign: 'right', color: colors.textPrimary }}>
                              {item.avgYTM.toFixed(2)}%
                            </td>
                            <td style={{ padding: 12, textAlign: 'right', color: colors.textPrimary }}>
                              {item.avgBondFloor.toFixed(1)}%
                            </td>
                            <td style={{ padding: 12, textAlign: 'right', color: colors.textPrimary }}>
                              {item.avgDelta.toFixed(3)}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </View>
            </View>
          </AnimatedCard>

          {/* Cross-Filter Summary Table */}
          {availableSecondaryDimensions.length > 0 && crossFilterData.length > 0 && (
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
                  Cross-Filter Analysis: {dimensions.find((d) => d.value === primaryDimension)?.label} × {dimensions.find((d) => d.value === secondaryDimension)?.label}
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
                          <td style={{ padding: 12, color: colors.textPrimary, fontWeight: '600' }}>{item.primary}</td>
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
          )}

          {/* Validation Matrix Info */}
          <AnimatedCard delay={0.6} enableHover={false}>
            <View style={{ gap: 16 }}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: parseInt(typography.fontSize.large),
                  fontWeight: '600',
                  fontFamily: typography.fontFamily.heading,
                }}
              >
                Dimension Compatibility Matrix
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
                        Primary \ Secondary
                      </th>
                      {dimensions.map((dim) => (
                        <th
                          key={dim.value}
                          style={{
                            padding: 12,
                            textAlign: 'center',
                            color: colors.textPrimary,
                            fontWeight: '600',
                            borderBottom: `2px solid ${colors.border}`,
                            fontSize: parseInt(typography.fontSize.small) - 1,
                          }}
                        >
                          {dim.label.split(' ')[0]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dimensions.map((primaryDim) => (
                      <tr key={primaryDim.value}>
                        <td
                          style={{
                            padding: 12,
                            color: colors.textPrimary,
                            fontWeight: '600',
                            borderBottom: `1px solid ${colors.border}`,
                          }}
                        >
                          {primaryDim.label}
                        </td>
                        {dimensions.map((secondaryDim) => {
                          const isAllowed = isCombinationAllowed(primaryDim.value, secondaryDim.value);
                          const isSelf = primaryDim.value === secondaryDim.value;
                          
                          return (
                            <td
                              key={secondaryDim.value}
                              style={{
                                padding: 12,
                                textAlign: 'center',
                                borderBottom: `1px solid ${colors.border}`,
                                backgroundColor: isSelf 
                                  ? colors.surface 
                                  : isAllowed 
                                    ? `${colors.chartColors.green}20` 
                                    : `${colors.chartColors.orange}20`,
                                color: isSelf 
                                  ? colors.muted 
                                  : isAllowed 
                                    ? colors.chartColors.green 
                                    : colors.chartColors.orange,
                                fontWeight: '600',
                              }}
                            >
                              {isSelf ? '-' : isAllowed ? '✓' : '✗'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </View>
              
              <View style={{ flexDirection: 'row', gap: 24, flexWrap: 'wrap' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: `${colors.chartColors.green}20`,
                      border: `2px solid ${colors.chartColors.green}`,
                      borderRadius: 4,
                    }}
                  />
                  <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small) }}>
                    Allowed Combination
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: `${colors.chartColors.orange}20`,
                      border: `2px solid ${colors.chartColors.orange}`,
                      borderRadius: 4,
                    }}
                  />
                  <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small) }}>
                    Not Allowed
                  </Text>
                </View>
              </View>
            </View>
          </AnimatedCard>
        </View>
      </View>
      
      {/* AI Agent Bubble */}
      <AIAgentBubble />
    </View>
  );
};

