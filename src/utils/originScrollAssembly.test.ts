import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ORIGIN_ASSEMBLY_PARTS,
  ORIGIN_ASSEMBLY_STAGES,
  computeAssemblyPartsState,
  resolveActiveAssemblyStage,
  summarizeAssemblyTelemetry,
  buildWixHomeScrollSnippet,
} from './originScrollAssembly.ts';

test('at 0% scroll, all 12 Origin Math, AI, and Robotics parts are in their exploded starting positions', () => {
  const partsAtStart = computeAssemblyPartsState(0);
  assert.equal(partsAtStart.length, 12);
  assert.equal(partsAtStart.every(p => !p.isLocked), true);

  const mathSpiral = partsAtStart.find(p => p.id === 'math-fibonacci-spiral');
  assert.ok(mathSpiral);
  assert.equal(mathSpiral.currentDx, mathSpiral.explodedDx);
  assert.equal(mathSpiral.currentDy, mathSpiral.explodedDy);

  const summary = summarizeAssemblyTelemetry(0);
  assert.equal(summary.progressPercent, 0);
  assert.equal(summary.lockedPartsCount, 0);
  assert.equal(summary.activeStage.id, 'origin-math');
  assert.equal(summary.isFullyAssembled, false);
});

test('scrolling down through 30%, 60%, and 100% progressively locks Origin Math, AI, and Robotics parts', () => {
  const afterMath = summarizeAssemblyTelemetry(0.32);
  assert.equal(afterMath.mathCompletionPercent, 100);
  assert.equal(afterMath.activeStage.id, 'neural-ai');
  assert.ok(afterMath.lockedPartsCount >= 3);

  const afterAi = summarizeAssemblyTelemetry(0.63);
  assert.equal(afterAi.mathCompletionPercent, 100);
  assert.equal(afterAi.aiCompletionPercent, 100);
  assert.equal(afterAi.activeStage.id, 'robotics-parts');
  assert.ok(afterAi.lockedPartsCount >= 6);

  const fullyAssembled = summarizeAssemblyTelemetry(1.0);
  assert.equal(fullyAssembled.progressPercent, 100);
  assert.equal(fullyAssembled.lockedPartsCount, ORIGIN_ASSEMBLY_PARTS.length);
  assert.equal(fullyAssembled.mathCompletionPercent, 100);
  assert.equal(fullyAssembled.aiCompletionPercent, 100);
  assert.equal(fullyAssembled.roboticsCompletionPercent, 100);
  assert.equal(fullyAssembled.isFullyAssembled, true);
  assert.equal(fullyAssembled.activeStage.id, 'unified-core');

  const finalParts = computeAssemblyPartsState(1.0);
  for (const part of finalParts) {
    assert.equal(part.currentDx, 0);
    assert.equal(part.currentDy, 0);
    assert.equal(part.currentRotateDeg, 0);
    assert.equal(part.currentScale, 1);
    assert.equal(part.clearanceMm, 0);
  }
});

test('resolveActiveAssemblyStage maps scroll progress across all 4 assembly stages', () => {
  assert.equal(ORIGIN_ASSEMBLY_STAGES.length, 4);
  assert.equal(resolveActiveAssemblyStage(0.1).id, 'origin-math');
  assert.equal(resolveActiveAssemblyStage(0.45).id, 'neural-ai');
  assert.equal(resolveActiveAssemblyStage(0.75).id, 'robotics-parts');
  assert.equal(resolveActiveAssemblyStage(0.95).id, 'unified-core');
});

test('buildWixHomeScrollSnippet generates @wix Velo code, Custom Element markup, and CMS schema', () => {
  const veloCode = buildWixHomeScrollSnippet({
    mode: 'velo-scroll-code',
    scrollProgress: 0.75,
    themeId: 'durga-puja-sindoor-gold',
    siteNamespace: 'europa-ai-home',
  });
  assert.ok(veloCode.includes('wix-window-frontend'));
  assert.ok(veloCode.includes('#europaOriginAssembly'));
  assert.ok(veloCode.includes('durga-puja-sindoor-gold'));

  const customTag = buildWixHomeScrollSnippet({
    mode: 'custom-element-tag',
    scrollProgress: 1.0,
    themeId: 'futuristic-3026-orbital',
  });
  assert.ok(customTag.includes('<europa-origin-scroll-assembly'));
  assert.ok(customTag.includes('locked-parts="12/12"'));

  const cmsJson = buildWixHomeScrollSnippet({
    mode: 'wix-cms-schema',
    scrollProgress: 0.5,
    themeId: 'futuristic-3026-orbital',
  });
  assert.ok(cmsJson.includes('OriginScrollAssemblyKeyframes'));
});
