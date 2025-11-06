import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useParams, useNavigate } from 'react-router-dom';
import { darkColors, lightColors, typography } from '../../theme';
import { useTheme, useSidebar, useLanguage } from '../../contexts/AppContext';
import { DashboardHeader } from '../../components/DashboardHeader';
import { AnimatedCard } from '../../components/AnimatedCard';
import { KPICard } from '../../components/KPICard';
import { mockConvertibleBonds, generateHistoricalData } from '../../data/mockData';
import { formatCurrency, formatPercentage, formatNumber, formatDate } from '../../utils/dataUtils';
import { getStaggerDelay } from '../../utils/animations';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ComposedChart,
} from 'recharts';

export const Instrument: React.FC = () => {
  const { isin } = useParams<{ isin: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isCollapsed } = useSidebar();
  const { t } = useLanguage();
  const colors = isDark ? darkColors : lightColors;

  // Find the bond
  const bond = useMemo(() => {
    return mockConvertibleBonds.find((b) => b.isin === isin);
  }, [isin]);

  // Generate historical data
  const historicalData = useMemo(() => {
    return bond ? generateHistoricalData(bond) : [];
  }, [bond]);

  // Custom inputs state (persisted to localStorage)
  const [customVolatility, setCustomVolatility] = useState('');
  const [customSpread, setCustomSpread] = useState('');

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.className = isDark ? '' : 'light-theme';
    }
  }, [isDark]);

  // Load custom inputs from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && bond) {
      const stored = localStorage.getItem(`instrument-${bond.isin}`);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setCustomVolatility(data.volatility || '');
          setCustomSpread(data.spread || '');
        } catch (e) {
          console.error('Error loading custom inputs:', e);
        }
      }
    }
  }, [bond]);

  // Save custom inputs to localStorage
  const saveCustomInputs = () => {
    if (typeof window !== 'undefined' && bond) {
      const data = {
        volatility: customVolatility,
        spread: customSpread,
      };
      localStorage.setItem(`instrument-${bond.isin}`, JSON.stringify(data));
      alert('Custom inputs saved successfully!');
    }
  };

  if (!bond) {
    return (
      <View
        style={{
          backgroundColor: colors.background,
          minHeight: '100vh',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.h3) }}>
          Bond not found
        </Text>
        <button
          onClick={() => navigate('/dashboard/universe')}
          style={{
            marginTop: 20,
            padding: '12px 24px',
            backgroundColor: colors.accent,
            color: '#ffffff',
            border: 'none',
            borderRadius: parseInt(colors.borderRadius.medium),
            cursor: 'pointer',
            fontFamily: typography.fontFamily.body,
            fontSize: parseInt(typography.fontSize.default),
            fontWeight: '600',
          }}
        >
          Back to Universe
        </button>
      </View>
    );
  }

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
          {/* Header with Back Button */}
          <View style={{ gap: 16 }}>
            <TouchableOpacity
              onPress={() => navigate('/dashboard/universe')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                alignSelf: 'flex-start',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M12 16l-6-6 6-6"
                  stroke={colors.accent}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <Text
                style={{
                  color: colors.accent,
                  fontSize: parseInt(typography.fontSize.default),
                  fontWeight: '600',
                }}
              >
                {t('button.back_to_universe')}
              </Text>
            </TouchableOpacity>

            <DashboardHeader 
              title={bond.issuer}
              description={`${t('dashboard.instrument_desc')} ${bond.isin} • ${bond.sector} • ${bond.country}`}
            />
          </View>

          {/* Main KPIs */}
          <View
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 20,
            }}
          >
            <KPICard
              title="Price"
              value={bond.price.toFixed(2)}
              delay={getStaggerDelay(0)}
            />
            <KPICard
              title="Fair Value"
              value={bond.fairValue.toFixed(2)}
              delay={getStaggerDelay(1)}
            />
            <KPICard
              title="Delta"
              value={bond.delta.toFixed(3)}
              delay={getStaggerDelay(2)}
            />
            <KPICard
              title="Performance 1M"
              value={formatPercentage(bond.performance1M)}
              trend={bond.performance1M}
              delay={getStaggerDelay(3)}
            />
          </View>

          {/* Main Content Grid */}
          <View
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
              gap: 24,
            }}
          >
            {/* Static Information */}
            <AnimatedCard delay={0.4}>
              <View style={{ gap: 16 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontSize: parseInt(typography.fontSize.large),
                    fontWeight: '600',
                    fontFamily: typography.fontFamily.heading,
                  }}
                >
                  Static Information
                </Text>

                <View style={{ gap: 12 }}>
                  <InfoRow label="Issuer" value={bond.issuer} colors={colors} />
                  <InfoRow label="ISIN" value={bond.isin} colors={colors} />
                  <InfoRow label="Issue Date" value={bond.issueDate} colors={colors} />
                  <InfoRow label="Maturity" value={bond.maturity} colors={colors} />
                  <InfoRow label="Coupon" value={`${bond.coupon}%`} colors={colors} />
                  <InfoRow label="Currency" value={bond.currency} colors={colors} />
                  <InfoRow label="Rating" value={bond.rating} colors={colors} />
                  <InfoRow label="Type" value={bond.type} colors={colors} />
                  <InfoRow label="Conversion Ratio" value={bond.conversionRatio.toFixed(2)} colors={colors} />
                  <InfoRow label="Underlying" value={bond.underlyingTicker} colors={colors} />
                  <InfoRow label="Outstanding Amount" value={formatCurrency(bond.outstandingAmount, bond.currency)} colors={colors} />
                </View>
              </View>
            </AnimatedCard>

            {/* Financial Indicators */}
            <AnimatedCard delay={0.5}>
              <View style={{ gap: 16 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontSize: parseInt(typography.fontSize.large),
                    fontWeight: '600',
                    fontFamily: typography.fontFamily.heading,
                  }}
                >
                  Financial Indicators
                </Text>

                <View
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 16,
                  }}
                >
                  <MetricBox label="Price" value={bond.price.toFixed(2)} colors={colors} />
                  <MetricBox label="Fair Value" value={bond.fairValue.toFixed(2)} colors={colors} />
                  <MetricBox label="Delta" value={bond.delta.toFixed(3)} colors={colors} />
                  <MetricBox label="Gamma" value={bond.gamma.toFixed(4)} colors={colors} />
                  <MetricBox label="Vega" value={bond.vega.toFixed(3)} colors={colors} />
                  <MetricBox label="Theta" value={bond.theta.toFixed(4)} colors={colors} />
                  <MetricBox label="Rho" value={bond.rho.toFixed(3)} colors={colors} />
                  <MetricBox label="Volatility" value={`${bond.volatility.toFixed(1)}%`} colors={colors} />
                  <MetricBox label="Implied Vol" value={`${bond.impliedVol.toFixed(1)}%`} colors={colors} />
                  <MetricBox label="YTM" value={`${bond.ytm.toFixed(2)}%`} colors={colors} />
                  <MetricBox label="Spread" value={`${bond.spread} bp`} colors={colors} />
                  <MetricBox label="Credit Spread" value={`${bond.creditSpread} bp`} colors={colors} />
                  <MetricBox label="Duration" value={bond.duration.toFixed(2)} colors={colors} />
                  <MetricBox label="Parity" value={`${bond.parity.toFixed(1)}%`} colors={colors} />
                  <MetricBox label="Prime" value={`${bond.prime.toFixed(1)}%`} colors={colors} />
                  <MetricBox label="Bondfloor" value={`${bond.bondfloorPercent.toFixed(1)}%`} colors={colors} />
                </View>
              </View>
            </AnimatedCard>
          </View>

          {/* Charts */}
          <View
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
              gap: 24,
            }}
          >
            {/* Price History */}
            <AnimatedCard delay={0.6}>
              <View style={{ gap: 16 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontSize: parseInt(typography.fontSize.large),
                    fontWeight: '600',
                    fontFamily: typography.fontFamily.heading,
                  }}
                >
                  Price History (30 Days)
                </Text>

                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={historicalData} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
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
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="cbPrice"
                      stroke={colors.chartColors.blue}
                      dot={false}
                      strokeWidth={3}
                      name="CB Price"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </View>
            </AnimatedCard>

            {/* Comparison with Underlying */}
            <AnimatedCard delay={0.7}>
              <View style={{ gap: 16 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontSize: parseInt(typography.fontSize.large),
                    fontWeight: '600',
                    fontFamily: typography.fontFamily.heading,
                  }}
                >
                  CB vs Underlying ({bond.underlyingTicker})
                </Text>

                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={historicalData} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                    <XAxis
                      dataKey="date"
                      stroke={colors.muted}
                      tick={{ fill: colors.textSecondary, fontSize: 11 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis yAxisId="left" stroke={colors.muted} tick={{ fill: colors.textSecondary, fontSize: 12 }} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke={colors.muted}
                      tick={{ fill: colors.textSecondary, fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: colors.surfaceCard,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="cbPrice"
                      stroke={colors.chartColors.blue}
                      dot={false}
                      strokeWidth={2}
                      name="CB Price"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="underlyingPrice"
                      stroke={colors.chartColors.green}
                      dot={false}
                      strokeWidth={2}
                      name="Underlying"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </View>
            </AnimatedCard>
          </View>

          {/* Custom Inputs */}
          <AnimatedCard delay={0.8}>
            <View style={{ gap: 16 }}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: parseInt(typography.fontSize.large),
                  fontWeight: '600',
                  fontFamily: typography.fontFamily.heading,
                }}
              >
                Custom Inputs
              </Text>

              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: parseInt(typography.fontSize.small),
                  fontFamily: typography.fontFamily.body,
                }}
              >
                Override default values for personalized analysis. Values are saved locally.
              </Text>

              <View
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: 16,
                }}
              >
                <View style={{ gap: 8 }}>
                  <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.small), fontWeight: '600' }}>
                    Custom Volatility (%)
                  </Text>
                  <input
                    type="number"
                    value={customVolatility}
                    onChange={(e) => setCustomVolatility(e.target.value)}
                    placeholder={bond.volatility.toFixed(1)}
                    style={{
                      padding: 12,
                      backgroundColor: colors.surfaceCard,
                      color: colors.textPrimary,
                      border: `1px solid ${colors.border}`,
                      borderRadius: parseInt(colors.borderRadius.medium),
                      fontSize: typography.fontSize.default,
                      fontFamily: typography.fontFamily.body,
                      outline: 'none',
                    }}
                  />
                </View>

                <View style={{ gap: 8 }}>
                  <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.small), fontWeight: '600' }}>
                    Custom Spread (bp)
                  </Text>
                  <input
                    type="number"
                    value={customSpread}
                    onChange={(e) => setCustomSpread(e.target.value)}
                    placeholder={bond.spread.toString()}
                    style={{
                      padding: 12,
                      backgroundColor: colors.surfaceCard,
                      color: colors.textPrimary,
                      border: `1px solid ${colors.border}`,
                      borderRadius: parseInt(colors.borderRadius.medium),
                      fontSize: typography.fontSize.default,
                      fontFamily: typography.fontFamily.body,
                      outline: 'none',
                    }}
                  />
                </View>
              </View>

              <button
                onClick={saveCustomInputs}
                style={{
                  padding: '12px 24px',
                  backgroundColor: colors.accent,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: parseInt(colors.borderRadius.medium),
                  cursor: 'pointer',
                  fontFamily: typography.fontFamily.body,
                  fontSize: parseInt(typography.fontSize.default),
                  fontWeight: '600',
                  alignSelf: 'flex-start',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${colors.accent}60`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Save Custom Inputs
              </button>
            </View>
          </AnimatedCard>
        </View>
      </View>
    </View>
  );
};

// Helper components
const InfoRow: React.FC<{ label: string; value: string; colors: any }> = ({ label, value, colors }) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    }}
  >
    <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small) }}>{label}</Text>
    <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.small), fontWeight: '600' }}>
      {value}
    </Text>
  </View>
);

const MetricBox: React.FC<{ label: string; value: string; colors: any }> = ({ label, value, colors }) => (
  <View
    style={{
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: parseInt(colors.borderRadius.medium),
      borderWidth: 1,
      borderColor: colors.border,
    }}
  >
    <Text
      style={{
        color: colors.textSecondary,
        fontSize: parseInt(typography.fontSize.xsmall),
        fontWeight: '500',
        textTransform: 'uppercase',
        marginBottom: 8,
      }}
    >
      {label}
    </Text>
    <Text
      style={{
        color: colors.textPrimary,
        fontSize: parseInt(typography.fontSize.large),
        fontWeight: '700',
        fontFamily: typography.fontFamily.heading,
      }}
    >
      {value}
    </Text>
  </View>
);

