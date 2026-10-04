/**
 * Accessible Video Modal Component
 * Handles lazy loading YouTube iframes on-demand, focus trapping,
 * Escape key listener, stopping audio on close, and restoring focus.
 */

export class VideoModal {
  constructor() {
    this.modalEl = document.getElementById('video-modal');
    this.backdropEl = document.getElementById('modal-backdrop');
    this.closeBtn = document.getElementById('modal-close-btn');
    this.titleEl = document.getElementById('modal-title');
    this.playerContainer = document.getElementById('modal-player-container');
    this.externalLink = document.getElementById('modal-external-link');
    this.triggerElement = null;

    this.init();
  }

  init() {
    if (!this.modalEl) return;

    // Close button
    this.closeBtn?.addEventListener('click', () => this.close());

    // Backdrop click
    this.backdropEl?.addEventListener('click', () => this.close());

    // Keyboard handlers: Escape to close & Focus trap
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen()) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
        return;
      }

      if (e.key === 'Tab') {
        this.trapFocus(e);
      }
    });
  }

  isOpen() {
    return this.modalEl?.classList.contains('is-open');
  }

  open(videoId, title, triggerEl = null) {
    this.triggerElement = triggerEl;

    if (this.titleEl) {
      this.titleEl.textContent = title || 'Abhiyukth Vlogs Video';
    }

    if (this.externalLink) {
      this.externalLink.href = `https://www.youtube.com/watch?v=${videoId}`;
    }

    // Embed responsive YouTube iframe with autoplay and secure origin params
    if (this.playerContainer) {
      const sanitizedTitle = (title || 'YouTube Video Player').replace(/"/g, '&quot;');
      this.playerContainer.innerHTML = `
        <div class="modal-iframe-wrapper">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1"
            title="${sanitizedTitle}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      `;
    }

    this.modalEl.classList.add('is-open');
    this.modalEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button initially
    requestAnimationFrame(() => {
      this.closeBtn?.focus();
    });
  }

  close() {
    if (!this.isOpen()) return;

    // Immediately clear iframe to cease any playing audio/video
    if (this.playerContainer) {
      this.playerContainer.innerHTML = '';
    }

    this.modalEl.classList.remove('is-open');
    this.modalEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Return focus to trigger button
    if (this.triggerElement && typeof this.triggerElement.focus === 'function') {
      this.triggerElement.focus();
    }
    this.triggerElement = null;
  }

  trapFocus(e) {
    const focusableElements = this.modalEl.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }
}
