import axios from 'axios';

/**
 * YouTube API Client Helper
 * Supports multiple API keys with automatic failover and quota rotation.
 * Keeps keys strictly server-side and never exposes them in logs or client bundles.
 */

const REFERER_HEADER = 'https://abhiyukth.vercel.app';

export function maskKey(key = '') {
  if (!key || typeof key !== 'string') return 'none';
  if (key.length <= 10) return '***';
  return `${key.slice(0, 6)}...${key.slice(-4)}`;
}

export function getYoutubeApiKeys() {
  const keys = [];

  // Parse YOUTUBE_API_KEY (supports single key or comma/semicolon/space-separated list)
  const primaryEnv = process.env.YOUTUBE_API_KEY || '';
  if (primaryEnv) {
    const split = primaryEnv.split(/[,;\s]+/).map(k => k.trim()).filter(Boolean);
    keys.push(...split);
  }

  // Parse secondary / fallback keys if configured
  const fallbackEnv = process.env.YOUTUBE_API_KEY_FALLBACK || process.env.YOUTUBE_API_KEY_2 || '';
  if (fallbackEnv) {
    const split = fallbackEnv.split(/[,;\s]+/).map(k => k.trim()).filter(Boolean);
    keys.push(...split);
  }

  // Deduplicate keys
  return Array.from(new Set(keys)).filter(k => k.length > 10);
}

export function getPrimaryApiKey() {
  const keys = getYoutubeApiKeys();
  return keys.length > 0 ? keys[0] : null;
}

/**
 * Performs a GET request to YouTube API with automatic key rotation on quota/authorization errors.
 * Includes referer header to satisfy restricted Google Cloud API keys.
 * 
 * @param {string} url - The YouTube API endpoint URL
 * @param {object} config - Axios request config (params, timeout, etc.)
 */
export async function youtubeGet(url, config = {}) {
  const keys = getYoutubeApiKeys();

  if (keys.length === 0) {
    const err = new Error('No YouTube API keys configured in environment');
    err.code = 'NO_API_KEY';
    throw err;
  }

  let lastError = null;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    try {
      const mergedHeaders = {
        'Referer': REFERER_HEADER,
        'Origin': REFERER_HEADER,
        ...(config.headers || {})
      };

      const mergedParams = {
        ...(config.params || {}),
        key
      };

      const res = await axios.get(url, {
        ...config,
        params: mergedParams,
        headers: mergedHeaders,
        timeout: config.timeout || 8000
      });

      return res;
    } catch (err) {
      lastError = err;
      const status = err.response?.status;
      const reason = err.response?.data?.error?.errors?.[0]?.reason || err.response?.data?.error?.message || err.message;
      
      console.warn(`[YouTube Client] Key ${maskKey(key)} failed (status: ${status}, reason: ${reason}).`);

      // If we have another key available, continue loop to try it
      if (i < keys.length - 1) {
        console.info(`[YouTube Client] Failing over to backup API key #${i + 2}...`);
        continue;
      }
    }
  }

  throw lastError;
}

