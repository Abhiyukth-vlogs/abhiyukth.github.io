# Bolt's Journal - Critical Learnings Only

## 2026-03-30 - Catalog Filter Input DOM Thrashing
**Learning:** `renderVideoCatalog()` completely rebuilds the video grid innerHTML and queries/reattaches event listeners to all DOM card elements on every keystroke. During rapid typing, synchronous DOM teardown and recreation blocks the main thread and causes UI frame drops.
**Action:** Debounce real-time catalog search input by 150ms while instantly handling Enter and clear button clicks to keep user typing smooth without lagging the rendering pipeline.
