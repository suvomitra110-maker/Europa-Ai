import React from 'react';
import {
  Briefcase,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  Play,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageBackHeader } from '../layout/PageBackHeader';
import { videoLectures } from '../../data/initialData';

export const NonTechnicalTrackView: React.FC = () => {
  const { setActiveLecture } = useApp();

  const nonTechModules = [
    {
      id: 'nt-1',
      title: 'AI Economics: Token Cost Modeling & ROI Frameworks',
      duration: '45 mins',
      difficulty: 'Beginner',
      completed: true,
      description: 'Learn how to estimate token throughput costs, evaluate build vs buy decisions, and construct a robust business case for enterprise AI.',
      keyTakeaways: [
        'Calculating cost per 1M tokens vs human labor hour benchmarks.',
        'Identifying when simple deterministic logic outperforms stochastic LLMs.',
        'Modeling latency SLAs into customer experience journeys.',
      ],
      videoRef: videoLectures[5],
    },
    {
      id: 'nt-2',
      title: 'Proprietary Data Moats & The AI Flywheel',
      duration: '35 mins',
      difficulty: 'Intermediate',
      completed: true,
      description: 'Why foundation models are commodities, and how unique user feedback loops, data exhaust, and custom fine-tuning create sustainable defensibility.',
      keyTakeaways: [
        'The cold-start data flywheel problem and synthetic bootstrapping.',
        'Feedback loop design for human evaluation & Reinforcement Learning from Human Feedback (RLHF).',
        'Protecting enterprise proprietary data against foundation model scraping.',
      ],
      videoRef: videoLectures[5],
    },
    {
      id: 'nt-3',
      title: 'Enterprise AI Governance, Copyright & Compliance (EU AI Act)',
      duration: '50 mins',
      difficulty: 'Intermediate',
      completed: false,
      description: 'A risk-based taxonomy of high-risk vs minimal-risk AI systems, provenance watermarking, copyright exposure, and auditing vendor models.',
      keyTakeaways: [
        'EU AI Act compliance tiers: Prohibited, High-Risk, and Transparency systems.',
        'Safe harbor policies for prompt inputs and employee AI usage guidelines.',
        'Third-party model vulnerability testing and bias audits.',
      ],
      videoRef: videoLectures[2],
    },
    {
      id: 'nt-4',
      title: 'Prompt Engineering for Product Managers & Designers',
      duration: '40 mins',
      difficulty: 'Beginner',
      completed: false,
      description: 'Designing system prompts, few-shot contextual priming, chain-of-thought instructions, and preventing output drift in customer-facing products.',
      keyTakeaways: [
        'Role-Task-Constraint prompting architecture for reliable JSON output.',
        'Structuring evaluation test suites using golden dataset grading.',
        'Designing delightful UX fallback states when models fail gracefully.',
      ],
      videoRef: videoLectures[1],
    },
  ];

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
      {/* Universal Page Back Header */}
      <PageBackHeader
        title="Non-Technical AI Leadership Track"
        subtitle="Executive frameworks, business economics, ethics, governance, and AI ROI without writing code."
        badge="Executive Curriculum"
      />

      {/* Header Banner in Translucent Glass */}
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
              No Coding Required
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Curated with Ada Lovelace & Europa Strategy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Non-Technical AI Leadership & Strategy
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Designed for business leaders, product managers, founders, designers, and domain specialists. Master token economics, proprietary data flywheels, risk governance, and prompt product design without writing a single line of code.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 glass-button px-3.5 py-1.5 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Executive Certification Track</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 glass-button px-3.5 py-1.5 rounded-xl border border-white/20 dark:border-white/10">
              <FileText className="w-4 h-4 text-cyan-500" />
              <span>Downloadable Strategy Frameworks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Executive Curriculum</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Complete all 4 modules to earn the "Executive Mind" achievement badge</p>
        </div>

        <div className="space-y-4">
          {nonTechModules.map((mod, idx) => (
            <div
              key={mod.id}
              className="glass-card border border-white/20 dark:border-white/10 hover:-translate-y-0.5 rounded-3xl p-6 sm:p-7 shadow-xl transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-sm">
                    0{idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{mod.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span>{mod.duration}</span>
                      <span>•</span>
                      <span>{mod.difficulty}</span>
                      {mod.completed && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveLecture(mod.videoRef)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shadow-md shadow-emerald-600/20"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Module</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{mod.description}</p>

              <div className="glass-panel border border-white/20 dark:border-white/10 rounded-2xl p-4">
                <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2">
                  Key Strategic Outcomes:
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {mod.keyTakeaways.map((k, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
