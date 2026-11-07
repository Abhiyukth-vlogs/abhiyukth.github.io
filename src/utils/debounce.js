/**
 * Debounce helper to limit the rate at which a function can fire.
 * @param {Function} fn The function to execute after the delay.
 * @param {number} delay Delay in milliseconds.
 * @returns {Function & { cancel: Function }} Debounced function with cancel support.
 */
export function debounce(fn, delay = 180) {
  let timer = null;

  const debounced = function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, delay);
  };

  debounced.cancel = function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced;
}
