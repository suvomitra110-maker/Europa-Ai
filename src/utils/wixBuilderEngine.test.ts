import test from 'node:test';
import assert from 'node:assert/strict';
import { DESIGN_THEMES } from './progressionLogic.ts';
import {
  evaluateWixBuildReadiness,
  buildWixSiteArtifact,
  WIX_BUILDER_MODULES,
  type WixBuilderConfig,
  type WixTelemetrySnapshot,
} from './wixBuilderEngine.ts';

const sampleTelemetry: WixTelemetrySnapshot = {
  unlockedBadgesCount: 8,
  totalBadgesCount: 18,
  highScore2D: 1450,
  highScore3D: 2300,
  gamesPlayed: 5,
  totalXp: 3420,
  level: 5,
};

test('evaluateWixBuildReadiness blocks build when allowWixBuild is false and reaches 100% when allowed', () => {
  const blockedConfig: WixBuilderConfig = {
    allowWixBuild: false,
    siteName: 'Europa AI & Quant Studio',
    siteNamespace: 'europa-ai-quant-studio',
    targetEnvironment: 'wix-studio',
    selectedModules: ['badges-achievements', 'game-3d-roadster', 'game-2d-collider'],
    autoSyncCms: true,
    activeTheme: DESIGN_THEMES[4], // Cyber Roadster Apex
  };

  const blockedResult = evaluateWixBuildReadiness(blockedConfig, sampleTelemetry);
  assert.equal(blockedResult.canBuild, false);
  assert.equal(blockedResult.readinessScore, 0);

  const allowedConfig: WixBuilderConfig = {
    ...blockedConfig,
    allowWixBuild: true,
  };
  const allowedResult = evaluateWixBuildReadiness(allowedConfig, sampleTelemetry);
  assert.equal(allowedResult.canBuild, true);
  assert.equal(allowedResult.readinessScore, 100);
});

test('buildWixSiteArtifact generates custom elements, CMS schemas, and Velo code for Badges and 2D/3D Games', () => {
  const config: WixBuilderConfig = {
    allowWixBuild: true,
    siteName: 'Europa AI & Quant Studio',
    siteNamespace: 'europa-ai-quant-studio',
    targetEnvironment: 'wix-studio',
    selectedModules: WIX_BUILDER_MODULES.map(m => m.id),
    autoSyncCms: true,
    activeTheme: DESIGN_THEMES[4],
  };

  const artifact = buildWixSiteArtifact(config, sampleTelemetry, '2026-10-18T08:45:00.000Z');
  assert.equal(artifact.permissionsAllowed, true);
  assert.equal(artifact.customElements.length, 6);
  assert.ok(artifact.customElements.some(el => el.tagName === 'europa-badges-achievements'));
  assert.ok(artifact.customElements.some(el => el.tagName === 'europa-game-3d-roadster'));
  assert.ok(artifact.customElements.some(el => el.tagName === 'europa-game-2d-collider'));
  assert.ok(artifact.veloPageCode.includes('@wix/sdk'));
  assert.ok(artifact.wixConfigJson.includes('"allowWixBuild": true'));
});
