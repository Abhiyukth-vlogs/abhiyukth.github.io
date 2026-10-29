import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import express from 'express';
import cors from 'cors';
import subscribersHandler from '../api/subscribers.js';

test('Express server CORS policy checks', async (t) => {
  const app = express();

  const defaultAllowedOrigins = [
    'https://abhiyukth.github.io',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5000'
  ];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || defaultAllowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: ['GET']
  }));

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  t.after(() => server.close());

  await t.test('allows requests from allowed origin', async () => {
    const res = await fetch(`http://localhost:${port}/api/health`, {
      headers: { Origin: 'https://abhiyukth.github.io' }
    });
    assert.equal(res.headers.get('access-control-allow-origin'), 'https://abhiyukth.github.io');
  });

  await t.test('blocks/denies access-control-allow-origin header for untrusted origin', async () => {
    const res = await fetch(`http://localhost:${port}/api/health`, {
      headers: { Origin: 'https://evil-untrusted-site.com' }
    });
    assert.equal(res.headers.get('access-control-allow-origin'), null);
  });
});

test('Vercel serverless function CORS policy checks', async (t) => {
  await t.test('allows request from allowed origin', async () => {
    let headers = {};
    const req = {
      method: 'GET',
      headers: { origin: 'https://abhiyukth.github.io' }
    };
    const res = {
      setHeader(name, value) {
        headers[name.toLowerCase()] = value;
      },
      status(code) {
        return {
          json: () => {},
          end: () => {}
        };
      }
    };

    await subscribersHandler(req, res);
    assert.equal(headers['access-control-allow-origin'], 'https://abhiyukth.github.io');
  });

  await t.test('does not return access-control-allow-origin for untrusted origin', async () => {
    let headers = {};
    const req = {
      method: 'GET',
      headers: { origin: 'https://malicious-site.com' }
    };
    const res = {
      setHeader(name, value) {
        headers[name.toLowerCase()] = value;
      },
      status(code) {
        return {
          json: () => {},
          end: () => {}
        };
      }
    };

    await subscribersHandler(req, res);
    assert.equal(headers['access-control-allow-origin'], undefined);
  });
});
