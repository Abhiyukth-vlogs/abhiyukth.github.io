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
    badgeText: 'Latest Live Replay',
    liveTitle: '🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 37 | Malayalam Gameplay | Abhiyukth Vlogs',
    videoId: 'KPhHbQf4JLs',
    category: 'Gaming / PS5',
    note: 'Completed live broadcast replay. Catch past stream replays or join the next live stream!',
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
      id: 'meaMV8_jiAk',
      title: 'ഒടുവിൽ ആ കിടിലൻ കാഴ്ച നേരിട്ട് കണ്ടു! 🤩🔥 | Bus Spotting',
      views: '395+ views',
      timeAgo: 'Recent',
      publishedAt: '2026-10-29T13:13:50Z',
      duration: '0:08',
      durationSeconds: 8,
      thumbnail: 'https://i.ytimg.com/vi/meaMV8_jiAk/hq720.jpg',
      classification: 'confirmed'
    },
    {
      id: 'zOaw1Y1JJl0',
      title: 'രോമാഞ്ചം വരുന്ന എൻട്രി! വെയിറ്റ് ഫോർ ഇറ്റ് 🥶🔥 | Komban Tourist Bus',
      views: '276+ views',
      timeAgo: 'Recent',
      publishedAt: '2026-10-29T13:10:07Z',
      duration: '0:24',
      durationSeconds: 24,
      thumbnail: 'https://i.ytimg.com/vi/zOaw1Y1JJl0/hq720.jpg',
      classification: 'confirmed'
    },
    {
      id: 'KvOC-jGIA7U',
      title: 'ഈ വൈബ് വേറെ എങ്ങും കിട്ടില്ല! 💥 | Kerala Tourist Bus',
      views: '96+ views',
      timeAgo: 'Recent',
      publishedAt: '2026-10-29T13:08:31Z',
      duration: '0:30',
      durationSeconds: 30,
      thumbnail: 'https://i.ytimg.com/vi/KvOC-jGIA7U/hq720.jpg',
      classification: 'confirmed'
    },
    {
      id: '46v2NN0qgWU',
      title: 'ഈ എൻട്രി കണ്ടാൽ ആരും ഒന്ന് നോക്കിപ്പോകും! 😱🔥 | Komban Mass',
      views: '312+ views',
      timeAgo: 'Recent',
      publishedAt: '2026-10-29T13:07:28Z',
      duration: '0:24',
      durationSeconds: 24,
      thumbnail: 'https://i.ytimg.com/vi/46v2NN0qgWU/hq720.jpg',
      classification: 'confirmed'
    },
    {
      id: 'SMZVQ9PGK_I',
      title: 'ആരാധകരുടെ നടുവിലൂടെ അവൻ വരുന്നു 🔥 | Komban Tourist Bus #shorts #komban',
      views: '838+ views',
      timeAgo: 'Recent',
      publishedAt: '2026-10-29T10:54:06Z',
      duration: '0:23',
      durationSeconds: 23,
      thumbnail: 'https://i.ytimg.com/vi/SMZVQ9PGK_I/hq720.jpg',
      classification: 'confirmed'
    },
    {
      id: 'rpC1djTx4LM',
      title: 'കൊമ്പൻ ഗദ്ദാഫിയുടെ മാസ്സ് ലുക്ക്! 🔥😈 | KOMBaN GADDAFI Bus Edit #shorts',
      views: '1.1K+ views',
      timeAgo: 'Today',
      publishedAt: '2026-10-29T02:40:18Z',
      duration: '0:26',
      durationSeconds: 26,
      thumbnail: 'https://i.ytimg.com/vi/rpC1djTx4LM/hq720.jpg',
      classification: 'confirmed'
    },
    {
      id: 'cGZKzygcVgk',
      title: 'The Beast KALIYAN ⚡ ബസ്സിനുള്ളിലെ ആ മാസ്സ് സൗണ്ട്! | Komban Tourist Bus Kerala',
      views: '1.4K+ views',
      timeAgo: 'Yesterday',
      publishedAt: '2026-10-28T02:03:21Z',
      duration: '0:44',
      durationSeconds: 44,
      thumbnail: 'https://i.ytimg.com/vi/cGZKzygcVgk/hq720.jpg',
      classification: 'confirmed'
    },
    {
      id: 'iA3cwLWYIbQ',
      title: '@reporterlive -ലും കൊമ്പന്റെ മാസ്സ് എൻട്രി 🔥 | Kerala Tourist Bus Thug Life',
      views: '11.4K+ views',
      timeAgo: '2 days ago',
      publishedAt: '2026-10-27T04:43:31Z',
      duration: '0:17',
      durationSeconds: 17,
      thumbnail: 'https://i.ytimg.com/vi/iA3cwLWYIbQ/hq720.jpg',
      classification: 'confirmed'
    },
    {
      id: 'BoCyUIZo-jE',
      title: 'ഇതാണ് കൊമ്പന്റെ പവർ 💥🔥 | Komban Tourist Bus Mass Status',
      views: '1.2K+ views',
      timeAgo: '3 days ago',
      publishedAt: '2026-10-26T12:44:11Z',
      duration: '0:13',
      durationSeconds: 13,
      thumbnail: 'https://i.ytimg.com/vi/BoCyUIZo-jE/hq720.jpg',
      classification: 'confirmed'
    },
    {
      id: 'HTQSG5koicc',
      title: 'കൊമ്പൻ വന്നാൽ വൈബ് വേറെ ലെവൽ! 🔥 | Komban Holidays #shorts @reporterlive',
      views: '2.5K+ views',
      timeAgo: '3 days ago',
      publishedAt: '2026-10-26T05:03:57Z',
      duration: '0:19',
      durationSeconds: 19,
      thumbnail: 'https://i.ytimg.com/vi/HTQSG5koicc/hq720.jpg',
      classification: 'confirmed'
    },
    {
      id: 'DFyd3jeC5Jw',
      title: 'വീര... ഒത്തക്ക് ഒത്ത ഇറങ്ങി നിക്കണം! 🔥 | Komban Mass Entry',
      views: '1.6K+ views',
      timeAgo: '4 days ago',
      publishedAt: '2026-10-25T09:58:45Z',
      duration: '0:36',
      durationSeconds: 36,
      thumbnail: 'https://i.ytimg.com/vi/DFyd3jeC5Jw/hq720.jpg',
      classification: 'confirmed'
    },
    {
      id: 'QxORffjaNMU',
      title: 'The Boss is Here 😈 | Komban Mass Edit',
      views: '1.5K+ views',
      timeAgo: '4 days ago',
      publishedAt: '2026-10-25T09:58:32Z',
      duration: '0:29',
      durationSeconds: 29,
      thumbnail: 'https://i.ytimg.com/vi/QxORffjaNMU/hq720.jpg',
      classification: 'confirmed'
    },
    {
      id: 'PvmrwoXvzwE',
      title: '🔥 Komban Holidays 🚌 | റോഡിലെ മാസ്സ് എൻട്രി! 😈🔥 | Kerala Bus Edit #Shorts',
      views: '1.7K+ views',
      timeAgo: '1 week ago',
      publishedAt: '2026-10-21T12:51:35Z',
      duration: '0:20',
      durationSeconds: 20,
      thumbnail: 'https://i.ytimg.com/vi/PvmrwoXvzwE/hq720.jpg',
      classification: 'confirmed'
    },
    {
      id: '7O3M2aeBVOk',
      title: 'നിങ്ങളുടെ സപ്പോർട്ടിന് ഒരായിരം നന്ദി! ❤️ 5.7K YT Fam & 13.8K Insta Views 🎉 #shorts',
      views: '64+ views',
      timeAgo: '2 weeks ago',
      publishedAt: '2026-10-16T15:48:21Z',
      duration: '0:14',
      durationSeconds: 14,
      thumbnail: 'https://i.ytimg.com/vi/7O3M2aeBVOk/hq720.jpg',
      classification: 'confirmed'
    }
  ],

  // Verified Video Gallery Catalog
  // Category tags: 'Gaming' | 'Vlogs' | 'Live Replays'
  videos: [
    {
      id: 'gxpAlDUWIOQ',
      title: 'ആദ്യ വാക്കത്തോൺ… ആവേശം വേറെ ലെവൽ! 😍 Kozhikode Walkaaro Walkathon 2026',
      category: 'Vlogs',
      views: '738 views',
      timeAgo: 'Recent',
      duration: 'Vlog',
      thumbnail: 'https://i.ytimg.com/vi/gxpAlDUWIOQ/hq720.jpg'
    },
    {
      id: 'Kw2kIt6dyU4',
      title: 'IRL Ghost Of Tsushima Director\'s Cut: Live Ps5 l Malayalam Live',
      category: 'Live Replays',
      views: 'Stream Replay',
      timeAgo: 'Recent Stream',
      duration: 'PS5 Live',
      thumbnail: 'https://i.ytimg.com/vi/Kw2kIt6dyU4/hq720.jpg'
    },
    {
      id: 'w_Ot6HTaOIo',
      title: 'Sreekrishna Jayanthi 2026 | അമ്പമ്പോ! ഇങ്ങനെയൊരു ശോഭയാത്ര ഈ അടുത്തൊന്നും കണ്ടിട്ടില്ല 😱🔥| Abhiyukth',
      category: 'Vlogs',
      views: '325 views',
      timeAgo: 'Recent',
      duration: 'Vlog',
      thumbnail: 'https://i.ytimg.com/vi/w_Ot6HTaOIo/hq720.jpg'
    },
    {
      id: 'gAZaOn0ykDU',
      title: '🔴 Ghost of Tsushima Director’s Cut PS5 LIVE | Part 15 | Malayalam Gameplay | Abhiyukth Vlogs',
      category: 'Gaming',
      views: '162 views',
      timeAgo: 'Recent Stream',
      duration: 'PS5 Gameplay',
      thumbnail: 'https://i.ytimg.com/vi/gAZaOn0ykDU/hq720.jpg'
    },
    {
      id: 'Chd998MvZ5E',
      title: '🔥 Kerala to Maharashtra by Train 🚆 | Epic Mangala Lakshadweep Express Journey | Part 2',
      category: 'Vlogs',
      views: '55 views',
      timeAgo: 'Travel Series',
      duration: 'Train Vlog',
      thumbnail: 'https://i.ytimg.com/vi/Chd998MvZ5E/hq720.jpg'
    },
    {
      id: 'MT7urAnHevo',
      title: 'മഹാരാഷ്ട്ര യാത്ര തുടങ്ങി! കോഴിക്കോട് ടു നാസിക് മംഗള എക്സ്പ്രസ്സിൽ 🤩 | Bharat Darshan Part 1',
      category: 'Vlogs',
      views: '68 views',
      timeAgo: 'Travel Series',
      duration: 'Train Vlog',
      thumbnail: 'https://i.ytimg.com/vi/MT7urAnHevo/hq720.jpg'
    },
    {
      id: 'O9v5lJIN3l4',
      title: 'MALAYALAM GTA 5 Live From India Kerala ! 🎮🔥 മലയാളത്തിലെ ആദ്യത്തെ Kick ലൈവ് Abhiyukth vlogs!',
      category: 'Gaming',
      views: 'Live Replay',
      timeAgo: 'GTA V',
      duration: 'Stream Replay',
      thumbnail: 'https://i.ytimg.com/vi/O9v5lJIN3l4/hq720.jpg'
    },
    {
      id: '27mLvjo0l5I',
      title: 'MALAYALAM\'S GTA 5 MULTI-STREAM! 🎮🔥 മലയാളത്തിലെ ആദ്യത്തെ ലൈവ്!',
      category: 'Gaming',
      views: '51 views',
      timeAgo: 'Multi-stream',
      duration: 'Stream',
      thumbnail: 'https://i.ytimg.com/vi/27mLvjo0l5I/hq720.jpg'
    },
    {
      id: 'Qo87K-jZtVY',
      title: 'അപ്രതീക്ഷിത കാഴ്ച! 🤩 | Jammu Srinagar Vande Bharat First Run | Abhiyukth Vlogs',
      category: 'Vlogs',
      views: '152 views',
      timeAgo: 'Vande Bharat',
      duration: 'Express Journey',
      thumbnail: 'https://i.ytimg.com/vi/Qo87K-jZtVY/hq720.jpg'
    },
    {
      id: 'nTNeHU_VU70',
      title: 'രാജസ്ഥാൻ മരുഭൂമിയിലെ ഞെട്ടിക്കുന്ന കാഴ്ച! 🏜️ Part 2: Nizamuddin Arrival.',
      category: 'Vlogs',
      views: '274 views',
      timeAgo: 'Rajasthan Series',
      duration: 'Vlog',
      thumbnail: 'https://i.ytimg.com/vi/nTNeHU_VU70/hq720.jpg'
    },
    {
      id: '7m_R3PTSRZo',
      title: 'രാജധാനി എക്സ്പ്രസ്സിലെ 3,000km യാത്ര; ആരും പറയാത്ത ആ സത്യം! 🤫',
      category: 'Vlogs',
      views: '170 views',
      timeAgo: 'Rajdhani Series',
      duration: 'Train Journey',
      thumbnail: 'https://i.ytimg.com/vi/7m_R3PTSRZo/hq720.jpg'
    },
    {
      id: 'AbARbxnrwSI',
      title: 'Bgmi Live Streaming | A Avarage Play Pls Support #bgmilive',
      category: 'Live Replays',
      views: 'BGMI Live',
      timeAgo: 'Stream Replay',
      duration: 'BGMI Stream',
      thumbnail: 'https://i.ytimg.com/vi/AbARbxnrwSI/hq720.jpg'
    }
  ],

  // Verified Playlists
  playlists: [
    {
      id: 'PLQ2TfYp3osGo',
      title: "Ghost Of Tsushima Director's Cut",
      videoCount: '16 videos',
      category: 'PS5 Gaming',
      url: 'https://www.youtube.com/playlist?list=PLQ2TfYp3osGo',
      thumbnail: 'https://i.ytimg.com/vi/XkRzYEh5ZmU/hqdefault.jpg'
    },
    {
      id: 'PLYi1OQ16aBcE',
      title: 'PS5 Live Stream',
      videoCount: '3 videos',
      category: 'Live Gaming',
      url: 'https://www.youtube.com/playlist?list=PLYi1OQ16aBcE',
      thumbnail: 'https://i.ytimg.com/vi/aPsZHOZQ94I/hqdefault.jpg'
    },
    {
      id: 'PLTlraZlovbczPPU_ANskKUY86Iy-xG-L7',
      title: 'Kozhikode to Kashmir by Train',
      videoCount: '3 videos',
      category: 'Travel Series',
      url: 'https://www.youtube.com/playlist?list=PLTlraZlovbczPPU_ANskKUY86Iy-xG-L7',
      thumbnail: 'https://i.ytimg.com/vi/7m_R3PTSRZo/hqdefault.jpg'
    },
    {
      id: 'PLTlraZlovbczUvOR9cWZOzYhEMCpU9OB9',
      title: 'GTA V Series',
      videoCount: '3 videos',
      category: 'Gaming',
      url: 'https://www.youtube.com/playlist?list=PLTlraZlovbczUvOR9cWZOzYhEMCpU9OB9',
      thumbnail: 'https://i.ytimg.com/vi/h9dnfbLWS3U/hqdefault.jpg'
    },
    {
      id: 'PLTlraZlovbcxemVnlTvePyvZ5YMOpbUQi',
      title: 'BGMI Live Streaming',
      videoCount: '14 episodes',
      category: 'Battle Royale',
      url: 'https://www.youtube.com/playlist?list=PLTlraZlovbcxemVnlTvePyvZ5YMOpbUQi',
      thumbnail: 'https://i.ytimg.com/vi/4vlJ5_qt9Q8/hqdefault.jpg'
    },
    {
      id: 'PLTlraZlovbcyuwFmGUgy-buDbucYakSbJ',
      title: 'Komban Holidays & Travels',
      videoCount: '53 videos',
      category: 'Travel & Buses',
      url: 'https://www.youtube.com/playlist?list=PLTlraZlovbcyuwFmGUgy-buDbucYakSbJ',
      thumbnail: 'https://i.ytimg.com/vi/47DMpUQBlJo/hqdefault.jpg'
    }
  ]
};
