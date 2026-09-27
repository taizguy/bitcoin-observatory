import React, { useState, useMemo } from 'react';
import { MetricDefinition } from '../../types';
import { DataAdapter } from '../../data/adapter';
import { Download, Search, FileSpreadsheet, FileJson, Check, ExternalLink, Database, Radio } from 'lucide-react';

interface DataModeViewProps {
  metrics: MetricDefinition[];
  onSelectMetricDetail: (metricId: string) => void;
}

export const DataModeView: React.FC<DataModeViewProps> = ({
  metrics,
  onSelectMetricDetail
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const filteredMetrics = useMemo(() => {
    return metrics.filter((m) => {
      const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
      const matchesState = selectedState === 'all' || m.dataState === selectedState;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.symbol.toLowerCase().includes(q) ||
        m.source.toLowerCase().includes(q) ||
        m.simpleHeadline.toLowerCase().includes(q);
      return matchesCat && matchesState && matchesSearch;
    });
  }, [metrics, selectedCategory, selectedState, searchQuery]);

  const handleDownloadCSV = () => {
    const csvContent = DataAdapter.exportToCSV(filteredMetrics);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bitcoin_observatory_telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCopiedFormat('csv');
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  const handleDownloadJSON = () => {
    const jsonContent = DataAdapter.exportToJSON(filteredMetrics);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bitcoin_observatory_telemetry_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCopiedFormat('json');
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 celestial-grid-pattern min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2 tracking-widest uppercase">
            <Database className="h-4 w-4 text-cyan-400" />
            <span>DATA PROVENANCE & RAW AUDIT REGISTRY</span>
          </div>
          <h1 className="font-celestial text-3xl sm:text-5xl font-bold text-white tracking-wide">
            On-Chain Telemetry Registry
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed font-sans">
            Every metric displays known consensus state, data provenance source, update interval, and verified baseline deltas.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-slate-200 hover:text-white transition-all"
          >
            {copiedFormat === 'csv' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <FileSpreadsheet className="h-3.5 w-3.5 text-amber-400" />}
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-slate-200 hover:text-white transition-all"
          >
            {copiedFormat === 'json' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <FileJson className="h-3.5 w-3.5 text-cyan-400" />}
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none font-mono text-xs">
          <span className="text-slate-500 uppercase text-[11px] mr-1">Sector:</span>
          {['all', 'valuation', 'holders', 'profit_loss', 'network', 'money_flows'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {cat === 'all' ? 'All' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#070b16] pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60 font-mono"
          />
        </div>
      </div>

      {/* Telemetry Table Container */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#03060c] overflow-hidden shadow-2xl relative">
        <div className="reticle-corner-tl" />
        <div className="reticle-corner-tr" />
        <div className="reticle-corner-bl" />
        <div className="reticle-corner-br" />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.08] bg-black/40 text-[11px] text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Symbol · Metric</th>
                <th className="py-3 px-4">Consensus Value</th>
                <th className="py-3 px-4">24h Delta</th>
                <th className="py-3 px-4">30d Delta</th>
                <th className="py-3 px-4">Percentile</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Provenance Source</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredMetrics.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => onSelectMetricDetail(m.id)}
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400">{m.symbol}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-200 font-sans font-medium">{m.name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-white tabular-nums">
                    {m.currentValue} <span className="text-[10px] text-slate-400 font-normal">{m.unit}</span>
                  </td>

                  <td className={`py-3.5 px-4 tabular-nums ${
                    m.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {m.change24h >= 0 ? '+' : ''}{m.change24h}%
                  </td>

                  <td className={`py-3.5 px-4 tabular-nums ${
                    m.change30d >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {m.change30d >= 0 ? '+' : ''}{m.change30d}%
                  </td>

                  <td className="py-3.5 px-4 text-slate-300 tabular-nums">
                    {m.historicalPercentile}%
                  </td>

                  <td className="py-3.5 px-4 text-[11px]">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <Radio className="h-2.5 w-2.5 animate-pulse" />
                      <span className="uppercase">{m.dataState}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {m.source}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMetricDetail(m.id);
                      }}
                      className="text-amber-400 hover:text-amber-300 p-1"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-white/[0.06] bg-black/40 text-[11px] font-mono text-slate-500 flex items-center justify-between">
          <span>Showing {filteredMetrics.length} of {metrics.length} telemetry streams</span>
          <span>Tabular numerals enabled (tabular-nums)</span>
        </div>
      </div>

    </div>
  );
};
