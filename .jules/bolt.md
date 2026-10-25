## 2026-10-25 - Avoid Vector3 allocations in Three.js RequestAnimationFrame loop

**Learning:** Creating new `THREE.Vector3` objects inside a `requestAnimationFrame` render loop (60-120 FPS) introduces garbage collection pressure and micro-stutters. Reusing a single pre-allocated `THREE.Vector3` instance with `.setScalar()` or `.set()` eliminates per-frame object allocations while maintaining exact functionality.

**Action:** When working with Three.js or animation frame updates, declare reusable temp vectors on class instances (`this.targetVec = new THREE.Vector3()`) and mutate them per frame instead of allocating new vector instances inside `animate()`.
