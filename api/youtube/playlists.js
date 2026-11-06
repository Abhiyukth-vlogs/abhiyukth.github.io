import { getPlaylistsFeed } from '../_lib/youtubePlaylists.js';

/**
 * Vercel Serverless Function: GET /api/youtube/playlists
 * Returns automatically discovered, verified YouTube playlists for Abhiyukth Vlogs
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const feed = await getPlaylistsFeed();
    return res.status(200).json(feed);
  } catch (error) {
    return res.status(200).json({
      success: false,
      error: error.message,
      items: []
    });
  }
}
