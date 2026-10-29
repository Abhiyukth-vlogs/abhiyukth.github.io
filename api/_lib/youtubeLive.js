import axios from 'axios';
import { getOwnerAccessToken } from './youtubeShorts.js';

/**
 * YouTube Live Stream Discovery Service
 * 
 * Automatically detects currently active public YouTube livestreams for Abhiyukth Vlogs.
 * Supports:
 *  - Preferred owner-authorized liveBroadcasts.list (1 quota unit)
 *  - Quota-aware API Key search.list + videos.list fallback (100 quota units)
 *  - Public visibility and channel ownership verification
 *  - Scheduled broadcast exclusion (only live after actual start)
 *  - Most-recently-started stream selection if multiple are active
 *  - Automatic switch to "Latest Live Replay" upon stream completion
 *  - Shared server-side caching (90s live / 10m replay) and in-flight deduplication
 *  - Resilient failure preservation without stale LIVE confirmation
 */

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCuG7-r1F3b2RzGoRFIe0MnQ';
const CHANNEL_HANDLE = '@abhiyukthvlogs';

// 90-second freshness interval for active live broadcasts (conserves quota while keeping updates fresh)
const LIVE_CACHE_TTL_MS = 90 * 1000;

// 10-minute cache for completed stream replays (avoids repeating 100-unit searches during long offline periods)
const REPLAY_CACHE_TTL_MS = 10 * 60 * 1000;

// Maximum duration to serve a cached LIVE status during repeated API failures before demoting to unconfirmed
const MAX_STALE_LIVE_MS = 5 * 60 * 1000;

// In-memory cache across serverless and Express requests
let liveCache = {
  timestamp: 0,
  data: null
};

let replayCache = {
  timestamp: 0,
  data: null
};

// Request deduplication lock
let inFlightLivePromise = null;

// Verified real fallback baseline (Abhiyukth Vlogs latest completed live stream)
export const FALLBACK_LIVE_DATA = {
  isLive: false,
  status: 'completed',
  badgeText: 'Latest Live Replay',
  stream: {
    videoId: 'KPhHbQf4JLs',
    title: '🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 37 | Malayalam Gameplay | Abhiyukth Vlogs',
    description: 'Ghost of Tsushima Director’s Cut PS5 live gameplay in Malayalam with Abhiyukth Vlogs.',
    thumbnail: 'https://i.ytimg.com/vi/KPhHbQf4JLs/maxresdefault.jpg',
    watchUrl: 'https://www.youtube.com/watch?v=KPhHbQf4JLs',
    channelId: 'UCuG7-r1F3b2RzGoRFIe0MnQ',
    channelTitle: 'Abhiyukth vlogs',
    category: 'Gaming / PS5',
    actualStartTime: '2026-10-29T10:54:55Z',
    actualEndTime: '2026-10-29T11:12:54Z'
  },
  source: 'verified_baseline',
  lastUpdated: new Date().toISOString()
};

/**
 * Returns the best available thumbnail URL with graceful fallback
 */
function getBestThumbnail(thumbnails, videoId) {
  if (thumbnails?.maxres?.url) return thumbnails.maxres.url;
  if (thumbnails?.standard?.url) return thumbnails.standard.url;
  if (thumbnails?.high?.url) return thumbnails.high.url;
  if (thumbnails?.medium?.url) return thumbnails.medium.url;
  if (thumbnails?.default?.url) return thumbnails.default.url;
  return `https://i.ytimg.com/vi/${videoId}/hq720.jpg`;
}

/**
 * Preferred Owner-Authorized YouTube Live Streaming API discovery
 * liveBroadcasts.list with broadcastStatus=active & broadcastType=all
 * NOTE: Does NOT include 'mine' parameter because 'mine' and 'broadcastStatus' are mutually exclusive.
 */
async function discoverViaOwnerOAuth(ownerToken) {
  const res = await axios.get('https://www.googleapis.com/youtube/v3/liveBroadcasts', {
    params: {
      part: 'snippet,status,contentDetails',
      broadcastStatus: 'active',
      broadcastType: 'all',
      maxResults: 5
    },
    headers: {
      Authorization: `Bearer ${ownerToken}`
    },
    timeout: 7000
  });

  const items = res.data?.items || [];
  if (items.length === 0) return null;

  // Filter: Public visibility, channel ownership, actual live status (not scheduled/upcoming)
  const activeBroadcasts = items.filter((b) => {
    const isPublic = b.status?.privacyStatus === 'public';
    const isChannel = !b.snippet?.channelId || b.snippet.channelId === CHANNEL_ID;
    const isLive = b.status?.lifeCycleStatus === 'live';
    const hasStarted = !!b.snippet?.actualStartTime && !b.snippet?.actualEndTime;
    return isPublic && isChannel && isLive && hasStarted;
  });

  if (activeBroadcasts.length === 0) return null;

  // If multiple public broadcasts are active, sort by actualStartTime descending (show only the most recently started one)
  activeBroadcasts.sort((a, b) => {
    const timeA = new Date(a.snippet?.actualStartTime || 0).getTime();
    const timeB = new Date(b.snippet?.actualStartTime || 0).getTime();
    return timeB - timeA;
  });

  const broadcast = activeBroadcasts[0];
  return {
    isLive: true,
    status: 'live',
    badgeText: 'LIVE NOW',
    stream: {
      videoId: broadcast.id,
      title: broadcast.snippet?.title || 'Live Stream',
      description: broadcast.snippet?.description || '',
      thumbnail: getBestThumbnail(broadcast.snippet?.thumbnails, broadcast.id),
      watchUrl: `https://www.youtube.com/watch?v=${broadcast.id}`,
      channelId: broadcast.snippet?.channelId || CHANNEL_ID,
      channelTitle: broadcast.snippet?.channelTitle || 'Abhiyukth vlogs',
      category: 'Live Broadcast',
      actualStartTime: broadcast.snippet?.actualStartTime
    },
    source: 'owner_live_broadcasts'
  };
}

/**
 * Quota-aware API Key live discovery fallback (search.list + videos.list)
 */
async function discoverViaApiKeyLive(apiKey) {
  // Step 1: Query active live streams for the channel
  const searchRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      part: 'snippet',
      channelId: CHANNEL_ID,
      type: 'video',
      eventType: 'live',
      maxResults: 5,
      key: apiKey
    },
    timeout: 7000
  });

  const items = searchRes.data?.items || [];
  if (items.length === 0) return null;

  const videoIds = items.map((i) => i.id?.videoId).filter(Boolean);
  if (videoIds.length === 0) return null;

  // Step 2: Verify video status, liveBroadcastContent, and liveStreamingDetails
  const videosRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
    params: {
      part: 'snippet,status,contentDetails,liveStreamingDetails',
      id: videoIds.join(','),
      key: apiKey
    },
    timeout: 7000
  });

  const videos = videosRes.data?.items || [];
  const activeStreams = videos.filter((v) => {
    const isPublic = v.status?.privacyStatus === 'public';
    const isChannel = v.snippet?.channelId === CHANNEL_ID;
    const isActuallyLive = v.snippet?.liveBroadcastContent === 'live';
    const hasStarted = !!v.liveStreamingDetails?.actualStartTime && !v.liveStreamingDetails?.actualEndTime;
    // Scheduled broadcasts must NOT be displayed as currently live before they actually start
    return isPublic && isChannel && isActuallyLive && hasStarted;
  });

  if (activeStreams.length === 0) return null;

  // If multiple public broadcasts are active, choose only the most recently started one
  activeStreams.sort((a, b) => {
    const timeA = new Date(a.liveStreamingDetails?.actualStartTime || a.snippet?.publishedAt || 0).getTime();
    const timeB = new Date(b.liveStreamingDetails?.actualStartTime || b.snippet?.publishedAt || 0).getTime();
    return timeB - timeA;
  });

  const v = activeStreams[0];
  return {
    isLive: true,
    status: 'live',
    badgeText: 'LIVE NOW',
    stream: {
      videoId: v.id,
      title: v.snippet?.title || 'Live Stream',
      description: v.snippet?.description || '',
      thumbnail: getBestThumbnail(v.snippet?.thumbnails, v.id),
      watchUrl: `https://www.youtube.com/watch?v=${v.id}`,
      channelId: v.snippet?.channelId || CHANNEL_ID,
      channelTitle: v.snippet?.channelTitle || 'Abhiyukth vlogs',
      category: 'Live Broadcast',
      actualStartTime: v.liveStreamingDetails?.actualStartTime
    },
    source: 'api_key_live'
  };
}

/**
 * Discovers the latest completed public livestream to serve as "Latest Live Replay"
 */
async function discoverLatestCompletedStream(apiKey) {
  const now = Date.now();
  // Return cached replay if still fresh (10 minutes)
  if (replayCache.data && (now - replayCache.timestamp < REPLAY_CACHE_TTL_MS)) {
    return {
      ...replayCache.data,
      cached: true
    };
  }

  if (!apiKey) {
    return FALLBACK_LIVE_DATA;
  }

  try {
    const searchRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        channelId: CHANNEL_ID,
        type: 'video',
        eventType: 'completed',
        order: 'date',
        maxResults: 5,
        key: apiKey
      },
      timeout: 7000
    });

    const items = searchRes.data?.items || [];
    const videoIds = items.map((i) => i.id?.videoId).filter(Boolean);

    if (videoIds.length === 0) {
      return replayCache.data || FALLBACK_LIVE_DATA;
    }

    const videosRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,status,contentDetails,liveStreamingDetails',
        id: videoIds.join(','),
        key: apiKey
      },
      timeout: 7000
    });

    const rawVideos = videosRes.data?.items || [];
    const completedStreams = rawVideos.filter((v) => {
      const isPublic = v.status?.privacyStatus === 'public';
      const isChannel = v.snippet?.channelId === CHANNEL_ID;
      const isStream = !!v.liveStreamingDetails?.actualStartTime;
      return isPublic && isChannel && isStream;
    });

    if (completedStreams.length === 0) {
      return replayCache.data || FALLBACK_LIVE_DATA;
    }

    // Sort by latest ended / started time
    completedStreams.sort((a, b) => {
      const timeA = new Date(a.liveStreamingDetails?.actualEndTime || a.liveStreamingDetails?.actualStartTime || a.snippet?.publishedAt || 0).getTime();
      const timeB = new Date(b.liveStreamingDetails?.actualEndTime || b.liveStreamingDetails?.actualStartTime || b.snippet?.publishedAt || 0).getTime();
      return timeB - timeA;
    });

    const latest = completedStreams[0];
    const result = {
      isLive: false,
      status: 'completed',
      badgeText: 'Latest Live Replay',
      stream: {
        videoId: latest.id,
        title: latest.snippet?.title || 'Latest Live Replay',
        description: latest.snippet?.description || '',
        thumbnail: getBestThumbnail(latest.snippet?.thumbnails, latest.id),
        watchUrl: `https://www.youtube.com/watch?v=${latest.id}`,
        channelId: latest.snippet?.channelId || CHANNEL_ID,
        channelTitle: latest.snippet?.channelTitle || 'Abhiyukth vlogs',
        category: 'Live Replay',
        actualStartTime: latest.liveStreamingDetails?.actualStartTime,
        actualEndTime: latest.liveStreamingDetails?.actualEndTime
      },
      source: 'api_key_completed',
      lastUpdated: new Date().toISOString()
    };

    replayCache = {
      timestamp: now,
      data: result
    };

    return result;
  } catch (err) {
    console.warn('[YouTube Live] Completed stream lookup warning:', err.response?.data?.error?.message || err.message);
    return replayCache.data || FALLBACK_LIVE_DATA;
  }
}

/**
 * Main Live Stream Discovery entry point with request deduplication and multi-tier fallbacks
 */
export async function getLiveStreamData() {
  const now = Date.now();

  // Return fresh live cache if valid (90 seconds)
  if (liveCache.data && (now - liveCache.timestamp < LIVE_CACHE_TTL_MS)) {
    return {
      success: true,
      cached: true,
      ...liveCache.data
    };
  }

  // Deduplicate concurrent in-flight requests
  if (inFlightLivePromise) {
    const result = await inFlightLivePromise;
    return {
      success: true,
      cached: true,
      ...result
    };
  }

  inFlightLivePromise = (async () => {
    try {
      const apiKey = process.env.YOUTUBE_API_KEY;
      const ownerToken = await getOwnerAccessToken();

      let activeBroadcast = null;

      // Tier 1: Owner-authorized liveBroadcasts.list (1 unit quota)
      if (ownerToken) {
        try {
          activeBroadcast = await discoverViaOwnerOAuth(ownerToken);
        } catch (oauthErr) {
          console.warn('[YouTube Live] Owner OAuth active check failed, falling back to API key:', oauthErr.response?.data?.error?.message || oauthErr.message);
        }
      }

      // Tier 2: API Key search fallback (100 units quota)
      if (!activeBroadcast && apiKey) {
        try {
          activeBroadcast = await discoverViaApiKeyLive(apiKey);
        } catch (apiErr) {
          console.warn('[YouTube Live] API Key live search failed:', apiErr.response?.data?.error?.message || apiErr.message);
        }
      }

      let finalResult = null;

      if (activeBroadcast) {
        finalResult = {
          ...activeBroadcast,
          lastUpdated: new Date().toISOString()
        };
        // Reset replay cache so when this live stream ends, the new replay is fetched immediately
        replayCache = { timestamp: 0, data: null };
      } else {
        // Tier 3: No active broadcast -> Get latest completed live replay
        if (liveCache.data?.isLive) {
          // If we just transitioned from live to offline, invalidate replayCache
          replayCache = { timestamp: 0, data: null };
        }
        const completed = await discoverLatestCompletedStream(apiKey);
        finalResult = {
          ...completed,
          lastUpdated: new Date().toISOString()
        };
      }

      // Update in-memory liveCache
      liveCache = {
        timestamp: Date.now(),
        data: finalResult
      };

      return finalResult;
    } catch (err) {
      console.error('[YouTube Live] Discovery error:', err.message);

      // Failure Handling:
      // An API failure must NOT be interpreted as confirmation that the channel is offline.
      // Preserve the last successful card during temporary failures, but stop presenting stale status as confirmed LIVE.
      if (liveCache.data) {
        const cacheAgeMs = Date.now() - liveCache.timestamp;
        const isStaleLive = liveCache.data.isLive && (cacheAgeMs > MAX_STALE_LIVE_MS);

        return {
          ...liveCache.data,
          isLive: isStaleLive ? false : liveCache.data.isLive,
          badgeText: isStaleLive ? 'Latest Live Replay' : liveCache.data.badgeText,
          status: isStaleLive ? 'unconfirmed_fallback' : liveCache.data.status,
          stale: true,
          notice: 'Serving preserved card during temporary API failure'
        };
      }

      return {
        ...FALLBACK_LIVE_DATA,
        stale: true,
        notice: 'Serving verified fallback dataset'
      };
    } finally {
      inFlightLivePromise = null;
    }
  })();

  const result = await inFlightLivePromise;
  return {
    success: true,
    cached: false,
    ...result
  };
}

/**
 * Helper to manually reset cache (for testing or manual sync)
 */
export function clearLiveStreamCache() {
  liveCache = { timestamp: 0, data: null };
  replayCache = { timestamp: 0, data: null };
}
