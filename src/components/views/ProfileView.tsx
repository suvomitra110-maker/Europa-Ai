import React, { useState } from 'react';
import {
  Award,
  Flame,
  Fingerprint,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Download,
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
  Palette,
  Eye,
  Check,
  RotateCcw,
  Sun,
  Link2,
  Monitor,
  Smartphone,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { PageBackHeader } from '../layout/PageBackHeader';
import { Badge } from '../../types';
import {
  calculateXpProgress,
  DESIGN_THEMES,
  DesignThemeConfig,
  DesignThemeId,
  resolveDesignTheme,
} from '../../utils/progressionLogic';
import { BadgesAndAchievements } from '../profile/BadgesAndAchievements';
import { WixStudioBuilderCard } from '../profile/WixStudioBuilderCard';

type ThemeCategoryFilter =
  | 'all'
  | 'kolkata-durga-puja'
  | 'futuristic'
  | 'original-solar'
  | 'ai-roadster'
  | 'quant-tech'
  | 'deep-space'
  | 'editorial-light';

export const ProfileView: React.FC = () => {
  const {
    user,
    setUser,
    badges,
    unlockBadge,
    achievementMilestones,
    modules,
    completeLesson,
    quantStrategies,
    toggleQuantStrategyComplete,
    setActiveTab,
    showToast,
    designTheme,
    previewDesignTheme,
    activeDesignThemeConfig,
    setDesignTheme,
    setPreviewDesignTheme,
    exportStudyCalendarIcs,
    setShowAuthModal,
  } = useApp();

  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [pathFilter, setPathFilter] = useState<BadgeFilterTab>('all');
  const [themeCategory, setThemeCategory] = useState<ThemeCategoryFilter>('all');
  const [inspectedThemeId, setInspectedThemeId] = useState<DesignThemeId>(
    previewDesignTheme || designTheme
  );
  const [ previewDeviceMode, setPreviewDeviceMode ] = useState<'desktop' | 'website'>('desktop');
  const [connectedServices, setConnectedServices] = useState<Record<string, boolean>>({
    wixStudio: true,
    googleWorkspace: true,
    githubSync: true,
    quantExchangeFeed: true,
    colabNotebook: false,
  });

  const inspectedTheme: DesignThemeConfig = resolveDesignTheme(inspectedThemeId);

  const filteredThemes = DESIGN_THEMES.filter(t => {
    if (themeCategory === 'all') return true;
    return t.category === themeCategory;
  });

  const handlePreviewTheme = (themeId: DesignThemeId) => {
    setInspectedThemeId(themeId);
    setPreviewDesignTheme(themeId);
    const cfg = resolveDesignTheme(themeId);
    showToast(`Live Previewing "${cfg.name}" across app & website.`);
  };

  const handleApplyTheme = (themeId: DesignThemeId) => {
    setInspectedThemeId(themeId);
    setDesignTheme(themeId);
  };

  const handleResetPreview = () => {
    setPreviewDesignTheme(null);
    setInspectedThemeId(designTheme);
    showToast(`Reverted live preview to saved theme "${resolveDesignTheme(designTheme).name}".`);
  };

  const toggleConnector = (key: string, label: string) => {
    setConnectedServices(prev => {
      const next = !prev[key];
      showToast(next ? `Connected ${label} integration.` : `Disconnected ${label} integration.`);
      return { ...prev, [key]: next };
    });
  };

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const aiBadges = badges.filter(b => b.studyPath === 'ai');
  const quantBadges = badges.filter(b => b.studyPath === 'quant');
  const unlockedAiBadges = aiBadges.filter(b => b.unlocked).length;
  const unlockedQuantBadges = quantBadges.filter(b => b.unlocked).length;

  const xpSummary = calculateXpProgress(user.xp, user.level, user.nextLevelXp);

  const completedAiLectures = modules.reduce(
    (sum, m) => sum + m.lectures.filter(l => l.completed).length,
    0
  );
  const totalAiLectures = modules.reduce((sum, m) => sum + m.lectures.length, 0);
  const completedQuantCount = quantStrategies.filter(q => q.completed).length;

  const filteredBadges = badges.filter(b => {
    if (pathFilter === 'all') return true;
    return (b.studyPath || 'general') === pathFilter;
  });

  const toggleBiometric = () => {
    const nextState = !user.biometricEnabled;
    setUser(prev => ({ ...prev, biometricEnabled: nextState }));
    if (nextState) {
      unlockBadge('badge-11');
      showToast('Hardware Biometric Authentication (WebAuthn / FIDO2) enabled.');
    } else {
      showToast('Biometric protection disabled.');
    }
  };

  const celebrateBadge = (badge: Badge) => {
    setSelectedBadge(badge);
    if (badge.unlocked) {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}
    }
  };

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
      case 'Cube':
        return <Box className={sizeClass} />;
      case 'Award':
      default:
        return <Award className={sizeClass} />;
    }
  };

  const getMilestoneForBadge = (badgeId: string) =>
    achievementMilestones.find(m => m.badgeId === badgeId);

  const handleAdvanceAiMilestone = () => {
    for (const mod of modules) {
      const nextLec = mod.lectures.find(l => !l.completed);
      if (nextLec) {
        completeLesson(mod.id, nextLec.id);
        return;
      }
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

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
      <PageBackHeader
        title="Scholar Profile, Theme Studio & Achievements"
        subtitle="Customize 23 bespoke app & website themes with live preview, manage ecosystem connectors, and track AI & Quant badges."
        badge="Learner ID"
      />

      {/* Profile Hero & XP Rank Card */}
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={user.avatar}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-3xl object-cover ring-2 ring-cyan-500/60 shadow-lg"
          />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{user.name}</h1>
              <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                {xpSummary.rankTitle} · {user.role} · via {user.provider}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{user.email}</p>

            <div className="flex items-center gap-3 flex-wrap text-xs text-slate-600 dark:text-slate-300 pt-1 font-medium tabular-nums">
              <span>
                Level: <strong className="text-cyan-600 dark:text-cyan-400 font-mono font-bold">LVL {user.level}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Total XP: <strong className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{user.xp.toLocaleString()} / {user.nextLevelXp.toLocaleString()} XP</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Streak: <strong className="text-amber-500 font-mono font-bold">{user.streakDays} Days</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Badges Unlocked: <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{unlockedCount} / {badges.length}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Active Theme: <strong className="text-cyan-600 dark:text-cyan-400 font-mono font-bold">{activeDesignThemeConfig.name}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-stretch lg:self-auto">
          <button
            onClick={() => setActiveTab('games')}
            className="px-4 py-2.5 rounded-2xl glass-button font-bold text-xs text-cyan-600 dark:text-cyan-400 flex items-center gap-2 cursor-pointer transition whitespace-nowrap shrink-0"
          >
            <span>Play 2D & 3D AI Games</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowCertificate(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition whitespace-nowrap shrink-0"
          >
            <Award className="w-4 h-4" />
            <span>View Study Certificate</span>
          </button>
        </div>
      </div>

      {/* Interactive Glass-Morphism Badges & Achievements Component */}
      <BadgesAndAchievements />

      {/* @wix Studio Site & Custom Element Builder (Allowed & Active) */}
      <div id="wix-builder-anchor">
        <WixStudioBuilderCard />
      </div>

      {/* THEME OPTIONS & LIVE APP / WEBSITE PREVIEW STUDIO (15 CURATED DESIGNS) */}
      <div
        className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
        data-testid="profile-theme-studio"
      >
        <div className="flex flex-col gap-4 border-b border-black/10 dark:border-white/10 pb-5">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Theme Options & Live Preview Studio ({DESIGN_THEMES.length} Designs)
                </h2>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                  · Active: {resolveDesignTheme(designTheme).name}
                  {previewDesignTheme ? ` (Previewing: ${resolveDesignTheme(previewDesignTheme).name})` : ''}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Choose and preview {DESIGN_THEMES.length} bespoke themes—including Kolkata &amp; Durga Puja heritage palettes, Futuristic 3026 HUDs, AI Roadster cockpits, and signature solar presets—across the app and website in real time.
              </p>
            </div>
          </div>

          {/* Theme Category Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl glass-panel border border-white/20 dark:border-white/10 overflow-x-auto w-fit max-w-full">
            {(
              [
                { id: 'all', label: `All (${DESIGN_THEMES.length})` },
                { id: 'kolkata-durga-puja', label: 'Kolkata & Durga Puja (4)' },
                { id: 'futuristic', label: 'Futuristic (4)' },
                { id: 'original-solar', label: 'Original Solar (4)' },
                { id: 'ai-roadster', label: 'AI Roadster (3)' },
                { id: 'quant-tech', label: 'Quant & Cyber (3)' },
                { id: 'deep-space', label: 'Deep Space (2)' },
                { id: 'editorial-light', label: 'Light Studio (3)' },
              ] as { id: ThemeCategoryFilter; label: string }[]
            ).map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setThemeCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
                  themeCategory === tab.id
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Live App & Website Preview Canvas */}
        <div
          className="rounded-3xl border overflow-hidden transition-all duration-500 shadow-lg"
          style={{
            background: inspectedTheme.skyGradient,
            borderColor: inspectedTheme.borderColor,
          }}
          data-testid="theme-live-preview-canvas"
        >
          {/* Preview Toolbar */}
          <div
            className="px-4 sm:px-6 py-3.5 flex flex-col xl:flex-row xl:items-center justify-between gap-3 border-b backdrop-blur-xl"
            style={{
              background: inspectedTheme.panelBg,
              borderColor: inspectedTheme.borderColor,
              color: inspectedTheme.textPrimary,
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: inspectedTheme.accentPrimary }}
                />
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: inspectedTheme.accentSecondary }}
                />
              </div>
              <span className="text-xs font-mono font-bold tracking-tight truncate">
                LIVE PREVIEW: {inspectedTheme.name.toUpperCase()} ({inspectedTheme.mode.toUpperCase()})
              </span>
              <span className="text-xs opacity-75 hidden 2xl:inline truncate">
                · {inspectedTheme.subtitle}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
              {/* Viewport Mode Switcher inside Preview */}
              <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => setPreviewDeviceMode('desktop')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition whitespace-nowrap shrink-0 ${
                    previewDeviceMode === 'desktop' ? 'bg-white/20 text-white' : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>App Workspace</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDeviceMode('website')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition whitespace-nowrap shrink-0 ${
                    previewDeviceMode === 'website' ? 'bg-white/20 text-white' : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Website & Mobile</span>
                </button>
              </div>

              {previewDesignTheme && (
                <button
                  type="button"
                  onClick={handleResetPreview}
                  className="px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/40 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Revert</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handlePreviewTheme(inspectedTheme.id)}
                className="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition whitespace-nowrap shrink-0"
                style={{
                  borderColor: inspectedTheme.accentPrimary,
                  color: inspectedTheme.textPrimary,
                  background: inspectedTheme.cardBg,
                }}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview on Site</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyTheme(inspectedTheme.id)}
                className="px-3.5 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-md whitespace-nowrap shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${inspectedTheme.accentPrimary}, ${inspectedTheme.accentSecondary})`,
                }}
              >
                <Check className="w-3.5 h-3.5" />
                <span>
                  {designTheme === inspectedTheme.id && !previewDesignTheme
                    ? 'Active Theme'
                    : 'Apply & Save'}
                </span>
              </button>
            </div>
          </div>

          {/* Miniature Live App & Website Mockup Stage */}
          <div className="p-4 sm:p-6">
            {previewDeviceMode === 'desktop' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                {/* Simulated Sidebar */}
                <div
                  className="lg:col-span-3 rounded-2xl p-4 border backdrop-blur-md flex flex-col justify-between gap-4"
                  style={{
                    background: inspectedTheme.panelBg,
                    borderColor: inspectedTheme.borderColor,
                    color: inspectedTheme.textPrimary,
                  }}
                >
                  <div className="space-y-2.5">
                    <div className="text-xs font-black tracking-tight flex items-center justify-between">
                      <span>EUROPA AI STUDIO</span>
                      <span className="font-mono text-[10px] opacity-75">{inspectedTheme.badgeText}</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      {['Library & Step-Wise', 'XP Dashboard', 'Quant Trading Hub', 'Profile & Themes'].map(
                        (nav, idx) => (
                          <div
                            key={nav}
                            className="px-3 py-1.5 rounded-xl font-semibold flex items-center justify-between"
                            style={{
                              background:
                                idx === 3
                                  ? `${inspectedTheme.accentPrimary}26`
                                  : 'transparent',
                              border: idx === 3 ? `1px solid ${inspectedTheme.accentPrimary}66` : '1px solid transparent',
                            }}
                          >
                            <span>{nav}</span>
                            {idx === 3 && <span className="text-[10px] font-mono">ACTIVE</span>}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono opacity-80 tabular-nums">
                    <span>Solar: {inspectedTheme.solarPhase.toUpperCase()}</span>
                    <span>{inspectedTheme.sunHour.toFixed(1)}h</span>
                  </div>
                </div>

                {/* Simulated Main App Dashboard & Quant Cards */}
                <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className="rounded-2xl p-4 border backdrop-blur-md space-y-3"
                    style={{
                      background: inspectedTheme.cardBg,
                      borderColor: inspectedTheme.borderColor,
                      color: inspectedTheme.textPrimary,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Live XP Progression Bar</span>
                      <span
                        className="text-xs font-mono font-bold tabular-nums"
                        style={{ color: inspectedTheme.accentPrimary }}
                      >
                        LVL {user.level} · {xpSummary.progressPercent}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-black/20 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${xpSummary.progressPercent}%`,
                          background: `linear-gradient(90deg, ${inspectedTheme.accentPrimary}, ${inspectedTheme.accentSecondary})`,
                        }}
                      />
                    </div>
                    <p className="text-[11px] opacity-80 leading-relaxed">
                      Glassmorphic card surface (`{inspectedTheme.cardBg}`) with `{inspectedTheme.accentPrimary}` primary action highlights.
                    </p>
                  </div>

                  <div
                    className="rounded-2xl p-4 border backdrop-blur-md space-y-3"
                    style={{
                      background: inspectedTheme.cardBg,
                      borderColor: inspectedTheme.borderColor,
                      color: inspectedTheme.textPrimary,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">
                        {inspectedTheme.culturalSpec
                          ? 'Kolkata & Durga Puja Heritage Motif'
                          : inspectedTheme.futuristicSpec
                          ? 'Futuristic 3026 Architecture Spec'
                          : 'Quant Alpha & AI Telemetry'}
                      </span>
                      <span
                        className="text-xs font-mono font-bold tabular-nums"
                        style={{ color: inspectedTheme.accentSecondary }}
                      >
                        {inspectedTheme.culturalSpec
                          ? inspectedTheme.culturalSpec.season
                          : inspectedTheme.futuristicSpec
                          ? inspectedTheme.futuristicSpec.era
                          : 'Sharpe 2.84 · +18.6%'}
                      </span>
                    </div>

                    {inspectedTheme.culturalSpec && (
                      <div className="text-[11px] font-mono space-y-1 pt-0.5">
                        <div className="font-bold" style={{ color: inspectedTheme.accentPrimary }}>
                          Motif: {inspectedTheme.culturalSpec.motif}
                        </div>
                        <div className="opacity-90">Landmark: {inspectedTheme.culturalSpec.landmark}</div>
                        <div className="opacity-80">Ambiance: {inspectedTheme.culturalSpec.ambiance}</div>
                      </div>
                    )}

                    {inspectedTheme.futuristicSpec && (
                      <div className="text-[11px] font-mono space-y-1 pt-0.5">
                        <div className="font-bold" style={{ color: inspectedTheme.accentPrimary }}>
                          Core: {inspectedTheme.futuristicSpec.architecture}
                        </div>
                        <div className="opacity-90">Compute: {inspectedTheme.futuristicSpec.computeDensity}</div>
                        <div className="opacity-80">Power: {inspectedTheme.futuristicSpec.energyCore}</div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      {inspectedTheme.swatchColors.map((hex, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] font-mono">
                          <span
                            className="w-4 h-4 rounded-md border border-white/20 shrink-0"
                            style={{ backgroundColor: hex }}
                          />
                          <span className="hidden xl:inline">{hex}</span>
                        </div>
                      ))}
                    </div>
                    {!inspectedTheme.culturalSpec && !inspectedTheme.futuristicSpec && (
                      <p className="text-[11px] opacity-80 leading-relaxed">
                        WCAG contrast-calibrated text (`{inspectedTheme.textPrimary}`) over dynamic celestial sky backdrop.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Website & Mobile Responsive Preview */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div
                  className="md:col-span-2 rounded-2xl p-5 border backdrop-blur-md space-y-3"
                  style={{
                    background: inspectedTheme.cardBg,
                    borderColor: inspectedTheme.borderColor,
                    color: inspectedTheme.textPrimary,
                  }}
                >
                  <div className="text-xs font-mono uppercase tracking-wider opacity-75">
                    Europa Ai · Public Website Hero Preview
                  </div>
                  <h3 className="text-lg font-black tracking-tight">
                    Master Frontier AI Engineering & Quantitative Finance
                  </h3>
                  <p className="text-xs opacity-80 leading-relaxed">
                    Experience step-wise technical and non-technical learning paths, real-time global quant strategy execution, and verified scholar badges in {inspectedTheme.name}.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span
                      className="px-3.5 py-1.5 rounded-xl text-white text-xs font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${inspectedTheme.accentPrimary}, ${inspectedTheme.accentSecondary})`,
                      }}
                    >
                      Launch Curriculum
                    </span>
                    <span className="text-xs font-mono opacity-75">
                      Mode: {inspectedTheme.mode.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div
                  className="rounded-2xl p-4 border backdrop-blur-md space-y-2.5 max-w-xs mx-auto w-full"
                  style={{
                    background: inspectedTheme.panelBg,
                    borderColor: inspectedTheme.borderColor,
                    color: inspectedTheme.textPrimary,
                  }}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span>9:41 AM</span>
                    <span>PWA Mobile View</span>
                  </div>
                  <div
                    className="p-3 rounded-xl border text-xs space-y-1"
                    style={{
                      background: inspectedTheme.cardBg,
                      borderColor: inspectedTheme.borderColor,
                    }}
                  >
                    <div className="font-bold">{inspectedTheme.name}</div>
                    <div className="text-[11px] opacity-75">Touch-ready bottom dock & glass cards</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 12 Themes Selection Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          data-testid="profile-themes-grid"
        >
          {filteredThemes.map((tItem, index) => {
            const isSavedActive = designTheme === tItem.id && !previewDesignTheme;
            const isPreviewing = previewDesignTheme === tItem.id;
            const isInspected = inspectedThemeId === tItem.id;

            return (
              <div
                key={tItem.id}
                onClick={() => handlePreviewTheme(tItem.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePreviewTheme(tItem.id);
                  }
                }}
                aria-label={`Theme ${index + 1}: ${tItem.name}`}
                className={`rounded-3xl border p-4 flex flex-col justify-between gap-3.5 transition-all cursor-pointer hover:-translate-y-0.5 ${
                  isSavedActive || isPreviewing
                    ? 'ring-2 ring-cyan-500 border-cyan-500/60 glass-card shadow-lg'
                    : isInspected
                    ? 'border-indigo-500/50 glass-card'
                    : 'border-white/20 dark:border-white/10 glass-panel hover:border-cyan-500/40'
                }`}
              >
                <div className="space-y-3">
                  {/* Visual Theme Swatch Banner */}
                  <div
                    className="h-24 rounded-2xl p-3 flex flex-col justify-between border relative overflow-hidden"
                    style={{
                      background: tItem.skyGradient,
                      borderColor: tItem.borderColor,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 z-10">
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md backdrop-blur-md whitespace-nowrap truncate"
                        style={{
                          background: tItem.cardBg,
                          color: tItem.textPrimary,
                          border: `1px solid ${tItem.borderColor}`,
                        }}
                      >
                        {String(index + 1).padStart(2, '0')} · {tItem.badgeText}
                      </span>
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 whitespace-nowrap shrink-0"
                        style={{
                          background: tItem.panelBg,
                          color: tItem.textPrimary,
                        }}
                      >
                        {tItem.mode === 'light' ? (
                          <Sun className="w-3 h-3 text-amber-400" />
                        ) : (
                          <Moon className="w-3 h-3 text-cyan-400" />
                        )}
                        {tItem.mode.toUpperCase()}
                      </span>
                    </div>

                    {/* Mini Glass Card Preview Bar inside Swatch */}
                    <div
                      className="rounded-xl px-2.5 py-1.5 flex items-center justify-between z-10 backdrop-blur-md"
                      style={{
                        background: tItem.cardBg,
                        border: `1px solid ${tItem.borderColor}`,
                        color: tItem.textPrimary,
                      }}
                    >
                      <span className="text-[11px] font-bold truncate">{tItem.name}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        {tItem.swatchColors.map((hex, idx) => (
                          <span
                            key={idx}
                            className="w-3 h-3 rounded-full border border-white/30"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Theme Title & Subtitle */}
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{tItem.name}</span>
                        {isSavedActive && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                      </h3>
                      {isPreviewing && (
                        <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400">
                          PREVIEWING
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {tItem.subtitle}
                    </p>
                    {tItem.culturalSpec && (
                      <div className="mt-1.5 text-[10px] font-mono font-semibold text-amber-600 dark:text-amber-400 truncate">
                        {tItem.culturalSpec.motif} · {tItem.culturalSpec.season}
                      </div>
                    )}
                    {tItem.futuristicSpec && (
                      <div className="mt-1.5 text-[10px] font-mono font-semibold text-cyan-600 dark:text-cyan-400 truncate">
                        {tItem.futuristicSpec.era} · {tItem.futuristicSpec.architecture}
                      </div>
                    )}
                    {tItem.roadsterSpec && (
                      <div className="mt-1.5 text-[10px] font-mono font-semibold text-rose-600 dark:text-rose-400 tabular-nums truncate">
                        {tItem.roadsterSpec.zeroToSixty} · {tItem.roadsterSpec.aeroDragCd}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons: Preview & Apply */}
                <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/10">
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handlePreviewTheme(tItem.id);
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-xl glass-button text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-cyan-500 flex items-center justify-center gap-1 cursor-pointer transition whitespace-nowrap shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handleApplyTheme(tItem.id);
                    }}
                    className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition whitespace-nowrap shrink-0 ${
                      isSavedActive
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-sm'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isSavedActive ? 'Applied' : 'Use Theme'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connected Ecosystem & Data Connectors Hub */}
      <div
        className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-xl space-y-4"
        data-testid="profile-connectors-hub"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Connected Study & Quant Ecosystem Connectors
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Synchronize your study schedule, OAuth identity, and quantitative notebooks with external connectors.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportStudyCalendarIcs}
              className="px-3.5 py-1.5 rounded-xl glass-button text-xs font-bold text-cyan-600 dark:text-cyan-400 cursor-pointer whitespace-nowrap shrink-0"
            >
              Export Calendar (.ics)
            </button>
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
            >
              Manage OAuth Account
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              key: 'wixStudio',
              name: '@wix Studio & CMS',
              desc: 'Syncs solar & AI Roadster theme tokens',
            },
            {
              key: 'googleWorkspace',
              name: 'Google Calendar & Drive',
              desc: 'Syncs exam deadlines & study notes',
            },
            {
              key: 'githubSync',
              name: 'GitHub Code & Gists',
              desc: 'Pushes PyTorch & Quant backtest scripts',
            },
            {
              key: 'quantExchangeFeed',
              name: 'Global Quant Telemetry',
              desc: 'Live NY4 / LD4 / TY3 order-book feed',
            },
            {
              key: 'colabNotebook',
              name: 'Jupyter / Colab Bridge',
              desc: 'Exports LoRA & StatArb lab notebooks',
            },
          ].map(conn => {
            const active = !!connectedServices[conn.key];
            return (
              <div
                key={conn.key}
                className="glass-panel rounded-2xl p-3.5 border border-white/15 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{conn.name}</span>
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      {active ? 'CONNECTED' : 'IDLE'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{conn.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleConnector(conn.key, conn.name)}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                    active
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      : 'glass-button text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {active ? 'Active Connector' : 'Connect Service'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Biometric Privacy & Security Hardware Widget */}
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Fingerprint className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Biometric Authentication & Private Key Storage
              </h3>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                · WebAuthn FIDO2
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Require hardware fingerprint or FaceID confirmation before decrypting local offline study notes.
            </p>
          </div>
        </div>

        <button
          onClick={toggleBiometric}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border whitespace-nowrap shrink-0 ${
            user.biometricEnabled
              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 shadow-sm'
              : 'glass-button text-slate-700 dark:text-slate-300 hover:text-cyan-500'
          }`}
        >
          {user.biometricEnabled ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4" />}
          <span>{user.biometricEnabled ? 'Biometrics Active' : 'Enable Biometrics'}</span>
        </button>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="certificate-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="glass-card border border-amber-500/60 rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative text-slate-900 dark:text-slate-100 flex flex-col gap-6">
            <button
              onClick={() => setShowCertificate(false)}
              aria-label="Close certificate modal"
              className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 cursor-pointer"
            >
              ✕
            </button>

            <div className="p-8 border-4 border-double border-amber-500/50 rounded-2xl glass-panel text-center space-y-4">
              <div className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
                Europa Ai · Verified Academic & Quantitative Certification
              </div>

              <h2 id="certificate-modal-title" className="text-2xl font-serif font-black text-slate-900 dark:text-white">
                Certificate of AI & Quantitative Mastery
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">This certifies that</p>
              <h3 className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono tracking-tight">{user.name}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                has demonstrated verified proficiency across <strong>Transformer Attention Architectures, LoRA Fine-Tuning, Embodied Robotics Kinematics, and Statistical Arbitrage Quantitative Systems</strong> with {unlockedCount} verified achievement badges.
              </p>

              <div className="pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 font-mono tabular-nums">
                <span>Issue Date: 2026-10-17</span>
                <span>ID: EUROPA-CERT-9042</span>
                <span>Level {user.level} ({user.xp} XP)</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-md shadow-cyan-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Print / Download Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
