## 2025-05-18 - Pre-allocating Vector3 targets in WebGL animation loops

**Learning:** Allocating short-lived `THREE.Vector3` objects on every frame inside a `requestAnimationFrame` loop (e.g., calling `new THREE.Vector3(...)` for scale lerping) causes steady GC (Garbage Collection) memory allocation churn (~180 objects/sec at 60 FPS), which can trigger minor frame stutters or jank on mobile or lower-end devices.

**Action:** Always pre-allocate static scale and vector targets on class/scene initialization or inside target data structures, then reuse these references during per-frame `lerp` calls in the render loop.
