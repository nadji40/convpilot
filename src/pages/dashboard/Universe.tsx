import React, { useState, useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import { darkColors, lightColors, typography } from '../../theme';
import { useTheme, useSidebar, useLanguage } from '../../contexts/AppContext';
import { DashboardHeader } from '../../components/DashboardHeader';
import { AIAgentBubble } from '../../components/AIAgentBubble';
import { SearchableSelect } from '../../components/SearchableSelect';
import { mockConvertibleBonds } from '../../data/mockData';
import { ConvertibleBond } from '../../data/dataLoader';
import { formatPercentage, formatCurrency } from '../../utils/dataUtils';
import { 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

export const Universe: React.FC = () => {
  const { isDark } = useTheme();
  const { isCollapsed } = useSidebar();
  const { language } = useLanguage();
  const colors = isDark ? darkColors : lightColors;

  const [selectedBond, setSelectedBond] = useState<ConvertibleBond | null>(null);
  
  // Custom input states
  const [customCBPrice, setCustomCBPrice] = useState('');
  const [customSpread, setCustomSpread] = useState('');
  const [customVolatility, setCustomVolatility] = useState('');
  const [customStockPrice, setCustomStockPrice] = useState('');
  const [customRepo, setCustomRepo] = useState('');

  // Apply theme class to body
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.className = isDark ? '' : 'light-theme';
    }
  }, [isDark]);

  // Sort bonds alphabetically by issuer for dropdown
  const sortedBonds = [...mockConvertibleBonds].sort((a, b) => 
    a.issuer.localeCompare(b.issuer)
  );

  const bondOptions = sortedBonds.map(bond => ({
    value: bond.isin,
    label: `${bond.issuer} (${bond.isin})`
  }));

  const handleBondSelect = (isin: string) => {
    const bond = mockConvertibleBonds.find(b => b.isin === isin);
    setSelectedBond(bond || null);
    // Reset custom inputs when bond changes
    setCustomCBPrice('');
    setCustomSpread('');
    setCustomVolatility('');
    setCustomStockPrice('');
    setCustomRepo('');
  };

  // Calculate VI vs VH historical data (simulated for now)
  const viVhData = useMemo(() => {
    if (!selectedBond) return [];
    
    const data = [];
    const today = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // VI (Implied Volatility) - simulate with some variation
      const vi = selectedBond.impliedVol + (Math.random() - 0.5) * 3;
      
      // VH (Historical Volatility) - simulate with some variation
      const vh = selectedBond.volatility + (Math.random() - 0.5) * 2;
      
      data.push({
        date: date.toISOString().split('T')[0],
        VI: parseFloat(vi.toFixed(2)),
        VH: parseFloat(vh.toFixed(2)),
      });
    }
    return data;
  }, [selectedBond]);

  // Calculate richness/cheapness metrics
  const richnessMetrics = useMemo(() => {
    if (!selectedBond) return null;
    
    // Vol spread = ImpVol (%) – VOLATILITY (input)
    const spreadVol = selectedBond.impliedVol - selectedBond.volatility;
    
    // Calculate average volatility spreads for all OCs where VEGA > 0.25
    let viTotal = 0;
    let nb = 0;
    for (let i = 0; i < mockConvertibleBonds.length; i++) {
      const bond = mockConvertibleBonds[i];
      if (bond.vega > 0.25 && bond.impliedVol !== null && bond.impliedVol !== undefined) {
        viTotal += (bond.impliedVol - bond.volatility);
        nb += 1;
      }
    }
    const avgSpreadVol = nb !== 0 ? viTotal / nb : 0;
    
    // Calculate standard deviation
    let summe = 0;
    for (let i = 0; i < mockConvertibleBonds.length; i++) {
      const bond = mockConvertibleBonds[i];
      if (bond.vega > 0.25 && bond.impliedVol !== null && bond.impliedVol !== undefined) {
        const ecart = (bond.impliedVol - bond.volatility);
        summe += Math.pow(ecart - avgSpreadVol, 2);
      }
    }
    const stdDev = nb !== 0 ? Math.sqrt(summe / nb) : 0;
    
    // Spread to average
    const spreadToAverage = spreadVol - avgSpreadVol;
    
    // Zscore
    const zscore = stdDev !== 0 ? spreadToAverage / stdDev : 0;
    
    // Downside risk (Vol spread * vega %)
    const downsideRisk = spreadVol > 0 ? spreadVol * (selectedBond.vega * 100) : null;
    
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
    const relativeVal = selectedBond.price - selectedBond.fairValue;
    if (relativeVal < -5) valuation = 'Underpriced';
    else if (relativeVal > 5) valuation = 'Overpriced';
    else valuation = 'Fair';
    
    return {
      spread: selectedBond.spread,
      impliedSpread: selectedBond.impliedSpread || selectedBond.spread + 50,
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
  }, [selectedBond]);

  // Safe format helper
  const safeFormat = (value: any, decimals: number = 2, suffix: string = ''): string => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return `${Number(value).toFixed(decimals)}${suffix}`;
  };

  const InfoRow = ({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) => (
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: `1px solid ${colors.border}20`,
    }}>
        <Text style={{ 
        color: colors.textSecondary, 
          fontSize: parseInt(typography.fontSize.small),
        fontFamily: typography.fontFamily.body,
        }}>
        {label}
        </Text>
          <Text style={{ 
        color: highlight ? colors.accent : colors.textPrimary,
        fontSize: parseInt(typography.fontSize.small),
        fontWeight: highlight ? '700' : '600',
        fontFamily: typography.fontFamily.body,
      }}>
        {value}
            </Text>
          </View>
        );

  const CardTitle = ({ title }: { title: string }) => (
          <Text style={{ 
      color: colors.accent,
      fontSize: parseInt(typography.fontSize.medium),
      fontWeight: '700',
      fontFamily: typography.fontFamily.heading,
      marginBottom: 20,
      paddingBottom: 12,
      borderBottom: `2px solid ${colors.accent}30`,
    }}>
      {title}
          </Text>
        );

  const WidgetCard = ({ children, fullWidth = false }: { children: React.ReactNode; fullWidth?: boolean }) => (
    <View style={{
      backgroundColor: colors.surfaceCard,
      borderRadius: parseInt(colors.borderRadius.large),
      padding: 24,
      border: `1px solid ${colors.border}`,
      gridColumn: fullWidth ? 'span 2' : 'span 1',
    }}>
      {children}
    </View>
  );

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
        title={language === 'fr' ? "Profil d'OC" : "CB Profile"}
        description={language === 'fr' ? "Détails complets de l'obligation convertible" : "Complete convertible bond details"}
      />
      
      <View
        style={{
          flex: 1,
          marginLeft: isCollapsed ? 80 : 280,
          padding: 24,
          paddingTop: 100,
          height: '100vh',
          overflow: 'auto' as any,
          backgroundColor: colors.background,
        }}
      >
        <View style={{ maxWidth: 1600, paddingBottom: 40 }}>
          {/* Dropdown Selector */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{
              color: colors.textPrimary,
              fontSize: parseInt(typography.fontSize.default),
              fontWeight: '600',
              marginBottom: 12,
              fontFamily: typography.fontFamily.body,
            }}>
              {language === 'fr' ? 'Sélectionner une obligation convertible' : 'Select Convertible Bond'}
            </Text>
            <SearchableSelect
              options={bondOptions}
              value={selectedBond?.isin || ''}
              onChange={handleBondSelect}
              placeholder={language === 'fr' ? '-- Choisir une obligation --' : '-- Choose a bond --'}
            />
          </View>

          {/* Performance Section - At the Top */}
          {selectedBond && (
            <div style={{
              marginBottom: 32,
            }}>
              <WidgetCard fullWidth>
                <CardTitle title={language === 'fr' ? 'Performance' : 'Performance'} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                  <div>
                    <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), marginBottom: 8 }}>
                      {language === 'fr' ? '1 Jour' : '1 Day'}
                    </Text>
                    <Text style={{ 
                      color: selectedBond.performance1D && selectedBond.performance1D >= 0 ? colors.success : colors.danger, 
                      fontSize: parseInt(typography.fontSize.h3),
                      fontWeight: '700',
                    }}>
                      {selectedBond.performance1D !== null && selectedBond.performance1D !== undefined ? formatPercentage(selectedBond.performance1D) : 'N/A'}
                    </Text>
                  </div>
                  <div>
                    <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), marginBottom: 8 }}>
                      {language === 'fr' ? '1 Semaine' : '1 Week'}
                    </Text>
                    <Text style={{ 
                      color: selectedBond.performance1W >= 0 ? colors.success : colors.danger, 
                      fontSize: parseInt(typography.fontSize.h3),
                      fontWeight: '700',
                    }}>
                      {formatPercentage(selectedBond.performance1W)}
                    </Text>
                  </div>
                  <div>
                    <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), marginBottom: 8 }}>
                      {language === 'fr' ? '1 Mois' : '1 Month'}
                    </Text>
                    <Text style={{ 
                      color: selectedBond.performance1M >= 0 ? colors.success : colors.danger, 
                      fontSize: parseInt(typography.fontSize.h3),
                      fontWeight: '700',
                    }}>
                      {formatPercentage(selectedBond.performance1M)}
                    </Text>
                  </div>
                  <div>
                    <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), marginBottom: 8 }}>
                      {language === 'fr' ? '3 Mois' : '3 Months'}
                    </Text>
                    <Text style={{ 
                      color: selectedBond.performance3M >= 0 ? colors.success : colors.danger, 
                      fontSize: parseInt(typography.fontSize.h3),
                      fontWeight: '700',
                    }}>
                      {formatPercentage(selectedBond.performance3M)}
                    </Text>
                  </div>
                </div>
              </WidgetCard>
            </div>
          )}

          {/* Bond Details in Grid Layout */}
          {selectedBond && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px',
            }}>
              {/* Inputs Section */}
              <WidgetCard>
                <CardTitle title={language === 'fr' ? 'Entrées' : 'Inputs'} />
                <div style={{ display: 'grid', gap: '16px' }}>
                  <InputField
                    label={language === 'fr' ? 'Prix CB' : 'CB Price'}
                    value={customCBPrice}
                    onChange={setCustomCBPrice}
                    placeholder={selectedBond.price.toFixed(2)}
                    colors={colors}
                  />
                  <InputField
                    label="Spread"
                    value={customSpread}
                    onChange={setCustomSpread}
                    placeholder={selectedBond.spread.toString()}
                    colors={colors}
                    suffix="bp"
                  />
                  <InputField
                    label={language === 'fr' ? 'Volatilité' : 'Volatility'}
                    value={customVolatility}
                    onChange={setCustomVolatility}
                    placeholder={selectedBond.volatility.toFixed(1)}
                    colors={colors}
                    suffix="%"
                  />
                  <InputField
                    label={language === 'fr' ? 'Prix de l\'action' : 'Stock Price'}
                    value={customStockPrice}
                    onChange={setCustomStockPrice}
                    placeholder={selectedBond.stockPrice.toFixed(2)}
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
                </div>
              </WidgetCard>

              {/* Richness/Cheapness Metrics */}
              <WidgetCard>
                <CardTitle title={language === 'fr' ? 'Richesse/Bon marché' : 'Richness/Cheapness'} />
                {richnessMetrics && (
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <MetricDisplay
                      label="VH"
                      value={selectedBond.volatility.toFixed(1) + '%'}
                      colors={colors}
                    />
                    <MetricDisplay
                      label="VI"
                      value={selectedBond.impliedVol.toFixed(1) + '%'}
                      colors={colors}
                    />
                    <MetricDisplay
                      label="Spread Vol"
                      value={richnessMetrics.spreadVol.toFixed(1) + '%'}
                      colors={colors}
                      highlight={Math.abs(richnessMetrics.spreadVol) > 3}
                    />
                    <MetricDisplay
                      label={language === 'fr' ? 'Valorisation relative' : 'Relative Valuation'}
                      value={richnessMetrics.relativeValuation.toFixed(2)}
                      colors={colors}
                      highlight={true}
                    />
                    <MetricDisplay
                      label={language === 'fr' ? 'Spread vol moyen' : 'Average Spread Vol'}
                      value={richnessMetrics.avgSpreadVol.toFixed(1) + '%'}
                      colors={colors}
                    />
                    <MetricDisplay
                      label={language === 'fr' ? 'Écart-type' : 'Standard Deviation'}
                      value={richnessMetrics.stdDev.toFixed(2)}
                      colors={colors}
                    />
                    <MetricDisplay
                      label={language === 'fr' ? 'Spread à moyenne' : 'Spread to Average'}
                      value={richnessMetrics.spreadToAverage.toFixed(2) + '%'}
                      colors={colors}
                    />
                    <MetricDisplay
                      label="Z-Score"
                      value={richnessMetrics.zscore.toFixed(2)}
                      colors={colors}
                      highlight={Math.abs(richnessMetrics.zscore) > 1}
                    />
                    {richnessMetrics.downsideRisk !== null && (
                      <MetricDisplay
                        label={language === 'fr' ? 'Risque baissier' : 'Downside Risk'}
                        value={richnessMetrics.downsideRisk.toFixed(2) + '%'}
                        colors={colors}
                        highlight={true}
                      />
                    )}
                  </div>
                )}
              </WidgetCard>

              {/* Richness Summary */}
              <WidgetCard>
                <CardTitle title={language === 'fr' ? 'Résumé Richesse/Bon marché' : 'Richness/Cheapness Summary'} />
                {richnessMetrics && (
                  <div style={{ display: 'grid', gap: '20px' }}>
                    <div style={{
                      padding: '16px',
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
                    </div>
                    <div style={{
                      padding: '16px',
                      backgroundColor: colors.surface,
                      borderRadius: parseInt(colors.borderRadius.medium),
                      borderLeft: `4px solid ${colors.accent}`,
                    }}>
                      <Text style={{ 
                        color: colors.textSecondary, 
                        fontSize: parseInt(typography.fontSize.xsmall),
                        marginBottom: 8,
                      }}>
                        {language === 'fr' ? 'Spread implicite' : 'Implied Spread'}
                      </Text>
                      <Text style={{ 
                        color: colors.textPrimary, 
                        fontSize: parseInt(typography.fontSize.h3),
                        fontWeight: '700',
                      }}>
                        {richnessMetrics.impliedSpread}
                      </Text>
                    </div>
                    <div style={{
                      padding: '20px',
                      backgroundColor: richnessMetrics.valuation === 'Underpriced' ? colors.success + '20' : 
                                      richnessMetrics.valuation === 'Overpriced' ? colors.danger + '20' : 
                                      colors.surface,
                      borderRadius: parseInt(colors.borderRadius.medium),
                      borderLeft: `4px solid ${
                        richnessMetrics.valuation === 'Underpriced' ? colors.success : 
                        richnessMetrics.valuation === 'Overpriced' ? colors.danger : 
                        colors.textSecondary
                      }`,
                      textAlign: 'center',
                    }}>
                      <Text style={{ 
                        color: colors.textSecondary, 
                        fontSize: parseInt(typography.fontSize.xsmall),
                        marginBottom: 8,
                      }}>
                        {language === 'fr' ? 'Valorisation' : 'Valuation'}
                      </Text>
                      <Text style={{ 
                        color: richnessMetrics.valuation === 'Underpriced' ? colors.success : 
                               richnessMetrics.valuation === 'Overpriced' ? colors.danger : 
                               colors.textPrimary,
                        fontSize: parseInt(typography.fontSize.large),
                        fontWeight: '700',
                        textTransform: 'uppercase',
                      }}>
                        {richnessMetrics.valuation}
                      </Text>
                    </div>
                    {richnessMetrics.observation && (
                      <div style={{
                        padding: '16px',
                        backgroundColor: richnessMetrics.observation.includes('rebound') ? colors.success + '15' : colors.danger + '15',
                        borderRadius: parseInt(colors.borderRadius.medium),
                        borderLeft: `4px solid ${richnessMetrics.observation.includes('rebound') ? colors.success : colors.danger}`,
                      }}>
                        <Text style={{ 
                          color: colors.textSecondary, 
                          fontSize: parseInt(typography.fontSize.xsmall),
                          marginBottom: 8,
                        }}>
                          {language === 'fr' ? 'Observation' : 'Observation'}
                        </Text>
                        <Text style={{ 
                          color: colors.textPrimary,
                          fontSize: parseInt(typography.fontSize.small),
                          fontWeight: '600',
                        }}>
                          {richnessMetrics.observation}
                        </Text>
                      </div>
                    )}
                  </div>
                )}
              </WidgetCard>

              {/* VI vs VH Chart */}
              <WidgetCard>
                <CardTitle title="VI vs VH" />
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={viVhData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                    <XAxis 
                      dataKey="date" 
                      stroke={colors.muted}
                      tick={{ fill: colors.textSecondary, fontSize: 11 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis 
                      stroke={colors.muted}
                      tick={{ fill: colors.textSecondary, fontSize: 12 }}
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
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="VI" 
                      stroke={colors.chartColors.blue}
                      strokeWidth={3}
                      dot={false}
                      name="Implied Vol"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="VH" 
                      stroke={colors.chartColors.cyan}
                      strokeWidth={3}
                      dot={false}
                      name="Historical Vol"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </WidgetCard>
              {/* Issue Characteristics */}
              <WidgetCard>
                <CardTitle title={language === 'fr' ? 'Caractéristiques de l\'émission' : 'Issue Characteristics'} />
                <InfoRow label={language === 'fr' ? 'Nominal' : 'Nominal'} value={selectedBond.nominal || 'N/A'} />
                <InfoRow label={language === 'fr' ? 'Ratio de conversion' : 'Conversion Ratio'} value={safeFormat(selectedBond.conversionRatio, 4)} />
                <InfoRow label={language === 'fr' ? 'Prix de conversion' : 'Conversion Price'} value={safeFormat(selectedBond.conversionPrice, 2)} />
                <InfoRow label={language === 'fr' ? 'Prix d\'émission' : 'Issue Price'} value={safeFormat(selectedBond.issuePrice, 2)} />
                <InfoRow label={language === 'fr' ? 'Coupon' : 'Coupon'} value={safeFormat(selectedBond.coupon, 2, '%')} />
                <InfoRow label={language === 'fr' ? 'Date d\'émission' : 'Issue Date'} value={selectedBond.issueDate || 'N/A'} />
                <InfoRow label={language === 'fr' ? 'Date d\'échéance' : 'Maturity Date'} value={selectedBond.maturity || 'N/A'} />
                <InfoRow label={language === 'fr' ? 'Montant émis' : 'Amount Issued'} value={selectedBond.amountIssued ? formatCurrency(selectedBond.amountIssued, selectedBond.currency) : 'N/A'} />
                <InfoRow label={language === 'fr' ? 'Devise' : 'Currency'} value={selectedBond.currency || 'N/A'} />
                <InfoRow label={language === 'fr' ? 'Notation' : 'Rating'} value={selectedBond.rating || 'N/A'} />
                <InfoRow label={language === 'fr' ? 'Sous-jacent' : 'Underlying'} value={selectedBond.underlyingTicker || 'N/A'} />
              </WidgetCard>

              {/* Pricing & Greeks */}
              <WidgetCard>
                <CardTitle title={language === 'fr' ? 'Prix & Grecques' : 'Pricing & Greeks'} />
                <InfoRow label={language === 'fr' ? 'Prix CB' : 'CB Price'} value={safeFormat(selectedBond.price, 2)} highlight />
                <InfoRow label={language === 'fr' ? 'Valeur théorique' : 'Fair Value'} value={safeFormat(selectedBond.theoValue, 2)} />
                <InfoRow label={language === 'fr' ? 'Valeur option' : 'Option Value'} value={safeFormat(selectedBond.price - selectedBond.bondfloorPercent, 2)} />
                <InfoRow label={language === 'fr' ? 'Parité' : 'Parity'} value={safeFormat(selectedBond.parityPercent, 2, '%')} />
                <InfoRow label={language === 'fr' ? 'Prime' : 'Premium'} value={safeFormat(selectedBond.prime, 2, '%')} />
                <InfoRow label={language === 'fr' ? 'Delta' : 'Delta'} value={safeFormat(selectedBond.delta * 100, 2, '%')} />
                <InfoRow label={language === 'fr' ? 'Gamma' : 'Gamma'} value={safeFormat(selectedBond.gamma, 4)} />
                <InfoRow label={language === 'fr' ? 'Vega' : 'Vega'} value={safeFormat(selectedBond.vega, 4)} />
                <InfoRow label={language === 'fr' ? 'Rho' : 'Rho'} value={selectedBond.rho !== null && selectedBond.rho !== undefined ? safeFormat(selectedBond.rho, 4) : 'N/A'} />
                <InfoRow label={language === 'fr' ? 'Theta' : 'Theta'} value={safeFormat(selectedBond.theta, 4)} />
              </WidgetCard>

              {/* Call Options */}
              <WidgetCard>
                <CardTitle title={language === 'fr' ? 'Options CALL' : 'CALL Options'} />
                <InfoRow 
                  label={language === 'fr' ? 'Date de début' : 'Start Date'} 
                  value={selectedBond.callFirstDate || 'N/A'} 
                />
                <InfoRow 
                  label={language === 'fr' ? 'Date de fin' : 'End Date'} 
                  value={selectedBond.callSecondDate || 'N/A'} 
                />
                <InfoRow 
                  label={language === 'fr' ? 'Déclencheur' : 'Trigger'} 
                  value={selectedBond.callTrigger ? safeFormat(selectedBond.callTrigger, 2, '%') : 'N/A'} 
                />
                <InfoRow 
                  label={language === 'fr' ? 'Distance au déclencheur' : 'Distance to Trigger'} 
                  value={selectedBond.callTrigger && selectedBond.parityPercent ? safeFormat(selectedBond.parityPercent - selectedBond.callTrigger, 2, '%') : 'N/A'} 
                />
                <InfoRow 
                  label={language === 'fr' ? 'Prix de call' : 'Call Price'} 
                  value={selectedBond.callPrice ? safeFormat(selectedBond.callPrice, 2) : 'N/A'} 
                />
              </WidgetCard>

              {/* Put Options */}
              <WidgetCard>
                <CardTitle title={language === 'fr' ? 'Options PUT' : 'PUT Options'} />
                <InfoRow 
                  label={language === 'fr' ? 'Putable' : 'Is Putable'} 
                  value={selectedBond.isPutable ? (language === 'fr' ? 'Oui' : 'Yes') : (language === 'fr' ? 'Non' : 'No')} 
                />
                <InfoRow 
                  label={language === 'fr' ? 'Date de put' : 'Put Date'} 
                  value={selectedBond.putDate || 'N/A'} 
                />
                <InfoRow 
                  label={language === 'fr' ? 'Prix de put' : 'Put Price'} 
                  value={selectedBond.putPrice ? safeFormat(selectedBond.putPrice, 2) : 'N/A'} 
                />
                <InfoRow 
                  label={language === 'fr' ? 'YTM à put' : 'YTM to put'} 
                  value="N/A" 
                />
              </WidgetCard>

              {/* Volatility & Sensitivities */}
              <WidgetCard>
                <CardTitle title={language === 'fr' ? 'Volatilité & Sensibilités' : 'Volatility & Sensitivities'} />
                <InfoRow label={language === 'fr' ? 'Prix de l\'action' : 'Stock Price'} value={safeFormat(selectedBond.stockPrice, 2)} />
                <InfoRow label={language === 'fr' ? 'Volatilité historique' : 'Historical Volatility'} value={safeFormat(selectedBond.volatility, 2, '%')} />
                <InfoRow label={language === 'fr' ? 'Volatilité implicite' : 'Implied Volatility'} value={safeFormat(selectedBond.impliedVol, 2, '%')} />
                <InfoRow label={language === 'fr' ? 'Spread vol' : 'Vol Spread'} value={selectedBond.impliedVol && selectedBond.volatility ? safeFormat(selectedBond.impliedVol - selectedBond.volatility, 2, '%') : 'N/A'} />
                <InfoRow label={language === 'fr' ? 'Sensibilité actions' : 'Equity Sensitivity'} value={safeFormat(selectedBond.equitySensitivity, 2, '%')} />
                <InfoRow label={language === 'fr' ? 'Convexité +20%' : 'Convexity +20%'} value={safeFormat(selectedBond.cnvPlus20, 2)} />
                <InfoRow label={language === 'fr' ? 'Convexité -20%' : 'Convexity -20%'} value={safeFormat(selectedBond.cnvMinus20, 2)} />
              </WidgetCard>

              {/* Credit Metrics */}
              <WidgetCard>
                <CardTitle title={language === 'fr' ? 'Métriques de crédit' : 'Credit Metrics'} />
                <InfoRow label={language === 'fr' ? 'YTM' : 'YTM'} value={safeFormat(selectedBond.ytm, 2, '%')} />
                <InfoRow label={language === 'fr' ? 'Rendement courant' : 'Current Yield'} value={safeFormat(selectedBond.currentYield, 2, '%')} />
                <InfoRow label={language === 'fr' ? 'Spread' : 'Spread'} value={safeFormat(selectedBond.spread, 2, ' bps')} />
                <InfoRow label={language === 'fr' ? 'Spread de crédit' : 'Credit Spread'} value={safeFormat(selectedBond.creditSpread, 2, ' bps')} />
                <InfoRow label={language === 'fr' ? 'Spread implicite' : 'Implied Spread'} value={safeFormat(selectedBond.impliedSpread, 2, ' bps')} />
                <InfoRow label={language === 'fr' ? 'Durée' : 'Duration'} value={selectedBond.duration !== null && selectedBond.duration !== undefined ? safeFormat(selectedBond.duration, 2) : 'N/A'} />
                <InfoRow label={language === 'fr' ? 'Sensibilité crédit' : 'Credit Sensitivity'} value={selectedBond.creditSensitivity !== null && selectedBond.creditSensitivity !== undefined ? safeFormat(selectedBond.creditSensitivity, 2) : 'N/A'} />
              </WidgetCard>

              {/* Downside Protection */}
              <WidgetCard>
                <CardTitle title={language === 'fr' ? 'Protection à la baisse' : 'Downside Protection'} />
                <InfoRow label={language === 'fr' ? 'Bondfloor' : 'Bondfloor'} value={safeFormat(selectedBond.bondfloor, 2)} />
                <InfoRow label={language === 'fr' ? 'Bondfloor %' : 'Bondfloor %'} value={safeFormat(selectedBond.bondfloorPercent, 2, '%')} />
                <InfoRow label={language === 'fr' ? 'Distance au bondfloor' : 'Distance to Bondfloor'} value={safeFormat(selectedBond.distanceToBondfloor, 2, '%')} />
                <InfoRow label={language === 'fr' ? 'Prix de rédemption' : 'Redemption Price'} value={safeFormat(selectedBond.redemptionPrice, 2)} />
                <InfoRow label={language === 'fr' ? 'Prime ajustée' : 'Adjusted Premium'} value={safeFormat(selectedBond.adjustedPrime, 2, '%')} />
                <InfoRow label={language === 'fr' ? 'PNA ajusté' : 'Adjusted PNA'} value={safeFormat(selectedBond.adjustedPna, 2, '%')} />
              </WidgetCard>

              {/* Valuation */}
              <WidgetCard>
                <CardTitle title={language === 'fr' ? 'Valorisation' : 'Valuation'} />
                <InfoRow label={language === 'fr' ? 'Valorisation relative' : 'Relative Valuation'} value={safeFormat(selectedBond.price - selectedBond.theoValue, 2)} />
                <InfoRow label={language === 'fr' ? 'Spread vol' : 'Vol Spread'} value={selectedBond.impliedVol && selectedBond.volatility ? safeFormat(selectedBond.impliedVol - selectedBond.volatility, 2, '%') : 'N/A'} />
                <InfoRow label={language === 'fr' ? 'Profil' : 'Profile'} value={selectedBond.profile || 'N/A'} />
                <InfoRow label={language === 'fr' ? 'Taille' : 'Size'} value={selectedBond.size || 'N/A'} />
                <InfoRow label={language === 'fr' ? 'Type' : 'Type'} value={selectedBond.type || 'N/A'} />
              </WidgetCard>
            </div>
          )}

          {!selectedBond && (
            <View style={{
              backgroundColor: colors.surfaceCard,
              borderRadius: parseInt(colors.borderRadius.large),
              padding: 48,
              border: `1px solid ${colors.border}`,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{
                color: colors.textSecondary,
                fontSize: parseInt(typography.fontSize.large),
                fontFamily: typography.fontFamily.body,
                textAlign: 'center',
              }}>
                {language === 'fr' 
                  ? 'Sélectionnez une obligation convertible pour voir ses détails'
                  : 'Select a convertible bond to view its details'}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      {/* AI Agent Bubble */}
      <AIAgentBubble />
    </View>
  );
};

// Helper Components
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

const MetricDisplay: React.FC<{
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
