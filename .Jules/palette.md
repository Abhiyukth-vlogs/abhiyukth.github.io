# Palette's UX & Accessibility Journal

## 2026-03-30 - Focus-Visible Rings on Custom Interactive Media Containers
**Learning:** Custom interactive elements (`role="button"`, `tabindex="0"`) on media cards and thumbnails often lack default browser focus indicators, rendering them invisible to keyboard-only users.
**Action:** Always complement `tabindex="0"` elements with explicit `:focus-visible` outline rings (`outline: 3px solid var(--accent-cyan); outline-offset: 2px/3px;`) and focus-triggered overlay transforms so keyboard navigation remains visual and responsive.
