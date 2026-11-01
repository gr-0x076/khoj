import dotenv from 'dotenv';
import { TinyFish } from '@tiny-fish/sdk';
import { getCached, setCached } from './cache.js';

dotenv.config();

const apiKey = process.env.TINYFISH_API_KEY;
if (!apiKey) {
  console.warn('[TinyFish] Warning: TINYFISH_API_KEY is not set in environment.');
}

export const tinyfish = new TinyFish({
  apiKey: apiKey || 'dummy-key'
});

/**
 * Clean and truncate raw markdown to strip boilerplate and keep token counts low.
 */
export function cleanMarkdown(rawText, maxWords = 2500) {
  if (!rawText) return '';
  // Remove script and style tags if present
  let cleaned = rawText.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Strip repetitive nav/footer artifacts
  cleaned = cleaned.replace(/\[(?:Home|About|Contact|Privacy|Terms|Menu|Login|Sign Up|Cookie Preferences)\]\([^)]+\)/gi, '');
  
  // Collapse whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

  // Word budget cap
  const words = cleaned.split(/\s+/);
  if (words.length > maxWords) {
    cleaned = words.slice(0, maxWords).join(' ') + '\n\n...[content truncated for token efficiency]...';
  }
  return cleaned;
}

/**
 * Tier 1: Search with language and location hints.
 */
export async function search(params, options = { preferLive: true }) {
  const cacheKey = { type: 'search', ...params };
  if (!options.preferLive) {
    const cached = getCached('search', cacheKey);
    if (cached) return cached;
  }

  try {
    const response = await tinyfish.search.query({
      query: params.query,
      language: params.language,
      location: params.location,
      page: params.page || 0
    });

    const results = (response.results || []).map((r) => ({
      position: r.position,
      title: r.title,
      url: r.url,
      snippet: r.snippet
    }));

    const resultPayload = {
      query: params.query,
      language: params.language,
      total_results: response.total_results || results.length,
      results
    };

    setCached('search', cacheKey, resultPayload);
    return resultPayload;
  } catch (err) {
    console.error(`[TinyFish Search Error]: ${err.message}. Trying cache fallback...`);
    const fallback = getCached('search', cacheKey);
    if (fallback) return fallback;
    throw err;
  }
}

/**
 * Tier 2: Batch Fetch up to 10 URLs with timeout and markdown cleaning.
 */
export async function fetchBatch(urls, options = { preferLive: true, timeoutMs: 35000 }) {
  if (!urls || urls.length === 0) return [];
  const validUrls = urls.slice(0, 10);
  const cacheKey = { type: 'fetch', urls: validUrls };

  if (!options.preferLive) {
    const cached = getCached('fetch', cacheKey);
    if (cached) return cached;
  }

  try {
    // Timeout wrapper for network resiliency
    const fetchPromise = tinyfish.fetch.getContents({
      urls: validUrls,
      format: 'markdown'
    });

    const timeout = options.timeoutMs || 35000;
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('TinyFish Fetch timed out')), timeout);
    });

    const response = await Promise.race([fetchPromise, timeoutPromise]);
    
    const processed = (response.results || []).map((res) => ({
      url: res.url,
      title: res.title || 'Untitled Source',
      author: res.author,
      published_date: res.published_date,
      text: cleanMarkdown(res.text)
    }));

    setCached('fetch', cacheKey, processed);
    return processed;
  } catch (err) {
    console.error(`[TinyFish Fetch Error]: ${err.message}. Checking cache...`);
    const fallback = getCached('fetch', cacheKey);
    if (fallback) return fallback;
    console.warn(`[TinyFish Fetch] No cache found. Returning empty list.`);
    return [];
  }
}

/**
 * Tier 3: Autonomous Web Agent Escalation using paid API credits.
 * Streams real-time browser steps and live preview URL.
 */
export async function runAgentStream({ url, goal, proxyCountry = 'JP', onEvent }) {
  console.log(`[TinyFish Web Agent] Escalating to autonomous agent on: ${url}`);
  if (onEvent) {
    onEvent({
      type: 'AGENT_INIT',
      url,
      goal,
      proxyCountry,
      timestamp: new Date().toISOString()
    });
  }

  try {
    const stream = await tinyfish.agent.stream({
      url,
      goal,
      proxy_config: proxyCountry ? { enabled: true, country_code: proxyCountry } : undefined
    });

    let streamingUrl = null;
    let finalSummary = null;
    const progressSteps = [];

    for await (const event of stream) {
      if (event.type === 'STREAMING_URL') {
        streamingUrl = event.url;
        console.log(`[TinyFish Agent] Live browser preview: ${streamingUrl}`);
        if (onEvent) onEvent({ type: 'STREAMING_URL', streamingUrl });
      } else if (event.type === 'PROGRESS') {
        console.log(`[TinyFish Agent Step]: ${event.purpose}`);
        progressSteps.push(event.purpose);
        if (onEvent) onEvent({ type: 'PROGRESS', purpose: event.purpose, step: progressSteps.length });
      } else if (event.type === 'COMPLETE') {
        finalSummary = event.output || event.result;
        console.log(`[TinyFish Agent Completed]`);
        if (onEvent) onEvent({ type: 'COMPLETE', output: finalSummary });
      }
    }

    return {
      success: true,
      streamingUrl,
      steps: progressSteps,
      output: finalSummary
    };
  } catch (err) {
    console.error(`[TinyFish Agent Stream Error]: ${err.message}`);
    if (onEvent) {
      onEvent({
        type: 'AGENT_ERROR',
        error: err.message
      });
    }
    return {
      success: false,
      error: err.message
    };
  }
}
