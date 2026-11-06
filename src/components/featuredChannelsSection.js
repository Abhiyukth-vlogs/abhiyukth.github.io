import { channelConfig } from '../data/channel.js';

/**
 * Featured Channels Section Component
 * Displays verified pinned channels:
 *  - "My Favourite & Friends Channel"
 *  - "Abhijairajs channel"
 * Supports responsive grid, category filter tabs, live API synchronization, and direct YouTube channel links.
 */
export class FeaturedChannelsSection {
  constructor() {
    this.container = document.getElementById('channels');
    this.gridEl = document.getElementById('featured-channels-grid');
    this.filterButtonsContainer = document.getElementById('channels-filter-tabs');
    this.channelsCountBadge = document.getElementById('channels-count-badge');
    this.liveStatusText = document.getElementById('channels-status-text');

    // State
    this.sections = Array.isArray(channelConfig.featuredChannels) ? [...channelConfig.featuredChannels] : [];
    this.activeFilter = 'all'; // 'all' | 'friends' | 'abhijairaj'
    this.refreshTimer = null;
    this.refreshIntervalMs = 10 * 60 * 1000; // 10 minutes

    this.init();
  }

  init() {
    if (!this.gridEl) return;

    // Initial render from baseline data
    this.render();
    this.setupListeners();

    // Fetch live data from backend endpoint
    this.fetchLiveChannels();

    // Setup periodic refresh
    this.setupAutoRefresh();
  }

  setupListeners() {
    if (this.filterButtonsContainer) {
      this.filterButtonsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.channel-filter-btn');
        if (!btn) return;
        const filter = btn.dataset.filter;
        if (filter && filter !== this.activeFilter) {
          this.activeFilter = filter;
          this.updateActiveTabStyles();
          this.render();
        }
      });
    }

    // Refresh when user returns to tab
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.fetchLiveChannels();
      }
    });
  }

  updateActiveTabStyles() {
    if (!this.filterButtonsContainer) return;
    const buttons = this.filterButtonsContainer.querySelectorAll('.channel-filter-btn');
    buttons.forEach(btn => {
      const isActive = btn.dataset.filter === this.activeFilter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  getAllChannels() {
    const list = [];
    for (const sec of this.sections) {
      for (const ch of (sec.channels || [])) {
        list.push({
          ...ch,
          sectionSlug: sec.slug,
          sectionTitle: sec.displayTitle || sec.title
        });
      }
    }
    return list;
  }

  getFilteredChannels() {
    if (this.activeFilter === 'all') {
      return this.getAllChannels();
    }
    const targetSection = this.sections.find(s => s.slug === this.activeFilter);
    if (!targetSection) return this.getAllChannels();
    return (targetSection.channels || []).map(ch => ({
      ...ch,
      sectionSlug: targetSection.slug,
      sectionTitle: targetSection.displayTitle || targetSection.title
    }));
  }

  escapeHtml(str = '') {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  render() {
    if (!this.gridEl) return;

    const channels = this.getFilteredChannels();
    const allChannels = this.getAllChannels();

    // Update count badges
    if (this.channelsCountBadge) {
      this.channelsCountBadge.textContent = `${channels.length} ${channels.length === 1 ? 'Channel' : 'Channels'}`;
    }

    // Update tab counts
    const countAllEl = document.getElementById('tab-count-all');
    const countFriendsEl = document.getElementById('tab-count-friends');
    const countNetworkEl = document.getElementById('tab-count-network');

    if (countAllEl) countAllEl.textContent = allChannels.length;
    if (countFriendsEl) {
      const friendsSec = this.sections.find(s => s.slug === 'friends');
      countFriendsEl.textContent = friendsSec ? friendsSec.channels.length : 10;
    }
    if (countNetworkEl) {
      const netSec = this.sections.find(s => s.slug === 'abhijairaj');
      countNetworkEl.textContent = netSec ? netSec.channels.length : 12;
    }

    if (channels.length === 0) {
      this.gridEl.innerHTML = `
        <div class="channels-empty-state">
          <p>No channels found for the selected category.</p>
        </div>
      `;
      return;
    }

    this.gridEl.innerHTML = channels.map(channel => {
      const isFriend = channel.sectionSlug === 'friends';
      const badgeClass = isFriend ? 'badge-friends' : 'badge-network';
      const badgeLabel = isFriend ? "Friend's Channel" : "Abhijairajs Channel";

      return `
        <article class="channel-card" data-channel-id="${channel.id}">
          <div class="channel-card-glow" aria-hidden="true"></div>
          
          <div class="channel-header">
            <div class="channel-avatar-wrapper">
              <img 
                src="${this.escapeHtml(channel.avatar)}" 
                alt="${this.escapeHtml(channel.title)} avatar" 
                class="channel-avatar-img"
                loading="lazy"
                width="84"
                height="84"
                onerror="this.src='https://yt3.ggpht.com/default.jpg'"
              />
              <span class="channel-status-indicator" title="Verified Creator" aria-label="Verified Creator"></span>
            </div>
            
            <div class="channel-meta-main">
              <span class="channel-section-pill ${badgeClass}">
                <span class="pill-dot"></span>
                ${badgeLabel}
              </span>
              <h3 class="channel-title" title="${this.escapeHtml(channel.title)}">
                <span>${this.escapeHtml(channel.title)}</span>
                <svg class="icon-verified" viewBox="0 0 24 24" width="16" height="16" fill="#22D3EE" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </h3>
              <p class="channel-handle">${this.escapeHtml(channel.handle || '@youtube')}</p>
            </div>
          </div>

          <div class="channel-stats-row">
            <div class="channel-stat-item">
              <span class="stat-label">SUBSCRIBERS</span>
              <span class="stat-value highlight-cyan">${this.escapeHtml(channel.subscriberCountFormatted || 'Creator')}</span>
            </div>
            <div class="channel-stat-item">
              <span class="stat-label">VIDEOS</span>
              <span class="stat-value">${channel.videoCount ? Number(channel.videoCount).toLocaleString() : 'N/A'}</span>
            </div>
          </div>

          <div class="channel-action">
            <a 
              href="${this.escapeHtml(channel.url)}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn btn-channel-visit"
              aria-label="Visit ${this.escapeHtml(channel.title)} on YouTube"
            >
              <svg class="icon-yt-btn" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>Visit Channel</span>
              <svg class="icon-arrow-ext" viewBox="0 0 20 20" width="14" height="14" fill="currentColor" aria-hidden="true">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
              </svg>
            </a>
          </div>
        </article>
      `;
    }).join('');
  }

  async fetchLiveChannels() {
    try {
      let response;
      try {
        response = await fetch('/api/youtube/featured-channels', {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(10000)
        });
      } catch {
        response = await fetch('/api/featured-channels', {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(10000)
        });
      }

      if (!response.ok) return;

      const data = await response.json();
      if (data && Array.isArray(data.sections) && data.sections.length > 0) {
        this.sections = data.sections;
        this.render();
        if (this.liveStatusText) {
          this.liveStatusText.textContent = 'Synced Live with YouTube';
        }
      }
    } catch (err) {
      console.info('[FeaturedChannels] Live fetch note:', err.message, '- Using verified baseline');
    }
  }

  setupAutoRefresh() {
    this.refreshTimer = setInterval(() => {
      if (!document.hidden) {
        this.fetchLiveChannels();
      }
    }, this.refreshIntervalMs);
  }

  destroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}
