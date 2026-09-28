import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Fallback2DObservatory } from './Fallback2DObservatory';
import { Eye, RotateCcw, Zap, Compass, ArrowRight, X, TrendingUp, Users, Coins, Cpu, Smile, Radio } from 'lucide-react';

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
  const [lensMagnification, setLensMagnification] = useState<'1x' | '2.5x' | '5x'>('1x');

  const [hoveredRegion, setHoveredRegion] = useState<{
    id: string;
    label: string;
    condition: string;
    metric: string;
    insight: string;
    coordinates: string;
    x: number;
    y: number;
  } | null>(null);

  // 5 Modern High-Tech Sectors (Designprompts palette: Cyan, Indigo, Violet, Silver, Coral)
  const regionsConfig = [
    {
      id: 'price',
      label: 'Sector I: Valuation Horizon',
      shortLabel: 'Valuation & Price',
      icon: TrendingUp,
      condition: 'Expansion Corridor',
      metric: `MVRV ${mvrvValue.toFixed(2)}x`,
      insight: 'Spot price sits 2.14x above aggregate acquisition cost basis ($41,780).',
      coordinates: 'RA 19h 44m · DEC +22° 10′',
      position: new THREE.Vector3(0, 4.6, -0.5),
      color: 0x38bdf8, // Electric Ice Cyan
      hexColor: '#38bdf8',
    },
    {
      id: 'holders',
      label: 'Sector II: Conviction Vault',
      shortLabel: 'Holders & Supply',
      icon: Users,
      condition: 'Sovereign Retention',
      metric: `${lthSupplyValue.toFixed(1)}% LTH Supply`,
      insight: '69.8% of circulating supply is held in wallets unmoved for >155 days.',
      coordinates: 'RA 04h 32m · DEC +16° 30′',
      position: new THREE.Vector3(5.8, 1.2, 1.2),
      color: 0x818cf8, // Indigo-Violet
      hexColor: '#818cf8',
    },
    {
      id: 'money',
      label: 'Sector III: Monetary Conduit',
      shortLabel: 'Realized Capital',
      icon: Coins,
      condition: 'Record Capital Stored',
      metric: `$${realizedCapValue.toFixed(0)}B Realized Cap`,
      insight: 'Aggregate fiat capital permanently settled on the ledger is at an all-time record.',
      coordinates: 'RA 12h 18m · DEC -11° 45′',
      position: new THREE.Vector3(3.8, -3.8, 2.4),
      color: 0x6366f1, // High-frequency Violet
      hexColor: '#6366f1',
    },
    {
      id: 'network',
      label: 'Sector IV: Computational Defense',
      shortLabel: 'Network & Mining',
      icon: Cpu,
      condition: 'Record Security Capacity',
      metric: `${hashrateValue.toFixed(0)} EH/s Hashrate`,
      insight: '712 quintillion cryptographic hashes defend network consensus each second.',
      coordinates: 'RA 21h 05m · DEC -28° 12′',
      position: new THREE.Vector3(-4.4, -3.5, -2.2),
      color: 0xe4e4e7, // Platinum Silver
      hexColor: '#e4e4e7',
    },
    {
      id: 'sentiment',
      label: 'Sector V: Psychological Wave',
      shortLabel: 'Sentiment & Profit',
      icon: Smile,
      condition: 'Belief & Expansion Phase',
      metric: `NUPL ${nuplValue.toFixed(2)}`,
      insight: '53% of all circulating coins are in unrealized paper profit.',
      coordinates: 'RA 08h 55m · DEC +38° 20′',
      position: new THREE.Vector3(-5.6, 1.4, -1.4),
      color: 0xf43f5e, // Rose / Coral
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

    let width = container.clientWidth || 900;
    let height = container.clientHeight || 640;

    // 1. Scene & Modern Dark Fog Atmosphere (#09090b)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.034);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 14);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isLowPower,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowPower ? 1 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting Design (Electric Cyan Key + Deep Indigo Fill)
    const ambientLight = new THREE.AmbientLight(0x181824, 2.2);
    scene.add(ambientLight);

    const cyanKeyLight = new THREE.DirectionalLight(0x38bdf8, 4.0);
    cyanKeyLight.position.set(10, 12, 10);
    scene.add(cyanKeyLight);

    const indigoFillLight = new THREE.DirectionalLight(0x6366f1, 2.5);
    indigoFillLight.position.set(-10, -8, -8);
    scene.add(indigoFillLight);

    const coreLight = new THREE.PointLight(0x38bdf8, 5.5, 24);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // 5. Starfield Points (Crisp Silver & Ice Blue)
    const starCount = isLowPower ? 400 : 1500;
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
      if (dice > 0.6) {
        // Ice Cyan star
        starColors[i * 3] = 0.22;
        starColors[i * 3 + 1] = 0.74;
        starColors[i * 3 + 2] = 0.97;
      } else if (dice > 0.3) {
        // Indigo star
        starColors[i * 3] = 0.51;
        starColors[i * 3 + 1] = 0.55;
        starColors[i * 3 + 2] = 0.97;
      } else {
        // Pure Starlight Silver
        starColors[i * 3] = 0.95;
        starColors[i * 3 + 1] = 0.95;
        starColors[i * 3 + 2] = 0.98;
      }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.11,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // ========================================================
    // 6. CENTRAL CORE (Brushed Titanium Core with Cyan Rings)
    // ========================================================
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Titanium Ingot Core
    const coinGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.35, 64);
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      metalness: 0.95,
      roughness: 0.2,
      emissive: 0x09090b,
      emissiveIntensity: 0.5,
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
      btcCtx.fillStyle = '#09090b';
      btcCtx.beginPath();
      btcCtx.arc(256, 256, 240, 0, Math.PI * 2);
      btcCtx.fill();
      
      // Clean hairline border
      btcCtx.strokeStyle = '#38bdf8';
      btcCtx.lineWidth = 8;
      btcCtx.stroke();

      btcCtx.fillStyle = '#38bdf8';
      btcCtx.font = 'bold 280px sans-serif';
      btcCtx.textAlign = 'center';
      btcCtx.textBaseline = 'middle';
      btcCtx.fillText('₿', 256, 270);
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

    // Multi-Axis Gyroscopic Rings (Ice Cyan & Indigo)
    const gyroRing1Geo = new THREE.TorusGeometry(2.2, 0.032, 16, 120);
    const gyroRing1Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
    });
    const gyroRing1 = new THREE.Mesh(gyroRing1Geo, gyroRing1Mat);
    coreGroup.add(gyroRing1);

    const gyroRing2Geo = new THREE.TorusGeometry(2.7, 0.026, 16, 120);
    const gyroRing2Mat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.5,
    });
    const gyroRing2 = new THREE.Mesh(gyroRing2Geo, gyroRing2Mat);
    gyroRing2.rotation.x = Math.PI / 3;
    gyroRing2.rotation.y = Math.PI / 4;
    coreGroup.add(gyroRing2);

    const gyroRing3Geo = new THREE.TorusGeometry(3.2, 0.02, 16, 120);
    const gyroRing3Mat = new THREE.MeshStandardMaterial({
      color: 0xf4f4f5,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x71717a,
      emissiveIntensity: 0.35,
    });
    const gyroRing3 = new THREE.Mesh(gyroRing3Geo, gyroRing3Mat);
    gyroRing3.rotation.x = -Math.PI / 4;
    gyroRing3.rotation.z = Math.PI / 6;
    coreGroup.add(gyroRing3);

    // ========================================================
    // 7. THE 5 DISTINCT VISUAL REGIONS
    // ========================================================
    const regionInteractiveMeshes: THREE.Mesh[] = [];
    const regionSubGroups: { [id: string]: THREE.Group } = {};

    regionsConfig.forEach((cfg) => {
      const regGroup = new THREE.Group();
      regGroup.position.copy(cfg.position);
      scene.add(regGroup);
      regionSubGroups[cfg.id] = regGroup;

      // 1. Raycast Orb Core
      const orbGeo = new THREE.SphereGeometry(0.72, 32, 32);
      const orbMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.85,
      });
      const orbMesh = new THREE.Mesh(orbGeo, orbMat);
      orbMesh.userData = { id: cfg.id, label: cfg.label };
      regGroup.add(orbMesh);
      regionInteractiveMeshes.push(orbMesh);

      // 2. Optical Reticle Ring
      const ringGeo = new THREE.RingGeometry(0.9, 0.96, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      regGroup.add(ringMesh);

      // 3. Domain Specific Visual Identity
      if (cfg.id === 'price') {
        // Topographic mountain rings in Ice Cyan
        const mGroup = new THREE.Group();
        for (let l = 1; l <= 3; l++) {
          const mGeo = new THREE.ConeGeometry(0.6 * l, 0.45 * l, 6, 1, true);
          const mMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            wireframe: true,
            emissive: 0x0284c7,
            emissiveIntensity: 0.6,
          });
          const mMesh = new THREE.Mesh(mGeo, mMat);
          mMesh.position.y = -0.15 * l;
          mGroup.add(mMesh);
        }
        regGroup.add(mGroup);
      } else if (cfg.id === 'holders') {
        // Amethyst/Indigo crystal cluster
        const crystalGroup = new THREE.Group();
        for (let c = 0; c < 6; c++) {
          const cGeo = new THREE.OctahedronGeometry(0.35 + (c % 3) * 0.1, 0);
          const cMat = new THREE.MeshStandardMaterial({
            color: 0x818cf8,
            metalness: 0.9,
            roughness: 0.15,
            emissive: 0x4f46e5,
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
        // Concentric Violet energy rings
        const conduitGroup = new THREE.Group();
        for (let k = 1; k <= 3; k++) {
          const tGeo = new THREE.TorusGeometry(0.85 + k * 0.25, 0.02, 12, 48);
          const tMat = new THREE.MeshStandardMaterial({
            color: 0x6366f1,
            emissive: 0x4338ca,
            emissiveIntensity: 0.55,
          });
          const tMesh = new THREE.Mesh(tGeo, tMat);
          tMesh.rotation.x = (k * Math.PI) / 4;
          tMesh.rotation.y = (k * Math.PI) / 6;
          conduitGroup.add(tMesh);
        }
        regGroup.add(conduitGroup);
      } else if (cfg.id === 'network') {
        // Titanium Platinum Geodesic Sphere
        const shieldGeo = new THREE.IcosahedronGeometry(1.25, 1);
        const shieldMat = new THREE.MeshStandardMaterial({
          color: 0xf4f4f5,
          wireframe: true,
          emissive: 0x71717a,
          emissiveIntensity: 0.5,
        });
        const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
        regGroup.add(shieldMesh);
      } else if (cfg.id === 'sentiment') {
        // Coral Rose Frequency Wave
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

      // Radial laser linking to core
      const linePoints = [new THREE.Vector3(0, 0, 0), cfg.position.clone().multiplyScalar(0.92)];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMat = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.22,
      });
      const radialLine = new THREE.Line(lineGeo, lineMat);
      scene.add(radialLine);
    });

    // ========================================================
    // 8. INTERACTIVE ORBIT CONTROLS & CAMERA
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

    // 9. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

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

      bitcoinCoin.rotation.z = elapsedTime * 0.25;
      gyroRing1.rotation.y = elapsedTime * 0.45;
      gyroRing2.rotation.z = -elapsedTime * 0.35;
      gyroRing3.rotation.x = elapsedTime * 0.3;
      starField.rotation.y = elapsedTime * 0.008;

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
    <div className="relative w-full h-full min-h-[580px] lg:min-h-[640px] xl:min-h-[700px] rounded-2xl border border-white/[0.08] bg-[#09090b] shadow-2xl overflow-hidden flex flex-col">
      
      {/* Precision Reticle Accents in Ice Cyan */}
      <div className="reticle-tl" />
      <div className="reticle-tr" />
      <div className="reticle-bl" />
      <div className="reticle-br" />

      {/* Top Header HUD */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-white">
            <Radio className="h-3.5 w-3.5 animate-pulse text-white" />
            <span className="font-semibold tracking-wider font-mono">3D OBSERVATORY CONSOLE</span>
          </span>
          <span className="text-white/30">·</span>
          <span className="text-white/60">{epochTitle}</span>
        </div>

        {/* Magnification Steps & Full Sky Reset */}
        <div className="flex items-center gap-2">
          <div className="flex items-center liquid-glass p-1 rounded-full border border-white/10 text-[11px]">
            {(['1x', '2.5x', '5x'] as const).map((mag) => (
              <button
                key={mag}
                onClick={() => handleLensZoom(mag)}
                className={`px-3 py-0.5 rounded-full transition-all cursor-pointer ${
                  lensMagnification === mag
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {mag}
              </button>
            ))}
          </div>

          {activeRegion && (
            <button
              onClick={resetCamera}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 liquid-glass text-white/80 hover:text-white text-[11px] transition-all cursor-pointer"
            >
              <RotateCcw className="h-3 w-3 text-white" />
              <span>Full Sky</span>
            </button>
          )}
        </div>
      </div>

      {/* 3D Canvas / 2D Fallback */}
      <div
        ref={containerRef}
        className="relative w-full flex-1 min-h-[580px] lg:min-h-[640px] xl:min-h-[700px] bg-transparent"
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

      {/* Subtle Optical Reticle Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
        <svg className="w-[500px] h-[500px]" viewBox="0 0 500 500" fill="none">
          <circle cx="250" cy="250" r="160" stroke="#ffffff" strokeWidth="0.75" strokeDasharray="3 6" />
          <circle cx="250" cy="250" r="230" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="2 8" />
          <line x1="250" y1="20" x2="250" y2="80" stroke="#ffffff" strokeWidth="1" />
          <line x1="250" y1="420" x2="250" y2="480" stroke="#ffffff" strokeWidth="1" />
          <line x1="20" y1="250" x2="80" y2="250" stroke="#ffffff" strokeWidth="1" />
          <line x1="420" y1="250" x2="480" y2="250" stroke="#ffffff" strokeWidth="1" />
        </svg>
      </div>

      {/* Floating Hover Card */}
      {hoveredRegion && !activeRegion && (
        <div
          className="absolute z-30 pointer-events-none p-4 rounded-2xl liquid-glass border border-white/20 shadow-2xl transition-all max-w-xs"
          style={{
            left: `${Math.min(hoveredRegion.x + 16, 520)}px`,
            top: `${Math.max(hoveredRegion.y - 70, 30)}px`,
          }}
        >
          <div className="flex items-center justify-between text-xs font-mono mb-1 text-white/70">
            <span className="uppercase text-white font-bold">{hoveredRegion.label}</span>
          </div>
          
          <div className="text-[11px] text-white font-mono mb-1">
            {hoveredRegion.condition} · {hoveredRegion.metric}
          </div>

          <p className="text-xs text-white/80 leading-snug font-sans">
            {hoveredRegion.insight}
          </p>

          <div className="mt-2.5 pt-2 border-t border-white/10 text-[10px] text-white/50 font-mono flex items-center justify-between">
            <span>{hoveredRegion.coordinates}</span>
            <span className="text-white font-semibold">CLICK TO LOCK</span>
          </div>
        </div>
      )}

      {/* Active Region Focus Telemetry HUD */}
      {activeRegionData && (
        <div className="absolute bottom-16 left-6 right-6 sm:right-auto sm:w-[420px] z-30 p-5 rounded-3xl liquid-glass-panel border border-white/20 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span className="font-serif-instrument text-base font-bold text-white tracking-wide">
                {activeRegionData.label}
              </span>
            </div>
            <button
              onClick={() => onSelectRegion(null)}
              className="text-white/60 hover:text-white p-1 rounded-full cursor-pointer"
              title="Return to Orbit"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div>
            <div className="text-xs font-mono text-white/80 font-semibold">
              {activeRegionData.condition}
            </div>
            <div className="text-lg font-mono font-bold text-white mt-0.5">
              {activeRegionData.metric}
            </div>
            <p className="text-xs text-white/70 leading-relaxed mt-1 font-sans">
              {activeRegionData.insight}
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/60">
            <span>{activeRegionData.coordinates}</span>
            <button
              onClick={() => {}}
              className="flex items-center gap-1 text-white hover:text-white/80 font-semibold cursor-pointer"
            >
              <span>INSPECT EVIDENCE</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sector Selector Bar */}
      <div className="absolute bottom-0 inset-x-0 z-20 flex flex-wrap items-center justify-between px-5 py-2.5 border-t border-white/10 liquid-glass text-[11px] font-mono text-white/70">
        <div className="flex items-center gap-3">
          <span className="text-white/50">SECTORS:</span>
          {regionsConfig.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelectRegion(r.id)}
              className={`hover:text-white transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-pointer ${
                activeRegion === r.id ? 'bg-white text-black font-semibold shadow-sm' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: activeRegion === r.id ? '#000000' : r.hexColor }} />
              <span>{r.shortLabel}</span>
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-3 text-white/50">
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
