import React, { useState } from 'react';
import { MetricDefinition, UserMode } from '../../types';
import { X, ArrowRight, Radio } from 'lucide-react';

interface MetricDetailModalProps {
  metric: MetricDefinition | null;
  onClose: () => void;
  onSelectRelatedMetric: (metricId: string) => void;
  userMode?: UserMode;
}

export const MetricDetailModal: React.FC<MetricDetailModalProps> = ({
  metric,
  onClose,
  onSelectRelatedMetric,
  userMode = 'beginner'
}) => {
  const [timeframe, setTimeframe] = useState<string>('ALL');
  const [scale, setScale] = useState<'linear' | 'log'>('linear');
  const [showHalvings, setShowHalvings] = useState<boolean>(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!metric) return null;

  // Guiding questions map
  const guidingQuestions: { [id: string]: string } = {
    mvrv: "How elevated is Bitcoin's market value relative to aggregate holder cost basis?",
    lth_supply: "Are long-term conviction holders accumulating or distributing coins?",
    hashrate: "How much computing power secures the Bitcoin blockchain consensus?",
    sopr: "Are sellers cashing in profits or capitulating at losses?",
    nupl: "What percentage of Bitcoin's circulating supply sits on unrealized profit?",
    realized_price: "What is the average aggregate purchase price of all circulating coins?",
    realized_cap: "How many actual fiat dollars are stored inside the Bitcoin network?",
    exchange_net_flows: "Is Bitcoin draining into cold vaults or flowing onto exchange orderbooks?",
    active_addresses: "How many unique participants are transacting on the network daily?",
    miner_reserve: "Are miners holding their minted coins or selling to cover hardware costs?",
  };

  const chartQuestion = guidingQuestions[metric.id] || `How has ${metric.name} behaved historically across market cycles?`;

  // Chart rendering math
  const data = metric.history;
  const values = data.map(d => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);

  // SVG chart dimensions
  const svgWidth = 720;
  const svgHeight = 240;
  const paddingX = 40;
  const paddingY = 30;
  const plotWidth = svgWidth - paddingX * 2;
  const plotHeight = svgHeight - paddingY * 2;

  const getY = (val: number) => {
    if (scale === 'log') {
      const logMin = Math.log10(Math.max(0.01, minVal));
      const logMax = Math.log10(Math.max(0.02, maxVal));
      const logVal = Math.log10(Math.max(0.01, val));
      const normalized = (logVal - logMin) / (logMax - logMin || 1);
      return svgHeight - paddingY - normalized * plotHeight;
    }
    const normalized = (val - minVal) / (maxVal - minVal || 1);
    return svgHeight - paddingY - normalized * plotHeight;
  };

  const getX = (idx: number) => {
    return paddingX + (idx / (data.length - 1 || 1)) * plotWidth;
  };

  const pointsString = data
    .map((d, i) => `${getX(i)},${getY(d.value)}`)
    .join(' ');

  const currentHovered = hoveredIndex !== null ? data[hoveredIndex] : data[data.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 transition-all overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#03060c] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
        
        <div className="reticle-corner-tl" />
        <div className="reticle-corner-tr" />
        <div className="reticle-corner-bl" />
        <div className="reticle-corner-br" />

        {/* Top Header */}
        <div className="flex items-start justify-between pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
              <span className="text-amber-400 font-bold">{metric.symbol}</span>
              <span>·</span>
              <span className="capitalize">{metric.category.replace('_', ' ')}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Radio className="h-2.5 w-2.5 animate-pulse" />
                <span className="uppercase text-[10px]">{metric.dataState}</span>
              </span>
            </div>
            <h2 className="font-celestial text-2xl sm:text-3xl font-bold text-white tracking-wide">
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

        {/* 1. What is it? & 2. Why should I care? */}
        <div className="mt-6 rounded-xl border border-amber-500/20 bg-[#080d19] p-5 space-y-3">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 font-mono">
              1. What is it?
            </span>
            <p className="mt-1 text-base sm:text-lg font-medium text-slate-100 leading-snug font-sans">
              "{metric.simpleHeadline}"
            </p>
          </div>

          <div className="pt-2 border-t border-white/[0.06]">
            <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 font-mono">
              2. Why should I care?
            </span>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {metric.whyCare}
            </p>
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center gap-4 text-xs font-mono">
            <span className="text-slate-400">3. Current Reading:</span>
            <span className="text-xl font-bold text-white tabular-nums">
              {metric.unit === 'USD' ? `$${metric.currentValue.toLocaleString()}` : `${metric.currentValue} ${metric.unit}`}
            </span>
            <span className={metric.change24h >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
              {metric.change24h >= 0 ? '+' : ''}{metric.change24h}% (24h)
            </span>
            <span className="text-slate-400">
              Previous: <strong className="text-slate-200">{metric.previousValue}</strong>
            </span>
          </div>
        </div>

        {/* 4. How unusual is it? (Historical Percentile) */}
        <div className="mt-6 rounded-xl border border-white/[0.08] bg-black/40 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-mono">
              4. How unusual is it? (Historical Distribution)
            </span>
            <span className="font-mono text-xs text-amber-300 font-bold">
              {metric.historicalPercentile}th Percentile
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>Historical Floor: {metric.historicalRange[0]}</span>
              <span>Median Range</span>
              <span>Historical Extreme: {metric.historicalRange[1]}</span>
            </div>
            
            <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-emerald-500/40 w-[25%]" title="Discount Zone" />
              <div className="h-full bg-amber-500/40 w-[50%]" title="Healthy Expansion" />
              <div className="h-full bg-rose-500/40 w-[25%]" title="Euphoria Extreme" />
            </div>

            <div className="relative w-full h-5">
              <div
                className="absolute top-0 flex flex-col items-center -translate-x-1/2"
                style={{ left: `${metric.historicalPercentile}%` }}
              >
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-amber-400" />
                <span className="text-[10px] font-mono text-amber-300 font-bold">
                  Current ({metric.currentValue})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. GUIDING QUESTION & HISTORICAL CHART */}
        <div className="mt-6 rounded-xl border border-white/[0.08] bg-black/40 p-4 sm:p-6 space-y-4">
          
          <div className="pb-3 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                GUIDING QUESTION
              </span>
              <h3 className="font-celestial text-base sm:text-lg font-bold text-white mt-0.5">
                {chartQuestion}
              </h3>
            </div>
            <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/[0.06] self-start sm:self-auto font-mono text-xs">
              {['1M', '3M', '6M', '1Y', '4Y', 'Cycle', 'ALL'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    timeframe === tf
                      ? 'bg-amber-500/20 text-amber-300 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive SVG Chart */}
          <div className="relative w-full overflow-hidden">
            <svg
              className="w-full h-56 select-none"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#ffffff" strokeOpacity="0.05" strokeDasharray="3 3" />
              <line x1={paddingX} y1={svgHeight / 2} x2={svgWidth - paddingX} y2={svgHeight / 2} stroke="#ffffff" strokeOpacity="0.05" strokeDasharray="3 3" />
              <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#ffffff" strokeOpacity="0.1" />

              {/* Area Fill */}
              <polygon
                points={`${paddingX},${svgHeight - paddingY} ${pointsString} ${svgWidth - paddingX},${svgHeight - paddingY}`}
                fill="url(#chartGradient)"
              />

              {/* Line Curve */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsString}
              />

              {/* Interactive Hover Probe */}
              {hoveredIndex !== null && (
                <g>
                  <line
                    x1={getX(hoveredIndex)}
                    y1={paddingY}
                    x2={getX(hoveredIndex)}
                    y2={svgHeight - paddingY}
                    stroke="#ffffff"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    strokeOpacity="0.6"
                  />
                  <circle
                    cx={getX(hoveredIndex)}
                    cy={getY(data[hoveredIndex].value)}
                    r="4.5"
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </g>
              )}

              {/* Invisible Voronoi Mouse Hover Strips */}
              {data.map((_, i) => (
                <rect
                  key={i}
                  x={getX(i) - (plotWidth / data.length) / 2}
                  y={paddingY}
                  width={plotWidth / data.length}
                  height={plotHeight}
                  fill="transparent"
                  className="cursor-crosshair"
                  onMouseEnter={() => setHoveredIndex(i)}
                />
              ))}
            </svg>

            {/* Hover Tooltip Readout */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mt-2">
              <div>
                <span>Point: </span>
                <span className="text-white font-bold">{currentHovered.date}</span>
              </div>
              <div>
                <span>Telemetry: </span>
                <span className="text-amber-400 font-bold">
                  {currentHovered.value} {metric.unit}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Technical Details & Formula */}
        <div className="mt-6 rounded-xl border border-white/[0.08] bg-black/40 p-4 sm:p-5 space-y-3 font-mono text-xs">
          <div className="text-slate-400 uppercase tracking-wider text-[10px]">
            Technical Specification & Formula
          </div>
          <code className="block p-3 rounded bg-black/60 text-amber-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {metric.formula}
          </code>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            {metric.technicalDefinition}
          </p>
        </div>

      </div>
    </div>
  );
};
