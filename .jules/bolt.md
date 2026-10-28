## 2025-05-18 - Three.js Animation Loop & Pointer Reflow Optimization
**Learning:** Calling `getBoundingClientRect()` on every `pointermove` event causes layout thrashing by forcing synchronous reflows. Additionally, allocating new `THREE.Vector3` objects inside a 60 FPS `requestAnimationFrame` loop creates ~180 object allocations/second, leading to GC pressure.
**Action:** Cache bounding box dimensions on `resize`/`scroll` events, and use scalar LERP (`scale.setScalar`) for uniform object scaling in Three.js frame loops.
