## 2026-10-30 - Three.js Per-Frame Garbage Collection in Render Loop
**Learning:** Instantiating new objects (e.g. `new THREE.Vector3()`) or function closures inside `requestAnimationFrame` render loops creates heap allocation churn (~240-480 objects/sec at 60-120 FPS). This forces V8/JSC garbage collection runs, causing dropped frames and micro-jank in WebGL canvas rendering.
**Action:** Always pre-allocate reusable vectors, colors, and matrix targets in constructor/state and bind `this.animate = this.animate.bind(this)` once so the render loop runs with zero per-frame heap allocations.
