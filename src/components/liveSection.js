import { channelConfig } from '../data/channel.js';

const BASE_URL = import.meta?.env?.BASE_URL || '/';
const FALLBACK_AVATAR = `${BASE_URL}assets/avatar-fallback.svg`;

/**
 * Live Stream Section Component
 * 
 * Manages the single Live Stream card on Abhiyukth Vlogs:
 * - Detects active public YouTube livestream dynamically via /api/youtube/live
 * - Updates thumbnail, exact title (including Malayalam text), "LIVE NOW" badge, and watch destination
 * - Switches to "Latest Live Replay" when broadcast completes
 * - Excludes scheduled/upcoming broadcasts until they actually start
 * - Periodic 90-second refresh with tab visibility awareness and exponential error backoff
 * - In-place smooth DOM updates without flickering or resetting existing player
 * - Video modal synchronization
 */
export class LiveSection {
  constructor(videoModal) {
    this.videoModal = videoModal;
    this.container = document.getElementById('live-container');

    // Baseline state from verified config
    const baseline = channelConfig.liveStatus || {};
    this.currentStream = {
      videoId: baseline.videoId || 'KPhHbQf4JLs',
      title: baseline.liveTitle || '🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 37 | Malayalam Gameplay | Abhiyukth Vlogs',
      thumbnail: `https://i.ytimg.com/vi/${baseline.videoId || 'KPhHbQf4JLs'}/hq720.jpg`,
      watchUrl: `https://www.youtube.com/watch?v=${baseline.videoId || 'KPhHbQf4JLs'}`,
      isLive: !!baseline.isLive,
      badgeText: baseline.badgeText || 'Latest Live Replay',
      category: baseline.category || 'Gaming / PS5',
      note: baseline.note || 'Completed live broadcast replay. Catch past stream replays or join the next live stream!'
    };

    // Tracking & Timers
    this.isLoading = false;
    this.lastFetched = 0;
    this.lastLiveConfirmation = this.currentStream.isLive ? Date.now() : 0;
    this.consecutiveErrors = 0;
    this.baseRefreshIntervalMs = 90 * 1000; // 90 seconds
    this.currentIntervalMs = this.baseRefreshIntervalMs;
    this.refreshTimer = null;
    this.lastActiveModalVideoId = null;

    this.init();
  }

  init() {
    if (!this.container) return;

    // 1. Initial render with verified baseline (zero layout shift)
    this.render();

    // 2. Fetch fresh live status from backend
    this.fetchLiveStatus();

    // 3. Setup polling and visibility listeners
    this.setupAutoRefresh();
  }

  /**
   * Initial DOM render of the live section layout (card + sidebar schedule)
   */
  render() {
    if (!this.container) return;

    const stream = this.currentStream;
    const isLive = stream.isLive;
    const upcoming = channelConfig.liveStatus?.upcoming || {
      title: "MALAYALAM'S FIRST EVER GTA 6 MULTI-STREAM! 🎮🔥 മലയാളത്തിലെ ആദ്യത്തെ ലൈവ്!",
      videoId: '8aeunJTnGDM',
      badge: 'Upcoming Special Event'
    };

    this.container.innerHTML = `
      <div class="live-main-card" id="live-main-card">
        <div class="live-status-bar">
          <div class="live-indicator ${isLive ? 'is-live' : 'is-offline'}" id="live-status-indicator">
            <span class="badge-dot" id="live-badge-dot" style="${isLive ? 'background: #FF0033;' : 'background: #A7B0C0;'}"></span>
            <span id="live-status-badge">${this.escapeHtml(isLive ? 'LIVE NOW' : stream.badgeText)}</span>
          </div>
          <span class="live-category-badge" id="live-category-badge">${this.escapeHtml(stream.category)}</span>
        </div>

        <div 
          class="featured-thumb-wrap" 
          id="live-thumb-trigger" 
          tabindex="0" 
          role="button" 
          aria-label="Watch stream: ${this.escapeHtml(stream.title)}"
        >
          <img 
            src="${stream.thumbnail}" 
            alt="${this.escapeHtml(stream.title)}" 
            class="featured-thumb-img" 
            id="live-thumb-img"
            loading="lazy"
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
          <h3 class="featured-title" id="live-stream-title" style="font-size: 1.35rem;"></h3>
          <p class="featured-desc" id="live-stream-desc" style="font-size: 0.94rem;"></p>

          <div class="featured-actions" style="margin-top: 8px;">
            <button type="button" class="btn btn-primary btn-sm" id="live-play-btn">
              <span id="live-play-btn-text">${isLive ? 'Watch Live Now' : 'Watch Stream Replay'}</span>
            </button>
            <a 
              href="${stream.watchUrl}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn btn-secondary btn-sm"
              id="live-external-link"
            >
              <span id="live-external-link-text">${isLive ? 'Watch on YouTube' : 'Visit Live Tab on YouTube'}</span>
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
          <span class="badge-featured" style="margin-bottom: 12px; display: inline-block;">${this.escapeHtml(upcoming.badge)}</span>
          <h3 id="upcoming-title">${this.escapeHtml(upcoming.title)}</h3>
          <p>Get notified when the next grand multi-stream kicks off with PS5 and PC gaming sessions!</p>
          <a 
            href="https://www.youtube.com/watch?v=${upcoming.videoId}" 
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

    // Set text contents directly for accurate Unicode Malayalam handling
    const titleEl = document.getElementById('live-stream-title');
    const descEl = document.getElementById('live-stream-desc');
    if (titleEl) titleEl.textContent = stream.title;
    if (descEl) descEl.textContent = stream.note;

    // Attach robust image error fallback
    const thumbImg = document.getElementById('live-thumb-img');
    if (thumbImg) {
      thumbImg.onerror = () => {
        if (!thumbImg.src.includes('hqdefault.jpg')) {
          thumbImg.src = `https://i.ytimg.com/vi/${this.currentStream.videoId}/hqdefault.jpg`;
        } else {
          thumbImg.src = FALLBACK_AVATAR;
        }
      };
    }

    // Attach click listeners to thumbnail and watch button
    this.setupListeners();
  }

  /**
   * Setup click & keyboard interactions
   */
  setupListeners() {
    const triggerThumb = document.getElementById('live-thumb-trigger');
    const triggerBtn = document.getElementById('live-play-btn');

    const handlePlay = (trigger) => {
      this.lastActiveModalVideoId = this.currentStream.videoId;
      this.videoModal?.open(this.currentStream.videoId, this.currentStream.title, trigger);
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

  /**
   * Setup automatic polling loop and tab visibility change listener
   */
  setupAutoRefresh() {
    const scheduleNext = () => {
      if (this.refreshTimer) clearTimeout(this.refreshTimer);
      this.refreshTimer = setTimeout(async () => {
        if (!document.hidden) {
          await this.fetchLiveStatus();
        }
        scheduleNext();
      }, this.currentIntervalMs);
    };

    scheduleNext();

    // Re-check when user returns to tab if more than 60 seconds have passed
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && (Date.now() - this.lastFetched > 60 * 1000)) {
        this.fetchLiveStatus();
      }
    });
  }

  /**
   * Fetch latest live stream status from server
   */
  async fetchLiveStatus() {
    if (this.isLoading) return;
    this.isLoading = true;

    const endpoints = [
      '/api/youtube/live',
      '/api/live',
      'https://abhiyukthgithubio.vercel.app/api/youtube/live'
    ];

    let successData = null;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(8000)
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.success && data.stream) {
            successData = data;
            break;
          }
        }
      } catch (err) {
        // Continue to next endpoint fallback
      }
    }

    if (successData) {
      this.handleSuccess(successData);
    } else {
      this.handleFailure();
    }

    this.isLoading = false;
  }

  /**
   * Process successful backend discovery response
   */
  handleSuccess(data) {
    this.lastFetched = Date.now();
    this.consecutiveErrors = 0;
    this.currentIntervalMs = this.baseRefreshIntervalMs; // Reset backoff

    const isLive = !!data.isLive;
    if (isLive) {
      this.lastLiveConfirmation = Date.now();
    }

    const newStream = {
      videoId: data.stream.videoId,
      title: data.stream.title,
      thumbnail: data.stream.thumbnail || `https://i.ytimg.com/vi/${data.stream.videoId}/hq720.jpg`,
      watchUrl: data.stream.watchUrl || `https://www.youtube.com/watch?v=${data.stream.videoId}`,
      isLive: isLive,
      badgeText: isLive ? 'LIVE NOW' : (data.badgeText || 'Latest Live Replay'),
      category: data.stream.category || (isLive ? 'Live Broadcast' : 'Live Replay'),
      note: isLive
        ? 'Currently broadcasting live on YouTube! Join the stream and chat.'
        : 'Completed live broadcast replay. Catch past stream replays or join the next live stream!'
    };

    // Apply smooth updates
    this.updateCard(newStream);
  }

  /**
   * Handle API failures with resilience and backoff
   * Never interpret API failure as confirmation that the channel is offline.
   * Preserve the last successful card, but avoid presenting stale status as confirmed LIVE.
   */
  handleFailure() {
    this.consecutiveErrors++;

    // Exponential backoff: 15s -> 30s -> 60s -> max 120s
    this.currentIntervalMs = Math.min(15000 * Math.pow(2, this.consecutiveErrors - 1), 120000);

    // If previously showing LIVE, but no confirmation for > 5 minutes, demote badge to replay
    const now = Date.now();
    if (this.currentStream.isLive && (now - this.lastLiveConfirmation > 5 * 60 * 1000)) {
      this.updateCard({
        ...this.currentStream,
        isLive: false,
        badgeText: 'Latest Live Replay',
        note: 'Completed live broadcast replay. Catch past stream replays or join the next live stream!'
      });
    }
  }

  /**
   * Perform smooth, flicker-free, in-place updates to the existing card
   */
  updateCard(newStream) {
    const prev = this.currentStream;

    // Check if anything actually changed
    const videoChanged = prev.videoId !== newStream.videoId;
    const statusChanged = prev.isLive !== newStream.isLive;
    const titleChanged = prev.title !== newStream.title;
    const badgeChanged = prev.badgeText !== newStream.badgeText;

    if (!videoChanged && !statusChanged && !titleChanged && !badgeChanged) {
      return; // No change needed
    }

    // Update state reference
    this.currentStream = newStream;

    // 1. Update Indicator & Badge
    const indicatorEl = document.getElementById('live-status-indicator');
    const badgeDot = document.getElementById('live-badge-dot');
    const badgeTextEl = document.getElementById('live-status-badge');
    const categoryEl = document.getElementById('live-category-badge');

    if (indicatorEl) {
      if (newStream.isLive) {
        indicatorEl.classList.remove('is-offline');
        indicatorEl.classList.add('is-live');
      } else {
        indicatorEl.classList.remove('is-live');
        indicatorEl.classList.add('is-offline');
      }
    }

    if (badgeDot) {
      badgeDot.style.background = newStream.isLive ? '#FF0033' : '#A7B0C0';
    }

    if (badgeTextEl) {
      badgeTextEl.textContent = newStream.badgeText;
    }

    if (categoryEl) {
      categoryEl.textContent = newStream.category;
    }

    // 2. Update Thumbnail & Accessibility Trigger
    const triggerThumb = document.getElementById('live-thumb-trigger');
    const thumbImg = document.getElementById('live-thumb-img');

    if (triggerThumb) {
      triggerThumb.setAttribute('aria-label', `Watch stream: ${newStream.title}`);
    }

    if (thumbImg && (thumbImg.src !== newStream.thumbnail || videoChanged)) {
      thumbImg.src = newStream.thumbnail;
      thumbImg.alt = newStream.title;
    }

    // 3. Update Title & Description (using textContent for accurate Malayalam script display)
    const titleEl = document.getElementById('live-stream-title');
    const descEl = document.getElementById('live-stream-desc');

    if (titleEl) {
      titleEl.textContent = newStream.title;
    }

    if (descEl) {
      descEl.textContent = newStream.note;
    }

    // 4. Update Watch Button & External Links
    const playBtnText = document.getElementById('live-play-btn-text');
    const extLink = document.getElementById('live-external-link');
    const extLinkText = document.getElementById('live-external-link-text');

    if (playBtnText) {
      playBtnText.textContent = newStream.isLive ? 'Watch Live Now' : 'Watch Stream Replay';
    }

    if (extLink) {
      extLink.href = newStream.watchUrl;
    }

    if (extLinkText) {
      extLinkText.textContent = newStream.isLive ? 'Watch on YouTube' : 'Visit Live Tab on YouTube';
    }

    // 5. Update open video modal if currently watching this live stream card
    if (this.videoModal?.isOpen() && videoChanged && this.lastActiveModalVideoId === prev.videoId) {
      this.lastActiveModalVideoId = newStream.videoId;
      this.videoModal.open(newStream.videoId, newStream.title, triggerThumb);
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}
