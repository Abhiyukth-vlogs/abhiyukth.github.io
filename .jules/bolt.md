## 2025-02-22 - Avoid Object Allocation inside 3D Animation Render Loop
**Learning:** Instantiating `new THREE.Vector3()` in every frame of a `requestAnimationFrame` loop (e.g. for scale lerping) causes ~180 heap allocations per second at 60 FPS, leading to periodic Garbage Collection (GC) pauses and micro-stutters in WebGL scenes.
**Action:** Use scalar math (`THREE.MathUtils.lerp`) combined with `scale.setScalar()` or reuse static vector instances outside the render loop for per-frame 3D object transformations.
