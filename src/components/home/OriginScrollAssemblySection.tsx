import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from 'motion/react';
import { useApp } from '../../context/AppContext';
import {
  ORIGIN_ASSEMBLY_STAGES,
  WixHomeEmbedMode,
  buildWixHomeScrollSnippet,
  clampScrollProgress,
  computeAssemblyPartsState,
  summarizeAssemblyTelemetry,
} from '../../utils/originScrollAssembly';

export const OriginScrollAssemblySection: React.FC = () => {
  const { designTheme, previewDesignTheme, showToast, setActiveTab } = useApp();
  const activeThemeId = previewDesignTheme || designTheme;

  const sectionRef = useRef<HTMLElement | null>(null);
  const manualLockUntilRef = useRef<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [wixMode, setWixMode] = useState<WixHomeEmbedMode>('velo-scroll-code');
  const [copiedWix, setCopiedWix] = useState<boolean>(false);
  const [wixSyncCount, setWixSyncCount] = useState<number>(1);
  const [lastSyncedStage, setLastSyncedStage] = useState<string>('origin-math');

  // Framer Motion scroll-linked progress for the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.75', 'end 0.92'],
  });

  const smoothProgressBar = useSpring(scrollProgress, {
    stiffness: 120,
    damping: 22,
    mass: 0.6,
  });

  useEffect(() => {
    smoothProgressBar.set(scrollProgress);
  }, [scrollProgress, smoothProgressBar]);

  // Subscribe to Framer Motion's useScroll updates when scrolling the page
  useMotionValueEvent(scrollYProgress, 'change', latest => {
    if (isAutoPlaying) return;
    if (Date.now() < manualLockUntilRef.current) return;
    const winScrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    if (winScrollTop <= 8) {
      setScrollProgress(0);
      return;
    }
    setScrollProgress(clampScrollProgress(latest));
  });

  // Fallback listener for both window scroll and any scrollable parent container (<main>)
  useEffect(() => {
    const computeProgressFromScroll = () => {
      if (isAutoPlaying) return;
      if (Date.now() < manualLockUntilRef.current) return;

      const docEl = document.documentElement;
      const winScrollTop = window.scrollY || docEl.scrollTop || 0;
      const winMaxScroll = Math.max(0, docEl.scrollHeight - window.innerHeight);

      const mainEl = document.querySelector('main');
      const mainScrollTop = mainEl ? mainEl.scrollTop : 0;
      const mainMaxScroll = mainEl ? Math.max(0, mainEl.scrollHeight - mainEl.clientHeight) : 0;

      const activeScrollTop = Math.max(winScrollTop, mainScrollTop);
      const activeMaxScroll = Math.max(winMaxScroll, mainMaxScroll);

      if (sectionRef.current && activeMaxScroll > 40) {
        const rect = sectionRef.current.getBoundingClientRect();
        const viewportH = window.innerHeight || 900;
        const sectionTravel = Math.max(280, rect.height - viewportH * 0.75);
        const rawSectionProgress = (viewportH * 0.45 - rect.top) / sectionTravel;
        const rawPageProgress = activeScrollTop / Math.max(1, activeMaxScroll * 0.58);

        const combined =
          activeScrollTop <= 8
            ? 0
            : clampScrollProgress(Math.max(rawSectionProgress, rawPageProgress));
        setScrollProgress(combined);
      }
    };

    window.addEventListener('scroll', computeProgressFromScroll, { passive: true, capture: true });
    window.addEventListener('resize', computeProgressFromScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', computeProgressFromScroll, { capture: true });
      window.removeEventListener('resize', computeProgressFromScroll);
    };
  }, [isAutoPlaying]);

  // Optional Auto-Assemble playback loop for users who click Play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = window.setInterval(() => {
      setScrollProgress(prev => {
        if (prev >= 1) {
          setIsAutoPlaying(false);
          return 1;
        }
        return clampScrollProgress(prev + 0.015);
      });
    }, 35);
    return () => window.clearInterval(interval);
  }, [isAutoPlaying]);

  const partsState = useMemo(() => computeAssemblyPartsState(scrollProgress), [scrollProgress]);
  const telemetry = useMemo(() => summarizeAssemblyTelemetry(scrollProgress), [scrollProgress]);

  const wixCodeSnippet = useMemo(
    () =>
      buildWixHomeScrollSnippet({
        mode: wixMode,
        scrollProgress,
        themeId: activeThemeId,
        siteNamespace: 'europa-ai-origin',
      }),
    [wixMode, scrollProgress, activeThemeId]
  );

  const handleSelectStage = (targetProgress: number, stageId: string) => {
    setIsAutoPlaying(false);
    manualLockUntilRef.current = Date.now() + 900;
    setScrollProgress(clampScrollProgress(targetProgress));
    const chapterEl = document.getElementById(`assembly-chapter-${stageId}`);
    if (chapterEl) {
      chapterEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCopyWixCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(wixCodeSnippet).catch(() => {});
    }
    setCopiedWix(true);
    showToast('Copied @wix Home Scroll-Assembly snippet to clipboard.');
    window.setTimeout(() => setCopiedWix(false), 2000);
  };

  const handleSyncToWix = () => {
    setWixSyncCount(prev => prev + 1);
    setLastSyncedStage(telemetry.activeStage.id);
    showToast(
      `Synced Origin Math · AI · Robotics Assembly (${telemetry.progressPercent}% · ${telemetry.lockedPartsCount}/12 parts) to @wix Studio.`
    );
  };

  const getPart = (id: string) => partsState.find(p => p.id === id) || partsState[0];

  const pMathSpiral = getPart('math-fibonacci-spiral');
  const pMathRiemann = getPart('math-riemann-ring');
  const pMathFourier = getPart('math-fourier-resonator');
  const pAiLeft = getPart('ai-attention-port');
  const pAiRight = getPart('ai-attention-starboard');
  const pAiBridge = getPart('ai-synaptic-bridge');
  const pRoboLidar = getPart('robo-lidar-dome');
  const pRoboLeft = getPart('robo-actuator-left');
  const pRoboRight = getPart('robo-actuator-right');
  const pRoboBase = getPart('robo-harmonic-chassis');
  const pCoreLock = getPart('core-phase-lock');
  const pWixBus = getPart('core-wix-telemetry-bus');

  const partSpringTransition = {
    type: 'spring' as const,
    stiffness: 130,
    damping: 22,
    mass: 0.65,
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Origin Mathematics, AI, and Robotics Scroll-Driven Parts Assembly"
      data-testid="origin-scroll-assembly"
      data-scroll-progress={telemetry.progressPercent}
      data-active-stage={telemetry.activeStage.id}
      data-locked-parts={telemetry.lockedPartsCount}
      className="space-y-8 pt-2"
    >
      {/* Clean Minimal Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="border-b border-slate-200/80 dark:border-white/10 pb-5 flex flex-col lg:flex-row lg:items-end justify-between gap-4"
      >
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-cyan-600 dark:text-cyan-400">
            <span>Framer Motion Scroll-Triggered Assembly</span>
            <span aria-hidden="true">·</span>
            <span>Origin Mathematics · AI · Robotics</span>
            <span aria-hidden="true">·</span>
            <span>@wix Studio Ready</span>
          </div>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            Origin Mathematics, AI &amp; Robotics Parts Assembly
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Scroll down through the three architectural domains—or use the stage controls—to
            trigger Framer Motion spring assembly of twelve precision subsystems into a unified core.
          </p>
        </div>

        {/* Clean Unboxed Telemetry Readout */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300 shrink-0">
          <div>
            <span className="text-slate-400 dark:text-slate-500">ASSEMBLY: </span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">
              {telemetry.progressPercent}%
            </span>
          </div>
          <span aria-hidden="true">·</span>
          <div>
            <span className="text-slate-400 dark:text-slate-500">PARTS LOCKED: </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {telemetry.lockedPartsCount}/{telemetry.totalPartsCount}
            </span>
          </div>
          <span aria-hidden="true">·</span>
          <div>
            <span className="text-slate-400 dark:text-slate-500">@WIX SYNC: </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              REV #{wixSyncCount}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Two-Column Scroll-Driven Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Sticky Interactive Assembly Blueprint Stage (7 Columns on Desktop) */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
          <div className="rounded-3xl border border-slate-200/80 dark:border-white/15 bg-slate-950 text-white overflow-hidden shadow-2xl">
            {/* Stage Top Control Bar */}
            <div className="px-4 sm:px-6 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-slate-900/80">
              <div className="flex items-center gap-2.5 text-xs font-mono tabular-nums">
                <span className="font-bold text-cyan-300">
                  {telemetry.activeStage.stageNumber} {telemetry.activeStage.title}
                </span>
                <span className="text-slate-500" aria-hidden="true">
                  |
                </span>
                <span className="text-slate-300">
                  {telemetry.isFullyAssembled
                    ? 'LOCKED (0.00 mm CLEARANCE)'
                    : `ASSEMBLING (${telemetry.lockedPartsCount}/12 LOCKED)`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (scrollProgress >= 0.99) {
                      setScrollProgress(0);
                    }
                    setIsAutoPlaying(prev => !prev);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  {isAutoPlaying ? (
                    <span>Pause Assembly</span>
                  ) : (
                    <span>Auto-Assemble</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAutoPlaying(false);
                    manualLockUntilRef.current = Date.now() + 600;
                    setScrollProgress(0);
                  }}
                  aria-label="Reset Exploded View"
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium transition cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <span>Explode</span>
                </button>
              </div>
            </div>

            {/* Framer Motion Smooth Progress Line */}
            <div className="w-full h-1 bg-slate-900 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400 origin-left"
                style={{ scaleX: smoothProgressBar }}
              />
            </div>

            {/* Interactive SVG Schematic Canvas with Framer Motion Spring-Animated Parts */}
            <div className="relative w-full aspect-[16/10] bg-slate-950 overflow-hidden">
              <svg
                viewBox="0 0 800 520"
                className="w-full h-full select-none"
                role="img"
                aria-label={`Origin Mathematics, AI, and Robotics Assembly Schematic at ${telemetry.progressPercent}% completion`}
              >
                <defs>
                  <radialGradient id="originCoreGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.22 + scrollProgress * 0.25} />
                    <stop offset="55%" stopColor="#6366f1" stopOpacity={0.08 + scrollProgress * 0.12} />
                    <stop offset="100%" stopColor="#020617" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="mathGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                  <linearGradient id="aiCyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                  <linearGradient id="roboEmeraldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>

                {/* Architectural Blueprint Coordinate Grid */}
                <g opacity="0.22">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <line
                      key={`v-${i}`}
                      x1={(i + 1) * 50}
                      y1="0"
                      x2={(i + 1) * 50}
                      y2="520"
                      stroke="#334155"
                      strokeWidth="1"
                    />
                  ))}
                  {Array.from({ length: 9 }).map((_, i) => (
                    <line
                      key={`h-${i}`}
                      x1="0"
                      y1={(i + 1) * 52}
                      x2="800"
                      y2={(i + 1) * 52}
                      stroke="#334155"
                      strokeWidth="1"
                    />
                  ))}
                  <circle
                    cx="400"
                    cy="260"
                    r="190"
                    fill="none"
                    stroke="#475569"
                    strokeWidth="1"
                    strokeDasharray="4 6"
                  />
                  <circle
                    cx="400"
                    cy="260"
                    r="125"
                    fill="none"
                    stroke="#475569"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                  />
                  <line x1="400" y1="20" x2="400" y2="500" stroke="#475569" strokeWidth="1" strokeDasharray="3 5" />
                  <line x1="80" y1="260" x2="720" y2="260" stroke="#475569" strokeWidth="1" strokeDasharray="3 5" />
                </g>

                {/* Central Core Ambient Field */}
                <circle cx="400" cy="260" r="210" fill="url(#originCoreGlow)" />

                {/* Assembly Trajectory Guide Vectors from Exploded Parts to Center (400, 260) */}
                <g>
                  {partsState.map(part => {
                    if (part.isLocked) return null;
                    return (
                      <line
                        key={`vector-${part.id}`}
                        x1={400 + part.currentDx}
                        y1={260 + part.currentDy}
                        x2={400}
                        y2={260}
                        stroke={
                          part.domain === 'origin-math'
                            ? '#f59e0b'
                            : part.domain === 'neural-ai'
                            ? '#38bdf8'
                            : part.domain === 'robotics-parts'
                            ? '#34d399'
                            : '#c084fc'
                        }
                        strokeWidth="1.2"
                        strokeDasharray="4 4"
                        opacity={0.45}
                      />
                    );
                  })}
                </g>

                {/* ============================================================
                    GROUP 1: ORIGIN MATHEMATICS PARTS (MTH-01, MTH-02, MTH-03)
                   ============================================================ */}
                {/* MTH-02: Riemann Metric Tensor Ring */}
                <motion.g
                  initial={false}
                  animate={{
                    x: pMathRiemann.currentDx,
                    y: pMathRiemann.currentDy,
                    rotate: pMathRiemann.currentRotateDeg,
                    scale: pMathRiemann.currentScale,
                    opacity: pMathRiemann.currentOpacity,
                  }}
                  transition={partSpringTransition}
                  style={{ transformOrigin: '400px 260px', transformBox: 'view-box' }}
                >
                  <circle
                    cx="400"
                    cy="260"
                    r="86"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeDasharray="14 6"
                  />
                  <ellipse
                    cx="400"
                    cy="260"
                    rx="86"
                    ry="34"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                  />
                  <ellipse
                    cx="400"
                    cy="260"
                    rx="34"
                    ry="86"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                  />
                  <text
                    x="468"
                    y="192"
                    fill="#fde68a"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    MTH-02 · ds²=g_μν
                  </text>
                </motion.g>

                {/* MTH-03: Fourier Harmonic Wave Resonator */}
                <motion.g
                  initial={false}
                  animate={{
                    x: pMathFourier.currentDx,
                    y: pMathFourier.currentDy,
                    rotate: pMathFourier.currentRotateDeg,
                    scale: pMathFourier.currentScale,
                    opacity: pMathFourier.currentOpacity,
                  }}
                  transition={partSpringTransition}
                  style={{ transformOrigin: '400px 260px', transformBox: 'view-box' }}
                >
                  <polygon
                    points="400,186 464,223 464,297 400,334 336,297 336,223"
                    fill="rgba(245, 158, 11, 0.08)"
                    stroke="#fbbf24"
                    strokeWidth="2"
                  />
                  <path
                    d="M 345 260 Q 372 225, 400 260 T 455 260"
                    fill="none"
                    stroke="#fde68a"
                    strokeWidth="2.2"
                  />
                  <text
                    x="352"
                    y="176"
                    fill="#fde68a"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    MTH-03 · F(ω)=∫f(t)e^-iωt
                  </text>
                </motion.g>

                {/* MTH-01: Fibonacci Golden Spiral Lattice */}
                <motion.g
                  initial={false}
                  animate={{
                    x: pMathSpiral.currentDx,
                    y: pMathSpiral.currentDy,
                    rotate: pMathSpiral.currentRotateDeg,
                    scale: pMathSpiral.currentScale,
                    opacity: pMathSpiral.currentOpacity,
                  }}
                  transition={partSpringTransition}
                  style={{ transformOrigin: '400px 260px', transformBox: 'view-box' }}
                >
                  <circle
                    cx="400"
                    cy="260"
                    r="52"
                    fill="rgba(251, 191, 36, 0.14)"
                    stroke="url(#mathGoldGrad)"
                    strokeWidth="3"
                  />
                  <path
                    d="M 400 260 A 8 8 0 0 1 408 268 A 13 13 0 0 1 395 281 A 21 21 0 0 1 374 260 A 34 34 0 0 1 408 226 A 48 48 0 0 1 448 268"
                    fill="none"
                    stroke="#fef08a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="400" cy="260" r="6" fill="#fbbf24" />
                  <text
                    x="310"
                    y="215"
                    fill="#fef08a"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    MTH-01 · φ=1.618
                  </text>
                </motion.g>

                {/* ============================================================
                    GROUP 2: ARTIFICIAL INTELLIGENCE PARTS (AI-04, AI-05, AI-06)
                   ============================================================ */}
                {/* AI-04: Port Transformer QKV Attention Wing */}
                <motion.g
                  initial={false}
                  animate={{
                    x: pAiLeft.currentDx,
                    y: pAiLeft.currentDy,
                    rotate: pAiLeft.currentRotateDeg,
                    scale: pAiLeft.currentScale,
                    opacity: pAiLeft.currentOpacity,
                  }}
                  transition={partSpringTransition}
                  style={{ transformOrigin: '400px 260px', transformBox: 'view-box' }}
                >
                  <path
                    d="M 248 195 L 316 215 L 316 305 L 248 325 L 222 290 L 222 230 Z"
                    fill="rgba(56, 189, 248, 0.14)"
                    stroke="url(#aiCyanGrad)"
                    strokeWidth="2.5"
                  />
                  {[225, 260, 295].map(ny => (
                    <g key={`ai-l-${ny}`}>
                      <circle cx="252" cy={ny} r="5" fill="#38bdf8" />
                      <circle cx="298" cy={ny} r="5" fill="#818cf8" />
                      <line x1="257" y1={ny} x2="293" y2={260} stroke="#38bdf8" strokeWidth="1.4" />
                      <line x1="257" y1={ny} x2="293" y2={ny} stroke="#7dd3fc" strokeWidth="1.2" />
                    </g>
                  ))}
                  <text
                    x="205"
                    y="184"
                    fill="#7dd3fc"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    AI-04 · QKV-PORT
                  </text>
                </motion.g>

                {/* AI-05: Starboard Transformer QKV Attention Wing */}
                <motion.g
                  initial={false}
                  animate={{
                    x: pAiRight.currentDx,
                    y: pAiRight.currentDy,
                    rotate: pAiRight.currentRotateDeg,
                    scale: pAiRight.currentScale,
                    opacity: pAiRight.currentOpacity,
                  }}
                  transition={partSpringTransition}
                  style={{ transformOrigin: '400px 260px', transformBox: 'view-box' }}
                >
                  <path
                    d="M 552 195 L 484 215 L 484 305 L 552 325 L 578 290 L 578 230 Z"
                    fill="rgba(56, 189, 248, 0.14)"
                    stroke="url(#aiCyanGrad)"
                    strokeWidth="2.5"
                  />
                  {[225, 260, 295].map(ny => (
                    <g key={`ai-r-${ny}`}>
                      <circle cx="548" cy={ny} r="5" fill="#38bdf8" />
                      <circle cx="502" cy={ny} r="5" fill="#818cf8" />
                      <line x1="543" y1={ny} x2="507" y2={260} stroke="#38bdf8" strokeWidth="1.4" />
                      <line x1="543" y1={ny} x2="507" y2={ny} stroke="#7dd3fc" strokeWidth="1.2" />
                    </g>
                  ))}
                  <text
                    x="490"
                    y="184"
                    fill="#7dd3fc"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    AI-05 · QKV-STBD
                  </text>
                </motion.g>

                {/* AI-06: Backpropagation Gradient Conduit */}
                <motion.g
                  initial={false}
                  animate={{
                    x: pAiBridge.currentDx,
                    y: pAiBridge.currentDy,
                    rotate: pAiBridge.currentRotateDeg,
                    scale: pAiBridge.currentScale,
                    opacity: pAiBridge.currentOpacity,
                  }}
                  transition={partSpringTransition}
                  style={{ transformOrigin: '400px 260px', transformBox: 'view-box' }}
                >
                  <rect
                    x="312"
                    y="332"
                    width="176"
                    height="28"
                    rx="8"
                    fill="rgba(99, 102, 241, 0.18)"
                    stroke="#818cf8"
                    strokeWidth="2"
                  />
                  <line x1="330" y1="346" x2="470" y2="346" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8 4" />
                  <text
                    x="334"
                    y="350"
                    fill="#e0e7ff"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    AI-06 · dL/dθ GRAD BUS
                  </text>
                </motion.g>

                {/* ============================================================
                    GROUP 3: PRECISION ROBOTICS PARTS (RBT-07 .. RBT-10)
                   ============================================================ */}
                {/* RBT-07: Optical LiDAR Spatial Perception Dome */}
                <motion.g
                  initial={false}
                  animate={{
                    x: pRoboLidar.currentDx,
                    y: pRoboLidar.currentDy,
                    rotate: pRoboLidar.currentRotateDeg,
                    scale: pRoboLidar.currentScale,
                    opacity: pRoboLidar.currentOpacity,
                  }}
                  transition={partSpringTransition}
                  style={{ transformOrigin: '400px 260px', transformBox: 'view-box' }}
                >
                  <path
                    d="M 332 152 C 332 108, 468 108, 468 152 L 448 172 L 352 172 Z"
                    fill="rgba(16, 185, 129, 0.16)"
                    stroke="url(#roboEmeraldGrad)"
                    strokeWidth="2.5"
                  />
                  <circle cx="400" cy="140" r="11" fill="#10b981" />
                  <circle cx="400" cy="140" r="5" fill="#ecfdf5" />
                  <text
                    x="342"
                    y="104"
                    fill="#6ee7b7"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    RBT-07 · LiDAR SLAM
                  </text>
                </motion.g>

                {/* RBT-08: 6-DOF Port Manipulator Actuator */}
                <motion.g
                  initial={false}
                  animate={{
                    x: pRoboLeft.currentDx,
                    y: pRoboLeft.currentDy,
                    rotate: pRoboLeft.currentRotateDeg,
                    scale: pRoboLeft.currentScale,
                    opacity: pRoboLeft.currentOpacity,
                  }}
                  transition={partSpringTransition}
                  style={{ transformOrigin: '400px 260px', transformBox: 'view-box' }}
                >
                  <rect
                    x="142"
                    y="222"
                    width="72"
                    height="76"
                    rx="12"
                    fill="rgba(16, 185, 129, 0.14)"
                    stroke="#34d399"
                    strokeWidth="2.5"
                  />
                  <circle cx="178" cy="260" r="16" fill="none" stroke="#6ee7b7" strokeWidth="2.5" />
                  <circle cx="178" cy="260" r="6" fill="#34d399" />
                  <line x1="214" y1="242" x2="236" y2="242" stroke="#34d399" strokeWidth="4" />
                  <line x1="214" y1="278" x2="236" y2="278" stroke="#34d399" strokeWidth="4" />
                  <text
                    x="128"
                    y="212"
                    fill="#6ee7b7"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    RBT-08 · 6-DOF ARM-L
                  </text>
                </motion.g>

                {/* RBT-09: 6-DOF Starboard Manipulator Actuator */}
                <motion.g
                  initial={false}
                  animate={{
                    x: pRoboRight.currentDx,
                    y: pRoboRight.currentDy,
                    rotate: pRoboRight.currentRotateDeg,
                    scale: pRoboRight.currentScale,
                    opacity: pRoboRight.currentOpacity,
                  }}
                  transition={partSpringTransition}
                  style={{ transformOrigin: '400px 260px', transformBox: 'view-box' }}
                >
                  <rect
                    x="586"
                    y="222"
                    width="72"
                    height="76"
                    rx="12"
                    fill="rgba(16, 185, 129, 0.14)"
                    stroke="#34d399"
                    strokeWidth="2.5"
                  />
                  <circle cx="622" cy="260" r="16" fill="none" stroke="#6ee7b7" strokeWidth="2.5" />
                  <circle cx="622" cy="260" r="6" fill="#34d399" />
                  <line x1="564" y1="242" x2="586" y2="242" stroke="#34d399" strokeWidth="4" />
                  <line x1="564" y1="278" x2="586" y2="278" stroke="#34d399" strokeWidth="4" />
                  <text
                    x="568"
                    y="212"
                    fill="#6ee7b7"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    RBT-09 · 6-DOF ARM-R
                  </text>
                </motion.g>

                {/* RBT-10: Harmonic Drive Gyroscope Base */}
                <motion.g
                  initial={false}
                  animate={{
                    x: pRoboBase.currentDx,
                    y: pRoboBase.currentDy,
                    rotate: pRoboBase.currentRotateDeg,
                    scale: pRoboBase.currentScale,
                    opacity: pRoboBase.currentOpacity,
                  }}
                  transition={partSpringTransition}
                  style={{ transformOrigin: '400px 260px', transformBox: 'view-box' }}
                >
                  <path
                    d="M 290 368 L 510 368 L 485 412 L 315 412 Z"
                    fill="rgba(16, 185, 129, 0.16)"
                    stroke="#34d399"
                    strokeWidth="2.5"
                  />
                  <circle cx="355" cy="390" r="10" fill="none" stroke="#6ee7b7" strokeWidth="2" />
                  <circle cx="400" cy="390" r="12" fill="none" stroke="#6ee7b7" strokeWidth="2.5" />
                  <circle cx="445" cy="390" r="10" fill="none" stroke="#6ee7b7" strokeWidth="2" />
                  <text
                    x="325"
                    y="430"
                    fill="#6ee7b7"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    RBT-10 · HARMONIC GYRO CHASSIS
                  </text>
                </motion.g>

                {/* ============================================================
                    GROUP 4: UNIFIED SYNTHESIS & @WIX BUS (SYN-11, WIX-12)
                   ============================================================ */}
                {/* SYN-11: Tri-Core Phase Lock Ring */}
                <motion.g
                  initial={false}
                  animate={{
                    x: pCoreLock.currentDx,
                    y: pCoreLock.currentDy,
                    rotate: pCoreLock.currentRotateDeg,
                    scale: pCoreLock.currentScale,
                    opacity: pCoreLock.currentOpacity,
                  }}
                  transition={partSpringTransition}
                  style={{ transformOrigin: '400px 260px', transformBox: 'view-box' }}
                >
                  <circle
                    cx="400"
                    cy="260"
                    r="155"
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="2"
                    strokeDasharray="28 10"
                  />
                  <text
                    x="255"
                    y="112"
                    fill="#e9d5ff"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    SYN-11 · TRI-CORE CONTAINMENT
                  </text>
                </motion.g>

                {/* WIX-12: @wix Custom Element Telemetry Bus */}
                <motion.g
                  initial={false}
                  animate={{
                    x: pWixBus.currentDx,
                    y: pWixBus.currentDy,
                    rotate: pWixBus.currentRotateDeg,
                    scale: pWixBus.currentScale,
                    opacity: pWixBus.currentOpacity,
                  }}
                  transition={partSpringTransition}
                  style={{ transformOrigin: '400px 260px', transformBox: 'view-box' }}
                >
                  <rect
                    x="326"
                    y="444"
                    width="148"
                    height="26"
                    rx="6"
                    fill="rgba(192, 132, 252, 0.18)"
                    stroke="#c084fc"
                    strokeWidth="2"
                  />
                  <text
                    x="340"
                    y="461"
                    fill="#f3e8ff"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    WIX-12 · @WIX VELO BUS
                  </text>
                </motion.g>

                {/* Bottom-Left Live Equation Overlay */}
                <g transform="translate(20, 485)">
                  <text fill="#94a3b8" fontSize="11" fontFamily="monospace">
                    ACTIVE EQUATION: {telemetry.activeStage.equation}
                  </text>
                </g>
              </svg>

              {/* Scroll Prompt Indicator when at 0% */}
              <AnimatePresence>
                {telemetry.progressPercent < 15 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute bottom-3 right-4 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-400/30 text-[11px] font-medium text-cyan-300 flex items-center gap-1.5 pointer-events-none"
                  >
                    <span>Scroll down to assemble parts</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Interactive Manual Scrubber & 3-Domain Completion Readouts */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-900/60 space-y-3.5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label
                    htmlFor="assembly-scroll-scrubber"
                    className="font-semibold text-slate-200 flex items-center gap-1.5"
                  >
                    <span>Interactive Scroll-Assembly Scrubber (Origin Math → AI → Robotics)</span>
                  </label>
                  <span className="font-mono font-bold text-cyan-300 tabular-nums">
                    {telemetry.progressPercent}% Assembled
                  </span>
                </div>
                <input
                  id="assembly-scroll-scrubber"
                  type="range"
                  min={0}
                  max={100}
                  value={telemetry.progressPercent}
                  onChange={e => {
                    setIsAutoPlaying(false);
                    manualLockUntilRef.current = Date.now() + 900;
                    setScrollProgress(clampScrollProgress(Number(e.target.value) / 100));
                  }}
                  aria-label="Origin Math AI Robotics Assembly Progress"
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* 3 Domain Completion Readouts with Framer Motion Progress Bars */}
              <div className="grid grid-cols-3 gap-3 pt-0.5 font-mono text-xs tabular-nums">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-400/20 space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] text-amber-300 font-semibold truncate">
                      01. Origin Math
                    </span>
                    <span className="text-xs font-bold text-white">
                      {telemetry.mathCompletionPercent}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-400"
                      initial={false}
                      animate={{ width: `${telemetry.mathCompletionPercent}%` }}
                      transition={partSpringTransition}
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-sky-400/20 space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] text-sky-300 font-semibold truncate">
                      02. AI Core
                    </span>
                    <span className="text-xs font-bold text-white">
                      {telemetry.aiCompletionPercent}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-sky-400"
                      initial={false}
                      animate={{ width: `${telemetry.aiCompletionPercent}%` }}
                      transition={partSpringTransition}
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-400/20 space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] text-emerald-300 font-semibold truncate">
                      03. Robotics
                    </span>
                    <span className="text-xs font-bold text-white">
                      {telemetry.roboticsCompletionPercent}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-400"
                      initial={false}
                      animate={{ width: `${telemetry.roboticsCompletionPercent}%` }}
                      transition={partSpringTransition}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Minimal Scroll-Triggered Domain Sections & @wix Bridge (5 Columns) */}
        <div className="lg:col-span-5 space-y-5">
          {ORIGIN_ASSEMBLY_STAGES.map((stage, stageIdx) => {
            const isCurrent = telemetry.activeStage.id === stage.id;
            const isCompleted = scrollProgress >= stage.maxProgress;
            const stageParts = partsState.filter(p => p.domain === stage.id);

            return (
              <motion.article
                key={stage.id}
                id={`assembly-chapter-${stage.id}`}
                data-testid={`scroll-section-${stage.id}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{
                  duration: 0.45,
                  delay: stageIdx * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`p-5 rounded-2xl border transition-colors ${
                  isCurrent
                    ? 'border-cyan-500/70 bg-cyan-500/5 dark:bg-cyan-950/25 shadow-lg'
                    : 'border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs font-mono">
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">
                    {stage.stageNumber} {stage.scrollRangeLabel}
                  </span>
                  <span
                    className={`font-semibold ${
                      isCompleted
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : isCurrent
                        ? 'text-amber-600 dark:text-amber-300'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {isCompleted
                      ? 'LOCKED · 100%'
                      : isCurrent
                      ? 'ASSEMBLING ON SCROLL'
                      : 'SCROLL TO ASSEMBLE'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                  {stage.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  {stage.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                  {stage.summary}
                </p>

                {/* Framer Motion Scroll-Triggered Domain Parts Assembly List */}
                <div className="mt-3.5 space-y-2 pt-3 border-t border-slate-200/60 dark:border-white/10">
                  {stageParts.map(part => (
                    <motion.div
                      key={part.id}
                      initial={false}
                      animate={{
                        x: (1 - part.localProgress) * 10,
                        opacity: 0.65 + part.localProgress * 0.35,
                      }}
                      transition={partSpringTransition}
                      className="flex items-center justify-between gap-2 text-xs font-mono tabular-nums"
                    >
                      <div className="min-w-0 flex items-center gap-2">
                        <span className="font-bold text-cyan-600 dark:text-cyan-400 shrink-0">
                          {part.code}
                        </span>
                        <span className="font-sans font-medium text-slate-800 dark:text-slate-200 truncate">
                          {part.name}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 text-[11px] ${
                          part.isLocked
                            ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {part.isLocked
                          ? 'LOCKED (0.0mm)'
                          : `Δ ${part.clearanceMm.toFixed(1)}mm · ${Math.round(part.localProgress * 100)}%`}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <code className="text-[11px] font-mono text-cyan-700 dark:text-cyan-300">
                    {stage.equation}
                  </code>

                  <button
                    type="button"
                    onClick={() => handleSelectStage(stage.targetProgress, stage.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white/10 hover:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:hover:text-slate-950 text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Assemble Stage {stage.stageNumber.replace('.', '')}
                  </button>
                </div>
              </motion.article>
            );
          })}

          {/* Minimal @wix Home Page Scroll-Assembly Bridge */}
          <motion.div
            data-testid="wix-home-scroll-studio"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="p-5 rounded-2xl border border-cyan-500/30 bg-slate-950 text-white space-y-3.5 shadow-xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-[11px] font-mono text-cyan-300">
                  @wix/sdk v1.15.0 · Scroll-Triggered Assembly Bridge
                </div>
                <h3 className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
                  <span>@wix Home Page Scroll-Assembly Studio</span>
                </h3>
              </div>

              <button
                type="button"
                onClick={handleSyncToWix}
                className="px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <span>Sync Home Assembly to @wix</span>
              </button>
            </div>

            {/* Segmented Control for @wix Code Modes */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-white/10">
              <button
                type="button"
                onClick={() => setWixMode('velo-scroll-code')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  wixMode === 'velo-scroll-code'
                    ? 'bg-cyan-400 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                @wix Velo Scroll Code
              </button>
              <button
                type="button"
                onClick={() => setWixMode('custom-element-tag')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  wixMode === 'custom-element-tag'
                    ? 'bg-cyan-400 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                @wix Custom Element Tag
              </button>
              <button
                type="button"
                onClick={() => setWixMode('wix-cms-schema')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  wixMode === 'wix-cms-schema'
                    ? 'bg-cyan-400 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                @wix CMS Schema
              </button>
            </div>

            {/* Compact Live Code Preview */}
            <div className="relative rounded-xl bg-slate-900/90 border border-white/10 p-3 font-mono text-[11px] text-cyan-200 max-h-44 overflow-y-auto">
              <pre className="leading-relaxed whitespace-pre-wrap break-words">{wixCodeSnippet}</pre>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs">
              <div className="text-slate-400 font-mono">
                Stage: <span className="text-cyan-300">{lastSyncedStage}</span> · Rev #{wixSyncCount}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyWixCode}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>{copiedWix ? 'Copied' : 'Copy @wix Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-cyan-300 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Open Full @wix Builder</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
