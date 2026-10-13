## 2026-10-13 - Avoid Instantiating Vector3 Objects inside 60fps Animation Loop
**Learning:** Instantiating `new THREE.Vector3(scale, scale, scale)` on every frame inside `requestAnimationFrame` creates unnecessary object allocations and triggers garbage collection pauses.
**Action:** Pre-allocate static reuse vectors or use `.setScalar(scale)` / reusable scratch vector instances outside or on class property level for lerping object scale in Three.js animation loops.
