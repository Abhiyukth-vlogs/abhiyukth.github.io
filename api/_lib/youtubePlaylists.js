import axios from 'axios';

/**
 * YouTube Playlists Service
 * Automatically discovers, synchronizes, and caches all public playlists for Abhiyukth Vlogs.
 */

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCuG7-r1F3b2RzGoRFIe0MnQ';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes freshness

let memoryCache = {
  timestamp: 0,
  data: null
};

export const FALLBACK_PLAYLISTS = [
  {
    id: 'PLQ2TfYp3osGo',
    title: "Ghost Of Tsushima Director's Cut",
    videoCount: '46 videos',
    itemCount: 46,
    category: 'PS5 Gaming',
    url: 'https://www.youtube.com/playlist?list=PLQ2TfYp3osGo',
    thumbnail: 'https://i.ytimg.com/vi/XkRzYEh5ZmU/hqdefault.jpg'
  },
  {
    id: 'PLYi1OQ16aBcE',
    title: 'PS5 Live Stream',
    videoCount: '5 videos',
    itemCount: 5,
    category: 'Live Gaming',
    url: 'https://www.youtube.com/playlist?list=PLYi1OQ16aBcE',
    thumbnail: 'https://i.ytimg.com/vi/aPsZHOZQ94I/hqdefault.jpg'
  },
  {
    id: 'PLTlraZlovbczPPU_ANskKUY86Iy-xG-L7',
    title: 'Kozhikode to Kashmir by Train',
    videoCount: '3 videos',
    itemCount: 3,
    category: 'Travel Series',
    url: 'https://www.youtube.com/playlist?list=PLTlraZlovbczPPU_ANskKUY86Iy-xG-L7',
    thumbnail: 'https://i.ytimg.com/vi/7m_R3PTSRZo/hqdefault.jpg'
  },
  {
    id: 'PLTlraZlovbczUvOR9cWZOzYhEMCpU9OB9',
    title: 'GTA V Series',
    videoCount: '14 videos',
    itemCount: 14,
    category: 'Gaming',
    url: 'https://www.youtube.com/playlist?list=PLTlraZlovbczUvOR9cWZOzYhEMCpU9OB9',
    thumbnail: 'https://i.ytimg.com/vi/h9dnfbLWS3U/hqdefault.jpg'
  },
  {
    id: 'PLTlraZlovbcxemVnlTvePyvZ5YMOpbUQi',
    title: 'BGMI Live Streaming',
    videoCount: '14 videos',
    itemCount: 14,
    category: 'Battle Royale',
    url: 'https://www.youtube.com/playlist?list=PLTlraZlovbcxemVnlTvePyvZ5YMOpbUQi',
    thumbnail: 'https://i.ytimg.com/vi/4vlJ5_qt9Q8/hqdefault.jpg'
  },
  {
    id: 'PLTlraZlovbcyuwFmGUgy-buDbucYakSbJ',
    title: 'Komban Holidays & Travels',
    videoCount: '61 videos',
    itemCount: 61,
    category: 'Travel & Buses',
    url: 'https://www.youtube.com/playlist?list=PLTlraZlovbcyuwFmGUgy-buDbucYakSbJ',
    thumbnail: 'https://i.ytimg.com/vi/47DMpUQBlJo/hqdefault.jpg'
  }
];

export function categorizePlaylist(title = '') {
  const t = title.toLowerCase();
  if (t.includes('ghost of tsushima') || t.includes('ps5')) return 'PS5 Gaming';
  if (t.includes('gta')) return 'GTA Gaming';
  if (t.includes('bgmi') || t.includes('pubg') || t.includes('free fire')) return 'Battle Royale';
  if (t.includes('train') || t.includes('kashmir') || t.includes('travel') || t.includes('komban') || t.includes('bus')) return 'Travel & Vlogs';
  if (t.includes('live')) return 'Live Gaming';
  return 'Gaming & Vlogs';
}

export async function fetchDiscoveredPlaylists(apiKey) {
  const res = await axios.get('https://www.googleapis.com/youtube/v3/playlists', {
    params: {
      part: 'snippet,contentDetails',
      channelId: CHANNEL_ID,
      maxResults: 25,
      key: apiKey
    },
    timeout: 7000
  });

  const rawItems = res.data?.items || [];
  if (rawItems.length === 0) return FALLBACK_PLAYLISTS;

  const playlists = rawItems
    .filter(p => p.contentDetails?.itemCount > 0)
    .map(p => {
      const title = p.snippet?.title || 'Abhiyukth Vlogs Playlist';
      const count = p.contentDetails?.itemCount || 0;
      const thumb = p.snippet?.thumbnails?.maxres?.url
        || p.snippet?.thumbnails?.standard?.url
        || p.snippet?.thumbnails?.high?.url
        || p.snippet?.thumbnails?.medium?.url
        || 'https://i.ytimg.com/vi/7m_R3PTSRZo/hqdefault.jpg';

      return {
        id: p.id,
        title,
        videoCount: `${count} ${count === 1 ? 'video' : 'videos'}`,
        itemCount: count,
        category: categorizePlaylist(title),
        url: `https://www.youtube.com/playlist?list=${p.id}`,
        thumbnail: thumb
      };
    });

  return playlists.length > 0 ? playlists : FALLBACK_PLAYLISTS;
}

export async function getPlaylistsFeed() {
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
      items: FALLBACK_PLAYLISTS,
      count: FALLBACK_PLAYLISTS.length,
      lastUpdated: new Date().toISOString()
    };
  }

  try {
    const items = await fetchDiscoveredPlaylists(apiKey);
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
    console.warn('[Playlists API Error]:', err.message);
    return {
      success: true,
      fallback: true,
      error: err.message,
      items: memoryCache.data ? memoryCache.data.items : FALLBACK_PLAYLISTS,
      count: (memoryCache.data ? memoryCache.data.items : FALLBACK_PLAYLISTS).length,
      lastUpdated: new Date().toISOString()
    };
  }
}
