export type UserMode = 'beginner' | 'advanced';
export type ViewMode = 'observatory' | 'cycle' | 'history' | 'explorer' | 'learn' | 'detective' | 'data';

export type DataState = 'LIVE' | 'HISTORICAL' | 'CACHED' | 'DEMO' | 'UNAVAILABLE';
export type GlobalDataMode = 'live' | 'historical' | 'demo' | 'mixed';
export type MetricTier = 'core' | 'advanced' | 'experimental' | 'historical';

export type MetricCategory = 
  | 'valuation'
  | 'holders'
  | 'profit_loss'
  | 'network'
  | 'money_flows';

export interface DataPoint {
  date: string;
  value: number;
  price?: number;
  annotation?: string;
}

export interface MetricDefinition {
  id: string;
  name: string;
  symbol: string;
  category: MetricCategory;
  tier: MetricTier;
  unit: string;
  currentValue: number;
  previousValue: number;
  change24h: number;
  change30d: number;
  historicalPercentile: number; // 0 - 100
  historicalRange: [number, number];
  status: 'healthy' | 'neutral' | 'elevated' | 'stress';
  
  // Data Provenance & Integrity
  dataState: DataState;
  source: string;
  updatedAt: string | null; // ISO string or null if unavailable
  isDerived?: boolean;
  sourceMetricIds?: string[];
  
  // Layer 1: Human Explanation
  simpleHeadline: string;
  simpleExplanation: string;
  whyCare: string;
  analogy: string;
  
  // Layer 2: Visual Concept
  visualConcept: string;
  regionId: 'price' | 'holders' | 'money' | 'network' | 'sentiment';
  
  // Layer 3: Technical
  technicalDefinition: string;
  formula: string;
  calculationMethod: string;
  historicalSignificance: string;
  
  // Chart and Related
  history: DataPoint[];
  normalZone: [number, number];
  elevatedZone: [number, number];
  extremeZone: [number, number];
  relatedMetricIds: string[];
  aliases?: string[];
}

export interface HealthComponent {
  id: string;
  label: string;
  weight: number;
  score: number;
  weightedScore: number;
  weightedContribution?: number;
  status: 'healthy' | 'neutral' | 'warning' | 'stress';
  explanation: string;
  metricId: string;
  sourceMetricName: string;
  metricValue: string;
}

export interface HealthScoreBreakdown {
  overall: number;
  statusLabel: string;
  summary: string;
  explanation?: string;
  components: HealthComponent[];
  calculationFormula: string;
  isCustomWeights?: boolean;
}

export interface WeatherCondition {
  icon: string;
  name: string;
  subtitle: string;
  description: string;
  condition?: string;
  temperatureScore?: number;
  overallState: 'expansion' | 'cooling' | 'stress' | 'volatility' | 'capitulation';
  factors: {
    category: string;
    status: 'green' | 'yellow' | 'red';
    label: string;
    observation: string;
    metricSymbol: string;
  }[];
}

export interface CycleStage {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  isCurrent?: boolean;
  priceBehavior: string;
  holderBehavior: string;
  networkBehavior: string;
  valuationBehavior: string;
  psychology: string;
  historicalDates: string[];
  keyMetrics: {
    metric: string;
    typicalRange: string;
    meaning: string;
  }[];
}

export interface CurrentConditionAssessment {
  currentStageId: string;
  stageName: string;
  confidence: string;
  confidenceDescription: string;
  confidenceAgreement?: number;
  confidenceLabel?: string;
  evidenceList: {
    metric: string;
    currentReading: string;
    agreement: 'Agrees' | 'Diverges' | 'Neutral';
    note: string;
  }[];
  macroDifferencesFromPriorCycles: string;
  summary?: string;
  methodologyNote?: string;
}

export interface InterpretationSummary {
  headline: string;
  whatIsHappening: string;
  whyDoesItMatter: string;
  supportingEvidence: {
    metricId: string;
    metricName: string;
    symbol: string;
    currentReading: string;
    changeText: string;
    isPositive: boolean;
    explanation: string;
  }[];
  basedOnMetricIds: string[];
  methodology: string;
}

export interface HistoricalEpoch {
  id: string;
  year: string;
  title: string;
  date: string;
  price: number;
  healthScore: number;
  phase: string;
  whatHappened: string;
  holderAction: string;
  networkState: string;
  valuationState: string;
  metrics: {
    mvrv: number;
    nupl: number;
    sopr: number;
    longTermHoldersPct: number;
    activeAddressesK: number;
    hashrateEh: number;
    realizedPriceUsd: number;
    realizedCapB: number;
  };
}

export interface DetectiveCase {
  id: string;
  title: string;
  difficulty: 'Novice' | 'Investigator' | 'Master Sleuth';
  mysteryPrompt: string;
  clues: {
    label: string;
    dataPoint: string;
    significance: string;
  }[];
  chartSnippet: { label: string; value: number }[];
  options: {
    id: string;
    stage: string;
    description: string;
  }[];
  correctOptionId: string;
  revealDate: string;
  revealPrice: string;
  explanation: string;
  lessonTaught: string;
  xpReward: number;
}

export interface EducationLesson {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  coreQuestion: string;
  simpleTakeaway: string;
  sections: {
    title: string;
    text: string;
    analogy?: string;
    callout?: string;
  }[];
  interactiveModel: 'mvrv' | 'realized_price' | 'hodl_waves' | 'nupl' | 'hashrate' | 'exchange_flow';
  historicalExample?: {
    epoch: string;
    outcome: string;
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}
