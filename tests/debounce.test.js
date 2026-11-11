import test from 'node:test';
import assert from 'node:assert/strict';

function debounce(fn, wait) {
  let timeoutId = null;
  const debounced = function (...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn.apply(this, args);
    }, wait);
  };
  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  return debounced;
}

test('debounce delays execution until wait period passes', async () => {
  let calls = 0;
  const debounced = debounce(() => {
    calls++;
  }, 50);

  debounced();
  debounced();
  debounced();

  assert.equal(calls, 0);

  await new Promise((resolve) => setTimeout(resolve, 80));
  assert.equal(calls, 1);
});

test('debounce cancel prevents pending execution', async () => {
  let calls = 0;
  const debounced = debounce(() => {
    calls++;
  }, 50);

  debounced();
  debounced.cancel();

  await new Promise((resolve) => setTimeout(resolve, 80));
  assert.equal(calls, 0);
});
