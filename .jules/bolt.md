# Bolt's Performance Journal

Critical learnings regarding performance optimizations in this codebase.

## 2026-10-08 - Eliminate per-frame Vector3 allocations in Three.js render loop
**Learning:** Instantiating `new THREE.Vector3(...)` inside `requestAnimationFrame` creates 180–360 heap allocations per second (at 60–120 FPS), triggering garbage collection churn and animation micro-stutters.
**Action:** Pre-allocate all transformation target vectors (`pos`, `rot`, `scale`) and colors in configuration/state objects outside the animation loop, and pass them directly to `.lerp()`.
