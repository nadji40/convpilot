// Calculation functions based on formulas from calcs.md
import { ConvertibleBond } from '../data/dataLoader';

/**
 * RATING: Standardize credit ratings according to calcs.md formula
 * Converts S&P (A+, AA-) and Moody's (A1, Aa2) ratings to standardized format
 */
export function standardizeRating(issuerRating: string): string {
  const rating = issuerRating.trim();
  
  if (rating === 'NR' || rating === 'Not Rated') {
    return 'NR';
  }
  
  // AAA ratings
  if (rating === 'AAA' || rating === 'AAA+' || rating === 'AAA-' ||
      rating === 'Aaa1' || rating === 'Aaa2' || rating === 'Aaa3') {
    return 'AAA';
  }
  
  // AA ratings
  if (rating === 'AA' || rating === 'AA+' || rating === 'AA-' ||
      rating === 'Aa1' || rating === 'Aa2' || rating === 'Aa3') {
    return 'AA';
  }
  
  // A ratings
  if (rating === 'A' || rating === 'A+' || rating === 'A-' ||
      rating === 'A1' || rating === 'A2' || rating === 'A3') {
    return 'A';
  }
  
  // BBB ratings
  if (rating === 'BBB' || rating === 'BBB+' || rating === 'BBB-' ||
      rating === 'Baa1' || rating === 'Baa2' || rating === 'Baa3') {
    return 'BBB';
  }
  
  // BB ratings
  if (rating === 'BB' || rating === 'BB+' || rating === 'BB-' ||
      rating === 'Ba1' || rating === 'Ba2' || rating === 'Ba3') {
    return 'BB';
  }
  
  // B ratings
  if (rating === 'B' || rating === 'B+' || rating === 'B-' ||
      rating === 'B1' || rating === 'B2' || rating === 'B3') {
    return 'B';
  }
  
  // CCC ratings
  if (rating === 'CCC' || rating === 'CCC+' || rating === 'CCC-' ||
      rating === 'Caa1' || rating === 'Caa2' || rating === 'Caa3') {
    return 'CCC';
  }
  
  // CC ratings
  if (rating === 'CC' || rating === 'CC+' || rating === 'CC-' ||
      rating === 'Ca1' || rating === 'Ca2' || rating === 'Ca3') {
    return 'CC';
  }
  
  // C ratings
  if (rating === 'C' || rating === 'C+' || rating === 'C-' ||
      rating === 'C1' || rating === 'C2' || rating === 'C3') {
    return 'C';
  }
  
  console.warn(`Rating not found for: ${rating}`);
  return rating;
}

/**
 * Classification by credit quality (IG, HY, NR)
 * According to calcs.md formula
 */
export function classifyCreditRisk(standardizedRating: string): 'IG' | 'HY' | 'NR' {
  if (standardizedRating.startsWith('N')) {
    return 'NR';
  }
  
  if (standardizedRating.startsWith('A') || standardizedRating === 'BBB') {
    return 'IG';
  }
  
  return 'HY';
}

/**
 * Classification by market cap size according to calcs.md formula
 * - Small Cap: market cap < 2.5 billion EUR
 * - Mid Cap: 2.5B <= market cap < 6.9 billion EUR
 * - Large Cap: market cap >= 6.9 billion EUR
 */
export function classifyMarketCapSize(marketCapEUR: number): 'Small Cap' | 'Mid Cap' | 'Large Cap' {
  const SMALL_CAP_THRESHOLD = 2_500_000_000; // 2.5 billion
  const LARGE_CAP_THRESHOLD = 6_900_000_000; // 6.9 billion
  
  if (marketCapEUR < SMALL_CAP_THRESHOLD) {
    return 'Small Cap';
  } else if (marketCapEUR < LARGE_CAP_THRESHOLD) {
    return 'Mid Cap';
  } else {
    return 'Large Cap';
  }
}

/**
 * Classification by maturity according to calcs.md formula
 * mat = (MaturityDate - Today) / 365
 */
export function classifyResidualMaturity(maturityDate: Date): '<1Y' | ']1,2]' | ']2,5]' | '>5Y' {
  const today = new Date();
  const diffTime = maturityDate.getTime() - today.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const years = diffDays / 365;
  
  if (years <= 1) {
    return '<1Y';
  } else if (years <= 2) {
    return ']1,2]';
  } else if (years <= 5) {
    return ']2,5]';
  } else {
    return '>5Y';
  }
}

/**
 * Vol spread calculation according to calcs.md
 * Vol spread = ImpVol (%) - Historical Volatility (input)
 */
export function calculateVolSpread(impliedVol: number, historicalVol: number): number {
  return impliedVol - historicalVol;
}

/**
 * Relative situation (Overpriced/Underpriced) according to calcs.md
 */
export function determineRelativeSituation(volSpread: number | null): string {
  if (volSpread === null || volSpread === undefined) {
    return '';
  }
  
  if (volSpread < 0) {
    return 'underpriced';
  } else if (volSpread >= 0 && volSpread < 4) {
    return 'fair value';
  } else if (volSpread >= 4 && volSpread < 8) {
    return 'overpriced';
  } else if (volSpread >= 8) {
    return 'expensive';
  }
  
  return '';
}

/**
 * Downside risk calculation according to calcs.md
 * IF Vol spread > 0 and Vol spread <> "" then
 *   Downside risk = Vol spread * vega %
 * Else ""
 */
export function calculateDownsideRisk(volSpread: number | null, vegaPercent: number): number | null {
  if (volSpread !== null && volSpread !== undefined && volSpread > 0) {
    return volSpread * vegaPercent;
  }
  return null;
}

/**
 * Calculate average volatility spreads for bonds with Balanced profile (vega > 0.25)
 * According to calcs.md formula
 */
export function calculateAverageVolatilitySpreads(bonds: ConvertibleBond[]): {
  averageVolSpread: number | null;
  standardDeviation: number | null;
  count: number;
} {
  // Filter for bonds with vega > 0.25 and valid implied vol
  const validBonds = bonds.filter(
    bond => bond.vega > 0.25 && 
            bond.impliedVol !== null && 
            bond.impliedVol !== undefined &&
            !isNaN(bond.impliedVol)
  );
  
  if (validBonds.length === 0) {
    return { averageVolSpread: null, standardDeviation: null, count: 0 };
  }
  
  // Calculate average volatility spread
  let viTotal = 0;
  const spreads: number[] = [];
  
  validBonds.forEach(bond => {
    const spread = bond.impliedVol - bond.volatility;
    viTotal += spread;
    spreads.push(spread);
  });
  
  const averageVolSpread = viTotal / validBonds.length;
  
  // Calculate standard deviation
  let sumSquaredDiff = 0;
  spreads.forEach(spread => {
    const diff = spread - averageVolSpread;
    sumSquaredDiff += diff * diff;
  });
  
  const standardDeviation = Math.sqrt(sumSquaredDiff / validBonds.length);
  
  return {
    averageVolSpread,
    standardDeviation,
    count: validBonds.length
  };
}

/**
 * Spread to average calculation according to calcs.md
 */
export function calculateSpreadToAverage(
  volSpread: number | null,
  averageVolSpread: number | null
): number | null {
  if (volSpread !== null && volSpread !== undefined &&
      averageVolSpread !== null && averageVolSpread !== undefined) {
    return volSpread - averageVolSpread;
  }
  return null;
}

/**
 * Z-score calculation according to calcs.md
 */
export function calculateZScore(
  spreadToAverage: number | null,
  standardDeviation: number | null
): number | null {
  if (spreadToAverage !== null && spreadToAverage !== undefined &&
      standardDeviation !== null && standardDeviation !== undefined &&
      standardDeviation !== 0) {
    return spreadToAverage / standardDeviation;
  }
  return null;
}

/**
 * Observation/recommendation according to calcs.md
 * Si abs(Spread to average) > 2, Et:
 * - if overcote/undercote = (fair value, ou underpriced), Et: Spread to average < 0,
 *   zscore en valeur absolue > 1 then: "High probability of a rebound"
 * - if overcote/undercote = (overpriced Ou expensive), Et: Spread to average > 0,
 *   zscore en valeur absolue > 1: THEN High probability of downside
 */
export function determineObservation(
  spreadToAverage: number | null,
  zScore: number | null,
  relativeSituation: string
): string {
  if (spreadToAverage === null || zScore === null) {
    return '';
  }
  
  const absSpreadToAvg = Math.abs(spreadToAverage);
  const absZScore = Math.abs(zScore);
  
  if (absSpreadToAvg > 2) {
    // Condition for rebound
    if ((relativeSituation === 'fair value' || relativeSituation === 'underpriced') &&
        spreadToAverage < 0 &&
        absZScore > 1) {
      return 'High probability of a rebound';
    }
    
    // Condition for downside
    if ((relativeSituation === 'overpriced' || relativeSituation === 'expensive') &&
        spreadToAverage > 0 &&
        absZScore > 1) {
      return 'High probability of downside';
    }
  }
  
  return '';
}

/**
 * Rebase performance series to base 100 according to calcs.md
 * Pt(rebased) = (Pt / P0) * 100
 */
export function rebaseToBase100(values: number[], startIndex: number = 0): number[] {
  if (values.length === 0 || startIndex >= values.length) {
    return [];
  }
  
  const baseValue = values[startIndex];
  if (baseValue === 0) {
    return values.map(() => 100);
  }
  
  return values.map(value => (value / baseValue) * 100);
}

/**
 * Calculate Year-to-Date (YTD) performance according to calcs.md
 * Performance YTD(%) = (P_current / P_start_of_year - 1) × 100
 */
export function calculateYTDPerformance(currentPrice: number, startOfYearPrice: number): number {
  if (startOfYearPrice === 0) return 0;
  return ((currentPrice / startOfYearPrice) - 1) * 100;
}

/**
 * Calculate Month-to-Date (MTD) performance according to calcs.md
 * Performance MTD(%) = (P_current / P_start_of_month - 1) × 100
 */
export function calculateMTDPerformance(currentPrice: number, startOfMonthPrice: number): number {
  if (startOfMonthPrice === 0) return 0;
  return ((currentPrice / startOfMonthPrice) - 1) * 100;
}

/**
 * Calculate 3-Month performance according to calcs.md
 * Performance 3M(%) = (P_current / P_3months_ago - 1) × 100
 */
export function calculate3MPerformance(currentPrice: number, threeMonthsAgoPrice: number): number {
  if (threeMonthsAgoPrice === 0) return 0;
  return ((currentPrice / threeMonthsAgoPrice) - 1) * 100;
}

/**
 * Enhanced bond data with all calculations
 */
export interface EnhancedBondMetrics {
  // Volatility analysis
  volSpread: number | null;
  relativeSituation: string;
  downsideRisk: number | null;
  spreadToAverage: number | null;
  zScore: number | null;
  observation: string;
  
  // Classifications
  standardizedRating: string;
  creditRisk: 'IG' | 'HY' | 'NR';
  residualMaturity: '<1Y' | ']1,2]' | ']2,5]' | '>5Y';
}

/**
 * Calculate all enhanced metrics for a bond
 */
export function calculateEnhancedMetrics(
  bond: ConvertibleBond,
  marketStats: { averageVolSpread: number | null; standardDeviation: number | null }
): EnhancedBondMetrics {
  // Volatility analysis
  const volSpread = calculateVolSpread(bond.impliedVol, bond.volatility);
  const relativeSituation = determineRelativeSituation(volSpread);
  const downsideRisk = calculateDownsideRisk(volSpread, bond.vega);
  const spreadToAverage = calculateSpreadToAverage(volSpread, marketStats.averageVolSpread);
  const zScore = calculateZScore(spreadToAverage, marketStats.standardDeviation);
  const observation = determineObservation(spreadToAverage, zScore, relativeSituation);
  
  // Classifications
  const standardizedRating = standardizeRating(bond.rating);
  const creditRisk = classifyCreditRisk(standardizedRating);
  const residualMaturity = classifyResidualMaturity(bond.maturityDate);
  
  return {
    volSpread,
    relativeSituation,
    downsideRisk,
    spreadToAverage,
    zScore,
    observation,
    standardizedRating,
    creditRisk,
    residualMaturity,
  };
}

