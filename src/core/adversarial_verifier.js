import { search } from './tinyfish_client.js';
import { generateAdversarialQueries, classifyGap } from './llm_client.js';

/**
 * Fast Parallel Adversarial Verification Loop.
 * Capped to Top 3 candidates and executes parallel search batches to prevent latency explosion.
 */
export async function runAdversarialVerification(foreignPropositions, onStep = null, targetLang = "ja") {
  // Cap strictly to Top 2 most distinct candidates to prevent latency and token limits
  const topCandidates = (foreignPropositions || []).slice(0, 2);
  const auditTrail = [];

  if (onStep) {
    onStep({
      stage: 'adversarial_verification',
      message: `Auditing Top ${topCandidates.length} foreign candidates in parallel against English web...`,
      progress: 75
    });
  }

  // Process candidates in parallel using Promise.all
  const verifiedResults = await Promise.all(
    topCandidates.map(async (prop, index) => {
      // 1. Generate 2 targeted English counter-queries
      const counterQueries = await generateAdversarialQueries(prop);
      
      // 2. Parallel TinyFish search execution
      const searchPromises = counterQueries.slice(0, 2).map(q => 
        search({ query: q, language: 'en' }).catch(() => ({ results: [] }))
      );
      const searchResults = await Promise.all(searchPromises);
      
      const flatResults = searchResults.flatMap(s => s.results || []);
      // Deduplicate by URL
      const uniqueEnglish = Array.from(
        new Map(flatResults.map(r => [r.url, r])).values()
      ).slice(0, 4); // Top 4 snippets for semantic check

      // 3. Fast Semantic LLM Classification
      const classificationResult = await classifyGap(prop, uniqueEnglish);

      // 4. Record to Audit Trail
      const auditRecord = {
        candidateName: prop.name,
        sourceUrl: prop.sourceUrl,
        sourceLanguage: prop.sourceLanguage || targetLang || 'Foreign Hub',
        englishQueriesChecked: counterQueries,
        englishResultsFoundCount: uniqueEnglish.length,
        englishTopMatches: uniqueEnglish.map(e => ({ title: e.title, url: e.url, snippet: e.snippet })),
        outcome: classificationResult.classification,
        reasoning: classificationResult.auditReasoning,
        timestamp: new Date().toISOString()
      };

      return {
        ...classificationResult,
        candidateName: prop.name,
        originalQuote: prop.originalQuote,
        metricsOrStandards: prop.metricsOrStandards,
        sourceUrl: prop.sourceUrl,
        sourceTitle: prop.sourceTitle,
        auditRecord
      };
    })
  );

  verifiedResults.forEach(r => auditTrail.push(r.auditRecord));

  // Filter out SHARED_KNOWLEDGE
  const verifiedGaps = verifiedResults.filter(r => r.classification !== 'SHARED_KNOWLEDGE');

  return {
    verifiedGaps,
    auditTrail
  };
}
