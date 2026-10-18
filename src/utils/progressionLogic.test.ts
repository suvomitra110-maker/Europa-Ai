import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateXpProgress,
  applyXpGain,
  resolveSolarPreset,
  evaluateAchievementMilestones,
  DESIGN_THEMES,
  SOLAR_PREVIEW_PRESETS,
  buildWixThemeManifest,
  resolveDesignTheme,
} from './progressionLogic.ts';

test('calculateXpProgress computes accurate percentage and remaining XP within current level', () => {
  const summary = calculateXpProgress(1420, 4, 2000);
  // Level 4 with nextLevelXp 2000 -> floor is 1200, span is 800, xpIntoLevel is 220
  assert.equal(summary.currentLevelFloorXp, 1200);
  assert.equal(summary.xpIntoLevel, 220);
  assert.equal(summary.xpNeededForLevel, 800);
  assert.equal(summary.progressPercent, 28);
  assert.equal(summary.xpRemaining, 580);
  assert.equal(summary.rankTitle, 'Neural & Alpha Researcher');
});

test('applyXpGain increments XP and triggers level up when crossing threshold', () => {
  const initial = { xp: 1850, level: 4, nextLevelXp: 2000 };
  const afterLesson = applyXpGain(initial, 200);
  assert.equal(afterLesson.xp, 2050);
  assert.equal(afterLesson.level, 5);
  assert.equal(afterLesson.nextLevelXp, 2800);
  assert.equal(afterLesson.leveledUp, true);
  assert.equal(afterLesson.levelsGained, 1);
});

test('resolveSolarPreset maps Dawn, Day, Sunset, and Night presets accurately', () => {
  const dawn = resolveSolarPreset('dawn');
  assert.equal(dawn.solarPhase, 'dawn');
  assert.equal(dawn.theme, 'dark');
  assert.equal(dawn.sunHour, 6.5);

  const day = resolveSolarPreset('day');
  assert.equal(day.solarPhase, 'day');
  assert.equal(day.theme, 'light');
  assert.equal(day.sunHour, 12.0);

  const sunset = resolveSolarPreset('sunset');
  assert.equal(sunset.solarPhase, 'sunset');
  assert.equal(sunset.theme, 'dark');

  const night = resolveSolarPreset('night');
  assert.equal(night.solarPhase, 'night');
  assert.equal(night.theme, 'dark');
});

test('SOLAR_PREVIEW_PRESETS provides 10 solar-themed presets and DESIGN_THEMES includes AI Roadster, Futuristic, and Kolkata Durga Puja themes', () => {
  assert.equal(SOLAR_PREVIEW_PRESETS.length, 10);
  assert.equal(DESIGN_THEMES.length, 23);

  const roadsterThemes = DESIGN_THEMES.filter(t => t.category === 'ai-roadster');
  assert.equal(roadsterThemes.length, 3);

  const kolkataThemes = DESIGN_THEMES.filter(t => t.category === 'kolkata-durga-puja');
  assert.equal(kolkataThemes.length, 4);

  const futuristicThemes = DESIGN_THEMES.filter(t => t.category === 'futuristic');
  assert.equal(futuristicThemes.length, 4);

  const durgaSindoor = resolveDesignTheme('kolkata-durga-sindoor');
  assert.equal(durgaSindoor.name, 'Durga Puja Sindoor & Dhunuchi Glow');
  assert.ok(durgaSindoor.culturalSpec);
  assert.equal(durgaSindoor.culturalSpec.motif, 'Shardiya Alpona & Dhunuchi Arati');

  const dysonSphere = resolveDesignTheme('futuristic-dyson-sphere');
  assert.equal(dysonSphere.name, 'Dyson Sphere Stellar Megastructure');
  assert.ok(dysonSphere.futuristicSpec);
  assert.equal(dysonSphere.futuristicSpec.era, '3026 Megastructure');

  const crimsonRoadster = resolveDesignTheme('ai-roadster-crimson');
  assert.equal(crimsonRoadster.name, 'AI Roadster Crimson Telemetry');
  assert.ok(crimsonRoadster.roadsterSpec);
  assert.equal(crimsonRoadster.roadsterSpec.zeroToSixty, '1.85s');

  const wixManifest = buildWixThemeManifest(crimsonRoadster);
  assert.equal(wixManifest.provider, '@wix/design-system');
  assert.equal(wixManifest.themeId, 'ai-roadster-crimson');
  assert.equal(wixManifest.tokens.colorAccentPrimary, '#ef4444');

  const fallback = resolveDesignTheme('unknown-id');
  assert.equal(fallback.id, 'europa-night');
});

test('evaluateAchievementMilestones unlocks AI and Quant badges at target milestones', () => {
  const milestones = evaluateAchievementMilestones({
    completedAiLecturesCount: 6,
    totalAiLecturesCount: 10,
    completedAiStepsCount: 5,
    completedQuantStrategiesCount: 3,
    totalQuantStrategiesCount: 6,
    xp: 2200,
    level: 5,
    streakDays: 6,
    notesCount: 4,
  });

  const aiRoboticsBadge = milestones.find(m => m.badgeId === 'badge-6');
  assert.ok(aiRoboticsBadge);
  assert.equal(aiRoboticsBadge.shouldUnlock, true);
  assert.equal(aiRoboticsBadge.progressPercent, 100);

  const quantFirstBadge = milestones.find(m => m.badgeId === 'badge-14');
  assert.ok(quantFirstBadge);
  assert.equal(quantFirstBadge.shouldUnlock, true);

  const quantMasterBadge = milestones.find(m => m.badgeId === 'badge-15');
  assert.ok(quantMasterBadge);
  assert.equal(quantMasterBadge.shouldUnlock, true);
  assert.equal(quantMasterBadge.progressPercent, 100);

  const quantAllBadge = milestones.find(m => m.badgeId === 'badge-16');
  assert.ok(quantAllBadge);
  assert.equal(quantAllBadge.shouldUnlock, false);
  assert.equal(quantAllBadge.progressPercent, 50);
});
