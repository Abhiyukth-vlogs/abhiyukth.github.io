/**
 * Abhiyukth Vlogs - 3D Rolling Odometer Counter (YouTube Studio Style)
 * Renders individual rotating mechanical 3D glassmorphic digit boxes with independent vertical scrolling.
 */
export class Odometer {
  /**
   * @param {HTMLElement|string} target Container element or element ID
   * @param {Object} options Configuration options
   */
  constructor(target, options = {}) {
    this.container = typeof target === 'string' ? document.getElementById(target) : target;
    if (!this.container) return;

    this.options = {
      duration: options.duration || 900,
      stagger: options.stagger !== undefined ? options.stagger : 50,
      ...options
    };

    this.currentValue = null;
    this.isInitialized = false;
  }

  /**
   * Updates the odometer to a new number with 3D rolling animation
   * @param {number|string} value New target value
   * @param {boolean} animate Whether to animate the transition
   */
  update(value, animate = true) {
    if (!this.container) return;
    const num = Number(value);
    if (isNaN(num)) return;

    const formattedStr = num.toLocaleString('en-US'); // e.g., "5,709"
    this.container.setAttribute('aria-label', `${formattedStr} subscribers`);

    const chars = formattedStr.split('');
    const currentChars = this.getCurrentChars();

    // Check if DOM structure needs reconstruction (e.g., number of digits changed)
    const structureChanged = chars.length !== currentChars.length ||
      chars.some((ch, i) => (ch === ',') !== (currentChars[i] === ','));

    if (!this.isInitialized || structureChanged) {
      this.buildDOM(chars, animate);
      this.isInitialized = true;
    } else {
      this.rollDigits(chars, animate);
    }

    this.currentValue = num;
  }

  /**
   * Extracts character types currently rendered in DOM
   */
  getCurrentChars() {
    if (!this.container) return [];
    return Array.from(this.container.children).map(child => {
      if (child.classList.contains('odometer-separator')) return ',';
      return child.dataset.digit !== undefined ? child.dataset.digit : '0';
    });
  }

  /**
   * Constructs the 3D digit wheel DOM hierarchy
   */
  buildDOM(chars, animate = true) {
    this.container.innerHTML = '';
    this.container.classList.add('odometer-root');

    const digitCount = chars.filter(c => c !== ',').length;
    let digitIdx = 0;

    chars.forEach((char) => {
      if (char === ',') {
        const sep = document.createElement('span');
        sep.className = 'odometer-separator';
        sep.textContent = ',';
        sep.setAttribute('aria-hidden', 'true');
        this.container.appendChild(sep);
      } else {
        const targetDigit = parseInt(char, 10);
        const digitBox = document.createElement('div');
        digitBox.className = 'odometer-digit-box';
        digitBox.dataset.digit = targetDigit;
        digitBox.setAttribute('aria-hidden', 'true');

        // Reverse stagger delay: rightmost (least-significant) digits roll first
        const staggerDelay = (digitCount - 1 - digitIdx) * this.options.stagger;
        digitBox.style.setProperty('--stagger-delay', `${staggerDelay}ms`);

        const ribbon = document.createElement('div');
        ribbon.className = 'odometer-ribbon';

        // 0 to 9 numbers strip
        for (let i = 0; i <= 9; i++) {
          const span = document.createElement('span');
          span.className = 'odometer-num';
          span.textContent = i;
          ribbon.appendChild(span);
        }

        digitBox.appendChild(ribbon);
        this.container.appendChild(digitBox);

        if (!animate) {
          ribbon.style.transition = 'none';
          ribbon.style.transform = `translateY(-${targetDigit * 10}%)`;
        } else {
          // Start from 0 and roll to target digit
          ribbon.style.transition = 'none';
          ribbon.style.transform = `translateY(0%)`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              ribbon.style.transition = `transform ${this.options.duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}ms`;
              ribbon.style.transform = `translateY(-${targetDigit * 10}%)`;
            });
          });
        }

        digitIdx++;
      }
    });
  }

  /**
   * Smoothly rolls existing digit wheels to new targets
   */
  rollDigits(chars, animate = true) {
    const digitCount = chars.filter(c => c !== ',').length;
    let digitIdx = 0;
    const children = Array.from(this.container.children);

    chars.forEach((char, idx) => {
      const child = children[idx];
      if (!child) return;

      if (char === ',') {
        // Separator remains static
      } else {
        const targetDigit = parseInt(char, 10);
        const prevDigit = parseInt(child.dataset.digit || '0', 10);
        child.dataset.digit = targetDigit;

        const ribbon = child.querySelector('.odometer-ribbon');
        if (ribbon) {
          const staggerDelay = (digitCount - 1 - digitIdx) * this.options.stagger;

          if (animate && prevDigit !== targetDigit) {
            child.classList.add('rolling');
            ribbon.style.transition = `transform ${this.options.duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}ms`;
            setTimeout(() => {
              child.classList.remove('rolling');
            }, this.options.duration + staggerDelay);
          } else if (!animate) {
            ribbon.style.transition = 'none';
          }

          ribbon.style.transform = `translateY(-${targetDigit * 10}%)`;
        }
        digitIdx++;
      }
    });
  }
}
