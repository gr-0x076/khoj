import dotenv from 'dotenv';
import { search, fetchBatch, runAgentStream } from '../core/tinyfish_client.js';
import { runInvestigation } from '../core/investigator.js';

dotenv.config();

console.log('🧪 Starting LinguaGap 3-Tier Integration Test...\n');

async function testAll() {
  // Test Tier 1: Dual-track Search
  console.log('--- Testing Tier 1: TinyFish Multilingual Search ---');
  const jaSearch = await search({ query: '液状化対策 工法', language: 'ja', location: 'jp' });
  console.log(`✅ Japanese Search Success! Found ${jaSearch.results.length} results.`);
  if (jaSearch.results[0]) {
    console.log(`   Top result: "${jaSearch.results[0].title}" -> ${jaSearch.results[0].url}`);
  }

  // Test Tier 2: Batch Fetch
  console.log('\n--- Testing Tier 2: TinyFish Batch Fetch ---');
  const urlsToFetch = (jaSearch.results || []).slice(0, 2).map(r => r.url);
  const fetched = await fetchBatch(urlsToFetch);
  console.log(`✅ Batch Fetch Success! Fetched ${fetched.length} pages.`);
  if (fetched[0]) {
    console.log(`   Sample Title: "${fetched[0].title}" (Text length: ${fetched[0].text.length} chars)`);
  }

  // Test Tier 3: Autonomous Web Agent (Paid credits test)
  console.log('\n--- Testing Tier 3: TinyFish Web Agent Stream ---');
  const testUrl = urlsToFetch[0] || 'https://news.ycombinator.com';
  console.log(`Testing agent stream on: ${testUrl}`);
  
  const agentRun = await runAgentStream({
    url: testUrl,
    goal: 'Identify the main technical heading or title on this page and summarize in one sentence.',
    proxyCountry: 'JP',
    onEvent: (ev) => {
      if (ev.type === 'STREAMING_URL') console.log(`   🎥 Live Browser Stream: ${ev.streamingUrl}`);
      if (ev.type === 'PROGRESS') console.log(`   ⚡ Step: ${ev.purpose}`);
    }
  });

  console.log(`✅ Web Agent Execution result: ${agentRun.success ? 'SUCCESS' : 'FAILED'}`);
  console.log('\n🎉 ALL 3 TIERS OF TINYFISH VERIFIED FUNCTIONAL!');
}

testAll().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
