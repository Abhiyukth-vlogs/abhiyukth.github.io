# Bolt's Performance Journal

## 2025-05-18 - Zero-allocation animation loops in Three.js
**Learning:** Instantiating `THREE.Vector3` or other objects inside `requestAnimationFrame` creates unnecessary garbage collection pressure at 60-120 FPS. Pre-allocating reusable vector instances or using scalar interpolation (`setScalar` / `THREE.MathUtils.lerp`) ensures zero allocations per frame during 3D scene rendering.
**Action:** Always pre-allocate reusable vectors or use scalar interpolation methods for per-frame transforms in Three.js render loops.
