import React, { useState } from 'react';
import { DETECTIVE_CASES } from '../../data/detective';
import { DetectiveCase } from '../../types';
import { Search, Trophy, Flame, Award, ArrowRight, RotateCcw, Radio, Check, X, ShieldAlert } from 'lucide-react';

export const DetectiveView: React.FC = () => {
  const [currentCaseIndex, setCurrentCaseIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [xp, setXp] = useState<number>(() => {
    return parseInt(localStorage.getItem('btc_obs_xp') || '0', 10);
  });
  const [streak, setStreak] = useState<number>(() => {
    return parseInt(localStorage.getItem('btc_obs_streak') || '0', 10);
  });
  const [solvedCases, setSolvedCases] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('btc_obs_solved') || '[]');
    } catch {
      return [];
    }
  });

  const activeCase: DetectiveCase = DETECTIVE_CASES[currentCaseIndex];
  const isCorrect = selectedOptionId === activeCase.correctOptionId;

  const handleSelectOption = (optionId: string) => {
    if (isRevealed) return;
    setSelectedOptionId(optionId);
  };

  const handleConfirmDeduction = () => {
    if (!selectedOptionId || isRevealed) return;
    setIsRevealed(true);

    if (selectedOptionId === activeCase.correctOptionId) {
      const newXp = xp + activeCase.xpReward;
      const newStreak = streak + 1;
      setXp(newXp);
      setStreak(newStreak);
      localStorage.setItem('btc_obs_xp', newXp.toString());
      localStorage.setItem('btc_obs_streak', newStreak.toString());

      if (!solvedCases.includes(activeCase.id)) {
        const nextSolved = [...solvedCases, activeCase.id];
        setSolvedCases(nextSolved);
        localStorage.setItem('btc_obs_solved', JSON.stringify(nextSolved));
      }
    } else {
      setStreak(0);
      localStorage.setItem('btc_obs_streak', '0');
    }
  };

  const handleNextCase = () => {
    setIsRevealed(false);
    setSelectedOptionId(null);
    setCurrentCaseIndex((prev) => (prev + 1) % DETECTIVE_CASES.length);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 celestial-grid-pattern min-h-screen">
      
      {/* Header & Stats Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2 tracking-widest uppercase">
            <Search className="h-4 w-4 text-amber-500" />
            <span>CLASSIFIED FORENSIC LAB · BLIND CASE ARCHIVE</span>
          </div>
          <h1 className="font-celestial text-3xl sm:text-5xl font-bold text-white tracking-wide">
            Bitcoin Detective Mode
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed font-sans">
            Examine anonymous historical on-chain forensic scenes. Deduce what cycle phase was unfolding purely from telemetry clues before the date and price are declassified.
          </p>
        </div>

        {/* Intelligence Telemetry Scoreboard */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#03060c] px-4 py-2.5 text-xs font-mono">
            <Trophy className="h-4 w-4 text-amber-400" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Intelligence XP</span>
              <span className="font-bold text-white text-sm">{xp} XP</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#03060c] px-4 py-2.5 text-xs font-mono">
            <Flame className="h-4 w-4 text-orange-400" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Active Streak</span>
              <span className="font-bold text-white text-sm">{streak}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#03060c] px-4 py-2.5 text-xs font-mono">
            <Award className="h-4 w-4 text-cyan-400" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Solved</span>
              <span className="font-bold text-white text-sm">{solvedCases.length}/{DETECTIVE_CASES.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Case Briefing Container */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#03060c] p-6 sm:p-8 space-y-8 shadow-2xl relative">
        <div className="reticle-corner-tl" />
        <div className="reticle-corner-tr" />
        <div className="reticle-corner-bl" />
        <div className="reticle-corner-br" />

        {/* Case Dossier Title & Status Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase font-bold">
              FILE: #{activeCase.id.toUpperCase()}
            </span>
            <h2 className="font-celestial text-2xl font-bold text-white tracking-wide">
              {activeCase.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-400">CLASSIFICATION:</span>
            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold uppercase">
              TOP SECRET // REDACTED
            </span>
          </div>
        </div>

        {/* Anonymous Crime Scene Clues Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Forensic Clues & Redacted Intel */}
          <div className="md:col-span-7 space-y-6">
            <div className="p-4 rounded-xl border border-white/[0.06] bg-black/40 text-xs font-mono space-y-2">
              <div className="flex justify-between text-slate-400 pb-2 border-b border-white/[0.04]">
                <span>INCIDENT LOCATION</span>
                <span className="text-amber-400 font-bold">GLOBAL BITCOIN LEDGER</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>INCIDENT DATE:</span>
                <span className="bg-white/10 px-2 rounded text-slate-300 font-mono">
                  {isRevealed ? activeCase.revealDate : '████-██-██ [REDACTED]'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>SPOT PRICE AT SCENE:</span>
                <span className="bg-white/10 px-2 rounded text-slate-300 font-mono">
                  {isRevealed ? activeCase.revealPrice : '$██,███ [REDACTED]'}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-3">
                Recovered Forensic Clues
              </h3>
              <div className="space-y-2.5">
                {activeCase.clues.map((clue, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02] flex items-start gap-3">
                    <span className="text-amber-400 font-mono text-xs mt-0.5">#{idx + 1}</span>
                    <div>
                      <div className="text-xs font-mono text-white font-bold">{clue.label}: {clue.dataPoint}</div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed mt-0.5">{clue.significance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3">
                On-Chain Diagnostic Telemetry
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activeCase.chartSnippet.map((m, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl border border-white/[0.05] bg-white/[0.02]">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">{m.label}</div>
                    <div className="text-base font-mono font-bold text-white mt-0.5">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Detective Deductive Options */}
          <div className="md:col-span-5 space-y-6">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider pb-2 border-b border-white/[0.06]">
              Select Your Forensic Deduction
            </h3>

            <div className="space-y-3">
              {activeCase.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let optionStyle = 'border-white/[0.06] bg-white/[0.02] hover:border-white/20';

                if (isRevealed) {
                  if (opt.id === activeCase.correctOptionId) {
                    optionStyle = 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300';
                  } else if (isSelected) {
                    optionStyle = 'border-rose-500/60 bg-rose-950/30 text-rose-300';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-amber-400 bg-amber-500/15 text-amber-300 font-semibold shadow-lg';
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${optionStyle}`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold">{opt.stage}</span>
                      {isRevealed && opt.id === activeCase.correctOptionId && (
                        <Check className="h-4 w-4 text-emerald-400" />
                      )}
                      {isRevealed && isSelected && opt.id !== activeCase.correctOptionId && (
                        <X className="h-4 w-4 text-rose-400" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-300 font-sans leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-white/[0.06]">
              {!isRevealed ? (
                <button
                  onClick={handleConfirmDeduction}
                  disabled={!selectedOptionId}
                  className={`w-full py-3 rounded-xl font-mono text-xs font-bold transition-all ${
                    selectedOptionId
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-98'
                      : 'bg-white/[0.05] text-slate-500 cursor-not-allowed'
                  }`}
                >
                  CONFIRM FORENSIC DEDUCTION (+{activeCase.xpReward} XP)
                </button>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border text-xs font-sans leading-relaxed ${
                    isCorrect
                      ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
                      : 'border-rose-500/40 bg-rose-950/30 text-rose-200'
                  }`}>
                    <div className="font-mono font-bold uppercase mb-1">
                      {isCorrect ? '✓ DEDUCTION CONFIRMED CORRECT' : '✖ DEDUCTION INCORRECT'}
                    </div>
                    <p>{activeCase.explanation}</p>
                  </div>

                  <button
                    onClick={handleNextCase}
                    className="w-full py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-mono text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <span>NEXT INCIDENT FILE</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
