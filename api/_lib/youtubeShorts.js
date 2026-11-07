import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { youtubeGet, getYoutubeApiKeys } from './youtubeClient.js';

/**
 * YouTube Shorts Service
 * Handles automatic discovery, accurate multi-layer classification,
 * owner OAuth integration (Analytics / fileDetails), 5-minute caching,
 * and resilient fallbacks.
 */

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCuG7-r1F3b2RzGoRFIe0MnQ';
const CHANNEL_HANDLE = '@abhiyukthvlogs';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes freshness interval

// In-memory cache across serverless / express requests
let memoryCache = {
  timestamp: 0,
  data: null
};

// Bundled verified snapshot of Abhiyukth Vlogs Shorts as permanent resilient baseline
export const FALLBACK_SHORTS = [
  {
    id: 'q43G09a8Ey8',
    title: 'The Dark Brothers: New Era Started 🖤🔥 | Komban Gaddafi & Samurai',
    views: '1.2K+ views',
    viewCount: 1185,
    viewCountFormatted: '1.2K',
    timeAgo: 'Yesterday',
    publishedAt: '2026-11-05T08:20:06Z',
    duration: '0:23',
    durationSeconds: 23,
    thumbnail: 'https://i.ytimg.com/vi/q43G09a8Ey8/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/q43G09a8Ey8'
  },
  {
    id: 'CJrliLbGVDY',
    title: 'തളർത്താൻ നോക്കിയവർക്ക് മുന്നിൽ കൊമ്പന്റെ മാസ്സ് തി തിരിച്ചുവരവ്! 🔥🚌 | Komban Comeback #komban',
    views: '1.8K+ views',
    viewCount: 1796,
    viewCountFormatted: '1.8K',
    timeAgo: 'Yesterday',
    publishedAt: '2026-11-05T02:39:00Z',
    duration: '0:59',
    durationSeconds: 59,
    thumbnail: 'https://i.ytimg.com/vi/CJrliLbGVDY/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/CJrliLbGVDY'
  },
  {
    id: 'ih7ZHuzk6y0',
    title: '​Komban Beast Mode On 🔥 | Kerala Tourist Bus Edit',
    views: '1.2K+ views',
    viewCount: 1230,
    viewCountFormatted: '1.2K',
    timeAgo: '2 days ago',
    publishedAt: '2026-11-04T07:03:33Z',
    duration: '0:34',
    durationSeconds: 34,
    thumbnail: 'https://i.ytimg.com/vi/ih7ZHuzk6y0/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/ih7ZHuzk6y0'
  },
  {
    id: '0cSKwCmEb-0',
    title: 'Do You Know Who I Am? 😈🔥ആരാണെന്ന് മനസ്സിലായോ? | കൊമ്പനും ദീപു ചേട്ടനും ഒന്നിച്ച്! | Komban Mass Edit',
    views: '700+ views',
    viewCount: 706,
    viewCountFormatted: '706',
    timeAgo: '2 days ago',
    publishedAt: '2026-11-04T06:13:10Z',
    duration: '0:14',
    durationSeconds: 14,
    thumbnail: 'https://i.ytimg.com/vi/0cSKwCmEb-0/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/0cSKwCmEb-0'
  },
  {
    id: 'od2IbTNPKv4',
    title: 'പണി തുടങ്ങിക്കഴിഞ്ഞു! HE IS BACK 😈🔥 | Komban',
    views: '960+ views',
    viewCount: 960,
    viewCountFormatted: '960',
    timeAgo: '3 days ago',
    publishedAt: '2026-11-03T02:07:50Z',
    duration: '0:15',
    durationSeconds: 15,
    thumbnail: 'https://i.ytimg.com/vi/od2IbTNPKv4/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/od2IbTNPKv4'
  },
  {
    id: 'nZQI5GBYmpw',
    title: 'Emperor Strikes Again! 👑🔥 | Komban Dawood Mass Entry',
    views: '2.3K+ views',
    viewCount: 2310,
    viewCountFormatted: '2.3K',
    timeAgo: '4 days ago',
    publishedAt: '2026-11-02T06:26:36Z',
    duration: '0:10',
    durationSeconds: 10,
    thumbnail: 'https://i.ytimg.com/vi/nZQI5GBYmpw/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/nZQI5GBYmpw'
  },
  {
    id: 'imJsIgO5Jm8',
    title: 'ഈ മാസ്സ് എൻട്രി കണ്ടാൽ ആരും ഒന്ന് നോക്കിപ്പോകും! 😱🔥 | Komban Dark Feudal Lord',
    views: '1.5K+ views',
    viewCount: 1502,
    viewCountFormatted: '1.5K',
    timeAgo: '5 days ago',
    publishedAt: '2026-11-01T04:18:32Z',
    duration: '0:26',
    durationSeconds: 26,
    thumbnail: 'https://i.ytimg.com/vi/imJsIgO5Jm8/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/imJsIgO5Jm8'
  },
  {
    id: '5-klvEOtqpk',
    title: 'കൊമ്പന്റെ രാജകീയ തിരിച്ചുവരവ്! 🔥 ബോംബേ, ദാവൂദ്, കാളിയൻ ഒന്നിച്ച്!',
    views: '1.5K+ views',
    viewCount: 1546,
    viewCountFormatted: '1.5K',
    timeAgo: '1 week ago',
    publishedAt: '2026-10-30T02:29:49Z',
    duration: '0:26',
    durationSeconds: 26,
    thumbnail: 'https://i.ytimg.com/vi/5-klvEOtqpk/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/5-klvEOtqpk'
  },
  {
    id: 'meaMV8_jiAk',
    title: 'ഒടുവിൽ ആ കിടിലൻ കാഴ്ച നേരിട്ട് കണ്ടു! 🤩🔥 | Bus Spotting',
    views: '8.4K+ views',
    viewCount: 8357,
    viewCountFormatted: '8.4K',
    timeAgo: '1 week ago',
    publishedAt: '2026-10-29T13:13:50Z',
    duration: '0:08',
    durationSeconds: 8,
    thumbnail: 'https://i.ytimg.com/vi/meaMV8_jiAk/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/meaMV8_jiAk'
  },
  {
    id: 'zOaw1Y1JJl0',
    title: 'രോമാഞ്ചം വരുന്ന എൻട്രി! വെയിറ്റ് ഫോർ ഇറ്റ് 🥶🔥 | Komban Tourist Bus',
    views: '3.2K+ views',
    viewCount: 3165,
    viewCountFormatted: '3.2K',
    timeAgo: '1 week ago',
    publishedAt: '2026-10-29T13:10:07Z',
    duration: '0:24',
    durationSeconds: 24,
    thumbnail: 'https://i.ytimg.com/vi/zOaw1Y1JJl0/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/zOaw1Y1JJl0'
  },
  {
    id: 'KvOC-jGIA7U',
    title: 'ഈ വൈബ് വേറെ എങ്ങും കിട്ടില്ല! 💥 | Kerala Tourist Bus',
    views: '1.2K+ views',
    viewCount: 1234,
    viewCountFormatted: '1.2K',
    timeAgo: '1 week ago',
    publishedAt: '2026-10-29T13:08:31Z',
    duration: '0:30',
    durationSeconds: 30,
    thumbnail: 'https://i.ytimg.com/vi/KvOC-jGIA7U/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/KvOC-jGIA7U'
  },
  {
    id: '5I2WDcwajbk',
    title: 'Komban Holidays Mass Edit 🔥 | Kerala Tourist Bus',
    views: '1.3K+ views',
    viewCount: 1269,
    viewCountFormatted: '1.3K',
    timeAgo: '1 week ago',
    publishedAt: '2026-10-29T13:08:12Z',
    duration: '0:15',
    durationSeconds: 15,
    thumbnail: 'https://i.ytimg.com/vi/5I2WDcwajbk/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/5I2WDcwajbk'
  },
  {
    id: '46v2NN0qgWU',
    title: 'ഈ എൻട്രി കണ്ടാൽ ആരും ഒന്ന് നോക്കിപ്പോകും! 😱🔥 | Komban Mass',
    views: '1.2K+ views',
    viewCount: 1230,
    viewCountFormatted: '1.2K',
    timeAgo: '1 week ago',
    publishedAt: '2026-10-29T13:07:28Z',
    duration: '0:24',
    durationSeconds: 24,
    thumbnail: 'https://i.ytimg.com/vi/46v2NN0qgWU/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/46v2NN0qgWU'
  },
  {
    id: 'SMZVQ9PGK_I',
    title: 'ആരാധകരുടെ നടുവിലൂടെ അവൻ വരുന്നു 🔥 | Komban Tourist Bus #shorts #komban',
    views: '1.2K+ views',
    viewCount: 1198,
    viewCountFormatted: '1.2K',
    timeAgo: '1 week ago',
    publishedAt: '2026-10-29T10:54:06Z',
    duration: '0:23',
    durationSeconds: 23,
    thumbnail: 'https://i.ytimg.com/vi/SMZVQ9PGK_I/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/SMZVQ9PGK_I'
  },
  {
    id: 'rpC1djTx4LM',
    title: 'കൊമ്പൻ ഗദ്ദാഫിയുടെ മാസ്സ് ലുക്ക്! 🔥😈 | KOMBaN GADDAFI Bus Edit #shorts',
    views: '1.5K+ views',
    viewCount: 1469,
    viewCountFormatted: '1.5K',
    timeAgo: '1 week ago',
    publishedAt: '2026-10-29T02:40:18Z',
    duration: '0:26',
    durationSeconds: 26,
    thumbnail: 'https://i.ytimg.com/vi/rpC1djTx4LM/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/rpC1djTx4LM'
  },
  {
    id: 'cGZKzygcVgk',
    title: 'The Beast KALIYAN ⚡ ബസ്സിനുള്ളിലെ ആ മാസ്സ് സൗണ്ട്! | Komban Tourist Bus Kerala',
    views: '1.9K+ views',
    viewCount: 1890,
    viewCountFormatted: '1.9K',
    timeAgo: '1 week ago',
    publishedAt: '2026-10-28T02:03:21Z',
    duration: '0:44',
    durationSeconds: 44,
    thumbnail: 'https://i.ytimg.com/vi/cGZKzygcVgk/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/cGZKzygcVgk'
  },
  {
    id: 'iA3cwLWYIbQ',
    title: '@reporterlive -ലും കൊമ്പന്റെ മാസ്സ് എൻട്രി 🔥 | Kerala Tourist Bus Thug Life',
    views: '14.1K+ views',
    viewCount: 14067,
    viewCountFormatted: '14.1K',
    timeAgo: '1 week ago',
    publishedAt: '2026-10-27T04:43:31Z',
    duration: '0:17',
    durationSeconds: 17,
    thumbnail: 'https://i.ytimg.com/vi/iA3cwLWYIbQ/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/iA3cwLWYIbQ'
  },
  {
    id: 'BoCyUIZo-jE',
    title: 'ഇതാണ് കൊമ്പന്റെ പവർ 💥🔥 | Komban Tourist Bus Mass Status',
    views: '1.3K+ views',
    viewCount: 1276,
    viewCountFormatted: '1.3K',
    timeAgo: '1 week ago',
    publishedAt: '2026-10-26T12:44:11Z',
    duration: '0:13',
    durationSeconds: 13,
    thumbnail: 'https://i.ytimg.com/vi/BoCyUIZo-jE/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/BoCyUIZo-jE'
  },
  {
    id: 'HTQSG5koicc',
    title: 'കൊമ്പൻ വന്നാൽ വൈബ് വേറെ ലെവൽ! 🔥 | Komban Holidays #shorts @reporterlive',
    views: '2.6K+ views',
    viewCount: 2595,
    viewCountFormatted: '2.6K',
    timeAgo: '1 week ago',
    publishedAt: '2026-10-26T05:03:57Z',
    duration: '0:19',
    durationSeconds: 19,
    thumbnail: 'https://i.ytimg.com/vi/HTQSG5koicc/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/HTQSG5koicc'
  },
  {
    id: 'DFyd3jeC5Jw',
    title: 'വീര... ഒത്തക്ക് ഒത്ത ഇറങ്ങി നിക്കണം! 🔥 | Komban Mass Entry',
    views: '1.6K+ views',
    viewCount: 1622,
    viewCountFormatted: '1.6K',
    timeAgo: '1 week ago',
    publishedAt: '2026-10-25T09:58:45Z',
    duration: '0:36',
    durationSeconds: 36,
    thumbnail: 'https://i.ytimg.com/vi/DFyd3jeC5Jw/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/DFyd3jeC5Jw'
  },
  {
    id: 'QxORffjaNMU',
    title: 'The Boss is Here 😈 | Komban Mass Edit',
    views: '1.5K+ views',
    viewCount: 1510,
    viewCountFormatted: '1.5K',
    timeAgo: '1 week ago',
    publishedAt: '2026-10-25T09:58:32Z',
    duration: '0:29',
    durationSeconds: 29,
    thumbnail: 'https://i.ytimg.com/vi/QxORffjaNMU/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/QxORffjaNMU'
  },
  {
    id: 'PvmrwoXvzwE',
    title: '🔥 Komban Holidays 🚌 | റോഡിലെ മാസ്സ് എൻട്രി! 😈🔥 | Kerala Bus Edit #Shorts',
    views: '1.7K+ views',
    viewCount: 1715,
    viewCountFormatted: '1.7K',
    timeAgo: '2 weeks ago',
    publishedAt: '2026-10-21T12:51:35Z',
    duration: '0:20',
    durationSeconds: 20,
    thumbnail: 'https://i.ytimg.com/vi/PvmrwoXvzwE/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/PvmrwoXvzwE'
  },
  {
    id: '7O3M2aeBVOk',
    title: 'നിങ്ങളുടെ സപ്പോർട്ടിന് ഒരായിരം നന്ദി! ❤️ 5.7K YT Fam & 13.8K Insta Views 🎉 #abhiyukthvlogs #shorts',
    views: '71+ views',
    viewCount: 71,
    viewCountFormatted: '71',
    timeAgo: '3 weeks ago',
    publishedAt: '2026-10-16T15:48:21Z',
    duration: '0:14',
    durationSeconds: 14,
    thumbnail: 'https://i.ytimg.com/vi/7O3M2aeBVOk/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/7O3M2aeBVOk'
  }
];

/**
 * Parse ISO 8601 duration (e.g. PT45S, PT1M20S, PT2H) into total seconds
 */
export function parseDuration(pt) {
  if (!pt) return 0;
  const match = pt.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Format view count (e.g. 11428 -> 11.4K views)
 */
export function formatViews(views) {
  const num = Number(views) || 0;
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M views`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K views`;
  }
  return `${num} views`;
}

/**
 * Check if YouTube serves this video as a Short via public route
 * Status 200 = True Short
 * Status 302/303 redirect to /watch = Landscape/Standard video
 */
export async function verifyShortsRoute(videoId) {
  try {
    const res = await axios.get(`https://www.youtube.com/shorts/${videoId}`, {
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 3500
    });

    // 200 OK means served as YouTube Short
    if (res.status === 200) {
      return { isShort: true, confirmed: true };
    }

    // Redirect to watch page means YouTube treats it as normal landscape video
    const location = res.headers?.location || '';
    if (location.includes('/watch') || res.status === 303 || res.status === 302) {
      return { isShort: false, confirmed: true };
    }

    return { isShort: true, confirmed: false };
  } catch (err) {
    // If redirects were blocked or error occurred, check redirect location in error response
    if (err.response) {
      const location = err.response.headers?.location || '';
      if (location.includes('/watch') || err.response.status === 303) {
        return { isShort: false, confirmed: true };
      }
      if (err.response.status === 200) {
        return { isShort: true, confirmed: true };
      }
    }
    // Network timeout: return unconfirmed fallback
    return { isShort: true, confirmed: false };
  }
}

/**
 * Optional Owner OAuth Token Refresh
 */
export async function getOwnerAccessToken() {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  try {
    const res = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    });
    return res.data?.access_token || null;
  } catch (err) {
    console.warn('[YouTube OAuth] Token refresh failed:', err.response?.data || err.message);
    return null;
  }
}

/**
 * Fetch and discover Shorts from YouTube API with multi-layer verification
 */
export async function fetchDiscoveredShorts() {
  // Step 1: Resolve Uploads Playlist
  const chanRes = await youtubeGet('https://www.googleapis.com/youtube/v3/channels', {
    params: {
      part: 'contentDetails,snippet,statistics',
      id: CHANNEL_ID
    },
    timeout: 6000
  });

  const channel = chanRes.data?.items?.[0];
  if (!channel) {
    throw new Error('Channel not found on YouTube');
  }

  const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylistId) {
    throw new Error('Uploads playlist not found for channel');
  }

  // Step 2: Fetch recent uploads from playlist (up to 50 items)
  const playlistRes = await youtubeGet('https://www.googleapis.com/youtube/v3/playlistItems', {
    params: {
      part: 'snippet,contentDetails',
      playlistId: uploadsPlaylistId,
      maxResults: 50
    },
    timeout: 6000
  });

  const playlistItems = playlistRes.data?.items || [];
  if (playlistItems.length === 0) {
    return FALLBACK_SHORTS;
  }

  const videoIds = playlistItems
    .map((item) => item.contentDetails?.videoId)
    .filter(Boolean);

  // Check if owner OAuth token is available for fileDetails / Analytics
  const ownerToken = await getOwnerAccessToken();

  // Step 3: Batch fetch video details
  const videoParams = {
    part: ownerToken ? 'snippet,contentDetails,statistics,status,fileDetails' : 'snippet,contentDetails,statistics,status',
    id: videoIds.join(',')
  };

  const headers = ownerToken ? { Authorization: `Bearer ${ownerToken}` } : {};

  const videosRes = await youtubeGet('https://www.googleapis.com/youtube/v3/videos', {
    params: videoParams,
    headers,
    timeout: 8000
  });

  const rawVideos = videosRes.data?.items || [];

  // Step 4: Accurate Shorts Identification & Filtering (High-speed concurrent)
  const candidateVideos = [];

  for (const v of rawVideos) {
    // Only expose public, processed videos belonging to this channel
    const status = v.status || {};
    if (status.privacyStatus !== 'public' || status.uploadStatus !== 'processed') {
      continue;
    }

    if (v.snippet?.channelId && v.snippet.channelId !== CHANNEL_ID) {
      continue;
    }

    const durationIso = v.contentDetails?.duration;
    const durationSeconds = parseDuration(durationIso);
    const publishedAt = v.snippet?.publishedAt || new Date().toISOString();
    const title = v.snippet?.title || '';
    const desc = v.snippet?.description || '';

    // Duration limits: YouTube shorts are max 180 seconds (3 mins)
    // Videos longer than 3 minutes cannot be Shorts
    if (durationSeconds <= 0 || durationSeconds > 180) {
      continue;
    }

    // Check upload-date rule: Prior to Oct 15, 2024, max shorts duration was 60s
    const uploadDate = new Date(publishedAt);
    const oct15Date = new Date('2024-10-15T00:00:00Z');
    if (uploadDate < oct15Date && durationSeconds > 60) {
      continue;
    }

    candidateVideos.push({ v, durationSeconds, publishedAt, title, desc });
  }

  // Evaluate candidate videos concurrently in parallel
  const evaluatedShorts = await Promise.all(
    candidateVideos.map(async ({ v, durationSeconds, publishedAt, title, desc }) => {
      let isShort = false;
      let classification = 'inferred';
      let classificationSource = 'duration_and_tags';

      // Layer 1: Check authenticated fileDetails aspect ratio if available
      if (v.fileDetails?.videoStreams?.[0]) {
        const stream = v.fileDetails.videoStreams[0];
        const w = stream.widthPixels || 0;
        const h = stream.heightPixels || 0;
        const rotation = stream.rotation || 0;

        if (w > 0 && h > 0) {
          // Vertical or square aspect ratio (height >= width)
          const isVertical = (rotation === 90 || rotation === 270) ? (w >= h) : (h >= w);
          if (isVertical) {
            isShort = true;
            classification = 'confirmed';
            classificationSource = 'file_metadata';
          } else {
            return null; // Explicitly landscape, exclude!
          }
        }
      }

      // Layer 2: Fast Hashtag & Route Check
      if (!isShort) {
        const hasShortsTag = /#shorts/i.test(title) || /#short/i.test(title) || /#shorts/i.test(desc);
        const isUltraShort = durationSeconds <= 60;

        if (hasShortsTag) {
          isShort = true;
          classification = 'confirmed';
          classificationSource = 'hashtag_detection';
        } else if (isUltraShort) {
          const routeResult = await verifyShortsRoute(v.id);
          if (routeResult.isShort) {
            isShort = true;
            classification = routeResult.confirmed ? 'confirmed' : 'inferred';
            classificationSource = 'public_route_check';
          } else {
            return null;
          }
        }
      }

      if (!isShort) return null;

      const views = Number(v.statistics?.viewCount) || 0;
      const thumb = v.snippet?.thumbnails?.maxres?.url
        || v.snippet?.thumbnails?.standard?.url
        || v.snippet?.thumbnails?.high?.url
        || `https://i.ytimg.com/vi/${v.id}/hq720.jpg`;

      return {
        id: v.id,
        title,
        description: desc,
        views: formatViews(views),
        viewCount: views,
        viewCountFormatted: views.toLocaleString('en-US'),
        likeCount: Number(v.statistics?.likeCount) || 0,
        publishedAt,
        duration: `0:${String(durationSeconds).padStart(2, '0')}`,
        durationSeconds,
        thumbnail: thumb,
        classification,
        classificationSource,
        url: `https://www.youtube.com/shorts/${v.id}`
      };
    })
  );

  const discoveredShorts = evaluatedShorts.filter(Boolean);

  // Deduplicate and combine with any baseline shorts not yet in discovered
  const seenIds = new Set(discoveredShorts.map((s) => s.id));
  FALLBACK_SHORTS.forEach((fallback) => {
    if (!seenIds.has(fallback.id)) {
      discoveredShorts.push(fallback);
      seenIds.add(fallback.id);
    }
  });

  // Sort descending by publication date (newest first)
  discoveredShorts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  return discoveredShorts;
}

/**
 * Main Shorts Feed Provider with 5-minute caching and stale-while-revalidate
 */
export async function getShortsFeed() {
  const now = Date.now();
  const keys = getYoutubeApiKeys();

  // 1. Return fresh cached data if valid (< 5 minutes old)
  if (memoryCache.data && (now - memoryCache.timestamp < CACHE_TTL_MS)) {
    return {
      success: true,
      cached: true,
      items: memoryCache.data.items,
      count: memoryCache.data.items.length,
      lastUpdated: memoryCache.data.lastUpdated,
      channelId: CHANNEL_ID,
      handle: CHANNEL_HANDLE
    };
  }

  // 2. If no API key configured, return verified curated snapshot
  if (keys.length === 0) {
    console.warn('[YouTube Shorts] YOUTUBE_API_KEY not configured, serving verified baseline');
    const snapshotData = {
      items: FALLBACK_SHORTS,
      lastUpdated: new Date().toISOString()
    };
    memoryCache = { timestamp: now, data: snapshotData };

    return {
      success: true,
      cached: false,
      fallback: true,
      message: 'YOUTUBE_API_KEY not set. Serving verified channel snapshot.',
      items: FALLBACK_SHORTS,
      count: FALLBACK_SHORTS.length,
      lastUpdated: snapshotData.lastUpdated,
      channelId: CHANNEL_ID,
      handle: CHANNEL_HANDLE
    };
  }

  // 3. Query YouTube Data API
  try {
    const items = await fetchDiscoveredShorts();
    const feedData = {
      items,
      lastUpdated: new Date().toISOString()
    };

    // Update memory cache
    memoryCache = {
      timestamp: now,
      data: feedData
    };

    return {
      success: true,
      cached: false,
      items: feedData.items,
      count: feedData.items.length,
      lastUpdated: feedData.lastUpdated,
      channelId: CHANNEL_ID,
      handle: CHANNEL_HANDLE
    };
  } catch (err) {
    const errMsg = err.response?.data?.error?.message || err.message;
    console.error('[YouTube Shorts Error]:', errMsg);

    // Stale-while-revalidate: if stale cache exists, serve it safely during outages/quota exhaustion
    if (memoryCache.data) {
      return {
        success: true,
        stale: true,
        error: errMsg,
        items: memoryCache.data.items,
        count: memoryCache.data.items.length,
        lastUpdated: memoryCache.data.lastUpdated,
        channelId: CHANNEL_ID,
        handle: CHANNEL_HANDLE
      };
    }

    // Permanent baseline safety fallback so site never breaks
    return {
      success: true,
      fallback: true,
      error: errMsg,
      items: FALLBACK_SHORTS,
      count: FALLBACK_SHORTS.length,
      lastUpdated: new Date().toISOString(),
      channelId: CHANNEL_ID,
      handle: CHANNEL_HANDLE
    };
  }
}
