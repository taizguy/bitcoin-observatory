import React from 'react';
import { Compass, RefreshCw, Info, Radio } from 'lucide-react';

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
    <footer className="w-full border-t border-white/[0.08] bg-[#020306] py-10 text-xs text-slate-400 relative overflow-hidden">
      {/* Subtle Background Celestial Coordinate Line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Brand & Scientific Identity */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="font-celestial font-bold text-slate-200 tracking-wider">
                BITCOIN OBSERVATORY
              </span>
              <span className="text-[10px] font-mono text-amber-500/80">· J2026</span>
            </div>
            <span className="hidden sm:inline text-slate-700">|</span>
            <p className="text-slate-400 font-sans text-xs">
              Direct telescopic inspection into Bitcoin’s hidden monetary, holder, and computational dynamics.
            </p>
          </div>

          {/* Right: Optical Recalibration & Methodology Controls */}
          <div className="flex items-center gap-5 text-xs font-mono">
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors focus:outline-none"
              title="Recalibrate On-Chain Telemetry"
            >
              <RefreshCw className="h-3 w-3 text-amber-500" />
              <span>{lastUpdatedText}</span>
            </button>

            <span className="text-slate-800">|</span>

            <button
              onClick={onOpenMethodology}
              className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors focus:outline-none"
            >
              <Info className="h-3 w-3 text-cyan-400" />
              <span className="font-sans">Weight Calibration</span>
            </button>

            <span className="text-slate-800">|</span>

            <div className="flex items-center gap-1.5 text-slate-400">
              <Radio className="h-3 w-3 text-emerald-400" />
              <span className="font-mono text-[11px] text-slate-300">Empirical Non-Predictive</span>
            </div>
          </div>

        </div>

        {/* Scientific Disclaimers & Calibration Epilogue */}
        <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span>RA: 18h 42m 08s</span>
            <span>·</span>
            <span>DEC: +36° 15′ 22″</span>
            <span>·</span>
            <span>EQUINOX: 2026.0</span>
          </div>
          <div className="text-center sm:text-right font-sans text-slate-500">
            Observation of historical and real-time ledger consensus. Not financial advice.
          </div>
        </div>
      </div>
    </footer>
  );
};
