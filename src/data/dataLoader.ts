// Data loader for converting real JSON data to dashboard format
import staticFieldsData from '../../static_fields.json';
import cbHistData from '../../cbhist.json';

// Import types
export interface StaticBondData {
  name: string;
  bloomberg_code: string;
  issuer: {
    country: string;
    sector: string;
    industry: string;
  };
  bond_characteristics: {
    conversion_ratio: number;
    nominal: number;
    issue_price_percent: number;
    redemption_price_percent: number;
    issue_date: string;
    maturity_date: string;
    premium_percent: number;
    coupon_percent: number;
    amount_issued: number;
    next_coupon_date?: string;
    conversion_price: number;
    subordinated_debt: boolean;
    currency: string;
  };
  put_option: {
    is_putable: boolean;
    put_date?: string;
    put_price_percent?: number;
  };
  soft_call: {
    has_soft_call: boolean;
    first_call_date?: string;
    second_call_date?: string;
    call_trigger_percent?: number;
    call_price_percent?: number;
  };
  dividends: {
    has_protection: boolean;
    protection_type?: string;
    payout_direction?: string;
    threshold?: number;
    threshold_schedule?: Array<{ date: string; threshold: number }>;
    frequency?: string;
    projections?: Array<{ date: string; amount: number; type: string }>;
  };
}

export interface HistoricalDataPoint {
  Portfolio_ref: string;
  "Bloomberg code ( ticker or ISIN)": string;
  DATE: string;
  "CB Market Price": number;
  "CB Market Price %": number;
  "CB OUTSTANDING": number;
  "Stock price": number;
  "Theo Value": number;
  "CB PROFIL": string;
  Bondfloor: number;
  "Bondfloor % ": number;
  "Distance to bondfloor": number;
  "Credit spread": number;
  "Implied Spread (bp)": number;
  "Current yield %": number;
  "YTM %": number;
  Rho: number | null;
  Duration: number | null;
  "Credit sensitivity ": number | null;
  "His vol": number;
  "ImpVol (%)": number;
  "Delta%": number;
  "Equity sensitivity %": number;
  Gamma: number;
  "cnv +20%": number;
  "cnv -20%": number;
  Vega: number;
  Theta: number;
  Parity: number;
  "Parity %": number;
  "Prime %": number;
  "Adjusted prime %": number;
  "PNA %": number | null;
  "Adjusted PNA %": number;
  CR: number | null;
  "UL OUTSTANDING": number;
  "CB perf": number | null;
  "Share contrib% ": number | null;
  "creditSpread contrib%": number | null;
  "CARRY contrib% ": number | null;
  "Rate contrib%": number | null;
  Valuation: number | null;
  "FX CONTRIB": number | null;
  "Delta neutral": number | null;
}

export interface ConvertibleBond {
  // Core identifiers
  isin: string;
  issuer: string;
  bloombergCode: string;
  sector: string;
  country: string;
  currency: string;
  
  // Static fields
  coupon: number;
  maturity: string;
  maturityDate: Date;
  rating: string;
  size: string;
  profile: string;
  conversionRatio: number;
  nominal: number;
  issuePrice: number;
  redemptionPrice: number;
  premium: number;
  amountIssued: number;
  conversionPrice: number;
  
  // Dynamic pricing fields
  price: number;
  cbMarketPrice: number;
  stockPrice: number;
  theoValue: number;
  fairValue: number;
  
  // Risk metrics (Greeks)
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
  rho: number | null;
  
  // Volatility
  volatility: number;
  impliedVol: number;
  
  // Credit metrics
  ytm: number;
  currentYield: number;
  spread: number;
  creditSpread: number;
  impliedSpread: number;
  duration: number | null;
  creditSensitivity: number | null;
  
  // Downside protection
  bondfloor: number;
  bondfloorPercent: number;
  distanceToBondfloor: number;
  
  // Equity sensitivity
  equitySensitivity: number;
  parity: number;
  parityPercent: number;
  prime: number;
  adjustedPrime: number;
  adjustedPna: number;
  
  // Convexity scenarios
  cnvPlus20: number;
  cnvMinus20: number;
  
  // Performance metrics
  performance1D: number | null;
  performance1W: number;
  performance1M: number;
  performance3M: number;
  performanceYTD: number;
  
  // Performance attribution
  shareContrib: number | null;
  creditSpreadContrib: number | null;
  carryContrib: number | null;
  rateContrib: number | null;
  valuation: number | null;
  fxContrib: number | null;
  deltaNeutral: number | null;
  
  // Portfolio info
  outstandingAmount: number;
  ulOutstanding: number;
  type: string;
  underlyingTicker: string;
  underlyingPrice: number;
  issueDate: string;
  
  // Call/Put features
  isPutable?: boolean;
  putDate?: string;
  putPrice?: number;
  isSoftCall?: boolean;
  callTrigger?: number;
  callPrice?: number;
  callFirstDate?: string;
  callSecondDate?: string;
}

// Cache for loaded data
let cachedBonds: ConvertibleBond[] | null = null;
let cachedHistoricalData: Map<string, HistoricalDataPoint[]> | null = null;

/**
 * Load and parse static fields data
 */
function loadStaticData(): Map<string, StaticBondData> {
  const staticMap = new Map<string, StaticBondData>();
  
  const data = staticFieldsData as { convertible_bonds: StaticBondData[] };
  
  data.convertible_bonds.forEach((bond) => {
    staticMap.set(bond.bloomberg_code, bond);
  });
  
  return staticMap;
}

/**
 * Load and parse historical data, grouped by bond
 */
function loadHistoricalData(): Map<string, HistoricalDataPoint[]> {
  if (cachedHistoricalData) {
    return cachedHistoricalData;
  }
  
  const histMap = new Map<string, HistoricalDataPoint[]>();
  
  const data = cbHistData as HistoricalDataPoint[];
  
  data.forEach((point) => {
    const code = point["Bloomberg code ( ticker or ISIN)"];
    if (!histMap.has(code)) {
      histMap.set(code, []);
    }
    histMap.get(code)!.push(point);
  });
  
  // Sort each bond's history by date
  histMap.forEach((history) => {
    history.sort((a, b) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime());
  });
  
  cachedHistoricalData = histMap;
  return histMap;
}

/**
 * Determine rating based on sector and country (simplified heuristic)
 */
function determineRating(sector: string, country: string): string {
  // Simplified rating logic
  const investmentGradeCountries = ['FRANCE', 'GERMANY', 'NETHERLANDS', 'BELGIUM', 'AUSTRIA'];
  const investmentGradeSectors = ['Utilities', 'Consumer, Non-cyclical', 'Financial'];
  
  if (investmentGradeCountries.includes(country.toUpperCase()) && 
      investmentGradeSectors.some(s => sector.includes(s))) {
    return 'BBB';
  } else if (investmentGradeCountries.includes(country.toUpperCase())) {
    return 'BBB-';
  } else {
    return 'BB+';
  }
}

/**
 * Determine size category based on amount issued
 */
function determineSize(amountIssued: number): string {
  if (amountIssued < 300000000) return 'Small Cap';
  if (amountIssued < 700000000) return 'Mid Cap';
  return 'Large Cap';
}

/**
 * Calculate performance metrics from historical data
 */
function calculatePerformance(history: HistoricalDataPoint[]): {
  performance1D: number | null;
  performance1W: number;
  performance1M: number;
  performance3M: number;
  performanceYTD: number;
} {
  if (history.length === 0) {
    return {
      performance1D: null,
      performance1W: 0,
      performance1M: 0,
      performance3M: 0,
      performanceYTD: 0,
    };
  }
  
  const latest = history[history.length - 1];
  const latestPrice = latest["CB Market Price %"];
  
  // Find historical price points
  const find1DayAgo = history.length > 1 ? history[history.length - 2] : latest;
  const find1WeekAgo = history.length > 5 ? history[history.length - 6] : history[0];
  const find1MonthAgo = history.length > 20 ? history[history.length - 21] : history[0];
  const find3MonthsAgo = history.length > 60 ? history[history.length - 61] : history[0];
  
  // Find year start
  const currentYear = new Date(latest.DATE).getFullYear();
  const yearStart = history.find(h => new Date(h.DATE).getFullYear() === currentYear) || history[0];
  
  const perf1D = latest["CB perf"] || ((latestPrice - find1DayAgo["CB Market Price %"]) / find1DayAgo["CB Market Price %"]) * 100;
  const perf1W = ((latestPrice - find1WeekAgo["CB Market Price %"]) / find1WeekAgo["CB Market Price %"]) * 100;
  const perf1M = ((latestPrice - find1MonthAgo["CB Market Price %"]) / find1MonthAgo["CB Market Price %"]) * 100;
  const perf3M = ((latestPrice - find3MonthsAgo["CB Market Price %"]) / find3MonthsAgo["CB Market Price %"]) * 100;
  const perfYTD = ((latestPrice - yearStart["CB Market Price %"]) / yearStart["CB Market Price %"]) * 100;
  
  return {
    performance1D: perf1D,
    performance1W: perf1W,
    performance1M: perf1M,
    performance3M: perf3M,
    performanceYTD: perfYTD,
  };
}

/**
 * Load all convertible bonds with merged static and historical data
 */
export function loadConvertibleBonds(): ConvertibleBond[] {
  if (cachedBonds) {
    return cachedBonds;
  }
  
  const staticData = loadStaticData();
  const historicalData = loadHistoricalData();
  
  const bonds: ConvertibleBond[] = [];
  
  staticData.forEach((staticBond, bloombergCode) => {
    const history = historicalData.get(bloombergCode) || [];
    
    if (history.length === 0) {
      console.warn(`No historical data for ${bloombergCode}`);
      return;
    }
    
    // Get latest historical data point
    const latest = history[history.length - 1];
    
    // Calculate performance metrics
    const performance = calculatePerformance(history);
    
    // Determine profile based on delta and bondfloor
    let profile = 'Mixed';
    const delta = latest["Delta%"];
    const bondfloorPercent = latest["Bondfloor % "];
    if (delta > 0.7) profile = 'Equity';
    else if (delta < 0.3) profile = 'Bond';
    else if (bondfloorPercent < 70) profile = 'HY';
    
    // Extract underlying ticker from bond name (simplified)
    const underlyingTicker = staticBond.name.split(' ')[0];
    
    const bond: ConvertibleBond = {
      // Core identifiers
      isin: bloombergCode,
      issuer: staticBond.name,
      bloombergCode: bloombergCode,
      sector: staticBond.issuer.sector,
      country: staticBond.issuer.country,
      currency: staticBond.bond_characteristics.currency,
      
      // Static fields
      coupon: staticBond.bond_characteristics.coupon_percent,
      maturity: new Date(staticBond.bond_characteristics.maturity_date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      maturityDate: new Date(staticBond.bond_characteristics.maturity_date),
      rating: determineRating(staticBond.issuer.sector, staticBond.issuer.country),
      size: determineSize(staticBond.bond_characteristics.amount_issued),
      profile: profile,
      conversionRatio: staticBond.bond_characteristics.conversion_ratio,
      nominal: staticBond.bond_characteristics.nominal,
      issuePrice: staticBond.bond_characteristics.issue_price_percent,
      redemptionPrice: staticBond.bond_characteristics.redemption_price_percent,
      premium: staticBond.bond_characteristics.premium_percent,
      amountIssued: staticBond.bond_characteristics.amount_issued,
      conversionPrice: staticBond.bond_characteristics.conversion_price,
      
      // Dynamic pricing fields
      price: latest["CB Market Price %"],
      cbMarketPrice: latest["CB Market Price"],
      stockPrice: latest["Stock price"],
      theoValue: latest["Theo Value"],
      fairValue: latest["Theo Value"],
      
      // Risk metrics (Greeks)
      delta: latest["Delta%"],
      gamma: latest.Gamma,
      vega: latest.Vega,
      theta: latest.Theta,
      rho: latest.Rho,
      
      // Volatility
      volatility: latest["His vol"],
      impliedVol: latest["ImpVol (%)"],
      
      // Credit metrics
      ytm: latest["YTM %"],
      currentYield: latest["Current yield %"],
      spread: latest["Implied Spread (bp)"],
      creditSpread: latest["Credit spread"],
      impliedSpread: latest["Implied Spread (bp)"],
      duration: latest.Duration,
      creditSensitivity: latest["Credit sensitivity "],
      
      // Downside protection
      bondfloor: latest.Bondfloor,
      bondfloorPercent: latest["Bondfloor % "],
      distanceToBondfloor: latest["Distance to bondfloor"],
      
      // Equity sensitivity
      equitySensitivity: latest["Equity sensitivity %"],
      parity: latest.Parity,
      parityPercent: latest["Parity %"],
      prime: latest["Prime %"],
      adjustedPrime: latest["Adjusted prime %"],
      adjustedPna: latest["Adjusted PNA %"],
      
      // Convexity scenarios
      cnvPlus20: latest["cnv +20%"],
      cnvMinus20: latest["cnv -20%"],
      
      // Performance metrics
      performance1D: performance.performance1D,
      performance1W: performance.performance1W,
      performance1M: performance.performance1M,
      performance3M: performance.performance3M,
      performanceYTD: performance.performanceYTD,
      
      // Performance attribution
      shareContrib: latest["Share contrib% "],
      creditSpreadContrib: latest["creditSpread contrib%"],
      carryContrib: latest["CARRY contrib% "],
      rateContrib: latest["Rate contrib%"],
      valuation: latest.Valuation,
      fxContrib: latest["FX CONTRIB"],
      deltaNeutral: latest["Delta neutral"],
      
      // Portfolio info
      outstandingAmount: latest["CB OUTSTANDING"],
      ulOutstanding: latest["UL OUTSTANDING"],
      type: 'Vanilla',
      underlyingTicker: underlyingTicker,
      underlyingPrice: latest["Stock price"],
      issueDate: staticBond.bond_characteristics.issue_date,
      
      // Call/Put features
      isPutable: staticBond.put_option.is_putable,
      putDate: staticBond.put_option.put_date,
      putPrice: staticBond.put_option.put_price_percent,
      isSoftCall: staticBond.soft_call.has_soft_call,
      callTrigger: staticBond.soft_call.call_trigger_percent,
      callPrice: staticBond.soft_call.call_price_percent,
      callFirstDate: staticBond.soft_call.first_call_date,
      callSecondDate: staticBond.soft_call.second_call_date,
    };
    
    bonds.push(bond);
  });
  
  cachedBonds = bonds;
  return bonds;
}

/**
 * Get historical data for a specific bond
 */
export function getBondHistory(bloombergCode: string): HistoricalDataPoint[] {
  const historicalData = loadHistoricalData();
  return historicalData.get(bloombergCode) || [];
}

/**
 * Get historical data for all bonds within a date range
 */
export function getHistoricalDataInRange(
  startDate: Date,
  endDate: Date
): Map<string, HistoricalDataPoint[]> {
  const historicalData = loadHistoricalData();
  const filteredData = new Map<string, HistoricalDataPoint[]>();
  
  historicalData.forEach((history, code) => {
    const filtered = history.filter((point) => {
      const date = new Date(point.DATE);
      return date >= startDate && date <= endDate;
    });
    if (filtered.length > 0) {
      filteredData.set(code, filtered);
    }
  });
  
  return filteredData;
}

/**
 * Get latest data point for each bond
 */
export function getLatestDataPoints(): Map<string, HistoricalDataPoint> {
  const historicalData = loadHistoricalData();
  const latestData = new Map<string, HistoricalDataPoint>();
  
  historicalData.forEach((history, code) => {
    if (history.length > 0) {
      latestData.set(code, history[history.length - 1]);
    }
  });
  
  return latestData;
}

/**
 * Clear cache (useful for testing or reloading data)
 */
export function clearCache(): void {
  cachedBonds = null;
  cachedHistoricalData = null;
}

