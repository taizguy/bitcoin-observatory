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
  ShieldCheck, 
  History, 
  Layers,
  Radio,
  ExternalLink
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
    <div className="space-y-12 pb-24 celestial-grid-pattern min-h-screen">
      
      {/* 1. POWERFUL FIRST SCREEN (Clean Typographic Hierarchy & 30-Second Clarity) */}
      <section className="relative pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Observatory Identity Header (Zero Pills, Clean Typographic Authority) */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400 mb-2 tracking-widest uppercase">
            <Radio className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            <span className="text-amber-400/90 font-semibold">BITCOIN OBSERVATORY</span>
            <span>·</span>
            <span>CELESTIAL LEDGER CARTOGRAPHY</span>
            <span>·</span>
            <span className="text-slate-500">EPOCH J2026.24</span>
          </div>

          <h1 className="font-celestial text-3xl sm:text-5xl font-bold tracking-wider text-white">
            CURRENT CONDITION:{' '}
            <span className="text-amber-400">
              HEALTHY EXPANSION
            </span>
          </h1>

          {/* Model Concordance Sub-kicker */}
          <div className="mt-2 text-xs font-mono text-slate-400 flex items-center justify-center gap-2">
            <span>Model Agreement: 80% (4 of 5 Agree)</span>
            <span>·</span>
            <span>Composite Score: {healthScore.overall}/100</span>
          </div>

          {/* One clear sentence describing what is happening */}
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-2xl mx-auto">
            {interpretation.headline}
          </p>

          {/* Primary Action (EXPLORE WHY) + Secondary Navigation */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleOpenMacroWhy}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-mono font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_-3px_rgba(245,158,11,0.35)] active:scale-98"
            >
              <Compass className="h-4 w-4" />
              <span>EXPLORE WHY</span>
            </button>

            <button
              onClick={() => onNavigate('history')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white font-mono text-xs sm:text-sm border border-white/10 transition-colors"
            >
              <History className="h-4 w-4 text-cyan-400" />
              <span>EXPLORE HISTORY</span>
            </button>

            <button
              onClick={() => onNavigate('data')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white font-mono text-xs sm:text-sm border border-white/10 transition-colors"
            >
              <Database className="h-4 w-4 text-purple-400" />
              <span>EXPLORE DATA</span>
            </button>
          </div>
        </div>

        {/* 2. LARGE 3D BITCOIN TELESCOPIC APERTURE (The Core Product) */}
        <div className="relative">
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

      </section>

      {/* 3. OBSERVATORY COMPOSITE & BITCOIN WEATHER (Synthesized Intuition) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Radial Orbital Astrolabe Composite */}
          <div className="lg:col-span-7">
            <ObservatoryRadialComposite
              scoreData={healthScore}
              onOpenMethodology={() => setShowHealthModal(true)}
              onSelectComponentMetric={(metricId) => {
                const m = getMetric(metricId);
                if (m) setSelectedMetricForDrawer(m);
              }}
            />
          </div>

          {/* Atmospheric Meteorology Station */}
          <div className="lg:col-span-5">
            <AtmosphericWeatherWidget
              weather={weather}
              mvrvValue={mvrvVal}
              lthSupplyValue={lthSupplyVal}
              hashrateValue={hashrateVal}
            />
          </div>

        </div>
      </section>

      {/* 4. COHESIVE THEMATIC EVIDENCE SECTIONS (Section 11: Grouped Evidence, Zero Clutter) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Layers className="h-4 w-4" />
              <span className="uppercase tracking-widest">COHESIVE ON-CHAIN EVIDENCE CLUSTERS</span>
            </div>
            <h2 className="font-celestial text-2xl font-bold text-white tracking-wide">
              The Three Structural Forces Beneath the Price
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Calibrated against BlockHorizon UTXO ledger
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Sector A: Valuation & Capital Flow */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#03060c] p-6 flex flex-col justify-between shadow-xl relative overflow-hidden observatory-panel-hover">
            <div className="reticle-corner-tl" />
            <div className="reticle-corner-tr" />

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                  I. CAPITAL INFLOWS & VALUATION
                </span>
                <span className="text-[11px] font-mono text-slate-500">SECTOR 01</span>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Market Multiple (MVRV)</span>
                  <span className="font-bold text-white text-sm">{mvrvVal.toFixed(2)}x</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Realized Cost Basis</span>
                  <span className="font-bold text-white">$41,780</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Paper Gains Ratio (NUPL)</span>
                  <span className="font-bold text-emerald-400">{nuplVal.toFixed(2)} (Belief)</span>
                </div>
              </div>

              <p className="mt-5 text-xs text-slate-300 font-sans leading-relaxed">
                Market capitalization sits 2.14x above the total dollar value spent acquiring circulating coins, demonstrating healthy profit without historical bubble euphoria (&gt;3.5).
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <button
                onClick={handleOpenMacroWhy}
                className="text-xs font-mono text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 focus:outline-none"
              >
                <span>SHOW ME WHY</span>
                <ArrowRight className="h-3 w-3" />
              </button>
              <button
                onClick={() => onSelectMetricDetail('mvrv')}
                className="text-slate-500 hover:text-white p-1"
                title="Inspect MVRV Chart"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Sector B: Holder Conviction & Retention */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#03060c] p-6 flex flex-col justify-between shadow-xl relative overflow-hidden observatory-panel-hover">
            <div className="reticle-corner-tl" />
            <div className="reticle-corner-tr" />

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  II. HOLDER DYNAMICS & CONVICTION
                </span>
                <span className="text-[11px] font-mono text-slate-500">SECTOR 02</span>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Long-Term Holder Supply</span>
                  <span className="font-bold text-white text-sm">{lthSupplyVal.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Spending Profit Multiple (SOPR)</span>
                  <span className="font-bold text-white">1.024</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Exchange Reserve Balance</span>
                  <span className="font-bold text-emerald-400">2.12M BTC (Multi-year low)</span>
                </div>
              </div>

              <p className="mt-5 text-xs text-slate-300 font-sans leading-relaxed">
                Over 69% of all mined bitcoin has not moved in at least 155 days. Sovereign holders are refusing to distribute into current price ranges, restricting sell-side liquidity.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <button
                onClick={handleOpenHoldersWhy}
                className="text-xs font-mono text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 focus:outline-none"
              >
                <span>SHOW ME WHY</span>
                <ArrowRight className="h-3 w-3" />
              </button>
              <button
                onClick={() => onSelectMetricDetail('lth_supply')}
                className="text-slate-500 hover:text-white p-1"
                title="Inspect LTH Supply Chart"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Sector C: Thermodynamic Computational Defense */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#03060c] p-6 flex flex-col justify-between shadow-xl relative overflow-hidden observatory-panel-hover">
            <div className="reticle-corner-tl" />
            <div className="reticle-corner-tr" />

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  III. THERMODYNAMIC SECURITY
                </span>
                <span className="text-[11px] font-mono text-slate-500">SECTOR 04</span>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Network Hashrate</span>
                  <span className="font-bold text-white text-sm">{hashrateValueDisplay(hashrateVal)}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Mining Difficulty</span>
                  <span className="font-bold text-white">105.8 T</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Miner Outflow Multiple</span>
                  <span className="font-bold text-emerald-400">0.82 (Low Pressure)</span>
                </div>
              </div>

              <p className="mt-5 text-xs text-slate-300 font-sans leading-relaxed">
                Miners are committing record energy capacity to secure consensus. Hardware efficiency post-halving has stabilized, eliminating structural miner capitulation risks.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <button
                onClick={() => {
                  setEvidenceFocusIn3D('network');
                  const hashrate = getMetric('hashrate');
                  if (hashrate) setSelectedMetricForDrawer(hashrate);
                }}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 focus:outline-none"
              >
                <span>SHOW ME WHY</span>
                <ArrowRight className="h-3 w-3" />
              </button>
              <button
                onClick={() => onSelectMetricDetail('hashrate')}
                className="text-slate-500 hover:text-white p-1"
                title="Inspect Hashrate Chart"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

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

// Helper for formatting hashrate
function hashrateValueDisplay(val: number): string {
  return `${val.toFixed(0)} EH/s`;
}
