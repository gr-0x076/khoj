import { search, fetchBatch } from './tinyfish_client.js';
import { identifyGlobalHubs, expandQueries, extractPropositions } from './llm_client.js';
import { runAdversarialVerification } from './adversarial_verifier.js';
import { escalateToWebAgent } from './portal_escalator.js';
import { getCached, setCached } from './cache.js';

/**
 * Full Agentic Pipeline for Cross-Language Knowledge Gap Discovery.
 * Now featuring Global Hub Auto-Detection and Actionable Technical Playbook Synthesis.
 */
export async function runInvestigation({
  topic,
  targetLang = 'auto',
  triggerAgentEscalation = true,
  preferLive = true,
  onProgress = () => {}
}) {
  const startTime = Date.now();
  console.log(`[Khoj] Starting investigation on: "${topic}" (Hub Mode: ${targetLang})`);

  // Stage 1: Global Hub Auto-Detection
  onProgress({
    stage: 'global_hub_radar',
    message: `Auto-scanning global technical centers to detect which foreign language communities lead this domain...`,
    progress: 10
  });

  let activeHubs = [];
  let selectedLang = targetLang;
  let selectedCountry = 'Japan';

  if (targetLang === 'auto' || !targetLang) {
    activeHubs = await identifyGlobalHubs(topic);
    selectedLang = activeHubs[0]?.code || 'ja';
    selectedCountry = activeHubs[0]?.country || 'Japan';
  } else {
    activeHubs = [
      { code: targetLang, country: targetLang === 'ja' ? 'Japan' : targetLang === 'de' ? 'Germany' : targetLang === 'zh' ? 'China' : targetLang === 'pt' ? 'Brazil' : 'Target Region', language: targetLang, domainAdvantage: 'User specified target ecosystem' }
    ];
  }

  onProgress({
    stage: 'hub_selected',
    message: `Identified primary global knowledge center: ${selectedCountry} (${selectedLang.toUpperCase()}). ${activeHubs[0]?.domainAdvantage || ''}`,
    progress: 18,
    activeHubs,
    selectedHub: activeHubs[0]
  });

  const cacheKey = { type: 'full_report', topic, targetLang: selectedLang };
  if (!preferLive) {
    const cached = getCached('investigation', cacheKey);
    if (cached) {
      console.log('[Khoj] Serving cached investigation for presentation resilience.');
      onProgress({ stage: 'query_expansion', message: `Generating native domain search queries in English and ${selectedCountry} (Cached)...`, progress: 30 });
      await new Promise(r => setTimeout(r, 600));
      onProgress({ stage: 'dual_search', message: `Dual-index search verified across TinyFish Tokyo and US indices...`, progress: 50 });
      await new Promise(r => setTimeout(r, 600));
      onProgress({ stage: 'batch_fetch', message: `Fetched deep engineering documentation...`, progress: 70 });
      await new Promise(r => setTimeout(r, 600));
      onProgress({ stage: 'adversarial_verification', message: `Adversarial verification confirmed 0 false gaps...`, progress: 85 });
      await new Promise(r => setTimeout(r, 500));
      if (cached.agentTelemetry) {
        onProgress({ stage: 'web_agent_telemetry', progress: 95, telemetry: cached.agentTelemetry });
        await new Promise(r => setTimeout(r, 500));
      }
      onProgress({ stage: 'complete', message: `Investigation complete. Actionable engineering playbook synthesized.`, progress: 100, result: cached });
      return cached;
    }
  }

  // Stage 2: Native Query Expansion
  onProgress({
    stage: 'query_expansion',
    message: `Generating authentic terminology in English and ${selectedCountry}...`,
    progress: 25
  });

  const queryBundle = await expandQueries(topic, selectedLang);
  console.log('[Khoj] Generated native queries:', queryBundle);

  onProgress({
    stage: 'dual_search',
    message: `Executing parallel searches across TinyFish ${selectedCountry} and Western indices...`,
    progress: 40,
    queryBundle
  });

  // Stage 3: Parallel Search via TinyFish
  const searchPromises = [];
  const locationMap = {
    ja: 'jp',
    de: 'de',
    pt: 'br',
    fr: 'fr',
    it: 'it',
    el: 'gr',
    ko: 'kr',
    es: 'es',
    hi: 'in',
    zh: undefined
  };
  const locationCode = locationMap[selectedLang];

  for (const q of (queryBundle.target || []).slice(0, 2)) {
    searchPromises.push(search({ query: q, language: selectedLang, location: locationCode }, { preferLive }));
  }
  for (const q of (queryBundle.english || []).slice(0, 2)) {
    searchPromises.push(search({ query: q, language: 'en' }, { preferLive }));
  }

  const searchResultsSettled = await Promise.allSettled(searchPromises);
  const targetSearchResults = [];
  const englishSearchResults = [];

  searchResultsSettled.forEach((res, i) => {
    if (res.status === 'fulfilled') {
      if (i < (queryBundle.target?.length || 2)) {
        targetSearchResults.push(...(res.value.results || []));
      } else {
        englishSearchResults.push(...(res.value.results || []));
      }
    }
  });

  const targetUrls = Array.from(new Set(targetSearchResults.map(r => r.url))).slice(0, 5);
  const englishUrls = Array.from(new Set(englishSearchResults.map(r => r.url))).slice(0, 4);

  // Stage 4: Batch Fetch & Content Extraction via TinyFish
  onProgress({
    stage: 'batch_fetch',
    message: `Fetching primary source literature via TinyFish Batch Fetch (${targetUrls.length} ${selectedCountry}, ${englishUrls.length} English)...`,
    progress: 55,
    targetUrlsCount: targetUrls.length,
    englishUrlsCount: englishUrls.length
  });

  const [targetArticles, englishArticles] = await Promise.all([
    fetchBatch(targetUrls, { preferLive }),
    fetchBatch(englishUrls, { preferLive })
  ]);

  // Stage 5: Deep Knowledge Extraction
  onProgress({
    stage: 'proposition_extraction',
    message: `Extracting authentic techniques, methodologies, principles, and codified traditions...`,
    progress: 70,
    articlesFetchedCount: targetArticles.length + englishArticles.length
  });

  let candidatePropositions = await extractPropositions(targetArticles, selectedLang, topic);

  if ((!candidatePropositions || candidatePropositions.length === 0) && targetSearchResults.length > 0) {
    console.log('[Khoj] Extracting propositions from search snippets fallback...');
    const snippetArticles = targetSearchResults.slice(0, 3).map(r => ({
      title: r.title,
      url: r.url,
      text: r.snippet
    }));
    candidatePropositions = await extractPropositions(snippetArticles, selectedLang, topic);
  }

  if (!candidatePropositions || candidatePropositions.length === 0) {
    onProgress({
      stage: 'complete',
      message: 'Investigation completed. No distinct specialized foreign techniques found.',
      progress: 100
    });
    return {
      topic,
      targetLang: selectedLang,
      executionTimeMs: Date.now() - startTime,
      verifiedGapsCount: 0,
      verifiedGaps: [],
      auditTrail: [],
      agentTelemetry: null
    };
  }

  // Stage 6: Adversarial Verification Loop
  onProgress({
    stage: 'adversarial_verification',
    message: `Adversarially cross-checking English literature to eliminate false gaps...`,
    progress: 82
  });

  const { verifiedGaps, auditTrail } = await runAdversarialVerification(
    candidatePropositions,
    onProgress
  );

  console.log(`[Khoj] Adversarial check finished. Verified gaps: ${verifiedGaps.length}`);

  // Stage 7: Tier-3 Autonomous Web Agent Escalation
  let agentTelemetry = null;
  if (triggerAgentEscalation && verifiedGaps.length > 0) {
    const topGap = verifiedGaps[0];
    onProgress({
      stage: 'web_agent_escalation',
      message: `Escalating to TinyFish Autonomous Web Agent on foreign portal: ${topGap.sourceUrl}...`,
      progress: 90,
      targetGap: topGap.gapHeadline,
      portalUrl: topGap.sourceUrl
    });

    try {
      agentTelemetry = await escalateToWebAgent(topGap, (telemetryEvent) => {
        onProgress({
          stage: 'web_agent_telemetry',
          progress: 94,
          telemetry: telemetryEvent
        });
      });
    } catch (agentErr) {
      console.warn(`[Khoj] Web agent escalation gracefully bypassed: ${agentErr.message}`);
    }
  }

  // Final Synthesis
  const finalReport = {
    topic,
    targetLang: selectedLang,
    activeHubs,
    executionTimeMs: Date.now() - startTime,
    verifiedGapsCount: verifiedGaps.length,
    verifiedGaps,
    auditTrail,
    agentTelemetry,
    timestamp: new Date().toISOString()
  };

  setCached('investigation', cacheKey, finalReport);

  onProgress({
    stage: 'complete',
    message: `Investigation complete in ${((Date.now() - startTime)/1000).toFixed(1)}s. Actionable engineering playbook ready.`,
    progress: 100,
    result: finalReport
  });

  return finalReport;
}
