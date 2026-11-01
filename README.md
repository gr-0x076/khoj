# 🧭 Khoj (खोज) — Autonomous Global Technical Intelligence Radar

> **"Unearthing what global engineering has already solved."**  
> *Khoj (Hindi for "Discovery / Quest") is an autonomous technical intelligence radar that discovers specialized industrial specifications, contractor manuals, and empirical formulas published in non-English ecosystems (Japanese, German, Chinese, Italian, Greek, Portuguese) and audits them against the English web using a Two-Stage Adversarial Verification Loop.*

---

## ⚡ Live Architecture

Powered by the **TinyFish Agent API** and High-Throughput Bilingual LLM:
1. **Tier 1 — Multilingual Geo-Search:** Autonomous native terminology expansion querying domestic search indices (`location: "jp"`).
2. **Tier 2 — High-Speed Batch Fetch:** High-speed parallel markdown extraction with boilerplate stripping.
3. **Tier 3 — Autonomous Web Agent:** Live browser automation dispatched with domestic geo-proxies (Tokyo proxy) to navigate complex manufacturer catalogs, with real-time remote streaming (`streaming_url`).
4. **Two-Stage Adversarial Verification Loop:** Actively audits candidate foreign breakthroughs against English technical indices to eliminate false gaps.
5. **Comparative Global Intelligence:** Synthesizes multi-regional perspectives (*"Japanese practice specifies X, Chinese standards mandate Y, European codes enforce Z, Mediterranean traditions use W"*).
6. **5-Paragraph Deep Technical Briefings:** Generates substantive, study-ready technical explanations covering foundational physics, quantitative dynamics, sizing protocols, and failure modes.

---

## 🏛️ System Overview

```
├── client/
│   ├── index.html            # Obsidian Elite responsive presentation dashboard
│   └── app.js                # SSE client, live stream iframe, multi-regional view & audit ledger
├── src/
│   ├── core/
│   │   ├── tinyfish_client.js # Tier 1 (Search), Tier 2 (Batch Fetch), Tier 3 (Web Agent + JP Proxy)
│   │   ├── llm_client.js      # Auto-Hub Discovery, Multi-Regional Synthesizer & Semantic Classifier
│   │   ├── adversarial_verifier.js # Two-Stage Adversarial Verification Loop
│   │   ├── portal_escalator.js# Bounded Web Agent (Max 1 click, 25s timeout, live stream iframe)
│   │   ├── investigator.js    # Master pipeline orchestrator with auto-hub detection
│   │   └── cache.js           # Read-through local demo cache
│   ├── server/
│   │   └── server.js          # Express server with Server-Sent Events (/api/stream-investigate)
│   └── tests/
│       ├── test_tinyfish.js   # 3-tier TinyFish integration test
│       └── seed_golden_cache.js # Grounded, primary-source golden demo seeds
└── .cache/                    # Grounded engineering playbooks & cached search payloads
```

---

## 🏆 Verified Benchmarks

| Topic | Category | Multi-Regional Contrast & Grounded Finding |
|---|---|---|
| **🍶 Koji-kin Bioreactors (麹菌 固体培養)** | 🚨 Candidate Coverage Gap | **🇯🇵 Japanese:** Automated rotary airflow machines use cyclic 3.5h forward/reverse aeration through 50cm beds (ΔT < 0.8°C) without damaging delicate fungal hyphae.<br>**🇨🇳 Chinese:** Unforced Daqu brick pit fermentation relying on manual turning.<br>**🇩🇪 German:** Mechanical Saladin screw turners (destroys filamentous fungi). |
| **🏗️ Soil Liquefaction (格子状地盤改良)** | 🔍 Terminology / Indexing Difference | **🇯🇵 Japanese:** TOFT cellular lattice grid (L/H ≤ 0.8) constraining excess pore-water pressure during seismic shaking.<br>**🇨🇳 Chinese:** Discrete CFG composite pile arrays for vertical load sharing.<br>**🇩🇪 European:** Stone column vibro-replacement for dissipation drainage. |
| **🪵 Timber Seismic Damping (木造制震工法)** | ⚖️ Standards & Practice Divergence | **🇯🇵 Japanese:** Traditional Shikuchi wood-on-wood embedment friction damping (h = 0.05–0.08) codified in BRI seismic guidelines.<br>**🇨🇳 Chinese:** Tiered Dou-gong interlocking bracket cushions.<br>**🇩🇪/🇪🇺 Eurocode:** Rigid dowels and steel plates (perpendicular wood crushing prohibited). |

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
```bash
cp .env.example .env
```
Edit `.env` and supply your API keys:
```env
PORT=3000
TINYFISH_API_KEY=your_tinyfish_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Launch Dashboard
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Epistemic Calibrated Taxonomy
Khoj deliberately avoids exaggerated or unprovable claims:
- **🚨 CANDIDATE COVERAGE GAP:** Documented in foreign sources; not surfaced in targeted English search sample.
- **🔍 TERMINOLOGY / INDEXING DIFFERENCE:** Core science exists in English literature, but the practical contractor manual parameters, empirical thresholds, or nomenclature differ.
- **⚖️ STANDARDS & PRACTICE DIVERGENCE:** Explicit regional divergence in design codes or contractor manuals.
- **🤝 SHARED KNOWLEDGE:** Verified that the methods are already standard in English practice.

---

## 📜 License
MIT
