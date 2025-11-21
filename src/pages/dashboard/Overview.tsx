import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { darkColors, lightColors, typography } from '../../theme';
import { useTheme, useSidebar, useLanguage } from '../../contexts/AppContext';
import { KPICard } from '../../components/KPICard';
import { AnimatedCard } from '../../components/AnimatedCard';
import { WidgetContainer } from '../../components/WidgetContainer';
import { DashboardHeader } from '../../components/DashboardHeader';
import { AIAgentBubble } from '../../components/AIAgentBubble';
import { 
  mockConvertibleBonds
} from '../../data/mockData';
import { 
  calculateMarketSummary,
  aggregateBySector,
  aggregateByRating,
  aggregateByMaturity,
  aggregateByProfile,
  formatLargeNumber, 
  formatPercentage,
  calculatePortfolioMetrics,
  calculatePortfolioAttribution,
} from '../../utils/dataUtils';
import { getStaggerDelay } from '../../utils/animations';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';

export const Overview: React.FC = () => {
  const { isDark } = useTheme();
  const { isCollapsed } = useSidebar();
  const { t } = useLanguage();
  const colors = isDark ? darkColors : lightColors;

  const marketSummary = calculateMarketSummary(mockConvertibleBonds);
  const portfolioMetrics = calculatePortfolioMetrics(mockConvertibleBonds);
  const portfolioAttribution = calculatePortfolioAttribution(mockConvertibleBonds);
  const sectorData = aggregateBySector(mockConvertibleBonds);
  const ratingData = aggregateByRating(mockConvertibleBonds);
  const maturityData = aggregateByMaturity(mockConvertibleBonds);
  const profileData = aggregateByProfile(mockConvertibleBonds);

  // Performance attribution data for waterfall chart
  const attributionData = [
    { name: 'Share', value: portfolioAttribution.shareContrib, fill: colors.chartColors.blue },
    { name: 'Credit Spread', value: portfolioAttribution.creditSpreadContrib, fill: colors.chartColors.green },
    { name: 'Carry', value: portfolioAttribution.carryContrib, fill: colors.chartColors.purple },
    { name: 'Rate', value: portfolioAttribution.rateContrib, fill: colors.chartColors.orange },
    { name: 'Valuation', value: portfolioAttribution.valuation, fill: colors.chartColors.pink },
    { name: 'FX', value: portfolioAttribution.fxContrib, fill: colors.chartColors.cyan },
    { name: 'Delta Neutral', value: portfolioAttribution.deltaNeutral, fill: colors.chartColors.yellow },
  ];

  // Apply theme class to body for scrollbar styling
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.className = isDark ? '' : 'light-theme';
    }
  }, [isDark]);

  const CHART_COLORS = [
    colors.chartColors.blue,
    colors.chartColors.cyan,
    colors.chartColors.green,
    colors.chartColors.purple,
    colors.chartColors.orange,
    colors.chartColors.pink,
  ];

  return (
    <View style={{
      backgroundColor: colors.background,
      minHeight: '100vh',
      flex: 1,
    }}>
      {/* Fixed Header */}
      <DashboardHeader 
        title={t('dashboard.overview')}
        description={t('dashboard.overview_desc')}
      />
      
      <View
        style={{
          flex: 1,
          marginLeft: isCollapsed ? 80 : 280,
          padding: 24,
          paddingTop: 100, // Add padding for fixed header
          height: '100vh',
          overflow: 'auto' as any,
          backgroundColor: colors.background,
        }}
      >
        <ScrollView
          style={{ flex: 1, height: '100%' }}
          contentContainerStyle={{ gap: 32, paddingBottom: 40 }}
        >
          {/* KPI Cards - Enhanced with Portfolio Metrics */}
          <WidgetContainer id="overview-kpis" storageKey="overviewWidgets">
            <View
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 20,
              }}
            >
              <KPICard
                title="Portfolio Value"
                value={formatLargeNumber(portfolioMetrics.totalNotional)}
                subtitle="EUR"
                delay={getStaggerDelay(0)}
              />
              <KPICard
                title="Daily P&L"
                value={formatPercentage(portfolioAttribution.totalPerformance, 3)}
                trend={portfolioAttribution.totalPerformance}
                subtitle="vs Yesterday"
                delay={getStaggerDelay(1)}
              />
              <KPICard
                title="Portfolio Delta"
                value={(portfolioMetrics.portfolioDelta * 100).toFixed(2) + '%'}
                subtitle="Equity Exposure"
                delay={getStaggerDelay(2)}
              />
              <KPICard
                title="Avg YTM"
                value={portfolioMetrics.avgYTM.toFixed(2) + '%'}
                subtitle="Yield to Maturity"
                delay={getStaggerDelay(3)}
              />
              <KPICard
                title="Avg Implied Vol"
                value={portfolioMetrics.avgImpliedVol.toFixed(1) + '%'}
                subtitle="Balanced Profile"
                delay={getStaggerDelay(4)}
              />
              <KPICard
                title="Portfolio Vega"
                value={portfolioMetrics.portfolioVega.toFixed(4)}
                subtitle="Vol Sensitivity"
                delay={getStaggerDelay(5)}
              />
              <KPICard
                title="Portfolio Gamma"
                value={portfolioMetrics.portfolioGamma.toFixed(4)}
                subtitle="Convexity"
                delay={getStaggerDelay(6)}
              />
              <KPICard
                title="Avg Prime"
                value={portfolioMetrics.avgPrime.toFixed(2) + '%'}
                subtitle="Conversion Premium"
                delay={getStaggerDelay(7)}
              />
              <KPICard
                title="Avg Duration"
                value={portfolioMetrics.avgDuration.toFixed(2)}
                subtitle="Interest Rate Risk"
                delay={getStaggerDelay(8)}
              />
              <KPICard
                title="Avg Credit Spread"
                value={portfolioMetrics.avgCreditSpread.toFixed(0) + ' bps'}
                subtitle="Bond Profile"
                delay={getStaggerDelay(9)}
              />
            </View>
          </WidgetContainer>

          {/* Performance Attribution - Waterfall Chart */}
          <WidgetContainer id="overview-attribution" title="Daily Performance Attribution" storageKey="overviewWidgets">
            <AnimatedCard delay={0.3} enableHover={false}>
              <View style={{ gap: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: parseInt(typography.fontSize.small),
                      fontFamily: typography.fontFamily.body,
                    }}
                  >
                    Breakdown of Daily P&L Sources
                  </Text>
                  <View style={{ 
                    backgroundColor: portfolioAttribution.totalPerformance >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    padding: 8,
                    borderRadius: 6,
                  }}>
                    <Text style={{ 
                      color: portfolioAttribution.totalPerformance >= 0 ? colors.success : colors.danger,
                      fontSize: parseInt(typography.fontSize.medium),
                      fontWeight: '700',
                    }}>
                      Total: {formatPercentage(portfolioAttribution.totalPerformance, 3)}
                    </Text>
                  </View>
                </View>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attributionData} margin={{ left: 20, right: 20, top: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.muted} opacity={0.3} />
                    <XAxis 
                      dataKey="name" 
                      stroke={colors.muted}
                      tick={{ fill: colors.textSecondary, fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      stroke={colors.muted} 
                      tick={{ fill: colors.textSecondary, fontSize: 12 }}
                      tickFormatter={(value) => `${value.toFixed(2)}%`}
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
                      formatter={(value: any) => [`${value.toFixed(3)}%`, 'Contribution']}
                    />
                    <Bar 
                      dataKey="value" 
                      radius={[4, 4, 0, 0]}
                    >
                      {attributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </View>
            </AnimatedCard>
          </WidgetContainer>

          {/* Top and Worst Performers */}
          <WidgetContainer id="overview-performers" title="Top & Worst Performers" storageKey="overviewWidgets">
            <AnimatedCard delay={0.4} enableHover={false}>
              <View style={{ gap: 24 }}>
                {['1D', '1M', '3M', 'YTD'].map((period, periodIdx) => {
                  // Get performance field based on period
                  const perfField = period === '1D' ? 'performance1D' :
                                   period === '1M' ? 'performance1M' :
                                   period === '3M' ? 'performance3M' : 'performanceYTD';
                  
                  // Filter out null values and sort
                  const validBonds = mockConvertibleBonds
                    .filter(bond => bond[perfField] !== null && bond[perfField] !== undefined)
                    .sort((a, b) => (b[perfField] as number) - (a[perfField] as number));
                  
                  const topBonds = validBonds.slice(0, 3);
                  const worstBonds = validBonds.slice(-3).reverse();
                  
                  return (
                    <View key={period} style={{ gap: 12 }}>
                      <Text
                        style={{
                          color: colors.textPrimary,
                          fontSize: parseInt(typography.fontSize.medium),
                          fontWeight: '600',
                          fontFamily: typography.fontFamily.heading,
                        }}
                      >
                        {period} Performance
                      </Text>
                      
                      <View
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: 16,
                        }}
                      >
                        {/* Top 3 */}
                        <View style={{ gap: 8 }}>
                          <Text
                            style={{
                              color: colors.success,
                              fontSize: parseInt(typography.fontSize.small),
                              fontWeight: '600',
                            }}
                          >
                            Top 3
                          </Text>
                          {topBonds.map((bond, idx) => (
                            <View
                              key={bond.isin}
                              style={{
                                backgroundColor: colors.surfaceCard,
                                padding: 12,
                                borderRadius: parseInt(colors.borderRadius.medium),
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <View style={{ flex: 1 }}>
                                <Text
                                  style={{
                                    color: colors.textPrimary,
                                    fontSize: parseInt(typography.fontSize.small),
                                    fontWeight: '600',
                                  }}
                                >
                                  {bond.issuer}
                                </Text>
                                <Text
                                  style={{
                                    color: colors.textSecondary,
                                    fontSize: parseInt(typography.fontSize.xsmall),
                                  }}
                                >
                                  {bond.isin}
                                </Text>
                              </View>
                              <Text
                                style={{
                                  color: colors.success,
                                  fontSize: parseInt(typography.fontSize.medium),
                                  fontWeight: '700',
                                }}
                              >
                                {formatPercentage(bond[perfField] as number, 2)}
                              </Text>
                            </View>
                          ))}
                        </View>

                        {/* Worst 3 */}
                        <View style={{ gap: 8 }}>
                          <Text
                            style={{
                              color: colors.danger,
                              fontSize: parseInt(typography.fontSize.small),
                              fontWeight: '600',
                            }}
                          >
                            Worst 3
                          </Text>
                          {worstBonds.map((bond, idx) => (
                            <View
                              key={bond.isin}
                              style={{
                                backgroundColor: colors.surfaceCard,
                                padding: 12,
                                borderRadius: parseInt(colors.borderRadius.medium),
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <View style={{ flex: 1 }}>
                                <Text
                                  style={{
                                    color: colors.textPrimary,
                                    fontSize: parseInt(typography.fontSize.small),
                                    fontWeight: '600',
                                  }}
                                >
                                  {bond.issuer}
                                </Text>
                                <Text
                                  style={{
                                    color: colors.textSecondary,
                                    fontSize: parseInt(typography.fontSize.xsmall),
                                  }}
                                >
                                  {bond.isin}
                                </Text>
                              </View>
                              <Text
                                style={{
                                  color: colors.danger,
                                  fontSize: parseInt(typography.fontSize.medium),
                                  fontWeight: '700',
                                }}
                              >
                                {formatPercentage(bond[perfField] as number, 2)}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </AnimatedCard>
          </WidgetContainer>

          {/* Breakdown Charts */}
          <View
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: 24,
            }}
          >
            {/* Sector Breakdown */}
            <WidgetContainer id="overview-sector" title={t('widget.sector_breakdown')} storageKey="overviewWidgets">
              <AnimatedCard delay={0.5} enableHover={false}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name.split(' ')[0]} (${(percent * 100).toFixed(0)}%)`}
                      labelStyle={{ fontSize: '11px', fill: colors.textPrimary, fontWeight: '600' }}
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: colors.surfaceCard,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: colors.textPrimary }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </AnimatedCard>
            </WidgetContainer>

            {/* Rating Breakdown */}
            <WidgetContainer id="overview-rating" title={t('widget.credit_rating_breakdown')} storageKey="overviewWidgets">
              <AnimatedCard delay={0.6} enableHover={false}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={ratingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      label={({ value }) => `${value}`}
                      labelStyle={{ fontSize: '14px', fill: colors.textPrimary, fontWeight: '700' }}
                    >
                      {ratingData.map((entry, index) => (
                        <Cell key={`c-${index}`} fill={CHART_COLORS[(index + 2) % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: colors.surfaceCard,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: colors.textPrimary }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </AnimatedCard>
            </WidgetContainer>

            {/* Maturity Breakdown */}
            <WidgetContainer id="overview-maturity" title={t('widget.maturity_breakdown')} storageKey="overviewWidgets">
              <AnimatedCard delay={0.7} enableHover={false}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={maturityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelStyle={{ fontSize: '12px', fill: colors.textPrimary, fontWeight: '600' }}
                    >
                      {maturityData.map((entry, index) => (
                        <Cell key={`m-${index}`} fill={CHART_COLORS[(index + 3) % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: colors.surfaceCard,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: colors.textPrimary }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </AnimatedCard>
            </WidgetContainer>

            {/* Profile Breakdown */}
            <WidgetContainer id="overview-profile" title={t('widget.profile_breakdown')} storageKey="overviewWidgets">
              <AnimatedCard delay={0.8} enableHover={false}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={profileData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelStyle={{ fontSize: '11px', fill: colors.textPrimary, fontWeight: '600' }}
                    >
                      {profileData.map((entry, index) => (
                        <Cell key={`p-${index}`} fill={CHART_COLORS[(index + 1) % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: colors.surfaceCard,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: colors.textPrimary }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </AnimatedCard>
            </WidgetContainer>
          </View>
        </ScrollView>
      </View>
      
      {/* AI Agent Bubble */}
      <AIAgentBubble />
    </View>
  );
};

