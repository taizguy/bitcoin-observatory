import React, { useState, useMemo } from 'react';
import { MetricDefinition } from '../../types';
import { MetricDetailModal } from './MetricDetailModal';
import { Search, ArrowUpRight, Layers, Radio, ExternalLink, Activity, Filter } from 'lucide-react';

interface ExplorerViewProps {
  metrics: MetricDefinition[];
  onSelectMetricDetail: (metricId: string) => void;
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({
  metrics,
  onSelectMetricDetail
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [activeModalMetric, setActiveModalMetric] = useState<MetricDefinition | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Sectors' },
    { id: 'valuation', label: 'Valuation' },
    { id: 'holders', label: 'Holders & Supply' },
    { id: 'profit_loss', label: 'Profit & Loss' },
    { id: 'network', label: 'Network & Security' },
    { id: 'money_flows', label: 'Capital & Flows' },
  ];

  const tiers: { id: string; label: string }[] = [
    { id: 'all', label: 'All Tiers' },
    { id: 'core', label: 'Core Stellar Signals' },
    { id: 'advanced', label: 'Advanced Telemetry' },
    { id: 'experimental', label: 'Experimental Models' },
    { id: 'historical', label: 'Historical Benchmarks' },
  ];

  const filteredMetrics = useMemo(() => {
    return metrics.filter((m) => {
      const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
      const matchesTier = selectedTier === 'all' || m.tier === selectedTier;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.symbol.toLowerCase().includes(q) ||
        m.simpleHeadline.toLowerCase().includes(q) ||
        m.simpleExplanation.toLowerCase().includes(q) ||
        (m.aliases && m.aliases.some(a => a.toLowerCase().includes(q)));
      return matchesCat && matchesTier && matchesSearch;
    });
  }, [metrics, selectedCategory, selectedTier, searchQuery]);

  return (
    <div className="w-full max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-8 min-h-screen">
      
      {/* 1. Header (Expansive Desktop Header) */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2 max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-mono text-white/70 uppercase tracking-wider">
            <Layers className="h-3.5 w-3.5 text-white" />
            <span>SPECTRAL TELEMETRY INDEX</span>
            <span className="text-white/30">·</span>
            <span className="text-white/60">COMPLETE METRIC CATALOG</span>
            <span className="text-white/30">·</span>
            <span className="text-white/80">{filteredMetrics.length} INDICATORS INDEXED</span>
          </div>

          <h1 
            className="font-serif-instrument text-4xl sm:text-5xl xl:text-6xl tracking-tight text-white"
            style={{ textShadow: '0 0 72px rgba(0, 0, 0, 0.7), 0 4px 28px rgba(0, 0, 0, 0.45)' }}
          >
            On-Chain Metric <em className="italic font-serif-instrument">Explorer</em>
          </h1>

          <p 
            className="text-sm sm:text-base text-white/70 font-sans leading-relaxed"
            style={{ textShadow: '0 0 30px rgba(0, 0, 0, 0.5), 0 1px 10px rgba(0, 0, 0, 0.35)' }}
          >
            Browse the comprehensive catalog of 30+ verified on-chain indicators. Every metric features calibrated historical percentile corridors, non-financial plain English explanations, and mathematical methodology.
          </p>
        </div>

        {/* Search input on right - Observe Liquid Glass Pill */}
        <div className="relative w-full sm:w-80 shrink-0">
          <div className="liquid-glass rounded-full pl-10 pr-4 py-2 border border-white/15 flex items-center">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            <input
              type="text"
              placeholder="Search metrics, formulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-xs text-white placeholder-white/50 font-sans"
            />
          </div>
        </div>
      </div>

      {/* 2. Sleek Filter Bar */}
      <div className="space-y-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-mono text-white/50 uppercase tracking-wider mr-1 hidden sm:inline">
            Sector:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'liquid-glass text-white/75 hover:text-white border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Tier Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-xs font-mono text-white/50 uppercase tracking-wider mr-1 hidden sm:inline">
            Signal Tier:
          </span>
          {tiers.map((t) => {
            const isSelected = selectedTier === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTier(t.id)}
                className={`px-3.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'liquid-glass text-white/60 hover:text-white border border-white/10'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Widescreen 4-Column Metric Card Grid (Observe Liquid Glass Cards) */}
      {filteredMetrics.length === 0 ? (
        <div className="liquid-glass rounded-3xl p-12 text-center space-y-3 border border-white/10 backdrop-blur-xl">
          <Search className="h-8 w-8 text-white/40 mx-auto" />
          <h3 className="font-serif-instrument text-2xl font-bold text-white">No indicators match criteria</h3>
          <p className="text-xs text-white/60">Try clearing the search query or changing active sector filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedTier('all');
            }}
            className="px-5 py-2 rounded-full bg-white text-xs font-mono text-black font-semibold hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMetrics.map((metric) => (
            <div
              key={metric.id}
              onClick={() => setActiveModalMetric(metric)}
              className="liquid-glass-panel rounded-3xl p-5 space-y-4 hover:border-white/30 transition-all duration-300 cursor-pointer shadow-xl relative group flex flex-col justify-between hover:scale-[1.01]"
            >
              <div className="space-y-3">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
                      {metric.category.toUpperCase().replace('_', ' ')}
                    </span>
                    <h3 className="font-serif-instrument text-xl font-bold text-white tracking-tight group-hover:underline decoration-white/40 underline-offset-2 transition-colors mt-0.5">
                      {metric.name}
                    </h3>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono text-white/80 uppercase shrink-0">
                    {metric.symbol}
                  </span>
                </div>

                {/* Plain English headline */}
                <p className="text-xs text-white/70 font-sans leading-relaxed line-clamp-2">
                  {metric.simpleHeadline}
                </p>

                {/* Primary Data Readout */}
                <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-white/50 uppercase">Current Reading</div>
                    <div className="font-mono text-lg font-bold text-white mt-0.5">
                      {typeof metric.currentValue === 'number' ? metric.currentValue.toLocaleString() : metric.currentValue}
                      <span className="text-xs font-normal text-white/60 ml-1">{metric.unit}</span>
                    </div>
                  </div>

                  {metric.historicalPercentile !== undefined && (
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-white/50 uppercase">Percentile</div>
                      <div className="font-mono text-sm font-semibold text-white mt-0.5">
                        {metric.historicalPercentile}th
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-white/50 text-[11px] truncate max-w-[150px]">
                  {metric.source}
                </span>

                <span className="text-white group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold text-[11px]">
                  <span>Analyze</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for In-depth Metric Inspection */}
      {activeModalMetric && (
        <MetricDetailModal
          metric={activeModalMetric}
          onClose={() => setActiveModalMetric(null)}
          onSelectRelatedMetric={(metricId) => {
            const next = metrics.find((m) => m.id === metricId);
            if (next) setActiveModalMetric(next);
          }}
        />
      )}

    </div>
  );
};
