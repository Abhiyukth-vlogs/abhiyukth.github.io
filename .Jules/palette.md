## 2026-03-30 - Focus-Visible Outlines for Custom Interactive Elements
**Learning:** Custom interactive elements like category tabs, mode switches, clear search buttons, and card triggers without native `<button>` styles or focus rings create a silent accessibility gap where keyboard navigation focus is invisible.
**Action:** Always include explicitly styled `:focus-visible` outlines matching the design system's accent color (`var(--accent-cyan)`) for all non-standard interactive controls.
