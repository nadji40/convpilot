// Export real data and re-export types from dataLoader
import { 
  loadConvertibleBonds, 
  getBondHistory, 
  getHistoricalDataInRange,
  getLatestDataPoints,
  clearCache,
  type ConvertibleBond,
  type HistoricalDataPoint as CBTimeSeriesData,
  type StaticBondData as CBStaticData
} from './dataLoader';

export { 
  loadConvertibleBonds, 
  getBondHistory, 
  getHistoricalDataInRange,
  getLatestDataPoints,
  clearCache,
  type ConvertibleBond,
  type CBTimeSeriesData,
  type CBStaticData
};

// Legacy interfaces for compatibility
export interface HistoricalDataPoint {
  date: string;
  cbPrice: number;
  underlyingPrice: number;
  delta: number;
  volatility: number;
}

export interface MarketSummary {
  totalCBs: number;
  totalMarketCap: number;
  avgYield: number;
  avgDelta: number;
  avgSpread: number;
}

// Use real data from dataLoader as the primary data source
export const mockConvertibleBonds = loadConvertibleBonds();

// Export helper functions that were previously in this file
// These are now imported from dataUtils to avoid circular dependencies
