import axios from 'axios';
import { parseDuration, formatViews } from './youtubeShorts.js';

/**
 * YouTube Long-form Videos Service
 * Discovers and updates public videos (excluding shorts),
 * categorizes them automatically (Gaming / Vlogs / Live Replays),
 * and caches results with stale-while-revalidate.
 */

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCuG7-r1F3b2RzGoRFIe0MnQ';
const CHANNEL_HANDLE = '@abhiyukthvlogs';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes freshness

let memoryCache = {
  timestamp: 0,
  data: null
};

export const FALLBACK_VIDEOS = [
  {
    id: 'gxpAlDUWIOQ',
    title: 'ആദ്യ വാക്കത്തോൺ… ആവേശം വേറെ ലെവൽ! 😍 Kozhikode Walkaaro Walkathon 2026',
    category: 'Vlogs',
    views: '738 views',
    viewCount: 738,
    timeAgo: 'Recent',
    publishedAt: '2026-10-25T10:00:00Z',
    duration: 'Vlog',
    durationSeconds: 900,
    thumbnail: 'https://i.ytimg.com/vi/gxpAlDUWIOQ/hq720.jpg'
  },
  {
    id: 'Kw2kIt6dyU4',
    title: "IRL Ghost Of Tsushima Director's Cut: Live Ps5 l Malayalam Live",
    category: 'Live Replays',
    views: 'Stream Replay',
    viewCount: 250,
    timeAgo: 'Recent Stream',
    publishedAt: '2026-10-24T10:00:00Z',
    duration: 'PS5 Live',
    durationSeconds: 3600,
    thumbnail: 'https://i.ytimg.com/vi/Kw2kIt6dyU4/hq720.jpg'
  },
  {
    id: 'w_Ot6HTaOIo',
    title: 'Sreekrishna Jayanthi 2026 | അമ്പമ്പോ! ഇങ്ങനെയൊരു ശോഭയാത്ര ഈ അടുത്തൊന്നും കണ്ടിട്ടില്ല 😱🔥| Abhiyukth',
    category: 'Vlogs',
    views: '325 views',
    viewCount: 325,
    timeAgo: 'Recent',
    publishedAt: '2026-09-20T10:00:00Z',
    duration: 'Vlog',
    durationSeconds: 720,
    thumbnail: 'https://i.ytimg.com/vi/w_Ot6HTaOIo/hq720.jpg'
  },
  {
    id: 'gAZaOn0ykDU',
    title: '🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 15 | Malayalam Gameplay | Abhiyukth Vlogs',
    category: 'Gaming',
    views: '162 views',
    viewCount: 162,
    timeAgo: 'Recent Stream',
    publishedAt: '2026-09-15T10:00:00Z',
    duration: 'PS5 Gameplay',
    durationSeconds: 4200,
    thumbnail: 'https://i.ytimg.com/vi/gAZaOn0ykDU/hq720.jpg'
  },
  {
    id: 'Chd998MvZ5E',
    title: '🔥 Kerala to Maharashtra by Train 🚆 | Epic Mangala Lakshadweep Express Journey | Part 2',
    category: 'Vlogs',
    views: '55 views',
    viewCount: 55,
    timeAgo: 'Travel Series',
    publishedAt: '2026-08-10T10:00:00Z',
    duration: 'Train Vlog',
    durationSeconds: 1200,
    thumbnail: 'https://i.ytimg.com/vi/Chd998MvZ5E/hq720.jpg'
  },
  {
    id: 'MT7urAnHevo',
    title: 'മഹാരാഷ്ട്ര യാത്ര തുടങ്ങി! കോഴിക്കോട് ടു നാസിക് മംഗള എക്സ്പ്രസ്സിൽ 🤩 | Bharat Darshan Part 1',
    category: 'Vlogs',
    views: '68 views',
    viewCount: 68,
    timeAgo: 'Travel Series',
    publishedAt: '2026-08-05T10:00:00Z',
    duration: 'Train Vlog',
    durationSeconds: 1100,
    thumbnail: 'https://i.ytimg.com/vi/MT7urAnHevo/hq720.jpg'
  },
  {
    id: 'O9v5lJIN3l4',
    title: 'MALAYALAM GTA 5 Live From India Kerala ! 🎮🔥 മലയാളത്തിലെ ആദ്യത്തെ Kick ലൈവ് Abhiyukth vlogs!',
    category: 'Gaming',
    views: 'Live Replay',
    viewCount: 120,
    timeAgo: 'GTA V',
    publishedAt: '2026-07-20T10:00:00Z',
    duration: 'Stream Replay',
    durationSeconds: 3800,
    thumbnail: 'https://i.ytimg.com/vi/O9v5lJIN3l4/hq720.jpg'
  },
  {
    id: '27mLvjo0l5I',
    title: "MALAYALAM'S GTA 5 MULTI-STREAM! 🎮🔥 മലയാളത്തിലെ ആദ്യത്തെ ലൈവ്!",
    category: 'Gaming',
    views: '51 views',
    viewCount: 51,
    timeAgo: 'Multi-stream',
    publishedAt: '2026-07-15T10:00:00Z',
    duration: 'Stream',
    durationSeconds: 3600,
    thumbnail: 'https://i.ytimg.com/vi/27mLvjo0l5I/hq720.jpg'
  },
  {
    id: 'Qo87K-jZtVY',
    title: 'അപ്രതീക്ഷിത കാഴ്ച! 🤩 | Jammu Srinagar Vande Bharat First Run | Abhiyukth Vlogs',
    category: 'Vlogs',
    views: '152 views',
    viewCount: 152,
    timeAgo: 'Vande Bharat',
    publishedAt: '2026-06-10T10:00:00Z',
    duration: 'Express Journey',
    durationSeconds: 650,
    thumbnail: 'https://i.ytimg.com/vi/Qo87K-jZtVY/hq720.jpg'
  },
  {
    id: 'nTNeHU_VU70',
    title: 'രാജസ്ഥാൻ മരുഭൂമിയിലെ ഞെട്ടിക്കുന്ന കാഴ്ച! 🏜️ Part 2: Nizamuddin Arrival.',
    category: 'Vlogs',
    views: '274 views',
    viewCount: 274,
    timeAgo: 'Rajasthan Series',
    publishedAt: '2026-05-18T10:00:00Z',
    duration: 'Vlog',
    durationSeconds: 800,
    thumbnail: 'https://i.ytimg.com/vi/nTNeHU_VU70/hq720.jpg'
  },
  {
    id: '7m_R3PTSRZo',
    title: 'രാജധാനി എക്സ്പ്രസ്സിലെ 3,000km യാത്ര; ആരും പറയാത്ത ആ സത്യം! 🤫',
    category: 'Vlogs',
    views: '170 views',
    viewCount: 170,
    timeAgo: 'Rajdhani Series',
    publishedAt: '2026-05-02T10:00:00Z',
    duration: 'Train Journey',
    durationSeconds: 980,
    thumbnail: 'https://i.ytimg.com/vi/7m_R3PTSRZo/hq720.jpg'
  },
  {
    id: 'AbARbxnrwSI',
    title: 'Bgmi Live Streaming | A Avarage Play Pls Support #bgmilive',
    category: 'Live Replays',
    views: 'BGMI Live',
    viewCount: 95,
    timeAgo: 'Stream Replay',
    publishedAt: '2026-04-12T10:00:00Z',
    duration: 'BGMI Stream',
    durationSeconds: 5400,
    thumbnail: 'https://i.ytimg.com/vi/AbARbxnrwSI/hq720.jpg'
  }
];

export function categorizeVideo(title = '', desc = '') {
  const text = `${title} ${desc}`.toLowerCase();
  
  if (text.includes('live replay') || text.includes('stream replay') || text.includes('bgmi live')) {
    return 'Live Replays';
  }
  if (text.includes('ghost of tsushima') || text.includes('gta') || text.includes('ps5') || text.includes('gaming') || text.includes('gameplay') || text.includes('bgmi') || text.includes('pubg') || text.includes('free fire')) {
    return 'Gaming';
  }
  if (text.includes('live') || text.includes('🔴') || text.includes('stream')) {
    return 'Live Replays';
  }
  return 'Vlogs';
}

export function formatDurationHuman(seconds = 0) {
  if (seconds <= 0) return 'Video';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatTimeAgo(publishedAt) {
  if (!publishedAt) return 'Recent';
  try {
    const now = new Date();
    const past = new Date(publishedAt);
    const diffDays = Math.floor((now - past) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  } catch {
    return 'Recent';
  }
}

export async function fetchDiscoveredVideos(apiKey) {
  const chanRes = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
    params: {
      part: 'contentDetails',
      id: CHANNEL_ID,
      key: apiKey
    },
    timeout: 6000
  });

  const uploadsPlaylistId = chanRes.data?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylistId) return FALLBACK_VIDEOS;

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
  if (playlistItems.length === 0) return FALLBACK_VIDEOS;

  const videoIds = playlistItems.map(item => item.contentDetails?.videoId).filter(Boolean);

  const videosRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
    params: {
      part: 'snippet,contentDetails,statistics,status',
      id: videoIds.join(','),
      key: apiKey
    },
    timeout: 8000
  });

  const rawVideos = videosRes.data?.items || [];
  const discovered = [];

  for (const v of rawVideos) {
    const status = v.status || {};
    if (status.privacyStatus !== 'public' || status.uploadStatus !== 'processed') continue;

    const durationIso = v.contentDetails?.duration;
    const durationSeconds = parseDuration(durationIso);
    const title = v.snippet?.title || '';
    const desc = v.snippet?.description || '';

    // Filter out Shorts (under 60s with shorts tag, or <= 60s vertical format)
    const hasShortTag = /#shorts/i.test(title) || /#short/i.test(title);
    if (durationSeconds <= 60 && hasShortTag) continue;
    if (durationSeconds <= 30) continue; // Skip ultra-short clips

    const views = Number(v.statistics?.viewCount) || 0;
    const thumb = v.snippet?.thumbnails?.maxres?.url
      || v.snippet?.thumbnails?.standard?.url
      || v.snippet?.thumbnails?.high?.url
      || `https://i.ytimg.com/vi/${v.id}/hq720.jpg`;

    discovered.push({
      id: v.id,
      title,
      description: desc,
      category: categorizeVideo(title, desc),
      views: formatViews(views),
      viewCount: views,
      viewCountFormatted: views.toLocaleString('en-US'),
      timeAgo: formatTimeAgo(v.snippet?.publishedAt),
      publishedAt: v.snippet?.publishedAt || new Date().toISOString(),
      duration: formatDurationHuman(durationSeconds),
      durationSeconds,
      thumbnail: thumb
    });
  }

  // Deduplicate and combine with fallback baseline
  const seenIds = new Set(discovered.map(v => v.id));
  FALLBACK_VIDEOS.forEach(f => {
    if (!seenIds.has(f.id)) {
      discovered.push(f);
      seenIds.add(f.id);
    }
  });

  discovered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  return discovered;
}

export async function getVideosFeed() {
  const now = Date.now();
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (memoryCache.data && (now - memoryCache.timestamp < CACHE_TTL_MS)) {
    return {
      success: true,
      cached: true,
      items: memoryCache.data.items,
      count: memoryCache.data.items.length,
      lastUpdated: memoryCache.data.lastUpdated
    };
  }

  if (!apiKey) {
    return {
      success: true,
      cached: false,
      fallback: true,
      items: FALLBACK_VIDEOS,
      count: FALLBACK_VIDEOS.length,
      lastUpdated: new Date().toISOString()
    };
  }

  try {
    const items = await fetchDiscoveredVideos(apiKey);
    const feedData = {
      items,
      lastUpdated: new Date().toISOString()
    };
    memoryCache = { timestamp: now, data: feedData };

    return {
      success: true,
      cached: false,
      items: feedData.items,
      count: feedData.items.length,
      lastUpdated: feedData.lastUpdated
    };
  } catch (err) {
    console.warn('[Videos API Error]:', err.message);
    return {
      success: true,
      fallback: true,
      error: err.message,
      items: memoryCache.data ? memoryCache.data.items : FALLBACK_VIDEOS,
      count: (memoryCache.data ? memoryCache.data.items : FALLBACK_VIDEOS).length,
      lastUpdated: new Date().toISOString()
    };
  }
}
