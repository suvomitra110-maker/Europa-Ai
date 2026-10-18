export interface Body2D {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
}

export interface InputVector2D {
  moveX: number;
  moveY: number;
  boost: boolean;
}

export interface ArenaBounds2D {
  width: number;
  height: number;
  padding?: number;
}

export interface CircleEntity2D {
  x: number;
  y: number;
  radius: number;
}

export type EnemyPolicyType = 'chaser' | 'orbiter' | 'charger';

export interface HazardEntity2D extends Body2D {
  id: string;
  policy: EnemyPolicyType;
  phaseTimer: number;
  chargeState: 'seek' | 'telegraph' | 'dash' | 'recover';
  aimDirX: number;
  aimDirY: number;
  hitFlash: number;
}

export interface RoadsterPhysicsState {
  x: number;
  vx: number;
  speedMph: number;
  distanceMeters: number;
  nitroEnergy: number; // 0 to 100
  nitroActive: boolean;
  cameraFov: number;
  tiltAngle: number;
}

export interface RoadsterInput {
  steer: number; // -1 (left) to +1 (right)
  throttle: number; // -1 (brake) to +1 (accel)
  nitro: boolean;
}

/**
 * Clamp raw frame delta to <= 0.05s so tab switches or hiccups never tunnel entities.
 */
export function clampSimDt(rawDt: number): number {
  if (!Number.isFinite(rawDt) || rawDt <= 0) return 1 / 60;
  return Math.min(rawDt, 0.05);
}

/**
 * Integrate 2D physics body with acceleration, exponential drag damping, and elastic wall bounce.
 */
export function step2DPhysicsBody(
  body: Body2D,
  input: InputVector2D,
  bounds: ArenaBounds2D,
  dt: number
): Body2D {
  const safeDt = clampSimDt(dt);
  const pad = bounds.padding ?? body.radius;

  // Normalize input vector if diagonal
  let ix = input.moveX;
  let iy = input.moveY;
  const mag = Math.hypot(ix, iy);
  if (mag > 1) {
    ix /= mag;
    iy /= mag;
  }

  const thrust = input.boost ? 980 : 620;
  const maxSpeed = input.boost ? 560 : 390;
  const drag = Math.exp(-3.2 * safeDt);

  let vx = (body.vx + ix * thrust * safeDt) * drag;
  let vy = (body.vy + iy * thrust * safeDt) * drag;

  const speed = Math.hypot(vx, vy);
  if (speed > maxSpeed) {
    const scale = maxSpeed / speed;
    vx *= scale;
    vy *= scale;
  }

  let x = body.x + vx * safeDt;
  let y = body.y + vy * safeDt;
  const restitution = 0.65;

  const minX = pad;
  const maxX = Math.max(pad + 10, bounds.width - pad);
  const minY = pad;
  const maxY = Math.max(pad + 10, bounds.height - pad);

  if (x < minX) {
    x = minX;
    vx = Math.abs(vx) * restitution;
  } else if (x > maxX) {
    x = maxX;
    vx = -Math.abs(vx) * restitution;
  }

  if (y < minY) {
    y = minY;
    vy = Math.abs(vy) * restitution;
  } else if (y > maxY) {
    y = maxY;
    vy = -Math.abs(vy) * restitution;
  }

  return {
    ...body,
    x,
    y,
    vx,
    vy,
  };
}

/**
 * Detect circle-circle collision and compute collision normal & penetration depth.
 */
export function checkCircleCollision2D(
  a: CircleEntity2D,
  b: CircleEntity2D
): {
  collided: boolean;
  distance: number;
  overlap: number;
  normalX: number;
  normalY: number;
} {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const sumR = a.radius + b.radius;

  if (dist >= sumR) {
    return {
      collided: false,
      distance: dist,
      overlap: 0,
      normalX: dist > 0.0001 ? dx / dist : 1,
      normalY: dist > 0.0001 ? dy / dist : 0,
    };
  }

  const nx = dist > 0.0001 ? dx / dist : 1;
  const ny = dist > 0.0001 ? dy / dist : 0;

  return {
    collided: true,
    distance: dist,
    overlap: sumR - dist,
    normalX: nx,
    normalY: ny,
  };
}

/**
 * Resolve 2D elastic collision with positional separation and impulse exchange.
 */
export function resolveElasticCollision2D(
  a: Body2D,
  b: Body2D,
  restitution = 0.85
): { a: Body2D; b: Body2D; impactSpeed: number } {
  const col = checkCircleCollision2D(a, b);
  if (!col.collided) {
    return { a, b, impactSpeed: 0 };
  }

  const totalMass = Math.max(0.1, a.mass + b.mass);
  const sepA = col.overlap * (b.mass / totalMass);
  const sepB = col.overlap * (a.mass / totalMass);

  const nextA: Body2D = {
    ...a,
    x: a.x - col.normalX * sepA,
    y: a.y - col.normalY * sepA,
  };
  const nextB: Body2D = {
    ...b,
    x: b.x + col.normalX * sepB,
    y: b.y + col.normalY * sepB,
  };

  const rvx = nextB.vx - nextA.vx;
  const rvy = nextB.vy - nextA.vy;
  const velAlongNormal = rvx * col.normalX + rvy * col.normalY;

  if (velAlongNormal > 0) {
    return { a: nextA, b: nextB, impactSpeed: 0 };
  }

  const invMassA = 1 / Math.max(0.1, nextA.mass);
  const invMassB = 1 / Math.max(0.1, nextB.mass);
  const j = (-(1 + restitution) * velAlongNormal) / (invMassA + invMassB);

  const impulseX = j * col.normalX;
  const impulseY = j * col.normalY;

  nextA.vx -= invMassA * impulseX;
  nextA.vy -= invMassA * impulseY;
  nextB.vx += invMassB * impulseX;
  nextB.vy += invMassB * impulseY;

  return {
    a: nextA,
    b: nextB,
    impactSpeed: Math.abs(velAlongNormal),
  };
}

/**
 * Apply radial shockwave pulse that knocks back nearby hazards.
 */
export function applyShockwavePulse2D(
  originX: number,
  originY: number,
  radius: number,
  impulseStrength: number,
  hazards: HazardEntity2D[]
): HazardEntity2D[] {
  return hazards.map(h => {
    const dx = h.x - originX;
    const dy = h.y - originY;
    const dist = Math.hypot(dx, dy);
    if (dist >= radius || dist < 0.001) return h;

    const falloff = 1 - dist / radius;
    const nx = dx / dist;
    const ny = dy / dist;
    return {
      ...h,
      vx: h.vx + nx * impulseStrength * (0.45 + 0.55 * falloff),
      vy: h.vy + ny * impulseStrength * (0.45 + 0.55 * falloff),
      hitFlash: 0.12,
      chargeState: h.policy === 'charger' ? 'recover' : h.chargeState,
      phaseTimer: h.policy === 'charger' ? 0.6 : h.phaseTimer,
    };
  });
}

/**
 * Step 1 of 3 distinct enemy AI policies:
 * 1. 'chaser': Momentum seek toward player
 * 2. 'orbiter': Tangential orbit at ~170px radius with radial spring
 * 3. 'charger': Seek -> 0.55s Telegraph (locked aim line) -> High-Speed Dash -> Recover
 */
export function stepEnemyPolicy2D(
  enemy: HazardEntity2D,
  playerX: number,
  playerY: number,
  bounds: ArenaBounds2D,
  dt: number,
  speedMultiplier = 1
): HazardEntity2D {
  const safeDt = clampSimDt(dt);
  const dx = playerX - enemy.x;
  const dy = playerY - enemy.y;
  const dist = Math.max(0.001, Math.hypot(dx, dy));
  const nx = dx / dist;
  const ny = dy / dist;

  let vx = enemy.vx;
  let vy = enemy.vy;
  let phaseTimer = enemy.phaseTimer - safeDt;
  let chargeState = enemy.chargeState;
  let aimDirX = enemy.aimDirX;
  let aimDirY = enemy.aimDirY;

  if (enemy.policy === 'chaser') {
    const accel = 260 * speedMultiplier;
    vx = (vx + nx * accel * safeDt) * Math.exp(-1.8 * safeDt);
    vy = (vy + ny * accel * safeDt) * Math.exp(-1.8 * safeDt);
  } else if (enemy.policy === 'orbiter') {
    const desiredOrbit = 165;
    const radialError = (dist - desiredOrbit) / desiredOrbit;
    // Tangent vector (-ny, nx) + radial correction
    const tx = -ny;
    const ty = nx;
    const accel = 290 * speedMultiplier;
    vx = (vx + (tx * 0.8 + nx * Math.max(-0.9, Math.min(0.9, radialError))) * accel * safeDt) * Math.exp(-2.1 * safeDt);
    vy = (vy + (ty * 0.8 + ny * Math.max(-0.9, Math.min(0.9, radialError))) * accel * safeDt) * Math.exp(-2.1 * safeDt);
  } else {
    // 'charger' with explicit telegraph -> dash -> recover state machine
    if (chargeState === 'seek') {
      const accel = 210 * speedMultiplier;
      vx = (vx + nx * accel * safeDt) * Math.exp(-2.2 * safeDt);
      vy = (vy + ny * accel * safeDt) * Math.exp(-2.2 * safeDt);
      if (phaseTimer <= 0 && dist < 380) {
        chargeState = 'telegraph';
        phaseTimer = 0.55; // 550ms visible telegraph before dash
        aimDirX = nx;
        aimDirY = ny;
        vx *= 0.15;
        vy *= 0.15;
      }
    } else if (chargeState === 'telegraph') {
      // Lock aim during first half of telegraph, brake hard
      if (phaseTimer > 0.22) {
        aimDirX = nx;
        aimDirY = ny;
      }
      vx *= Math.exp(-8 * safeDt);
      vy *= Math.exp(-8 * safeDt);
      if (phaseTimer <= 0) {
        chargeState = 'dash';
        phaseTimer = 0.42;
        const dashSpeed = 460 * speedMultiplier;
        vx = aimDirX * dashSpeed;
        vy = aimDirY * dashSpeed;
      }
    } else if (chargeState === 'dash') {
      if (phaseTimer <= 0) {
        chargeState = 'recover';
        phaseTimer = 0.85;
      }
    } else {
      // recover
      vx *= Math.exp(-4.5 * safeDt);
      vy *= Math.exp(-4.5 * safeDt);
      if (phaseTimer <= 0) {
        chargeState = 'seek';
        phaseTimer = 1.6;
      }
    }
  }

  let x = enemy.x + vx * safeDt;
  let y = enemy.y + vy * safeDt;
  const pad = enemy.radius + 4;

  if (x < pad) {
    x = pad;
    vx = Math.abs(vx) * 0.8;
  } else if (x > bounds.width - pad) {
    x = bounds.width - pad;
    vx = -Math.abs(vx) * 0.8;
  }

  if (y < pad) {
    y = pad;
    vy = Math.abs(vy) * 0.8;
  } else if (y > bounds.height - pad) {
    y = bounds.height - pad;
    vy = -Math.abs(vy) * 0.8;
  }

  return {
    ...enemy,
    x,
    y,
    vx,
    vy,
    phaseTimer,
    chargeState,
    aimDirX,
    aimDirY,
    hitFlash: Math.max(0, enemy.hitFlash - safeDt),
  };
}

/**
 * Step 3D AI Roadster physics along the Solar Quantum Highway.
 */
export function step3DRoadsterPhysics(
  state: RoadsterPhysicsState,
  input: RoadsterInput,
  dt: number
): RoadsterPhysicsState {
  const safeDt = clampSimDt(dt);
  const roadHalfWidth = 6.4;

  const canNitro = input.nitro && state.nitroEnergy > 2;
  const nitroActive = canNitro;

  const nextNitroEnergy = nitroActive
    ? Math.max(0, state.nitroEnergy - 28 * safeDt)
    : Math.min(100, state.nitroEnergy + 11 * safeDt);

  const baseTargetSpeed = 148 + input.throttle * 42;
  const targetSpeedMph = nitroActive ? 248 : Math.max(85, baseTargetSpeed);
  const speedDamp = 1 - Math.exp(-4.5 * safeDt);
  const speedMph = state.speedMph + (targetSpeedMph - state.speedMph) * speedDamp;

  // Lateral steering with responsive spring-damping
  const lateralAccel = 34 * input.steer;
  let vx = (state.vx + lateralAccel * safeDt) * Math.exp(-6.5 * safeDt);
  let x = state.x + vx * safeDt;

  if (x < -roadHalfWidth) {
    x = -roadHalfWidth;
    vx = Math.max(0, vx * -0.3);
  } else if (x > roadHalfWidth) {
    x = roadHalfWidth;
    vx = Math.min(0, vx * -0.3);
  }

  const metersPerSec = speedMph * 0.44704;
  const distanceMeters = state.distanceMeters + metersPerSec * safeDt;

  const targetFov = nitroActive ? 74 : 60 + ((speedMph - 120) / 140) * 6;
  const cameraFov = state.cameraFov + (targetFov - state.cameraFov) * (1 - Math.exp(-6 * safeDt));

  const targetTilt = -input.steer * 0.14;
  const tiltAngle = state.tiltAngle + (targetTilt - state.tiltAngle) * (1 - Math.exp(-8 * safeDt));

  return {
    x,
    vx,
    speedMph,
    distanceMeters,
    nitroEnergy: nextNitroEnergy,
    nitroActive,
    cameraFov,
    tiltAngle,
  };
}

/**
 * Check 3D bounding-box / capsule overlap on the highway plane (X, Z).
 */
export function checkRoadsterCollision3D(
  carX: number,
  carZ: number,
  entityX: number,
  entityZ: number,
  radiusX = 1.25,
  radiusZ = 2.1
): boolean {
  return Math.abs(carX - entityX) <= radiusX && Math.abs(carZ - entityZ) <= radiusZ;
}

/**
 * Pure score & combo calculation for both 2D and 3D games.
 */
export function calculateArcadeScore(
  currentScore: number,
  basePoints: number,
  combo: number,
  boostActive: boolean
): { nextScore: number; pointsAwarded: number; nextCombo: number } {
  const safeCombo = Math.max(1, Math.min(12, Math.floor(combo)));
  const boostFactor = boostActive ? 1.5 : 1;
  const pointsAwarded = Math.round(basePoints * safeCombo * boostFactor);
  return {
    nextScore: Math.max(0, Math.round(currentScore + pointsAwarded)),
    pointsAwarded,
    nextCombo: Math.min(12, safeCombo + 1),
  };
}

/**
 * Multi-knob difficulty ramp scaling spawn interval, speed multiplier, and concurrent hazards.
 */
export function calculateDifficultyKnobs(
  elapsedSeconds: number,
  wave: number
): {
  spawnInterval: number;
  speedMultiplier: number;
  maxConcurrentHazards: number;
  chargerWeight: number;
} {
  const safeTime = Math.max(0, elapsedSeconds);
  const safeWave = Math.max(1, wave);
  const ramp = Math.min(1, safeTime / 90 + (safeWave - 1) * 0.12);

  return {
    spawnInterval: Number((2.2 - ramp * 1.1).toFixed(2)),
    speedMultiplier: Number((1 + ramp * 0.55).toFixed(2)),
    maxConcurrentHazards: Math.min(10, 4 + Math.floor(ramp * 6)),
    chargerWeight: Number((0.18 + ramp * 0.25).toFixed(2)),
  };
}
