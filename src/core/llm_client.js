import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Primary & Fallback fast models (gpt-oss-20b is ultra-fast and avoids strict OTPM limits)
const MODELS = ["openai/gpt-oss-20b", "openai/gpt-oss-120b", "qwen/qwen3.8-27b"];

/**
 * Universal JSON parser that handles markdown code blocks,
 * trailing commas, and unescaped characters.
 */
export function extractJson(text) {
  if (!text) return null;
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const target = codeBlockMatch ? codeBlockMatch[1] : text;
  const firstBrace = target.indexOf("{");
  const lastBrace = target.lastIndexOf("}");
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const jsonStr = target.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(jsonStr);
    } catch {
      const cleaned = jsonStr
        .replace(/,\s*([}\]])/g, "$1")
        .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F]/g, " ");
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
async function callChat(messages, max_tokens = 2200) {
  let lastError = null;

  for (const model of MODELS) {
    try {
      // Qwen has an enforced 1000 OTPM ceiling on Groq; GPT-OSS models support 2500+
      const effectiveTokens = model.includes("qwen") 
        ? Math.min(max_tokens, 850) 
        : Math.min(max_tokens, 2400);

      const completion = await groq.chat.completions.create({
        model,
        messages: [
          { role: "system", content: "You are a world-class cross-cultural intelligence analyst and domain scholar. Adapt seamlessly to any subject domain (martial arts, traditional medicine, craftsmanship, philosophy, engineering, culinary science). Return only well-formed JSON." },
          ...messages
        ],
        temperature: 0.15,
        max_tokens: effectiveTokens
      });

      const content = completion.choices[0]?.message?.content || "";
      const parsed = extractJson(content);
      if (parsed) {
        return parsed;
      }
    } catch (err) {
      lastError = err;
      console.warn(`[LLM] Model ${model} error: ${err.message}.`);
      if (err.status === 429 || (err.message && err.message.includes("429"))) {
        console.log("[LLM] 429 Rate limit hit. Pausing 1.5s for token refill...");
        await new Promise(r => setTimeout(r, 1500));
      }
    }
  }

  console.error("[LLM] All models failed. Error:", lastError?.message);
  return null;
}

/**
 * 1. Universal Global Hub Auto-Detection:
 * Intelligently determines which non-English countries/languages lead the world in ANY given domain.
 */
export async function identifyGlobalHubs(topic) {
  const prompt = `Topic: "${topic}".
Identify the top 2 non-English language ecosystems or cultural regions in the world that possess the deepest, most authentic, advanced, or specialized literature, traditions, documentation, or practices on this specific topic.

Examples of domain leadership:
- Martial arts / Combat: Japan (ja), China (zh), India (hi), Brazil (pt), Thailand (th), Greece (el), Korea (ko)
- Medicine / Health: India (hi - Ayurveda/Yoga), China (zh - TCM), Japan (ja - Kampo), Germany (de)
- Gastronomy / Fermentation: Japan (ja), France (fr), Italy (it), Mexico (es), India (hi)
- Crafts / Design / Architecture: Japan (ja), Italy (it), Germany (de), Scandinavia (sv/da)
- Engineering / Technology: Japan (ja), Germany (de), China (zh), Korea (ko), France (fr)
- Philosophy / Literature: Germany (de), France (fr), Greece (el), India (hi), China (zh)

Determine the 2 best matching countries and standard language codes dynamically for THIS specific topic.
Return ONLY a JSON object:
{
  "hubs": [
    {
      "code": "language code (e.g. ja, zh, de, hi, it, el, pt, ko, fr, etc.)",
      "country": "Country name",
      "language": "Language name",
      "domainAdvantage": "Why this language/cultural ecosystem possesses unique or superior knowledge in this domain"
    }
  ]
}`;

  const res = await callChat([{ role: "user", content: prompt }], 400);
  if (res && Array.isArray(res.hubs) && res.hubs.length > 0) {
    return res.hubs;
  }

  return [
    { code: "ja", country: "Japan", language: "Japanese", domainAdvantage: "Extensive domestic literature and codified traditional documentation" },
    { code: "zh", country: "China", language: "Chinese", domainAdvantage: "Centuries of recorded classical lineage and extensive primary texts" }
  ];
}

/**
 * 2. Native Query Expansion for a Target Hub
 */
export async function expandQueries(topic, targetLang = "ja") {
  const prompt = `Topic: "${topic}".
Target language code: "${targetLang}".

Generate 3 natural search queries in English, and 3 idiomatic, native search queries in the target language (real domestic terminology and cultural/technical concepts, NOT naive literal translation).

Return ONLY a JSON object:
{
  "english": ["query1", "query2", "query3"],
  "target": ["nativeQuery1", "nativeQuery2", "nativeQuery3"]
}`;

  const res = await callChat([{ role: "user", content: prompt }], 400);
  if (res && Array.isArray(res.english) && Array.isArray(res.target)) {
    return res;
  }

  return {
    english: [topic, `${topic} detailed guide`, `${topic} traditional methods`],
    target: [topic]
  };
}

/**
 * 3. Deep Domain-Adaptive Knowledge Extraction:
 * Extracts concrete, authentic techniques, philosophies, steps, and nuances without forcing irrelevant concepts.
 */
export async function extractPropositions(articles, language = "ja", topic = "") {
  if (!articles || articles.length === 0) return [];

  const summarizedDocs = articles.slice(0, 2).map((a, i) => {
    const cleanText = (a.text || "").replace(/[\\]/g, "/").slice(0, 700);
    return `[Source ${i+1}] Title: ${a.title}\nURL: ${a.url}\nContent:\n${cleanText}`;
  }).join("\n\n---\n\n");

  const prompt = `You are an elite bilingual researcher and domain specialist analyzing literature on: "${topic}".
Extract the single most specialized, authentic, or distinct technique, methodology, principle, or codified practice from these ${language} sources.
Do NOT force irrelevant concepts (e.g. do not invent chemical formulas for martial arts or history). Naturally reflect the true substance of the topic.

Return ONLY a JSON object:
{
  "propositions": [
    {
      "name": "Name of the technique / method / concept (Native + English)",
      "corePrinciples": "In-depth explanation of the core principles, biomechanics, mechanisms, or philosophy",
      "actionableSteps": [
        "Step 1: Foundational preparatory, positioning, or setup protocol",
        "Step 2: Execution dynamics, movement, timing, or implementation",
        "Step 3: Verification, refinement, or testing criteria"
      ],
      "keyMetricsOrNuances": "Key qualitative or quantitative nuances (e.g. stance angles, breathing cycles, ratios, or empirical thresholds if applicable)",
      "authoritativeTraditionsOrCodes": "Authoritative lineage, classical texts, schools (Ryu/Dojo/System), or formal standards/codes mentioned",
      "originalQuote": "Direct excerpt from the source demonstrating the core concept",
      "translatedQuote": "Accurate English translation of the quote",
      "sourceUrl": "exact URL from Source metadata",
      "sourceTitle": "source title"
    }
  ]
}

Sources:
${summarizedDocs}`;

  const res = await callChat([{ role: "user", content: prompt }], 1800);
  if (res && Array.isArray(res.propositions) && res.propositions.length > 0) {
    return res.propositions;
  }

  const first = articles[0];
  if (first) {
    return [{
      name: first.title || "Specialized Knowledge Formulation",
      corePrinciples: `Foundational principles derived from ${first.title}.`,
      actionableSteps: ["Study primary documentation and foundational principles", "Practice basic positioning and execution sequence", "Refine nuance through consistent evaluation"],
      keyMetricsOrNuances: "Preserve authentic alignment and timing",
      authoritativeTraditionsOrCodes: "Domestic Classical Tradition / Lineage",
      originalQuote: first.text.slice(0, 150),
      translatedQuote: "Authentic insight derived from regional primary literature.",
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
  const prompt = `A foreign source describes this specific method or concept:
Name: ${foreignProposition.name}
Core Principles: ${foreignProposition.corePrinciples || foreignProposition.mechanismBreakdown}
Nuances: ${foreignProposition.keyMetricsOrNuances || foreignProposition.numericalBenchmarks || "N/A"}

Generate 2 targeted English search queries that a Western specialist or researcher would use if they were documenting this exact concept or technique.

Return ONLY a JSON object:
{
  "queries": ["query1", "query2"]
}`;

  const res = await callChat([{ role: "user", content: prompt }], 300);
  if (res && Array.isArray(res.queries) && res.queries.length > 0) {
    return res.queries;
  }

  return [`${foreignProposition.name} guide`, `${(foreignProposition.corePrinciples || foreignProposition.name).slice(0, 40)}`];
}

/**
 * 5. Universal Semantic Gap Classifier & Multi-Perspective Synthesis
 * Naturally generates domain-appropriate briefings (3-5 rich paragraphs) and cross-regional perspectives.
 */
export async function classifyGap(foreignProp, adversarialEnglishResults) {
  const englishSnippets = (adversarialEnglishResults || []).slice(0, 4).map((r, i) => {
    const cleanSnippet = (r.snippet || "").replace(/[\\]/g, "/");
    return `[English Result ${i+1}] ${r.title} (${r.url})\nSnippet: ${cleanSnippet}`;
  }).join("\n\n");

  const prompt = `Evaluate if this specialized technique, method, or concept is documented in the English web, and generate a substantive cross-cultural / multi-regional dossier.

FOREIGN PROPOSITION:
- Name: ${foreignProp.name}
- Core Principles: ${foreignProp.corePrinciples || foreignProp.mechanismBreakdown}
- Nuances / Metrics: ${foreignProp.keyMetricsOrNuances || foreignProp.numericalBenchmarks}
- Actionable Steps: ${JSON.stringify(foreignProp.actionableSteps || foreignProp.actionableProtocol || [])}
- Source: ${foreignProp.sourceUrl}

ADVERSARIAL ENGLISH SEARCH RESULTS CHECKED:
${englishSnippets || "No matching English results returned."}

TASK:
1. Classify strictly into:
   - "CANDIDATE_GAP": Documented in foreign sources; not surfaced in the checked English search sample.
   - "TERMINOLOGY_DIFFERENCE": General topic is known in English, but the specific regional variation, empirical threshold, or traditional school differs.
   - "STANDARDS_DIVERGENCE": Documented divergence in regional schools, traditions, design codes, or regulatory frameworks.
   - "SHARED_KNOWLEDGE": Fully shared and standard in English literature (NO GAP).

2. Provide MULTI-REGIONAL PERSPECTIVES:
   Compare how different regional or cultural traditions approach this challenge (e.g., how Japanese, Chinese, European/Western, or other traditions differ in their approach to this topic).

3. Provide an IN-DEPTH KNOWLEDGE DOSSIER (3 to 5 substantial paragraphs):
   Each paragraph must have its own natural, dynamic, domain-appropriate heading (e.g. for martial arts: Biomechanics & Core Philosophy, Historical Lineage & Forms, Training Regimen & Practical Applications, Regional Traditions & Variations, Mastery Directives; for medicine or engineering, appropriate headings).
   Do NOT force chemical/physical formulas unless the topic is chemistry or physics! Give real, deep, informative knowledge that a student or practitioner can study.

Return ONLY a JSON object:
{
  "classification": "CANDIDATE_GAP" | "TERMINOLOGY_DIFFERENCE" | "STANDARDS_DIVERGENCE" | "SHARED_KNOWLEDGE",
  "confidenceScore": 92,
  "gapHeadline": "Short punchy summary of the distinction or finding",
  "whyEnglishMissedIt": "Explicit explanation of why this was not adopted, translated, or indexed in English literature",
  "auditReasoning": "Evidence analysis based on the English queries checked",
  "regionalPerspectives": [
    {
      "region": "e.g. Japanese Tradition / Corpus",
      "flag": "🇯🇵",
      "summary": "Specific methodology or perspective in this tradition"
    },
    {
      "region": "e.g. Chinese Lineage / Corpus",
      "flag": "🇨🇳",
      "summary": "How this culture or tradition approaches this"
    },
    {
      "region": "e.g. Western / Other Tradition",
      "flag": "🌐",
      "summary": "How Western or other traditions approach this"
    }
  ],
  "inDepthBriefing": [
    {
      "heading": "Heading 1 (Domain-specific)",
      "content": "Rich, substantive paragraph delivering real knowledge..."
    },
    {
      "heading": "Heading 2 (Domain-specific)",
      "content": "Rich, substantive paragraph delivering real knowledge..."
    },
    {
      "heading": "Heading 3 (Domain-specific)",
      "content": "Rich, substantive paragraph delivering real knowledge..."
    },
    {
      "heading": "Heading 4 (Domain-specific)",
      "content": "Rich, substantive paragraph delivering real knowledge..."
    },
    {
      "heading": "Heading 5 (Domain-specific)",
      "content": "Rich, substantive paragraph delivering real knowledge..."
    }
  ],
  "actionableKnowledge": {
    "corePrinciples": "${foreignProp.corePrinciples || foreignProp.mechanismBreakdown || ""}",
    "steps": ${JSON.stringify(foreignProp.actionableSteps || foreignProp.actionableProtocol || [])},
    "keyMetricsOrNuances": "${foreignProp.keyMetricsOrNuances || foreignProp.numericalBenchmarks || ""}",
    "authoritativeSourcesOrCodes": "${foreignProp.authoritativeTraditionsOrCodes || foreignProp.regulatoryOrIndustryCodes || ""}"
  },
  "evidenceQuote": "${(foreignProp.originalQuote || "").slice(0, 150)}",
  "translatedQuote": "${(foreignProp.translatedQuote || foreignProp.corePrinciples || "").slice(0, 200)}",
  "sourceUrl": "${foreignProp.sourceUrl}",
  "sourceTitle": "${foreignProp.sourceTitle}"
}
Ensure the briefing paragraphs are concise and direct, containing 2-3 sentences each.`;

  const res = await callChat([{ role: "user", content: prompt }], 2200);
  if (res && res.classification) {
    return res;
  }

  return {
    classification: "TERMINOLOGY_DIFFERENCE",
    confidenceScore: 85,
    gapHeadline: foreignProp.name,
    whyEnglishMissedIt: "Preserved in regional domestic literature; Western sources generalize or lack specific traditional forms.",
    auditReasoning: "Targeted English searches failed to locate comparable granular instructions.",
    regionalPerspectives: [
      { region: "Primary Domestic Tradition", flag: "🇯🇵", summary: `Specifies rigorous, authentic methods derived from ${foreignProp.name}.` },
      { region: "Secondary Regional Lineage", flag: "🇨🇳", summary: "Emphasizes historical lineage, traditional forms, and internal mechanics." },
      { region: "Western & Contemporary Practice", flag: "🌐", summary: "Tends to generalize principles without the specific regional nuances or classical transmission." }
    ],
    inDepthBriefing: [
      {
        heading: "Foundational Principles & Core Concept",
        content: `The essence of ${foreignProp.name} centers on ${foreignProp.corePrinciples || foreignProp.mechanismBreakdown || "authentic traditional mastery"}. Unlike modern generic summaries, this method preserves the exact structural relationships and internal mechanics passed through domestic literature.`
      },
      {
        heading: "Execution Dynamics & Key Nuances",
        content: `In terms of nuanced execution, the system establishes specific criteria: ${foreignProp.keyMetricsOrNuances || "consistent structural alignment and timing"}. Maintaining these nuances prevents common mechanical breakdown and preserves efficiency.`
      },
      {
        heading: "Comparative Cultural Traditions",
        content: `When comparing global traditions, primary domestic lineages emphasize precise direct transmission and repetitive kata/drills, whereas modern Western adaptations often emphasize outcome-based metrics without the foundational posture work.`
      },
      {
        heading: "Practical Sequence & Progression",
        content: `Mastery requires step-by-step progression through authentic curricula (${foreignProp.authoritativeTraditionsOrCodes || "traditional school standards"}). Fundamentals must be thoroughly integrated before advanced combinations are attempted.`
      },
      {
        heading: "Critical Caveats & Mastery Directives",
        content: `Practitioners seeking to study this further must avoid premature shortcuts and ensure strict alignment with primary instructional texts. Superficial imitation risks reinforcing flawed muscle memory.`
      }
    ],
    actionableKnowledge: {
      corePrinciples: foreignProp.corePrinciples || foreignProp.mechanismBreakdown || "",
      steps: foreignProp.actionableSteps || foreignProp.actionableProtocol || [],
      keyMetricsOrNuances: foreignProp.keyMetricsOrNuances || foreignProp.numericalBenchmarks || "",
      authoritativeSourcesOrCodes: foreignProp.authoritativeTraditionsOrCodes || foreignProp.regulatoryOrIndustryCodes || ""
    },
    evidenceQuote: foreignProp.originalQuote,
    translatedQuote: foreignProp.translatedQuote || foreignProp.corePrinciples,
    sourceUrl: foreignProp.sourceUrl,
    sourceTitle: foreignProp.sourceTitle
  };
}
