// Utility functions for data manipulation
import { ConvertibleBond } from '../data/mockData';

// Filter bonds by multiple criteria
export const filterBonds = (
  bonds: ConvertibleBond[],
  filters: {
    search?: string;
    sector?: string[];
    country?: string[];
    rating?: string[];
    currency?: string[];
    size?: string[];
    profile?: string[];
  }
): ConvertibleBond[] => {
  return bonds.filter(bond => {
    // Search filter (ISIN, Issuer, Country)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        bond.isin.toLowerCase().includes(searchLower) ||
        bond.issuer.toLowerCase().includes(searchLower) ||
        bond.country.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    
    // Sector filter
    if (filters.sector && filters.sector.length > 0) {
      if (!filters.sector.includes(bond.sector)) return false;
    }
    
    // Country filter
    if (filters.country && filters.country.length > 0) {
      if (!filters.country.includes(bond.country)) return false;
    }
    
    // Rating filter
    if (filters.rating && filters.rating.length > 0) {
      const ratingGroup = getRatingGroup(bond.rating);
      if (!filters.rating.includes(ratingGroup)) return false;
    }
    
    // Currency filter
    if (filters.currency && filters.currency.length > 0) {
      if (!filters.currency.includes(bond.currency)) return false;
    }
    
    // Size filter
    if (filters.size && filters.size.length > 0) {
      if (!filters.size.includes(bond.size)) return false;
    }
    
    // Profile filter
    if (filters.profile && filters.profile.length > 0) {
      if (!filters.profile.includes(bond.profile)) return false;
    }
    
    return true;
  });
};

// Sort bonds by field
export const sortBonds = (
  bonds: ConvertibleBond[],
  field: keyof ConvertibleBond,
  direction: 'asc' | 'desc'
): ConvertibleBond[] => {
  return [...bonds].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return direction === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    if (aVal instanceof Date && bVal instanceof Date) {
      return direction === 'asc' 
        ? aVal.getTime() - bVal.getTime()
        : bVal.getTime() - aVal.getTime();
    }
    
    return 0;
  });
};

// Get rating group (IG, HY, NR)
export const getRatingGroup = (rating: string): string => {
  if (rating === 'NR') return 'NR';
  if (rating.startsWith('AAA') || rating.startsWith('AA') || rating.startsWith('A')) {
    return 'IG';
  }
  if (rating.startsWith('BB') || rating.startsWith('B')) {
    return 'HY';
  }
  return 'NR';
};

// Format currency
export const formatCurrency = (value: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format large numbers (M, B)
export const formatLargeNumber = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(2)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  return value.toLocaleString();
};

// Format percentage
export const formatPercentage = (value: number, decimals: number = 2): string => {
  // Check if value is a valid number
  if (value === null || value === undefined || typeof value !== 'number' || isNaN(value)) {
    return '0.00%';
  }
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

// Format number with decimals
export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

// Export data to CSV
export const exportToCSV = (bonds: ConvertibleBond[], filename: string = 'convertible-bonds.csv') => {
  // Define headers
  const headers = [
    'ISIN',
    'Issuer',
    'Sector',
    'Country',
    'Currency',
    'Coupon',
    'Maturity',
    'Rating',
    'Size',
    'Profile',
    'Price',
    'Delta',
    'Gamma',
    'Vega',
    'Volatility',
    'YTM',
    'Spread',
    'Perf 1D',
    'Perf 1W',
    'Perf 1M',
  ];
  
  // Build CSV content
  const rows = bonds.map(bond => [
    bond.isin,
    bond.issuer,
    bond.sector,
    bond.country,
    bond.currency,
    bond.coupon,
    bond.maturity,
    bond.rating,
    bond.size,
    bond.profile,
    bond.price,
    bond.delta,
    bond.gamma,
    bond.vega,
    bond.volatility,
    bond.ytm,
    bond.spread,
    bond.performance1D,
    bond.performance1W,
    bond.performance1M,
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Create download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Get unique values for filters
export const getUniqueValues = (bonds: ConvertibleBond[], field: keyof ConvertibleBond): string[] => {
  const values = bonds.map(bond => String(bond[field]));
  return Array.from(new Set(values)).sort();
};

// Get unique sectors
export const getUniqueSectors = (bonds: ConvertibleBond[]): string[] => {
  return getUniqueValues(bonds, 'sector');
};

// Get unique countries
export const getUniqueCountries = (bonds: ConvertibleBond[]): string[] => {
  return getUniqueValues(bonds, 'country');
};

// Get unique currencies
export const getUniqueCurrencies = (bonds: ConvertibleBond[]): string[] => {
  return getUniqueValues(bonds, 'currency');
};

// Get unique sizes
export const getUniqueSizes = (bonds: ConvertibleBond[]): string[] => {
  return ['Small Cap', 'Mid Cap', 'Large Cap'];
};

// Get unique profiles
export const getUniqueProfiles = (bonds: ConvertibleBond[]): string[] => {
  return ['Bond', 'Mixed', 'Equity', 'HY', 'Distressed'];
};

// Get unique rating groups
export const getUniqueRatingGroups = (): string[] => {
  return ['IG', 'HY', 'NR'];
};

// Paginate data
export const paginateData = <T>(data: T[], page: number, pageSize: number): T[] => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return data.slice(startIndex, endIndex);
};

// Calculate total pages
export const calculateTotalPages = (totalItems: number, pageSize: number): number => {
  return Math.ceil(totalItems / pageSize);
};

// Format date
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
};

// Calculate years to maturity
export const yearsToMaturity = (maturityDate: Date): number => {
  const now = new Date();
  const diff = maturityDate.getTime() - now.getTime();
  return diff / (1000 * 60 * 60 * 24 * 365);
};

// Get maturity bucket
export const getMaturityBucket = (maturityDate: Date): string => {
  const years = yearsToMaturity(maturityDate);
  if (years < 1) return '< 1Y';
  if (years < 2) return '1-2Y';
  if (years < 5) return '2-5Y';
  return '> 5Y';
};

// Cross-filter aggregations
export interface CrossFilterData {
  primary: string;
  secondary: string;
  value: number;
  marketCap?: number;
  avgMetric?: number;
}

export const getCrossFilterData = (
  bonds: ConvertibleBond[],
  primaryDimension: string,
  secondaryDimension: string
): CrossFilterData[] => {
  const results: { [key: string]: CrossFilterData } = {};
  
  bonds.forEach(bond => {
    let primaryValue = '';
    let secondaryValue = '';
    
    // Get primary dimension value
    switch (primaryDimension) {
      case 'sector':
        primaryValue = bond.sector;
        break;
      case 'rating':
        primaryValue = getRatingGroup(bond.rating);
        break;
      case 'size':
        primaryValue = bond.size;
        break;
      case 'profile':
        primaryValue = bond.profile;
        break;
      case 'maturity':
        primaryValue = getMaturityBucket(bond.maturityDate);
        break;
    }
    
    // Get secondary dimension value
    switch (secondaryDimension) {
      case 'sector':
        secondaryValue = bond.sector;
        break;
      case 'rating':
        secondaryValue = getRatingGroup(bond.rating);
        break;
      case 'size':
        secondaryValue = bond.size;
        break;
      case 'profile':
        secondaryValue = bond.profile;
        break;
      case 'maturity':
        secondaryValue = getMaturityBucket(bond.maturityDate);
        break;
    }
    
    const key = `${primaryValue}|${secondaryValue}`;
    
    if (!results[key]) {
      results[key] = {
        primary: primaryValue,
        secondary: secondaryValue,
        value: 0,
        marketCap: 0,
        avgMetric: 0,
      };
    }
    
    results[key].value++;
    results[key].marketCap! += bond.outstandingAmount;
    results[key].avgMetric! += bond.delta;
  });
  
  // Calculate averages
  return Object.values(results).map(item => ({
    ...item,
    avgMetric: item.avgMetric! / item.value,
  }));
};

