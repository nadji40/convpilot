import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { darkColors, lightColors, typography } from '../../theme';
import { useTheme, useSidebar } from '../../contexts/AppContext';
import { DashboardHeader } from '../../components/DashboardHeader';
import { ChartCard } from '../../components/ChartCard';
import { KPICard } from '../../components/KPICard';
import { DataTable } from '../../components/DataTable';

export const PerformanceAttribution: React.FC = () => {
  const { isDark } = useTheme();
  const { isCollapsed } = useSidebar();
  const colors = isDark ? darkColors : lightColors;
  const [selectedPeriod, setSelectedPeriod] = useState<'1M' | '3M' | '6M' | '1Y' | 'YTD'>('1M');

  // Mock data for performance attribution
  const marketPerformance = {
    overallReturn: 5.8,
    trend: 'up' as const,
    benchmark: 4.2,
    alpha: 1.6,
    volatility: 12.3,
    sharpeRatio: 1.45,
  };

  const portfolioPerformance = {
    totalReturn: 6.5,
    trend: 'up' as const,
    assetAllocation: 85.2,
    activeBets: 12,
    trackingError: 2.1,
    informationRatio: 0.76,
  };

  const cbPerformance = [
    { isin: 'FR0014005WB7', name: 'TotalEnergies 0.875% 2028', return: 8.2, contribution: 1.2, weight: 12.5, trend: 'up' as const },
    { isin: 'DE000A2E4MK4', name: 'Volkswagen 0.5% 2027', return: 6.8, contribution: 0.9, weight: 10.8, trend: 'up' as const },
    { isin: 'XS2314779427', name: 'Schneider 0% 2026', return: 5.4, contribution: 0.7, weight: 9.2, trend: 'up' as const },
    { isin: 'US0378331005', name: 'Apple 0.25% 2029', return: 4.1, contribution: 0.5, weight: 8.7, trend: 'up' as const },
    { isin: 'FR0010040865', name: 'Sanofi 0.125% 2027', return: -2.3, contribution: -0.3, weight: 7.5, trend: 'down' as const },
  ];

  const attributionFactors = [
    { factor: 'Sector Allocation', contribution: 1.2, percentage: 37.5 },
    { factor: 'Security Selection', contribution: 0.9, percentage: 28.1 },
    { factor: 'Currency Effect', contribution: 0.3, percentage: 9.4 },
    { factor: 'Interaction Effect', contribution: 0.2, percentage: 6.3 },
    { factor: 'Other', contribution: 0.6, percentage: 18.7 },
  ];

  const periodButtons = ['1M', '3M', '6M', '1Y', 'YTD'] as const;

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        marginLeft: isCollapsed ? 80 : 280,
        transition: 'margin-left 0.4s ease',
      }}
    >
      <View
        style={{
          padding: 32,
          maxWidth: 1600,
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
        }}
      >
        <DashboardHeader
          title="Performance Attribution"
          description="Comprehensive analysis of portfolio and market performance drivers"
        />

        {/* Period Selection */}
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            marginBottom: 24,
            padding: 16,
            backgroundColor: colors.surface,
            borderRadius: parseInt(colors.borderRadius.large),
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            style={{
              fontSize: parseInt(typography.fontSize.default),
              fontWeight: '600',
              color: colors.textSecondary,
              fontFamily: typography.fontFamily.body,
              marginRight: 12,
              alignSelf: 'center',
            }}
          >
            Period:
          </Text>
          {periodButtons.map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setSelectedPeriod(period)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: parseInt(colors.borderRadius.medium),
                backgroundColor: selectedPeriod === period ? colors.accent : 'transparent',
                borderWidth: 1,
                borderColor: selectedPeriod === period ? colors.accent : colors.border,
                transition: 'all 0.3s ease',
              }}
            >
              <Text
                style={{
                  fontSize: parseInt(typography.fontSize.small),
                  fontWeight: selectedPeriod === period ? '600' : '400',
                  color: selectedPeriod === period ? '#ffffff' : colors.textSecondary,
                  fontFamily: typography.fontFamily.body,
                }}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Market Performance Section */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: parseInt(typography.fontSize.h4),
              fontWeight: '700',
              color: colors.textPrimary,
              fontFamily: typography.fontFamily.heading,
              marginBottom: 16,
            }}
          >
            Market Performance Analysis
          </Text>

          <View
            style={{
              flexDirection: 'row',
              gap: 16,
              flexWrap: 'wrap',
              marginBottom: 24,
            }}
          >
            <View style={{ flex: 1, minWidth: 200 }}>
              <KPICard
                title="Overall Market Return"
                value={`${marketPerformance.overallReturn}%`}
                trend={marketPerformance.trend}
                change={marketPerformance.overallReturn}
                subtitle={`Benchmark: ${marketPerformance.benchmark}%`}
              />
            </View>
            <View style={{ flex: 1, minWidth: 200 }}>
              <KPICard
                title="Alpha"
                value={`${marketPerformance.alpha}%`}
                trend="up"
                change={marketPerformance.alpha}
                subtitle="Excess return vs benchmark"
              />
            </View>
            <View style={{ flex: 1, minWidth: 200 }}>
              <KPICard
                title="Volatility"
                value={`${marketPerformance.volatility}%`}
                trend="neutral"
                subtitle="Annualized standard deviation"
              />
            </View>
            <View style={{ flex: 1, minWidth: 200 }}>
              <KPICard
                title="Sharpe Ratio"
                value={marketPerformance.sharpeRatio.toFixed(2)}
                trend="up"
                change={marketPerformance.sharpeRatio}
                subtitle="Risk-adjusted return"
              />
            </View>
          </View>

          <ChartCard
            title="Market Performance Trend"
            subtitle={`Analysis for ${selectedPeriod} period`}
            chartType="line"
            height={300}
          />
        </View>

        {/* Portfolio Performance Section */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: parseInt(typography.fontSize.h4),
              fontWeight: '700',
              color: colors.textPrimary,
              fontFamily: typography.fontFamily.heading,
              marginBottom: 16,
            }}
          >
            Portfolio Performance
          </Text>

          <View
            style={{
              flexDirection: 'row',
              gap: 16,
              flexWrap: 'wrap',
              marginBottom: 24,
            }}
          >
            <View style={{ flex: 1, minWidth: 200 }}>
              <KPICard
                title="Total Portfolio Return"
                value={`${portfolioPerformance.totalReturn}%`}
                trend={portfolioPerformance.trend}
                change={portfolioPerformance.totalReturn}
                subtitle={`Outperformance: +${(portfolioPerformance.totalReturn - marketPerformance.benchmark).toFixed(1)}%`}
              />
            </View>
            <View style={{ flex: 1, minWidth: 200 }}>
              <KPICard
                title="Asset Allocation"
                value={`${portfolioPerformance.assetAllocation}%`}
                trend="neutral"
                subtitle="Invested capital"
              />
            </View>
            <View style={{ flex: 1, minWidth: 200 }}>
              <KPICard
                title="Tracking Error"
                value={`${portfolioPerformance.trackingError}%`}
                trend="neutral"
                subtitle="Deviation from benchmark"
              />
            </View>
            <View style={{ flex: 1, minWidth: 200 }}>
              <KPICard
                title="Information Ratio"
                value={portfolioPerformance.informationRatio.toFixed(2)}
                trend="up"
                change={portfolioPerformance.informationRatio}
                subtitle="Active return per unit risk"
              />
            </View>
          </View>

          {/* Attribution Factors */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: parseInt(colors.borderRadius.large),
              borderWidth: 1,
              borderColor: colors.border,
              padding: 24,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: parseInt(typography.fontSize.large),
                fontWeight: '700',
                color: colors.textPrimary,
                fontFamily: typography.fontFamily.heading,
                marginBottom: 16,
              }}
            >
              Performance Attribution Factors
            </Text>

            {attributionFactors.map((factor, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 16,
                  paddingBottom: index < attributionFactors.length - 1 ? 16 : 0,
                  borderBottomWidth: index < attributionFactors.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: parseInt(typography.fontSize.default),
                      fontWeight: '600',
                      color: colors.textPrimary,
                      fontFamily: typography.fontFamily.body,
                      marginBottom: 4,
                    }}
                  >
                    {factor.factor}
                  </Text>
                  <View
                    style={{
                      height: 8,
                      backgroundColor: colors.surfaceCard,
                      borderRadius: 4,
                      overflow: 'hidden',
                      width: '100%',
                      maxWidth: 400,
                    }}
                  >
                    <View
                      style={{
                        height: '100%',
                        width: `${factor.percentage}%`,
                        backgroundColor: colors.accent,
                        borderRadius: 4,
                      }}
                    />
                  </View>
                </View>
                <View style={{ marginLeft: 16, alignItems: 'flex-end' }}>
                  <Text
                    style={{
                      fontSize: parseInt(typography.fontSize.large),
                      fontWeight: '700',
                      color: colors.accent,
                      fontFamily: typography.fontFamily.heading,
                    }}
                  >
                    +{factor.contribution}%
                  </Text>
                  <Text
                    style={{
                      fontSize: parseInt(typography.fontSize.small),
                      color: colors.textMuted,
                      fontFamily: typography.fontFamily.body,
                    }}
                  >
                    {factor.percentage.toFixed(1)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Individual CB Performance Section */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: parseInt(typography.fontSize.h4),
              fontWeight: '700',
              color: colors.textPrimary,
              fontFamily: typography.fontFamily.heading,
              marginBottom: 16,
            }}
          >
            Individual Convertible Bond Performance
          </Text>

          <DataTable
            columns={[
              { key: 'isin', label: 'ISIN', width: '15%' },
              { key: 'name', label: 'Name', width: '30%' },
              { key: 'return', label: 'Return', width: '15%', align: 'right' },
              { key: 'contribution', label: 'Contribution', width: '15%', align: 'right' },
              { key: 'weight', label: 'Weight', width: '15%', align: 'right' },
              { key: 'trend', label: 'Trend', width: '10%', align: 'center' },
            ]}
            data={cbPerformance.map(cb => ({
              ...cb,
              return: (
                <Text
                  style={{
                    color: cb.return >= 0 ? colors.success : colors.error,
                    fontWeight: '600',
                    fontFamily: typography.fontFamily.body,
                  }}
                >
                  {cb.return >= 0 ? '+' : ''}{cb.return}%
                </Text>
              ),
              contribution: (
                <Text
                  style={{
                    color: cb.contribution >= 0 ? colors.success : colors.error,
                    fontWeight: '600',
                    fontFamily: typography.fontFamily.body,
                  }}
                >
                  {cb.contribution >= 0 ? '+' : ''}{cb.contribution}%
                </Text>
              ),
              weight: `${cb.weight}%`,
              trend: (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: cb.trend === 'up' ? colors.success : colors.error,
                  }}
                />
              ),
            }))}
            pageSize={5}
            enableSearch
            enableSort
          />
        </View>
      </View>
    </ScrollView>
  );
};
