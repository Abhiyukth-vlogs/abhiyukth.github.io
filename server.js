import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { getShortsFeed } from './api/_lib/youtubeShorts.js';
import { getLiveStreamData } from './api/_lib/youtubeLive.js';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Default Channel ID if not set in environment
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCuG7-r1F3b2RzGoRFIe0MnQ';
const API_KEY = process.env.YOUTUBE_API_KEY;

// In-memory cache (60 seconds TTL) to prevent exhausting YouTube API quota
let cache = {
  timestamp: 0,
  data: null
};
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

// Middlewares
app.use(cors({
  origin: '*', // Allow requests from local dev and deployed frontend
  methods: ['GET']
}));
app.use(express.json());

/**
 * GET /api/subscribers
 * Securely fetches YouTube Channel statistics without exposing API key
 */
app.get('/api/subscribers', async (req, res) => {
  const now = Date.now();

  // Return cached data if valid
  if (cache.data && (now - cache.timestamp < CACHE_TTL_MS)) {
    return res.json({
      success: true,
      cached: true,
      ...cache.data
    });
  }

  // Check if API Key is configured
  if (!API_KEY) {
    console.warn('[YouTube Backend] Warning: YOUTUBE_API_KEY is not set in .env');
    return res.status(200).json({
      success: false,
      message: 'YOUTUBE_API_KEY is not configured in .env',
      subscriberCount: 5709,
      subscriberCountFormatted: '5,709',
      viewsCount: '2.3M+',
      videosCount: '608+'
    });
  }

  try {
    const youtubeUrl = 'https://www.googleapis.com/youtube/v3/channels';
    const response = await axios.get(youtubeUrl, {
      params: {
        part: 'statistics,snippet',
        id: CHANNEL_ID,
        key: API_KEY
      },
      timeout: 6000
    });

    const items = response.data?.items;
    if (!items || items.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Channel not found on YouTube'
      });
    }

    const channel = items[0];
    const stats = channel.statistics;
    const rawSubscribers = Math.max(Number(stats.subscriberCount) || 5709, 5709);
    const rawViews = Number(stats.viewCount) || 0;
    const rawVideos = Number(stats.videoCount) || 0;

    const formattedData = {
      channelId: CHANNEL_ID,
      channelTitle: channel.snippet?.title || 'Abhiyukth Vlogs',
      subscriberCount: rawSubscribers,
      subscriberCountFormatted: rawSubscribers.toLocaleString('en-US'),
      viewCount: rawViews,
      viewCountFormatted: rawViews.toLocaleString('en-US'),
      videoCount: rawVideos,
      videoCountFormatted: rawVideos.toLocaleString('en-US'),
      hiddenSubscriberCount: stats.hiddenSubscriberCount || false,
      lastUpdated: new Date().toISOString()
    };

    // Update Cache
    cache = {
      timestamp: now,
      data: formattedData
    };

    return res.json({
      success: true,
      cached: false,
      ...formattedData
    });
  } catch (error) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    console.error('[YouTube API Error]:', errorMsg);

    // If cache exists (even expired), return it gracefully during errors/quota limits
    if (cache.data) {
      return res.json({
        success: true,
        stale: true,
        ...cache.data
      });
    }

    // Safe fallback so frontend never breaks
    return res.status(200).json({
      success: false,
      error: errorMsg,
      subscriberCount: 5709,
      subscriberCountFormatted: '5,709',
      viewCountFormatted: '2,350,000+',
      videoCountFormatted: '608+'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Abhiyukth Vlogs YouTube Backend',
    hasApiKey: !!API_KEY
  });
});

/**
 * GET /api/youtube/shorts & GET /api/shorts
 * Returns automatically discovered, verified YouTube Shorts feed with 5-minute caching
 */
const shortsHandler = async (req, res) => {
  try {
    const feed = await getShortsFeed();
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    return res.json(feed);
  } catch (error) {
    return res.status(200).json({
      success: false,
      error: error.message,
      items: []
    });
  }
};

app.get('/api/youtube/shorts', shortsHandler);
app.get('/api/shorts', shortsHandler);

/**
 * GET /api/youtube/live & GET /api/live
 * Returns dynamically discovered, verified active YouTube livestream or latest replay
 */
const liveHandler = async (req, res) => {
  try {
    const liveData = await getLiveStreamData();
    res.setHeader('Cache-Control', 'public, max-age=90, stale-while-revalidate=180');
    return res.json(liveData);
  } catch (error) {
    return res.status(200).json({
      success: false,
      error: error.message,
      isLive: false,
      status: 'error_fallback',
      badgeText: 'Latest Live Replay'
    });
  }
};

app.get('/api/youtube/live', liveHandler);
app.get('/api/live', liveHandler);

/**
 * GET /api/auth/status
 * Reports YouTube API and owner OAuth connection status
 */
app.get('/api/auth/status', (req, res) => {
  const hasClientId = !!process.env.YOUTUBE_CLIENT_ID;
  const hasClientSecret = !!process.env.YOUTUBE_CLIENT_SECRET;
  const hasRefreshToken = !!process.env.YOUTUBE_REFRESH_TOKEN;
  const isOAuthConnected = hasClientId && hasClientSecret && hasRefreshToken;

  res.json({
    status: 'ok',
    channel: {
      id: CHANNEL_ID,
      handle: '@abhiyukthvlogs'
    },
    apiConfigured: !!API_KEY,
    ownerOAuth: {
      connected: isOAuthConnected,
      scopes: isOAuthConnected ? [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/yt-analytics.readonly'
      ] : []
    },
    syncCapabilities: {
      autoDiscovery: true,
      accurateClassification: isOAuthConnected ? 'authenticated_file_and_analytics' : 'public_route_and_duration_verification',
      refreshIntervalMinutes: 5
    }
  });
});

/**
 * GET /api/auth/youtube
 * Initiates owner OAuth consent for YouTube read-only scopes
 */
app.get('/api/auth/youtube', (req, res) => {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI || `http://localhost:${PORT}/api/auth/youtube/callback`;
  
  if (!clientId) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head><title>OAuth Setup Required</title>
      <style>body{font-family:sans-serif;background:#070911;color:#F5F7FF;padding:40px;line-height:1.6;}</style>
      </head>
      <body>
        <h2 style="color:#22D3EE;">YouTube OAuth Setup Required</h2>
        <p>To enable owner-level authenticated discovery (YouTube Analytics reports and exact <code>fileDetails</code> display aspect ratio), configure the following in your <code>.env</code> file:</p>
        <pre style="background:#111525;padding:16px;border-radius:8px;color:#A7B0C0;">YOUTUBE_CLIENT_ID=your_oauth_client_id
YOUTUBE_CLIENT_SECRET=your_oauth_client_secret
YOUTUBE_REDIRECT_URI=http://localhost:${PORT}/api/auth/youtube/callback</pre>
        <p>Refer to <code>.env.example</code> and <code>README.md</code> for the step-by-step setup.</p>
        <p><a href="/" style="color:#8B5CF6;">&larr; Back to Website</a></p>
      </body>
      </html>
    `);
  }

  const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/yt-analytics.readonly'
  ].join(' ');

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent`;

  res.redirect(authUrl);
});

/**
 * GET /api/auth/youtube/callback
 * Exchanges code for tokens and guides saving the refresh token
 */
app.get('/api/auth/youtube/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('Missing authorization code from Google.');
  }

  try {
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    const redirectUri = process.env.YOUTUBE_REDIRECT_URI || `http://localhost:${PORT}/api/auth/youtube/callback`;

    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    });

    const refreshToken = tokenRes.data?.refresh_token;

    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>YouTube Connected</title>
      <style>body{font-family:sans-serif;background:#070911;color:#F5F7FF;padding:40px;line-height:1.6;}</style>
      </head>
      <body>
        <h2 style="color:#22D3EE;">YouTube Channel Authorization Successful!</h2>
        <p>Your read-only connection to YouTube Analytics & Data API has been authorized.</p>
        ${refreshToken ? `<p><strong>Refresh Token:</strong> <code>${refreshToken}</code></p>
        <p>Add this to your <code>.env</code> file as <code>YOUTUBE_REFRESH_TOKEN=${refreshToken}</code> to persist automatic authenticated synchronization across restarts.</p>` : '<p>Already authorized. Refresh token preserved.</p>'}
        <p><a href="/" style="color:#8B5CF6;">&larr; Return to Website</a></p>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send('OAuth exchange failed: ' + (err.response?.data?.error_description || err.message));
  }
});

// Serve frontend dist if built
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 YouTube Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Subscribers Endpoint: http://localhost:${PORT}/api/subscribers`);
  console.log(`🎬 Shorts Endpoint:      http://localhost:${PORT}/api/youtube/shorts`);
  console.log(`🔴 Live Stream Endpoint: http://localhost:${PORT}/api/youtube/live`);
  console.log(`🔒 YouTube API Key:      ${API_KEY ? 'Configured & Secured' : 'NOT SET in .env'}`);
  console.log(`=============================================`);
});
