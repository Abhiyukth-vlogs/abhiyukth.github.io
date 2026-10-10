## 2025-05-20 - Eliminate Garbage Collection Thrashing in RAF Render Loop
**Learning:** Instantiating new objects (such as `new THREE.Vector3(...)`) inside high-frequency `requestAnimationFrame` loops creates hundreds of transient heap objects per second (180–360 allocations/sec at 60–120 FPS), causing browser Garbage Collection (GC) pauses and visual micro-stutter in 3D WebGL scenes.
**Action:** Always pre-allocate vector, matrix, and color target objects during initialization or reuse instances, lerping directly to static references in the render loop.
