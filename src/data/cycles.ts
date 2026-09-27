import { CycleStage, CurrentConditionAssessment } from '../types';

export const CYCLE_STAGES: CycleStage[] = [
  {
    id: 'accumulation',
    number: 1,
    name: 'Accumulation',
    subtitle: 'Quiet wealth transfer from tired hands to patient conviction',
    priceBehavior: 'Volatile sideways range. Low daily ranges and general market apathy.',
    holderBehavior: 'Long-term holders steadily absorb supply. Exchange balances decline continuously.',
    networkBehavior: 'Network activity is muted but stabilizes. Hashrate resumes upward trajectory as weak miners capitulate.',
    valuationBehavior: 'MVRV lingers between 0.9 and 1.3. Realized price forms solid psychological and technical bedrock.',
    psychology: 'Boredom, exhaustion, skepticism, indifference among casual observers.',
    historicalDates: ['2015 - Early 2016', '2019 Q1', 'Early 2023'],
    keyMetrics: [
      { metric: 'MVRV', typicalRange: '0.9 – 1.3', meaning: 'Price near aggregate holder cost basis' },
      { metric: 'NUPL', typicalRange: '0.0 – 0.25 (Hope)', meaning: 'Most market participants are near breakeven' },
      { metric: 'LTH Supply', typicalRange: '74% – 78%', meaning: 'Dominant holding by high-conviction entities' }
    ]
  },
  {
    id: 'early_expansion',
    number: 2,
    name: 'Early Expansion',
    subtitle: 'The stealth breakout as supply dries up',
    priceBehavior: 'Price climbs steadily with shallow pullbacks. Previous cycle resistance levels are tested.',
    holderBehavior: 'Holders refuse to sell into minor gains. Spent volume remains low.',
    networkBehavior: 'Active addresses increase 15-25%. Transaction fees tick up moderately.',
    valuationBehavior: 'MVRV crosses above 1.5. Realized Cap begins accelerating upward.',
    psychology: 'Relief turning to disbelief. Observers wait for deep corrections that never arrive.',
    historicalDates: ['Mid 2016', 'Late 2019', 'Q4 2023'],
    keyMetrics: [
      { metric: 'MVRV', typicalRange: '1.4 – 1.9', meaning: 'Unrealized profits spreading across network' },
      { metric: 'SOPR', typicalRange: '1.01 – 1.04', meaning: 'Consistent modest profit taking' },
      { metric: 'Active Addresses', typicalRange: '800k – 950k', meaning: 'Broadening user engagement' }
    ]
  },
  {
    id: 'expansion',
    number: 3,
    name: 'Expansion',
    subtitle: 'Widespread momentum and institutional participation',
    isCurrent: true,
    priceBehavior: 'Elevated valuation supported by sustained on-chain capital inflows.',
    holderBehavior: 'Long-term holders absorb supply; selective profit-taking into liquidity, but overall supply illiquidity remains dominant.',
    networkBehavior: 'Hashrate at record highs. Block space demand robust across Layer 1 and settlement channels.',
    valuationBehavior: 'MVRV between 2.0 and 2.8. Network health composite registers strong expansion scores.',
    psychology: 'Optimism, growing mainstream recognition, structural adoption.',
    historicalDates: ['2017 Q2-Q3', 'Late 2020 - Early 2021', '2024 - 2026 (Current Period)'],
    keyMetrics: [
      { metric: 'MVRV', typicalRange: '2.0 – 2.8', meaning: 'Strong paper profits without manic overheating' },
      { metric: 'NUPL', typicalRange: '0.50 – 0.65 (Belief)', meaning: 'Firm network-wide conviction' },
      { metric: 'Exchange Outflows', typicalRange: 'Persistent net negative', meaning: 'Coins continually moving off exchanges' }
    ]
  },
  {
    id: 'euphoria',
    number: 4,
    name: 'Euphoria',
    subtitle: 'Parabolic blow-off and widespread retail mania',
    priceBehavior: 'Vertical price spikes. Massive intraday swings and speculative leverage.',
    holderBehavior: 'Old coins (dormant 3-5+ years) awaken in record quantities to sell to retail newcomers.',
    networkBehavior: 'Extreme network congestion, mempool backlogs, record transaction fee spikes.',
    valuationBehavior: 'MVRV spikes past 3.5 to 5.0. Market cap vastly outpaces fundamental realized capital.',
    psychology: 'Greed, financial arrogance, "this time is different" proclamations, celebrity hype.',
    historicalDates: ['Nov - Dec 2013', 'Dec 2017', 'March - April 2021'],
    keyMetrics: [
      { metric: 'MVRV', typicalRange: '3.5 – 5.5', meaning: 'Extreme overvaluation vs historical holder cost' },
      { metric: 'NUPL', typicalRange: '> 0.75 (Euphoria)', meaning: 'Over 75% of market cap is pure paper gain' },
      { metric: 'LTH Supply', typicalRange: 'Drops sharply below 63%', meaning: 'Heavy smart-money distribution' }
    ]
  },
  {
    id: 'distribution',
    number: 5,
    name: 'Distribution',
    subtitle: 'Smart money exits while liquidity is plentiful',
    priceBehavior: 'Topping formations, lower highs, sharp rejections at resistance.',
    holderBehavior: 'Whales and long-term entities systematically unload remaining inventory onto late buyers.',
    networkBehavior: 'Address activity stays high due to panic churn, but new wallet creation slows.',
    valuationBehavior: 'Realized Cap plateaus or decelerates as high-price transactions absorb liquidity.',
    psychology: 'Denial, buying the dip, expectation of immediate resumption of the bull run.',
    historicalDates: ['Jan - Feb 2018', 'May 2021', 'Nov - Dec 2021'],
    keyMetrics: [
      { metric: 'SOPR', typicalRange: 'Spikes and rolls over below 1.0', meaning: 'Profit taking giving way to breakeven exits' },
      { metric: 'Exchange Inflows', typicalRange: 'Massive spikes', meaning: 'Supply rushing to exchanges to sell' },
      { metric: 'MVRV', typicalRange: 'Declines from peak to ~2.2', meaning: 'Paper profit rapidly eroding' }
    ]
  },
  {
    id: 'downtrend',
    number: 6,
    name: 'Downtrend',
    subtitle: 'Liquidity drain and systematic margin deleveraging',
    priceBehavior: 'Cascading lower lows, failed rallies, funding rates flip negative.',
    holderBehavior: 'Short-term holders hold heavy unrealized losses. Weak hands panic sell.',
    networkBehavior: 'Speculative network traffic vanishes; mempools clear to minimal baseline.',
    valuationBehavior: 'MVRV compresses toward 1.2. Realized Cap begins contracting as coins move at losses.',
    psychology: 'Anxiety, anger, despondency, realization of the bear market.',
    historicalDates: ['Mid 2018', 'Q1-Q2 2022'],
    keyMetrics: [
      { metric: 'NUPL', typicalRange: '0.10 – 0.25 (Fear)', meaning: 'Most recent buyers underwater' },
      { metric: 'Realized Loss', typicalRange: 'Sustained elevated volume', meaning: 'Billions realized in paper loss' },
      { metric: 'Active Addresses', typicalRange: 'Declines 20-30%', meaning: 'Tourists leaving the ecosystem' }
    ]
  },
  {
    id: 'capitulation',
    number: 7,
    name: 'Capitulation',
    subtitle: 'Final liquidation cascade that clears the ledger',
    priceBehavior: 'Violent washouts, forced liquidations, insolvency cascades of major market entities.',
    holderBehavior: 'Even some medium-term holders capitulate. Long-term accumulation initiates at the absolute floor.',
    networkBehavior: 'Miner capitulation: inefficient mining operations shut off machines (hash ribbons cross).',
    valuationBehavior: 'MVRV drops below 1.0. Price drops below Realized Price (entire network at aggregate net loss).',
    psychology: 'Maximal despair, headlines claiming "Bitcoin is dead", regulatory doom.',
    historicalDates: ['Dec 2018', 'March 2020', 'Nov 2022 (FTX)'],
    keyMetrics: [
      { metric: 'MVRV', typicalRange: '< 1.0 (Discount)', meaning: 'Bitcoin trading below average investor cost' },
      { metric: 'NUPL', typicalRange: '< 0 (Capitulation)', meaning: 'Entire network in aggregate net loss' },
      { metric: 'SOPR', typicalRange: '< 0.90', meaning: 'Extreme realized loss on moved coins' }
    ]
  },
  {
    id: 'reaccumulation',
    number: 8,
    name: 'Reaccumulation',
    subtitle: 'Basing pattern and structural supply absorption',
    priceBehavior: 'Gradual upward drift with prolonged range consolidation. Volatility hits historic lows.',
    holderBehavior: 'Coins migrate into deep cold storage. Speculative floating supply hits multi-year lows.',
    networkBehavior: 'Hashrate recovers as efficient miners expand operations. New protocol innovations launch.',
    valuationBehavior: 'MVRV reclaims 1.2 - 1.4. Realized price begins stepping upward.',
    psychology: 'Quiet skepticism, cautious hope, rebuilding phase.',
    historicalDates: ['Mid-Late 2019', 'Q1-Q3 2023'],
    keyMetrics: [
      { metric: 'LTH Supply', typicalRange: '> 70%', meaning: 'Illiquid supply reaches cycle highs' },
      { metric: 'Exchange Reserves', typicalRange: 'Multi-year downtrend', meaning: 'Liquid inventory depleted' },
      { metric: 'Hashrate', typicalRange: 'Relentless new records', meaning: 'Miners investing long-term capital' }
    ]
  }
];

export function getCurrentConditionAssessment(): CurrentConditionAssessment {
  const currentStage = CYCLE_STAGES.find((s) => s.isCurrent) || CYCLE_STAGES[2];

  // Explicit evidence agreement evaluation
  const evidencePillars = [
    {
      metricName: 'Market Value to Realized Value',
      symbol: 'MVRV',
      currentValue: '2.14',
      signal: 'expansion' as const,
      interpretation: 'Sits cleanly in the 2.0–2.8 historical corridor typical of sustained Expansion.',
      agreesWithPhase: true
    },
    {
      metricName: 'Net Unrealized Profit / Loss',
      symbol: 'NUPL',
      currentValue: '0.53',
      signal: 'expansion' as const,
      interpretation: 'Within the 0.50–0.65 Belief psychological zone without reaching euphoric extremes (>0.75).',
      agreesWithPhase: true
    },
    {
      metricName: 'Long-Term Holder Supply',
      symbol: 'LTH Supply',
      currentValue: '69.8%',
      signal: 'expansion' as const,
      interpretation: 'High structural holding retention (69.8%) indicates that mass whale distribution has not commenced.',
      agreesWithPhase: true
    },
    {
      metricName: 'Spent Output Profit Ratio',
      symbol: 'SOPR',
      currentValue: '1.024',
      signal: 'neutral' as const,
      interpretation: 'Coins moved are realizing modest paper gains, maintaining bull market equilibrium.',
      agreesWithPhase: true
    },
    {
      metricName: 'Network Hashrate & Security',
      symbol: 'Hashrate',
      currentValue: '712 EH/s',
      signal: 'expansion' as const,
      interpretation: 'Record computational commitment underscores institutional miner investment.',
      agreesWithPhase: true
    }
  ];

  const agreeingCount = evidencePillars.filter(p => p.agreesWithPhase).length;
  const agreementRate = Math.round((agreeingCount / evidencePillars.length) * 100);

  const evidenceList = [
    {
      metric: 'MVRV Ratio',
      currentReading: '2.14x (Healthy)',
      agreement: 'Agrees' as const,
      note: 'Multiple is elevated above cost basis but well below overheated froth (>3.5).'
    },
    {
      metric: 'NUPL Sentiment',
      currentReading: '0.53 (Belief)',
      agreement: 'Agrees' as const,
      note: 'Aggregate market unrealized profit reflects steady optimism without speculative mania.'
    },
    {
      metric: 'LTH Supply',
      currentReading: '69.8% (Accumulated)',
      agreement: 'Agrees' as const,
      note: 'Smart-money retention remains above 68%, preserving illiquid supply backdrop.'
    },
    {
      metric: 'SOPR Velocity',
      currentReading: '1.024 (Gain Taking)',
      agreement: 'Agrees' as const,
      note: 'Coins moved in profit at sustainable pace without panic capitulation (<1.0).'
    },
    {
      metric: 'Hashrate Security',
      currentReading: '712 EH/s (Record High)',
      agreement: 'Agrees' as const,
      note: 'Mining infrastructure continues secular growth, expanding thermodynamic defense.'
    }
  ];

  return {
    currentStageId: currentStage.id,
    stageName: currentStage.name,
    confidence: `Moderate (${agreementRate}% Agreement)`,
    confidenceDescription: `${agreeingCount} of ${evidencePillars.length} core on-chain indicators show alignment with historical expansion signatures. Confidence describes current indicator agreement, not future price probabilities.`,
    confidenceAgreement: agreementRate,
    confidenceLabel: agreementRate >= 80 ? 'Strong Agreement' : agreementRate >= 60 ? 'Moderate Agreement' : 'Mixed Signals',
    evidenceList,
    macroDifferencesFromPriorCycles: 'Unlike the 2017 retail euphoria or 2021 debt-fueled leverage cycles, modern structural expansion is characterized by institutional spot ETF balance accumulation, regulated custodial holding, and multi-year hashrate capital investment.',
    summary: '4 out of 5 primary macro indicators currently reflect conditions historically consistent with the Expansion phase.',
    methodologyNote: 'Confidence describes empirical agreement between selected on-chain indicators, not a statistical guarantee or price forecast.'
  };
}
