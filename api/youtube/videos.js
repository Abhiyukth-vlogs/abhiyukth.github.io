import { getVideosFeed } from '../_lib/youtubeVideos.js';

/**
 * Vercel Serverless Function: GET /api/youtube/videos
 * Returns automatically discovered, verified long-form videos for Abhiyukth Vlogs
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const feed = await getVideosFeed();
    return res.status(200).json(feed);
  } catch (error) {
    return res.status(200).json({
      success: false,
      error: error.message,
      items: []
    });
  }
}

