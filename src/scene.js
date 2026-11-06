import * as THREE from 'three';

/**
 * Exact PlayStation 5 DualSense Controller 3D Experience
 * Authentic two-tone sculpted ergonomics: ceramic white outer shell, midnight inner chassis,
 * 3-sided glowing LED lightbar enveloping the touchpad, textured dual analog thumbsticks with
 * concave thumb cups, crystal PlayStation action buttons (△, ○, ✕, □), 4-way D-Pad, L1/R1 bumpers,
 * and flared L2/R2 adaptive triggers.
 *
 * 3D Style: Futuristic Gaming Universe
 * Main 3D Object: Exact Floating PS5 DualSense Controller
 * Lighting: Neon Purple (#8B5CF6) & Electric Cyan (#22D3EE)
 * Interactivity: 360° Tactile Drag, Smooth Mouse Parallax, Scroll Depth Dolly
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
        controller: { pos: new THREE.Vector3(0, 0.05, 0), rot: new THREE.Vector3(0.14, -0.25, 0.06), scale: 1.3 },
        playIcon: { pos: new THREE.Vector3(-2.8, 1.6, -1.8), rot: new THREE.Vector3(0, 0.55, 0.1), scale: 0.8 },
        lightColor: new THREE.Color(0x8B5CF6), // Neon Purple
        accentIntensity: 5.2
      },
      vlogs: {
        controller: { pos: new THREE.Vector3(-2.3, -0.5, -1.2), rot: new THREE.Vector3(0.18, 0.6, -0.08), scale: 0.9 },
        playIcon: { pos: new THREE.Vector3(1.2, 0.25, 0.5), rot: new THREE.Vector3(0, -0.35, 0), scale: 1.3 },
        lightColor: new THREE.Color(0x22D3EE), // Electric Cyan
        accentIntensity: 4.8
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

    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
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
    this.renderer.toneMappingExposure = 1.3;

    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.setAttribute('aria-hidden', 'true');

    // Root interactive group that responds to drag, cursor parallax & auto-orbit
    this.interactiveGroup = new THREE.Group();
    this.scene.add(this.interactiveGroup);
  }

  setupLights() {
    // 1. Deep cosmic indigo ambient fill
    const ambientLight = new THREE.AmbientLight(0x0b1020, 2.4);
    this.scene.add(ambientLight);

    // 2. Key Light (Electric Cyan specular highlights)
    const keyLight = new THREE.DirectionalLight(0x22D3EE, 3.4);
    keyLight.position.set(6, 6, 7);
    this.scene.add(keyLight);

    // 3. Rim / Silhouette Light (Neon Purple razor edge glow)
    const rimLight = new THREE.DirectionalLight(0x8B5CF6, 3.8);
    rimLight.position.set(-6, -4, -5);
    this.scene.add(rimLight);

    // 4. Top White Studio Gleam for clearcoat plastic reflections
    const topLight = new THREE.DirectionalLight(0xffffff, 1.8);
    topLight.position.set(0, 9, 3);
    this.scene.add(topLight);

    // 5. DualSense Lightbar Spill Point Light (Directly illuminates the white casing)
    this.lightbarSpillLight = new THREE.PointLight(0x8B5CF6, 3.2, 5, 1.5);
    this.lightbarSpillLight.position.set(0, 0.45, 0.6);
    this.scene.add(this.lightbarSpillLight);

    // 6. Breathing Ambient Haptic Glow
    this.accentPointLight = new THREE.PointLight(0x8B5CF6, 4.8, 14, 1.2);
    this.accentPointLight.position.set(0, 0.4, 2.8);
    this.scene.add(this.accentPointLight);
  }

  buildObjects() {
    this.controllerGroup = this.createExactPS5DualSense();
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
   * Exact Procedural PlayStation 5 DualSense Controller
   * Recreates the genuine two-tone geometry, sculpted ergonomic wing handles,
   * black inner boomerang core, touchpad with 3-sided glowing lightbar,
   * symmetrical thumbsticks with concave thumb cups, clear PlayStation action buttons
   * with floating colored glyphs, directional D-Pad, L1/R1 bumpers, and L2/R2 triggers.
   */
  createExactPS5DualSense() {
    const group = new THREE.Group();

    // -------------------------------------------------------------
    // 1. Materials
    // -------------------------------------------------------------
    // Ceramic White Outer Shell with Clearcoat
    const ps5WhiteMat = new THREE.MeshPhysicalMaterial({
      color: 0xF8FAFC,
      roughness: 0.16,
      metalness: 0.05,
      clearcoat: 0.9,
      clearcoatRoughness: 0.12,
      reflectivity: 0.6
    });

    // Matte Midnight Inner Chassis
    const ps5BlackChassisMat = new THREE.MeshStandardMaterial({
      color: 0x090B10,
      roughness: 0.6,
      metalness: 0.15
    });

    // Satin Touchpad Plate
    const touchpadMat = new THREE.MeshStandardMaterial({
      color: 0x12151D,
      roughness: 0.45,
      metalness: 0.1
    });

    // Rubber Thumbstick Material
    const stickRubberMat = new THREE.MeshStandardMaterial({
      color: 0x111319,
      roughness: 0.8,
      metalness: 0.05
    });

    // Metallic Trigger Material
    const triggerMetallicMat = new THREE.MeshStandardMaterial({
      color: 0x1C202C,
      roughness: 0.22,
      metalness: 0.85
    });

    // Acrylic Clear Button Material
    const crystalButtonMat = new THREE.MeshPhysicalMaterial({
      color: 0xE2E8F0,
      roughness: 0.08,
      transmission: 0.7,
      thickness: 0.15,
      transparent: true,
      opacity: 0.85,
      clearcoat: 1.0
    });

    // Dynamic LED Lightbar Emissive Material
    this.lightbarMat = new THREE.MeshBasicMaterial({
      color: 0x8B5CF6
    });

    // -------------------------------------------------------------
    // 2. White Ergonomic Outer Shell & Side Wing Handles
    // -------------------------------------------------------------
    // Center Top Bridge Chassis
    const bridgeGeo = new THREE.BoxGeometry(1.5, 0.95, 0.44, 4, 4, 4);
    const bridge = new THREE.Mesh(bridgeGeo, ps5WhiteMat);
    bridge.position.set(0, 0.08, 0.02);
    group.add(bridge);

    // Left Handle Wing (Angled downward and slightly outward)
    const handleGeo = new THREE.CapsuleGeometry(0.27, 1.1, 16, 24);

    const leftHandle = new THREE.Mesh(handleGeo, ps5WhiteMat);
    leftHandle.position.set(-0.86, -0.28, 0.02);
    leftHandle.rotation.z = -Math.PI / 7.5;
    leftHandle.rotation.x = 0.14;
    group.add(leftHandle);

    // Right Handle Wing
    const rightHandle = new THREE.Mesh(handleGeo, ps5WhiteMat);
    rightHandle.position.set(0.86, -0.28, 0.02);
    rightHandle.rotation.z = Math.PI / 7.5;
    rightHandle.rotation.x = 0.14;
    group.add(rightHandle);

    // White Top Shoulder Arch (Connecting over the touchpad)
    const shoulderArchGeo = new THREE.BoxGeometry(1.65, 0.18, 0.38);
    const shoulderArch = new THREE.Mesh(shoulderArchGeo, ps5WhiteMat);
    shoulderArch.position.set(0, 0.54, 0.05);
    group.add(shoulderArch);

    // -------------------------------------------------------------
    // 3. Black Inner Chassis & "Boomerang" Under-Grip Insert
    // -------------------------------------------------------------
    // Lower center core bridging between the grips
    const underCoreGeo = new THREE.CapsuleGeometry(0.25, 1.05, 12, 20);
    const underCore = new THREE.Mesh(underCoreGeo, ps5BlackChassisMat);
    underCore.position.set(0, -0.34, 0.04);
    underCore.rotation.z = Math.PI / 2;
    group.add(underCore);

    // Left black grip under-insert
    const leftInnerGrip = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.85, 12, 16), ps5BlackChassisMat);
    leftInnerGrip.position.set(-0.62, -0.32, -0.02);
    leftInnerGrip.rotation.z = -Math.PI / 8;
    group.add(leftInnerGrip);

    // Right black grip under-insert
    const rightInnerGrip = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.85, 12, 16), ps5BlackChassisMat);
    rightInnerGrip.position.set(0.62, -0.32, -0.02);
    rightInnerGrip.rotation.z = Math.PI / 8;
    group.add(rightInnerGrip);

    // -------------------------------------------------------------
    // 4. Satin Touchpad Plate & 3-Sided Glowing LED Lightbar
    // -------------------------------------------------------------
    // Touchpad (slightly trapezoidal shape)
    const touchpadGeo = new THREE.BoxGeometry(0.78, 0.52, 0.08);
    const touchpad = new THREE.Mesh(touchpadGeo, touchpadMat);
    touchpad.position.set(0, 0.22, 0.23);
    group.add(touchpad);

    // 3-Sided DualSense Lightbar Ribbon
    // Top lightbar strip
    const topBarGeo = new THREE.BoxGeometry(0.82, 0.04, 0.04);
    this.topLightbar = new THREE.Mesh(topBarGeo, this.lightbarMat);
    this.topLightbar.position.set(0, 0.49, 0.24);
    group.add(this.topLightbar);

    // Left lightbar strip
    const sideBarGeo = new THREE.BoxGeometry(0.04, 0.46, 0.035);
    this.leftLightbar = new THREE.Mesh(sideBarGeo, this.lightbarMat);
    this.leftLightbar.position.set(-0.41, 0.24, 0.235);
    this.leftLightbar.rotation.z = 0.08;
    group.add(this.leftLightbar);

    // Right lightbar strip
    this.rightLightbar = new THREE.Mesh(sideBarGeo, this.lightbarMat);
    this.rightLightbar.position.set(0.41, 0.24, 0.235);
    this.rightLightbar.rotation.z = -0.08;
    group.add(this.rightLightbar);

    // -------------------------------------------------------------
    // 5. Symmetrical Analog Thumbsticks (Authentic DualSense Profile)
    // -------------------------------------------------------------
    // Lathe geometry creates the exact thumbstick curve: base dome, slender stem,
    // concave thumb cup, raised grip ring, and subtle center dome!
    const stickPoints = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.23, 0),
      new THREE.Vector2(0.21, 0.07),
      new THREE.Vector2(0.12, 0.13),
      new THREE.Vector2(0.12, 0.26),
      new THREE.Vector2(0.23, 0.30),
      new THREE.Vector2(0.22, 0.36),
      new THREE.Vector2(0.17, 0.35),
      new THREE.Vector2(0.08, 0.33),
      new THREE.Vector2(0, 0.335)
    ];
    const stickGeo = new THREE.LatheGeometry(stickPoints, 32);
    const stickWellGeo = new THREE.CylinderGeometry(0.25, 0.27, 0.06, 32);

    // Left Thumbstick Housing Well
    const leftWell = new THREE.Mesh(stickWellGeo, ps5BlackChassisMat);
    leftWell.position.set(-0.36, -0.21, 0.22);
    leftWell.rotation.x = 0.18;
    group.add(leftWell);

    // Left Stick Body
    this.leftStick = new THREE.Mesh(stickGeo, stickRubberMat);
    this.leftStick.position.set(-0.36, -0.21, 0.22);
    this.leftStick.rotation.x = 0.18;
    group.add(this.leftStick);

    // Left Stick Glowing Base Accent Ring
    const stickRingGeo = new THREE.TorusGeometry(0.235, 0.014, 12, 32);
    const leftStickRing = new THREE.Mesh(stickRingGeo, new THREE.MeshBasicMaterial({ color: 0x22D3EE }));
    leftStickRing.position.set(-0.36, -0.21, 0.25);
    leftStickRing.rotation.x = 0.18;
    group.add(leftStickRing);

    // Right Thumbstick Housing Well
    const rightWell = new THREE.Mesh(stickWellGeo, ps5BlackChassisMat);
    rightWell.position.set(0.36, -0.21, 0.22);
    rightWell.rotation.x = 0.18;
    group.add(rightWell);

    // Right Stick Body
    this.rightStick = new THREE.Mesh(stickGeo, stickRubberMat);
    this.rightStick.position.set(0.36, -0.21, 0.22);
    this.rightStick.rotation.x = 0.18;
    group.add(this.rightStick);

    // Right Stick Glowing Base Accent Ring
    const rightStickRing = new THREE.Mesh(stickRingGeo, new THREE.MeshBasicMaterial({ color: 0x8B5CF6 }));
    rightStickRing.position.set(0.36, -0.21, 0.25);
    rightStickRing.rotation.x = 0.18;
    group.add(rightStickRing);

    // -------------------------------------------------------------
    // 6. PlayStation Face Buttons (Triangle, Circle, Cross, Square)
    // Clear crystal buttons with embedded neon glowing symbols!
    // -------------------------------------------------------------
    const buttonBaseGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.07, 24);
    const buttonPlacements = [
      // 1. Triangle △ (Top - Neon Cyan)
      {
        x: 0.82, y: 0.32, color: 0x22D3EE,
        createGlyph: () => {
          const g = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.009, 8, 3), new THREE.MeshBasicMaterial({ color: 0x22D3EE }));
          g.rotation.z = Math.PI / 2;
          return g;
        }
      },
      // 2. Circle ○ (Right - Neon Red/Magenta)
      {
        x: 0.98, y: 0.16, color: 0xFF2E5B,
        createGlyph: () => new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.009, 12, 24), new THREE.MeshBasicMaterial({ color: 0xFF2E5B }))
      },
      // 3. Cross ✕ (Bottom - Electric Blue)
      {
        x: 0.82, y: 0.0, color: 0x38BDF8,
        createGlyph: () => {
          const crossGroup = new THREE.Group();
          const barMat = new THREE.MeshBasicMaterial({ color: 0x38BDF8 });
          const bar1 = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.018, 0.01), barMat);
          bar1.rotation.z = Math.PI / 4;
          const bar2 = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.018, 0.01), barMat);
          bar2.rotation.z = -Math.PI / 4;
          crossGroup.add(bar1);
          crossGroup.add(bar2);
          return crossGroup;
        }
      },
      // 4. Square □ (Left - Neon Purple/Pink)
      {
        x: 0.66, y: 0.16, color: 0xC084FC,
        createGlyph: () => {
          const g = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.009, 8, 4), new THREE.MeshBasicMaterial({ color: 0xC084FC }));
          g.rotation.z = Math.PI / 4;
          return g;
        }
      }
    ];

    buttonPlacements.forEach(btn => {
      // Clear crystal button cylinder
      const btnMesh = new THREE.Mesh(buttonBaseGeo, crystalButtonMat);
      btnMesh.position.set(btn.x, btn.y, 0.25);
      btnMesh.rotation.x = Math.PI / 2;
      group.add(btnMesh);

      // Embedded glowing glyph
      const glyph = btn.createGlyph();
      glyph.position.set(btn.x, btn.y, 0.285);
      group.add(glyph);
    });

    // -------------------------------------------------------------
    // 7. Symmetrical Directional Pad (D-Pad on Left Wing)
    // -------------------------------------------------------------
    const dpadArmGeo = new THREE.BoxGeometry(0.14, 0.19, 0.08);
    const dpadPlacements = [
      { x: -0.82, y: 0.26, rot: 0 },             // Up
      { x: -0.82, y: 0.06, rot: Math.PI },       // Down
      { x: -0.92, y: 0.16, rot: Math.PI / 2 },   // Left
      { x: -0.72, y: 0.16, rot: -Math.PI / 2 }   // Right
    ];

    dpadPlacements.forEach(p => {
      const arm = new THREE.Mesh(dpadArmGeo, ps5BlackChassisMat);
      arm.position.set(p.x, p.y, 0.25);
      arm.rotation.z = p.rot;
      group.add(arm);

      // Directional arrow indentation indicator
      const arrowIndicator = new THREE.Mesh(
        new THREE.ConeGeometry(0.025, 0.04, 3),
        new THREE.MeshBasicMaterial({ color: 0x475569 })
      );
      arrowIndicator.position.set(p.x, p.y + (p.rot === 0 ? 0.04 : (p.rot === Math.PI ? -0.04 : 0)), 0.29);
      if (p.rot === Math.PI) arrowIndicator.rotation.z = Math.PI;
      if (p.rot === Math.PI / 2) {
        arrowIndicator.position.set(p.x - 0.04, p.y, 0.29);
        arrowIndicator.rotation.z = Math.PI / 2;
      }
      if (p.rot === -Math.PI / 2) {
        arrowIndicator.position.set(p.x + 0.04, p.y, 0.29);
        arrowIndicator.rotation.z = -Math.PI / 2;
      }
      group.add(arrowIndicator);
    });

    // -------------------------------------------------------------
    // 8. Create & Options Buttons (Pill Buttons next to Touchpad)
    // -------------------------------------------------------------
    const smallPillGeo = new THREE.CapsuleGeometry(0.035, 0.11, 8, 12);

    // Create (Share) Button
    const createBtn = new THREE.Mesh(smallPillGeo, ps5BlackChassisMat);
    createBtn.position.set(-0.52, 0.44, 0.23);
    createBtn.rotation.z = -0.4;
    group.add(createBtn);

    // Options Button
    const optionsBtn = new THREE.Mesh(smallPillGeo, ps5BlackChassisMat);
    optionsBtn.position.set(0.52, 0.44, 0.23);
    optionsBtn.rotation.z = 0.4;
    group.add(optionsBtn);

    // -------------------------------------------------------------
    // 9. PlayStation Home Button, Mute Button & Speaker Grille
    // -------------------------------------------------------------
    // PS Logo Button (between the thumbsticks)
    const psBtnGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 24);
    const psBtn = new THREE.Mesh(psBtnGeo, ps5BlackChassisMat);
    psBtn.position.set(0, -0.04, 0.24);
    psBtn.rotation.x = Math.PI / 2;
    group.add(psBtn);

    // PS Emblem Relief
    const psLogoShape = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.05, 0.015),
      new THREE.MeshBasicMaterial({ color: 0x94A3B8 })
    );
    psLogoShape.position.set(0, -0.04, 0.265);
    group.add(psLogoShape);

    // Microphone Mute Button (horizontal pill below PS button)
    const muteBtnGeo = new THREE.CapsuleGeometry(0.025, 0.1, 8, 12);
    const muteBtn = new THREE.Mesh(muteBtnGeo, ps5BlackChassisMat);
    muteBtn.position.set(0, -0.16, 0.23);
    muteBtn.rotation.z = Math.PI / 2;
    group.add(muteBtn);

    // Mute LED Indicator (amber/cyan)
    this.muteLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.015, 0.01),
      new THREE.MeshBasicMaterial({ color: 0xF59E0B })
    );
    this.muteLed.position.set(0, -0.16, 0.245);
    group.add(this.muteLed);

    // Speaker Grille Dot Array (between touchpad and PS button)
    for (let row = 0; row < 3; row++) {
      for (let col = -2; col <= 2; col++) {
        const dot = new THREE.Mesh(
          new THREE.CircleGeometry(0.008, 8),
          new THREE.MeshBasicMaterial({ color: 0x1E293B })
        );
        dot.position.set(col * 0.035, 0.04 + row * 0.03, 0.245);
        group.add(dot);
      }
    }

    // -------------------------------------------------------------
    // 10. Shoulder Bumpers (L1/R1) and Adaptive Triggers (L2/R2)
    // -------------------------------------------------------------
    // L1 Bumper
    const bumperGeo = new THREE.BoxGeometry(0.36, 0.14, 0.24);
    const l1Bumper = new THREE.Mesh(bumperGeo, ps5BlackChassisMat);
    l1Bumper.position.set(-0.7, 0.58, -0.04);
    l1Bumper.rotation.y = 0.12;
    group.add(l1Bumper);

    // R1 Bumper
    const r1Bumper = new THREE.Mesh(bumperGeo, ps5BlackChassisMat);
    r1Bumper.position.set(0.7, 0.58, -0.04);
    r1Bumper.rotation.y = -0.12;
    group.add(r1Bumper);

    // L2 Adaptive Trigger (Contoured outward trigger with pivot)
    const triggerGeo = new THREE.BoxGeometry(0.28, 0.22, 0.22);
    const l2Trigger = new THREE.Mesh(triggerGeo, triggerMetallicMat);
    l2Trigger.position.set(-0.7, 0.62, -0.22);
    l2Trigger.rotation.x = -0.28;
    l2Trigger.rotation.y = 0.1;
    group.add(l2Trigger);

    // R2 Adaptive Trigger
    const r2Trigger = new THREE.Mesh(triggerGeo, triggerMetallicMat);
    r2Trigger.position.set(0.7, 0.62, -0.22);
    r2Trigger.rotation.x = -0.28;
    r2Trigger.rotation.y = -0.1;
    group.add(r2Trigger);

    // USB-C Charging Port on Top Edge
    const portGeo = new THREE.BoxGeometry(0.12, 0.05, 0.06);
    const usbPort = new THREE.Mesh(portGeo, ps5BlackChassisMat);
    usbPort.position.set(0, 0.64, -0.08);
    group.add(usbPort);

    // 3.5mm Headphone Jack on Bottom Chin
    const jackGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 16);
    const audioJack = new THREE.Mesh(jackGeo, ps5BlackChassisMat);
    audioJack.position.set(0, -0.46, 0.04);
    group.add(audioJack);

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
      opacity: 0.6
    });

    const ringMatCyan = new THREE.MeshStandardMaterial({
      color: 0x22D3EE,
      emissive: 0x22D3EE,
      emissiveIntensity: 1.2,
      roughness: 0.3,
      metalness: 0.8,
      transparent: true,
      opacity: 0.5
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

        // Subtle idle thumbstick micro-movements
        if (this.leftStick) {
          this.leftStick.rotation.z = Math.sin(elapsedTime * 2.0) * 0.05;
          this.leftStick.rotation.x = 0.18 + Math.cos(elapsedTime * 1.7) * 0.04;
        }
        if (this.rightStick) {
          this.rightStick.rotation.z = Math.cos(elapsedTime * 1.8) * 0.04;
          this.rightStick.rotation.x = 0.18 + Math.sin(elapsedTime * 2.2) * 0.05;
        }
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

    // 6. Accent Dynamic Neon Lighting & Lightbar Pulse
    if (this.accentPointLight) {
      this.accentPointLight.color.lerp(target.lightColor, 0.06);
      if (motionSpeed > 0) {
        const pulse = 1.0 + Math.sin(elapsedTime * 2.6) * 0.22;
        this.accentPointLight.intensity = target.accentIntensity * pulse;
      }
    }

    if (this.lightbarSpillLight) {
      this.lightbarSpillLight.color.lerp(target.lightColor, 0.06);
      if (motionSpeed > 0) {
        const pulse = 1.0 + Math.sin(elapsedTime * 2.6) * 0.3;
        this.lightbarSpillLight.intensity = 3.2 * pulse;
      }
    }

    if (this.lightbarMat) {
      this.lightbarMat.color.lerp(target.lightColor, 0.06);
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
