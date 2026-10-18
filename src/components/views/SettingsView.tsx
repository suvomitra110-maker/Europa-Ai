import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Globe,
  Calendar,
  Cloud,
  HardDrive,
  Trash2,
  RefreshCw,
  CheckCircle,
  Plus,
  Palette,
  Eye,
  Check,
  Gauge,
  Cpu,
  Code2,
  Copy,
  RotateCcw,
  Layers,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageBackHeader } from '../layout/PageBackHeader';
import { LanguageCode } from '../../types';
import {
  buildWixThemeManifest,
  DESIGN_THEMES,
  DesignThemeConfig,
  DesignThemeId,
  FUTURISTIC_THEMES,
  KOLKATA_DURGA_PUJA_THEMES,
  resolveDesignTheme,
  SOLAR_PREVIEW_PRESETS,
} from '../../utils/progressionLogic';

type SettingsGalleryFilter =
  | 'solar-10'
  | 'kolkata-durga-puja'
  | 'futuristic'
  | 'ai-roadster'
  | 'all-23';

export const SettingsView: React.FC = () => {
  const {
    solarPhase,
    sunHour,
    setSunHour,
    autoSunSync,
    setAutoSunSync,
    setSolarPreset,
    designTheme,
    previewDesignTheme,
    setDesignTheme,
    setPreviewDesignTheme,
    language,
    setLanguage,
    isOffline,
    cachedModulesCount,
    clearCache,
    syncOfflineCache,
    examDeadlines,
    addExamDeadline,
    deleteExamDeadline,
    exportStudyCalendarIcs,
    showToast,
    user,
  } = useApp();

  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamSubject, setNewExamSubject] = useState('');
  const [newExamDate, setNewExamDate] = useState('2026-11-04');
  const [examAlertDays] = useState(2);

  // Theme Preview Gallery state
  const [galleryFilter, setGalleryFilter] = useState<SettingsGalleryFilter>('solar-10');
  const [hoveredThemeId, setHoveredThemeId] = useState<DesignThemeId | null>(null);
  const [lockedPreviewId, setLockedPreviewId] = useState<DesignThemeId | null>(null);
  const [hoverLiveEnabled, setHoverLiveEnabled] = useState<boolean>(true);
  const [previewLens, setPreviewLens] = useState<'roadster-hud' | 'wix-studio'>('roadster-hud');
  const [wixAutoSync, setWixAutoSync] = useState<boolean>(true);

  const activePreviewId: DesignThemeId =
    hoveredThemeId || lockedPreviewId || previewDesignTheme || designTheme;
  const activePreviewTheme: DesignThemeConfig = resolveDesignTheme(activePreviewId);
  const wixManifest = buildWixThemeManifest(activePreviewTheme);

  const displayedPresets: DesignThemeConfig[] =
    galleryFilter === 'solar-10'
      ? SOLAR_PREVIEW_PRESETS
      : galleryFilter === 'kolkata-durga-puja'
      ? KOLKATA_DURGA_PUJA_THEMES
      : galleryFilter === 'futuristic'
      ? FUTURISTIC_THEMES
      : galleryFilter === 'ai-roadster'
      ? DESIGN_THEMES.filter(t => t.category === 'ai-roadster')
      : DESIGN_THEMES;

  const handleCardMouseEnter = (presetId: DesignThemeId) => {
    setHoveredThemeId(presetId);
    if (hoverLiveEnabled) {
      setPreviewDesignTheme(presetId);
    }
  };

  const handleGalleryMouseLeave = () => {
    setHoveredThemeId(null);
    if (hoverLiveEnabled) {
      setPreviewDesignTheme(lockedPreviewId || null);
    }
  };

  const handleLockPreview = (presetId: DesignThemeId) => {
    if (lockedPreviewId === presetId) {
      setLockedPreviewId(null);
      setPreviewDesignTheme(null);
      showToast('Unlocked theme preview; reverted to applied theme.');
    } else {
      setLockedPreviewId(presetId);
      setPreviewDesignTheme(presetId);
      const cfg = resolveDesignTheme(presetId);
      showToast(`Locked live preview on "${cfg.name}".`);
    }
  };

  const handleApplyPreset = (presetId: DesignThemeId) => {
    setLockedPreviewId(null);
    setHoveredThemeId(null);
    setDesignTheme(presetId);
  };

  const handleCopyWixTokens = () => {
    const jsonPayload = JSON.stringify(wixManifest, null, 2);
    try {
      navigator.clipboard?.writeText(jsonPayload);
    } catch {}
    showToast(`Copied @wix/design-system tokens for "${activePreviewTheme.name}" to clipboard.`);
  };

  const formatSunTime = (h: number) => {
    const hours = Math.floor(h);
    const minutes = Math.floor((h - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle.trim()) return;
    addExamDeadline({
      title: newExamTitle,
      subject: newExamSubject || 'AI Fundamentals',
      date: new Date(newExamDate).toISOString(),
      type: 'Exam',
      reminderDaysBefore: examAlertDays,
    });
    setNewExamTitle('');
    setNewExamSubject('');
    showToast('Upcoming exam deadline added to study schedule!');
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-6xl mx-auto w-full overflow-y-auto">
      {/* Universal Page Back Header */}
      <PageBackHeader
        title="System Settings & Theme Preview Studio"
        subtitle="Hover over the 10 solar-themed & AI Roadster presets to see a live interface color preview before applying. Built with @wix Design System & Headless Theme Sync."
        badge="Preferences"
      />

      {/* 1. Theme Settings Toggle & Manual Solar Phase Override (Dawn, Day, Sunset, Night) */}
      <div
        className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5"
        data-testid="theme-settings-card"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                Theme Settings — Solar Cycle & Manual Phase Control
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manually switch between Dawn, Day, Sunset, and Night solar phases regardless of your system clock.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => {
                const next = !autoSunSync;
                setAutoSunSync(next);
                try {
                  localStorage.setItem('europa_auto_sun', String(next));
                } catch {}
                if (next) {
                  const now = new Date();
                  setSunHour(now.getHours() + now.getMinutes() / 60);
                  setAutoSunSync(true);
                  showToast('Theme Settings: Synced with System Time');
                } else {
                  showToast('Theme Settings: Manual Solar Preset Override Active');
                }
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border whitespace-nowrap shrink-0 ${
                !autoSunSync
                  ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'glass-button text-slate-600 dark:text-slate-300'
              }`}
            >
              {!autoSunSync ? 'Manual Preset Override: ON' : 'Auto System Time: ON'}
            </button>

            <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300 px-3 py-2 rounded-xl glass-panel border border-cyan-500/30 tabular-nums whitespace-nowrap shrink-0">
              {formatSunTime(sunHour)} · {solarPhase.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Manual Solar Preset Selector Cards (Dawn, Day, Sunset, Night) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="group" aria-label="Theme Settings Solar Presets">
          {(
            [
              {
                id: 'dawn',
                label: 'Dawn',
                time: '06:30',
                desc: 'Rose-gold horizon & cool twilight',
                icon: <Sunrise className="w-4 h-4 text-rose-400" />,
              },
              {
                id: 'day',
                label: 'Day',
                time: '12:00',
                desc: 'High-clarity daylight & crisp glass',
                icon: <Sun className="w-4 h-4 text-amber-400" />,
              },
              {
                id: 'sunset',
                label: 'Sunset',
                time: '18:15',
                desc: 'Amber-violet dusk & warm reflections',
                icon: <Sunset className="w-4 h-4 text-orange-400" />,
              },
              {
                id: 'night',
                label: 'Night',
                time: '23:30',
                desc: 'Deep celestial slate & starlight',
                icon: <Moon className="w-4 h-4 text-indigo-400" />,
              },
            ] as const
          ).map(p => {
            const isSelected = solarPhase === p.id;
            return (
              <button
                type="button"
                key={p.id}
                onClick={() => setSolarPreset(p.id)}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 text-slate-900 dark:text-white border-cyan-400/60 shadow-md'
                    : 'glass-button text-slate-700 dark:text-slate-300 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    {p.icon}
                    <span>{p.label}</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-75 tabular-nums">{p.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{p.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Fine-Grained Solar Scrubber */}
        <div className="glass-panel p-4 rounded-2xl border border-white/20 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-300 font-bold tabular-nums">
            <span>06:00 Dawn</span>
            <span>12:00 Day</span>
            <span>18:00 Sunset</span>
            <span>24:00 Night</span>
          </div>
          <input
            type="range"
            min="0"
            max="23.9"
            step="0.25"
            value={sunHour}
            onChange={e => setSunHour(parseFloat(e.target.value))}
            aria-label="Solar position scrubber"
            className="w-full accent-cyan-500 h-2 bg-black/10 dark:bg-white/15 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* 2. THEME PREVIEW GALLERY — 10 SOLAR-THEMED & AI ROADSTER PRESETS + @WIX STUDIO BUILDER */}
      <div
        className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6"
        data-testid="settings-theme-preview-gallery"
      >
        {/* Gallery Header & Controls */}
        <div className="flex flex-col gap-4 border-b border-black/10 dark:border-white/10 pb-5">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-500 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
                  Theme Preview Gallery — Solar, Futuristic &amp; Kolkata Durga Puja Presets
                </h2>
                <span className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400">
                  · Built with @wix Design System
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Hover over any preset card below to trigger an instant live preview of how each Solar, Kolkata Durga Puja, Futuristic, or AI Roadster theme transforms the interface colors before applying.
              </p>
            </div>
          </div>

          {/* Filter Tabs & Hover Live Toggle */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div
              className="flex items-center gap-1.5 p-1.5 rounded-2xl glass-panel border border-white/20 dark:border-white/10 overflow-x-auto max-w-full"
              role="tablist"
              aria-label="Theme Preview Gallery Filter"
            >
              {(
                [
                  { id: 'solar-10', label: `10 Solar Presets (${SOLAR_PREVIEW_PRESETS.length})` },
                  {
                    id: 'kolkata-durga-puja',
                    label: `Kolkata & Durga Puja (${KOLKATA_DURGA_PUJA_THEMES.length})`,
                  },
                  {
                    id: 'futuristic',
                    label: `Futuristic (${FUTURISTIC_THEMES.length})`,
                  },
                  {
                    id: 'ai-roadster',
                    label: `AI Roadster (${DESIGN_THEMES.filter(t => t.category === 'ai-roadster').length})`,
                  },
                  { id: 'all-23', label: `All Studio (${DESIGN_THEMES.length})` },
                ] as { id: SettingsGalleryFilter; label: string }[]
              ).map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={galleryFilter === tab.id}
                  onClick={() => setGalleryFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
                    galleryFilter === tab.id
                      ? 'bg-cyan-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                const next = !hoverLiveEnabled;
                setHoverLiveEnabled(next);
                if (!next) setPreviewDesignTheme(lockedPreviewId || null);
                showToast(
                  next
                    ? 'Hover Live Preview enabled: hover any card to test colors live.'
                    : 'Hover Live Preview paused: click a card to preview.'
                );
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer whitespace-nowrap shrink-0 ${
                hoverLiveEnabled
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
                  : 'glass-button text-slate-600 dark:text-slate-300'
              }`}
            >
              {hoverLiveEnabled ? 'Hover Live Preview: ON' : 'Hover Live Preview: OFF'}
            </button>
          </div>
        </div>

        {/* LIVE HOVER INTERFACE PREVIEW STAGE (AI Roadster Cockpit HUD & @wix Studio Sync) */}
        <div
          className="rounded-3xl border overflow-hidden transition-all duration-300 shadow-lg"
          style={{
            background: activePreviewTheme.skyGradient,
            borderColor: activePreviewTheme.borderColor,
          }}
          data-testid="settings-live-theme-stage"
        >
          {/* Top Stage Bar */}
          <div
            className="px-4 sm:px-6 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b backdrop-blur-xl"
            style={{
              background: activePreviewTheme.panelBg,
              borderColor: activePreviewTheme.borderColor,
              color: activePreviewTheme.textPrimary,
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: activePreviewTheme.accentPrimary }}
                />
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: activePreviewTheme.accentSecondary }}
                />
              </div>
              <span className="text-xs font-mono font-bold tracking-tight truncate" data-testid="live-preview-theme-name">
                {hoveredThemeId
                  ? `HOVER PREVIEW: ${activePreviewTheme.name.toUpperCase()}`
                  : lockedPreviewId
                  ? `LOCKED PREVIEW: ${activePreviewTheme.name.toUpperCase()}`
                  : `ACTIVE THEME: ${activePreviewTheme.name.toUpperCase()}`}
              </span>
              <span className="text-xs font-mono opacity-80 hidden md:inline whitespace-nowrap shrink-0 tabular-nums">
                · {activePreviewTheme.solarPhase.toUpperCase()} ({formatSunTime(activePreviewTheme.sunHour)}) · {activePreviewTheme.mode.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
              {/* Lens Switcher: AI Roadster HUD vs @wix Studio Tokens */}
              <div className="flex items-center gap-1 bg-black/25 p-1 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => setPreviewLens('roadster-hud')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition whitespace-nowrap shrink-0 ${
                    previewLens === 'roadster-hud' ? 'bg-white/20 text-white' : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  <Gauge className="w-3.5 h-3.5" />
                  <span>AI Roadster & UI HUD</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLens('wix-studio')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition whitespace-nowrap shrink-0 ${
                    previewLens === 'wix-studio' ? 'bg-white/20 text-white' : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>@wix Studio Sync</span>
                </button>
              </div>

              {(hoveredThemeId || lockedPreviewId || previewDesignTheme) && (
                <button
                  type="button"
                  onClick={() => {
                    setHoveredThemeId(null);
                    setLockedPreviewId(null);
                    setPreviewDesignTheme(null);
                    showToast('Reverted live preview to applied theme.');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/40 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Revert</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleApplyPreset(activePreviewTheme.id)}
                className="px-3.5 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-md whitespace-nowrap shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${activePreviewTheme.accentPrimary}, ${activePreviewTheme.accentSecondary})`,
                }}
              >
                <Check className="w-3.5 h-3.5" />
                <span>
                  {designTheme === activePreviewTheme.id && !previewDesignTheme
                    ? 'Applied'
                    : 'Apply Theme'}
                </span>
              </button>
            </div>
          </div>

          {/* Stage Content */}
          <div className="p-4 sm:p-6">
            {previewLens === 'roadster-hud' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                {/* Left: Simulated App Interface Navigation & Color Swatch Inspector */}
                <div
                  className="lg:col-span-4 rounded-2xl p-4 border backdrop-blur-md flex flex-col justify-between gap-4"
                  style={{
                    background: activePreviewTheme.panelBg,
                    borderColor: activePreviewTheme.borderColor,
                    color: activePreviewTheme.textPrimary,
                  }}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>INTERFACE SURFACE PREVIEW</span>
                      <span className="font-mono text-[10px] opacity-75 whitespace-nowrap shrink-0">{activePreviewTheme.badgeText}</span>
                    </div>
                    <p className="text-[11px] opacity-80 leading-relaxed">{activePreviewTheme.subtitle}</p>
                    <div className="space-y-1.5 pt-1 text-xs">
                      {['Solar Sky & Glass Canvas', 'AI Roadster Telemetry Deck', 'Settings & @wix Bridge'].map(
                        (item, idx) => (
                          <div
                            key={item}
                            className="px-3 py-1.5 rounded-xl font-semibold flex items-center justify-between"
                            style={{
                              background: idx === 1 ? `${activePreviewTheme.accentPrimary}26` : 'transparent',
                              border:
                                idx === 1
                                  ? `1px solid ${activePreviewTheme.accentPrimary}66`
                                  : '1px solid transparent',
                            }}
                          >
                            <span>{item}</span>
                            {idx === 1 && <span className="text-[10px] font-mono">LIVE</span>}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* 4-Color Swatch Strip */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {activePreviewTheme.swatchColors.map((hex, i) => (
                        <div key={i} className="flex items-center gap-1 text-[10px] font-mono">
                          <span
                            className="w-4 h-4 rounded-md border border-white/30 shrink-0"
                            style={{ backgroundColor: hex }}
                          />
                          <span className="hidden sm:inline">{hex}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: AI Roadster Autonomous Cockpit Telemetry HUD + Live Interface Cards */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1: Dynamic Kolkata Durga Puja / Futuristic / AI Roadster Telemetry HUD */}
                  <div
                    className="rounded-2xl p-4 border backdrop-blur-md flex flex-col justify-between gap-3"
                    style={{
                      background: activePreviewTheme.cardBg,
                      borderColor: activePreviewTheme.borderColor,
                      color: activePreviewTheme.textPrimary,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Gauge className="w-4 h-4 shrink-0" style={{ color: activePreviewTheme.accentPrimary }} />
                        <span className="text-xs font-bold truncate">
                          {activePreviewTheme.culturalSpec
                            ? 'Kolkata & Durga Puja Heritage HUD'
                            : activePreviewTheme.futuristicSpec
                            ? 'Futuristic 3026 Quantum HUD'
                            : 'AI Roadster Cockpit HUD'}
                        </span>
                      </div>
                      <span
                        className="text-[11px] font-mono font-bold tabular-nums whitespace-nowrap shrink-0"
                        style={{ color: activePreviewTheme.accentPrimary }}
                      >
                        {activePreviewTheme.culturalSpec
                          ? activePreviewTheme.culturalSpec.season
                          : activePreviewTheme.futuristicSpec
                          ? activePreviewTheme.futuristicSpec.era
                          : `${activePreviewTheme.roadsterSpec?.zeroToSixty || '1.85s'} 0-60 MPH`}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div
                        className="p-2.5 rounded-xl border"
                        style={{
                          background: activePreviewTheme.panelBg,
                          borderColor: activePreviewTheme.borderColor,
                        }}
                      >
                        <div className="text-[10px] font-mono opacity-75">
                          {activePreviewTheme.culturalSpec
                            ? 'MOTIF'
                            : activePreviewTheme.futuristicSpec
                            ? 'COMPUTE'
                            : 'AERO DRAG'}
                        </div>
                        <div className="text-xs font-black font-mono tabular-nums mt-0.5 truncate">
                          {activePreviewTheme.culturalSpec
                            ? 'Shardiya'
                            : activePreviewTheme.futuristicSpec
                            ? 'Qubit Mesh'
                            : activePreviewTheme.roadsterSpec?.aeroDragCd || '0.19 Cd'}
                        </div>
                      </div>
                      <div
                        className="p-2.5 rounded-xl border"
                        style={{
                          background: activePreviewTheme.panelBg,
                          borderColor: activePreviewTheme.borderColor,
                        }}
                      >
                        <div className="text-[10px] font-mono opacity-75">SOLAR PHASE</div>
                        <div className="text-xs font-black font-mono uppercase mt-0.5">
                          {activePreviewTheme.solarPhase}
                        </div>
                      </div>
                      <div
                        className="p-2.5 rounded-xl border"
                        style={{
                          background: activePreviewTheme.panelBg,
                          borderColor: activePreviewTheme.borderColor,
                        }}
                      >
                        <div className="text-[10px] font-mono opacity-75">
                          {activePreviewTheme.culturalSpec
                            ? 'HERITAGE'
                            : activePreviewTheme.futuristicSpec
                            ? 'HORIZON'
                            : 'NEURAL DRIVE'}
                        </div>
                        <div
                          className="text-xs font-black font-mono mt-0.5 truncate"
                          style={{ color: activePreviewTheme.accentSecondary }}
                        >
                          {activePreviewTheme.culturalSpec
                            ? 'KOLKATA'
                            : activePreviewTheme.futuristicSpec
                            ? '3026 CORE'
                            : 'LVL 5 AI'}
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono opacity-85 flex items-center justify-between pt-1">
                      <span className="truncate">
                        {activePreviewTheme.culturalSpec
                          ? `${activePreviewTheme.culturalSpec.motif} · ${activePreviewTheme.culturalSpec.landmark}`
                          : activePreviewTheme.futuristicSpec
                          ? `${activePreviewTheme.futuristicSpec.architecture} · ${activePreviewTheme.futuristicSpec.energyCore}`
                          : activePreviewTheme.roadsterSpec?.drivetrain || 'Autonomous Neural Torque Vectoring'}
                      </span>
                      <span className="shrink-0 ml-2" style={{ color: activePreviewTheme.accentPrimary }}>
                        {activePreviewTheme.accentPrimary}
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Interface Controls & @wix Live Token Status */}
                  <div
                    className="rounded-2xl p-4 border backdrop-blur-md flex flex-col justify-between gap-3"
                    style={{
                      background: activePreviewTheme.cardBg,
                      borderColor: activePreviewTheme.borderColor,
                      color: activePreviewTheme.textPrimary,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Cpu className="w-4 h-4 shrink-0" style={{ color: activePreviewTheme.accentSecondary }} />
                        <span className="text-xs font-bold truncate">@wix Headless UI Tokens</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold tabular-nums whitespace-nowrap shrink-0">
                        LVL {user.level} · {user.xp} XP
                      </span>
                    </div>

                    {/* Simulated Progress Bar in Active Preview Colors */}
                    <div className="space-y-1.5">
                      <div className="w-full h-2.5 rounded-full bg-black/25 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: '76%',
                            background: `linear-gradient(90deg, ${activePreviewTheme.accentPrimary}, ${activePreviewTheme.accentSecondary})`,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono opacity-80 tabular-nums">
                        <span>Primary: {activePreviewTheme.accentPrimary}</span>
                        <span>Secondary: {activePreviewTheme.accentSecondary}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] opacity-80 whitespace-nowrap shrink-0">
                        @wix/sdk · {wixAutoSync ? 'Synced' : 'Manual'}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyWixTokens}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition whitespace-nowrap shrink-0"
                        style={{
                          background: `${activePreviewTheme.accentPrimary}26`,
                          color: activePreviewTheme.textPrimary,
                          border: `1px solid ${activePreviewTheme.accentPrimary}66`,
                        }}
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy @wix Tokens</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* @wix Studio Site & Design System Manifest View */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div
                  className="lg:col-span-7 rounded-2xl p-5 border backdrop-blur-md flex flex-col justify-between gap-3"
                  style={{
                    background: activePreviewTheme.cardBg,
                    borderColor: activePreviewTheme.borderColor,
                    color: activePreviewTheme.textPrimary,
                  }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono opacity-80">
                      <span>@WIX STUDIO HEADLESS SITE PREVIEW</span>
                      <span>NAMESPACE: {wixManifest.siteNamespace}</span>
                    </div>
                    <h3 className="text-base font-black tracking-tight">
                      {activePreviewTheme.name} — Autonomous AI Roadster & Solar Learning Portal
                    </h3>
                    <p className="text-xs opacity-80 leading-relaxed">
                      Built with @wix Headless CMS and @wix/design-system tokens. Hovering any preset updates the site hero gradient, glassmorphic card surfaces, and primary CTA variables in real time.
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setWixAutoSync(!wixAutoSync);
                          showToast(
                            !wixAutoSync
                              ? 'Enabled automatic @wix Studio theme token synchronization.'
                              : 'Paused automatic @wix Studio token synchronization.'
                          );
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-white cursor-pointer whitespace-nowrap shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${activePreviewTheme.accentPrimary}, ${activePreviewTheme.accentSecondary})`,
                        }}
                      >
                        {wixAutoSync ? '@wix Live Sync: Connected' : 'Connect @wix Studio'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyWixTokens}
                        className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                        style={{
                          borderColor: activePreviewTheme.borderColor,
                          color: activePreviewTheme.textPrimary,
                        }}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Export @wix JSON</span>
                      </button>
                    </div>
                    <span className="text-[11px] font-mono opacity-75 tabular-nums">
                      Solar Clock: {formatSunTime(activePreviewTheme.sunHour)}
                    </span>
                  </div>
                </div>

                <div
                  className="lg:col-span-5 rounded-2xl p-4 border backdrop-blur-md font-mono text-[11px] space-y-1.5 overflow-x-auto"
                  style={{
                    background: activePreviewTheme.panelBg,
                    borderColor: activePreviewTheme.borderColor,
                    color: activePreviewTheme.textPrimary,
                  }}
                >
                  <div className="font-bold text-xs flex items-center justify-between pb-1 border-b border-white/10">
                    <span>@wix/design-system tokens</span>
                    <span style={{ color: activePreviewTheme.accentPrimary }}>{wixManifest.themeId}</span>
                  </div>
                  <div>colorBgPrimary: &quot;{wixManifest.tokens.colorBgPrimary}&quot;</div>
                  <div>colorSurfaceCard: &quot;{wixManifest.tokens.colorSurfaceCard}&quot;</div>
                  <div>colorAccentPrimary: &quot;{wixManifest.tokens.colorAccentPrimary}&quot;</div>
                  <div>colorAccentSecondary: &quot;{wixManifest.tokens.colorAccentSecondary}&quot;</div>
                  <div>colorTextPrimary: &quot;{wixManifest.tokens.colorTextPrimary}&quot;</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 10 SOLAR-THEMED & AI ROADSTER PRESETS HOVER GALLERY GRID */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5"
          onMouseLeave={handleGalleryMouseLeave}
          data-testid="settings-solar-presets-grid"
        >
          {displayedPresets.map((preset, index) => {
            const isApplied = designTheme === preset.id && !previewDesignTheme;
            const isHovered = hoveredThemeId === preset.id;
            const isLocked = lockedPreviewId === preset.id;
            const isRoadster = preset.category === 'ai-roadster';

            return (
              <div
                key={preset.id}
                onMouseEnter={() => handleCardMouseEnter(preset.id)}
                onFocus={() => handleCardMouseEnter(preset.id)}
                onClick={() => handleLockPreview(preset.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleApplyPreset(preset.id);
                  }
                }}
                aria-label={`Preset ${index + 1}: ${preset.name}`}
                data-testid={`theme-preview-card-${preset.id}`}
                className={`rounded-2xl border p-3.5 flex flex-col justify-between gap-3 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
                  isHovered || isLocked
                    ? 'ring-2 ring-cyan-400 border-cyan-400 glass-card shadow-lg'
                    : isApplied
                    ? 'ring-2 ring-emerald-500/80 border-emerald-500/50 glass-card'
                    : 'border-white/20 dark:border-white/10 glass-panel hover:border-cyan-500/40'
                }`}
              >
                <div className="space-y-2.5">
                  {/* Visual Mini Sky & Interface Swatch */}
                  <div
                    className="h-24 rounded-xl p-2.5 flex flex-col justify-between border relative overflow-hidden"
                    style={{
                      background: preset.skyGradient,
                      borderColor: preset.borderColor,
                    }}
                  >
                    <div className="flex items-center justify-between gap-1 z-10">
                      <span
                        className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded backdrop-blur-md truncate"
                        style={{
                          background: preset.cardBg,
                          color: preset.textPrimary,
                          border: `1px solid ${preset.borderColor}`,
                        }}
                      >
                        {String(index + 1).padStart(2, '0')} · {preset.badgeText}
                      </span>
                      <span
                        className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded tabular-nums shrink-0"
                        style={{
                          background: preset.panelBg,
                          color: preset.textPrimary,
                        }}
                      >
                        {formatSunTime(preset.sunHour)}
                      </span>
                    </div>

                    {/* Mini Interface Bar inside Swatch */}
                    <div
                      className="rounded-lg px-2 py-1 flex items-center justify-between z-10 backdrop-blur-md"
                      style={{
                        background: preset.cardBg,
                        border: `1px solid ${preset.borderColor}`,
                        color: preset.textPrimary,
                      }}
                    >
                      <span className="text-[10px] font-mono font-bold uppercase">
                        {preset.solarPhase}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {preset.swatchColors.map((hex, i) => (
                          <span
                            key={i}
                            className="w-2.5 h-2.5 rounded-full border border-white/30"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Preset Title & Roadster Spec */}
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {preset.name}
                      </h3>
                      {isRoadster && (
                        <Zap className="w-3.5 h-3.5 text-rose-500 shrink-0" aria-label="AI Roadster Theme" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-snug">
                      {preset.subtitle}
                    </p>
                    {preset.culturalSpec && (
                      <div className="mt-1.5 text-[10px] font-mono font-semibold text-amber-600 dark:text-amber-400 truncate">
                        {preset.culturalSpec.motif}
                      </div>
                    )}
                    {preset.futuristicSpec && (
                      <div className="mt-1.5 text-[10px] font-mono font-semibold text-cyan-600 dark:text-cyan-400 truncate">
                        {preset.futuristicSpec.era} · {preset.futuristicSpec.architecture}
                      </div>
                    )}
                    {preset.roadsterSpec && (
                      <div className="mt-1.5 text-[10px] font-mono font-semibold text-rose-600 dark:text-rose-400 tabular-nums truncate">
                        {preset.roadsterSpec.zeroToSixty} · {preset.roadsterSpec.aeroDragCd}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover / Apply Footer */}
                <div className="pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handleLockPreview(preset.id);
                    }}
                    className="px-2 py-1 rounded-lg glass-button text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:text-cyan-500 flex items-center gap-1 cursor-pointer transition whitespace-nowrap shrink-0"
                  >
                    <Eye className="w-3 h-3" />
                    <span>{isHovered ? 'Live' : isLocked ? 'Locked' : 'Preview'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handleApplyPreset(preset.id);
                    }}
                    className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition whitespace-nowrap shrink-0 ${
                      isApplied
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-sm'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    <span>{isApplied ? 'Active' : 'Apply'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Multi-Language Support */}
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Multi-Language Accessibility</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Translate UI controls and course headers across 8 global languages
            </p>
          </div>
          <Globe className="w-5 h-5 text-cyan-500" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { code: 'en', label: 'English (EN)' },
            { code: 'es', label: 'Español (ES)' },
            { code: 'hi', label: 'Hindi · Bharatiya (HI)' },
            { code: 'bn', label: 'Bangla · Kolkata (BN)' },
            { code: 'zh', label: 'Mandarin Chinese (ZH)' },
            { code: 'ja', label: 'Nihongo · Japanese (JA)' },
            { code: 'de', label: 'Deutsch (DE)' },
            { code: 'fr', label: 'Français (FR)' },
          ].map(l => (
            <button
              key={l.code}
              onClick={() => {
                setLanguage(l.code as LanguageCode);
                showToast(`Language switched to ${l.label}`);
              }}
              className={`p-3.5 rounded-2xl border text-xs font-bold transition cursor-pointer text-left ${
                language === l.code
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white border-cyan-400 shadow-md'
                  : 'glass-panel text-slate-700 dark:text-slate-300 hover:border-cyan-500/40'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Offline Mode & Local Storage Cache */}
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Offline Access & Cache Manager</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Store video transcripts and lecture notes locally for uninterrupted study
            </p>
          </div>
          <HardDrive className="w-5 h-5 text-teal-500" />
        </div>

        <div className="p-4 glass-panel border border-white/20 dark:border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Offline Mode Simulator:</span>
              <span
                className={`text-xs font-mono font-bold ${
                  isOffline ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                · {isOffline ? 'OFFLINE ACTIVE' : 'ONLINE (CLOUD SYNCED)'}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
              Cached: {cachedModulesCount} study modules & 40 lecture notes (~18.4 MB in device storage)
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={syncOfflineCache}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-teal-600/20 whitespace-nowrap shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync All Offline</span>
            </button>
            <button
              onClick={clearCache}
              className="px-3.5 py-2 rounded-xl glass-button text-slate-600 dark:text-slate-400 hover:text-rose-500 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cache</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Calendar Sync & Exam Deadlines */}
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Calendar Synchronization & Deadlines
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sync Europa exam milestones directly into Google Calendar, Apple, or Outlook
            </p>
          </div>
          <button
            onClick={exportStudyCalendarIcs}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md shadow-indigo-600/20 whitespace-nowrap shrink-0"
          >
            <Calendar className="w-4 h-4" />
            <span>Export .ICS Calendar</span>
          </button>
        </div>

        {/* Existing exam deadlines list */}
        <div className="space-y-2">
          {examDeadlines.map(e => (
            <div
              key={e.id}
              className="p-3.5 rounded-2xl glass-panel border border-white/20 dark:border-white/10 flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 dark:text-white text-sm">{e.title}</div>
                <div className="text-slate-500 dark:text-slate-400">
                  {e.subject} · Scheduled: {new Date(e.date).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold tabular-nums">
                  Alert {e.reminderDaysBefore}d before
                </span>
                <button
                  onClick={() => deleteExamDeadline(e.id)}
                  aria-label={`Delete ${e.title}`}
                  className="p-1 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Exam Deadline Form */}
        <form
          onSubmit={handleAddExam}
          className="p-4 glass-panel rounded-2xl border border-white/20 dark:border-white/10 space-y-3"
        >
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Add Upcoming Exam / Capstone Milestone:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              value={newExamTitle}
              onChange={e => setNewExamTitle(e.target.value)}
              placeholder="Exam title..."
              className="glass-button border border-white/20 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-semibold"
            />
            <input
              type="text"
              value={newExamSubject}
              onChange={e => setNewExamSubject(e.target.value)}
              placeholder="Subject..."
              className="glass-button border border-white/20 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-semibold"
            />
            <input
              type="date"
              value={newExamDate}
              onChange={e => setNewExamDate(e.target.value)}
              className="glass-button border border-white/20 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-semibold"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-cyan-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Deadline</span>
            </button>
          </div>
        </form>
      </div>

      {/* 6. Cloud Backup & Data Security */}
      <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Automated Cloud Backup Status</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              All local study notes, @wix theme tokens, and badge telemetry backed up to Europa Cloud.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/15 px-3 py-1.5 rounded-xl border border-emerald-500/30 whitespace-nowrap shrink-0">
          <CheckCircle className="w-4 h-4" />
          <span>Synced 2m ago</span>
        </div>
      </div>
    </div>
  );
};
