import React, { useState, useEffect } from 'react';
import { MetricDefinition, UserMode } from '../../types';
import { X, Radio, Check, Copy, TrendingUp, Sparkles, Activity } from 'lucide-react';

interface MetricDetailModalProps {
  metric: MetricDefinition | null;
  onClose: () => void;
  onSelectRelatedMetric: (metricId: string) => void;
  userMode?: UserMode;
}

export const MetricDetailModal: React.FC<MetricDetailModalProps> = ({
  metric,
  onClose,
  onSelectRelatedMetric
}) => {
  const [timeframe, setTimeframe] = useState<string>('ALL');
  const [scale, setScale] = useState<'linear' | 'log'>('linear');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Lock body scroll when modal is open to eliminate weird background scrolling
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

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
  const svgWidth = 740;
  const svgHeight = 230;
  const paddingX = 35;
  const paddingY = 25;
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

  const handleCopySummary = () => {
    const text = `${metric.name} (${metric.symbol}): Current reading is ${metric.currentValue} ${metric.unit}. ${metric.simpleHeadline}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-black/85 backdrop-blur-2xl transition-opacity animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-metric-title"
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col liquid-glass-panel border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Header - Always pinned at top */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/10 shrink-0 bg-black/40 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-white/60 mb-1">
              <span className="text-white font-bold">{metric.symbol}</span>
              <span className="text-white/30">·</span>
              <span className="capitalize">{metric.category.replace('_', ' ')}</span>
              <span className="text-white/30">·</span>
              <span className="flex items-center gap-1.5 text-white/80">
                <Radio className="h-2.5 w-2.5 animate-pulse text-white" />
                <span className="uppercase text-[10px]">{metric.dataState}</span>
              </span>
            </div>
            <h2 id="modal-metric-title" className="font-serif-instrument text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              {metric.name}
            </h2>
          </div>

          {/* Top Close Button */}
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
          
          {/* 1. What is it? & 2. Why should I care? */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/10 space-y-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-white/60 font-mono">
                1. What is it?
              </span>
              <p className="mt-1.5 text-base sm:text-lg font-medium text-white leading-relaxed font-sans">
                "{metric.simpleHeadline}"
              </p>
            </div>

            <div className="pt-3 border-t border-white/10">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-white/60 font-mono">
                2. Why should I care?
              </span>
              <p className="mt-1.5 text-xs sm:text-sm text-white/75 leading-relaxed font-sans">
                {metric.whyCare}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-mono">
              <span className="text-white/50">Current Reading:</span>
              <span className="text-xl font-bold text-white tabular-nums">
                {metric.unit === 'USD' ? `$${metric.currentValue.toLocaleString()}` : `${metric.currentValue} ${metric.unit}`}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white font-medium">
                {metric.change24h >= 0 ? '+' : ''}{metric.change24h}% (24h)
              </span>
              <span className="text-white/50">
                Previous: <strong className="text-white font-medium">{metric.previousValue}</strong>
              </span>
            </div>
          </div>

          {/* 3. Historical Percentile Distribution */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-white/60 font-semibold font-mono">
                Historical Percentile Distribution
              </span>
              <span className="font-mono text-xs text-white font-bold px-3 py-1 rounded-full bg-white/10 border border-white/15">
                {metric.historicalPercentile}th Percentile
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-mono text-white/50">
                <span>Floor: {metric.historicalRange[0]}</span>
                <span>Median Corridor</span>
                <span>Extreme: {metric.historicalRange[1]}</span>
              </div>
              
              <div className="relative h-2.5 w-full bg-white/10 rounded-full overflow-hidden flex">
                <div className="h-full bg-white/30 w-[25%]" title="Discount Zone" />
                <div className="h-full bg-white/60 w-[50%]" title="Expansion Corridor" />
                <div className="h-full bg-white/90 w-[25%]" title="Euphoria Peak" />
              </div>

              <div className="relative w-full h-5">
                <div
                  className="absolute top-0 flex flex-col items-center -translate-x-1/2 transition-all"
                  style={{ left: `${Math.min(Math.max(metric.historicalPercentile, 5), 95)}%` }}
                >
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-white" />
                  <span className="text-[10px] font-mono text-white font-semibold whitespace-nowrap mt-0.5">
                    Current ({metric.currentValue})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Guiding Question & Historical Chart */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="pb-3 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 font-bold">
                  GUIDING QUESTION
                </span>
                <h3 className="font-serif-instrument text-lg sm:text-xl font-bold text-white mt-0.5">
                  {chartQuestion}
                </h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto font-mono text-xs">
                {['1M', '3M', '6M', '1Y', '4Y', 'Cycle', 'ALL'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${
                      timeframe === tf
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tf}
                  </button>
                ))}

                <button
                  onClick={() => setScale(scale === 'linear' ? 'log' : 'linear')}
                  className="ml-2 px-3 py-1 rounded-full text-[11px] border border-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
                  title="Toggle linear/logarithmic scale"
                >
                  {scale.toUpperCase()}
                </button>
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
                  <linearGradient id="observeChartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#ffffff" strokeOpacity="0.08" strokeDasharray="3 3" />
                <line x1={paddingX} y1={svgHeight / 2} x2={svgWidth - paddingX} y2={svgHeight / 2} stroke="#ffffff" strokeOpacity="0.08" strokeDasharray="3 3" />
                <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#ffffff" strokeOpacity="0.15" />

                {/* Area Fill */}
                <polygon
                  points={`${paddingX},${svgHeight - paddingY} ${pointsString} ${svgWidth - paddingX},${svgHeight - paddingY}`}
                  fill="url(#observeChartGradient)"
                />

                {/* Line Curve */}
                <polyline
                  fill="none"
                  stroke="#ffffff"
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
                      fill="#ffffff"
                      stroke="#000000"
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
              <div className="flex items-center justify-between text-xs font-mono text-white/60 mt-2 px-1">
                <div>
                  <span>Point: </span>
                  <span className="text-white font-bold">{currentHovered.date}</span>
                </div>
                <div>
                  <span>Value: </span>
                  <span className="text-white font-bold">
                    {currentHovered.value} {metric.unit}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Technical Details & Formula */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/10 space-y-3 font-mono text-xs">
            <div className="text-white/50 uppercase tracking-wider text-[10px]">
              Technical Specification & Formula
            </div>
            <code className="block p-4 rounded-xl bg-black/60 border border-white/10 text-white font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed text-xs">
              {metric.formula}
            </code>
            <p className="text-white/70 font-sans text-xs leading-relaxed">
              {metric.technicalDefinition}
            </p>
          </div>

        </div>

        {/* Sticky Footer - Always pinned at bottom with prominent Close Pill */}
        <div className="px-6 sm:px-8 py-4 border-t border-white/10 shrink-0 bg-black/60 backdrop-blur-md z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full liquid-glass border border-white/15 text-xs font-mono text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5 text-white/60" />}
              <span>{copied ? 'Copied' : 'Copy Summary'}</span>
            </button>
            <span className="text-xs font-mono text-white/40">
              Source: {metric.source}
            </span>
          </div>

          {/* Prominent Bottom Close Pill (Observe Signature White Pill) */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-2.5 rounded-full bg-white text-black font-sans font-medium text-sm hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
            >
              Close Telemetry
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
