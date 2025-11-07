import React, { useState, useMemo, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { darkColors, lightColors, typography } from '../../theme';
import { useTheme, useSidebar, useLanguage } from '../../contexts/AppContext';
import { DashboardHeader } from '../../components/DashboardHeader';
import { AIChat } from '../../components/AIChat';
import { SearchBar } from '../../components/SearchBar';
import { FilterPanel } from '../../components/FilterPanel';
import { DataTable, Column } from '../../components/DataTable';
import { mockConvertibleBonds, ConvertibleBond } from '../../data/mockData';
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

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = filterBonds(mockConvertibleBonds, {
      search: searchQuery,
      sector: selectedSectors,
      country: selectedCountries,
      rating: selectedRatings,
      currency: selectedCurrencies,
    });

    result = sortBonds(result, sortKey as keyof ConvertibleBond, sortDirection);

    return result;
  }, [searchQuery, selectedSectors, selectedCountries, selectedRatings, selectedCurrencies, sortKey, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    return paginateData(filteredData, currentPage, pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSectors, selectedCountries, selectedRatings, selectedCurrencies]);

  // Handle row click
  const handleRowClick = (bond: ConvertibleBond) => {
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

  // Table columns
  const columns: Column<ConvertibleBond>[] = [
    {
      key: 'isin',
      title: 'ISIN',
      width: '10%',
      render: (value) => (
        <Text style={{ color: colors.accent, fontWeight: '600', fontSize: parseInt(typography.fontSize.small) }}>
          {value}
        </Text>
      ),
    },
    {
      key: 'issuer',
      title: 'Issuer',
      width: '18%',
      render: (value) => (
        <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: parseInt(typography.fontSize.small) }}>
          {value}
        </Text>
      ),
    },
    {
      key: 'sector',
      title: 'Sector',
      width: '12%',
      render: (value) => (
        <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small) }}>{value}</Text>
      ),
    },
    {
      key: 'currency',
      title: 'Currency',
      width: '8%',
      align: 'center',
      render: (value) => (
        <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.small) }}>{value}</Text>
      ),
    },
    {
      key: 'coupon',
      title: 'Coupon',
      width: '8%',
      align: 'right',
      render: (value) => (
        <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.small) }}>
          {value.toFixed(2)}%
        </Text>
      ),
    },
    {
      key: 'price',
      title: 'Price',
      width: '8%',
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
      width: '8%',
      align: 'right',
      render: (value) => (
        <Text style={{ color: colors.textPrimary, fontSize: parseInt(typography.fontSize.small) }}>
          {value.toFixed(3)}
        </Text>
      ),
    },
    {
      key: 'rating',
      title: 'Rating',
      width: '8%',
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
      key: 'maturity',
      title: 'Maturity',
      width: '10%',
      render: (value) => (
        <Text style={{ color: colors.textSecondary, fontSize: parseInt(typography.fontSize.xsmall) }}>{value}</Text>
      ),
    },
    {
      key: 'performance1M',
      title: 'Perf 1M',
      width: '10%',
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
      <View
        style={{
          flex: 1,
          marginLeft: isCollapsed ? 80 : 280,
          height: '100vh',
          overflow: 'auto' as any,
          backgroundColor: colors.background,
        }}
      >
        {/* Fixed Header */}
        <View
          style={{
            position: 'sticky' as any,
            top: 0,
            zIndex: 10,
            backgroundColor: colors.background,
            paddingHorizontal: 24,
            paddingTop: 24,
          }}
        >
          <DashboardHeader 
            title={t('dashboard.universe')}
            description={`${filteredData.length} ${t('of')} ${mockConvertibleBonds.length} ${t('dashboard.universe_desc')}`}
          />
        </View>

        <View style={{ gap: 24, paddingBottom: 40, paddingHorizontal: 24 }}>
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
            placeholder="Search by ISIN, issuer, or country..."
            value={searchQuery}
            onChange={setSearchQuery}
            suggestions={mockConvertibleBonds.map((b) => b.issuer)}
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
                  count: mockConvertibleBonds.filter((b) => b.sector === s).length,
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
                  count: mockConvertibleBonds.filter((b) => b.country === c).length,
                }))}
                selectedValues={selectedCountries}
                onChange={setSelectedCountries}
              />

              <FilterPanel
                title="Rating"
                options={ratingGroups.map((r) => ({
                  label: r === 'IG' ? 'Investment Grade' : r === 'HY' ? 'High Yield' : 'Not Rated',
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
                  count: mockConvertibleBonds.filter((b) => b.currency === c).length,
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
      
      {/* AI Chat Widget */}
      <AIChat />
    </View>
  );
};

