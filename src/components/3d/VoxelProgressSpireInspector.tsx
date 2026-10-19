import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Layers, Sparkles, CheckCircle, ArrowRight, TrendingUp, Award, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { resolveLearningPathIdFromCategory, VOXEL_LEARNING_PATHS } from '../../utils/voxelPathIcons';

export const VoxelProgressSpireInspector: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { modules, user, setActiveLecture, setActiveTab, voxelPathIcons } = useApp();

  const [selectedPillar, setSelectedPillar] = useState<any>(null);
  const [hoveredVoxelInfo, setHoveredVoxelInfo] = useState<string | null>(null);
  const [explodedView, setExplodedView] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060814);
    scene.fog = new THREE.FogExp2(0x060814, 0.04);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 50);
    camera.position.set(5, 6, 8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.target.set(0, 2.5, 0);

    // Studio Lights
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.5);
    keyLight.position.set(6, 12, 6);
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 1.4);
    scene.add(fillLight);

    // Base Pedestal
    const baseGeo = new THREE.CylinderGeometry(4.2, 4.5, 0.4, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.5, metalness: 0.4 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.2;
    scene.add(baseMesh);

    // Glowing runic ring
    const ringGeo = new THREE.RingGeometry(3.6, 3.8, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.02;
    scene.add(ringMesh);

    // Central core pillar data mapped to modules
    const pillarData = [
      {
        id: 'mod-1',
        name: 'Generative AI & Transformers',
        color: 0x8b5cf6,
        emissive: 0x6d28d9,
        x: -1.6,
        z: -1.6,
        totalBlocks: 8,
        completedBlocks: Math.round((modules[0]?.progressPercent || 75) / 12.5),
        pct: modules[0]?.progressPercent || 75,
        module: modules[0],
      },
      {
        id: 'mod-2',
        name: 'Autonomous Robotics & Kinematics',
        color: 0x06b6d4,
        emissive: 0x0e7490,
        x: 1.6,
        z: -1.6,
        totalBlocks: 8,
        completedBlocks: Math.round((modules[1]?.progressPercent || 30) / 12.5),
        pct: modules[1]?.progressPercent || 30,
        module: modules[1],
      },
      {
        id: 'mod-3',
        name: 'AI Alignment & Safety Systems',
        color: 0xf43f5e,
        emissive: 0xbe123c,
        x: -1.6,
        z: 1.6,
        totalBlocks: 8,
        completedBlocks: Math.round((modules[2]?.progressPercent || 45) / 12.5),
        pct: modules[2]?.progressPercent || 45,
        module: modules[2],
      },
      {
        id: 'mod-4',
        name: 'Non-Technical AI Strategy',
        color: 0x10b981,
        emissive: 0x047857,
        x: 1.6,
        z: 1.6,
        totalBlocks: 8,
        completedBlocks: Math.round((modules[3]?.progressPercent || 85) / 12.5),
        pct: modules[3]?.progressPercent || 85,
        module: modules[3],
      },
      {
        id: 'mod-apex',
        name: 'Foundational Math & Theory (Apex)',
        color: 0xf59e0b,
        emissive: 0xb45309,
        x: 0,
        z: 0,
        totalBlocks: 10,
        completedBlocks: 7,
        pct: 70,
        module: modules[0],
      },
    ];

    const interactiveBlocks: THREE.Object3D[] = [];
    const blockGroups: THREE.Group[] = [];

    pillarData.forEach(p => {
      const pGroup = new THREE.Group();
      pGroup.position.set(p.x, 0, p.z);
      scene.add(pGroup);
      blockGroups.push(pGroup);

      const blockGeo = new THREE.BoxGeometry(0.75, 0.55, 0.75);

      for (let b = 0; b < p.totalBlocks; b++) {
        const isDone = b < p.completedBlocks;
        const mat = new THREE.MeshStandardMaterial({
          color: isDone ? p.color : 0x1f2937,
          roughness: isDone ? 0.3 : 0.9,
          metalness: isDone ? 0.5 : 0.1,
          emissive: isDone ? p.emissive : 0x000000,
          emissiveIntensity: isDone ? 0.35 : 0,
        });

        const mesh = new THREE.Mesh(blockGeo, mat);
        mesh.position.y = 0.35 + b * 0.65;
        mesh.userData = {
          pillar: p,
          tier: b + 1,
          isCompleted: isDone,
        };
        pGroup.add(mesh);
        interactiveBlocks.push(mesh);

        // Glowing capstone beacon on the top active block
        if (b === p.completedBlocks - 1 && isDone) {
          const capstoneGeo = new THREE.OctahedronGeometry(0.25, 0);
          const capMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
          const capstone = new THREE.Mesh(capstoneGeo, capMat);
          capstone.position.y = mesh.position.y + 0.55;
          pGroup.add(capstone);
        }
      }
    });

    // Particle field
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 8;
      particlePos[i + 1] = Math.random() * 6;
      particlePos[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.05, transparent: true, opacity: 0.6 });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // Raycast interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(interactiveBlocks);
      if (hits.length > 0) {
        const uData = hits[0].object.userData;
        container.style.cursor = 'pointer';
        setHoveredVoxelInfo(`${uData.pillar.name} — Tier ${uData.tier} (${uData.isCompleted ? '✓ Completed' : 'Locked'})`);
      } else {
        container.style.cursor = 'default';
        setHoveredVoxelInfo(null);
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(interactiveBlocks);
      if (hits.length > 0) {
        const p = hits[0].object.userData.pillar;
        setSelectedPillar(p);
      }
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('click', onClick);

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle pedestal rotation
      ringMesh.rotation.z = elapsed * 0.2;

      // Pulse active voxel capstones
      interactiveBlocks.forEach((mesh, idx) => {
        if (mesh.userData.isCompleted) {
          const mat = (mesh as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat.emissiveIntensity !== undefined) {
            mat.emissiveIntensity = 0.35 + Math.sin(elapsed * 3 + idx * 0.4) * 0.15;
          }
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('click', onClick);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modules]);

  return (
    <div className="relative w-full h-[620px] rounded-3xl overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl flex flex-col justify-between">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Top Overlay Badge & Stat in Frosted Glass */}
      <div className="relative z-10 p-5 flex items-start justify-between pointer-events-none">
        <div className="pointer-events-auto glass-card border border-white/20 dark:border-white/10 p-4 rounded-3xl shadow-xl space-y-1 text-slate-900 dark:text-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
            <span className="text-xs font-mono uppercase text-cyan-600 dark:text-cyan-400 font-bold">Voxel Progress Citadel</span>
          </div>
          <h3 className="text-sm font-black">Dynamic 3D Study Path Growth</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Each completed lesson stacks a procedural voxel tier in real-time</p>
        </div>

        {/* Global Level Indicator */}
        <div className="pointer-events-auto glass-card border border-white/20 dark:border-white/10 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 text-slate-900 dark:text-white">
          <Award className="w-5 h-5 text-amber-500" />
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold">Global Mastery</div>
            <div className="text-sm font-black font-mono">Level {user.level} • {user.xp} XP</div>
          </div>
        </div>
      </div>

      {/* Center Tooltip on Hover */}
      {hoveredVoxelInfo && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none glass-card text-indigo-700 dark:text-indigo-200 border border-indigo-500/50 rounded-full px-5 py-2 text-xs font-bold tracking-wide shadow-xl flex items-center gap-2 backdrop-blur-xl">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          <span>{hoveredVoxelInfo}</span>
        </div>
      )}

      {/* Bottom Inspection Card */}
      <div className="relative z-10 p-5 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 pointer-events-none">
        {selectedPillar ? (
          <div className="pointer-events-auto glass-card border border-cyan-500/40 p-4 rounded-3xl shadow-2xl max-w-md w-full space-y-2.5 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={voxelPathIcons[resolveLearningPathIdFromCategory(selectedPillar.name)]?.dataUri}
                  alt={`${selectedPillar.name} 3D Voxel Icon`}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0"
                />
                <span className="text-xs font-bold truncate">{selectedPillar.name}</span>
              </div>
              <span className="text-xs font-mono font-black text-cyan-600 dark:text-cyan-400 shrink-0">
                {selectedPillar.pct}% Complete
              </span>
            </div>
            <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${selectedPillar.pct}%`, backgroundColor: `#${selectedPillar.color.toString(16)}` }}
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Height: {selectedPillar.completedBlocks} / {selectedPillar.totalBlocks} Voxel Blocks
              </span>
              <button
                onClick={() => {
                  if (selectedPillar.module?.lectures?.[0]) {
                    setActiveLecture(selectedPillar.module.lectures[0]);
                  } else {
                    setActiveTab('dashboard');
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-sm shadow-cyan-500/20"
              >
                <span>Continue Path</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <div className="pointer-events-auto glass-card border border-white/20 dark:border-white/10 px-4 py-2.5 rounded-2xl text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center gap-2.5 flex-wrap">
            <span>💡 Click any 3D voxel pillar or path icon:</span>
            <div className="flex items-center gap-1.5">
              {VOXEL_LEARNING_PATHS.map(spec => (
                <img
                  key={spec.id}
                  src={voxelPathIcons[spec.id]?.dataUri}
                  alt={spec.shortLabel}
                  title={spec.title}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-lg object-cover border border-white/20"
                />
              ))}
            </div>
          </div>
        )}

        <div className="pointer-events-auto glass-panel border border-white/20 dark:border-white/10 px-3.5 py-2 rounded-2xl flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
          <span>Rotate: <strong>Left-drag</strong></span>
          <span>•</span>
          <span>Zoom: <strong>Scroll</strong></span>
        </div>
      </div>
    </div>
  );

};
