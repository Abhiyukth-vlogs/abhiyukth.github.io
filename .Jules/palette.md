## 2026-10-19 - Accessible Filter Tabs and Search Announcer
**Learning:** For interactive search and category filter controls, keyboard users benefit significantly from ARIA `tablist` arrow key navigation and `Escape` key query clearing, while screen reader users require a dedicated `aria-live="polite"` region to announce filtered result counts.
**Action:** When implementing tab lists or search filters in component systems, always bind `ArrowLeft`/`ArrowRight`/`Home`/`End` key listeners, handle `Escape` to clear inputs, and expose an `.sr-only` live announcer.
