## 2025-05-18 - Three.js Render Loop Scale LERPing

**Learning:** Instantiating `new THREE.Vector3()` on every frame inside `requestAnimationFrame` for uniform scale LERPing creates ~180-360 allocations/sec, leading to garbage collection pressure and animation micro-stutters.
**Action:** Use direct scalar LERPing (`currentScale + (targetScale - currentScale) * speed`) paired with `object.scale.setScalar(newScale)` to eliminate per-frame object allocations while keeping identical uniform scaling.
