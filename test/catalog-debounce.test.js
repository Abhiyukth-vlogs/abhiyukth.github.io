import test from 'node:test';
import assert from 'node:assert/strict';
import { channelConfig } from '../src/data/channel.js';

test('channelConfig contains verified videos with expected properties', () => {
  assert.ok(Array.isArray(channelConfig.videos), 'videos should be an array');
  assert.ok(channelConfig.videos.length > 0, 'videos should not be empty');

  for (const video of channelConfig.videos) {
    assert.ok(video.id, 'video must have id');
    assert.ok(video.title, 'video must have title');
    assert.ok(video.category, 'video must have category');
  }
});

test('search filtering matches titles or categories case-insensitively', () => {
  const query = 'ghost';
  const filtered = channelConfig.videos.filter(v => {
    const titleMatch = v.title.toLowerCase().includes(query);
    const categoryMatch = v.category.toLowerCase().includes(query);
    return titleMatch || categoryMatch;
  });

  assert.ok(filtered.length > 0, 'should match videos containing "ghost"');
  for (const v of filtered) {
    const matches = v.title.toLowerCase().includes(query) || v.category.toLowerCase().includes(query);
    assert.ok(matches, 'each filtered video should match query');
  }
});

test('debounce logic collapses multiple rapid invocations into single execution', async () => {
  let executions = 0;
  let lastVal = '';
  let timer = null;

  const simulateDebouncedInput = (val) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      executions++;
      lastVal = val;
    }, 50);
  };

  // Simulate rapid typing: 5 keystrokes within 20ms
  simulateDebouncedInput('g');
  simulateDebouncedInput('gh');
  simulateDebouncedInput('gho');
  simulateDebouncedInput('ghos');
  simulateDebouncedInput('ghost');

  // Immediately, executions should still be 0
  assert.equal(executions, 0, 'should not execute immediately');

  // Wait 70ms for debounce timer to fire
  await new Promise(resolve => setTimeout(resolve, 70));

  assert.equal(executions, 1, 'should have executed exactly once');
  assert.equal(lastVal, 'ghost', 'should have received final value');
});
