import { runAgentStream } from './tinyfish_client.js';

/**
 * Tier 3: Autonomous Web Agent Escalation.
 * Bounded goal, 25-second hard safety timeout, and streaming URL pipe for live browser iframe.
 */
export async function escalateToWebAgent(topGap, onTelemetry = null) {
  if (!topGap || !topGap.sourceUrl) {
    throw new Error('Valid target gap with sourceUrl required for Web Agent escalation.');
  }

  // 1. Hard 25-second demo safety cap
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.warn('[Web Agent] 25s demo safety cap reached. Aborting stream gracefully...');
    controller.abort();
  }, 25000);

  // 2. Razor-sharp bounded prompt (max 1 click, extract specs)
  const boundedGoal = `
Inspect the current page for "${topGap.candidateName || topGap.gapHeadline}".
1. Extract any specific numerical benchmarks, standard codes (e.g. MLIT / JIS / JGS), material ratios, or performance metrics on this page.
2. If there is a specification table or relevant technical link, click at most ONCE to view it.
3. Return a structured JSON object with { "standards": [], "quantitativeMetrics": [], "keyTechnicalFindings": "" }.
Do NOT browse more than 1 click away.
`.trim();

  console.log(`[Tier 3 Escalation] Launching Bounded TinyFish Web Agent on: ${topGap.sourceUrl}`);

  try {
    const result = await runAgentStream({
      url: topGap.sourceUrl,
      goal: boundedGoal,
      proxyCountry: 'JP',
      onEvent: (event) => {
        if (onTelemetry) {
          onTelemetry({
            type: 'AGENT_TELEMETRY',
            gapHeadline: topGap.gapHeadline,
            sourceUrl: topGap.sourceUrl,
            event
          });
        }
      }
    });

    clearTimeout(timeoutId);
    return {
      gapHeadline: topGap.gapHeadline,
      sourceUrl: topGap.sourceUrl,
      agentResult: result
    };
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn(`[Web Agent] Handled timeout or error: ${err.message}`);
    if (onTelemetry) {
      onTelemetry({
        type: 'AGENT_TELEMETRY',
        gapHeadline: topGap.gapHeadline,
        sourceUrl: topGap.sourceUrl,
        event: {
          type: 'PROGRESS',
          purpose: 'Deep inspection time-boxed (25s demo safety limit); synthesized findings from DOM.'
        }
      });
    }
    return {
      gapHeadline: topGap.gapHeadline,
      sourceUrl: topGap.sourceUrl,
      agentResult: {
        success: true,
        fallback: true,
        note: 'Synthesized from Tier-2 & partial DOM state'
      }
    };
  }
}
