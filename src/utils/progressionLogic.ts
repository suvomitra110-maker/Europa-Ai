export type SolarPreset = 'dawn' | 'day' | 'sunset' | 'night';

export interface XpState {
  xp: number;
  level: number;
  nextLevelXp: number;
}

export interface XpProgressSummary {
  level: number;
  xp: number;
  nextLevelXp: number;
  currentLevelFloorXp: number;
  xpIntoLevel: number;
  xpNeededForLevel: number;
  progressPercent: number;
  xpRemaining: number;
  rankTitle: string;
}

export interface MilestoneEvaluationInput {
  completedAiLecturesCount: number;
  totalAiLecturesCount: number;
  completedAiStepsCount: number;
  completedQuantStrategiesCount: number;
  totalQuantStrategiesCount: number;
  xp: number;
  level: number;
  streakDays: number;
  notesCount: number;
  highScore2D?: number;
  highScore3D?: number;
  gamesPlayed?: number;
}

export interface AchievementMilestoneProgress {
  badgeId: string;
  path: 'ai' | 'quant' | 'general';
  currentValue: number;
  targetValue: number;
  unitLabel: string;
  progressPercent: number;
  shouldUnlock: boolean;
  milestoneLabel: string;
}

export const LEVEL_STEP_XP = 800;

export function getLevelFloorXp(level: number, nextLevelXp: number): number {
  if (level <= 1) return 0;
  return Math.max(0, nextLevelXp - LEVEL_STEP_XP);
}

export function getRankTitle(level: number): string {
  if (level >= 10) return 'Grandmaster of Europa';
  if (level >= 8) return 'Principal Quant & AI Fellow';
  if (level >= 6) return 'Frontier Systems Architect';
  if (level >= 4) return 'Neural & Alpha Researcher';
  if (level >= 2) return 'Applied AI & Quant Scholar';
  return 'Initiate Scholar';
}

export function calculateXpProgress(xp: number, level: number, nextLevelXp: number): XpProgressSummary {
  const safeLevel = Math.max(1, level);
  const safeNextXp = Math.max(500, nextLevelXp);
  const floorXp = getLevelFloorXp(safeLevel, safeNextXp);
  const span = Math.max(100, safeNextXp - floorXp);
  const xpIntoLevel = Math.max(0, xp - floorXp);
  const rawPct = Math.round((xpIntoLevel / span) * 100);
  const progressPercent = Math.min(100, Math.max(0, rawPct));
  const xpRemaining = Math.max(0, safeNextXp - xp);

  return {
    level: safeLevel,
    xp,
    nextLevelXp: safeNextXp,
    currentLevelFloorXp: floorXp,
    xpIntoLevel,
    xpNeededForLevel: span,
    progressPercent,
    xpRemaining,
    rankTitle: getRankTitle(safeLevel),
  };
}

export function applyXpGain(state: XpState, earnedXp: number): XpState & { leveledUp: boolean; levelsGained: number } {
  const safeGain = Math.max(0, Math.round(earnedXp));
  const nextXp = state.xp + safeGain;
  let nextLevel = state.level;
  let nextThreshold = state.nextLevelXp;
  let levelsGained = 0;

  while (nextXp >= nextThreshold) {
    nextLevel += 1;
    nextThreshold += LEVEL_STEP_XP;
    levelsGained += 1;
  }

  return {
    xp: nextXp,
    level: nextLevel,
    nextLevelXp: nextThreshold,
    leveledUp: levelsGained > 0,
    levelsGained,
  };
}

export function resolveSolarPreset(preset: SolarPreset): {
  solarPhase: SolarPreset;
  sunHour: number;
  theme: 'light' | 'dark';
  label: string;
} {
  switch (preset) {
    case 'dawn':
      return { solarPhase: 'dawn', sunHour: 6.5, theme: 'dark', label: 'Dawn Horizon (06:30)' };
    case 'day':
      return { solarPhase: 'day', sunHour: 12.0, theme: 'light', label: 'Solar Zenith Day (12:00)' };
    case 'sunset':
      return { solarPhase: 'sunset', sunHour: 18.25, theme: 'dark', label: 'Golden Sunset (18:15)' };
    case 'night':
    default:
      return { solarPhase: 'night', sunHour: 23.5, theme: 'dark', label: 'Celestial Night (23:30)' };
  }
}

export type DesignThemeId =
  | 'europa-night'
  | 'solar-zenith'
  | 'dawn-horizon'
  | 'golden-sunset'
  | 'ai-roadster-crimson'
  | 'ai-roadster-electro'
  | 'ai-roadster-solar-gt'
  | 'quant-emerald'
  | 'nordic-frost'
  | 'tokyo-cyber'
  | 'oxford-ivory'
  | 'deep-nebula'
  | 'monolith-obsidian'
  | 'biolum-ocean'
  | 'sahara-sandstone'
  | 'kolkata-durga-sindoor'
  | 'kolkata-shiuli-dawn'
  | 'kolkata-pandal-lights'
  | 'kolkata-hooghly-ghat'
  | 'futuristic-dyson-sphere'
  | 'futuristic-quantum-holo'
  | 'futuristic-solarpunk-eden'
  | 'futuristic-chrono-nexus';

export interface RoadsterSpec {
  drivetrain: string;
  zeroToSixty: string;
  autonomyCore: string;
  aeroDragCd: string;
}

export interface CulturalHeritageSpec {
  motif: string;
  landmark: string;
  ambiance: string;
  season: string;
}

export interface FuturisticTechSpec {
  architecture: string;
  computeDensity: string;
  energyCore: string;
  era: string;
}

export interface DesignThemeConfig {
  id: DesignThemeId;
  name: string;
  subtitle: string;
  category:
    | 'original-solar'
    | 'ai-roadster'
    | 'quant-tech'
    | 'editorial-light'
    | 'deep-space'
    | 'futuristic'
    | 'kolkata-durga-puja';
  mode: 'dark' | 'light';
  solarPhase: SolarPreset;
  sunHour: number;
  skyGradient: string;
  cardBg: string;
  panelBg: string;
  borderColor: string;
  accentPrimary: string;
  accentSecondary: string;
  textPrimary: string;
  orbColors: [string, string, string];
  swatchColors: [string, string, string, string];
  badgeText: string;
  roadsterSpec?: RoadsterSpec;
  culturalSpec?: CulturalHeritageSpec;
  futuristicSpec?: FuturisticTechSpec;
}

export const DESIGN_THEMES: DesignThemeConfig[] = [
  {
    id: 'europa-night',
    name: 'Celestial Night',
    subtitle: 'Original deep Europa starlight & cyan glass',
    category: 'original-solar',
    mode: 'dark',
    solarPhase: 'night',
    sunHour: 23.5,
    skyGradient: 'linear-gradient(180deg, #050814 0%, #0a0f29 40%, #0b1120 70%, #020408 100%)',
    cardBg: 'rgba(15, 23, 42, 0.58)',
    panelBg: 'rgba(15, 23, 42, 0.45)',
    borderColor: 'rgba(56, 189, 248, 0.22)',
    accentPrimary: '#06b6d4',
    accentSecondary: '#6366f1',
    textPrimary: '#f8fafc',
    orbColors: ['rgba(59, 130, 246, 0.25)', 'rgba(139, 92, 246, 0.22)', 'rgba(6, 182, 212, 0.22)'],
    swatchColors: ['#050814', '#0a0f29', '#06b6d4', '#6366f1'],
    badgeText: 'Current Default',
  },
  {
    id: 'solar-zenith',
    name: 'Solar Zenith Day',
    subtitle: 'Original radiant sky-blue & alabaster daylight glass',
    category: 'original-solar',
    mode: 'light',
    solarPhase: 'day',
    sunHour: 12.0,
    skyGradient: 'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 25%, #bae6fd 60%, #f0f9ff 100%)',
    cardBg: 'rgba(255, 255, 255, 0.65)',
    panelBg: 'rgba(255, 255, 255, 0.50)',
    borderColor: 'rgba(2, 132, 199, 0.25)',
    accentPrimary: '#0284c7',
    accentSecondary: '#4f46e5',
    textPrimary: '#0f172a',
    orbColors: ['rgba(56, 189, 248, 0.35)', 'rgba(129, 140, 248, 0.3)', 'rgba(52, 211, 153, 0.25)'],
    swatchColors: ['#38bdf8', '#bae6fd', '#0284c7', '#ffffff'],
    badgeText: 'Original Solar',
  },
  {
    id: 'dawn-horizon',
    name: 'Dawn Horizon',
    subtitle: 'Original rose-quartz & violet morning aurora',
    category: 'original-solar',
    mode: 'dark',
    solarPhase: 'dawn',
    sunHour: 6.5,
    skyGradient: 'linear-gradient(180deg, #1f1124 0%, #3b1137 30%, #581c87 60%, #831843 85%, #180d24 100%)',
    cardBg: 'rgba(31, 17, 36, 0.58)',
    panelBg: 'rgba(31, 17, 36, 0.45)',
    borderColor: 'rgba(251, 113, 133, 0.28)',
    accentPrimary: '#f43f5e',
    accentSecondary: '#c084fc',
    textPrimary: '#fdf2f8',
    orbColors: ['rgba(251, 113, 133, 0.35)', 'rgba(253, 224, 71, 0.28)', 'rgba(192, 132, 252, 0.25)'],
    swatchColors: ['#1f1124', '#581c87', '#f43f5e', '#fde047'],
    badgeText: 'Original Solar',
  },
  {
    id: 'golden-sunset',
    name: 'Golden Sunset',
    subtitle: 'Original warm amber-crimson & dusk horizon glow',
    category: 'original-solar',
    mode: 'dark',
    solarPhase: 'sunset',
    sunHour: 18.25,
    skyGradient: 'linear-gradient(180deg, #1c0b24 0%, #4a044e 30%, #7c2d12 60%, #c2410c 85%, #160820 100%)',
    cardBg: 'rgba(28, 11, 36, 0.58)',
    panelBg: 'rgba(28, 11, 36, 0.45)',
    borderColor: 'rgba(249, 115, 22, 0.28)',
    accentPrimary: '#f97316',
    accentSecondary: '#d946ef',
    textPrimary: '#fff7ed',
    orbColors: ['rgba(249, 115, 22, 0.42)', 'rgba(217, 70, 239, 0.32)', 'rgba(245, 158, 11, 0.32)'],
    swatchColors: ['#1c0b24', '#7c2d12', '#f97316', '#f59e0b'],
    badgeText: 'Original Solar',
  },
  {
    id: 'ai-roadster-crimson',
    name: 'AI Roadster Crimson Telemetry',
    subtitle: 'Aerodynamic carbon-weave cockpit with laser-crimson LiDAR HUD & sunset horizon',
    category: 'ai-roadster',
    mode: 'dark',
    solarPhase: 'sunset',
    sunHour: 18.6,
    skyGradient: 'linear-gradient(180deg, #0d0407 0%, #240711 38%, #4c0519 72%, #090204 100%)',
    cardBg: 'rgba(28, 7, 14, 0.66)',
    panelBg: 'rgba(18, 4, 9, 0.54)',
    borderColor: 'rgba(244, 63, 94, 0.34)',
    accentPrimary: '#ef4444',
    accentSecondary: '#f97316',
    textPrimary: '#fff1f2',
    orbColors: ['rgba(239, 68, 68, 0.32)', 'rgba(249, 115, 22, 0.24)', 'rgba(225, 29, 72, 0.22)'],
    swatchColors: ['#0d0407', '#4c0519', '#ef4444', '#f97316'],
    badgeText: 'AI Roadster',
    roadsterSpec: {
      drivetrain: 'Tri-Motor Neural Torque Vectoring',
      zeroToSixty: '1.85s',
      autonomyCore: 'Level 5 Vision-Transformer Cockpit',
      aeroDragCd: '0.19 Cd',
    },
  },
  {
    id: 'ai-roadster-electro',
    name: 'Cyber Roadster Autonomous HUD',
    subtitle: 'Sapphire-titanium electric hyper-roadster with neural pathplanning & night optics',
    category: 'ai-roadster',
    mode: 'dark',
    solarPhase: 'night',
    sunHour: 21.5,
    skyGradient: 'linear-gradient(180deg, #020817 0%, #071936 42%, #0c2b59 76%, #01050e 100%)',
    cardBg: 'rgba(7, 25, 54, 0.64)',
    panelBg: 'rgba(3, 14, 33, 0.52)',
    borderColor: 'rgba(56, 189, 248, 0.35)',
    accentPrimary: '#06b6d4',
    accentSecondary: '#3b82f6',
    textPrimary: '#f0f9ff',
    orbColors: ['rgba(6, 182, 212, 0.32)', 'rgba(59, 130, 246, 0.28)', 'rgba(99, 102, 241, 0.22)'],
    swatchColors: ['#020817', '#0c2b59', '#06b6d4', '#3b82f6'],
    badgeText: 'AI Roadster',
    roadsterSpec: {
      drivetrain: 'Quad-Inverter Solid-State 1000V',
      zeroToSixty: '1.79s',
      autonomyCore: 'Multi-Modal Sensor Fusion v4',
      aeroDragCd: '0.18 Cd',
    },
  },
  {
    id: 'ai-roadster-solar-gt',
    name: 'Solar GT Roadster Apex',
    subtitle: 'Photonic gold & liquid-silver solar endurance roadster with emerald telemetry',
    category: 'ai-roadster',
    mode: 'dark',
    solarPhase: 'dawn',
    sunHour: 7.1,
    skyGradient: 'linear-gradient(180deg, #141106 0%, #2e2408 40%, #423209 74%, #0c0a04 100%)',
    cardBg: 'rgba(36, 28, 8, 0.64)',
    panelBg: 'rgba(22, 17, 5, 0.52)',
    borderColor: 'rgba(245, 158, 11, 0.34)',
    accentPrimary: '#f59e0b',
    accentSecondary: '#10b981',
    textPrimary: '#fefce8',
    orbColors: ['rgba(245, 158, 11, 0.30)', 'rgba(16, 185, 129, 0.22)', 'rgba(251, 191, 36, 0.24)'],
    swatchColors: ['#141106', '#423209', '#f59e0b', '#10b981'],
    badgeText: 'AI Roadster',
    roadsterSpec: {
      drivetrain: 'Solar-Array Regenerative Dual Drive',
      zeroToSixty: '1.98s',
      autonomyCore: 'Photonic Horizon Predictive AI',
      aeroDragCd: '0.17 Cd',
    },
  },
  {
    id: 'quant-emerald',
    name: 'Wall Street Quant Terminal',
    subtitle: 'Institutional obsidian matrix & high-alpha emerald',
    category: 'quant-tech',
    mode: 'dark',
    solarPhase: 'night',
    sunHour: 22.0,
    skyGradient: 'linear-gradient(180deg, #02120e 0%, #04241c 40%, #052e24 75%, #010907 100%)',
    cardBg: 'rgba(4, 32, 24, 0.64)',
    panelBg: 'rgba(2, 20, 15, 0.52)',
    borderColor: 'rgba(16, 185, 129, 0.30)',
    accentPrimary: '#10b981',
    accentSecondary: '#14b8a6',
    textPrimary: '#ecfdf5',
    orbColors: ['rgba(16, 185, 129, 0.28)', 'rgba(20, 184, 166, 0.22)', 'rgba(52, 211, 153, 0.18)'],
    swatchColors: ['#02120e', '#052e24', '#10b981', '#34d399'],
    badgeText: 'Quant Pro',
  },
  {
    id: 'nordic-frost',
    name: 'Nordic Arctic Frost',
    subtitle: 'Minimalist Scandinavian glacial slate & cobalt clarity',
    category: 'editorial-light',
    mode: 'light',
    solarPhase: 'day',
    sunHour: 10.5,
    skyGradient: 'linear-gradient(180deg, #cbd5e1 0%, #e2e8f0 35%, #f1f5f9 70%, #ffffff 100%)',
    cardBg: 'rgba(255, 255, 255, 0.78)',
    panelBg: 'rgba(248, 250, 252, 0.65)',
    borderColor: 'rgba(15, 23, 42, 0.14)',
    accentPrimary: '#0369a1',
    accentSecondary: '#334155',
    textPrimary: '#0f172a',
    orbColors: ['rgba(56, 189, 248, 0.22)', 'rgba(148, 163, 184, 0.25)', 'rgba(99, 102, 241, 0.15)'],
    swatchColors: ['#cbd5e1', '#f1f5f9', '#0369a1', '#0f172a'],
    badgeText: 'Studio Light',
  },
  {
    id: 'tokyo-cyber',
    name: 'Tokyo Neural Grid',
    subtitle: 'Deep indigo-violet robotics lab with electric cyan',
    category: 'quant-tech',
    mode: 'dark',
    solarPhase: 'night',
    sunHour: 21.0,
    skyGradient: 'linear-gradient(180deg, #090418 0%, #160b33 40%, #24104f 75%, #070312 100%)',
    cardBg: 'rgba(22, 11, 51, 0.62)',
    panelBg: 'rgba(13, 6, 32, 0.50)',
    borderColor: 'rgba(168, 85, 247, 0.30)',
    accentPrimary: '#a855f7',
    accentSecondary: '#06b6d4',
    textPrimary: '#faf5ff',
    orbColors: ['rgba(168, 85, 247, 0.30)', 'rgba(6, 182, 212, 0.25)', 'rgba(236, 72, 153, 0.20)'],
    swatchColors: ['#090418', '#24104f', '#a855f7', '#06b6d4'],
    badgeText: 'Neural Lab',
  },
  {
    id: 'oxford-ivory',
    name: 'Oxford Ivory Editorial',
    subtitle: 'Warm academic parchment, archival stone & navy ink',
    category: 'editorial-light',
    mode: 'light',
    solarPhase: 'day',
    sunHour: 14.0,
    skyGradient: 'linear-gradient(180deg, #e7e5e4 0%, #f5f5f4 40%, #fafaf9 75%, #ffffff 100%)',
    cardBg: 'rgba(255, 255, 255, 0.80)',
    panelBg: 'rgba(250, 250, 249, 0.68)',
    borderColor: 'rgba(120, 113, 108, 0.22)',
    accentPrimary: '#1e3a8a',
    accentSecondary: '#b45309',
    textPrimary: '#1c1917',
    orbColors: ['rgba(217, 119, 6, 0.16)', 'rgba(30, 58, 138, 0.14)', 'rgba(168, 162, 158, 0.20)'],
    swatchColors: ['#e7e5e4', '#fafaf9', '#1e3a8a', '#b45309'],
    badgeText: 'Academic',
  },
  {
    id: 'deep-nebula',
    name: 'Andromeda Deep Nebula',
    subtitle: 'Cosmic magenta-indigo observatory & starlight rose',
    category: 'deep-space',
    mode: 'dark',
    solarPhase: 'dawn',
    sunHour: 5.8,
    skyGradient: 'linear-gradient(180deg, #0f051d 0%, #260c3d 40%, #3b1054 75%, #090312 100%)',
    cardBg: 'rgba(38, 12, 61, 0.58)',
    panelBg: 'rgba(20, 6, 36, 0.48)',
    borderColor: 'rgba(232, 121, 249, 0.28)',
    accentPrimary: '#e879f9',
    accentSecondary: '#818cf8',
    textPrimary: '#fdf4ff',
    orbColors: ['rgba(232, 121, 249, 0.28)', 'rgba(129, 140, 248, 0.25)', 'rgba(244, 63, 94, 0.20)'],
    swatchColors: ['#0f051d', '#3b1054', '#e879f9', '#818cf8'],
    badgeText: 'Deep Space',
  },
  {
    id: 'monolith-obsidian',
    name: 'Monolith Carbon Minimal',
    subtitle: 'Ultra-low-glare carbon matte & precision titanium',
    category: 'quant-tech',
    mode: 'dark',
    solarPhase: 'night',
    sunHour: 0.5,
    skyGradient: 'linear-gradient(180deg, #09090b 0%, #121216 45%, #18181b 80%, #050507 100%)',
    cardBg: 'rgba(24, 24, 27, 0.68)',
    panelBg: 'rgba(15, 15, 18, 0.55)',
    borderColor: 'rgba(161, 161, 170, 0.22)',
    accentPrimary: '#38bdf8',
    accentSecondary: '#a1a1aa',
    textPrimary: '#fafafa',
    orbColors: ['rgba(161, 161, 170, 0.16)', 'rgba(56, 189, 248, 0.16)', 'rgba(82, 82, 91, 0.20)'],
    swatchColors: ['#09090b', '#18181b', '#38bdf8', '#a1a1aa'],
    badgeText: 'Carbon Matte',
  },
  {
    id: 'biolum-ocean',
    name: 'Bioluminescent Abyssal Lab',
    subtitle: 'Deep Pacific trench teal-navy with seafoam optics',
    category: 'deep-space',
    mode: 'dark',
    solarPhase: 'night',
    sunHour: 20.5,
    skyGradient: 'linear-gradient(180deg, #021017 0%, #042633 42%, #06394a 75%, #01090d 100%)',
    cardBg: 'rgba(4, 38, 51, 0.60)',
    panelBg: 'rgba(2, 22, 31, 0.48)',
    borderColor: 'rgba(45, 212, 191, 0.28)',
    accentPrimary: '#2dd4bf',
    accentSecondary: '#0ea5e9',
    textPrimary: '#f0fdfa',
    orbColors: ['rgba(45, 212, 191, 0.28)', 'rgba(14, 165, 233, 0.25)', 'rgba(56, 189, 248, 0.20)'],
    swatchColors: ['#021017', '#06394a', '#2dd4bf', '#0ea5e9'],
    badgeText: 'Abyssal Bio',
  },
  {
    id: 'sahara-sandstone',
    name: 'Sahara Sandstone Studio',
    subtitle: 'Sunlit travertine, warm dune clay & terracotta gold',
    category: 'editorial-light',
    mode: 'light',
    solarPhase: 'day',
    sunHour: 15.5,
    skyGradient: 'linear-gradient(180deg, #fde68a 0%, #fef3c7 38%, #fffbeb 75%, #ffffff 100%)',
    cardBg: 'rgba(255, 255, 255, 0.76)',
    panelBg: 'rgba(255, 251, 235, 0.64)',
    borderColor: 'rgba(217, 119, 6, 0.24)',
    accentPrimary: '#d97706',
    accentSecondary: '#ea580c',
    textPrimary: '#292524',
    orbColors: ['rgba(245, 158, 11, 0.25)', 'rgba(234, 88, 12, 0.20)', 'rgba(251, 191, 36, 0.22)'],
    swatchColors: ['#fde68a', '#fffbeb', '#d97706', '#ea580c'],
    badgeText: 'Warm Studio',
  },
  // --- KOLKATA & DURGA PUJA CULTURAL HERITAGE THEMES ---
  {
    id: 'kolkata-durga-sindoor',
    name: 'Durga Puja Sindoor & Dhunuchi Glow',
    subtitle: 'Sacred vermilion sindoor, golden dhunuchi arati warmth, Dhak cadence & Shardiya pandal grandeur',
    category: 'kolkata-durga-puja',
    mode: 'dark',
    solarPhase: 'sunset',
    sunHour: 18.5,
    skyGradient: 'linear-gradient(180deg, #1f040a 0%, #4c0519 36%, #9a3412 74%, #29070d 100%)',
    cardBg: 'rgba(46, 8, 18, 0.66)',
    panelBg: 'rgba(28, 5, 11, 0.56)',
    borderColor: 'rgba(251, 191, 36, 0.36)',
    accentPrimary: '#f43f5e',
    accentSecondary: '#f59e0b',
    textPrimary: '#fff1f2',
    orbColors: ['rgba(244, 63, 94, 0.36)', 'rgba(245, 158, 11, 0.32)', 'rgba(234, 88, 12, 0.26)'],
    swatchColors: ['#1f040a', '#4c0519', '#f43f5e', '#f59e0b'],
    badgeText: 'Durga Puja',
    culturalSpec: {
      motif: 'Shardiya Alpona & Dhunuchi Arati',
      landmark: 'North Kolkata Bonedi Bari & Pandals',
      ambiance: 'Sandhya Arati · Dhak & Shankha',
      season: 'Sharadotsav Autumn',
    },
  },
  {
    id: 'kolkata-shiuli-dawn',
    name: 'Shiuli Phool & Kumartuli Dawn',
    subtitle: 'Fragrant Mahalaya morning mist, white-coral Shiuli blossoms & Kumartuli artisan clay studio',
    category: 'kolkata-durga-puja',
    mode: 'light',
    solarPhase: 'dawn',
    sunHour: 6.25,
    skyGradient: 'linear-gradient(180deg, #fed7aa 0%, #ffedd5 38%, #fff7ed 74%, #ffffff 100%)',
    cardBg: 'rgba(255, 255, 255, 0.80)',
    panelBg: 'rgba(255, 247, 237, 0.68)',
    borderColor: 'rgba(234, 88, 12, 0.28)',
    accentPrimary: '#ea580c',
    accentSecondary: '#b45309',
    textPrimary: '#292524',
    orbColors: ['rgba(249, 115, 22, 0.28)', 'rgba(251, 191, 36, 0.24)', 'rgba(244, 63, 94, 0.18)'],
    swatchColors: ['#fed7aa', '#fff7ed', '#ea580c', '#b45309'],
    badgeText: 'Kolkata Dawn',
    culturalSpec: {
      motif: 'Shiuli Coral Stem & Clay Craft',
      landmark: 'Kumartuli Potter Quarters & Sovabazar',
      ambiance: 'Mahalaya Morning Agomoni',
      season: 'Sharat Dawn',
    },
  },
  {
    id: 'kolkata-pandal-lights',
    name: 'Chandannagar Lights & Maddox Night',
    subtitle: 'Luminous Chandannagar LED street artistry, royal indigo-gold pandal arches & Ashtami night',
    category: 'kolkata-durga-puja',
    mode: 'dark',
    solarPhase: 'night',
    sunHour: 21.25,
    skyGradient: 'linear-gradient(180deg, #0b0726 0%, #1e1145 38%, #3b0f47 74%, #070417 100%)',
    cardBg: 'rgba(30, 17, 69, 0.64)',
    panelBg: 'rgba(16, 9, 41, 0.54)',
    borderColor: 'rgba(251, 191, 36, 0.35)',
    accentPrimary: '#fbbf24',
    accentSecondary: '#ec4899',
    textPrimary: '#fefce8',
    orbColors: ['rgba(251, 191, 36, 0.32)', 'rgba(236, 72, 153, 0.28)', 'rgba(56, 189, 248, 0.22)'],
    swatchColors: ['#0b0726', '#3b0f47', '#fbbf24', '#ec4899'],
    badgeText: 'Pandal Lights',
    culturalSpec: {
      motif: 'Chandannagar Light Arch & Lotus',
      landmark: 'Maddox Square · Deshapriya Park · Ballygunge',
      ambiance: 'Maha Ashtami Night Illumination',
      season: 'Pandal Parikrama',
    },
  },
  {
    id: 'kolkata-hooghly-ghat',
    name: 'Howrah Bridge & Prinsep Ghat Dusk',
    subtitle: 'Iconic cantilever steel over the Hooghly River, Victoria marble & yellow ambassador gold',
    category: 'kolkata-durga-puja',
    mode: 'dark',
    solarPhase: 'sunset',
    sunHour: 17.75,
    skyGradient: 'linear-gradient(180deg, #111827 0%, #31102f 38%, #78350f 76%, #0f172a 100%)',
    cardBg: 'rgba(30, 24, 42, 0.64)',
    panelBg: 'rgba(17, 24, 39, 0.54)',
    borderColor: 'rgba(234, 179, 8, 0.34)',
    accentPrimary: '#eab308',
    accentSecondary: '#06b6d4',
    textPrimary: '#fef9c3',
    orbColors: ['rgba(234, 179, 8, 0.30)', 'rgba(6, 182, 212, 0.24)', 'rgba(249, 115, 22, 0.24)'],
    swatchColors: ['#111827', '#78350f', '#eab308', '#06b6d4'],
    badgeText: 'City of Joy',
    culturalSpec: {
      motif: 'Howrah Cantilever & Nouka Reflection',
      landmark: 'Prinsep Ghat · Howrah Bridge · Victoria Memorial',
      ambiance: 'Hooghly Golden Hour River Breeze',
      season: 'Kolkata Heritage',
    },
  },
  // --- FUTURISTIC 3026 & QUANTUM SINGULARITY THEMES ---
  {
    id: 'futuristic-dyson-sphere',
    name: 'Dyson Sphere Stellar Megastructure',
    subtitle: 'Type-II Kardashev solar harvester with plasma-gold conduits & hyper-dimensional obsidian glass',
    category: 'futuristic',
    mode: 'dark',
    solarPhase: 'sunset',
    sunHour: 19.0,
    skyGradient: 'linear-gradient(180deg, #060414 0%, #170d36 38%, #3b1c0a 76%, #04030c 100%)',
    cardBg: 'rgba(23, 13, 54, 0.64)',
    panelBg: 'rgba(10, 6, 26, 0.54)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    accentPrimary: '#f59e0b',
    accentSecondary: '#06b6d4',
    textPrimary: '#fffbeb',
    orbColors: ['rgba(245, 158, 11, 0.32)', 'rgba(6, 182, 212, 0.26)', 'rgba(139, 92, 246, 0.24)'],
    swatchColors: ['#060414', '#3b1c0a', '#f59e0b', '#06b6d4'],
    badgeText: 'Futuristic 3026',
    futuristicSpec: {
      architecture: 'Kardashev Type-II Solar Lattice',
      computeDensity: '10^24 YottaFLOPS Photonic',
      energyCore: 'Stellar Corona Antimatter Tap',
      era: '3026 Megastructure',
    },
  },
  {
    id: 'futuristic-quantum-holo',
    name: 'Quantum Holographic Singularity',
    subtitle: 'Zero-latency photonic crystal waveguide interface with iridescent cyan-violet holo-projection',
    category: 'futuristic',
    mode: 'dark',
    solarPhase: 'night',
    sunHour: 22.75,
    skyGradient: 'linear-gradient(180deg, #020617 0%, #091e3a 38%, #1e1b4b 74%, #01040d 100%)',
    cardBg: 'rgba(9, 30, 58, 0.64)',
    panelBg: 'rgba(4, 15, 33, 0.54)',
    borderColor: 'rgba(34, 211, 238, 0.36)',
    accentPrimary: '#22d3ee',
    accentSecondary: '#a855f7',
    textPrimary: '#ecfeff',
    orbColors: ['rgba(34, 211, 238, 0.32)', 'rgba(168, 85, 247, 0.28)', 'rgba(59, 130, 246, 0.24)'],
    swatchColors: ['#020617', '#1e1b4b', '#22d3ee', '#a855f7'],
    badgeText: 'Quantum Holo',
    futuristicSpec: {
      architecture: 'Topological Qubit Mesh v9',
      computeDensity: '4,096 Logical Qubits Coherent',
      energyCore: 'Cryo-Photonic Superconductor',
      era: '2088 Quantum Era',
    },
  },
  {
    id: 'futuristic-solarpunk-eden',
    name: 'Solarpunk Orbital Biosphere',
    subtitle: 'Biomimetic orbital garden dome with chlorophyll emerald optics, sunlit aerogel & helio-sails',
    category: 'futuristic',
    mode: 'light',
    solarPhase: 'day',
    sunHour: 11.25,
    skyGradient: 'linear-gradient(180deg, #a7f3d0 0%, #d1fae5 36%, #ecfdf5 72%, #ffffff 100%)',
    cardBg: 'rgba(255, 255, 255, 0.80)',
    panelBg: 'rgba(236, 253, 245, 0.68)',
    borderColor: 'rgba(5, 150, 105, 0.26)',
    accentPrimary: '#059669',
    accentSecondary: '#d97706',
    textPrimary: '#064e3b',
    orbColors: ['rgba(16, 185, 129, 0.26)', 'rgba(245, 158, 11, 0.22)', 'rgba(52, 211, 153, 0.24)'],
    swatchColors: ['#a7f3d0', '#ecfdf5', '#059669', '#d97706'],
    badgeText: 'Solarpunk 2099',
    futuristicSpec: {
      architecture: 'Biomimetic Aerogel Geodesic Dome',
      computeDensity: 'Organic DNA Biocompute Array',
      energyCore: 'Perovskite Orbital Helio-Sails',
      era: '2099 Eco-Future',
    },
  },
  {
    id: 'futuristic-chrono-nexus',
    name: 'Chrono-Spatial Warp Cockpit',
    subtitle: 'Relativistic starship bridge with gravimetric rose-magenta telemetry & hyperlane titanium',
    category: 'futuristic',
    mode: 'dark',
    solarPhase: 'dawn',
    sunHour: 5.5,
    skyGradient: 'linear-gradient(180deg, #090314 0%, #240938 40%, #4c0519 76%, #05010a 100%)',
    cardBg: 'rgba(36, 9, 56, 0.64)',
    panelBg: 'rgba(18, 4, 30, 0.54)',
    borderColor: 'rgba(244, 63, 94, 0.35)',
    accentPrimary: '#f43f5e',
    accentSecondary: '#38bdf8',
    textPrimary: '#fdf2f8',
    orbColors: ['rgba(244, 63, 94, 0.30)', 'rgba(56, 189, 248, 0.26)', 'rgba(192, 132, 252, 0.24)'],
    swatchColors: ['#090314', '#4c0519', '#f43f5e', '#38bdf8'],
    badgeText: 'Warp Future',
    futuristicSpec: {
      architecture: 'Alcubierre Metric Field Bridge',
      computeDensity: 'Sub-Planck Temporal Telemetry',
      energyCore: 'Zero-Point Vacuum Resonator',
      era: '2140 Interstellar',
    },
  },
];

// Curated 10 solar-themed presets for the SettingsView Theme Preview Gallery
export const SOLAR_PREVIEW_PRESETS: DesignThemeConfig[] = DESIGN_THEMES.slice(0, 10);
export const KOLKATA_DURGA_PUJA_THEMES: DesignThemeConfig[] = DESIGN_THEMES.filter(
  t => t.category === 'kolkata-durga-puja'
);
export const FUTURISTIC_THEMES: DesignThemeConfig[] = DESIGN_THEMES.filter(
  t => t.category === 'futuristic'
);

export interface WixThemeManifest {
  provider: '@wix/design-system';
  siteNamespace: string;
  themeId: DesignThemeId;
  themeName: string;
  solarPhase: SolarPreset;
  sunHour: number;
  tokens: {
    colorBgPrimary: string;
    colorSurfaceCard: string;
    colorAccentPrimary: string;
    colorAccentSecondary: string;
    colorTextPrimary: string;
    colorBorderSubtle: string;
  };
}

export function buildWixThemeManifest(theme: DesignThemeConfig): WixThemeManifest {
  return {
    provider: '@wix/design-system',
    siteNamespace: 'europa-ai-quant-studio',
    themeId: theme.id,
    themeName: theme.name,
    solarPhase: theme.solarPhase,
    sunHour: theme.sunHour,
    tokens: {
      colorBgPrimary: theme.swatchColors[0],
      colorSurfaceCard: theme.cardBg,
      colorAccentPrimary: theme.accentPrimary,
      colorAccentSecondary: theme.accentSecondary,
      colorTextPrimary: theme.textPrimary,
      colorBorderSubtle: theme.borderColor,
    },
  };
}

export function resolveDesignTheme(themeId: string): DesignThemeConfig {
  const match = DESIGN_THEMES.find(t => t.id === themeId);
  return match || DESIGN_THEMES[0];
}

export function evaluateAchievementMilestones(input: MilestoneEvaluationInput): AchievementMilestoneProgress[] {
  const clampPct = (curr: number, target: number) =>
    target <= 0 ? 100 : Math.min(100, Math.max(0, Math.round((curr / target) * 100)));

  const milestones: AchievementMilestoneProgress[] = [
    // AI Study Path Milestones
    {
      badgeId: 'badge-2',
      path: 'ai',
      currentValue: input.completedAiLecturesCount,
      targetValue: 3,
      unitLabel: 'AI Lectures',
      progressPercent: clampPct(input.completedAiLecturesCount, 3),
      shouldUnlock: input.completedAiLecturesCount >= 3,
      milestoneLabel: 'Complete 3 Core AI Video Lectures',
    },
    {
      badgeId: 'badge-6',
      path: 'ai',
      currentValue: input.completedAiLecturesCount,
      targetValue: 6,
      unitLabel: 'AI & Robotics Lectures',
      progressPercent: clampPct(input.completedAiLecturesCount, 6),
      shouldUnlock: input.completedAiLecturesCount >= 6,
      milestoneLabel: 'Complete 6 AI & Embodied Robotics Lectures',
    },
    {
      badgeId: 'badge-8',
      path: 'ai',
      currentValue: input.completedAiStepsCount,
      targetValue: 5,
      unitLabel: 'Step-Wise Modules',
      progressPercent: clampPct(input.completedAiStepsCount, 5),
      shouldUnlock: input.completedAiStepsCount >= 5,
      milestoneLabel: 'Complete 5 Step-Wise AI Learning Plan Modules',
    },
    {
      badgeId: 'badge-13',
      path: 'ai',
      currentValue: input.completedAiLecturesCount,
      targetValue: Math.max(8, input.totalAiLecturesCount),
      unitLabel: 'Full AI Curriculum',
      progressPercent: clampPct(input.completedAiLecturesCount, Math.max(8, input.totalAiLecturesCount)),
      shouldUnlock: input.completedAiLecturesCount >= Math.max(8, input.totalAiLecturesCount),
      milestoneLabel: 'Complete All AI Architecture & Alignment Lectures',
    },

    // Quant Study Path Milestones
    {
      badgeId: 'badge-14',
      path: 'quant',
      currentValue: input.completedQuantStrategiesCount,
      targetValue: 1,
      unitLabel: 'Quant Strategy',
      progressPercent: clampPct(input.completedQuantStrategiesCount, 1),
      shouldUnlock: input.completedQuantStrategiesCount >= 1,
      milestoneLabel: 'Complete Your First Quant Trading Strategy Lesson',
    },
    {
      badgeId: 'badge-15',
      path: 'quant',
      currentValue: input.completedQuantStrategiesCount,
      targetValue: 3,
      unitLabel: 'Quant Strategies',
      progressPercent: clampPct(input.completedQuantStrategiesCount, 3),
      shouldUnlock: input.completedQuantStrategiesCount >= 3,
      milestoneLabel: 'Master 3 Quantitative Trading Strategy Methods',
    },
    {
      badgeId: 'badge-16',
      path: 'quant',
      currentValue: input.completedQuantStrategiesCount,
      targetValue: Math.max(6, input.totalQuantStrategiesCount),
      unitLabel: 'All Quant Strategies',
      progressPercent: clampPct(input.completedQuantStrategiesCount, Math.max(6, input.totalQuantStrategiesCount)),
      shouldUnlock: input.completedQuantStrategiesCount >= Math.max(6, input.totalQuantStrategiesCount),
      milestoneLabel: 'Complete All 6 Global Quant Strategy Modules',
    },

    // General / Streak / Mastery Milestones
    {
      badgeId: 'badge-3',
      path: 'general',
      currentValue: input.streakDays,
      targetValue: 5,
      unitLabel: 'Streak Days',
      progressPercent: clampPct(input.streakDays, 5),
      shouldUnlock: input.streakDays >= 5,
      milestoneLabel: 'Maintain a 5-Day Study Streak',
    },
    {
      badgeId: 'badge-4',
      path: 'general',
      currentValue: input.notesCount,
      targetValue: 3,
      unitLabel: 'AI Study Notes',
      progressPercent: clampPct(input.notesCount, 3),
      shouldUnlock: input.notesCount >= 3,
      milestoneLabel: 'Capture 3+ Structured AI Study Notes',
    },
    {
      badgeId: 'badge-12',
      path: 'general',
      currentValue: input.level,
      targetValue: 6,
      unitLabel: 'Scholar Level',
      progressPercent: clampPct(input.level, 6),
      shouldUnlock: input.level >= 6,
      milestoneLabel: 'Reach Level 6 Frontier Systems Architect',
    },
    {
      badgeId: 'badge-17',
      path: 'quant',
      currentValue: input.highScore2D ?? 0,
      targetValue: 1000,
      unitLabel: '2D Collider Pts',
      progressPercent: clampPct(input.highScore2D ?? 0, 1000),
      shouldUnlock: (input.highScore2D ?? 0) >= 1000,
      milestoneLabel: 'Score 1,000+ pts in 2D Quant Alpha Collider',
    },
    {
      badgeId: 'badge-18',
      path: 'ai',
      currentValue: input.highScore3D ?? 0,
      targetValue: 1500,
      unitLabel: '3D Roadster Pts',
      progressPercent: clampPct(input.highScore3D ?? 0, 1500),
      shouldUnlock: (input.highScore3D ?? 0) >= 1500,
      milestoneLabel: 'Score 1,500+ pts in 3D AI Roadster Highway',
    },
  ];

  return milestones;
}
