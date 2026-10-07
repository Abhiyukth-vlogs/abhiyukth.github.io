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
  // isLive is false unless a verified broadcast is currently active.
  liveStatus: {
    isLive: false,
    badgeText: 'Latest Verified Stream',
    liveTitle: 'IRL Ghost Of Tsushima Director\'s Cut: Live Ps5 l Malayalam Live',
    videoId: 'Kw2kIt6dyU4',
    category: 'Gaming / PS5',
    note: 'Active broadcasts are confirmed via YouTube Live. Catch past stream replays or join the next live stream!',
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
