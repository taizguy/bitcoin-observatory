import React, { useState } from 'react';
import { DETECTIVE_CASES } from '../../data/detective';
import { DetectiveCase } from '../../types';
import { 
  Search, 
  Trophy, 
  Flame, 
  Award, 
  ArrowRight, 
  RotateCcw, 
  Radio, 
  Check, 
  X, 
  ShieldAlert, 
  Sparkles,
  HelpCircle,
  Clock,
  Layers,
  CheckCircle2
} from 'lucide-react';

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
    <div className="w-full max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-8 min-h-screen">
      
      {/* 1. Header & Stats Bar (Expansive Desktop Header) */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2 max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-mono text-white/70 uppercase tracking-wider">
            <ShieldAlert className="h-3.5 w-3.5 text-white" />
            <span>FORENSIC INTELLIGENCE DOSSIER</span>
            <span className="text-white/30">·</span>
            <span className="text-white/60">BLIND ON-CHAIN CRIME SCENES</span>
            <span className="text-white/30">·</span>
            <span className="text-white/80">CASE {currentCaseIndex + 1} OF {DETECTIVE_CASES.length}</span>
          </div>

          <h1 
            className="font-serif-instrument text-4xl sm:text-5xl xl:text-6xl tracking-tight text-white"
            style={{ textShadow: '0 0 72px rgba(0, 0, 0, 0.7), 0 4px 28px rgba(0, 0, 0, 0.45)' }}
          >
            Bitcoin Detective <em className="italic font-serif-instrument">Mode</em>
          </h1>

          <p 
            className="text-sm sm:text-base text-white/70 font-sans leading-relaxed"
            style={{ textShadow: '0 0 30px rgba(0, 0, 0, 0.5), 0 1px 10px rgba(0, 0, 0, 0.35)' }}
          >
            Examine anonymous historical on-chain forensic crime scenes. Deduce what macro cycle phase was actively unfolding purely from telemetry clues before the real date, price, and headlines are declassified.
          </p>
        </div>

        {/* Intelligence Scoreboard */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl liquid-glass border border-white/10 text-xs font-mono">
            <Trophy className="h-4 w-4 text-white" />
            <div>
              <div className="text-[10px] text-white/50 uppercase">Total XP</div>
              <div className="font-bold text-white text-sm">{xp}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl liquid-glass border border-white/10 text-xs font-mono">
            <Flame className="h-4 w-4 text-white" />
            <div>
              <div className="text-[10px] text-white/50 uppercase">Streak</div>
              <div className="font-bold text-white text-sm">{streak} Cases</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl liquid-glass border border-white/10 text-xs font-mono">
            <Award className="h-4 w-4 text-white" />
            <div>
              <div className="text-[10px] text-white/50 uppercase">Solved</div>
              <div className="font-bold text-white text-sm">{solvedCases.length}/{DETECTIVE_CASES.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DUAL-STAGE FORENSIC WORKSTATION (Left: Case Clues + Right: Deduction Console) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left: The Case Clues & Evidence (7 of 12 columns) */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* Mystery Prompt Card */}
          <div className="liquid-glass-panel rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-mono pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider">
                <Radio className="h-3.5 w-3.5 animate-pulse text-white" />
                <span>CASE #{currentCaseIndex + 1}: {activeCase.title.toUpperCase()}</span>
              </div>
              <span className="px-3 py-1 rounded-full liquid-glass text-white/80 border border-white/10 text-[11px] font-mono">
                {activeCase.difficulty} Level · +{activeCase.xpReward} XP
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-serif-instrument text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {activeCase.title}
              </h2>
              <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed">
                "{activeCase.mysteryPrompt}"
              </p>
            </div>
          </div>

          {/* Forensic Evidence Clues Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-white/50 pb-1 border-b border-white/10 uppercase tracking-wider">
              <span>Unclassified On-Chain Footprints</span>
              <span>4 Clues Recovered</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeCase.clues.map((clue, idx) => (
                <div 
                  key={idx}
                  className="rounded-2xl border border-white/10 liquid-glass p-5 space-y-2 hover:border-white/25 transition-all shadow-md"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white/60 font-semibold">{clue.label}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/15 font-bold text-xs">
                      {clue.dataPoint}
                    </span>
                  </div>
                  <p className="text-xs text-white/75 font-sans leading-relaxed">
                    {clue.significance}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Snippet Chart Trendline */}
          {activeCase.chartSnippet && activeCase.chartSnippet.length > 0 && (
            <div className="rounded-2xl border border-white/10 liquid-glass p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-white/50">
                <span className="uppercase tracking-wider">Temporal Metric Curve Progression</span>
                <span>Relative Window</span>
              </div>

              <div className="grid grid-cols-5 gap-2 text-center">
                {activeCase.chartSnippet.map((pt, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-[11px] font-mono text-white/40">{pt.label}</div>
                    <div className="text-sm font-mono font-bold text-white mt-1">{pt.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right: Deduction Console & Solution (5 of 12 columns) */}
        <div className="xl:col-span-5 space-y-6">
          
          <div className="rounded-3xl border border-white/15 liquid-glass-panel p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-white/60 uppercase tracking-wider mb-1">
                <span>DEDUCTION CONSOLE</span>
              </div>
              <h3 className="font-serif-instrument text-2xl font-bold text-white tracking-tight">
                Which Cycle Phase Was Unfolding?
              </h3>
            </div>

            {/* Option Cards */}
            <div className="space-y-3">
              {activeCase.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                const isCorrectOption = option.id === activeCase.correctOptionId;

                let borderStyle = 'border-white/10 liquid-glass hover:border-white/20';
                if (isSelected && !isRevealed) {
                  borderStyle = 'border-white bg-white/15 text-white';
                } else if (isRevealed) {
                  if (isCorrectOption) {
                    borderStyle = 'border-white bg-white/20 text-white';
                  } else if (isSelected && !isCorrectOption) {
                    borderStyle = 'border-white/40 bg-white/5 text-white/70';
                  }
                }

                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${borderStyle}`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-white bg-white text-black' : 'border-white/30'
                        }`}>
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="font-bold text-sm text-white tracking-wide">{option.stage}</span>
                      </div>

                      {isRevealed && isCorrectOption && (
                        <span className="text-white font-bold text-xs flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          CORRECT
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-white/60 font-sans leading-relaxed mt-1 pl-6">
                      {option.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Action Trigger */}
            {!isRevealed ? (
              <button
                onClick={handleConfirmDeduction}
                disabled={!selectedOptionId}
                className={`w-full py-3.5 rounded-full font-mono text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedOptionId
                    ? 'bg-white text-black hover:scale-105 active:scale-95 shadow-xl'
                    : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                }`}
              >
                <span>LOCK IN DEDUCTION</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="space-y-4 pt-2">
                {/* Result Notification Card */}
                <div className={`p-4 rounded-2xl border ${
                  isCorrect
                    ? 'border-white/30 bg-white/10 text-white'
                    : 'border-white/20 bg-white/5 text-white/80'
                }`}>
                  <div className="flex items-center gap-2 font-mono font-bold text-sm">
                    {isCorrect ? <CheckCircle2 className="h-4 w-4 text-white" /> : <X className="h-4 w-4 text-white/60" />}
                    <span>{isCorrect ? 'Deduction Confirmed! +150 XP' : 'Deduction Inaccurate'}</span>
                  </div>
                </div>

                {/* Declassified Incident Report */}
                <div className="p-5 rounded-2xl border border-white/10 liquid-glass space-y-3">
                  <div className="text-xs font-mono text-white/60 uppercase tracking-wider pb-2 border-b border-white/10 flex items-center justify-between">
                    <span>DECLASSIFIED INCIDENT DETAILS</span>
                    <span className="text-white font-bold">{activeCase.revealDate}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                      <div className="text-[10px] text-white/40">ACTUAL DATE</div>
                      <div className="text-white font-bold mt-0.5">{activeCase.revealDate}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                      <div className="text-[10px] text-white/40">SPOT PRICE</div>
                      <div className="text-white font-bold mt-0.5">{activeCase.revealPrice}</div>
                    </div>
                  </div>

                  <p className="text-xs text-white/75 font-sans leading-relaxed pt-1">
                    {activeCase.explanation}
                  </p>

                  <div className="pt-2 border-t border-white/10 text-xs font-sans text-white/70 leading-relaxed">
                    <strong className="text-white">Rule of thumb: </strong>{activeCase.lessonTaught}
                  </div>
                </div>

                <button
                  onClick={handleNextCase}
                  className="w-full py-3.5 rounded-full font-mono text-sm font-semibold bg-white text-black hover:scale-105 active:scale-95 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl"
                >
                  <span>PROCEED TO NEXT CASE</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
