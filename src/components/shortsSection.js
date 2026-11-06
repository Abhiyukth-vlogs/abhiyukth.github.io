import { channelConfig } from '../data/channel.js';

/**
 * YouTube Shorts Section Component
 * Manages responsive 9:16 cards, auto-discovery fetching via /api/youtube/shorts,
 * 5-minute periodic auto-refresh, pagination (Load More), and mobile swipeable carousel.
 */
export class ShortsSection {
  constructor(videoModal) {
    this.videoModal = videoModal;
    this.container = document.getElementById('shorts-container');
    this.gridEl = document.getElementById('shorts-grid');
    this.loadMoreBtn = document.getElementById('shorts-load-more-btn');
    this.statusPill = document.getElementById('shorts-status-pill');
    this.statusText = document.getElementById('shorts-status-text');

    // State
    this.shorts = [...(channelConfig.shorts || [])];
    this.visibleCount = 12;
    this.isLoading = false;
    this.lastFetched = 0;
    this.refreshIntervalMs = 5 * 60 * 1000; // 5 minutes
    this.refreshTimer = null;

    this.init();
  }

  init() {
    if (!this.gridEl) return;

    // Render initial curated snapshot immediately (zero latency)
    this.render();

    // Setup interactive handlers
    this.setupListeners();

    // Fetch live feed from server endpoint
    this.fetchLiveShorts();

    // Setup 5-minute automatic refresh loop while page is visible
    this.setupAutoRefresh();
  }

  setupListeners() {
    // Load More button
    this.loadMoreBtn?.addEventListener('click', () => {
      this.visibleCount += 8;
      this.render();
    });

    // Mobile scroll navigation arrows (for touch/non-touch horizontal scrolling)
    const prevBtn = document.getElementById('shorts-scroll-prev');
    const nextBtn = document.getElementById('shorts-scroll-next');

    prevBtn?.addEventListener('click', () => {
      if (this.gridEl) {
        this.gridEl.scrollBy({ left: -280, behavior: 'smooth' });
      }
    });

    nextBtn?.addEventListener('click', () => {
      if (this.gridEl) {
        this.gridEl.scrollBy({ left: 280, behavior: 'smooth' });
      }
    });
  }

  setupAutoRefresh() {
    // Periodic interval
    this.refreshTimer = setInterval(() => {
      if (!document.hidden) {
        this.fetchLiveShorts();
      }
    }, this.refreshIntervalMs);

    // Refresh when user returns to tab if more than 5 minutes have elapsed
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && (Date.now() - this.lastFetched > this.refreshIntervalMs)) {
        this.fetchLiveShorts();
      }
    });
  }

  /**
   * Fetch latest shorts from backend endpoint (/api/youtube/shorts or fallback /api/shorts)
   */
  async fetchLiveShorts() {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      // Try /api/youtube/shorts, fallback to /api/shorts with 12s timeout
      let response;
      try {
        response = await fetch('/api/youtube/shorts', {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(12000)
        });
      } catch (err) {
        // Fallback endpoint
        response = await fetch('/api/shorts', {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(12000)
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data.items) && data.items.length > 0) {
        this.mergeNewShorts(data.items);
        this.lastFetched = Date.now();
        this.updateStatusBadge(true, data.cached ? 'Cached' : 'Live Sync', data.lastUpdated);
      } else {
        this.updateStatusBadge(true, 'Verified Snapshot');
      }
    } catch (err) {
      console.info('[Shorts] Live fetch notice:', err.message, '- Using verified local dataset');
      this.updateStatusBadge(false, 'Offline Snapshot');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Merge new items deduplicated by video ID with metadata updates
   */
  mergeNewShorts(newItems) {
    const existingMap = new Map(this.shorts.map(s => [s.id, s]));
    let hasChanges = false;

    // Check for new items or updated metadata
    newItems.forEach(item => {
      const existing = existingMap.get(item.id);
      if (!existing) {
        this.shorts.unshift(item);
        existingMap.set(item.id, item);
        hasChanges = true;
      } else {
        // Synchronize newer view count or title if updated
        if (item.views && item.views !== existing.views) {
          existing.views = item.views;
          existing.viewCount = item.viewCount;
          hasChanges = true;
        }
        if (item.title && item.title !== existing.title) {
          existing.title = item.title;
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      // Sort newest first by publishedAt
      this.shorts.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
      this.render();
    }
  }

  updateStatusBadge(isOnline, statusLabel, lastUpdated) {
    if (!this.statusText) return;

    if (isOnline) {
      const timeStr = lastUpdated ? this.formatRelativeTime(lastUpdated) : 'Just now';
      this.statusText.textContent = `${statusLabel} • ${timeStr}`;
      this.statusPill?.classList.remove('is-offline');
      this.statusPill?.classList.add('is-online');
    } else {
      this.statusText.textContent = 'Verified Channel Snapshot';
      this.statusPill?.classList.remove('is-online');
      this.statusPill?.classList.add('is-offline');
    }
  }

  render() {
    if (!this.gridEl) return;

    const itemsToDisplay = this.shorts.slice(0, this.visibleCount);

    if (itemsToDisplay.length === 0) {
      this.gridEl.innerHTML = `
        <div class="shorts-empty">
          <p>Shorts are currently refreshing from YouTube...</p>
        </div>
      `;
      if (this.loadMoreBtn) this.loadMoreBtn.style.display = 'none';
      return;
    }

    this.gridEl.innerHTML = itemsToDisplay.map((short, index) => this.renderCard(short, index)).join('');

    // Attach click triggers to cards
    this.attachCardEvents();

    // Update Load More button state
    if (this.loadMoreBtn) {
      if (this.visibleCount < this.shorts.length) {
        this.loadMoreBtn.style.display = 'inline-flex';
        this.loadMoreBtn.textContent = `Load More Shorts (${this.shorts.length - this.visibleCount} remaining)`;
      } else {
        this.loadMoreBtn.style.display = 'none';
      }
    }
  }

  renderCard(short, index) {
    const safeTitle = this.escapeHtml(short.title || 'Abhiyukth Vlogs Short');
    const safeViews = this.escapeHtml(short.views || short.viewCountFormatted || 'Recent Short');
    const safeTime = this.escapeHtml(short.timeAgo || (short.publishedAt ? this.formatRelativeTime(short.publishedAt) : 'Recent'));
    const safeDuration = this.escapeHtml(short.duration || (short.durationSeconds ? `0:${String(short.durationSeconds).padStart(2, '0')}` : 'Short'));

    // Thumbnail resolution with multiple fallback levels
    const thumbUrl = short.thumbnail || `https://i.ytimg.com/vi/${short.id}/hq720.jpg`;
    const fallbackThumb = `https://i.ytimg.com/vi/${short.id}/hqdefault.jpg`;

    return `
      <article 
        class="shorts-card" 
        data-video-id="${short.id}"
        data-index="${index}"
        tabindex="0"
        role="button"
        aria-label="Play Short: ${safeTitle}"
      >
        <div class="shorts-thumb-wrap">
          <img 
            src="${thumbUrl}" 
            alt="${safeTitle}" 
            class="shorts-thumb" 
            loading="${index < 4 ? 'eager' : 'lazy'}"
            width="320"
            height="568"
            onerror="if(this.src!=='${fallbackThumb}')this.src='${fallbackThumb}';"
          />
          <div class="shorts-overlay-gradient"></div>

          <!-- YouTube Shorts Official Red Badge -->
          <div class="shorts-badge" aria-hidden="true">
            <svg class="shorts-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.94c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.26zM10 14.5v-5l4.5 2.5-4.5 2.5z"/>
            </svg>
            <span>Shorts</span>
          </div>

          <!-- Direct YouTube Link Button -->
          <a
            href="https://www.youtube.com/shorts/${short.id}"
            target="_blank"
            rel="noopener noreferrer"
            class="shorts-yt-direct-btn"
            title="Watch directly on YouTube"
            aria-label="Watch ${safeTitle} directly on YouTube"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
              <path d="M21.58 7.19a2.76 2.76 0 00-1.94-1.96C17.92 4.75 12 4.75 12 4.75s-5.92 0-7.64.48A2.76 2.76 0 002.42 7.2 28.9 28.9 0 002 12c0 1.63.14 3.24.42 4.81.27.97 1.05 1.74 1.94 1.96 1.72.48 7.64.48 7.64.48s5.92 0 7.64-.48a2.76 2.76 0 001.94-1.96c.28-1.57.42-3.18.42-4.81 0-1.63-.14-3.24-.42-4.81zM10 15V9l5.2 3L10 15z"/>
            </svg>
          </a>

          <!-- Hover Play Overlay Button -->
          <div class="shorts-play-hover" aria-hidden="true">
            <div class="shorts-play-circle">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>

          <!-- Duration Pill -->
          <div class="shorts-duration-pill" aria-hidden="true">
            ${safeDuration}
          </div>
        </div>

        <div class="shorts-content">
          <h3 class="shorts-title" title="${safeTitle}">
            ${safeTitle}
          </h3>
          <div class="shorts-meta">
            <span class="shorts-views">${safeViews}</span>
            <span class="shorts-dot">•</span>
            <span class="shorts-time">${safeTime}</span>
          </div>
        </div>
      </article>
    `;
  }

  attachCardEvents() {
    const cards = this.gridEl.querySelectorAll('.shorts-card');
    cards.forEach(card => {
      const videoId = card.getAttribute('data-video-id');
      const title = card.querySelector('.shorts-title')?.textContent?.trim();

      const triggerPlayback = () => {
        if (videoId && this.videoModal) {
          this.videoModal.open(videoId, title, card, true);
        }
      };

      card.addEventListener('click', (e) => {
        // If clicking the direct YouTube link button, let the anchor open normally without triggering the modal
        if (e.target.closest('.shorts-yt-direct-btn')) return;
        triggerPlayback();
      });

      card.addEventListener('keydown', (e) => {
        if (e.target.closest('.shorts-yt-direct-btn')) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerPlayback();
        }
      });
    });
  }

  formatRelativeTime(dateInput) {
    try {
      const now = new Date();
      const past = new Date(dateInput);
      const diffMs = now - past;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHours = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 30) {
        const months = Math.floor(diffDays / 30);
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
      }
      if (diffDays > 0) {
        return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
      }
      if (diffHours > 0) {
        return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
      }
      if (diffMin > 0) {
        return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
      }
      return 'Just now';
    } catch {
      return 'Recent';
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
