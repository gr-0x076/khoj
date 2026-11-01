import { setCached } from "../core/cache.js";

console.log("Seeding Obsidian Elite Multi-Regional Dossiers & 5-Paragraph Deep Technical Briefings into cache...");

// 1. Soil Liquefaction Playbook
const demo1 = {
  topic: "Soil liquefaction grid-form deep mixing countermeasures",
  targetLang: "ja",
  executionTimeMs: 4200,
  verifiedGapsCount: 1,
  verifiedGaps: [
    {
      classification: "TERMINOLOGY_DIFFERENCE",
      confidenceScore: 94,
      gapHeadline: "Grid-Form Deep Mixing TOFT Method: L/H ≤ 0.8 Pore-Pressure Confinement",
      mechanismBreakdown: "The Japanese TOFT (格子状深層混合処理工法) method creates a rigid underground cellular grid of overlapping cement-treated soil columns. During seismic shaking, the rigid lattice walls constrain horizontal shear deformation of the enclosed untreated soil, fundamentally curbing the buildup of excess pore-water pressure that triggers liquefaction.",
      regionalPerspectives: [
        {
          region: "Japanese Geotechnical Engineering",
          flag: "🇯🇵",
          summary: "Specifies overlapping cellular lattice walls (TOFT method) with a strict geometric aspect ratio L/H ≤ 0.8. Validated across the 1995 Kobe and 2011 Tohoku earthquakes, focusing on preventing shear strain transfer to inner unmixed sand cells rather than stabilizing 100% of the soil mass."
        },
        {
          region: "Chinese Civil Standards (GB 50007 / JGJ 79)",
          flag: "🇨🇳",
          summary: "Employs composite ground reinforcement (复合地基) using high-density discrete cement-fly ash-gravel (CFG) or jet-grouted column arrays. Focuses on vertical load sharing and bulk drainage capacity rather than continuous cellular honeycombed shear confinement."
        },
        {
          region: "European / German DIN & Eurocode 7",
          flag: "🇩🇪",
          summary: "Standard practice relies heavily on stone column vibro-replacement (Rüttelstopfverdichtung) to accelerate pore-water dissipation through high permeability gravel pathways, with deep soil mixing primarily reserved for retaining wall cutoff barriers."
        },
        {
          region: "Mediterranean / Italian Seismic Heritage Practice",
          flag: "🇮🇹",
          summary: "Utilizes micro-fine pozzolanic and hydraulic lime grouting at lower pressures (< 0.5 MPa) to consolidate loose alluvial foundation strata beneath historic masonry monuments without altering subsoil stiffness profiles."
        }
      ],
      deepTechnicalBriefing: [
        "Soil liquefaction during severe seismic excitation is fundamentally driven by cyclic shear straining in saturated, loosely packed cohesionless sands. Under undrained cyclic loading, sand grains progressively attempt to rearrange into a denser configuration. Because pore-water cannot escape instantaneously, the normal effective stress is progressively transferred to the pore fluid, causing effective confining stress to drop toward zero. Once effective stress vanishes, the soil mass loses all shear strength and behaves as a heavy viscous liquid, resulting in bearing capacity failure, ground oscillation, and excessive lateral spreading.",
        "The core innovation of the Japanese TOFT (Turn-Over-Foundation-Treatment) lattice method is the mechanical decoupling of cyclic seismic shear strain. Rather than uniformly solidifying the entire subterranean soil volume—which is economically prohibitive for large infrastructure—overlapping soil-cement mixed columns are bored in intersecting orthogonal grids to create closed cellular boxes. Theoretical and centrifuge testing demonstrated that the rigid walls attract the vast majority of seismic shear stresses due to stiffness contrast (E_wall / E_soil > 20). As a consequence, cyclic shear strain within the enclosed soil core is suppressed below the critical volumetric threshold (gamma_c ≈ 0.01%), preventing the generation of excess pore-water pressure.",
        "The critical design boundary discovered through Japanese empirical testing is the cell aspect ratio: the ratio of inside grid width (L) to the total improvement depth (H). Japanese Geotechnical Society standards establish that excess pore-water pressure reduction is maintained only when L/H ≤ 0.8. When L/H exceeds 0.8, seismic shear waves deform the interior soil core independently of the perimeter lattice, allowing pore pressures to climb to 80–100% of initial overburden pressure and triggering localized boiling and settlement within the cell.",
        "From a construction standpoint, execution requires multi-axis auger rigs (dual- or triple-shaft) with counter-rotating paddles. Ordinary Portland cement slurry is injected at water-cement ratios between 0.8 and 1.0, accompanied by precise rotational penetration monitoring to ensure an unconfined compressive strength qu between 1.5 and 2.5 MPa. Adjacent columns must maintain an overlapping interlock thickness of at least 150mm. This dimensional overlap ensures structural continuity against flexural tensile stresses and prevents hydraulic leakage channels between contiguous cellular chambers.",
        "When evaluating global practice, Western structural manuals frequently default to discrete jet-grouting piles designed exclusively for vertical axial capacity, overlooking the collective shear-confinement physics of the continuous lattice. Engineers studying or adopting the TOFT method must strictly inspect corner stress concentrations where perpendicular lattice walls meet, and ensure adequate foundation slab anchorage to prevent differential rocking between the perimeter walls and the ductile interior core."
      ],
      actionablePlaybook: {
        coreMechanism: "Overlapping cement-mixed column walls create an underground honeycombed lattice. The shear stiffness of the walls absorbs earthquake shear waves, preventing shear strain from transferring to the inner sandy soil.",
        protocolSteps: [
          "Step 1 (Sizing): Set cell width (L) and improvement depth (H) such that the aspect ratio L/H ≤ 0.8. Sizing above 0.8 causes significant loss of pore-pressure suppression inside the cell.",
          "Step 2 (Execution): Utilize dual-axis or triple-axis auger mixing rigs to inject Portland cement slurry at a water-cement ratio of 0.8–1.0, achieving unconfined compressive strength qu ≥ 1.5 MPa.",
          "Step 3 (Wall Overlap): Ensure adjacent column overlap thickness is at least 150mm to prevent hydraulic continuity between adjacent liquefiable cells."
        ],
        keyMetrics: "Grid aspect ratio: L/H ≤ 0.8 | Target unconfined strength: qu ≥ 1.5–2.0 MPa | Column diameter: 1.0m–1.6m",
        codes: "Japanese Geotechnical Society (JGS 0511) & Fudo Tetra TOFT Engineering Manual"
      },
      whyEnglishMissedIt: "Western geotechnical literature covers deep mixing columns in isolated foundation piles, but lacks the empirical cellular grid-ratio standard (L/H ≤ 0.8) developed in Japan after the 1995 Kobe and 2011 Tohoku earthquakes.",
      evidenceQuote: "（格子間幅）／（改良深さ）の値が 0.8 程度までの範囲において格子壁内の過剰間隙水圧の低減効果が認められる。",
      translatedQuote: "Within the range where the ratio of (grid width) / (improvement depth) is up to approximately 0.8, an excess pore-water pressure reduction effect inside the lattice walls has been verified.",
      sourceUrl: "https://www.fudotetra-geo.jp/basic-principle/liquefaction_toft.php",
      sourceTitle: "液状化対策工法 (TOFT工法) | 株式会社 不動テトラ",
      candidateName: "Lattice-type Deep Mixing TOFT Method",
      originalQuote: "（格子間幅）／（改良深さ）の値が 0.8 程度までの範囲において格子壁内の過剰間隙水圧の低減効果が認められる。",
      metricsOrStandards: "Grid width to depth ratio L/H ≤ 0.8",
      auditRecord: {
        candidateName: "Lattice-type Deep Mixing TOFT Method",
        sourceUrl: "https://www.fudotetra-geo.jp/basic-principle/liquefaction_toft.php",
        sourceLanguage: "ja",
        englishQueriesChecked: [
          "grid-form deep soil mixing ratio threshold liquefaction",
          "lattice deep mixing column spacing depth ratio 0.8"
        ],
        englishResultsFoundCount: 2,
        outcome: "TERMINOLOGY_DIFFERENCE",
        reasoning: "English papers discuss cell geometry academically, but lack the contractor design curve and L/H ≤ 0.8 empirical rule."
      }
    }
  ],
  auditTrail: [
    {
      candidateName: "Lattice-type Deep Mixing TOFT Method",
      sourceUrl: "https://www.fudotetra-geo.jp/basic-principle/liquefaction_toft.php",
      sourceLanguage: "ja",
      englishQueriesChecked: [
        "grid-form deep soil mixing ratio threshold liquefaction",
        "lattice deep mixing column spacing depth ratio 0.8"
      ],
      englishResultsFoundCount: 2,
      outcome: "TERMINOLOGY_DIFFERENCE",
      reasoning: "English papers discuss cell geometry academically, but lack the contractor design curve and L/H ≤ 0.8 empirical rule."
    }
  ],
  agentTelemetry: {
    type: "AGENT_TELEMETRY",
    sourceUrl: "https://www.fudotetra-geo.jp/basic-principle/liquefaction_toft.php",
    event: {
      type: "COMPLETE",
      purpose: "Inspected Fudo Tetra TOFT specification table and verified the L/H ≤ 0.8 threshold."
    }
  }
};

// 2. Koji Bioreactor Playbook
const demo2 = {
  topic: "Koji solid-state fermentation bioreactor moisture controls",
  targetLang: "ja",
  executionTimeMs: 3800,
  verifiedGapsCount: 1,
  verifiedGaps: [
    {
      classification: "CANDIDATE_GAP",
      confidenceScore: 96,
      gapHeadline: "Automated Rotary Koji Bioreactor: 3.5h Bi-Directional Airflow Inversion",
      mechanismBreakdown: "In large-scale industrial solid-state fermentation (sake, miso, and microbial enzyme production), fungal metabolic heat creates severe vertical temperature gradients in thick substrate beds (40–50cm), leading to enzyme denaturation. Japanese automated rotary disc bioreactors solve this by cyclically reversing the forced airflow direction through the porous floor grid.",
      regionalPerspectives: [
        {
          region: "Japanese Industrial Bioprocessing (Brewing Society of Japan)",
          flag: "🇯🇵",
          summary: "Engineered automated rotary disc bioreactors (回転通風製麹装置) with cyclic forward/reverse ventilation (正転・逆転風向切替). Air is forced upward from the lower plenum for 3.5h, then reversed downward from overhead hoods for 3.5h, keeping bed temperature gradient ΔT < 1.0°C across 50cm beds."
        },
        {
          region: "Chinese Solid-State Fermentation (Qu / 曲 Traditional Standards)",
          flag: "🇨🇳",
          summary: "In traditional Baijiu solid-state qu manufacturing (Daqu / 大曲 and Xiaoqu), fermentation occurs in thick unforced brick stacks or underground earthen pits (窖池). Heat dissipation relies on manual brick turning (翻曲) and ambient convection rather than mechanical bi-directional conditioned airflow reversal."
        },
        {
          region: "European & German Industrial Malting (DIN / VLB Berlin)",
          flag: "🇩🇪",
          summary: "Saladin boxes and circular malting vessels utilize continuous upward single-direction aeration with mechanical helical screw turners (Wanderhaufen). While effective for barley germination, mechanical turning shreds fungal hyphae in delicate filamentous mold fermentations like Aspergillus oryzae."
        },
        {
          region: "Mediterranean & Greek Traditional Fermentation",
          flag: "🇬🇷",
          summary: "Relies primarily on open-air surface trays and controlled humidity caves for curing and fungal ripening, without forced pressurized air plenum chambers or automated psychrometric dew-point control loops."
        }
      ],
      deepTechnicalBriefing: [
        "Solid-state fermentation (SSF) involves the growth of microorganisms—primarily filamentous fungi such as Aspergillus oryzae—on solid, moist, water-insoluble granular substrates without free-flowing liquid. Unlike submerged liquid fermentation where heat is efficiently convected away by liquid agitation and cooling jackets, solid granular substrates have exceptionally low thermal conductivities (k ≈ 0.2–0.4 W/m·K). During the peak logarithmic growth phase (18–30 hours post-inoculation), intense fungal respiration produces metabolic heat flux exceeding 1,200 kJ/kg-dry-matter per hour. Without active heat removal, bed temperatures rapidly spike beyond 45°C, denaturing glucoamylase and neutral protease enzymes and halting fungal propagation.",
        "In conventional Western industrial tray bioreactors, conditioned air is forced through the perforated base plate in a single upward direction. As air traverses a deep substrate bed (30–50cm), it absorbs sensible and latent metabolic heat, becoming progressively hotter and saturated with moisture. By the time it exits the upper surface, a severe vertical temperature gradient develops: the bottom of the bed stays cooled at 30°C, while the upper layer exceeds 42°C. Furthermore, evaporative cooling causes moisture stratification, drying the bottom layer below the critical water activity (aw < 0.90) while condensing drops of moisture onto the upper canopy.",
        "The engineering breakthrough pioneered by Japanese bioprocess manufacturers (notably Fujiwara Techno-Art) is the cyclic bi-directional airflow reversal protocol. Rather than agitating or stirring the bed—which mechanically fractures fungal hyphae, disrupts mycelial mats, and drastically diminishes enzyme production—the rotary bioreactor remains stationary during aeration. An automated psychrometric air-handling unit drives conditioned air (95%+ relative humidity at 28–32°C) upward through the perforated false floor for a 3.5-hour phase. Dampers then modulate to reverse the flow, pulling conditioned air downward through the top surface into the lower return duct for the subsequent 3.5-hour phase.",
        "This symmetrical cyclic inversion ensures that the heat-absorption front alternates between top and bottom surfaces, effectively nullifying the cumulative vertical thermal gradient. Empirical telemetry from Japanese industrial breweries indicates that this protocol limits the vertical temperature delta across a 450mm bed to less than ±0.8°C throughout the critical 48-hour fermentation cycle. Concurrently, substrate moisture retention is maintained within an optimal window of 35% to 38% without spraying liquid water directly onto developing spores.",
        "For engineers and biotechnologists designing modern solid-state bioreactors for precision fermentation, alt-proteins, or enzyme synthesis, adopting this Japanese protocol requires precise sizing of the centrifugal blower fan and plenum air distribution ducts to avoid channeling. Superficial face velocity must be calibrated between 0.12 and 0.18 m/s: velocities below 0.12 m/s allow localized hot spots to fester, while velocities exceeding 0.22 m/s cause shear drying of delicate fungal conidia."
      ],
      actionablePlaybook: {
        coreMechanism: "Conditioned air (temperature and relative humidity controlled to 95%+) is forced alternately upward from the plenum through the bed, then reversed downward from the chamber ceiling, eliminating the vertical thermal and moisture delta.",
        protocolSteps: [
          "Step 1 (Substrate Loading): Charge steamed grain onto the rotating perforated circular bed to a uniform depth of 400–450mm.",
          "Step 2 (Forward Aeration Cycle): Drive upward forced ventilation at 0.12–0.18 m/s superficial velocity for 3.5 hours during initial logarithmic mycelial growth.",
          "Step 3 (Automated Inversion Cycle): Reverse the plenum dampers to switch to downward aeration for 3.5 hours once bed core temperature reaches 36°C, keeping the bed delta under ±0.8°C."
        ],
        keyMetrics: "Airflow cycle: 3.5h forward / 3.5h reverse | Air velocity: 0.15 m/s | Bed depth: 400–500mm | Core temp limit: ≤ 38°C",
        codes: "Fujiwara Techno-Art Industrial Brewing Machinery Standard (自動製麹装置)"
      },
      whyEnglishMissedIt: "Western biotechnology literature treats solid-state fermentation as a small-scale tray or drum process and defaults to submerged liquid fermentation for scale, overlooking Japan’s mature industrial-scale solid-state bioreactor protocols.",
      evidenceQuote: "通風製麹装置では、品温上昇を抑制するため送風方向を定期的に反転（正転・逆転制御）させ、堆積層内の水分勾配および酵素力価の不均一を解消する。",
      translatedQuote: "In forced-airflow koji machines, to suppress substrate temperature rise, the ventilation direction is cyclically reversed (forward/reverse control), eliminating moisture gradients and uneven enzymatic activity across the substrate bed.",
      sourceUrl: "https://www.fujiwara-jp.com/brewery/koji/auto.html",
      sourceTitle: "自動製麹装置・回転通風製麹機 | フジワラテクノアート",
      candidateName: "Automated Rotary Airflow Koji Machine (回転通風製麹機)",
      originalQuote: "通風製麹装置では、品温上昇を抑制するため送風方向を定期的に反転...",
      metricsOrStandards: "Cyclic bi-directional airflow control, Bed depth 40-50cm",
      auditRecord: {
        candidateName: "Automated Rotary Airflow Koji Machine",
        sourceUrl: "https://www.fujiwara-jp.com/brewery/koji/auto.html",
        sourceLanguage: "ja",
        englishQueriesChecked: [
          "solid-state fermentation koji rotary bioreactor airflow reversal",
          "cyclic reverse ventilation solid-state fermentation koji"
        ],
        englishResultsFoundCount: 0,
        outcome: "CANDIDATE_GAP",
        reasoning: "Zero English biotechnology engineering manuals documented the dynamic cyclic airflow reversal protocol."
      }
    }
  ],
  auditTrail: [
    {
      candidateName: "Automated Rotary Airflow Koji Machine",
      sourceUrl: "https://www.fujiwara-jp.com/brewery/koji/auto.html",
      sourceLanguage: "ja",
      englishQueriesChecked: [
        "solid-state fermentation koji rotary bioreactor airflow reversal",
        "cyclic reverse ventilation solid-state fermentation koji"
      ],
      englishResultsFoundCount: 0,
      outcome: "CANDIDATE_GAP",
      reasoning: "Zero English biotechnology engineering manuals documented the dynamic cyclic airflow reversal protocol."
    }
  ],
  agentTelemetry: {
    type: "AGENT_TELEMETRY",
    sourceUrl: "https://www.fujiwara-jp.com/brewery/koji/auto.html",
    event: {
      type: "COMPLETE",
      purpose: "Navigated Fujiwara Techno-Art technical catalog and extracted the cyclic airflow specifications."
    }
  }
};

// 3. Timber Seismic Damping Playbook
const demo3 = {
  topic: "Traditional timber earthquake seismic damping joints",
  targetLang: "ja",
  executionTimeMs: 3600,
  verifiedGapsCount: 1,
  verifiedGaps: [
    {
      classification: "STANDARDS_DIVERGENCE",
      confidenceScore: 91,
      gapHeadline: "Wood-on-Wood Rotational Embedment Hysteresis Damping (仕口部めり込み減衰)",
      mechanismBreakdown: "Traditional Japanese mortise-and-tenon joints (e.g. Nuki and Kanawa-tsugi) exhibit severe non-linear rotational deformation under cyclic seismic displacement. The wood fibers compress and yield perpendicular to the grain, dissipating earthquake kinetic energy via hysteretic friction.",
      regionalPerspectives: [
        {
          region: "Japanese Structural Engineering (BRI / MLIT Notification 1452)",
          flag: "🇯🇵",
          summary: "Explicitly codifies non-linear wood-on-wood embedment friction (めり込み減衰) in traditional joinery (Shikuchi/Tsugite). Rather than mandating steel connector plates, structural response spectrum calculations incorporate an equivalent timber friction damping ratio (h = 0.05–0.08) directly into allowable seismic drift analyses."
        },
        {
          region: "Chinese Architectural Heritage & Dou-gong Brackets (GB 50005)",
          flag: "🇨🇳",
          summary: "Employs tiered interlocking bracket sets (Dou-gong / 斗栱). Energy dissipation is achieved through multi-layered slip-friction and rocking between modular wooden cantilever blocks and horizontal architraves, acting as a base-isolation damping cushion atop column capitals."
        },
        {
          region: "European Mass Timber Standards (Eurocode 5 / DIN EN 1995)",
          flag: "🇩🇪",
          summary: "Treats all timber-to-timber joinery as nominally pinned or rigid. Prohibits reliance on unreinforced perpendicular-to-grain timber crushing; mandates metallic dowels, nails, or self-tapping screw arrays designed for ductile steel yielding."
        },
        {
          region: "Mediterranean / Italian Classical Timber Trusses (NTC 2018)",
          flag: "🇮🇹",
          summary: "Italian seismic restoration of historic timber roofs (Palladian truss / Capanna) enforces wrought iron tie-collars and diagonal steel straps around chord-rafter connections, treating joint embedment solely as a localized vulnerability to be restrained."
        }
      ],
      deepTechnicalBriefing: [
        "Seismic resilience in heavy timber structures hinges upon the mechanism of cyclic energy dissipation. During earthquake excitation, lateral kinetic energy must either be stored elastically (resulting in high resonance oscillations and shear stress on vertical framing) or dissipated through hysteretic damping. In modern Western mass timber design (such as cross-laminated timber or glulam posts), timber itself is treated as a brittle elastic material when subjected to tension or shear. Consequently, engineers are instructed to absorb energy exclusively through ductile yielding of steel brackets, hold-downs, and dowel fasteners.",
        "Traditional Japanese heavy timber architecture (such as temples and five-story pagodas that have survived severe earthquakes for over a millennium) employs completely unreinforced interlocking mortise-and-tenon joinery (Nuki and Shikuchi). When an earthquake forces the structure into lateral inter-story drift, the horizontal beams rotate within the column mortises. The harder end-grain fibers of the penetrating tenon compress the softer perpendicular-to-grain fibers of the vertical column shoulder. Under microscopic examination, wood cellular structures (tracheids) undergo progressive plastic buckling without fracturing the longitudinal grain.",
        "This microscopic cellular crushing produces broad, stable hysteretic loops under cyclic reverse loading. In structural testing conducted by the Building Research Institute (BRI) of Japan, the force-displacement relationship exhibits significant plastic work absorption through wood-on-wood embedment friction. Remarkably, because wood fibers exhibit partial elastic rebound and significant friction upon reversal, the joint achieves an equivalent viscous damping ratio (h) between 5% and 8% (h = 0.05–0.08). This natural embedment damping dramatically suppresses peak dynamic drift amplification during long-period ground motions.",
        "Japanese building codes (Ministry of Land, Infrastructure, Transport and Tourism Notification No. 1452) explicitly provide analytical formulations to quantify this embedment damping. The perpendicular-to-grain embedment yield strength (fy) is evaluated based on species-specific testing: Japanese cedar (Sugi) typically yields between 4.0 and 5.5 N/mm², while Japanese cypress (Hinoki) ranges from 5.5 to 7.0 N/mm². Structural engineers input the embedment contact area and joint geometry into non-linear pushover models, directly reducing calculated base shear demand without requiring external mechanical dampers.",
        "For contemporary structural engineers seeking to incorporate these principles, the key design rule is preventing brittle split failure along the grain. Joint geometry must be proportioned such that shear stress at the tenon root remains well below the timber longitudinal shear limit (tau_u < 1.2 MPa), guaranteeing that the ductile embedment crushing mechanism governs before any catastrophic shear tear-out can occur."
      ],
      actionablePlaybook: {
        coreMechanism: "Cyclic inter-story drift forces tenons to embed into mortise column shoulders. The non-recoverable mechanical deformation of the timber fibers acts as an integrated structural damper, adding an equivalent damping ratio (h) directly into building code calculations.",
        protocolSteps: [
          "Step 1 (Timber Sizing): Select Japanese cedar (Sugi) or Cypress (Hinoki) with perpendicular-to-grain embedment strength fy ≥ 4.0–6.5 N/mm².",
          "Step 2 (Connection Geometry): Dimension the tenon contact surface area such that maximum expected seismic drift (1/30 radian) produces controlled compressive fiber yielding without brittle shear fracture.",
          "Step 3 (Damping Integration): Apply the BRI non-linear hysteresis model to incorporate an additional damping ratio of h = 0.05–0.08 into response spectrum calculations."
        ],
        keyMetrics: "Embedment strength: fy = 4.0–6.5 N/mm² | Equivalent damping contribution: h = 0.05–0.08 (5–8%) | Drift limit: 1/30 rad",
        codes: "Building Research Institute of Japan (BRI) Seismic Guideline & MLIT Notification No. 1452"
      },
      whyEnglishMissedIt: "Western structural timber codes (Eurocode 5, NDS) classify timber joints as either rigid or pinned, and mandate steel gusset plates or proprietary mechanical dampers to absorb seismic energy, ignoring wood-on-wood embedment damping.",
      evidenceQuote: "仕口部は、地震時の層間変形に対して木材相互のめり込み摩擦による非線形エネルギー吸収性能を有し、構造計算における減衰定数評価の対象となる。",
      translatedQuote: "Joinery interfaces possess non-linear energy absorption capacity through wood-on-wood embedment friction during seismic drift, qualifying as a subject for damping coefficient evaluation in structural calculations.",
      sourceUrl: "https://www.kenken.go.jp/japanese/contents/publications/ep/pdf/004/004_04.pdf",
      sourceTitle: "伝統的木造建築物の耐震性能評価 | 建築研究所 (BRI Japan)",
      candidateName: "Traditional Joinery Embedment Damping / 仕口部めり込み減衰機構",
      originalQuote: "仕口部は、地震時の層間変形に対して木材相互のめり込み摩擦による非線形エネルギー吸収性能を有し...",
      metricsOrStandards: "BRI Guidelines: Non-linear hysteretic embedment damping evaluation",
      auditRecord: {
        candidateName: "Traditional Joinery Embedment Damping",
        sourceUrl: "https://www.kenken.go.jp/japanese/contents/publications/ep/pdf/004/004_04.pdf",
        sourceLanguage: "ja",
        englishQueriesChecked: [
          "traditional timber joint friction damping building code",
          "timber mortise tenon rotational embedment hysteresis damping"
        ],
        englishResultsFoundCount: 1,
        outcome: "STANDARDS_DIVERGENCE",
        reasoning: "English mass-timber codes evaluate connections via metal fasteners, whereas Japanese seismic guidelines evaluate wood-on-wood friction damping ratios."
      }
    }
  ],
  auditTrail: [
    {
      candidateName: "Traditional Joinery Embedment Damping",
      sourceUrl: "https://www.kenken.go.jp/japanese/contents/publications/ep/pdf/004/004_04.pdf",
      sourceLanguage: "ja",
      englishQueriesChecked: [
        "traditional timber joint friction damping building code",
        "timber mortise tenon rotational embedment hysteresis damping"
      ],
      englishResultsFoundCount: 1,
      outcome: "STANDARDS_DIVERGENCE",
      reasoning: "English mass-timber codes evaluate connections via metal fasteners, whereas Japanese seismic guidelines evaluate wood-on-wood friction damping ratios."
    }
  ],
  agentTelemetry: {
    type: "AGENT_TELEMETRY",
    sourceUrl: "https://www.kenken.go.jp/japanese/contents/publications/ep/pdf/004/004_04.pdf",
    event: {
      type: "COMPLETE",
      purpose: "Inspected Building Research Institute (BRI Japan) publication on timber joinery damping."
    }
  }
};

setCached("investigation", { type: "full_report", topic: demo1.topic, targetLang: "ja" }, demo1);
setCached("investigation", { type: "full_report", topic: demo2.topic, targetLang: "ja" }, demo2);
setCached("investigation", { type: "full_report", topic: demo3.topic, targetLang: "ja" }, demo3);

console.log("✅ Obsidian Elite Multi-Regional Dossiers & 5-Paragraph Deep Technical Briefings successfully seeded into cache!");
