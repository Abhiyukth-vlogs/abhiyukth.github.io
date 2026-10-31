import { test } from 'node:test';
import assert from 'node:assert/strict';
import { debounce } from '../src/main.js';

test('debounce delays execution and invokes callback with latest arguments', async () => {
  let callCount = 0;
  let lastArg = null;

  const fn = debounce((arg) => {
    callCount++;
    lastArg = arg;
  }, 50);

  fn('first');
  fn('second');
  fn('third');

  // Immediately after calls, count should be 0
  assert.equal(callCount, 0);

  // Wait for debounce timer to fire
  await new Promise((resolve) => setTimeout(resolve, 80));

  assert.equal(callCount, 1);
  assert.equal(lastArg, 'third');
});

test('debounce resets timer if called again before delay', async () => {
  let callCount = 0;

  const fn = debounce(() => {
    callCount++;
  }, 60);

  fn();
  await new Promise((resolve) => setTimeout(resolve, 35));
  assert.equal(callCount, 0);

  // Interrupted call resets the 60ms window
  fn();
  await new Promise((resolve) => setTimeout(resolve, 35));
  assert.equal(callCount, 0);

  // Wait remaining time for timer to complete
  await new Promise((resolve) => setTimeout(resolve, 40));
  assert.equal(callCount, 1);
});
