import { METRICS_DATA } from './metrics';
import { CYCLE_STAGES, getCurrentConditionAssessment } from './cycles';
import { HISTORICAL_EPOCHS } from './history';
import { calculateHealthScore, CURRENT_WEATHER, ScoreWeights, getSavedWeights, saveWeightsLocally, resetSavedWeights } from './healthScore';
import { DETECTIVE_CASES } from './detective';
import { LESSONS_DATA } from './lessons';
import { 
  MetricDefinition, 
  HealthScoreBreakdown, 
  WeatherCondition, 
  GlobalDataMode, 
  DataState, 
  InterpretationSummary,
  CurrentConditionAssessment,
  HistoricalEpoch
} from '../types';

export class DataAdapter {
  private static dataMode: GlobalDataMode = 'demo';
  private static lastUpdated: Date | null = new Date(Date.now() - 14 * 60 * 1000); // 14 mins ago

  public static getDataMode(): GlobalDataMode {
    return this.dataMode;
  }

  public static setDataMode(mode: GlobalDataMode): void {
    this.dataMode = mode;
  }

  public static getMetrics(): MetricDefinition[] {
    return METRICS_DATA;
  }

  public static getMetricById(id: string): MetricDefinition | undefined {
    return METRICS_DATA.find(m => m.id === id);
  }

  public static getCoreMetrics(): MetricDefinition[] {
    return METRICS_DATA.filter(m => m.tier === 'core');
  }

  public static getCycleStages() {
    return CYCLE_STAGES;
  }

  public static getCurrentCondition(): CurrentConditionAssessment {
    return getCurrentConditionAssessment();
  }

  public static getHistoricalEpochs(): HistoricalEpoch[] {
    return HISTORICAL_EPOCHS;
  }

  public static getHistoricalEpochById(id: string): HistoricalEpoch | undefined {
    return HISTORICAL_EPOCHS.find(e => e.id === id);
  }

  public static getHealthScore(customWeights?: ScoreWeights): HealthScoreBreakdown {
    return calculateHealthScore(customWeights);
  }

  public static saveHealthWeights(weights: ScoreWeights): void {
    saveWeightsLocally(weights);
  }

  public static resetHealthWeights(): ScoreWeights {
    return resetSavedWeights();
  }

  public static getSavedHealthWeights(): ScoreWeights {
    return getSavedWeights();
  }

  public static getWeather(): WeatherCondition {
    return CURRENT_WEATHER;
  }

  public static getDetectiveCases() {
    return DETECTIVE_CASES;
  }

  public static getLessons() {
    return LESSONS_DATA;
  }

  public static getLastUpdatedTime(): string {
    if (!this.lastUpdated) return 'Update time unavailable';
    const diffMs = Date.now() - this.lastUpdated.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    if (diffMins <= 1) return 'Updated just now';
    return `Updated ${diffMins} min ago`;
  }

  public static refreshData(): void {
    this.lastUpdated = new Date();
  }

  // ==========================================
  // STRUCTURED INTERPRETATION ENGINE
  // metric observations -> normalized values -> condition classification -> evidence selection -> plain language
  // ==========================================
  public static getStructuredInterpretation(): InterpretationSummary {
    const mvrv = this.getMetricById('mvrv');
    const lth = this.getMetricById('lth_supply');
    const sopr = this.getMetricById('sopr');
    const hashrate = this.getMetricById('hashrate');
    const flows = this.getMetricById('exchange_net_flows');
    const nupl = this.getMetricById('nupl');

    const mvrvVal = mvrv?.currentValue ?? 2.14;
    const lthVal = lth?.currentValue ?? 69.8;
    const soprVal = sopr?.currentValue ?? 1.024;
    const hashrateVal = hashrate?.currentValue ?? 712;

    const isValuationElevated = mvrvVal > 2.0;
    const isHolderRetentionHigh = lthVal > 68.0;
    const isSoprProfitable = soprVal > 1.0;
    const isSecurityPeak = hashrateVal > 650;

    let whatIsHappening = '';
    let whyDoesItMatter = '';
    let headline = '';

    if (isValuationElevated && isHolderRetentionHigh && isSoprProfitable) {
      headline = 'Elevated Valuation Supported by Resilient Holder Retention';
      whatIsHappening = `Bitcoin is trading above the historical acquisition price of existing holders (MVRV: ${mvrvVal}), while long-term conviction supply remains firm at ${lthVal}%. Moved coins are realizing moderate profits without speculative panic dumping (SOPR: ${soprVal}).`;
      whyDoesItMatter = 'When market valuation expands while long-term holders refuse to distribute aggressively into liquidity, floating liquid supply remains constrained. This structure historically favors steady macro consolidation or continued expansion rather than severe structural breakdown.';
    } else if (!isValuationElevated && isHolderRetentionHigh) {
      headline = 'Deep Value Accumulation with High Conviction Retention';
      whatIsHappening = `Market price is compressed near or below average investor cost basis, while patient long-term holders continue locking coins away.`;
      whyDoesItMatter = 'Historically, valuation compressions combined with high long-term retention have characterized late-stage accumulation floors.';
    } else {
      headline = 'Balanced Structural Fundamentals with Active Settlement';
      whatIsHappening = `Network metrics reflect steady user participation, healthy security parameters, and moderate profit realization across on-chain participants.`;
      whyDoesItMatter = 'Signals across holders and network infrastructure remain aligned within multi-cycle median boundaries.';
    }

    const supportingEvidence = [
      {
        metricId: 'lth_supply',
        metricName: 'Long-Term Holder Supply',
        symbol: 'LTH Supply',
        currentReading: `${lthVal}% of Supply`,
        changeText: '+0.8% (30d)',
        isPositive: true,
        explanation: 'Over 69% of coins have not moved in >155 days, confirming strong structural retention.'
      },
      {
        metricId: 'mvrv',
        metricName: 'Market Value to Realized Value',
        symbol: 'MVRV',
        currentReading: `${mvrvVal}x Cost Basis`,
        changeText: '+8.2% (30d)',
        isPositive: true,
        explanation: 'Current price is double the network acquisition cost, reflecting healthy momentum without euphoria (>3.5).'
      },
      {
        metricId: 'hashrate',
        metricName: 'Network Security',
        symbol: 'Hashrate',
        currentReading: `${hashrateVal} EH/s`,
        changeText: '+4.2% (30d)',
        isPositive: true,
        explanation: 'Global miners are committing record computing power to defend ledger immutability.'
      },
      {
        metricId: 'exchange_net_flows',
        metricName: 'Exchange Net Position',
        symbol: 'Exchange Flow',
        currentReading: `-2,410 BTC / day`,
        changeText: '-42% (30d)',
        isPositive: true,
        explanation: 'Persistent net withdrawals continue to remove available sell-side coins from exchange orderbooks.'
      }
    ];

    return {
      headline,
      whatIsHappening,
      whyDoesItMatter,
      supportingEvidence,
      basedOnMetricIds: ['lth_supply', 'mvrv', 'hashrate', 'exchange_net_flows', 'sopr', 'nupl'],
      methodology: 'Derived from multi-indicator rule matrix evaluating MVRV cost-basis multiple, LTH lifespan threshold, SOPR realization, and exchange reserve delta.'
    };
  }

  // ==========================================
  // SEMANTIC CONCEPT & ALIAS SEARCH ENGINE
  // ==========================================
  public static search(query: string): {
    metrics: MetricDefinition[];
    concepts: { 
      title: string; 
      explanation: string; 
      targetMetricId: string;
      matchedAlias: string;
      category: string;
      currentCondition: string;
    }[];
  } {
    const q = query.toLowerCase().trim();
    if (!q) return { metrics: [], concepts: [] };

    // Direct and fuzzy metric matches
    const metrics = METRICS_DATA.filter(m => 
      m.name.toLowerCase().includes(q) ||
      m.symbol.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.simpleHeadline.toLowerCase().includes(q) ||
      m.simpleExplanation.toLowerCase().includes(q)
    );

    // Semantic alias dictionary
    const semanticDictionary = [
      {
        aliases: ['selling', 'holders selling', 'distribution', 'dumping', 'taking profit', 'realizing profit', 'cashing out'],
        title: 'Holder Selling & Distribution',
        explanation: 'When seasoned holders sell, it manifests as declining LTH supply, rising SOPR (>1.0), and surging exchange inflows.',
        targetMetricId: 'lth_supply',
        category: 'Holders',
        currentCondition: 'Minimal Distribution (LTH holding firm at 69.8%)'
      },
      {
        aliases: ['dormant coins', 'old coins moving', 'lost coins', 'hodl', 'cold storage', 'holding', 'inactive supply', 'coins held for 5 years', '1 year'],
        title: 'Coin Inactivity & Dormant Supply',
        explanation: 'Tracks coins untouched for extended periods. High dormant supply indicates deep structural illiquidity.',
        targetMetricId: 'supply_last_active_1y',
        category: 'Holders',
        currentCondition: '64.2% Dormant (>1 Year Inactive)'
      },
      {
        aliases: ['valuation', 'overpriced', 'cheap', 'bubble', 'fair value', 'cost basis', 'bitcoin valuation', 'expensive', 'undervalued'],
        title: 'Bitcoin Aggregate Valuation Multiples',
        explanation: 'Compares the market cap against the aggregate acquisition cost of all active coins via the MVRV ratio.',
        targetMetricId: 'mvrv',
        category: 'Valuation',
        currentCondition: 'Elevated (MVRV: 2.14, 64th Percentile)'
      },
      {
        aliases: ['network activity', 'transactions', 'users', 'active wallets', 'traffic', 'adoption'],
        title: 'Network Activity & Address Velocity',
        explanation: 'Measures unique daily transacting wallets to gauge organic user adoption and network throughput.',
        targetMetricId: 'active_addresses',
        category: 'Network',
        currentCondition: 'Healthy (~982k Daily Active Addresses)'
      },
      {
        aliases: ['miners', 'mining', 'hashrate', 'difficulty', 'security', 'attacks', 'energy', 'thermodynamic'],
        title: 'Mining Power & Network Security',
        explanation: 'Total cryptographic guessing power defending the blockchain against reorganization or history rewrite.',
        targetMetricId: 'hashrate',
        category: 'Network',
        currentCondition: 'Record Peak (712 EH/s)'
      },
      {
        aliases: ['sentiment', 'greed', 'fear', 'profit', 'loss', 'psychology', 'optimism', 'euphoria', 'capitulation'],
        title: 'Market Psychology & Unrealized Profit',
        explanation: 'Maps collective paper profits and losses to detect emotional transitions from despair to euphoria.',
        targetMetricId: 'nupl',
        category: 'Profit / Loss',
        currentCondition: 'Belief Stage (NUPL: 0.53)'
      },
      {
        aliases: ['exchange flows', 'exchange inflows', 'outflows', 'liquidity drain', 'reserves', 'exchanges'],
        title: 'Centralized Exchange Reserves & Flow Deltas',
        explanation: 'Net balance of Bitcoin moving between exchange hot wallets and private cold storage custody.',
        targetMetricId: 'exchange_net_flows',
        category: 'Capital Flows',
        currentCondition: 'Net Outflows (-2,410 BTC/day)'
      },
      {
        aliases: ['realized losses', 'capitulation selling', 'selling at loss', 'underwater', 'loss'],
        title: 'Realized Losses & Forced Selling',
        explanation: 'Analyzes coins moved on-chain at prices lower than their acquisition price via the SOPR index.',
        targetMetricId: 'sopr',
        category: 'Profit / Loss',
        currentCondition: 'Equilibrium (SOPR: 1.024, Slight Profit)'
      }
    ];

    const concepts = semanticDictionary
      .filter(item => item.aliases.some(alias => alias.includes(q) || q.includes(alias)))
      .map(item => ({
        title: item.title,
        explanation: item.explanation,
        targetMetricId: item.targetMetricId,
        matchedAlias: item.aliases.find(a => a.includes(q) || q.includes(a)) || item.title,
        category: item.category,
        currentCondition: item.currentCondition
      }));

    return { metrics, concepts };
  }

  // ==========================================
  // DATA EXPORT WITH PROVENANCE
  // ==========================================
  public static exportToCSV(metrics: MetricDefinition[]): string {
    const headers = [
      'ID', 
      'Name', 
      'Symbol', 
      'Category', 
      'Tier', 
      'Current Value', 
      'Previous Value',
      'Unit', 
      '24h Change (%)', 
      '30d Change (%)', 
      'Historical Percentile', 
      'Historical Min',
      'Historical Max',
      'Data State', 
      'Data Source', 
      'Last Updated', 
      'Interpretation'
    ];

    const rows = metrics.map(m => [
      m.id,
      `"${m.name}"`,
      m.symbol,
      m.category,
      m.tier,
      m.currentValue,
      m.previousValue,
      m.unit,
      m.change24h,
      m.change30d,
      m.historicalPercentile,
      m.historicalRange[0],
      m.historicalRange[1],
      m.dataState,
      `"${m.source}"`,
      m.updatedAt || 'Unavailable',
      `"${m.simpleHeadline.replace(/"/g, '""')}"`
    ]);

    const disclaimer = '# Bitcoin Observatory Data Export - For Research & Educational Analysis Only';
    return [disclaimer, headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  public static exportToJSON(metrics: MetricDefinition[]): string {
    return JSON.stringify({
      provenance: {
        platform: 'Bitcoin Observatory',
        exportedAt: new Date().toISOString(),
        dataMode: this.dataMode,
        legalDisclaimer: 'Non-commercial educational export. Aggregated on-chain telemetry.'
      },
      metricsCount: metrics.length,
      metrics
    }, null, 2);
  }
}
