// Utility functions for data manipulation
import { ConvertibleBond } from '../data/dataLoader';
import {
  calculateAverageVolatilitySpreads,
  calculateEnhancedMetrics,
  EnhancedBondMetrics,
  rebaseToBase100,
} from './calculations';

// Calculate portfolio-level metrics
export interface PortfolioMetrics {
  totalNotional: number;
  totalULExposure: number;
  portfolioDelta: number;
  portfolioGamma: number;
  portfolioVega: number;
  avgImpliedVol: number;
  avgHistoricalVol: number;
  avgBondfloor: number;
  avgDistanceToBondfloor: number;
  avgCreditSpread: number;
  totalDeltaAdjustedExposure: number;
  avgYTM: number;
  avgPrime: number;
  avgDuration: number;
  // Enhanced volatility metrics according to calcs.md
  avgVolSpread: number | null;
  stdDevVolSpread: number | null;
  countBalancedBonds: number;
}

export const calculatePortfolioMetrics = (bonds: ConvertibleBond[]): PortfolioMetrics => {
  // Handle empty portfolio
  if (bonds.length === 0) {
    return {
      totalNotional: 0,
      totalULExposure: 0,
      portfolioDelta: 0,
      portfolioGamma: 0,
      portfolioVega: 0,
      avgImpliedVol: 0,
      avgHistoricalVol: 0,
      avgBondfloor: 0,
      avgDistanceToBondfloor: 0,
      avgCreditSpread: 0,
      totalDeltaAdjustedExposure: 0,
      avgYTM: 0,
      avgPrime: 0,
      avgDuration: 0,
      avgVolSpread: null,
      stdDevVolSpread: null,
      countBalancedBonds: 0,
    };
  }

  const totalNotional = bonds.reduce((sum, bond) => sum + bond.outstandingAmount, 0);
  const totalULExposure = bonds.reduce((sum, bond) => sum + bond.ulOutstanding, 0);
  
  // Portfolio Greeks (weighted by notional)
  const portfolioDelta = totalNotional > 0 
    ? bonds.reduce((sum, bond) => sum + (bond.delta * bond.outstandingAmount), 0) / totalNotional
    : 0;
  const portfolioGamma = totalNotional > 0
    ? bonds.reduce((sum, bond) => sum + (bond.gamma * bond.outstandingAmount), 0) / totalNotional
    : 0;
  const portfolioVega = totalNotional > 0
    ? bonds.reduce((sum, bond) => sum + (bond.vega * bond.outstandingAmount), 0) / totalNotional
    : 0;
  
  // Average volatility metrics - only for Balanced/Balanced profile
  const balancedBonds = bonds.filter(bond => bond.profile === 'Balanced');
  const avgImpliedVol = balancedBonds.length > 0
    ? balancedBonds.reduce((sum, bond) => sum + bond.impliedVol, 0) / balancedBonds.length
    : 0;
  const avgHistoricalVol = balancedBonds.length > 0
    ? balancedBonds.reduce((sum, bond) => sum + bond.volatility, 0) / balancedBonds.length
    : bonds.reduce((sum, bond) => sum + bond.volatility, 0) / bonds.length;
  
  // Calculate average volatility spreads and standard deviation according to calcs.md
  const volStats = calculateAverageVolatilitySpreads(bonds);
  
  // Downside protection metrics
  const avgBondfloor = bonds.reduce((sum, bond) => sum + bond.bondfloorPercent, 0) / bonds.length;
  const avgDistanceToBondfloor = bonds.reduce((sum, bond) => 
    sum + bond.distanceToBondfloor, 0) / bonds.length;
  
  // Credit metrics - only for Bond profile
  const bondProfileBonds = bonds.filter(bond => bond.profile === 'Bond');
  const avgCreditSpread = bondProfileBonds.length > 0
    ? bondProfileBonds.reduce((sum, bond) => sum + bond.creditSpread, 0) / bondProfileBonds.length
    : 0;
  
  // YTM, Prime, and Duration
  const avgYTM = bonds.reduce((sum, bond) => sum + bond.ytm, 0) / bonds.length;
  const avgPrime = bonds.reduce((sum, bond) => sum + bond.prime, 0) / bonds.length;
  const bondsWithDuration = bonds.filter(bond => bond.duration !== null);
  const avgDuration = bondsWithDuration.length > 0 
    ? bondsWithDuration.reduce((sum, bond) => sum + (bond.duration as number), 0) / bondsWithDuration.length
    : 0;
  
  // Delta-adjusted exposure
  const totalDeltaAdjustedExposure = bonds.reduce((sum, bond) => 
    sum + (bond.delta * bond.ulOutstanding * bond.stockPrice), 0);
  
  return {
    totalNotional,
    totalULExposure,
    portfolioDelta,
    portfolioGamma,
    portfolioVega,
    avgImpliedVol,
    avgHistoricalVol,
    avgBondfloor,
    avgDistanceToBondfloor,
    avgCreditSpread,
    totalDeltaAdjustedExposure,
    avgYTM,
    avgPrime,
    avgDuration,
    avgVolSpread: volStats.averageVolSpread,
    stdDevVolSpread: volStats.standardDeviation,
    countBalancedBonds: volStats.count,
  };
};

// Calculate performance attribution metrics
export interface PortfolioAttribution {
  totalPerformance: number;
  shareContrib: number;
  creditSpreadContrib: number;
  carryContrib: number;
  rateContrib: number;
  valuation: number;
  fxContrib: number;
  deltaNeutral: number;
}

export const calculatePortfolioAttribution = (bonds: ConvertibleBond[]): PortfolioAttribution => {
  const validBonds = bonds.filter(b => b.performance1D !== null && b.performance1D !== undefined);
  const totalNotional = validBonds.reduce((sum, bond) => sum + bond.outstandingAmount, 0);
  
  // Weighted average of each attribution component
  const totalPerformance = validBonds.reduce((sum, bond) => 
    sum + ((bond.performance1D || 0) * bond.outstandingAmount), 0) / totalNotional;
  
  const shareContrib = validBonds.reduce((sum, bond) => 
    sum + ((bond.shareContrib || 0) * bond.outstandingAmount), 0) / totalNotional;
  
  const creditSpreadContrib = validBonds.reduce((sum, bond) => 
    sum + ((bond.creditSpreadContrib || 0) * bond.outstandingAmount), 0) / totalNotional;
  
  const carryContrib = validBonds.reduce((sum, bond) => 
    sum + ((bond.carryContrib || 0) * bond.outstandingAmount), 0) / totalNotional;
  
  const rateContrib = validBonds.reduce((sum, bond) => 
    sum + ((bond.rateContrib || 0) * bond.outstandingAmount), 0) / totalNotional;
  
  const valuation = validBonds.reduce((sum, bond) => 
    sum + ((bond.valuation || 0) * bond.outstandingAmount), 0) / totalNotional;
  
  const fxContrib = validBonds.reduce((sum, bond) => 
    sum + ((bond.fxContrib || 0) * bond.outstandingAmount), 0) / totalNotional;
  
  const deltaNeutral = validBonds.reduce((sum, bond) => 
    sum + ((bond.deltaNeutral || 0) * bond.outstandingAmount), 0) / totalNotional;
  
  return {
    totalPerformance,
    shareContrib,
    creditSpreadContrib,
    carryContrib,
    rateContrib,
    valuation,
    fxContrib,
    deltaNeutral,
  };
};

// Calculate cheap/rich analysis
export interface CheapRichMetric {
  isin: string;
  issuer: string;
  marketPrice: number;
  theoValue: number;
  mispricing: number;
  mispricingPercent: number;
}

export const getCheapRichAnalysis = (bonds: ConvertibleBond[]): CheapRichMetric[] => {
  return bonds.map(bond => {
    const mispricing = bond.price - bond.theoValue;
    const mispricingPercent = (mispricing / bond.theoValue) * 100;
    
    return {
      isin: bond.isin,
      issuer: bond.issuer,
      marketPrice: bond.price,
      theoValue: bond.theoValue,
      mispricing,
      mispricingPercent,
    };
  }).sort((a, b) => Math.abs(b.mispricingPercent) - Math.abs(a.mispricingPercent));
};

// Get bonds with upcoming call/put events
export interface UpcomingEvent {
  isin: string;
  issuer: string;
  eventType: 'Call' | 'Put';
  eventDate: string;
  daysToEvent: number;
  triggerLevel?: number;
  currentLevel: number;
  isTriggered?: boolean;
}

export const getUpcomingEvents = (bonds: ConvertibleBond[]): UpcomingEvent[] => {
  const events: UpcomingEvent[] = [];
  const today = new Date();
  
  bonds.forEach(bond => {
    // Check for call events
    if (bond.isSoftCall && bond.callFirstDate && bond.callTrigger) {
      const callDate = new Date(bond.callFirstDate);
      const daysToEvent = Math.floor((callDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysToEvent >= 0 && daysToEvent <= 180) { // Next 6 months
        events.push({
          isin: bond.isin,
          issuer: bond.issuer,
          eventType: 'Call',
          eventDate: bond.callFirstDate,
          daysToEvent,
          triggerLevel: bond.callTrigger,
          currentLevel: bond.parityPercent,
          isTriggered: bond.parityPercent >= bond.callTrigger,
        });
      }
    }
    
    // Check for put events
    if (bond.isPutable && bond.putDate && bond.putPrice) {
      const putDate = new Date(bond.putDate);
      const daysToEvent = Math.floor((putDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysToEvent >= 0 && daysToEvent <= 180) { // Next 6 months
        events.push({
          isin: bond.isin,
          issuer: bond.issuer,
          eventType: 'Put',
          eventDate: bond.putDate,
          daysToEvent,
          currentLevel: bond.price,
        });
      }
    }
  });
  
  return events.sort((a, b) => a.daysToEvent - b.daysToEvent);
};

// Filter bonds by multiple criteria - works with enhanced bond metrics
export const filterBonds = <T extends ConvertibleBond>(
  bonds: T[],
  filters: {
    search?: string;
    sector?: string[];
    country?: string[];
    rating?: string[];
    currency?: string[];
    size?: string[];
    profile?: string[];
  }
): T[] => {
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

// Sort bonds by field - works with enhanced bond metrics
export const sortBonds = <T extends ConvertibleBond>(
  bonds: T[],
  field: keyof ConvertibleBond,
  direction: 'asc' | 'desc'
): T[] => {
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
// Updated to use standardized ratings according to calcs.md formula
export const getRatingGroup = (rating: string): string => {
  if (rating === 'Not Rated' || rating === 'NR' || rating.startsWith('N')) {
    return 'Not Rated';
  }
  // Investment Grade: A ratings or BBB
  if (rating.startsWith('AAA') || rating.startsWith('AA') || rating.startsWith('A') || rating === 'BBB') {
    return 'Investment Grade';
  }
  // High Yield: BB, B, CCC, CC, C
  if (rating.startsWith('BB') || rating.startsWith('B') || rating.startsWith('C')) {
    return 'High Yield';
  }
  return 'Not Rated';
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
// Note: Sectors like "Consumer,Non-cyclical" are single sectors - properly escaped in CSV
export const exportToCSV = (bonds: ConvertibleBond[], filename: string = 'convertible-bonds.csv') => {
  // Helper function to escape CSV values that contain commas, quotes, or newlines
  const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    // If the value contains comma, quote, or newline, wrap it in quotes and escape existing quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  
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
  
  // Build CSV content with proper escaping
  const rows = bonds.map(bond => [
    escapeCSV(bond.isin),
    escapeCSV(bond.issuer),
    escapeCSV(bond.sector),  // Properly escape sectors like "Consumer,Non-cyclical"
    escapeCSV(bond.country),
    escapeCSV(bond.currency),
    bond.coupon,
    escapeCSV(bond.maturity),
    escapeCSV(bond.rating),
    escapeCSV(bond.size),
    escapeCSV(bond.profile),
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

// Aggregate bonds by sector
// Note: Sectors like "Consumer,Non-cyclical" and "Consumer,Cyclical" are treated as single sectors
export const aggregateBySector = (bonds: ConvertibleBond[]): Array<{ name: string; value: number }> => {
  const sectorMap = new Map<string, number>();
  
  bonds.forEach(bond => {
    // Handle multiple sectors - each sector gets the full bond value
    const sectors = bond.sectors || [bond.sector];
    sectors.forEach(sector => {
      sectorMap.set(sector, (sectorMap.get(sector) || 0) + bond.outstandingAmount);
    });
  });
  
  return Array.from(sectorMap.entries()).map(([name, value]) => ({ name, value }));
};

// Aggregate bonds by rating
export const aggregateByRating = (bonds: ConvertibleBond[]): Array<{ name: string; value: number }> => {
  const ratingMap = new Map<string, number>();
  
  bonds.forEach(bond => {
    const ratingGroup = getRatingGroup(bond.rating);
    ratingMap.set(ratingGroup, (ratingMap.get(ratingGroup) || 0) + 1);
  });
  
  return Array.from(ratingMap.entries()).map(([name, value]) => ({ name, value }));
};

// Aggregate bonds by maturity
export const aggregateByMaturity = (bonds: ConvertibleBond[]): Array<{ name: string; value: number }> => {
  const maturityMap = new Map<string, number>();
  
  bonds.forEach(bond => {
    const bucket = getMaturityBucket(bond.maturityDate);
    maturityMap.set(bucket, (maturityMap.get(bucket) || 0) + bond.outstandingAmount);
  });
  
  return Array.from(maturityMap.entries()).map(([name, value]) => ({ name, value }));
};

// Aggregate bonds by profile
export const aggregateByProfile = (bonds: ConvertibleBond[]): Array<{ name: string; value: number }> => {
  const profileMap = new Map<string, number>();
  
  bonds.forEach(bond => {
    const profile = bond.profile;
    profileMap.set(profile, (profileMap.get(profile) || 0) + bond.outstandingAmount);
  });
  
  return Array.from(profileMap.entries()).map(([name, value]) => ({ name, value }));
};

// Calculate market summary
export interface MarketSummary {
  totalCBs: number;
  totalMarketCap: number;
  avgYield: number;
  avgDelta: number;
  avgSpread: number;
}

export const calculateMarketSummary = (bonds: ConvertibleBond[]): MarketSummary => {
  const totalCBs = bonds.length;
  const totalMarketCap = bonds.reduce((sum, b) => sum + b.outstandingAmount, 0);
  const avgYield = bonds.reduce((sum, b) => sum + b.ytm, 0) / totalCBs;
  const avgDelta = bonds.reduce((sum, b) => sum + b.delta, 0) / totalCBs;
  const avgSpread = bonds.reduce((sum, b) => sum + b.creditSpread, 0) / totalCBs;
  
  return {
    totalCBs,
    totalMarketCap,
    avgYield,
    avgDelta,
    avgSpread,
  };
};

// Generate market index data from REAL cbhist.json aggregate data
// Returns CB index and equity index rebased to 100 according to calcs.md
export const generateMarketIndexData = (bonds: ConvertibleBond[]): Array<{ 
  date: string; 
  cb: number; 
  equity: number; 
  deltaNeutral: number 
}> => {
  if (bonds.length === 0) {
    return [];
  }
  
  // Import getBondHistory dynamically to avoid circular dependencies
  const { getBondHistory } = require('../data/dataLoader');
  
  // Get historical data for all bonds
  const bondHistories = bonds.map(bond => ({
    bond,
    history: getBondHistory(bond.bloombergCode),
  })).filter(item => item.history.length > 0);
  
  if (bondHistories.length === 0) {
    return [];
  }
  
  // Find common dates (last 30 days)
  const allDates = new Set<string>();
  bondHistories.forEach(item => {
    item.history.slice(-30).forEach(h => allDates.add(h.DATE));
  });
  const commonDates = Array.from(allDates).sort().slice(-30);
  
  // Calculate market-wide indices for each date
  const cbIndexValues: number[] = [];
  const equityIndexValues: number[] = [];
  const deltaNeutralValues: number[] = [];
  const dates: string[] = [];
  
  commonDates.forEach(date => {
    let cbSum = 0;
    let equitySum = 0;
    let deltaNeutralSum = 0;
    let count = 0;
    
    bondHistories.forEach(({ bond, history }) => {
      const dataPoint = history.find(h => h.DATE === date);
      if (dataPoint) {
        cbSum += dataPoint["CB Market Price %"];
        equitySum += dataPoint["Stock price"];
        // Delta neutral = CB performance - (delta * equity performance)
        const deltaNeutralPerf = dataPoint["CB Market Price %"] - 
                                 (dataPoint["Delta%"] * dataPoint["Stock price"]);
        deltaNeutralSum += deltaNeutralPerf;
        count++;
      }
    });
    
    if (count > 0) {
      cbIndexValues.push(cbSum / count);
      equityIndexValues.push(equitySum / count);
      deltaNeutralValues.push(deltaNeutralSum / count);
      dates.push(date);
    }
  });
  
  // Rebase all series to 100 according to calcs.md: Pt(rebased) = (Pt / P0) × 100
  const rebasedCB = rebaseToBase100(cbIndexValues, 0);
  const rebasedEquity = rebaseToBase100(equityIndexValues, 0);
  const rebasedDeltaNeutral = rebaseToBase100(deltaNeutralValues, 0);
  
  // Build final data array
  return dates.map((date, i) => ({
    date,
    cb: Number(rebasedCB[i].toFixed(2)),
    equity: Number(rebasedEquity[i].toFixed(2)),
    deltaNeutral: Number(rebasedDeltaNeutral[i].toFixed(2)),
  }));
};

// Generate historical data for a specific bond using REAL cbhist.json data
// Returns data rebased to 100 according to calcs.md
export const generateHistoricalData = (bond: ConvertibleBond): Array<{
  date: string;
  cbPrice: number;
  underlyingPrice: number;
  delta: number;
  volatility: number;
}> => {
  // Import getBondHistory dynamically to avoid circular dependencies
  const { getBondHistory } = require('../data/dataLoader');
  
  // Get REAL historical data from cbhist.json
  const history = getBondHistory(bond.bloombergCode);
  
  if (history.length === 0) {
    console.warn(`No historical data for ${bond.bloombergCode}`);
    return [];
  }
  
  // Get last 30 days of data (or all available if less than 30)
  const recentHistory = history.slice(-30);
  
  // Extract raw price series
  const rawCBPrices = recentHistory.map(h => h["CB Market Price %"]);
  const rawULPrices = recentHistory.map(h => h["Stock price"]);
  
  // Rebase to 100 according to calcs.md: Pt(rebased) = (Pt / P0) × 100
  const rebasedCBPrices = rebaseToBase100(rawCBPrices, 0);
  const rebasedULPrices = rebaseToBase100(rawULPrices, 0);
  
  // Build final data array with rebased values and real metrics
  return recentHistory.map((point, i) => ({
    date: point.DATE,
    cbPrice: Number(rebasedCBPrices[i].toFixed(2)),
    underlyingPrice: Number(rebasedULPrices[i].toFixed(2)),
    delta: point["Delta%"],
    volatility: point["His vol"],
  }));
};

// Calculate portfolio historical performance from REAL cbhist.json data
// Returns weighted portfolio performance rebased to 100 according to calcs.md
// Now includes CB, Equity, and Delta Neutral performance
export const calculatePortfolioHistory = (bonds: ConvertibleBond[]): Array<{
  date: string;
  cb: number;
  equity: number;
  deltaNeutral: number;
}> => {
  if (bonds.length === 0) {
    return [];
  }
  
  // Import getBondHistory dynamically to avoid circular dependencies
  const { getBondHistory } = require('../data/dataLoader');
  
  // Get historical data for all bonds
  const bondHistories = bonds.map(bond => ({
    bond,
    history: getBondHistory(bond.bloombergCode),
  })).filter(item => item.history.length > 0);
  
  if (bondHistories.length === 0) {
    return [];
  }
  
  // Find common date range (dates that exist for all bonds)
  // Get the last 30 available dates
  const allDates = new Set<string>();
  bondHistories.forEach(item => {
    item.history.slice(-30).forEach(h => allDates.add(h.DATE));
  });
  
  const commonDates = Array.from(allDates).sort().slice(-30);
  
  // Calculate total notional for weighting
  const totalNotional = bonds.reduce((sum, bond) => sum + bond.outstandingAmount, 0);
  
  // Calculate weighted performance for each date
  const cbValues: number[] = [];
  const equityValues: number[] = [];
  const deltaNeutralValues: number[] = [];
  const dates: string[] = [];
  
  commonDates.forEach(date => {
    let cbValue = 0;
    let equityValue = 0;
    let deltaNeutralValue = 0;
    let totalWeight = 0;
    
    bondHistories.forEach(({ bond, history }) => {
      const dataPoint = history.find(h => h.DATE === date);
      if (dataPoint) {
        const weight = bond.outstandingAmount / totalNotional;
        
        // CB Performance
        cbValue += dataPoint["CB Market Price %"] * weight;
        
        // Equity Performance (underlying stock)
        equityValue += dataPoint["Stock price"] * weight;
        
        // Delta Neutral Performance = CB - (Delta × Equity)
        // This removes the equity component to isolate credit and volatility
        const delta = dataPoint["Delta%"];
        const deltaNeutralPerf = dataPoint["CB Market Price %"] - (delta * dataPoint["Stock price"]);
        deltaNeutralValue += deltaNeutralPerf * weight;
        
        totalWeight += weight;
      }
    });
    
    if (totalWeight > 0) {
      cbValues.push(cbValue / totalWeight);
      equityValues.push(equityValue / totalWeight);
      deltaNeutralValues.push(deltaNeutralValue / totalWeight);
      dates.push(date);
    }
  });
  
  // Rebase all series to 100 according to calcs.md: Pt(rebased) = (Pt / P0) × 100
  const rebasedCB = rebaseToBase100(cbValues, 0);
  const rebasedEquity = rebaseToBase100(equityValues, 0);
  const rebasedDeltaNeutral = rebaseToBase100(deltaNeutralValues, 0);
  
  // Build final array with all three series
  return dates.map((date, i) => ({
    date,
    cb: Number(rebasedCB[i].toFixed(2)),
    equity: Number(rebasedEquity[i].toFixed(2)),
    deltaNeutral: Number(rebasedDeltaNeutral[i].toFixed(2)),
  }));
};

// Get unique values for filters
export const getUniqueValues = (bonds: ConvertibleBond[], field: keyof ConvertibleBond): string[] => {
  const values = bonds.map(bond => String(bond[field]));
  return Array.from(new Set(values)).sort();
};

// Get enhanced bond metrics with volatility analysis
// Uses formulas from calcs.md
export interface BondWithEnhancedMetrics extends ConvertibleBond {
  enhancedMetrics: EnhancedBondMetrics;
}

export const getEnhancedBondMetrics = (bonds: ConvertibleBond[]): BondWithEnhancedMetrics[] => {
  // First calculate market-wide statistics
  const marketStats = calculateAverageVolatilitySpreads(bonds);
  
  // Then calculate enhanced metrics for each bond
  return bonds.map(bond => ({
    ...bond,
    enhancedMetrics: calculateEnhancedMetrics(bond, marketStats),
  }));
};

// Get trading signals for portfolio bonds according to calcs.md
export interface TradingSignal {
  isin: string;
  issuer: string;
  volSpread: number | null;
  relativeSituation: string;
  downsideRisk: number | null;
  spreadToAverage: number | null;
  zScore: number | null;
  observation: string;
  vega: number;
  impliedVol: number;
  historicalVol: number;
}

export const getTradingSignals = (bonds: ConvertibleBond[]): TradingSignal[] => {
  // Calculate market-wide statistics
  const marketStats = calculateAverageVolatilitySpreads(bonds);
  
  // Calculate enhanced metrics for each bond
  return bonds.map(bond => {
    const metrics = calculateEnhancedMetrics(bond, marketStats);
    
    return {
      isin: bond.isin,
      issuer: bond.issuer,
      volSpread: metrics.volSpread,
      relativeSituation: metrics.relativeSituation,
      downsideRisk: metrics.downsideRisk,
      spreadToAverage: metrics.spreadToAverage,
      zScore: metrics.zScore,
      observation: metrics.observation,
      vega: bond.vega,
      impliedVol: bond.impliedVol,
      historicalVol: bond.volatility,
    };
  });
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
  return ['Bond', 'Balanced', 'Equity', 'High Yield', 'Distressed'];
};

// Get unique rating groups
export const getUniqueRatingGroups = (): string[] => {
  return ['Investment Grade', 'High Yield', 'Not Rated'];
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
// Updated according to calcs.md formula: <1Y, ]1,2], ]2,5], >5Y
export const getMaturityBucket = (maturityDate: Date): string => {
  const years = yearsToMaturity(maturityDate);
  if (years <= 1) return '<1Y';
  if (years <= 2) return ']1,2]';
  if (years <= 5) return ']2,5]';
  return '>5Y';
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
    // Get primary dimension values (can be multiple for sectors)
    const getPrimaryValues = (): string[] => {
      switch (primaryDimension) {
        case 'sector':
          return bond.sectors || [bond.sector];
        case 'rating':
          return [getRatingGroup(bond.rating)];
        case 'size':
          return [bond.size];
        case 'profile':
          return [bond.profile];
        case 'maturity':
          return [getMaturityBucket(bond.maturityDate)];
        default:
          return ['Unknown'];
      }
    };
    
    // Get secondary dimension values (can be multiple for sectors)
    const getSecondaryValues = (): string[] => {
      switch (secondaryDimension) {
        case 'sector':
          return bond.sectors || [bond.sector];
        case 'rating':
          return [getRatingGroup(bond.rating)];
        case 'size':
          return [bond.size];
        case 'profile':
          return [bond.profile];
        case 'maturity':
          return [getMaturityBucket(bond.maturityDate)];
        default:
          return ['Unknown'];
      }
    };
    
    const primaryValues = getPrimaryValues();
    const secondaryValues = getSecondaryValues();
    
    // Create entries for all combinations
    primaryValues.forEach(primaryValue => {
      secondaryValues.forEach(secondaryValue => {
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
    });
  });
  
  // Calculate averages
  return Object.values(results).map(item => ({
    ...item,
    avgMetric: item.avgMetric! / item.value,
  }));
};

