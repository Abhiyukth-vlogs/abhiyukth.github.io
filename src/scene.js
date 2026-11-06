import * as THREE from 'three';

/**
 * Premium 3D Futuristic Gaming Universe for Abhiyukth Vlogs
 * Built with procedural DualSense PS5 controller, holographic gyroscopic rings,
 * quantum energy relics, glowing cosmic starfield, and cinematic lighting.
 * 
 * 3D Style: Futuristic Gaming Universe
 * Main 3D Object: Floating PS5 DualSense Controller
 * Primary Palette: Neon Purple (#8B5CF6) & Electric Cyan (#22D3EE)
 * Interactivity: Mouse, Touch, Scroll
 */

export class HeroScene {
  constructor(containerElement, fallbackElement) {
    this.container = containerElement;
    this.fallback = fallbackElement;

    // State
    this.currentMode = 'gaming'; // 'gaming' | 'vlogs'
    this.isPaused = false;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isVisible = true;
    this.clock = new THREE.Clock();

    // Pointer & Parallax
    this.pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.drag = {
      isDragging: false,
      startX: 0,
      startY: 0,
      rotX: 0,
      rotY: 0,
      targetRotX: 0,
      targetRotY: 0
    };

    // Scroll tracking for cinematic depth dolly
    this.scrollY = 0;
    this.targetScrollY = 0;

    // Animation targets for mode transitions
    this.modeTargets = {
      gaming: {
        controller: { pos: new THREE.Vector3(0, 0.08, 0), rot: new THREE.Vector3(0.12, -0.22, 0.05), scale: 1.25 },
        playIcon: { pos: new THREE.Vector3(-2.6, 1.5, -1.6), rot: new THREE.Vector3(0, 0.5, 0.1), scale: 0.85 },
        lightColor: new THREE.Color(0x8B5CF6), // Neon Purple
        accentIntensity: 4.8
      },
      vlogs: {
        controller: { pos: new THREE.Vector3(-2.2, -0.6, -1.2), rot: new THREE.Vector3(0.18, 0.55, -0.08), scale: 0.88 },
        playIcon: { pos: new THREE.Vector3(1.2, 0.3, 0.4), rot: new THREE.Vector3(0, -0.35, 0), scale: 1.28 },
        lightColor: new THREE.Color(0x22D3EE), // Electric Cyan
        accentIntensity: 4.5
      }
    };

    this.init();
  }

  isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      return false;
    }
  }

  init() {
    if (!this.isWebGLAvailable()) {
      this.showFallback();
      return;
    }

    try {
      this.setupScene();
      this.setupLights();
      this.buildObjects();
      this.setupEvents();
      this.animate();
    } catch (err) {
      console.warn('HeroScene WebGL initialization failed, using fallback:', err);
      this.showFallback();
    }
  }

  showFallback() {
    if (this.fallback) this.fallback.style.display = 'flex';
    if (this.container) this.container.style.display = 'none';
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x070911, 0.014);

    const width = Math.max(this.container.clientWidth || 0, 320);
    const height = Math.max(this.container.clientHeight || 0, 350);

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 9.2);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });

    const isMobile = window.innerWidth < 768;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    this.renderer.setSize(width, height);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.setAttribute('aria-hidden', 'true');

    // Interactive root group responding to cursor parallax, drag & auto-orbit
    this.interactiveGroup = new THREE.Group();
    this.scene.add(this.interactiveGroup);
  }

  setupLights() {
    // 1. Deep space indigo ambient fill
    const ambientLight = new THREE.AmbientLight(0x0e1428, 2.2);
    this.scene.add(ambientLight);

    // 2. Main Key Light (Electric Cyan specular highlights)
    const keyLight = new THREE.DirectionalLight(0x22D3EE, 3.2);
    keyLight.position.set(6, 6, 7);
    this.scene.add(keyLight);

    // 3. Rim / Silhouette Light (Neon Purple edge glow)
    const rimLight = new THREE.DirectionalLight(0x8B5CF6, 3.6);
    rimLight.position.set(-6, -4, -5);
    this.scene.add(rimLight);

    // 4. Subtle top white gleam for controller materials
    const topLight = new THREE.DirectionalLight(0xffffff, 1.5);
    topLight.position.set(0, 9, 3);
    this.scene.add(topLight);

    // 5. Breathing Haptic Point Light (Pulses from within controller)
    this.accentPointLight = new THREE.PointLight(0x8B5CF6, 4.8, 14, 1.2);
    this.accentPointLight.position.set(0, 0.4, 2.8);
    this.scene.add(this.accentPointLight);
  }

  buildObjects() {
    this.controllerGroup = this.createDualSenseController();
    this.playIconGroup = this.createExtrudedPlayIcon();
    this.ringsGroup = this.createHolographicGimbalRings();
    this.relicsGroup = this.createQuantumRelics();
    this.particlesGroup = this.createCosmicParticleField();

    this.interactiveGroup.add(this.controllerGroup);
    this.interactiveGroup.add(this.playIconGroup);
    this.interactiveGroup.add(this.ringsGroup);
    this.interactiveGroup.add(this.relicsGroup);
    this.interactiveGroup.add(this.particlesGroup);

    // Apply initial state
    const initMode = this.modeTargets.gaming;
    this.controllerGroup.position.copy(initMode.controller.pos);
    this.controllerGroup.rotation.setFromVector3(initMode.controller.rot);
    this.controllerGroup.scale.setScalar(initMode.controller.scale);

    this.playIconGroup.position.copy(initMode.playIcon.pos);
    this.playIconGroup.rotation.setFromVector3(initMode.playIcon.rot);
    this.playIconGroup.scale.setScalar(initMode.playIcon.scale);
  }

  /**
   * Procedural Sculpted DualSense PS5 Controller
   * Authentic two-tone design with ceramic white shell, midnight inner chassis,
   * curved touchpad LED lightbar, tactile thumbsticks, and PlayStation action buttons.
   */
  createDualSenseController() {
    const group = new THREE.Group();

    // High Quality PBR Materials
    const whiteShellMat = new THREE.MeshStandardMaterial({
      color: 0xF8FAFC,
      roughness: 0.22,
      metalness: 0.12
    });

    const blackChassisMat = new THREE.MeshStandardMaterial({
      color: 0x090B10,
      roughness: 0.52,
      metalness: 0.22
    });

    const stickRubberMat = new THREE.MeshStandardMaterial({
      color: 0x141822,
      roughness: 0.75,
      metalness: 0.05
    });

    const metallicTriggerMat = new THREE.MeshStandardMaterial({
      color: 0x1F2432,
      roughness: 0.25,
      metalness: 0.85
    });

    // Glowing Neon Materials
    const neonPurpleMat = new THREE.MeshStandardMaterial({
      color: 0x8B5CF6,
      emissive: 0x8B5CF6,
      emissiveIntensity: 2.8,
      roughness: 0.15
    });

    const neonCyanMat = new THREE.MeshStandardMaterial({
      color: 0x22D3EE,
      emissive: 0x22D3EE,
      emissiveIntensity: 2.5,
      roughness: 0.15
    });

    // 1. Center Bridge Chassis
    const bridgeGeo = new THREE.BoxGeometry(1.42, 0.92, 0.46, 4, 4, 4);
    const bridge = new THREE.Mesh(bridgeGeo, whiteShellMat);
    bridge.position.set(0, 0.05, 0);
    group.add(bridge);

    // 2. Ergonomic DualSense Handles (Flared outward)
    const handleGeo = new THREE.CapsuleGeometry(0.26, 1.05, 16, 24);

    const leftHandle = new THREE.Mesh(handleGeo, whiteShellMat);
    leftHandle.position.set(-0.84, -0.28, 0.02);
    leftHandle.rotation.z = -Math.PI / 7.6;
    leftHandle.rotation.x = 0.12;
    group.add(leftHandle);

    const rightHandle = new THREE.Mesh(handleGeo, whiteShellMat);
    rightHandle.position.set(0.84, -0.28, 0.02);
    rightHandle.rotation.z = Math.PI / 7.6;
    rightHandle.rotation.x = 0.12;
    group.add(rightHandle);

    // 3. Black Inner Chassis & Under-Grip Core (Iconic Two-Tone Division)
    const underCoreGeo = new THREE.CapsuleGeometry(0.24, 0.98, 12, 20);
    const underCore = new THREE.Mesh(underCoreGeo, blackChassisMat);
    underCore.position.set(0, -0.34, 0.04);
    underCore.rotation.z = Math.PI / 2;
    group.add(underCore);

    // 4. Center Touchpad Plate
    const touchpadGeo = new THREE.BoxGeometry(0.74, 0.48, 0.08);
    const touchpad = new THREE.Mesh(touchpadGeo, blackChassisMat);
    touchpad.position.set(0, 0.19, 0.23);
    group.add(touchpad);

    // 5. Curved Dynamic LED Lightbar
    const lightbarGeo = new THREE.BoxGeometry(0.82, 0.045, 0.04);
    this.lightbar = new THREE.Mesh(lightbarGeo, neonPurpleMat);
    this.lightbar.position.set(0, 0.44, 0.24);
    group.add(this.lightbar);

    // Side lightbar wings
    const sideLightGeo = new THREE.BoxGeometry(0.04, 0.36, 0.03);
    const lSideLight = new THREE.Mesh(sideLightGeo, neonPurpleMat);
    lSideLight.position.set(-0.41, 0.24, 0.23);
    lSideLight.rotation.z = 0.1;
    group.add(lSideLight);
    this.leftSideLight = lSideLight;

    const rSideLight = new THREE.Mesh(sideLightGeo, neonPurpleMat);
    rSideLight.position.set(0.41, 0.24, 0.23);
    rSideLight.rotation.z = -0.1;
    group.add(rSideLight);
    this.rightSideLight = rSideLight;

    // 6. Dual Analog Thumbsticks with Base Wells & Tactile Rings
    const stickWellGeo = new THREE.CylinderGeometry(0.22, 0.24, 0.06, 24);
    const stickStemGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.16, 24);
    const stickPadGeo = new THREE.CylinderGeometry(0.21, 0.18, 0.07, 24);
    const stickAccentRingGeo = new THREE.TorusGeometry(0.21, 0.015, 12, 32);

    // Left Analog Stick
    const leftWell = new THREE.Mesh(stickWellGeo, blackChassisMat);
    leftWell.position.set(-0.36, -0.22, 0.24);
    leftWell.rotation.x = 0.16;

    const leftStem = new THREE.Mesh(stickStemGeo, blackChassisMat);
    leftStem.position.set(0, 0.08, 0);

    const leftPad = new THREE.Mesh(stickPadGeo, stickRubberMat);
    leftPad.position.set(0, 0.12, 0);

    const leftRing = new THREE.Mesh(stickAccentRingGeo, neonCyanMat);
    leftRing.position.set(0, 0.12, 0);
    leftRing.rotation.x = Math.PI / 2;

    leftWell.add(leftStem);
    leftWell.add(leftPad);
    leftWell.add(leftRing);
    group.add(leftWell);

    // Right Analog Stick
    const rightWell = new THREE.Mesh(stickWellGeo, blackChassisMat);
    rightWell.position.set(0.36, -0.22, 0.24);
    rightWell.rotation.x = 0.16;

    const rightStem = new THREE.Mesh(stickStemGeo, blackChassisMat);
    rightStem.position.set(0, 0.08, 0);

    const rightPad = new THREE.Mesh(stickPadGeo, stickRubberMat);
    rightPad.position.set(0, 0.12, 0);

    const rightRing = new THREE.Mesh(stickAccentRingGeo, neonPurpleMat);
    rightRing.position.set(0, 0.12, 0);
    rightRing.rotation.x = Math.PI / 2;

    rightWell.add(rightStem);
    rightWell.add(rightPad);
    rightWell.add(rightRing);
    group.add(rightWell);

    // 7. Directional D-Pad (Left Wing)
    const dpadHoriz = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.14, 0.07), blackChassisMat);
    dpadHoriz.position.set(-0.78, 0.16, 0.24);
    const dpadVert = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.44, 0.07), blackChassisMat);
    dpadVert.position.set(-0.78, 0.16, 0.24);
    group.add(dpadHoriz);
    group.add(dpadVert);

    // 8. PlayStation Face Buttons (Triangle, Circle, Cross, Square)
    const btnGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.06, 18);
    const actionButtons = [
      { x: 0.78, y: 0.30, color: 0x22D3EE }, // Triangle (Top - Cyan)
      { x: 0.92, y: 0.16, color: 0xFF2E5B }, // Circle (Right - Red/Magenta)
      { x: 0.78, y: 0.02, color: 0x38BDF8 }, // Cross (Bottom - Blue)
      { x: 0.64, y: 0.16, color: 0xC084FC }  // Square (Left - Purple)
    ];

    actionButtons.forEach(btn => {
      const mat = new THREE.MeshStandardMaterial({
        color: btn.color,
        emissive: btn.color,
        emissiveIntensity: 2.2,
        roughness: 0.2
      });
      const mesh = new THREE.Mesh(btnGeo, mat);
      mesh.position.set(btn.x, btn.y, 0.24);
      mesh.rotation.x = Math.PI / 2;
      group.add(mesh);
    });

    // 9. Shoulder Bumpers (L1/R1) & Triggers (L2/R2)
    const bumperGeo = new THREE.BoxGeometry(0.34, 0.14, 0.22);
    const lBumper = new THREE.Mesh(bumperGeo, blackChassisMat);
    lBumper.position.set(-0.68, 0.54, -0.05);
    const rBumper = new THREE.Mesh(bumperGeo, blackChassisMat);
    rBumper.position.set(0.68, 0.54, -0.05);
    group.add(lBumper);
    group.add(rBumper);

    const triggerGeo = new THREE.BoxGeometry(0.28, 0.2, 0.18);
    const lTrigger = new THREE.Mesh(triggerGeo, metallicTriggerMat);
    lTrigger.position.set(-0.68, 0.56, -0.22);
    lTrigger.rotation.x = -0.2;
    const rTrigger = new THREE.Mesh(triggerGeo, metallicTriggerMat);
    rTrigger.position.set(0.68, 0.56, -0.22);
    rTrigger.rotation.x = -0.2;
    group.add(lTrigger);
    group.add(rTrigger);

    // 10. PlayStation Emblem & Mic Accent
    const psEmblemGeo = new THREE.BoxGeometry(0.12, 0.12, 0.02);
    const psEmblem = new THREE.Mesh(psEmblemGeo, neonCyanMat);
    psEmblem.position.set(0, -0.06, 0.25);
    group.add(psEmblem);

    return group;
  }

  /**
   * Extruded 3D YouTube Play Emblem
   */
  createExtrudedPlayIcon() {
    const group = new THREE.Group();

    const shape = new THREE.Shape();
    const size = 0.55;
    shape.moveTo(-size * 0.5, -size * 0.7);
    shape.lineTo(size * 0.75, 0);
    shape.lineTo(-size * 0.5, size * 0.7);
    shape.closePath();

    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.07,
      bevelThickness: 0.07
    };

    const playGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const playMat = new THREE.MeshStandardMaterial({
      color: 0xFF0033,
      emissive: 0xCC0029,
      emissiveIntensity: 1.5,
      roughness: 0.2,
      metalness: 0.6
    });

    const playMesh = new THREE.Mesh(playGeo, playMat);
    playMesh.position.set(0, 0, -0.1);
    group.add(playMesh);

    return group;
  }

  /**
   * Concentric Holographic Gyroscope Gimbal Rings
   */
  createHolographicGimbalRings() {
    const group = new THREE.Group();

    const ringMatPurple = new THREE.MeshStandardMaterial({
      color: 0x8B5CF6,
      emissive: 0x8B5CF6,
      emissiveIntensity: 1.2,
      roughness: 0.3,
      metalness: 0.8,
      transparent: true,
      opacity: 0.65
    });

    const ringMatCyan = new THREE.MeshStandardMaterial({
      color: 0x22D3EE,
      emissive: 0x22D3EE,
      emissiveIntensity: 1.2,
      roughness: 0.3,
      metalness: 0.8,
      transparent: true,
      opacity: 0.55
    });

    // Primary Gimbal Ring
    const ring1Geo = new THREE.TorusGeometry(3.9, 0.024, 16, 96);
    this.orbitRing1 = new THREE.Mesh(ring1Geo, ringMatPurple);
    this.orbitRing1.rotation.x = Math.PI / 3;
    this.orbitRing1.rotation.y = Math.PI / 8;
    group.add(this.orbitRing1);

    // Secondary Gimbal Ring
    const ring2Geo = new THREE.TorusGeometry(4.5, 0.02, 16, 96);
    this.orbitRing2 = new THREE.Mesh(ring2Geo, ringMatCyan);
    this.orbitRing2.rotation.x = -Math.PI / 4;
    this.orbitRing2.rotation.y = -Math.PI / 6;
    group.add(this.orbitRing2);

    // Orbiting Energy Nodes on the rings
    const nodeGeo = new THREE.SphereGeometry(0.06, 12, 12);
    this.orbitNode1 = new THREE.Mesh(nodeGeo, ringMatCyan);
    this.orbitNode2 = new THREE.Mesh(nodeGeo, ringMatPurple);
    group.add(this.orbitNode1);
    group.add(this.orbitNode2);

    return group;
  }

  /**
   * Floating Quantum Energy Relics (Cyber Crystals)
   */
  createQuantumRelics() {
    const group = new THREE.Group();

    const relicConfigs = [
      { geom: new THREE.OctahedronGeometry(0.38, 0), color: 0x22D3EE, pos: [-3.4, 1.8, -1.6], speed: [0.008, 0.006] },
      { geom: new THREE.IcosahedronGeometry(0.34, 0), color: 0x8B5CF6, pos: [3.2, -1.6, -1.2], speed: [-0.007, 0.009] },
      { geom: new THREE.DodecahedronGeometry(0.3, 0), color: 0x22D3EE, pos: [-2.4, -2.0, 0.6], speed: [0.009, -0.005] },
      { geom: new THREE.OctahedronGeometry(0.28, 0), color: 0x8B5CF6, pos: [2.6, 2.2, -0.8], speed: [-0.006, -0.007] }
    ];

    this.relicMeshes = [];
    relicConfigs.forEach((cfg, i) => {
      const mat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 1.4,
        wireframe: true,
        transparent: true,
        opacity: 0.6
      });
      const mesh = new THREE.Mesh(cfg.geom, mat);
      mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      mesh.userData = {
        baseY: cfg.pos[1],
        speedX: cfg.speed[0],
        speedY: cfg.speed[1],
        phase: i * 1.5
      };
      group.add(mesh);
      this.relicMeshes.push(mesh);
    });

    return group;
  }

  /**
   * Procedural Cosmic Particle Field with Additive Glow Sprites
   */
  createCosmicParticleField() {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 80 : 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const purple = new THREE.Color(0x8B5CF6);
    const cyan = new THREE.Color(0x22D3EE);
    const gold = new THREE.Color(0xF59E0B);
    const mixed = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const radius = 2.4 + Math.random() * 5.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[idx] = radius * Math.sin(phi) * Math.cos(theta);
      positions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[idx + 2] = radius * Math.cos(phi);

      const r = Math.random();
      if (r < 0.55) {
        mixed.lerpColors(purple, cyan, Math.random());
      } else if (r < 0.85) {
        mixed.lerpColors(cyan, gold, Math.random() * 0.4);
      } else {
        mixed.set(0xF8FAFC);
      }

      colors[idx] = mixed.r;
      colors[idx + 1] = mixed.g;
      colors[idx + 2] = mixed.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Circular soft-glow canvas sprite
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const ctx = pCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(139, 92, 246, 0.85)');
    grad.addColorStop(0.65, 'rgba(34, 211, 238, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const particleTex = new THREE.CanvasTexture(pCanvas);

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.16 : 0.22,
      map: particleTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    const group = new THREE.Group();
    group.add(this.particles);
    return group;
  }

  setupEvents() {
    // 1. Resize Handler
    this.handleResize = () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const width = Math.max(this.container.clientWidth || 0, 300);
      const height = Math.max(this.container.clientHeight || 0, 320);

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    };
    window.addEventListener('resize', this.handleResize, { passive: true });

    // 2. Pointer Move for Responsive Smooth Parallax Tilt
    this.handlePointerMove = (e) => {
      if (this.isPaused) return;
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;

      this.pointer.targetX = Math.max(-1, Math.min(1, normX));
      this.pointer.targetY = Math.max(-1, Math.min(1, normY));
    };
    window.addEventListener('pointermove', this.handlePointerMove, { passive: true });

    // 3. Tactile 360° Drag-to-Rotate (Supports mouse & touch)
    this.handlePointerDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      this.drag.isDragging = true;
      this.drag.startX = e.clientX;
      this.drag.startY = e.clientY;
      this.container.style.cursor = 'grabbing';

      if (e.pointerId && this.container.setPointerCapture) {
        try {
          this.container.setPointerCapture(e.pointerId);
        } catch {}
      }
    };

    this.handleDragMove = (e) => {
      if (!this.drag.isDragging) return;
      const deltaX = e.clientX - this.drag.startX;
      const deltaY = e.clientY - this.drag.startY;
      this.drag.startX = e.clientX;
      this.drag.startY = e.clientY;

      this.drag.targetRotY += deltaX * 0.0075;
      this.drag.targetRotX += deltaY * 0.0075;
      // Clamp vertical pitch so object doesn't flip unpleasantly
      this.drag.targetRotX = Math.max(-0.75, Math.min(0.75, this.drag.targetRotX));
    };

    this.handlePointerUp = (e) => {
      if (this.drag.isDragging) {
        this.drag.isDragging = false;
        this.container.style.cursor = 'grab';
        if (e && e.pointerId && this.container.releasePointerCapture) {
          try {
            this.container.releasePointerCapture(e.pointerId);
          } catch {}
        }
      }
    };

    this.container.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointermove', this.handleDragMove);
    window.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('pointercancel', this.handlePointerUp);

    // 4. Scroll Depth Tracking for Cinematic Camera Dolly
    this.handleScroll = () => {
      this.targetScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    };
    window.addEventListener('scroll', this.handleScroll, { passive: true });

    // 5. Visibility & Performance (Pause when hidden)
    this.handleVisibilityChange = () => {
      this.isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    // 6. Viewport Intersection Observer
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          this.isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.1 });
      this.observer.observe(this.container);
    }

    // 7. Accessibility: Reduced Motion
    this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.handleReducedMotionChange = (e) => {
      this.prefersReducedMotion = e.matches;
    };
    this.reducedMotionQuery.addEventListener('change', this.handleReducedMotionChange);
  }

  setMode(mode) {
    if (mode !== 'gaming' && mode !== 'vlogs') return;
    this.currentMode = mode;

    // Update telemetry HUD text if element exists
    const telemetryText = document.getElementById('telemetry-mode-text');
    if (telemetryText) {
      telemetryText.textContent = mode === 'gaming' ? 'DUALSENSE PS5' : 'CREATOR VLOGS';
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    window.__is3DMotionPaused = this.isPaused;
    return this.isPaused;
  }

  animate() {
    this.rafId = requestAnimationFrame(() => this.animate());

    if (!this.isVisible || !this.renderer || !this.scene || !this.camera) {
      return;
    }

    const elapsedTime = this.clock.getElapsedTime();
    const motionSpeed = this.isPaused ? 0 : (this.prefersReducedMotion ? 0.25 : 1.0);

    // 1. Smooth Pointer Parallax (Weighted spring damping)
    this.pointer.x += (this.pointer.targetX - this.pointer.x) * 0.055;
    this.pointer.y += (this.pointer.targetY - this.pointer.y) * 0.055;

    // 2. Smooth Drag Rotation & Inertia
    this.drag.rotX += (this.drag.targetRotX - this.drag.rotX) * 0.085;
    this.drag.rotY += (this.drag.targetRotY - this.drag.rotY) * 0.085;

    if (!this.drag.isDragging) {
      this.drag.targetRotX *= 0.975;
      this.drag.targetRotY *= 0.985;
    }

    // 3. Scroll Depth Dolly & Tilt
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.06;
    const scrollFactor = Math.min(this.scrollY * 0.003, 1.5);
    this.camera.position.z = 9.2 + scrollFactor * 0.8;
    this.camera.position.y = -(scrollFactor * 0.35);

    // 4. Subtle Natural Zero-G Float & Group Parallax
    const autoOrbit = Math.sin(elapsedTime * 0.45) * 0.06 * motionSpeed;
    this.interactiveGroup.rotation.y = this.drag.rotY + (this.pointer.x * 0.24 * (motionSpeed ? 1 : 0)) + autoOrbit;
    this.interactiveGroup.rotation.x = this.drag.rotX - (this.pointer.y * 0.18 * (motionSpeed ? 1 : 0));

    // 5. Mode Transitions & Lifelike Floating Physics
    const target = this.modeTargets[this.currentMode];
    const lerpSpeed = 0.055;

    if (this.controllerGroup && target.controller) {
      this.controllerGroup.position.lerp(target.controller.pos, lerpSpeed);
      const cScale = target.controller.scale;
      this.controllerGroup.scale.lerp(new THREE.Vector3(cScale, cScale, cScale), lerpSpeed);

      this.controllerGroup.rotation.x = THREE.MathUtils.lerp(this.controllerGroup.rotation.x, target.controller.rot.x, lerpSpeed);
      this.controllerGroup.rotation.y = THREE.MathUtils.lerp(this.controllerGroup.rotation.y, target.controller.rot.y, lerpSpeed);
      this.controllerGroup.rotation.z = THREE.MathUtils.lerp(this.controllerGroup.rotation.z, target.controller.rot.z, lerpSpeed);

      // Organic zero-gravity floating bobbing
      if (motionSpeed > 0) {
        const floatY = Math.sin(elapsedTime * 1.6) * 0.12 * motionSpeed;
        const floatRotY = Math.cos(elapsedTime * 0.9) * 0.04 * motionSpeed;
        const floatRotX = Math.sin(elapsedTime * 1.1) * 0.02 * motionSpeed;

        this.controllerGroup.position.y += floatY * 0.035;
        this.controllerGroup.rotation.y += floatRotY * 0.018;
        this.controllerGroup.rotation.x += floatRotX * 0.015;
      }
    }

    if (this.playIconGroup && target.playIcon) {
      this.playIconGroup.position.lerp(target.playIcon.pos, lerpSpeed);
      const pScale = target.playIcon.scale;
      this.playIconGroup.scale.lerp(new THREE.Vector3(pScale, pScale, pScale), lerpSpeed);

      if (motionSpeed > 0) {
        this.playIconGroup.rotation.y += 0.018 * motionSpeed;
        this.playIconGroup.position.y += Math.sin(elapsedTime * 2.2) * 0.003 * motionSpeed;
      }
    }

    // 6. Accent Dynamic Neon Lighting & Breathing Pulse
    if (this.accentPointLight) {
      this.accentPointLight.color.lerp(target.lightColor, 0.06);
      if (motionSpeed > 0) {
        const pulse = 1.0 + Math.sin(elapsedTime * 2.6) * 0.22;
        this.accentPointLight.intensity = target.accentIntensity * pulse;
      }
    }

    if (this.lightbar) {
      this.lightbar.material.color.lerp(target.lightColor, 0.06);
      this.lightbar.material.emissive.lerp(target.lightColor, 0.06);
      if (this.leftSideLight) {
        this.leftSideLight.material.color.lerp(target.lightColor, 0.06);
        this.leftSideLight.material.emissive.lerp(target.lightColor, 0.06);
      }
      if (this.rightSideLight) {
        this.rightSideLight.material.color.lerp(target.lightColor, 0.06);
        this.rightSideLight.material.emissive.lerp(target.lightColor, 0.06);
      }
    }

    // 7. Holographic Gimbal Rings & Orbiting Energy Nodes
    if (motionSpeed > 0) {
      if (this.orbitRing1) {
        this.orbitRing1.rotation.z += 0.006 * motionSpeed;
        this.orbitRing1.rotation.x += 0.003 * motionSpeed;
      }
      if (this.orbitRing2) {
        this.orbitRing2.rotation.z -= 0.0045 * motionSpeed;
        this.orbitRing2.rotation.y += 0.0035 * motionSpeed;
      }

      // Nodes orbit along ring perimeters
      const t = elapsedTime * 1.2 * motionSpeed;
      if (this.orbitNode1) {
        this.orbitNode1.position.set(Math.cos(t) * 3.9, Math.sin(t) * 3.9 * 0.5, Math.sin(t) * 3.9 * 0.8);
      }
      if (this.orbitNode2) {
        this.orbitNode2.position.set(Math.cos(-t * 0.8) * 4.5, Math.sin(-t * 0.8) * 4.5 * 0.7, Math.cos(-t * 0.8) * 4.5 * 0.4);
      }

      // 8. Quantum Relics Bob & Tumble
      if (this.relicMeshes) {
        this.relicMeshes.forEach(mesh => {
          mesh.rotation.x += mesh.userData.speedX * motionSpeed;
          mesh.rotation.y += mesh.userData.speedY * motionSpeed;
          mesh.position.y = mesh.userData.baseY + Math.sin(elapsedTime * 1.2 * motionSpeed + mesh.userData.phase) * 0.12;
        });
      }

      // 9. Cosmic Particle Field Slow Drift
      if (this.particles) {
        this.particles.rotation.y += 0.0016 * motionSpeed;
        this.particles.rotation.x = Math.sin(elapsedTime * 0.4) * 0.035 * motionSpeed;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointermove', this.handleDragMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    if (this.observer) this.observer.disconnect();
    if (this.reducedMotionQuery) this.reducedMotionQuery.removeEventListener('change', this.handleReducedMotionChange);

    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
