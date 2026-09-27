import React, { useState } from 'react';
import { LESSONS_DATA } from '../../data/lessons';
import { EducationLesson } from '../../types';
import { GraduationCap, ArrowRight, Lightbulb, Clock, Home, Sliders, CheckCircle2 } from 'lucide-react';

export const LearnView: React.FC = () => {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);
  const activeLesson: EducationLesson = LESSONS_DATA[selectedLessonIndex];

  // Interactive Laboratory Simulation States for MVRV Lesson
  const [housePurchasePrice, setHousePurchasePrice] = useState<number>(300000);
  const [houseCurrentValue, setHouseCurrentValue] = useState<number>(640000);

  // Derived calculation for intuitive analogy
  const houseMultiple = (houseCurrentValue / housePurchasePrice).toFixed(2);
  const houseProfit = houseCurrentValue - housePurchasePrice;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12 celestial-grid-pattern min-h-screen">
      
      {/* Header */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2 tracking-widest uppercase">
          <GraduationCap className="h-4 w-4 text-cyan-400" />
          <span>ON-CHAIN LABORATORY ACADEMY · EMPIRICAL INTUITION</span>
        </div>
        <h1 className="font-celestial text-3xl sm:text-5xl font-bold text-white tracking-wide">
          The Bitcoin Observatory Academy
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
          Master on-chain concepts through real-world analogies, interactive simulators, and first-principles mental models. No financial jargon—just intuitive ledger physics.
        </p>
      </div>

      {/* Main Academy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Lesson Curriculum List */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-mono text-slate-400 pb-2 border-b border-white/[0.06] uppercase tracking-wider">
            Curriculum Modules
          </div>

          {LESSONS_DATA.map((lesson, idx) => {
            const isSelected = selectedLessonIndex === idx;
            return (
              <div
                key={lesson.id}
                onClick={() => setSelectedLessonIndex(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-400/50 bg-[#070b16] shadow-lg'
                    : 'border-white/[0.05] bg-white/[0.015] hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">{String(idx + 1).padStart(2, '0')}.</span>
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Clock className="h-3 w-3" />
                    <span>{lesson.estimatedMinutes} min</span>
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm mt-1 tracking-wide">
                  {lesson.title}
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-1 line-clamp-1">
                  {lesson.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Interactive Lesson Laboratory */}
        <div className="lg:col-span-8 rounded-2xl border border-white/[0.08] bg-[#03060c] p-6 sm:p-8 space-y-8 shadow-2xl relative">
          <div className="reticle-corner-tl" />
          <div className="reticle-corner-tr" />
          <div className="reticle-corner-bl" />
          <div className="reticle-corner-br" />

          {/* Module Header */}
          <div className="pb-6 border-b border-white/[0.06]">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
              MODULE {selectedLessonIndex + 1} OF {LESSONS_DATA.length}
            </div>
            <h2 className="font-celestial text-2xl sm:text-3xl font-bold text-white tracking-wide">
              {activeLesson.title}
            </h2>
            <p className="mt-2 text-sm text-slate-300 font-sans leading-relaxed">
              {activeLesson.subtitle} · {activeLesson.coreQuestion}
            </p>
          </div>

          {/* Real World Analogy Box */}
          <div className="p-5 rounded-xl border border-amber-500/25 bg-[#080d19] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase font-bold">
              <Lightbulb className="h-4 w-4" />
              <span>THE MENTAL MODEL ANALOGY</span>
            </div>
            <p className="text-xs sm:text-sm font-sans text-slate-200 leading-relaxed">
              {activeLesson.sections[0]?.analogy || activeLesson.simpleTakeaway}
            </p>
          </div>

          {/* INTERACTIVE SIMULATOR (Section 22: Interactive Laboratory Simulator) */}
          {activeLesson.id === 'mvrv' && (
            <div className="p-6 rounded-xl border border-white/[0.08] bg-black/40 space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase font-bold">
                  <Sliders className="h-4 w-4 text-cyan-400" />
                  <span>INTERACTIVE REAL ESTATE ANALOGY SIMULATOR</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">TRY IT YOURSELF</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                    <span>What you paid for the house:</span>
                    <span className="text-amber-400 font-bold">${housePurchasePrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={100000}
                    max={800000}
                    step={10000}
                    value={housePurchasePrice}
                    onChange={(e) => setHousePurchasePrice(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    Analogy for Realized Price (Cost Basis)
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                    <span>What neighbor offers to buy it for:</span>
                    <span className="text-cyan-400 font-bold">${houseCurrentValue.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={100000}
                    max={1500000}
                    step={20000}
                    value={houseCurrentValue}
                    onChange={(e) => setHouseCurrentValue(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    Analogy for Market Price (Spot Value)
                  </div>
                </div>
              </div>

              {/* Dynamic Simulation Output */}
              <div className="p-4 rounded-lg border border-white/[0.06] bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Calculated House Multiple</span>
                    <span className="font-mono text-2xl font-black text-amber-400">{houseMultiple}x</span>
                  </div>
                  <div className="text-center sm:text-left border-l border-white/[0.08] pl-4">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Unrealized Paper Gain</span>
                    <span className="font-mono text-lg font-bold text-emerald-400">
                      {houseProfit >= 0 ? `+$${houseProfit.toLocaleString()}` : `-$${Math.abs(houseProfit).toLocaleString()}`}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-mono text-right">
                  <span className="text-slate-400 block">Bitcoin Observatory Equivalent:</span>
                  <span className="text-white font-bold">
                    {parseFloat(houseMultiple) > 3.2
                      ? 'Frothy Euphoria Zone (>3.2x)'
                      : parseFloat(houseMultiple) > 1.2
                      ? 'Healthy Expansion Zone (1.2–3.0x)'
                      : 'Accumulation / Undervalued Zone (<1.0x)'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Key Insights Sections */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Core Ledger Principles
            </h4>
            <div className="space-y-3">
              {activeLesson.sections.map((sec, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.02] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{sec.title}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">{sec.text}</p>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl border border-cyan-500/25 bg-cyan-950/20 text-xs font-sans text-cyan-200">
              <span className="font-mono font-bold text-cyan-300 uppercase block mb-1">Takeaway:</span>
              {activeLesson.simpleTakeaway}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
