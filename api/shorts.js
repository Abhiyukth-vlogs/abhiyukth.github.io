import { getShortsFeed } from './_lib/youtubeShorts.js';

/**
 * Vercel Serverless Function: GET /api/shorts
 * Returns automatically discovered, verified YouTube Shorts for Abhiyukth Vlogs
 */
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  // 5-minute CDN edge caching with stale-while-revalidate
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const feed = await getShortsFeed();
    return res.status(200).json(feed);
  } catch (error) {
    return res.status(200).json({
      success: false,
      error: error.message,
      items: []
    });
  }
}
