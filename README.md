# 🧭 Khoj (खोज) — Autonomous Cross-Language Knowledge & Insight Radar

> **"Unearthing what the world has already solved."**  
> *Khoj (Hindi for "Discovery / Quest") is an autonomous technical and cultural intelligence radar. It unearths specialized domain methods, primary literature, regional traditions, and codified specifications published across non-English ecosystems (Japanese, Chinese, Hindi, German, Greek, Italian, Portuguese) and audits them against the English web through a Two-Stage Adversarial Verification Loop.*

---

## 💡 The Core Problem

Over **90% of global AI agents and research tools operate almost entirely within the English-language web**. 

Yet, centuries of profound innovation, domestic standards, martial arts treatises, fermentation recipes, and geotechnical engineering specifications exist exclusively in their native languages:
- A researcher searching in English only gets Western adaptations or secondary summaries.
- A practitioner cannot guess whether the best primary research is in Japanese, German, Portuguese, or Sanskrit.
- Searching in one language at a time is tedious, fragmented, and misses cross-cultural contrasts.

**Khoj solves this autonomously.** You provide any inquiry in plain English—from civil engineering and biotechnology to martial arts biomechanics and traditional medicine—and Khoj:
1. Triangulates the top global centers of authority for that domain.
2. Translates concepts into idiomatic native search queries.
3. Penetrates regional indices and domestic web portals.
4. Adversarially challenges English literature to verify if the insight is truly novel.
5. Synthesizes a multi-perspective comparison and an in-depth 5-paragraph knowledge dossier.

---

## 🏛️ Epistemic Audit Taxonomy (How Khoj Verifies Gaps)

When Khoj surfaces specialized foreign techniques, it never naively declares a "discovery." It subjects every foreign proposition to an **Adversarial Counter-Query Audit** against the English web, classifying the finding into one of four calibrated epistemic states:

| State | Definition | Example Finding |
|---|---|---|
| **🚨 CANDIDATE COVERAGE GAP** | Documented in foreign primary literature; completely absent or omitted from targeted English web indices. | **Ancient Greek Embolon**: Shock-dissipation bronze trireme ramming joints documented in Greek maritime archaeology, absent from English naval articles. |
| **🔍 TERMINOLOGY & PARADIGM VARIATION** | Core science exists in English, but the domestic tradition organizes and executes it through a vastly deeper conceptual system. | **Judo Kuzushi (崩し)**: English sources describe generic "off-balancing", while Japanese literature codifies 8 directional vectors (*Happō-no-kuzushi*) with precise lever mechanics. |
| **⚖️ STANDARDS & PRACTICE DIVERGENCE** | Both regions solve the problem, but their official engineering codes, regulatory bodies, or trade guilds mandate completely different methods. | **Soil Liquefaction (TOFT)**: Japanese BRI mandates cellular grid deep mixing (L/H ≤ 0.8), while Western codes prioritize stone column dissipation. |
| **🤝 SHARED KNOWLEDGE (NO GAP)** | The foreign technical methods are already established and shared in English practice. | **Ohm's Law / Standard Calculus**: Correctly audited to eliminate false positives. |

---

## ⚡ 3-Tier Architecture Powered by TinyFish & Groq

```
                    ┌────────────────────────────────────────────────────────┐
                    │               User Query (Any Domain)                  │
                    └──────────────────────────┬─────────────────────────────┘
                                               │
                                 [Auto-Hub Discovery: LLM]
                         Identifies leading cultural centers (e.g. JP, GR, IN)
                                               │
                                               ▼
     ┌─────────────────────────────────────────────────────────────────────────────────┐
     │  TIER 1: Multilingual Geo-Search                                                │
     │  - Generates authentic native terminology (e.g. 崩し, 格子状地盤改良, 麹菌)         │
     │  - Parallel search across TinyFish domestic indices (Tokyo, Berlin, etc.)       │
     └─────────────────────────────────────────┬───────────────────────────────────────┘
                                               │
                                               ▼
     ┌─────────────────────────────────────────────────────────────────────────────────┐
     │  TIER 2: Resilient Batch Fetch & Snippet Fallback                               │
     │  - Parallel markdown extraction with 10s network timeout                        │
     │  - Automatic snippet fallback ensures zero stalls on slow foreign portals       │
     └─────────────────────────────────────────┬───────────────────────────────────────┘
                                               │
                                               ▼
     ┌─────────────────────────────────────────────────────────────────────────────────┐
     │  TWO-STAGE ADVERSARIAL AUDIT LOOP                                               │
     │  - Synthesizes foreign proposition (mechanics, nuance, lineages)                │
     │  - Generates English counter-queries to challenge Western literature            │
     │  - Eliminates false gaps & classifies into 4 epistemic states                   │
     └─────────────────────────────────────────┬───────────────────────────────────────┘
                                               │
                                               ▼
     ┌─────────────────────────────────────────────────────────────────────────────────┐
     │  TIER 3: Autonomous Web Agent Escalation (Optional)                             │
     │  - Dispatches browser automation with Tokyo geolocation proxy                   │
     │  - Live streaming iframe view of domestic technical databases                   │
     └─────────────────────────────────────────┬───────────────────────────────────────┘
                                               │
                                               ▼
     ┌─────────────────────────────────────────────────────────────────────────────────┐
     │  Obsidian Elite Presentation: 5-Paragraph Dossier & Comparative Views           │
     └─────────────────────────────────────────────────────────────────────────────────┘
```

- **Tier 1 — Multilingual Geo-Search (`tinyfish.search.query`):** Queries local domestic indices using geo-targeted parameters (`location: "jp"`, `location: "de"`, etc.).
- **Tier 2 — Resilient Batch Fetch (`tinyfish.fetch.getContents`):** Extracts clean markdown from domestic documentation with a 10s timeout wrapper and snippet fallback.
- **Tier 3 — Autonomous Web Agent (`tinyfish.agent.run`):** Interactively navigates complex domestic technical databases using a Japanese residential proxy, streaming live browser steps to the UI via an interactive remote session.
- **Bilingual Intelligence Engine:** Powered by Groq's high-speed inference engine (`openai/gpt-oss-20b` with `openai/gpt-oss-120b` and `qwen/qwen3.8-27b` fallbacks) with model-aware token ceilings preventing rate-limit stalls.

---

## 🏆 Multi-Domain Verified Benchmarks

Khoj is completely domain-adaptive and does not force arbitrary engineering formulas onto non-engineering topics:

| Domain | Topic | State | Grounded Insight |
|---|---|---|---|
| 🥋 **Martial Arts** | **Judo Kuzushi Biomechanics** | 🔍 Terminology Variation | Codifies *Happō-no-kuzushi* (8 directional vectors) and fulcrum disruption timing vs. Western generic takedown setups. |
| 🍶 **Biotechnology** | **Rotary Koji Bioreactor** | 🚨 Coverage Gap | Japanese solid-state rotary drum aeration maintains fungal hyphae integrity with cyclic 3.5h forward/reverse airflow (ΔT < 0.8°C). |
| 🏗️ **Civil Geotech** | **Soil Liquefaction (TOFT)** | ⚖️ Standards Divergence | Japan's BRI mandates Overlapping Formed Timber lattice cells (L/H ≤ 0.8) to restrain pore water, whereas Eurocode/US rely on vibro-replacement. |
| 🪵 **Craft & Architecture** | **Timber Seismic Damping** | ⚖️ Standards Divergence | Japanese *Kanawa Tsugi* and *Shikuchi* friction damping (h = 0.05–0.08) codified in traditional preservation guidelines. |
| ⚔️ **Ancient History** | **Greek Naval Ramming (Embolon)** | 🚨 Coverage Gap | Specialized bronze trireme ram geometry and internal shock-transmitting timbers preserved in domestic Greek maritime records. |
| 🌿 **Traditional Medicine** | **Kalaripayattu Marma Therapy** | 🔍 Terminology Variation | Codified 108 vital marma points (*Krikatika*, etc.) and directional pressure protocols vs. Western generic trigger points. |

---

## 💻 Obsidian Elite Dashboard

The interface is built with an **Obsidian Elite luxury dark aesthetic** (`#060608` background with warm champagne gold `#c5a059` accents):
- **Real-Time SSE Stream:** Live progress bar and step-by-step pipeline tracker.
- **Auto-Hub Radar:** Dynamic visualization of leading foreign hubs and their domain advantages.
- **Comparative Perspectives:** Side-by-side breakdown comparing Japanese, Chinese, European, and Western traditions.
- **5-Paragraph Study Dossier:** In-depth, study-ready technical briefings with dynamic domain-specific headings.
- **Verifiable Audit Trail Modal:** Full ledger displaying exact counter-queries and English snippets checked.
- **Playbook Markdown Export:** One-click download of the complete intelligence dossier formatted for researchers.

---

## 🚀 Quickstart

### Prerequisites
- Node.js >= 18
- TinyFish API Key ([tinyfish.ai](https://tinyfish.ai))
- Groq API Key ([console.groq.com](https://console.groq.com))

### 1. Clone & Install
```bash
git clone https://github.com/gr-0x076/khoj.git
cd khoj
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
PORT=3000
TINYFISH_API_KEY=your_tinyfish_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Launch
```bash
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📁 Repository Structure

```
khoj/
├── client/
│   ├── index.html            # Obsidian Elite dashboard with responsive grid
│   └── app.js                # SSE stream consumer, live telemetry & export logic
├── src/
│   ├── core/
│   │   ├── tinyfish_client.js # Tier 1 Search, Tier 2 Batch Fetch, Tier 3 Web Agent
│   │   ├── llm_client.js      # Auto-hub discovery, gap classifier, model-aware Groq calls
│   │   ├── adversarial_verifier.js # Parallel two-stage adversarial audit loop
│   │   ├── portal_escalator.js# Autonomous web agent dispatcher with Tokyo proxy
│   │   ├── investigator.js    # Master pipeline orchestrator & cache manager
│   │   └── cache.js           # Read-through cache for instant benchmark replay
│   ├── server/
│   │   └── server.js          # Express server with /api/stream-investigate SSE route
│   └── tests/
│       ├── test_tinyfish.js   # End-to-end 3-tier TinyFish integration test
│       └── seed_golden_cache.js # Seeding script for verified benchmark playbooks
├── .cache/                    # Cached benchmark playbooks & search snippets
├── package.json
└── README.md
```

---

## 📜 License
MIT License. Built for the TinyFish Agentic AI Hackathon.
