import React, { useState, useMemo, useEffect } from 'react';
import { HealthScoreBreakdown, HealthComponent } from '../../types';
import { X, Sliders, RotateCcw, Check, Save, ShieldCheck } from 'lucide-react';

interface HealthScoreModalProps {
  scoreData: HealthScoreBreakdown;
  onClose: () => void;
  onSelectMetric: (metricId: string) => void;
}

interface ScoreWeights {
  valuation: number;
  retention: number;
  realized_capital: number;
  security: number;
  profit_velocity: number;
}

export const HealthScoreModal: React.FC<HealthScoreModalProps> = ({
  scoreData,
  onClose,
  onSelectMetric,
}) => {
  // Load weights from local storage or defaults
  const [weights, setWeights] = useState<ScoreWeights>(() => {
    const saved = localStorage.getItem('btc_obs_custom_weights');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      valuation: 0.25,
      retention: 0.25,
      realized_capital: 0.2,
      security: 0.15,
      profit_velocity: 0.15,
    };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Close on Escape key & Lock background scroll
  useEffect(() => {
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
  }, [onClose]);

  const handleWeightChange = (key: keyof ScoreWeights, val: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleReset = () => {
    const defaults: ScoreWeights = {
      valuation: 0.25,
      retention: 0.25,
      realized_capital: 0.2,
      security: 0.15,
      profit_velocity: 0.15,
    };
    setWeights(defaults);
    localStorage.removeItem('btc_obs_custom_weights');
  };

  const handleSaveLocally = () => {
    localStorage.setItem('btc_obs_custom_weights', JSON.stringify(weights));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Recalculate dynamic overall score
  const dynamicModel = useMemo(() => {
    let rawWeightedSum = 0;
    let sumWeights = 0;

    const comps = scoreData.components.map((c) => {
      const weight = weights[c.id as keyof ScoreWeights] !== undefined ? weights[c.id as keyof ScoreWeights] : c.weight;
      sumWeights += weight;
      const score = c.score;
      const weightedScore = Math.round(score * weight);
      rawWeightedSum += score * weight;
      return {
        ...c,
        activeWeight: weight,
        weightedScore,
      };
    });

    const normalizedTotal = sumWeights > 0 ? Math.round(rawWeightedSum / sumWeights) : Math.round(rawWeightedSum);
    const overall = Math.min(100, Math.max(0, normalizedTotal));

    let statusLabel = 'Neutral Structure';
    if (overall >= 75) statusLabel = 'Robust Expansion';
    else if (overall >= 60) statusLabel = 'Healthy Accumulation';
    else if (overall <= 35) statusLabel = 'Structural Stress';

    return {
      overall,
      statusLabel,
      components: comps,
      summary: scoreData.summary,
      calculationFormula: scoreData.calculationFormula,
    };
  }, [scoreData, weights]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-black/85 backdrop-blur-2xl transition-opacity animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col liquid-glass-panel border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Header - Pinned at top */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/10 shrink-0 bg-black/40 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-white/60 mb-1">
              <span>Analytical Framework</span>
              <span className="text-white/30">·</span>
              <span>Open Model Methodology</span>
            </div>
            <h2 className="font-serif-instrument text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              Observatory Composite Model
            </h2>
          </div>

          <button
            onClick={onClose}
            className="liquid-glass-circle w-11 h-11 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer focus:outline-none shrink-0"
            title="Close inspector (Esc)"
            aria-label="Close inspector"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6 overscroll-contain">
          
          {/* Current Composite Score Readout */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-white">
                  <span className="font-serif-instrument text-3xl font-bold">{dynamicModel.overall}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif-instrument text-xl text-white">
                      {dynamicModel.statusLabel}
                    </span>
                    <span className="text-[10px] font-mono px-3 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/15">
                      Calculated Model
                    </span>
                  </div>
                  <span className="text-xs text-white/60 font-sans">
                    Scale: 0 (Capitulation Risk) to 100 (Max Structural Expansion)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveLocally}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{savedSuccess ? 'Saved Locally!' : 'Save Weights'}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/70 text-xs hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Reset to default distribution"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-white/75 leading-relaxed pt-3 border-t border-white/10 font-sans">
              {dynamicModel.summary}
            </p>

            {/* Exact Mathematical Formula Breakdown */}
            <div className="rounded-xl bg-black/60 p-4 border border-white/10 text-[11px] font-mono text-white/80 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-white/50 block">
                Programmatic Reproduction Formula:
              </span>
              <div className="text-white break-all">
                {dynamicModel.calculationFormula}
              </div>
            </div>
          </div>

          {/* Breakdown of 5 Components with Contributions and Weights */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-wider text-white/60 font-semibold font-mono">
                Component Weights & Mathematical Contributions
              </h3>
              <span className="text-[11px] font-mono text-white/50">
                Total Weight: {Math.round(Object.values(weights).reduce((a, b) => a + b, 0) * 100)}%
              </span>
            </div>

            <div className="space-y-3">
              {dynamicModel.components.map((comp) => {
                const currentWeight = weights[comp.id as keyof ScoreWeights] || 0.2;
                return (
                  <div
                    key={comp.id}
                    className="rounded-2xl border border-white/10 liquid-glass p-5 transition-all hover:border-white/25"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-serif-instrument text-base font-bold text-white">{comp.label}</span>
                        <span className="text-xs text-white/50 font-mono">({comp.sourceMetricName})</span>
                        <button
                          onClick={() => {
                            onClose();
                            onSelectMetric(comp.metricId);
                          }}
                          className="text-[11px] font-mono text-white/80 hover:text-white underline decoration-white/30 ml-1 cursor-pointer"
                        >
                          Inspect →
                        </button>
                      </div>

                      {/* Exact Contribution Display */}
                      <div className="flex items-center gap-3 font-mono text-xs">
                        <span className="text-white/50">
                          {comp.score} pts × {Math.round(currentWeight * 100)}% =
                        </span>
                        <span className="font-bold text-white text-sm">
                          +{comp.weightedScore} pts
                        </span>
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-white/70 leading-relaxed font-sans">
                      {comp.explanation}
                    </p>

                    {/* Weight Slider */}
                    <div className="mt-3 flex items-center justify-between gap-4 pt-3 border-t border-white/10">
                      <span className="text-[10px] text-white/50 font-mono uppercase">Weight Allocation:</span>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0.05"
                          max="0.45"
                          step="0.05"
                          value={currentWeight}
                          onChange={(e) => handleWeightChange(comp.id as keyof ScoreWeights, parseFloat(e.target.value))}
                          className="w-32 sm:w-48 accent-white h-1.5 bg-white/20 rounded-lg cursor-pointer"
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
          <div className="rounded-2xl border border-white/10 liquid-glass p-5 text-xs text-white/70 space-y-2">
            <div className="flex items-center gap-2 text-white font-medium">
              <ShieldCheck className="h-4 w-4 text-white" />
              <span>Analytical Model Integrity & Policy</span>
            </div>
            <p className="leading-relaxed text-[11px] text-white/60 font-sans">
              The Observatory Composite is an analytical framework measuring observable on-chain characteristics relative to historical distributions. It never generates trading instructions or speculative guarantees.
            </p>
          </div>

        </div>

        {/* Sticky Footer Close Action */}
        <div className="px-6 sm:px-8 py-4 border-t border-white/10 shrink-0 bg-black/60 backdrop-blur-md z-10 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-full bg-white text-black font-sans font-medium text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
