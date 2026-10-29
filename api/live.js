import { getLiveStreamData } from './_lib/youtubeLive.js';

/**
 * Vercel Serverless Function: GET /api/live
 * Returns dynamically discovered, verified active YouTube livestream or latest replay for Abhiyukth Vlogs
 */
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  // Edge caching with stale-while-revalidate (90s cache, 180s stale)
  res.setHeader('Cache-Control', 's-maxage=90, stale-while-revalidate=180');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const data = await getLiveStreamData();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      success: false,
      error: error.message,
      isLive: false,
      status: 'error_fallback',
      badgeText: 'Latest Live Replay'
    });
  }
}
