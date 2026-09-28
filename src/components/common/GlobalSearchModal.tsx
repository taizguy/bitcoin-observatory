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
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);

      return () => {
        document.body.style.overflow = originalOverflow;
      };
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
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/85 backdrop-blur-2xl p-4 pt-16 sm:pt-24 transition-all"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-2xl rounded-3xl liquid-glass-panel p-6 shadow-2xl space-y-5 border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Line */}
        <div className="relative flex items-center border-b border-white/10 pb-4">
          <Search className="h-5 w-5 text-white mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search on-chain concepts, questions or metrics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-white/40 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-white/50 hover:text-white mr-3 px-2 py-1 rounded-full hover:bg-white/10"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="liquid-glass-circle w-9 h-9 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
            title="Close dialog (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search Results / Guidance */}
        <div className="max-h-[60vh] overflow-y-auto space-y-5 pr-1 font-sans overscroll-contain">
          
          {/* Natural Language Synthesis Box when relevant */}
          {isHolderQuery && (
            <div className="p-5 rounded-2xl border border-white/15 liquid-glass space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                <Radio className="h-3.5 w-3.5 text-white animate-pulse" />
                <span>NATURAL INQUIRY SYNTHESIS: HOLDER BEHAVIOR</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-sans">
                Currently, 69.8% of coins remain in Long-Term Holder wallets unmoved for &gt;155 days. While minor profit-taking occurs (SOPR 1.024), aggregate conviction holders are refusing to distribute heavily.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs font-mono">
                <button
                  onClick={() => {
                    onSelectMetric('lth_supply');
                    onClose();
                  }}
                  className="text-white hover:underline decoration-white/40 font-semibold cursor-pointer flex items-center gap-1"
                >
                  <span>View LTH Supply Chart</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {isValuationQuery && (
            <div className="p-5 rounded-2xl border border-white/15 liquid-glass space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                <Radio className="h-3.5 w-3.5 text-white animate-pulse" />
                <span>NATURAL INQUIRY SYNTHESIS: VALUATION</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-sans">
                MVRV is currently 2.14x, sitting inside the historical healthy expansion corridor (1.0 to 2.4). Market price is well above realized cost basis ($41,780) without entering extreme top froth (&gt;3.5).
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs font-mono">
                <button
                  onClick={() => {
                    onSelectMetric('mvrv');
                    onClose();
                  }}
                  className="text-white hover:underline decoration-white/40 font-semibold cursor-pointer flex items-center gap-1"
                >
                  <span>Inspect MVRV Multiple</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {isNetworkQuery && (
            <div className="p-5 rounded-2xl border border-white/15 liquid-glass space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                <Radio className="h-3.5 w-3.5 text-white animate-pulse" />
                <span>NATURAL INQUIRY SYNTHESIS: NETWORK SECURITY</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-sans">
                Hashrate stands at a record 712 EH/s. Mining computational efficiency has stabilized post-halving, and miner sell pressure remains within normal operational limits.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs font-mono">
                <button
                  onClick={() => {
                    onSelectMetric('hashrate');
                    onClose();
                  }}
                  className="text-white hover:underline decoration-white/40 font-semibold cursor-pointer flex items-center gap-1"
                >
                  <span>Inspect Hashrate Telemetry</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {/* Metric Results */}
          {metricResults.length > 0 ? (
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-white/50 uppercase tracking-wider pb-1 border-b border-white/10">
                Matching Metrics ({metricResults.length})
              </div>
              {metricResults.map((metric) => (
                <div
                  key={metric.id}
                  onClick={() => {
                    onSelectMetric(metric.id);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 liquid-glass hover:border-white/30 transition-all cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif-instrument font-bold text-white text-base group-hover:underline decoration-white/40 transition-all">
                        {metric.name}
                      </span>
                      <span className="font-mono text-[10px] text-white/70 px-2 py-0.5 rounded-full bg-white/10 border border-white/10">
                        {metric.symbol}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 font-sans mt-0.5 line-clamp-1">
                      {metric.simpleHeadline}
                    </p>
                  </div>

                  <div className="text-right shrink-0 ml-4 font-mono">
                    <div className="text-sm font-bold text-white">
                      {typeof metric.currentValue === 'number' ? metric.currentValue.toLocaleString() : metric.currentValue}
                    </div>
                    <div className="text-[10px] text-white/50">
                      {metric.historicalPercentile}th percentile
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="py-8 text-center text-white/50 text-xs font-mono">
              No matching on-chain metrics found for "{query}".
            </div>
          ) : null}

          {/* Suggestions if no query */}
          {!query && (
            <div className="space-y-4 pt-1">
              <div>
                <div className="text-[11px] font-mono text-white/50 uppercase tracking-wider mb-2">
                  Common Plain English Questions
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(term)}
                      className="text-xs px-3 py-1 rounded-full liquid-glass border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition-all cursor-pointer font-sans"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Shortcuts */}
              {onNavigate && (
                <div>
                  <div className="text-[11px] font-mono text-white/50 uppercase tracking-wider mb-2">
                    Quick Navigation
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onNavigate('cycle');
                        onClose();
                      }}
                      className="p-3 rounded-2xl border border-white/10 liquid-glass hover:border-white/30 text-left flex items-center gap-2.5 cursor-pointer group"
                    >
                      <Compass className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-xs font-bold text-white font-serif-instrument text-base">Cycle Clock</div>
                        <div className="text-[10px] text-white/50 font-mono">8 orbital macro phases</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('history');
                        onClose();
                      }}
                      className="p-3 rounded-2xl border border-white/10 liquid-glass hover:border-white/30 text-left flex items-center gap-2.5 cursor-pointer group"
                    >
                      <History className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-xs font-bold text-white font-serif-instrument text-base">Historical Atlas</div>
                        <div className="text-[10px] text-white/50 font-mono">15 years of ledger events</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('explorer');
                        onClose();
                      }}
                      className="p-3 rounded-2xl border border-white/10 liquid-glass hover:border-white/30 text-left flex items-center gap-2.5 cursor-pointer group"
                    >
                      <Layers className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-xs font-bold text-white font-serif-instrument text-base">Metric Directory</div>
                        <div className="text-[10px] text-white/50 font-mono">All consensus indicators</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('learn');
                        onClose();
                      }}
                      className="p-3 rounded-2xl border border-white/10 liquid-glass hover:border-white/30 text-left flex items-center gap-2.5 cursor-pointer group"
                    >
                      <BookOpen className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-xs font-bold text-white font-serif-instrument text-base">Academy</div>
                        <div className="text-[10px] text-white/50 font-mono">Ledger physics & simulators</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50">
          <span>Search calibrated across all on-chain telemetry</span>
          <span className="text-white/80">Deterministic UTXO Index</span>
        </div>
      </div>
    </div>
  );
};
