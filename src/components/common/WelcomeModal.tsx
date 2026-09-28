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
  // Lock body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const paths = [
    {
      id: 'now',
      title: "What's happening right now?",
      desc: 'Instant consensus synthesis of Bitcoin health and macro atmospheric pressure.',
      icon: Activity,
      action: () => onSelectPath('observatory'),
    },
    {
      id: 'cycle',
      title: 'Where are we in the cycle?',
      desc: 'Inspect the 8-stage orbital cycle clock and current macro status.',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 transition-all">
      <div className="relative w-full max-w-xl rounded-3xl liquid-glass-panel p-6 sm:p-8 shadow-2xl space-y-6 border border-white/15">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
              <Radio className="h-3.5 w-3.5 text-white animate-pulse" />
              <span>OBSERVE · CALIBRATION GATEWAY</span>
            </div>
            <h2 className="font-serif-instrument text-3xl sm:text-4xl text-white tracking-tight">
              Bitcoin is more than its <em className="italic font-serif-instrument">price</em>.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
              Every block, coins transfer between patient accumulators and speculative traders, miners fortify cryptographic defense, and capital settles. Where would you like to begin?
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
                className="w-full text-left p-4 rounded-2xl liquid-glass border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-serif-instrument text-lg font-bold text-white group-hover:underline decoration-white/30 underline-offset-2 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-white/60 font-sans mt-0.5">
                      {p.desc}
                    </p>
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-3" />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50">
          <span>Empirical Consensus Telemetry</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white text-black font-sans font-medium text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
          >
            Enter Observatory →
          </button>
        </div>
      </div>
    </div>
  );
};
