import React, { useState } from 'react';
import { CYCLE_STAGES, getCurrentConditionAssessment } from '../../data/cycles';
import { CycleStage } from '../../types';
import { Compass, Info, Radio, Layers, ArrowRight } from 'lucide-react';

interface CycleViewProps {
  onSelectMetricDetail: (metricId: string) => void;
}

export const CycleView: React.FC<CycleViewProps> = ({ onSelectMetricDetail }) => {
  const currentCondition = getCurrentConditionAssessment();
  const [selectedStage, setSelectedStage] = useState<CycleStage>(
    CYCLE_STAGES.find((s) => s.isCurrent) || CYCLE_STAGES[2]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12 celestial-grid-pattern min-h-screen">
      
      {/* Header with Celestial Identity */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2 tracking-widest uppercase">
          <Compass className="h-4 w-4 text-amber-500" />
          <span>CELESTIAL EPICYCLE CLOCK · 8 ORBITAL PHASES</span>
        </div>
        <h1 className="font-celestial text-3xl sm:text-5xl font-bold text-white tracking-wide">
          The 8 Stages of the Bitcoin Cycle
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
          A behavioral macro model mapping coin maturity, valuation multiples, and miner distribution. This astronomical framework provides present condition analysis—not a predictive crystal ball.
        </p>
      </div>

      {/* 1. CURRENT CONDITION ASSESSMENT (Precision Telescope Readout) */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#03060c] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="reticle-corner-tl" />
        <div className="reticle-corner-tr" />
        <div className="reticle-corner-bl" />
        <div className="reticle-corner-br" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1 tracking-widest uppercase">
              <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span>CURRENT EMPIRICAL ASSESSMENT</span>
            </div>
            
            <div className="flex items-baseline gap-3 mt-1">
              <h2 className="font-celestial text-3xl sm:text-4xl font-bold text-white tracking-wide">
                {currentCondition.stageName}
              </h2>
              <span className="text-xs font-mono text-emerald-400">
                · Model Concordance Active
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed font-sans">
              Multiple on-chain indicators show steady capital expansion, healthy holder retention, and positive coin profit velocity, consistent with structural mid-expansion.
            </p>
          </div>

          {/* Metric Agreement Gauge */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 lg:w-84 shrink-0">
            <div className="flex items-center justify-between text-xs mb-1 font-mono">
              <span className="text-slate-400">Indicator Agreement</span>
              <span className="font-bold text-amber-400">{currentCondition.confidence}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden my-2.5">
              <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full w-4/5" />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              {currentCondition.confidenceDescription}
            </p>
          </div>
        </div>

        {/* Corroborating Evidence Grid */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
            <span className="uppercase tracking-wider">Supporting Indicator Concordance</span>
            <span>5 Indicators Monitored</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {currentCondition.evidenceList.map((ev, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02]">
                <div className="flex items-center justify-between text-xs mb-1 font-mono">
                  <span className="font-semibold text-white">{ev.metric}</span>
                  <span className={ev.agreement === 'Agrees' ? 'text-emerald-400 text-[11px]' : 'text-amber-400 text-[11px]'}>
                    {ev.agreement}
                  </span>
                </div>
                <div className="text-xs font-mono text-amber-300 mb-1">{ev.currentReading}</div>
                <p className="text-[11px] text-slate-400 leading-snug font-sans">{ev.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Structural Differences From Prior Cycles */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-start gap-2.5 text-xs text-slate-400">
          <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="font-sans leading-relaxed">
            <strong className="text-slate-200">Historical nuance note: </strong>
            <span>{currentCondition.macroDifferencesFromPriorCycles}</span>
          </div>
        </div>

      </div>

      {/* 2. THE 8 STAGES EPICYCLE SELECTOR & DETAILED NARRATIVE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: 8 Epoch Stage Matrix */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-xs font-mono text-slate-400 pb-2 border-b border-white/[0.06] uppercase tracking-wider">
            Planetary Cycle Sequence
          </div>

          {CYCLE_STAGES.map((stg, idx) => {
            const isSelected = selectedStage.id === stg.id;
            return (
              <div
                key={stg.id}
                onClick={() => setSelectedStage(stg)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-400/50 bg-[#070b16] shadow-lg'
                    : 'border-white/[0.05] bg-white/[0.015] hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{String(idx + 1).padStart(2, '0')}.</span>
                    <span className="font-bold text-white tracking-wide">{stg.name}</span>
                  </div>

                  {stg.isCurrent && (
                    <span className="text-emerald-400 text-[11px] font-semibold">● ACTIVE</span>
                  )}
                </div>

                <p className="mt-1 text-xs text-slate-400 font-sans leading-relaxed line-clamp-1">
                  {stg.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Stage Inspection Laboratory */}
        <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#03060c] p-6 sm:p-8 space-y-6 shadow-2xl relative">
          <div className="reticle-corner-tl" />
          <div className="reticle-corner-tr" />

          <div className="flex items-start justify-between pb-4 border-b border-white/[0.06]">
            <div>
              <div className="text-xs font-mono text-amber-400 tracking-wider uppercase mb-1">
                CYCLE STAGE DOSSIER
              </div>
              <h3 className="font-celestial text-2xl font-bold text-white tracking-wide">
                {selectedStage.name}
              </h3>
            </div>

            {selectedStage.isCurrent && (
              <span className="text-xs font-mono text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-500/10">
                Current Observable Stage
              </span>
            )}
          </div>

          <p className="text-sm text-slate-200 font-sans leading-relaxed">
            {selectedStage.subtitle} · {selectedStage.psychology}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div className="text-xs font-mono text-slate-400 uppercase mb-1">Valuation Behavior</div>
              <div className="font-mono text-sm font-bold text-amber-300">
                {selectedStage.valuationBehavior}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div className="text-xs font-mono text-slate-400 uppercase mb-1">Holder Behavior Dynamic</div>
              <div className="font-mono text-sm font-bold text-emerald-300">
                {selectedStage.holderBehavior}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              Key Metric Thresholds
            </h4>
            <div className="space-y-2 text-xs text-slate-300 font-sans">
              {selectedStage.keyMetrics.map((km, i: number) => (
                <div key={i} className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.02] flex items-center justify-between font-mono">
                  <span className="font-bold text-white">{km.metric}</span>
                  <span className="text-amber-300">{km.typicalRange}</span>
                  <span className="text-slate-400 font-sans text-[11px]">{km.meaning}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
