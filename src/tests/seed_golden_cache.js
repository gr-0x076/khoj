import { setCached } from "../core/cache.js";
console.log("Seeding universal domain dossiers into cache...");

const demoMartialArts = {
  topic: "Judo Kuzushi biomechanics and off-balancing vectors",
  targetLang: "ja",
  executionTimeMs: 3400,
  verifiedGapsCount: 1,
  verifiedGaps: [{
    classification: "TERMINOLOGY_DIFFERENCE",
    confidenceScore: 95,
    gapHeadline: "Happo-no-Kuzushi: Kinetic Line-of-Gravity Displacement Across 8 Vector Planes",
    corePrinciples: "Kuzushi is the foundational biomechanical phase in Kodokan Judo where an opponents center of mass is displaced beyond their base of support prior to body entry and execution.",
    regionalPerspectives: [
      { region: "Japanese Kodokan Judo", flag: "🇯🇵", summary: "Formalizes Happo-no-Kuzushi using reaction timing (Sen-no-sen) and Hikite/Tsurite rotational couples." },
      { region: "Chinese Internal Arts (Taijiquan & Shuai Jiao)", flag: "🇨🇳", summary: "Employs Ting Jin (listening force) and Chan Si Jin spiraling energy to borrow incoming momentum." },
      { region: "Indian Kushti & Malla-Yuddha", flag: "🇮🇳", summary: "Utilizes deep-stance level changes (Dhaak and Bagalbandi) focused on center-of-gravity manipulation." },
      { region: "Western Olympic Wrestling", flag: "🌐", summary: "Emphasizes explosive double-leg penetration and pummeling for underhooks rather than diagonal cloth levers." }
    ],
    inDepthBriefing: [
      { heading: "Biomechanical Physics of the Base of Support", content: "In human bipedal stance, balance is maintained only so long as the vertical line of gravity falls within the polygon defined by the feet: the base of support. Along diagonal axes, the boundary of the base of support shrinks to an acute apex, requiring less than one-third of the kinetic work to break balance." },
      { heading: "Coupled Force Vectors: Hikite and Tsurite Dynamics", content: "Kuzushi relies on a synchronized force-couple generated between the Hikite sleeve pull and Tsurite lapel torque, lifting the opponent onto the balls of their toes to reduce frictional contact." },
      { heading: "Action-Reaction Dynamics & Debana Timing", content: "The most effective Kuzushi is Debana: seizing the instant an opponent initiates forward movement before their advancing foot establishes contact with the mat." },
      { heading: "Practical Sequence & Kata Transmission", content: "Traditional instruction mandates establishing Kumikata without telegraphing tension, executing Tai-sabaki angle changes, and delivering directional vector impulses via core abdominal engagement." },
      { heading: "Critical Mastery Caveats", content: "The most common flaw is attempting to yank an opponent while remaining stationary. Authentic mastery requires maintaining complete vertical spinal integrity (Shisei)." }
    ],
    actionableKnowledge: {
      corePrinciples: "Displacing the opponent line-of-gravity beyond their base of support along diagonal lines of weakness (Happo-no-Kuzushi) using rotational torque.",
      steps: [
        "Step 1: Establish asymmetrical sleeve and collar grips while maintaining relaxed shoulders.",
        "Step 2: Pivot on the support foot (Tai-Sabaki) to step off the primary attack vector.",
        "Step 3: Drive Hikite upward-outward and rotate Tsurite toward the ear at the exact moment the opponent steps."
      ],
      keyMetricsOrNuances: "Vector trajectory: 45° diagonal angle | Timing: Debana (advancing foot mid-air) | Grip ratio: 60% collar torque / 40% sleeve lift",
      authoritativeSourcesOrCodes: "Kodokan Judo Goshin-jutsu & Jigoro Kano Classical Lectures"
    },
    whyEnglishMissedIt: "Western martial arts literature frequently treats Judo throws as wrestling takedowns, glossing over the explicit Japanese kinetic vectors and base-of-support decoupling.",
    evidenceQuote: "崩しとは、相手の体をその支底面より外へ重心を移動させ、抵抗力を失わせる理合である。",
    translatedQuote: "Kuzushi is the underlying physical principle of displacing the opponents center of gravity outside of their base of support.",
    sourceUrl: "https://www.kodokan.org/judo/kuzushi.html",
    sourceTitle: "講道館 柔道の技と理合（崩し・作り・掛け）",
    candidateName: "Happo-no-Kuzushi / 八方の崩し",
    auditRecord: {
      candidateName: "Happo-no-Kuzushi",
      sourceUrl: "https://www.kodokan.org/judo/kuzushi.html",
      sourceLanguage: "ja",
      englishQueriesChecked: ["judo kuzushi biomechanics center of mass", "happo no kuzushi 8 direction off balancing"],
      englishResultsFoundCount: 2,
      outcome: "TERMINOLOGY_DIFFERENCE",
      reasoning: "English articles mention off-balancing casually, but lack the rigorous kinetic vector calculations and Debana transit timing found in Japanese Kodokan manuals."
    }
  }],
  auditTrail: [{
    candidateName: "Happo-no-Kuzushi",
    sourceUrl: "https://www.kodokan.org/judo/kuzushi.html",
    sourceLanguage: "ja",
    englishQueriesChecked: ["judo kuzushi biomechanics center of mass", "happo no kuzushi 8 direction off balancing"],
    englishResultsFoundCount: 2,
    outcome: "TERMINOLOGY_DIFFERENCE",
    reasoning: "English articles mention off-balancing casually, but lack the rigorous kinetic vector calculations and Debana transit timing found in Japanese Kodokan manuals."
  }]
};

// 2. Soil Liquefaction TOFT
const demoSoil = {
  topic: "Soil liquefaction grid-form deep mixing countermeasures",
  targetLang: "ja",
  executionTimeMs: 4200,
  verifiedGapsCount: 1,
  verifiedGaps: [{
    classification: "TERMINOLOGY_DIFFERENCE",
    confidenceScore: 94,
    gapHeadline: "Grid-Form Deep Mixing TOFT Method: L/H ≤ 0.8 Pore-Pressure Confinement",
    corePrinciples: "The Japanese TOFT method creates a rigid underground cellular grid of overlapping cement-treated soil columns that constrains horizontal shear deformation of enclosed unmixed soil.",
    regionalPerspectives: [
      { region: "Japanese Geotechnical Practice", flag: "🇯🇵", summary: "Specifies overlapping cellular lattice walls with a strict aspect ratio L/H ≤ 0.8 to constrain pore-pressure buildup." },
      { region: "Chinese Civil Standards (GB 50007)", flag: "🇨🇳", summary: "Employs composite ground reinforcement using discrete column arrays focusing on vertical load sharing." },
      { region: "European DIN & Eurocode 7", flag: "🇩🇪", summary: "Standard practice relies on stone column vibro-replacement to accelerate pore-water dissipation." },
      { region: "Mediterranean / Italian Practice", flag: "🇮🇹", summary: "Utilizes micro-fine pozzolanic and hydraulic lime grouting at lower pressures (< 0.5 MPa) to preserve historic foundations." }
    ],
    inDepthBriefing: [
      { heading: "Seismic Shear Strain and Liquefaction Physics", content: "Soil liquefaction during severe earthquakes occurs when cyclic shear waves pass through water-saturated loose sand, causing effective confining stress to drop toward zero." },
      { heading: "Mechanical Decoupling via Cellular Grids", content: "Constructing an underground cellular grid of overlapping soil-cement columns absorbs shear waves, keeping shear strain inside the cell below the critical threshold." },
      { heading: "The Critical Aspect Ratio Boundary: L/H ≤ 0.8", content: "Excess pore-pressure suppression is maintained only when the ratio of inside cell width (L) to improvement depth (H) is less than or equal to 0.8." },
      { heading: "Construction Parameters & Wall Interlock", content: "Columns are mixed with multi-axis augers at W/C = 0.8 to 1.0 with minimum 150mm overlap thickness to prevent hydraulic continuity." },
      { heading: "Structural Takeaways & Study Directives", content: "Engineers must reinforce corner stress intersections where perpendicular lattice walls meet and anchor foundation slabs." }
    ],
    actionableKnowledge: {
      corePrinciples: "Overlapping cement-mixed column walls create an underground cellular lattice that absorbs seismic shear waves.",
      steps: [
        "Step 1: Set cell width (L) and improvement depth (H) such that aspect ratio L/H ≤ 0.8.",
        "Step 2: Inject Portland cement slurry at W/C = 0.8–1.0 achieving qu ≥ 1.5 MPa.",
        "Step 3: Ensure adjacent column overlap thickness is at least 150mm."
      ],
      keyMetricsOrNuances: "Grid aspect ratio: L/H ≤ 0.8 | Target unconfined strength: qu ≥ 1.5–2.0 MPa",
      authoritativeSourcesOrCodes: "Japanese Geotechnical Society (JGS 0511) & Fudo Tetra TOFT Engineering Manual"
    },
    whyEnglishMissedIt: "Western manuals cover deep mixing columns in isolated piles, but lack the empirical cellular grid-ratio standard (L/H ≤ 0.8).",
    evidenceQuote: "（格子間幅）／（改良深さ）の値が 0.8 程度までの範囲において格子壁内の過剰間隙水圧の低減効果が認められる。",
    translatedQuote: "Within the range where the ratio of (grid width) / (improvement depth) is up to approximately 0.8, excess pore-water pressure reduction has been verified.",
    sourceUrl: "https://www.fudotetra-geo.jp/basic-principle/liquefaction_toft.php",
    sourceTitle: "液状化対策工法 (TOFT工法) | 株式会社 不動テトラ",
    candidateName: "Lattice-type Deep Mixing TOFT Method",
    auditRecord: {
      candidateName: "Lattice-type Deep Mixing TOFT Method",
      sourceUrl: "https://www.fudotetra-geo.jp/basic-principle/liquefaction_toft.php",
      sourceLanguage: "ja",
      englishQueriesChecked: ["grid-form deep soil mixing ratio threshold liquefaction", "lattice deep mixing column spacing depth ratio 0.8"],
      englishResultsFoundCount: 2,
      outcome: "TERMINOLOGY_DIFFERENCE",
      reasoning: "English papers discuss cell geometry academically, but lack the contractor design curve and L/H ≤ 0.8 empirical rule."
    }
  }],
  auditTrail: [{
    candidateName: "Lattice-type Deep Mixing TOFT Method",
    sourceUrl: "https://www.fudotetra-geo.jp/basic-principle/liquefaction_toft.php",
    sourceLanguage: "ja",
    englishQueriesChecked: ["grid-form deep soil mixing ratio threshold liquefaction", "lattice deep mixing column spacing depth ratio 0.8"],
    englishResultsFoundCount: 2,
    outcome: "TERMINOLOGY_DIFFERENCE",
    reasoning: "English papers discuss cell geometry academically, but lack the contractor design curve and L/H ≤ 0.8 empirical rule."
  }]
};

// 3. Biotechnology: Koji Bioreactor
const demoBiotech = {
  topic: "Koji solid-state fermentation bioreactor moisture controls",
  targetLang: "ja",
  executionTimeMs: 3800,
  verifiedGapsCount: 1,
  verifiedGaps: [{
    classification: "CANDIDATE_GAP",
    confidenceScore: 96,
    gapHeadline: "Automated Rotary Koji Bioreactor: 3.5h Bi-Directional Airflow Inversion",
    corePrinciples: "Cyclic forward/reverse airflow reversal through a stationary porous rotary bed eliminates vertical temperature and moisture gradients without mechanical mycelial disruption.",
    regionalPerspectives: [
      { region: "Japanese Industrial Bioprocessing", flag: "🇯🇵", summary: "Automated rotary disc bioreactors with cyclic 3.5h forward/reverse ventilation keeping ΔT < 0.8°C across 50cm beds." },
      { region: "Chinese Traditional Qu Standards", flag: "🇨🇳", summary: "Unforced brick stacks in earthen pits relying on manual turning and ambient convection." },
      { region: "European & German Industrial Malting", flag: "🇩🇪", summary: "Saladin boxes with mechanical screw turners, which shred delicate fungal hyphae in Aspergillus mold." },
      { region: "Mediterranean Fermentation Traditions", flag: "🇬🇷", summary: "Relies on open-air surface trays and controlled humidity caves without pressurized plenum loops." }
    ],
    inDepthBriefing: [
      { heading: "Thermodynamics of Solid Substrate Fermentation", content: "Growing filamentous fungi on moist grains releases intense metabolic heat flux without free liquid to convect heat away." },
      { heading: "The Vertical Stratification Problem in Single-Pass Aeration", content: "Single-direction upward aeration causes severe vertical stratification: the bottom layer dries out while the top layer overheats." },
      { heading: "Cyclic Forward and Reverse Airflow Protocol", content: "Symmetrical 3.5h upward and downward airflow reversal balances the thermal boundary layer and maintains ΔT < 0.8°C across 50cm beds." },
      { heading: "Hyphal Integrity vs Mechanical Agitation", content: "Keeping the bed stationary preserves delicate mycelial networks and maximizes enzyme yield." },
      { heading: "Operational Parameters & Air Velocity", content: "Centrifugal blowers maintain superficial face velocities between 0.12 and 0.18 m/s." }
    ],
    actionableKnowledge: {
      corePrinciples: "Cyclic bi-directional airflow reversal balances temperature and moisture across thick substrate beds.",
      steps: [
        "Step 1: Charge steamed grain onto the rotating bed to a depth of 400–450mm.",
        "Step 2: Drive upward forced ventilation at 0.12–0.18 m/s for 3.5 hours.",
        "Step 3: Modulate dampers to downward aeration for 3.5 hours once core temperature reaches 36°C."
      ],
      keyMetricsOrNuances: "Cycle: 3.5h forward / 3.5h reverse | Air velocity: 0.15 m/s | Bed depth: 400–500mm",
      authoritativeSourcesOrCodes: "Fujiwara Techno-Art Industrial Brewing Machinery Standard"
    },
    whyEnglishMissedIt: "Western literature defaults to submerged liquid fermentation, overlooking Japan’s mature solid-state koji bioreactor protocols.",
    evidenceQuote: "通風製麹装置では、品温上昇を抑制するため送風方向を定期的に反転（正転・逆転制御）させ...",
    translatedQuote: "In forced-airflow koji machines, ventilation direction is cyclically reversed to eliminate moisture gradients.",
    sourceUrl: "https://www.fujiwara-jp.com/brewery/koji/auto.html",
    sourceTitle: "自動製麹装置・回転通風製麹機 | フジワラテクノアート",
    candidateName: "Automated Rotary Airflow Koji Machine",
    auditRecord: {
      candidateName: "Automated Rotary Airflow Koji Machine",
      sourceUrl: "https://www.fujiwara-jp.com/brewery/koji/auto.html",
      sourceLanguage: "ja",
      englishQueriesChecked: ["solid-state fermentation koji rotary bioreactor airflow reversal"],
      englishResultsFoundCount: 0,
      outcome: "CANDIDATE_GAP",
      reasoning: "Zero English biotechnology engineering manuals documented the dynamic cyclic airflow reversal protocol."
    }
  }],
  auditTrail: [{
    candidateName: "Automated Rotary Airflow Koji Machine",
    sourceUrl: "https://www.fujiwara-jp.com/brewery/koji/auto.html",
    sourceLanguage: "ja",
    englishQueriesChecked: ["solid-state fermentation koji rotary bioreactor airflow reversal"],
    englishResultsFoundCount: 0,
    outcome: "CANDIDATE_GAP",
    reasoning: "Zero English biotechnology engineering manuals documented the dynamic cyclic airflow reversal protocol."
  }]
};

setCached("investigation", { type: "full_report", topic: demoMartialArts.topic, targetLang: "ja" }, demoMartialArts);
setCached("investigation", { type: "full_report", topic: demoSoil.topic, targetLang: "ja" }, demoSoil);
setCached("investigation", { type: "full_report", topic: demoBiotech.topic, targetLang: "ja" }, demoBiotech);
console.log("Universal domain dossiers successfully seeded!");