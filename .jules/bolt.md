# Bolt's Journal - Critical Learnings

## 2025-02-28 - Avoid Object Allocations in Three.js Animation Loops
**Learning:** Instantiating objects (like `new THREE.Vector3()`) inside `requestAnimationFrame` render loops generates hundreds of short-lived objects per second, leading to Garbage Collection (GC) thrashing and frame stutter in WebGL scenes.
**Action:** Always pre-allocate reusable vectors, matrices, or target objects in constructor/init structures (e.g. `modeTargets`) and pass pre-allocated instances to vector math methods like `.lerp()`.
