/**
 * Abhiyukth Vlogs - Channel Data Configuration
 * Single source of truth for channel profile, verified videos, playlists, and social links.
 * All information is verified directly from YouTube channel: https://www.youtube.com/@abhiyukthvlogs
 */

export const channelConfig = {
  // Channel Identity & Metadata
  channel: {
    name: 'Abhiyukth Vlogs',
    handle: '@abhiyukthvlogs',
    tagline: 'Gaming. Journeys. Real Stories.',
    subtagline: 'Malayalam creator sharing PS5 adventures, live streams, travel chronicles, and real-life experiences.',
    avatarUrl: 'https://yt3.googleusercontent.com/-nzeoiVWnh2lSppBtdOhHktuAdNdVES2Ks9nGbvtsxA9keDsF37L8VAqydd806AHmEKUecMb=s160-c-k-c0x00ffffff-no-rj',
    bannerUrl: 'https://yt3.googleusercontent.com/eZgEVYFkF-Lmm9nbRt91mb7JkZaHfVhPRMSFoOx_dxjujO-S-ixcldz5ccONKMPH03PkQeEzjw=w2120-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj',
    country: 'India',
    joinedDate: 'February 2021',
    bio: 'Welcome to Abhiyukth Vlogs! Based in Kerala, India, bringing you thrilling PS5 gameplay streams, spontaneous travel diaries across the country (train journeys from Kozhikode to Kashmir and Maharashtra, local festivals, walkathons), and unfiltered real-life moments.',
    uploadNote: 'Long videos, PS5 streams & daily shorts with community celebrations.',
    
    // Channel ID from YouTube Analytics / Studio
    id: 'UCuG7-r1F3b2RzGoRFIe0MnQ',
    
    // Verified Channel Stats (as of inspection)
    stats: {
      subscribers: '5.7K',
      subscribersCount: 5710,
      subscribersFull: '5,710+',
      videosCount: '614+',
      totalViews: '2.35M+',
      yearsActive: '4+'
    },

    // Creator Goals & Countdown Milestones
    milestones: {
      target: 10000,
      targetFormatted: '10K',
      current: 5710,
      currentFormatted: '5.7K',
      next: '10K',
      dream: '100K & 1M',
      goals: [
        { goal: '10K', label: 'Subscribers (Next Target)', reached: false, progress: 57.1 },
        { goal: '100K', label: 'Silver Play Button', reached: false, progress: 5.71 },
        { goal: '1M', label: 'Gold Play Button Dream', reached: false, progress: 0.57 }
      ]
    }
  },

  // Social & External Links
  links: {
    youtube: 'https://www.youtube.com/@abhiyukthvlogs',
    subscribe: 'https://www.youtube.com/@abhiyukthvlogs?sub_confirmation=1',
    streams: 'https://www.youtube.com/@abhiyukthvlogs/streams',
    playlists: 'https://www.youtube.com/@abhiyukthvlogs/playlists',
    instagram: 'https://www.instagram.com/abhiyukth.vlogs/',
    kick: 'https://kick.com/abhiyukthvlogs',
    twitch: 'https://www.twitch.tv/abhiyukth_vlogs',
    x: 'https://x.com/AbhiyukthVlogs',
    donationSupport: 'https://widget-8a7ef48a811d43f288c232b0055fa24e.elfsig.ht'
  },

  // Live Stream Status
  // Dynamically synchronized via /api/youtube/live with automatic live detection & replay fallback
  liveStatus: {
    isLive: false,
    badgeText: "Latest Live Replay",
    liveTitle: "🔴 GTA 5 PS5 LIVE Streaming | Part 10 | Malayalam Live | Abhiyukth Vlogs",
    videoId: "rT8y9zNWqRU",
    category: "Live Replay",
    note: "Completed live broadcast replay. Catch past stream replays or join the next live stream!"
  ,  upcoming: {
      title: "MALAYALAM'S FIRST EVER GTA 6 MULTI-STREAM! 🎮🔥 മലയാളത്തിലെ ആദ്യത്തെ ലൈവ്!",
      videoId: '8aeunJTnGDM',
      badge: 'Upcoming Special Event'
    }
  },

  // Featured Highlight Video (Cinematic 16:9 Showcase)
  featuredVideo: {
    videoId: 'gxpAlDUWIOQ',
    title: 'ആദ്യ വാക്കത്തോൺ… ആവേശം വേറെ ലെവൽ! 😍 Kozhikode Walkaaro Walkathon 2026',
    category: 'Vlogs',
    badge: 'Featured Video',
    description: 'Experience the electric energy of the Kozhikode Walkaaro Walkathon 2026 through the lens of Abhiyukth Vlogs. High spirits, community vibes, and candid moments!',
    views: '738 views',
    timeAgo: 'Recent',
    thumbnail: 'https://i.ytimg.com/vi/gxpAlDUWIOQ/hq720.jpg'
  },

  // Verified YouTube Shorts Catalog (Snapshot + Fallback)
  // Auto-updating feed synchronizes dynamically via /api/youtube/shorts
  shorts: [
    {
      id: "q43G09a8Ey8",
      title: "The Dark Brothers: New Era Started 🖤🔥 | Komban Gaddafi & Samurai",
      views: "1.2K views",
      viewCount: 1185,
      viewCountFormatted: "1,185",
      timeAgo: "Recent",
      publishedAt: "2026-11-05T08:20:06Z",
      duration: "0:23",
      durationSeconds: 23,
      thumbnail: "https://i.ytimg.com/vi/q43G09a8Ey8/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "CJrliLbGVDY",
      title: "തളർത്താൻ നോക്കിയവർക്ക് മുന്നിൽ കൊമ്പന്റെ മാസ്സ് തി തിരിച്ചുവരവ്! 🔥🚌 | Komban Comeback #komban",
      views: "1.8K views",
      viewCount: 1796,
      viewCountFormatted: "1,796",
      timeAgo: "Recent",
      publishedAt: "2026-11-05T02:39:00Z",
      duration: "0:59",
      durationSeconds: 59,
      thumbnail: "https://i.ytimg.com/vi/CJrliLbGVDY/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "ih7ZHuzk6y0",
      title: "​Komban Beast Mode On 🔥 | Kerala Tourist Bus Edit",
      views: "1.2K views",
      viewCount: 1230,
      viewCountFormatted: "1,230",
      timeAgo: "Recent",
      publishedAt: "2026-11-04T07:03:33Z",
      duration: "0:34",
      durationSeconds: 34,
      thumbnail: "https://i.ytimg.com/vi/ih7ZHuzk6y0/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "0cSKwCmEb-0",
      title: "Do You Know Who I Am? 😈🔥ആരാണെന്ന് മനസ്സിലായോ? | കൊമ്പനും ദീപു ചേട്ടനും ഒന്നിച്ച്! | Komban Mass Edit",
      views: "706 views",
      viewCount: 706,
      viewCountFormatted: "706",
      timeAgo: "Recent",
      publishedAt: "2026-11-04T06:13:10Z",
      duration: "0:14",
      durationSeconds: 14,
      thumbnail: "https://i.ytimg.com/vi/0cSKwCmEb-0/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "od2IbTNPKv4",
      title: "പണി തുടങ്ങിക്കഴിഞ്ഞു! HE IS BACK 😈🔥 | Komban",
      views: "960 views",
      viewCount: 960,
      viewCountFormatted: "960",
      timeAgo: "Recent",
      publishedAt: "2026-11-03T02:07:50Z",
      duration: "0:15",
      durationSeconds: 15,
      thumbnail: "https://i.ytimg.com/vi/od2IbTNPKv4/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "nZQI5GBYmpw",
      title: "Emperor Strikes Again! 👑🔥 | Komban Dawood Mass Entry",
      views: "2.3K views",
      viewCount: 2310,
      viewCountFormatted: "2,310",
      timeAgo: "Recent",
      publishedAt: "2026-11-02T06:26:36Z",
      duration: "0:10",
      durationSeconds: 10,
      thumbnail: "https://i.ytimg.com/vi/nZQI5GBYmpw/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "imJsIgO5Jm8",
      title: "ഈ മാസ്സ് എൻട്രി കണ്ടാൽ ആരും ഒന്ന് നോക്കിപ്പോകും! 😱🔥 | Komban Dark Feudal Lord",
      views: "1.5K views",
      viewCount: 1502,
      viewCountFormatted: "1,502",
      timeAgo: "Recent",
      publishedAt: "2026-11-01T04:18:32Z",
      duration: "0:26",
      durationSeconds: 26,
      thumbnail: "https://i.ytimg.com/vi/imJsIgO5Jm8/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "5-klvEOtqpk",
      title: "കൊമ്പന്റെ രാജകീയ തിരിച്ചുവരവ്! 🔥 ബോംബേ, ദാവൂദ്, കാളിയൻ ഒന്നിച്ച്!",
      views: "1.5K views",
      viewCount: 1546,
      viewCountFormatted: "1,546",
      timeAgo: "Recent",
      publishedAt: "2026-10-30T02:29:49Z",
      duration: "0:26",
      durationSeconds: 26,
      thumbnail: "https://i.ytimg.com/vi/5-klvEOtqpk/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "meaMV8_jiAk",
      title: "ഒടുവിൽ ആ കിടിലൻ കാഴ്ച നേരിട്ട് കണ്ടു! 🤩🔥 | Bus Spotting",
      views: "8.4K views",
      viewCount: 8357,
      viewCountFormatted: "8,357",
      timeAgo: "Recent",
      publishedAt: "2026-10-29T13:13:50Z",
      duration: "0:08",
      durationSeconds: 8,
      thumbnail: "https://i.ytimg.com/vi/meaMV8_jiAk/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "zOaw1Y1JJl0",
      title: "രോമാഞ്ചം വരുന്ന എൻട്രി! വെയിറ്റ് ഫോർ ഇറ്റ് 🥶🔥 | Komban Tourist Bus",
      views: "3.2K views",
      viewCount: 3165,
      viewCountFormatted: "3,165",
      timeAgo: "Recent",
      publishedAt: "2026-10-29T13:10:07Z",
      duration: "0:24",
      durationSeconds: 24,
      thumbnail: "https://i.ytimg.com/vi/zOaw1Y1JJl0/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "KvOC-jGIA7U",
      title: "ഈ വൈബ് വേറെ എങ്ങും കിട്ടില്ല! 💥 | Kerala Tourist Bus",
      views: "1.2K views",
      viewCount: 1234,
      viewCountFormatted: "1,234",
      timeAgo: "Recent",
      publishedAt: "2026-10-29T13:08:31Z",
      duration: "0:30",
      durationSeconds: 30,
      thumbnail: "https://i.ytimg.com/vi/KvOC-jGIA7U/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "5I2WDcwajbk",
      title: "..",
      views: "1.3K views",
      viewCount: 1269,
      viewCountFormatted: "1,269",
      timeAgo: "Recent",
      publishedAt: "2026-10-29T13:08:12Z",
      duration: "0:15",
      durationSeconds: 15,
      thumbnail: "https://i.ytimg.com/vi/5I2WDcwajbk/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "46v2NN0qgWU",
      title: "ഈ എൻട്രി കണ്ടാൽ ആരും ഒന്ന് നോക്കിപ്പോകും! 😱🔥 | Komban Mass",
      views: "1.2K views",
      viewCount: 1230,
      viewCountFormatted: "1,230",
      timeAgo: "Recent",
      publishedAt: "2026-10-29T13:07:28Z",
      duration: "0:24",
      durationSeconds: 24,
      thumbnail: "https://i.ytimg.com/vi/46v2NN0qgWU/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "SMZVQ9PGK_I",
      title: "ആരാധകരുടെ നടുവിലൂടെ അവൻ വരുന്നു 🔥 | Komban Tourist Bus #shorts #komban",
      views: "1.2K views",
      viewCount: 1198,
      viewCountFormatted: "1,198",
      timeAgo: "Recent",
      publishedAt: "2026-10-29T10:54:06Z",
      duration: "0:23",
      durationSeconds: 23,
      thumbnail: "https://i.ytimg.com/vi/SMZVQ9PGK_I/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "rpC1djTx4LM",
      title: "കൊമ്പൻ ഗദ്ദാഫിയുടെ മാസ്സ് ലുക്ക്! 🔥😈 | KOMBaN GADDAFI Bus Edit #shorts",
      views: "1.5K views",
      viewCount: 1469,
      viewCountFormatted: "1,469",
      timeAgo: "Recent",
      publishedAt: "2026-10-29T02:40:18Z",
      duration: "0:26",
      durationSeconds: 26,
      thumbnail: "https://i.ytimg.com/vi/rpC1djTx4LM/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "cGZKzygcVgk",
      title: "The Beast KALIYAN ⚡ ബസ്സിനുള്ളിലെ ആ മാസ്സ് സൗണ്ട്! | Komban Tourist Bus Kerala",
      views: "1.9K views",
      viewCount: 1890,
      viewCountFormatted: "1,890",
      timeAgo: "Recent",
      publishedAt: "2026-10-28T02:03:21Z",
      duration: "0:44",
      durationSeconds: 44,
      thumbnail: "https://i.ytimg.com/vi/cGZKzygcVgk/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "iA3cwLWYIbQ",
      title: "@reporterlive -ലും കൊമ്പന്റെ മാസ്സ് എൻട്രി 🔥 | Kerala Tourist Bus Thug Life",
      views: "14.1K views",
      viewCount: 14067,
      viewCountFormatted: "14,067",
      timeAgo: "Recent",
      publishedAt: "2026-10-27T04:43:31Z",
      duration: "0:17",
      durationSeconds: 17,
      thumbnail: "https://i.ytimg.com/vi/iA3cwLWYIbQ/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "BoCyUIZo-jE",
      title: "ഇതാണ് കൊമ്പന്റെ പവർ 💥🔥 | Komban Tourist Bus Mass Status",
      views: "1.3K views",
      viewCount: 1276,
      viewCountFormatted: "1,276",
      timeAgo: "Recent",
      publishedAt: "2026-10-26T12:44:11Z",
      duration: "0:13",
      durationSeconds: 13,
      thumbnail: "https://i.ytimg.com/vi/BoCyUIZo-jE/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "HTQSG5koicc",
      title: "കൊമ്പൻ വന്നാൽ വൈബ് വേറെ ലെവൽ! 🔥 | Komban Holidays #shorts @reporterlive",
      views: "2.6K views",
      viewCount: 2595,
      viewCountFormatted: "2,595",
      timeAgo: "Recent",
      publishedAt: "2026-10-26T05:03:57Z",
      duration: "0:19",
      durationSeconds: 19,
      thumbnail: "https://i.ytimg.com/vi/HTQSG5koicc/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "DFyd3jeC5Jw",
      title: "വീര... ഒത്തക്ക് ഒത്ത ഇറങ്ങി നിക്കണം! 🔥 | Komban Mass Entry",
      views: "1.6K views",
      viewCount: 1622,
      viewCountFormatted: "1,622",
      timeAgo: "Recent",
      publishedAt: "2026-10-25T09:58:45Z",
      duration: "0:36",
      durationSeconds: 36,
      thumbnail: "https://i.ytimg.com/vi/DFyd3jeC5Jw/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "QxORffjaNMU",
      title: "The Boss is Here 😈 | Komban Mass Edit",
      views: "1.5K views",
      viewCount: 1510,
      viewCountFormatted: "1,510",
      timeAgo: "Recent",
      publishedAt: "2026-10-25T09:58:32Z",
      duration: "0:29",
      durationSeconds: 29,
      thumbnail: "https://i.ytimg.com/vi/QxORffjaNMU/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "PvmrwoXvzwE",
      title: "🔥 Komban Holidays 🚌 | റോഡിലെ മാസ്സ് എൻട്രി! 😈🔥 | Kerala Bus Edit #Shorts",
      views: "1.7K views",
      viewCount: 1715,
      viewCountFormatted: "1,715",
      timeAgo: "Recent",
      publishedAt: "2026-10-21T12:51:35Z",
      duration: "0:20",
      durationSeconds: 20,
      thumbnail: "https://i.ytimg.com/vi/PvmrwoXvzwE/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "7O3M2aeBVOk",
      title: "നിങ്ങളുടെ സപ്പോർട്ടിന് ഒരായിരം നന്ദി! ❤️ 5.7K YT Fam & 13.8K Insta Views 🎉 #abhiyukthvlogs #shorts",
      views: "71 views",
      viewCount: 71,
      viewCountFormatted: "71",
      timeAgo: "Recent",
      publishedAt: "2026-10-16T15:48:21Z",
      duration: "0:14",
      durationSeconds: 14,
      thumbnail: "https://i.ytimg.com/vi/7O3M2aeBVOk/hq720.jpg",
      classification: "confirmed"
    }
  ],

  // Verified Video Gallery Catalog
  // Category tags: 'Gaming' | 'Vlogs' | 'Live Replays'
  videos: [
    {
      id: "CJrliLbGVDY",
      title: "തളർത്താൻ നോക്കിയവർക്ക് മുന്നിൽ കൊമ്പന്റെ മാസ്സ് തി തിരിച്ചുവരവ്! 🔥🚌 | Komban Comeback #komban",
      category: "Vlogs",
      views: "1.8K views",
      viewCount: 1796,
      timeAgo: "Yesterday",
      publishedAt: "2026-11-05T02:39:00Z",
      duration: "0:59",
      thumbnail: "https://i.ytimg.com/vi/CJrliLbGVDY/maxresdefault.jpg"
    },
    {
      id: "ih7ZHuzk6y0",
      title: "​Komban Beast Mode On 🔥 | Kerala Tourist Bus Edit",
      category: "Vlogs",
      views: "1.2K views",
      viewCount: 1230,
      timeAgo: "2 days ago",
      publishedAt: "2026-11-04T07:03:33Z",
      duration: "0:34",
      thumbnail: "https://i.ytimg.com/vi/ih7ZHuzk6y0/maxresdefault.jpg"
    },
    {
      id: "TF_LMV1D3tE",
      title: "🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 41 | Malayalam Gameplay | Abhiyukth Vlogs",
      category: "Gaming",
      views: "5 views",
      viewCount: 5,
      timeAgo: "2 days ago",
      publishedAt: "2026-11-04T00:39:24Z",
      duration: "3:18:57",
      thumbnail: "https://i.ytimg.com/vi/TF_LMV1D3tE/maxresdefault.jpg"
    },
    {
      id: "jRHVzlV2Q_M",
      title: "🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 40 Cont. | Malayalam Gameplay | Abhiyukth Vlogs",
      category: "Gaming",
      views: "9 views",
      viewCount: 9,
      timeAgo: "3 days ago",
      publishedAt: "2026-11-03T05:31:10Z",
      duration: "1:33:39",
      thumbnail: "https://i.ytimg.com/vi/jRHVzlV2Q_M/maxresdefault.jpg"
    },
    {
      id: "1urM5UYdo0A",
      title: "🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 40 | Malayalam Gameplay | Abhiyukth Vlogs",
      category: "Gaming",
      views: "3 views",
      viewCount: 3,
      timeAgo: "3 days ago",
      publishedAt: "2026-11-03T02:54:46Z",
      duration: "54:10",
      thumbnail: "https://i.ytimg.com/vi/1urM5UYdo0A/maxresdefault.jpg"
    },
    {
      id: "dpdmeFEB7Rg",
      title: "🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 39 | Malayalam Gameplay | Abhiyukth Vlogs",
      category: "Gaming",
      views: "13 views",
      viewCount: 13,
      timeAgo: "3 days ago",
      publishedAt: "2026-11-03T01:18:09Z",
      duration: "2:29:16",
      thumbnail: "https://i.ytimg.com/vi/dpdmeFEB7Rg/maxresdefault.jpg"
    },
    {
      id: "P1iFHLh4GDI",
      title: "IRL Ghost Of Tsushima Director's Cut: Live Ps5 l Malayalam Live",
      category: "Gaming",
      views: "3 views",
      viewCount: 3,
      timeAgo: "3 days ago",
      publishedAt: "2026-11-02T22:44:33Z",
      duration: "19:49",
      thumbnail: "https://i.ytimg.com/vi/P1iFHLh4GDI/maxresdefault.jpg"
    },
    {
      id: "4Ws2_YzlqfU",
      title: "🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 38 | Malayalam Gameplay | Abhiyukth Vlogs",
      category: "Gaming",
      views: "13 views",
      viewCount: 13,
      timeAgo: "4 days ago",
      publishedAt: "2026-11-02T05:54:40Z",
      duration: "1:15:39",
      thumbnail: "https://i.ytimg.com/vi/4Ws2_YzlqfU/maxresdefault.jpg"
    },
    {
      id: "KPhHbQf4JLs",
      title: "🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 37 | Malayalam Gameplay | Abhiyukth Vlogs",
      category: "Gaming",
      views: "6 views",
      viewCount: 6,
      timeAgo: "1 weeks ago",
      publishedAt: "2026-10-29T11:20:43Z",
      duration: "16:57",
      thumbnail: "https://i.ytimg.com/vi/KPhHbQf4JLs/maxresdefault.jpg"
    },
    {
      id: "UDOCaNUWM8c",
      title: "​കൊമ്പൻ പഴയ വൈബിലേക്ക് തിരിച്ചു വരുന്നു ഗയ്സ് 🔥 | Komban Mass Return!",
      category: "Live Replays",
      views: "12 views",
      viewCount: 12,
      timeAgo: "1 weeks ago",
      publishedAt: "2026-10-29T11:05:42Z",
      duration: "4:31",
      thumbnail: "https://i.ytimg.com/vi/UDOCaNUWM8c/maxresdefault.jpg"
    },
    {
      id: "Wxjpw15hG8o",
      title: "ഇത് വെറും ബസ്സല്ല, കൊമ്പന്റെ മാസ്സ്! 💥 | Kerala Tourist Bus Spotting",
      category: "Vlogs",
      views: "38 views",
      viewCount: 38,
      timeAgo: "1 weeks ago",
      publishedAt: "2026-10-29T10:54:41Z",
      duration: "0:47",
      thumbnail: "https://i.ytimg.com/vi/Wxjpw15hG8o/maxresdefault.jpg"
    },
    {
      id: "qmUM48KhpXY",
      title: "🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 36 | Malayalam Gameplay | Abhiyukth Vlogs",
      category: "Gaming",
      views: "23 views",
      viewCount: 23,
      timeAgo: "1 weeks ago",
      publishedAt: "2026-10-29T06:05:18Z",
      duration: "2:56:49",
      thumbnail: "https://i.ytimg.com/vi/qmUM48KhpXY/maxresdefault.jpg"
    },
    {
      id: "cGZKzygcVgk",
      title: "The Beast KALIYAN ⚡ ബസ്സിനുള്ളിലെ ആ മാസ്സ് സൗണ്ട്! | Komban Tourist Bus Kerala",
      category: "Vlogs",
      views: "1.9K views",
      viewCount: 1890,
      timeAgo: "1 weeks ago",
      publishedAt: "2026-10-28T02:03:21Z",
      duration: "0:44",
      thumbnail: "https://i.ytimg.com/vi/cGZKzygcVgk/maxresdefault.jpg"
    },
    {
      id: "PDtIUxJrhaU",
      title: "🔴 GTA 5 PS5 LIVE Streaming | Part 9 | Malayalam Live | Abhiyukth Vlogs",
      category: "Gaming",
      views: "8 views",
      viewCount: 8,
      timeAgo: "1 weeks ago",
      publishedAt: "2026-10-28T00:30:35Z",
      duration: "36:46",
      thumbnail: "https://i.ytimg.com/vi/PDtIUxJrhaU/maxresdefault.jpg"
    },
    {
      id: "2X3BrsHGhkM",
      title: "🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 36 | Malayalam Gameplay | Abhiyukth Vlogs",
      category: "Gaming",
      views: "7 views",
      viewCount: 7,
      timeAgo: "1 weeks ago",
      publishedAt: "2026-10-27T11:21:12Z",
      duration: "11:10",
      thumbnail: "https://i.ytimg.com/vi/2X3BrsHGhkM/maxresdefault.jpg"
    },
    {
      id: "bjV-o6qwT0o",
      title: "🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 35 | Malayalam Gameplay | Abhiyukth Vlogs",
      category: "Gaming",
      views: "5 views",
      viewCount: 5,
      timeAgo: "1 weeks ago",
      publishedAt: "2026-10-26T11:17:57Z",
      duration: "8:25",
      thumbnail: "https://i.ytimg.com/vi/bjV-o6qwT0o/maxresdefault.jpg"
    },
    {
      id: "pSclcMmCEZo",
      title: "🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 34 | Malayalam Gameplay | Abhiyukth Vlogs",
      category: "Gaming",
      views: "15 views",
      viewCount: 15,
      timeAgo: "1 weeks ago",
      publishedAt: "2026-10-26T05:34:57Z",
      duration: "1:40:23",
      thumbnail: "https://i.ytimg.com/vi/pSclcMmCEZo/maxresdefault.jpg"
    },
    {
      id: "_8wDhRpQ-7c",
      title: "🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 33 | Malayalam Gameplay | Abhiyukth Vlogs",
      category: "Gaming",
      views: "16 views",
      viewCount: 16,
      timeAgo: "1 weeks ago",
      publishedAt: "2026-10-26T01:01:19Z",
      duration: "1:53:41",
      thumbnail: "https://i.ytimg.com/vi/_8wDhRpQ-7c/maxresdefault.jpg"
    },
    {
      id: "fUEm9MzD6Wk",
      title: "🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 32 | Malayalam Gameplay | Abhiyukth Vlogs",
      category: "Gaming",
      views: "14 views",
      viewCount: 14,
      timeAgo: "1 weeks ago",
      publishedAt: "2026-10-25T20:54:07Z",
      duration: "2:22:04",
      thumbnail: "https://i.ytimg.com/vi/fUEm9MzD6Wk/maxresdefault.jpg"
    },
    {
      id: "gxpAlDUWIOQ",
      title: "ആദ്യ വാക്കത്തോൺ… ആവേശം വേറെ ലെവൽ! 😍 Kozhikode Walkaaro Walkathon 2026",
      category: "Vlogs",
      views: "738 views",
      viewCount: 738,
      timeAgo: "Recent",
      publishedAt: "2026-10-25T10:00:00Z",
      duration: "Vlog",
      thumbnail: "https://i.ytimg.com/vi/gxpAlDUWIOQ/hq720.jpg"
    },
    {
      id: "DFyd3jeC5Jw",
      title: "വീര... ഒത്തക്ക് ഒത്ത ഇറങ്ങി നിക്കണം! 🔥 | Komban Mass Entry",
      category: "Vlogs",
      views: "1.6K views",
      viewCount: 1622,
      timeAgo: "1 weeks ago",
      publishedAt: "2026-10-25T09:58:45Z",
      duration: "0:36",
      thumbnail: "https://i.ytimg.com/vi/DFyd3jeC5Jw/maxresdefault.jpg"
    },
    {
      id: "Kw2kIt6dyU4",
      title: "IRL Ghost Of Tsushima Director's Cut: Live Ps5 l Malayalam Live",
      category: "Live Replays",
      views: "Stream Replay",
      viewCount: 250,
      timeAgo: "Recent Stream",
      publishedAt: "2026-10-24T10:00:00Z",
      duration: "PS5 Live",
      thumbnail: "https://i.ytimg.com/vi/Kw2kIt6dyU4/hq720.jpg"
    },
    {
      id: "EGO9Uv4BXz4",
      title: "🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 31 | Malayalam Gameplay | Abhiyukth Vlogs",
      category: "Gaming",
      views: "9 views",
      viewCount: 9,
      timeAgo: "2 weeks ago",
      publishedAt: "2026-10-23T04:40:56Z",
      duration: "1:15:51",
      thumbnail: "https://i.ytimg.com/vi/EGO9Uv4BXz4/maxresdefault.jpg"
    },
    {
      id: "3mtbnT3YkcU",
      title: "🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 30 | Malayalam Gameplay | Abhiyukth Vlogs",
      category: "Gaming",
      views: "17 views",
      viewCount: 17,
      timeAgo: "2 weeks ago",
      publishedAt: "2026-10-21T00:31:21Z",
      duration: "45:38",
      thumbnail: "https://i.ytimg.com/vi/3mtbnT3YkcU/maxresdefault.jpg"
    },
    {
      id: "ywWEpQKdbQY",
      title: "IRL Ghost Of Tsushima Director's Cut: Live Ps5 l Malayalam Live",
      category: "Gaming",
      views: "8 views",
      viewCount: 8,
      timeAgo: "2 weeks ago",
      publishedAt: "2026-10-20T23:32:21Z",
      duration: "0:35",
      thumbnail: "https://i.ytimg.com/vi/ywWEpQKdbQY/maxresdefault.jpg"
    },
    {
      id: "ip53Pb-aw6o",
      title: "🔴 GTA 5 PS5 LIVE Streaming | Part 8 | Malayalam Live | Abhiyukth Vlogs",
      category: "Gaming",
      views: "247 views",
      viewCount: 247,
      timeAgo: "2 weeks ago",
      publishedAt: "2026-10-19T04:35:23Z",
      duration: "1:33:34",
      thumbnail: "https://i.ytimg.com/vi/ip53Pb-aw6o/maxresdefault.jpg"
    },
    {
      id: "b8u7o5IVYBc",
      title: "🔴 GTA 5 PS5 LIVE Streaming | Part 7 | Malayalam Live | Abhiyukth Vlogs",
      category: "Gaming",
      views: "118 views",
      viewCount: 118,
      timeAgo: "2 weeks ago",
      publishedAt: "2026-10-18T21:28:48Z",
      duration: "1:41:16",
      thumbnail: "https://i.ytimg.com/vi/b8u7o5IVYBc/maxresdefault.jpg"
    },
    {
      id: "xvXllkRkNjE",
      title: "🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 29 | Malayalam Gameplay | Abhiyukth Vlogs",
      category: "Gaming",
      views: "132 views",
      viewCount: 132,
      timeAgo: "2 weeks ago",
      publishedAt: "2026-10-18T20:29:29Z",
      duration: "1:42:43",
      thumbnail: "https://i.ytimg.com/vi/xvXllkRkNjE/maxresdefault.jpg"
    },
    {
      id: "yINjAfmcmbQ",
      title: "🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 28 | Malayalam Gameplay | Abhiyukth Vlogs",
      category: "Gaming",
      views: "63 views",
      viewCount: 63,
      timeAgo: "2 weeks ago",
      publishedAt: "2026-10-18T04:41:24Z",
      duration: "46:10",
      thumbnail: "https://i.ytimg.com/vi/yINjAfmcmbQ/maxresdefault.jpg"
    },
    {
      id: "uzI7Pkxdvo8",
      title: "🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 27 | Malayalam Gameplay | Abhiyukth Vlogs",
      category: "Gaming",
      views: "83 views",
      viewCount: 83,
      timeAgo: "2 weeks ago",
      publishedAt: "2026-10-18T04:08:18Z",
      duration: "1:30:43",
      thumbnail: "https://i.ytimg.com/vi/uzI7Pkxdvo8/maxresdefault.jpg"
    },
    {
      id: "bdCjoMrau94",
      title: "Streamlabs Test Live (Portrait)",
      category: "Live Replays",
      views: "0 views",
      viewCount: 0,
      timeAgo: "3 weeks ago",
      publishedAt: "2026-10-16T11:21:11Z",
      duration: "0:32",
      thumbnail: "https://i.ytimg.com/vi/bdCjoMrau94/maxresdefault.jpg"
    },
    {
      id: "vaUmv8LPZic",
      title: "🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 26 | Malayalam Gameplay | Abhiyukth Vlogs",
      category: "Gaming",
      views: "147 views",
      viewCount: 147,
      timeAgo: "3 weeks ago",
      publishedAt: "2026-10-15T01:17:50Z",
      duration: "1:54:27",
      thumbnail: "https://i.ytimg.com/vi/vaUmv8LPZic/maxresdefault.jpg"
    },
    {
      id: "w_Ot6HTaOIo",
      title: "Sreekrishna Jayanthi 2026 | അമ്പമ്പോ! ഇങ്ങനെയൊരു ശോഭയാത്ര ഈ അടുത്തൊന്നും കണ്ടിട്ടില്ല 😱🔥| Abhiyukth",
      category: "Vlogs",
      views: "325 views",
      viewCount: 325,
      timeAgo: "Recent",
      publishedAt: "2026-09-20T10:00:00Z",
      duration: "Vlog",
      thumbnail: "https://i.ytimg.com/vi/w_Ot6HTaOIo/hq720.jpg"
    },
    {
      id: "gAZaOn0ykDU",
      title: "🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 15 | Malayalam Gameplay | Abhiyukth Vlogs",
      category: "Gaming",
      views: "162 views",
      viewCount: 162,
      timeAgo: "Recent Stream",
      publishedAt: "2026-09-15T10:00:00Z",
      duration: "PS5 Gameplay",
      thumbnail: "https://i.ytimg.com/vi/gAZaOn0ykDU/hq720.jpg"
    },
    {
      id: "Chd998MvZ5E",
      title: "🔥 Kerala to Maharashtra by Train 🚆 | Epic Mangala Lakshadweep Express Journey | Part 2",
      category: "Vlogs",
      views: "55 views",
      viewCount: 55,
      timeAgo: "Travel Series",
      publishedAt: "2026-08-10T10:00:00Z",
      duration: "Train Vlog",
      thumbnail: "https://i.ytimg.com/vi/Chd998MvZ5E/hq720.jpg"
    },
    {
      id: "MT7urAnHevo",
      title: "മഹാരാഷ്ട്ര യാത്ര തുടങ്ങി! കോഴിക്കോട് ടു നാസിക് മംഗള എക്സ്പ്രസ്സിൽ 🤩 | Bharat Darshan Part 1",
      category: "Vlogs",
      views: "68 views",
      viewCount: 68,
      timeAgo: "Travel Series",
      publishedAt: "2026-08-05T10:00:00Z",
      duration: "Train Vlog",
      thumbnail: "https://i.ytimg.com/vi/MT7urAnHevo/hq720.jpg"
    },
    {
      id: "O9v5lJIN3l4",
      title: "MALAYALAM GTA 5 Live From India Kerala ! 🎮🔥 മലയാളത്തിലെ ആദ്യത്തെ Kick ലൈവ് Abhiyukth vlogs!",
      category: "Gaming",
      views: "Live Replay",
      viewCount: 120,
      timeAgo: "GTA V",
      publishedAt: "2026-07-20T10:00:00Z",
      duration: "Stream Replay",
      thumbnail: "https://i.ytimg.com/vi/O9v5lJIN3l4/hq720.jpg"
    },
    {
      id: "27mLvjo0l5I",
      title: "MALAYALAM'S GTA 5 MULTI-STREAM! 🎮🔥 മലയാളത്തിലെ ആദ്യത്തെ ലൈവ്!",
      category: "Gaming",
      views: "51 views",
      viewCount: 51,
      timeAgo: "Multi-stream",
      publishedAt: "2026-07-15T10:00:00Z",
      duration: "Stream",
      thumbnail: "https://i.ytimg.com/vi/27mLvjo0l5I/hq720.jpg"
    },
    {
      id: "Qo87K-jZtVY",
      title: "അപ്രതീക്ഷിത കാഴ്ച! 🤩 | Jammu Srinagar Vande Bharat First Run | Abhiyukth Vlogs",
      category: "Vlogs",
      views: "152 views",
      viewCount: 152,
      timeAgo: "Vande Bharat",
      publishedAt: "2026-06-10T10:00:00Z",
      duration: "Express Journey",
      thumbnail: "https://i.ytimg.com/vi/Qo87K-jZtVY/hq720.jpg"
    },
    {
      id: "nTNeHU_VU70",
      title: "രാജസ്ഥാൻ മരുഭൂമിയിലെ ഞെട്ടിക്കുന്ന കാഴ്ച! 🏜️ Part 2: Nizamuddin Arrival.",
      category: "Vlogs",
      views: "274 views",
      viewCount: 274,
      timeAgo: "Rajasthan Series",
      publishedAt: "2026-05-18T10:00:00Z",
      duration: "Vlog",
      thumbnail: "https://i.ytimg.com/vi/nTNeHU_VU70/hq720.jpg"
    },
    {
      id: "7m_R3PTSRZo",
      title: "രാജധാനി എക്സ്പ്രസ്സിലെ 3,000km യാത്ര; ആരും പറയാത്ത ആ സത്യം! 🤫",
      category: "Vlogs",
      views: "170 views",
      viewCount: 170,
      timeAgo: "Rajdhani Series",
      publishedAt: "2026-05-02T10:00:00Z",
      duration: "Train Journey",
      thumbnail: "https://i.ytimg.com/vi/7m_R3PTSRZo/hq720.jpg"
    },
    {
      id: "AbARbxnrwSI",
      title: "Bgmi Live Streaming | A Avarage Play Pls Support #bgmilive",
      category: "Live Replays",
      views: "BGMI Live",
      viewCount: 95,
      timeAgo: "Stream Replay",
      publishedAt: "2026-04-12T10:00:00Z",
      duration: "BGMI Stream",
      thumbnail: "https://i.ytimg.com/vi/AbARbxnrwSI/hq720.jpg"
    }
  ],

  // Verified Playlists
  playlists: [
    {
      id: "PLQ2TfYp3osGo",
      title: "Ghost Of Tsushima Director's Cut",
      videoCount: "46 videos",
      itemCount: 46,
      category: "PS5 Gaming",
      url: "https://www.youtube.com/playlist?list=PLQ2TfYp3osGo",
      thumbnail: "https://i.ytimg.com/vi/XkRzYEh5ZmU/maxresdefault.jpg"
    },
    {
      id: "PLYi1OQ16aBcE",
      title: "PS5 Live Stream",
      videoCount: "5 videos",
      itemCount: 5,
      category: "PS5 Gaming",
      url: "https://www.youtube.com/playlist?list=PLYi1OQ16aBcE",
      thumbnail: "https://i.ytimg.com/vi/QZwT3NVCW3E/maxresdefault.jpg"
    },
    {
      id: "PLWJAzlZWQbnU",
      title: "GTA VI",
      videoCount: "2 videos",
      itemCount: 2,
      category: "GTA Gaming",
      url: "https://www.youtube.com/playlist?list=PLWJAzlZWQbnU",
      thumbnail: "https://i.ytimg.com/vi/O9v5lJIN3l4/maxresdefault.jpg"
    },
    {
      id: "PLTlraZlovbcxyHy3BqYF4AUTkUVW999pk",
      title: "Dc Reaction",
      videoCount: "2 videos",
      itemCount: 2,
      category: "Gaming & Vlogs",
      url: "https://www.youtube.com/playlist?list=PLTlraZlovbcxyHy3BqYF4AUTkUVW999pk",
      thumbnail: "https://i.ytimg.com/vi/Pznd5aLqwgM/maxresdefault.jpg"
    },
    {
      id: "PLTlraZlovbczPPU_ANskKUY86Iy-xG-L7",
      title: "Kozhikode to Kashmir by Train",
      videoCount: "3 videos",
      itemCount: 3,
      category: "Travel & Vlogs",
      url: "https://www.youtube.com/playlist?list=PLTlraZlovbczPPU_ANskKUY86Iy-xG-L7",
      thumbnail: "https://i.ytimg.com/vi/7m_R3PTSRZo/maxresdefault.jpg"
    },
    {
      id: "PLTlraZlovbczUvOR9cWZOzYhEMCpU9OB9",
      title: "GTA V",
      videoCount: "14 videos",
      itemCount: 14,
      category: "GTA Gaming",
      url: "https://www.youtube.com/playlist?list=PLTlraZlovbczUvOR9cWZOzYhEMCpU9OB9",
      thumbnail: "https://i.ytimg.com/vi/h9dnfbLWS3U/maxresdefault.jpg"
    },
    {
      id: "PLTlraZlovbcySFnhMfqfVtkukgxKjrpPL",
      title: "Granny 1,2,3 and Multiplayer",
      videoCount: "3 videos",
      itemCount: 3,
      category: "Gaming & Vlogs",
      url: "https://www.youtube.com/playlist?list=PLTlraZlovbcySFnhMfqfVtkukgxKjrpPL",
      thumbnail: "https://i.ytimg.com/vi/L7ggiCLvO6U/maxresdefault.jpg"
    },
    {
      id: "PLTlraZlovbcwiEhIjgO8D9AGlHTQqxhSo",
      title: "Bus Simulator India",
      videoCount: "2 videos",
      itemCount: 2,
      category: "Travel & Vlogs",
      url: "https://www.youtube.com/playlist?list=PLTlraZlovbcwiEhIjgO8D9AGlHTQqxhSo",
      thumbnail: "https://i.ytimg.com/vi/Y-XsfUAnSfA/maxresdefault.jpg"
    },
    {
      id: "PLTlraZlovbcyuwFmGUgy-buDbucYakSbJ",
      title: "Komban Holidays",
      videoCount: "61 videos",
      itemCount: 61,
      category: "Travel & Vlogs",
      url: "https://www.youtube.com/playlist?list=PLTlraZlovbcyuwFmGUgy-buDbucYakSbJ",
      thumbnail: "https://i.ytimg.com/vi/UDOCaNUWM8c/maxresdefault.jpg"
    },
    {
      id: "PLTlraZlovbcx6qZVtin-P5KBsjBmRqkw-",
      title: "PUBG With Abhiyukth vlogs",
      videoCount: "10 videos",
      itemCount: 10,
      category: "Battle Royale",
      url: "https://www.youtube.com/playlist?list=PLTlraZlovbcx6qZVtin-P5KBsjBmRqkw-",
      thumbnail: "https://i.ytimg.com/vi/OEjHTyGYO00/maxresdefault.jpg"
    },
    {
      id: "PLTlraZlovbcxwcdMg2kfOsJ46hFDAE2rm",
      title: "Free Fire Max",
      videoCount: "4 videos",
      itemCount: 4,
      category: "Battle Royale",
      url: "https://www.youtube.com/playlist?list=PLTlraZlovbcxwcdMg2kfOsJ46hFDAE2rm",
      thumbnail: "https://i.ytimg.com/vi/WNvpOqLVZEI/maxresdefault.jpg"
    },
    {
      id: "PLTlraZlovbcxemVnlTvePyvZ5YMOpbUQi",
      title: "BGMI Live Streaming",
      videoCount: "14 videos",
      itemCount: 14,
      category: "Battle Royale",
      url: "https://www.youtube.com/playlist?list=PLTlraZlovbcxemVnlTvePyvZ5YMOpbUQi",
      thumbnail: "https://i.ytimg.com/vi/UbTBimJNb7A/maxresdefault.jpg"
    },
    {
      id: "PLTlraZlovbcxQXPDLbHtJcvCWO1tsdcKm",
      title: "Nostalgai",
      videoCount: "6 videos",
      itemCount: 6,
      category: "Gaming & Vlogs",
      url: "https://www.youtube.com/playlist?list=PLTlraZlovbcxQXPDLbHtJcvCWO1tsdcKm",
      thumbnail: "https://i.ytimg.com/vi/9JINnw1wsxE/maxresdefault.jpg"
    },
    {
      id: "PLTlraZlovbcwdxfd3rx9AKqZgQMtxTlNO",
      title: "Komban_fans_kozhikode_2.o_",
      videoCount: "135 videos",
      itemCount: 135,
      category: "Travel & Vlogs",
      url: "https://www.youtube.com/playlist?list=PLTlraZlovbcwdxfd3rx9AKqZgQMtxTlNO",
      thumbnail: "https://i.ytimg.com/vi/3Yxlej_rbjA/maxresdefault.jpg"
    },
    {
      id: "PLTlraZlovbcyfOmrSXiimETGXnQssmET1",
      title: "So",
      videoCount: "52 videos",
      itemCount: 52,
      category: "Gaming & Vlogs",
      url: "https://www.youtube.com/playlist?list=PLTlraZlovbcyfOmrSXiimETGXnQssmET1",
      thumbnail: "https://i.ytimg.com/vi/omDSLxxCzKo/maxresdefault.jpg"
    },
    {
      id: "PLTlraZlovbcx3jQpqn6eJaqhrR9n5LPqc",
      title: "Abhiyukth vlogs",
      videoCount: "106 videos",
      itemCount: 106,
      category: "Gaming & Vlogs",
      url: "https://www.youtube.com/playlist?list=PLTlraZlovbcx3jQpqn6eJaqhrR9n5LPqc",
      thumbnail: "https://i.ytimg.com/vi/HZoGZ2e3Y2E/sddefault.jpg"
    },
    {
      id: "PLTlraZlovbcyzHzRc0f-uzSoGem-WBUhO",
      title: "hello",
      videoCount: "75 videos",
      itemCount: 75,
      category: "Gaming & Vlogs",
      url: "https://www.youtube.com/playlist?list=PLTlraZlovbcyzHzRc0f-uzSoGem-WBUhO",
      thumbnail: "https://i.ytimg.com/vi/HZoGZ2e3Y2E/sddefault.jpg"
    }
  ]
};
