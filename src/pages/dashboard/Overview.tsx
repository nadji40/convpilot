import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
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
import { ConvertibleBond } from '../../data/dataLoader';
import { 
  calculateMarketSummary,
  aggregateBySector,
  aggregateByRating,
  aggregateByMaturity,
  aggregateByProfile,
  formatLargeNumber, 
  formatPercentage,
  calculatePortfolioMetrics,
  calculatePortfolioHistory,
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
import { getTradingSignals } from '../../utils/dataUtils';

export const Overview: React.FC = () => {
  const { isDark } = useTheme();
  const { isCollapsed } = useSidebar();
  const { t } = useLanguage();
  const colors = isDark ? darkColors : lightColors;
  const [activePerformancePeriod, setActivePerformancePeriod] = useState<'1D' | '1M' | '3M' | 'YTD'>('1D');
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'signals'>('overview');
  
  // Portfolio selection state (persisted to localStorage)
  const [selectedISINs, setSelectedISINs] = useState<string[]>([]);

  // Apply theme class to body for scrollbar styling
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.className = isDark ? '' : 'light-theme';
    }
  }, [isDark]);

  // Load portfolio from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('portfolio-selection');
      if (stored) {
        try {
          setSelectedISINs(JSON.parse(stored));
        } catch (e) {
          console.error('Error loading portfolio:', e);
        }
      } else {
        // Default portfolio (first 5 bonds)
        const defaultSelection = mockConvertibleBonds.slice(0, 5).map((b) => b.isin);
        setSelectedISINs(defaultSelection);
        localStorage.setItem('portfolio-selection', JSON.stringify(defaultSelection));
      }
    }
  }, []);

  // Save portfolio to localStorage
  const updatePortfolio = (isins: string[]) => {
    setSelectedISINs(isins);
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio-selection', JSON.stringify(isins));
    }
  };

  // Toggle bond selection
  const toggleBond = (isin: string) => {
    if (selectedISINs.includes(isin)) {
      updatePortfolio(selectedISINs.filter((i) => i !== isin));
    } else {
      updatePortfolio([...selectedISINs, isin]);
    }
  };

  // Get portfolio bonds
  const portfolioBonds = useMemo(() => {
    return mockConvertibleBonds.filter((b) => selectedISINs.includes(b.isin));
  }, [selectedISINs]);

  // Calculate metrics - performances are calculated using formulas from calcs.md
  // Performance = (P_current / P_start - 1) × 100
  // All calculations now based on selected portfolio bonds
  const marketSummary = calculateMarketSummary(portfolioBonds);
  const portfolioMetrics = calculatePortfolioMetrics(portfolioBonds);
  const sectorData = aggregateBySector(portfolioBonds);
  const ratingData = aggregateByRating(portfolioBonds);
  const maturityData = aggregateByMaturity(portfolioBonds);
  const profileData = aggregateByProfile(portfolioBonds);
  
  // Calculate historical portfolio performance from REAL cbhist.json data
  const portfolioHistory = useMemo(() => {
    return calculatePortfolioHistory(portfolioBonds);
  }, [portfolioBonds]);

  const CHART_COLORS = [
    colors.chartColors.blue,
    colors.chartColors.cyan,
    colors.chartColors.green,
    colors.chartColors.purple,
    colors.chartColors.orange,
    colors.chartColors.pink,
  ];

  // Sector attribution for portfolio view
  const sectorAttribution = useMemo(() => {
    const attribution: { [key: string]: { marketCap: number; perf: number; contribution: number } } = {};
    
    portfolioBonds.forEach((bond) => {
      const sectors = bond.sectors || [bond.sector];
      sectors.forEach((sector) => {
        if (!attribution[sector]) {
          attribution[sector] = { marketCap: 0, perf: 0, contribution: 0 };
        }
        attribution[sector].marketCap += bond.outstandingAmount;
        attribution[sector].perf += bond.performance1M * bond.outstandingAmount;
      });
    });

    const totalMarketCap = portfolioBonds.reduce((sum, b) => sum + b.outstandingAmount, 0);

    return Object.entries(attribution).map(([name, data]) => ({
      name,
      marketCap: data.marketCap,
      contribution: totalMarketCap > 0 ? (data.perf / totalMarketCap) : 0,
      weight: totalMarketCap > 0 ? (data.marketCap / totalMarketCap) * 100 : 0,
    }));
  }, [portfolioBonds]);

  // Country attribution for portfolio view
  const countryAttribution = useMemo(() => {
    const attribution: { [key: string]: number } = {};
    
    portfolioBonds.forEach((bond) => {
      if (!attribution[bond.country]) {
        attribution[bond.country] = 0;
      }
      attribution[bond.country] += bond.outstandingAmount;
    });

    const totalMarketCap = portfolioBonds.reduce((sum, b) => sum + b.outstandingAmount, 0);

    return Object.entries(attribution).map(([name, value]) => ({
      name,
      value: totalMarketCap > 0 ? (value / totalMarketCap) * 100 : 0,
    }));
  }, [portfolioBonds]);

  // Trading signals for portfolio bonds (from calcs.md)
  const tradingSignals = useMemo(() => {
    return getTradingSignals(portfolioBonds);
  }, [portfolioBonds]);

  return (
    <View style={{
      backgroundColor: colors.background,
      minHeight: '100vh',
      flex: 1,
    }}>
      {/* Fixed Header */}
      <DashboardHeader 
        title={t('dashboard.overview')}
        description={`${portfolioBonds.length} bonds - ${formatLargeNumber(portfolioMetrics.totalNotional)}`}
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
        {/* Professional Centered Tabs */}
        <View style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 32,
        }}>
          <View style={{
            display: 'inline-flex',
            flexDirection: 'row',
            gap: 16,
            backgroundColor: colors.surface,
            padding: 6,
            borderRadius: parseInt(colors.borderRadius.large),
            boxShadow: `0 2px 8px ${colors.shadow}`,
            border: `1px solid ${colors.border}`,
          }}>
            <TouchableOpacity
              onPress={() => setActiveTab('overview')}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 32,
                borderRadius: parseInt(colors.borderRadius.medium),
                backgroundColor: activeTab === 'overview' ? colors.accent : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: 160,
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: activeTab === 'overview' ? `0 4px 12px ${colors.accent}40` : 'none',
                transform: activeTab === 'overview' ? 'translateY(-2px)' : 'translateY(0)',
              }}
            >
              <Text
                style={{
                  color: activeTab === 'overview' ? '#FFFFFF' : colors.textSecondary,
                  fontSize: parseInt(typography.fontSize.medium),
                  fontWeight: '700',
                  fontFamily: typography.fontFamily.body,
                  textAlign: 'center',
                }}
              >
                Overview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('portfolio')}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 32,
                borderRadius: parseInt(colors.borderRadius.medium),
                backgroundColor: activeTab === 'portfolio' ? colors.accent : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: 160,
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: activeTab === 'portfolio' ? `0 4px 12px ${colors.accent}40` : 'none',
                transform: activeTab === 'portfolio' ? 'translateY(-2px)' : 'translateY(0)',
              }}
            >
              <Text
                style={{
                  color: activeTab === 'portfolio' ? '#FFFFFF' : colors.textSecondary,
                  fontSize: parseInt(typography.fontSize.medium),
                  fontWeight: '700',
                  fontFamily: typography.fontFamily.body,
                  textAlign: 'center',
                }}
              >
                Portfolio Selection
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('signals')}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 32,
                borderRadius: parseInt(colors.borderRadius.medium),
                backgroundColor: activeTab === 'signals' ? colors.accent : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: 160,
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: activeTab === 'signals' ? `0 4px 12px ${colors.accent}40` : 'none',
                transform: activeTab === 'signals' ? 'translateY(-2px)' : 'translateY(0)',
              }}
            >
              <Text
                style={{
                  color: activeTab === 'signals' ? '#FFFFFF' : colors.textSecondary,
                  fontSize: parseInt(typography.fontSize.medium),
                  fontWeight: '700',
                  fontFamily: typography.fontFamily.body,
                  textAlign: 'center',
                }}
              >
                Trading Signals
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1, height: '100%' }}
          contentContainerStyle={{ gap: 32, paddingBottom: 40 }}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
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
                  
                  // Filter out null values and sort - use portfolio bonds
                  const validBonds = portfolioBonds
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
          </>
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <>
              {/* Portfolio Performance Chart */}
              <WidgetContainer id="portfolio-performance" title="Portfolio Performance" storageKey="overviewWidgets">
                <AnimatedCard delay={0.2} enableHover={false}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={portfolioHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                      <XAxis 
                        dataKey="date" 
                        stroke={colors.textSecondary}
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke={colors.textSecondary}
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: colors.surfaceCard,
                          border: `1px solid ${colors.border}`,
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: colors.textPrimary }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={colors.accent} 
                        strokeWidth={2}
                        dot={false}
                        name="Portfolio (Rebased to 100)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </AnimatedCard>
              </WidgetContainer>

              {/* Attribution Charts */}
              <View
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: 24,
                }}
              >
                {/* Sector Attribution */}
                <WidgetContainer id="portfolio-sector-attr" title="Sector Attribution" storageKey="overviewWidgets">
                  <AnimatedCard delay={0.3} enableHover={false}>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={sectorAttribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                        <XAxis 
                          dataKey="name" 
                          stroke={colors.textSecondary}
                          style={{ fontSize: '11px' }}
                          angle={-45}
                          textAnchor="end"
                          height={100}
                        />
                        <YAxis stroke={colors.textSecondary} style={{ fontSize: '12px' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: colors.surfaceCard,
                            border: `1px solid ${colors.border}`,
                            borderRadius: '8px',
                          }}
                          labelStyle={{ color: colors.textPrimary }}
                        />
                        <Bar dataKey="weight" fill={colors.chartColors.blue} name="Weight %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </AnimatedCard>
                </WidgetContainer>

                {/* Country Distribution */}
                <WidgetContainer id="portfolio-country" title="Country Distribution" storageKey="overviewWidgets">
                  <AnimatedCard delay={0.4} enableHover={false}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          dataKey="value"
                          data={countryAttribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, value }) => `${name} (${value.toFixed(1)}%)`}
                          labelStyle={{ fontSize: '11px', fill: colors.textPrimary, fontWeight: '600' }}
                        >
                          {countryAttribution.map((entry, index) => (
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
              </View>

              {/* Bond Selection Table */}
              <WidgetContainer id="portfolio-bonds" title={`Portfolio Bonds (${portfolioBonds.length} selected)`} storageKey="overviewWidgets">
                <AnimatedCard delay={0.5} enableHover={false}>
                  <View style={{ maxHeight: '500px', overflow: 'auto' }}>
                    <View style={{
                      display: 'grid',
                      gridTemplateColumns: '40px 2fr 1.5fr 1fr 1fr 1fr 1fr',
                      gap: 12,
                      padding: '12px 16px',
                      backgroundColor: colors.surface,
                      borderRadius: parseInt(colors.borderRadius.medium),
                      marginBottom: 8,
                    }}>
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), fontWeight: '600' }}>✓</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), fontWeight: '600' }}>Issuer</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), fontWeight: '600' }}>ISIN</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), fontWeight: '600' }}>Price</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), fontWeight: '600' }}>Delta</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), fontWeight: '600' }}>YTM</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), fontWeight: '600' }}>Perf 1M</Text>
                    </View>
                    
                    {mockConvertibleBonds.map((bond) => {
                      const isSelected = selectedISINs.includes(bond.isin);
                      return (
                        <TouchableOpacity
                          key={bond.isin}
                          onPress={() => toggleBond(bond.isin)}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '40px 2fr 1.5fr 1fr 1fr 1fr 1fr',
                            gap: 12,
                            padding: '12px 16px',
                            backgroundColor: isSelected ? colors.accent + '10' : colors.surfaceCard,
                            borderRadius: parseInt(colors.borderRadius.medium),
                            marginBottom: 4,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            borderLeft: isSelected ? `3px solid ${colors.accent}` : '3px solid transparent',
                          }}
                        >
                          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{
                              width: 20,
                              height: 20,
                              borderRadius: 4,
                              backgroundColor: isSelected ? colors.accent : 'transparent',
                              border: `2px solid ${isSelected ? colors.accent : colors.border}`,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                              {isSelected && (
                                <Text style={{ color: colors.background, fontSize: 12, fontWeight: '700' }}>✓</Text>
                              )}
                            </View>
                          </View>
                          <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.small) }}>{bond.issuer}</Text>
                          <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.xsmall) }}>{bond.isin}</Text>
                          <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.small) }}>
                            {bond.price !== null && bond.price !== undefined ? bond.price.toFixed(2) : 'N/A'}
                          </Text>
                          <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.small) }}>
                            {bond.delta !== null && bond.delta !== undefined ? (bond.delta * 100).toFixed(1) + '%' : 'N/A'}
                          </Text>
                          <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.small) }}>
                            {bond.ytm !== null && bond.ytm !== undefined ? bond.ytm.toFixed(2) + '%' : 'N/A'}
                          </Text>
                          <Text style={{ 
                            color: bond.performance1M !== null && bond.performance1M >= 0 ? colors.success : colors.danger, 
                            fontSize: parseInt(typography.fontSize.small),
                            fontWeight: '600',
                          }}>
                            {bond.performance1M !== null && bond.performance1M !== undefined ? formatPercentage(bond.performance1M, 2) : 'N/A'}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </AnimatedCard>
              </WidgetContainer>
            </>
          )}

          {/* Trading Signals Tab */}
          {activeTab === 'signals' && (
            <>
              {/* Trading Signals Table */}
              <WidgetContainer id="trading-signals" title={`Trading Signals (${portfolioBonds.length} bonds)`} storageKey="overviewWidgets">
                <AnimatedCard delay={0.2} enableHover={false}>
                  <View style={{ maxHeight: '700px', overflow: 'auto' }}>
                    <View style={{
                      display: 'grid',
                      gridTemplateColumns: '1.5fr 1fr 120px 100px 100px 100px 100px 1.5fr',
                      gap: 12,
                      padding: '12px 16px',
                      backgroundColor: colors.surface,
                      borderRadius: parseInt(colors.borderRadius.medium),
                      marginBottom: 8,
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}>
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), fontWeight: '600' }}>Issuer</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), fontWeight: '600' }}>ISIN</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), fontWeight: '600' }}>Vol Spread</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), fontWeight: '600' }}>Valuation</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), fontWeight: '600' }}>Downside</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), fontWeight: '600' }}>Spread/Avg</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), fontWeight: '600' }}>Z-Score</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), fontWeight: '600' }}>Signal</Text>
                    </View>
                    
                    {tradingSignals.map((signal) => {
                      // Color coding for valuation
                      let valuationColor = colors.textSecondary;
                      if (signal.relativeSituation === 'underpriced') valuationColor = colors.success;
                      else if (signal.relativeSituation === 'overpriced') valuationColor = colors.warning;
                      else if (signal.relativeSituation === 'expensive') valuationColor = colors.danger;
                      
                      // Color for signal
                      let signalColor = colors.textSecondary;
                      let signalBg = 'transparent';
                      if (signal.observation.includes('rebound')) {
                        signalColor = colors.success;
                        signalBg = colors.success + '15';
                      } else if (signal.observation.includes('downside')) {
                        signalColor = colors.danger;
                        signalBg = colors.danger + '15';
                      }
                      
                      return (
                        <View
                          key={signal.isin}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1.5fr 1fr 120px 100px 100px 100px 100px 1.5fr',
                            gap: 12,
                            padding: '12px 16px',
                            backgroundColor: colors.surfaceCard,
                            borderRadius: parseInt(colors.borderRadius.medium),
                            marginBottom: 4,
                            alignItems: 'center',
                          }}
                        >
                          <View>
                            <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.small), fontWeight: '600' }}>
                              {signal.issuer}
                            </Text>
                          </View>
                          <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.xsmall) }}>
                            {signal.isin}
                          </Text>
                          <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.small) }}>
                            {signal.volSpread !== null ? signal.volSpread.toFixed(2) + '%' : 'N/A'}
                          </Text>
                          <View style={{
                            padding: '4px 8px',
                            borderRadius: parseInt(colors.borderRadius.small),
                            backgroundColor: valuationColor + '20',
                          }}>
                            <Text style={{ 
                              color: valuationColor, 
                              fontSize: parseInt(typography.fontSize.xsmall),
                              fontWeight: '600',
                              textAlign: 'center',
                            }}>
                              {signal.relativeSituation || 'N/A'}
                            </Text>
                          </View>
                          <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.small) }}>
                            {signal.downsideRisk !== null ? signal.downsideRisk.toFixed(4) : 'N/A'}
                          </Text>
                          <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.small) }}>
                            {signal.spreadToAverage !== null ? signal.spreadToAverage.toFixed(2) : 'N/A'}
                          </Text>
                          <Text style={{ 
                            color: signal.zScore !== null && Math.abs(signal.zScore) > 1 ? colors.accent : colors.textPrimary, 
                            fontSize: parseInt(typography.fontSize.small),
                            fontWeight: signal.zScore !== null && Math.abs(signal.zScore) > 1 ? '700' : '400',
                          }}>
                            {signal.zScore !== null ? signal.zScore.toFixed(2) : 'N/A'}
                          </Text>
                          <View style={{
                            padding: '4px 8px',
                            borderRadius: parseInt(colors.borderRadius.small),
                            backgroundColor: signalBg,
                          }}>
                            <Text style={{ 
                              color: signalColor, 
                              fontSize: parseInt(typography.fontSize.xsmall),
                              fontWeight: signal.observation ? '700' : '400',
                            }}>
                              {signal.observation || '-'}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </AnimatedCard>
              </WidgetContainer>

              {/* Explanation Card */}
              <WidgetContainer id="signals-explanation" title="How to Read Trading Signals" storageKey="overviewWidgets">
                <AnimatedCard delay={0.3} enableHover={false}>
                  <View style={{ gap: 16, padding: 16 }}>
                    <View>
                      <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.medium), fontWeight: '700', marginBottom: 8 }}>
                        📊 Vol Spread
                      </Text>
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), lineHeight: 1.6 }}>
                        Difference between Implied Volatility and Historical Volatility (ImplVol - HistVol). Positive values suggest market expects higher volatility than history.
                      </Text>
                    </View>

                    <View>
                      <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.medium), fontWeight: '700', marginBottom: 8 }}>
                        💰 Valuation
                      </Text>
                      <View style={{ gap: 4 }}>
                        <Text style={{ color: colors.success, fontSize: parseInt(typography.fontSize.small) }}>
                          • <Text style={{ fontWeight: '600' }}>underpriced</Text>: Vol Spread {'<'} 0 (Bond may be cheap)
                        </Text>
                        <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small) }}>
                          • <Text style={{ fontWeight: '600' }}>fair value</Text>: Vol Spread 0-4% (Fairly priced)
                        </Text>
                        <Text style={{ color: colors.warning, fontSize: parseInt(typography.fontSize.small) }}>
                          • <Text style={{ fontWeight: '600' }}>overpriced</Text>: Vol Spread 4-8% (Getting expensive)
                        </Text>
                        <Text style={{ color: colors.danger, fontSize: parseInt(typography.fontSize.small) }}>
                          • <Text style={{ fontWeight: '600' }}>expensive</Text>: Vol Spread {'>'} 8% (Very expensive)
                        </Text>
                      </View>
                    </View>

                    <View>
                      <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.medium), fontWeight: '700', marginBottom: 8 }}>
                        ⚠️ Downside Risk
                      </Text>
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), lineHeight: 1.6 }}>
                        Potential loss if volatility corrects = Vol Spread × Vega. Only calculated when Vol Spread {'>'} 0. Higher values mean more downside if volatility normalizes.
                      </Text>
                    </View>

                    <View>
                      <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.medium), fontWeight: '700', marginBottom: 8 }}>
                        📈 Z-Score
                      </Text>
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), lineHeight: 1.6 }}>
                        How many standard deviations from the average. |Z-Score| {'>'} 1 indicates statistically significant deviation. Used with other signals to identify trading opportunities.
                      </Text>
                    </View>

                    <View>
                      <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.medium), fontWeight: '700', marginBottom: 8 }}>
                        🎯 Trading Signal
                      </Text>
                      <View style={{ gap: 4 }}>
                        <Text style={{ color: colors.success, fontSize: parseInt(typography.fontSize.small), lineHeight: 1.6 }}>
                          • <Text style={{ fontWeight: '700' }}>High probability of a rebound</Text>: Bond is underpriced/fair AND Spread/Avg {'<'} 0 AND |Z-Score| {'>'} 1 AND |Spread/Avg| {'>'} 2
                        </Text>
                        <Text style={{ color: colors.danger, fontSize: parseInt(typography.fontSize.small), lineHeight: 1.6 }}>
                          • <Text style={{ fontWeight: '700' }}>High probability of downside</Text>: Bond is overpriced/expensive AND Spread/Avg {'>'} 0 AND |Z-Score| {'>'} 1 AND |Spread/Avg| {'>'} 2
                        </Text>
                      </View>
                    </View>

                    <View style={{ 
                      padding: 12, 
                      backgroundColor: colors.accent + '10', 
                      borderRadius: parseInt(colors.borderRadius.medium),
                      borderLeft: `4px solid ${colors.accent}`,
                    }}>
                      <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.small), fontWeight: '600', marginBottom: 4 }}>
                        ℹ️ Note
                      </Text>
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), lineHeight: 1.6 }}>
                        All formulas are from calcs.md. Signals are calculated only for bonds with Vega {'>'} 0.25 (Balanced profile). Use these signals as inputs to your investment process, not as standalone trading decisions.
                      </Text>
                    </View>
                  </View>
                </AnimatedCard>
              </WidgetContainer>
            </>
          )}
        </ScrollView>
      </View>
      
      {/* AI Agent Bubble */}
      <AIAgentBubble />
    </View>
  );
};

