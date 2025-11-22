import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useParams, useNavigate } from 'react-router-dom';
import { darkColors, lightColors, typography } from '../../theme';
import { useTheme, useSidebar, useLanguage } from '../../contexts/AppContext';
import { DashboardHeader } from '../../components/DashboardHeader';
import { AnimatedCard } from '../../components/AnimatedCard';
import { KPICard } from '../../components/KPICard';
import { AIAgentBubble } from '../../components/AIAgentBubble';
import { mockConvertibleBonds } from '../../data/mockData';
import { ConvertibleBond } from '../../data/dataLoader';
import { generateHistoricalData } from '../../utils/dataUtils';
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
  const [customCBPrice, setCustomCBPrice] = useState('');
  const [customStockPrice, setCustomStockPrice] = useState('');
  const [customRepo, setCustomRepo] = useState('');

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
          setCustomCBPrice(data.cbPrice || '');
          setCustomStockPrice(data.stockPrice || '');
          setCustomRepo(data.repo || '');
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
        cbPrice: customCBPrice,
        stockPrice: customStockPrice,
        repo: customRepo,
      };
      localStorage.setItem(`instrument-${bond.isin}`, JSON.stringify(data));
      alert('Custom inputs saved successfully!');
    }
  };

  // Calculate VI vs VH historical data (simulated for now)
  const viVhData = useMemo(() => {
    if (!bond) return [];
    
    const data = [];
    const today = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // VI (Implied Volatility) - simulate with some variation
      const vi = bond.impliedVol + (Math.random() - 0.5) * 3;
      
      // VH (Historical Volatility) - simulate with some variation
      const vh = bond.volatility + (Math.random() - 0.5) * 2;
      
      data.push({
        date: date.toISOString().split('T')[0],
        VI: parseFloat(vi.toFixed(2)),
        VH: parseFloat(vh.toFixed(2)),
      });
    }
    return data;
  }, [bond]);

  // Calculate richness/cheapness metrics
  const richnessMetrics = useMemo(() => {
    if (!bond) return null;
    
    // Vol spread = ImpVol (%) – VOLATILITY (input)
    const spreadVol = bond.impliedVol - bond.volatility;
    
    // Calculate average volatility spreads for all OCs where VEGA > 0.25
    let viTotal = 0;
    let nb = 0;
    for (let i = 0; i < mockConvertibleBonds.length; i++) {
      const bondItem = mockConvertibleBonds[i];
      if (bondItem.vega > 0.25 && bondItem.impliedVol !== null && bondItem.impliedVol !== undefined) {
        viTotal += (bondItem.impliedVol - bondItem.volatility);
        nb += 1;
      }
    }
    const avgSpreadVol = nb !== 0 ? viTotal / nb : 0;
    
    // Calculate standard deviation
    let summe = 0;
    for (let i = 0; i < mockConvertibleBonds.length; i++) {
      const bondItem = mockConvertibleBonds[i];
      if (bondItem.vega > 0.25 && bondItem.impliedVol !== null && bondItem.impliedVol !== undefined) {
        const ecart = (bondItem.impliedVol - bondItem.volatility);
        summe += Math.pow(ecart - avgSpreadVol, 2);
      }
    }
    const stdDev = nb !== 0 ? Math.sqrt(summe / nb) : 0;
    
    // Spread to average
    const spreadToAverage = spreadVol - avgSpreadVol;
    
    // Zscore
    const zscore = stdDev !== 0 ? spreadToAverage / stdDev : 0;
    
    // Downside risk (Vol spread * vega %)
    const downsideRisk = spreadVol > 0 ? spreadVol * (bond.vega * 100) : null;
    
    // Determine valuation based on Vol spread (from calcs.md)
    let valuation = '';
    let relativeValuation = '';
    if (spreadVol < 0) {
      relativeValuation = 'underpriced';
    } else if (spreadVol >= 0 && spreadVol < 4) {
      relativeValuation = 'fair value';
    } else if (spreadVol >= 4 && spreadVol < 8) {
      relativeValuation = 'overpriced';
    } else if (spreadVol > 8) {
      relativeValuation = 'expensive';
    }
    
    // Observation logic
    let observation = '';
    if (Math.abs(spreadToAverage) > 2) {
      if ((relativeValuation === 'fair value' || relativeValuation === 'underpriced') && 
          spreadToAverage < 0 && Math.abs(zscore) > 1) {
        observation = 'High probability of a rebound';
      } else if ((relativeValuation === 'overpriced' || relativeValuation === 'expensive') && 
                 spreadToAverage > 0 && Math.abs(zscore) > 1) {
        observation = 'High probability of downside';
      }
    }
    
    // Keep old valuation for display compatibility
    const relativeVal = bond.price - bond.fairValue;
    if (relativeVal < -5) valuation = 'Underpriced';
    else if (relativeVal > 5) valuation = 'Overpriced';
    else valuation = 'Fair';
    
    return {
      spread: bond.spread,
      impliedSpread: bond.impliedSpread || bond.spread + 50,
      valuation,
      spreadVol,
      avgSpreadVol,
      stdDev,
      relativeValuation: relativeVal,
      spreadToAverage,
      zscore,
      downsideRisk,
      relativeValuationText: relativeValuation,
      observation,
    };
  }, [bond]);

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
      {/* Fixed Header with Back Button */}
      <View
        className="dashboard-header"
        style={{
          position: 'fixed' as any,
          top: 0,
          left: isCollapsed ? 80 : 280,
          right: 0,
          zIndex: 1000,
          transition: 'left 0.4s ease',
        }}
      >
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
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
        </View>
      </View>
      
      <View
        style={{
          flex: 1,
          marginLeft: isCollapsed ? 80 : 280,
          height: '100vh',
          overflow: 'auto' as any,
          backgroundColor: colors.background,
        }}
      >
        <View style={{ gap: 32, paddingBottom: 40, paddingHorizontal: 24, paddingTop: 140 }}>

          {/* Main KPIs */}
          <View
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 20,
            }}
          >
            <KPICard
              title={t('kpi.price')}
              value={bond.price.toFixed(2)}
              delay={getStaggerDelay(0)}
            />
            <KPICard
              title={t('kpi.fair_value')}
              value={bond.fairValue.toFixed(2)}
              delay={getStaggerDelay(1)}
            />
            <KPICard
              title={t('kpi.delta')}
              value={bond.delta.toFixed(3)}
              delay={getStaggerDelay(2)}
            />
            <KPICard
              title={t('kpi.performance_1m')}
              value={formatPercentage(bond.performance1M)}
              trend={bond.performance1M}
              delay={getStaggerDelay(3)}
            />
          </View>

          {/* Performance Section - Enhanced */}
          <AnimatedCard delay={0.35} style={{
            background: `linear-gradient(135deg, ${colors.surfaceCard} 0%, ${colors.surface} 100%)`,
          }}>
            <Text
              style={{
                color: colors.accent,
                fontSize: parseInt(typography.fontSize.large),
                fontWeight: '600',
                fontFamily: typography.fontFamily.heading,
                marginBottom: 24,
              }}
            >
              Performance Overview
            </Text>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              <div style={{
                padding: '20px',
                backgroundColor: colors.surface,
                borderRadius: parseInt(colors.borderRadius.medium),
                borderLeft: `4px solid ${bond.performance1D && bond.performance1D >= 0 ? colors.success : colors.danger}`,
              }}>
                <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), marginBottom: 8 }}>
                  1 Day
                </Text>
                <Text style={{ 
                  color: bond.performance1D && bond.performance1D >= 0 ? colors.success : colors.danger, 
                  fontSize: parseInt(typography.fontSize.h3),
                  fontWeight: '700',
                }}>
                  {bond.performance1D !== null && bond.performance1D !== undefined ? formatPercentage(bond.performance1D) : 'N/A'}
                </Text>
              </div>
              <div style={{
                padding: '20px',
                backgroundColor: colors.surface,
                borderRadius: parseInt(colors.borderRadius.medium),
                borderLeft: `4px solid ${bond.performance1W >= 0 ? colors.success : colors.danger}`,
              }}>
                <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), marginBottom: 8 }}>
                  1 Week
                </Text>
                <Text style={{ 
                  color: bond.performance1W >= 0 ? colors.success : colors.danger, 
                  fontSize: parseInt(typography.fontSize.h3),
                  fontWeight: '700',
                }}>
                  {formatPercentage(bond.performance1W)}
                </Text>
              </div>
              <div style={{
                padding: '20px',
                backgroundColor: colors.surface,
                borderRadius: parseInt(colors.borderRadius.medium),
                borderLeft: `4px solid ${bond.performance1M >= 0 ? colors.success : colors.danger}`,
              }}>
                <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), marginBottom: 8 }}>
                  1 Month
                </Text>
                <Text style={{ 
                  color: bond.performance1M >= 0 ? colors.success : colors.danger, 
                  fontSize: parseInt(typography.fontSize.h3),
                  fontWeight: '700',
                }}>
                  {formatPercentage(bond.performance1M)}
                </Text>
              </div>
              <div style={{
                padding: '20px',
                backgroundColor: colors.surface,
                borderRadius: parseInt(colors.borderRadius.medium),
                borderLeft: `4px solid ${bond.performance3M >= 0 ? colors.success : colors.danger}`,
              }}>
                <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), marginBottom: 8 }}>
                  3 Months
                </Text>
                <Text style={{ 
                  color: bond.performance3M >= 0 ? colors.success : colors.danger, 
                  fontSize: parseInt(typography.fontSize.h3),
                  fontWeight: '700',
                }}>
                  {formatPercentage(bond.performance3M)}
                </Text>
              </div>
            </div>
          </AnimatedCard>

          {/* Main Content Grid */}
          <View
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
              gap: 24,
            }}
          >
            {/* Inputs Section */}
            <AnimatedCard delay={0.38}>
              <View style={{ gap: 16 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontSize: parseInt(typography.fontSize.large),
                    fontWeight: '600',
                    fontFamily: typography.fontFamily.heading,
                  }}
                >
                  Inputs
                </Text>

                <View style={{ gap: 12 }}>
                  <InputField
                    label="CB Price"
                    value={customCBPrice}
                    onChange={setCustomCBPrice}
                    placeholder={bond.price.toFixed(2)}
                    colors={colors}
                  />
                  <InputField
                    label="Spread"
                    value={customSpread}
                    onChange={setCustomSpread}
                    placeholder={bond.spread.toString()}
                    colors={colors}
                    suffix="bp"
                  />
                  <InputField
                    label="Volatility"
                    value={customVolatility}
                    onChange={setCustomVolatility}
                    placeholder={bond.volatility.toFixed(1)}
                    colors={colors}
                    suffix="%"
                  />
                  <InputField
                    label="Stock Price"
                    value={customStockPrice}
                    onChange={setCustomStockPrice}
                    placeholder={bond.stockPrice.toFixed(2)}
                    colors={colors}
                  />
                  <InputField
                    label="Repo"
                    value={customRepo}
                    onChange={setCustomRepo}
                    placeholder="0.0"
                    colors={colors}
                    suffix="%"
                  />
                </View>
              </View>
            </AnimatedCard>

            {/* Richness/Cheapness Metrics */}
            <AnimatedCard delay={0.39}>
              <View style={{ gap: 16 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontSize: parseInt(typography.fontSize.large),
                    fontWeight: '600',
                    fontFamily: typography.fontFamily.heading,
                  }}
                >
                  Richness / Cheapness
                </Text>

                {richnessMetrics && (
                  <View style={{ gap: 12 }}>
                    <MetricDisplayRow
                      label="VH"
                      value={bond.volatility.toFixed(1) + '%'}
                      colors={colors}
                    />
                    <MetricDisplayRow
                      label="VI"
                      value={bond.impliedVol.toFixed(1) + '%'}
                      colors={colors}
                    />
                    <MetricDisplayRow
                      label="Spread Vol"
                      value={richnessMetrics.spreadVol.toFixed(1) + '%'}
                      colors={colors}
                      highlight={Math.abs(richnessMetrics.spreadVol) > 3}
                    />
                    <MetricDisplayRow
                      label="Relative Valuation"
                      value={richnessMetrics.relativeValuation.toFixed(2)}
                      colors={colors}
                      highlight={true}
                    />
                    <MetricDisplayRow
                      label="Average Spread Vol"
                      value={richnessMetrics.avgSpreadVol.toFixed(1) + '%'}
                      colors={colors}
                    />
                    <MetricDisplayRow
                      label="Standard Deviation"
                      value={richnessMetrics.stdDev.toFixed(2)}
                      colors={colors}
                    />
                    <MetricDisplayRow
                      label="Spread to Average"
                      value={richnessMetrics.spreadToAverage.toFixed(2) + '%'}
                      colors={colors}
                    />
                    <MetricDisplayRow
                      label="Z-Score"
                      value={richnessMetrics.zscore.toFixed(2)}
                      colors={colors}
                      highlight={Math.abs(richnessMetrics.zscore) > 1}
                    />
                    {richnessMetrics.downsideRisk !== null && (
                      <MetricDisplayRow
                        label="Downside Risk"
                        value={richnessMetrics.downsideRisk.toFixed(2) + '%'}
                        colors={colors}
                        highlight={true}
                      />
                    )}
                  </View>
                )}
              </View>
            </AnimatedCard>

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

            {/* Richness Summary */}
            <AnimatedCard delay={0.41}>
              <View style={{ gap: 16 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontSize: parseInt(typography.fontSize.large),
                    fontWeight: '600',
                    fontFamily: typography.fontFamily.heading,
                  }}
                >
                  Richness / Cheapness Summary
                </Text>

                {richnessMetrics && (
                  <View style={{ gap: 16 }}>
                    <View style={{
                      padding: 16,
                      backgroundColor: colors.surface,
                      borderRadius: parseInt(colors.borderRadius.medium),
                      borderLeft: `4px solid ${colors.accent}`,
                    }}>
                      <Text style={{ 
                        color: colors.textSecondary, 
                        fontSize: parseInt(typography.fontSize.xsmall),
                        marginBottom: 8,
                      }}>
                        Spread
                      </Text>
                      <Text style={{ 
                        color: colors.textPrimary, 
                        fontSize: parseInt(typography.fontSize.h3),
                        fontWeight: '700',
                      }}>
                        {richnessMetrics.spread}
                      </Text>
                    </View>
                    <View style={{
                      padding: 16,
                      backgroundColor: colors.surface,
                      borderRadius: parseInt(colors.borderRadius.medium),
                      borderLeft: `4px solid ${colors.accent}`,
                    }}>
                      <Text style={{ 
                        color: colors.textSecondary, 
                        fontSize: parseInt(typography.fontSize.xsmall),
                        marginBottom: 8,
                      }}>
                        Implied Spread
                      </Text>
                      <Text style={{ 
                        color: colors.textPrimary, 
                        fontSize: parseInt(typography.fontSize.h3),
                        fontWeight: '700',
                      }}>
                        {richnessMetrics.impliedSpread}
                      </Text>
                    </View>
                    <View style={{
                      padding: 20,
                      backgroundColor: richnessMetrics.valuation === 'Underpriced' ? colors.success + '20' : 
                                      richnessMetrics.valuation === 'Overpriced' ? colors.danger + '20' : 
                                      colors.surface,
                      borderRadius: parseInt(colors.borderRadius.medium),
                      borderLeft: `4px solid ${
                        richnessMetrics.valuation === 'Underpriced' ? colors.success : 
                        richnessMetrics.valuation === 'Overpriced' ? colors.danger : 
                        colors.textSecondary
                      }`,
                      alignItems: 'center',
                    }}>
                      <Text style={{ 
                        color: colors.textSecondary, 
                        fontSize: parseInt(typography.fontSize.xsmall),
                        marginBottom: 8,
                      }}>
                        Valuation
                      </Text>
                      <Text style={{ 
                        color: richnessMetrics.valuation === 'Underpriced' ? colors.success : 
                               richnessMetrics.valuation === 'Overpriced' ? colors.danger : 
                               colors.textPrimary,
                        fontSize: parseInt(typography.fontSize.large),
                        fontWeight: '700',
                        textTransform: 'uppercase' as any,
                      }}>
                        {richnessMetrics.valuation}
                      </Text>
                    </View>
                    {richnessMetrics.observation && (
                      <View style={{
                        padding: 16,
                        backgroundColor: richnessMetrics.observation.includes('rebound') ? colors.success + '15' : colors.danger + '15',
                        borderRadius: parseInt(colors.borderRadius.medium),
                        borderLeft: `4px solid ${richnessMetrics.observation.includes('rebound') ? colors.success : colors.danger}`,
                      }}>
                        <Text style={{ 
                          color: colors.textSecondary, 
                          fontSize: parseInt(typography.fontSize.xsmall),
                          marginBottom: 8,
                        }}>
                          Observation
                        </Text>
                        <Text style={{ 
                          color: colors.textPrimary,
                          fontSize: parseInt(typography.fontSize.small),
                          fontWeight: '600',
                        }}>
                          {richnessMetrics.observation}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
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
            {/* VI vs VH Chart */}
            <AnimatedCard delay={0.55}>
              <View style={{ gap: 16 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontSize: parseInt(typography.fontSize.large),
                    fontWeight: '600',
                    fontFamily: typography.fontFamily.heading,
                  }}
                >
                  VI vs VH
                </Text>

                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={viVhData} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
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
                      dataKey="VI"
                      stroke={colors.chartColors.blue}
                      dot={false}
                      strokeWidth={3}
                      name="Implied Vol"
                    />
                    <Line
                      type="monotone"
                      dataKey="VH"
                      stroke={colors.chartColors.cyan}
                      dot={false}
                      strokeWidth={3}
                      name="Historical Vol"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </View>
            </AnimatedCard>

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
                  <InputField
                    label="CB Price"
                    value={customCBPrice}
                    onChange={setCustomCBPrice}
                    placeholder={bond.price.toFixed(2)}
                    colors={colors}
                  />
                </View>

                <View style={{ gap: 8 }}>
                  <InputField
                    label="Spread (bp)"
                    value={customSpread}
                    onChange={setCustomSpread}
                    placeholder={bond.spread.toString()}
                    colors={colors}
                    suffix="bp"
                  />
                </View>

                <View style={{ gap: 8 }}>
                  <InputField
                    label="Volatility (%)"
                    value={customVolatility}
                    onChange={setCustomVolatility}
                    placeholder={bond.volatility.toFixed(1)}
                    colors={colors}
                    suffix="%"
                  />
                </View>

                <View style={{ gap: 8 }}>
                  <InputField
                    label="Stock Price"
                    value={customStockPrice}
                    onChange={setCustomStockPrice}
                    placeholder={bond.stockPrice.toFixed(2)}
                    colors={colors}
                  />
                </View>

                <View style={{ gap: 8 }}>
                  <InputField
                    label="Repo (%)"
                    value={customRepo}
                    onChange={setCustomRepo}
                    placeholder="0.0"
                    colors={colors}
                    suffix="%"
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
      
      {/* AI Agent Bubble */}
      <AIAgentBubble />
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

const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  colors: any;
  suffix?: string;
}> = ({ label, value, onChange, placeholder, colors, suffix }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{
        color: colors.textPrimary,
        fontSize: parseInt(typography.fontSize.small),
        fontWeight: '600',
        fontFamily: typography.fontFamily.body,
      }}>
        {label}
      </Text>
      <button
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: colors.accent + '20',
          color: colors.accent,
          border: 'none',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Manual input"
      >
        m
      </button>
    </div>
    <div style={{ position: 'relative' }}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 12px',
          paddingRight: suffix ? '40px' : '12px',
          backgroundColor: colors.surface,
          color: colors.textPrimary,
          border: `1px solid ${colors.border}`,
          borderRadius: parseInt(colors.borderRadius.small),
          fontSize: parseInt(typography.fontSize.default),
          fontFamily: typography.fontFamily.body,
          outline: 'none',
        }}
      />
      {suffix && (
        <span style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: colors.textSecondary,
          fontSize: parseInt(typography.fontSize.small),
          pointerEvents: 'none',
        }}>
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const MetricDisplayRow: React.FC<{
  label: string;
  value: string;
  colors: any;
  highlight?: boolean;
}> = ({ label, value, colors, highlight = false }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: highlight ? colors.accent + '10' : colors.surface,
    borderRadius: parseInt(colors.borderRadius.small),
    borderLeft: highlight ? `3px solid ${colors.accent}` : '3px solid transparent',
  }}>
    <Text style={{
      color: colors.textSecondary,
      fontSize: parseInt(typography.fontSize.small),
      fontWeight: '500',
      fontFamily: typography.fontFamily.body,
    }}>
      {label}
    </Text>
    <Text style={{
      color: highlight ? colors.accent : colors.textPrimary,
      fontSize: parseInt(typography.fontSize.default),
      fontWeight: '700',
      fontFamily: typography.fontFamily.heading,
    }}>
      {value}
    </Text>
  </div>
);

