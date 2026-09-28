import React, { useState, useRef, useEffect } from 'react';
import { ViewMode, UserMode, GlobalDataMode } from '../../types';
import { 
  Search, 
  ChevronDown, 
  Menu,
  X,
  Compass, 
  Activity, 
  History, 
  Layers, 
  GraduationCap, 
  ShieldAlert, 
  Database,
  Radio
} from 'lucide-react';

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
  onSetDataMode,
}) => {
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowModeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: ViewMode; label: string; icon: React.ElementType }[] = [
    { id: 'observatory', label: 'Observatory', icon: Compass },
    { id: 'cycle', label: 'Cycle Clock', icon: Activity },
    { id: 'history', label: 'History', icon: History },
    { id: 'explorer', label: 'Explorer', icon: Layers },
    { id: 'learn', label: 'Academy', icon: GraduationCap },
    { id: 'detective', label: 'Detective', icon: ShieldAlert },
    { id: 'data', label: 'Telemetry', icon: Database }
  ];

  const dataModeLabels: Record<GlobalDataMode, { label: string; dotColor: string; description: string }> = {
    demo: {
      label: 'Benchmark Calibrated',
      dotColor: 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]',
      description: 'Parameters calibrated against verified on-chain benchmarks.'
    },
    live: {
      label: 'Live Node Stream',
      dotColor: 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] animate-pulse',
      description: 'Direct ingestion from Bitcoin node consensus state.'
    },
    historical: {
      label: 'Historical Lock',
      dotColor: 'bg-zinc-400',
      description: 'Locked to historical block snapshot epochs.'
    },
    mixed: {
      label: 'Composite Stream',
      dotColor: 'bg-white/80',
      description: 'Blending spot liquidity with confirmed on-chain batches.'
    }
  };

  const currentModeInfo = dataModeLabels[dataMode] || dataModeLabels.demo;

  return (
    <nav className="sticky top-0 z-50 w-full px-4 sm:px-6 py-4 pointer-events-auto">
      {/* Observe Floating Liquid Glass Navbar Pill */}
      <div className="liquid-glass rounded-full max-w-6xl mx-auto pl-5 pr-2 py-2 flex items-center justify-between border border-white/10 shadow-2xl backdrop-blur-2xl">
        
        {/* Left: Observe Noise-to-Form Ring Logo & Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectView('observatory')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
            title="Return to Observatory"
          >
            {/* The signature Observe ring that resolves from noise into form */}
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              aria-hidden="true" 
              className="w-6 h-6 text-white group-hover:scale-105 transition-transform duration-300"
            >
              <path 
                d="M4.21 16.5 A9 9 0 0 1 16.5 4.21" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
              <path 
                d="M16.5 4.21 A9 9 0 0 1 19.79 16.5" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeDasharray="2.4 2.3"
              />
              <path 
                d="M19.79 16.5 A9 9 0 0 1 4.21 16.5" 
                stroke="currentColor" 
                strokeWidth="2.6" 
                strokeLinecap="round" 
                strokeDasharray="0.01 4.7"
              />
              <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
            </svg>

            <span className="font-semibold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
              Observe
              <span className="font-serif-instrument italic font-normal text-white/70 text-lg hidden sm:inline">
                Bitcoin
              </span>
            </span>
          </button>
        </div>

        {/* Center: Desktop Navigation Stations */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2 px-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap focus:outline-none ${
                  isActive
                    ? 'bg-white text-black shadow-md font-semibold'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right: Actions Cluster */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Quick Search Pill */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-mono transition-all border border-white/10 focus:outline-none"
            title="Search metrics and cycle concepts (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden xl:inline text-[11px] text-white/60">Search</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] bg-white/10 border border-white/20 rounded font-mono text-white/70">
              ⌘K
            </kbd>
          </button>

          {/* User Mode (Novice vs Sovereign Pro) */}
          <button
            onClick={onToggleUserMode}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/80 hover:text-white hover:bg-white/5 border border-white/10 transition-colors focus:outline-none"
            title={`Toggle technical depth (currently: ${userMode})`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            <span className="capitalize">{userMode === 'beginner' ? 'Novice' : 'Analyst'}</span>
          </button>

          {/* Data Provenance Selector Pill */}
          <div className="relative hidden xl:block" ref={dropdownRef}>
            <button
              onClick={() => setShowModeDropdown(!showModeDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-white/80 border border-white/10 transition-all focus:outline-none"
              title="Consensus Data Stream"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${currentModeInfo.dotColor}`} />
              <span className="text-[11px]">{dataMode === 'live' ? 'Live Node' : 'Calibrated'}</span>
              <ChevronDown className="h-3 w-3 text-white/50" />
            </button>

            {showModeDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/15 bg-black/90 p-3 shadow-2xl z-50 text-xs space-y-2 backdrop-blur-3xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 font-mono text-[11px] text-white">
                  <span className="uppercase tracking-wider">Node Stream</span>
                  <Radio className="h-3 w-3 text-white animate-pulse" />
                </div>
                <div className="space-y-1">
                  {(['demo', 'live', 'historical'] as GlobalDataMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        onSetDataMode(mode);
                        setShowModeDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl font-mono text-xs flex items-center justify-between transition-colors ${
                        dataMode === mode ? 'bg-white text-black font-semibold' : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="capitalize">{mode === 'demo' ? 'Calibrated' : mode}</span>
                      {dataMode === mode && <span className="text-[10px]">Active</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Join / Live Feed Solid White Pill Button (Observe signature CTA) */}
          <button
            onClick={() => onSelectView('data')}
            className="bg-white rounded-full px-4 sm:px-5 py-2 text-black text-xs sm:text-sm font-medium whitespace-nowrap hover:scale-105 active:scale-95 transition-transform duration-300 shadow-lg cursor-pointer"
          >
            Live Ledger
          </button>

          {/* Mobile Hamburger Drawer Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu (Liquid Glass) */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 liquid-glass rounded-3xl p-4 border border-white/15 max-w-md mx-auto shadow-2xl space-y-2 backdrop-blur-2xl">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-black font-semibold'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between px-1">
            <button
              onClick={() => {
                onToggleUserMode();
              }}
              className="text-xs font-mono text-white/70 hover:text-white"
            >
              Mode: <span className="text-white capitalize">{userMode}</span>
            </button>
            <button
              onClick={() => {
                onOpenSearch();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-mono text-white/70 hover:text-white flex items-center gap-1"
            >
              <Search className="h-3 w-3" />
              <span>Search</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
