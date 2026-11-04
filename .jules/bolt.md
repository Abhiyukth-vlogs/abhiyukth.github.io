# Bolt's Performance Journal

Critical performance learnings and optimization rules for this codebase.

## 2025-05-18 - Client-Side Search Event Debouncing
**Learning:** In purely vanilla JS client-rendered catalogs where every filter cycle clears `innerHTML` and re-attaches full event listeners (`click`, `keydown`) per card, continuous un-debounced `input` events cause heavy layout thrashing and main-thread freezing during fast typing.
**Action:** Always debounce catalog text search inputs (~150ms) while keeping empty/clear events immediate so snappy UX is preserved without spamming DOM recreation.
