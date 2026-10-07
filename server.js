import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

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
      subscriberCount: 5700,
      subscriberCountFormatted: '5,700',
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
    const rawSubscribers = Number(stats.subscriberCount) || 5700;
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
      subscriberCount: 5700,
      subscriberCountFormatted: '5,700',
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

// Serve frontend dist if built
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 YouTube Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Subscribers Endpoint: http://localhost:${PORT}/api/subscribers`);
  console.log(`🔒 YouTube API Key: ${API_KEY ? 'Configured & Secured' : 'NOT SET in .env'}`);
  console.log(`=============================================`);
});
