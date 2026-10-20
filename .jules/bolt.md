## 2026-03-30 - Prevent per-frame object allocations in WebGL render loops

**Learning:** Instantiating objects (e.g. `new THREE.Vector3()`) inside a 60 FPS `requestAnimationFrame` loop creates 180+ heap allocations per second. This triggers periodic Garbage Collection (GC) pauses, causing visible frame drops and animation stuttering on mobile and desktop devices.
**Action:** Always pre-allocate reusable vectors or transform objects when defining scene targets or outside the animation loop, then reuse them via `.lerp()` or `.copy()` during render updates.
