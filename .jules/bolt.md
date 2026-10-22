# Bolt's Journal

## 2026-10-22 - Pre-allocated Vector3 in Three.js Animation Loop
**Learning:** In Three.js hero animation loops, instantiating `new THREE.Vector3(...)` directly inside `requestAnimationFrame` lerp calculations creates 180+ heap allocations per second at 60 FPS, leading to frequent Garbage Collection (GC) pauses and frame drops. Pre-allocating `Vector3` scale targets in object initialization structures allows zero-allocation vector lerping per frame.
**Action:** Always pre-allocate target `THREE.Vector3`, `THREE.Quaternion`, or `THREE.Color` objects during component setup and reuse them in render frame callbacks.
