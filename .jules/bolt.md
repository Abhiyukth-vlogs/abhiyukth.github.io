## 2026-03-30 - Pre-allocate Vector3 Objects Outside Render Loops

**Learning:** Instantiating temporary `THREE.Vector3` instances inside 60-120 FPS animation loops (`requestAnimationFrame`) creates significant heap garbage collection churn (~180-360 allocations/sec). Even small helper objects like `new THREE.Vector3(s, s, s)` passed to `Vector3.lerp()` trigger V8 GC pauses and frame stutter over time.

**Action:** Always pre-allocate static or target vectors outside the animation frame or store them on state target configuration objects, and use `scale.lerp(target.scaleVec, alpha)` or `scale.copy(target.scaleVec)` directly.
