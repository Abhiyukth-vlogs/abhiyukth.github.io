/**
 * Vercel Serverless Function: GET /api/auth/status
 * Reports YouTube API and owner OAuth connection status
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const hasApiKey = !!process.env.YOUTUBE_API_KEY;
  const hasClientId = !!process.env.YOUTUBE_CLIENT_ID;
  const hasClientSecret = !!process.env.YOUTUBE_CLIENT_SECRET;
  const hasRefreshToken = !!process.env.YOUTUBE_REFRESH_TOKEN;
  const channelId = process.env.YOUTUBE_CHANNEL_ID || 'UCuG7-r1F3b2RzGoRFIe0MnQ';

  const isOAuthConnected = hasClientId && hasClientSecret && hasRefreshToken;

  return res.status(200).json({
    status: 'ok',
    channel: {
      id: channelId,
      handle: '@abhiyukthvlogs'
    },
    apiConfigured: hasApiKey,
    ownerOAuth: {
      connected: isOAuthConnected,
      scopes: isOAuthConnected ? [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/yt-analytics.readonly'
      ] : [],
      analyticsAccess: isOAuthConnected,
      fileMetadataAccess: isOAuthConnected
    },
    syncCapabilities: {
      autoDiscovery: true,
      accurateClassification: isOAuthConnected ? 'authenticated_file_and_analytics' : 'public_route_and_duration_verification',
      refreshIntervalMinutes: 5
    }
  });
}
