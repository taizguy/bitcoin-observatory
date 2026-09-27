import React, { useState, useMemo } from 'react';
import { HealthScoreBreakdown, HealthComponent } from '../../types';
import { HelpCircle, Sliders, RotateCcw, Check, Radio } from 'lucide-react';

interface ObservatoryRadialCompositeProps {
  scoreData: HealthScoreBreakdown;
  onOpenMethodology: () => void;
  onSelectComponentMetric?: (metricId: string) => void;
}

export const ObservatoryRadialComposite: React.FC<ObservatoryRadialCompositeProps> = ({
  scoreData,
  onOpenMethodology,
  onSelectComponentMetric,
}) => {
  // Configurable weights state initialized from props
  const [weights, setWeights] = useState<{ [id: string]: number }>(() => {
    const saved = localStorage.getItem('btc_obs_custom_weights');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    const initial: { [id: string]: number } = {};
    scoreData.components.forEach((c) => {
      initial[c.id] = c.weight;
    });
    return initial;
  });

  const [showWeightSliders, setShowWeightSliders] = useState(false);
  const [activeComponentId, setActiveComponentId] = useState<string | null>(null);

  // Default weights for reset
  const defaultWeights = useMemo(() => {
    return {
      valuation: 0.25,
      retention: 0.25,
      realized_capital: 0.2,
      security: 0.15,
      profit_velocity: 0.15,
    };
  }, []);

  // Recalculate composite score dynamically based on active weights
  const { calculatedScore, calculatedComponents, totalWeight } = useMemo(() => {
    let rawWeightedSum = 0;
    let sumWeights = 0;

    const comps = scoreData.components.map((c) => {
      const w = weights[c.id] !== undefined ? weights[c.id] : c.weight;
      sumWeights += w;
      const score = c.score;
      const weightedContribution = Math.round(score * w);
      rawWeightedSum += score * w;
      return {
        ...c,
        activeWeight: w,
        weightedContribution,
      };
    });

    const normScore = sumWeights > 0 ? Math.round(rawWeightedSum / sumWeights) : scoreData.overall;

    return {
      calculatedScore: normScore,
      calculatedComponents: comps,
      totalWeight: sumWeights,
    };
  }, [scoreData, weights]);

  const handleWeightChange = (id: string, newWeight: number) => {
    const updated = { ...weights, [id]: newWeight };
    setWeights(updated);
    localStorage.setItem('btc_obs_custom_weights', JSON.stringify(updated));
  };

  const handleResetWeights = () => {
    setWeights(defaultWeights);
    localStorage.removeItem('btc_obs_custom_weights');
  };

  // Radial visualization mathematics
  const size = 320;
  const center = size / 2;
  const baseOrbitRadius = 110;

  // Component colors and celestial styling
  const componentVisuals: { [id: string]: { label: string; hex: string; desc: string } } = {
    valuation: { label: 'Price Multiple', hex: '#f59e0b', desc: 'MVRV multiple relative to historical floors' },
    retention: { label: 'Holder Conviction', hex: '#10b981', desc: 'Illiquid supply stored for >155 days' },
    realized_capital: { label: 'Realized Capital', hex: '#38bdf8', desc: 'Aggregate acquisition cost locked in coins' },
    security: { label: 'Thermodynamics', hex: '#818cf8', desc: 'Cryptographic SHA-256 computational defense' },
    profit_velocity: { label: 'Profit Velocity', hex: '#f43f5e', desc: 'SOPR & network realized profit/loss ratio' },
  };

  const activeComp = calculatedComponents.find((c) => c.id === activeComponentId);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#03060c] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
      
      {/* Precision Reticle Corner Accents */}
      <div className="reticle-corner-tl" />
      <div className="reticle-corner-tr" />
      <div className="reticle-corner-bl" />
      <div className="reticle-corner-br" />

      {/* Header with Zero-Pill Precision */}
      <div className="flex items-start justify-between pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span className="tracking-widest uppercase">ASTROLABE COMPOSITE COMPUTER</span>
          </div>
          <h2 className="font-celestial text-2xl font-bold text-white tracking-wide">
            Observatory Composite
          </h2>
        </div>

        {/* Methodology & Weight Calibration Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWeightSliders(!showWeightSliders)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              showWeightSliders
                ? 'border-amber-400/50 bg-amber-500/15 text-amber-300'
                : 'border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:border-white/20'
            }`}
            title="Adjust component influence weights"
          >
            <Sliders className="h-3.5 w-3.5 text-amber-400" />
            <span>Calibrate Weights</span>
          </button>

          <button
            onClick={onOpenMethodology}
            className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white hover:border-white/20 transition-colors"
            title="How is this calculated?"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Astrolabe Visualization & Details Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Radial Orbital Astrolabe SVG */}
        <div className="md:col-span-6 flex flex-col items-center justify-center relative">
          <svg className="w-72 h-72 sm:w-80 sm:h-80" viewBox={`0 0 ${size} ${size}`}>
            {/* Outer Graduation Degree Tick Marks (Astrolabe Rim) */}
            <circle
              cx={center}
              cy={center}
              r={baseOrbitRadius + 32}
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.5"
              strokeOpacity="0.08"
            />
            {Array.from({ length: 36 }).map((_, i) => {
              const angle = (i * 10 * Math.PI) / 180;
              const isMajor = i % 3 === 0;
              const r1 = baseOrbitRadius + 28;
              const r2 = baseOrbitRadius + (isMajor ? 36 : 32);
              const x1 = center + Math.cos(angle) * r1;
              const y1 = center + Math.sin(angle) * r1;
              const x2 = center + Math.cos(angle) * r2;
              const y2 = center + Math.sin(angle) * r2;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isMajor ? '#f59e0b' : '#64748b'}
                  strokeWidth={isMajor ? 1 : 0.5}
                  strokeOpacity={isMajor ? 0.4 : 0.2}
                />
              );
            })}

            {/* Base Orbit Path */}
            <circle
              cx={center}
              cy={center}
              r={baseOrbitRadius}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1"
              strokeDasharray="3 6"
              strokeOpacity="0.12"
            />

            {/* Central Solar Core Radiant Circle */}
            <circle
              cx={center}
              cy={center}
              r={46}
              fill="url(#solarCoreGradient)"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeOpacity="0.5"
            />

            <defs>
              <radialGradient id="solarCoreGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                <stop offset="70%" stopColor="#d97706" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#030509" stopOpacity="0.9" />
              </radialGradient>
            </defs>

            {/* Radiating Spokes Connecting Planetoids to Center */}
            {calculatedComponents.map((comp, index) => {
              const angle = (index * 72 - 90) * (Math.PI / 180);
              const nodeX = center + Math.cos(angle) * baseOrbitRadius;
              const nodeY = center + Math.sin(angle) * baseOrbitRadius;
              const isSelected = activeComponentId === comp.id;

              return (
                <g key={`spoke-${comp.id}`}>
                  <line
                    x1={center}
                    y1={center}
                    x2={nodeX}
                    y2={nodeY}
                    stroke={isSelected ? '#f59e0b' : '#ffffff'}
                    strokeWidth={isSelected ? 1.5 : 0.75}
                    strokeOpacity={isSelected ? 0.6 : 0.15}
                    strokeDasharray={isSelected ? undefined : '2 4'}
                  />
                </g>
              );
            })}

            {/* 5 Orbiting Celestial Component Bodies */}
            {calculatedComponents.map((comp, index) => {
              const angle = (index * 72 - 90) * (Math.PI / 180);
              const nodeX = center + Math.cos(angle) * baseOrbitRadius;
              const nodeY = center + Math.sin(angle) * baseOrbitRadius;
              const isSelected = activeComponentId === comp.id;
              const visual = componentVisuals[comp.id] || { hex: '#f59e0b' };

              // Dynamic influence radius based on weight (weight ranges 0.05 to 0.40)
              const influenceRadius = 14 + comp.activeWeight * 30;

              return (
                <g
                  key={comp.id}
                  className="cursor-pointer transition-transform duration-300"
                  onClick={() => setActiveComponentId(isSelected ? null : comp.id)}
                >
                  {/* Outer Gravitational Influence Halo */}
                  <circle
                    cx={nodeX}
                    cy={nodeY}
                    r={influenceRadius}
                    fill={visual.hex}
                    fillOpacity={isSelected ? 0.25 : 0.1}
                    stroke={visual.hex}
                    strokeWidth="1"
                    strokeOpacity={isSelected ? 0.8 : 0.3}
                  />

                  {/* Core Planetoid Node */}
                  <circle
                    cx={nodeX}
                    cy={nodeY}
                    r={isSelected ? 12 : 9}
                    fill="#050811"
                    stroke={visual.hex}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                  />

                  {/* Planetoid Score Text */}
                  <text
                    x={nodeX}
                    y={nodeY + 3.5}
                    textAnchor="middle"
                    className="font-mono text-[9px] font-bold fill-white pointer-events-none"
                  >
                    {comp.score}
                  </text>
                </g>
              );
            })}

            {/* Center Solar Core Numerical Display */}
            <text
              x={center}
              y={center - 8}
              textAnchor="middle"
              className="font-mono text-3xl font-black fill-white tracking-tight"
            >
              {calculatedScore}
            </text>
            <text
              x={center}
              y={center + 12}
              textAnchor="middle"
              className="font-celestial text-[10px] font-bold fill-amber-400 uppercase tracking-wider"
            >
              EXPANSION
            </text>
            <text
              x={center}
              y={center + 24}
              textAnchor="middle"
              className="font-mono text-[9px] fill-slate-400"
            >
              SCALE 0–100
            </text>
          </svg>

          <span className="text-[11px] font-mono text-slate-500 mt-2">
            Radial radius reflects weight influence · Click sector to inspect
          </span>
        </div>

        {/* Right Column: Mathematical Components Breakdown */}
        <div className="md:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-1 border-b border-white/[0.04]">
            <span>SECTOR PILLARS</span>
            <span>WEIGHT · SCORE</span>
          </div>

          <div className="space-y-2">
            {calculatedComponents.map((comp) => {
              const visual = componentVisuals[comp.id] || { hex: '#f59e0b', label: comp.label, desc: '' };
              const isSelected = activeComponentId === comp.id;
              const weightPct = Math.round((comp.activeWeight / totalWeight) * 100);

              return (
                <div
                  key={comp.id}
                  onClick={() => setActiveComponentId(isSelected ? null : comp.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400/50 bg-[#0a101f] shadow-lg'
                      : 'border-white/[0.05] bg-white/[0.02] hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: visual.hex }} />
                      <span className="font-semibold text-white">{visual.label}</span>
                    </div>

                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-400 text-[11px]">{weightPct}% wt</span>
                      <span className="font-bold text-white text-sm">{comp.score}</span>
                    </div>
                  </div>

                  {/* Weight Slider if in Calibration Mode */}
                  {showWeightSliders && (
                    <div className="mt-3 pt-2 border-t border-white/[0.06] space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Calibration Slider:</span>
                        <span>{Math.round(comp.activeWeight * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0.05}
                        max={0.5}
                        step={0.05}
                        value={comp.activeWeight}
                        onChange={(e) => handleWeightChange(comp.id, parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                      />
                    </div>
                  )}

                  {/* Detailed Description when selected */}
                  {isSelected && (
                    <div className="mt-2 text-xs text-slate-300 font-sans leading-relaxed pt-2 border-t border-white/[0.06]">
                      {visual.desc}
                      <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>Contribution: {comp.weightedContribution} pts</span>
                        {onSelectComponentMetric && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectComponentMetric(comp.metricId);
                            }}
                            className="text-amber-400 hover:text-amber-300 font-semibold"
                          >
                            Inspect Metric →
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Reset Custom Weights Action */}
          {showWeightSliders && (
            <button
              onClick={handleResetWeights}
              className="w-full py-2 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-mono text-slate-400 hover:text-white hover:border-white/20 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="h-3 w-3 text-amber-400" />
              <span>Reset to Default Calibration</span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
};
