## 2025-05-18 - Native Search Cancel Button Collision
**Learning:** Native `input[type="search"]` elements render a default `-webkit-search-cancel-button` in WebKit/Blink browsers when populated with text, which can visually overlap with custom positioned `<kbd>` hints or icons placed inside `.search-wrap`.
**Action:** Explicitly reset `input[type="search"]::-webkit-search-cancel-button` to `-webkit-appearance: none; appearance: none;` when building search inputs with internal status overlays or custom action icons.
