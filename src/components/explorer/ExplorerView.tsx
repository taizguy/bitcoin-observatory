import React, { useState, useMemo } from 'react';
import { MetricDefinition } from '../../types';
import { MetricDetailModal } from './MetricDetailModal';
import { Search, ArrowUpRight, Layers, Radio, ExternalLink } from 'lucide-react';

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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 celestial-grid-pattern min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-2 tracking-widest uppercase">
            <Layers className="h-4 w-4 text-purple-400" />
            <span>SPECTRAL CATALOG · 24 VERIFIED ON-CHAIN SIGNALS</span>
          </div>
          <h1 className="font-celestial text-3xl sm:text-5xl font-bold text-white tracking-wide">
            Metric Catalog & Spectral Index
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed font-sans">
            Every metric has an explicit provenance, category classification, tier importance, and mathematical definition.
          </p>
        </div>

        {/* Search input with precision astronomical styling */}
        <div className="relative w-full md:w-84">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
          <input
            type="text"
            placeholder="Search metric, concept or alias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#070b16] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60 font-mono transition-all"
          />
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="space-y-3">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-mono text-slate-500 mr-1 uppercase">Sector:</span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all focus:outline-none ${
                selectedCategory === cat.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tier Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-mono text-slate-500 mr-1 uppercase">Signal Tier:</span>
          {tiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`px-3 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-all focus:outline-none ${
                selectedTier === tier.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Card Grid (Zero-Pill Discipline, Rich Information Architecture) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMetrics.map((metric) => (
          <div
            key={metric.id}
            onClick={() => setActiveModalMetric(metric)}
            className="rounded-2xl border border-white/[0.08] bg-[#03060c] p-6 flex flex-col justify-between shadow-xl hover:border-amber-400/40 transition-all cursor-pointer relative group"
          >
            <div className="reticle-corner-tl" />
            <div className="reticle-corner-tr" />

            <div>
              {/* Unboxed Metadata Header (NO PILLS) */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 uppercase font-bold">{metric.symbol}</span>
                  <span>·</span>
                  <span className="capitalize">{metric.category.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Radio className="h-2.5 w-2.5 animate-pulse" />
                  <span className="uppercase text-[10px]">{metric.dataState}</span>
                </div>
              </div>

              {/* Title & Reading */}
              <div className="mt-4 flex items-baseline justify-between gap-2">
                <h3 className="font-celestial text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  {metric.name}
                </h3>
                <div className="text-right font-mono tabular-nums">
                  <span className="text-lg font-bold text-white">
                    {metric.currentValue}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">{metric.unit}</span>
                </div>
              </div>

              {/* Intuitive Headline */}
              <p className="mt-2 text-xs font-semibold text-amber-300/90 font-sans">
                {metric.simpleHeadline}
              </p>

              {/* Explanation */}
              <p className="mt-1.5 text-xs text-slate-300 font-sans leading-relaxed line-clamp-3">
                {metric.simpleExplanation}
              </p>
            </div>

            {/* Footer with Percentile & Action */}
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
              <div>
                <span>Percentile: </span>
                <span className="text-white font-bold">{metric.historicalPercentile}%</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400 group-hover:text-amber-300 font-semibold">
                <span>View Chart</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Metric Detail Modal */}
      {activeModalMetric && (
        <MetricDetailModal
          metric={activeModalMetric}
          onClose={() => setActiveModalMetric(null)}
          onSelectRelatedMetric={(relId) => {
            const rel = metrics.find((m) => m.id === relId);
            if (rel) setActiveModalMetric(rel);
          }}
        />
      )}

    </div>
  );
};
