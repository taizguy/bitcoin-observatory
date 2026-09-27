import React, { useState } from 'react';
import { MetricDefinition, UserMode } from '../../types';
import { X, ArrowRight, ExternalLink, ShieldCheck, Database, FileCode, CheckCircle2, TrendingUp, Compass, Radio } from 'lucide-react';

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
  onOpenMetricDetail,
  userMode = 'beginner'
}) => {
  const [activeTab, setActiveTab] = useState<'evidence' | 'technical'>('evidence');

  if (!metric && !investigation) return null;

  // Thematic Investigation Mode ("SHOW ME WHY" signature experience)
  if (investigation) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md transition-opacity">
        <div className="relative w-full max-w-2xl bg-[#03060c] border-l border-white/10 h-full overflow-y-auto p-6 sm:p-8 flex flex-col shadow-2xl">
          
          {/* Precision Corner Reticles */}
          <div className="reticle-corner-tl" />
          <div className="reticle-corner-bl" />

          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                <span className="uppercase tracking-widest">EVIDENCE DOSSIER</span>
                <span>·</span>
                <span className="text-slate-400 uppercase">{investigation.theme}</span>
              </div>
              <h2 className="font-celestial text-2xl sm:text-3xl font-bold text-white tracking-wide">
                {investigation.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="my-6 flex items-center gap-2 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setActiveTab('evidence')}
              className={`flex-1 py-2 text-xs font-mono rounded-lg transition-all ${
                activeTab === 'evidence'
                  ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Synthesized Evidence
            </button>
            <button
              onClick={() => setActiveTab('technical')}
              className={`flex-1 py-2 text-xs font-mono rounded-lg transition-all ${
                activeTab === 'technical'
                  ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Technical & Mathematical Logic
            </button>
          </div>

          {activeTab === 'evidence' ? (
            <div className="flex-1 space-y-6">
              {/* WHAT */}
              <div className="rounded-xl border border-amber-500/25 bg-[#080d19] p-5">
                <span className="text-[10px] uppercase tracking-wider text-amber-400 font-mono font-bold">
                  WHAT IS OCCURRING
                </span>
                <p className="mt-2 text-sm sm:text-base font-sans text-slate-200 leading-relaxed">
                  {investigation.what}
                </p>
              </div>

              {/* WHY */}
              <div className="rounded-xl border border-white/[0.07] bg-[#050811] p-5">
                <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-mono font-bold">
                  WHY IT MATTERS
                </span>
                <p className="mt-2 text-xs sm:text-sm font-sans text-slate-300 leading-relaxed">
                  {investigation.why}
                </p>
              </div>

              {/* EVIDENCE PILLARS */}
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.06] text-xs font-mono text-slate-400">
                  <span className="uppercase">CORROBORATING EVIDENCE</span>
                  <span>{investigation.evidenceItems.length} METRICS LINKED</span>
                </div>

                <div className="space-y-3">
                  {investigation.evidenceItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-amber-400/30 transition-all cursor-pointer"
                      onClick={() => onOpenMetricDetail && onOpenMetricDetail(item.metric.id)}
                    >
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="font-semibold text-white">{item.metric.name}</span>
                        <span className="text-amber-400 font-bold">
                          {item.metric.currentValue} {item.metric.unit}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mb-2">
                        <span>Role: {item.highlightRole}</span>
                        <span>·</span>
                        <span>Percentile: {item.historicalPercentile}%</span>
                        <span>·</span>
                        <span className={item.change30d >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          30d: {item.change30d >= 0 ? '+' : ''}{item.change30d}%
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {item.statusNote}
                      </p>

                      <div className="mt-3 flex items-center justify-end text-[11px] font-mono text-amber-400 hover:text-amber-300">
                        <span>Inspect Historical Chart & Data →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 space-y-6">
              {/* TECHNICAL DETAIL */}
              <div className="rounded-xl border border-white/[0.08] bg-[#050811] p-5 space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">
                    MATHEMATICAL FORMULA & NORMALIZATION
                  </span>
                  <pre className="mt-2 p-3 rounded-lg bg-black/60 border border-white/[0.06] text-xs font-mono text-amber-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {investigation.technicalDetail.formula}
                  </pre>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">
                    TELEMETRY METHODOLOGY
                  </span>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed font-sans">
                    {investigation.technicalDetail.methodology}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">
                    DATA PROVENANCE & INGESTION
                  </span>
                  <div className="mt-1 text-xs font-mono text-emerald-400">
                    {investigation.technicalDetail.dataSource}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">
                    CLASSIFICATION DECISION RULE
                  </span>
                  <code className="block mt-1 p-2 rounded bg-black/40 border border-white/[0.04] text-[11px] font-mono text-slate-300">
                    {investigation.technicalDetail.decisionRule}
                  </code>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] text-xs text-slate-400 flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-sans">
                  The Bitcoin Observatory uses deterministic consensus math. Interpretations reflect verified on-chain accounting rules, not machine-learning hallucinations or price prediction models.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Dossier calibrated against BlockHorizon consensus</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white font-medium transition-colors"
            >
              Close Dossier
            </button>
          </div>

        </div>
      </div>
    );
  }

  if (!metric) return null;

  // Single Metric Breakdown Drawer
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-xl bg-[#03060c] border-l border-white/10 h-full overflow-y-auto p-6 sm:p-8 flex flex-col shadow-2xl">
        
        <div className="flex items-start justify-between pb-6 border-b border-white/[0.08]">
          <div>
            <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
              METRIC TELEMETRY
            </div>
            <h2 className="font-celestial text-2xl font-bold text-white tracking-wide">
              {metric.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="my-6 p-4 rounded-xl border border-amber-500/20 bg-[#080d19]">
          <div className="text-xs font-mono text-amber-400">Current Reading</div>
          <div className="text-3xl font-mono font-bold text-white mt-1">
            {metric.currentValue} <span className="text-sm font-normal text-slate-400">{metric.unit}</span>
          </div>
          <p className="mt-2 text-xs text-slate-300 font-sans leading-relaxed">
            {metric.simpleExplanation}
          </p>
        </div>

        <div className="space-y-4 text-xs font-sans text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <h4 className="font-mono text-cyan-400 text-xs font-bold uppercase mb-1">Why this metric matters</h4>
            <p>{metric.whyCare}</p>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <h4 className="font-mono text-slate-400 text-xs font-bold uppercase mb-1">Mathematical Formula</h4>
            <code className="block p-2 rounded bg-black/50 text-amber-300 font-mono text-[11px] mt-1">
              {metric.formula}
            </code>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
          <button
            onClick={() => onOpenMetricDetail && onOpenMetricDetail(metric.id)}
            className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            <span>Open Full Interactive Chart</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
};
