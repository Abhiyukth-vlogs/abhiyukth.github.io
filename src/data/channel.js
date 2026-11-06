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
    liveTitle: "🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 37 | Malayalam Gameplay | Abhiyukth Vlogs",
    videoId: "KPhHbQf4JLs",
    category: "Gaming / PS5",
    note: "Completed live broadcast replay. Catch past stream replays or join the next live stream!",
    upcoming: {
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
      views: "1.2K+ views",
      viewCount: 1185,
      viewCountFormatted: "1.2K",
      timeAgo: "Yesterday",
      publishedAt: "2026-11-05T08:20:06Z",
      duration: "0:23",
      durationSeconds: 23,
      thumbnail: "https://i.ytimg.com/vi/q43G09a8Ey8/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "CJrliLbGVDY",
      title: "തളർത്താൻ നോക്കിയവർക്ക് മുന്നിൽ കൊമ്പന്റെ മാസ്സ് തി തിരിച്ചുവരവ്! 🔥🚌 | Komban Comeback #komban",
      views: "1.8K+ views",
      viewCount: 1796,
      viewCountFormatted: "1.8K",
      timeAgo: "Yesterday",
      publishedAt: "2026-11-05T02:39:00Z",
      duration: "0:59",
      durationSeconds: 59,
      thumbnail: "https://i.ytimg.com/vi/CJrliLbGVDY/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "ih7ZHuzk6y0",
      title: "​Komban Beast Mode On 🔥 | Kerala Tourist Bus Edit",
      views: "1.2K+ views",
      viewCount: 1230,
      viewCountFormatted: "1.2K",
      timeAgo: "2 days ago",
      publishedAt: "2026-11-04T07:03:33Z",
      duration: "0:34",
      durationSeconds: 34,
      thumbnail: "https://i.ytimg.com/vi/ih7ZHuzk6y0/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "0cSKwCmEb-0",
      title: "Do You Know Who I Am? 😈🔥ആരാണെന്ന് മനസ്സിലായോ? | കൊമ്പനും ദീപു ചേട്ടനും ഒന്നിച്ച്! | Komban Mass Edit",
      views: "700+ views",
      viewCount: 706,
      viewCountFormatted: "706",
      timeAgo: "2 days ago",
      publishedAt: "2026-11-04T06:13:10Z",
      duration: "0:14",
      durationSeconds: 14,
      thumbnail: "https://i.ytimg.com/vi/0cSKwCmEb-0/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "od2IbTNPKv4",
      title: "പണി തുടങ്ങിക്കഴിഞ്ഞു! HE IS BACK 😈🔥 | Komban",
      views: "960+ views",
      viewCount: 960,
      viewCountFormatted: "960",
      timeAgo: "3 days ago",
      publishedAt: "2026-11-03T02:07:50Z",
      duration: "0:15",
      durationSeconds: 15,
      thumbnail: "https://i.ytimg.com/vi/od2IbTNPKv4/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "nZQI5GBYmpw",
      title: "Emperor Strikes Again! 👑🔥 | Komban Dawood Mass Entry",
      views: "2.3K+ views",
      viewCount: 2310,
      viewCountFormatted: "2.3K",
      timeAgo: "4 days ago",
      publishedAt: "2026-11-02T06:26:36Z",
      duration: "0:10",
      durationSeconds: 10,
      thumbnail: "https://i.ytimg.com/vi/nZQI5GBYmpw/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "imJsIgO5Jm8",
      title: "ഈ മാസ്സ് എൻട്രി കണ്ടാൽ ആരും ഒന്ന് നോക്കിപ്പോകും! 😱🔥 | Komban Dark Feudal Lord",
      views: "1.5K+ views",
      viewCount: 1502,
      viewCountFormatted: "1.5K",
      timeAgo: "5 days ago",
      publishedAt: "2026-11-01T04:18:32Z",
      duration: "0:26",
      durationSeconds: 26,
      thumbnail: "https://i.ytimg.com/vi/imJsIgO5Jm8/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "5-klvEOtqpk",
      title: "കൊമ്പന്റെ രാജകീയ തിരിച്ചുവരവ്! 🔥 ബോംബേ, ദാവൂദ്, കാളിയൻ ഒന്നിച്ച്!",
      views: "1.5K+ views",
      viewCount: 1546,
      viewCountFormatted: "1.5K",
      timeAgo: "1 week ago",
      publishedAt: "2026-10-30T02:29:49Z",
      duration: "0:26",
      durationSeconds: 26,
      thumbnail: "https://i.ytimg.com/vi/5-klvEOtqpk/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "meaMV8_jiAk",
      title: "ഒടുവിൽ ആ കിടിലൻ കാഴ്ച നേരിട്ട് കണ്ടു! 🤩🔥 | Bus Spotting",
      views: "8.4K+ views",
      viewCount: 8357,
      viewCountFormatted: "8.4K",
      timeAgo: "1 week ago",
      publishedAt: "2026-10-29T13:13:50Z",
      duration: "0:08",
      durationSeconds: 8,
      thumbnail: "https://i.ytimg.com/vi/meaMV8_jiAk/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "zOaw1Y1JJl0",
      title: "രോമാഞ്ചം വരുന്ന എൻട്രി! വെയിറ്റ് ഫോർ ഇറ്റ് 🥶🔥 | Komban Tourist Bus",
      views: "3.2K+ views",
      viewCount: 3165,
      viewCountFormatted: "3.2K",
      timeAgo: "1 week ago",
      publishedAt: "2026-10-29T13:10:07Z",
      duration: "0:24",
      durationSeconds: 24,
      thumbnail: "https://i.ytimg.com/vi/zOaw1Y1JJl0/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "KvOC-jGIA7U",
      title: "ഈ വൈബ് വേറെ എങ്ങും കിട്ടില്ല! 💥 | Kerala Tourist Bus",
      views: "1.2K+ views",
      viewCount: 1234,
      viewCountFormatted: "1.2K",
      timeAgo: "1 week ago",
      publishedAt: "2026-10-29T13:08:31Z",
      duration: "0:30",
      durationSeconds: 30,
      thumbnail: "https://i.ytimg.com/vi/KvOC-jGIA7U/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "5I2WDcwajbk",
      title: "Komban Holidays Mass Edit 🔥 | Kerala Tourist Bus",
      views: "1.3K+ views",
      viewCount: 1269,
      viewCountFormatted: "1.3K",
      timeAgo: "1 week ago",
      publishedAt: "2026-10-29T13:08:12Z",
      duration: "0:15",
      durationSeconds: 15,
      thumbnail: "https://i.ytimg.com/vi/5I2WDcwajbk/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "46v2NN0qgWU",
      title: "ഈ എൻട്രി കണ്ടാൽ ആരും ഒന്ന് നോക്കിപ്പോകും! 😱🔥 | Komban Mass",
      views: "1.2K+ views",
      viewCount: 1230,
      viewCountFormatted: "1.2K",
      timeAgo: "1 week ago",
      publishedAt: "2026-10-29T13:07:28Z",
      duration: "0:24",
      durationSeconds: 24,
      thumbnail: "https://i.ytimg.com/vi/46v2NN0qgWU/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "SMZVQ9PGK_I",
      title: "ആരാധകരുടെ നടുവിലൂടെ അവൻ വരുന്നു 🔥 | Komban Tourist Bus #shorts #komban",
      views: "1.2K+ views",
      viewCount: 1198,
      viewCountFormatted: "1.2K",
      timeAgo: "1 week ago",
      publishedAt: "2026-10-29T10:54:06Z",
      duration: "0:23",
      durationSeconds: 23,
      thumbnail: "https://i.ytimg.com/vi/SMZVQ9PGK_I/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "rpC1djTx4LM",
      title: "കൊമ്പൻ ഗദ്ദാഫിയുടെ മാസ്സ് ലുക്ക്! 🔥😈 | KOMBaN GADDAFI Bus Edit #shorts",
      views: "1.5K+ views",
      viewCount: 1469,
      viewCountFormatted: "1.5K",
      timeAgo: "1 week ago",
      publishedAt: "2026-10-29T02:40:18Z",
      duration: "0:26",
      durationSeconds: 26,
      thumbnail: "https://i.ytimg.com/vi/rpC1djTx4LM/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "cGZKzygcVgk",
      title: "The Beast KALIYAN ⚡ ബസ്സിനുള്ളിലെ ആ മാസ്സ് സൗണ്ട്! | Komban Tourist Bus Kerala",
      views: "1.9K+ views",
      viewCount: 1890,
      viewCountFormatted: "1.9K",
      timeAgo: "1 week ago",
      publishedAt: "2026-10-28T02:03:21Z",
      duration: "0:44",
      durationSeconds: 44,
      thumbnail: "https://i.ytimg.com/vi/cGZKzygcVgk/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "iA3cwLWYIbQ",
      title: "@reporterlive -ലും കൊമ്പന്റെ മാസ്സ് എൻട്രി 🔥 | Kerala Tourist Bus Thug Life",
      views: "14.1K+ views",
      viewCount: 14067,
      viewCountFormatted: "14.1K",
      timeAgo: "1 week ago",
      publishedAt: "2026-10-27T04:43:31Z",
      duration: "0:17",
      durationSeconds: 17,
      thumbnail: "https://i.ytimg.com/vi/iA3cwLWYIbQ/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "BoCyUIZo-jE",
      title: "ഇതാണ് കൊമ്പന്റെ പവർ 💥🔥 | Komban Tourist Bus Mass Status",
      views: "1.3K+ views",
      viewCount: 1276,
      viewCountFormatted: "1.3K",
      timeAgo: "1 week ago",
      publishedAt: "2026-10-26T12:44:11Z",
      duration: "0:13",
      durationSeconds: 13,
      thumbnail: "https://i.ytimg.com/vi/BoCyUIZo-jE/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "HTQSG5koicc",
      title: "കൊമ്പൻ വന്നാൽ വൈബ് വേറെ ലെവൽ! 🔥 | Komban Holidays #shorts @reporterlive",
      views: "2.6K+ views",
      viewCount: 2595,
      viewCountFormatted: "2.6K",
      timeAgo: "1 week ago",
      publishedAt: "2026-10-26T05:03:57Z",
      duration: "0:19",
      durationSeconds: 19,
      thumbnail: "https://i.ytimg.com/vi/HTQSG5koicc/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "DFyd3jeC5Jw",
      title: "വീര... ഒത്തക്ക് ഒത്ത ഇറങ്ങി നിക്കണം! 🔥 | Komban Mass Entry",
      views: "1.6K+ views",
      viewCount: 1622,
      viewCountFormatted: "1.6K",
      timeAgo: "1 week ago",
      publishedAt: "2026-10-25T09:58:45Z",
      duration: "0:36",
      durationSeconds: 36,
      thumbnail: "https://i.ytimg.com/vi/DFyd3jeC5Jw/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "QxORffjaNMU",
      title: "The Boss is Here 😈 | Komban Mass Edit",
      views: "1.5K+ views",
      viewCount: 1510,
      viewCountFormatted: "1.5K",
      timeAgo: "1 week ago",
      publishedAt: "2026-10-25T09:58:32Z",
      duration: "0:29",
      durationSeconds: 29,
      thumbnail: "https://i.ytimg.com/vi/QxORffjaNMU/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "PvmrwoXvzwE",
      title: "🔥 Komban Holidays 🚌 | റോഡിലെ മാസ്സ് എൻട്രി! 😈🔥 | Kerala Bus Edit #Shorts",
      views: "1.7K+ views",
      viewCount: 1715,
      viewCountFormatted: "1.7K",
      timeAgo: "2 weeks ago",
      publishedAt: "2026-10-21T12:51:35Z",
      duration: "0:20",
      durationSeconds: 20,
      thumbnail: "https://i.ytimg.com/vi/PvmrwoXvzwE/hq720.jpg",
      classification: "confirmed"
    },
    {
      id: "7O3M2aeBVOk",
      title: "നിങ്ങളുടെ സപ്പോർട്ടിന് ഒരായിരം നന്ദി! ❤️ 5.7K YT Fam & 13.8K Insta Views 🎉 #abhiyukthvlogs #shorts",
      views: "71+ views",
      viewCount: 71,
      viewCountFormatted: "71",
      timeAgo: "3 weeks ago",
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
      thumbnail: "https://i.ytimg.com/vi/XkRzYEh5ZmU/hqdefault.jpg"
    },
    {
      id: "PLYi1OQ16aBcE",
      title: "PS5 Live Stream",
      videoCount: "5 videos",
      itemCount: 5,
      category: "Live Gaming",
      url: "https://www.youtube.com/playlist?list=PLYi1OQ16aBcE",
      thumbnail: "https://i.ytimg.com/vi/aPsZHOZQ94I/hqdefault.jpg"
    },
    {
      id: "PLTlraZlovbczPPU_ANskKUY86Iy-xG-L7",
      title: "Kozhikode to Kashmir by Train",
      videoCount: "3 videos",
      itemCount: 3,
      category: "Travel Series",
      url: "https://www.youtube.com/playlist?list=PLTlraZlovbczPPU_ANskKUY86Iy-xG-L7",
      thumbnail: "https://i.ytimg.com/vi/7m_R3PTSRZo/hqdefault.jpg"
    },
    {
      id: "PLTlraZlovbczUvOR9cWZOzYhEMCpU9OB9",
      title: "GTA V Series",
      videoCount: "14 videos",
      itemCount: 14,
      category: "Gaming",
      url: "https://www.youtube.com/playlist?list=PLTlraZlovbczUvOR9cWZOzYhEMCpU9OB9",
      thumbnail: "https://i.ytimg.com/vi/h9dnfbLWS3U/hqdefault.jpg"
    },
    {
      id: "PLTlraZlovbcxemVnlTvePyvZ5YMOpbUQi",
      title: "BGMI Live Streaming",
      videoCount: "14 videos",
      itemCount: 14,
      category: "Battle Royale",
      url: "https://www.youtube.com/playlist?list=PLTlraZlovbcxemVnlTvePyvZ5YMOpbUQi",
      thumbnail: "https://i.ytimg.com/vi/4vlJ5_qt9Q8/hqdefault.jpg"
    },
    {
      id: "PLTlraZlovbcyuwFmGUgy-buDbucYakSbJ",
      title: "Komban Holidays & Travels",
      videoCount: "61 videos",
      itemCount: 61,
      category: "Travel & Buses",
      url: "https://www.youtube.com/playlist?list=PLTlraZlovbcyuwFmGUgy-buDbucYakSbJ",
      thumbnail: "https://i.ytimg.com/vi/47DMpUQBlJo/hqdefault.jpg"
    }
  ],
  featuredChannels: [
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
  ]
};
