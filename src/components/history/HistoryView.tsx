import React, { useState } from 'react';
import { BitcoinObservatoryScene } from '../3d/BitcoinObservatoryScene';
import { HISTORICAL_EPOCHS } from '../../data/history';
import { HistoricalEpoch } from '../../types';
import { 
  History, 
  Calendar, 
  TrendingUp, 
  Users, 
  Cpu, 
  Coins, 
  Radio, 
  ArrowRight, 
  Eye, 
  Layers, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface HistoryViewProps {
  onSelectMetricDetail: (metricId: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelectMetricDetail }) => {
  const [selectedEpochIndex, setSelectedEpochIndex] = useState<number>(0);
  const [activeRegionIn3D, setActiveRegionIn3D] = useState<string | null>(null);

  const epoch: HistoricalEpoch = HISTORICAL_EPOCHS[selectedEpochIndex];

  const handleSelectEpoch = (idx: number) => {
    setSelectedEpochIndex(idx);
  };

  return (
    <div className="w-full max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-8 min-h-screen">
      
      {/* 1. Header (Expansive Desktop Header) */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2 max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-mono text-white/70 uppercase tracking-wider">
            <History className="h-3.5 w-3.5 text-white" />
            <span>CHRONOMETRIC ARCHIVES</span>
            <span className="text-white/30">·</span>
            <span className="text-white/60">HISTORICAL ON-CHAIN MACRO ATLAS</span>
            <span className="text-white/30">·</span>
            <span className="text-white/80">{HISTORICAL_EPOCHS.length} BENCHMARK CYCLES</span>
          </div>

          <h1 
            className="font-serif-instrument text-4xl sm:text-5xl xl:text-6xl tracking-tight text-white"
            style={{ textShadow: '0 0 72px rgba(0, 0, 0, 0.7), 0 4px 28px rgba(0, 0, 0, 0.45)' }}
          >
            Historical Atlas & <em className="italic font-serif-instrument">Autopsies</em>
          </h1>

          <p 
            className="text-sm sm:text-base text-white/70 font-sans leading-relaxed"
            style={{ textShadow: '0 0 30px rgba(0, 0, 0, 0.5), 0 1px 10px rgba(0, 0, 0, 0.35)' }}
          >
            Reconstruct how previous market peaks, generational capitulation bottoms, and halving milestones appeared from on-chain physics. Travel through 15 years of ledger consensus data.
          </p>
        </div>

        {/* Selected Epoch Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="liquid-glass rounded-2xl p-4 text-xs font-mono border border-white/10">
            <div className="text-white/50 text-[10px] uppercase">Active Historic Lens</div>
            <div className="text-white font-bold text-base mt-0.5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span>{epoch.title}</span>
            </div>
            <div className="text-white/80 text-[11px] mt-1">
              ${epoch.price.toLocaleString()} USD · {epoch.date}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Chronometric Timeline Scrubber */}
      <div className="liquid-glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative border border-white/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-white/70 font-mono">
          <div className="flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-white animate-pulse" />
            <span className="font-serif-instrument text-lg text-white font-bold tracking-wide">{epoch.title}</span>
            <span className="text-white/50">({epoch.date})</span>
            <span className="text-white/30">·</span>
            <span className="text-white font-semibold">{epoch.phase} Phase</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span>Historical Multiple: <strong className="text-white">{epoch.metrics.mvrv}x MVRV</strong></span>
            <span>LTH Supply: <strong className="text-white">{epoch.metrics.longTermHoldersPct}%</strong></span>
          </div>
        </div>

        {/* Custom Range Slider Track */}
        <div className="relative pt-2">
          <input
            type="range"
            min={0}
            max={HISTORICAL_EPOCHS.length - 1}
            value={selectedEpochIndex}
            onChange={(e) => handleSelectEpoch(parseInt(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none"
          />

          {/* Milestone Epoch Buttons (Desktop Widescreen Array) */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {HISTORICAL_EPOCHS.map((ep, idx) => {
              const isSelected = selectedEpochIndex === idx;
              return (
                <button
                  key={ep.id}
                  onClick={() => handleSelectEpoch(idx)}
                  className={`p-3 rounded-2xl border text-left text-xs font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'border-white bg-white/20 text-white font-bold shadow-md'
                      : 'border-white/10 liquid-glass text-white/70 hover:text-white hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/50">{ep.year}</span>
                    <span className="text-[10px] text-white/80 font-mono">${ep.price > 1000 ? `${Math.round(ep.price / 1000)}k` : ep.price}</span>
                  </div>
                  <div className="truncate font-semibold text-white mt-1 font-serif-instrument text-sm">{ep.title.replace(/\d{4}\s*/, '')}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. DUAL-STAGE HISTORICAL WORKSTATION (3D Viewport on Left + Investigation on Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
        
        {/* Left: 3D Observatory Historical Viewport (7 of 12 columns) */}
        <div className="xl:col-span-7 flex flex-col rounded-3xl border border-white/15 liquid-glass-panel overflow-hidden shadow-2xl relative">
          <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-white/80">
              <Eye className="h-3.5 w-3.5 text-white" />
              <span>Observation State: {epoch.date}</span>
            </div>
            <span className="text-white font-bold">
              MVRV: {epoch.metrics.mvrv}x · LTH Conviction: {epoch.metrics.longTermHoldersPct}%
            </span>
          </div>

          <div className="flex-1 min-h-[500px] xl:min-h-[580px] relative">
            <BitcoinObservatoryScene
              activeRegion={activeRegionIn3D}
              onSelectRegion={setActiveRegionIn3D}
              timeframe={epoch.year}
              onChangeTimeframe={() => {}}
              btcPrice={epoch.price}
              mvrvValue={epoch.metrics.mvrv}
              lthSupplyValue={epoch.metrics.longTermHoldersPct}
              hashrateValue={epoch.metrics.hashrateEh || 1}
              realizedCapValue={epoch.metrics.realizedCapB || 10}
              nuplValue={epoch.metrics.nupl}
              epochTitle={epoch.title}
            />
          </div>
        </div>

        {/* Right: Historical Investigation Dossier (5 of 12 columns) */}
        <div className="xl:col-span-5 rounded-3xl border border-white/15 liquid-glass-panel p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6">
            <div className="pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-white/70 uppercase tracking-wider mb-1">
                <span>HISTORICAL AUTOPSY</span>
                <span className="text-white/30">·</span>
                <span className="text-white/60">{epoch.phase.toUpperCase()} PHASE</span>
              </div>
              <h3 className="font-serif-instrument text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {epoch.title} ({epoch.date})
              </h3>
            </div>

            {/* Narrative summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider">
                What Transpired
              </h4>
              <p className="text-sm text-white/80 font-sans leading-relaxed">
                {epoch.whatHappened}
              </p>
            </div>

            {/* 3 Investigation Pillars */}
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl border border-white/10 liquid-glass">
                <div className="flex items-center gap-2 text-xs font-mono text-white font-bold uppercase mb-1">
                  <Users className="h-3.5 w-3.5 text-white" />
                  <span>Holder Cohort Behavior</span>
                </div>
                <p className="text-xs text-white/75 font-sans leading-relaxed">
                  {epoch.holderAction}
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-white/10 liquid-glass">
                <div className="flex items-center gap-2 text-xs font-mono text-white font-bold uppercase mb-1">
                  <Cpu className="h-3.5 w-3.5 text-white" />
                  <span>Network & Consensus Telemetry</span>
                </div>
                <p className="text-xs text-white/75 font-sans leading-relaxed">
                  {epoch.networkState}
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-white/10 liquid-glass">
                <div className="flex items-center gap-2 text-xs font-mono text-white font-bold uppercase mb-1">
                  <Coins className="h-3.5 w-3.5 text-white" />
                  <span>Valuation & Realized Price</span>
                </div>
                <p className="text-xs text-white/75 font-sans leading-relaxed">
                  {epoch.valuationState}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-2xl liquid-glass border border-white/10">
              <div className="text-[10px] font-mono text-white/50 uppercase">MVRV Ratio</div>
              <div className="text-sm font-mono font-bold text-white mt-0.5">{epoch.metrics.mvrv}x</div>
            </div>
            <div className="p-3 rounded-2xl liquid-glass border border-white/10">
              <div className="text-[10px] font-mono text-white/50 uppercase">LTH Supply</div>
              <div className="text-sm font-mono font-bold text-white mt-0.5">{epoch.metrics.longTermHoldersPct}%</div>
            </div>
            <div className="p-3 rounded-2xl liquid-glass border border-white/10">
              <div className="text-[10px] font-mono text-white/50 uppercase">Realized Cap</div>
              <div className="text-sm font-mono font-bold text-white mt-0.5">${epoch.metrics.realizedCapB || 0}B</div>
            </div>
          </div>

        </div>

      </div>

      {/* 4. COMPREHENSIVE HISTORICAL BENCHMARK MATRIX */}
      <div className="rounded-3xl border border-white/15 liquid-glass-panel p-6 sm:p-8 space-y-4 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="font-serif-instrument text-2xl font-bold text-white tracking-tight">
              Historical Epoch Benchmark Comparison
            </h3>
            <p className="text-xs text-white/60 font-sans mt-0.5">
              Comparative metric profiles across major cycle tops, bottoms, and macro milestones
            </p>
          </div>
          <span className="text-xs font-mono text-white/50 hidden sm:inline">
            Deterministic On-Chain Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-white/60 text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Epoch</th>
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Phase</th>
                <th className="py-3.5 px-4 font-semibold text-right">Spot Price</th>
                <th className="py-3.5 px-4 font-semibold text-right">MVRV</th>
                <th className="py-3.5 px-4 font-semibold text-right">LTH Supply</th>
                <th className="py-3.5 px-4 font-semibold text-right">NUPL</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {HISTORICAL_EPOCHS.map((ep, idx) => {
                const isSelected = selectedEpochIndex === idx;
                return (
                  <tr 
                    key={ep.id}
                    onClick={() => handleSelectEpoch(idx)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-white/15 text-white' : 'hover:bg-white/5 text-white/80'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      <span className="font-serif-instrument text-base">{ep.title}</span>
                    </td>
                    <td className="py-3.5 px-4 text-white/60">{ep.date}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] text-white border border-white/10">
                        {ep.phase}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-white">
                      ${ep.price.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-white">
                      {ep.metrics.mvrv}x
                    </td>
                    <td className="py-3.5 px-4 text-right text-white font-semibold">
                      {epoch.metrics.longTermHoldersPct}%
                    </td>
                    <td className="py-3.5 px-4 text-right text-white/80">
                      {ep.metrics.nupl !== undefined ? ep.metrics.nupl.toFixed(2) : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectEpoch(idx);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white hover:text-black text-white text-[11px] font-semibold transition-all cursor-pointer border border-white/10"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
