import React from 'react';
import { ViewMode } from '../../types';
import { X, Activity, Compass, Users, History, GraduationCap, ArrowRight, Radio } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPath: (view: ViewMode, metricId?: string) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onSelectPath,
}) => {
  if (!isOpen) return null;

  const paths = [
    {
      id: 'now',
      title: "What's happening right now?",
      desc: 'Instant celestial synthesis of Bitcoin health and macro atmospheric pressure.',
      icon: Activity,
      action: () => onSelectPath('observatory'),
    },
    {
      id: 'cycle',
      title: 'Where are we in the cycle?',
      desc: 'Inspect the 8-stage planetary epicycle clock and current cycle status.',
      icon: Compass,
      action: () => onSelectPath('cycle'),
    },
    {
      id: 'holders',
      title: 'What are Bitcoin holders doing?',
      desc: 'Discover whether long-term conviction investors are accumulating or distributing coins.',
      icon: Users,
      action: () => onSelectPath('observatory', 'lth_supply'),
    },
    {
      id: 'history',
      title: 'Explore Bitcoin History',
      desc: 'Travel through 15 years of market peaks, panic crashes, and generational bottoms.',
      icon: History,
      action: () => onSelectPath('history'),
    },
    {
      id: 'learn',
      title: 'Learn On-Chain Ledger Physics',
      desc: 'Master Realized Price, MVRV, and UTXO concepts with interactive laboratory simulators.',
      icon: GraduationCap,
      action: () => onSelectPath('learn'),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 transition-all">
      <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#03060c] p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="reticle-corner-tl" />
        <div className="reticle-corner-tr" />
        <div className="reticle-corner-bl" />
        <div className="reticle-corner-br" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
              <Radio className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              <span>BITCOIN OBSERVATORY · CALIBRATION GATEWAY</span>
            </div>
            <h2 className="font-celestial text-2xl font-bold text-white tracking-wide">
              Bitcoin is more than its price.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Every block, coins transfer between patient accumulators and speculative traders, miners fortify cryptographic defense, and capital settles. Where would you like to begin?
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Path Selection Cards */}
        <div className="space-y-2.5">
          {paths.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => {
                  p.action();
                  onClose();
                }}
                className="w-full text-left p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] hover:border-amber-400/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-amber-400 shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-celestial text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-sans leading-snug">
                      {p.desc}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors shrink-0 ml-2" />
              </button>
            );
          })}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            Enter Sky Viewport Directly →
          </button>
        </div>

      </div>
    </div>
  );
};
