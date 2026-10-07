import { channelConfig } from './data/channel.js';
import { VideoModal } from './components/videoModal.js';
import { Odometer } from './components/odometer.js';

const FALLBACK_AVATAR = `${import.meta.env.BASE_URL}assets/avatar-fallback.svg`;

/**
 * Main Application Orchestrator for Abhiyukth Vlogs
 */

class App {
  constructor() {
    this.videoModal = null;
    this.heroScene = null;
    this.activeCategory = 'All';
    this.searchQuery = '';

    this.init();
  }

  init() {
    // 1. Initialize Components
    this.videoModal = new VideoModal();
    this.initHeroScene();

    // 2. Render Page Sections
    this.renderFeaturedVideo();
    this.renderVideoCatalog();
    this.renderLiveSection();
    this.renderPlaylists();
    this.initLiveMilestonesCountdown();

    // 3. Setup Navigation & Interaction Listeners
    this.setupHeroControls();
    this.setupCatalogToolbar();
    this.setupNavigation();
    this.setupBackToTop();
    this.updateCopyright();
  }

  /* ---------------------------------------------------------
     Hero 3D Scene Initialization & Controls (Lazy Loaded)
     --------------------------------------------------------- */
  async initHeroScene() {
    const container = document.getElementById('hero-canvas-container');
    const fallback = document.getElementById('hero-fallback');

    if (!container) return;

    try {
      // Lazy load Three.js 3D scene module dynamically
      const { HeroScene } = await import('./scene.js');
      this.heroScene = new HeroScene(container, fallback);
    } catch (err) {
      console.warn('Failed to load 3D scene module, displaying fallback:', err);
      if (fallback) fallback.style.display = 'flex';
      if (container) container.style.display = 'none';
    }
  }

  setupHeroControls() {
    const gamingBtn = document.getElementById('mode-gaming-btn');
    const vlogsBtn = document.getElementById('mode-vlogs-btn');
    const motionBtn = document.getElementById('motion-toggle-btn');

    // Mode Toggle: Gaming
    gamingBtn?.addEventListener('click', () => {
      gamingBtn.classList.add('active');
      gamingBtn.setAttribute('aria-pressed', 'true');
      vlogsBtn?.classList.remove('active');
      vlogsBtn?.setAttribute('aria-pressed', 'false');

      if (this.heroScene) {
        this.heroScene.setMode('gaming');
      }
    });

    // Mode Toggle: Vlogs
    vlogsBtn?.addEventListener('click', () => {
      vlogsBtn.classList.add('active');
      vlogsBtn.setAttribute('aria-pressed', 'true');
      gamingBtn?.classList.remove('active');
      gamingBtn?.setAttribute('aria-pressed', 'false');

      if (this.heroScene) {
        this.heroScene.setMode('vlogs');
      }
    });

    // Motion Pause / Resume Toggle
    motionBtn?.addEventListener('click', () => {
      if (!this.heroScene) return;
      const isPaused = this.heroScene.togglePause();
      const textSpan = motionBtn.querySelector('.motion-btn-text');

      if (isPaused) {
        motionBtn.classList.add('is-paused');
        motionBtn.setAttribute('aria-label', 'Resume 3D scene animation');
        if (textSpan) textSpan.textContent = 'Resume Motion';
      } else {
        motionBtn.classList.remove('is-paused');
        motionBtn.setAttribute('aria-label', 'Pause 3D scene animation');
        if (textSpan) textSpan.textContent = 'Pause Motion';
      }
    });
  }

  /* ---------------------------------------------------------
     Featured Showcase Video
     --------------------------------------------------------- */
  renderFeaturedVideo() {
    const container = document.getElementById('featured-card');
    if (!container) return;

    const featured = channelConfig.featuredVideo;
    if (!featured) return;

    container.innerHTML = `
      <div class="featured-thumb-wrap" id="featured-thumb-trigger" tabindex="0" role="button" aria-label="Play featured video: ${this.escapeHtml(featured.title)}">
        <img 
          src="${featured.thumbnail}" 
          alt="${this.escapeHtml(featured.title)}" 
          class="featured-thumb-img" 
          loading="lazy"
          onerror="this.src='${FALLBACK_AVATAR}'"
        />
        <div class="thumb-play-overlay" aria-hidden="true">
          <div class="play-circle">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="featured-details">
        <div class="featured-badges">
          <span class="badge-featured">${featured.badge || 'Featured Video'}</span>
          <span class="badge-category">${featured.category || 'Vlogs'}</span>
        </div>

        <h3 class="featured-title">${this.escapeHtml(featured.title)}</h3>
        <p class="featured-desc">${this.escapeHtml(featured.description)}</p>

        <div class="featured-meta">
          <span>${featured.views || 'Verified Highlight'}</span>
          <span>•</span>
          <span>${featured.timeAgo || 'Recent'}</span>
        </div>

        <div class="featured-actions">
          <button type="button" class="btn btn-primary" id="featured-watch-btn">
            <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
            </svg>
            <span>Watch Preview</span>
          </button>
          <a 
            href="https://www.youtube.com/watch?v=${featured.videoId}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="btn btn-secondary"
          >
            <span>Watch on YouTube</span>
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
            </svg>
          </a>
        </div>
      </div>
    `;

    // Modal triggers
    const triggerThumb = document.getElementById('featured-thumb-trigger');
    const triggerBtn = document.getElementById('featured-watch-btn');

    const handleOpenFeatured = (trigger) => {
      this.videoModal?.open(featured.videoId, featured.title, trigger);
    };

    triggerThumb?.addEventListener('click', () => handleOpenFeatured(triggerThumb));
    triggerThumb?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpenFeatured(triggerThumb);
      }
    });
    triggerBtn?.addEventListener('click', () => handleOpenFeatured(triggerBtn));
  }

  /* ---------------------------------------------------------
     Video Catalog & Filter Management
     --------------------------------------------------------- */
  setupCatalogToolbar() {
    const tabs = document.querySelectorAll('.tab-btn');
    const searchInput = document.getElementById('video-search-input');
    const clearBtn = document.getElementById('search-clear-btn');
    const resetBtn = document.getElementById('reset-filters-btn');

    // Category Tabs
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        this.activeCategory = tab.dataset.category || 'All';
        this.renderVideoCatalog();
      });
    });

    // Real-time Search Input
    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      if (clearBtn) {
        clearBtn.style.display = this.searchQuery ? 'block' : 'none';
      }
      this.renderVideoCatalog();
    });

    // Clear Search Button
    clearBtn?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      this.searchQuery = '';
      clearBtn.style.display = 'none';
      searchInput?.focus();
      this.renderVideoCatalog();
    });

    // Reset Filters Button in Empty State
    resetBtn?.addEventListener('click', () => {
      this.activeCategory = 'All';
      this.searchQuery = '';
      if (searchInput) searchInput.value = '';
      if (clearBtn) clearBtn.style.display = 'none';

      tabs.forEach(t => {
        const isAll = (t.dataset.category || 'All') === 'All';
        t.classList.toggle('active', isAll);
        t.setAttribute('aria-selected', isAll ? 'true' : 'false');
      });

      this.renderVideoCatalog();
    });
  }

  renderVideoCatalog() {
    const grid = document.getElementById('videos-grid');
    const emptyState = document.getElementById('videos-empty-state');
    if (!grid) return;

    let filtered = channelConfig.videos;

    // Filter by Category
    if (this.activeCategory !== 'All') {
      filtered = filtered.filter(v => v.category === this.activeCategory);
    }

    // Filter by Search Query
    if (this.searchQuery) {
      filtered = filtered.filter(v => {
        const titleMatch = v.title.toLowerCase().includes(this.searchQuery);
        const categoryMatch = v.category.toLowerCase().includes(this.searchQuery);
        return titleMatch || categoryMatch;
      });
    }

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    grid.innerHTML = filtered.map(v => `
      <article class="video-card" data-video-id="${v.id}">
        <div 
          class="video-card-thumb-wrap" 
          tabindex="0" 
          role="button" 
          aria-label="Play video: ${this.escapeHtml(v.title)}"
          data-video-id="${v.id}"
          data-video-title="${this.escapeHtml(v.title)}"
        >
          <img 
            src="${v.thumbnail}" 
            alt="${this.escapeHtml(v.title)}" 
            class="video-card-thumb-img" 
            loading="lazy"
            onerror="this.src='${FALLBACK_AVATAR}'"
          />
          <span class="video-duration-badge">${v.duration || 'Video'}</span>
          <div class="video-card-play-overlay" aria-hidden="true">
            <div class="mini-play-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="video-card-content">
          <span class="video-card-category">${v.category}</span>
          <h3 class="video-card-title">${this.escapeHtml(v.title)}</h3>
          
          <div class="video-card-footer">
            <span>${v.views} • ${v.timeAgo}</span>
            <button 
              type="button" 
              class="btn-card-watch"
              data-video-id="${v.id}"
              data-video-title="${this.escapeHtml(v.title)}"
              aria-label="Watch ${this.escapeHtml(v.title)}"
            >
              <span>Watch</span>
              <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </article>
    `).join('');

    // Attach click listeners to video previews
    grid.querySelectorAll('.video-card-thumb-wrap, .btn-card-watch').forEach(trigger => {
      const vidId = trigger.getAttribute('data-video-id');
      const vidTitle = trigger.getAttribute('data-video-title');

      const handlePlay = () => {
        this.videoModal?.open(vidId, vidTitle, trigger);
      };

      trigger.addEventListener('click', handlePlay);
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handlePlay();
        }
      });
    });
  }

  /* ---------------------------------------------------------
     Live Streams Section
     --------------------------------------------------------- */
  renderLiveSection() {
    const container = document.getElementById('live-container');
    if (!container) return;

    const liveData = channelConfig.liveStatus;
    const isCurrentlyLive = liveData.isLive;

    container.innerHTML = `
      <div class="live-main-card">
        <div class="live-status-bar">
          <div class="live-indicator ${isCurrentlyLive ? 'is-live' : 'is-offline'}">
            <span class="badge-dot" style="${isCurrentlyLive ? 'background: #FF0033;' : 'background: #A7B0C0;'}"></span>
            <span>${isCurrentlyLive ? 'LIVE BROADCASTING' : liveData.badgeText}</span>
          </div>
          <span class="live-category-badge">${liveData.category}</span>
        </div>

        <div 
          class="featured-thumb-wrap" 
          id="live-thumb-trigger" 
          tabindex="0" 
          role="button" 
          aria-label="Watch stream: ${this.escapeHtml(liveData.liveTitle)}"
        >
          <img 
            src="https://i.ytimg.com/vi/${liveData.videoId}/hq720.jpg" 
            alt="${this.escapeHtml(liveData.liveTitle)}" 
            class="featured-thumb-img" 
            loading="lazy"
            onerror="this.src='${FALLBACK_AVATAR}'"
          />
          <div class="thumb-play-overlay" aria-hidden="true">
            <div class="play-circle">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="video-card-content" style="padding: 24px;">
          <h3 class="featured-title" style="font-size: 1.35rem;">${this.escapeHtml(liveData.liveTitle)}</h3>
          <p class="featured-desc" style="font-size: 0.94rem;">${this.escapeHtml(liveData.note)}</p>

          <div class="featured-actions" style="margin-top: 8px;">
            <button type="button" class="btn btn-primary btn-sm" id="live-play-btn">
              <span>Watch Stream Replay</span>
            </button>
            <a 
              href="${channelConfig.links.streams}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn btn-secondary btn-sm"
            >
              <span>Visit Live Tab on YouTube</span>
              <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" aria-hidden="true">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div class="live-side-info">
        <div class="upcoming-card">
          <span class="badge-featured" style="margin-bottom: 12px; display: inline-block;">${liveData.upcoming.badge}</span>
          <h3>${this.escapeHtml(liveData.upcoming.title)}</h3>
          <p>Get notified when the next grand multi-stream kicks off with PS5 and PC gaming sessions!</p>
          <a 
            href="https://www.youtube.com/watch?v=${liveData.upcoming.videoId}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="btn btn-secondary btn-sm"
          >
            <span>Set Reminder on YouTube</span>
          </a>
        </div>

        <div class="upcoming-card" style="background: rgba(17, 21, 37, 0.5);">
          <h3 style="font-size: 1.05rem;">Live Schedule &amp; Setup</h3>
          <p style="font-size: 0.88rem; line-height: 1.6;">
            Streams usually feature <strong>PS5 gaming</strong>, <strong>Ghost of Tsushima</strong>, <strong>GTA V/VI</strong>, and <strong>BGMI squads</strong>. Join the live chat to engage in real-time Malayalam gaming banter!
          </p>
        </div>
      </div>
    `;

    // Modal listeners for stream
    const triggerThumb = document.getElementById('live-thumb-trigger');
    const triggerBtn = document.getElementById('live-play-btn');

    const handlePlay = (trigger) => {
      this.videoModal?.open(liveData.videoId, liveData.liveTitle, trigger);
    };

    triggerThumb?.addEventListener('click', () => handlePlay(triggerThumb));
    triggerThumb?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handlePlay(triggerThumb);
      }
    });
    triggerBtn?.addEventListener('click', () => handlePlay(triggerBtn));
  }

  /* ---------------------------------------------------------
     Playlists Section
     --------------------------------------------------------- */
  renderPlaylists() {
    const grid = document.getElementById('playlists-grid');
    if (!grid) return;

    grid.innerHTML = channelConfig.playlists.map(p => `
      <a 
        href="${p.url}" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="playlist-card"
        aria-label="Open YouTube playlist: ${this.escapeHtml(p.title)} (${p.videoCount})"
      >
        <div class="playlist-thumb-wrap">
          <img 
            src="${p.thumbnail}" 
            alt="${this.escapeHtml(p.title)}" 
            class="playlist-thumb-img" 
            loading="lazy"
            onerror="this.src='${FALLBACK_AVATAR}'"
          />
          <div class="playlist-overlay-badge">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zm-8-2l6-4-6-4v8z"/>
            </svg>
            <span class="playlist-count">${p.videoCount}</span>
          </div>
        </div>

        <div class="playlist-content">
          <span class="playlist-category">${p.category}</span>
          <h3 class="playlist-title">${this.escapeHtml(p.title)}</h3>
        </div>
      </a>
    `).join('');
  }

  /* ---------------------------------------------------------
     Navigation, Active Section Tracking, Mobile Drawer
     --------------------------------------------------------- */
  setupNavigation() {
    const header = document.getElementById('site-header');
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navDrawer = document.getElementById('mobile-nav-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky header shadow on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    }, { passive: true });

    // Mobile Hamburger Menu Toggle
    menuToggle?.addEventListener('click', () => {
      const isOpen = navDrawer?.classList.contains('is-open');
      if (isOpen) {
        navDrawer?.classList.remove('is-open');
        navDrawer?.setAttribute('aria-hidden', 'true');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
      } else {
        navDrawer?.classList.add('is-open');
        navDrawer?.setAttribute('aria-hidden', 'false');
        menuToggle.classList.add('is-active');
        menuToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close mobile drawer when clicking a link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        navDrawer?.classList.remove('is-open');
        navDrawer?.setAttribute('aria-hidden', 'true');
        menuToggle?.classList.remove('is-active');
        menuToggle?.setAttribute('aria-expanded', 'false');
      });
    });

    // Active Section Observer for Desktop Navigation
    const sections = document.querySelectorAll('section[id]');
    if ('IntersectionObserver' in window && sections.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              const href = link.getAttribute('href')?.replace('#', '');
              if (href === currentId) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      }, { rootMargin: '-40% 0px -40% 0px' });

      sections.forEach(sec => observer.observe(sec));
    }
  }

  /* ---------------------------------------------------------
     Back to Top Scroll
     --------------------------------------------------------- */
  setupBackToTop() {
    const btn = document.getElementById('back-to-top-btn');
    btn?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------
     Dynamic Copyright Year
     --------------------------------------------------------- */
  updateCopyright() {
    const yearEl = document.getElementById('footer-copyright');
    if (yearEl) {
      const year = new Date().getFullYear();
      yearEl.innerHTML = `&copy; ${year} Abhiyukth Vlogs. All verified channel content &copy; original creator.`;
    }
  }

  /* ---------------------------------------------------------
     Live Subscriber Countdown & Community Milestones
     Channel ID: UCuG7-r1F3b2RzGoRFIe0MnQ (@abhiyukthvlogs)
     Target: 10,000 (10K) | Current Baseline: 5,710 (5.7K)
     Next: 10K | Dream: 100K & 1M
     --------------------------------------------------------- */
  initLiveMilestonesCountdown() {
    const container = document.getElementById('milestones-container');
    const liveCountEl = document.getElementById('milestone-live-count');
    const subsLeftEl = document.getElementById('milestone-subs-left');
    const progressPctEl = document.getElementById('milestone-progress-pct');
    const progressFillEl = document.getElementById('milestone-progress-fill');
    const progressbarEl = document.getElementById('milestone-progressbar');
    const heroStatSubscribers = document.getElementById('stat-subscribers');
    const cardCurrentEl = document.getElementById('milestone-card-current');
    const aboutLiveSubEl = document.getElementById('about-live-sub-counter');

    if (!container || !liveCountEl || !subsLeftEl) return;

    // Initialize 3D Rolling Digit Odometers
    const milestoneOdometer = new Odometer(liveCountEl, { duration: 950, stagger: 55 });
    const aboutOdometer = aboutLiveSubEl ? new Odometer(aboutLiveSubEl, { duration: 900, stagger: 45 }) : null;

    const channelId = channelConfig.channel?.id || 'UCuG7-r1F3b2RzGoRFIe0MnQ';
    const targetSubscribers = 10000;
    let currentSubscribers = channelConfig.channel?.milestones?.current || 5710;
    let hasAnimated = false;

    // Set initial static values before scroll animation
    milestoneOdometer.update(currentSubscribers, false);
    if (aboutOdometer) aboutOdometer.update(currentSubscribers, false);

    // Helper: update all UI counters and bars smoothly
    const updateUI = (count, animateOdometer = true) => {
      const subsLeft = Math.max(0, targetSubscribers - count);
      const percentage = Math.min(100, Math.max(0, (count / targetSubscribers) * 100));

      // 3D Rolling Digit update
      milestoneOdometer.update(count, animateOdometer);
      if (aboutOdometer) aboutOdometer.update(count, animateOdometer);

      subsLeftEl.textContent = Number(subsLeft).toLocaleString();
      if (progressPctEl) progressPctEl.textContent = `${percentage.toFixed(1)}%`;
      if (progressFillEl) progressFillEl.style.width = `${percentage.toFixed(1)}%`;
      if (progressbarEl) progressbarEl.setAttribute('aria-valuenow', percentage.toFixed(0));

      const formattedK = count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toString();
      if (cardCurrentEl) cardCurrentEl.textContent = formattedK;
      if (heroStatSubscribers) heroStatSubscribers.textContent = `${formattedK}+`;
    };

    // Trigger 3D rolling animation when milestones card scrolls into viewport
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            updateUI(currentSubscribers, true);
            observer.disconnect();
          }
        });
      }, { threshold: 0.15 });
      observer.observe(container);
    } else {
      updateUI(currentSubscribers, true);
    }

    // Auto-update: Query real-time subscriber count with multiple redundant live endpoints
    const fetchLiveCount = async () => {
      try {
        const endpoints = [
          // 1. Same-origin backend (works on Vercel or local Express)
          '/api/subscribers',
          // 2. Deployed Vercel proxy (works from GitHub Pages abhiyukth.github.io)
          'https://abhiyukthgithubio.vercel.app/api/subscribers',
          // 3. High-availability live YouTube counter with CORS *
          `https://mixerno.space/api/youtube-channel-counter/user/${channelId}`,
          // 4. Local dev port
          'http://localhost:5000/api/subscribers'
        ];

        for (const url of endpoints) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4500);
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.ok) {
              const data = await res.json();
              let fetchedCount = null;
              let fetchedViews = null;
              let fetchedVideos = null;

              // Check if custom backend returned valid live count
              if (data?.success && typeof data?.subscriberCount === 'number') {
                fetchedCount = data.subscriberCount;
                fetchedViews = data.viewCount;
                fetchedVideos = data.videoCount;
              } else if (Array.isArray(data?.counts)) {
                // mixerno.space live response
                const subItem = data.counts.find(c => c.value === 'subscribers' || c.value === 'apisubscribers');
                if (subItem && subItem.count) {
                  fetchedCount = Number(subItem.count);
                }
                const viewItem = data.counts.find(c => c.value === 'views');
                if (viewItem && viewItem.count) {
                  fetchedViews = Number(viewItem.count);
                }
                const vidItem = data.counts.find(c => c.value === 'videos');
                if (vidItem && vidItem.count) {
                  fetchedVideos = Number(vidItem.count);
                }
              } else if (data?.estSubCount) {
                fetchedCount = Number(data.estSubCount);
              }

              if (fetchedCount && !isNaN(fetchedCount) && fetchedCount >= 1000 && fetchedCount <= 50000000) {
                const finalCount = Math.max(fetchedCount, 5710);
                if (finalCount !== currentSubscribers) {
                  currentSubscribers = finalCount;
                  updateUI(currentSubscribers, true);
                }

                // Update metric counters if live view/video data is present
                if (fetchedVideos) {
                  const statVideos = document.getElementById('stat-videos');
                  if (statVideos) statVideos.textContent = `${fetchedVideos}+`;
                }
                if (fetchedViews) {
                  const statViews = document.getElementById('stat-views');
                  if (statViews) {
                    const viewsInM = (fetchedViews / 1000000).toFixed(1);
                    statViews.textContent = `${viewsInM}M+`;
                  }
                }
                return;
              }
            }
          } catch (innerErr) {
            // Gracefully ignore and try next source
          }
        }
      } catch (err) {
        // Safe baseline remains active
      }
    };

    // Auto-update: Initial check and poll every 15 seconds for live studio sync
    fetchLiveCount();
    setInterval(fetchLiveCount, 15000);
  }

  /* ---------------------------------------------------------
     Security Helper: Escape HTML strings
     --------------------------------------------------------- */
  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Bootstrap Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
