import React, { useState } from 'react';
import {
  Award,
  Flame,
  Fingerprint,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  Sparkles,
  Bot,
  Globe,
  LineChart,
  BookOpen,
  QrCode,
  Moon,
  Briefcase,
  MessageSquare,
  WifiOff,
  Box,
  ArrowRight,
  Zap,
  Gamepad2,
  Gauge,
  Check,
  Activity,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../types';

type MilestoneFilterTab = 'all' | 'ai' | 'quant' | 'games' | 'general';
type UnlockStatusFilter = 'all' | 'unlocked' | 'locked';

export const BadgesAndAchievements: React.FC = () => {
  const {
    user,
    badges,
    unlockBadge,
    achievementMilestones,
    modules,
    completeLesson,
    quantStrategies,
    toggleQuantStrategyComplete,
    notes,
    quickCaptureNote,
    stepWisePlans,
    toggleStepComplete,
    gameStats,
    setActiveTab,
    setActiveGameMode,
    showToast,
  } = useApp();

  const [pathFilter, setPathFilter] = useState<MilestoneFilterTab>('all');
  const [statusFilter, setStatusFilter] = useState<UnlockStatusFilter>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [hoveredBadgeId, setHoveredBadgeId] = useState<string | null>(null);

  const completedAiLectures = modules.reduce(
    (sum, m) => sum + m.lectures.filter(l => l.completed).length,
    0
  );
  const totalAiLectures = modules.reduce((sum, m) => sum + m.lectures.length, 0);
  const completedQuantCount = quantStrategies.filter(q => q.completed).length;
  const completedStepsCount = stepWisePlans.filter(s => s.completed).length;

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const aiBadges = badges.filter(b => b.studyPath === 'ai');
  const quantBadges = badges.filter(b => b.studyPath === 'quant');
  const gameBadges = badges.filter(b => b.id === 'badge-17' || b.id === 'badge-18' || b.category === 'voxel');

  const getMilestoneForBadge = (badgeId: string) =>
    achievementMilestones.find(m => m.badgeId === badgeId);

  const filteredBadges = badges.filter(b => {
    if (statusFilter === 'unlocked' && !b.unlocked) return false;
    if (statusFilter === 'locked' && b.unlocked) return false;

    if (pathFilter === 'all') return true;
    if (pathFilter === 'games') {
      return b.id === 'badge-17' || b.id === 'badge-18' || b.category === 'voxel';
    }
    return (b.studyPath || 'general') === pathFilter;
  });

  const renderBadgeIcon = (badge: Badge, sizeClass = 'w-6 h-6') => {
    switch (badge.icon) {
      case 'BrainCircuit':
        return <BrainCircuit className={sizeClass} />;
      case 'Sparkles':
        return <Sparkles className={sizeClass} />;
      case 'Bot':
        return <Bot className={sizeClass} />;
      case 'TrendingUp':
        return <TrendingUp className={sizeClass} />;
      case 'LineChart':
        return <LineChart className={sizeClass} />;
      case 'Globe':
        return <Globe className={sizeClass} />;
      case 'Flame':
        return <Flame className={sizeClass} />;
      case 'BookOpen':
        return <BookOpen className={sizeClass} />;
      case 'QrCode':
        return <QrCode className={sizeClass} />;
      case 'Moon':
        return <Moon className={sizeClass} />;
      case 'Briefcase':
        return <Briefcase className={sizeClass} />;
      case 'MessageSquare':
        return <MessageSquare className={sizeClass} />;
      case 'WifiOff':
        return <WifiOff className={sizeClass} />;
      case 'Fingerprint':
        return <Fingerprint className={sizeClass} />;
      case 'Gamepad2':
        return <Gamepad2 className={sizeClass} />;
      case 'Gauge':
        return <Gauge className={sizeClass} />;
      case 'Cube':
        return <Box className={sizeClass} />;
      case 'Award':
      default:
        return <Award className={sizeClass} />;
    }
  };

  const handleAdvanceAiMilestone = () => {
    for (const mod of modules) {
      const nextLec = mod.lectures.find(l => !l.completed);
      if (nextLec) {
        completeLesson(mod.id, nextLec.id);
        return;
      }
    }
    const nextStep = stepWisePlans.find(s => !s.completed);
    if (nextStep) {
      toggleStepComplete(nextStep.id);
      return;
    }
    unlockBadge('badge-13');
  };

  const handleAdvanceQuantMilestone = () => {
    const nextQuant = quantStrategies.find(q => !q.completed);
    if (nextQuant) {
      toggleQuantStrategyComplete(nextQuant.id);
    } else {
      unlockBadge('badge-16');
    }
  };

  const handleLogQuickStudyNote = () => {
    quickCaptureNote(
      'Derived multi-head self-attention complexity and pair-trading Ornstein-Uhlenbeck half-life equations.',
      `Milestone Study Note #${notes.length + 1}`,
      'AI & Quant Synthesis'
    );
  };

  const handleLaunchGame = (mode: '2d' | '3d') => {
    setActiveGameMode(mode);
    setActiveTab('games');
  };

  const inspectAndCelebrateBadge = (badge: Badge) => {
    setSelectedBadge(badge);
    if (badge.unlocked) {
      try {
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { y: 0.7 },
        });
      } catch {}
    } else {
      showToast(`Inspecting milestone: "${badge.name}" — ${badge.milestoneCriterion || 'In progress'}`);
    }
  };

  // Interactive learning milestone cards (top 6 tracked milestones with direct actions)
  const interactiveMilestones = [
    {
      id: 'ms-ai-core',
      title: 'AI & Robotics Lecture Mastery',
      subtitle: 'Complete video lectures across Transformers, LoRA, RLHF & ROS2 Kinematics',
      current: completedAiLectures,
      target: totalAiLectures,
      unit: 'Lectures',
      xpReward: 300,
      accent: 'from-cyan-500 to-indigo-600',
      borderAccent: 'border-cyan-500/40',
      textAccent: 'text-cyan-600 dark:text-cyan-400',
      icon: <BrainCircuit className="w-5 h-5" />,
      actionLabel: 'Log AI Lecture (+140 XP)',
      onAction: handleAdvanceAiMilestone,
    },
    {
      id: 'ms-quant-alpha',
      title: 'Worldwide Quant Strategy Mastery',
      subtitle: 'Master Statistical Arbitrage, HFT Microstructure, Deep RL & Volatility Surfaces',
      current: completedQuantCount,
      target: quantStrategies.length,
      unit: 'Strategies',
      xpReward: 350,
      accent: 'from-emerald-500 to-teal-600',
      borderAccent: 'border-emerald-500/40',
      textAccent: 'text-emerald-600 dark:text-emerald-400',
      icon: <TrendingUp className="w-5 h-5" />,
      actionLabel: 'Master Quant Strategy',
      onAction: handleAdvanceQuantMilestone,
    },
    {
      id: 'ms-3d-roadster',
      title: '3D AI Roadster Telemetry Challenge',
      subtitle: 'Pilot the 3D Autonomous Roadster at 240+ MPH and score 1,500+ telemetry points',
      current: gameStats.highScore3D,
      target: 1500,
      unit: '3D Score',
      xpReward: 250,
      accent: 'from-rose-500 to-amber-500',
      borderAccent: 'border-rose-500/40',
      textAccent: 'text-rose-600 dark:text-rose-400',
      icon: <Gauge className="w-5 h-5" />,
      actionLabel: 'Play 3D Roadster Game',
      onAction: () => handleLaunchGame('3d'),
    },
    {
      id: 'ms-2d-collider',
      title: '2D Quant Alpha Collider Physics',
      subtitle: 'Harvest Alpha orbs using 2D elastic collision physics and score 1,000+ points',
      current: gameStats.highScore2D,
      target: 1000,
      unit: '2D Score',
      xpReward: 200,
      accent: 'from-indigo-500 to-purple-600',
      borderAccent: 'border-indigo-500/40',
      textAccent: 'text-indigo-600 dark:text-indigo-400',
      icon: <Gamepad2 className="w-5 h-5" />,
      actionLabel: 'Play 2D Collider Game',
      onAction: () => handleLaunchGame('2d'),
    },
  ];

  return (
    <section
      className="space-y-6"
      data-testid="badges-achievements-component"
      aria-label="Badges and Achievements Learning Milestones"
    >
      {/* Glass-Morphism Live Activity Telemetry & Interactive Milestone Cards */}
      <div className="glass-card border border-white/25 dark:border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Badges & Achievements · Live Learning Milestone Tracker
                  </h2>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    @wix Custom Element · ALLOWED
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time activity telemetry across AI lectures, Quant strategies, study notes, and playable 2D & 3D simulation games
                </p>
              </div>
            </div>
          </div>

          {/* Quick Activity & Game Launch Bar */}
          <div className="flex flex-wrap xl:flex-nowrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleLogQuickStudyNote}
              className="px-3 py-2 rounded-xl glass-button text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-cyan-500 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Note ({notes.length})</span>
            </button>
            <button
              type="button"
              onClick={() => handleLaunchGame('2d')}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Play 2D Game</span>
            </button>
            <button
              type="button"
              onClick={() => handleLaunchGame('3d')}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-95 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>Play 3D Roadster</span>
            </button>
          </div>
        </div>

        {/* 6-Pillar Live User Activity Telemetry Strip */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
          data-testid="user-activity-telemetry-strip"
        >
          {[
            {
              label: 'AI Lectures Done',
              value: `${completedAiLectures} / ${totalAiLectures}`,
              sub: `${Math.round((completedAiLectures / Math.max(1, totalAiLectures)) * 100)}% curriculum`,
            },
            {
              label: 'Quant Strategies',
              value: `${completedQuantCount} / ${quantStrategies.length}`,
              sub: 'Global alpha methods',
            },
            {
              label: 'Roadmap Steps',
              value: `${completedStepsCount} / ${stepWisePlans.length}`,
              sub: 'Step-wise checkpoints',
            },
            {
              label: 'Study Notes',
              value: `${notes.length} Notes`,
              sub: 'Structured takeaways',
            },
            {
              label: '2D Collider Best',
              value: `${gameStats.highScore2D.toLocaleString()} pts`,
              sub: `${gameStats.totalOrbsCollected} orbs harvested`,
            },
            {
              label: '3D Roadster Best',
              value: `${gameStats.highScore3D.toLocaleString()} pts`,
              sub: `${gameStats.gamesPlayed} runs completed`,
            },
          ].map(stat => (
            <div
              key={stat.label}
              className="glass-panel rounded-2xl p-3.5 border border-white/20 dark:border-white/10 flex flex-col justify-between backdrop-blur-xl"
            >
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {stat.label}
              </span>
              <span className="text-base font-black font-mono text-slate-900 dark:text-white tabular-nums mt-1">
                {stat.value}
              </span>
              <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono tabular-nums mt-0.5">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>

        {/* Interactive Glass-Morphism Learning Milestone Progress Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          data-testid="interactive-milestone-glass-cards"
        >
          {interactiveMilestones.map(ms => {
            const pct = Math.min(100, Math.round((ms.current / Math.max(1, ms.target)) * 100));
            const isComplete = ms.current >= ms.target;
            return (
              <div
                key={ms.id}
                className={`glass-card backdrop-blur-2xl rounded-3xl p-5 border ${ms.borderAccent} flex flex-col justify-between gap-4 transition-transform duration-200 hover:-translate-y-0.5 shadow-lg`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${ms.accent} text-white flex items-center justify-center shrink-0 shadow-md`}
                      >
                        {ms.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{ms.title}</span>
                          {isComplete && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {ms.subtitle}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-mono font-bold tabular-nums shrink-0 ${ms.textAccent}`}>
                      {pct}% · +{ms.xpReward} XP
                    </span>
                  </div>

                  {/* Glass Progress Bar */}
                  <div className="w-full bg-black/10 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${ms.accent} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1 border-t border-black/5 dark:border-white/10">
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-300 tabular-nums">
                    Progress: <strong>{ms.current.toLocaleString()}</strong> / {ms.target.toLocaleString()} {ms.unit}
                  </span>
                  <button
                    type="button"
                    onClick={ms.onAction}
                    className={`px-3.5 py-1.5 rounded-xl bg-gradient-to-r ${ms.accent} hover:opacity-95 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{ms.actionLabel}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified Achievement Badges Grid with Interactive Glass-Morphism Cards */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Interactive Glass-Morphism Achievement Badges ({unlockedCount}/{badges.length} Unlocked)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any glass-morphism badge card to inspect milestone telemetry, celebration effects, and study path actions
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Path Filter Segmented Control */}
            <div className="flex items-center gap-1 p-1 rounded-2xl glass-panel border border-white/20 dark:border-white/10">
              {(
                [
                  { id: 'all', label: `All (${badges.length})` },
                  { id: 'ai', label: `AI Path (${aiBadges.length})` },
                  { id: 'quant', label: `Quant Path (${quantBadges.length})` },
                  { id: 'games', label: `2D & 3D Games (${gameBadges.length})` },
                  { id: 'general', label: 'Core & Streak' },
                ] as { id: MilestoneFilterTab; label: string }[]
              ).map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPathFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
                    pathFilter === tab.id
                      ? 'bg-cyan-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Status Filter Segmented Control */}
            <div className="flex items-center gap-1 p-1 rounded-2xl glass-panel border border-white/20 dark:border-white/10">
              {(
                [
                  { id: 'all', label: 'All States' },
                  { id: 'unlocked', label: `Unlocked (${unlockedCount})` },
                  { id: 'locked', label: `In Progress (${badges.length - unlockedCount})` },
                ] as { id: UnlockStatusFilter; label: string }[]
              ).map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
                    statusFilter === st.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          data-testid="achievement-badges-grid"
        >
          {filteredBadges.map(b => {
            const isUnlocked = b.unlocked;
            const isHovered = hoveredBadgeId === b.id;
            const milestone = getMilestoneForBadge(b.id);
            const pct = isUnlocked ? 100 : milestone ? milestone.progressPercent : 35;

            let cardStyle = 'border-white/25 dark:border-white/15 glass-card backdrop-blur-xl';
            let medallionStyle = 'bg-slate-500/15 text-slate-500 border-slate-500/30';

            if (isUnlocked) {
              if (b.rarity === 'legendary') {
                cardStyle = 'border-amber-500/60 bg-amber-500/10 dark:bg-amber-500/15 backdrop-blur-2xl shadow-lg shadow-amber-500/10';
                medallionStyle =
                  'bg-gradient-to-br from-amber-400 to-orange-600 text-white border-amber-300 shadow-md shadow-amber-500/25';
              } else if (b.rarity === 'epic') {
                cardStyle = 'border-indigo-500/60 bg-indigo-500/10 dark:bg-indigo-500/15 backdrop-blur-2xl shadow-lg shadow-indigo-500/10';
                medallionStyle =
                  'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-300 shadow-md shadow-indigo-500/25';
              } else if (b.rarity === 'rare') {
                cardStyle = 'border-cyan-500/60 bg-cyan-500/10 dark:bg-cyan-500/15 backdrop-blur-2xl shadow-lg shadow-cyan-500/10';
                medallionStyle =
                  'bg-gradient-to-br from-cyan-500 to-teal-600 text-white border-cyan-300 shadow-md shadow-cyan-500/25';
              } else {
                cardStyle = 'border-emerald-500/50 bg-emerald-500/10 dark:bg-emerald-500/15 backdrop-blur-2xl';
                medallionStyle =
                  'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-300';
              }
            }

            const pathLabel =
              b.id === 'badge-17' || b.id === 'badge-18'
                ? '2D/3D Arcade'
                : b.studyPath === 'ai'
                ? 'AI Path'
                : b.studyPath === 'quant'
                ? 'Quant Path'
                : 'Core Milestone';

            return (
              <button
                type="button"
                key={b.id}
                onMouseEnter={() => setHoveredBadgeId(b.id)}
                onMouseLeave={() => setHoveredBadgeId(null)}
                onClick={() => inspectAndCelebrateBadge(b)}
                className={`border rounded-3xl p-5 flex flex-col justify-between text-left gap-4 transition-all duration-200 cursor-pointer hover:-translate-y-1 ${cardStyle} ${
                  isUnlocked ? 'opacity-100' : 'opacity-85 hover:opacity-100'
                } ${isHovered ? 'ring-2 ring-cyan-400/60' : ''}`}
              >
                <div className="space-y-3 w-full">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isHovered ? 'scale-105' : ''
                      } ${medallionStyle}`}
                    >
                      {renderBadgeIcon(b, 'w-6 h-6')}
                    </div>
                    <div className="text-right font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      <div>
                        {pathLabel} · {b.rarity.toUpperCase()}
                      </div>
                      <div className="text-cyan-600 dark:text-cyan-400 font-bold">
                        +{b.xpReward || 150} XP
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{b.name}</span>
                      {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </div>

                <div className="w-full space-y-2 pt-2 border-t border-black/5 dark:border-white/10">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    <span className="truncate max-w-[175px]">
                      {b.milestoneCriterion || (milestone ? milestone.milestoneLabel : 'Milestone quest')}
                    </span>
                    <span className="font-bold shrink-0">
                      {isUnlocked
                        ? 'UNLOCKED'
                        : milestone
                        ? `${milestone.currentValue}/${milestone.targetValue}`
                        : 'IN PROGRESS'}
                    </span>
                  </div>

                  <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked
                          ? 'bg-emerald-500'
                          : b.studyPath === 'quant'
                          ? 'bg-emerald-500/80'
                          : 'bg-cyan-500/80'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Badge Interactive Glass-Morphism Detail Modal */}
      {selectedBadge && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="badge-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="glass-card border border-white/25 dark:border-white/15 rounded-3xl max-w-md w-full p-6 text-center space-y-4 text-slate-900 dark:text-white shadow-2xl relative backdrop-blur-2xl">
            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              aria-label="Close badge details"
              className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 cursor-pointer text-sm font-bold px-2 py-1"
            >
              ✕
            </button>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center shadow-xl">
              {renderBadgeIcon(selectedBadge, 'w-8 h-8')}
            </div>
            <div>
              <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                {(selectedBadge.studyPath || 'general').toUpperCase()} PATH · {selectedBadge.rarity.toUpperCase()} BADGE · +{selectedBadge.xpReward || 150} XP
              </div>
              <h3 id="badge-modal-title" className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {selectedBadge.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {selectedBadge.description}
              </p>
            </div>

            {selectedBadge.milestoneCriterion && (
              <div className="glass-panel rounded-2xl p-3 text-xs text-slate-700 dark:text-slate-200 border border-white/15">
                <div className="font-semibold">Milestone Requirement</div>
                <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedBadge.milestoneCriterion}
                </div>
              </div>
            )}

            <div className="text-xs font-mono text-slate-500 pt-2 border-t border-black/10 dark:border-white/10">
              {selectedBadge.unlocked
                ? `Unlocked on ${selectedBadge.unlockedAt || '2026-10-18'} · Verified on Scholar Ledger`
                : 'Complete the activity milestone or click below to advance directly'}
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              {!selectedBadge.unlocked && (
                <>
                  {selectedBadge.id === 'badge-17' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBadge(null);
                        handleLaunchGame('2d');
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>Play 2D Collider Game</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : selectedBadge.id === 'badge-18' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBadge(null);
                        handleLaunchGame('3d');
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>Play 3D Roadster Game</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : selectedBadge.studyPath === 'quant' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBadge(null);
                        setActiveTab('quant-trading');
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>Open Quant Trading Path</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBadge(null);
                        setActiveTab('dashboard');
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>Continue Study Path</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      unlockBadge(selectedBadge.id);
                      setSelectedBadge(prev => (prev ? { ...prev, unlocked: true } : null));
                    }}
                    className="px-4 py-2 rounded-xl glass-button text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Claim Milestone</span>
                  </button>
                </>
              )}
              {selectedBadge.unlocked && (
                <button
                  type="button"
                  onClick={() => setSelectedBadge(null)}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
