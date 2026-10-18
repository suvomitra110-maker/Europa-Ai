import { type DesignThemeConfig, type WixThemeManifest, buildWixThemeManifest } from './progressionLogic.ts';

export type WixModuleId =
  | 'badges-achievements'
  | 'game-2d-collider'
  | 'game-3d-roadster'
  | 'solar-roadster-themes'
  | 'quant-trading-hub'
  | 'ai-curriculum-cms';

export type WixTargetEnvironment = 'wix-studio' | 'wix-headless' | 'wix-blocks';

export interface WixBuilderConfig {
  allowWixBuild: boolean;
  siteName: string;
  siteNamespace: string;
  targetEnvironment: WixTargetEnvironment;
  selectedModules: WixModuleId[];
  autoSyncCms: boolean;
  activeTheme: DesignThemeConfig;
}

export interface WixTelemetrySnapshot {
  unlockedBadgesCount: number;
  totalBadgesCount: number;
  highScore2D: number;
  highScore3D: number;
  gamesPlayed: number;
  totalXp: number;
  level: number;
}

export interface WixCmsCollectionSchema {
  collectionId: string;
  displayName: string;
  fields: Array<{ key: string; type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'DATETIME' | 'OBJECT' }>;
  liveRecordCount: number;
}

export interface WixCustomElementSpec {
  tagName: string;
  moduleId: WixModuleId;
  title: string;
  scriptPath: string;
  attributes: string[];
}

export interface WixSiteBuildArtifact {
  provider: '@wix/sdk';
  sdkVersion: string;
  permissionsAllowed: boolean;
  environment: WixTargetEnvironment;
  siteName: string;
  siteNamespace: string;
  generatedAtIso: string;
  themeManifest: WixThemeManifest;
  customElements: WixCustomElementSpec[];
  cmsCollections: WixCmsCollectionSchema[];
  veloPageCode: string;
  wixConfigJson: string;
  readinessScore: number;
}

export const WIX_BUILDER_MODULES: Array<{
  id: WixModuleId;
  name: string;
  tagName: string;
  category: 'Profile & Gamification' | '2D & 3D AI Games' | 'Theme & Design System' | 'AI & Quant CMS';
  description: string;
  attributes: string[];
}> = [
  {
    id: 'badges-achievements',
    name: 'Badges & Achievements Glass Cards',
    tagName: 'europa-badges-achievements',
    category: 'Profile & Gamification',
    description: 'Interactive glass-morphism milestone cards with live telemetry bars, rarity filters, and XP progress.',
    attributes: ['theme-id', 'unlocked-count', 'total-xp', 'auto-sync-cms'],
  },
  {
    id: 'game-3d-roadster',
    name: '3D AI Roadster Highway Arena',
    tagName: 'europa-game-3d-roadster',
    category: '2D & 3D AI Games',
    description: 'Three.js WebGL 3D neural supercar highway with custom shaders, nitro boost, and leaderboard sync.',
    attributes: ['theme-id', 'high-score-3d', 'camera-fov', 'autostart'],
  },
  {
    id: 'game-2d-collider',
    name: '2D Quant Alpha Collider Arena',
    tagName: 'europa-game-2d-collider',
    category: '2D & 3D AI Games',
    description: '60fps 2D elastic physics arena with shockwave pulse, 3 enemy AI policies, and combo multipliers.',
    attributes: ['theme-id', 'high-score-2d', 'physics-dt', 'autostart'],
  },
  {
    id: 'solar-roadster-themes',
    name: '23 Solar, Futuristic & Kolkata Durga Puja Themes',
    tagName: 'europa-solar-theme-studio',
    category: 'Theme & Design System',
    description: 'Hover live-preview gallery featuring Kolkata Durga Puja cultural palettes, Futuristic 3026 HUDs, and Solar presets synced with @wix/design-system.',
    attributes: ['active-theme', 'solar-phase', 'sun-hour'],
  },
  {
    id: 'quant-trading-hub',
    name: 'Worldwide Quant Strategy Hub',
    tagName: 'europa-quant-strategy-hub',
    category: 'AI & Quant CMS',
    description: 'Global exchange telemetry (NY4, LD4, TY3, SG1) and 6 quantitative strategy method simulators.',
    attributes: ['active-region', 'completed-strategies'],
  },
  {
    id: 'ai-curriculum-cms',
    name: 'AI & Learning Encyclopedia CMS',
    tagName: 'europa-ai-curriculum',
    category: 'AI & Quant CMS',
    description: 'Structured video lectures, step-wise AI learning plan, and offline-capable study notes synced to Wix Data.',
    attributes: ['completed-lectures', 'scholar-level'],
  },
];

export function evaluateWixBuildReadiness(
  config: WixBuilderConfig,
  telemetry: WixTelemetrySnapshot
): {
  readinessScore: number;
  canBuild: boolean;
  statusLabel: string;
  checks: Array<{ id: string; label: string; passed: boolean; detail: string }>;
} {
  const hasPermission = Boolean(config.allowWixBuild);
  const hasModules = config.selectedModules.length > 0;
  const hasBadgesModule = config.selectedModules.includes('badges-achievements');
  const hasGamesModule =
    config.selectedModules.includes('game-2d-collider') ||
    config.selectedModules.includes('game-3d-roadster');

  const checks = [
    {
      id: 'wix-permission',
      label: '@wix Studio Build Permission',
      passed: hasPermission,
      detail: hasPermission
        ? 'Allowed (@wix/sdk & Custom Elements authorized)'
        : 'Build blocked until @wix permission is enabled',
    },
    {
      id: 'wix-modules',
      label: 'Custom Elements & Widgets Selected',
      passed: hasModules,
      detail: `${config.selectedModules.length} of ${WIX_BUILDER_MODULES.length} @wix modules active`,
    },
    {
      id: 'wix-badges',
      label: 'Badges & Achievements Glass Widget',
      passed: hasBadgesModule,
      detail: `${telemetry.unlockedBadgesCount}/${telemetry.totalBadgesCount} badges ready for @wix/data sync`,
    },
    {
      id: 'wix-games',
      label: '2D & 3D AI Game Engines',
      passed: hasGamesModule,
      detail: `3D Best: ${telemetry.highScore3D} · 2D Best: ${telemetry.highScore2D} (${telemetry.gamesPlayed} runs)`,
    },
  ];

  const passedCount = checks.filter(c => c.passed).length;
  const readinessScore = !hasPermission
    ? 0
    : Math.min(100, Math.round((passedCount / checks.length) * 100));

  return {
    readinessScore,
    canBuild: hasPermission && hasModules,
    statusLabel: !hasPermission
      ? 'Permission Required (@wix Allow Build)'
      : readinessScore === 100
      ? 'Ready for @wix Studio Production Build'
      : 'Ready for Partial @wix Build',
    checks,
  };
}

export function buildWixSiteArtifact(
  config: WixBuilderConfig,
  telemetry: WixTelemetrySnapshot,
  timestampIso = '2026-10-18T08:45:00.000Z'
): WixSiteBuildArtifact {
  const themeManifest = buildWixThemeManifest(config.activeTheme);
  const readiness = evaluateWixBuildReadiness(config, telemetry);

  const selectedSpecs: WixCustomElementSpec[] = WIX_BUILDER_MODULES.filter(m =>
    config.selectedModules.includes(m.id)
  ).map(m => ({
    tagName: m.tagName,
    moduleId: m.id,
    title: m.name,
    scriptPath: `/wix-custom-elements/${m.tagName}.js`,
    attributes: m.attributes,
  }));

  const cmsCollections: WixCmsCollectionSchema[] = [
    {
      collectionId: 'BadgesAchievements',
      displayName: 'Badges & Achievements Milestones',
      fields: [
        { key: 'badgeId', type: 'TEXT' },
        { key: 'name', type: 'TEXT' },
        { key: 'studyPath', type: 'TEXT' },
        { key: 'unlocked', type: 'BOOLEAN' },
        { key: 'progressPercent', type: 'NUMBER' },
      ],
      liveRecordCount: telemetry.totalBadgesCount,
    },
    {
      collectionId: 'GameArenaLeaderboard',
      displayName: '2D & 3D AI Game Scores',
      fields: [
        { key: 'gameMode', type: 'TEXT' },
        { key: 'highScore', type: 'NUMBER' },
        { key: 'gamesPlayed', type: 'NUMBER' },
        { key: 'totalXp', type: 'NUMBER' },
      ],
      liveRecordCount: Math.max(2, telemetry.gamesPlayed),
    },
    {
      collectionId: 'SolarRoadsterThemes',
      displayName: 'Solar, Futuristic & Kolkata Durga Puja Tokens',
      fields: [
        { key: 'themeId', type: 'TEXT' },
        { key: 'solarPhase', type: 'TEXT' },
        { key: 'sunHour', type: 'NUMBER' },
        { key: 'tokens', type: 'OBJECT' },
      ],
      liveRecordCount: 23,
    },
  ];

  const veloPageCode = `// Generated by @wix Studio Builder (${config.targetEnvironment})
// Site Namespace: ${config.siteNamespace} | Permission: ${config.allowWixBuild ? 'ALLOWED' : 'RESTRICTED'}
import { createClient, OAuthStrategy } from '@wix/sdk';
import { items } from '@wix/data';

export const wixClient = createClient({
  modules: { items },
  auth: OAuthStrategy({ clientId: '${config.siteNamespace}-client' }),
});

$w.onReady(async function () {
  // Apply @wix/design-system Solar & AI Roadster tokens (${themeManifest.themeName})
  const themeTokens = ${JSON.stringify(themeManifest.tokens, null, 2)};

  // Configure Custom Elements for Badges & Achievements + 2D/3D Games
  ${selectedSpecs
    .map(
      spec => `const el_${spec.moduleId.replace(/-/g, '_')} = $w('#${spec.tagName}');
  if (el_${spec.moduleId.replace(/-/g, '_')}) {
    el_${spec.moduleId.replace(/-/g, '_')}.setAttribute('theme-id', '${themeManifest.themeId}');
    el_${spec.moduleId.replace(/-/g, '_')}.setAttribute('wix-allowed', '${String(config.allowWixBuild)}');
  }`
    )
    .join('\n  ')}

  // Sync live Badges (${telemetry.unlockedBadgesCount}/${telemetry.totalBadgesCount}) & 2D/3D Game High Scores
  if (${String(config.autoSyncCms && config.allowWixBuild)}) {
    await wixClient.items.save('GameArenaLeaderboard', {
      _id: 'scholar-game-telemetry',
      highScore3D: ${telemetry.highScore3D},
      highScore2D: ${telemetry.highScore2D},
      unlockedBadges: ${telemetry.unlockedBadgesCount},
      totalXp: ${telemetry.totalXp},
    });
  }
});`;

  const wixConfigJson = JSON.stringify(
    {
      $schema: 'https://dev.wix.com/wix-cli/schemas/wix-config.json',
      appId: `${config.siteNamespace}-app`,
      siteName: config.siteName,
      permissions: {
        allowWixBuild: config.allowWixBuild,
        allowCustomElements: true,
        allowWebGL3DCanvas: true,
        allowWixDataSync: config.autoSyncCms,
      },
      environment: config.targetEnvironment,
      theme: themeManifest,
      customElements: selectedSpecs,
      collections: cmsCollections.map(c => c.collectionId),
    },
    null,
    2
  );

  return {
    provider: '@wix/sdk',
    sdkVersion: '1.15.0',
    permissionsAllowed: config.allowWixBuild,
    environment: config.targetEnvironment,
    siteName: config.siteName,
    siteNamespace: config.siteNamespace,
    generatedAtIso: timestampIso,
    themeManifest,
    customElements: selectedSpecs,
    cmsCollections,
    veloPageCode,
    wixConfigJson,
    readinessScore: readiness.readinessScore,
  };
}
