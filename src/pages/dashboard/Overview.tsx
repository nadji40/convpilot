import React, { useEffect, useState } from 'react';
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
  const [activePerformancePeriod, setActivePerformancePeriod] = useState<'1D' | '1M' | '3M' | 'YTD'>('1D');

  // Calculate metrics - performances are calculated using formulas from calcs.md
  // Performance = (P_current / P_start - 1) × 100
  const marketSummary = calculateMarketSummary(mockConvertibleBonds);
  const portfolioMetrics = calculatePortfolioMetrics(mockConvertibleBonds);
  const sectorData = aggregateBySector(mockConvertibleBonds);
  const ratingData = aggregateByRating(mockConvertibleBonds);
  const maturityData = aggregateByMaturity(mockConvertibleBonds);
  const profileData = aggregateByProfile(mockConvertibleBonds);

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
                title={t('kpi.portfolio_value')}
                value={formatLargeNumber(portfolioMetrics.totalNotional)}
                subtitle={t('kpi.subtitle_eur')}
                delay={getStaggerDelay(0)}
              />
              <KPICard
                title={t('kpi.portfolio_delta')}
                value={(portfolioMetrics.portfolioDelta * 100).toFixed(2) + '%'}
                subtitle={t('kpi.subtitle_equity_exposure')}
                delay={getStaggerDelay(1)}
              />
              <KPICard
                title={t('kpi.avg_ytm')}
                value={portfolioMetrics.avgYTM.toFixed(2) + '%'}
                subtitle={t('kpi.subtitle_yield_to_maturity')}
                delay={getStaggerDelay(2)}
              />
              <KPICard
                title={t('kpi.avg_implied_vol')}
                value={portfolioMetrics.avgImpliedVol.toFixed(1) + '%'}
                subtitle={t('kpi.subtitle_balanced_profile')}
                delay={getStaggerDelay(3)}
              />
              <KPICard
                title={t('kpi.portfolio_vega')}
                value={portfolioMetrics.portfolioVega.toFixed(4)}
                subtitle={t('kpi.subtitle_vol_sensitivity')}
                delay={getStaggerDelay(4)}
              />
              <KPICard
                title={t('kpi.portfolio_gamma')}
                value={portfolioMetrics.portfolioGamma.toFixed(4)}
                subtitle={t('kpi.subtitle_convexity')}
                delay={getStaggerDelay(5)}
              />
              <KPICard
                title={t('kpi.avg_prime')}
                value={portfolioMetrics.avgPrime.toFixed(2) + '%'}
                subtitle={t('kpi.subtitle_conversion_premium')}
                delay={getStaggerDelay(6)}
              />
              <KPICard
                title={t('kpi.avg_duration')}
                value={portfolioMetrics.avgDuration.toFixed(2)}
                subtitle={t('kpi.subtitle_interest_rate_risk')}
                delay={getStaggerDelay(7)}
              />
              <KPICard
                title={t('kpi.avg_credit_spread')}
                value={portfolioMetrics.avgCreditSpread.toFixed(0) + ' bps'}
                subtitle={t('kpi.subtitle_bond_profile')}
                delay={getStaggerDelay(8)}
              />
              <KPICard
                title="Avg Vol Spread"
                value={portfolioMetrics.avgVolSpread !== null ? portfolioMetrics.avgVolSpread.toFixed(2) + '%' : 'N/A'}
                subtitle={`${portfolioMetrics.countBalancedBonds} bonds (vega > 0.25)`}
                delay={getStaggerDelay(9)}
              />
              <KPICard
                title="Vol Spread Std Dev"
                value={portfolioMetrics.stdDevVolSpread !== null ? portfolioMetrics.stdDevVolSpread.toFixed(2) + '%' : 'N/A'}
                subtitle="Volatility spread deviation"
                delay={getStaggerDelay(10)}
              />
            </View>
          </WidgetContainer>

          {/* Top and Worst Performers */}
          <WidgetContainer id="overview-performers" title={t('widget.top_worst_performers')} storageKey="overviewWidgets">
            <AnimatedCard delay={0.4} enableHover={false}>
              <View style={{ gap: 20 }}>
                {/* Tabs */}
                <View style={{ 
                  flexDirection: 'row', 
                  gap: 8,
                  borderBottom: `1px solid ${colors.border}`,
                  paddingBottom: 8,
                }}>
                  {(['1D', '1M', '3M', 'YTD'] as const).map((period) => (
                    <View
                      key={period}
                      onClick={() => setActivePerformancePeriod(period)}
                      style={{
                        padding: '8px 20px',
                        borderRadius: `${parseInt(colors.borderRadius.medium)}px ${parseInt(colors.borderRadius.medium)}px 0 0`,
                        backgroundColor: activePerformancePeriod === period ? colors.accent + '20' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        borderBottom: activePerformancePeriod === period ? `2px solid ${colors.accent}` : '2px solid transparent',
                      }}
                    >
                      <Text
                        style={{
                          color: activePerformancePeriod === period ? colors.accent : colors.textSecondary,
                          fontSize: parseInt(typography.fontSize.medium),
                          fontWeight: activePerformancePeriod === period ? '700' : '500',
                          fontFamily: typography.fontFamily.body,
                        }}
                      >
                        {period}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Content for active tab */}
                {(() => {
                  const period = activePerformancePeriod;
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
                          {t('widget.top_3')}
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
                          {t('widget.worst_3')}
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
                  );
                })()}
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

