import React, { useState } from 'react';
import { HISTORICAL_EPOCHS } from '../../data/history';
import { HistoricalEpoch } from '../../types';
import { BitcoinObservatoryScene } from '../3d/BitcoinObservatoryScene';
import { History as HistoryIcon, Eye, ArrowRight, Radio, Compass, ChevronRight } from 'lucide-react';

interface HistoryViewProps {
  onSelectMetricDetail: (metricId: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelectMetricDetail }) => {
  const [selectedEpochIndex, setSelectedEpochIndex] = useState<number>(HISTORICAL_EPOCHS.length - 1);
  const [revealedExplanation, setRevealedExplanation] = useState<boolean>(true);
  const [activeRegionIn3D, setActiveRegionIn3D] = useState<string | null>(null);

  const epoch: HistoricalEpoch = HISTORICAL_EPOCHS[selectedEpochIndex];

  const handleSelectEpoch = (idx: number) => {
    setSelectedEpochIndex(idx);
    setRevealedExplanation(idx === HISTORICAL_EPOCHS.length - 1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12 celestial-grid-pattern min-h-screen">
      
      {/* Header */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2 tracking-widest uppercase">
          <HistoryIcon className="h-4 w-4 text-cyan-400" />
          <span>CELESTIAL CHRONOMETER · 15-YEAR LEDGER TIMELINE</span>
        </div>
        <h1 className="font-celestial text-3xl sm:text-5xl font-bold text-white tracking-wide">
          Travel Through Bitcoin History
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
          Scrub the timeline to transport the Observatory through 15 years of ledger history. Watch how price, holder conviction, network hashrate, and valuation multiples transform across each cycle landmark.
        </p>
      </div>

      {/* Interactive Timeline Scrubber & Landmark Jumps */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#03060c] p-6 sm:p-8 shadow-2xl space-y-5 relative">
        <div className="reticle-corner-tl" />
        <div className="reticle-corner-tr" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span className="text-white font-bold text-sm">{epoch.title}</span>
            <span className="text-slate-500">({epoch.date})</span>
          </div>
          <span className="text-amber-400 font-mono text-sm font-bold">
            Historical Spot Price: ${epoch.price.toLocaleString()}
          </span>
        </div>

        {/* Custom Timeline Slider Track */}
        <div className="relative pt-2 pb-2">
          <input
            type="range"
            min={0}
            max={HISTORICAL_EPOCHS.length - 1}
            value={selectedEpochIndex}
            onChange={(e) => handleSelectEpoch(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
          />

          {/* Landmark Epoch Buttons */}
          <div className="mt-4 flex flex-wrap justify-between gap-1.5">
            {HISTORICAL_EPOCHS.map((ep, idx) => {
              const isSelected = selectedEpochIndex === idx;
              return (
                <button
                  key={ep.id}
                  onClick={() => handleSelectEpoch(idx)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                    isSelected
                      ? 'border-amber-400/70 bg-amber-500/20 text-amber-300 font-bold shadow-md'
                      : 'border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-white hover:border-white/15'
                  }`}
                >
                  <span className="block text-[10px] text-slate-500">{ep.year}</span>
                  <span className="truncate max-w-[110px] block">{ep.title.split(' ')[1] || ep.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3D Observatory Environment Bound to Historical Telemetry */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#030509] overflow-hidden shadow-2xl relative">
        <div className="px-6 py-3 border-b border-white/[0.06] bg-black/40 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Eye className="h-3.5 w-3.5 text-cyan-400" />
            <span>Telescopic Observation State: {epoch.date}</span>
          </div>
          <span className="text-amber-400 font-bold">
            MVRV: {epoch.metrics.mvrv}x · LTH Conviction: {epoch.metrics.longTermHoldersPct}%
          </span>
        </div>
        
        <BitcoinObservatoryScene
          activeRegion={activeRegionIn3D}
          onSelectRegion={setActiveRegionIn3D}
          timeframe={epoch.year}
          onChangeTimeframe={() => {}}
          mvrvValue={epoch.metrics.mvrv}
          lthSupplyValue={epoch.metrics.longTermHoldersPct}
          hashrateValue={epoch.metrics.hashrateEh}
          realizedCapValue={epoch.metrics.realizedCapB}
          nuplValue={epoch.metrics.nupl}
          btcPrice={epoch.price}
          epochTitle={`${epoch.title} (${epoch.date})`}
        />
      </div>

      {/* SIGNATURE "WHAT HAPPENED HERE?" HISTORICAL INVESTIGATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Historical Investigation Narrative */}
        <div className="lg:col-span-8 rounded-2xl border border-white/[0.08] bg-[#03060c] p-6 sm:p-8 space-y-6 shadow-xl relative">
          <div className="reticle-corner-tl" />
          <div className="reticle-corner-tr" />

          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div>
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                HISTORICAL INVESTIGATION
              </div>
              <h2 className="font-celestial text-2xl font-bold text-white tracking-wide">
                What Happened in {epoch.title}?
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {epoch.date}
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed">
            {epoch.whatHappened}
          </p>

          {/* Historical Clues & Telemetry Evidence */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Diagnostic Clues & Ledger Fingerprints
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02]">
                <div className="text-xs font-mono text-amber-400 mb-1">Holder Action</div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{epoch.holderAction}</p>
              </div>
              <div className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02]">
                <div className="text-xs font-mono text-cyan-400 mb-1">Network State</div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{epoch.networkState}</p>
              </div>
              <div className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02] sm:col-span-2">
                <div className="text-xs font-mono text-emerald-400 mb-1">Valuation State</div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{epoch.valuationState}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Macro Landmark Metrics */}
        <div className="lg:col-span-4 rounded-2xl border border-white/[0.08] bg-[#03060c] p-6 sm:p-8 space-y-4 shadow-xl relative">
          <div className="reticle-corner-tl" />
          <div className="reticle-corner-tr" />

          <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider pb-2 border-b border-white/[0.06]">
            Epoch Metric Snapshot
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02]">
              <div className="text-[11px] font-mono text-slate-400">MVRV Ratio</div>
              <div className="text-xl font-mono font-bold text-white mt-0.5">
                {epoch.metrics.mvrv}x
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02]">
              <div className="text-[11px] font-mono text-slate-400">Long-Term Holder Supply</div>
              <div className="text-xl font-mono font-bold text-white mt-0.5">
                {epoch.metrics.longTermHoldersPct}%
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02]">
              <div className="text-[11px] font-mono text-slate-400">Estimated Hashrate</div>
              <div className="text-xl font-mono font-bold text-white mt-0.5">
                {epoch.metrics.hashrateEh} EH/s
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02]">
              <div className="text-[11px] font-mono text-slate-400">Realized Cap</div>
              <div className="text-xl font-mono font-bold text-white mt-0.5">
                ${epoch.metrics.realizedCapB}B
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
