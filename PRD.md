# Product Requirements Document (PRD)

## Project: Abhiyukth Vlogs Official Channel Website
**Domain / Deployment:** [abhiyukth.github.io](https://abhiyukth.github.io/) / [Vercel](https://abhiyukthgithubio.vercel.app/)  
**YouTube Channel:** [@abhiyukthvlogs](https://www.youtube.com/@abhiyukthvlogs) (`UCuG7-r1F3b2RzGoRFIe0MnQ`)  
**Version:** 1.0.0  
**Status:** Active / Production Ready  
**Last Updated:** October 2026  

---

## 1. Executive Summary & Vision

### 1.1 Vision Statement
The official website for **Abhiyukth Vlogs** serves as an interactive, digital headquarters and community destination for fans of Malayalam PS5 gaming, high-energy live streaming, and nationwide travel chronicles. The platform combines visual appeal with high-performance web engineering to convert casual viewers into long-term subscribers and community members.

### 1.2 Core Objectives
- **Centralized Hub:** Bring together YouTube streams, gaming series, train vlogs, social channels (Instagram, Kick, Twitch, X), and creator updates in one destination.
- **Visual Engagement:** Deliver an interactive Three.js 3D hero canvas that showcases both gaming (DualSense controller) and travel/vlogging (cinematic camera) without requiring heavy external 3D asset downloads.
- **Community Milestone Celebration:** Highlight channel growth toward 10K subscribers with a real-time, YouTube Studio-style 3D rolling digit odometer and countdown bar.
- **High-Performance & Accessibility:** Maintain sub-second load times, lightweight client bundles, full WCAG 2.1 AA accessibility compliance, and zero API key exposure via secure backend endpoints.

---

## 2. Target Audience & User Personas

| Persona | Description | Needs & Goals |
|---------|-------------|---------------|
| **The Malayalam Gamer** | Fans of PS5 gameplay, GTA 5, Ghost of Tsushima, and BGMI live streams. | Wants easy access to active streams, stream replays, and multi-stream links (YouTube, Kick, Twitch). |
| **The Travel & Train Enthusiast** | Viewers following long-distance Indian Railways journeys (Kerala to Kashmir/Maharashtra, Vande Bharat, festivals). | Wants organized playlists, episodic series navigation, and scenic vlog highlights. |
| **The Community Supporter** | Dedicated fans tracking channel milestones and daily updates. | Enjoys seeing real-time subscriber counts, progress toward the 10K site goal, and direct links to connect on social media. |
| **Sponsors & Collaborators** | Brands and fellow creators exploring partnership opportunities. | Seeks verified channel statistics, audience reach, content genres, and official contact/creator bio details. |

---

## 3. Core Features & Functional Requirements

### 3.1 Interactive 3D Hero Canvas (Three.js)
- **Procedural 3D Geometry:** Custom-built PS5 DualSense controller and retro-futuristic cine camera crafted with procedural Three.js meshes (no heavy GLTF/GLB models to slow down network requests).
- **Dual Mode Switcher:**
  - `Gaming Mode`: Focuses on the PS5 DualSense controller with vibrant cyan neon accents and dynamic particle flow.
  - `Vlogs Mode`: Focuses on the cine camera with warm amber/coral neon accents and ambient motion.
- **Interaction & Physics:** Pointer-driven parallax with momentum inertia, touch-safe drag-to-rotate (`touch-action: pan-y`), and floating orbital rings.
- **Lifecycle Optimization:** Pauses rendering when scrolled offscreen or when browser tab is inactive (`requestAnimationFrame` conservation).
- **Accessibility:** Motion pause toggle button and automatic compliance with `prefers-reduced-motion: reduce`. Safe WebGL fallback with SVG monogram.

### 3.2 Real-Time Subscriber Counter & 3D Rolling Odometer
- **Studio-Style 3D Odometer:** Custom vertical ribbon digit animation where individual numbers roll smoothly through 0–9 cylinder slots with dark glassmorphic styling and subtle gradient depth masks.
- **Dual Placement:**
  - **About the Channel Profile Badge:** Compact 3D odometer display next to the creator avatar.
  - **Community Milestones Section:** Large-format 3D live studio counter celebrating channel community scale.
- **Real-Time Data Pipeline:**
  - Connects to secure local (`/api/subscribers`) and Vercel serverless endpoints.
  - In-memory 60-second caching to preserve YouTube Data API quotas.
  - Automatic fallback to verified baseline (`5,709+`) if offline or during API rate limits.
  - Reflects approximate subscriber count metrics as provided by the public YouTube Data API (which rounds counts above 1,000), or integrates creator YouTube Studio analytics / verified baselines when exact count verification is required.

### 3.3 "Road to 10K" Milestone Tracker
- **Dynamic Countdown:** Calculates remaining subscribers needed to achieve the 10,000 subscriber goal (`10,000 - Current`).
- **Progress Bar:** Real-time percentage progress bar with smooth CSS transitions and neon gradient shimmer.
- **Roadmap Milestones:** Cards outlining Current (5.7K+), Next Target (10K), and Long-Term Dream (100K Silver Play Button & 1M Gold Play Button).
- **Subscribe CTA:** One-click YouTube subscribe button with `?sub_confirmation=1` parameter.

### 3.4 Live Broadcast & Event Showcase
- **Broadcast Status Badge:** Dynamic "LIVE NOW" or "Latest Verified Stream" status indicator.
- **Event Card:** Highlights the latest or upcoming broadcast (e.g., *Ghost of Tsushima Director's Cut PS5* or special multi-streams).
- **Stream Replay Quick-Play:** Integrated direct play action triggering the zero-friction modal player.

### 3.5 Curated Video Catalog & Playlist Grid
- **Category Filter Tabs:** Instant client-side filtering by "All", "Gaming", "Vlogs", and "Live Replays".
- **Instant Search:** Real-time search by title, game name, or destination with instantaneous DOM updates and empty-state messaging.
- **Verified Metadata:** Duration badges, category labels, verified view metrics, and high-resolution YouTube thumbnails.
- **Organized Playlists:** Cards displaying video counts, playlist category tags, and direct YouTube links (Ghost of Tsushima, Train Diaries, BGMI, Komban Holidays).

### 3.6 Accessible Video Modal Player
- **Click-to-Load Iframes:** YouTube iframe embeds are injected into the DOM only upon user click, preventing unnecessary initial data transfers and third-party trackers.
- **Focus & Keyboard Trap:** Trap focus inside the modal dialog while open, with `Escape` key listener for dismissal.
- **Audio Cease:** Immediately destroys the iframe upon close to stop background audio playback.
- **External Fallback:** Direct "Watch on YouTube" anchor for restricted playback environments.

### 3.7 About & Multi-Platform Social Hub
- **Creator Biography:** Channel backstory based in Kerala, India, covering content themes and channel journey.
- **Verified Avatar:** Official YouTube avatar with geometric AV fallback fallback asset.
- **Platform Pills:** Styled pill links with brand SVG icons for:
  - **Instagram:** `@abhiyukth.vlogs`
  - **YouTube:** `@abhiyukthvlogs`
  - **Kick:** `abhiyukthvlogs`
  - **Twitch:** `abhiyukth_vlogs`
  - **X (Twitter):** `@AbhiyukthVlogs`

---

## 4. Technical Architecture

```
                       ┌─────────────────────────┐
                       │      Client Browser     │
                       │ (HTML5, Vanilla CSS/JS) │
                       └────────────┬────────────┘
                                    │
               ┌────────────────────┼────────────────────┐
               ▼                    ▼                    ▼
     ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
     │ Three.js 3D Hero │ │  3D Odometer JS  │ │ Accessible Modal │
     │  Procedural Mesh │ │ Staggered Ribbon │ │  Lazy-load Embed │
     └──────────────────┘ └──────────────────┘ └──────────────────┘
                                    │
                         GET /api/subscribers
                                    │
                     ┌──────────────┴──────────────┐
                     ▼                             ▼
         ┌──────────────────────┐      ┌──────────────────────┐
         │ Node Express Backend │      │   Vercel Serverless  │
         │     (server.js)      │      │  (api/subscribers.js)│
         └──────────┬───────────┘      └──────────┬───────────┘
                    │                             │
                    └──────────────┬──────────────┘
                                   │ HTTPS + API Key (Private .env)
                                   ▼
                    ┌─────────────────────────────┐
                    │    YouTube Data API v3      │
                    │   (google.com/youtube)      │
                    └─────────────────────────────┘
```

### 4.1 Technology Stack
- **Frontend Core:** HTML5, CSS3, JavaScript (ES6+ Modules)
- **Styling:** Vanilla CSS with custom design tokens, dark glassmorphism, fluid typography, and CSS variables
- **Build Tool:** Vite 5.x with automatic vendor chunk splitting (`three.js`, `main.js`, `scene.js`)
- **3D Graphics:** Three.js (r128+)
- **Backend / API Proxy:**
  - Node.js & Express (`server.js`) with CORS, Axios, and dotenv
  - Vercel Serverless Function (`api/subscribers.js`) with edge caching headers (`s-maxage=60`)
- **Hosting & Deployments:**
  - GitHub Pages (`abhiyukth.github.io`) via GitHub Actions CI/CD
  - Vercel (`abhiyukthgithubio.vercel.app`)

---

## 5. Security & Privacy Requirements

- **Zero Client-Side API Keys:** The YouTube Data API key (`YOUTUBE_API_KEY`) is stored strictly in server-side `.env` files and Vercel environment variables. No credentials exist in client bundles.
- **Repository Safety:** `.env` is listed in `.gitignore` and enforced against accidental commits.
- **CORS Protection:** Express and Vercel serverless functions strictly configure CORS policies and allow only safe `GET` methods.
- **Sanitized Outputs:** HTML-escaping utility functions for all dynamic strings to eliminate cross-site scripting (XSS) risks.
- **No Third-Party Tracking Cookies:** YouTube embeds utilize `youtube-nocookie.com` or lazy on-demand click-to-load iframes.

---

## 6. Non-Functional Requirements (NFRs)

| ID | Category | Requirement | Target Metric |
|----|----------|-------------|---------------|
| **NFR-01** | **Performance** | Initial page load without blocking assets | Lighthouse Performance score ≥ 90 |
| **NFR-02** | **Lightweight Assets** | No external 3D GLTF models; procedural Three.js geometry | Zero 3D model asset payloads |
| **NFR-03** | **Responsiveness** | Fluid scaling across all screen sizes | Zero horizontal scroll across 320px–3840px |
| **NFR-04** | **Accessibility** | Semantic HTML, contrast ratios, keyboard navigation | WCAG 2.1 AA compliance |
| **NFR-05** | **Motion Safety** | Honor user accessibility motion settings | `prefers-reduced-motion` halts 3D animations |
| **NFR-06** | **SEO & Social** | Complete OpenGraph, Twitter Cards, JSON-LD Schema markup | Rich snippet eligibility on Google search |
| **NFR-07** | **Reliability** | Safe fallback during YouTube API outages or quota limits | Automatic display of verified baseline stats |

---

## 7. Data Models & Channel Specifications

```json
{
  "channel": {
    "name": "Abhiyukth Vlogs",
    "handle": "@abhiyukthvlogs",
    "id": "UCuG7-r1F3b2RzGoRFIe0MnQ",
    "stats": {
      "subscribers": "5.7K",
      "subscribersCount": 5709,
      "subscribersFull": "5,709+",
      "videosCount": "608+",
      "totalViews": "2.3M+",
      "yearsActive": "4+"
    },
    "milestones": {
      "target": 10000,
      "current": 5709,
      "next": "10K",
      "dream": "100K & 1M"
    }
  }
}
```

---

## 8. Success Metrics & Key Performance Indicators (KPIs)

1. **Subscriber Growth Rate:** Increase in click-through rate to YouTube Subscribe action (`?sub_confirmation=1`).
2. **Cross-Platform Traffic:** Engagement with secondary streaming platforms (Kick, Twitch) and social profiles (Instagram).
3. **Engagement Duration:** Average session time driven by interactive 3D hero exploration and video previews.
4. **Site Reliability:** 99.9% uptime across GitHub Pages and Vercel with zero broken image or video embeds.

---

## 9. Future Roadmap & Iterations

- [ ] **Phase 1.1:** Live Chat overlay integration during active YouTube/Kick broadcasts.
- [ ] **Phase 1.2:** Discord community widget integration with online member counters.
- [ ] **Phase 1.3:** Interactive Travel Map charting past train trips across Indian states (Kozhikode, Kashmir, Maharashtra, Rajasthan).
- [ ] **Phase 1.4:** Community Fan Wall and stream highlight clips showcase.
