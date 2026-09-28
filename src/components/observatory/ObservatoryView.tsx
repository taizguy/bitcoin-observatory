import React, { useState } from 'react';
import { BitcoinObservatoryScene } from '../3d/BitcoinObservatoryScene';
import { ObservatoryRadialComposite } from './ObservatoryRadialComposite';
import { AtmosphericWeatherWidget } from './AtmosphericWeatherWidget';
import { HealthScoreModal } from './HealthScoreModal';
import { ExplainDrawer, EvidenceInvestigation } from './ExplainDrawer';
import { MetricDefinition, HealthScoreBreakdown, WeatherCondition, ViewMode, UserMode } from '../../types';
import { DataAdapter } from '../../data/adapter';
import { 
  Compass, 
  Database, 
  ArrowRight, 
  History, 
  Layers,
  Radio,
  ExternalLink,
  Activity,
  Search
} from 'lucide-react';

interface ObservatoryViewProps {
  metrics: MetricDefinition[];
  healthScore: HealthScoreBreakdown;
  weather: WeatherCondition;
  userMode: UserMode;
  onNavigate: (view: ViewMode) => void;
  onSelectMetricDetail: (metricId: string) => void;
}

export const ObservatoryView: React.FC<ObservatoryViewProps> = ({
  metrics,
  healthScore,
  weather,
  userMode,
  onNavigate,
  onSelectMetricDetail,
}) => {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<string>('Cycle');
  const [showHealthModal, setShowHealthModal] = useState<boolean>(false);
  const [selectedMetricForDrawer, setSelectedMetricForDrawer] = useState<MetricDefinition | null>(null);
  const [activeInvestigation, setActiveInvestigation] = useState<EvidenceInvestigation | null>(null);
  const [evidenceFocusIn3D, setEvidenceFocusIn3D] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Quick lookup helper for metrics
  const getMetric = (id: string) => metrics.find((m) => m.id === id);

  // Retrieve structured interpretation from deterministic engine
  const interpretation = DataAdapter.getStructuredInterpretation();

  // Primary live metrics for binding to 3D scene & displays
  const btcPrice = getMetric('price')?.currentValue ?? 89420;
  const mvrvVal = getMetric('mvrv')?.currentValue ?? 2.14;
  const lthSupplyVal = getMetric('lth_supply')?.currentValue ?? 69.8;
  const hashrateVal = getMetric('hashrate')?.currentValue ?? 712;
  const realizedCapVal = getMetric('realized_cap')?.currentValue ?? 825;
  const nuplVal = getMetric('nupl')?.currentValue ?? 0.53;

  // Search input handler
  const handleSearchSubmit = () => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      handleOpenMacroWhy();
      return;
    }
    const matched = metrics.find(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.symbol.toLowerCase().includes(q)
    );
    if (matched) {
      onSelectMetricDetail(matched.id);
    } else {
      handleOpenMacroWhy();
    }
  };

  // Signature SHOW ME WHY handler for macro valuation
  const handleOpenMacroWhy = () => {
    setEvidenceFocusIn3D('price');
    const mvrvMetric = getMetric('mvrv');
    const nuplMetric = getMetric('nupl');
    const realPriceMetric = getMetric('realized_price');

    if (mvrvMetric && nuplMetric && realPriceMetric) {
      setActiveInvestigation({
        title: 'Why Valuation is Classified as Healthy Expansion',
        theme: 'Sector I · Valuation & Realized Capital',
        what: 'Bitcoin is trading at 2.14 times the aggregate acquisition cost of circulating supply ($89,400 market vs $41,780 realized price).',
        why: 'Market price remains well above the baseline network cost floor, confirming structural profitability without entering the historical cycle-top froth zone (>3.5 MVRV).',
        evidenceItems: [
          {
            metric: mvrvMetric,
            highlightRole: 'Macro Valuation Multiple',
            historicalPercentile: mvrvMetric.historicalPercentile,
            change30d: mvrvMetric.change30d,
            statusNote: 'Multiple of 2.14 sits inside the historical healthy expansion corridor (1.0 to 2.4).',
          },
          {
            metric: nuplMetric,
            highlightRole: 'Unrealized Profit Ratio',
            historicalPercentile: nuplMetric.historicalPercentile,
            change30d: nuplMetric.change30d,
            statusNote: 'NUPL of 0.53 indicates 53% paper gains across the network (Belief Phase).',
          },
          {
            metric: realPriceMetric,
            highlightRole: 'Cost Basis Floor',
            historicalPercentile: realPriceMetric.historicalPercentile,
            change30d: realPriceMetric.change30d,
            statusNote: 'Network cost basis is $41,780, rising steadily as coins transact at higher levels.',
          },
        ],
        technicalDetail: {
          formula: 'MVRV = Market Cap / Realized Cap\nRealized Cap = Σ (UTXO_value × price_last_moved)',
          methodology: 'Every unspent transaction output is evaluated at its last recorded on-chain transfer price, establishing the aggregate dollar investment of participants.',
          dataSource: 'BlockHorizon Aggregated UTXO Telemetry',
          decisionRule: 'IF MVRV > 1.0 AND MVRV < 3.0 AND NUPL > 0.4 THEN "Healthy Expansion"',
        },
      });
    }
  };

  // Signature SHOW ME WHY for Holders
  const handleOpenHoldersWhy = () => {
    setEvidenceFocusIn3D('holders');
    const lth = getMetric('lth_supply');
    const sopr = getMetric('sopr');

    if (lth && sopr) {
      setActiveInvestigation({
        title: 'Why Holders are Classified in Accumulation & Retention',
        theme: 'Sector II · Holder Dynamics & Conviction',
        what: 'Nearly 70% of total circulating supply is held in wallets with no spending activity for at least 155 days.',
        why: 'Long-term holders absorb sell pressure during volatility. When liquid supply on exchanges dries up, demand shocks have disproportionate upward price impact.',
        evidenceItems: [
          {
            metric: lth,
            highlightRole: 'Supply Illiquidity',
            historicalPercentile: lth.historicalPercentile,
            change30d: lth.change30d,
            statusNote: '69.8% retention indicates smart money is not distributing into current price strength.',
          },
          {
            metric: sopr,
            highlightRole: 'Spending Behavior',
            historicalPercentile: sopr.historicalPercentile,
            change30d: sopr.change30d,
            statusNote: 'SOPR of 1.024 reflects modest profit taking without panic liquidation.',
          },
        ],
        technicalDetail: {
          formula: 'LTH Supply = Coins unmoved for ≥ 155 days / Circulating Supply',
          methodology: 'Statistical coin age clustering proves that after 155 days, the probability of a coin being spent drops exponentially below 1%.',
          dataSource: 'BlockHorizon UTXO Age Distribution Engine',
          decisionRule: 'IF LTH_Supply > 68% THEN "Conviction Retention High"',
        },
      });
    }
  };

  return (
    <div className="space-y-12 pb-24 min-h-screen w-full relative z-10">
      
      {/* 1. OBSERVE HERO SECTION (Exact Observe specification) */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 pt-10 pb-6 text-center max-w-5xl mx-auto">
        
        {/* Headline: Instrument Serif with multi-layered dark aura text-shadow */}
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif-instrument tracking-tight text-white mb-4 whitespace-normal md:whitespace-nowrap"
          style={{ textShadow: '0 0 72px rgba(0, 0, 0, 0.7), 0 4px 28px rgba(0, 0, 0, 0.45)' }}
        >
          See the shape of the <em className="italic font-serif-instrument">noise</em>
        </h1>

        {/* Subline: Single line on desktop with weaker aura and real em-dash */}
        <p 
          className="text-white/80 text-sm sm:text-base leading-relaxed max-w-3xl md:whitespace-nowrap mb-8"
          style={{ textShadow: '0 0 30px rgba(0, 0, 0, 0.5), 0 1px 10px rgba(0, 0, 0, 0.35)' }}
        >
          Every event from the Bitcoin network — rendered as one picture you can actually read.
        </p>

        {/* Email / Telemetry Capture Glass Pill */}
        <div className="max-w-xl w-full">
          <div className="liquid-glass rounded-full pl-6 pr-1.5 py-1.5 flex items-center gap-3 border border-white/15 shadow-2xl backdrop-blur-2xl">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchSubmit();
              }}
              placeholder="Enter metric (MVRV, NUPL, Hashrate) or query cycle..."
              className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-white/80 text-sm font-sans"
            />
            <button 
              onClick={handleSearchSubmit}
              className="bg-white rounded-full px-6 py-2.5 text-black text-sm font-medium whitespace-nowrap hover:scale-105 active:scale-95 transition-transform duration-300 cursor-pointer shadow-lg"
            >
              Observe
            </button>
          </div>
        </div>

      </div>

      {/* 2. WIDESCREEN COMMAND CENTER (Liquid Glass Frame) */}
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 space-y-8">
        
        {/* Executive Condition Bar (Liquid Glass Pill Card) */}
        <div className="liquid-glass rounded-3xl p-6 xl:p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6 border border-white/10 shadow-2xl backdrop-blur-2xl">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-white/90 uppercase tracking-wider">
              <Radio className="h-3.5 w-3.5 animate-pulse text-white" />
              <span>CONSENSUS TELEMETRY</span>
              <span className="text-white/30">·</span>
              <span className="text-white/70">EPOCH J2026.24</span>
              <span className="text-white/30">·</span>
              <span className="text-white font-semibold">4 OF 5 INDICATORS CONCORDANT</span>
            </div>

            <h2 className="font-serif-instrument text-3xl sm:text-4xl xl:text-5xl tracking-tight text-white">
              Current Condition:{' '}
              <em className="italic font-serif-instrument text-white underline decoration-white/30 underline-offset-4">
                Healthy Expansion
              </em>
            </h2>

            <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed">
              {interpretation.headline}
            </p>
          </div>

          {/* Action Cluster (Monochrome rounded pills) */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleOpenMacroWhy}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-white/90 text-black font-medium text-xs sm:text-sm font-sans transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Compass className="h-4 w-4" />
              <span>Explore Why</span>
            </button>

            <button
              onClick={() => onNavigate('history')}
              className="flex items-center gap-2 px-5 py-3 rounded-full liquid-glass hover:bg-white/10 text-white font-sans text-xs sm:text-sm border border-white/15 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <History className="h-4 w-4 text-white/80" />
              <span>Time Machine</span>
            </button>

            <button
              onClick={() => onNavigate('data')}
              className="flex items-center gap-2 px-5 py-3 rounded-full liquid-glass hover:bg-white/10 text-white/80 hover:text-white font-sans text-xs sm:text-sm border border-white/15 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Database className="h-4 w-4 text-white/80" />
              <span>Raw Data</span>
            </button>
          </div>
        </div>

        {/* 3. DUAL-STAGE DESKTOP COCKPIT (3D Viewport on Left + Instrument Decks on Right) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Stage: 3D Observatory Canvas (Takes 8 of 12 columns on desktop) */}
          <div className="xl:col-span-8 flex flex-col liquid-glass rounded-3xl p-2 sm:p-4 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
            <BitcoinObservatoryScene
              activeRegion={activeRegion}
              onSelectRegion={(regId) => {
                setActiveRegion(regId);
                if (regId === 'price') handleOpenMacroWhy();
                else if (regId === 'holders') handleOpenHoldersWhy();
                else if (regId) {
                  const targetMetric = metrics.find((m) => m.regionId === regId);
                  if (targetMetric) setSelectedMetricForDrawer(targetMetric);
                }
              }}
              timeframe={timeframe}
              onChangeTimeframe={setTimeframe}
              btcPrice={btcPrice}
              mvrvValue={mvrvVal}
              lthSupplyValue={lthSupplyVal}
              hashrateValue={hashrateVal}
              realizedCapValue={realizedCapVal}
              nuplValue={nuplVal}
              evidenceFocus={evidenceFocusIn3D}
            />
          </div>

          {/* Right Deck: Radial Composite + Weather Widget (Takes 4 of 12 columns on desktop) */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            
            {/* Top Deck: Observatory Composite Planetarium */}
            <div className="flex-1">
              <ObservatoryRadialComposite
                scoreData={healthScore}
                onOpenMethodology={() => setShowHealthModal(true)}
                onSelectComponentMetric={(metricId) => {
                  const m = getMetric(metricId);
                  if (m) setSelectedMetricForDrawer(m);
                }}
              />
            </div>

            {/* Bottom Deck: Meteorology Station */}
            <div className="flex-1">
              <AtmosphericWeatherWidget
                weather={weather}
                mvrvValue={mvrvVal}
                lthSupplyValue={lthSupplyVal}
                hashrateValue={hashrateVal}
              />
            </div>

          </div>

        </div>

        {/* 4. OBSERVE EVIDENCE DECK (3 Cohesive Thematic Force Pillars) */}
        <div className="space-y-6 pt-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-white/70 mb-1">
                <Layers className="h-4 w-4 text-white" />
                <span className="uppercase tracking-wider">PRIMARY ON-CHAIN EVIDENCE CLUSTERS</span>
              </div>
              <h2 className="font-serif-instrument text-3xl sm:text-4xl text-white tracking-tight">
                The Three Structural Forces Beneath the <em className="italic font-serif-instrument">Price</em>
              </h2>
            </div>
            <span className="text-xs font-mono text-white/50">
              Calibrated against BlockHorizon UTXO ledger
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar A: Capital Inflows & Valuation */}
            <div className="liquid-glass-panel rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-white/25">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-mono text-white font-bold uppercase tracking-wider">
                    I. CAPITAL INFLOWS & VALUATION
                  </span>
                  <span className="text-[11px] font-mono text-white/40">SECTOR 01</span>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white/60">Market Multiple (MVRV)</span>
                    <span className="font-bold text-white text-sm">{mvrvVal.toFixed(2)}x</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white/60">Realized Cost Basis</span>
                    <span className="font-bold text-white">$41,780</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white/60">Paper Gains Ratio (NUPL)</span>
                    <span className="font-bold text-white">{nuplVal.toFixed(2)} (Belief)</span>
                  </div>
                </div>

                <p className="mt-5 text-xs text-white/70 font-sans leading-relaxed">
                  Market capitalization sits 2.14x above the total dollar value spent acquiring circulating coins, demonstrating healthy profit expansion without historical bubble euphoria (&gt;3.5).
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={handleOpenMacroWhy}
                  className="text-xs font-mono text-white hover:text-white/80 font-medium flex items-center gap-1.5 focus:outline-none cursor-pointer"
                >
                  <span>Show me why</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
                <button
                  onClick={() => onSelectMetricDetail('mvrv')}
                  className="text-white/50 hover:text-white p-1"
                  title="Inspect MVRV Chart"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Pillar B: Holder Dynamics & Conviction */}
            <div className="liquid-glass-panel rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-white/25">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-mono text-white font-bold uppercase tracking-wider">
                    II. HOLDER DYNAMICS & CONVICTION
                  </span>
                  <span className="text-[11px] font-mono text-white/40">SECTOR 02</span>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white/60">Long-Term Holder Supply</span>
                    <span className="font-bold text-white text-sm">{lthSupplyVal.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white/60">Spending Multiple (SOPR)</span>
                    <span className="font-bold text-white">1.024</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white/60">Exchange Reserve Balance</span>
                    <span className="font-bold text-white">2.12M BTC (Low)</span>
                  </div>
                </div>

                <p className="mt-5 text-xs text-white/70 font-sans leading-relaxed">
                  Over 69% of all mined bitcoin has not moved in at least 155 days. Sovereign holders are refusing to distribute into current price ranges, restricting sell-side liquidity.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={handleOpenHoldersWhy}
                  className="text-xs font-mono text-white hover:text-white/80 font-medium flex items-center gap-1.5 focus:outline-none cursor-pointer"
                >
                  <span>Show me why</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
                <button
                  onClick={() => onSelectMetricDetail('lth_supply')}
                  className="text-white/50 hover:text-white p-1"
                  title="Inspect LTH Supply Chart"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Pillar C: Thermodynamic Computational Defense */}
            <div className="liquid-glass-panel rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-white/25">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-mono text-white font-bold uppercase tracking-wider">
                    III. THERMODYNAMIC SECURITY
                  </span>
                  <span className="text-[11px] font-mono text-white/40">SECTOR 04</span>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white/60">Network Hashrate</span>
                    <span className="font-bold text-white text-sm">{hashrateVal.toFixed(0)} EH/s</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white/60">Mining Difficulty</span>
                    <span className="font-bold text-white">105.8 T</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white/60">Miner Outflow Multiple</span>
                    <span className="font-bold text-white">0.82 (Low Pressure)</span>
                  </div>
                </div>

                <p className="mt-5 text-xs text-white/70 font-sans leading-relaxed">
                  Miners are committing record energy capacity to secure consensus. Hardware efficiency post-halving has stabilized, eliminating structural miner capitulation risks.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => {
                    setEvidenceFocusIn3D('network');
                    const hashrate = getMetric('hashrate');
                    if (hashrate) setSelectedMetricForDrawer(hashrate);
                  }}
                  className="text-xs font-mono text-white hover:text-white/80 font-medium flex items-center gap-1.5 focus:outline-none cursor-pointer"
                >
                  <span>Show me why</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
                <button
                  onClick={() => onSelectMetricDetail('hashrate')}
                  className="text-white/50 hover:text-white p-1"
                  title="Inspect Hashrate Chart"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Signature Evidence Drawer Modal */}
      <ExplainDrawer
        metric={selectedMetricForDrawer}
        investigation={activeInvestigation}
        onClose={() => {
          setSelectedMetricForDrawer(null);
          setActiveInvestigation(null);
          setEvidenceFocusIn3D(null);
        }}
        onOpenMetricDetail={onSelectMetricDetail}
        userMode={userMode}
      />

      {/* Health Score Calculation Modal */}
      {showHealthModal && (
        <HealthScoreModal
          scoreData={healthScore}
          onClose={() => setShowHealthModal(false)}
          onSelectMetric={onSelectMetricDetail}
        />
      )}

    </div>
  );
};
