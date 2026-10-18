export type AssemblyDomainId = 'origin-math' | 'neural-ai' | 'robotics-parts' | 'unified-core';

export interface AssemblyPartSpec {
  id: string;
  code: string;
  name: string;
  domain: AssemblyDomainId;
  domainLabel: string;
  formulaOrSpec: string;
  description: string;
  /** Scroll range [startProgress, lockProgress] in [0..1] during which this part moves from exploded to locked */
  startProgress: number;
  lockProgress: number;
  /** Initial exploded translation in SVG viewBox units (center is 400, 260) */
  explodedDx: number;
  explodedDy: number;
  explodedRotateDeg: number;
  explodedScale: number;
}

export interface ComputedPartState extends AssemblyPartSpec {
  /** Normalized local progress 0 (fully exploded) to 1 (locked into core) */
  localProgress: number;
  isLocked: boolean;
  isAssembling: boolean;
  currentDx: number;
  currentDy: number;
  currentRotateDeg: number;
  currentScale: number;
  currentOpacity: number;
  clearanceMm: number;
}

export interface AssemblyStageSpec {
  id: AssemblyDomainId;
  stageNumber: string;
  title: string;
  subtitle: string;
  scrollRangeLabel: string;
  minProgress: number;
  maxProgress: number;
  targetProgress: number;
  equation: string;
  summary: string;
  keyParts: string[];
  wixElementSelector: string;
}

export const ORIGIN_ASSEMBLY_STAGES: AssemblyStageSpec[] = [
  {
    id: 'origin-math',
    stageNumber: '01.',
    title: 'Origin Mathematics Foundation',
    subtitle: 'Golden Ratio · Riemann Manifolds · Stochastic Calculus',
    scrollRangeLabel: '0% – 30% Scroll',
    minProgress: 0,
    maxProgress: 0.3,
    targetProgress: 0.3,
    equation: 'e^(iπ) + 1 = 0  ·  dX_t = μ dt + σ dW_t',
    summary:
      'As you begin scrolling down the page, Euclidean geometric rings, Fibonacci spiral lattices, and Fourier harmonic wave plates converge from outer space to form the immutable mathematical bedrock.',
    keyParts: [
      'Fibonacci Golden Spiral Lattice',
      'Riemann Metric Tensor Ring',
      'Fourier Harmonic Wave Resonator',
    ],
    wixElementSelector: '#mathOriginCore',
  },
  {
    id: 'neural-ai',
    stageNumber: '02.',
    title: 'Artificial Intelligence Tensor Core',
    subtitle: 'Multi-Head Attention · Synaptic Weights · Gradient Flow',
    scrollRangeLabel: '30% – 62% Scroll',
    minProgress: 0.3,
    maxProgress: 0.62,
    targetProgress: 0.6,
    equation: 'Attention(Q,K,V) = softmax(Q·K^T / √d_k) V',
    summary:
      'Scrolling through the mid-page brings the left and right Transformer Attention arrays and backpropagation synaptic bridges inward, docking directly onto the mathematical coordinate ring.',
    keyParts: [
      'Transformer QKV Attention Array (Port)',
      'Transformer QKV Attention Array (Starboard)',
      'Backpropagation Gradient Conduit',
    ],
    wixElementSelector: '#aiTensorMatrix',
  },
  {
    id: 'robotics-parts',
    stageNumber: '03.',
    title: 'Precision Robotics Parts & Kinematics',
    subtitle: '6-DOF Harmonic Drives · LiDAR Dome · Inverse Kinematics',
    scrollRangeLabel: '62% – 88% Scroll',
    minProgress: 0.62,
    maxProgress: 0.88,
    targetProgress: 0.86,
    equation: 'τ = J^T(θ)·F  ·  M(q)q" + C(q,q\')q\' + g(q) = τ',
    summary:
      'Continuing down the page assembles the physical robotics hardware: the upper LiDAR perception dome, lower harmonic servo chassis, and dual 6-DOF articulated manipulator arms lock around the AI cortex.',
    keyParts: [
      'Optical LiDAR Perception Dome',
      '6-DOF Port Manipulator Actuator',
      '6-DOF Starboard Manipulator Actuator',
      'Harmonic Drive Gyroscope Base',
    ],
    wixElementSelector: '#roboticsKinematicFrame',
  },
  {
    id: 'unified-core',
    stageNumber: '04.',
    title: 'Unified Origin Math · AI · Robotics Synthesis',
    subtitle: 'Zero-Tolerance Mechanical Lock · @wix Custom Element Ready',
    scrollRangeLabel: '88% – 100% Scroll',
    minProgress: 0.88,
    maxProgress: 1.0,
    targetProgress: 1.0,
    equation: 'L_total = L_math + λ1·L_AI + λ2·L_robotics',
    summary:
      'At the base of the scroll journey, all twelve precision subsystems achieve zero-clearance mechanical lock (0.00 mm), coupling pure mathematical axioms with neural intelligence and embodied robotics on @wix.',
    keyParts: [
      'Tri-Core Phase Lock Ring',
      '@wix Custom Element Telemetry Bus',
    ],
    wixElementSelector: '#unifiedOriginSystem',
  },
];

export const ORIGIN_ASSEMBLY_PARTS: AssemblyPartSpec[] = [
  // Stage 1: Origin Mathematics (3 parts)
  {
    id: 'math-fibonacci-spiral',
    code: 'MTH-01',
    name: 'Fibonacci Golden Spiral Lattice',
    domain: 'origin-math',
    domainLabel: 'Origin Mathematics',
    formulaOrSpec: 'φ = (1 + √5) / 2 ≈ 1.61803',
    description: 'Sacred geometric logarithmic spiral defining spatial proportion and invariants.',
    startProgress: 0.0,
    lockProgress: 0.22,
    explodedDx: -190,
    explodedDy: -115,
    explodedRotateDeg: -65,
    explodedScale: 0.78,
  },
  {
    id: 'math-riemann-ring',
    code: 'MTH-02',
    name: 'Riemann Metric Tensor Ring',
    domain: 'origin-math',
    domainLabel: 'Origin Mathematics',
    formulaOrSpec: 'ds² = g_μν dx^μ dx^ν',
    description: 'Non-Euclidean curvature coordinate ring anchoring all spatial transformations.',
    startProgress: 0.04,
    lockProgress: 0.26,
    explodedDx: 185,
    explodedDy: -110,
    explodedRotateDeg: 55,
    explodedScale: 0.82,
  },
  {
    id: 'math-fourier-resonator',
    code: 'MTH-03',
    name: 'Fourier Harmonic Wave Resonator',
    domain: 'origin-math',
    domainLabel: 'Origin Mathematics',
    formulaOrSpec: 'F(ω) = ∫ f(t) e^(-iωt) dt',
    description: 'Frequency-domain harmonic oscillator converting continuous signals into spectral basis.',
    startProgress: 0.08,
    lockProgress: 0.30,
    explodedDx: 0,
    explodedDy: -145,
    explodedRotateDeg: 40,
    explodedScale: 0.8,
  },

  // Stage 2: Neural AI Core (3 parts)
  {
    id: 'ai-attention-port',
    code: 'AI-04',
    name: 'Transformer QKV Attention Wing (Left)',
    domain: 'neural-ai',
    domainLabel: 'Artificial Intelligence',
    formulaOrSpec: 'softmax(Q·K^T / √d_k) V',
    description: 'Port-side multi-head self-attention tensor block routing contextual embeddings.',
    startProgress: 0.24,
    lockProgress: 0.50,
    explodedDx: -240,
    explodedDy: 10,
    explodedRotateDeg: -28,
    explodedScale: 0.84,
  },
  {
    id: 'ai-attention-starboard',
    code: 'AI-05',
    name: 'Transformer QKV Attention Wing (Right)',
    domain: 'neural-ai',
    domainLabel: 'Artificial Intelligence',
    formulaOrSpec: 'H = Concat(head_1, ..., head_h)W^O',
    description: 'Starboard multi-head attention processor synthesizing cross-modal representations.',
    startProgress: 0.28,
    lockProgress: 0.54,
    explodedDx: 240,
    explodedDy: 10,
    explodedRotateDeg: 28,
    explodedScale: 0.84,
  },
  {
    id: 'ai-synaptic-bridge',
    code: 'AI-06',
    name: 'Backpropagation Gradient Conduit',
    domain: 'neural-ai',
    domainLabel: 'Artificial Intelligence',
    formulaOrSpec: 'dL/dθ = ∂L / ∂θ',
    description: 'High-bandwidth neural bus linking the Origin Math core to deep policy weights.',
    startProgress: 0.34,
    lockProgress: 0.60,
    explodedDx: 0,
    explodedDy: 135,
    explodedRotateDeg: -35,
    explodedScale: 0.85,
  },

  // Stage 3: Robotics Parts (4 parts)
  {
    id: 'robo-lidar-dome',
    code: 'RBT-07',
    name: 'Optical LiDAR Spatial Perception Dome',
    domain: 'robotics-parts',
    domainLabel: 'Robotics Parts',
    formulaOrSpec: '360° SLAM · 2.4M pts/sec',
    description: 'Upper solid-state laser rangefinder dome providing real-time 3D point cloud SLAM.',
    startProgress: 0.52,
    lockProgress: 0.76,
    explodedDx: 0,
    explodedDy: -165,
    explodedRotateDeg: 0,
    explodedScale: 0.86,
  },
  {
    id: 'robo-actuator-left',
    code: 'RBT-08',
    name: '6-DOF Port Manipulator Actuator',
    domain: 'robotics-parts',
    domainLabel: 'Robotics Parts',
    formulaOrSpec: 'τ = J^T(θ) F · 180 Nm Peak',
    description: 'Left articulated titanium robotic arm assembly with torque-controlled joints.',
    startProgress: 0.56,
    lockProgress: 0.82,
    explodedDx: -255,
    explodedDy: 85,
    explodedRotateDeg: -42,
    explodedScale: 0.82,
  },
  {
    id: 'robo-actuator-right',
    code: 'RBT-09',
    name: '6-DOF Starboard Manipulator Actuator',
    domain: 'robotics-parts',
    domainLabel: 'Robotics Parts',
    formulaOrSpec: 'Inverse Kinematics Solver · 1 kHz',
    description: 'Right articulated robotic manipulator synchronized with neural visual servoing.',
    startProgress: 0.60,
    lockProgress: 0.85,
    explodedDx: 255,
    explodedDy: 85,
    explodedRotateDeg: 42,
    explodedScale: 0.82,
  },
  {
    id: 'robo-harmonic-chassis',
    code: 'RBT-10',
    name: 'Harmonic Drive Gyroscope Base',
    domain: 'robotics-parts',
    domainLabel: 'Robotics Parts',
    formulaOrSpec: 'Zero-Backlash Strain Wave Gear',
    description: 'Lower bipedal balance stabilizer and strain-wave reduction drive housing.',
    startProgress: 0.64,
    lockProgress: 0.88,
    explodedDx: 0,
    explodedDy: 170,
    explodedRotateDeg: 20,
    explodedScale: 0.86,
  },

  // Stage 4: Unified Synthesis & @wix Bus (2 parts)
  {
    id: 'core-phase-lock',
    code: 'SYN-11',
    name: 'Tri-Core Phase Lock Ring',
    domain: 'unified-core',
    domainLabel: 'Unified Synthesis',
    formulaOrSpec: '0.00 mm Mechanical Tolerance',
    description: 'Outer containment ring sealing Origin Math, AI Tensors, and Robotics Kinematics.',
    startProgress: 0.78,
    lockProgress: 0.96,
    explodedDx: -160,
    explodedDy: 140,
    explodedRotateDeg: -90,
    explodedScale: 0.75,
  },
  {
    id: 'core-wix-telemetry-bus',
    code: 'WIX-12',
    name: '@wix Custom Element Telemetry Bus',
    domain: 'unified-core',
    domainLabel: 'Unified Synthesis',
    formulaOrSpec: '<europa-origin-scroll-assembly>',
    description: 'Live @wix/sdk Velo bridge broadcasting scroll-assembly state to the host website.',
    startProgress: 0.82,
    lockProgress: 1.0,
    explodedDx: 160,
    explodedDy: 140,
    explodedRotateDeg: 90,
    explodedScale: 0.75,
  },
];

export function clampScrollProgress(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

/** Smooth cubic easing for mechanical part docking */
export function easeOutCubic(t: number): number {
  const clamped = clampScrollProgress(t);
  return 1 - Math.pow(1 - clamped, 3);
}

/**
 * Given overall page/section scroll progress in [0..1], computes the exact
 * position, rotation, scale, clearance, and lock state for all 12 parts.
 */
export function computeAssemblyPartsState(scrollProgress: number): ComputedPartState[] {
  const p = clampScrollProgress(scrollProgress);

  return ORIGIN_ASSEMBLY_PARTS.map(part => {
    const span = Math.max(0.0001, part.lockProgress - part.startProgress);
    const rawLocal = clampScrollProgress((p - part.startProgress) / span);
    const eased = easeOutCubic(rawLocal);
    const remaining = 1 - eased;

    const isLocked = rawLocal >= 0.995;
    const isAssembling = rawLocal > 0 && !isLocked;

    const currentDx = Number((part.explodedDx * remaining).toFixed(2));
    const currentDy = Number((part.explodedDy * remaining).toFixed(2));
    const currentRotateDeg = Number((part.explodedRotateDeg * remaining).toFixed(2));
    const currentScale = Number((part.explodedScale + (1 - part.explodedScale) * eased).toFixed(3));
    const currentOpacity = Number((0.42 + 0.58 * eased).toFixed(3));
    const radialDist = Math.hypot(currentDx, currentDy);
    const clearanceMm = isLocked ? 0 : Number((radialDist * 0.15).toFixed(1));

    return {
      ...part,
      localProgress: Number(eased.toFixed(3)),
      isLocked,
      isAssembling,
      currentDx,
      currentDy,
      currentRotateDeg,
      currentScale,
      currentOpacity,
      clearanceMm,
    };
  });
}

export function resolveActiveAssemblyStage(scrollProgress: number): AssemblyStageSpec {
  const p = clampScrollProgress(scrollProgress);
  for (let i = ORIGIN_ASSEMBLY_STAGES.length - 1; i >= 0; i--) {
    const stage = ORIGIN_ASSEMBLY_STAGES[i];
    if (p >= stage.minProgress) {
      return stage;
    }
  }
  return ORIGIN_ASSEMBLY_STAGES[0];
}

export function summarizeAssemblyTelemetry(scrollProgress: number): {
  progressPercent: number;
  lockedPartsCount: number;
  assemblingPartsCount: number;
  totalPartsCount: number;
  activeStage: AssemblyStageSpec;
  mathCompletionPercent: number;
  aiCompletionPercent: number;
  roboticsCompletionPercent: number;
  isFullyAssembled: boolean;
} {
  const p = clampScrollProgress(scrollProgress);
  const parts = computeAssemblyPartsState(p);
  const lockedPartsCount = parts.filter(item => item.isLocked).length;
  const assemblingPartsCount = parts.filter(item => item.isAssembling).length;

  const domainAvg = (domain: AssemblyDomainId) => {
    const subset = parts.filter(item => item.domain === domain);
    if (subset.length === 0) return 0;
    const sum = subset.reduce((acc, item) => acc + item.localProgress, 0);
    return Math.round((sum / subset.length) * 100);
  };

  return {
    progressPercent: Math.round(p * 100),
    lockedPartsCount,
    assemblingPartsCount,
    totalPartsCount: parts.length,
    activeStage: resolveActiveAssemblyStage(p),
    mathCompletionPercent: domainAvg('origin-math'),
    aiCompletionPercent: domainAvg('neural-ai'),
    roboticsCompletionPercent: domainAvg('robotics-parts'),
    isFullyAssembled: lockedPartsCount === parts.length,
  };
}

export type WixHomeEmbedMode = 'velo-scroll-code' | 'custom-element-tag' | 'wix-cms-schema';

export function buildWixHomeScrollSnippet(options: {
  mode: WixHomeEmbedMode;
  scrollProgress: number;
  themeId: string;
  siteNamespace?: string;
}): string {
  const telemetry = summarizeAssemblyTelemetry(options.scrollProgress);
  const namespace = options.siteNamespace || 'europa-ai-origin';

  if (options.mode === 'custom-element-tag') {
    return `<!-- @wix Studio Custom Element: Home Page Scroll-Driven Assembly -->
<europa-origin-scroll-assembly
  id="europaOriginAssembly"
  site-namespace="${namespace}"
  theme-id="${options.themeId}"
  scroll-progress="${(clampScrollProgress(options.scrollProgress)).toFixed(2)}"
  active-stage="${telemetry.activeStage.id}"
  math-completion="${telemetry.mathCompletionPercent}"
  ai-completion="${telemetry.aiCompletionPercent}"
  robotics-completion="${telemetry.roboticsCompletionPercent}"
  locked-parts="${telemetry.lockedPartsCount}/${telemetry.totalPartsCount}"
  wix-scroll-sync="enabled"
></europa-origin-scroll-assembly>`;
  }

  if (options.mode === 'wix-cms-schema') {
    return JSON.stringify(
      {
        $schema: 'https://dev.wix.com/wix-cli/schemas/home-scroll-assembly.json',
        provider: '@wix/sdk',
        collectionId: 'OriginScrollAssemblyKeyframes',
        siteNamespace: namespace,
        themeId: options.themeId,
        liveTelemetry: {
          scrollProgressPercent: telemetry.progressPercent,
          activeStageId: telemetry.activeStage.id,
          lockedParts: `${telemetry.lockedPartsCount}/${telemetry.totalPartsCount}`,
          subsystems: {
            originMathematics: `${telemetry.mathCompletionPercent}%`,
            neuralAiCore: `${telemetry.aiCompletionPercent}%`,
            roboticsKinematics: `${telemetry.roboticsCompletionPercent}%`,
          },
        },
        stages: ORIGIN_ASSEMBLY_STAGES.map(s => ({
          id: s.id,
          title: s.title,
          scrollRange: s.scrollRangeLabel,
          wixSelector: s.wixElementSelector,
        })),
      },
      null,
      2
    );
  }

  return `// @wix Studio Velo Home Page Code (masterPage.js / Home.js)
import wixWindowFrontend from 'wix-window-frontend';
import { createClient, OAuthStrategy } from '@wix/sdk';

$w.onReady(function () {
  const assemblyEl = $w('#europaOriginAssembly');
  assemblyEl.setAttribute('theme-id', '${options.themeId}');
  assemblyEl.setAttribute('active-stage', '${telemetry.activeStage.id}');

  // Drive Origin Mathematics, AI & Robotics Parts Assembly on User Scroll Down
  wixWindowFrontend.getBoundingRect().then((rect) => {
    const progress = Math.min(1, Math.max(0, rect.scroll.y / Math.max(1, rect.document.height - rect.window.height)));
    assemblyEl.setAttribute('scroll-progress', String(progress.toFixed(3)));
    assemblyEl.setAttribute('locked-parts', '${telemetry.lockedPartsCount}/${telemetry.totalPartsCount}');
  });
});`;
}
