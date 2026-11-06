import axios from 'axios';

/**
 * YouTube Featured Channels Service
 * Discovers, synchronizes, and caches pinned channel sections:
 *  1. "My Favourite & Friends Channel"
 *  2. "Abhijairajs channel" / "Abhiyukth channel"
 */

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCuG7-r1F3b2RzGoRFIe0MnQ';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes freshness

let memoryCache = {
  timestamp: 0,
  data: null
};

export const FALLBACK_FEATURED_CHANNELS = [
  {
    id: "UCuG7-r1F3b2RzGoRFIe0MnQ.Zx4DA4xg9IM",
    title: "My Favourite & Friends Channel",
    slug: "friends",
    displayTitle: "My Favourite & Friends Channel",
    description: "Top creator friends, gaming partners, and inspiring channels recommended by Abhiyukth.",
    channels: [
      {
        id: "UChI93tTLaYMNvdLii9uhXtg",
        title: "E BULL JET",
        handle: "@ebulljet",
        avatar: "https://yt3.ggpht.com/yunwL3uYZalzm3-uSK1hR7-YoyT6mfg2Kq3e3tURhR9dDuMMkHi_BToiyQXT62IO2xdK6l_r0w=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@ebulljet",
        subscriberCount: 2230000,
        subscriberCountFormatted: "2.23M subscribers",
        videoCount: 1560
      },
      {
        id: "UCQsgVjy3F_FcqZjHySGh1SA",
        title: "GAME THERAPIST",
        handle: "@gametherapistyt",
        avatar: "https://yt3.ggpht.com/ytc/AIdro_kd_n3P3-PDvNzg2MdwpNSwPN-ggCZGKGnLJ6BbutbJP15n=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@gametherapistyt",
        subscriberCount: 2050000,
        subscriberCountFormatted: "2.05M subscribers",
        videoCount: 2529
      },
      {
        id: "UCEf-bkCJSsD77Ry_6_LnesQ",
        title: "Eagle Gaming",
        handle: "@eaglegamingop",
        avatar: "https://yt3.ggpht.com/ytc/AIdro_nXSvw85NEOfH0G9k17wcPNFKphWTMzHQEVQYBPcHI8VyQ=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@eaglegamingop",
        subscriberCount: 883000,
        subscriberCountFormatted: "883K subscribers",
        videoCount: 1022
      },
      {
        id: "UC4Es_TJaDD_KG6ajhjtkcPQ",
        title: "Rune Jerry",
        handle: "@runejerry",
        avatar: "https://yt3.ggpht.com/K0MSkgB6xLZrx9nROQUPRiJk8vxDoPn9oNyY2DdLV8G4AYBqMuP4LbjpfHTEXZ1TDwV0z_RQ1A=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@runejerry",
        subscriberCount: 248000,
        subscriberCountFormatted: "248K subscribers",
        videoCount: 4222
      },
      {
        id: "UCQRyMif_BNs4gXU8fC-OmBw",
        title: "JINCHA",
        handle: "@jinchapazham",
        avatar: "https://yt3.ggpht.com/gzVi6o8SnwzNygH0Hc7-304o4DY7jWP5uMG9qIVPxAE8Jxkexnkdpo9ZZKlFnonj2SlSrgiDow=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@jinchapazham",
        subscriberCount: 138000,
        subscriberCountFormatted: "138K subscribers",
        videoCount: 1047
      },
      {
        id: "UCvHZFvJVmXybEt2DVry3LgQ",
        title: "47 MOVIES",
        handle: "@47movies",
        avatar: "https://yt3.ggpht.com/cYqvmdBwd7jIwPkGp4NCyVRc34GRQRpfMb6JMya0Nn5zCy0Rz6_K2BHE3TtKWVEdsOhN1lRSUNU=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@47movies",
        subscriberCount: 65800,
        subscriberCountFormatted: "65.8K subscribers",
        videoCount: 126
      },
      {
        id: "UCFWGGujqCF8q54nhaGEgIEw",
        title: "RoxanneRoxy",
        handle: "@roxanneroxyy",
        avatar: "https://yt3.ggpht.com/nOaAPfWiiaUHuQETTwKnZyXDyJIM1Hn9zFHAKMt_vAIm_XhEo4jplpt-3HoOPalx8_x2TVHP2g=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@roxanneroxyy",
        subscriberCount: 45600,
        subscriberCountFormatted: "45.6K subscribers",
        videoCount: 511
      },
      {
        id: "UCPe6bncnyS0kv_Ufw5THmUQ",
        title: "Nayan Shah",
        handle: "@nayanshah9571",
        avatar: "https://yt3.ggpht.com/ytc/AIdro_lOXAR7EQNbZiLDom3wjLxrPS66HoaJM0LSgoQGmu1sx4E=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@nayanshah9571",
        subscriberCount: 218,
        subscriberCountFormatted: "218 subscribers",
        videoCount: 23
      },
      {
        id: "UCEy-ZQfEv_GiPGtxDJgbz1Q",
        title: "Aesthetic",
        handle: "@aestheticshibu384",
        avatar: "https://yt3.ggpht.com/ytc/AIdro_lE-2v4pt1Am5Vt4Pedf4xjFjaVCExlg_cJVl7OY2xcwvV1BhXRzUSHIHLwFa5dONFuTw=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@aestheticshibu384",
        subscriberCount: 37,
        subscriberCountFormatted: "37 subscribers",
        videoCount: 0
      },
      {
        id: "UC8x13s0gGLpjTwYOpG4HpPA",
        title: "komban.fans.kozhikode",
        handle: "@komban.fans.kozhikode.0007",
        avatar: "https://yt3.ggpht.com/ALz5Ph3r5mJnZ5fBooXLU7t8YZZJzuqTQTj3WI0TkEBMLuGWTXwqPzDZDF_N8A2faVUFZP6Leg=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@komban.fans.kozhikode.0007",
        subscriberCount: 14,
        subscriberCountFormatted: "14 subscribers",
        videoCount: 4
      }
    ]
  },
  {
    id: "UCuG7-r1F3b2RzGoRFIe0MnQ.MykmTeTiooA",
    title: "Abhijairajs channel",
    slug: "abhijairaj",
    displayTitle: "Abhijairajs channel",
    description: "Official channels and gaming hubs connected to Abhiyukth & Abhijairaj.",
    channels: [
      {
        id: "UCuG7-r1F3b2RzGoRFIe0MnQ",
        title: "Abhiyukth vlogs",
        handle: "@abhiyukthvlogs",
        avatar: "https://yt3.ggpht.com/-nzeoiVWnh2lSppBtdOhHktuAdNdVES2Ks9nGbvtsxA9keDsF37L8VAqydd806AHmEKUecMb=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@abhiyukthvlogs",
        subscriberCount: 5860,
        subscriberCountFormatted: "5.9K subscribers",
        videoCount: 673
      },
      {
        id: "UCRzOdqc2jmFtux71XFaeGeg",
        title: "Kalip Holiday Official",
        handle: "@kalipholidayofficial",
        avatar: "https://yt3.ggpht.com/jM00y2xG0BJcDEozBEc8iSGBeSY5RI1EowF3JDezN-ba2z76sU7LcykwiLZIGnJEkkn91Vw4cQ=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@kalipholidayofficial",
        subscriberCount: 122,
        subscriberCountFormatted: "122 subscribers",
        videoCount: 37
      },
      {
        id: "UCI_dezQUijSXeeY70TZQs7A",
        title: "Fun with abhiyu vlogs",
        handle: "@funwithabhiyuvlogsoffical",
        avatar: "https://yt3.ggpht.com/C_rNd_RVglP--m38cdj3wQSwaUC0eeYQPW_ckzlgEHLrXY71kPu0e7EDOVDYHSHYFJGUqa8QhA=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@funwithabhiyuvlogsoffical",
        subscriberCount: 84,
        subscriberCountFormatted: "84 subscribers",
        videoCount: 97
      },
      {
        id: "UCswzi9ZQ7Gp45IWkg9s6d4w",
        title: "Komban Fans Kozhikode 2.o",
        handle: "@komban_fans_kozhikode_2.o_",
        avatar: "https://yt3.ggpht.com/vV-y_dK6dq8VeIx5dIcNV2ryNHIrqTCUIpEJ1EWyyUeDp-LguG7qgxsEIwd0niP3UhzxnkJtaQ=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@komban_fans_kozhikode_2.o_",
        subscriberCount: 37,
        subscriberCountFormatted: "37 subscribers",
        videoCount: 24
      },
      {
        id: "UCetgtfAQGkBPNY-zyHUyQOg",
        title: "Mr Abhiyukth",
        handle: "@mrabhiyukth",
        avatar: "https://yt3.ggpht.com/yiEQPQ7QIjRyvoVQfaV2kWZNRE9Vh9ld8gHmj-_LomexoPkKApj3_VmsASC7UGXp4q-9XhvNSg=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@mrabhiyukth",
        subscriberCount: 34,
        subscriberCountFormatted: "34 subscribers",
        videoCount: 7
      },
      {
        id: "UCatsLxmgFlu-VeSlUsdYY8g",
        title: "Kerala Tourist Bus Fans",
        handle: "@keralatouristbusfansofficial",
        avatar: "https://yt3.ggpht.com/ZBhZ3HlpUsRC0uM3mD1mXg2eHRK7fOWM2Mz1dZzz8isCfAnUNyZSvMeCfhyNkNfccr6L7z5t2A=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@keralatouristbusfansofficial",
        subscriberCount: 26,
        subscriberCountFormatted: "26 subscribers",
        videoCount: 8
      },
      {
        id: "UCGEcm_e8oHz6qujawDtPQXA",
        title: "Leelavathi Vestige",
        handle: "@leelavathivestigeofficial",
        avatar: "https://yt3.ggpht.com/rhpomOAW-gGAgCZZHj-YXvdnuHa6y4BKnRXj2BUBXtQL_lqkrbMw8r7bBga8Ksdup2svRy9oPxY=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@leelavathivestigeofficial",
        subscriberCount: 23,
        subscriberCountFormatted: "23 subscribers",
        videoCount: 0
      },
      {
        id: "UCfx2SdBUj38B5Nyk9Ld3-6g",
        title: "Abhiyukth vlogs live",
        handle: "@abhiyukthvlogslive",
        avatar: "https://yt3.ggpht.com/zWu4Juq2-s05MuixP7iWmnHihd5RfjbFqMr9BxDDVEpBLstbA879wclsBwg62p5dS2mB-8MP=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@abhiyukthvlogslive",
        subscriberCount: 20,
        subscriberCountFormatted: "20 subscribers",
        videoCount: 4
      },
      {
        id: "UCg9Q9w7pmIT2JxfDKO3aoFA",
        title: "Abhiyukth Gaming",
        handle: "@abhiyukth.gaming",
        avatar: "https://yt3.ggpht.com/jc_4Ym45K6JT4h_hQMu5Hcsu6q9hvKk7vrebL9sioAl82k5WfQv82wMAWsT0r9JTBNU-S6uDqA=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@abhiyukth.gaming",
        subscriberCount: 18,
        subscriberCountFormatted: "18 subscribers",
        videoCount: 4
      },
      {
        id: "UCRoJ1Yl9S-AuHzeIfkhGIZw",
        title: "Ankur Chemidyes",
        handle: "@ankurchemidyes",
        avatar: "https://yt3.ggpht.com/eNBl1ZWY1s7hYOJBnvj9GpgnT369Mq2XJt2Mf_kpWv9hrqxeI76HsrrYPBu3g6b1Ncopo6YTXsk=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@ankurchemidyes",
        subscriberCount: 16,
        subscriberCountFormatted: "16 subscribers",
        videoCount: 1
      },
      {
        id: "UCM9D4w5e15G-YjV4DSp0PXg",
        title: "Abhiyukth vlogs (Backup)",
        handle: "@abhiyukthvlogsoffical",
        avatar: "https://yt3.ggpht.com/kPhLguCqjZlwEF1eJeGesAeQR-zBI7TVLty24fWAikaZ_j3vwkN-O7nSU05q_jvFpjzXwBTyFg=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@abhiyukthvlogsoffical",
        subscriberCount: 16,
        subscriberCountFormatted: "16 subscribers",
        videoCount: 1
      },
      {
        id: "UCU7Xjbm8okfTztVJ09WvTuQ",
        title: "Dharavi Holiday Hub Official",
        handle: "@dharaviholidayofficial",
        avatar: "https://yt3.ggpht.com/8zspHVhcYB61AoP_kX5fW4R_qG4-bwFhdiP3-Kr5CDd4jbzvUpHsS7TmOhkD52xoQTleSSCmf1Q=s800-c-k-c0x00ffffff-no-rj",
        url: "https://www.youtube.com/@dharaviholidayofficial",
        subscriberCount: 10,
        subscriberCountFormatted: "10 subscribers",
        videoCount: 1
      }
    ]
  }
];

function formatSubscribers(count, hidden) {
  if (hidden || !count) return 'Hidden subs';
  const num = Number(count) || 0;
  if (num >= 1000000) return (num / 1000000).toFixed(2).replace(/\.00$/, '') + 'M subscribers';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K subscribers';
  return `${num} ${num === 1 ? 'subscriber' : 'subscribers'}`;
}

export async function fetchDiscoveredFeaturedChannels(apiKey) {
  const sectionsRes = await axios.get('https://www.googleapis.com/youtube/v3/channelSections', {
    params: {
      part: 'snippet,contentDetails',
      channelId: CHANNEL_ID,
      key: apiKey
    },
    timeout: 8000
  });

  const rawSections = sectionsRes.data?.items || [];
  if (rawSections.length === 0) return FALLBACK_FEATURED_CHANNELS;

  // Find targeted pinned sections
  const targetSections = rawSections.filter(s => {
    const type = s.snippet?.type;
    const title = (s.snippet?.title || '').toLowerCase();
    return type === 'multiplechannels' && (
      title.includes('favourite') || 
      title.includes('favorite') ||
      title.includes('friend') ||
      title.includes('abhiyukth') ||
      title.includes('abhijairaj')
    );
  });

  if (targetSections.length === 0) return FALLBACK_FEATURED_CHANNELS;

  // Collect all unique channel IDs to fetch in batch
  const allChannelIds = new Set();
  for (const sec of targetSections) {
    const ids = sec.contentDetails?.channels || [];
    ids.forEach(id => allChannelIds.add(id));
  }

  const idsArray = Array.from(allChannelIds);
  if (idsArray.length === 0) return FALLBACK_FEATURED_CHANNELS;

  const channelMap = new Map();

  // Batch query in chunks of 50
  for (let i = 0; i < idsArray.length; i += 50) {
    const chunk = idsArray.slice(i, i + 50);
    try {
      const chRes = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
        params: {
          part: 'snippet,statistics',
          id: chunk.join(','),
          key: apiKey
        },
        timeout: 8000
      });

      for (const ch of chRes.data?.items || []) {
        const title = ch.snippet?.title || 'Creator Channel';
        const customUrl = ch.snippet?.customUrl || '';
        const handle = customUrl ? ('@' + customUrl.replace(/^@/, '')) : '';
        const avatar = ch.snippet?.thumbnails?.high?.url 
          || ch.snippet?.thumbnails?.medium?.url 
          || ch.snippet?.thumbnails?.default?.url 
          || 'https://yt3.ggpht.com/default.jpg';
        const url = customUrl 
          ? `https://www.youtube.com/${customUrl.startsWith('@') ? customUrl : '@' + customUrl}`
          : `https://www.youtube.com/channel/${ch.id}`;
        const subs = Number(ch.statistics?.subscriberCount) || 0;
        const hiddenSubs = !!ch.statistics?.hiddenSubscriberCount;

        channelMap.set(ch.id, {
          id: ch.id,
          title,
          handle: handle || (title.startsWith('@') ? title : `@${title.replace(/\s+/g, '').toLowerCase()}`),
          avatar,
          url,
          subscriberCount: subs,
          subscriberCountFormatted: formatSubscribers(subs, hiddenSubs),
          videoCount: Number(ch.statistics?.videoCount) || 0
        });
      }
    } catch (batchErr) {
      console.warn('[FeaturedChannels] Batch lookup notice:', batchErr.message);
    }
  }

  const formattedSections = targetSections.map(s => {
    const rawTitle = s.snippet?.title || 'Featured Channels';
    const isFriends = rawTitle.toLowerCase().includes('friend') || rawTitle.toLowerCase().includes('favourite');
    const slug = isFriends ? 'friends' : 'abhijairaj';
    const displayTitle = isFriends ? "My Favourite & Friends Channel" : "Abhijairajs channel";
    const description = isFriends
      ? "Top creator friends, gaming partners, and inspiring channels recommended by Abhiyukth."
      : "Official channels and gaming hubs connected to Abhiyukth & Abhijairaj.";

    const channelIds = s.contentDetails?.channels || [];
    const channels = channelIds.map(id => channelMap.get(id)).filter(Boolean);

    return {
      id: s.id,
      title: rawTitle,
      slug,
      displayTitle,
      description,
      channels
    };
  }).filter(sec => sec.channels.length > 0);

  return formattedSections.length > 0 ? formattedSections : FALLBACK_FEATURED_CHANNELS;
}

export async function getFeaturedChannelsFeed() {
  const now = Date.now();
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (memoryCache.data && (now - memoryCache.timestamp < CACHE_TTL_MS)) {
    return {
      success: true,
      cached: true,
      sections: memoryCache.data.sections,
      totalChannels: memoryCache.data.totalChannels,
      lastUpdated: memoryCache.data.lastUpdated
    };
  }

  if (!apiKey) {
    const total = FALLBACK_FEATURED_CHANNELS.reduce((acc, s) => acc + s.channels.length, 0);
    return {
      success: true,
      cached: false,
      fallback: true,
      sections: FALLBACK_FEATURED_CHANNELS,
      totalChannels: total,
      lastUpdated: new Date().toISOString()
    };
  }

  try {
    const sections = await fetchDiscoveredFeaturedChannels(apiKey);
    const totalChannels = sections.reduce((acc, s) => acc + s.channels.length, 0);
    const feedData = {
      sections,
      totalChannels,
      lastUpdated: new Date().toISOString()
    };

    memoryCache = {
      timestamp: now,
      data: feedData
    };

    return {
      success: true,
      cached: false,
      ...feedData
    };
  } catch (error) {
    console.warn('[FeaturedChannels] Fetch error, serving fallback:', error.message);
    const total = FALLBACK_FEATURED_CHANNELS.reduce((acc, s) => acc + s.channels.length, 0);
    return {
      success: true,
      cached: false,
      fallback: true,
      sections: FALLBACK_FEATURED_CHANNELS,
      totalChannels: total,
      lastUpdated: new Date().toISOString(),
      warning: error.message
    };
  }
}
