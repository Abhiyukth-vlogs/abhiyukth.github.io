## 2025-05-18 - Three.js Vector3 allocations in 60FPS animation loop
**Learning:** Instantiating new `THREE.Vector3` objects inside requestAnimationFrame scale/position lerping creates ~180 heap allocations per second at 60fps, contributing to GC pauses and frame drops in interactive 3D WebGL scenes.
**Action:** Always pre-allocate reusable vector instances (`this.targetScaleVec`) in class constructor/init and mutate via `setScalar` or `set` inside render loops.
