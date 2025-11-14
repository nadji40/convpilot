import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { darkColors, lightColors, typography } from '../../theme';
import { useTheme, useSidebar } from '../../contexts/AppContext';
import { DashboardHeader } from '../../components/DashboardHeader';
import { ChartCard } from '../../components/ChartCard';
import { KPICard } from '../../components/KPICard';
import { DataTable } from '../../components/DataTable';
import { AIAgentBubble } from '../../components/AIAgentBubble';
import { AnimatedCard } from '../../components/AnimatedCard';
import { mockConvertibleBonds } from '../../data/mockData';
import { 
  calculatePortfolioAttribution, 
  formatPercentage,
  formatLargeNumber,
} from '../../utils/dataUtils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from 'recharts';

export const PerformanceAttribution: React.FC = () => {
  const { isDark } = useTheme();
  const { isCollapsed } = useSidebar();
  const colors = isDark ? darkColors : lightColors;
  const [selectedPeriod, setSelectedPeriod] = useState<'1D' | '1W' | '1M' | '3M' | 'YTD'>('1D');

  // Apply theme class to body for scrollbar styling
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.className = isDark ? '' : 'light-theme';
    }
  }, [isDark]);

  // Calculate real attribution data from bonds
  const portfolioAttribution = calculatePortfolioAttribution(mockConvertibleBonds);

  // Individual CB Performance with real data
  const cbPerformance = mockConvertibleBonds
    .filter(bond => bond.performance1D !== null)
    .map(bond => ({
      isin: bond.isin,
      issuer: bond.issuer,
      return: bond.performance1D || 0,
      contribution: bond.shareContrib || 0,
      weight: (bond.outstandingAmount / mockConvertibleBonds.reduce((sum, b) => sum + b.outstandingAmount, 0)) * 100,
      delta: bond.delta,
      trend: (bond.performance1D || 0) >= 0 ? 'up' as const : 'down' as const,
    }))
    .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
    .slice(0, 10);

  // Waterfall chart data for attribution
  const waterfallData = [
    { name: 'Share', value: portfolioAttribution.shareContrib, fill: colors.chartColors.blue },
    { name: 'Credit Spread', value: portfolioAttribution.creditSpreadContrib, fill: colors.chartColors.green },
    { name: 'Carry', value: portfolioAttribution.carryContrib, fill: colors.chartColors.purple },
    { name: 'Rate', value: portfolioAttribution.rateContrib, fill: colors.chartColors.orange },
    { name: 'Valuation', value: portfolioAttribution.valuation, fill: colors.chartColors.pink },
    { name: 'FX', value: portfolioAttribution.fxContrib, fill: colors.chartColors.cyan },
    { name: 'Delta Neutral', value: portfolioAttribution.deltaNeutral, fill: colors.chartColors.yellow },
  ];

  // Calculate cumulative values for waterfall effect
  let cumulative = 0;
  const waterfallWithCumulative = waterfallData.map((item, index) => {
    const start = cumulative;
    cumulative += item.value;
    return {
      ...item,
      start,
      end: cumulative,
      isPositive: item.value >= 0,
    };
  });

  const periodButtons = ['1D', '1W', '1M', '3M', 'YTD'] as const;

  return (
    <View style={{
      backgroundColor: colors.background,
      minHeight: '100vh',
      flex: 1,
    }}>
      {/* Fixed Header */}
      <DashboardHeader
        title="Performance Attribution"
        description="Daily P&L breakdown by source: Share, Credit, Carry, Rate, Valuation, FX, and Delta Neutral"
      />
      
      <View
        style={{
          flex: 1,
          marginLeft: isCollapsed ? 80 : 280,
          padding: 32,
          paddingTop: 100, // Add padding for fixed header
          height: '100vh',
          overflow: 'auto' as any,
          backgroundColor: colors.background,
        }}
      >
        <View
          style={{
            maxWidth: 1600,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '100%',
          }}
        >
          {/* Period Selection */}
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              marginBottom: 24,
              padding: 16,
              backgroundColor: colors.surface,
              borderRadius: parseInt(colors.borderRadius.large),
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
          <Text
            style={{
              fontSize: parseInt(typography.fontSize.default),
              fontWeight: '600',
              color: colors.textSecondary,
              fontFamily: typography.fontFamily.body,
              marginRight: 12,
              alignSelf: 'center',
            }}
          >
            Period:
          </Text>
          {periodButtons.map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setSelectedPeriod(period)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: parseInt(colors.borderRadius.medium),
                backgroundColor: selectedPeriod === period ? colors.accent : 'transparent',
                borderWidth: 1,
                borderColor: selectedPeriod === period ? colors.accent : colors.border,
                transition: 'all 0.3s ease',
              }}
            >
              <Text
                style={{
                  fontSize: parseInt(typography.fontSize.small),
                  fontWeight: selectedPeriod === period ? '600' : '400',
                  color: selectedPeriod === period ? '#ffffff' : colors.textSecondary,
                  fontFamily: typography.fontFamily.body,
                }}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Portfolio Performance KPIs */}
        <View
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 32,
          }}
        >
          <KPICard
            title="Total Performance"
            value={formatPercentage(portfolioAttribution.totalPerformance, 3)}
            trend={portfolioAttribution.totalPerformance >= 0 ? 'up' : 'down'}
            change={portfolioAttribution.totalPerformance}
            subtitle="Portfolio P&L"
          />
          <KPICard
            title="Share Contribution"
            value={formatPercentage(portfolioAttribution.shareContrib, 3)}
            trend={portfolioAttribution.shareContrib >= 0 ? 'up' : 'down'}
            change={portfolioAttribution.shareContrib}
            subtitle="Equity moves"
          />
          <KPICard
            title="Credit Spread"
            value={formatPercentage(portfolioAttribution.creditSpreadContrib, 3)}
            trend={portfolioAttribution.creditSpreadContrib >= 0 ? 'up' : 'down'}
            change={portfolioAttribution.creditSpreadContrib}
            subtitle="Spread tightening/widening"
          />
          <KPICard
            title="Carry"
            value={formatPercentage(portfolioAttribution.carryContrib, 3)}
            trend={portfolioAttribution.carryContrib >= 0 ? 'up' : 'down'}
            change={portfolioAttribution.carryContrib}
            subtitle="Accrued interest"
          />
        </View>

        {/* Waterfall Chart - Attribution Breakdown */}
        <View style={{ marginBottom: 32 }}>
          <AnimatedCard delay={0.2} enableHover={false}>
            <View style={{ gap: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text
                    style={{
                      fontSize: parseInt(typography.fontSize.large),
                      fontWeight: '700',
                      color: colors.textPrimary,
                      fontFamily: typography.fontFamily.heading,
                      marginBottom: 4,
                    }}
                  >
                    Performance Attribution Waterfall
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: parseInt(typography.fontSize.small),
                      fontFamily: typography.fontFamily.body,
                    }}
                  >
                    Breakdown of {selectedPeriod} P&L by contribution source
                  </Text>
                </View>
                <View style={{ 
                  backgroundColor: portfolioAttribution.totalPerformance >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  padding: 12,
                  borderRadius: 8,
                }}>
                  <Text style={{ 
                    color: portfolioAttribution.totalPerformance >= 0 ? colors.success : colors.danger,
                    fontSize: parseInt(typography.fontSize.large),
                    fontWeight: '700',
                    fontFamily: typography.fontFamily.heading,
                  }}>
                    Total: {formatPercentage(portfolioAttribution.totalPerformance, 3)}
                  </Text>
                </View>
              </View>

              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={waterfallData} margin={{ left: 20, right: 20, top: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.muted} opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    stroke={colors.muted}
                    tick={{ fill: colors.textSecondary, fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis 
                    stroke={colors.muted} 
                    tick={{ fill: colors.textSecondary, fontSize: 12 }}
                    tickFormatter={(value) => `${value.toFixed(3)}%`}
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
                    formatter={(value: any) => [`${value.toFixed(4)}%`, 'Contribution']}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]}
                  >
                    {waterfallData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Summary Table */}
              <View style={{ 
                backgroundColor: colors.surfaceCard,
                borderRadius: 8,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.border,
              }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
                  {waterfallData.map((item, index) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: 3,
                        backgroundColor: item.fill,
                      }} />
                      <Text style={{ 
                        color: colors.textSecondary, 
                        fontSize: parseInt(typography.fontSize.small),
                        fontFamily: typography.fontFamily.body,
                      }}>
                        {item.name}:
                      </Text>
                      <Text style={{ 
                        color: item.value >= 0 ? colors.success : colors.danger,
                        fontSize: parseInt(typography.fontSize.small),
                        fontWeight: '600',
                        fontFamily: typography.fontFamily.body,
                      }}>
                        {formatPercentage(item.value, 4)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Individual CB Performance Section */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: parseInt(typography.fontSize.h4),
              fontWeight: '700',
              color: colors.textPrimary,
              fontFamily: typography.fontFamily.heading,
              marginBottom: 16,
            }}
          >
            Top Contributors and Detractors
          </Text>

          <DataTable
            columns={[
              { key: 'isin', label: 'ISIN', width: '15%' },
              { key: 'issuer', label: 'Issuer', width: '25%' },
              { key: 'return', label: 'Return', width: '12%', align: 'right' },
              { key: 'contribution', label: 'Contribution', width: '15%', align: 'right' },
              { key: 'weight', label: 'Weight', width: '12%', align: 'right' },
              { key: 'delta', label: 'Delta', width: '12%', align: 'right' },
              { key: 'trend', label: 'Trend', width: '9%', align: 'center' },
            ]}
            data={cbPerformance.map(cb => ({
              ...cb,
              return: (
                <Text
                  style={{
                    color: cb.return >= 0 ? colors.success : colors.error,
                    fontWeight: '600',
                    fontFamily: typography.fontFamily.body,
                  }}
                >
                  {formatPercentage(cb.return, 3)}
                </Text>
              ),
              contribution: (
                <Text
                  style={{
                    color: cb.contribution >= 0 ? colors.success : colors.error,
                    fontWeight: '600',
                    fontFamily: typography.fontFamily.body,
                  }}
                >
                  {formatPercentage(cb.contribution, 3)}
                </Text>
              ),
              weight: `${cb.weight.toFixed(2)}%`,
              delta: `${(cb.delta * 100).toFixed(1)}%`,
              trend: (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: cb.trend === 'up' ? colors.success : colors.error,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                />
              ),
            }))}
            pageSize={10}
            enableSearch
            enableSort
          />
        </View>
      </View>
      
      {/* AI Agent Bubble */}
      <AIAgentBubble />
    </View>
  );
};
