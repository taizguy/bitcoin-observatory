import React, { useState } from 'react';
import { CYCLE_STAGES, getCurrentConditionAssessment } from '../../data/cycles';
import { CycleStage } from '../../types';
import { 
  Activity, 
  Info, 
  Radio, 
  Layers, 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Cpu, 
  Coins, 
  Smile, 
  Calendar,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface CycleViewProps {
  onSelectMetricDetail: (metricId: string) => void;
}

export const CycleView: React.FC<CycleViewProps> = ({ onSelectMetricDetail }) => {
  const currentCondition = getCurrentConditionAssessment();
  const [selectedStage, setSelectedStage] = useState<CycleStage>(
    CYCLE_STAGES.find((s) => s.isCurrent) || CYCLE_STAGES[2]
  );

  return (
    <div className="w-full max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-8 min-h-screen">
      
      {/* 1. Header (Expansive Desktop Header) */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2 max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-mono text-white/70 uppercase tracking-wider">
            <Activity className="h-3.5 w-3.5 text-white" />
            <span>ORBITAL CYCLE CLOCK</span>
            <span className="text-white/30">·</span>
            <span className="text-white/60">8 STRUCTURAL PHASES</span>
            <span className="text-white/30">·</span>
            <span className="text-white/80">EMPIRICAL MACRO MODEL</span>
          </div>

          <h1 
            className="font-serif-instrument text-4xl sm:text-5xl xl:text-6xl tracking-tight text-white"
            style={{ textShadow: '0 0 72px rgba(0, 0, 0, 0.7), 0 4px 28px rgba(0, 0, 0, 0.45)' }}
          >
            The 8 Stages of the Bitcoin <em className="italic font-serif-instrument">Cycle</em>
          </h1>

          <p 
            className="text-sm sm:text-base text-white/70 font-sans leading-relaxed"
            style={{ textShadow: '0 0 30px rgba(0, 0, 0, 0.5), 0 1px 10px rgba(0, 0, 0, 0.35)' }}
          >
            A behavioral macro model mapping coin maturity, valuation multiples, and miner distribution. This framework provides empirical present-condition diagnosis—not speculative timing predictions.
          </p>
        </div>

        {/* Quick Macro Status Chip */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="liquid-glass rounded-2xl p-4 text-xs font-mono border border-white/10">
            <div className="text-white/50 text-[10px] uppercase">Active Consensus Phase</div>
            <div className="text-white font-bold text-base mt-0.5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span>{currentCondition.stageName}</span>
            </div>
            <div className="text-white/80 text-[11px] mt-1">{currentCondition.confidence}</div>
          </div>
        </div>
      </div>

      {/* 2. CURRENT CONDITION ASSESSMENT (Liquid Glass Command Center) */}
      <div className="liquid-glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-white/15">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-white/70 uppercase tracking-wider">
              <Radio className="h-3.5 w-3.5 animate-pulse text-white" />
              <span>EMPIRICAL CONDITION DIAGNOSIS</span>
              <span className="text-white/30">·</span>
              <span className="text-white/60">EPOCH 2024–2026</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="font-serif-instrument text-3xl sm:text-4xl xl:text-5xl text-white tracking-tight">
                {currentCondition.stageName}
              </h2>
              <span className="text-xs font-mono text-white font-semibold px-3 py-1 rounded-full bg-white/10 border border-white/20">
                Model Concordance Active
              </span>
            </div>

            <p className="text-sm text-white/80 leading-relaxed font-sans">
              Multiple on-chain indicators show steady capital expansion, healthy holder retention, and positive coin profit velocity, consistent with structural mid-expansion.
            </p>
          </div>

          {/* Model Agreement Gauge Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 xl:w-96 shrink-0">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-white/60">Indicator Agreement</span>
              <span className="font-bold text-white">{currentCondition.confidence}</span>
            </div>
            
            {/* Clean Progress Meter */}
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden my-2.5">
              <div className="h-full bg-white rounded-full w-4/5" />
            </div>

            <p className="text-[11px] text-white/60 leading-relaxed font-sans">
              {currentCondition.confidenceDescription}
            </p>
          </div>
        </div>

        {/* 5 Corroborating Indicators Grid */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-white/60">
            <span className="uppercase tracking-wider">Supporting Indicator Readings</span>
            <span>5 Primary Ledgers Monitored</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {currentCondition.evidenceList.map((ev, i) => (
              <div key={i} className="p-4 rounded-2xl border border-white/10 liquid-glass hover:border-white/25 transition-all">
                <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                  <span className="font-semibold text-white">{ev.metric}</span>
                  <span className="text-white/70 text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/10">
                    {ev.agreement}
                  </span>
                </div>
                <div className="text-sm font-mono font-bold text-white mb-1">{ev.currentReading}</div>
                <p className="text-[11px] text-white/60 leading-snug font-sans">{ev.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Macro Historical Differences Banner */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-start gap-3 text-xs text-white/70">
          <Info className="h-4 w-4 text-white shrink-0 mt-0.5" />
          <div className="font-sans leading-relaxed">
            <strong className="text-white">Historical nuance note: </strong>
            <span>{currentCondition.macroDifferencesFromPriorCycles}</span>
          </div>
        </div>
      </div>

      {/* 3. THE 8 STAGES WORKSTATION (Desktop 12-Column Layout) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left: 8 Stages Sequence Selector (5 of 12 columns on desktop) */}
        <div className="xl:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-white/50 pb-2 border-b border-white/10 uppercase tracking-wider">
            <span>Cycle Sequence Directory</span>
            <span>8 Phases</span>
          </div>

          <div className="space-y-2">
            {CYCLE_STAGES.map((stg, idx) => {
              const isSelected = selectedStage.id === stg.id;
              return (
                <div
                  key={stg.id}
                  onClick={() => setSelectedStage(stg)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-white bg-white/15 text-white shadow-xl'
                      : 'border-white/10 liquid-glass hover:border-white/25 text-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2.5">
                      <span className="text-white/50 font-bold">{String(idx + 1).padStart(2, '0')}.</span>
                      <span className="font-serif-instrument text-base font-bold text-white tracking-wide">{stg.name}</span>
                    </div>

                    {stg.isCurrent ? (
                      <span className="text-white text-[11px] font-semibold flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 border border-white/25">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-white/50 text-[11px] font-mono">PHASE {idx + 1}</span>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-white/60 font-sans leading-relaxed line-clamp-2">
                    {stg.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Comprehensive Stage Dossier (7 of 12 columns on desktop) */}
        <div className="xl:col-span-7 rounded-3xl border border-white/15 liquid-glass-panel p-6 sm:p-8 space-y-8 shadow-2xl relative overflow-hidden">
          
          {/* Dossier Header */}
          <div className="pb-6 border-b border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white/70 uppercase tracking-wider font-semibold">
                PHASE DOSSIER · {selectedStage.name.toUpperCase()}
              </span>
              <span className="text-white/50 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-white/70" />
                <span>{Array.isArray(selectedStage.historicalDates) ? selectedStage.historicalDates.join(' · ') : selectedStage.historicalDates}</span>
              </span>
            </div>

            <h3 className="font-serif-instrument text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {selectedStage.name}
            </h3>

            <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed">
              {selectedStage.subtitle}
            </p>
          </div>

          {/* 4 Deep Behavioral Forces Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Price Behavior */}
            <div className="p-5 rounded-2xl border border-white/10 liquid-glass space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-white font-bold uppercase tracking-wider">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Price & Volatility</span>
              </div>
              <p className="text-xs text-white/75 font-sans leading-relaxed">
                {selectedStage.priceBehavior}
              </p>
            </div>

            {/* 2. Holder Dynamics */}
            <div className="p-5 rounded-2xl border border-white/10 liquid-glass space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-white font-bold uppercase tracking-wider">
                <Users className="h-3.5 w-3.5" />
                <span>Holder & Cohort Action</span>
              </div>
              <p className="text-xs text-white/75 font-sans leading-relaxed">
                {selectedStage.holderBehavior}
              </p>
            </div>

            {/* 3. Network & Mining State */}
            <div className="p-5 rounded-2xl border border-white/10 liquid-glass space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-white font-bold uppercase tracking-wider">
                <Cpu className="h-3.5 w-3.5" />
                <span>Network & Mining State</span>
              </div>
              <p className="text-xs text-white/75 font-sans leading-relaxed">
                {selectedStage.networkBehavior}
              </p>
            </div>

            {/* 4. Valuation Multiples */}
            <div className="p-5 rounded-2xl border border-white/10 liquid-glass space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-white font-bold uppercase tracking-wider">
                <Coins className="h-3.5 w-3.5" />
                <span>Valuation & Capital</span>
              </div>
              <p className="text-xs text-white/75 font-sans leading-relaxed">
                {selectedStage.valuationBehavior}
              </p>
            </div>

          </div>

          {/* Market Psychology & Sentiment Box */}
          <div className="p-5 rounded-2xl border border-white/10 liquid-glass space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-white font-bold uppercase tracking-wider">
              <Smile className="h-3.5 w-3.5" />
              <span>Collective Market Psychology</span>
            </div>
            <p className="text-xs sm:text-sm text-white/80 font-sans leading-relaxed">
              {selectedStage.psychology}
            </p>
          </div>

          {/* Key Metrics Monitored in this Stage */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="text-xs font-mono text-white/50 uppercase tracking-wider">
              Diagnostic Metrics For This Phase
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedStage.keyMetrics.map((km, i) => (
                <div
                  key={i}
                  onClick={() => onSelectMetricDetail(km.metric.toLowerCase().replace(/[^a-z0-9]/g, '_'))}
                  className="p-4 rounded-2xl border border-white/10 liquid-glass hover:border-white/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-serif-instrument text-base font-bold text-white group-hover:underline decoration-white/40 transition-colors">
                      {km.metric}
                    </span>
                    <span className="text-[11px] text-white/70 font-mono px-2 py-0.5 rounded-full bg-white/10 border border-white/10">
                      {km.typicalRange}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60 font-sans mt-1 line-clamp-1">
                    {km.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
