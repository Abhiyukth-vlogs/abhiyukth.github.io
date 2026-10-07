# Abhiyukth Vlogs - Official Channel Website

A modern, responsive, high-performance website for the YouTube channel **Abhiyukth Vlogs** (`@abhiyukthvlogs`), featuring an interactive Three.js 3D hero (PS5 DualSense controller & cinematic camera), verified Malayalam video highlights, livestream replays, and playlist showcase.

---

## 🎮 Highlights & Architecture

- **Interactive 3D Hero (Three.js)**:
  - Procedurally generated modern PS5 DualSense controller and stylized camera (no external 3D model assets to fail or slow down loading).
  - Mode toggle: **Gaming** vs **Vlogs** transitions focal objects, rotation, and neon lighting.
  - Orbital rings, floating 3D play symbol, and ambient particle dust field.
  - Pointer parallax with inertia and smooth touch-safe drag-to-rotate (`touch-action: pan-y`).
  - Motion pause control and automatic `prefers-reduced-motion` compliance.
  - Intelligent lifecycle: pauses rendering when offscreen or when browser tab is hidden.
  - Accessible WebGL fallback with SVG monogram.
- **Single Source of Truth Configuration**:
  - `src/data/channel.js` contains all verified channel identity, statistics, videos, playlists, and external links.
- **Verified Channel Content**:
  - Direct information from `@abhiyukthvlogs`: real subscriber count (5.7K+), total uploads (608+), 2.3M+ views, real Malayalam video titles, verified stream replays (*Ghost of Tsushima Director's Cut PS5*), and playlist collections.
- **Accessible Video Modal**:
  - Lazy-loads YouTube iframe embeds only on click.
  - Keyboard trap, `Escape` key close, focus restoration to trigger element, and immediate iframe removal to cease audio playback.
  - "Watch on YouTube" fallback link.
- **Responsive Layout**:
  - Tested across Desktop (1440px), Tablet (768px), and Mobile (390px) viewports with zero horizontal overflow.
- **Automated GitHub Pages Deployment**:
  - Configured with `vite.config.js` (`base: '/'`) and GitHub Actions workflow (`.github/workflows/deploy.yml`).

---

## 🛠️ Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow for automatic Pages deployment
├── public/
│   ├── assets/
│   │   └── avatar-fallback.svg # Geometric AV Monogram fallback avatar
│   └── favicon.svg             # SVG favicon with AV monogram & play emblem
├── src/
│   ├── components/
│   │   └── videoModal.js       # Accessible modal dialog with focus trap & lazy iframe
│   ├── data/
│   │   └── channel.js          # Channel profile, stats, verified videos & playlists
│   ├── main.js                 # App orchestrator, filters, search, drawer, & dynamic import
│   ├── scene.js                # Three.js 3D Hero scene engine (DualSense, camera, rings)
│   └── styles.css              # Vanilla CSS design system (Dark theme, tokens, responsive)
├── index.html                  # Semantic HTML5, SEO meta tags, OpenGraph, JSON-LD Schema
├── package.json                # Dependencies and npm scripts
├── vite.config.js              # Vite configuration with chunk splitting & base: '/'
└── README.md                   # Documentation and usage guide
```

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites
Ensure **Node.js** (v18 or higher) and **npm** are installed:
```bash
node -v
npm -v
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Local Dev Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 4. Build for Production
```bash
npm run build
```
The compiled bundle will be generated in `dist/`.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🌐 GitHub Pages Auto-Deployment

The repository is configured to deploy directly to `https://abhiyukth.github.io/` via GitHub Actions:

1. **Vite Base Path**:
   In `vite.config.js`, `base: '/'` is set for root domain hosting on `abhiyukth.github.io`.

2. **GitHub Actions Workflow**:
   `.github/workflows/deploy.yml` triggers automatically on pushes to the `main` branch:
   - Checks out the repository
   - Sets up Node.js 20
   - Runs `npm ci` and `npm run build`
   - Deploys the `dist/` directory to GitHub Pages

3. **Enabling GitHub Pages in Repository Settings**:
   - Go to **Repository Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
   - Every push to `main` will build and publish automatically.

---

## ⚙️ Content & Customization Guide

### How to Edit Channel Data & Social Links
Open [`src/data/channel.js`](file:///e:/abhiyukth.github.io/src/data/channel.js):
- **Channel Identity**: Edit `channel.name`, `channel.handle`, `channel.bio`, and `channel.stats`.
- **Milestones**: Update `channel.milestones` subscriber goals.
- **Social Links**: Update `links.youtube`, `links.instagram`, `links.kick`, `links.twitch`, `links.x`, and donation links.

### How to Replace the Avatar & Banner
1. Place your new profile picture in `public/assets/avatar.jpg` (or provide a direct URL).
2. In `src/data/channel.js`, update:
   ```javascript
   avatarUrl: '/assets/avatar.jpg',
   ```
3. In `index.html`, update the `src` attribute of the header `.brand-avatar` and about `.about-avatar-img`.

### How to Add Verified Videos
In `src/data/channel.js`, add new items to the `videos` array:
```javascript
{
  id: 'YOUTUBE_VIDEO_ID',
  title: 'Your Malayalam or English Video Title',
  category: 'Gaming', // 'Gaming' | 'Vlogs' | 'Live Replays'
  views: '1.2K views',
  timeAgo: '1w ago',
  duration: 'PS5 Live',
  thumbnail: 'https://i.ytimg.com/vi/YOUTUBE_VIDEO_ID/hq720.jpg'
}
```

### How to Add Playlists
In `src/data/channel.js`, add items to `playlists`:
```javascript
{
  id: 'PLAYLIST_ID',
  title: 'Series Name',
  videoCount: '12 videos',
  category: 'Travel Series',
  url: 'https://www.youtube.com/playlist?list=PLAYLIST_ID',
  thumbnail: 'https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg'
}
```

### How to Update Live Stream Status
In `src/data/channel.js`, toggle `liveStatus`:
```javascript
liveStatus: {
  isLive: true, // Set to true when broadcast is confirmed active
  badgeText: 'LIVE BROADCASTING',
  liveTitle: 'PS5 Live Stream Title',
  videoId: 'ACTIVE_VIDEO_ID',
  category: 'Gaming / PS5'
}
```

### How to Adjust Color Palette & Theme Tokens
Open [`src/styles.css`](file:///e:/abhiyukth.github.io/src/styles.css) and customize `:root`:
```css
:root {
  --bg-color: #070911;          /* Deepest space navy */
  --surface-color: #111525;     /* Card surface */
  --surface-hover: #181E34;     /* Hover surface */
  --text-main: #F5F7FF;         /* Primary text */
  --text-secondary: #A7B0C0;    /* Secondary text */
  --accent-purple: #8B5CF6;     /* Purple accent */
  --accent-cyan: #22D3EE;       /* Cyan accent */
  --yt-red: #FF0033;            /* YouTube red */
}
```

---

## 🔍 Verified Content Summary

| Category | Content Verified from `@abhiyukthvlogs` | Status |
| :--- | :--- | :--- |
| **Channel Name** | `Abhiyukth Vlogs` | Verified |
| **Handle** | `@abhiyukthvlogs` | Verified |
| **Subscribers** | `5.7K+ subscribers` | Verified |
| **Upload Count** | `608+ videos` | Verified |
| **Total Views** | `2,349,939 views` | Verified |
| **Joined Date** | `Feb 15, 2021` | Verified |
| **Country** | `India` (Kerala) | Verified |
| **Avatar & Artwork** | Original channel avatar & YouTube banner | Verified |
| **Featured Video** | Kozhikode Walkaaro Walkathon 2026 (`gxpAlDUWIOQ`) | Verified |
| **Live Stream Replay**| *IRL Ghost Of Tsushima Director's Cut: Live Ps5* (`Kw2kIt6dyU4`) | Verified |
| **Featured Playlists**| *Ghost Of Tsushima*, *PS5 Live*, *Kozhikode to Kashmir*, *GTA V*, *BGMI Live*, *Komban Holidays* | Verified |
| **Social Links** | YouTube Channel, Streams tab, Playlists tab, Instagram (`@abhiyukth.vlogs`), Kick, Twitch, X | Verified |
| **Active Live Broadcast** | Currently Offline / Showing Latest Verified Stream Replay | Verified |

---

## 🧪 Verification & Automated Testing

The website has been verified with an automated end-to-end test suite:
- **Responsive Viewports**: Tested at `1440px` (Desktop), `768px` (Tablet), and `390px` (Mobile) with `0px` horizontal overflow (`bodyScrollWidth === innerWidth`).
- **Interactive 3D Hero**: Tested mode transitions ("Gaming" vs "Vlogs"), motion pause/resume toggle, and cursor parallax.
- **Featured Video Modal**: Tested modal opening, 16:9 iframe embedding, focus trapping, Escape key closing, and playback stopping.
- **Search & Filters**: Real-time title search, category switching (Gaming, Vlogs, Live Replays), and empty state handling.
- **Mobile Menu**: Verified drawer toggle, focus accessibility, and seamless link navigation.
