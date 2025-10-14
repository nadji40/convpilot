import { View, Text, ScrollView } from 'react-native';
import { colors } from './theme';
import { MetricCard } from './components/MetricCard';
import { Section } from './components/Section';
import { ChartCard } from './components/ChartCard';
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

const inflows = [
  { name: 'ACCOR 2029', change: '+12M', color: colors.success },
  { name: 'AIR FRANCE 2025', change: '+6M', color: colors.success },
  { name: 'ADIDAS 2025', change: '-3M', color: colors.danger },
];

const topWorst = [
  { name: 'AMADEUS IT GROUP 2025', change: '+10%', positive: true },
  { name: 'GENFIT 2025', change: '-5%', positive: false },
];

const COLORS = ['#66b3ff', '#2ad3a7', '#ffc857', '#e17cff', '#5b8cff'];

export function App() {
  return (
    <View style={{ backgroundColor: colors.background, minHeight: '100%', padding: 16 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 16 }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 16,
            padding: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: colors.textPrimary, fontSize: 28, fontWeight: '800', letterSpacing: 1 }}>CONVPILOT</Text>
            <Text style={{ color: colors.textSecondary }}>Jane Cooper</Text>
          </View>
        </View>

        {/* Market cap and 1D changes */}
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{ flex: 2, gap: 12 }}>
            <Section title="Market Cap: 43 Mds EUR" right={<Text style={{ color: colors.accent }}>1D CHANGES +72,852,654.23 EUR</Text>}>
              <ChartCard>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData} margin={{ left: 6, right: 6, top: 6, bottom: 6 }}>
                    <XAxis dataKey="month" stroke={colors.muted} tick={{ fill: colors.textSecondary, fontSize: 12 }} />
                    <YAxis stroke={colors.muted} tick={{ fill: colors.textSecondary, fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: `1px solid ${colors.border}` }} labelStyle={{ color: colors.textPrimary }} />
                    <Legend wrapperStyle={{ color: colors.textSecondary }} />
                    <Line type="monotone" dataKey="cb" stroke="#66b3ff" dot={false} strokeWidth={2} name="CB PERF" />
                    <Line type="monotone" dataKey="eq" stroke="#2ad3a7" dot={false} strokeWidth={2} name="EQUITY PERF" />
                    <Line type="monotone" dataKey="delta" stroke="#e17cff" dot={false} strokeWidth={2} name="DELTA NEUTRAL PERF" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <View style={{ flexDirection: 'row', gap: 16 }}>
                <ChartCard title="Scatter: CB universe">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <XAxis type="number" dataKey="x" name="convexity" tick={{ fill: colors.textSecondary }} stroke={colors.muted} />
                      <YAxis type="number" dataKey="y" name="price" tick={{ fill: colors.textSecondary }} stroke={colors.muted} />
                      <Tooltip cursor={{ stroke: colors.border }} contentStyle={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }} />
                      <Scatter data={scatterDataA} fill="#66b3ff" />
                      <Scatter data={scatterDataB} fill="#2ad3a7" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Profiles">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie dataKey="value" data={profilePie} cx="50%" cy="50%" outerRadius={90} label>
                        {profilePie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </View>

              <View style={{ flexDirection: 'row', gap: 16 }}>
                <View style={{ flex: 1, gap: 12 }}>
                  <MetricCard label="Delta" value="45%" />
                  <MetricCard label="VEGA" value="0.3%" />
                  <MetricCard label="VEGA" value="0.3%" />
                </View>
                <View style={{ flex: 1, gap: 12 }}>
                  <MetricCard label="YTM" value="3%" />
                  <MetricCard label="Prime" value="60%" />
                  <MetricCard label="Duration" value="2" />
                </View>
                <ChartCard title="Market Cap breakdown">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie dataKey="value" data={sizeDonut} cx="50%" cy="50%" innerRadius={50} outerRadius={85} label>
                        {sizeDonut.map((entry, index) => (
                          <Cell key={`c-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </View>
            </Section>
          </View>

          {/* Right sidebar */}
          <View style={{ flex: 1, gap: 12 }}>
            <Section title="One day changes">
              <View style={{ gap: 8 }}>
                <MetricCard label="CB Performance" value="+1.5%" tone="positive" />
                <MetricCard label="Equity performance" value="+3%" tone="positive" />
                <MetricCard label="Delta adjusted performance" value="1%" tone="neutral" />
              </View>
            </Section>

            <Section title="Top and Worst Performance of the Month">
              <View style={{ gap: 8 }}>
                {topWorst.map((row) => (
                  <View
                    key={row.name}
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      borderWidth: 1,
                      borderRadius: 12,
                      padding: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{ color: colors.textPrimary }}>{row.name}</Text>
                    <Text style={{ color: row.positive ? colors.success : colors.danger, fontWeight: '700' }}>{row.change}</Text>
                  </View>
                ))}
              </View>
            </Section>

            <Section title="Inflows/ outflows">
              <View style={{ gap: 8 }}>
                {inflows.map((row) => (
                  <View
                    key={row.name}
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      borderWidth: 1,
                      borderRadius: 12,
                      padding: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{ color: colors.textPrimary }}>{row.name}</Text>
                    <Text style={{ color: row.color, fontWeight: '700' }}>{row.change}</Text>
                  </View>
                ))}
              </View>
            </Section>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
