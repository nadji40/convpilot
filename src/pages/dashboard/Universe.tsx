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

          {/* Bond Details in Grid Layout */}
          {selectedBond && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px',
            }}>
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

              {/* Performance */}
              <WidgetCard fullWidth>
                <CardTitle title={language === 'fr' ? 'Performance' : 'Performance'} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                  <div>
                    <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small), marginBottom: 8 }}>
                      {language === 'fr' ? '1 Jour' : '1 Day'}
                    </Text>
                    <Text style={{ 
                      color: selectedBond.performance1D && selectedBond.performance1D >= 0 ? colors.success : colors.danger, 
                      fontSize: parseInt(typography.fontSize.large),
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
                      fontSize: parseInt(typography.fontSize.large),
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
                      fontSize: parseInt(typography.fontSize.large),
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
                      fontSize: parseInt(typography.fontSize.large),
                      fontWeight: '700',
                    }}>
                      {formatPercentage(selectedBond.performance3M)}
                    </Text>
                  </div>
                </div>
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
