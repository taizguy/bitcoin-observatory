import React, { useState, useEffect, useRef } from 'react';
import { DataAdapter } from '../../data/adapter';
import { MetricDefinition } from '../../types';
import { Search, X, ArrowRight, BookOpen, Layers, Compass, History, Radio } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMetric: (metricId: string) => void;
  onNavigate?: (view: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectMetric,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const searchResult = DataAdapter.search(query);
  const metricResults = searchResult.metrics;

  // Human-first query synthesis
  const normalizedQuery = query.toLowerCase().trim();
  const isHolderQuery = normalizedQuery.includes('holder') || normalizedQuery.includes('selling') || normalizedQuery.includes('dormant');
  const isValuationQuery = normalizedQuery.includes('valua') || normalizedQuery.includes('mvrv') || normalizedQuery.includes('price') || normalizedQuery.includes('expensive');
  const isNetworkQuery = normalizedQuery.includes('network') || normalizedQuery.includes('hashrate') || normalizedQuery.includes('security') || normalizedQuery.includes('mining');

  const popularSearches = [
    'Why are holders selling?',
    'What is MVRV?',
    'Show me dormant supply',
    'Is network activity increasing?',
    'Find valuation metrics',
    'NUPL',
    'SOPR'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/85 backdrop-blur-md p-4 pt-16 sm:pt-24 transition-all">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#03060c] p-6 shadow-2xl space-y-5">
        <div className="reticle-corner-tl" />
        <div className="reticle-corner-tr" />
        <div className="reticle-corner-bl" />
        <div className="reticle-corner-br" />

        {/* Search Input Line */}
        <div className="relative flex items-center border-b border-white/[0.08] pb-4">
          <Search className="h-5 w-5 text-amber-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search on-chain concepts, questions or metrics (e.g. 'Why are holders selling?')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none font-mono"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-500 hover:text-white mr-2"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search Results / Guidance */}
        <div className="max-h-[62vh] overflow-y-auto space-y-5 pr-1 font-sans">
          
          {/* Natural Language Synthesis Box when relevant */}
          {isHolderQuery && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-[#061410] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-300">
                <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                <span>NATURAL INQUIRY SYNTHESIS: HOLDER BEHAVIOR</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Currently, 69.8% of coins remain in Long-Term Holder wallets unmoved for &gt;155 days. While minor profit-taking occurs (SOPR 1.024), aggregate smart money is not distributing heavily.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs font-mono">
                <button
                  onClick={() => {
                    onSelectMetric('lth_supply');
                    onClose();
                  }}
                  className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                  View LTH Supply Chart →
                </button>
                <button
                  onClick={() => {
                    onSelectMetric('sopr');
                    onClose();
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  Inspect SOPR →
                </button>
              </div>
            </div>
          )}

          {isValuationQuery && (
            <div className="p-4 rounded-xl border border-amber-500/30 bg-[#161005] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
                <Radio className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                <span>NATURAL INQUIRY SYNTHESIS: VALUATION</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Bitcoin MVRV sits at 2.14x relative to an aggregate cost basis of $41,780. Valuation is classified in the Healthy Expansion corridor, well below historical mania thresholds (&gt;3.5).
              </p>
              <button
                onClick={() => {
                  onSelectMetric('mvrv');
                  onClose();
                }}
                className="text-xs font-mono text-amber-400 hover:text-amber-300 font-semibold"
              >
                Inspect MVRV Multiple →
              </button>
            </div>
          )}

          {/* Metric Results */}
          {metricResults.length > 0 ? (
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider pb-1 border-b border-white/[0.04]">
                Matched Telemetry Streams ({metricResults.length})
              </div>

              {metricResults.map((m: MetricDefinition) => (
                <div
                  key={m.id}
                  onClick={() => {
                    onSelectMetric(m.id);
                    onClose();
                  }}
                  className="p-3 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.06] hover:border-amber-400/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="font-bold text-white group-hover:text-amber-300 transition-colors">
                        {m.name}
                      </span>
                      <span className="text-slate-500">({m.symbol})</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-amber-400">{m.currentValue} {m.unit}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {m.simpleHeadline}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-8 text-xs font-mono text-slate-400">
              No matching signals found for "{query}". Try a concept like "holders", "mvrv", or "mining".
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Popular Inquiries
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-xs font-mono text-slate-300 hover:text-white hover:border-white/20 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
