# Bolt's Journal

Critical performance learnings and optimization rules for this codebase.

## 2025-05-18 - Search Catalog DOM Re-render Bottleneck
**Learning:** In vanilla DOM architectures where catalog rendering rebuilds the entire card list and re-attaches event listeners on every input event, debouncing the render function (150-200ms) prevents main-thread thrashing while typing, but clear/reset actions must cancel pending debounced renders immediately and render synchronously to avoid stale race conditions.
**Action:** When debouncing reactive DOM updates, always provide and invoke a `.cancel()` method on immediate reset handlers.
