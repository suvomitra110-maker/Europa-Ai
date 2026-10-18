import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampSimDt,
  step2DPhysicsBody,
  checkCircleCollision2D,
  resolveElasticCollision2D,
  applyShockwavePulse2D,
  stepEnemyPolicy2D,
  step3DRoadsterPhysics,
  checkRoadsterCollision3D,
  calculateArcadeScore,
  calculateDifficultyKnobs,
  type HazardEntity2D,
} from './gameEngine.ts';

test('clampSimDt caps large frame deltas to 0.05s to prevent tunneling', () => {
  assert.equal(clampSimDt(0.25), 0.05);
  assert.equal(clampSimDt(0.016), 0.016);
  assert.ok(clampSimDt(-1) > 0);
});

test('step2DPhysicsBody accelerates player and bounces off arena walls', () => {
  const start = { x: 100, y: 100, vx: 0, vy: 0, radius: 18, mass: 1 };
  const moved = step2DPhysicsBody(
    start,
    { moveX: 1, moveY: 0, boost: false },
    { width: 800, height: 500 },
    0.04
  );
  assert.ok(moved.x > start.x);
  assert.ok(moved.vx > 0);

  // Test left wall bounce restitution
  const nearWall = { x: 5, y: 100, vx: -200, vy: 0, radius: 18, mass: 1 };
  const bounced = step2DPhysicsBody(
    nearWall,
    { moveX: -1, moveY: 0, boost: false },
    { width: 800, height: 500 },
    0.04
  );
  assert.ok(bounced.x >= 18);
  assert.ok(bounced.vx > 0);
});

test('checkCircleCollision2D and resolveElasticCollision2D separate overlapping bodies and exchange momentum', () => {
  const a = { x: 100, y: 100, vx: 150, vy: 0, radius: 20, mass: 1 };
  const b = { x: 130, y: 100, vx: -100, vy: 0, radius: 20, mass: 1 };

  const check = checkCircleCollision2D(a, b);
  assert.equal(check.collided, true);
  assert.equal(check.overlap, 10);

  const resolved = resolveElasticCollision2D(a, b, 0.9);
  assert.ok(resolved.a.x < a.x);
  assert.ok(resolved.b.x > b.x);
  assert.ok(resolved.a.vx < 0);
  assert.ok(resolved.b.vx > 0);
  assert.ok(resolved.impactSpeed > 0);
});

test('stepEnemyPolicy2D supports 3 distinct enemy policies including charger telegraph-to-dash', () => {
  const bounds = { width: 800, height: 500 };
  const charger: HazardEntity2D = {
    id: 'h-1',
    x: 200,
    y: 200,
    vx: 0,
    vy: 0,
    radius: 16,
    mass: 1.2,
    policy: 'charger',
    phaseTimer: 0,
    chargeState: 'seek',
    aimDirX: 1,
    aimDirY: 0,
    hitFlash: 0,
  };

  // Step 1: seek with phaseTimer <= 0 transitions to 'telegraph'
  const telegraphed = stepEnemyPolicy2D(charger, 350, 200, bounds, 0.03, 1);
  assert.equal(telegraphed.chargeState, 'telegraph');
  assert.ok(telegraphed.phaseTimer > 0.4);

  // Step 2: expire telegraph timer to transition into high-speed 'dash'
  const readyToDash = { ...telegraphed, phaseTimer: 0.01 };
  const dashing = stepEnemyPolicy2D(readyToDash, 350, 200, bounds, 0.03, 1);
  assert.equal(dashing.chargeState, 'dash');
  assert.ok(Math.hypot(dashing.vx, dashing.vy) > 400);

  // Shockwave pulse repels hazard and resets charger to recover
  const repelled = applyShockwavePulse2D(190, 200, 180, 420, [dashing]);
  assert.equal(repelled[0].chargeState, 'recover');
  assert.ok(repelled[0].vx > dashing.vx);
});

test('step3DRoadsterPhysics updates steering, speed, nitro energy, and FOV smoothly', () => {
  const initial = {
    x: 0,
    vx: 0,
    speedMph: 140,
    distanceMeters: 0,
    nitroEnergy: 80,
    nitroActive: false,
    cameraFov: 60,
    tiltAngle: 0,
  };

  const boosted = step3DRoadsterPhysics(initial, { steer: 1, throttle: 1, nitro: true }, 0.04);
  assert.equal(boosted.nitroActive, true);
  assert.ok(boosted.speedMph > initial.speedMph);
  assert.ok(boosted.x > 0);
  assert.ok(boosted.nitroEnergy < initial.nitroEnergy);
  assert.ok(boosted.cameraFov > initial.cameraFov);
  assert.equal(checkRoadsterCollision3D(boosted.x, 0, boosted.x + 0.4, 0.5), true);
  assert.equal(checkRoadsterCollision3D(boosted.x, 0, boosted.x + 4.5, 0.5), false);
});

test('calculateArcadeScore and calculateDifficultyKnobs scale score and challenge', () => {
  const res = calculateArcadeScore(500, 100, 3, true);
  assert.equal(res.pointsAwarded, 450);
  assert.equal(res.nextScore, 950);
  assert.equal(res.nextCombo, 4);

  const early = calculateDifficultyKnobs(5, 1);
  const late = calculateDifficultyKnobs(75, 4);
  assert.ok(late.speedMultiplier > early.speedMultiplier);
  assert.ok(late.spawnInterval < early.spawnInterval);
  assert.ok(late.maxConcurrentHazards >= early.maxConcurrentHazards);
});
