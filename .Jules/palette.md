## 2026-03-30 - Escape Key Dismissal for Overlays and Search Filters
**Learning:** In vanilla JS single-page sites, mobile drawers and search inputs frequently lack standard keyboard dismissal hooks (`Escape` key), causing focus friction for screen reader and keyboard-only users.
**Action:** Always bind an `Escape` key event listener on mobile nav drawers to close the drawer and restore focus to the toggle button, and on search inputs to clear filtering.
