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

  const defaultWeights = useMemo(() => {
    return {
      valuation: 0.25,
      retention: 0.25,
      realized_capital: 0.2,
      security: 0.15,
      profit_velocity: 0.15,
    };
  }, []);

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
  const size = 300;
  const center = size / 2;
  const baseOrbitRadius = 100;

  // Modern designprompts palette (Cyan, Indigo, Violet, Platinum, Coral)
  const componentVisuals: { [id: string]: { label: string; hex: string; desc: string } } = {
    valuation: { label: 'Valuation Multiple', hex: '#38bdf8', desc: 'MVRV multiple relative to historical acquisition baselines' },
    retention: { label: 'Holder Retention', hex: '#818cf8', desc: 'Illiquid supply stored for >155 days' },
    realized_capital: { label: 'Realized Capital', hex: '#6366f1', desc: 'Aggregate fiat capital permanently settled on-chain' },
    security: { label: 'Thermodynamics', hex: '#e4e4e7', desc: 'Cryptographic SHA-256 computational defense capacity' },
    profit_velocity: { label: 'Profit Velocity', hex: '#f43f5e', desc: 'SOPR & network realized profit/loss ratio' },
  };

  return (
    <div className="liquid-glass-panel rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-white/70 mb-1">
            <Radio className="h-3 w-3 animate-pulse text-white" />
            <span className="tracking-wider uppercase">COMPOSITE COMPUTER</span>
          </div>
          <h2 className="font-serif-instrument text-2xl font-bold text-white tracking-tight">
            Observatory Composite
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWeightSliders(!showWeightSliders)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-all cursor-pointer ${
              showWeightSliders
                ? 'border-white bg-white text-black font-semibold'
                : 'border-white/15 bg-white/5 text-white/80 hover:text-white hover:bg-white/10'
            }`}
            title="Adjust component weights"
          >
            <Sliders className="h-3 w-3" />
            <span>Weights</span>
          </button>

          <button
            onClick={onOpenMethodology}
            className="p-2 rounded-full border border-white/15 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="How is this calculated?"
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Astrolabe Radial + Components Layout */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Radial Orbital SVG */}
        <div className="flex flex-col items-center justify-center relative shrink-0">
          <svg className="w-56 h-56 sm:w-64 sm:h-64" viewBox={`0 0 ${size} ${size}`}>
            {/* Outer Graduation Ring */}
            <circle
              cx={center}
              cy={center}
              r={baseOrbitRadius + 28}
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.5"
              strokeOpacity="0.08"
            />
            {Array.from({ length: 36 }).map((_, i) => {
              const angle = (i * 10 * Math.PI) / 180;
              const isMajor = i % 3 === 0;
              const r1 = baseOrbitRadius + 24;
              const r2 = baseOrbitRadius + (isMajor ? 32 : 28);
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
                  stroke={isMajor ? '#ffffff' : '#71717a'}
                  strokeWidth={isMajor ? 1 : 0.5}
                  strokeOpacity={isMajor ? 0.6 : 0.25}
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
              strokeOpacity="0.15"
            />

            {/* Central Score Circle */}
            <circle
              cx={center}
              cy={center}
              r={42}
              fill="url(#coreGradient)"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />

            <defs>
              <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                <stop offset="70%" stopColor="#27272a" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.95" />
              </radialGradient>
            </defs>

            {/* Radial Spokes */}
            {calculatedComponents.map((comp, index) => {
              const angle = (index * 72 - 90) * (Math.PI / 180);
              const nodeX = center + Math.cos(angle) * baseOrbitRadius;
              const nodeY = center + Math.sin(angle) * baseOrbitRadius;
              const isSelected = activeComponentId === comp.id;

              return (
                <line
                  key={`spoke-${comp.id}`}
                  x1={center}
                  y1={center}
                  x2={nodeX}
                  y2={nodeY}
                  stroke={isSelected ? '#38bdf8' : '#ffffff'}
                  strokeWidth={isSelected ? 1.5 : 0.75}
                  strokeOpacity={isSelected ? 0.6 : 0.12}
                  strokeDasharray={isSelected ? undefined : '2 4'}
                />
              );
            })}

            {/* Orbiting Planetoids */}
            {calculatedComponents.map((comp, index) => {
              const angle = (index * 72 - 90) * (Math.PI / 180);
              const nodeX = center + Math.cos(angle) * baseOrbitRadius;
              const nodeY = center + Math.sin(angle) * baseOrbitRadius;
              const isSelected = activeComponentId === comp.id;
              const visual = componentVisuals[comp.id] || { hex: '#38bdf8' };
              const influenceRadius = 12 + comp.activeWeight * 26;

              return (
                <g
                  key={comp.id}
                  className="cursor-pointer transition-transform duration-300"
                  onClick={() => setActiveComponentId(isSelected ? null : comp.id)}
                >
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

                  <circle
                    cx={nodeX}
                    cy={nodeY}
                    r={isSelected ? 11 : 8.5}
                    fill="#121319"
                    stroke={visual.hex}
                    strokeWidth={isSelected ? 2 : 1.5}
                  />

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

            {/* Center Score Readout */}
            <text
              x={center}
              y={center - 6}
              textAnchor="middle"
              className="font-mono text-2xl font-black fill-white tracking-tight"
            >
              {calculatedScore}
            </text>
            <text
              x={center}
              y={center + 12}
              textAnchor="middle"
              className="font-mono text-[9px] font-bold fill-white uppercase tracking-widest"
            >
              EXPANSION
            </text>
            <text
              x={center}
              y={center + 23}
              textAnchor="middle"
              className="font-mono text-[8px] fill-white/50"
            >
              / 100
            </text>
          </svg>
        </div>

        {/* Pillars List */}
        <div className="flex-1 w-full space-y-2">
          {calculatedComponents.map((comp) => {
            const visual = componentVisuals[comp.id] || { hex: '#ffffff', label: comp.label, desc: '' };
            const isSelected = activeComponentId === comp.id;
            const weightPct = Math.round((comp.activeWeight / totalWeight) * 100);

            return (
              <div
                key={comp.id}
                onClick={() => setActiveComponentId(isSelected ? null : comp.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-white bg-white/15 shadow-md'
                    : 'border-white/10 liquid-glass hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-white" />
                    <span className="font-medium text-white">{visual.label}</span>
                  </div>

                  <div className="flex items-center gap-2.5 font-mono text-xs">
                    <span className="text-white/50 text-[11px]">{weightPct}%</span>
                    <span className="font-bold text-white">{comp.score}</span>
                  </div>
                </div>

                {showWeightSliders && (
                  <div className="mt-2 pt-1.5 border-t border-white/10 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-white/60">
                      <span>Weight:</span>
                      <span>{Math.round(comp.activeWeight * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.05}
                      max={0.5}
                      step={0.05}
                      value={comp.activeWeight}
                      onChange={(e) => handleWeightChange(comp.id, parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {showWeightSliders && (
        <button
          onClick={handleResetWeights}
          className="mt-4 w-full py-2 rounded-full border border-white/10 liquid-glass text-xs font-mono text-white/70 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3 w-3 text-white" />
          <span>Reset Weights</span>
        </button>
      )}

    </div>
  );
};
