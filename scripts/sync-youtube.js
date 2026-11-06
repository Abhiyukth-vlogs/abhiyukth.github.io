/**
 * Automated YouTube Content Synchronization Script
 * 
 * Synchronizes only:
 *  1. YouTube Shorts
 *  2. Long-form Videos
 *  3. Live Stream / Replay Status
 *  4. Playlists
 * 
 * Preserves all branding, theme, 3D scenes, milestones, and custom structure.
 * Can be run manually or automatically via GitHub Actions / cron.
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { getShortsFeed } from '../api/_lib/youtubeShorts.js';
import { getVideosFeed } from '../api/_lib/youtubeVideos.js';
import { getLiveStreamData } from '../api/_lib/youtubeLive.js';
import { getPlaylistsFeed } from '../api/_lib/youtubePlaylists.js';
import { getFeaturedChannelsFeed } from '../api/_lib/youtubeFeaturedChannels.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CHANNEL_FILE = path.resolve(__dirname, '../src/data/channel.js');

async function sync() {
  console.log('[Sync] Starting YouTube content synchronization...');

  const [shortsRes, videosRes, liveRes, playlistsRes, featuredRes] = await Promise.all([
    getShortsFeed().catch(err => ({ items: [], error: err.message })),
    getVideosFeed().catch(err => ({ items: [], error: err.message })),
    getLiveStreamData().catch(err => ({ error: err.message })),
    getPlaylistsFeed().catch(err => ({ items: [], error: err.message })),
    getFeaturedChannelsFeed().catch(err => ({ sections: [], error: err.message }))
  ]);

  console.log(`[Sync] Fetched: ${shortsRes.items?.length || 0} Shorts, ${videosRes.items?.length || 0} Videos, ${playlistsRes.items?.length || 0} Playlists, ${featuredRes.sections?.length || 0} Featured Sections.`);
  console.log(`[Sync] Live Stream Status: ${liveRes.isLive ? 'LIVE' : 'Replay'} (${liveRes.stream?.videoId || 'none'})`);

  if (!fs.existsSync(CHANNEL_FILE)) {
    console.error('[Sync] Channel file not found at:', CHANNEL_FILE);
    process.exit(1);
  }

  let code = fs.readFileSync(CHANNEL_FILE, 'utf8');

  // 1. Update Shorts (if items available)
  if (shortsRes.items && shortsRes.items.length > 0) {
    const formattedShorts = shortsRes.items.map(s => ({
      id: s.id,
      title: s.title,
      views: s.views,
      viewCount: s.viewCount || 0,
      viewCountFormatted: s.viewCountFormatted || s.views,
      timeAgo: s.timeAgo || 'Recent',
      publishedAt: s.publishedAt,
      duration: s.duration,
      durationSeconds: s.durationSeconds || 0,
      thumbnail: `https://i.ytimg.com/vi/${s.id}/hq720.jpg`,
      classification: 'confirmed'
    }));

    const shortsJson = JSON.stringify(formattedShorts, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .split('\n')
      .map((line, idx) => (idx === 0 ? line : `  ${line}`))
      .join('\n');

    code = code.replace(/shorts:\s*\[[\s\S]*?\n\s*\],/, `shorts: ${shortsJson},`);
  }

  // 2. Update Videos (if items available)
  if (videosRes.items && videosRes.items.length > 0) {
    const formattedVideos = videosRes.items.map(v => ({
      id: v.id,
      title: v.title,
      category: v.category || 'Vlogs',
      views: v.views,
      viewCount: v.viewCount || 0,
      timeAgo: v.timeAgo || 'Recent',
      publishedAt: v.publishedAt,
      duration: v.duration,
      thumbnail: v.thumbnail || `https://i.ytimg.com/vi/${v.id}/hq720.jpg`
    }));

    const videosJson = JSON.stringify(formattedVideos, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .split('\n')
      .map((line, idx) => (idx === 0 ? line : `  ${line}`))
      .join('\n');

    code = code.replace(/videos:\s*\[[\s\S]*?\n\s*\],/, `videos: ${videosJson},`);
  }

  // 3. Update Playlists (if items available)
  if (playlistsRes.items && playlistsRes.items.length > 0) {
    const formattedPlaylists = playlistsRes.items.map(p => ({
      id: p.id,
      title: p.title,
      videoCount: p.videoCount,
      itemCount: p.itemCount || 0,
      category: p.category || 'Playlists',
      url: p.url,
      thumbnail: p.thumbnail
    }));

    const playlistsJson = JSON.stringify(formattedPlaylists, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .split('\n')
      .map((line, idx) => (idx === 0 ? line : `  ${line}`))
      .join('\n');

    code = code.replace(/playlists:\s*\[[\s\S]*?\n\s*\],/, `playlists: ${playlistsJson},`);
  }

  // 4. Update Featured Channels (if sections available)
  if (featuredRes.sections && featuredRes.sections.length > 0) {
    const formattedSections = featuredRes.sections.map(s => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      displayTitle: s.displayTitle,
      description: s.description,
      channels: (s.channels || []).map(ch => ({
        id: ch.id,
        title: ch.title,
        handle: ch.handle,
        avatar: ch.avatar,
        url: ch.url,
        subscriberCount: ch.subscriberCount || 0,
        subscriberCountFormatted: ch.subscriberCountFormatted,
        videoCount: ch.videoCount || 0
      }))
    }));

    const featuredJson = JSON.stringify(formattedSections, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .split('\n')
      .map((line, idx) => (idx === 0 ? line : `  ${line}`))
      .join('\n');

    code = code.replace(/featuredChannels:\s*\[[\s\S]*?\n  \]\n\};/, `featuredChannels: ${featuredJson}\n};`);
  }

  // 5. Update Live Stream Replay / Status if available
  if (liveRes.stream && liveRes.stream.videoId) {
    const isLive = !!liveRes.isLive;
    const badge = liveRes.badgeText || (isLive ? 'LIVE NOW' : 'Latest Live Replay');
    const title = liveRes.stream.title || '';
    const vidId = liveRes.stream.videoId;
    const cat = liveRes.stream.category || 'Gaming / PS5';
    const note = isLive
      ? 'Active live broadcast in progress! Join the chat and stream.'
      : 'Completed live broadcast replay. Catch past stream replays or join the next live stream!';

    const liveBlock = [
      `    isLive: ${isLive},`,
      `    badgeText: ${JSON.stringify(badge)},`,
      `    liveTitle: ${JSON.stringify(title)},`,
      `    videoId: ${JSON.stringify(vidId)},`,
      `    category: ${JSON.stringify(cat)},`,
      `    note: ${JSON.stringify(note)},`
    ].join('\n');

    code = code.replace(/liveStatus:\s*\{[\s\S]*?upcoming:/, `liveStatus: {\n${liveBlock}\n    upcoming:`);
  }

  fs.writeFileSync(CHANNEL_FILE, code, 'utf8');
  console.log('[Sync] Successfully updated channel.js with fresh YouTube content!');
}

sync().catch(err => {
  console.error('[Sync Error]:', err);
  process.exit(1);
});
