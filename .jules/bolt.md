## 2026-03-30 - Eliminate Vector Allocations in Three.js Animation Loops

**Learning:** Instantiating `THREE.Vector3` instances inside a 60 FPS `requestAnimationFrame` loop creates 180 heap allocations per second (over 10,000 objects/minute). In Three.js applications, this causes memory churn and triggers JavaScript Garbage Collection (GC) pauses, resulting in visual jank/frame drops.

**Action:** Always pre-allocate target transformation vectors (position, rotation, scale) during object or mode initialization, and call `.lerp(targetVector, alpha)` directly inside the render loop to ensure zero allocations per frame.
