import React, { useState, useMemo } from 'react';
import { MetricDefinition } from '../../types';
import { DataAdapter } from '../../data/adapter';
import { Download, Search, FileSpreadsheet, FileJson, Check, ExternalLink, Database, Radio, Activity } from 'lucide-react';

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
    <div className="w-full max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-8 min-h-screen">
      
      {/* 1. Header (Expansive Desktop Header) */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2 max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-mono text-white/70 uppercase tracking-wider">
            <Database className="h-3.5 w-3.5 text-white" />
            <span>LEDGER PROVENANCE & RAW AUDIT REGISTRY</span>
            <span className="text-white/30">·</span>
            <span className="text-white/60">BENCHMARK CALIBRATED</span>
            <span className="text-white/30">·</span>
            <span className="text-white/80">{filteredMetrics.length} RECORDS ACCESSIBLE</span>
          </div>

          <h1 
            className="font-serif-instrument text-4xl sm:text-5xl xl:text-6xl tracking-tight text-white"
            style={{ textShadow: '0 0 72px rgba(0, 0, 0, 0.7), 0 4px 28px rgba(0, 0, 0, 0.45)' }}
          >
            On-Chain Telemetry <em className="italic font-serif-instrument">Registry</em>
          </h1>

          <p 
            className="text-sm sm:text-base text-white/70 font-sans leading-relaxed"
            style={{ textShadow: '0 0 30px rgba(0, 0, 0, 0.5), 0 1px 10px rgba(0, 0, 0, 0.35)' }}
          >
            Every metric displays verified consensus state, data provenance source, node update interval, and benchmark corridor deltas. Export data sets to open CSV or structured JSON.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass border border-white/15 text-xs font-sans text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
          >
            {copiedFormat === 'csv' ? <Check className="h-4 w-4 text-white" /> : <FileSpreadsheet className="h-4 w-4 text-white/80" />}
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-sans font-medium hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
          >
            {copiedFormat === 'json' ? <Check className="h-4 w-4 text-black" /> : <FileJson className="h-4 w-4 text-black" />}
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Filter & Query Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Indicators' },
            { id: 'macro_valuation', label: 'Macro Valuation' },
            { id: 'holder_conviction', label: 'Holder Conviction' },
            { id: 'network_defense', label: 'Network Defense' },
            { id: 'capital_flow', label: 'Capital Flow' },
            { id: 'mining_thermodynamics', label: 'Mining Dynamics' },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'liquid-glass text-white/60 hover:text-white border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="w-full md:w-80">
          <div className="liquid-glass rounded-full px-4 py-2 flex items-center gap-2.5 border border-white/10">
            <Search className="h-4 w-4 text-white/50 shrink-0" />
            <input
              type="text"
              placeholder="Filter by metric name, source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-xs text-white placeholder:text-white/40 font-sans"
            />
          </div>
        </div>
      </div>

      {/* 3. Widescreen High-Density Table */}
      <div className="liquid-glass-panel rounded-3xl overflow-hidden shadow-2xl relative border border-white/15">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-white/60 text-[11px] uppercase tracking-wider">
                <th className="py-4 px-5 font-semibold">Metric Name</th>
                <th className="py-4 px-5 font-semibold">Symbol</th>
                <th className="py-4 px-5 font-semibold">Sector</th>
                <th className="py-4 px-5 font-semibold text-right">Current Value</th>
                <th className="py-4 px-5 font-semibold text-right">30d Delta</th>
                <th className="py-4 px-5 font-semibold text-right">Percentile</th>
                <th className="py-4 px-5 font-semibold">Data Provenance</th>
                <th className="py-4 px-5 font-semibold">Update Latency</th>
                <th className="py-4 px-5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredMetrics.map((metric) => (
                <tr
                  key={metric.id}
                  onClick={() => onSelectMetricDetail(metric.id)}
                  className="hover:bg-white/5 cursor-pointer transition-colors text-white/80"
                >
                  <td className="py-4 px-5 font-bold text-white flex items-center gap-2">
                    <span className="truncate max-w-[200px] font-serif-instrument text-base">{metric.name}</span>
                  </td>
                  <td className="py-4 px-5 text-white/60">
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white border border-white/10">
                      {metric.symbol}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-white/60 capitalize">
                    {metric.category.replace('_', ' ')}
                  </td>
                  <td className="py-4 px-5 text-right font-bold text-white tabular-nums">
                    {typeof metric.currentValue === 'number' ? metric.currentValue.toLocaleString() : metric.currentValue}
                    <span className="text-[10px] text-white/50 font-normal ml-1">{metric.unit}</span>
                  </td>
                  <td className="py-4 px-5 text-right tabular-nums">
                    {metric.change30d !== undefined ? (
                      <span className="text-white font-medium">
                        {metric.change30d >= 0 ? `+${metric.change30d.toFixed(1)}%` : `${metric.change30d.toFixed(1)}%`}
                      </span>
                    ) : (
                      <span className="text-white/40">—</span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right tabular-nums">
                    {metric.historicalPercentile !== undefined ? (
                      <span className="font-semibold text-white px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[11px]">
                        {metric.historicalPercentile}th
                      </span>
                    ) : (
                      <span className="text-white/40">—</span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-white/60 truncate max-w-[180px]">
                    {metric.source}
                  </td>
                  <td className="py-4 px-5 text-white/50 text-[11px]">
                    Daily On-Chain
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMetricDetail(metric.id);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white hover:text-black text-white text-[11px] font-semibold transition-all cursor-pointer border border-white/10"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
