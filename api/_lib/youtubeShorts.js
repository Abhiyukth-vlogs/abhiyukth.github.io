import axios from 'axios';
import fs from 'fs';
import path from 'path';

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
    id: 'meaMV8_jiAk',
    title: 'ഒടുവിൽ ആ കിടിലൻ കാഴ്ച നേരിട്ട് കണ്ടു! 🤩🔥 | Bus Spotting',
    views: '395+ views',
    viewCount: 395,
    viewCountFormatted: '395',
    timeAgo: 'Recent',
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
    views: '276+ views',
    viewCount: 276,
    viewCountFormatted: '276',
    timeAgo: 'Recent',
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
    views: '96+ views',
    viewCount: 96,
    viewCountFormatted: '96',
    timeAgo: 'Recent',
    publishedAt: '2026-10-29T13:08:31Z',
    duration: '0:30',
    durationSeconds: 30,
    thumbnail: 'https://i.ytimg.com/vi/KvOC-jGIA7U/hq720.jpg',
    classification: 'confirmed',
    classificationSource: 'public_route_check',
    url: 'https://www.youtube.com/shorts/KvOC-jGIA7U'
  },
  {
    id: '46v2NN0qgWU',
    title: 'ഈ എൻട്രി കണ്ടാൽ ആരും ഒന്ന് നോക്കിപ്പോകും! 😱🔥 | Komban Mass',
    views: '312+ views',
    viewCount: 312,
    viewCountFormatted: '312',
    timeAgo: 'Recent',
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
    views: '838+ views',
    viewCount: 838,
    viewCountFormatted: '838',
    timeAgo: 'Recent',
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
    views: '1.1K+ views',
    viewCount: 1166,
    viewCountFormatted: '1.1K',
    timeAgo: 'Today',
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
    views: '1.4K+ views',
    viewCount: 1442,
    viewCountFormatted: '1.4K',
    timeAgo: 'Yesterday',
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
    views: '11.4K+ views',
    viewCount: 11428,
    viewCountFormatted: '11.4K',
    timeAgo: '2 days ago',
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
    views: '1.2K+ views',
    viewCount: 1244,
    viewCountFormatted: '1.2K',
    timeAgo: '3 days ago',
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
    views: '2.5K+ views',
    viewCount: 2496,
    viewCountFormatted: '2.5K',
    timeAgo: '3 days ago',
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
    viewCount: 1602,
    viewCountFormatted: '1.6K',
    timeAgo: '4 days ago',
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
    viewCount: 1499,
    viewCountFormatted: '1.5K',
    timeAgo: '4 days ago',
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
    viewCount: 1700,
    viewCountFormatted: '1.7K',
    timeAgo: '1 week ago',
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
    title: 'നിങ്ങളുടെ സപ്പോർട്ടിന് ഒരായിരം നന്ദി! ❤️ 5.7K YT Fam & 13.8K Insta Views 🎉 #shorts',
    views: '64+ views',
    viewCount: 64,
    viewCountFormatted: '64',
    timeAgo: '2 weeks ago',
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
export async function fetchDiscoveredShorts(apiKey) {
  // Step 1: Resolve Uploads Playlist
  const chanRes = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
    params: {
      part: 'contentDetails,snippet,statistics',
      id: CHANNEL_ID,
      key: apiKey
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
  const playlistRes = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
    params: {
      part: 'snippet,contentDetails',
      playlistId: uploadsPlaylistId,
      maxResults: 50,
      key: apiKey
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
    id: videoIds.join(','),
    key: apiKey
  };

  const headers = ownerToken ? { Authorization: `Bearer ${ownerToken}` } : {};

  const videosRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
    params: videoParams,
    headers,
    timeout: 8000
  });

  const rawVideos = videosRes.data?.items || [];

  // Step 4: Accurate Shorts Identification & Filtering
  const discoveredShorts = [];

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
          // Definitely landscape, exclude!
          continue;
        }
      }
    }

    // Layer 2: Public Route Verification Check (for videos not yet verified by fileDetails)
    if (!isShort) {
      // Check hashtags or title indicators first as a fast filter
      const hasShortsTag = /#shorts/i.test(title) || /#short/i.test(title) || /#shorts/i.test(desc);
      const isUltraShort = durationSeconds <= 60;

      if (isUltraShort || hasShortsTag) {
        const routeResult = await verifyShortsRoute(v.id);
        if (routeResult.isShort) {
          isShort = true;
          classification = routeResult.confirmed ? 'confirmed' : 'inferred';
          classificationSource = 'public_route_check';
        } else {
          // Public check explicitly returned redirect to /watch -> landscape video, do NOT include!
          continue;
        }
      }
    }

    if (isShort) {
      const views = Number(v.statistics?.viewCount) || 0;
      const thumb = v.snippet?.thumbnails?.maxres?.url
        || v.snippet?.thumbnails?.standard?.url
        || v.snippet?.thumbnails?.high?.url
        || `https://i.ytimg.com/vi/${v.id}/hq720.jpg`;

      discoveredShorts.push({
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
      });
    }
  }

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
  const apiKey = process.env.YOUTUBE_API_KEY;

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
  if (!apiKey) {
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
    const items = await fetchDiscoveredShorts(apiKey);
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
