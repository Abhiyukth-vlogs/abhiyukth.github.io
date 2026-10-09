# Bolt's Performance Journal

## 2025-05-18 - Three.js Allocation Hotspots in Render Loops
**Learning:** Instantiating `THREE.Vector3` inside `requestAnimationFrame` creates ~180 object allocations per second at 60 FPS, leading to garbage collection spikes and animation micro-stutters.
**Action:** Pre-allocate target `THREE.Vector3` objects in configuration objects or class properties so vector math functions like `.lerp()` mutate or read static instances directly without heap allocations per frame.
