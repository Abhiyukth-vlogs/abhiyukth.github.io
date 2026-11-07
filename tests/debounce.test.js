import test from 'node:test';
import assert from 'node:assert/strict';
import { debounce } from '../src/utils/debounce.js';

test('debounce delays execution until delay expires', async () => {
  let calls = 0;
  const debounced = debounce(() => {
    calls++;
  }, 50);

  debounced();
  debounced();
  debounced();

  assert.equal(calls, 0, 'should not execute immediately');

  await new Promise((resolve) => setTimeout(resolve, 80));
  assert.equal(calls, 1, 'should execute once after delay');
});

test('debounce passes latest arguments and preserves context', async () => {
  let lastArg = null;
  const debounced = debounce((val) => {
    lastArg = val;
  }, 40);

  debounced('first');
  debounced('second');
  debounced('third');

  await new Promise((resolve) => setTimeout(resolve, 60));
  assert.equal(lastArg, 'third', 'should receive the latest arguments');
});

test('debounce cancel prevents delayed execution', async () => {
  let called = false;
  const debounced = debounce(() => {
    called = true;
  }, 50);

  debounced();
  debounced.cancel();

  await new Promise((resolve) => setTimeout(resolve, 80));
  assert.equal(called, false, 'cancelled debounce should not execute');
});
