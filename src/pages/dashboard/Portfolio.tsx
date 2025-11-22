import React, { useState, useMemo, useEffect } from 'react';
import { View, Text } from 'react-native';
import { darkColors, lightColors, typography } from '../../theme';
import { useTheme, useSidebar, useLanguage } from '../../contexts/AppContext';
import { DashboardHeader } from '../../components/DashboardHeader';
import { AnimatedCard } from '../../components/AnimatedCard';
import { KPICard } from '../../components/KPICard';
import { AIAgentBubble } from '../../components/AIAgentBubble';
import { mockConvertibleBonds } from '../../data/mockData';
import { ConvertibleBond } from '../../data/dataLoader';
import { formatLargeNumber, formatPercentage, calculatePortfolioHistory } from '../../utils/dataUtils';
import { rebaseToBase100 } from '../../utils/calculations';
import { getStaggerDelay } from '../../utils/animations';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

export const Portfolio: React.FC = () => {
  const { isDark } = useTheme();
  const { isCollapsed } = useSidebar();
  const { t } = useLanguage();
  const colors = isDark ? darkColors : lightColors;

  // Portfolio selection state (persisted to localStorage)
  const [selectedISINs, setSelectedISINs] = useState<string[]>([]);

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

  // Calculate portfolio metrics
  const portfolioMetrics = useMemo(() => {
    if (portfolioBonds.length === 0) {
      return {
        totalMarketCap: 0,
        avgDelta: 0,
        avgYTM: 0,
        totalPerf1M: 0,
        weightedDelta: 0,
        weightedYTM: 0,
      };
    }

    const totalMarketCap = portfolioBonds.reduce((sum, b) => sum + b.outstandingAmount, 0);
    const avgDelta = portfolioBonds.reduce((sum, b) => sum + b.delta, 0) / portfolioBonds.length;
    const avgYTM = portfolioBonds.reduce((sum, b) => sum + b.ytm, 0) / portfolioBonds.length;
    const totalPerf1M = portfolioBonds.reduce((sum, b) => sum + b.performance1M, 0) / portfolioBonds.length;
    
    // Weighted by market cap
    const weightedDelta = portfolioBonds.reduce((sum, b) => sum + b.delta * b.outstandingAmount, 0) / totalMarketCap;
    const weightedYTM = portfolioBonds.reduce((sum, b) => sum + b.ytm * b.outstandingAmount, 0) / totalMarketCap;

    return {
      totalMarketCap,
      avgDelta,
      avgYTM,
      totalPerf1M,
      weightedDelta,
      weightedYTM,
    };
  }, [portfolioBonds]);

  // Sector attribution
  const sectorAttribution = useMemo(() => {
    const attribution: { [key: string]: { marketCap: number; perf: number; contribution: number } } = {};
    
    portfolioBonds.forEach((bond) => {
      // Handle multiple sectors - each sector gets the full bond attribution
      const sectors = bond.sectors || [bond.sector];
      sectors.forEach((sector) => {
        if (!attribution[sector]) {
          attribution[sector] = { marketCap: 0, perf: 0, contribution: 0 };
        }
        attribution[sector].marketCap += bond.outstandingAmount;
        attribution[sector].perf += bond.performance1M * bond.outstandingAmount;
      });
    });

    return Object.entries(attribution).map(([name, data]) => ({
      name,
      marketCap: data.marketCap,
      contribution: (data.perf / portfolioMetrics.totalMarketCap),
      weight: (data.marketCap / portfolioMetrics.totalMarketCap) * 100,
    }));
  }, [portfolioBonds, portfolioMetrics.totalMarketCap]);

  // Country attribution
  const countryAttribution = useMemo(() => {
    const attribution: { [key: string]: number } = {};
    
    portfolioBonds.forEach((bond) => {
      if (!attribution[bond.country]) {
        attribution[bond.country] = 0;
      }
      attribution[bond.country] += bond.outstandingAmount;
    });

    return Object.entries(attribution).map(([name, value]) => ({
      name,
      value: (value / portfolioMetrics.totalMarketCap) * 100,
    }));
  }, [portfolioBonds, portfolioMetrics.totalMarketCap]);

  // Calculate historical portfolio performance from REAL cbhist.json data
  // Rebased to 100 according to calcs.md: Pt(rebased) = (Pt / P0) × 100
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
        title={t('dashboard.portfolio')}
        description={`${portfolioBonds.length} ${t('dashboard.portfolio_desc')} ${formatLargeNumber(portfolioMetrics.totalMarketCap)}`}
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

          {/* Portfolio KPIs */}
          <View
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 20,
            }}
          >
            <KPICard
              title={t('kpi.total_market_cap')}
              value={formatLargeNumber(portfolioMetrics.totalMarketCap)}
              subtitle="EUR"
              delay={getStaggerDelay(0)}
            />
            <KPICard
              title={t('kpi.weighted_delta')}
              value={portfolioMetrics.weightedDelta.toFixed(3)}
              delay={getStaggerDelay(1)}
            />
            <KPICard
              title={t('kpi.weighted_ytm')}
              value={`${portfolioMetrics.weightedYTM.toFixed(2)}%`}
              delay={getStaggerDelay(2)}
            />
            <KPICard
              title={t('kpi.avg_performance_1m')}
              value={formatPercentage(portfolioMetrics.totalPerf1M)}
              trend={portfolioMetrics.totalPerf1M}
              delay={getStaggerDelay(3)}
            />
          </View>

          {/* Portfolio Evolution */}
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
                Portfolio Evolution (30 Days)
              </Text>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={portfolioHistory} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                  <XAxis
                    dataKey="date"
                    stroke={colors.muted}
                    tick={{ fill: colors.textSecondary, fontSize: 11 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
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
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={colors.chartColors.blue}
                    dot={false}
                    strokeWidth={3}
                    name="Portfolio Value (Base 100)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </View>
          </AnimatedCard>

          {/* Attribution Analysis */}
          <View
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: 24,
            }}
          >
            {/* Sector Attribution */}
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
                  Sector Attribution
                </Text>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sectorAttribution} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
                    <XAxis
                      dataKey="name"
                      stroke={colors.muted}
                      tick={{ fill: colors.textSecondary, fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis stroke={colors.muted} tick={{ fill: colors.textSecondary, fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: colors.surfaceCard,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                      }}
                      formatter={(value: any, name: string) => {
                        if (name === 'contribution') {
                          return [formatPercentage(value), 'Contribution'];
                        }
                        if (name === 'weight') {
                          return [`${value.toFixed(1)}%`, 'Weight'];
                        }
                        return [value, name];
                      }}
                    />
                    <Bar dataKey="contribution" name="Contribution" radius={[4, 4, 0, 0]}>
                      {sectorAttribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </View>
            </AnimatedCard>

            {/* Country Breakdown */}
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
                  Country Breakdown
                </Text>

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
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 1) % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: colors.surfaceCard,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                      }}
                      formatter={(value: any) => `${value.toFixed(1)}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </View>
            </AnimatedCard>
          </View>

          {/* Bond Selection */}
          <AnimatedCard delay={0.7} enableHover={false}>
            <View style={{ gap: 16 }}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: parseInt(typography.fontSize.large),
                  fontWeight: '600',
                  fontFamily: typography.fontFamily.heading,
                }}
              >
                Portfolio Composition
              </Text>

              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: parseInt(typography.fontSize.small),
                  fontFamily: typography.fontFamily.body,
                }}
              >
                {t('portfolio.select_bonds')}
              </Text>

              <View style={{ gap: 8 }}>
                {mockConvertibleBonds.map((bond) => {
                  const isSelected = selectedISINs.includes(bond.isin);
                  
                  return (
                    <button
                      key={bond.isin}
                      onClick={() => toggleBond(bond.isin)}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 16,
                        backgroundColor: isSelected ? `${colors.accent}10` : colors.surfaceCard,
                        border: `1px solid ${isSelected ? colors.accent : colors.border}`,
                        borderRadius: parseInt(colors.borderRadius.medium),
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'left',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = colors.surfaceElev;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isSelected ? `${colors.accent}10` : colors.surfaceCard;
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        {/* Checkbox */}
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 4,
                            borderWidth: 2,
                            borderColor: isSelected ? colors.accent : colors.border,
                            backgroundColor: isSelected ? colors.accent : 'transparent',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isSelected && (
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path
                                d="M2 7l4 4 6-8"
                                stroke="#ffffff"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </View>

                        <View style={{ gap: 4 }}>
                          <Text
                            style={{
                              color: colors.textPrimary,
                              fontSize: parseInt(typography.fontSize.default),
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
                            {bond.isin} • {bond.sector} • {bond.currency}
                          </Text>
                        </View>
                      </View>

                      <View style={{ textAlign: 'right' }}>
                        <Text
                          style={{
                            color: colors.textPrimary,
                            fontSize: parseInt(typography.fontSize.default),
                            fontWeight: '600',
                          }}
                        >
                          {formatLargeNumber(bond.outstandingAmount)}
                        </Text>
                        <Text
                          style={{
                            color: bond.performance1M >= 0 ? colors.success : colors.danger,
                            fontSize: parseInt(typography.fontSize.small),
                            fontWeight: '600',
                          }}
                        >
                          {formatPercentage(bond.performance1M)} (1M)
                        </Text>
                      </View>
                    </button>
                  );
                })}
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

