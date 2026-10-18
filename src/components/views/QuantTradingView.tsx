import React, { useState } from 'react';
import {
  TrendingUp,
  Globe,
  CheckCircle2,
  Cpu,
  ShieldAlert,
  Layers,
  Award,
  ArrowRight,
  BrainCircuit,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageBackHeader } from '../layout/PageBackHeader';
import { globalQuantHubs } from '../../data/initialData';

export const QuantTradingView: React.FC = () => {
  const {
    quantStrategies,
    toggleQuantStrategyComplete,
    badges,
    setActiveTab,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [regionFilter, setRegionFilter] = useState<'ALL' | 'Americas' | 'EMEA' | 'APAC'>('ALL');
  const [zScoreThreshold, setZScoreThreshold] = useState<number>(2.0);
  const [lookbackDays, setLookbackDays] = useState<number>(60);

  const completedQuantCount = quantStrategies.filter(q => q.completed).length;
  const quantBadges = badges.filter(b => b.studyPath === 'quant');
  const unlockedQuantBadges = quantBadges.filter(b => b.unlocked).length;

  const categories = [
    'All',
    'Statistical Arbitrage',
    'Market Microstructure & HFT',
    'AI / Deep RL Alpha',
    'Volatility & Options',
    'Sentiment & NLP Alpha',
    'Macro & Factor Investing',
  ];

  const filteredStrategies =
    selectedCategory === 'All'
      ? quantStrategies
      : quantStrategies.filter(s => s.category === selectedCategory);

  const filteredHubs =
    regionFilter === 'ALL'
      ? globalQuantHubs
      : globalQuantHubs.filter(h => h.region === regionFilter);

  // Deterministic backtest simulation metrics based on Z-Score and lookback window
  const simulatedSharpe = (2.45 + (2.2 - Math.abs(zScoreThreshold - 2.1)) * 0.25 - Math.abs(lookbackDays - 60) * 0.003).toFixed(2);
  const simulatedAnnualReturn = (18.4 + (2.5 - zScoreThreshold) * 3.1).toFixed(1);
  const simulatedWinRate = Math.min(78, Math.max(54, Math.round(64 + (zScoreThreshold - 1.5) * 6)));

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
      <PageBackHeader
        title="Worldwide Quant Trading Dashboard & Strategy Encyclopedia"
        subtitle="Global quantitative market centers, mathematical strategy formulations, AI alpha engines, and milestone lessons."
        badge="Global Quant Hub"
      />

      {/* Top Progression & Quant Achievement Milestone Banner */}
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            QUANT STUDY PATH · {completedQuantCount} / {quantStrategies.length} STRATEGY MODULES COMPLETED
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Institutional Quantitative Trading & AI Alpha Curriculum
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Master every institutional quantitative strategy method—from Ornstein-Uhlenbeck Cointegration and Limit Order Book Hawkes Processes to Deep Reinforcement Learning execution. Completing modules updates your Dashboard XP bar and unlocks visual Quant Badges in your Profile.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="glass-panel border border-white/15 rounded-2xl px-4 py-3 text-right tabular-nums">
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Quant Badges Unlocked</div>
            <div className="text-lg font-mono font-black text-emerald-600 dark:text-emerald-400">
              {unlockedQuantBadges} / {quantBadges.length} Badges
            </div>
          </div>
          <button
            onClick={() => setActiveTab('profile')}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20 whitespace-nowrap shrink-0"
          >
            <Award className="w-4 h-4" />
            <span>View Quant Badges</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Worldwide Quantitative Trading Centers Dashboard */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-500" />
              <span>Worldwide Quantitative Execution Hubs</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Global colocation centers, daily algorithmic order flow volume, latency benchmarks, and dominant regional strategies
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-2xl glass-panel border border-white/20 dark:border-white/10 self-start">
            {(['ALL', 'Americas', 'EMEA', 'APAC'] as const).map(reg => (
              <button
                key={reg}
                onClick={() => setRegionFilter(reg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
                  regionFilter === reg
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {reg === 'ALL' ? 'All Regions (6)' : reg}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="worldwide-quant-hubs">
          {filteredHubs.map(hub => (
            <div
              key={hub.id}
              className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-5 space-y-3 shadow-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {hub.region} · {hub.status}
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">{hub.city}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{hub.exchange}</p>
                </div>
                <div className="text-right font-mono tabular-nums">
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{hub.indexChange}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{hub.benchmarkIndex}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-black/5 dark:border-white/10 text-xs font-mono tabular-nums">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Daily Algo Vol</div>
                  <div className="font-bold text-slate-900 dark:text-white">{hub.dailyQuantVolume}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">AI Flow Share</div>
                  <div className="font-bold text-cyan-600 dark:text-cyan-400">{hub.aiOrderFlowShare}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Wire Latency</div>
                  <div className="font-bold text-amber-600 dark:text-amber-400">{hub.latencyBenchmark}</div>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 pt-1">
                <span className="text-slate-500 dark:text-slate-400">Dominant Method: </span>
                <strong className="font-semibold">{hub.dominantStrategy}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Ornstein-Uhlenbeck StatArb Parameter Lab */}
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Interactive Statistical Arbitrage Backtest Sensitivity Lab
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adjust entry Z-score threshold and Kalman cointegration lookback horizon to inspect risk-adjusted performance
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
            Sharpe: {simulatedSharpe} · Est. Alpha: +{simulatedAnnualReturn}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1 tabular-nums">
                <label htmlFor="zscore-slider" className="text-slate-600 dark:text-slate-300 font-semibold">
                  Entry Z-Score Threshold (|Z_t|)
                </label>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">{zScoreThreshold.toFixed(2)} σ</span>
              </div>
              <input
                id="zscore-slider"
                type="range"
                min="1.25"
                max="3.25"
                step="0.25"
                value={zScoreThreshold}
                onChange={e => setZScoreThreshold(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1 tabular-nums">
                <label htmlFor="lookback-slider" className="text-slate-600 dark:text-slate-300 font-semibold">
                  Kalman State Estimation Window
                </label>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">{lookbackDays} Trading Days</span>
              </div>
              <input
                id="lookback-slider"
                type="range"
                min="20"
                max="120"
                step="10"
                value={lookbackDays}
                onChange={e => setLookbackDays(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 glass-panel border border-white/15 rounded-2xl p-4 items-center text-center font-mono tabular-nums">
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Net Sharpe Ratio</div>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{simulatedSharpe}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Annualized Alpha</div>
              <div className="text-lg font-black text-cyan-600 dark:text-cyan-400">+{simulatedAnnualReturn}%</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Mean-Reversion Hit Rate</div>
              <div className="text-lg font-black text-slate-900 dark:text-white">{simulatedWinRate}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Encyclopedia of Quant Strategies: Every Method & Application */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Quantitative Strategy Methods, Mathematical Models & Applications
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete each strategy module to earn XP and unlock the Quant Initiate, Statistical Arbitrage Tactician, and Global Quant Grandmaster badges
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'glass-button text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5" data-testid="quant-strategy-list">
          {filteredStrategies.map(strat => (
            <div
              key={strat.id}
              className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 space-y-4 shadow-xl"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
                    <span>{strat.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{strat.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span>Horizon: {strat.typicalHorizon}</span>
                    <span aria-hidden="true">·</span>
                    <span>+{strat.xpReward} XP</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">{strat.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Method: {strat.mathematicalMethod}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 tabular-nums">
                  <div className="text-right font-mono text-xs">
                    <div className="text-slate-500 dark:text-slate-400">
                      Sharpe <strong className="text-emerald-600 dark:text-emerald-400">{strat.sharpeRatio}</strong> · Alpha{' '}
                      <strong className="text-cyan-600 dark:text-cyan-400">{strat.annualizedAlpha}</strong>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">
                      Max Drawdown: <strong className="text-rose-500">{strat.maxDrawdown}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleQuantStrategyComplete(strat.id)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap shrink-0 ${
                      strat.completed
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white shadow-md shadow-emerald-600/20'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{strat.completed ? 'Completed (+XP Awarded)' : `Complete Strategy Lesson (+${strat.xpReward} XP)`}</span>
                  </button>
                </div>
              </div>

              {/* Mathematical Formulation Box */}
              <div className="glass-panel border border-white/15 rounded-2xl p-3.5 font-mono text-xs text-cyan-700 dark:text-cyan-300 overflow-x-auto">
                <span className="text-slate-400 select-none mr-2">Quantitative Model:</span>
                {strat.formulaLatex}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Core Methodology</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{strat.coreMethodology}</p>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Real-World Market Application</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{strat.realWorldApplication}</p>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Modern AI & Deep Learning Integration</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{strat.aiIntegration}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-black/5 dark:border-white/10 text-xs">
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mb-1.5">Execution Pipeline Steps</div>
                  <ol className="space-y-1 text-slate-600 dark:text-slate-300 list-decimal list-inside">
                    {strat.executionSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    <span>Institutional Risk Controls</span>
                  </div>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
                    {strat.riskControls.map((rc, i) => (
                      <li key={i}>{rc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI & Machine Learning Foundations Reference Section */}
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AI & Machine Learning Paradigms Powering Modern Quantitative & Robotics Systems
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              How foundation architectures bridge sequence modeling, physical robotics, and stochastic market dynamics
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
          <div className="glass-panel border border-white/15 rounded-2xl p-4 space-y-1.5">
            <h3 className="font-bold text-slate-900 dark:text-white">1. Self-Supervised Sequence Transformers</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Scaled dot-product attention captures long-horizon dependencies across both natural language tokens and multi-asset limit order book event streams without recurrent bottleneck decay.
            </p>
          </div>
          <div className="glass-panel border border-white/15 rounded-2xl p-4 space-y-1.5">
            <h3 className="font-bold text-slate-900 dark:text-white">2. Low-Rank Adaptation (LoRA) & RAG</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Freezes base foundation weights and injects rank-decomposed matrices (W_0 + B·A) alongside vector retrieval to ground domain reasoning in verifiable filings and technical telemetry.
            </p>
          </div>
          <div className="glass-panel border border-white/15 rounded-2xl p-4 space-y-1.5">
            <h3 className="font-bold text-slate-900 dark:text-white">3. Alignment (RLHF / DPO) & Continuous RL</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Direct Preference Optimization and Actor-Critic policies align autonomous agents with safety constraints, physical actuator limits, and drawdown-penalized Sharpe objectives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
