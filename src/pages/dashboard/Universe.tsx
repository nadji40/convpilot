import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { darkColors, lightColors, typography } from '../../theme';
import { useTheme, useSidebar, useLanguage } from '../../contexts/AppContext';
import { DashboardHeader } from '../../components/DashboardHeader';
import { AIAgentBubble } from '../../components/AIAgentBubble';
import { mockConvertibleBonds } from '../../data/mockData';
import { ConvertibleBond } from '../../data/dataLoader';
import { formatPercentage, formatCurrency } from '../../utils/dataUtils';

export const Universe: React.FC = () => {
  const { isDark } = useTheme();
  const { isCollapsed } = useSidebar();
  const { language } = useLanguage();
  const colors = isDark ? darkColors : lightColors;

  const [selectedBond, setSelectedBond] = useState<ConvertibleBond | null>(null);

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

  const handleBondSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const isin = event.target.value;
    const bond = mockConvertibleBonds.find(b => b.isin === isin);
    setSelectedBond(bond || null);
  };

  const InfoRow = ({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) => (
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: `1px solid ${colors.border}`,
    }}>
      <Text style={{ 
        color: colors.textSecondary, 
        fontSize: parseInt(typography.fontSize.default),
        fontFamily: typography.fontFamily.body,
      }}>
        {label}
      </Text>
      <Text style={{ 
        color: highlight ? colors.accent : colors.textPrimary,
        fontSize: parseInt(typography.fontSize.default),
        fontWeight: highlight ? '700' : '600',
        fontFamily: typography.fontFamily.body,
      }}>
        {value}
      </Text>
    </View>
  );

  const SectionTitle = ({ title }: { title: string }) => (
    <Text style={{
      color: colors.accent,
      fontSize: parseInt(typography.fontSize.large),
      fontWeight: '700',
      fontFamily: typography.fontFamily.heading,
      marginTop: 32,
      marginBottom: 16,
    }}>
      {title}
    </Text>
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
        <View style={{ maxWidth: 1200, paddingBottom: 40 }}>
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
            <select
              value={selectedBond?.isin || ''}
              onChange={handleBondSelect}
              style={{
                width: '100%',
                padding: '14px 16px',
                backgroundColor: colors.surfaceCard,
                color: colors.textPrimary,
                border: `1px solid ${colors.border}`,
                borderRadius: parseInt(colors.borderRadius.medium),
                fontSize: parseInt(typography.fontSize.default),
                fontFamily: typography.fontFamily.body,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="">
                {language === 'fr' ? '-- Choisir une obligation --' : '-- Choose a bond --'}
              </option>
              {sortedBonds.map(bond => (
                <option key={bond.isin} value={bond.isin}>
                  {bond.issuer} ({bond.isin})
                </option>
              ))}
            </select>
          </View>

          {/* Bond Details */}
          {selectedBond && (
            <View style={{ gap: 24 }}>
              {/* Issue Characteristics Card */}
              <View style={{
                backgroundColor: colors.surfaceCard,
                borderRadius: parseInt(colors.borderRadius.large),
                padding: 24,
                border: `1px solid ${colors.border}`,
              }}>
                <SectionTitle title={language === 'fr' ? 'Caractéristiques de l\'émission' : 'Issue Characteristics'} />
                
                <InfoRow label={language === 'fr' ? 'Nominal' : 'Nominal'} value={selectedBond.nominal} />
                <InfoRow label={language === 'fr' ? 'Ratio de conversion' : 'Conversion Ratio'} value={selectedBond.conversionRatio.toFixed(4)} />
                <InfoRow label={language === 'fr' ? 'Prix de conversion' : 'Conversion Price'} value={selectedBond.conversionPrice.toFixed(2)} />
                <InfoRow label={language === 'fr' ? 'Prix d\'émission' : 'Issue Price'} value={selectedBond.issuePrice.toFixed(2)} />
                <InfoRow label={language === 'fr' ? 'Coupon' : 'Coupon'} value={`${selectedBond.coupon.toFixed(2)}%`} />
                <InfoRow label={language === 'fr' ? 'Date d\'émission' : 'Issue Date'} value={selectedBond.issueDate} />
                <InfoRow label={language === 'fr' ? 'Date d\'échéance' : 'Maturity Date'} value={selectedBond.maturity} />
                <InfoRow label={language === 'fr' ? 'Montant émis' : 'Amount Issued'} value={formatCurrency(selectedBond.amountIssued, selectedBond.currency)} />
                <InfoRow label={language === 'fr' ? 'Devise' : 'Currency'} value={selectedBond.currency} />
                <InfoRow label={language === 'fr' ? 'Notation' : 'Rating'} value={selectedBond.rating} />
                <InfoRow label={language === 'fr' ? 'Sous-jacent' : 'Underlying'} value={selectedBond.underlyingTicker || 'N/A'} />
              </View>

              {/* Call & Put Options Card */}
              <View style={{
                backgroundColor: colors.surfaceCard,
                borderRadius: parseInt(colors.borderRadius.large),
                padding: 24,
                border: `1px solid ${colors.border}`,
              }}>
                <SectionTitle title={language === 'fr' ? 'Options Call & Put' : 'Call & Put Options'} />
                
                <View style={{ marginBottom: 24 }}>
                  <Text style={{
                    color: colors.textPrimary,
                    fontSize: parseInt(typography.fontSize.default),
                    fontWeight: '700',
                    marginBottom: 12,
                    fontFamily: typography.fontFamily.body,
                  }}>
                    {language === 'fr' ? 'CALL' : 'CALL'}
                  </Text>
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
                    value={selectedBond.callTrigger ? `${selectedBond.callTrigger.toFixed(2)}%` : 'N/A'} 
                  />
                  <InfoRow 
                    label={language === 'fr' ? 'Distance au déclencheur' : 'Distance to Trigger'} 
                    value={selectedBond.callTrigger ? `${(selectedBond.parityPercent - selectedBond.callTrigger).toFixed(2)}%` : 'N/A'} 
                  />
                </View>

                <View>
                  <Text style={{
                    color: colors.textPrimary,
                    fontSize: parseInt(typography.fontSize.default),
                    fontWeight: '700',
                    marginBottom: 12,
                    fontFamily: typography.fontFamily.body,
                  }}>
                    {language === 'fr' ? 'PUT' : 'PUT'}
                  </Text>
                  <InfoRow 
                    label={language === 'fr' ? 'Date de put' : 'Put Date'} 
                    value={selectedBond.putDate || 'N/A'} 
                  />
                  <InfoRow 
                    label={language === 'fr' ? 'Prix de put' : 'Put Price'} 
                    value={selectedBond.putPrice ? selectedBond.putPrice.toFixed(2) : 'N/A'} 
                  />
                  <InfoRow 
                    label={language === 'fr' ? 'YTM à put (Bloomberg field)' : 'YTM to put (Bloomberg field)'} 
                    value="N/A" 
                  />
                </View>
              </View>

              {/* Pricing & Greeks Card */}
              <View style={{
                backgroundColor: colors.surfaceCard,
                borderRadius: parseInt(colors.borderRadius.large),
                padding: 24,
                border: `1px solid ${colors.border}`,
              }}>
                <SectionTitle title={language === 'fr' ? 'Prix & Grecques' : 'Pricing & Greeks'} />
                
                <InfoRow label={language === 'fr' ? 'Prix CB' : 'CB Price'} value={selectedBond.price.toFixed(2)} highlight />
                <InfoRow label={language === 'fr' ? 'Valeur théorique' : 'Fair Value'} value={selectedBond.theoValue.toFixed(2)} />
                <InfoRow label={language === 'fr' ? 'Valeur option' : 'Option Value'} value={(selectedBond.price - selectedBond.bondfloorPercent).toFixed(2)} />
                <InfoRow label={language === 'fr' ? 'Delta' : 'Delta'} value={`${(selectedBond.delta * 100).toFixed(2)}%`} />
                <InfoRow label={language === 'fr' ? 'Gamma' : 'Gamma'} value={selectedBond.gamma.toFixed(4)} />
                <InfoRow label={language === 'fr' ? 'Vega' : 'Vega'} value={selectedBond.vega.toFixed(4)} />
                <InfoRow label={language === 'fr' ? 'Rho' : 'Rho'} value={selectedBond.rho !== null ? selectedBond.rho.toFixed(4) : 'N/A'} />
                <InfoRow label={language === 'fr' ? 'Theta' : 'Theta'} value={selectedBond.theta.toFixed(4)} />
              </View>

              {/* Sensitivities Card */}
              <View style={{
                backgroundColor: colors.surfaceCard,
                borderRadius: parseInt(colors.borderRadius.large),
                padding: 24,
                border: `1px solid ${colors.border}`,
              }}>
                <SectionTitle title={language === 'fr' ? 'Sensibilités' : 'Sensitivities'} />
                
                <InfoRow label={language === 'fr' ? 'Prix de l\'action' : 'Stock Price'} value={selectedBond.stockPrice.toFixed(2)} />
                <InfoRow label={language === 'fr' ? 'Volatilité historique' : 'Historical Volatility'} value={`${selectedBond.volatility.toFixed(2)}%`} />
                <InfoRow label={language === 'fr' ? 'Volatilité implicite' : 'Implied Volatility'} value={`${selectedBond.impliedVol.toFixed(2)}%`} />
                <InfoRow label={language === 'fr' ? 'Spread vol' : 'Vol Spread'} value={`${(selectedBond.impliedVol - selectedBond.volatility).toFixed(2)}%`} />
                <InfoRow label={language === 'fr' ? 'Repo' : 'Repo'} value="N/A" />
              </View>

              {/* Valuation Card */}
              <View style={{
                backgroundColor: colors.surfaceCard,
                borderRadius: parseInt(colors.borderRadius.large),
                padding: 24,
                border: `1px solid ${colors.border}`,
              }}>
                <SectionTitle title={language === 'fr' ? 'Valorisation' : 'Valuation'} />
                
                <InfoRow label={language === 'fr' ? 'Relative Valorisation' : 'Relative Valuation'} value={(selectedBond.price - selectedBond.theoValue).toFixed(2)} />
                <InfoRow label={language === 'fr' ? 'Spread vol' : 'Vol Spread'} value={`${(selectedBond.impliedVol - selectedBond.volatility).toFixed(2)}%`} />
                <InfoRow label={language === 'fr' ? 'Spread vol moyen' : 'Average Vol Spread'} value="N/A" />
                <InfoRow label={language === 'fr' ? 'Écart type standard' : 'Standard Deviation'} value="N/A" />
              </View>

              {/* Profitability Card */}
              <View style={{
                backgroundColor: colors.surfaceCard,
                borderRadius: parseInt(colors.borderRadius.large),
                padding: 24,
                border: `1px solid ${colors.border}`,
              }}>
                <SectionTitle title={language === 'fr' ? 'Richesse/Bon marché' : 'Richness/Cheapness'} />
                
                <InfoRow label={language === 'fr' ? 'VH' : 'VH'} value={`${selectedBond.volatility.toFixed(2)}%`} />
                <InfoRow label={language === 'fr' ? 'VI' : 'VI'} value={`${selectedBond.impliedVol.toFixed(2)}%`} />
                <InfoRow label={language === 'fr' ? 'SPREAD VOL' : 'SPREAD VOL'} value={`${(selectedBond.impliedVol - selectedBond.volatility).toFixed(2)}%`} />
                <InfoRow label={language === 'fr' ? 'Valorisation relative' : 'Relative Valuation'} value={(selectedBond.price - selectedBond.theoValue).toFixed(2)} />
                <InfoRow label={language === 'fr' ? 'Spread vol moyen' : 'Average Spread Vol'} value="N/A" />
                <InfoRow label={language === 'fr' ? 'Écart type standard' : 'Standard Deviation'} value="N/A" />
                <InfoRow label={language === 'fr' ? 'Spread implicite' : 'Implied Spread'} value={`${selectedBond.impliedSpread.toFixed(2)}`} />
                <InfoRow label={language === 'fr' ? 'Spread implicite' : 'Implied Spread'} value={`${selectedBond.impliedSpread.toFixed(2)}`} />
                <InfoRow label={language === 'fr' ? 'Valorisation' : 'Valuation'} value={selectedBond.valuation !== null ? formatPercentage(selectedBond.valuation) : 'N/A'} />
              </View>
            </View>
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

