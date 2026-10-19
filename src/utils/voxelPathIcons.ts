export type VoxelLearningPathId =
  | 'generative-ai'
  | 'robotics'
  | 'ai-ethics'
  | 'non-technical-ai'
  | 'foundational-math';

export type VoxelIconStylePreset =
  | 'isometric-cube'
  | 'neon-matrix'
  | 'citadel-crest'
  | 'quantum-blueprint';

export interface VoxelLearningPathSpec {
  id: VoxelLearningPathId;
  categoryName: string;
  title: string;
  shortLabel: string;
  spireName: string;
  waypointId: 'transformer' | 'robotics' | 'ethics' | 'strategy' | 'progress';
  moduleId: string;
  primaryHex: string;
  secondaryHex: string;
  accentHex: string;
  defaultPrompt: string;
  badgeCode: string;
  voxelTierCount: number;
}

export interface VoxelPathIconRecord {
  pathId: VoxelLearningPathId;
  stylePreset: VoxelIconStylePreset;
  prompt: string;
  seed: number;
  dataUri: string;
  source: 'procedural-voxel-tool' | 'gemini-image-tool';
  updatedAt: string;
}

export const VOXEL_ICON_STYLE_PRESETS: {
  id: VoxelIconStylePreset;
  label: string;
  description: string;
  bgStart: string;
  bgEnd: string;
  gridOpacity: number;
}[] = [
  {
    id: 'isometric-cube',
    label: 'Isometric Voxel Monolith',
    description: 'Stepped 3D voxel blocks with studio rim lighting & glowing core',
    bgStart: '#080c1d',
    bgEnd: '#111936',
    gridOpacity: 0.22,
  },
  {
    id: 'neon-matrix',
    label: 'Neon Cyber Matrix',
    description: 'High-contrast cybernetic voxel lattice with holographic telemetry rings',
    bgStart: '#040711',
    bgEnd: '#0f172a',
    gridOpacity: 0.35,
  },
  {
    id: 'citadel-crest',
    label: 'Solar Citadel Crest',
    description: 'Sacred architectural voxel sanctuary emblem with golden filigree accents',
    bgStart: '#140c1c',
    bgEnd: '#231330',
    gridOpacity: 0.18,
  },
  {
    id: 'quantum-blueprint',
    label: 'Quantum CAD Blueprint',
    description: 'Precision wireframe-shaded voxel schematic with coordinate crosshairs',
    bgStart: '#051424',
    bgEnd: '#0a2642',
    gridOpacity: 0.42,
  },
];

export const VOXEL_LEARNING_PATHS: VoxelLearningPathSpec[] = [
  {
    id: 'generative-ai',
    categoryName: 'Generative AI',
    title: 'Generative AI & Transformer Foundations',
    shortLabel: 'GenAI & LLMs',
    spireName: 'The Transformer Monolith',
    waypointId: 'transformer',
    moduleId: 'mod-1',
    primaryHex: '#8b5cf6',
    secondaryHex: '#6366f1',
    accentHex: '#38bdf8',
    defaultPrompt:
      'Isometric 3D voxel icon of a glowing violet and cyan neural transformer monolith cube with floating multi-head attention matrix rings',
    badgeCode: 'VX-PATH-01',
    voxelTierCount: 8,
  },
  {
    id: 'robotics',
    categoryName: 'Robotics',
    title: 'Autonomous Robotics & Embodied Perception',
    shortLabel: 'Robotics & ROS2',
    spireName: 'Robotics Workshop & Kinematics Bay',
    waypointId: 'robotics',
    moduleId: 'mod-2',
    primaryHex: '#06b6d4',
    secondaryHex: '#0284c7',
    accentHex: '#22d3ee',
    defaultPrompt:
      'Isometric 3D voxel icon of an articulated cyan robotic manipulator arm with 3D LiDAR laser scanner beams on a voxel workshop pedestal',
    badgeCode: 'VX-PATH-02',
    voxelTierCount: 8,
  },
  {
    id: 'ai-ethics',
    categoryName: 'AI Ethics',
    title: 'AI Alignment, Ethics & Safety Systems',
    shortLabel: 'Ethics & RLHF',
    spireName: 'AI Ethics & Alignment Citadel',
    waypointId: 'ethics',
    moduleId: 'mod-3',
    primaryHex: '#f43f5e',
    secondaryHex: '#e11d48',
    accentHex: '#fbbf24',
    defaultPrompt:
      'Isometric 3D voxel icon of a crimson and amber alignment shield archway with balanced constitutional guardrail scales on an obsidian base',
    badgeCode: 'VX-PATH-03',
    voxelTierCount: 8,
  },
  {
    id: 'non-technical-ai',
    categoryName: 'Non-Technical AI',
    title: 'Non-Technical AI Strategy & Leadership',
    shortLabel: 'Executive Strategy',
    spireName: 'Non-Technical Strategy Pavilion',
    waypointId: 'strategy',
    moduleId: 'mod-4',
    primaryHex: '#10b981',
    secondaryHex: '#059669',
    accentHex: '#34d399',
    defaultPrompt:
      'Isometric 3D voxel icon of an emerald green executive strategy pavilion crest with ascending ROI data blocks and a compass beacon',
    badgeCode: 'VX-PATH-04',
    voxelTierCount: 8,
  },
  {
    id: 'foundational-math',
    categoryName: 'Foundational Math',
    title: 'Origin Mathematics & Apex Progress Spire',
    shortLabel: 'Origin Math Apex',
    spireName: 'Growing Voxel Progress Spire',
    waypointId: 'progress',
    moduleId: 'mod-apex',
    primaryHex: '#f59e0b',
    secondaryHex: '#d97706',
    accentHex: '#fde047',
    defaultPrompt:
      'Isometric 3D voxel icon of a golden amber apex grimoire cube and sacred geometric tensor crystal spire with orbital rings',
    badgeCode: 'VX-PATH-05',
    voxelTierCount: 10,
  },
];

export function buildVoxelIconPrompt(
  pathId: VoxelLearningPathId,
  stylePreset: VoxelIconStylePreset = 'isometric-cube',
  customNotes?: string
): string {
  const pathSpec =
    VOXEL_LEARNING_PATHS.find(p => p.id === pathId) || VOXEL_LEARNING_PATHS[0];
  const styleSpec =
    VOXEL_ICON_STYLE_PRESETS.find(s => s.id === stylePreset) ||
    VOXEL_ICON_STYLE_PRESETS[0];

  const trimmedCustom = customNotes?.trim();
  const extraClause = trimmedCustom ? `, featuring ${trimmedCustom}` : '';

  return `${pathSpec.defaultPrompt}${extraClause}. Style: ${styleSpec.label} (${styleSpec.description}), palette ${pathSpec.primaryHex} and ${pathSpec.accentHex}, 1:1 square icon badge, crisp 3D voxel geometry, centered composition, no text clutter.`;
}

/**
 * Helper to draw an isometric 3D voxel cube at (cx, cy) with size `s`.
 */
function renderIsoCube(
  cx: number,
  cy: number,
  s: number,
  topColor: string,
  leftColor: string,
  rightColor: string,
  strokeColor = 'rgba(255,255,255,0.22)'
): string {
  const dx = s * 0.866;
  const dy = s * 0.5;

  const topPoints = `${cx.toFixed(1)},${(cy - s).toFixed(1)} ${(cx + dx).toFixed(1)},${(cy - dy).toFixed(1)} ${cx.toFixed(1)},${cy.toFixed(1)} ${(cx - dx).toFixed(1)},${(cy - dy).toFixed(1)}`;
  const leftPoints = `${(cx - dx).toFixed(1)},${(cy - dy).toFixed(1)} ${cx.toFixed(1)},${cy.toFixed(1)} ${cx.toFixed(1)},${(cy + s).toFixed(1)} ${(cx - dx).toFixed(1)},${(cy + dy).toFixed(1)}`;
  const rightPoints = `${cx.toFixed(1)},${cy.toFixed(1)} ${(cx + dx).toFixed(1)},${(cy - dy).toFixed(1)} ${(cx + dx).toFixed(1)},${(cy + dy).toFixed(1)} ${cx.toFixed(1)},${(cy + s).toFixed(1)}`;

  return `
    <g stroke="${strokeColor}" stroke-width="1" stroke-linejoin="round">
      <polygon points="${leftPoints}" fill="${leftColor}" />
      <polygon points="${rightPoints}" fill="${rightColor}" />
      <polygon points="${topPoints}" fill="${topColor}" />
    </g>
  `;
}

/**
 * Generates a crisp, deterministic isometric 3D Voxel SVG string for a learning path.
 */
export function synthesizeVoxelPathIconSvg(options: {
  pathId: VoxelLearningPathId;
  stylePreset?: VoxelIconStylePreset;
  seed?: number;
  customAccentHex?: string;
}): string {
  const pathSpec =
    VOXEL_LEARNING_PATHS.find(p => p.id === options.pathId) ||
    VOXEL_LEARNING_PATHS[0];
  const styleSpec =
    VOXEL_ICON_STYLE_PRESETS.find(s => s.id === (options.stylePreset || 'isometric-cube')) ||
    VOXEL_ICON_STYLE_PRESETS[0];

  const seed = options.seed ?? 1;
  const primary = pathSpec.primaryHex;
  const secondary = pathSpec.secondaryHex;
  const accent = options.customAccentHex || pathSpec.accentHex;
  const stroke =
    styleSpec.id === 'quantum-blueprint'
      ? 'rgba(56, 189, 248, 0.65)'
      : styleSpec.id === 'citadel-crest'
      ? 'rgba(251, 191, 36, 0.45)'
      : 'rgba(255, 255, 255, 0.25)';

  // Slight deterministic offset/variation from seed
  const ringAngle = ((seed * 37) % 360);
  const pulseRadius = 92 + ((seed * 13) % 14);

  // Base pedestal cubes (shared 3x3 isometric platform)
  let pedestalSvg = '';
  const baseCoords = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [0, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];
  baseCoords.forEach(([gx, gz]) => {
    const isoX = 128 + (gx - gz) * 22;
    const isoY = 176 + (gx + gz) * 12.5;
    pedestalSvg += renderIsoCube(
      isoX,
      isoY,
      25,
      '#1e293b',
      '#0f172a',
      '#090d16',
      stroke
    );
  });

  // Path-specific 3D voxel structure
  let motifSvg = '';

  if (pathSpec.id === 'generative-ai') {
    // Tiered Neural Transformer Monolith + Floating Q/K/V Voxel Cubes
    motifSvg += renderIsoCube(128, 152, 30, primary, secondary, '#312e81', stroke);
    motifSvg += renderIsoCube(128, 122, 26, accent, primary, secondary, stroke);
    motifSvg += renderIsoCube(128, 94, 20, '#f8fafc', accent, primary, stroke);
    // Floating attention satellite cubes
    motifSvg += renderIsoCube(74, 114, 13, accent, primary, '#1e1b4b', stroke);
    motifSvg += renderIsoCube(182, 114, 13, accent, primary, '#1e1b4b', stroke);
    motifSvg += renderIsoCube(128, 56, 12, '#fde047', accent, primary, stroke);
    // Neural attention links
    motifSvg += `<path d="M74 108 L128 88 L182 108 M74 108 L128 52 L182 108" stroke="${accent}" stroke-width="2" stroke-dasharray="4 3" fill="none" opacity="0.85" />`;
  } else if (pathSpec.id === 'robotics') {
    // Articulated Voxel Robotic Manipulator Arm + LiDAR Scan Cone
    motifSvg += renderIsoCube(128, 154, 28, '#334155', '#1e293b', '#0f172a', stroke);
    // Lower joint & link
    motifSvg += renderIsoCube(116, 128, 20, primary, secondary, '#0e7490', stroke);
    motifSvg += renderIsoCube(106, 104, 18, accent, primary, secondary, stroke);
    // Upper articulated arm reaching right
    motifSvg += renderIsoCube(128, 86, 18, primary, secondary, '#155e75', stroke);
    motifSvg += renderIsoCube(154, 78, 16, '#f8fafc', accent, primary, stroke);
    // LiDAR scan rays
    motifSvg += `
      <polygon points="154,78 206,52 206,108" fill="${accent}" opacity="0.22" />
      <line x1="154" y1="78" x2="204" y2="56" stroke="${accent}" stroke-width="2" stroke-dasharray="3 3" />
      <line x1="154" y1="78" x2="206" y2="82" stroke="${accent}" stroke-width="2" />
      <line x1="154" y1="78" x2="204" y2="106" stroke="${accent}" stroke-width="2" stroke-dasharray="3 3" />
    `;
  } else if (pathSpec.id === 'ai-ethics') {
    // Twin Alignment Archway Pillars + Constitutional Balance Beam & Shield Core
    // Left pillar
    motifSvg += renderIsoCube(92, 152, 20, secondary, '#881337', '#4c0519', stroke);
    motifSvg += renderIsoCube(92, 126, 20, primary, secondary, '#881337', stroke);
    motifSvg += renderIsoCube(92, 100, 20, primary, secondary, '#881337', stroke);
    // Right pillar
    motifSvg += renderIsoCube(164, 152, 20, secondary, '#881337', '#4c0519', stroke);
    motifSvg += renderIsoCube(164, 126, 20, primary, secondary, '#881337', stroke);
    motifSvg += renderIsoCube(164, 100, 20, primary, secondary, '#881337', stroke);
    // Archway Bridge
    motifSvg += renderIsoCube(128, 82, 24, accent, primary, secondary, stroke);
    // Central Floating Shield / Balance Core
    motifSvg += renderIsoCube(128, 128, 18, '#fff1f2', primary, secondary, stroke);
    motifSvg += `<circle cx="128" cy="122" r="28" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="5 4" opacity="0.85" />`;
  } else if (pathSpec.id === 'non-technical-ai') {
    // Ascending Strategy Pavilion Steps + Executive Emerald Canopy & Compass Star
    motifSvg += renderIsoCube(94, 152, 19, secondary, '#065f46', '#064e3b', stroke);
    motifSvg += renderIsoCube(128, 140, 22, primary, secondary, '#065f46', stroke);
    motifSvg += renderIsoCube(128, 114, 22, primary, secondary, '#065f46', stroke);
    motifSvg += renderIsoCube(162, 128, 19, accent, primary, secondary, stroke);
    motifSvg += renderIsoCube(162, 102, 19, accent, primary, secondary, stroke);
    motifSvg += renderIsoCube(162, 78, 19, '#ecfdf5', accent, primary, stroke);
    // Compass / ROI ascending vector arrow
    motifSvg += `<path d="M76 138 L124 96 L142 106 L184 58" fill="none" stroke="#fde047" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />`;
    motifSvg += `<polygon points="188,54 173,57 183,68" fill="#fde047" />`;
  } else {
    // Foundational Math & Apex Spire: Stepped Golden Pyramid + Sacred Tensor Octahedron
    motifSvg += renderIsoCube(128, 154, 30, secondary, '#92400e', '#78350f', stroke);
    motifSvg += renderIsoCube(128, 126, 25, primary, secondary, '#92400e', stroke);
    motifSvg += renderIsoCube(128, 100, 20, accent, primary, secondary, stroke);
    motifSvg += renderIsoCube(128, 76, 15, '#fef9c3', accent, primary, stroke);
    // Sacred Geometry Tensor Triangle Overlay
    motifSvg += `
      <polygon points="128,44 176,136 80,136" fill="none" stroke="${accent}" stroke-width="2" opacity="0.75" />
      <circle cx="128" cy="106" r="32" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.65" />
    `;
  }

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
    <defs>
      <linearGradient id="bg-${pathSpec.id}-${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${styleSpec.bgStart}" />
        <stop offset="100%" stop-color="${styleSpec.bgEnd}" />
      </linearGradient>
      <radialGradient id="glow-${pathSpec.id}-${seed}" cx="50%" cy="48%" r="50%">
        <stop offset="0%" stop-color="${primary}" stop-opacity="0.48" />
        <stop offset="60%" stop-color="${accent}" stop-opacity="0.16" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- Background Rounded Tile -->
    <rect width="256" height="256" rx="36" fill="url(#bg-${pathSpec.id}-${seed})" />
    <rect x="3" y="3" width="250" height="250" rx="33" fill="none" stroke="${primary}" stroke-opacity="0.45" stroke-width="2" />

    <!-- Isometric Background Grid -->
    <g stroke="${accent}" stroke-opacity="${styleSpec.gridOpacity}" stroke-width="1">
      <line x1="0" y1="64" x2="256" y2="192" />
      <line x1="0" y1="128" x2="256" y2="256" />
      <line x1="64" y1="0" x2="256" y2="96" />
      <line x1="256" y1="64" x2="0" y2="192" />
      <line x1="256" y1="128" x2="0" y2="256" />
      <line x1="192" y1="0" x2="0" y2="96" />
    </g>

    <!-- Radial Aura -->
    <circle cx="128" cy="122" r="${pulseRadius}" fill="url(#glow-${pathSpec.id}-${seed})" />

    <!-- Orbital Telemetry Ring -->
    <g transform="rotate(${ringAngle} 128 126)">
      <ellipse cx="128" cy="126" rx="96" ry="42" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.55" />
      <circle cx="224" cy="126" r="4" fill="${accent}" />
      <circle cx="32" cy="126" r="3" fill="${primary}" />
    </g>

    <!-- Isometric 3D Voxel Pedestal -->
    ${pedestalSvg}

    <!-- Path-Specific 3D Voxel Sculpture -->
    ${motifSvg}

    <!-- Top-Left Badge Tag -->
    <rect x="16" y="16" width="84" height="22" rx="7" fill="#050814" fill-opacity="0.82" stroke="${primary}" stroke-opacity="0.6" stroke-width="1" />
    <text x="58" y="31" fill="${accent}" font-family="monospace" font-weight="bold" font-size="10" text-anchor="middle">${escapeXml(pathSpec.badgeCode)}</text>

    <!-- Bottom Label Pill -->
    <rect x="24" y="214" width="208" height="26" rx="9" fill="#050814" fill-opacity="0.86" stroke="${accent}" stroke-opacity="0.45" stroke-width="1" />
    <text x="128" y="231" fill="#f8fafc" font-family="system-ui, sans-serif" font-weight="800" font-size="11" letter-spacing="0.6" text-anchor="middle">${escapeXml(pathSpec.shortLabel.toUpperCase())}</text>
  </svg>`;
}

export function synthesizeVoxelPathIconDataUri(options: {
  pathId: VoxelLearningPathId;
  stylePreset?: VoxelIconStylePreset;
  seed?: number;
  customAccentHex?: string;
}): string {
  const svg = synthesizeVoxelPathIconSvg(options);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function createInitialVoxelPathIconMap(): Record<VoxelLearningPathId, VoxelPathIconRecord> {
  const now = '2026-10-18';
  const records = {} as Record<VoxelLearningPathId, VoxelPathIconRecord>;

  VOXEL_LEARNING_PATHS.forEach((spec, index) => {
    const defaultStyle: VoxelIconStylePreset = 'isometric-cube';
    records[spec.id] = {
      pathId: spec.id,
      stylePreset: defaultStyle,
      prompt: spec.defaultPrompt,
      seed: index + 1,
      dataUri: synthesizeVoxelPathIconDataUri({
        pathId: spec.id,
        stylePreset: defaultStyle,
        seed: index + 1,
      }),
      source: 'procedural-voxel-tool',
      updatedAt: now,
    };
  });

  return records;
}

export function resolveLearningPathIdFromCategory(categoryOrName: string): VoxelLearningPathId {
  const lower = (categoryOrName || '').toLowerCase();
  if (lower.includes('robot') || lower.includes('kinematic') || lower.includes('mod-2')) {
    return 'robotics';
  }
  if (lower.includes('ethic') || lower.includes('safety') || lower.includes('align') || lower.includes('mod-3')) {
    return 'ai-ethics';
  }
  if (lower.includes('non-tech') || lower.includes('strategy') || lower.includes('executive') || lower.includes('mod-4')) {
    return 'non-technical-ai';
  }
  if (lower.includes('math') || lower.includes('apex') || lower.includes('progress') || lower.includes('origin')) {
    return 'foundational-math';
  }
  return 'generative-ai';
}
