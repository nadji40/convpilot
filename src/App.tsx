import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { darkColors, lightColors } from './theme';
import { MetricCard } from './components/MetricCard';
import { Section } from './components/Section';
import { ChartCard } from './components/ChartCard';
import { Sidebar } from './components/Sidebar';
import { NewsTickerBar } from './components/NewsTickerBar';
import { AppProviders, useTheme, useLanguage, useSidebar, useLoading } from './contexts/AppContext';
import { SkeletonChart, SkeletonMetric, SkeletonList } from './components/SkeletonLoader';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const lineData = [
  { month: 'JAN', cb: 92, eq: 94, delta: 90 },
  { month: 'FEB', cb: 90, eq: 92, delta: 88 },
  { month: 'MAR', cb: 95, eq: 97, delta: 93 },
  { month: 'APR', cb: 94, eq: 96, delta: 92 },
  { month: 'MAY', cb: 96, eq: 97, delta: 94 },
  { month: 'JUN', cb: 93, eq: 95, delta: 91 },
  { month: 'JUL', cb: 95, eq: 96, delta: 93 },
  { month: 'AUG', cb: 92, eq: 93, delta: 90 },
  { month: 'SEP', cb: 91, eq: 92, delta: 89 },
  { month: 'OCT', cb: 94, eq: 96, delta: 92 },
  { month: 'NOV', cb: 96, eq: 98, delta: 94 },
  { month: 'DEC', cb: 90, eq: 92, delta: 88 },
];

const scatterDataA = new Array(30).fill(0).map((_, i) => ({ x: -5 + i * 0.6, y: 100 + Math.random() * 200 }));
const scatterDataB = new Array(30).fill(0).map((_, i) => ({ x: -4 + i * 0.5, y: 60 + Math.random() * 140 }));

const profilePie = [
  { name: 'Mixed profile', value: 25 },
  { name: 'Bond profile', value: 18 },
  { name: 'Equity profile', value: 22 },
  { name: 'Distressed prof.', value: 14 },
  { name: 'High yield prof.', value: 21 },
];

const sizeDonut = [
  { name: 'Small Cap', value: 10 },
  { name: 'Mid Cap', value: 23 },
  { name: 'Large Cap', value: 67 },
];

function Dashboard() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { isCollapsed } = useSidebar();
  const { isLoading } = useLoading();
  const colors = isDark ? darkColors : lightColors;

  // Apply theme class to body for scrollbar styling
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.className = isDark ? '' : 'light-theme';
    }
  }, [isDark]);

  const COLORS = [colors.chartColors.blue, colors.chartColors.green, colors.chartColors.orange, colors.chartColors.purple, colors.chartColors.pink];

  const inflows = [
    { name: 'ACCOR 2029', change: '+12M', color: colors.success },
    { name: 'AIR FRANCE 2025', change: '+6M', color: colors.success },
    { name: 'ADIDAS 2025', change: '-3M', color: colors.danger },
  ];

  const topWorst = [
    { name: 'AMADEUS IT GROUP 2025', change: '+10%', positive: true },
    { name: 'GENFIT 2025', change: '-5%', positive: false },
  ];

  if (isLoading) {
    return (
      <View style={{ backgroundColor: colors.background, minHeight: '100vh', flexDirection: 'column' }}>
        <NewsTickerBar />
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <Sidebar />
          <View style={{ 
            flex: 1, 
            marginLeft: isCollapsed ? 80 : 280,
            padding: 20,
            height: 'calc(100vh - 49px)',
            overflow: 'auto' as any
          }}>
            <View style={{ gap: 20 }}>
              <SkeletonChart />
              <View style={{ flexDirection: 'row', gap: 24 }}>
                <View style={{ flex: 2, gap: 20 }}>
                  <SkeletonChart />
                  <View style={{ flexDirection: 'row', gap: 20, minHeight: 320 }}>
                    <SkeletonChart />
                    <SkeletonChart />
                  </View>
                  <View style={{ flexDirection: 'row', gap: 16 }}>
                    <View style={{ flex: 1, gap: 16 }}>
                      <SkeletonMetric />
                      <SkeletonMetric />
                      <SkeletonMetric />
                    </View>
                    <View style={{ flex: 1, gap: 16 }}>
                      <SkeletonMetric />
                      <SkeletonMetric />
                      <SkeletonMetric />
                    </View>
                    <SkeletonChart />
                  </View>
                </View>
                <View style={{ flex: 1, gap: 20 }}>
                  <SkeletonList items={3} />
                  <SkeletonList items={2} />
                  <SkeletonList items={3} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: colors.background, minHeight: '100vh', flexDirection: 'column' }}>
      <NewsTickerBar />
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <Sidebar />
        <View style={{ 
          flex: 1, 
          marginLeft: isCollapsed ? 80 : 280,
          padding: 20,
          height: 'calc(100vh - 49px)',
          overflow: 'auto' as any
        }}>
          <ScrollView style={{ flex: 1, height: '100%' }} contentContainerStyle={{ gap: 20 }}>
          {/* Header */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 16,
              padding: 20,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.textPrimary, fontSize: 32, fontWeight: '900', letterSpacing: 2, fontFamily: 'Playfair Display' }}>CONVPILOT</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: 16, 
                  backgroundColor: colors.accentGreen, 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Text style={{ color: colors.background, fontSize: 14, fontWeight: '700', fontFamily: 'Playfair Display' }}>MT</Text>
                </View>
                <View>
                  <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: '600', fontFamily: 'Playfair Display' }}>Meriem Tarzaali</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12, fontFamily: 'Playfair Display' }}>meriem.tarzaali@email.com</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Market cap and 1D changes */}
          <View style={{ flexDirection: 'row', gap: 24 }}>
            <View style={{ flex: 2, gap: 20 }}>
              <Section title={t('dashboard.market_cap')} right={<Text style={{ color: colors.accentGreen, fontSize: 16, fontWeight: '600', fontFamily: 'Playfair Display' }}>{t('dashboard.1d_changes')}</Text>}>
                <ChartCard>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={lineData} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                      <XAxis dataKey="month" stroke={colors.muted} tick={{ fill: colors.textSecondary, fontSize: 12 }} />
                      <YAxis stroke={colors.muted} tick={{ fill: colors.textSecondary, fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: colors.surfaceCard, 
                          border: `1px solid ${colors.border}`,
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
                        }} 
                        labelStyle={{ color: colors.textPrimary, fontWeight: '600' }}
                        itemStyle={{ color: colors.textSecondary }}
                      />
                      <Legend wrapperStyle={{ color: colors.textSecondary }} />
                      <Line type="monotone" dataKey="cb" stroke={colors.chartColors.blue} dot={false} strokeWidth={3} name="CB PERF" />
                      <Line type="monotone" dataKey="eq" stroke={colors.chartColors.green} dot={false} strokeWidth={3} name="EQUITY PERF" />
                      <Line type="monotone" dataKey="delta" stroke={colors.chartColors.purple} dot={false} strokeWidth={3} name="DELTA NEUTRAL PERF" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>

                <View style={{ flexDirection: 'row', gap: 20 }}>
                  <ChartCard title={t('dashboard.scatter_cb_universe')}>
                    <ResponsiveContainer width="100%" height={260}>
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <XAxis type="number" dataKey="x" name="convexity" tick={{ fill: colors.textSecondary }} stroke={colors.muted} />
                        <YAxis type="number" dataKey="y" name="price" tick={{ fill: colors.textSecondary }} stroke={colors.muted} />
                        <Tooltip 
                          cursor={{ stroke: colors.border }} 
                          contentStyle={{ 
                            backgroundColor: colors.surfaceCard, 
                            border: `1px solid ${colors.border}`,
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
                          }}
                          labelStyle={{ color: colors.textPrimary, fontWeight: '600' }}
                          itemStyle={{ color: colors.textSecondary }}
                        />
                        <Scatter data={scatterDataA} fill={colors.chartColors.blue} />
                        <Scatter data={scatterDataB} fill={colors.chartColors.green} />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </ChartCard>
                  <ChartCard title={t('dashboard.profiles')}>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie 
                          dataKey="value" 
                          data={profilePie} 
                          cx="50%" 
                          cy="50%" 
                          outerRadius={80} 
                          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                          labelStyle={{ fontSize: '12px', fill: colors.textPrimary, fontWeight: '600' }}
                        >
                          {profilePie.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: colors.surfaceCard, 
                            border: `1px solid ${colors.border}`,
                            borderRadius: '8px'
                          }}
                          labelStyle={{ color: colors.textPrimary }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </View>

                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <View style={{ flex: 1, gap: 16 }}>
                    <MetricCard label={t('metrics.delta')} value="45%" />
                    <MetricCard label={t('metrics.vega')} value="0.3%" />
                    <MetricCard label={t('metrics.vega')} value="0.3%" />
                  </View>
                  <View style={{ flex: 1, gap: 16 }}>
                    <MetricCard label={t('metrics.ytm')} value="3%" />
                    <MetricCard label={t('metrics.prime')} value="60%" />
                    <MetricCard label={t('metrics.duration')} value="2" />
                  </View>
                  <ChartCard title={t('dashboard.market_cap_breakdown')}>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie 
                          dataKey="value" 
                          data={sizeDonut} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={50} 
                          outerRadius={90} 
                          label={({ value }) => `${value}%`}
                          labelStyle={{ fontSize: '14px', fill: colors.textPrimary, fontWeight: '600' }}
                        >
                          {sizeDonut.map((entry, index) => (
                            <Cell key={`c-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: colors.surfaceCard, 
                            border: `1px solid ${colors.border}`,
                            borderRadius: '8px'
                          }}
                          labelStyle={{ color: colors.textPrimary }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </View>
              </Section>
            </View>

            {/* Right sidebar */}
            <View style={{ flex: 1, gap: 20 }}>
              <Section title={t('dashboard.one_day_changes')}>
                <View style={{ gap: 12 }}>
                  <MetricCard label={t('metrics.cb_performance')} value="+1.5%" tone="positive" />
                  <MetricCard label={t('metrics.equity_performance')} value="+3%" tone="positive" />
                  <MetricCard label={t('metrics.delta_adjusted_performance')} value="1%" tone="neutral" />
                </View>
              </Section>

              <Section title={t('dashboard.top_worst_performance')}>
                <View style={{ gap: 12 }}>
                  {topWorst.map((row) => (
                    <View
                      key={row.name}
                      style={{
                        backgroundColor: colors.surfaceCard,
                        borderColor: colors.border,
                        borderWidth: 1,
                        borderRadius: 16,
                        padding: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text style={{ color: colors.textPrimary, fontFamily: 'Playfair Display' }}>{row.name}</Text>
                      <Text style={{ color: row.positive ? colors.success : colors.danger, fontWeight: '700', fontFamily: 'Playfair Display' }}>{row.change}</Text>
                    </View>
                  ))}
                </View>
              </Section>

              <Section title={t('dashboard.inflows_outflows')}>
                <View style={{ gap: 12 }}>
                  {inflows.map((row) => (
                    <View
                      key={row.name}
                      style={{
                        backgroundColor: colors.surfaceCard,
                        borderColor: colors.border,
                        borderWidth: 1,
                        borderRadius: 16,
                        padding: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text style={{ color: colors.textPrimary, fontFamily: 'Playfair Display' }}>{row.name}</Text>
                      <Text style={{ color: row.color, fontWeight: '700', fontFamily: 'Playfair Display' }}>{row.change}</Text>
                    </View>
                  ))}
                </View>
              </Section>
            </View>
          </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

export function App() {
  return (
    <AppProviders>
      <Dashboard />
    </AppProviders>
  );
}