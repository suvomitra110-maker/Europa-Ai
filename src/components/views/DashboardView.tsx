import React, { useState } from 'react';
import {
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  Bot,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageBackHeader } from '../layout/PageBackHeader';
import { courseModules, npcList } from '../../data/initialData';

export const DashboardView: React.FC = () => {
  const { user, modules, setActiveTab, setActiveLecture, setActiveNpc, showToast, unlockBadge } = useApp();

  // Interactive Real-Time Quiz state for instant feedback
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizCorrect, setQuizCorrect] = useState<boolean>(false);

  const quizQuestion = {
    q: 'In the Transformer Attention Mechanism, why do we scale the Query-Key dot products by 1 / sqrt(d_k)?',
    options: [
      'To reduce the computational time complexity from O(N^2) to O(N).',
      'To prevent the dot products from growing large in magnitude, which pushes softmax into vanishing gradient regions.',
      'To convert linear positional encodings into discrete sinusoidal embeddings.',
      'To make the matrix asymmetric so that causal masking is strictly enforced.',
    ],
    correctIndex: 1,
    explanation: 'Correct! As the dimension d_k grows, dot products grow in variance. Without dividing by sqrt(d_k), softmax yields extremely small gradients during backpropagation.',
  };

  const handleQuizSubmit = () => {
    if (quizAnswer === null) return;
    const isRight = quizAnswer === quizQuestion.correctIndex;
    setQuizSubmitted(true);
    setQuizCorrect(isRight);
    if (isRight) {
      unlockBadge('badge-2');
      showToast('🎉 Outstanding! +120 XP awarded for mastering Transformer attention scaling.');
    } else {
      showToast('Incorrect. Review the Karpathy Transformer lecture to see the mathematical derivation.');
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
      {/* Universal Page Back Header */}
      <PageBackHeader
        title="Personalized Learning Dashboard"
        subtitle="Track your real-time progress, daily study streaks, and interactive knowledge checkpoints."
        badge="Personalized Hub"
      />

      {/* Welcome & Streak Banner in Minimalist Glass */}
      <div className="relative rounded-3xl glass-card border border-white/20 dark:border-white/10 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-cyan-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-bold">
                Active Scholar
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Streak Day #{user.streakDays}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user.name}! 🚀
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              You are currently on track to conquer <strong>Generative AI & Transformer Foundations</strong>. Complete today's checkpoint to maintain your flame!
            </p>
          </div>

          {/* Quick Streak Card */}
          <div className="flex items-center gap-4 glass-button p-4 rounded-2xl shadow-xl backdrop-blur-md border border-white/20 dark:border-white/10">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500">
              <Flame className="w-6 h-6 fill-amber-500 animate-pulse" />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily Streak</div>
              <div className="text-xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
                {user.streakDays} <span className="text-xs text-amber-500 font-mono">Days Fire</span>
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-semibold">Protected with Streak Freeze</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Learning Paths */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Your Active Study Paths</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Personalized modules adapted to your engineering & leadership goals</p>
          </div>
          <button
            onClick={() => setActiveTab('library')}
            className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All in 3D</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {modules.map(mod => (
            <div
              key={mod.id}
              className="glass-card rounded-3xl p-6 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-xl border border-white/20 dark:border-white/10"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold border"
                    style={{
                      borderColor: `${mod.color}60`,
                      backgroundColor: `${mod.color}20`,
                      color: mod.color,
                    }}
                  >
                    {mod.category}
                  </span>
                  <span className="text-xs font-mono font-black text-slate-700 dark:text-slate-300">{mod.progressPercent}%</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{mod.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{mod.description}</p>

                {/* Progress bar */}
                <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${mod.progressPercent}%`,
                      backgroundColor: mod.color,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/10">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{mod.lessonsCount} lessons • {mod.durationHours} hrs</span>
                <button
                  onClick={() => {
                    if (mod.lectures[0]) {
                      setActiveLecture(mod.lectures[0]);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-cyan-500/20"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Continue</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Real-Time Quiz Checkpoint */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-xl space-y-4 border border-white/20 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Daily Concept Checkpoint</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Earn +120 XP & unlock the Transformer Sage badge</p>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-xl">+120 XP</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-semibold leading-relaxed border border-white/20 dark:border-white/10">
          {quizQuestion.q}
        </div>

        <div className="space-y-2">
          {quizQuestion.options.map((opt, idx) => {
            const isSelected = quizAnswer === idx;
            let btnClass = 'glass-button text-slate-700 dark:text-slate-200';
            if (quizSubmitted) {
              if (idx === quizQuestion.correctIndex) {
                btnClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
              } else if (isSelected) {
                btnClass = 'bg-rose-500/20 border-rose-500 text-rose-800 dark:text-rose-200';
              }
            } else if (isSelected) {
              btnClass = 'bg-cyan-500/20 border-cyan-500 text-cyan-800 dark:text-cyan-200 font-bold';
            }

            return (
              <button
                key={idx}
                disabled={quizSubmitted}
                onClick={() => setQuizAnswer(idx)}
                className={`w-full p-3.5 rounded-2xl border text-left text-xs leading-relaxed transition cursor-pointer flex items-start gap-2.5 ${btnClass}`}
              >
                <span className="w-5 h-5 rounded-lg bg-black/5 dark:bg-white/10 flex items-center justify-center font-mono text-[10px] shrink-0 font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {quizSubmitted ? (
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed ${
              quizCorrect
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-800 dark:text-rose-300'
            }`}
          >
            {quizCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            )}
            <div>
              <div className="font-bold">{quizCorrect ? 'Brilliant Answer!' : 'Needs Review'}</div>
              <p className="mt-1 text-slate-600 dark:text-slate-300">{quizQuestion.explanation}</p>
            </div>
          </div>
        ) : (
          <button
            onClick={handleQuizSubmit}
            disabled={quizAnswer === null}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg hover:brightness-110 disabled:opacity-50 transition cursor-pointer"
          >
            Submit Real-Time Checkpoint
          </button>
        )}
      </div>

      {/* Interactive Voxel Mentors Quick Access */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Interactive Voxel Mentors</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Consult with historical and frontier AI guides</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {npcList.map(npc => (
            <div
              key={npc.id}
              onClick={() => setActiveNpc(npc)}
              className="glass-card p-5 rounded-3xl cursor-pointer group hover:-translate-y-1 transition-all duration-300 shadow-xl flex items-center gap-4 border border-white/20 dark:border-white/10"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-md ${
                  npc.id === 'ada'
                    ? 'bg-emerald-600'
                    : npc.id === 'alan'
                    ? 'bg-amber-600'
                    : 'bg-indigo-600'
                }`}
              >
                {npc.id === 'tensor' ? <Bot className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition">
                  {npc.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{npc.title}</p>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold mt-1 inline-block">
                  Click to converse →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
