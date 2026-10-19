import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VOXEL_LEARNING_PATHS,
  VOXEL_ICON_STYLE_PRESETS,
  buildVoxelIconPrompt,
  synthesizeVoxelPathIconSvg,
  synthesizeVoxelPathIconDataUri,
  createInitialVoxelPathIconMap,
  resolveLearningPathIdFromCategory,
} from './voxelPathIcons.ts';

test('VOXEL_LEARNING_PATHS defines 5 distinct 3D study library learning paths', () => {
  assert.equal(VOXEL_LEARNING_PATHS.length, 5);
  const ids = new Set(VOXEL_LEARNING_PATHS.map(p => p.id));
  assert.equal(ids.size, 5);
  assert.ok(ids.has('generative-ai'));
  assert.ok(ids.has('robotics'));
  assert.ok(ids.has('ai-ethics'));
  assert.ok(ids.has('non-technical-ai'));
  assert.ok(ids.has('foundational-math'));
});

test('synthesizeVoxelPathIconDataUri creates valid XML-escaped SVG data URIs for all paths and presets', () => {
  for (const pathSpec of VOXEL_LEARNING_PATHS) {
    for (const preset of VOXEL_ICON_STYLE_PRESETS) {
      const svg = synthesizeVoxelPathIconSvg({
        pathId: pathSpec.id,
        stylePreset: preset.id,
        seed: 7,
      });
      assert.ok(svg.startsWith('<svg'));
      assert.ok(svg.includes(pathSpec.badgeCode));
      // Ensure no unescaped ampersands exist in the SVG XML
      assert.equal(/&(?!amp;|lt;|gt;|quot;|apos;)/.test(svg), false);

      const uri = synthesizeVoxelPathIconDataUri({
        pathId: pathSpec.id,
        stylePreset: preset.id,
        seed: 7,
      });
      assert.ok(uri.startsWith('data:image/svg+xml;utf8,'));
    }
  }
});

test('buildVoxelIconPrompt combines learning path prompt, style preset, and custom notes', () => {
  const prompt = buildVoxelIconPrompt('robotics', 'neon-matrix', 'glowing ROS2 telemetry nodes');
  assert.ok(prompt.includes('robotic manipulator arm'));
  assert.ok(prompt.includes('Neon Cyber Matrix'));
  assert.ok(prompt.includes('glowing ROS2 telemetry nodes'));
});

test('createInitialVoxelPathIconMap initializes all 5 learning path icon records', () => {
  const map = createInitialVoxelPathIconMap();
  assert.equal(Object.keys(map).length, 5);
  assert.notEqual(map['generative-ai'].dataUri, map['robotics'].dataUri);
  assert.notEqual(map['ai-ethics'].dataUri, map['non-technical-ai'].dataUri);
});

test('resolveLearningPathIdFromCategory maps categories and module names accurately', () => {
  assert.equal(resolveLearningPathIdFromCategory('Generative AI'), 'generative-ai');
  assert.equal(resolveLearningPathIdFromCategory('Autonomous Robotics & Kinematics'), 'robotics');
  assert.equal(resolveLearningPathIdFromCategory('AI Ethics'), 'ai-ethics');
  assert.equal(resolveLearningPathIdFromCategory('Non-Technical AI Strategy'), 'non-technical-ai');
  assert.equal(resolveLearningPathIdFromCategory('Foundational Math & Theory (Apex)'), 'foundational-math');
});
