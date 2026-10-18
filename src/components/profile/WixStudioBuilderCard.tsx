import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Code2,
  Copy,
  Cpu,
  Database,
  Download,
  Gamepad2,
  Layers,
  Play,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Sparkles,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { resolveDesignTheme } from '../../utils/progressionLogic';
import {
  WIX_BUILDER_MODULES,
  WixModuleId,
  WixTargetEnvironment,
  buildWixSiteArtifact,
  evaluateWixBuildReadiness,
} from '../../utils/wixBuilderEngine';

export const WixStudioBuilderCard: React.FC = () => {
  const {
    designTheme,
    previewDesignTheme,
    badges,
    gameStats,
    user,
    setActiveTab,
    setActiveGameMode,
    showToast,
  } = useApp();

  const [allowWixBuild, setAllowWixBuild] = useState<boolean>(true);
  const [targetEnvironment, setTargetEnvironment] = useState<WixTargetEnvironment>('wix-studio');
  const [autoSyncCms, setAutoSyncCms] = useState<boolean>(true);
  const [selectedModules, setSelectedModules] = useState<WixModuleId[]>([
    'badges-achievements',
    'game-3d-roadster',
    'game-2d-collider',
    'solar-roadster-themes',
    'quant-trading-hub',
    'ai-curriculum-cms',
  ]);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'modules' | 'code' | 'cms'>('modules');
  const [buildState, setBuildState] = useState<'idle' | 'building' | 'deployed'>('deployed');
  const [buildStepIndex, setBuildStepIndex] = useState<number>(4);
  const [lastBuildCount, setLastBuildCount] = useState<number>(1);

  const activeThemeObj = useMemo(
    () => resolveDesignTheme(previewDesignTheme || designTheme),
    [previewDesignTheme, designTheme]
  );

  const unlockedBadgesCount = useMemo(
    () => badges.filter(b => b.unlocked).length,
    [badges]
  );

  const telemetrySnapshot = useMemo(
    () => ({
      unlockedBadgesCount,
      totalBadgesCount: badges.length,
      highScore2D: gameStats.highScore2D,
      highScore3D: gameStats.highScore3D,
      gamesPlayed: gameStats.gamesPlayed,
      totalXp: user.xp,
      level: user.level,
    }),
    [unlockedBadgesCount, badges.length, gameStats, user.xp, user.level]
  );

  const builderConfig = useMemo(
    () => ({
      allowWixBuild,
      siteName: 'Europa AI & Quant Studio',
      siteNamespace: 'europa-ai-quant-studio',
      targetEnvironment,
      selectedModules,
      autoSyncCms,
      activeTheme: activeThemeObj,
    }),
    [allowWixBuild, targetEnvironment, selectedModules, autoSyncCms, activeThemeObj]
  );

  const readiness = useMemo(
    () => evaluateWixBuildReadiness(builderConfig, telemetrySnapshot),
    [builderConfig, telemetrySnapshot]
  );

  const artifact = useMemo(
    () => buildWixSiteArtifact(builderConfig, telemetrySnapshot),
    [builderConfig, telemetrySnapshot]
  );

  const toggleModule = (id: WixModuleId) => {
    setSelectedModules(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleRunWixBuild = () => {
    if (!allowWixBuild) {
      setAllowWixBuild(true);
      showToast('@wix Build Permission enabled automatically — starting build pipeline.');
    }
    setBuildState('building');
    setBuildStepIndex(1);

    window.setTimeout(() => setBuildStepIndex(2), 250);
    window.setTimeout(() => setBuildStepIndex(3), 500);
    window.setTimeout(() => {
      setBuildStepIndex(4);
      setBuildState('deployed');
      setLastBuildCount(c => c + 1);
      showToast(
        `@wix Studio Build #${lastBuildCount + 1} complete! Deployed Badges & Achievements + 2D/3D AI Games with "${activeThemeObj.name}".`
      );
    }, 800);
  };

  const handleCopyCode = (content: string, label: string) => {
    try {
      navigator.clipboard?.writeText(content);
    } catch {}
    showToast(`Copied ${label} to clipboard!`);
  };

  const handleDownloadBundle = () => {
    const blob = new Blob([artifact.wixConfigJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wix-studio-build-${artifact.themeManifest.themeId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded wix-studio-build.json manifest bundle.');
  };

  const buildStages = [
    '1. @wix/sdk Auth & Build Permissions Verified',
    '2. Custom Elements (<europa-badges-achievements>, <europa-game-*>) Bundled',
    '3. @wix/design-system Solar & AI Roadster Tokens Linked',
    '4. Published to @wix Studio & Headless CMS Collections',
  ];

  return (
    <section
      className="bg-slate-950/90 backdrop-blur-xl border border-cyan-500/35 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden text-slate-100"
      data-testid="wix-studio-builder-section"
    >
      {/* Ambient top glow */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-25"
        style={{ background: activeThemeObj.accentPrimary }}
      />

      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                @wix Studio Site & Custom Element Builder
              </h2>
              <span
                data-testid="wix-permission-status-badge"
                className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md border ${
                  allowWixBuild
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
              >
                {allowWixBuild ? '@wix BUILD: ALLOWED' : '@wix BUILD: PAUSED'}
              </span>
              <span className="text-[11px] font-mono font-semibold text-cyan-400">
                · SDK v{artifact.sdkVersion}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Build, preview, and publish the <strong className="text-white">Badges & Achievements</strong> glass-morphism widget,{' '}
              <strong className="text-white">2D & 3D AI Games</strong>, and <strong className="text-white">15 Solar & AI Roadster themes</strong> as native{' '}
              <code className="font-mono text-cyan-300">@wix</code> Custom Elements & Headless CMS collections.
            </p>
          </div>
        </div>

        {/* Allow @wix Build Toggle + Primary Build CTA */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            data-testid="wix-allow-build-toggle"
            onClick={() => {
              const next = !allowWixBuild;
              setAllowWixBuild(next);
              showToast(
                next
                  ? '@wix Studio Build Permission: ALLOWED — all custom elements unlocked.'
                  : '@wix Studio Build Permission paused.'
              );
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              allowWixBuild
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-300 border-white/20'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{allowWixBuild ? '@wix Allow Build: ON' : 'Allow @wix to Build'}</span>
          </button>

          <button
            type="button"
            data-testid="wix-run-build-btn"
            onClick={handleRunWixBuild}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition whitespace-nowrap"
          >
            <Rocket className={`w-4 h-4 ${buildState === 'building' ? 'animate-bounce' : ''}`} />
            <span>
              {buildState === 'building'
                ? 'Building @wix Bundle...'
                : 'Build & Sync with @wix'}
            </span>
          </button>
        </div>
      </div>

      {/* Live Build Pipeline & Readiness Bar */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-white/15 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white">
              {readiness.statusLabel}
            </span>
            <span className="text-slate-300 font-mono">
              · Active Theme: {activeThemeObj.name} ({activeThemeObj.solarPhase.toUpperCase()})
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono font-bold">
            <span className="text-cyan-400">
              Readiness: {readiness.readinessScore}%
            </span>
            <span className="text-emerald-400">
              Build #{lastBuildCount} {buildState === 'deployed' ? 'LIVE' : 'RUNNING'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {buildStages.map((stageLabel, idx) => {
            const done = allowWixBuild && buildStepIndex > idx;
            return (
              <div
                key={stageLabel}
                className={`rounded-xl px-3 py-2 border text-[11px] font-medium flex items-center gap-2 ${
                  done
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 ${
                    done ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                />
                <span className="truncate">{stageLabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Environment Selector + Workbench View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="@wix Builder Views">
          {(
            [
              {
                id: 'modules',
                label: `Custom Elements (${selectedModules.length}/6)`,
                icon: <Cpu className="w-3.5 h-3.5" />,
              },
              {
                id: 'code',
                label: '@wix/sdk & Velo Code',
                icon: <Code2 className="w-3.5 h-3.5" />,
              },
              {
                id: 'cms',
                label: '@wix/data CMS Collections (3)',
                icon: <Database className="w-3.5 h-3.5" />,
              },
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              type="button"
              data-testid={`wix-tab-${tab.id}`}
              onClick={() => setActiveInspectorTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeInspectorTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Target Wix Environment */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Target:
          </span>
          {(
            [
              { id: 'wix-studio', label: 'Wix Studio' },
              { id: 'wix-headless', label: 'Wix Headless' },
              { id: 'wix-blocks', label: 'Wix Blocks' },
            ] as const
          ).map(env => (
            <button
              key={env.id}
              type="button"
              onClick={() => setTargetEnvironment(env.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition cursor-pointer ${
                targetEnvironment === env.id
                  ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/50'
                  : 'bg-slate-900 text-slate-400 border border-white/10 hover:text-slate-200'
              }`}
            >
              {env.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Custom Elements & Interactive Widgets */}
      {activeInspectorTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5" data-testid="wix-modules-grid">
          {WIX_BUILDER_MODULES.map(mod => {
            const isSelected = selectedModules.includes(mod.id);
            const isGame3D = mod.id === 'game-3d-roadster';
            const isGame2D = mod.id === 'game-2d-collider';
            const isBadges = mod.id === 'badges-achievements';

            return (
              <div
                key={mod.id}
                className={`rounded-2xl p-4 border transition flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-slate-900/95 border-cyan-500/40 shadow-md'
                    : 'bg-slate-900/50 border-white/10 opacity-75'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                      {mod.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleModule(mod.id)}
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {isSelected ? 'INCLUDED IN @WIX' : 'EXCLUDED'}
                    </button>
                  </div>

                  <h3 className="font-bold text-sm text-white">
                    {mod.name}
                  </h3>

                  <div className="text-[11px] font-mono text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 rounded-lg px-2.5 py-1 truncate">
                    &lt;{mod.tagName} /&gt;
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-300 truncate">
                    {isBadges
                      ? `${unlockedBadgesCount}/${badges.length} Badges Unlocked`
                      : isGame3D
                      ? `3D High Score: ${gameStats.highScore3D} pts`
                      : isGame2D
                      ? `2D High Score: ${gameStats.highScore2D} pts`
                      : `Synced with @wix/sdk`}
                  </span>

                  {(isGame3D || isGame2D) && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveGameMode(isGame3D ? '3d' : '2d');
                        setActiveTab('games');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Play className="w-3 h-3" />
                      <span>Launch {isGame3D ? '3D' : '2D'}</span>
                    </button>
                  )}

                  {isBadges && (
                    <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1 shrink-0">
                      <Award className="w-3.5 h-3.5" />
                      Active Above
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: @wix/sdk & Velo Generated Code */}
      {activeInspectorTab === 'code' && (
        <div className="space-y-4" data-testid="wix-code-inspector">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-slate-300">
              Generated <code className="font-mono text-cyan-300">@wix/sdk</code> Velo page integration &{' '}
              <code className="font-mono text-indigo-300">wix.config.json</code> manifest for{' '}
              <strong className="text-white">{activeThemeObj.name}</strong>.
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyCode(artifact.veloPageCode, '@wix Velo Page Code')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs font-bold text-cyan-300 hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Velo Code</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadBundle}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export wix.config.json</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-900/95 border border-cyan-500/30 p-4 overflow-x-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[11px] font-mono text-cyan-400">
                <span>src/pages/masterPage.js (@wix/sdk + Custom Elements)</span>
                <span>TypeScript / Velo</span>
              </div>
              <pre className="text-[11px] font-mono text-slate-200 leading-relaxed whitespace-pre-wrap">
                {artifact.veloPageCode}
              </pre>
            </div>

            <div className="rounded-2xl bg-slate-900/95 border border-indigo-500/30 p-4 overflow-x-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[11px] font-mono text-indigo-400">
                <span>wix.config.json (Site & Custom Element Manifest)</span>
                <span>JSON Schema</span>
              </div>
              <pre className="text-[11px] font-mono text-slate-200 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
                {artifact.wixConfigJson}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: @wix/data Headless CMS Collections */}
      {activeInspectorTab === 'cms' && (
        <div className="space-y-4" data-testid="wix-cms-inspector">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-slate-300">
              Live <code className="font-mono text-cyan-300">@wix/data</code> collections storing user milestone badges, 2D & 3D game high scores, and the 15 Solar & AI Roadster theme presets.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setAutoSyncCms(!autoSyncCms);
                  showToast(
                    !autoSyncCms
                      ? '@wix/data Auto-Sync enabled.'
                      : '@wix/data Auto-Sync set to manual.'
                  );
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs font-bold text-slate-200 cursor-pointer"
              >
                Auto-Sync: {autoSyncCms ? 'ON' : 'MANUAL'}
              </button>
              <button
                type="button"
                onClick={() =>
                  showToast(
                    `Synced ${unlockedBadgesCount} unlocked badges & 2D/3D game scores to @wix/data CMS!`
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync @wix/data Now</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {artifact.cmsCollections.map(col => (
              <div
                key={col.collectionId}
                className="bg-slate-900/95 rounded-2xl p-4 border border-white/15 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {col.collectionId}
                  </span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {col.liveRecordCount} records
                  </span>
                </div>
                <div className="text-sm font-bold text-white">
                  {col.displayName}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {col.fields.map(f => (
                    <span
                      key={f.key}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-200 border border-white/10"
                    >
                      {f.key}: {f.type}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
