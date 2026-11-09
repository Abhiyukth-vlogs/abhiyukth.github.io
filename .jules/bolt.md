# Bolt's Performance Journal

## 2026-03-11 - Background Tab Polling and Search Input Debounce in Vanilla DOM Apps
**Learning:** Polling loops (`setInterval`) that execute network fetches every 15 seconds continue firing indefinitely when the browser tab is hidden or backgrounded, wasting battery and network bandwidth. Furthermore, direct event binding to `<input>` events in vanilla JS rebuilds the entire DOM subtree and re-executes array filters on every keystroke.
**Action:** Always wrap background polling intervals with `if (!document.hidden)` and trigger an immediate refresh upon tab reactivation using the `visibilitychange` event. Apply a lightweight (~200ms) timer debounce to search inputs that trigger DOM rendering while keeping immediate execution on clear/reset buttons.
