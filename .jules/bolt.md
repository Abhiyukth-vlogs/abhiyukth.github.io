## 2026-10-29 - Zero-Allocation Three.js Animation Loops
**Learning:** Instantiating `THREE.Vector3` or other geometry/math instances inside a 60FPS `requestAnimationFrame` loop creates hundreds of temporary objects per second, leading to periodic Garbage Collection pauses and micro-stutters during rendering.
**Action:** Always pre-allocate reusable vectors on the class (e.g. `this._targetScaleVector = new THREE.Vector3()`) and mutate them with `.setScalar()` or `.set()` before `lerp()` operations inside render loops.
