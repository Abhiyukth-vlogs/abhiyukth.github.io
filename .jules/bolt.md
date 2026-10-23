## 2025-05-10 - Pre-allocate Vector Targets in WebGL/Three.js Render Loops
**Learning:** Instantiating `new THREE.Vector3()` or other objects inside `requestAnimationFrame` (`animate()`) loops generates heavy heap allocation churn (180+ objects/sec at 60fps), leading to Garbage Collection pauses and micro-stuttering in 3D WebGL scenes.
**Action:** Always pre-allocate target `Vector3`/`Euler`/`Color` instances in module scope, class properties, or target configurations, and use `.copy()` or direct `.lerp(targetVector)` in the render loop.
