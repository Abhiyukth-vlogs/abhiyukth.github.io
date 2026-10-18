## 2026-03-31 - Filter and Search Live Announcer Pattern
**Learning:** Live search fields in video catalogs require both visible UI controls and dynamic ARIA live region announcements so screen reader users receive immediate feedback when filtering results or using clear shortcuts.
**Action:** When creating filter/search toolbars, include an `aria-live="polite"` element for dynamic status messages and bind the `Escape` key on search inputs to reset search state cleanly.
