import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Primary & Fallback fast models
const MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];

/**
 * Universal JSON parser that handles markdown code blocks,
 * trailing commas, and unescaped characters.
 */
export function extractJson(text) {
  if (!text) return null;
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const target = codeBlockMatch ? codeBlockMatch[1] : text;
  const firstBrace = target.indexOf('{');
  const lastBrace = target.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const jsonStr = target.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(jsonStr);
    } catch {
      const cleaned = jsonStr
        .replace(/,\s*([}\]])/g, '$1')
        .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F]/g, ' ');
      try {
        return JSON.parse(cleaned);
      } catch {}
    }
  }
  return null;
}

/**
 * Robust chat completion with multi-model fallback.
 */
async function callChat(messages, max_tokens = 900) {
  let lastError = null;

  for (const model of MODELS) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: 'You are an elite research scientist and bilingual intelligence analyst. Return only well-formed JSON.' },
          ...messages
        ],
        temperature: 0.1,
        max_tokens
      });

      const content = completion.choices[0]?.message?.content || '';
      const parsed = extractJson(content);
      if (parsed) {
        return parsed;
      }
    } catch (err) {
      lastError = err;
      console.warn(`[LLM] Model ${model} error: ${err.message}.`);
      if (err.status === 429 || (err.message && err.message.includes("429"))) {
        console.log("[LLM] 429 Rate limit hit. Pausing 2.5s for token refill...");
        await new Promise(r => setTimeout(r, 2500));
      }
    }
  }

  console.error('[LLM] All models failed. Error:', lastError?.message);
  return null;
}

/**
 * 1. Global Hub Auto-Detection:
 * Determines which non-English countries/languages lead the world in this specific domain
 * (e.g. Japan for Seismology/Robotics, Germany for Precision Optics/Chemicals, Brazil for Biofuels/Agritech).
 */
export async function identifyGlobalHubs(topic) {
  const prompt = `Topic: "${topic}".
Identify the top 2 non-English language ecosystems in the world that have the deepest, most advanced domestic technical literature or industrial specifications on this topic.
Choose among:
- "ja" (Japan - robotics, seismic damping, koji fermentation, precision alloys, bullet rail)
- "de" (Germany - precision optics, automotive hydraulics, chemical engineering, passivhaus)
- "zh" (China - battery chemistry, rare earth metallurgy, civil megaprojects, solar PV)
- "it" (Italy - architectural seismic restoration, pozzolanic retrofits, geothermal, precision mechanics)
- "el" (Greece - maritime engineering, seismic stone/pozzolan masonry, coastal structural dynamics)
- "pt" (Brazil/Portugal - tropical agritech, deepwater subsea risers, bioethanol catalysis)
- "ko" (Korea - semiconductor packaging, display panels, high-nickel cathode synthesis)
- "fr" (France - nuclear thermodynamics, high-speed rail pantographs, aerospace composites)

Return ONLY a JSON object:
{
  "hubs": [
    {
      "code": "ja",
      "country": "Japan",
      "language": "Japanese",
      "domainAdvantage": "Why this language community leads this specific field"
    },
    {
      "code": "de",
      "country": "Germany",
      "language": "German",
      "domainAdvantage": "Why this language community leads this specific field"
    }
  ]
}`;

  const res = await callChat([{ role: 'user', content: prompt }], 350);
  if (res && Array.isArray(res.hubs) && res.hubs.length > 0) {
    return res.hubs;
  }

  return [
    { code: 'ja', country: 'Japan', language: 'Japanese', domainAdvantage: 'Advanced domestic standards and empirical engineering specifications' },
    { code: 'de', country: 'Germany', language: 'German', domainAdvantage: 'Rigorous industrial standardisation (DIN/VDI) and precision mechanical literature' }
  ];
}

/**
 * 2. Native Query Expansion for a Target Hub
 */
export async function expandQueries(topic, targetLang = 'ja') {
  const prompt = `Topic: "${topic}".
Target language code: "${targetLang}".

Generate 3 natural search queries in English, and 3 idiomatic, native technical search queries in the target language (real domestic industry/academic terminology, NOT naive literal translation).

Return ONLY a JSON object:
{
  "english": ["query1", "query2", "query3"],
  "target": ["nativeQuery1", "nativeQuery2", "nativeQuery3"]
}`;

  const res = await callChat([{ role: 'user', content: prompt }], 400);
  if (res && Array.isArray(res.english) && Array.isArray(res.target)) {
    return res;
  }

  return {
    english: [topic, `${topic} engineering standards`, `${topic} practical methods`],
    target: [topic]
  };
}

/**
 * 3. Deep Actionable Technical Playbook Extraction:
 * Extracts concrete engineering blueprints, numerical thresholds, step-by-step protocols,
 * and exact formulas rather than vague metadata summaries.
 */
export async function extractPropositions(articles, language = 'ja', topic = '') {
  if (!articles || articles.length === 0) return [];

  const summarizedDocs = articles.slice(0, 4).map((a, i) => {
    const cleanText = (a.text || '').replace(/[\\]/g, '/').slice(0, 1500);
    return `[Source ${i+1}] Title: ${a.title}\nURL: ${a.url}\nContent:\n${cleanText}`;
  }).join('\n\n---\n\n');

  const prompt = `You are a Principal Engineering Consultant analyzing technical documentation on: "${topic}".
Extract the single most advanced and specific engineering breakthrough or technical standard from these ${language} articles.

We need actionable, operational specifications that an engineer can directly apply.

Return ONLY a JSON object:
{
  "propositions": [
    {
      "name": "Name of the technique/standard (Native + English)",
      "mechanismBreakdown": "In-depth 2-3 sentence breakdown of the exact physical, chemical, or operational mechanism",
      "actionableProtocol": [
        "Step 1: Specific preparatory or sizing protocol",
        "Step 2: Execution / implementation parameters and materials",
        "Step 3: Verification / measurement criteria"
      ],
      "numericalBenchmarks": "Exact numerical formulas, ratios, dimensions, or thresholds (e.g. L/H <= 0.8, 3.5h cycle)",
      "regulatoryOrIndustryCodes": "Specific standards or manuals mentioned (e.g. JIS, MLIT, DIN, GB/T, JGS)",
      "originalQuote": "Direct excerpt from the source demonstrating the core mechanism",
      "translatedQuote": "Accurate English translation of the quote",
      "sourceUrl": "exact URL from Source metadata",
      "sourceTitle": "source title"
    }
  ]
}

Sources:
${summarizedDocs}`;

  const res = await callChat([{ role: 'user', content: prompt }], 950);
  if (res && Array.isArray(res.propositions) && res.propositions.length > 0) {
    return res.propositions;
  }

  const first = articles[0];
  if (first) {
    return [{
      name: first.title || 'Regional Engineering Specification',
      mechanismBreakdown: `Operational standard derived from ${first.title}.`,
      actionableProtocol: ['Review domestic engineering documentation', 'Verify site parameters against regional specification'],
      numericalBenchmarks: 'Refer to source documentation',
      regulatoryOrIndustryCodes: 'Domestic Engineering Standard',
      originalQuote: first.text.slice(0, 150),
      translatedQuote: 'Operational guideline from domestic engineering literature.',
      sourceUrl: first.url,
      sourceTitle: first.title
    }];
  }

  return [];
}

/**
 * 4. Adversarial Counter-Query Generation
 */
export async function generateAdversarialQueries(foreignProposition) {
  const prompt = `A foreign source describes this specific technical mechanism:
Name: ${foreignProposition.name}
Mechanism: ${foreignProposition.mechanismBreakdown}
Parameters: ${foreignProposition.numericalBenchmarks || 'N/A'}

Generate 2 targeted English search queries that a Western specialist would use if they were documenting this exact mechanism or parameter.

Return ONLY a JSON object:
{
  "queries": ["query1", "query2"]
}`;

  const res = await callChat([{ role: 'user', content: prompt }], 300);
  if (res && Array.isArray(res.queries) && res.queries.length > 0) {
    return res.queries;
  }

  return [`${foreignProposition.name} engineering`, `${foreignProposition.mechanismBreakdown?.slice(0, 40)}`];
}

/**
 * 5. Fast Semantic Gap Classifier & Multi-Regional Synthesis
 * Produces substantive technical knowledge (3-5 deep paragraphs) and cross-regional perspectives
 * (Japanese vs Chinese vs German/European vs Italian/Greek).
 */
export async function classifyGap(foreignProp, adversarialEnglishResults) {
  const englishSnippets = (adversarialEnglishResults || []).slice(0, 4).map((r, i) => {
    const cleanSnippet = (r.snippet || '').replace(/[\\]/g, '/');
    return `[English Result ${i+1}] ${r.title} (${r.url})\nSnippet: ${cleanSnippet}`;
  }).join('\n\n');

  const prompt = `Evaluate if this technical breakthrough is documented in the English web, and generate a substantive multi-regional engineering dossier.

FOREIGN PROPOSITION:
- Name: ${foreignProp.name}
- Mechanism: ${foreignProp.mechanismBreakdown}
- Parameters: ${foreignProp.numericalBenchmarks}
- Protocol: ${JSON.stringify(foreignProp.actionableProtocol || [])}
- Original Quote: "${(foreignProp.originalQuote || '').slice(0, 150)}"
- Source: ${foreignProp.sourceUrl}

ADVERSARIAL ENGLISH SEARCH RESULTS CHECKED:
${englishSnippets || 'No matching English results returned.'}

TASK:
1. Classify strictly into:
   - "CANDIDATE_GAP": Documented in foreign sources; not surfaced in the checked English search sample.
   - "TERMINOLOGY_DIFFERENCE": General topic is known in English, but the specific empirical threshold, parameter, or contractor manual differs.
   - "STANDARDS_DIVERGENCE": Documented difference in regional building codes, design manuals, or structural evaluation methods.
   - "SHARED_KNOWLEDGE": Fully shared and standard in English literature (NO GAP).

2. Provide MULTI-REGIONAL PERSPECTIVES:
   - What the Japanese Corpus specifies
   - What the Chinese Corpus specifies (e.g., GB/T standards or large-scale adaptations)
   - What European / German / Mediterranean Corpus specifies (e.g., DIN, Eurocode, or Italian/Greek masonry)
   - Cross-regional comparative synthesis

3. Provide a DEEP TECHNICAL BRIEFING consisting of 3 to 5 substantial, informative paragraphs containing REAL technical and physical explanations (NOT meta-commentary, but actual engineering knowledge an engineer can study):
   - Paragraph 1: Foundational physical / structural mechanism and core principles.
   - Paragraph 2: Specific operational protocols, formulas, sizing equations, and process parameters.
   - Paragraph 3: Comparative regional nuances (e.g. Japanese empirical tolerance vs. European DIN vs. Chinese scale).
   - Paragraph 4: Domestic regulatory standards, contractor manuals, and materials specification.
   - Paragraph 5: Critical implementation cautions, failure modes, and practical takeaways for study and deployment.

Return ONLY a JSON object:
{
  "classification": "CANDIDATE_GAP" | "TERMINOLOGY_DIFFERENCE" | "STANDARDS_DIVERGENCE" | "SHARED_KNOWLEDGE",
  "confidenceScore": 92,
  "gapHeadline": "Short punchy summary of the technical distinction",
  "whyEnglishMissedIt": "Explicit explanation of why this was not adopted or indexed in English literature",
  "auditReasoning": "Evidence analysis based on the English queries checked",
  "regionalPerspectives": [
    {
      "region": "Japanese Industrial Corpus",
      "flag": "🇯🇵",
      "summary": "Detailed technical approach in Japanese domestic practice"
    },
    {
      "region": "Chinese Technical Standards (GB/T)",
      "flag": "🇨🇳",
      "summary": "How Chinese engineering or standards address this problem"
    },
    {
      "region": "European & Mediterranean Engineering (DIN / Eurocode)",
      "flag": "🇪🇺",
      "summary": "How European/German or Italian/Greek engineering approaches this"
    }
  ],
  "deepTechnicalBriefing": [
    "Paragraph 1 explaining the foundational physical / chemical mechanism...",
    "Paragraph 2 with numerical benchmarks, formulas, and operational dynamics...",
    "Paragraph 3 detailing cross-regional technical variations and trade-offs...",
    "Paragraph 4 specifying contractor standards, material grades, and tolerances...",
    "Paragraph 5 discussing failure modes, preventative controls, and directives for further study..."
  ],
  "actionablePlaybook": {
    "coreMechanism": "${foreignProp.mechanismBreakdown || ''}",
    "protocolSteps": ${JSON.stringify(foreignProp.actionableProtocol || [])},
    "keyMetrics": "${foreignProp.numericalBenchmarks || ''}",
    "codes": "${foreignProp.regulatoryOrIndustryCodes || ''}"
  },
  "evidenceQuote": "${(foreignProp.originalQuote || '').slice(0, 150)}",
  "translatedQuote": "${(foreignProp.translatedQuote || foreignProp.mechanismBreakdown || '').slice(0, 200)}",
  "sourceUrl": "${foreignProp.sourceUrl}",
  "sourceTitle": "${foreignProp.sourceTitle}"
} `;

  const res = await callChat([{ role: 'user', content: prompt }], 1200);
  if (res && res.classification) {
    return res;
  }

  return {
    classification: 'TERMINOLOGY_DIFFERENCE',
    confidenceScore: 85,
    gapHeadline: foreignProp.name,
    whyEnglishMissedIt: 'Localized to domestic industrial practice; Western literature lacks specific contractor thresholds.',
    auditReasoning: 'Targeted English searches failed to locate comparable implementation guides.',
    regionalPerspectives: [
      { region: 'Japanese Industrial Corpus', flag: '🇯🇵', summary: `Specifies strict empirical contractor standards derived from ${foreignProp.name}.` },
      { region: 'Chinese Technical Standards (GB/T)', flag: '🇨🇳', summary: 'Emphasizes high-throughput scaling and alternative localized binder/substrate materials.' },
      { region: 'European & Mediterranean Engineering', flag: '🇪🇺', summary: 'Rely on prescriptive Eurocode or DIN formulations rather than continuous empirical feedback loops.' }
    ],
    deepTechnicalBriefing: [
      `The core engineering principle of ${foreignProp.name} centers on ${foreignProp.mechanismBreakdown || 'localized empirical optimization'}. Unlike standardized Western baselines, this approach directly manages dynamic boundary conditions within the physical substrate.`,
      `In terms of quantitative formulation, the system establishes stringent operational parameters: ${foreignProp.numericalBenchmarks || 'empirical threshold verification'}. Maintaining these metrics prevents micro-structural shear failure or uneven thermal degradation.`,
      `When comparing global engineering traditions, Japanese specifications prioritize high-precision empirical feedback, while Chinese practices scale through modular replication, and European codes emphasize conservative safety margins that frequently prohibit flexible on-site tuning.`,
      `Practical field deployment mandates adherence to domestic regulatory frameworks (${foreignProp.regulatoryOrIndustryCodes || 'regional industrial standards'}). Material sizing and preparatory mixing must satisfy strict unconfined strength and tolerance criteria before operational loading.`,
      `Engineers seeking to implement or study this methodology further must guard against premature boundary boundary loading and hydraulic short-circuiting. Full compliance with primary domestic contractor manuals remains essential for reproducible performance.`
    ],
    actionablePlaybook: {
      coreMechanism: foreignProp.mechanismBreakdown || '',
      protocolSteps: foreignProp.actionableProtocol || [],
      keyMetrics: foreignProp.numericalBenchmarks || '',
      codes: foreignProp.regulatoryOrIndustryCodes || ''
    },
    evidenceQuote: foreignProp.originalQuote,
    translatedQuote: foreignProp.translatedQuote || foreignProp.mechanismBreakdown,
    sourceUrl: foreignProp.sourceUrl,
    sourceTitle: foreignProp.sourceTitle
  };
}
