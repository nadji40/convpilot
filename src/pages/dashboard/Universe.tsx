import React, { useState, useMemo, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { darkColors, lightColors, typography } from '../../theme';
import { useTheme, useSidebar, useLanguage } from '../../contexts/AppContext';
import { DashboardHeader } from '../../components/DashboardHeader';
import { SearchBar } from '../../components/SearchBar';
import { FilterPanel } from '../../components/FilterPanel';
import { DataTable, Column } from '../../components/DataTable';
import { AIAgentBubble } from '../../components/AIAgentBubble';
import { mockConvertibleBonds } from '../../data/mockData';
import { ConvertibleBond } from '../../data/dataLoader';
import {
  filterBonds,
  sortBonds,
  paginateData,
  formatPercentage,
  exportToCSV,
  getUniqueSectors,
  getUniqueCountries,
  getUniqueCurrencies,
  getUniqueRatingGroups,
  getEnhancedBondMetrics,
  BondWithEnhancedMetrics,
} from '../../utils/dataUtils';

export const Universe: React.FC = () => {
  const { isDark } = useTheme();
  const { isCollapsed } = useSidebar();
  const { t } = useLanguage();
  const colors = isDark ? darkColors : lightColors;
  const navigate = useNavigate();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Sort state
  const [sortKey, setSortKey] = useState<string>('issuer');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Apply theme class to body
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.className = isDark ? '' : 'light-theme';
    }
  }, [isDark]);

  // Get unique values for filters
  const sectors = getUniqueSectors(mockConvertibleBonds);
  const countries = getUniqueCountries(mockConvertibleBonds);
  const currencies = getUniqueCurrencies(mockConvertibleBonds);
  const ratingGroups = getUniqueRatingGroups();

  // Get enhanced bond metrics with volatility analysis
  const enhancedBonds = useMemo(() => {
    return getEnhancedBondMetrics(mockConvertibleBonds);
  }, []);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = filterBonds(enhancedBonds, {
      search: searchQuery,
      sector: selectedSectors,
      country: selectedCountries,
      rating: selectedRatings,
      currency: selectedCurrencies,
    });

    result = sortBonds(result, sortKey as keyof ConvertibleBond, sortDirection);

    return result;
  }, [enhancedBonds, searchQuery, selectedSectors, selectedCountries, selectedRatings, selectedCurrencies, sortKey, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    return paginateData(filteredData, currentPage, pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSectors, selectedCountries, selectedRatings, selectedCurrencies]);

  // Handle row click
  const handleRowClick = (bond: BondWithEnhancedMetrics) => {
    navigate(`/dashboard/instrument/${bond.isin}`);
  };

  // Handle sort
  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  // Handle export
  const handleExport = () => {
    exportToCSV(filteredData, `convertible-bonds-${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Table columns with enhanced volatility metrics
  const columns: Column<BondWithEnhancedMetrics>[] = [
    {
      key: 'isin',
      title: 'ISIN',
      width: '8%',
      render: (value) => (
        <Text style={{ color: colors.accent, fontWeight: '600', fontSize: parseInt(typography.fontSize.small) }}>
          {value}
        </Text>
      ),
    },
    {
      key: 'issuer',
      title: 'Issuer',
      width: '12%',
      render: (value) => (
        <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: parseInt(typography.fontSize.small) }}>
          {value}
        </Text>
      ),
    },
    {
      key: 'sector',
      title: 'Sector',
      width: '10%',
      render: (value) => (
        <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small) }}>{value}</Text>
      ),
    },
    {
      key: 'price',
      title: 'Price',
      width: '6%',
      align: 'right',
      render: (value) => (
        <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: parseInt(typography.fontSize.small) }}>
          {value.toFixed(2)}
        </Text>
      ),
    },
    {
      key: 'delta',
      title: 'Delta',
      width: '6%',
      align: 'right',
      render: (value) => (
        <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.small) }}>
          {value.toFixed(3)}
        </Text>
      ),
    },
    {
      key: 'vega',
      title: 'Vega',
      width: '6%',
      align: 'right',
      render: (value, row) => (
        <Text style={{ 
          color: value > 0.25 ? colors.textPrimary : colors.textSecondary, 
          fontSize: parseInt(typography.fontSize.small),
          fontWeight: value > 0.25 ? '600' : '400'
        }}>
          {value.toFixed(3)}
        </Text>
      ),
    },
    {
      key: 'enhancedMetrics.volSpread' as any,
      title: 'Vol Spread',
      width: '7%',
      align: 'right',
      render: (value, row) => {
        const volSpread = (row as BondWithEnhancedMetrics).enhancedMetrics.volSpread;
        if (volSpread === null) return <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.xsmall) }}>N/A</Text>;
        return (
          <Text style={{ 
            color: volSpread < 0 ? colors.success : volSpread >= 8 ? colors.danger : volSpread >= 4 ? colors.warn : colors.textPrimary,
            fontWeight: '600',
            fontSize: parseInt(typography.fontSize.small) 
          }}>
            {volSpread.toFixed(2)}%
          </Text>
        );
      },
    },
    {
      key: 'enhancedMetrics.relativeSituation' as any,
      title: 'Situation',
      width: '9%',
      align: 'center',
      render: (value, row) => {
        const situation = (row as BondWithEnhancedMetrics).enhancedMetrics.relativeSituation;
        if (!situation) return null;
        const bgColor = situation === 'underpriced' ? colors.success + '20' :
                       situation === 'expensive' ? colors.danger + '30' :
                       situation === 'overpriced' ? colors.warn + '20' :
                       colors.textSecondary + '20';
        const textColor = situation === 'underpriced' ? colors.success :
                         situation === 'expensive' ? colors.danger :
                         situation === 'overpriced' ? colors.warn :
                         colors.textSecondary;
        return (
          <View style={{ backgroundColor: bgColor, padding: '4px 8px', borderRadius: parseInt(colors.borderRadius.small) }}>
            <Text style={{ color: textColor, fontWeight: '600', fontSize: parseInt(typography.fontSize.xsmall) }}>
              {situation}
            </Text>
          </View>
        );
      },
    },
    {
      key: 'enhancedMetrics.downsideRisk' as any,
      title: 'Downside Risk',
      width: '8%',
      align: 'right',
      render: (value, row) => {
        const risk = (row as BondWithEnhancedMetrics).enhancedMetrics.downsideRisk;
        if (risk === null) return <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.xsmall) }}>-</Text>;
        return (
          <Text style={{ 
            color: risk > 1.5 ? colors.danger : risk > 0.5 ? colors.warn : colors.textPrimary,
            fontWeight: '600',
            fontSize: parseInt(typography.fontSize.small) 
          }}>
            {risk.toFixed(2)}%
          </Text>
        );
      },
    },
    {
      key: 'enhancedMetrics.zScore' as any,
      title: 'Z-Score',
      width: '7%',
      align: 'right',
      render: (value, row) => {
        const zScore = (row as BondWithEnhancedMetrics).enhancedMetrics.zScore;
        if (zScore === null) return <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.xsmall) }}>N/A</Text>;
        const absZScore = Math.abs(zScore);
        return (
          <Text style={{ 
            color: absZScore > 2 ? colors.danger : absZScore > 1 ? colors.warn : colors.textPrimary,
            fontWeight: absZScore > 1 ? '600' : '400',
            fontSize: parseInt(typography.fontSize.small) 
          }}>
            {zScore.toFixed(2)}
          </Text>
        );
      },
    },
    {
      key: 'rating',
      title: 'Rating',
      width: '7%',
      align: 'center',
      render: (value) => (
        <View
          style={{
            backgroundColor: value.startsWith('A') ? colors.success + '30' : value.startsWith('B') ? colors.warn + '30' : colors.danger + '30',
            padding: '4px 8px',
            borderRadius: parseInt(colors.borderRadius.small),
          }}
        >
          <Text
            style={{
              color: value.startsWith('A') ? colors.success : value.startsWith('B') ? colors.warn : colors.danger,
              fontWeight: '600',
              fontSize: parseInt(typography.fontSize.xsmall),
            }}
          >
            {value}
          </Text>
        </View>
      ),
    },
    {
      key: 'performance1M',
      title: 'Perf 1M',
      width: '8%',
      align: 'right',
      render: (value) => (
        <Text
          style={{
            color: value >= 0 ? colors.success : colors.danger,
            fontWeight: '600',
            fontSize: parseInt(typography.fontSize.small),
          }}
        >
          {formatPercentage(value)}
        </Text>
      ),
    },
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
        title={t('dashboard.universe')}
        description={`${filteredData.length} ${t('of')} ${enhancedBonds.length} ${t('dashboard.universe_desc')}`}
      />
      
      <View
        style={{
          flex: 1,
          marginLeft: isCollapsed ? 80 : 280,
          padding: 24,
          paddingTop: 100, // Add padding for fixed header
          height: '100vh',
          overflow: 'auto' as any,
          backgroundColor: colors.background,
        }}
      >
        <View style={{ gap: 24, paddingBottom: 40 }}>
          {/* Export Button Section */}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <button
              onClick={handleExport}
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
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 11V3M8 11L5 8M8 11l3-3M2 13h12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t('button.export_csv')}
            </button>
          </View>

          {/* Search Bar */}
            <SearchBar
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={setSearchQuery}
              suggestions={enhancedBonds.map((b) => b.issuer)}
            />

          {/* Filters and Table */}
          <View style={{ flexDirection: 'row', gap: 24 }}>
            {/* Filters Sidebar */}
            <View style={{ width: 280, gap: 16, flexShrink: 0 }}>
              <FilterPanel
                title="Sector"
                options={sectors.map((s) => ({
                  label: s,
                  value: s,
                  count: enhancedBonds.filter((b) => b.sector === s).length,
                }))}
                selectedValues={selectedSectors}
                onChange={setSelectedSectors}
                defaultCollapsed={false}
              />

              <FilterPanel
                title="Country"
                options={countries.map((c) => ({
                  label: c,
                  value: c,
                  count: enhancedBonds.filter((b) => b.country === c).length,
                }))}
                selectedValues={selectedCountries}
                onChange={setSelectedCountries}
              />

              <FilterPanel
                title="Rating"
                options={ratingGroups.map((r) => ({
                  label: r === 'Investment Grade' ? 'Investment Grade' : r === 'High Yield' ? 'High Yield' : 'Not Rated',
                  value: r,
                }))}
                selectedValues={selectedRatings}
                onChange={setSelectedRatings}
              />

              <FilterPanel
                title="Currency"
                options={currencies.map((c) => ({
                  label: c,
                  value: c,
                  count: enhancedBonds.filter((b) => b.currency === c).length,
                }))}
                selectedValues={selectedCurrencies}
                onChange={setSelectedCurrencies}
              />
            </View>

            {/* Data Table */}
            <View style={{ flex: 1 }}>
              <DataTable
                columns={columns}
                data={paginatedData}
                onRowClick={handleRowClick}
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={filteredData.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            </View>
          </View>
        </View>
      </View>
      
      {/* AI Agent Bubble */}
      <AIAgentBubble />
    </View>
  );
};

