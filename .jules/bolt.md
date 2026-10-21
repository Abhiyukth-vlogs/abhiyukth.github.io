## 2026-10-21 - Eliminate Object Allocation in Three.js Render Loop

**Learning:** In Three.js animation loops (`requestAnimationFrame`), instantiating new objects (e.g., `new THREE.Vector3(...)`) every frame triggers frequent garbage collection (GC) pauses, causing noticeable stuttering/micro-jank on 60fps/120fps displays.
**Action:** Always pre-allocate reusable vectors, matrices, and target transformation objects outside the render loop or inside configuration objects (`modeTargets`), and use `.copy()`, `.lerp()`, or `.set()` with pre-allocated instances.
