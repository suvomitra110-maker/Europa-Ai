import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { useApp } from '../../context/AppContext';
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
  Body2D,
  HazardEntity2D,
  RoadsterPhysicsState,
} from '../../utils/gameEngine';

type GameLifecycleState = 'title' | 'playing' | 'paused' | 'gameover';

interface RunSnapshot {
  outcome: 'victory' | 'defeat';
  mode: '2d' | '3d';
  score: number;
  bestScore: number;
  orbsCollected: number;
  waveReached: number;
  elapsedSeconds: number;
  maxSpeedOrCombo: number;
}

interface Orb2D {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  value: number;
  kind: 'alpha' | 'sharpe';
  pulsePhase: number;
}

interface Particle2D {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export const GameArenaView: React.FC = () => {
  const {
    activeGameMode,
    setActiveGameMode,
    gameStats,
    recordGameRun,
    setActiveTab,
  } = useApp();

  const [gameState, setGameState] = useState<GameLifecycleState>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') return 'playing';
    } catch {}
    return 'title';
  });

  const [muted, setMuted] = useState<boolean>(false);
  const [hudScore, setHudScore] = useState<number>(0);
  const [hudCombo, setHudCombo] = useState<number>(1);
  const [hudHp, setHudHp] = useState<number>(100);
  const [hudGhostHp, setHudGhostHp] = useState<number>(100);
  const [hudEnergy, setHudEnergy] = useState<number>(100);
  const [hudSpeedOrWave, setHudSpeedOrWave] = useState<number>(145);
  const [hudOrbs, setHudOrbs] = useState<number>(0);
  const [runSnapshot, setRunSnapshot] = useState<RunSnapshot | null>(null);

  // Refs for decoupled 60Hz simulation loop
  const gameStateRef = useRef<GameLifecycleState>(gameState);
  const gameModeRef = useRef<'2d' | '3d'>(activeGameMode);
  const mutedRef = useRef<boolean>(muted);
  const recordGameRunRef = useRef(recordGameRun);
  const highScore2DRef = useRef(gameStats.highScore2D);
  const highScore3DRef = useRef(gameStats.highScore3D);

  useEffect(() => {
    gameStateRef.current = gameState;
    document.body.dataset.state = gameState;
    return () => {
      delete document.body.dataset.state;
    };
  }, [gameState]);

  useEffect(() => {
    gameModeRef.current = activeGameMode;
  }, [activeGameMode]);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    recordGameRunRef.current = recordGameRun;
    highScore2DRef.current = gameStats.highScore2D;
    highScore3DRef.current = gameStats.highScore3D;
  }, [recordGameRun, gameStats.highScore2D, gameStats.highScore3D]);

  // Input state refs
  const keysHeldRef = useRef<Set<string>>(new Set());
  const justPressedRef = useRef<Set<string>>(new Set());
  const touchSteerRef = useRef<number>(0);
  const touchBoostRef = useRef<boolean>(false);
  const pointerTarget2DRef = useRef<{ active: boolean; x: number; y: number }>({
    active: false,
    x: 400,
    y: 260,
  });

  // Reset signal ref to re-initialize simulation cleanly without remounting WebGL
  const resetCounterRef = useRef<number>(0);

  // Web Audio procedural synth helper
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playSynthTone = useCallback(
    (type: 'pickup' | 'hit' | 'boost' | 'victory' | 'defeat') => {
      if (mutedRef.current) return;
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new Ctx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;
        const pitchJitter = 0.94 + Math.random() * 0.12;

        if (type === 'pickup') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(520 * pitchJitter, now);
          osc.frequency.exponentialRampToValueAtTime(880 * pitchJitter, now + 0.11);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.12);
        } else if (type === 'boost') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(220 * pitchJitter, now);
          osc.frequency.exponentialRampToValueAtTime(480 * pitchJitter, now + 0.18);
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.19);
        } else if (type === 'hit') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(55, now + 0.16);
          gain.gain.setValueAtTime(0.11, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.17);
        } else if (type === 'victory') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.setValueAtTime(554.37, now + 0.08);
          osc.frequency.setValueAtTime(659.25, now + 0.16);
          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.35);
        } else {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(240, now);
          osc.frequency.linearRampToValueAtTime(95, now + 0.3);
          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.32);
        }
      } catch {}
    },
    []
  );

  const startOrRestartGame = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    keysHeldRef.current.clear();
    justPressedRef.current.clear();
    touchSteerRef.current = 0;
    touchBoostRef.current = false;
    resetCounterRef.current += 1;
    setHudScore(0);
    setHudCombo(1);
    setHudHp(100);
    setHudGhostHp(100);
    setHudEnergy(100);
    setHudOrbs(0);
    setHudSpeedOrWave(gameModeRef.current === '3d' ? 148 : 1);
    setRunSnapshot(null);
    document.body.dataset.state = 'playing';
    setGameState('playing');
  }, []);

  const finishRunWithOutcome = useCallback(
    (
      outcome: 'victory' | 'defeat',
      score: number,
      orbs: number,
      wave: number,
      elapsed: number,
      maxMetric: number
    ) => {
      const mode = gameModeRef.current;
      const prevBest = mode === '3d' ? highScore3DRef.current : highScore2DRef.current;
      const bestScore = Math.max(prevBest, Math.round(score));

      setRunSnapshot({
        outcome,
        mode,
        score: Math.round(score),
        bestScore,
        orbsCollected: orbs,
        waveReached: wave,
        elapsedSeconds: Math.max(1, Math.round(elapsed)),
        maxSpeedOrCombo: Math.round(maxMetric),
      });

      playSynthTone(outcome === 'victory' ? 'victory' : 'defeat');
      recordGameRunRef.current(mode, score, orbs);
      document.body.dataset.state = 'gameover';
      setGameState('gameover');
    },
    [playSynthTone]
  );

  // Global keyboard input listeners (Start on Enter/Space, Pause on P/Escape, Restart on R, Mute on M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const code = e.code;
      if (!keysHeldRef.current.has(code)) {
        justPressedRef.current.add(code);
      }
      keysHeldRef.current.add(code);

      if (gameStateRef.current === 'title') {
        if (code === 'Enter' || code === 'Space') {
          e.preventDefault();
          startOrRestartGame();
        }
        return;
      }

      if (code === 'KeyP' || code === 'Escape') {
        e.preventDefault();
        if (gameStateRef.current === 'playing') {
          document.body.dataset.state = 'paused';
          setGameState('paused');
        } else if (gameStateRef.current === 'paused') {
          document.body.dataset.state = 'playing';
          setGameState('playing');
        }
      } else if (code === 'KeyR') {
        e.preventDefault();
        startOrRestartGame();
      } else if (code === 'KeyM') {
        e.preventDefault();
        setMuted(m => !m);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysHeldRef.current.delete(e.code);
    };

    const handleBlur = () => {
      keysHeldRef.current.clear();
      justPressedRef.current.clear();
      touchSteerRef.current = 0;
      touchBoostRef.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [startOrRestartGame]);

  // ============================================================================
  // 3D GAME ENGINE: AI ROADSTER — SOLAR QUANTUM HIGHWAY (Three.js WebGL)
  // ============================================================================
  const mount3DRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeGameMode !== '3d') return;
    const container = mount3DRef.current;
    if (!container) return;

    const isHeadless =
      navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);

    const width = Math.max(320, container.clientWidth || 1024);
    const height = Math.max(320, container.clientHeight || 640);

    const scene = new THREE.Scene();
    const horizonColor = new THREE.Color(0x090d1e);
    scene.background = horizonColor;
    scene.fog = new THREE.FogExp2(0x090d1e, 0.014);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 220);
    camera.position.set(0, 4.2, 9.5);
    camera.lookAt(0, 1.0, -12);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isHeadless,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true,
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Environment Reflection via RoomEnvironment
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch {}

    // Warm/Cool 3-Point Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.2);
    keyLight.position.set(14, 24, 16);
    if (!isHeadless) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf43f5e, 1.3);
    rimLight.position.set(-14, 10, -22);
    scene.add(rimLight);

    // Distant Solar Zenith Landmark Monolith & Horizon Sun Disc (fog: false so it glows on horizon)
    const sunSphere = new THREE.Mesh(
      new THREE.SphereGeometry(15, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xf97316, fog: false })
    );
    sunSphere.position.set(0, 19, -155);
    const sunHalo = new THREE.Mesh(
      new THREE.RingGeometry(15.5, 21, 32),
      new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
        fog: false,
      })
    );
    sunHalo.position.set(0, 19, -156);
    scene.add(sunSphere, sunHalo);

    const spireGroup = new THREE.Group();
    const mainSpire = new THREE.Mesh(
      new THREE.ConeGeometry(18, 42, 4),
      new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        emissive: 0x312e81,
        emissiveIntensity: 0.35,
        roughness: 0.4,
        metalness: 0.6,
      })
    );
    mainSpire.position.set(-34, 21, -120);
    const rightSpire = new THREE.Mesh(
      new THREE.ConeGeometry(15, 36, 4),
      new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        emissive: 0x312e81,
        emissiveIntensity: 0.35,
        roughness: 0.4,
        metalness: 0.6,
      })
    );
    rightSpire.position.set(36, 18, -125);
    spireGroup.add(mainSpire, rightSpire);
    scene.add(spireGroup);

    // Extended Ground Terrain & Highway Road (offset on Y to prevent Z-fighting)
    const terrainGeo = new THREE.PlaneGeometry(260, 260);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x060913,
      roughness: 0.9,
      metalness: 0.1,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.rotation.x = -Math.PI / 2;
    terrainMesh.position.y = -0.04;
    scene.add(terrainMesh);

    const roadGeo = new THREE.PlaneGeometry(15, 220);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.55,
      metalness: 0.35,
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.set(0, 0, -70);
    scene.add(roadMesh);

    // Glowing Highway Rails
    const railGeo = new THREE.BoxGeometry(0.28, 0.35, 220);
    const leftRailMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });
    const rightRailMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });
    const leftRail = new THREE.Mesh(railGeo, leftRailMat);
    leftRail.position.set(-7.5, 0.18, -70);
    const rightRail = new THREE.Mesh(railGeo, rightRailMat);
    rightRail.position.set(7.5, 0.18, -70);
    scene.add(leftRail, rightRail);

    // Instanced Roadside Solar Pylons (28 instances)
    const pylonCount = 28;
    const pylonGeo = new THREE.CylinderGeometry(0.18, 0.28, 4.5, 8);
    const pylonMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0369a1,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.7,
    });
    const pylonInstanced = new THREE.InstancedMesh(pylonGeo, pylonMat, pylonCount);
    const dummyMat = new THREE.Matrix4();
    const dummyPos = new THREE.Vector3();
    const pylonZOffsets = new Float32Array(pylonCount);
    for (let i = 0; i < pylonCount; i++) {
      const side = i % 2 === 0 ? -9.5 : 9.5;
      const z = -i * 6.5;
      pylonZOffsets[i] = z;
      dummyPos.set(side, 2.25, z);
      dummyMat.makeTranslation(dummyPos.x, dummyPos.y, dummyPos.z);
      pylonInstanced.setMatrixAt(i, dummyMat);
    }
    pylonInstanced.instanceMatrix.needsUpdate = true;
    pylonInstanced.computeBoundingSphere();
    scene.add(pylonInstanced);

    // Composite 9-Part 3D AI Roadster Hero Vehicle Group
    const roadsterGroup = new THREE.Group();

    // 1. Primary Silhouette: Sculpted Crimson Metallic Body Hull
    const bodyHull = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.52, 4.2),
      new THREE.MeshPhysicalMaterial({
        color: 0xe11d48,
        metalness: 0.82,
        roughness: 0.18,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      })
    );
    bodyHull.position.y = 0.52;
    roadsterGroup.add(bodyHull);

    // 2. Secondary Read: Aerodynamic Glass Canopy
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(1.55, 0.44, 2.1),
      new THREE.MeshPhysicalMaterial({
        color: 0x0f172a,
        metalness: 0.2,
        roughness: 0.08,
        clearcoat: 1.0,
      })
    );
    canopy.position.set(0, 0.92, -0.15);
    roadsterGroup.add(canopy);

    // 3. Carbon Front Splitter
    const splitter = new THREE.Mesh(
      new THREE.BoxGeometry(2.18, 0.14, 0.7),
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.65,
        metalness: 0.4,
      })
    );
    splitter.position.set(0, 0.28, -1.95);
    roadsterGroup.add(splitter);

    // 4. Rear Downforce Wing Spoiler
    const rearWing = new THREE.Mesh(
      new THREE.BoxGeometry(2.25, 0.1, 0.48),
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.35,
        metalness: 0.8,
      })
    );
    rearWing.position.set(0, 1.05, 1.85);
    roadsterGroup.add(rearWing);

    // 5. LED Tail Light Bar & Twin-Turbo Exhausts
    const tailLight = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 0.14, 0.1),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    tailLight.position.set(0, 0.62, 2.11);
    roadsterGroup.add(tailLight);

    // 6-9. Four Wheels with Brushed Metallic Rims
    const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.32, 16);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.8,
      metalness: 0.2,
    });
    const wheelPositions: [number, number, number][] = [
      [-1.08, 0.38, -1.32],
      [1.08, 0.38, -1.32],
      [-1.08, 0.38, 1.32],
      [1.08, 0.38, 1.32],
    ];
    wheelPositions.forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(wx, wy, wz);
      roadsterGroup.add(wheel);
    });

    // Soft Radial Contact Shadow Disc under Roadster (prevents floating appearance)
    const shadowDisc = new THREE.Mesh(
      new THREE.CircleGeometry(2.3, 24),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      })
    );
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.y = 0.02;
    roadsterGroup.add(shadowDisc);

    scene.add(roadsterGroup);

    // Highway Collectibles (Tensor Data Orbs) & Hazards (Latency Barriers + Rival Drones)
    interface HighwayEntity {
      group: THREE.Group;
      kind: 'orb' | 'barrier' | 'drone';
      x: number;
      z: number;
      vx: number;
      baseX: number;
      phase: number;
    }

    const entities: HighwayEntity[] = [];
    const orbGeo = new THREE.OctahedronGeometry(0.65, 0);
    const orbRingGeo = new THREE.TorusGeometry(0.85, 0.06, 8, 20);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.8,
    });

    const barrierHullGeo = new THREE.BoxGeometry(2.2, 1.15, 0.9);
    const barrierTopGeo = new THREE.BoxGeometry(2.3, 0.22, 1.0);
    const barrierMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xbe123c,
      emissiveIntensity: 0.5,
      roughness: 0.4,
      metalness: 0.5,
    });
    const barrierStripeMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.3,
      metalness: 0.6,
    });

    const spawnEntity = (index: number, zPos: number): HighwayEntity => {
      const group = new THREE.Group();
      const kind: HighwayEntity['kind'] =
        index % 3 === 0 ? 'orb' : index % 3 === 1 ? 'barrier' : 'drone';
      const lanes = [-4.6, -1.6, 1.6, 4.6];
      const laneX = lanes[index % lanes.length];

      if (kind === 'orb') {
        const core = new THREE.Mesh(orbGeo, orbMat);
        const ring = new THREE.Mesh(orbRingGeo, leftRailMat);
        core.position.y = 0.95;
        ring.position.y = 0.95;
        group.add(core, ring);
      } else {
        const base = new THREE.Mesh(barrierHullGeo, barrierMat);
        base.position.y = 0.58;
        const topBar = new THREE.Mesh(barrierTopGeo, barrierStripeMat);
        topBar.position.y = 1.2;
        group.add(base, topBar);
      }

      group.position.set(laneX, 0, zPos);
      scene.add(group);
      return {
        group,
        kind,
        x: laneX,
        z: zPos,
        vx: kind === 'drone' ? 3.2 : 0,
        baseX: laneX,
        phase: index * 1.3,
      };
    };

    for (let i = 0; i < 12; i++) {
      entities.push(spawnEntity(i, -18 - i * 14));
    }

    try {
      renderer.compile(scene, camera);
    } catch {}

    // Simulation state inside closure
    let roadsterState: RoadsterPhysicsState = {
      x: 0,
      vx: 0,
      speedMph: 148,
      distanceMeters: 0,
      nitroEnergy: 100,
      nitroActive: false,
      cameraFov: 60,
      tiltAngle: 0,
    };
    let score = 0;
    let combo = 1;
    let hp = 100;
    let ghostHp = 100;
    let orbs = 0;
    let elapsed = 0;
    let maxSpeedSeen = 148;
    let hitstopTimer = 0;
    let cameraTrauma = 0;
    let lastResetCount = resetCounterRef.current;
    let lastHudSync = 0;
    let lastFrameTime = performance.now();
    let rafId = 0;

    const resetSim = () => {
      roadsterState = {
        x: 0,
        vx: 0,
        speedMph: 148,
        distanceMeters: 0,
        nitroEnergy: 100,
        nitroActive: false,
        cameraFov: 60,
        tiltAngle: 0,
      };
      score = 0;
      combo = 1;
      hp = 100;
      ghostHp = 100;
      orbs = 0;
      elapsed = 0;
      maxSpeedSeen = 148;
      hitstopTimer = 0;
      cameraTrauma = 0;
      entities.forEach((ent, idx) => {
        const lanes = [-4.6, -1.6, 1.6, 4.6];
        ent.x = lanes[idx % lanes.length];
        ent.baseX = ent.x;
        ent.z = -22 - idx * 14;
        ent.group.position.set(ent.x, 0, ent.z);
      });
    };

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      const rawDt = (now - lastFrameTime) / 1000;
      lastFrameTime = now;
      const dt = clampSimDt(rawDt);

      if (lastResetCount !== resetCounterRef.current) {
        lastResetCount = resetCounterRef.current;
        resetSim();
      }

      const currentLifecycle = gameStateRef.current;

      if (currentLifecycle === 'title') {
        // Smooth live world camera tour around the 3D AI Roadster
        elapsed += dt;
        roadsterGroup.position.set(0, 0, 0);
        roadsterGroup.rotation.set(0, Math.sin(elapsed * 0.5) * 0.18, 0);
        camera.position.set(Math.sin(elapsed * 0.45) * 3.8, 3.6, 8.2);
        camera.lookAt(0, 0.9, -6);
        renderer.render(scene, camera);
        return;
      }

      if (currentLifecycle !== 'playing') {
        renderer.render(scene, camera);
        return;
      }

      // Decay camera trauma & hitstop in real dt
      cameraTrauma = Math.max(0, cameraTrauma - dt * 1.8);
      if (ghostHp > hp) {
        ghostHp = Math.max(hp, ghostHp - 28 * dt);
      }

      if (hitstopTimer > 0) {
        hitstopTimer -= dt;
        renderer.render(scene, camera);
        return;
      }

      elapsed += dt;

      // Read controls
      const held = keysHeldRef.current;
      let steer = touchSteerRef.current;
      if (held.has('ArrowLeft') || held.has('KeyA')) steer -= 1;
      if (held.has('ArrowRight') || held.has('KeyD')) steer += 1;
      steer = Math.max(-1, Math.min(1, steer));

      let throttle = 0;
      if (held.has('ArrowUp') || held.has('KeyW')) throttle += 1;
      if (held.has('ArrowDown') || held.has('KeyS')) throttle -= 1;

      const nitro =
        touchBoostRef.current ||
        held.has('Space') ||
        held.has('ShiftLeft') ||
        held.has('ShiftRight');

      roadsterState = step3DRoadsterPhysics(
        roadsterState,
        { steer, throttle, nitro },
        dt
      );
      if (roadsterState.speedMph > maxSpeedSeen) {
        maxSpeedSeen = roadsterState.speedMph;
      }

      roadsterGroup.position.set(roadsterState.x, 0, 0);
      roadsterGroup.rotation.z = roadsterState.tiltAngle;
      roadsterGroup.rotation.y = -steer * 0.08;

      // Passive distance score
      score += roadsterState.speedMph * dt * 0.22;

      const forwardStep = roadsterState.speedMph * 0.22 * dt;

      // Move instanced pylons
      for (let i = 0; i < pylonCount; i++) {
        let z = pylonZOffsets[i] + forwardStep;
        if (z > 10) z -= pylonCount * 6.5;
        pylonZOffsets[i] = z;
        const side = i % 2 === 0 ? -9.5 : 9.5;
        dummyMat.makeTranslation(side, 2.25, z);
        pylonInstanced.setMatrixAt(i, dummyMat);
      }
      pylonInstanced.instanceMatrix.needsUpdate = true;

      // Move highway entities & check collisions
      for (let i = 0; i < entities.length; i++) {
        const ent = entities[i];
        ent.z += forwardStep;

        if (ent.kind === 'orb') {
          ent.group.rotation.y += dt * 2.6;
        } else if (ent.kind === 'drone') {
          ent.x = Math.max(
            -5.6,
            Math.min(5.6, ent.baseX + Math.sin(elapsed * 2.2 + ent.phase) * 2.4)
          );
        }

        ent.group.position.set(ent.x, 0, ent.z);

        if (checkRoadsterCollision3D(roadsterState.x, 0, ent.x, ent.z, 1.35, 1.85)) {
          if (ent.kind === 'orb') {
            const res = calculateArcadeScore(score, 120, combo, roadsterState.nitroActive);
            score = res.nextScore;
            combo = res.nextCombo;
            orbs += 1;
            roadsterState.nitroEnergy = Math.min(100, roadsterState.nitroEnergy + 18);
            playSynthTone('pickup');
          } else {
            hp = Math.max(0, hp - 25);
            combo = 1;
            hitstopTimer = 0.05;
            cameraTrauma = 0.65;
            playSynthTone('hit');
          }
          // Respawn entity far ahead
          const lanes = [-4.6, -1.6, 1.6, 4.6];
          ent.baseX = lanes[Math.floor((elapsed * 10 + i) % lanes.length)];
          ent.x = ent.baseX;
          ent.z = -165 - (i % 4) * 8;
          ent.group.position.set(ent.x, 0, ent.z);
        } else if (ent.z > 12) {
          const lanes = [-4.6, -1.6, 1.6, 4.6];
          ent.baseX = lanes[(i + Math.floor(elapsed)) % lanes.length];
          ent.x = ent.baseX;
          ent.z = -160;
          ent.group.position.set(ent.x, 0, ent.z);
        }
      }

      // Smooth damped chase camera with trauma shake
      const shake = cameraTrauma * cameraTrauma;
      const shakeX = (Math.random() - 0.5) * shake * 0.6;
      const shakeY = (Math.random() - 0.5) * shake * 0.4;
      camera.fov = roadsterState.cameraFov;
      camera.updateProjectionMatrix();
      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        roadsterState.x * 0.55 + shakeX,
        6,
        dt
      );
      camera.position.y = THREE.MathUtils.damp(camera.position.y, 4.1 + shakeY, 6, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, 9.2, 6, dt);
      camera.lookAt(roadsterState.x * 0.35, 1.0, -14);

      renderer.render(scene, camera);

      // Check defeat or victory conditions
      if (hp <= 0) {
        finishRunWithOutcome(
          'defeat',
          score,
          orbs,
          Math.max(1, Math.floor(roadsterState.distanceMeters / 250) + 1),
          elapsed,
          maxSpeedSeen
        );
        return;
      }
      if (score >= 2400) {
        finishRunWithOutcome(
          'victory',
          score,
          orbs,
          Math.max(1, Math.floor(roadsterState.distanceMeters / 250) + 1),
          elapsed,
          maxSpeedSeen
        );
        return;
      }

      // Throttled HUD state sync (~10Hz)
      if (now - lastHudSync > 95) {
        lastHudSync = now;
        setHudScore(Math.round(score));
        setHudCombo(combo);
        setHudHp(Math.round(hp));
        setHudGhostHp(Math.round(ghostHp));
        setHudEnergy(Math.round(roadsterState.nitroEnergy));
        setHudSpeedOrWave(Math.round(roadsterState.speedMph));
        setHudOrbs(orbs);
      }
    };

    rafId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = Math.max(320, container.clientWidth);
      const h = Math.max(320, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeGameMode, finishRunWithOutcome, playSynthTone]);

  // ============================================================================
  // 2D GAME ENGINE: QUANT ALPHA COLLIDER (HTML5 Canvas2D Physics)
  // ============================================================================
  const canvas2DRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (activeGameMode !== '2d') return;
    const canvas = canvas2DRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = Math.max(360, canvas.parentElement?.clientWidth || 960);
    let height = Math.max(360, canvas.parentElement?.clientHeight || 580);
    canvas.width = width;
    canvas.height = height;

    let player: Body2D = {
      x: width * 0.5,
      y: height * 0.5,
      vx: 0,
      vy: 0,
      radius: 18,
      mass: 1.2,
    };
    let scaleX = 1;
    let scaleY = 1;
    let pulseWaveRadius = 0;
    let pulseCooldown = 0;

    let orbs: Orb2D[] = [];
    let hazards: HazardEntity2D[] = [];
    const particlePool: Particle2D[] = Array.from({ length: 48 }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 0.4,
      color: '#38bdf8',
      size: 3,
    }));

    const spawnParticles = (x: number, y: number, color: string, count: number) => {
      let spawned = 0;
      for (let i = 0; i < particlePool.length && spawned < count; i++) {
        if (!particlePool[i].active) {
          const angle = (Math.PI * 2 * spawned) / count + Math.random() * 0.3;
          const speed = 70 + Math.random() * 160;
          particlePool[i] = {
            active: true,
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0.35 + Math.random() * 0.2,
            maxLife: 0.55,
            color,
            size: 2.5 + Math.random() * 2.5,
          };
          spawned++;
        }
      }
    };

    const init2DArena = () => {
      player = {
        x: width * 0.5,
        y: height * 0.5,
        vx: 0,
        vy: 0,
        radius: 18,
        mass: 1.2,
      };
      scaleX = 1;
      scaleY = 1;
      pulseWaveRadius = 0;
      pulseCooldown = 0;

      orbs = Array.from({ length: 7 }, (_, i) => ({
        id: `orb-${i}`,
        x: 90 + ((i * 135) % Math.max(200, width - 180)),
        y: 90 + ((i * 95) % Math.max(160, height - 180)),
        vx: (i % 2 === 0 ? 1 : -1) * 45,
        vy: (i % 3 === 0 ? 1 : -1) * 35,
        radius: i % 4 === 0 ? 14 : 11,
        value: i % 4 === 0 ? 220 : 110,
        kind: i % 4 === 0 ? 'sharpe' : 'alpha',
        pulsePhase: i * 0.8,
      }));

      const policies: ('chaser' | 'orbiter' | 'charger')[] = [
        'chaser',
        'orbiter',
        'charger',
        'chaser',
      ];
      hazards = policies.map((pol, idx) => ({
        id: `haz-${idx}`,
        x: idx % 2 === 0 ? 90 : width - 90,
        y: idx < 2 ? 90 : height - 90,
        vx: 0,
        vy: 0,
        radius: 16,
        mass: 1.1,
        policy: pol,
        phaseTimer: 1.2 + idx * 0.4,
        chargeState: 'seek',
        aimDirX: 1,
        aimDirY: 0,
        hitFlash: 0,
      }));
    };

    init2DArena();

    let score = 0;
    let combo = 1;
    let hp = 100;
    let ghostHp = 100;
    let orbsCount = 0;
    let wave = 1;
    let elapsed = 0;
    let maxComboSeen = 1;
    let hitstopTimer = 0;
    let shakeTrauma = 0;
    let lastResetCount = resetCounterRef.current;
    let lastHudSync = 0;
    let lastFrameTime = performance.now();
    let rafId = 0;

    const resetSim2D = () => {
      init2DArena();
      score = 0;
      combo = 1;
      hp = 100;
      ghostHp = 100;
      orbsCount = 0;
      wave = 1;
      elapsed = 0;
      maxComboSeen = 1;
      hitstopTimer = 0;
      shakeTrauma = 0;
    };

    const render2D = (now: number) => {
      rafId = requestAnimationFrame(render2D);
      const rawDt = (now - lastFrameTime) / 1000;
      lastFrameTime = now;
      const dt = clampSimDt(rawDt);

      if (lastResetCount !== resetCounterRef.current) {
        lastResetCount = resetCounterRef.current;
        resetSim2D();
      }

      const currentLifecycle = gameStateRef.current;

      // Update squash-and-stretch damping & trauma in real dt
      scaleX += (1 - scaleX) * (1 - Math.exp(-10 * dt));
      scaleY += (1 - scaleY) * (1 - Math.exp(-10 * dt));
      shakeTrauma = Math.max(0, shakeTrauma - dt * 2.2);
      if (ghostHp > hp) {
        ghostHp = Math.max(hp, ghostHp - 26 * dt);
      }

      if (currentLifecycle === 'playing' && hitstopTimer <= 0) {
        elapsed += dt;
        pulseCooldown = Math.max(0, pulseCooldown - dt);
        if (pulseWaveRadius > 0) {
          pulseWaveRadius += 460 * dt;
          if (pulseWaveRadius > 210) pulseWaveRadius = 0;
        }

        const held = keysHeldRef.current;
        let moveX = touchSteerRef.current;
        let moveY = 0;
        if (held.has('ArrowLeft') || held.has('KeyA')) moveX -= 1;
        if (held.has('ArrowRight') || held.has('KeyD')) moveX += 1;
        if (held.has('ArrowUp') || held.has('KeyW')) moveY -= 1;
        if (held.has('ArrowDown') || held.has('KeyS')) moveY += 1;

        if (pointerTarget2DRef.current.active) {
          const pdx = pointerTarget2DRef.current.x - player.x;
          const pdy = pointerTarget2DRef.current.y - player.y;
          const pdist = Math.hypot(pdx, pdy);
          if (pdist > 12) {
            moveX = pdx / pdist;
            moveY = pdy / pdist;
          }
        }

        // Edge-triggered Shockwave Pulse on Space or Touch Boost
        const wantsPulse =
          justPressedRef.current.has('Space') ||
          (touchBoostRef.current && pulseCooldown <= 0);
        justPressedRef.current.delete('Space');

        if (wantsPulse && pulseCooldown <= 0) {
          pulseCooldown = 1.1;
          pulseWaveRadius = 18;
          scaleX = 1.28;
          scaleY = 0.76;
          hazards = applyShockwavePulse2D(player.x, player.y, 195, 440, hazards);
          spawnParticles(player.x, player.y, '#38bdf8', 16);
          playSynthTone('boost');
        }

        player = step2DPhysicsBody(
          player,
          { moveX, moveY, boost: pulseWaveRadius > 0 },
          { width, height, padding: 24 },
          dt
        );

        // Step collectibles & check collection
        for (let i = 0; i < orbs.length; i++) {
          const o = orbs[i];
          o.pulsePhase += dt * 3;
          o.x += o.vx * dt;
          o.y += o.vy * dt;
          if (o.x < 28 || o.x > width - 28) o.vx *= -1;
          if (o.y < 28 || o.y > height - 28) o.vy *= -1;

          // Subtle magnet pull when player is close
          const dx = player.x - o.x;
          const dy = player.y - o.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130 && dist > 1) {
            o.x += (dx / dist) * 120 * dt;
            o.y += (dy / dist) * 120 * dt;
          }

          if (checkCircleCollision2D(player, o).collided) {
            const scored = calculateArcadeScore(
              score,
              o.value,
              combo,
              pulseWaveRadius > 0
            );
            score = scored.nextScore;
            combo = scored.nextCombo;
            if (combo > maxComboSeen) maxComboSeen = combo;
            orbsCount += 1;
            wave = Math.max(1, Math.floor(orbsCount / 5) + 1);
            scaleX = 0.86;
            scaleY = 1.16;
            spawnParticles(o.x, o.y, o.kind === 'sharpe' ? '#fbbf24' : '#10b981', 10);
            playSynthTone('pickup');

            // Respawn orb at safe distance
            o.x = 60 + ((o.x + 230) % Math.max(160, width - 120));
            o.y = 60 + ((o.y + 170) % Math.max(140, height - 120));
          }
        }

        // Step hazards using the 3 distinct enemy policies + elastic collisions
        const knobs = calculateDifficultyKnobs(elapsed, wave);
        for (let i = 0; i < hazards.length; i++) {
          hazards[i] = stepEnemyPolicy2D(
            hazards[i],
            player.x,
            player.y,
            { width, height },
            dt,
            knobs.speedMultiplier
          );

          // Elastic hazard-hazard collisions
          for (let j = i + 1; j < hazards.length; j++) {
            const pair = resolveElasticCollision2D(hazards[i], hazards[j], 0.85);
            hazards[i] = { ...hazards[i], ...pair.a };
            hazards[j] = { ...hazards[j], ...pair.b };
          }

          // Player-hazard collision
          const hit = checkCircleCollision2D(player, hazards[i]);
          if (hit.collided) {
            const resolved = resolveElasticCollision2D(player, hazards[i], 0.95);
            player = resolved.a;
            hazards[i] = { ...hazards[i], ...resolved.b, hitFlash: 0.16 };
            hp = Math.max(0, hp - 20);
            combo = 1;
            hitstopTimer = 0.05;
            shakeTrauma = 0.7;
            spawnParticles(player.x, player.y, '#f43f5e', 18);
            playSynthTone('hit');
          }
        }

        if (hp <= 0) {
          finishRunWithOutcome('defeat', score, orbsCount, wave, elapsed, maxComboSeen);
          return;
        }
        if (score >= 2000) {
          finishRunWithOutcome('victory', score, orbsCount, wave, elapsed, maxComboSeen);
          return;
        }
      } else if (hitstopTimer > 0) {
        hitstopTimer -= dt;
      } else if (currentLifecycle === 'title') {
        elapsed += dt;
      }

      // Update pooled particles
      for (let i = 0; i < particlePool.length; i++) {
        const p = particlePool[i];
        if (!p.active) continue;
        p.life -= dt;
        if (p.life <= 0) {
          p.active = false;
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }

      // Draw 2D Arena
      ctx.save();
      const shakeOffset = shakeTrauma * shakeTrauma * 8;
      if (shakeOffset > 0.1) {
        ctx.translate(
          (Math.random() - 0.5) * shakeOffset,
          (Math.random() - 0.5) * shakeOffset
        );
      }

      ctx.fillStyle = '#070b17';
      ctx.fillRect(0, 0, width, height);

      // Subtle Quant Grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      const gridStep = 48;
      for (let gx = 0; gx < width; gx += gridStep) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Shockwave Pulse Ring
      if (pulseWaveRadius > 0) {
        ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0, 1 - pulseWaveRadius / 210)})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(player.x, player.y, pulseWaveRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Orbs
      for (let i = 0; i < orbs.length; i++) {
        const o = orbs[i];
        const r = o.radius + Math.sin(o.pulsePhase) * 1.5;
        ctx.fillStyle = o.kind === 'sharpe' ? '#fbbf24' : '#10b981';
        ctx.beginPath();
        ctx.arc(o.x, o.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw Hazards & Charger Telegraph Sightlines
      for (let i = 0; i < hazards.length; i++) {
        const h = hazards[i];
        if (h.policy === 'charger' && h.chargeState === 'telegraph') {
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
          ctx.setLineDash([6, 6]);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(h.x, h.y);
          ctx.lineTo(h.x + h.aimDirX * 260, h.y + h.aimDirY * 260);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        ctx.fillStyle =
          h.hitFlash > 0
            ? '#ffffff'
            : h.policy === 'chaser'
            ? '#f43f5e'
            : h.policy === 'orbiter'
            ? '#a855f7'
            : '#f59e0b';
        ctx.beginPath();
        ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.45)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw Pooled Particles
      for (let i = 0; i < particlePool.length; i++) {
        const p = particlePool[i];
        if (!p.active) continue;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Player Neural Core Vessel with squash & stretch
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.scale(scaleX, scaleY);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#e0f2fe';
      ctx.stroke();
      ctx.restore();

      ctx.restore();

      if (now - lastHudSync > 95) {
        lastHudSync = now;
        const pctReady = Math.round((1 - pulseCooldown / 1.1) * 100);
        setHudScore(Math.round(score));
        setHudCombo(combo);
        setHudHp(Math.round(hp));
        setHudGhostHp(Math.round(ghostHp));
        setHudEnergy(Math.max(0, Math.min(100, pctReady)));
        setHudSpeedOrWave(wave);
        setHudOrbs(orbsCount);
      }
    };

    rafId = requestAnimationFrame(render2D);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = Math.max(360, canvas.parentElement.clientWidth);
      height = Math.max(360, canvas.parentElement.clientHeight);
      canvas.width = width;
      canvas.height = height;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, [activeGameMode, finishRunWithOutcome, playSynthTone]);

  const bestScoreForActiveMode =
    activeGameMode === '3d' ? gameStats.highScore3D : gameStats.highScore2D;

  // Discrete 3-socket vitality calculation
  const vitalityPips = [0, 1, 2].map(idx => {
    const threshold = (idx + 1) * 33;
    if (hudHp >= threshold) return 'full';
    if (hudHp >= threshold - 20) return 'cracked';
    return 'empty';
  });

  return (
    <div
      className="relative flex-1 w-full h-[calc(100vh-4rem)] min-h-[560px] bg-[#070b17] overflow-hidden select-none"
      data-testid="game-arena-view"
    >
      {/* Isolated Canvas Mounts with Distinct Keys (Zero backdrop-filter over active canvas) */}
      {activeGameMode === '3d' ? (
        <div
          key="arena-3d-mount"
          ref={mount3DRef}
          data-testid="game-3d-canvas-container"
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <div
          key="arena-2d-mount"
          data-testid="game-2d-canvas-container"
          className="absolute inset-0 w-full h-full"
        >
          <canvas
            ref={canvas2DRef}
            data-testid="game-2d-canvas"
            onPointerDown={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              pointerTarget2DRef.current = {
                active: true,
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              };
            }}
            onPointerMove={e => {
              if (!pointerTarget2DRef.current.active) return;
              const rect = e.currentTarget.getBoundingClientRect();
              pointerTarget2DRef.current.x = e.clientX - rect.left;
              pointerTarget2DRef.current.y = e.clientY - rect.top;
            }}
            onPointerUp={() => {
              pointerTarget2DRef.current.active = false;
            }}
            className="w-full h-full block cursor-crosshair"
          />
        </div>
      )}

      {/* ==================================================================== */}
      {/* PLAYING HUD OVERLAY (Pointer-events-none wrapper, >=85% clear space) */}
      {/* ==================================================================== */}
      {gameState !== 'title' && (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 z-20">
          {/* Top Perimeter Clusters */}
          <div className="flex items-start justify-between gap-4">
            {/* Top-Left Cluster: Vitality Sockets + Mode Switcher + Score */}
            <div className="pointer-events-auto flex flex-wrap items-center gap-3 bg-[#090d1e]/90 border border-cyan-500/30 rounded-2xl px-4 py-2.5 shadow-xl">
              {/* 3 Discrete SVG Vitality Sockets */}
              <div className="flex items-center gap-1.5" aria-label={`Hull Integrity ${hudHp}%`}>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mr-1">
                  HP
                </span>
                {vitalityPips.map((state, idx) => (
                  <svg
                    key={idx}
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                    aria-hidden="true"
                  >
                    <polygon
                      points="12,2 21,7 21,17 12,22 3,17 3,7"
                      fill={
                        state === 'full'
                          ? '#10b981'
                          : state === 'cracked'
                          ? '#f59e0b'
                          : '#1e293b'
                      }
                      stroke="#e2e8f0"
                      strokeWidth="1.8"
                    />
                  </svg>
                ))}
              </div>

              {/* Continuous HP Bar with Trailing Ghost Drain Bar */}
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden relative">
                <div
                  className="absolute inset-y-0 left-0 bg-amber-400/60 transition-all duration-150"
                  style={{ width: `${hudGhostHp}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 bg-emerald-400 transition-all duration-75"
                  style={{ width: `${hudHp}%` }}
                />
              </div>

              <div className="h-5 w-px bg-white/10" />

              {/* Score & Combo Readout (Tabular Numerals) */}
              <div className="flex items-baseline gap-3 font-mono tabular-nums">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">SCORE</span>
                  <span
                    className="text-lg font-black text-white"
                    data-testid="hud-score-value"
                  >
                    {hudScore}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">COMBO</span>
                  <span className="text-sm font-bold text-cyan-400">{hudCombo}x</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">
                    {activeGameMode === '3d' ? 'SPEED' : 'WAVE'}
                  </span>
                  <span className="text-sm font-bold text-amber-400">
                    {activeGameMode === '3d' ? `${hudSpeedOrWave} MPH` : `W${hudSpeedOrWave}`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">BEST</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {Math.max(bestScoreForActiveMode, hudScore)}
                  </span>
                </div>
              </div>
            </div>

            {/* Top-Right Cluster: Mode Toggle + Utility Icon Controls [M], [P], [R] */}
            <div className="pointer-events-auto flex items-center gap-2 bg-[#090d1e]/90 border border-white/15 rounded-2xl p-1.5 shadow-xl">
              <button
                type="button"
                tabIndex={-1}
                onClick={e => {
                  e.currentTarget.blur();
                  setActiveGameMode(activeGameMode === '3d' ? '2d' : '3d');
                  startOrRestartGame();
                }}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold font-mono cursor-pointer whitespace-nowrap shrink-0"
              >
                Switch to {activeGameMode === '3d' ? '2D Physics' : '3D Roadster'}
              </button>

              <button
                type="button"
                tabIndex={-1}
                onClick={e => {
                  e.currentTarget.blur();
                  finishRunWithOutcome(
                    'victory',
                    Math.max(1500, hudScore + 650),
                    Math.max(6, hudOrbs + 4),
                    hudSpeedOrWave,
                    25,
                    hudSpeedOrWave
                  );
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
              >
                Bank Run & Claim XP
              </button>

              <button
                type="button"
                tabIndex={-1}
                aria-label="Mute audio [M]"
                onClick={e => {
                  e.currentTarget.blur();
                  setMuted(m => !m);
                }}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 flex items-center justify-center text-xs font-mono font-bold cursor-pointer"
              >
                {muted ? '🔇' : 'M'}
              </button>

              <button
                type="button"
                tabIndex={-1}
                aria-label="Pause game [P]"
                onClick={e => {
                  e.currentTarget.blur();
                  const next = gameState === 'paused' ? 'playing' : 'paused';
                  document.body.dataset.state = next;
                  setGameState(next);
                }}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 flex items-center justify-center text-xs font-mono font-bold cursor-pointer"
              >
                P
              </button>

              <button
                type="button"
                tabIndex={-1}
                aria-label="Restart game [R]"
                onClick={e => {
                  e.currentTarget.blur();
                  startOrRestartGame();
                }}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 flex items-center justify-center text-xs font-mono font-bold cursor-pointer"
              >
                R
              </button>
            </div>
          </div>

          {/* Bottom Responsive Touch & Control Bar */}
          <div className="flex items-end justify-between gap-4">
            <div className="pointer-events-auto flex items-center gap-2 bg-[#090d1e]/90 border border-white/15 rounded-2xl p-2 shadow-xl">
              <button
                type="button"
                onPointerDown={() => {
                  touchSteerRef.current = -1;
                }}
                onPointerUp={() => {
                  touchSteerRef.current = 0;
                }}
                onPointerLeave={() => {
                  touchSteerRef.current = 0;
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer active:scale-95 transition whitespace-nowrap shrink-0"
              >
                ◀ Steer Left [A]
              </button>
              <button
                type="button"
                onPointerDown={() => {
                  touchBoostRef.current = true;
                  justPressedRef.current.add('Space');
                }}
                onPointerUp={() => {
                  touchBoostRef.current = false;
                }}
                onPointerLeave={() => {
                  touchBoostRef.current = false;
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black cursor-pointer active:scale-95 transition whitespace-nowrap shrink-0"
              >
                {activeGameMode === '3d'
                  ? `⚡ Nitro Boost [Space] (${hudEnergy}%)`
                  : `⚡ Shockwave Pulse [Space] (${hudEnergy}%)`}
              </button>
              <button
                type="button"
                onPointerDown={() => {
                  touchSteerRef.current = 1;
                }}
                onPointerUp={() => {
                  touchSteerRef.current = 0;
                }}
                onPointerLeave={() => {
                  touchSteerRef.current = 0;
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer active:scale-95 transition whitespace-nowrap shrink-0"
              >
                Steer Right [D] ▶
              </button>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className="pointer-events-auto px-3.5 py-2 rounded-xl bg-[#090d1e]/90 border border-white/15 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
            >
              View Profile Badges
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TITLE SCREEN OVERLAY (30-40% negative space, custom SVG emblem)      */}
      {/* ==================================================================== */}
      {gameState === 'title' && (
        <div
          className="absolute inset-0 z-30 flex flex-col justify-between p-6 sm:p-10 bg-gradient-to-r from-[#060916]/95 via-[#060916]/75 to-transparent"
          data-testid="game-title-screen"
        >
          {/* Top Mode Selector & Profile Back Link */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-[#0d1326] border border-white/15 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveGameMode('3d')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                  activeGameMode === '3d'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                3D Game · AI Roadster Highway
              </button>
              <button
                type="button"
                onClick={() => setActiveGameMode('2d')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                  activeGameMode === '2d'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                2D Game · Quant Alpha Collider
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  showToast('Synced 2D & 3D AI Game Arena with @wix Studio Custom Element (<europa-game-arena />)!');
                  setActiveTab('profile');
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 text-xs font-mono font-bold cursor-pointer whitespace-nowrap shrink-0"
              >
                @wix Studio · ALLOWED
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className="px-4 py-2 rounded-xl bg-[#0d1326] border border-white/15 text-slate-200 hover:text-cyan-400 text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
              >
                Badges & High Scores ({gameStats.gamesPlayed} Runs)
              </button>
            </div>
          </div>

          {/* Left-Third Asymmetric Title Lockup with Custom Inline SVG Emblem */}
          <div className="max-w-lg space-y-6 my-auto">
            <svg
              viewBox="0 0 380 84"
              className="w-full max-w-[360px] h-auto"
              role="img"
              aria-label="Europa AI Arcade Emblem"
            >
              <polygon
                points="28,10 52,24 52,54 28,68 4,54 4,24"
                fill={activeGameMode === '3d' ? '#e11d48' : '#0284c7'}
                stroke="#f8fafc"
                strokeWidth="2.5"
              />
              <polygon
                points="28,22 42,30 42,48 28,56 14,48 14,30"
                fill="#090d1e"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <text
                x="68"
                y="34"
                fill="#38bdf8"
                fontFamily="monospace"
                fontSize="12"
                fontWeight="700"
                letterSpacing="3"
              >
                {activeGameMode === '3d'
                  ? '3D WEBGL · SOLAR TELEMETRY'
                  : '2D PHYSICS · ELASTIC COLLIDER'}
              </text>
              <text
                x="68"
                y="64"
                fill="#ffffff"
                fontFamily="sans-serif"
                fontSize="26"
                fontWeight="900"
                letterSpacing="0.5"
              >
                {activeGameMode === '3d'
                  ? 'AI ROADSTER GT'
                  : 'ALPHA COLLIDER 2D'}
              </text>
            </svg>

            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              {activeGameMode === '3d'
                ? 'Pilot the 9-part Autonomous AI Roadster across the Solar Quantum Highway. Collect Tensor Data Orbs, trigger Nitro Boost, and evade autonomous interceptor drones.'
                : 'Command the Neural Core Vessel in a 2D elastic physics arena. Harvest Alpha & Sharpe orbs, unleash radial shockwave pulses, and outmaneuver telegraphed Flash-Crash chargers.'}
            </p>

            {/* Live High Score & XP Telemetry Row */}
            <div className="flex items-center gap-6 text-xs font-mono text-slate-300 tabular-nums">
              <div>
                <span className="text-slate-400 block">3D HIGH SCORE</span>
                <strong className="text-base text-rose-400">
                  {gameStats.highScore3D.toLocaleString()} PTS
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">2D HIGH SCORE</span>
                <strong className="text-base text-cyan-400">
                  {gameStats.highScore2D.toLocaleString()} PTS
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">GAME XP EARNED</span>
                <strong className="text-base text-emerald-400">
                  +{gameStats.totalGameXpEarned.toLocaleString()} XP
                </strong>
              </div>
            </div>

            {/* Primary Start Action (<= 3 menu actions total, data-start="true") */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                data-start="true"
                onClick={startOrRestartGame}
                className="px-7 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm tracking-wide cursor-pointer shadow-lg transition active:scale-95 whitespace-nowrap shrink-0"
              >
                {activeGameMode === '3d' ? 'Start 3D Roadster Game' : 'Start 2D Physics Game'}
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveGameMode(activeGameMode === '3d' ? '2d' : '3d')
                }
                className="px-5 py-3.5 rounded-2xl bg-[#0d1326] hover:bg-slate-800 text-white border border-white/15 font-bold text-xs cursor-pointer transition whitespace-nowrap shrink-0"
              >
                Switch to {activeGameMode === '3d' ? '2D Mode' : '3D Mode'}
              </button>
            </div>
          </div>

          {/* Flat Single-Line Control Hint in Bottom Safe Margin */}
          <div className="text-xs font-mono text-slate-400">
            WASD / Arrows Move &amp; Steer · Space {activeGameMode === '3d' ? 'Nitro Boost' : 'Shockwave Pulse'} · P Pause · R Restart · Enter Start
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* PAUSED & GAMEOVER OUTCOME MODALS (Single Focused Card)               */}
      {/* ==================================================================== */}
      {gameState === 'paused' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Game Paused"
          className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/75"
        >
          <div className="bg-[#0b1124] border border-cyan-500/40 rounded-3xl max-w-md w-full p-6 text-center space-y-5 text-white shadow-2xl">
            <h2 className="text-xl font-black tracking-tight">Simulation Paused</h2>
            <div className="grid grid-cols-3 gap-2 font-mono tabular-nums text-xs">
              <div className="bg-white/5 rounded-2xl p-3">
                <span className="text-slate-400 block">SCORE</span>
                <strong className="text-base text-white">{hudScore}</strong>
              </div>
              <div className="bg-white/5 rounded-2xl p-3">
                <span className="text-slate-400 block">COMBO</span>
                <strong className="text-base text-cyan-400">{hudCombo}x</strong>
              </div>
              <div className="bg-white/5 rounded-2xl p-3">
                <span className="text-slate-400 block">ORBS</span>
                <strong className="text-base text-emerald-400">{hudOrbs}</strong>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  document.body.dataset.state = 'playing';
                  setGameState('playing');
                }}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs cursor-pointer whitespace-nowrap shrink-0"
              >
                Resume [P]
              </button>
              <button
                type="button"
                onClick={startOrRestartGame}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer whitespace-nowrap shrink-0"
              >
                Restart [R]
              </button>
              <button
                type="button"
                onClick={() => {
                  document.body.dataset.state = 'title';
                  setGameState('title');
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs cursor-pointer whitespace-nowrap shrink-0"
              >
                Title Screen
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'gameover' && runSnapshot && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Run Complete Summary"
          data-testid="game-over-modal"
          className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/80"
        >
          <div className="bg-[#0b1124] border border-cyan-500/50 rounded-3xl max-w-md w-full p-7 text-center space-y-5 text-white shadow-2xl">
            <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              {runSnapshot.outcome === 'victory'
                ? 'TELEMETRY TARGET CLEARED · XP BANKED'
                : 'HULL INTEGRITY DEPLETED · RUN LOGGED'}
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              {runSnapshot.outcome === 'victory'
                ? 'Simulation Run Mastered!'
                : 'Simulation Run Complete'}
            </h2>

            <div className="grid grid-cols-3 gap-2.5 font-mono tabular-nums text-xs">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                <span className="text-slate-400 block">FINAL SCORE</span>
                <strong className="text-base text-white">{runSnapshot.score}</strong>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                <span className="text-slate-400 block">BEST SCORE</span>
                <strong className="text-base text-emerald-400">
                  {runSnapshot.bestScore}
                </strong>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                <span className="text-slate-400 block">ORBS / WAVE</span>
                <strong className="text-base text-cyan-400">
                  {runSnapshot.orbsCollected} · W{runSnapshot.waveReached}
                </strong>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                data-start="true"
                onClick={startOrRestartGame}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs cursor-pointer whitespace-nowrap shrink-0"
              >
                Play Again
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveGameMode(activeGameMode === '3d' ? '2d' : '3d');
                  startOrRestartGame();
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer whitespace-nowrap shrink-0"
              >
                Try {activeGameMode === '3d' ? '2D Physics Game' : '3D Roadster Game'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer whitespace-nowrap shrink-0"
              >
                View Badges in Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
