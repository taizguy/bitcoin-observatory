import React, { useState } from 'react';
import { LESSONS_DATA } from '../../data/lessons';
import { EducationLesson } from '../../types';
import { 
  GraduationCap, 
  ArrowRight, 
  Lightbulb, 
  Clock, 
  Home, 
  Sliders, 
  CheckCircle2, 
  Radio, 
  HelpCircle,
  BookOpen,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const LearnView: React.FC = () => {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);
  const activeLesson: EducationLesson = LESSONS_DATA[selectedLessonIndex];

  // Interactive Laboratory Simulation States for Realized Cap / MVRV Lesson
  const [housePurchasePrice, setHousePurchasePrice] = useState<number>(320000);
  const [houseCurrentValue, setHouseCurrentValue] = useState<number>(680000);

  // Derived calculation for intuitive analogy
  const houseMultiple = (houseCurrentValue / housePurchasePrice).toFixed(2);
  const houseProfit = houseCurrentValue - housePurchasePrice;

  // Quiz state for active lesson
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const handleSelectLesson = (idx: number) => {
    setSelectedLessonIndex(idx);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleNextLesson = () => {
    if (selectedLessonIndex < LESSONS_DATA.length - 1) {
      handleSelectLesson(selectedLessonIndex + 1);
    }
  };

  return (
    <div className="w-full max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-8 min-h-screen">
      
      {/* 1. Header (Expansive Desktop Header) */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2 max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-mono text-white/70 uppercase tracking-wider">
            <GraduationCap className="h-3.5 w-3.5 text-white" />
            <span>OBSERVATORY ACADEMY</span>
            <span className="text-white/30">·</span>
            <span className="text-white/60">LEDGER PHYSICS & INTUITIVE MODELS</span>
            <span className="text-white/30">·</span>
            <span className="text-white/80">{LESSONS_DATA.length} CURRICULUM MODULES</span>
          </div>

          <h1 
            className="font-serif-instrument text-4xl sm:text-5xl xl:text-6xl tracking-tight text-white"
            style={{ textShadow: '0 0 72px rgba(0, 0, 0, 0.7), 0 4px 28px rgba(0, 0, 0, 0.45)' }}
          >
            The Bitcoin Observatory <em className="italic font-serif-instrument">Academy</em>
          </h1>

          <p 
            className="text-sm sm:text-base text-white/70 font-sans leading-relaxed"
            style={{ textShadow: '0 0 30px rgba(0, 0, 0, 0.5), 0 1px 10px rgba(0, 0, 0, 0.35)' }}
          >
            Master on-chain concepts through real-world physical analogies, interactive laboratory simulators, and first-principles mental models. No Wall Street jargon—just intuitive ledger mechanics.
          </p>
        </div>

        {/* Active Module Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="liquid-glass rounded-2xl p-4 text-xs font-mono border border-white/10">
            <div className="text-white/50 text-[10px] uppercase">Active Lesson</div>
            <div className="text-white font-bold text-base mt-0.5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span>Module {selectedLessonIndex + 1} of {LESSONS_DATA.length}</span>
            </div>
            <div className="text-white/80 text-[11px] mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{activeLesson.estimatedMinutes} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DUAL-STAGE ACADEMY WORKSTATION (Left: Curriculum + Right: Interactive Studio) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Lesson Curriculum Directory (4 of 12 columns) */}
        <div className="xl:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-white/50 pb-2 border-b border-white/10 uppercase tracking-wider">
            <span>Curriculum Modules</span>
            <span>{LESSONS_DATA.length} Lessons</span>
          </div>

          <div className="space-y-2.5">
            {LESSONS_DATA.map((lesson, idx) => {
              const isSelected = selectedLessonIndex === idx;
              return (
                <div
                  key={lesson.id}
                  onClick={() => handleSelectLesson(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-white/30 bg-white/15 shadow-xl text-white'
                      : 'border-white/10 liquid-glass hover:border-white/20 text-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 font-bold">{String(idx + 1).padStart(2, '0')}.</span>
                      <span className="font-serif-instrument text-base font-bold text-white tracking-wide">{lesson.title}</span>
                    </div>

                    <span className="text-white/50 flex items-center gap-1 text-[11px]">
                      <Clock className="h-3 w-3" />
                      <span>{lesson.estimatedMinutes}m</span>
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-white/60 font-sans leading-relaxed line-clamp-2">
                    {lesson.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Interactive Laboratory Studio (8 of 12 columns) */}
        <div className="xl:col-span-8 liquid-glass-panel rounded-3xl border border-white/15 p-6 sm:p-8 space-y-8 shadow-2xl relative overflow-hidden">
          
          {/* Module Header */}
          <div className="pb-6 border-b border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white/70 uppercase tracking-wider font-semibold">
                MODULE {selectedLessonIndex + 1} · {activeLesson.title.toUpperCase()}
              </span>
              <span className="text-white/50 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-white/70" />
                <span>{activeLesson.estimatedMinutes} Minutes</span>
              </span>
            </div>

            <h2 className="font-serif-instrument text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {activeLesson.title}
            </h2>

            <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed">
              {activeLesson.subtitle}
            </p>

            {/* Core Question Highlight Box */}
            <div className="p-5 rounded-2xl border border-white/15 liquid-glass flex items-start gap-3 mt-4">
              <HelpCircle className="h-5 w-5 text-white shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] font-mono text-white/60 font-bold uppercase tracking-wider">The Fundamental Question</div>
                <div className="text-base font-semibold text-white font-serif-instrument mt-0.5">{activeLesson.coreQuestion}</div>
                <div className="text-xs text-white/75 mt-1 leading-relaxed font-sans">{activeLesson.simpleTakeaway}</div>
              </div>
            </div>
          </div>

          {/* Interactive Lab Simulator: Real-world Housing Analogy for MVRV */}
          <div className="rounded-2xl border border-white/15 liquid-glass p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-white font-bold uppercase tracking-wider">
                <Sliders className="h-4 w-4 text-white" />
                <span>Interactive Laboratory: Realized Price vs Market Price</span>
              </div>
              <span className="text-xs font-mono text-white/50">Live Simulator</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sliders on Left */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-white/60">Original Purchase Price (Realized Baseline)</span>
                    <span className="font-bold text-white">${housePurchasePrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={100000}
                    max={800000}
                    step={10000}
                    value={housePurchasePrice}
                    onChange={(e) => setHousePurchasePrice(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-white/60">Current Neighborhood Appraisal (Market Price)</span>
                    <span className="font-bold text-white">${houseCurrentValue.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={100000}
                    max={1500000}
                    step={10000}
                    value={houseCurrentValue}
                    onChange={(e) => setHouseCurrentValue(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>
              </div>

              {/* Intuitive Readout Card on Right */}
              <div className="p-4 rounded-xl border border-white/10 liquid-glass space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-white/60">
                    <span>Valuation Ratio (MVRV Multiple)</span>
                    <span className="font-mono text-base font-bold text-white">{houseMultiple}x</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-white/60 mt-2">
                    <span>Unrealized Paper Gain</span>
                    <span className="font-mono text-base font-bold text-white">${houseProfit.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-xs text-white/70 font-sans leading-relaxed pt-2 border-t border-white/10">
                  Just as a homeowner is sitting on a <strong>{houseMultiple}x</strong> gain on their initial deposit, Bitcoin's current MVRV of 2.14x means investors are sitting on a 2.14x multiple over their acquisition cost basis ($41,780).
                </p>
              </div>
            </div>
          </div>

          {/* Lesson Concept Sections */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-white/50 uppercase tracking-wider">
              Core Principles & Mechanics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeLesson.sections.map((sec, i) => (
                <div key={i} className="p-5 rounded-2xl border border-white/10 liquid-glass space-y-2">
                  <h4 className="font-serif-instrument text-lg font-bold text-white">
                    {sec.title}
                  </h4>
                  <p className="text-xs text-white/75 font-sans leading-relaxed">
                    {sec.text}
                  </p>
                  {sec.analogy && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 font-sans mt-2">
                      <strong className="text-white">Analogy: </strong>{sec.analogy}
                    </div>
                  )}
                  {sec.callout && (
                    <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-xs text-white font-sans mt-2">
                      <strong className="text-white font-semibold">Key takeaway: </strong>{sec.callout}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Module Knowledge Check Quiz */}
          {activeLesson.quiz && (
            <div className="rounded-2xl border border-white/15 liquid-glass p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-white font-bold uppercase tracking-wider pb-2 border-b border-white/10">
                <HelpCircle className="h-4 w-4" />
                <span>Knowledge Check: Test Your Intuition</span>
              </div>

              <div className="text-base font-semibold text-white font-serif-instrument">
                {activeLesson.quiz.question}
              </div>

              <div className="space-y-2">
                {activeLesson.quiz.options.map((opt, optIdx) => {
                  const isSelected = selectedQuizAnswer === optIdx;
                  const isCorrect = optIdx === activeLesson.quiz?.correctIndex;

                  let style = 'border-white/10 liquid-glass text-white/80 hover:border-white/30';
                  if (quizSubmitted) {
                    if (isCorrect) style = 'border-white bg-white/20 text-white font-semibold shadow-md';
                    else if (isSelected) style = 'border-white/40 bg-white/5 text-white/50';
                  } else if (isSelected) {
                    style = 'border-white/40 bg-white/15 text-white font-semibold shadow-md';
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => !quizSubmitted && setSelectedQuizAnswer(optIdx)}
                      className={`p-3.5 rounded-xl border text-xs font-sans transition-all cursor-pointer flex items-center justify-between ${style}`}
                    >
                      <span>{opt}</span>
                      {quizSubmitted && isCorrect && <CheckCircle2 className="h-4 w-4 text-white shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={() => selectedQuizAnswer !== null && setQuizSubmitted(true)}
                  disabled={selectedQuizAnswer === null}
                  className={`px-6 py-2.5 rounded-full font-sans text-xs font-semibold transition-all cursor-pointer ${
                    selectedQuizAnswer !== null
                      ? 'bg-white text-black hover:scale-105 active:scale-95 shadow-lg'
                      : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/5'
                  }`}
                >
                  Verify Answer
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-white/10 border border-white/15 text-xs text-white/90 font-sans leading-relaxed">
                  <strong>Explanation: </strong>{activeLesson.quiz.explanation}
                </div>
              )}
            </div>
          )}

          {/* Footer Navigation Bar */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono text-white/50">
              Module {selectedLessonIndex + 1} of {LESSONS_DATA.length} Completed
            </span>

            {selectedLessonIndex < LESSONS_DATA.length - 1 ? (
              <button
                onClick={handleNextLesson}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:scale-105 active:scale-95 text-black font-sans text-xs font-medium transition-all shadow-xl cursor-pointer"
              >
                <span>NEXT LESSON</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <span className="text-xs font-mono text-white font-semibold">
                All Curriculum Modules Explored!
              </span>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
