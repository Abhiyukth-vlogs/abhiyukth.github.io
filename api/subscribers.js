import axios from 'axios';

// Vercel Serverless Function Handler
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCuG7-r1F3b2RzGoRFIe0MnQ';
  const API_KEY = process.env.YOUTUBE_API_KEY;

  if (!API_KEY) {
    return res.status(200).json({
      success: false,
      message: 'YOUTUBE_API_KEY not configured in environment',
      subscriberCount: 5700,
      subscriberCountFormatted: '5,700',
      viewCountFormatted: '2,350,000+',
      videoCountFormatted: '608+'
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
      timeout: 5000
    });

    const items = response.data?.items;
    if (!items || items.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Channel not found'
      });
    }

    const channel = items[0];
    const stats = channel.statistics;
    const rawSubscribers = Number(stats.subscriberCount) || 5700;
    const rawViews = Number(stats.viewCount) || 0;
    const rawVideos = Number(stats.videoCount) || 0;

    return res.status(200).json({
      success: true,
      channelId: CHANNEL_ID,
      channelTitle: channel.snippet?.title || 'Abhiyukth Vlogs',
      subscriberCount: rawSubscribers,
      subscriberCountFormatted: rawSubscribers.toLocaleString('en-US'),
      viewCount: rawViews,
      viewCountFormatted: rawViews.toLocaleString('en-US'),
      videoCount: rawVideos,
      videoCountFormatted: rawVideos.toLocaleString('en-US'),
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    return res.status(200).json({
      success: false,
      error: errorMsg,
      subscriberCount: 5700,
      subscriberCountFormatted: '5,700',
      viewCountFormatted: '2,350,000+',
      videoCountFormatted: '608+'
    });
  }
}
