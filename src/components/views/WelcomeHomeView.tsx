import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useApp, ActiveTab } from '../../context/AppContext';
import {
  ALL_WINDOW_MENU_OPTIONS,
  filterWindowMenuOptions,
  HUMAN_ROBOT_HAND_TOUCH_DATA_URI,
} from '../../utils/futuristicEarthAsset';
import { OriginScrollAssemblySection } from '../home/OriginScrollAssemblySection';

interface WelcomeHomeViewProps {
  onOpenTopLeftMenu?: () => void;
}

export const WelcomeHomeView: React.FC<WelcomeHomeViewProps> = ({ onOpenTopLeftMenu }) => {
  const { activeTab, setActiveTab } = useApp();
  const [isStationDropdownOpen, setIsStationDropdownOpen] = useState(false);
  const [stationSearch, setStationSearch] = useState('');
  const stationDropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = filterWindowMenuOptions(stationSearch);
  const activeStation =
    ALL_WINDOW_MENU_OPTIONS.find(opt => opt.id === activeTab) || ALL_WINDOW_MENU_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        stationDropdownRef.current &&
        !stationDropdownRef.current.contains(e.target as Node)
      ) {
        setIsStationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div className="min-h-full w-full select-none">
      {/* ===================================================================== */}
      {/* 1. CLEAN HOME PAGE HEADER: HUMAN BEING'S HAND TOUCHING ROBOT HAND     */}
      {/*    Clean of widgets/text overlays; User scrolls down to see options.  */}
      {/* ===================================================================== */}
      <header
        data-testid="home-page-clean-header"
        aria-label="Home Page Header — Human Being Hand Touching Robot Hand"
        className="relative w-full h-screen min-h-[600px] bg-slate-950 overflow-hidden flex items-center justify-center border-b border-white/10"
      >
        <img
          data-testid="human-robot-hand-hero-img"
          src={HUMAN_ROBOT_HAND_TOUCH_DATA_URI}
          alt="Human Being's Hand Touching Robot Hand"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center select-none pointer-events-none"
        />
      </header>

      {/* ===================================================================== */}
      {/* 2. BELOW THE FOLD CONTENT: REVEALED WHEN USER SCROLLS DOWN            */}
      {/* ===================================================================== */}
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-16">
        {/* Scroll-Down Workspace Station Section: Drop-Down from Left Upper Side */}
        <motion.section
          data-testid="scroll-down-options-section"
          aria-label="Select Workspace Station and Sanctuary Options"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30 rounded-3xl bg-slate-900/90 dark:bg-slate-950/90 border border-slate-200/20 dark:border-white/10 p-6 sm:p-10 shadow-2xl space-y-6"
        >
          {/* Left Upper Side Drop-Down Trigger inside the Scrolled Section */}
          <div className="flex flex-col items-start gap-4" ref={stationDropdownRef}>
            <div className="relative">
              <button
                type="button"
                data-testid="section-left-workspace-dropdown-btn"
                onClick={() => setIsStationDropdownOpen(prev => !prev)}
                aria-expanded={isStationDropdownOpen}
                aria-haspopup="menu"
                className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm transition cursor-pointer shadow-lg"
              >
                <span>Select Workspace Station</span>
                <span aria-hidden="true" className="text-slate-800">
                  ·
                </span>
                <span className="font-semibold text-slate-900">{activeStation.title}</span>
                <span className="text-[11px] font-mono">
                  {isStationDropdownOpen ? '▲' : '▼'}
                </span>
              </button>

              {/* Drop-Down Panel Anchored to Left Upper Side */}
              {isStationDropdownOpen && (
                <div
                  role="menu"
                  aria-label="Workspace Station Left Upper Dropdown"
                  className="absolute left-0 top-full mt-2.5 w-[90vw] max-w-[720px] rounded-2xl bg-slate-950 border border-cyan-400/45 shadow-2xl p-4 sm:p-5 z-40 space-y-3.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div>
                      <div className="text-xs font-bold text-white">
                        Select Workspace Station ({ALL_WINDOW_MENU_OPTIONS.length} Stations)
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Choose any station below to enter immediately
                      </div>
                    </div>
                    <input
                      type="text"
                      value={stationSearch}
                      onChange={e => setStationSearch(e.target.value)}
                      placeholder="Filter stations..."
                      aria-label="Filter workspace stations in dropdown"
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 sm:w-56"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[60vh] overflow-y-auto pr-1">
                    {filteredOptions.map((opt, idx) => (
                      <button
                        key={`station-dd-${opt.id}`}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setActiveTab(opt.id);
                          setIsStationDropdownOpen(false);
                          setStationSearch('');
                        }}
                        className={`text-left px-3.5 py-2.5 rounded-xl border transition cursor-pointer ${
                          activeTab === opt.id
                            ? 'bg-cyan-500/20 border-cyan-400 text-white'
                            : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-200'
                        }`}
                      >
                        <div className="text-xs font-bold text-white truncate">
                          {String(idx + 1).padStart(2, '0')}. {opt.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {opt.subtitle}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 max-w-3xl pt-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-cyan-400">
                <span>Europa Ai Sanctuary</span>
                <span aria-hidden="true">·</span>
                <span>Human &amp; Robot Symbiosis</span>
                <span aria-hidden="true">·</span>
                <span>Left Upper Workspace Station Selector</span>
              </div>
              <h1
                className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Human &amp; Robot Symbiosis Sanctuary
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Use the <strong className="text-white">Select Workspace Station</strong> drop-down
                from the left upper side to open any of the 15 study, quant, or simulation
                stations, or explore the Origin Mathematics, AI, and Robotics scroll assembly
                below.
              </p>
            </div>

            {onOpenTopLeftMenu && (
              <button
                type="button"
                onClick={onOpenTopLeftMenu}
                className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 underline underline-offset-4 transition cursor-pointer"
              >
                Open Top-Left Workspace Station Drop-Down
              </button>
            )}
          </div>
        </motion.section>

        {/* Framer Motion Scroll-Triggered Origin Mathematics, AI & Robotics Parts Assembly + @wix Bridge */}
        <OriginScrollAssemblySection />

        {/* Clean Minimal Editorial Architectural Pillars (Zero Icons) */}
        <motion.section
          aria-label="Core Workspace Pillars"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 pt-4 border-t border-slate-200/80 dark:border-white/10"
        >
          <div className="border-b border-slate-200/80 dark:border-white/10 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-cyan-600 dark:text-cyan-400">
                Architectural Overview · Minimal Sanctuary
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                Four Foundational Workspaces
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md">
              Select any foundational pillar below to enter its dedicated workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {coreSanctuaryPillars.map(pillar => (
              <div
                key={pillar.index}
                className="group py-5 border-b border-slate-200/80 dark:border-white/10 flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      {pillar.index}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{pillar.domain}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
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
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Quiet Editorial Footer (Zero Icons) */}
        <footer className="pt-4 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">Europa Ai</span>
            <span aria-hidden="true">·</span>
            <span>Human &amp; Robot Symbiosis Sanctuary</span>
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
    </div>
  );
};
