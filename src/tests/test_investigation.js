import dotenv from 'dotenv';
import { runInvestigation } from '../core/investigator.js';

dotenv.config();

console.log('🚀 Running End-to-End Investigation on Golden Demo 1...\n');

async function run() {
  const result = await runInvestigation({
    topic: 'Soil liquefaction grid-form deep mixing countermeasures',
    targetLang: 'ja',
    triggerAgentEscalation: true,
    preferLive: true,
    onProgress: (p) => {
      console.log(`[Stage: ${p.stage} (${p.progress}%)]: ${p.message || ''}`);
    }
  });

  console.log('\n================ INVESTIGATION RESULT ================');
  console.log(`Topic: ${result.topic}`);
  console.log(`Execution Time: ${(result.executionTimeMs / 1000).toFixed(1)}s`);
  console.log(`Verified Gaps Count: ${result.verifiedGapsCount}`);
  
  result.verifiedGaps.forEach((gap, i) => {
    console.log(`\n[Gap #${i+1}] ${gap.classification}: ${gap.gapHeadline}`);
    console.log(`  Mechanism: ${gap.mechanismBreakdown?.slice(0, 150)}...`);
    console.log(`  Source: ${gap.sourceTitle} (${gap.sourceUrl})`);
    console.log(`  Original Japanese: "${gap.evidenceQuote?.slice(0, 80)}..."`);
    console.log(`  Audit checked: ${gap.auditRecord?.englishQueriesChecked?.length} English queries`);
  });

  console.log(`\nAudit Ledger entries count: ${result.auditTrail.length}`);
}

run().catch(console.error);
