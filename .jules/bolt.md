# Bolt's Performance Journal

Critical performance learnings and optimization rules for this codebase.

## 2026-03-31 - Debounced Real-Time Search & Guarded Scroll Listeners
**Learning:** Real-time search inputs that mutate the DOM via full `.innerHTML` regeneration on every `input` event trigger expensive layout recalculations, repeated garbage collection, and event listener reassignment during rapid keystrokes. Similarly, high-frequency window scroll event listeners that blindly mutate element `.classList` on every scroll tick force unnecessary CSS styling work.
**Action:** Always debounce search-driven DOM rendering by 150-200ms while keeping instant feedback (like clear buttons) synchronous. For scroll thresholds, guard mutations with a boolean state flag so `.classList.add/remove` runs only when crossing the threshold.
