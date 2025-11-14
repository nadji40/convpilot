// Mock data for Convertible Bonds Dashboard
// Based on the detailed list of fields from the project requirements

// Static reference data (CB Bond terms and features)
export interface CBStaticData {
  portfolioRef: string;
  bloombergCode: string; // ticker or ISIN
  cbName: string;
  country: string;
  sector: string;
  industryGroup: string;
  conversionRatio: number;
  nominal: number;
  issuePrice: number;
  redemptionPrice: number;
  issueDate: string;
  maturityDate: Date;
  premium: number;
  coupon: number;
  amtIssued: number;
  nextCoupon: string;
  convPrice: number;
  subDebtStatus: string; // Y or N
  currency: string;
  // Put features
  isPutable: string; // Y or N
  putDate?: string;
  putPrice?: number;
  // Call features
  isSoftCall: string; // Y or N
  callScheduleFirstDate?: string;
  callScheduleSecondDate?: string;
  callTrigger?: number;
  callPrice?: number;
  // Dividend protection
  dvdProtection: string; // Y or N
  protectionType?: string; // FULL or partial
  payoutDirection?: string; // UP or DOWN
  dvdThreshold?: number;
  dvdFrequency?: string;
  dvdProjection?: string;
}

// Time-series pricing and risk data
export interface CBTimeSeriesData {
  portfolioRef: string;
  bloombergCode: string;
  date: string;
  cbMarketPrice: number;
  cbMarketPricePercent: number;
  cbOutstanding: number;
  stockPrice: number;
  theoValue: number;
  cbProfile: string; // Mixte, Equity-like, Bond-like
  bondfloor: number;
  bondfloorPercent: number;
  distanceToBondfloor: number;
  creditSpread: number;
  impliedSpread: number;
  currentYield: number;
  ytm: number;
  rho: number | null;
  duration: number | null;
  creditSensitivity: number | null;
  hisVol: number;
  impVol: number;
  delta: number;
  equitySensitivity: number;
  gamma: number;
  cnvPlus20: number;
  cnvMinus20: number;
  vega: number;
  theta: number;
  parity: number;
  parityPercent: number;
  prime: number;
  adjustedPrime: number;
  pna: number | null;
  adjustedPna: number;
  cr: number | null;
  ulOutstanding: number;
  // Performance attribution
  cbPerf: number | null;
  shareContrib: number | null;
  creditSpreadContrib: number | null;
  carryContrib: number | null;
  rateContrib: number | null;
  valuation: number | null;
  fxContrib: number | null;
  deltaNeutral: number | null;
}

// Combined interface for dashboard usage (static + latest time-series data)
export interface ConvertibleBond extends Partial<CBStaticData> {
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
  size: string; // Small Cap, Mid Cap, Large Cap
  profile: string; // Bond, Mixed, Equity, HY, Distressed
  conversionRatio: number;
  
  // Dynamic pricing fields
  price: number; // CB Market Price %
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
  volatility: number; // Historical Vol
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
  type: string; // Vanilla, Mandatory, Exchangeable
  underlyingTicker: string;
  underlyingPrice: number;
  issueDate: string;
  
  // Call/Put features
  isPutable?: string;
  putDate?: string;
  putPrice?: number;
  isSoftCall?: string;
  callTrigger?: number;
  callPrice?: number;
}

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
  avg1DChange: number;
  avg1MChange: number;
}

// Generate 15 realistic convertible bonds based on real data structure
export const mockConvertibleBonds: ConvertibleBond[] = [
  {
    isin: 'FR0013495298',
    issuer: 'ACCOR SA',
    bloombergCode: 'BM8244261 Corp',
    sector: 'Consumer, Cyclical',
    country: 'France',
    currency: 'EUR',
    coupon: 0.7,
    maturity: '2027-12-07',
    maturityDate: new Date('2027-12-07'),
    rating: 'BB+',
    size: 'Large Cap',
    profile: 'Mixte',
    conversionRatio: 1.00,
    
    // Dynamic pricing
    price: 105.5, // CB Market Price %
    cbMarketPrice: 50.64,
    stockPrice: 30.0,
    theoValue: 47.59,
    fairValue: 47.59,
    
    // Greeks
    delta: 0.5387,
    gamma: 0.4187,
    vega: 0.5479,
    theta: 0.0002456,
    rho: null,
    
    // Volatility
    volatility: 30, // Historical Vol
    impliedVol: 40.81,
    
    // Credit metrics
    ytm: -0.0467,
    currentYield: 0.6651,
    spread: 173.11,
    creditSpread: 291.68,
    impliedSpread: 173.11,
    duration: null,
    creditSensitivity: null,
    
    // Downside protection
    bondfloor: 42.34,
    bondfloorPercent: 87.98,
    distanceToBondfloor: 16.40,
    
    // Equity sensitivity
    equitySensitivity: 0.3211,
    parity: 30.0,
    parityPercent: 62.34,
    prime: 68.80,
    adjustedPrime: 68.80,
    adjustedPna: 9.81,
    
    // Convexity
    cnvPlus20: 6.86,
    cnvMinus20: -5.86,
    
    // Performance
    performance1D: 0.516, // 0.516%
    performance1W: 2.5,
    performance1M: 5.8,
    performance3M: 8.2,
    performanceYTD: 12.5,
    
    // Attribution
    shareContrib: 0.444,
    creditSpreadContrib: 0.075,
    carryContrib: -0.017,
    rateContrib: 0.021,
    valuation: -0.0063,
    fxContrib: 0,
    deltaNeutral: 0.072,
    
    // Portfolio info
    outstandingAmount: 526184490.96,
    ulOutstanding: 311720670,
    type: 'Vanilla',
    underlyingTicker: 'AC.PA',
    underlyingPrice: 30.0,
    issueDate: '2020-12-07',
    
    // Call/Put features
    isPutable: 'N',
    isSoftCall: 'Y',
    callScheduleFirstDate: '2025-12-28',
    callScheduleSecondDate: '2027-12-07',
    callTrigger: 140.00,
    callPrice: 100,
    dvdProtection: 'Y',
    protectionType: 'FULL',
    payoutDirection: 'UP',
    dvdThreshold: 0,
    dvdFrequency: 'ANNUAL',
  },
  {
    isin: 'FR0014003U71',
    issuer: 'AIR FRANCE-KLM',
    bloombergCode: 'AF Corp',
    sector: 'Transport & Leisure',
    country: 'France',
    currency: 'EUR',
    coupon: 3.0,
    maturity: '2025-06-15',
    maturityDate: new Date('2025-06-15'),
    rating: 'B',
    size: 'Large Cap',
    profile: 'HY',
    conversionRatio: 12.8,
    
    // Dynamic pricing
    price: 98.2,
    cbMarketPrice: 47.25,
    stockPrice: 8.5,
    theoValue: 97.8,
    fairValue: 97.8,
    
    // Greeks
    delta: 0.62,
    gamma: 0.018,
    vega: 0.35,
    theta: -0.022,
    rho: 0.08,
    
    // Volatility
    volatility: 45.8,
    impliedVol: 48.5,
    
    // Credit metrics
    ytm: 4.5,
    currentYield: 3.05,
    spread: 320,
    creditSpread: 380,
    impliedSpread: 320,
    duration: 1.8,
    creditSensitivity: 1.6,
    
    // Downside protection
    bondfloor: 39.5,
    bondfloorPercent: 82.0,
    distanceToBondfloor: 16.2,
    
    // Equity sensitivity
    equitySensitivity: 0.58,
    parity: 88.5,
    parityPercent: 45.2,
    prime: 9.7,
    adjustedPrime: 9.7,
    adjustedPna: 7.5,
    
    // Convexity
    cnvPlus20: 8.2,
    cnvMinus20: -6.8,
    
    // Performance
    performance1D: -0.8,
    performance1W: 1.2,
    performance1M: 3.5,
    performance3M: 6.8,
    performanceYTD: 8.5,
    
    // Attribution
    shareContrib: -0.65,
    creditSpreadContrib: 0.12,
    carryContrib: 0.08,
    rateContrib: -0.02,
    valuation: 0.015,
    fxContrib: 0,
    deltaNeutral: -0.345,
    
    // Portfolio info
    outstandingAmount: 500000000,
    ulOutstanding: 380000000,
    type: 'Vanilla',
    underlyingTicker: 'AF.PA',
    underlyingPrice: 8.5,
    issueDate: '2022-05-15',
    
    // Call/Put features
    isPutable: 'N',
    isSoftCall: 'Y',
    callTrigger: 130.0,
  },
  {
    isin: 'DE000A3E5MK5',
    issuer: 'ADIDAS AG',
    bloombergCode: 'ADS Corp',
    sector: 'Retail',
    country: 'Germany',
    currency: 'EUR',
    coupon: 0.5,
    maturity: '2026-03-20',
    maturityDate: new Date('2026-03-20'),
    rating: 'A-',
    size: 'Large Cap',
    profile: 'Bond',
    conversionRatio: 5.2,
    price: 104.8,
    cbMarketPrice: 52.4,
    stockPrice: 195.5,
    theoValue: 105.5,
    fairValue: 105.5,
    delta: 0.25,
    gamma: 0.008,
    vega: 0.15,
    theta: -0.010,
    rho: 0.15,
    volatility: 28.3,
    impliedVol: 30.5,
    ytm: 1.8,
    currentYield: 0.48,
    spread: 85,
    creditSpread: 110,
    impliedSpread: 85,
    duration: 3.5,
    creditSensitivity: 3.2,
    bondfloor: 50.0,
    bondfloorPercent: 95.2,
    distanceToBondfloor: 9.6,
    equitySensitivity: 0.23,
    parity: 98.5,
    parityPercent: 52.3,
    prime: 6.3,
    adjustedPrime: 6.3,
    adjustedPna: 4.5,
    cnvPlus20: 4.2,
    cnvMinus20: -3.8,
    performance1D: 0.5,
    performance1W: 1.8,
    performance1M: 4.2,
    performance3M: 7.5,
    performanceYTD: 11.2,
    shareContrib: 0.38,
    creditSpreadContrib: 0.05,
    carryContrib: 0.01,
    rateContrib: 0.03,
    valuation: 0.02,
    fxContrib: 0,
    deltaNeutral: 0.01,
    outstandingAmount: 750000000,
    ulOutstanding: 520000000,
    type: 'Vanilla',
    underlyingTicker: 'ADS.DE',
    underlyingPrice: 195.5,
    issueDate: '2021-03-20',
    isPutable: 'N',
    isSoftCall: 'N',
  },
  {
    isin: 'ES0000102246',
    issuer: 'AMADEUS IT GROUP',
    bloombergCode: 'AMS Corp',
    sector: 'Technology',
    country: 'Spain',
    currency: 'EUR',
    coupon: 0.25,
    maturity: '2025-11-30',
    maturityDate: new Date('2025-11-30'),
    rating: 'BBB',
    size: 'Large Cap',
    profile: 'Equity',
    conversionRatio: 18.5,
    price: 112.5,
    cbMarketPrice: 56.25,
    stockPrice: 68.5,
    theoValue: 111.8,
    fairValue: 111.8,
    delta: 0.78,
    gamma: 0.025,
    vega: 0.42,
    theta: -0.028,
    rho: 0.06,
    volatility: 38.5,
    impliedVol: 41.2,
    ytm: 0.5,
    currentYield: 0.22,
    spread: 45,
    creditSpread: 65,
    impliedSpread: 45,
    duration: 1.5,
    creditSensitivity: 1.3,
    bondfloor: 39.3,
    bondfloorPercent: 78.5,
    distanceToBondfloor: 34.0,
    equitySensitivity: 0.72,
    parity: 108.5,
    parityPercent: 96.4,
    prime: 4.0,
    adjustedPrime: 4.0,
    adjustedPna: 3.5,
    cnvPlus20: 12.5,
    cnvMinus20: -10.2,
    performance1D: 2.5,
    performance1W: 5.2,
    performance1M: 10.5,
    performance3M: 18.2,
    performanceYTD: 22.8,
    shareContrib: 2.1,
    creditSpreadContrib: 0.15,
    carryContrib: -0.02,
    rateContrib: 0.05,
    valuation: 0.15,
    fxContrib: 0,
    deltaNeutral: 0.07,
    outstandingAmount: 450000000,
    ulOutstanding: 340000000,
    type: 'Vanilla',
    underlyingTicker: 'AMS.MC',
    underlyingPrice: 68.5,
    issueDate: '2020-11-30',
    isPutable: 'N',
    isSoftCall: 'Y',
    callTrigger: 130.0,
  },
  {
    isin: 'FR0013518685',
    issuer: 'GENFIT SA',
    sector: 'Healthcare-Services',
    country: 'France',
    currency: 'EUR',
    coupon: 4.5,
    maturity: '2025-09-15',
    maturityDate: new Date('2025-09-15'),
    rating: 'NR',
    size: 'Small Cap',
    profile: 'Distressed',
    price: 75.5,
    delta: 0.35,
    gamma: 0.015,
    vega: 0.38,
    volatility: 85.2,
    ytm: 12.5,
    currentYield: 5.96,
    spread: 950,
    creditSpread: 1100,
    fairValue: 72.8,
    bondfloorPercent: 68.0,
    distanceToBondfloor: 7.5,
    duration: 1.2,
    creditSensitivity: 1.0,
    equitySensitivity: 0.32,
    impliedVol: 92.5,
    parity: 65.5,
    prime: 10.0,
    theta: -0.032,
    rho: 0.04,
    performance1D: -1.5,
    performance1W: -3.8,
    performance1M: -8.2,
    performance3M: -15.5,
    performanceYTD: -22.8,
    type: 'Vanilla',
    conversionRatio: 45.2,
    underlyingTicker: 'GNFT.PA',
    underlyingPrice: 2.8,
    issueDate: '2020-09-15',
    outstandingAmount: 120000000,
  },
  {
    isin: 'IT0005440976',
    issuer: 'TELECOM ITALIA',
    sector: 'Telecommunications',
    country: 'Italy',
    currency: 'EUR',
    coupon: 1.5,
    maturity: '2026-07-18',
    maturityDate: new Date('2026-07-18'),
    rating: 'BB-',
    size: 'Large Cap',
    profile: 'HY',
    price: 96.8,
    delta: 0.48,
    gamma: 0.014,
    vega: 0.32,
    volatility: 42.5,
    ytm: 3.8,
    currentYield: 1.55,
    spread: 285,
    creditSpread: 340,
    fairValue: 96.2,
    bondfloorPercent: 85.5,
    distanceToBondfloor: 11.3,
    duration: 3.8,
    creditSensitivity: 3.5,
    equitySensitivity: 0.45,
    impliedVol: 45.8,
    parity: 92.5,
    prime: 4.3,
    theta: -0.018,
    rho: 0.14,
    performance1D: 0.3,
    performance1W: 0.8,
    performance1M: 2.2,
    performance3M: 3.8,
    performanceYTD: 5.5,
    type: 'Vanilla',
    conversionRatio: 185.5,
    underlyingTicker: 'TIT.MI',
    underlyingPrice: 0.28,
    issueDate: '2021-07-18',
    outstandingAmount: 850000000,
  },
  {
    isin: 'FR0014004QR1',
    issuer: 'NEXITY SA',
    sector: 'Real Estate',
    country: 'France',
    currency: 'EUR',
    coupon: 2.0,
    maturity: '2027-04-10',
    maturityDate: new Date('2027-04-10'),
    rating: 'BBB-',
    size: 'Mid Cap',
    profile: 'Mixed',
    price: 99.5,
    delta: 0.52,
    gamma: 0.016,
    vega: 0.30,
    volatility: 38.8,
    ytm: 3.2,
    currentYield: 2.01,
    spread: 215,
    creditSpread: 265,
    fairValue: 100.2,
    bondfloorPercent: 86.8,
    distanceToBondfloor: 12.7,
    duration: 4.5,
    creditSensitivity: 4.2,
    equitySensitivity: 0.48,
    impliedVol: 42.5,
    parity: 94.8,
    prime: 4.7,
    theta: -0.020,
    rho: 0.17,
    performance1D: 0.8,
    performance1W: 1.5,
    performance1M: 3.8,
    performance3M: 6.5,
    performanceYTD: 9.2,
    type: 'Vanilla',
    conversionRatio: 35.8,
    underlyingTicker: 'NXI.PA',
    underlyingPrice: 28.5,
    issueDate: '2022-04-10',
    outstandingAmount: 280000000,
  },
  {
    isin: 'DE000A3H3L37',
    issuer: 'SIEMENS ENERGY AG',
    sector: 'Industrial',
    country: 'Germany',
    currency: 'EUR',
    coupon: 0.875,
    maturity: '2028-05-26',
    maturityDate: new Date('2028-05-26'),
    rating: 'BBB',
    size: 'Large Cap',
    profile: 'Bond',
    price: 101.2,
    delta: 0.38,
    gamma: 0.011,
    vega: 0.22,
    volatility: 35.2,
    ytm: 2.5,
    currentYield: 0.86,
    spread: 145,
    creditSpread: 185,
    fairValue: 101.8,
    bondfloorPercent: 92.5,
    distanceToBondfloor: 8.7,
    duration: 5.2,
    creditSensitivity: 4.8,
    equitySensitivity: 0.36,
    impliedVol: 38.5,
    parity: 96.5,
    prime: 4.7,
    theta: -0.014,
    rho: 0.21,
    performance1D: 0.6,
    performance1W: 2.1,
    performance1M: 4.8,
    performance3M: 8.5,
    performanceYTD: 13.2,
    type: 'Vanilla',
    conversionRatio: 42.5,
    underlyingTicker: 'ENR.DE',
    underlyingPrice: 25.8,
    issueDate: '2023-05-26',
    outstandingAmount: 900000000,
  },
  {
    isin: 'GB00BMXN3C26',
    issuer: 'MARKS & SPENCER',
    sector: 'Retail',
    country: 'France',
    currency: 'EUR',
    coupon: 3.75,
    maturity: '2025-12-01',
    maturityDate: new Date('2025-12-01'),
    rating: 'BB',
    size: 'Large Cap',
    profile: 'HY',
    price: 103.5,
    delta: 0.58,
    gamma: 0.019,
    vega: 0.36,
    volatility: 40.5,
    ytm: 2.2,
    currentYield: 3.62,
    spread: 195,
    creditSpread: 245,
    fairValue: 103.8,
    bondfloorPercent: 88.5,
    distanceToBondfloor: 15.0,
    duration: 1.6,
    creditSensitivity: 1.5,
    equitySensitivity: 0.54,
    impliedVol: 43.8,
    parity: 98.5,
    prime: 5.0,
    theta: -0.024,
    rho: 0.07,
    performance1D: 1.8,
    performance1W: 3.2,
    performance1M: 6.5,
    performance3M: 11.2,
    performanceYTD: 15.8,
    type: 'Vanilla',
    conversionRatio: 52.8,
    underlyingTicker: 'MKS.L',
    underlyingPrice: 3.85,
    issueDate: '2020-12-01',
    outstandingAmount: 350000000,
  },
  {
    isin: 'NL0015000N94',
    issuer: 'BASIC-FIT NV',
    sector: 'Transport & Leisure',
    country: 'Netherlands',
    currency: 'EUR',
    coupon: 2.5,
    maturity: '2027-06-15',
    maturityDate: new Date('2027-06-15'),
    rating: 'B+',
    size: 'Mid Cap',
    profile: 'HY',
    price: 100.8,
    delta: 0.55,
    gamma: 0.017,
    vega: 0.34,
    volatility: 48.5,
    ytm: 3.5,
    currentYield: 2.48,
    spread: 295,
    creditSpread: 355,
    fairValue: 100.2,
    bondfloorPercent: 84.5,
    distanceToBondfloor: 16.3,
    duration: 4.0,
    creditSensitivity: 3.7,
    equitySensitivity: 0.51,
    impliedVol: 52.5,
    parity: 95.8,
    prime: 5.0,
    theta: -0.021,
    rho: 0.16,
    performance1D: 1.2,
    performance1W: 2.8,
    performance1M: 7.2,
    performance3M: 12.5,
    performanceYTD: 18.5,
    type: 'Vanilla',
    conversionRatio: 28.5,
    underlyingTicker: 'BFIT.AS',
    underlyingPrice: 38.5,
    issueDate: '2022-06-15',
    outstandingAmount: 220000000,
  },
  {
    isin: 'FR0014005AC1',
    issuer: 'VALLOUREC SA',
    sector: 'Basic Materials',
    country: 'France',
    currency: 'EUR',
    coupon: 5.0,
    maturity: '2026-10-30',
    maturityDate: new Date('2026-10-30'),
    rating: 'B-',
    size: 'Mid Cap',
    profile: 'HY',
    price: 97.2,
    delta: 0.61,
    gamma: 0.020,
    vega: 0.40,
    volatility: 55.8,
    ytm: 6.5,
    currentYield: 5.14,
    spread: 485,
    creditSpread: 565,
    fairValue: 96.8,
    bondfloorPercent: 78.5,
    distanceToBondfloor: 18.7,
    duration: 3.2,
    creditSensitivity: 2.9,
    equitySensitivity: 0.57,
    impliedVol: 60.5,
    parity: 88.5,
    prime: 8.7,
    theta: -0.026,
    rho: 0.12,
    performance1D: 0.5,
    performance1W: 1.8,
    performance1M: 4.5,
    performance3M: 8.8,
    performanceYTD: 12.5,
    type: 'Vanilla',
    conversionRatio: 125.8,
    underlyingTicker: 'VK.PA',
    underlyingPrice: 14.5,
    issueDate: '2021-10-30',
    outstandingAmount: 380000000,
  },
  {
    isin: 'DE000A3E5RK9',
    issuer: 'FRESENIUS MEDICAL CARE',
    sector: 'Healthcare-Services',
    country: 'Germany',
    currency: 'EUR',
    coupon: 0.875,
    maturity: '2028-02-15',
    maturityDate: new Date('2028-02-15'),
    rating: 'BBB+',
    size: 'Large Cap',
    profile: 'Bond',
    price: 102.8,
    delta: 0.32,
    gamma: 0.009,
    vega: 0.18,
    volatility: 26.5,
    ytm: 2.0,
    currentYield: 0.85,
    spread: 95,
    creditSpread: 125,
    fairValue: 103.5,
    bondfloorPercent: 94.8,
    distanceToBondfloor: 8.0,
    duration: 5.5,
    creditSensitivity: 5.1,
    equitySensitivity: 0.30,
    impliedVol: 29.5,
    parity: 98.8,
    prime: 4.0,
    theta: -0.011,
    rho: 0.23,
    performance1D: 0.4,
    performance1W: 1.2,
    performance1M: 3.5,
    performance3M: 6.8,
    performanceYTD: 10.2,
    type: 'Vanilla',
    conversionRatio: 18.5,
    underlyingTicker: 'FME.DE',
    underlyingPrice: 58.5,
    issueDate: '2023-02-15',
    outstandingAmount: 680000000,
  },
  {
    isin: 'FR0014009NU6',
    issuer: 'VEOLIA ENVIRONNEMENT',
    sector: 'Utilities',
    country: 'France',
    currency: 'EUR',
    coupon: 0.0,
    maturity: '2029-01-01',
    maturityDate: new Date('2029-01-01'),
    rating: 'BBB+',
    size: 'Large Cap',
    profile: 'Equity',
    price: 115.5,
    delta: 0.82,
    gamma: 0.028,
    vega: 0.45,
    volatility: 32.8,
    ytm: 0.8,
    currentYield: 0.0,
    spread: 35,
    creditSpread: 55,
    fairValue: 114.8,
    bondfloorPercent: 72.5,
    distanceToBondfloor: 43.0,
    duration: 6.2,
    creditSensitivity: 5.8,
    equitySensitivity: 0.78,
    impliedVol: 36.5,
    parity: 112.5,
    prime: 3.0,
    theta: -0.030,
    rho: 0.26,
    performance1D: 2.2,
    performance1W: 4.5,
    performance1M: 9.8,
    performance3M: 16.5,
    performanceYTD: 24.8,
    type: 'Mandatory',
    conversionRatio: 38.5,
    underlyingTicker: 'VIE.PA',
    underlyingPrice: 32.5,
    issueDate: '2024-01-01',
    outstandingAmount: 500000000,
  },
  {
    isin: 'IT0005508152',
    issuer: 'ENEL SPA',
    sector: 'Utilities',
    country: 'Italy',
    currency: 'EUR',
    coupon: 0.0,
    maturity: '2027-09-17',
    maturityDate: new Date('2027-09-17'),
    rating: 'BBB+',
    size: 'Large Cap',
    profile: 'Mixed',
    price: 106.2,
    delta: 0.68,
    gamma: 0.022,
    vega: 0.38,
    volatility: 30.5,
    ytm: 1.2,
    currentYield: 0.0,
    spread: 65,
    creditSpread: 85,
    fairValue: 106.8,
    bondfloorPercent: 81.5,
    distanceToBondfloor: 24.7,
    duration: 4.8,
    creditSensitivity: 4.5,
    equitySensitivity: 0.64,
    impliedVol: 34.2,
    parity: 102.5,
    prime: 3.7,
    theta: -0.025,
    rho: 0.19,
    performance1D: 1.5,
    performance1W: 3.2,
    performance1M: 7.5,
    performance3M: 13.2,
    performanceYTD: 19.5,
    type: 'Mandatory',
    conversionRatio: 125.5,
    underlyingTicker: 'ENEL.MI',
    underlyingPrice: 6.85,
    issueDate: '2022-09-17',
    outstandingAmount: 1200000000,
  },
  {
    isin: 'FR0013530052',
    issuer: 'CARREFOUR SA',
    sector: 'Food & Beverages',
    country: 'France',
    currency: 'EUR',
    coupon: 0.0,
    maturity: '2027-02-01',
    maturityDate: new Date('2027-02-01'),
    rating: 'BBB',
    size: 'Large Cap',
    profile: 'Equity',
    price: 108.8,
    delta: 0.72,
    gamma: 0.024,
    vega: 0.40,
    volatility: 34.5,
    ytm: 1.0,
    currentYield: 0.0,
    spread: 55,
    creditSpread: 75,
    fairValue: 108.2,
    bondfloorPercent: 79.5,
    distanceToBondfloor: 29.3,
    duration: 4.2,
    creditSensitivity: 3.9,
    equitySensitivity: 0.68,
    impliedVol: 38.5,
    parity: 105.5,
    prime: 3.3,
    theta: -0.027,
    rho: 0.17,
    performance1D: 1.8,
    performance1W: 3.5,
    performance1M: 8.2,
    performance3M: 14.5,
    performanceYTD: 21.2,
    type: 'Mandatory',
    conversionRatio: 58.5,
    underlyingTicker: 'CA.PA',
    underlyingPrice: 18.5,
    issueDate: '2020-02-01',
    outstandingAmount: 750000000,
  },
].map((bond: any, index) => {
  // Auto-populate missing required fields with sensible defaults
  if (!bond.bloombergCode) {
    const ticker = bond.underlyingTicker.split('.')[0];
    return {
      ...bond,
      bloombergCode: `${ticker} Corp`,
      cbMarketPrice: bond.price * 0.5,
      stockPrice: bond.underlyingPrice,
      theoValue: bond.fairValue,
      bondfloor: (bond.bondfloorPercent / 100) * bond.price,
      parityPercent: (bond.parity / bond.price) * 100,
      adjustedPrime: bond.prime,
      adjustedPna: bond.prime * 0.7,
      cnvPlus20: bond.delta * 20 * 0.8,
      cnvMinus20: -bond.delta * 20 * 0.7,
      impliedSpread: bond.spread,
      ulOutstanding: bond.outstandingAmount * 0.75,
      shareContrib: (bond.performance1D || 0) * bond.delta,
      creditSpreadContrib: (bond.performance1D || 0) * 0.1,
      carryContrib: (bond.performance1D || 0) * 0.02,
      rateContrib: (bond.performance1D || 0) * 0.05,
      valuation: (bond.performance1D || 0) * 0.03,
      fxContrib: 0,
      deltaNeutral: (bond.performance1D || 0) * 0.05,
      isPutable: index % 3 === 0 ? 'Y' : 'N',
      putDate: index % 3 === 0 ? new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      putPrice: index % 3 === 0 ? 100 : undefined,
      isSoftCall: index % 2 === 0 ? 'Y' : 'N',
      callScheduleFirstDate: index % 2 === 0 ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      callTrigger: index % 2 === 0 ? 130 + (index * 5) : undefined,
      callPrice: index % 2 === 0 ? 100 : undefined,
    };
  }
  return bond;
});

// Generate historical data for each bond (30 days)
export const generateHistoricalData = (bond: ConvertibleBond): HistoricalDataPoint[] => {
  const history: HistoricalDataPoint[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate price movements
    const dayProgress = (29 - i) / 29;
    const monthReturn = bond.performance1M / 100;
    const dailyReturn = monthReturn / 30;
    const randomness = (Math.random() - 0.5) * 0.02;
    
    const priceMultiplier = 1 + (dailyReturn * (i + 1)) + randomness;
    const cbPrice = bond.price / (1 + monthReturn) * priceMultiplier;
    
    // Underlying price follows similar pattern but with different magnitude
    const underlyingMultiplier = 1 + (dailyReturn * (i + 1) * 1.2) + randomness * 1.5;
    const underlyingPrice = bond.underlyingPrice / (1 + monthReturn * 1.2) * underlyingMultiplier;
    
    // Delta and volatility vary slightly
    const delta = Math.max(0.1, Math.min(0.95, bond.delta + (Math.random() - 0.5) * 0.1));
    const volatility = Math.max(15, bond.volatility + (Math.random() - 0.5) * 5);
    
    history.push({
      date: date.toISOString().split('T')[0],
      cbPrice: Number(cbPrice.toFixed(2)),
      underlyingPrice: Number(underlyingPrice.toFixed(2)),
      delta: Number(delta.toFixed(3)),
      volatility: Number(volatility.toFixed(1)),
    });
  }
  
  return history;
};

// Market summary calculated from bonds
export const calculateMarketSummary = (bonds: ConvertibleBond[]): MarketSummary => {
  return {
    totalCBs: bonds.length,
    totalMarketCap: bonds.reduce((sum, bond) => sum + bond.outstandingAmount, 0),
    avgYield: bonds.reduce((sum, bond) => sum + bond.ytm, 0) / bonds.length,
    avg1DChange: bonds.reduce((sum, bond) => sum + (bond.performance1D || 0), 0) / bonds.length,
    avg1MChange: bonds.reduce((sum, bond) => sum + bond.performance1M, 0) / bonds.length,
  };
};

// Aggregated data by sector
export const aggregateBySector = (bonds: ConvertibleBond[]) => {
  const sectors: { [key: string]: { count: number; marketCap: number; avgDelta: number; avgPerf1M: number } } = {};
  
  bonds.forEach(bond => {
    if (!sectors[bond.sector]) {
      sectors[bond.sector] = { count: 0, marketCap: 0, avgDelta: 0, avgPerf1M: 0 };
    }
    sectors[bond.sector].count++;
    sectors[bond.sector].marketCap += bond.outstandingAmount;
    sectors[bond.sector].avgDelta += bond.delta;
    sectors[bond.sector].avgPerf1M += bond.performance1M;
  });
  
  return Object.entries(sectors).map(([name, data]) => ({
    name,
    value: data.count,
    marketCap: data.marketCap,
    avgDelta: data.avgDelta / data.count,
    avgPerf1M: data.avgPerf1M / data.count,
  }));
};

// Aggregated data by rating
export const aggregateByRating = (bonds: ConvertibleBond[]) => {
  const ratingGroups: { [key: string]: { count: number; marketCap: number; avgYield: number } } = {};
  
  bonds.forEach(bond => {
    let group = 'NR';
    if (bond.rating.startsWith('AAA') || bond.rating.startsWith('AA') || bond.rating.startsWith('A')) {
      group = 'IG'; // Investment Grade
    } else if (bond.rating.startsWith('BB') || bond.rating.startsWith('B')) {
      group = 'HY'; // High Yield
    }
    
    if (!ratingGroups[group]) {
      ratingGroups[group] = { count: 0, marketCap: 0, avgYield: 0 };
    }
    ratingGroups[group].count++;
    ratingGroups[group].marketCap += bond.outstandingAmount;
    ratingGroups[group].avgYield += bond.ytm;
  });
  
  return Object.entries(ratingGroups).map(([name, data]) => ({
    name,
    value: data.count,
    marketCap: data.marketCap,
    avgYield: data.avgYield / data.count,
  }));
};

// Aggregated data by maturity
export const aggregateByMaturity = (bonds: ConvertibleBond[]) => {
  const maturityGroups: { [key: string]: { count: number; marketCap: number; avgYTM: number } } = {};
  
  bonds.forEach(bond => {
    const yearsToMaturity = (bond.maturityDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 365);
    let group = '> 5Y';
    if (yearsToMaturity < 1) {
      group = '< 1Y';
    } else if (yearsToMaturity < 2) {
      group = '1-2Y';
    } else if (yearsToMaturity < 5) {
      group = '2-5Y';
    }
    
    if (!maturityGroups[group]) {
      maturityGroups[group] = { count: 0, marketCap: 0, avgYTM: 0 };
    }
    maturityGroups[group].count++;
    maturityGroups[group].marketCap += bond.outstandingAmount;
    maturityGroups[group].avgYTM += bond.ytm;
  });
  
  return Object.entries(maturityGroups).map(([name, data]) => ({
    name,
    value: data.count,
    marketCap: data.marketCap,
    avgYTM: data.avgYTM / data.count,
  }));
};

// Aggregated data by size
export const aggregateBySize = (bonds: ConvertibleBond[]) => {
  const sizeGroups: { [key: string]: { count: number; marketCap: number; avgDelta: number } } = {};
  
  bonds.forEach(bond => {
    if (!sizeGroups[bond.size]) {
      sizeGroups[bond.size] = { count: 0, marketCap: 0, avgDelta: 0 };
    }
    sizeGroups[bond.size].count++;
    sizeGroups[bond.size].marketCap += bond.outstandingAmount;
    sizeGroups[bond.size].avgDelta += bond.delta;
  });
  
  return Object.entries(sizeGroups).map(([name, data]) => ({
    name,
    value: data.count,
    marketCap: data.marketCap,
    avgDelta: data.avgDelta / data.count,
  }));
};

// Aggregated data by profile
export const aggregateByProfile = (bonds: ConvertibleBond[]) => {
  const profileGroups: { [key: string]: { count: number; marketCap: number; avgPerf: number } } = {};
  
  bonds.forEach(bond => {
    if (!profileGroups[bond.profile]) {
      profileGroups[bond.profile] = { count: 0, marketCap: 0, avgPerf: 0 };
    }
    profileGroups[bond.profile].count++;
    profileGroups[bond.profile].marketCap += bond.outstandingAmount;
    profileGroups[bond.profile].avgPerf += bond.performance1M;
  });
  
  return Object.entries(profileGroups).map(([name, data]) => ({
    name,
    value: data.count,
    marketCap: data.marketCap,
    avgPerf: data.avgPerf / data.count,
  }));
};

// Generate market index data (for overview chart)
export const generateMarketIndexData = () => {
  const data = [];
  const today = new Date();
  const baseValue = 100;
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate market movement with slight upward trend
    const trend = (29 - i) * 0.15;
    const randomness = (Math.random() - 0.5) * 2;
    const cbIndex = baseValue + trend + randomness;
    const equityIndex = baseValue + trend * 1.3 + randomness * 1.5;
    const deltaNeutralIndex = baseValue + trend * 0.7 + randomness * 0.8;
    
    data.push({
      date: date.toISOString().split('T')[0],
      cb: Number(cbIndex.toFixed(2)),
      equity: Number(equityIndex.toFixed(2)),
      deltaNeutral: Number(deltaNeutralIndex.toFixed(2)),
    });
  }
  
  return data;
};

