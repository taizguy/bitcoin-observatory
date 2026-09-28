import React from 'react';
import { RefreshCw, Info, Globe, Twitter, Disc as Discord, Github } from 'lucide-react';

interface FooterProps {
  lastUpdatedText: string;
  onRefresh: () => void;
  onOpenMethodology: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lastUpdatedText,
  onRefresh,
  onOpenMethodology
}) => {
  return (
    <footer className="w-full relative z-20 pt-16 pb-12 text-xs text-white/70">
      
      {/* Observe Signature Liquid Glass Social / Station Row */}
      <div className="relative z-10 flex justify-center items-center gap-4 pb-12">
        <button 
          onClick={onRefresh}
          className="liquid-glass-circle w-14 h-14 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:scale-105 active:scale-95 transition-all focus:outline-none cursor-pointer"
          title={`Sync Ledger Telemetry (${lastUpdatedText})`}
        >
          <RefreshCw className="h-5 w-5" />
        </button>

        <a 
          href="https://twitter.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="liquid-glass-circle w-14 h-14 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:scale-105 active:scale-95 transition-all focus:outline-none"
          title="Observe on Twitter"
        >
          <Twitter className="h-5 w-5" />
        </a>

        <button 
          onClick={onOpenMethodology}
          className="liquid-glass-circle w-14 h-14 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:scale-105 active:scale-95 transition-all focus:outline-none cursor-pointer"
          title="Formulas & Calibration Methodology"
        >
          <Globe className="h-5 w-5" />
        </button>

        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="liquid-glass-circle w-14 h-14 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:scale-105 active:scale-95 transition-all focus:outline-none"
          title="Ledger Open Telemetry Engine"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>

      <div className="w-full max-w-5xl mx-auto px-6 text-center space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono text-white/60">
          <span className="font-semibold text-white tracking-wider uppercase">Observe · Bitcoin</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span>{lastUpdatedText}</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span>Consensus Telemetry Epoch J2026.24</span>
        </div>

        <p className="text-white/40 text-xs leading-relaxed max-w-xl mx-auto font-sans">
          Every event from the Bitcoin network rendered as one picture you can actually read. Empirical on-chain telemetry. Not financial advice.
        </p>
      </div>

    </footer>
  );
};
