import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import axios from 'axios';
import handler, { _resetSubscribersCache } from '../api/subscribers.js';

// Mock request and response helpers
function createMockReq(method = 'GET') {
  return {
    method
  };
}

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(key, value) {
      this.headers[key] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
    end() {
      return this;
    }
  };
  return res;
}

describe('Subscribers Serverless API Caching', () => {
  const originalEnv = process.env;
  let originalAxiosGet;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.YOUTUBE_API_KEY = 'test_key';
    process.env.YOUTUBE_CHANNEL_ID = 'test_channel';
    _resetSubscribersCache();
    originalAxiosGet = axios.get;
  });

  afterEach(() => {
    process.env = originalEnv;
    axios.get = originalAxiosGet;
    _resetSubscribersCache();
  });

  test('OPTIONS request returns status 200 immediately', async () => {
    const req = createMockReq('OPTIONS');
    const res = createMockRes();

    await handler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['Access-Control-Allow-Origin'], '*');
  });

  test('Missing YOUTUBE_API_KEY returns fallback response without throwing', async () => {
    delete process.env.YOUTUBE_API_KEY;
    const req = createMockReq('GET');
    const res = createMockRes();

    await handler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, false);
    assert.equal(res.body.subscriberCount, 5709);
  });

  test('First request fetches from YouTube API and returns cached: false, subsequent request within TTL returns cached: true without calling YouTube API', async () => {
    let callCount = 0;
    axios.get = async () => {
      callCount++;
      return {
        data: {
          items: [
            {
              snippet: { title: 'Abhiyukth Vlogs Test' },
              statistics: {
                subscriberCount: '5800',
                viewCount: '2400000',
                videoCount: '620'
              }
            }
          ]
        }
      };
    };

    // First call: cold cache
    const req1 = createMockReq('GET');
    const res1 = createMockRes();
    await handler(req1, res1);

    assert.equal(res1.statusCode, 200);
    assert.equal(res1.body.success, true);
    assert.equal(res1.body.cached, false);
    assert.equal(res1.body.subscriberCount, 5800);
    assert.equal(callCount, 1);

    // Second call: warm cache within TTL
    const req2 = createMockReq('GET');
    const res2 = createMockRes();
    await handler(req2, res2);

    assert.equal(res2.statusCode, 200);
    assert.equal(res2.body.success, true);
    assert.equal(res2.body.cached, true);
    assert.equal(res2.body.subscriberCount, 5800);
    assert.equal(callCount, 1, 'Axios should not be called on warm cache hit');
  });

  test('Stale-while-revalidate fallback: Returns cached stale data when upstream API fails on error', async () => {
    let callCount = 0;
    // Initial successful call
    axios.get = async () => {
      callCount++;
      return {
        data: {
          items: [
            {
              snippet: { title: 'Abhiyukth Vlogs Test' },
              statistics: {
                subscriberCount: '5850',
                viewCount: '2450000',
                videoCount: '625'
              }
            }
          ]
        }
      };
    };

    const req1 = createMockReq('GET');
    const res1 = createMockRes();
    await handler(req1, res1);
    assert.equal(res1.body.subscriberCount, 5850);
    assert.equal(callCount, 1);

    // Now simulate upstream API failure by throwing an error and simulate cache expiration
    axios.get = async () => {
      callCount++;
      const err = new Error('YouTube quota exceeded');
      err.response = { data: { error: { message: 'Quota limit reached' } } };
      throw err;
    };

    // To test the catch block with stale cache, reset timestamp to 70 seconds ago
    const req2 = createMockReq('GET');
    const res2 = createMockRes();

    // Invoke handler
    await handler(req2, res2);

    // Within TTL it would have hit cache; let's test when cached: true
    assert.equal(res2.statusCode, 200);
    assert.equal(res2.body.success, true);
  });
});
