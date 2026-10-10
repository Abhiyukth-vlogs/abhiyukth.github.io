## 2026-10-10 - WAI-ARIA Tablist Roving Tabindex Pattern
**Learning:** Adding `role="tablist"` and `role="tab"` requires managing roving `tabindex` (`tabindex="0"` for the active tab, `-1` for inactive tabs) along with `ArrowLeft`/`ArrowRight`/`Home`/`End` keyboard handlers so screen reader and keyboard users can seamlessly navigate category filter controls.
**Action:** Always pair `role="tablist"` with roving `tabindex` and arrow key navigation when building accessible tabbed filter controls.
