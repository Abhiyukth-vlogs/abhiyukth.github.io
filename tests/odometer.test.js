import test, { beforeEach, describe } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

// Setup JSDOM globals before testing Odometer
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="odometer"></div></body></html>', {
  url: 'http://localhost/'
});

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.requestAnimationFrame = (cb) => cb();

import { Odometer } from '../src/components/odometer.js';

describe('Odometer - update non-numeric inputs edge cases', () => {
  let container;
  let odometer;

  beforeEach(() => {
    document.body.innerHTML = '<div id="odometer"></div>';
    container = document.getElementById('odometer');
    odometer = new Odometer(container);
  });

  test('ignores non-numeric string input like "abc"', () => {
    odometer.update('abc');
    assert.equal(odometer.currentValue, null);
    assert.equal(container.getAttribute('aria-label'), null);
    assert.equal(container.children.length, 0);
  });

  test('ignores undefined input', () => {
    odometer.update(undefined);
    assert.equal(odometer.currentValue, null);
    assert.equal(container.getAttribute('aria-label'), null);
    assert.equal(container.children.length, 0);
  });

  test('ignores NaN input', () => {
    odometer.update(NaN);
    assert.equal(odometer.currentValue, null);
    assert.equal(container.getAttribute('aria-label'), null);
    assert.equal(container.children.length, 0);
  });

  test('ignores object input "{}"', () => {
    odometer.update({});
    assert.equal(odometer.currentValue, null);
    assert.equal(container.getAttribute('aria-label'), null);
    assert.equal(container.children.length, 0);
  });

  test('retains previous valid numeric state when updated with non-numeric input', () => {
    // First update with valid numeric input
    odometer.update(5709, false);
    assert.equal(odometer.currentValue, 5709);
    assert.equal(container.getAttribute('aria-label'), '5,709 subscribers');
    assert.ok(container.children.length > 0);

    const childCount = container.children.length;

    // Subsequent update with non-numeric input should return early
    odometer.update('invalid_value');
    assert.equal(odometer.currentValue, 5709);
    assert.equal(container.getAttribute('aria-label'), '5,709 subscribers');
    assert.equal(container.children.length, childCount);
  });

  test('handles numeric strings correctly', () => {
    odometer.update('1234', false);
    assert.equal(odometer.currentValue, 1234);
    assert.equal(container.getAttribute('aria-label'), '1,234 subscribers');
  });
});
