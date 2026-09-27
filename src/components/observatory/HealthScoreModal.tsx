import React, { useState } from 'react';
import { HealthScoreBreakdown } from '../../types';
import { X, Sliders, RotateCcw, CheckCircle2, Save, Info, ShieldCheck } from 'lucide-react';
import { DEFAULT_WEIGHTS, ScoreWeights, saveWeightsLocally, resetSavedWeights, calculateHealthScore } from '../../data/healthScore';

interface HealthScoreModalProps {
  scoreData: HealthScoreBreakdown;
  onClose: () => void;
  onSelectMetric: (metricId: string) => void;
  onWeightsUpdated?: () => void;
}

export const HealthScoreModal: React.FC<HealthScoreModalProps> = ({
  scoreData,
  onClose,
  onSelectMetric,
  onWeightsUpdated
}) => {
  const [weights, setWeights] = useState<ScoreWeights>(() => {
    const current: Record<string, number> = {};
    scoreData.components.forEach(c => {
      current[c.id] = c.weight;
    });
    return (current as unknown as ScoreWeights) || DEFAULT_WEIGHTS;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Recalculate dynamic model with active weights
  const dynamicModel = calculateHealthScore(weights);

  const handleWeightChange = (key: keyof ScoreWeights, val: number) => {
    setWeights(prev => ({ ...prev, [key]: val }));
    setSavedSuccess(false);
  };

  const handleSaveLocally = () => {
    saveWeightsLocally(weights);
    setSavedSuccess(true);
    if (onWeightsUpdated) onWeightsUpdated();
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    const def = resetSavedWeights();
    setWeights(def);
    if (onWeightsUpdated) onWeightsUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 transition-all">
      <div className="relative w-full max-w-2xl bg-[#090d16] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <span>Analytical Framework</span>
              <span>·</span>
              <span>Open Model Methodology</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-white mt-1">
              Observatory Composite Model
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Composite Score Readout with Contribution Formula */}
        <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-950/20 p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <span className="font-display text-3xl font-black">{dynamicModel.overall}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-white">
                    {dynamicModel.statusLabel}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Calculated Model
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Scale: 0 (Capitulation Risk) to 100 (Max Structural Expansion)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveLocally}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/20 text-amber-200 text-xs font-medium hover:bg-amber-500/30 transition-colors"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{savedSuccess ? 'Saved Locally!' : 'Save Weights'}</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 text-xs hover:text-white transition-colors"
                title="Reset to baseline 20/25/20/20/15 distribution"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-white/[0.06]">
            {dynamicModel.summary}
          </p>

          {/* Exact Mathematical Formula Breakdown */}
          <div className="rounded-lg bg-black/40 p-3 border border-white/[0.06] text-[11px] font-mono text-slate-300 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
              Programmatic Reproduction Formula:
            </span>
            <div className="text-amber-300/90 break-all">
              {dynamicModel.calculationFormula}
            </div>
          </div>
        </div>

        {/* Breakdown of 5 Components with Contributions and Weights */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Component Weights & Mathematical Contributions
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Total Weight: {Math.round(Object.values(weights).reduce((a, b) => a + b, 0) * 100)}%
            </span>
          </div>

          <div className="space-y-3">
            {dynamicModel.components.map((comp) => {
              const currentWeight = weights[comp.id as keyof ScoreWeights] || 0.2;
              return (
                <div
                  key={comp.id}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/10"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">{comp.label}</span>
                      <span className="text-xs text-slate-500 font-mono">({comp.sourceMetricName})</span>
                      <button
                        onClick={() => {
                          onClose();
                          onSelectMetric(comp.metricId);
                        }}
                        className="text-[11px] font-mono text-cyan-400 hover:underline ml-1"
                      >
                        Inspect →
                      </button>
                    </div>

                    {/* Exact Contribution Display */}
                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span className="text-slate-400">
                        {comp.score} pts × {Math.round(currentWeight * 100)}% =
                      </span>
                      <span className="font-bold text-amber-300 text-sm">
                        +{comp.weightedScore} pts
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    {comp.explanation}
                  </p>

                  {/* Weight Slider */}
                  <div className="mt-3 flex items-center justify-between gap-4 pt-2 border-t border-white/[0.04]">
                    <span className="text-[10px] text-slate-400 font-mono">Weight Allocation:</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0.05"
                        max="0.45"
                        step="0.05"
                        value={currentWeight}
                        onChange={(e) => handleWeightChange(comp.id as keyof ScoreWeights, parseFloat(e.target.value))}
                        className="w-32 sm:w-48 accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <span className="font-mono text-xs text-white font-bold w-10 text-right">
                        {Math.round(currentWeight * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ethical Non-Prediction & Model Governance Note */}
        <div className="mt-6 rounded-xl border border-white/[0.06] bg-[#0c101c] p-4 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Analytical Model Integrity & Anti-Prediction Policy</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            The Observatory Composite is an analytical framework that measures observable on-chain characteristics relative to historical distributions. It never generates trading instructions (buy, sell, long, short) or guarantees future price targets.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
