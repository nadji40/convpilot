// Test file to validate calculations match formulas from calcs.md
import {
  standardizeRating,
  classifyCreditRisk,
  classifyMarketCapSize,
  classifyResidualMaturity,
  calculateVolSpread,
  determineRelativeSituation,
  calculateDownsideRisk,
  calculateAverageVolatilitySpreads,
  calculateSpreadToAverage,
  calculateZScore,
  determineObservation,
  rebaseToBase100,
  calculateYTDPerformance,
  calculateMTDPerformance,
  calculate3MPerformance,
} from '../utils/calculations';

// Test Rating Standardization
console.log('\n=== RATING STANDARDIZATION TESTS ===');
console.log('S&P Ratings:');
console.log('A+ →', standardizeRating('A+'));           // Expected: 'A'
console.log('AA- →', standardizeRating('AA-'));         // Expected: 'AA'
console.log('BBB+ →', standardizeRating('BBB+'));       // Expected: 'BBB'
console.log('BB+ →', standardizeRating('BB+'));         // Expected: 'BB'
console.log('CCC- →', standardizeRating('CCC-'));       // Expected: 'CCC'

console.log('\nMoody\'s Ratings:');
console.log('A1 →', standardizeRating('A1'));           // Expected: 'A'
console.log('Aa2 →', standardizeRating('Aa2'));         // Expected: 'AA'
console.log('Baa3 →', standardizeRating('Baa3'));       // Expected: 'BBB'
console.log('Ba1 →', standardizeRating('Ba1'));         // Expected: 'BB'
console.log('Caa2 →', standardizeRating('Caa2'));       // Expected: 'CCC'

// Test Credit Risk Classification
console.log('\n=== CREDIT RISK CLASSIFICATION TESTS ===');
console.log('AAA →', classifyCreditRisk('AAA'));        // Expected: 'IG'
console.log('A →', classifyCreditRisk('A'));            // Expected: 'IG'
console.log('BBB →', classifyCreditRisk('BBB'));        // Expected: 'IG'
console.log('BB →', classifyCreditRisk('BB'));          // Expected: 'HY'
console.log('B →', classifyCreditRisk('B'));            // Expected: 'HY'
console.log('CCC →', classifyCreditRisk('CCC'));        // Expected: 'HY'
console.log('NR →', classifyCreditRisk('NR'));          // Expected: 'NR'

// Test Market Cap Classification
console.log('\n=== MARKET CAP CLASSIFICATION TESTS ===');
console.log('1B EUR →', classifyMarketCapSize(1_000_000_000));           // Expected: 'Small Cap'
console.log('2.5B EUR →', classifyMarketCapSize(2_500_000_000));         // Expected: 'Mid Cap'
console.log('5B EUR →', classifyMarketCapSize(5_000_000_000));           // Expected: 'Mid Cap'
console.log('6.9B EUR →', classifyMarketCapSize(6_900_000_000));         // Expected: 'Large Cap'
console.log('10B EUR →', classifyMarketCapSize(10_000_000_000));         // Expected: 'Large Cap'

// Test Residual Maturity Classification
console.log('\n=== RESIDUAL MATURITY CLASSIFICATION TESTS ===');
const today = new Date();
const in6Months = new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000);
const in18Months = new Date(today.getTime() + 540 * 24 * 60 * 60 * 1000);
const in3Years = new Date(today.getTime() + 1095 * 24 * 60 * 60 * 1000);
const in7Years = new Date(today.getTime() + 2555 * 24 * 60 * 60 * 1000);

console.log('6 months →', classifyResidualMaturity(in6Months));          // Expected: '<1Y'
console.log('18 months →', classifyResidualMaturity(in18Months));        // Expected: ']1,2]'
console.log('3 years →', classifyResidualMaturity(in3Years));            // Expected: ']2,5]'
console.log('7 years →', classifyResidualMaturity(in7Years));            // Expected: '>5Y'

// Test Volatility Spread Calculations
console.log('\n=== VOLATILITY SPREAD TESTS ===');
const volSpread1 = calculateVolSpread(35, 30);  // ImpVol 35%, HistVol 30%
const volSpread2 = calculateVolSpread(30, 35);  // ImpVol 30%, HistVol 35%
const volSpread3 = calculateVolSpread(35, 32);  // ImpVol 35%, HistVol 32%
const volSpread4 = calculateVolSpread(42, 36);  // ImpVol 42%, HistVol 36%
const volSpread5 = calculateVolSpread(50, 40);  // ImpVol 50%, HistVol 40%

console.log('ImpVol 35%, HistVol 30% → Vol Spread:', volSpread1);       // Expected: 5
console.log('ImpVol 30%, HistVol 35% → Vol Spread:', volSpread2);       // Expected: -5
console.log('ImpVol 35%, HistVol 32% → Vol Spread:', volSpread3);       // Expected: 3
console.log('ImpVol 42%, HistVol 36% → Vol Spread:', volSpread4);       // Expected: 6
console.log('ImpVol 50%, HistVol 40% → Vol Spread:', volSpread5);       // Expected: 10

// Test Relative Situation
console.log('\n=== RELATIVE SITUATION TESTS ===');
console.log('Vol Spread -5 →', determineRelativeSituation(volSpread2)); // Expected: 'underpriced'
console.log('Vol Spread 3 →', determineRelativeSituation(volSpread3));  // Expected: 'fair value'
console.log('Vol Spread 5 →', determineRelativeSituation(volSpread1));  // Expected: 'overpriced'
console.log('Vol Spread 6 →', determineRelativeSituation(volSpread4));  // Expected: 'overpriced'
console.log('Vol Spread 10 →', determineRelativeSituation(volSpread5)); // Expected: 'expensive'

// Test Downside Risk
console.log('\n=== DOWNSIDE RISK TESTS ===');
console.log('Vol Spread 5, Vega 0.3 →', calculateDownsideRisk(volSpread1, 0.3));   // Expected: 1.5
console.log('Vol Spread -5, Vega 0.3 →', calculateDownsideRisk(volSpread2, 0.3));  // Expected: null (negative spread)
console.log('Vol Spread 10, Vega 0.25 →', calculateDownsideRisk(volSpread5, 0.25)); // Expected: 2.5

// Test Average Volatility Spreads (mock data)
console.log('\n=== AVERAGE VOLATILITY SPREADS TESTS ===');
const mockBonds = [
  { vega: 0.3, impliedVol: 35, volatility: 30 },
  { vega: 0.28, impliedVol: 38, volatility: 33 },
  { vega: 0.26, impliedVol: 32, volatility: 30 },
  { vega: 0.31, impliedVol: 40, volatility: 35 },
  { vega: 0.15, impliedVol: 25, volatility: 22 }, // This one should be excluded (vega < 0.25)
] as any;

const volStats = calculateAverageVolatilitySpreads(mockBonds);
console.log('Average Vol Spread:', volStats.averageVolSpread?.toFixed(2));
console.log('Standard Deviation:', volStats.standardDeviation?.toFixed(2));
console.log('Count (should be 4):', volStats.count);

// Test Spread to Average and Z-Score
console.log('\n=== SPREAD TO AVERAGE & Z-SCORE TESTS ===');
const spreadToAvg1 = calculateSpreadToAverage(5, volStats.averageVolSpread);
const spreadToAvg2 = calculateSpreadToAverage(-2, volStats.averageVolSpread);
console.log('Spread to Average (Vol Spread 5):', spreadToAvg1?.toFixed(2));
console.log('Spread to Average (Vol Spread -2):', spreadToAvg2?.toFixed(2));

const zScore1 = calculateZScore(spreadToAvg1, volStats.standardDeviation);
const zScore2 = calculateZScore(spreadToAvg2, volStats.standardDeviation);
console.log('Z-Score (Spread to Avg from Vol Spread 5):', zScore1?.toFixed(2));
console.log('Z-Score (Spread to Avg from Vol Spread -2):', zScore2?.toFixed(2));

// Test Observation/Recommendation
console.log('\n=== OBSERVATION/RECOMMENDATION TESTS ===');
console.log('Underpriced, Spread to Avg -3, Z-Score -1.5 →',
  determineObservation(-3, -1.5, 'underpriced'));  // Expected: 'High probability of a rebound'

console.log('Fair value, Spread to Avg -2.5, Z-Score -1.2 →',
  determineObservation(-2.5, -1.2, 'fair value'));  // Expected: 'High probability of a rebound'

console.log('Overpriced, Spread to Avg 3, Z-Score 1.8 →',
  determineObservation(3, 1.8, 'overpriced'));  // Expected: 'High probability of downside'

console.log('Expensive, Spread to Avg 4, Z-Score 2.1 →',
  determineObservation(4, 2.1, 'expensive'));  // Expected: 'High probability of downside'

console.log('Overpriced, Spread to Avg 1, Z-Score 0.5 →',
  determineObservation(1, 0.5, 'overpriced'));  // Expected: '' (no observation)

// Test Rebase to Base 100
console.log('\n=== REBASE TO BASE 100 TESTS ===');
const prices = [120, 125, 130, 128, 135];
const rebased = rebaseToBase100(prices, 0);
console.log('Original:', prices);
console.log('Rebased:', rebased.map(v => v.toFixed(2)));
// Expected: [100.00, 104.17, 108.33, 106.67, 112.50]

// Test Performance Calculations
console.log('\n=== PERFORMANCE CALCULATION TESTS ===');
console.log('YTD: 135 / 120 →', calculateYTDPerformance(135, 120).toFixed(2) + '%');
// Expected: 12.50%

console.log('MTD: 135 / 130 →', calculateMTDPerformance(135, 130).toFixed(2) + '%');
// Expected: 3.85%

console.log('3M: 135 / 125 →', calculate3MPerformance(135, 125).toFixed(2) + '%');
// Expected: 8.00%

console.log('\n=== ALL TESTS COMPLETED ===\n');

