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
  mockConvertibleBonds, 
  calculateMarketSummary,
  aggregateBySector,
  aggregateByRating,
  aggregateByMaturity,
  aggregateByProfile,
  generateMarketIndexData,
} from '../../data/mockData';
import { formatLargeNumber, formatPercentage } from '../../utils/dataUtils';
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
} from 'recharts';

export const Overview: React.FC = () => {
  const { isDark } = useTheme();
  const { isCollapsed } = useSidebar();
  const { t } = useLanguage();
  const colors = isDark ? darkColors : lightColors;

  const marketSummary = calculateMarketSummary(mockConvertibleBonds);
  const sectorData = aggregateBySector(mockConvertibleBonds);
  const ratingData = aggregateByRating(mockConvertibleBonds);
  const maturityData = aggregateByMaturity(mockConvertibleBonds);
  const profileData = aggregateByProfile(mockConvertibleBonds);
  const marketIndexData = generateMarketIndexData();

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
        <ScrollView
          style={{ flex: 1, height: '100%' }}
          contentContainerStyle={{ gap: 32, paddingBottom: 40 }}
        >
          {/* Header */}
          <DashboardHeader 
            title={t('dashboard.overview')}
            description={t('dashboard.overview_desc')}
          />

          {/* KPI Cards */}
          <WidgetContainer id="overview-kpis" storageKey="overviewWidgets">
            <View
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 20,
              }}
            >
              <KPICard
                title={t('kpi.total_convertible_bonds')}
                value={marketSummary.totalCBs}
                format="number"
                delay={getStaggerDelay(0)}
              />
              <KPICard
                title={t('kpi.total_market_cap')}
                value={formatLargeNumber(marketSummary.totalMarketCap)}
                subtitle="EUR"
                delay={getStaggerDelay(1)}
              />
              <KPICard
                title={t('kpi.average_yield')}
                value={marketSummary.avgYield.toFixed(2) + '%'}
                trend={marketSummary.avg1DChange}
                subtitle={t('kpi.ytm')}
                delay={getStaggerDelay(2)}
              />
              <KPICard
                title={t('kpi.average_1d_change')}
                value={formatPercentage(marketSummary.avg1DChange)}
                trend={marketSummary.avg1DChange}
                subtitle={t('kpi.vs_yesterday')}
                delay={getStaggerDelay(3)}
              />
            </View>
          </WidgetContainer>

          {/* Market Index Performance */}
          <WidgetContainer id="overview-market-index" title={t('widget.market_index_performance')} storageKey="overviewWidgets">
            <AnimatedCard delay={0.4} enableHover={false}>
              <View style={{ gap: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: parseInt(typography.fontSize.small),
                      fontFamily: typography.fontFamily.body,
                    }}
                  >
                    {t('widget.last_30_days')}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: colors.chartColors.blue,
                        }}
                      />
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.xsmall) }}>
                        {t('legend.cb_index')}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: colors.chartColors.green,
                        }}
                      />
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.xsmall) }}>
                        {t('legend.equity_index')}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: colors.chartColors.purple,
                        }}
                      />
                      <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.xsmall) }}>
                        {t('legend.delta_neutral')}
                      </Text>
                    </View>
                  </View>
                </View>

                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={marketIndexData} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
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
                      dataKey="cb"
                      stroke={colors.chartColors.blue}
                      dot={false}
                      strokeWidth={3}
                      name="CB Index"
                    />
                    <Line
                      type="monotone"
                      dataKey="equity"
                      stroke={colors.chartColors.green}
                      dot={false}
                      strokeWidth={3}
                      name="Equity Index"
                    />
                    <Line
                      type="monotone"
                      dataKey="deltaNeutral"
                      stroke={colors.chartColors.purple}
                      dot={false}
                      strokeWidth={3}
                      name="Delta Neutral"
                    />
                  </LineChart>
                </ResponsiveContainer>
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

