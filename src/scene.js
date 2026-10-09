import * as THREE from 'three';

/**
 * Interactive 3D Hero Scene for Abhiyukth Vlogs
 * Built with procedural geometries: DualSense PS5 controller, stylized camera,
 * orbital rings, play emblem, and subtle particle field.
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

    // Animation targets for mode transitions (pre-allocate scale vectors to avoid per-frame GC allocations)
    this.modeTargets = {
      gaming: {
        controller: { pos: new THREE.Vector3(0, 0, 0), rot: new THREE.Vector3(0.1, -0.2, 0.05), scale: 1.15, scaleVec: new THREE.Vector3(1.15, 1.15, 1.15) },
        camera: { pos: new THREE.Vector3(2.4, -1.3, -1.8), rot: new THREE.Vector3(-0.2, -0.6, 0.1), scale: 0.65, scaleVec: new THREE.Vector3(0.65, 0.65, 0.65) },
        playIcon: { pos: new THREE.Vector3(-1.8, 1.5, -0.8), rot: new THREE.Vector3(0, 0.4, 0), scale: 0.8, scaleVec: new THREE.Vector3(0.8, 0.8, 0.8) },
        lightColor: new THREE.Color(0x8B5CF6)
      },
      vlogs: {
        controller: { pos: new THREE.Vector3(-2.4, -1.3, -1.8), rot: new THREE.Vector3(0.2, 0.6, -0.1), scale: 0.65, scaleVec: new THREE.Vector3(0.65, 0.65, 0.65) },
        camera: { pos: new THREE.Vector3(0, 0, 0), rot: new THREE.Vector3(0.05, 0.25, 0), scale: 1.2, scaleVec: new THREE.Vector3(1.2, 1.2, 1.2) },
        playIcon: { pos: new THREE.Vector3(1.8, 1.5, -0.8), rot: new THREE.Vector3(0, -0.4, 0), scale: 0.8, scaleVec: new THREE.Vector3(0.8, 0.8, 0.8) },
        lightColor: new THREE.Color(0x22D3EE)
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
    if (this.fallback) {
      this.fallback.style.display = 'flex';
    }
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  setupScene() {
    this.scene = new THREE.Scene();

    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 500;

    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 8.5);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });

    const isMobile = window.innerWidth < 768;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    this.renderer.setSize(width, height);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.setAttribute('aria-hidden', 'true');

    // Root interactive group that responds to drag & parallax
    this.interactiveGroup = new THREE.Group();
    this.scene.add(this.interactiveGroup);
  }

  setupLights() {
    // Ambient soft blue/indigo fill
    const ambientLight = new THREE.AmbientLight(0x0e1428, 1.8);
    this.scene.add(ambientLight);

    // Main key light (cyan-tinted)
    const keyLight = new THREE.DirectionalLight(0x22D3EE, 2.2);
    keyLight.position.set(6, 6, 8);
    this.scene.add(keyLight);

    // Rim / Back light (purple-tinted)
    const rimLight = new THREE.DirectionalLight(0x8B5CF6, 2.6);
    rimLight.position.set(-6, -4, -4);
    this.scene.add(rimLight);

    // Top gentle white fill
    const topLight = new THREE.DirectionalLight(0xffffff, 1.2);
    topLight.position.set(0, 8, 4);
    this.scene.add(topLight);

    // Dynamic accent point light that shifts tone with mode
    this.accentPointLight = new THREE.PointLight(0x8B5CF6, 3.5, 12, 1.2);
    this.accentPointLight.position.set(0, 0.5, 2.5);
    this.scene.add(this.accentPointLight);
  }

  buildObjects() {
    this.controllerGroup = this.createController();
    this.cameraGroup = this.createCamera();
    this.playIconGroup = this.createPlayIcon();
    this.ringsGroup = this.createOrbitalRings();
    this.particlesGroup = this.createParticleField();

    this.interactiveGroup.add(this.controllerGroup);
    this.interactiveGroup.add(this.cameraGroup);
    this.interactiveGroup.add(this.playIconGroup);
    this.interactiveGroup.add(this.ringsGroup);
    this.interactiveGroup.add(this.particlesGroup);

    // Set initial positions according to initial mode ('gaming')
    const initMode = this.modeTargets.gaming;
    this.controllerGroup.position.copy(initMode.controller.pos);
    this.controllerGroup.rotation.setFromVector3(initMode.controller.rot);
    this.controllerGroup.scale.setScalar(initMode.controller.scale);

    this.cameraGroup.position.copy(initMode.camera.pos);
    this.cameraGroup.rotation.setFromVector3(initMode.camera.rot);
    this.cameraGroup.scale.setScalar(initMode.camera.scale);

    this.playIconGroup.position.copy(initMode.playIcon.pos);
    this.playIconGroup.rotation.setFromVector3(initMode.playIcon.rot);
    this.playIconGroup.scale.setScalar(initMode.playIcon.scale);
  }

  createController() {
    const group = new THREE.Group();

    // High quality materials
    const whitePlastic = new THREE.MeshStandardMaterial({
      color: 0xEEF2FF,
      roughness: 0.32,
      metalness: 0.1
    });

    const blackPlastic = new THREE.MeshStandardMaterial({
      color: 0x0E111A,
      roughness: 0.5,
      metalness: 0.15
    });

    const neonPurple = new THREE.MeshStandardMaterial({
      color: 0x8B5CF6,
      emissive: 0x8B5CF6,
      emissiveIntensity: 1.8,
      roughness: 0.2
    });

    const neonCyan = new THREE.MeshStandardMaterial({
      color: 0x22D3EE,
      emissive: 0x22D3EE,
      emissiveIntensity: 1.6,
      roughness: 0.2
    });

    // Central Bridge (Controller middle chassis)
    const bridgeGeo = new THREE.BoxGeometry(1.4, 0.9, 0.45);
    const bridge = new THREE.Mesh(bridgeGeo, whitePlastic);
    bridge.position.set(0, 0.05, 0);
    group.add(bridge);

    // Left Handle (Ergonomic DualSense Grip flared outward)
    const handleGeo = new THREE.CapsuleGeometry(0.26, 1.0, 16, 24);
    const leftHandle = new THREE.Mesh(handleGeo, whitePlastic);
    leftHandle.position.set(-0.82, -0.26, 0.02);
    leftHandle.rotation.z = -Math.PI / 7.5;
    leftHandle.rotation.x = 0.1;
    group.add(leftHandle);

    // Right Handle (Ergonomic DualSense Grip flared outward)
    const rightHandle = new THREE.Mesh(handleGeo, whitePlastic);
    rightHandle.position.set(0.82, -0.26, 0.02);
    rightHandle.rotation.z = Math.PI / 7.5;
    rightHandle.rotation.x = 0.1;
    group.add(rightHandle);

    // Black Center-Grip Insert & Bottom contour
    const underGripGeo = new THREE.CapsuleGeometry(0.24, 0.95, 12, 20);
    const underGrip = new THREE.Mesh(underGripGeo, blackPlastic);
    underGrip.position.set(0, -0.32, 0.02);
    underGrip.rotation.z = Math.PI / 2;
    group.add(underGrip);

    // Touchpad (center top)
    const touchpadGeo = new THREE.BoxGeometry(0.72, 0.46, 0.08);
    const touchpad = new THREE.Mesh(touchpadGeo, blackPlastic);
    touchpad.position.set(0, 0.18, 0.22);
    group.add(touchpad);

    // Glowing Lightbar strip surrounding touchpad
    const lightbarGeo = new THREE.BoxGeometry(0.78, 0.04, 0.04);
    this.lightbar = new THREE.Mesh(lightbarGeo, neonPurple);
    this.lightbar.position.set(0, 0.42, 0.23);
    group.add(this.lightbar);

    // Dual Analog Sticks (Thumbsticks)
    const stickBaseGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.14, 24);
    const stickTopGeo = new THREE.CylinderGeometry(0.2, 0.16, 0.06, 24);

    // Left Analog Stick
    const leftStickBase = new THREE.Mesh(stickBaseGeo, blackPlastic);
    leftStickBase.position.set(-0.35, -0.22, 0.25);
    leftStickBase.rotation.x = 0.15;
    const leftStickTop = new THREE.Mesh(stickTopGeo, blackPlastic);
    leftStickTop.position.set(0, 0.08, 0);
    leftStickBase.add(leftStickTop);
    group.add(leftStickBase);

    // Right Analog Stick
    const rightStickBase = new THREE.Mesh(stickBaseGeo, blackPlastic);
    rightStickBase.position.set(0.35, -0.22, 0.25);
    rightStickBase.rotation.x = 0.15;
    const rightStickTop = new THREE.Mesh(stickTopGeo, blackPlastic);
    rightStickTop.position.set(0, 0.08, 0);
    rightStickBase.add(rightStickTop);
    group.add(rightStickBase);

    // D-Pad Cross (Left Wing)
    const dpadH = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.13, 0.06), blackPlastic);
    dpadH.position.set(-0.76, 0.15, 0.23);
    const dpadV = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.42, 0.06), blackPlastic);
    dpadV.position.set(-0.76, 0.15, 0.23);
    group.add(dpadH);
    group.add(dpadV);

    // Action Buttons (Right Wing: Triangle, Circle, Cross, Square)
    const btnGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.06, 16);
    const btnPositions = [
      { x: 0.76, y: 0.28, mat: neonCyan },    // Triangle (Top)
      { x: 0.89, y: 0.15, mat: neonPurple },  // Circle (Right)
      { x: 0.76, y: 0.02, mat: neonCyan },    // Cross (Bottom)
      { x: 0.63, y: 0.15, mat: neonPurple }   // Square (Left)
    ];

    btnPositions.forEach(p => {
      const btn = new THREE.Mesh(btnGeo, p.mat);
      btn.position.set(p.x, p.y, 0.23);
      btn.rotation.x = Math.PI / 2;
      group.add(btn);
    });

    // Shoulder Triggers & Bumpers (L1/R1)
    const triggerGeo = new THREE.BoxGeometry(0.32, 0.12, 0.2);
    const lTrigger = new THREE.Mesh(triggerGeo, blackPlastic);
    lTrigger.position.set(-0.68, 0.52, -0.05);
    const rTrigger = new THREE.Mesh(triggerGeo, blackPlastic);
    rTrigger.position.set(0.68, 0.52, -0.05);
    group.add(lTrigger);
    group.add(rTrigger);

    return group;
  }

  createCamera() {
    const group = new THREE.Group();

    // High end materials
    const metallicBody = new THREE.MeshStandardMaterial({
      color: 0x1E2235,
      metalness: 0.85,
      roughness: 0.25
    });

    const lensDark = new THREE.MeshStandardMaterial({
      color: 0x0B0D15,
      metalness: 0.6,
      roughness: 0.15
    });

    const cyanLensRing = new THREE.MeshStandardMaterial({
      color: 0x22D3EE,
      emissive: 0x22D3EE,
      emissiveIntensity: 1.2,
      metalness: 0.8,
      roughness: 0.2
    });

    const lensGlass = new THREE.MeshStandardMaterial({
      color: 0x103048,
      emissive: 0x082032,
      roughness: 0.05,
      metalness: 0.95
    });

    const tallyRed = new THREE.MeshStandardMaterial({
      color: 0xFF0033,
      emissive: 0xFF0033,
      emissiveIntensity: 2.2,
      roughness: 0.2
    });

    // Main Camera Body
    const bodyGeo = new THREE.BoxGeometry(2.0, 1.3, 0.9);
    const body = new THREE.Mesh(bodyGeo, metallicBody);
    group.add(body);

    // Front Grip Rubber Strip
    const gripGeo = new THREE.BoxGeometry(0.35, 1.2, 0.15);
    const gripMat = new THREE.MeshStandardMaterial({ color: 0x11131c, roughness: 0.8 });
    const grip = new THREE.Mesh(gripGeo, gripMat);
    grip.position.set(-0.8, 0, 0.48);
    group.add(grip);

    // Camera Lens Outer Barrel
    const barrelGeo = new THREE.CylinderGeometry(0.62, 0.65, 0.9, 32);
    const barrel = new THREE.Mesh(barrelGeo, lensDark);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0.2, 0, 0.75);
    group.add(barrel);

    // Anodized Cyan Focus Ring on Lens
    const ringGeo = new THREE.TorusGeometry(0.63, 0.035, 16, 32);
    const accentRing = new THREE.Mesh(ringGeo, cyanLensRing);
    accentRing.position.set(0.2, 0, 0.9);
    group.add(accentRing);

    // Front Glass Element
    const glassGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.05, 32);
    const glass = new THREE.Mesh(glassGeo, lensGlass);
    glass.rotation.x = Math.PI / 2;
    glass.position.set(0.2, 0, 1.22);
    group.add(glass);

    // Viewfinder / Top Prism
    const prismGeo = new THREE.BoxGeometry(0.6, 0.35, 0.6);
    const prism = new THREE.Mesh(prismGeo, metallicBody);
    prism.position.set(0.2, 0.8, 0);
    group.add(prism);

    // Red Recording Tally Light
    const tallyGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const tally = new THREE.Mesh(tallyGeo, tallyRed);
    tally.position.set(-0.6, 0.5, 0.48);
    group.add(tally);

    // Top Shutter Release Button
    const shutterGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 20);
    const shutterMat = new THREE.MeshStandardMaterial({ color: 0xE8ECF8, metalness: 0.9, roughness: 0.1 });
    const shutter = new THREE.Mesh(shutterGeo, shutterMat);
    shutter.position.set(-0.7, 0.72, 0.15);
    group.add(shutter);

    // Mode Dial
    const dialGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.12, 20);
    const dial = new THREE.Mesh(dialGeo, lensDark);
    dial.position.set(0.75, 0.7, 0.05);
    group.add(dial);

    return group;
  }

  createPlayIcon() {
    const group = new THREE.Group();

    // 3D YouTube Play Triangle
    const shape = new THREE.Shape();
    const size = 0.5;
    shape.moveTo(-size * 0.5, -size * 0.7);
    shape.lineTo(size * 0.7, 0);
    shape.lineTo(-size * 0.5, size * 0.7);
    shape.closePath();

    const extrudeSettings = {
      depth: 0.18,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.06
    };

    const playGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const playMat = new THREE.MeshStandardMaterial({
      color: 0xFF0033,
      emissive: 0x990022,
      emissiveIntensity: 1.1,
      roughness: 0.25,
      metalness: 0.4
    });

    const playMesh = new THREE.Mesh(playGeo, playMat);
    playMesh.position.set(0, 0, -0.09);
    group.add(playMesh);

    return group;
  }

  createOrbitalRings() {
    const group = new THREE.Group();

    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x8B5CF6,
      emissive: 0x8B5CF6,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.65
    });

    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x22D3EE,
      emissive: 0x22D3EE,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.55
    });

    // Primary orbital ring
    const ring1Geo = new THREE.TorusGeometry(3.6, 0.022, 16, 80);
    this.orbitRing1 = new THREE.Mesh(ring1Geo, ringMat1);
    this.orbitRing1.rotation.x = Math.PI / 3;
    this.orbitRing1.rotation.y = Math.PI / 6;
    group.add(this.orbitRing1);

    // Secondary orbital ring
    const ring2Geo = new THREE.TorusGeometry(4.2, 0.018, 16, 80);
    this.orbitRing2 = new THREE.Mesh(ring2Geo, ringMat2);
    this.orbitRing2.rotation.x = -Math.PI / 4;
    this.orbitRing2.rotation.y = -Math.PI / 5;
    group.add(this.orbitRing2);

    return group;
  }

  createParticleField() {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 40 : 85;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const purple = new THREE.Color(0x8B5CF6);
    const cyan = new THREE.Color(0x22D3EE);
    const mixed = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Spread in a spherical radius
      const radius = 2.5 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[idx] = radius * Math.sin(phi) * Math.cos(theta);
      positions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[idx + 2] = radius * Math.cos(phi);

      // Interpolate between cyan and purple
      mixed.lerpColors(cyan, purple, Math.random());
      colors[idx] = mixed.r;
      colors[idx + 1] = mixed.g;
      colors[idx + 2] = mixed.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    const group = new THREE.Group();
    group.add(this.particles);
    return group;
  }

  setupEvents() {
    // Resize handler
    this.handleResize = () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      if (width === 0 || height === 0) return;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    };
    window.addEventListener('resize', this.handleResize);

    // Pointer move for gentle parallax (only on non-touch or large devices)
    this.handlePointerMove = (e) => {
      if (this.prefersReducedMotion || this.isPaused) return;
      const rect = this.container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      // Clamp target
      this.pointer.targetX = Math.max(-1, Math.min(1, normX));
      this.pointer.targetY = Math.max(-1, Math.min(1, normY));
    };
    window.addEventListener('pointermove', this.handlePointerMove);

    // Drag-to-rotate within the canvas
    // NOTE: Does NOT capture touch events with preventDefault so page scroll remains completely unobstructed!
    this.handlePointerDown = (e) => {
      if (e.button !== 0) return; // Left click only
      this.drag.isDragging = true;
      this.drag.startX = e.clientX;
      this.drag.startY = e.clientY;
    };

    this.handleDragMove = (e) => {
      if (!this.drag.isDragging) return;
      const deltaX = e.clientX - this.drag.startX;
      const deltaY = e.clientY - this.drag.startY;
      this.drag.startX = e.clientX;
      this.drag.startY = e.clientY;

      this.drag.targetRotY += deltaX * 0.006;
      this.drag.targetRotX += deltaY * 0.006;
      // Clamp X rotation so it doesn't flip upside down
      this.drag.targetRotX = Math.max(-0.6, Math.min(0.6, this.drag.targetRotX));
    };

    this.handlePointerUp = () => {
      this.drag.isDragging = false;
    };

    this.container.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointermove', this.handleDragMove);
    window.addEventListener('pointerup', this.handlePointerUp);

    // Pause rendering when tab is hidden
    this.handleVisibilityChange = () => {
      this.isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    // Observe intersection with viewport to pause when scrolled out
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          this.isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.1 });
      this.observer.observe(this.container);
    }

    // Media query listener for reduced motion
    this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.handleReducedMotionChange = (e) => {
      this.prefersReducedMotion = e.matches;
    };
    this.reducedMotionQuery.addEventListener('change', this.handleReducedMotionChange);
  }

  setMode(mode) {
    if (mode !== 'gaming' && mode !== 'vlogs') return;
    this.currentMode = mode;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  animate() {
    this.rafId = requestAnimationFrame(() => this.animate());

    if (!this.isVisible || !this.renderer || !this.scene || !this.camera) {
      return;
    }

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Pointer Parallax smoothing (LERP)
    this.pointer.x += (this.pointer.targetX - this.pointer.x) * 0.05;
    this.pointer.y += (this.pointer.targetY - this.pointer.y) * 0.05;

    // 2. Drag Rotation smoothing
    this.drag.rotX += (this.drag.targetRotX - this.drag.rotX) * 0.08;
    this.drag.rotY += (this.drag.targetRotY - this.drag.rotY) * 0.08;

    // Slowly return drag rotation to center when not dragging
    if (!this.drag.isDragging) {
      this.drag.targetRotX *= 0.985;
      this.drag.targetRotY *= 0.985;
    }

    // Apply parallax & drag to interactive group
    if (!this.prefersReducedMotion && !this.isPaused) {
      this.interactiveGroup.rotation.y = this.drag.rotY + (this.pointer.x * 0.22);
      this.interactiveGroup.rotation.x = this.drag.rotX - (this.pointer.y * 0.18);
    } else {
      this.interactiveGroup.rotation.set(0, 0, 0);
    }

    // 3. Mode Transitions (Smooth lerp towards target transforms)
    const target = this.modeTargets[this.currentMode];
    const lerpSpeed = 0.06;

    if (this.controllerGroup && target.controller) {
      this.controllerGroup.position.lerp(target.controller.pos, lerpSpeed);
      this.controllerGroup.scale.lerp(target.controller.scaleVec, lerpSpeed);
      
      // Floating bobbing motion
      if (!this.prefersReducedMotion && !this.isPaused) {
        const floatOffset = Math.sin(elapsedTime * 1.5) * 0.08;
        this.controllerGroup.position.y += floatOffset * 0.03;
        this.controllerGroup.rotation.y += Math.cos(elapsedTime * 0.8) * 0.002;
      }
    }

    if (this.cameraGroup && target.camera) {
      this.cameraGroup.position.lerp(target.camera.pos, lerpSpeed);
      this.cameraGroup.scale.lerp(target.camera.scaleVec, lerpSpeed);

      if (!this.prefersReducedMotion && !this.isPaused) {
        const floatOffset = Math.cos(elapsedTime * 1.3) * 0.08;
        this.cameraGroup.position.y += floatOffset * 0.03;
        this.cameraGroup.rotation.y += Math.sin(elapsedTime * 0.7) * 0.002;
      }
    }

    if (this.playIconGroup && target.playIcon) {
      this.playIconGroup.position.lerp(target.playIcon.pos, lerpSpeed);
      this.playIconGroup.scale.lerp(target.playIcon.scaleVec, lerpSpeed);

      if (!this.prefersReducedMotion && !this.isPaused) {
        this.playIconGroup.rotation.y += 0.015;
      }
    }

    // 4. Accent light color transition
    if (this.accentPointLight) {
      this.accentPointLight.color.lerp(target.lightColor, 0.05);
    }
    if (this.lightbar) {
      this.lightbar.material.color.lerp(target.lightColor, 0.05);
      this.lightbar.material.emissive.lerp(target.lightColor, 0.05);
    }

    // 5. Orbital rings & particle slow drift
    if (!this.prefersReducedMotion && !this.isPaused) {
      if (this.orbitRing1) this.orbitRing1.rotation.z += 0.003;
      if (this.orbitRing2) this.orbitRing2.rotation.z -= 0.0025;
      if (this.particles) this.particles.rotation.y += 0.001;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('pointermove', this.handlePointerMove);
    this.container.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointermove', this.handleDragMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    if (this.observer) this.observer.disconnect();
    if (this.reducedMotionQuery) this.reducedMotionQuery.removeEventListener('change', this.handleReducedMotionChange);

    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
