import React, { useState, useEffect } from 'react';
import { MetricDefinition, UserMode } from '../../types';
import { X, ArrowRight, ShieldCheck, Radio } from 'lucide-react';

export interface EvidenceInvestigation {
  title: string;
  theme: string;
  what: string;
  why: string;
  evidenceItems: {
    metric: MetricDefinition;
    highlightRole: string;
    historicalPercentile: number;
    change30d: number;
    statusNote: string;
  }[];
  technicalDetail: {
    formula: string;
    methodology: string;
    dataSource: string;
    decisionRule: string;
  };
}

interface ExplainDrawerProps {
  metric: MetricDefinition | null;
  investigation?: EvidenceInvestigation | null;
  onClose: () => void;
  onOpenMetricDetail?: (metricId: string) => void;
  userMode?: UserMode;
}

export const ExplainDrawer: React.FC<ExplainDrawerProps> = ({
  metric,
  investigation = null,
  onClose,
  onOpenMetricDetail
}) => {
  const [activeTab, setActiveTab] = useState<'evidence' | 'technical'>('evidence');

  // Prevent background scrolling when drawer/modal is open
  useEffect(() => {
    if (!metric && !investigation) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [metric, investigation, onClose]);

  if (!metric && !investigation) return null;

  // Thematic Investigation Mode ("SHOW ME WHY" signature experience)
  if (investigation) {
    return (
      <div 
        className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-2xl transition-opacity animate-fade-in"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        role="dialog"
        aria-modal="true"
      >
        <div 
          className="relative w-full max-w-2xl liquid-glass-panel border-l border-white/20 h-full flex flex-col shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Sticky Header - Pinned at top */}
          <div className="flex items-start justify-between px-6 sm:px-8 py-5 border-b border-white/10 shrink-0 bg-black/40 backdrop-blur-md z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-white/60 mb-1">
                <Radio className="h-3 w-3 text-white animate-pulse" />
                <span className="uppercase tracking-wider">EVIDENCE DOSSIER</span>
                <span className="text-white/30">·</span>
                <span className="text-white/80 uppercase">{investigation.theme}</span>
              </div>
              <h2 className="font-serif-instrument text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                {investigation.title}
              </h2>
            </div>
            
            <button
              onClick={onClose}
              className="liquid-glass-circle w-11 h-11 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer focus:outline-none shrink-0"
              title="Close dossier (Esc)"
              aria-label="Close dossier"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sticky Tab Selector */}
          <div className="px-6 sm:px-8 py-3.5 border-b border-white/10 shrink-0 bg-black/20">
            <div className="flex items-center gap-2 liquid-glass p-1.5 rounded-full border border-white/10">
              <button
                onClick={() => setActiveTab('evidence')}
                className={`flex-1 py-2 text-xs font-sans rounded-full transition-all cursor-pointer ${
                  activeTab === 'evidence'
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                1. Synthesized Evidence
              </button>
              <button
                onClick={() => setActiveTab('technical')}
                className={`flex-1 py-2 text-xs font-sans rounded-full transition-all cursor-pointer ${
                  activeTab === 'technical'
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                2. Technical & Mathematical Logic
              </button>
            </div>
          </div>

          {/* Scrollable Body - Smooth, contained scrolling */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6 overscroll-contain">
            {activeTab === 'evidence' ? (
              <div className="space-y-6">
                {/* WHAT */}
                <div className="rounded-2xl liquid-glass border border-white/10 p-5 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-white/60 font-mono font-bold">
                    WHAT IS OCCURRING
                  </span>
                  <p className="text-sm sm:text-base font-sans text-white leading-relaxed">
                    {investigation.what}
                  </p>
                </div>

                {/* WHY */}
                <div className="rounded-2xl liquid-glass border border-white/10 p-5 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-white/60 font-mono font-bold">
                    WHY IT MATTERS
                  </span>
                  <p className="text-xs sm:text-sm font-sans text-white/80 leading-relaxed">
                    {investigation.why}
                  </p>
                </div>

                {/* EVIDENCE PILLARS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-mono text-white/60">
                    <span className="uppercase tracking-wider">CORROBORATING EVIDENCE</span>
                    <span>{investigation.evidenceItems.length} METRICS LINKED</span>
                  </div>

                  <div className="space-y-3">
                    {investigation.evidenceItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl liquid-glass border border-white/10 hover:border-white/30 transition-all cursor-pointer group"
                        onClick={() => onOpenMetricDetail && onOpenMetricDetail(item.metric.id)}
                      >
                        <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                          <span className="font-serif-instrument text-base font-bold text-white group-hover:underline decoration-white/40 underline-offset-2">
                            {item.metric.name}
                          </span>
                          <span className="text-white font-bold font-mono">
                            {item.metric.currentValue} {item.metric.unit}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-white/50 font-mono mb-2">
                          <span>Role: {item.highlightRole}</span>
                          <span>·</span>
                          <span>Percentile: {item.historicalPercentile}%</span>
                          <span>·</span>
                          <span className="text-white/80">
                            30d: {item.change30d >= 0 ? '+' : ''}{item.change30d}%
                          </span>
                        </div>

                        <p className="text-xs text-white/75 font-sans leading-relaxed">
                          {item.statusNote}
                        </p>

                        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-end text-[11px] font-mono text-white group-hover:translate-x-1 transition-transform">
                          <span className="flex items-center gap-1 font-semibold">
                            Inspect Historical Chart & Data <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* TECHNICAL DETAIL */}
                <div className="rounded-2xl liquid-glass border border-white/10 p-5 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-white/60 font-bold">
                      MATHEMATICAL FORMULA & NORMALIZATION
                    </span>
                    <pre className="mt-2 p-4 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-white overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {investigation.technicalDetail.formula}
                    </pre>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono text-white/60 font-bold">
                      TELEMETRY METHODOLOGY
                    </span>
                    <p className="mt-1 text-xs text-white/80 leading-relaxed font-sans">
                      {investigation.technicalDetail.methodology}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono text-white/60 font-bold">
                      DATA PROVENANCE & INGESTION
                    </span>
                    <div className="mt-1 text-xs font-mono text-white font-medium">
                      {investigation.technicalDetail.dataSource}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono text-white/60 font-bold">
                      CLASSIFICATION DECISION RULE
                    </span>
                    <code className="block mt-1 p-3 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-white/90">
                      {investigation.technicalDetail.decisionRule}
                    </code>
                  </div>
                </div>

                <div className="p-4 rounded-2xl liquid-glass border border-white/10 text-xs text-white/70 flex items-start gap-3">
                  <ShieldCheck className="h-4 w-4 text-white shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-sans">
                    The Bitcoin Observatory uses deterministic consensus math. Interpretations reflect verified on-chain accounting rules, not machine-learning hallucinations or price prediction models.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Action / Close Bar - Pinned at bottom */}
          <div className="px-6 sm:px-8 py-4 border-t border-white/10 shrink-0 bg-black/60 backdrop-blur-md z-10 flex items-center justify-between text-xs font-mono text-white/50">
            <span>Dossier calibrated against BlockHorizon</span>
            
            <button
              onClick={onClose}
              className="px-8 py-2.5 rounded-full bg-white text-black font-sans font-medium text-xs hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
            >
              Close Dossier
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Single Metric Breakdown Drawer
  if (!metric) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-2xl transition-opacity animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-xl liquid-glass-panel border-l border-white/20 h-full flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Header - Pinned at top */}
        <div className="flex items-start justify-between px-6 sm:px-8 py-5 border-b border-white/10 shrink-0 bg-black/40 backdrop-blur-md z-10">
          <div>
            <div className="text-xs font-mono text-white/60 uppercase tracking-wider mb-1">
              METRIC TELEMETRY
            </div>
            <h2 className="font-serif-instrument text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              {metric.name}
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className="liquid-glass-circle w-11 h-11 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer focus:outline-none shrink-0"
            title="Close dialog (Esc)"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body - Smooth, contained scrolling */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6 overscroll-contain">
          <div className="p-5 rounded-2xl liquid-glass border border-white/10 space-y-2">
            <div className="text-xs font-mono text-white/60">Current Reading</div>
            <div className="text-3xl font-mono font-bold text-white">
              {metric.currentValue} <span className="text-sm font-normal text-white/60">{metric.unit}</span>
            </div>
            <p className="mt-2 text-xs text-white/80 font-sans leading-relaxed">
              {metric.simpleExplanation}
            </p>
          </div>

          <div className="space-y-4 text-xs font-sans text-white/75 leading-relaxed">
            <div className="p-5 rounded-2xl liquid-glass border border-white/10 space-y-1.5">
              <h4 className="font-mono text-white text-xs font-bold uppercase">Why this metric matters</h4>
              <p>{metric.whyCare}</p>
            </div>

            <div className="p-5 rounded-2xl liquid-glass border border-white/10 space-y-1.5">
              <h4 className="font-mono text-white/60 text-xs font-bold uppercase">Mathematical Formula</h4>
              <code className="block p-3.5 rounded-xl bg-black/60 text-white font-mono text-[11px] mt-1 border border-white/10 overflow-x-auto">
                {metric.formula}
              </code>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Actions - Always visible */}
        <div className="px-6 sm:px-8 py-4 border-t border-white/10 shrink-0 bg-black/60 backdrop-blur-md z-10 flex items-center justify-between text-xs font-mono">
          <button
            onClick={() => onOpenMetricDetail && onOpenMetricDetail(metric.id)}
            className="text-white hover:underline decoration-white/40 underline-offset-4 font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <span>Open Interactive Chart</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
          
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-full bg-white text-black font-sans font-medium text-xs hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
          >
            Close Card
          </button>
        </div>

      </div>
    </div>
  );
};
