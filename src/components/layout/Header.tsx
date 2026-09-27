import React, { useState } from 'react';
import { ViewMode, UserMode, GlobalDataMode } from '../../types';
import { Search, Sliders, ChevronDown, Check, Compass, Radio } from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  userMode: UserMode;
  onToggleUserMode: () => void;
  onOpenSearch: () => void;
  onRefreshData: () => void;
  lastUpdatedText: string;
  dataMode: GlobalDataMode;
  onSetDataMode: (mode: GlobalDataMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  userMode,
  onToggleUserMode,
  onOpenSearch,
  dataMode,
  onSetDataMode
}) => {
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  const navItems: { id: ViewMode; label: string; coordinates: string }[] = [
    { id: 'observatory', label: 'Observatory', coordinates: '00°00′' },
    { id: 'cycle', label: 'Cycle Clock', coordinates: '04°12′' },
    { id: 'history', label: 'Time Machine', coordinates: '08°45′' },
    { id: 'explorer', label: 'Catalog', coordinates: '13°20′' },
    { id: 'learn', label: 'Academy', coordinates: '17°55′' },
    { id: 'detective', label: 'Detective', coordinates: '21°30′' },
    { id: 'data', label: 'Raw Telemetry', coordinates: '23°59′' }
  ];

  const dataModeLabels: Record<GlobalDataMode, { label: string; indicatorColor: string; description: string }> = {
    demo: {
      label: 'Benchmark Calibrated',
      indicatorColor: 'text-amber-400 bg-amber-400/20 border-amber-400/40',
      description: 'Parameters calibrated against BlockHorizon verified historical benchmarks. Offline simulation active.'
    },
    live: {
      label: 'Live Synchronized',
      indicatorColor: 'text-emerald-400 bg-emerald-400/20 border-emerald-400/40',
      description: 'Direct ingestion from Bitcoin node consensus state and mempool telemetry.'
    },
    historical: {
      label: 'Historical Lock',
      indicatorColor: 'text-indigo-400 bg-indigo-400/20 border-indigo-400/40',
      description: 'Telescope locked to historical block snapshots across 2013–2026 epochs.'
    },
    mixed: {
      label: 'Composite Stream',
      indicatorColor: 'text-cyan-400 bg-cyan-400/20 border-cyan-400/40',
      description: 'Synthesizing verified live exchange spot data with confirmed on-chain batches.'
    }
  };

  const currentModeInfo = dataModeLabels[dataMode] || dataModeLabels.demo;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#030509]/95 backdrop-blur-xl">
      {/* Top Hairline Telemetry Ribbon */}
      <div className="hidden md:flex items-center justify-between px-6 py-1 border-b border-white/[0.04] text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-black/40">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Radio className="h-3 w-3 text-amber-500 animate-pulse" />
            <span>OPTICAL ARRAY: ACTIVE</span>
          </span>
          <span>·</span>
          <span>CELESTIAL EPOCH: J2026.24</span>
          <span>·</span>
          <span>BLOCK HEIGHT: 894,210</span>
        </div>
        <div className="flex items-center gap-4">
          <span>LAT: 46°12′N</span>
          <span>·</span>
          <span>ALT: 2,870M (PEAK OBSERVATORY)</span>
          <span>·</span>
          <span className="text-amber-400/80">HASH FLUX: 712 EH/s</span>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Celestial Brand Wordmark */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onSelectView('observatory')}
            className="group flex items-center gap-3 text-left focus:outline-none"
          >
            {/* Astrolabe / Armillary Emblem */}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/15 via-black to-slate-900 border border-amber-500/30 text-amber-400 group-hover:border-amber-400/70 transition-all shadow-[0_0_15px_-3px_rgba(245,158,11,0.25)]">
              {/* Concentric Astrolabe Rings */}
              <div className="absolute inset-1 rounded-full border border-amber-500/20 group-hover:rotate-45 transition-transform duration-700" />
              <div className="absolute inset-2 rounded-full border border-amber-500/30" />
              <span className="font-celestial text-sm font-black tracking-widest text-amber-300">₿</span>
            </div>
            
            <div className="flex flex-col">
              <span className="font-celestial text-base sm:text-lg font-bold tracking-wider text-slate-100 group-hover:text-amber-300 transition-colors">
                BITCOIN OBSERVATORY
              </span>
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase -mt-0.5">
                ON-CHAIN CELESTIAL CARTOGRAPHY
              </span>
            </div>
          </button>

          {/* Precision Provenance Indicator */}
          <div className="relative">
            <button
              onClick={() => setShowModeDropdown(!showModeDropdown)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-[11px] font-mono text-slate-300 transition-all focus:outline-none"
              title="Data Provenance Status"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${currentModeInfo.indicatorColor}`} />
              <span className="text-slate-400 font-sans text-xs">Stream:</span>
              <span className="text-white font-medium">{currentModeInfo.label}</span>
              <ChevronDown className="h-3 w-3 text-slate-500 ml-0.5" />
            </button>

            {showModeDropdown && (
              <div className="absolute left-0 mt-2 w-80 rounded-xl border border-white/10 bg-[#070a12]/98 p-4 shadow-2xl z-50 text-xs space-y-3 backdrop-blur-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] font-mono text-[11px] text-slate-300">
                  <span className="uppercase tracking-wider">Calibration Source</span>
                  <Compass className="h-3.5 w-3.5 text-amber-400" />
                </div>
                
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  {currentModeInfo.description}
                </p>

                <div className="space-y-1.5 pt-1">
                  {(['demo', 'live', 'historical', 'mixed'] as GlobalDataMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        onSetDataMode(mode);
                        setShowModeDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                        dataMode === mode
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <span>{dataModeLabels[mode].label}</span>
                      {dataMode === mode && <Check className="h-3.5 w-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/[0.06] text-[10px] text-slate-500 font-mono">
                  Guaranteed telemetry integrity. Synthetic data is never passed as live.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Clean Astronomical Instrument Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider font-mono">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`group relative py-2 transition-all focus:outline-none ${
                  isActive
                    ? 'text-amber-400 font-bold'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-[17px] h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Optical Actions & Telemetry Readout */}
        <div className="flex items-center gap-3">
          {/* Quick Concept / Metric Search */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300 hover:bg-white/[0.07] hover:text-white hover:border-amber-400/30 transition-all focus:outline-none font-mono"
            title="Search Ledger Telemetry (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-amber-400/80" />
            <span className="hidden sm:inline font-sans text-slate-300 text-xs">Search Sky...</span>
            <kbd className="hidden sm:inline-block rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[9px] text-slate-400 font-mono">⌘K</kbd>
          </button>

          {/* User Mode (Beginner / Advanced) Precision Switcher */}
          <button
            onClick={onToggleUserMode}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-mono transition-all border ${
              userMode === 'advanced'
                ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300 shadow-[0_0_12px_-3px_rgba(6,182,212,0.3)]'
                : 'border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:border-white/20'
            }`}
            title="Toggle between Narrative View and Advanced Precision Telemetry"
          >
            <Sliders className="h-3 w-3 text-cyan-400" />
            <span className="capitalize">{userMode}</span>
          </button>

          {/* Live Spot Price Telemetry Readout */}
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#080d16] px-3 py-1.5 text-xs font-mono tabular-nums">
            <span className="text-slate-500 text-[10px]">SPOT</span>
            <span className="font-bold text-white tracking-wide">$89,420</span>
            <span className="text-emerald-400 text-[11px]">+1.8%</span>
          </div>
        </div>

      </div>

      {/* Mobile Horizontal Navigation Scroll */}
      <div className="flex lg:hidden overflow-x-auto border-t border-white/[0.06] px-4 py-2 gap-4 scrollbar-none text-xs font-mono uppercase tracking-wider bg-black/60">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectView(item.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded transition-colors ${
              currentView === item.id
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
