import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useApp } from '../../context/AppContext';
import { npcList } from '../../data/initialData';
import { NpcInfo } from '../../types';

// Pre-allocated reusable math vectors
const _raycaster = new THREE.Raycaster();
const _mouse = new THREE.Vector2();
const _camTarget = new THREE.Vector3(0, 6, 14);
const _lookTarget = new THREE.Vector3(0, 1.2, 0);

export const VoxelLibraryScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { setActiveNpc, unlockBadge, setActiveTab, showToast, modules, solarPhase, sunHour } = useApp();

  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [ambientAudioOn, setAmbientAudioOn] = useState(false);
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const [cameraPreset, setCameraPreset] = useState<
    'overview' | 'progress' | 'transformer' | 'robotics' | 'ethics' | 'strategy' | 'ada' | 'alan' | 'tensor'
  >('overview');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Renderer setup with mobile optimization
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, isMobile ? 1.2 : 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isHeadless && !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    let skyHex = 0x070914;
    let keyLightHex = 0x818cf8;
    let hemiSkyHex = 0x38bdf8;
    let hemiGroundHex = 0x070914;

    if (solarPhase === 'dawn') {
      skyHex = 0x1f1124;
      keyLightHex = 0xfb7185;
      hemiSkyHex = 0xfb7185;
      hemiGroundHex = 0x3b1137;
    } else if (solarPhase === 'day') {
      skyHex = 0x0e253e;
      keyLightHex = 0xfffaed;
      hemiSkyHex = 0x38bdf8;
      hemiGroundHex = 0x0c4a6e;
    } else if (solarPhase === 'sunset') {
      skyHex = 0x1c0b24;
      keyLightHex = 0xf97316;
      hemiSkyHex = 0xf59e0b;
      hemiGroundHex = 0x4a044e;
    }

    scene.background = new THREE.Color(skyHex);
    scene.fog = new THREE.FogExp2(skyHex, 0.03);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 6, 14);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 2.5;
    controls.maxDistance = 26;
    controls.target.copy(_lookTarget);

    // ----------------------------------------------------
    // Procedural Voxel Textures (Zero 404 dependencies)
    // ----------------------------------------------------
    const createVoxelWoodTexture = () => {
      const cvs = document.createElement('canvas');
      cvs.width = 64;
      cvs.height = 64;
      const ctx = cvs.getContext('2d')!;
      ctx.fillStyle = '#6e4726';
      ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = '#55361b';
      ctx.fillRect(0, 0, 64, 3);
      ctx.fillRect(0, 31, 64, 3);
      ctx.fillRect(0, 61, 64, 3);
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#7b512c' : '#523419';
        ctx.fillRect(Math.floor(Math.random() * 16) * 4, Math.floor(Math.random() * 16) * 4, 4, 4);
      }
      const tex = new THREE.CanvasTexture(cvs);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.magFilter = THREE.NearestFilter;
      return tex;
    };

    const createVoxelStoneTexture = () => {
      const cvs = document.createElement('canvas');
      cvs.width = 64;
      cvs.height = 64;
      const ctx = cvs.getContext('2d')!;
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 31, 64, 2);
      ctx.fillRect(31, 0, 2, 31);
      ctx.fillRect(15, 32, 2, 32);
      ctx.fillRect(47, 32, 2, 32);
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#475569' : '#1e2632';
        ctx.fillRect(Math.floor(Math.random() * 16) * 4, Math.floor(Math.random() * 16) * 4, 4, 4);
      }
      const tex = new THREE.CanvasTexture(cvs);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.magFilter = THREE.NearestFilter;
      return tex;
    };

    const woodTex = createVoxelWoodTexture();
    const stoneTex = createVoxelStoneTexture();

    const floorMat = new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.8, metalness: 0.1 });
    const stoneMat = floorMat;
    const woodMat = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.7, metalness: 0.05 });
    const obsidianMat = new THREE.MeshPhysicalMaterial({ color: 0x181028, roughness: 0.2, metalness: 0.85, clearcoat: 0.8 });
    const beaconBeamMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending });

    // Ground Floor: 28x28 stone tiles
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Glowing Gold & Obsidian Pathway Matrix
    const pathMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xb45309, emissiveIntensity: 0.35, roughness: 0.5 });
    const crossPath = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 26), pathMat);
    crossPath.rotation.x = -Math.PI / 2;
    crossPath.position.y = 0.01;
    scene.add(crossPath);

    const crossPath2 = new THREE.Mesh(new THREE.PlaneGeometry(26, 2.4), pathMat);
    crossPath2.rotation.x = -Math.PI / 2;
    crossPath2.position.y = 0.01;
    scene.add(crossPath2);

    const interactiveObjects: THREE.Object3D[] = [];

    // Helper: Create Floating Holographic Signboard
    const createSignboard = (text: string, subtext: string, color: string) => {
      const cvs = document.createElement('canvas');
      cvs.width = 300;
      cvs.height = 80;
      const ctx = cvs.getContext('2d')!;
      ctx.fillStyle = 'rgba(10, 15, 30, 0.9)';
      ctx.roundRect(4, 4, 292, 72, 14);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(text, 150, 36);
      ctx.fillStyle = color;
      ctx.font = 'bold 14px monospace';
      ctx.fillText(subtext, 150, 60);

      const tex = new THREE.CanvasTexture(cvs);
      tex.colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.55), mat);
      return mesh;
    };

    // Helper: Create Luminous Vertical Beacon Ray
    const createBeaconBeam = (colorHex: number) => {
      const beamGeo = new THREE.CylinderGeometry(0.12, 0.12, 22, 12);
      const bMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
      const beam = new THREE.Mesh(beamGeo, bMat);
      beam.position.y = 11;
      return beam;
    };

    // ------------------------------------------------------------------
    // Structure 1: The Central Growing Voxel Progress Citadel
    // ------------------------------------------------------------------
    const progressGroup = new THREE.Group();
    progressGroup.position.set(0, 0, 0);

    const basePedestal = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.8, 4.2), obsidianMat);
    basePedestal.position.y = 0.4;
    progressGroup.add(basePedestal);

    // 4 Growing Voxel Path Spires mapped to actual modules
    const pathSpires = [
      { name: 'Generative AI', color: 0x8b5cf6, x: -1.2, z: -1.2, blocks: Math.round((modules[0]?.progressPercent || 75) / 14) },
      { name: 'Robotics', color: 0x06b6d4, x: 1.2, z: -1.2, blocks: Math.round((modules[1]?.progressPercent || 30) / 14) },
      { name: 'AI Ethics', color: 0xf43f5e, x: -1.2, z: 1.2, blocks: Math.round((modules[2]?.progressPercent || 45) / 14) },
      { name: 'Non-Tech', color: 0x10b981, x: 1.2, z: 1.2, blocks: Math.round((modules[3]?.progressPercent || 85) / 14) },
    ];

    pathSpires.forEach(s => {
      for (let i = 0; i < 7; i++) {
        const isBuilt = i < s.blocks;
        const bMat = new THREE.MeshStandardMaterial({
          color: isBuilt ? s.color : 0x1e293b,
          roughness: isBuilt ? 0.3 : 0.8,
          metalness: 0.3,
          emissive: isBuilt ? s.color : 0x000000,
          emissiveIntensity: isBuilt ? 0.3 : 0,
        });
        const block = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.7), bMat);
        block.position.set(s.x, 0.8 + 0.25 + i * 0.52, s.z);
        progressGroup.add(block);
      }
    });

    // Floating central Grimoire
    const grimoireMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.12, 0.6),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3, metalness: 0.2 })
    );
    grimoireMesh.position.set(0, 2.2, 0);
    progressGroup.add(grimoireMesh);

    const progSign = createSignboard('Progress Spire', 'Active Path Growth', '#38bdf8');
    progSign.position.set(0, 3.8, 0);
    progressGroup.add(progSign);

    progressGroup.add(createBeaconBeam(0x38bdf8));
    progressGroup.userData = { type: 'structure', name: 'Growing Voxel Progress Spire', id: 'struct-progress' };
    scene.add(progressGroup);
    interactiveObjects.push(progressGroup);

    // ------------------------------------------------------------------
    // Structure 2: The Transformer Monolith (Generative AI Wing)
    // ------------------------------------------------------------------
    const transformerGroup = new THREE.Group();
    transformerGroup.position.set(-9, 0, -5);

    // 3 layered tiered monolith blocks
    const tBase = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.2, 2.8), stoneMat);
    tBase.position.y = 0.6;
    transformerGroup.add(tBase);

    const tMid = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 3.2, 2.0),
      new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.3, metalness: 0.6, emissive: 0x4338ca, emissiveIntensity: 0.25 })
    );
    tMid.position.y = 2.8;
    transformerGroup.add(tMid);

    // Floating voxel matrix rings
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
    for (let r = 0; r < 4; r++) {
      const qkBlock = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), ringMat);
      qkBlock.position.set(Math.cos((r * Math.PI) / 2) * 1.8, 3.2, Math.sin((r * Math.PI) / 2) * 1.8);
      transformerGroup.add(qkBlock);
    }

    const tSign = createSignboard('Transformer Monolith', 'Self-Attention & LLMs', '#a855f7');
    tSign.position.set(0, 5.0, 0);
    transformerGroup.add(tSign);
    transformerGroup.add(createBeaconBeam(0xa855f7));

    transformerGroup.userData = { type: 'structure', name: 'The Transformer Monolith', id: 'struct-transformer' };
    scene.add(transformerGroup);
    interactiveObjects.push(transformerGroup);

    // ------------------------------------------------------------------
    // Structure 3: The Robotics Workshop & Kinematics Bay
    // ------------------------------------------------------------------
    const roboticsGroup = new THREE.Group();
    roboticsGroup.position.set(9, 0, -5);

    const rBase = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.8, 3.2), woodMat);
    rBase.position.y = 0.4;
    roboticsGroup.add(rBase);

    // Articulated Voxel Robotic Manipulator Arm
    const rArmBase = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 1.0), obsidianMat);
    rArmBase.position.set(0, 0.9, 0);
    roboticsGroup.add(rArmBase);

    const rLink1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 1.8, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.2, metalness: 0.8 })
    );
    rLink1.position.set(0, 2.0, 0);
    rLink1.rotation.z = 0.3;
    roboticsGroup.add(rLink1);

    const rLink2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 1.5, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.8 })
    );
    rLink2.position.set(0.6, 3.3, 0);
    rLink2.rotation.z = -0.6;
    roboticsGroup.add(rLink2);

    const rSign = createSignboard('Robotics Workshop', 'Kinematics & ROS2', '#06b6d4');
    rSign.position.set(0, 4.8, 0);
    roboticsGroup.add(rSign);
    roboticsGroup.add(createBeaconBeam(0x06b6d4));

    roboticsGroup.userData = { type: 'structure', name: 'Robotics Workshop & Kinematics Bay', id: 'struct-robotics' };
    scene.add(roboticsGroup);
    interactiveObjects.push(roboticsGroup);

    // ------------------------------------------------------------------
    // Structure 4: The AI Ethics & Alignment Citadel
    // ------------------------------------------------------------------
    const ethicsGroup = new THREE.Group();
    ethicsGroup.position.set(-8, 0, 6);

    const eBase = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.0, 3.2), obsidianMat);
    eBase.position.y = 0.5;
    ethicsGroup.add(eBase);

    // Protective Archway
    const archLeft = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.0, 0.6), obsidianMat);
    archLeft.position.set(-1.2, 2.2, 0);
    ethicsGroup.add(archLeft);

    const archRight = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.0, 0.6), obsidianMat);
    archRight.position.set(1.2, 2.2, 0);
    ethicsGroup.add(archRight);

    const archTop = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 0.6, 0.6),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0x9f1239, emissiveIntensity: 0.4 })
    );
    archTop.position.set(0, 3.8, 0);
    ethicsGroup.add(archTop);

    const eSign = createSignboard('Ethics Citadel', 'RLHF & Alignment', '#f43f5e');
    eSign.position.set(0, 4.6, 0);
    ethicsGroup.add(eSign);
    ethicsGroup.add(createBeaconBeam(0xf43f5e));

    ethicsGroup.userData = { type: 'structure', name: 'AI Ethics & Alignment Citadel', id: 'struct-ethics' };
    scene.add(ethicsGroup);
    interactiveObjects.push(ethicsGroup);

    // ------------------------------------------------------------------
    // Structure 5: The Non-Technical Strategy Pavilion
    // ------------------------------------------------------------------
    const strategyGroup = new THREE.Group();
    strategyGroup.position.set(8, 0, 6);

    const sBase = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.8, 3.4), woodMat);
    sBase.position.y = 0.4;
    strategyGroup.add(sBase);

    // Executive table & emerald canopy pillars
    const canopyPillars = [
      [-1.4, -1.2],
      [1.4, -1.2],
      [-1.4, 1.2],
      [1.4, 1.2],
    ];
    canopyPillars.forEach(([px, pz]) => {
      const pil = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.2, 0.4), woodMat);
      pil.position.set(px, 2.0, pz);
      strategyGroup.add(pil);
    });

    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 0.4, 3.4),
      new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x065f46, emissiveIntensity: 0.3 })
    );
    roof.position.set(0, 3.7, 0);
    strategyGroup.add(roof);

    const sSign = createSignboard('Strategy Pavilion', 'No-Code Leadership', '#10b981');
    sSign.position.set(0, 4.6, 0);
    strategyGroup.add(sSign);
    strategyGroup.add(createBeaconBeam(0x10b981));

    strategyGroup.userData = { type: 'structure', name: 'Non-Technical Strategy Pavilion', id: 'struct-strategy' };
    scene.add(strategyGroup);
    interactiveObjects.push(strategyGroup);

    // ------------------------------------------------------------------
    // Interactive NPCs (Ada Lovelace, Alan Turing, Tensor-9)
    // ------------------------------------------------------------------
    const createNpcModel = (info: NpcInfo, x: number, z: number, rotY: number) => {
      const npcGroup = new THREE.Group();
      npcGroup.position.set(x, 0, z);
      npcGroup.rotation.y = rotY;

      const skinMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.6 });
      const hairMat = new THREE.MeshStandardMaterial({
        color: info.id === 'ada' ? 0x451a03 : info.id === 'alan' ? 0x1e293b : 0x06b6d4,
        roughness: 0.8,
      });
      const clothMat = new THREE.MeshStandardMaterial({
        color: info.id === 'ada' ? 0x047857 : info.id === 'alan' ? 0x9a3412 : 0x3b82f6,
        roughness: 0.6,
      });

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.35), clothMat);
      torso.position.y = 1.2;
      npcGroup.add(torso);

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), skinMat);
      head.position.y = 1.85;
      npcGroup.add(head);

      if (info.id === 'tensor') {
        const visor = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.16, 0.52), new THREE.MeshBasicMaterial({ color: 0x22d3ee }));
        visor.position.y = 1.85;
        npcGroup.add(visor);

        const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3), new THREE.MeshBasicMaterial({ color: 0x22d3ee }));
        antenna.position.set(0, 2.2, 0);
        npcGroup.add(antenna);
      } else {
        const hair = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.25, 0.54), hairMat);
        hair.position.y = 2.05;
        npcGroup.add(hair);
      }

      const armGeo = new THREE.BoxGeometry(0.2, 0.7, 0.2);
      const lArm = new THREE.Mesh(armGeo, clothMat);
      lArm.position.set(-0.42, 1.15, 0);
      npcGroup.add(lArm);

      const rArm = new THREE.Mesh(armGeo, clothMat);
      rArm.position.set(0.42, 1.15, 0);
      npcGroup.add(rArm);

      const legGeo = new THREE.BoxGeometry(0.24, 0.8, 0.24);
      const lLeg = new THREE.Mesh(legGeo, clothMat);
      lLeg.position.set(-0.16, 0.4, 0);
      npcGroup.add(lLeg);

      const rLeg = new THREE.Mesh(legGeo, clothMat);
      rLeg.position.set(0.16, 0.4, 0);
      npcGroup.add(rLeg);

      // Floating nameplate
      const npSign = createSignboard(info.name, info.specialty, info.id === 'ada' ? '#10b981' : info.id === 'alan' ? '#f59e0b' : '#38bdf8');
      npSign.position.set(0, 2.6, 0);
      npcGroup.add(npSign);

      npcGroup.userData = { type: 'npc', info, name: info.name };
      scene.add(npcGroup);
      interactiveObjects.push(npcGroup);
      return npcGroup;
    };

    const adaNpc = createNpcModel(npcList[0], -4.0, 2.5, 0.5);
    const alanNpc = createNpcModel(npcList[1], 4.0, 2.5, -0.5);
    const tensorNpc = createNpcModel(npcList[2], 0, -2.5, 0);

    // Dynamic Solar Studio Lights
    const sunAngle = ((sunHour - 6) / 12) * Math.PI;
    const keyLight = new THREE.DirectionalLight(keyLightHex, 2.4);
    keyLight.position.set(Math.cos(sunAngle) * 16, Math.max(4, Math.sin(sunAngle) * 16), 8);
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(hemiSkyHex, hemiGroundHex, 1.25);
    scene.add(hemiLight);

    // Dust particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 26;
      particlePos[i + 1] = Math.random() * 6 + 0.2;
      particlePos[i + 2] = (Math.random() - 0.5) * 26;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.06, transparent: true, opacity: 0.6 });
    scene.add(new THREE.Points(particleGeo, particleMat));

    // Interaction Raycasting
    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      _raycaster.setFromCamera(_mouse, camera);
      const hits = _raycaster.intersectObjects(interactiveObjects, true);

      if (hits.length > 0) {
        let parent = hits[0].object;
        while (parent.parent && !parent.userData.name) {
          parent = parent.parent;
        }
        if (parent.userData.name) {
          container.style.cursor = 'pointer';
          setHoveredObject(parent.userData.name);
          return;
        }
      }
      container.style.cursor = 'default';
      setHoveredObject(null);
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      _raycaster.setFromCamera(_mouse, camera);
      const hits = _raycaster.intersectObjects(interactiveObjects, true);

      if (hits.length > 0) {
        let parent = hits[0].object;
        while (parent.parent && !parent.userData.type) {
          parent = parent.parent;
        }

        if (parent.userData.type === 'npc') {
          const npc = parent.userData.info as NpcInfo;
          setActiveNpc(npc);
          showToast(`Opening mentorship dialogue with ${npc.name}...`);
        } else if (parent.userData.type === 'structure') {
          const id = parent.userData.id;
          if (id === 'struct-progress') {
            setCameraPreset('progress');
            showToast('Inspecting Central Voxel Progress Spire!');
          } else if (id === 'struct-transformer') {
            setCameraPreset('transformer');
            showToast('Navigated to Transformer Monolith wing.');
          } else if (id === 'struct-robotics') {
            setCameraPreset('robotics');
            showToast('Navigated to Robotics Workshop.');
          } else if (id === 'struct-ethics') {
            setCameraPreset('ethics');
            showToast('Navigated to AI Ethics Citadel.');
          } else if (id === 'struct-strategy') {
            setCameraPreset('strategy');
            showToast('Navigated to Strategy Pavilion.');
          }
        }
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

      // Floating elements animation
      grimoireMesh.position.y = 2.2 + Math.sin(elapsed * 2.5) * 0.1;
      grimoireMesh.rotation.y = elapsed * 0.8;
      tensorNpc.position.y = Math.sin(elapsed * 3) * 0.08;

      // Waypoint camera navigation interpolation
      if (cameraPreset === 'progress') {
        _camTarget.set(0, 4.2, 5.5);
        _lookTarget.set(0, 1.8, 0);
      } else if (cameraPreset === 'transformer') {
        _camTarget.set(-7, 4.5, -1);
        _lookTarget.set(-9, 2.5, -5);
      } else if (cameraPreset === 'robotics') {
        _camTarget.set(7, 4.5, -1);
        _lookTarget.set(9, 2.5, -5);
      } else if (cameraPreset === 'ethics') {
        _camTarget.set(-6, 4.2, 9.5);
        _lookTarget.set(-8, 2.0, 6);
      } else if (cameraPreset === 'strategy') {
        _camTarget.set(6, 4.2, 9.5);
        _lookTarget.set(8, 2.0, 6);
      } else if (cameraPreset === 'ada') {
        _camTarget.set(-3.0, 3.0, 4.5);
        _lookTarget.set(-4.0, 1.8, 2.5);
      } else if (cameraPreset === 'alan') {
        _camTarget.set(3.0, 3.0, 4.5);
        _lookTarget.set(4.0, 1.8, 2.5);
      } else if (cameraPreset === 'tensor') {
        _camTarget.set(0, 2.6, 0.2);
        _lookTarget.set(0, 1.5, -2.5);
      } else {
        _camTarget.set(0, 8, 15);
        _lookTarget.set(0, 1.2, 0);
      }

      controls.target.lerp(_lookTarget, 0.06);
      camera.position.lerp(_camTarget, 0.06);
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
      woodTex.dispose();
      stoneTex.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [cameraPreset, modules, solarPhase, sunHour]);

  const toggleAmbientAudio = () => {
    if (!ambientAudioOn) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.connect(ctx.destination);
        gainNodeRef.current = gainNode;

        const freqs = [261.63, 329.63, 392.0, 493.88];
        freqs.forEach(f => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime);
          osc.connect(gainNode);
          osc.start();
        });

        setAmbientAudioOn(true);
        showToast('🎵 Lo-Fi Study Chords enabled');
      } catch (e) {
        showToast('Audio init error: ' + (e as Error).message);
      }
    } else {
      if (audioCtxRef.current) audioCtxRef.current.close();
      setAmbientAudioOn(false);
      showToast('Audio muted.');
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] min-h-[500px] overflow-hidden select-none">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Title & Navigation Status in Minimalist Glass */}
      <div className="absolute top-4 left-4 pointer-events-auto glass-card rounded-2xl px-4 py-3 backdrop-blur-xl shadow-2xl flex items-center gap-3 border border-white/20 dark:border-white/10 text-slate-900 dark:text-white">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
          3D
        </div>
        <div>
          <div className="text-[11px] uppercase font-mono tracking-wider text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Minecraft Voxel Campus
          </div>
          <div className="text-sm font-black">Europa AI Study Library</div>
        </div>
      </div>

      {/* Hovered Target Tooltip */}
      {hoveredObject && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none glass-card text-cyan-700 dark:text-cyan-200 border border-cyan-500/50 rounded-full px-5 py-2 text-xs font-bold tracking-wide shadow-2xl flex items-center gap-2 backdrop-blur-xl animate-bounce">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          Click to inspect: <strong className="text-slate-900 dark:text-white">{hoveredObject}</strong>
        </div>
      )}

      {/* Collapsible Viewport-First Bottom Control Dock */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-[940px] transition-all duration-300 pointer-events-auto z-20 ${
          hudCollapsed ? 'translate-y-[calc(100%-38px)] opacity-90' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setHudCollapsed(!hudCollapsed)}
            className="glass-panel text-slate-800 dark:text-slate-200 px-5 py-1.5 rounded-t-2xl border-t border-x border-white/20 dark:border-white/10 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg backdrop-blur-xl"
          >
            <span>{hudCollapsed ? '▴ Show Voxel Waypoints' : '▾ Collapse Controls (Zen Mode)'}</span>
          </button>
        </div>

        <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-3.5 backdrop-blur-2xl shadow-2xl flex flex-wrap items-center justify-between gap-3 text-slate-900 dark:text-white">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase mr-1 font-bold">Waypoints:</span>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'progress', label: 'Progress Spire', highlight: true },
              { id: 'transformer', label: 'Transformer Monolith' },
              { id: 'robotics', label: 'Robotics Bay' },
              { id: 'ethics', label: 'Ethics Citadel' },
              { id: 'strategy', label: 'Strategy Pavilion' },
              { id: 'ada', label: 'Ada Lovelace' },
              { id: 'alan', label: 'Alan Turing' },
              { id: 'tensor', label: 'Tensor-9' },
            ].map(wp => (
              <button
                key={wp.id}
                onClick={() => setCameraPreset(wp.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  cameraPreset === wp.id
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                    : wp.highlight
                    ? 'bg-indigo-950/80 text-cyan-300 border border-indigo-700/60 hover:bg-indigo-900'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {wp.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleAmbientAudio}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                ambientAudioOn
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <span>{ambientAudioOn ? '🔊 Lo-Fi: On' : '🔈 Lo-Fi: Off'}</span>
            </button>
            <button
              onClick={() => {
                setActiveNpc(npcList[0]);
                setCameraPreset('ada');
              }}
              className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs shadow-md cursor-pointer"
            >
              Talk to Mentor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
