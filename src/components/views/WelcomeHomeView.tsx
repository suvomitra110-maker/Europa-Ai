import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp, ActiveTab } from '../../context/AppContext';
import {
  ALL_WINDOW_MENU_OPTIONS,
  FUTURISTIC_EARTH_HEADER_DATA_URI,
} from '../../utils/futuristicEarthAsset';

interface WelcomeHomeViewProps {
  onOpenTopLeftMenu?: () => void;
}

export const WelcomeHomeView: React.FC<WelcomeHomeViewProps> = ({ onOpenTopLeftMenu }) => {
  const { setActiveTab } = useApp();

  const coreSanctuaryPillars: {
    index: string;
    title: string;
    domain: string;
    description: string;
    actionLabel: string;
    targetTab: ActiveTab;
  }[] = [
    {
      index: '01.',
      title: 'Spatial 3D Voxel Library & Video Archive',
      domain: 'Interactive Architecture · AI & Robotics Lectures',
      description:
        'Explore foundational lectures across Generative AI, Robotics, and Machine Learning inside a calm, distraction-free 3D voxel study hall or structured catalog.',
      actionLabel: 'Enter 3D Voxel Library',
      targetTab: 'library',
    },
    {
      index: '02.',
      title: 'Institutional Quant Trading & Global Hub',
      domain: 'Mathematical Alpha · Statistical Arbitrage & HFT',
      description:
        'Study rigorous quantitative strategies, stochastic calculus formulations, and global market microstructure across major international financial centers.',
      actionLabel: 'Explore Quant Hub',
      targetTab: 'quant-trading',
    },
    {
      index: '03.',
      title: 'Playable 2D & 3D AI Simulation Arena',
      domain: 'Responsive Physics · Neural Runner & 3D Flight',
      description:
        'Practice spatial control and algorithmic reflexes in the 2D Neural Runner and 3D Voxel Flight Simulator with responsive keyboard and touch controls.',
      actionLabel: 'Launch Game Arena',
      targetTab: 'games',
    },
    {
      index: '04.',
      title: 'Cultural Heritage & Futuristic Theme Studio',
      domain: 'Kolkata Durga Puja · Futuristic 3026 · @wix Design Sync',
      description:
        'Preview and apply 23 bespoke interface atmospheres—including Shardiya Durga Puja cultural heritage palettes, 3026 orbital themes, and AI Roadster editions.',
      actionLabel: 'Open Theme Studio',
      targetTab: 'profile',
    },
  ];

  return (
    <div className="min-h-full w-full max-w-[1360px] mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-14 select-none">
      {/* Futuristic Earth Hero Header Banner (Clean of Widgets) */}
      <section
        aria-label="Welcome Header with Futuristic Earth"
        className="relative w-full rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-2xl bg-slate-950"
      >
        {/* High-Resolution Futuristic Earth Picture */}
        <div className="relative w-full h-[440px] sm:h-[460px] lg:h-[520px] overflow-hidden bg-slate-950">
          <img
            src={FUTURISTIC_EARTH_HEADER_DATA_URI}
            alt="Futuristic Earth from Orbit — Planetary Horizon 3026"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />

          {/* Measured Contrast Scrim for WCAG AAA Typography Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/35 to-transparent" />
        </div>

        {/* Clean Editorial Welcome Statement (Zero Clutter / Zero Widgets) */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-cyan-300 tracking-wide">
              <span>Welcome Sanctuary</span>
              <span aria-hidden="true">·</span>
              <span>Futuristic Earth Orbital Horizon</span>
              <span aria-hidden="true">·</span>
              <span>Distraction-Free Workspace</span>
            </div>

            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08]"
              style={{ textWrap: 'balance' }}
            >
              Welcome to Europa Ai
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal">
              A calm, widget-free home for artificial intelligence mastery, spatial 3D learning,
              quantitative research, and cultural design. Use the top-left Windows menu at any time
              to switch across all fifteen workspaces.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => setActiveTab('library')}
                className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm transition cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 shadow-lg"
              >
                <span>Enter 3D Voxel Library</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onOpenTopLeftMenu && (
                <button
                  type="button"
                  onClick={onOpenTopLeftMenu}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm transition cursor-pointer whitespace-nowrap shrink-0 backdrop-blur-md"
                >
                  Open Top-Left Windows Menu
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Architectural Pillars (Whitespace & Hairline Dividers, Zero Widgets) */}
      <section aria-label="Core Workspace Pillars" className="space-y-8">
        <div className="border-b border-slate-200/80 dark:border-white/10 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-cyan-600 dark:text-cyan-400">
              Architectural Overview · Clean Sanctuary
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
              Four Foundational Workspaces
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md">
            Every workspace is directly reachable from the top-left Windows dropdown menu without
            floating widgets or visual noise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          {coreSanctuaryPillars.map(pillar => (
            <div
              key={pillar.index}
              className="group py-6 border-b border-slate-200/80 dark:border-white/10 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {pillar.index}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{pillar.domain}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab(pillar.targetTab)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition cursor-pointer whitespace-nowrap"
                >
                  <span>{pillar.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Complete Directory Mirror of All 15 Windows (Clean Text Links, No Widget Boxes) */}
      <section
        aria-label="Complete Windows Index"
        className="pt-4 border-t border-slate-200/80 dark:border-white/10 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Complete Windows Directory ({ALL_WINDOW_MENU_OPTIONS.length} Workspaces)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              All windows are also available anytime via the top-left dropdown menu in the header.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
          {ALL_WINDOW_MENU_OPTIONS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className="text-left py-2.5 border-b border-slate-200/50 dark:border-white/5 hover:border-cyan-500/50 flex items-center justify-between gap-3 group cursor-pointer transition"
            >
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition truncate">
                  <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 mr-2">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate pl-6">
                  {item.subtitle}
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition shrink-0" />
            </button>
          ))}
        </div>
      </section>

      {/* Quiet Editorial Footer */}
      <footer className="pt-6 pb-8 border-t border-slate-200/60 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 dark:text-white">Europa Ai</span>
          <span aria-hidden="true">·</span>
          <span>Planetary AI & Robotics Learning Sanctuary</span>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className="hover:text-slate-900 dark:hover:text-white transition cursor-pointer whitespace-nowrap"
          >
            3D Library
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quant-trading')}
            className="hover:text-slate-900 dark:hover:text-white transition cursor-pointer whitespace-nowrap"
          >
            Quant Hub
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className="hover:text-slate-900 dark:hover:text-white transition cursor-pointer whitespace-nowrap"
          >
            Theme Studio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className="hover:text-slate-900 dark:hover:text-white transition cursor-pointer whitespace-nowrap"
          >
            Settings
          </button>
        </div>
      </footer>
    </div>
  );
};
