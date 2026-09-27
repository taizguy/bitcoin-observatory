import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Fallback2DObservatory } from './Fallback2DObservatory';
import { Eye, RotateCcw, Zap, Compass, ShieldCheck, ArrowRight, X, Sparkles, TrendingUp, Users, Coins, Cpu, Smile, Filter, Maximize2, Radio } from 'lucide-react';

interface BitcoinObservatorySceneProps {
  activeRegion: string | null;
  onSelectRegion: (regionId: string | null) => void;
  timeframe: string;
  onChangeTimeframe: (tf: string) => void;
  mvrvValue?: number;
  lthSupplyValue?: number;
  hashrateValue?: number;
  realizedCapValue?: number;
  nuplValue?: number;
  btcPrice?: number;
  epochTitle?: string;
  evidenceFocus?: string | null; // Triggered during "SHOW ME WHY"
}

export const BitcoinObservatoryScene: React.FC<BitcoinObservatorySceneProps> = ({
  activeRegion,
  onSelectRegion,
  timeframe,
  onChangeTimeframe,
  mvrvValue = 2.14,
  lthSupplyValue = 69.8,
  hashrateValue = 712,
  realizedCapValue = 825.4,
  nuplValue = 0.53,
  btcPrice = 89400,
  epochTitle = 'Current Epoch',
  evidenceFocus = null,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [use2DFallback, setUse2DFallback] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);
  const [spectralFilter, setSpectralFilter] = useState<'all' | 'valuation' | 'holders' | 'security'>('all');
  const [lensMagnification, setLensMagnification] = useState<'1x' | '2.5x' | '5x'>('1x');

  const [hoveredRegion, setHoveredRegion] = useState<{
    id: string;
    label: string;
    condition: string;
    metric: string;
    insight: string;
    coordinates: string;
    magnitude: string;
    x: number;
    y: number;
  } | null>(null);

  // 5 Distinct Celestial Sectors with astronomical coordinates and distinct physical identities
  const regionsConfig = [
    {
      id: 'price',
      label: 'Sector I: Price Horizon',
      shortLabel: 'Price Horizon',
      icon: TrendingUp,
      condition: 'Expansion Corridor',
      metric: `MVRV ${mvrvValue.toFixed(2)}x`,
      insight: 'Spot price exceeds aggregate investor acquisition baseline ($41,780) by 2.14x.',
      coordinates: 'RA 19h 44m · DEC +22° 10′',
      magnitude: 'MAG +1.4',
      position: new THREE.Vector3(0, 4.6, -0.5),
      color: 0xf59e0b,
      hexColor: '#f59e0b',
    },
    {
      id: 'holders',
      label: 'Sector II: Conviction Vault',
      shortLabel: 'Holders & Supply',
      icon: Users,
      condition: 'Sovereign Retention',
      metric: `${lthSupplyValue.toFixed(1)}% LTH Supply`,
      insight: '69.8% of all minted bitcoin remains dormant in long-term cold storage for >155 days.',
      coordinates: 'RA 04h 32m · DEC +16° 30′',
      magnitude: 'MAG +0.8',
      position: new THREE.Vector3(5.8, 1.2, 1.2),
      color: 0x10b981,
      hexColor: '#10b981',
    },
    {
      id: 'money',
      label: 'Sector III: Monetary Conduit',
      shortLabel: 'Capital & Realized Value',
      icon: Coins,
      condition: 'All-Time Record Retention',
      metric: `$${realizedCapValue.toFixed(0)}B Realized Cap`,
      insight: 'Dollar value permanently locked into the UTXO network sits at an all-time record.',
      coordinates: 'RA 12h 18m · DEC -11° 45′',
      magnitude: 'MAG +1.1',
      position: new THREE.Vector3(3.8, -3.8, 2.4),
      color: 0x38bdf8,
      hexColor: '#38bdf8',
    },
    {
      id: 'network',
      label: 'Sector IV: Thermodynamic Shield',
      shortLabel: 'Network & Security',
      icon: Cpu,
      condition: 'Record Computational Defense',
      metric: `${hashrateValue.toFixed(0)} EH/s Hashrate`,
      insight: 'Over 712 quintillion cryptographic computations safeguard every block each second.',
      coordinates: 'RA 21h 05m · DEC -28° 12′',
      magnitude: 'MAG -0.4',
      position: new THREE.Vector3(-4.4, -3.5, -2.2),
      color: 0x818cf8,
      hexColor: '#818cf8',
    },
    {
      id: 'sentiment',
      label: 'Sector V: Psychological Wave',
      shortLabel: 'Sentiment & Profit',
      icon: Smile,
      condition: 'Belief & Expansion Phase',
      metric: `NUPL ${nuplValue.toFixed(2)}`,
      insight: '53% of all circulating coins sit on unrealized paper profits.',
      coordinates: 'RA 08h 55m · DEC +38° 20′',
      magnitude: 'MAG +1.9',
      position: new THREE.Vector3(-5.6, 1.4, -1.4),
      color: 0xf43f5e,
      hexColor: '#f43f5e',
    },
  ];

  const cameraTargetRef = useRef<{
    pos: THREE.Vector3;
    lookAt: THREE.Vector3;
    isTransitioning: boolean;
  }>({
    pos: new THREE.Vector3(0, 2.5, 14),
    lookAt: new THREE.Vector3(0, 0, 0),
    isTransitioning: false,
  });

  const resetCamera = useCallback(() => {
    onSelectRegion(null);
    setLensMagnification('1x');
    cameraTargetRef.current = {
      pos: new THREE.Vector3(0, 2.5, 14),
      lookAt: new THREE.Vector3(0, 0, 0),
      isTransitioning: true,
    };
  }, [onSelectRegion]);

  const handleLensZoom = (mag: '1x' | '2.5x' | '5x') => {
    setLensMagnification(mag);
    let dist = 14;
    if (mag === '2.5x') dist = 8.5;
    if (mag === '5x') dist = 4.8;

    if (!activeRegion) {
      cameraTargetRef.current = {
        pos: new THREE.Vector3(0, 1.8, dist),
        lookAt: new THREE.Vector3(0, 0, 0),
        isTransitioning: true,
      };
    }
  };

  useEffect(() => {
    if (use2DFallback) return;
    const container = containerRef.current;
    if (!container) return;

    // WebGL Hardware Safety Check
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    if (!gl) {
      setUse2DFallback(true);
      return;
    }

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 640;

    // 1. Celestial Scene & Fog Atmosphere
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030509, 0.032);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 14);

    // 3. High Precision WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isLowPower,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowPower ? 1 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 4. Optical Lighting System
    const ambientLight = new THREE.AmbientLight(0x0a101f, 2.2);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.DirectionalLight(0xffb733, 4.2);
    goldKeyLight.position.set(10, 12, 10);
    scene.add(goldKeyLight);

    const blueFillLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    blueFillLight.position.set(-10, -8, -8);
    scene.add(blueFillLight);

    const pulsarCoreLight = new THREE.PointLight(0xff9900, 6, 25);
    pulsarCoreLight.position.set(0, 0, 0);
    scene.add(pulsarCoreLight);

    // 5. Deep Space Starfield with Stellar Classification Colors (O, B, A, F, G, K, M)
    const starCount = isLowPower ? 400 : 1600;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const r = 24 + Math.random() * 55;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      const dice = Math.random();
      if (dice > 0.85) {
        // Hot blue-white star
        starColors[i * 3] = 0.7;
        starColors[i * 3 + 1] = 0.85;
        starColors[i * 3 + 2] = 1.0;
      } else if (dice > 0.55) {
        // Solar golden G-class star
        starColors[i * 3] = 1.0;
        starColors[i * 3 + 1] = 0.85;
        starColors[i * 3 + 2] = 0.45;
      } else if (dice > 0.35) {
        // Cool red dwarf
        starColors[i * 3] = 1.0;
        starColors[i * 3 + 1] = 0.4;
        starColors[i * 3 + 2] = 0.4;
      } else {
        // Pure starlight silver
        starColors[i * 3] = 0.95;
        starColors[i * 3 + 1] = 0.95;
        starColors[i * 3 + 2] = 0.98;
      }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // ========================================================
    // 6. CENTRAL BITCOIN PULSAR CORE (The Solar Core of the Ledger)
    // ========================================================
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Physical Beveled Golden Ingot Core
    const coinGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.35, 64);
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xf7931a,
      metalness: 0.92,
      roughness: 0.18,
      emissive: 0x4a2400,
      emissiveIntensity: 0.45,
    });
    const bitcoinCoin = new THREE.Mesh(coinGeo, coinMat);
    bitcoinCoin.rotation.x = Math.PI / 2;
    coreGroup.add(bitcoinCoin);

    // Bitcoin ₿ Inscription Canvas
    const btcCanvas = document.createElement('canvas');
    btcCanvas.width = 512;
    btcCanvas.height = 512;
    const btcCtx = btcCanvas.getContext('2d');
    if (btcCtx) {
      btcCtx.fillStyle = '#060911';
      btcCtx.beginPath();
      btcCtx.arc(256, 256, 240, 0, Math.PI * 2);
      btcCtx.fill();
      
      // Outer etched coordinate ring
      btcCtx.strokeStyle = '#f59e0b';
      btcCtx.lineWidth = 6;
      btcCtx.stroke();

      btcCtx.fillStyle = '#f7931a';
      btcCtx.font = 'bold 300px serif';
      btcCtx.textAlign = 'center';
      btcCtx.textBaseline = 'middle';
      btcCtx.fillText('₿', 256, 268);
    }
    const symbolTex = new THREE.CanvasTexture(btcCanvas);
    const symbolMat = new THREE.MeshBasicMaterial({ map: symbolTex, transparent: true, opacity: 0.98 });

    const symbolPlaneFront = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 2.1), symbolMat);
    symbolPlaneFront.position.z = 0.19;
    coreGroup.add(symbolPlaneFront);

    const symbolPlaneBack = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 2.1), symbolMat);
    symbolPlaneBack.position.z = -0.19;
    symbolPlaneBack.rotation.y = Math.PI;
    coreGroup.add(symbolPlaneBack);

    // Astrolabe & Armillary Celestial Coordinate Rings
    const gyroRing1Geo = new THREE.TorusGeometry(2.2, 0.035, 16, 120);
    const gyroRing1Mat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.5,
    });
    const gyroRing1 = new THREE.Mesh(gyroRing1Geo, gyroRing1Mat);
    coreGroup.add(gyroRing1);

    const gyroRing2Geo = new THREE.TorusGeometry(2.7, 0.028, 16, 120);
    const gyroRing2Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
    });
    const gyroRing2 = new THREE.Mesh(gyroRing2Geo, gyroRing2Mat);
    gyroRing2.rotation.x = Math.PI / 3;
    gyroRing2.rotation.y = Math.PI / 4;
    coreGroup.add(gyroRing2);

    const gyroRing3Geo = new THREE.TorusGeometry(3.2, 0.02, 16, 120);
    const gyroRing3Mat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x059669,
      emissiveIntensity: 0.35,
    });
    const gyroRing3 = new THREE.Mesh(gyroRing3Geo, gyroRing3Mat);
    gyroRing3.rotation.x = -Math.PI / 4;
    gyroRing3.rotation.z = Math.PI / 6;
    coreGroup.add(gyroRing3);

    // ========================================================
    // 7. THE 5 DISTINCT VISUAL REGIONS (Domain-Specific Physical Languages)
    // ========================================================
    const regionInteractiveMeshes: THREE.Mesh[] = [];
    const regionSubGroups: { [id: string]: THREE.Group } = {};

    regionsConfig.forEach((cfg) => {
      const regGroup = new THREE.Group();
      regGroup.position.copy(cfg.position);
      scene.add(regGroup);
      regionSubGroups[cfg.id] = regGroup;

      // 1. Central Core Orb for Raycasting Interaction
      const orbGeo = new THREE.SphereGeometry(0.72, 32, 32);
      const orbMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.85,
      });
      const orbMesh = new THREE.Mesh(orbGeo, orbMat);
      orbMesh.userData = { id: cfg.id, label: cfg.label };
      regGroup.add(orbMesh);
      regionInteractiveMeshes.push(orbMesh);

      // 2. Optical Reticle Coordinate Ring
      const ringGeo = new THREE.RingGeometry(0.9, 0.98, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      regGroup.add(ringMesh);

      // 3. Domain-Specific Physical Language
      if (cfg.id === 'price') {
        // TOPOGRAPHIC PRICE HORIZON: Undulating mountain contour rings
        const mountainGroup = new THREE.Group();
        for (let l = 1; l <= 3; l++) {
          const mGeo = new THREE.ConeGeometry(0.6 * l, 0.45 * l, 6, 1, true);
          const mMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            wireframe: true,
            emissive: 0xd97706,
            emissiveIntensity: 0.5,
          });
          const mMesh = new THREE.Mesh(mGeo, mMat);
          mMesh.position.y = -0.15 * l;
          mountainGroup.add(mMesh);
        }
        regGroup.add(mountainGroup);
      } else if (cfg.id === 'holders') {
        // CONVICTION VAULT: Quartz crystal cluster with inner dormant glow
        const crystalGroup = new THREE.Group();
        for (let c = 0; c < 6; c++) {
          const cGeo = new THREE.OctahedronGeometry(0.35 + (c % 3) * 0.1, 0);
          const cMat = new THREE.MeshStandardMaterial({
            color: 0x10b981,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x059669,
            emissiveIntensity: 0.6,
          });
          const cMesh = new THREE.Mesh(cGeo, cMat);
          const cAngle = (c / 6) * Math.PI * 2;
          cMesh.position.set(Math.cos(cAngle) * 0.85, (c % 2 ? 0.3 : -0.3), Math.sin(cAngle) * 0.85);
          cMesh.rotation.set(cAngle, cAngle * 0.5, 0);
          crystalGroup.add(cMesh);
        }
        regGroup.add(crystalGroup);
      } else if (cfg.id === 'money') {
        // MONETARY CONDUIT: Dynamic concentric flow rings
        const conduitGroup = new THREE.Group();
        for (let k = 1; k <= 3; k++) {
          const tGeo = new THREE.TorusGeometry(0.85 + k * 0.25, 0.02, 12, 48);
          const tMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            emissive: 0x0284c7,
            emissiveIntensity: 0.55,
          });
          const tMesh = new THREE.Mesh(tGeo, tMat);
          tMesh.rotation.x = (k * Math.PI) / 4;
          tMesh.rotation.y = (k * Math.PI) / 6;
          conduitGroup.add(tMesh);
        }
        regGroup.add(conduitGroup);
      } else if (cfg.id === 'network') {
        // THERMODYNAMIC SHIELD: Geodesic titanium cryptographic lattice
        const shieldGeo = new THREE.IcosahedronGeometry(1.25, 1);
        const shieldMat = new THREE.MeshStandardMaterial({
          color: 0x818cf8,
          wireframe: true,
          emissive: 0x4f46e5,
          emissiveIntensity: 0.6,
        });
        const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
        regGroup.add(shieldMesh);
      } else if (cfg.id === 'sentiment') {
        // PSYCHOLOGICAL WAVE: Dual-wave harmonic crests
        const waveGroup = new THREE.Group();
        const curvePoints = [];
        for (let w = -Math.PI; w <= Math.PI; w += 0.2) {
          curvePoints.push(new THREE.Vector3(w * 0.45, Math.sin(w * 2) * 0.45, Math.cos(w) * 0.2));
        }
        const curve = new THREE.CatmullRomCurve3(curvePoints);
        const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.04, 8, false);
        const tubeMat = new THREE.MeshStandardMaterial({
          color: 0xf43f5e,
          emissive: 0xe11d48,
          emissiveIntensity: 0.7,
        });
        const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
        waveGroup.add(tubeMesh);
        regGroup.add(waveGroup);
      }

      // 4. Subtle Celestial Radial Conduit Connecting Sector to Solar Core
      const linePoints = [new THREE.Vector3(0, 0, 0), cfg.position.clone().multiplyScalar(0.92)];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMat = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.25,
      });
      const radialLine = new THREE.Line(lineGeo, lineMat);
      scene.add(radialLine);
    });

    // ========================================================
    // 8. INTERACTIVE OPTICAL CONTROLS & CAMERA INTERPOLATION
    // ========================================================
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.15;
    let targetRotationY = 0;
    let currentRotationX = 0.15;
    let currentRotationY = 0;
    let targetCameraDist = 14;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      container.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Raycast for hover detection
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
      const intersects = raycaster.intersectObjects(regionInteractiveMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        if (hit.userData.id) {
          const cfg = regionsConfig.find((r) => r.id === hit.userData.id);
          if (cfg) {
            setHoveredRegion({
              id: cfg.id,
              label: cfg.label,
              condition: cfg.condition,
              metric: cfg.metric,
              insight: cfg.insight,
              coordinates: cfg.coordinates,
              magnitude: cfg.magnitude,
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
            container.style.cursor = 'pointer';
          }
        }
      } else {
        if (!isDragging) container.style.cursor = 'grab';
        setHoveredRegion(null);
      }

      if (!isDragging) return;
      cameraTargetRef.current.isTransitioning = false;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.005;
      targetRotationX += deltaY * 0.005;
      targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
      container.style.cursor = 'grab';
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraTargetRef.current.isTransitioning = false;
      targetCameraDist += e.deltaY * 0.012;
      targetCameraDist = Math.max(5.5, Math.min(24, targetCameraDist));
    };

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
      const intersects = raycaster.intersectObjects(regionInteractiveMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        if (hit.userData.id) {
          const regId = hit.userData.id;
          onSelectRegion(regId);

          // Focus camera on target region
          const targetCfg = regionsConfig.find((r) => r.id === regId);
          if (targetCfg) {
            const targetPos = targetCfg.position;
            const camOffset = targetPos.clone().normalize().multiplyScalar(4.2).add(new THREE.Vector3(0, 0.8, 3.0));
            cameraTargetRef.current = {
              pos: targetPos.clone().add(camOffset),
              lookAt: targetPos.clone(),
              isTransitioning: true,
            };
          }
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('click', onClick);

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // ========================================================
    // 9. ANIMATION LOOP & KINETIC CELESTIAL MECHANICS
    // ========================================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Camera motion smoothing
      if (cameraTargetRef.current.isTransitioning) {
        camera.position.lerp(cameraTargetRef.current.pos, 0.05);
        camera.lookAt(cameraTargetRef.current.lookAt);

        if (camera.position.distanceTo(cameraTargetRef.current.pos) < 0.08) {
          cameraTargetRef.current.isTransitioning = false;
        }
      } else {
        currentRotationX += (targetRotationX - currentRotationX) * 0.08;
        currentRotationY += (targetRotationY - currentRotationY) * 0.08;

        camera.position.x = Math.sin(currentRotationY) * targetCameraDist * Math.cos(currentRotationX);
        camera.position.y = Math.sin(currentRotationX) * targetCameraDist;
        camera.position.z = Math.cos(currentRotationY) * targetCameraDist * Math.cos(currentRotationX);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
      }

      // Solar Pulsar Core Rotations
      bitcoinCoin.rotation.z = elapsedTime * 0.25;
      gyroRing1.rotation.y = elapsedTime * 0.45;
      gyroRing2.rotation.z = -elapsedTime * 0.35;
      gyroRing3.rotation.x = elapsedTime * 0.3;
      starField.rotation.y = elapsedTime * 0.008;

      // Region orbital oscillation & hover response
      regionInteractiveMeshes.forEach((mesh) => {
        const regId = mesh.userData.id;
        mesh.rotation.y = elapsedTime * 0.6;
        mesh.rotation.x = Math.sin(elapsedTime * 0.7 + mesh.position.x) * 0.12;

        const isSelected = activeRegion === regId;
        const isHovered = hoveredRegion?.id === regId;
        const isEvidenceFocused = evidenceFocus === regId;

        const targetScale = isSelected ? 1.45 : isHovered ? 1.28 : isEvidenceFocused ? 1.35 : 1.0;
        mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = isSelected
          ? 0.95
          : isHovered
          ? 0.8
          : isEvidenceFocused
          ? 0.9
          : 0.45;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('click', onClick);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starGeo.dispose();
      starMat.dispose();
    };
  }, [use2DFallback, isLowPower, activeRegion, hoveredRegion?.id, onSelectRegion, mvrvValue, lthSupplyValue, hashrateValue, realizedCapValue, nuplValue, btcPrice, evidenceFocus]);

  const activeRegionData = regionsConfig.find((r) => r.id === activeRegion);

  return (
    <div className="relative w-full rounded-2xl border border-white/[0.08] bg-[#030509] shadow-2xl overflow-hidden">
      
      {/* Precision Reticle Corner Accents */}
      <div className="reticle-corner-tl" />
      <div className="reticle-corner-tr" />
      <div className="reticle-corner-bl" />
      <div className="reticle-corner-br" />

      {/* Top Optical Aperture Header HUD */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/[0.06] bg-black/40 backdrop-blur-md text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-amber-400">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span className="font-semibold tracking-wider">TELESCOPIC APERTURE</span>
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">EPOCH: {epochTitle}</span>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <span className="text-slate-400 hidden sm:inline">FOV: 45.0°</span>
        </div>

        {/* Optical Magnification & Reset Actions */}
        <div className="flex items-center gap-2">
          {/* Magnification Steps */}
          <div className="flex items-center bg-white/[0.04] p-0.5 rounded border border-white/[0.08] text-[11px]">
            {(['1x', '2.5x', '5x'] as const).map((mag) => (
              <button
                key={mag}
                onClick={() => handleLensZoom(mag)}
                className={`px-2 py-0.5 rounded transition-all ${
                  lensMagnification === mag
                    ? 'bg-amber-500/20 text-amber-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mag}
              </button>
            ))}
          </div>

          {activeRegion && (
            <button
              onClick={resetCamera}
              className="flex items-center gap-1 px-2.5 py-1 rounded border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white hover:border-amber-400/40 text-[11px] transition-all"
            >
              <RotateCcw className="h-3 w-3 text-amber-400" />
              <span>Full Sky</span>
            </button>
          )}
        </div>
      </div>

      {/* 3D Canvas / 2D Fallback */}
      <div
        ref={containerRef}
        className="relative w-full h-[620px] bg-gradient-to-b from-[#030509] via-[#060a14] to-[#030509]"
      >
        {use2DFallback && (
          <Fallback2DObservatory
            activeRegion={activeRegion}
            onSelectRegion={onSelectRegion}
            timeframe={timeframe}
            mvrvValue={mvrvValue}
            lthSupplyValue={lthSupplyValue}
            hashrateValue={hashrateValue}
            realizedCapValue={realizedCapValue}
            nuplValue={nuplValue}
            btcPrice={btcPrice}
          />
        )}
      </div>

      {/* Subtle Optical Crosshairs & Coordinate Tick Rings (SVG Overlay) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
        <svg className="w-[520px] h-[520px]" viewBox="0 0 520 520" fill="none">
          {/* Concentric Astrolabe Circles */}
          <circle cx="260" cy="260" r="160" stroke="#f59e0b" strokeWidth="0.75" strokeDasharray="3 6" />
          <circle cx="260" cy="260" r="230" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 8" />
          
          {/* Coordinate Crosshair Axes */}
          <line x1="260" y1="20" x2="260" y2="90" stroke="#f59e0b" strokeWidth="1" />
          <line x1="260" y1="430" x2="260" y2="500" stroke="#f59e0b" strokeWidth="1" />
          <line x1="20" y1="260" x2="90" y2="260" stroke="#f59e0b" strokeWidth="1" />
          <line x1="430" y1="260" x2="500" y2="260" stroke="#f59e0b" strokeWidth="1" />
          
          {/* Center Precision Ring */}
          <circle cx="260" cy="260" r="40" stroke="#f59e0b" strokeWidth="0.75" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* Floating Astronomical Hover Telemetry Card */}
      {hoveredRegion && !activeRegion && (
        <div
          className="absolute z-30 pointer-events-none p-4 rounded-xl border border-white/15 bg-[#050811]/90 backdrop-blur-xl shadow-2xl transition-all max-w-xs"
          style={{
            left: `${Math.min(hoveredRegion.x + 16, 520)}px`,
            top: `${Math.max(hoveredRegion.y - 70, 30)}px`,
          }}
        >
          <div className="flex items-center justify-between text-xs font-mono mb-1 text-slate-400">
            <span className="uppercase text-slate-300 font-bold">{hoveredRegion.label}</span>
            <span className="text-amber-400 font-semibold">{hoveredRegion.magnitude}</span>
          </div>
          
          <div className="text-[11px] text-emerald-400 font-mono mb-1">
            {hoveredRegion.condition} · {hoveredRegion.metric}
          </div>

          <p className="text-xs text-slate-200 leading-snug font-sans">
            {hoveredRegion.insight}
          </p>

          <div className="mt-2.5 pt-2 border-t border-white/[0.06] text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>{hoveredRegion.coordinates}</span>
            <span className="text-amber-400/90">CLICK TO LOCK OPTICS</span>
          </div>
        </div>
      )}

      {/* Active Region Focus Telemetry HUD */}
      {activeRegionData && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-[420px] z-30 p-5 rounded-xl border border-amber-500/30 bg-[#070b16]/95 backdrop-blur-2xl shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-celestial text-sm font-bold text-white tracking-wide">
                {activeRegionData.label}
              </span>
            </div>
            <button
              onClick={() => onSelectRegion(null)}
              className="text-slate-400 hover:text-white p-1 rounded"
              title="Return to Orbit"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div>
            <div className="text-xs font-mono text-amber-400 font-semibold">
              {activeRegionData.condition}
            </div>
            <div className="text-lg font-mono font-bold text-white mt-0.5">
              {activeRegionData.metric}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              {activeRegionData.insight}
            </p>
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{activeRegionData.coordinates}</span>
            <button
              onClick={() => {
                // Keep selected region
              }}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
            >
              <span>INSPECT EVIDENCE</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Celestial Telemetry Ribbon */}
      <div className="absolute bottom-0 inset-x-0 z-20 flex flex-wrap items-center justify-between px-4 sm:px-6 py-2.5 border-t border-white/[0.06] bg-black/50 backdrop-blur-md text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span className="text-slate-500">SECTORS:</span>
          {regionsConfig.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelectRegion(r.id)}
              className={`hover:text-white transition-colors flex items-center gap-1 ${
                activeRegion === r.id ? 'text-amber-400 font-bold' : 'text-slate-400'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: r.hexColor }} />
              <span className="hidden md:inline">{r.shortLabel}</span>
              <span className="md:hidden">{r.shortLabel.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-3 text-slate-500">
          <span>DRAG TO ROTATE</span>
          <span>·</span>
          <span>SCROLL TO ZOOM</span>
          <span>·</span>
          <span>CLICK SECTOR TO LOCK</span>
        </div>
      </div>

    </div>
  );
};
