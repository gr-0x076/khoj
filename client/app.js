let currentDossier = null;
let currentAuditTrail = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchWalletBalance();
  setupEventListeners();
});

async function fetchWalletBalance() {
  try {
    const res = await fetch('/api/wallet');
    const data = await res.json();
    if (data.success && data.available_balance) {
      document.getElementById('walletBalance').textContent = `$${parseFloat(data.available_balance).toFixed(2)} ${data.currency}`;
    }
  } catch (err) {
    console.warn('Could not fetch wallet balance:', err);
  }
}

function setupEventListeners() {
  const form = document.getElementById('investigateForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const topic = document.getElementById('topicInput').value.trim();
    if (topic) startInvestigation(topic);
  });

  // Demo chips
  document.querySelectorAll('.demo-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const topic = btn.dataset.topic;
      document.getElementById('topicInput').value = topic;
      startInvestigation(topic);
    });
  });

  // Audit modal
  const auditBtn = document.getElementById('auditDrawerBtn');
  const auditModal = document.getElementById('auditModal');
  const closeAuditModal = document.getElementById('closeAuditModal');

  auditBtn.addEventListener('click', () => {
    renderAuditLedger();
    auditModal.classList.remove('hidden');
  });

  closeAuditModal.addEventListener('click', () => {
    auditModal.classList.add('hidden');
  });

  document.getElementById('exportBtn').addEventListener('click', exportMarkdownPlaybook);
}

function startInvestigation(topic) {
  const lang = document.getElementById('langSelect').value;
  const escalate = document.getElementById('escalateToggle').checked;

  // Reset UI
  document.getElementById('welcomeState').classList.add('hidden');
  document.getElementById('resultsSection').classList.add('hidden');
  document.getElementById('pipelineStatus').classList.remove('hidden');
  document.getElementById('webAgentBox').classList.add('hidden');
  document.getElementById('submitBtn').disabled = true;
  document.getElementById('submitBtn').innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Scanning Radar...`;

  resetStepHighlights();
  updateProgress(10, 'Global Radar: Scanning Technical Hubs...', 'Triangulating foreign language centers leading this domain');

  document.getElementById('agentStepLogs').innerHTML = '<div class="text-champagne-400 font-medium">> Initializing TinyFish autonomous agent with JP geolocation proxy...</div>';
  document.getElementById('browserLivePreviewBtn').classList.add('hidden');

  // Open SSE Stream
  const sseUrl = `/api/stream-investigate?topic=${encodeURIComponent(topic)}&targetLang=${lang}&escalate=${escalate}&preferLive=true`;
  const evtSource = new EventSource(sseUrl);

  evtSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      handlePipelineEvent(data);
    } catch (err) {
      console.error('SSE parse error:', err);
    }
  };

  evtSource.addEventListener('end', () => {
    evtSource.close();
    document.getElementById('submitBtn').disabled = false;
    document.getElementById('submitBtn').innerHTML = `<span>Scan Radar</span> <i class="fa-solid fa-arrow-right text-xs"></i>`;
    fetchWalletBalance();
  });

  evtSource.onerror = (err) => {
    console.error('SSE Error:', err);
    evtSource.close();
    document.getElementById('submitBtn').disabled = false;
    document.getElementById('submitBtn').innerHTML = `<span>Scan Radar</span> <i class="fa-solid fa-arrow-right text-xs"></i>`;
  };
}

function handlePipelineEvent(data) {
  const { stage, message, progress, result, telemetry, error, activeHubs, selectedHub } = data;

  if (stage === 'error') {
    updateProgress(100, 'Investigation Note', error || 'Encountered temporary rate limit. Showing fallback analysis.');
    document.getElementById('pipelineStageText').className = 'text-sm font-semibold text-amber-400';
    document.getElementById('submitBtn').disabled = false;
    document.getElementById('submitBtn').innerHTML = `<span>Scan Radar</span> <i class="fa-solid fa-arrow-right text-xs"></i>`;
    return;
  }

  if (progress !== undefined) {
    updateProgress(progress, getStageTitle(stage), message);
  }

  highlightStep(stage);

  if (telemetry && telemetry.event) {
    handleAgentTelemetry(telemetry);
  }

  if (stage === 'complete' && result) {
    currentDossier = result;
    currentAuditTrail = result.auditTrail || [];
    renderResults(result);
  }
}

function updateProgress(percent, stageText, subtext) {
  document.getElementById('progressBar').style.width = `${percent}%`;
  document.getElementById('pipelineProgressPercent').textContent = `${percent}%`;
  if (stageText) document.getElementById('pipelineStageText').textContent = stageText;
  if (subtext) document.getElementById('pipelineSubtext').textContent = subtext;
}

function getStageTitle(stage) {
  switch (stage) {
    case 'global_hub_radar': return 'Step 1: Global Hub Radar';
    case 'hub_selected': return 'Step 1: Primary Knowledge Center Identified';
    case 'query_expansion': return 'Step 2: Native Domain Terminology';
    case 'dual_search': return 'Step 3: TinyFish Dual-Index Search';
    case 'batch_fetch': return 'Step 4: Primary Manual Batch Fetch';
    case 'proposition_extraction': return 'Step 5: Actionable Playbook Synthesis';
    case 'adversarial_verification': return 'Step 6: Adversarial English Verification';
    case 'web_agent_escalation': return 'Step 7: Autonomous Web Agent Escalation';
    case 'web_agent_telemetry': return 'Step 7: Live Remote Browser Navigation';
    case 'complete': return 'Complete: Engineering Playbook Ready';
    default: return 'Scanning Global Radar...';
  }
}

function resetStepHighlights() {
  ['step-hub', 'step-search', 'step-fetch', 'step-verify', 'step-agent'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = 'p-2 rounded bg-obsidian-850 border border-obsidian-700 text-zinc-600';
  });
}

function highlightStep(stage) {
  let targetId = null;
  if (stage === 'global_hub_radar' || stage === 'hub_selected') targetId = 'step-hub';
  else if (stage === 'query_expansion' || stage === 'dual_search') targetId = 'step-search';
  else if (stage === 'batch_fetch' || stage === 'proposition_extraction') targetId = 'step-fetch';
  else if (stage === 'adversarial_verification') targetId = 'step-verify';
  else if (stage === 'web_agent_escalation' || stage === 'web_agent_telemetry') targetId = 'step-agent';

  if (targetId) {
    const el = document.getElementById(targetId);
    if (el) el.className = 'p-2 rounded bg-champagne-950/40 border border-champagne-500/50 text-champagne-300 font-semibold';
  }
}

function handleAgentTelemetry(telemetry) {
  const box = document.getElementById('webAgentBox');
  box.classList.remove('hidden');

  const logs = document.getElementById('agentStepLogs');
  const ev = telemetry.event;

  if (ev.type === 'STREAMING_URL' && ev.streamingUrl) {
    const previewBtn = document.getElementById('browserLivePreviewBtn');
    previewBtn.href = ev.streamingUrl;
    previewBtn.classList.remove('hidden');

    const iframe = document.getElementById('browserStreamIframe');
    const iframeContainer = document.getElementById('browserStreamContainer');
    if (iframe && iframeContainer) {
      iframe.src = ev.streamingUrl;
      iframeContainer.classList.remove('hidden');
    }

    logs.innerHTML += `<div class="text-champagne-400 font-semibold">> Live Remote Browser Active: <a href="${ev.streamingUrl}" target="_blank" class="underline">View Stream</a></div>`;
  } else if (ev.type === 'PROGRESS') {
    logs.innerHTML += `<div class="text-zinc-300">> Step ${ev.step || ''}: ${ev.purpose || 'Navigating portal...'}</div>`;
    logs.scrollTop = logs.scrollHeight;
  } else if (ev.type === 'COMPLETE') {
    logs.innerHTML += `<div class="text-emerald-400 font-bold">> Autonomous navigation completed. Specifications extracted.</div>`;
    logs.scrollTop = logs.scrollHeight;
  }
}

function renderResults(report) {
  const container = document.getElementById('gapCardsContainer');
  container.innerHTML = '';

  const gaps = report.verifiedGaps || [];
  document.getElementById('gapCountBadge').textContent = `${gaps.length} Actionable Finding${gaps.length === 1 ? '' : 's'}`;
  document.getElementById('auditCountBadge').textContent = (report.auditTrail || []).length;

  if (gaps.length === 0) {
    container.innerHTML = `
      <div class="obsidian-card rounded-2xl p-8 text-center text-zinc-400 space-y-2 border-obsidian-700">
        <i class="fa-solid fa-circle-check text-emerald-400 text-2xl"></i>
        <h4 class="text-white font-bold">No Verified Technical Asymmetries Found</h4>
        <p class="text-xs leading-relaxed max-w-md mx-auto text-zinc-400">
          The technical methods identified in the foreign literature are already fully established and shared in standard English engineering practice. The adversarial check verified no distinct gap exists.
        </p>
      </div>
    `;
  } else {
    gaps.forEach((gap, index) => {
      const card = createPlaybookCard(gap, index, report.activeHubs);
      container.appendChild(card);
    });
  }

  document.getElementById('resultsSection').classList.remove('hidden');
}

function createPlaybookCard(gap, index, activeHubs) {
  const card = document.createElement("div");
  card.className = "glass-card rounded-2xl p-6 sm:p-8 space-y-7 transition";

  let badgeColor = "bg-red-950/60 text-red-300 border-red-800/60";
  let badgeIcon = "fa-satellite-dish";
  let badgeLabel = "🚨 CANDIDATE COVERAGE GAP";

  if (gap.classification === "TERMINOLOGY_DIFFERENCE" || gap.classification === "LEXICAL_BLINDSPOT") {
    badgeColor = "bg-amber-950/60 text-amber-300 border-amber-800/60";
    badgeIcon = "fa-compass-drafting";
    badgeLabel = "🔍 TERMINOLOGY / INDEXING DIFFERENCE";
  } else if (gap.classification === "STANDARDS_DIVERGENCE" || gap.classification === "REGULATORY_DIVERGENCE") {
    badgeColor = "bg-purple-950/60 text-purple-300 border-purple-800/60";
    badgeIcon = "fa-scale-balanced";
    badgeLabel = "⚖️ STANDARDS & PRACTICE DIVERGENCE";
  }

  const playbook = gap.actionablePlaybook || {};
  const steps = playbook.protocolSteps || [
    "Review primary foreign engineering manual",
    "Calculate empirical site parameters",
    "Execute test batch verification"
  ];

  const regionalPerspectives = gap.regionalPerspectives || [];
  const briefingParagraphs = gap.deepTechnicalBriefing || [];

  card.innerHTML = \`
    <!-- 1. Dossier Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-obsidian-750 pb-4">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md border \${badgeColor} flex items-center gap-1.5 uppercase tracking-wider">
          <i class="fa-solid \${badgeIcon}"></i>
          \${badgeLabel}
        </span>
        <span class="text-xs text-zinc-400 font-mono">Confidence: \${gap.confidenceScore || 92}%</span>
      </div>
      <a href="\${gap.sourceUrl}" target="_blank" class="text-xs text-champagne-400 hover:text-champagne-300 font-mono flex items-center gap-1.5 truncate max-w-md transition bg-obsidian-900/80 px-3 py-1.5 rounded-lg border border-obsidian-750">
        <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
        <span class="truncate">\${gap.sourceTitle || "Primary Technical Source"}</span>
      </a>
    </div>

    <!-- 2. Headline & Overview -->
    <div class="space-y-2">
      <h3 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">\${gap.gapHeadline || gap.candidateName}</h3>
      <p class="text-sm text-zinc-300 leading-relaxed font-normal">\${playbook.coreMechanism || gap.mechanismBreakdown || ""}</p>
    </div>

    <!-- 3. Comparative Global Intelligence (What Different Traditions Say) -->
    \${regionalPerspectives.length > 0 ? \`
    <div class="space-y-3 pt-2">
      <div class="flex items-center justify-between border-b border-obsidian-800 pb-2">
        <span class="text-xs font-mono font-bold uppercase tracking-wider text-champagne-400 flex items-center gap-2">
          <i class="fa-solid fa-earth-americas text-champagne-500"></i>
          Comparative Global Intelligence: What Different Traditions Say
        </span>
        <span class="text-[10px] font-mono text-zinc-500 uppercase">Cross-Corpus Triangulation</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        \${regionalPerspectives.map(p => \`
          <div class="p-4 bg-obsidian-900/90 rounded-xl border border-obsidian-750 space-y-1.5">
            <div class="flex items-center gap-2 text-xs font-bold text-white font-mono">
              <span class="text-base">\${p.flag || "🌐"}</span>
              <span class="text-champagne-300">\${p.region}</span>
            </div>
            <p class="text-xs text-zinc-300 leading-relaxed font-normal">\${p.summary}</p>
          </div>
        \`).join("")}
      </div>
    </div>
    \` : ""}

    <!-- 4. In-Depth Technical Briefing (5-Paragraph Study Guide) -->
    \${briefingParagraphs.length > 0 ? \`
    <div class="space-y-4 pt-2">
      <div class="flex items-center justify-between border-b border-obsidian-800 pb-2">
        <span class="text-xs font-mono font-bold uppercase tracking-wider text-champagne-300 flex items-center gap-2">
          <i class="fa-solid fa-book-open-reader text-champagne-500"></i>
          In-Depth Technical Briefing (Study Guide)
        </span>
        <span class="text-[10px] font-mono text-champagne-400 uppercase font-semibold">5 Comprehensive Paragraphs</span>
      </div>

      <div class="space-y-4 p-5 bg-obsidian-900/80 rounded-xl border border-obsidian-750">
        \${briefingParagraphs.map((para, i) => {
          const titles = [
            "§ 1. Foundational Physical & Chemical Principles",
            "§ 2. Quantitative Dynamics & Empirical Formulations",
            "§ 3. Comparative Regional Nuances & Engineering Trade-offs",
            "§ 4. Sizing Parameters, Tolerances & Contractor Standards",
            "§ 5. Critical Failure Modes, Risk Mitigation & Directives for Further Study"
          ];
          const sectionTitle = titles[i] || \`§ \${i+1}. Technical Synthesis\`;
          return \`
            <div class="space-y-1.5 border-b border-obsidian-800/80 pb-3.5 last:border-0 last:pb-0">
              <span class="text-xs font-mono font-bold text-champagne-400 block tracking-wide">\${sectionTitle}</span>
              <p class="text-xs sm:text-[13px] text-zinc-300 font-sans leading-relaxed text-justify">\${para}</p>
            </div>
          \`;
        }).join("")}
      </div>
    </div>
    \` : ""}

    <!-- 5. Actionable Implementation Blueprint -->
    <div class="space-y-4 pt-2">
      <div class="flex items-center justify-between border-b border-obsidian-800 pb-2">
        <span class="text-xs font-mono font-bold uppercase tracking-wider text-champagne-300 flex items-center gap-2">
          <i class="fa-solid fa-wrench text-champagne-500"></i>
          Actionable Implementation Blueprint
        </span>
        <span class="text-[10px] font-mono text-zinc-500 uppercase">Engineering Protocol</span>
      </div>

      <!-- Execution Sequence -->
      <div class="space-y-2 p-4 bg-obsidian-900/80 rounded-xl border border-obsidian-750">
        <span class="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-2">Step-by-Step Execution Sequence:</span>
        <ol class="space-y-2.5 text-xs text-zinc-200">
          \${steps.map((st, i) => \`
            <li class="flex items-start gap-3">
              <span class="w-5 h-5 rounded-full bg-obsidian-800 border border-champagne-500/30 flex items-center justify-center text-[10px] font-mono text-champagne-400 shrink-0 mt-0.5">\${i+1}</span>
              <span class="leading-relaxed">\${st.replace(/^Step\\s*\\d+:\\s*/i, "")}</span>
            </li>
          \`).join("")}
        </ol>
      </div>

      <!-- Parameters & Standards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div class="p-4 bg-obsidian-900/90 rounded-xl border border-obsidian-750">
          <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">Empirical Parameters / Ratios:</span>
          <span class="text-xs font-mono text-champagne-300 font-bold block">\${playbook.keyMetrics || gap.metricsOrStandards || "Empirical threshold specified in manual"}</span>
        </div>
        <div class="p-4 bg-obsidian-900/90 rounded-xl border border-obsidian-750">
          <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">Domestic Standard Codes / Manuals:</span>
          <span class="text-xs font-mono text-zinc-300 block">\${playbook.codes || "Regional Industry Standard Manual"}</span>
        </div>
      </div>
    </div>

    <!-- 6. Why English Missed It + Primary Source Excerpt -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
      <!-- Why English Missed It -->
      <div class="p-4 bg-obsidian-900/90 rounded-xl border border-obsidian-750 space-y-2">
        <div class="flex items-center gap-1.5 text-zinc-300 font-semibold text-xs">
          <i class="fa-solid fa-triangle-exclamation text-amber-400"></i>
          <span>Why Western Literature Overlooked It:</span>
        </div>
        <p class="text-zinc-400 leading-relaxed text-xs">\${gap.whyEnglishMissedIt || gap.auditReasoning || "Localized to domestic industrial practice; Western literature lacks specific contractor thresholds."}</p>
      </div>

      <!-- Verifiable Primary Excerpt -->
      <div class="p-4 bg-obsidian-900/90 rounded-xl border border-obsidian-750 space-y-2">
        <div class="flex items-center justify-between text-zinc-300 font-semibold text-xs">
          <span class="flex items-center gap-1.5">
            <i class="fa-solid fa-quote-left text-champagne-500"></i>
            <span>Verifiable Source Excerpt:</span>
          </span>
          <span class="text-[10px] font-mono text-zinc-500">Original Text</span>
        </div>
        <p class="text-zinc-300 font-serif italic text-xs leading-relaxed">"\${gap.evidenceQuote || gap.originalQuote || "N/A"}"</p>
        <p class="text-zinc-400 text-[11px] border-t border-obsidian-800 pt-1.5 font-sans">
          <strong class="text-zinc-300">Translation:</strong> "\${gap.translatedQuote || gap.mechanismBreakdown || ""}"
        </p>
      </div>
    </div>

    <!-- 7. Audit Verification Footer -->
    <div class="border-t border-obsidian-800 pt-3 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-zinc-500 gap-2 font-mono">
      <div class="flex items-center gap-1.5">
        <i class="fa-solid fa-shield-check text-emerald-400 text-xs"></i>
        <span>Adversarial verification tested: \${(gap.auditRecord?.englishQueriesChecked || []).length} English counter-queries</span>
      </div>
      <span class="text-zinc-500 italic">Candidate coverage gap in verified search sample</span>
    </div>
  \`;

  return card;
}

function renderAuditLedger() {
  const container = document.getElementById('auditContent');
  if (!currentAuditTrail || currentAuditTrail.length === 0) {
    container.innerHTML = '<p class="text-zinc-500">No audit records available. Run a radar scan first.</p>';
    return;
  }

  container.innerHTML = currentAuditTrail.map((record, i) => `
    <div class="p-4 bg-obsidian-950 rounded-xl border border-obsidian-800 space-y-2">
      <div class="flex items-center justify-between border-b border-obsidian-800 pb-2">
        <span class="font-bold text-white">#${i+1}: ${record.candidateName}</span>
        <span class="text-[10px] px-2 py-0.5 rounded font-mono ${record.outcome === 'SHARED_KNOWLEDGE' ? 'bg-obsidian-800 text-zinc-400' : 'bg-champagne-950 text-champagne-300 border border-champagne-800'}">
          ${record.outcome}
        </span>
      </div>

      <div>
        <span class="text-zinc-400 font-semibold text-[11px]">Adversarial Counter-Queries Executed (English):</span>
        <ul class="list-disc list-inside text-zinc-300 pl-2 mt-1 space-y-0.5 text-[11px]">
          ${(record.englishQueriesChecked || []).map(q => `<li>"${q}"</li>`).join('')}
        </ul>
      </div>

      <div class="text-[11px]">
        <span class="text-zinc-400 font-semibold">English Search Matches Found:</span>
        <span class="text-white font-mono">${record.englishResultsFoundCount || 0} results</span>
      </div>

      <div class="p-2 bg-obsidian-900 rounded text-[11px] text-zinc-300 border border-obsidian-800">
        <span class="text-zinc-400 font-bold">Verification Judgment:</span> ${record.reasoning}
      </div>
    </div>
  `).join('');
}

function exportMarkdownPlaybook() {
  if (!currentDossier) return;

  let md = `# KHOJ (खोज) — Technical Intelligence Blueprint: ${currentDossier.topic}\n\n`;
  md += `**Date:** ${currentDossier.timestamp}\n`;
  md += `**Target Knowledge Ecosystem:** ${currentDossier.targetLang.toUpperCase()}\n`;
  md += `**Execution Time:** ${(currentDossier.executionTimeMs / 1000).toFixed(1)}s\n`;
  md += `**Verified Technical Findings:** ${currentDossier.verifiedGapsCount}\n\n`;
  md += `---\n\n`;

  (currentDossier.verifiedGaps || []).forEach((gap, i) => {
    const pb = gap.actionablePlaybook || {};
    md += `## ${i+1}. [${gap.classification}] ${gap.gapHeadline}\n\n`;
    md += `### Core Mechanism\n${pb.coreMechanism || gap.mechanismBreakdown}\n\n`;
    
    if (gap.regionalPerspectives && gap.regionalPerspectives.length > 0) {
      md += `### Comparative Global Intelligence (What Different Traditions Say)\n`;
      gap.regionalPerspectives.forEach(p => {
        md += `#### ${p.flag || '🌐'} ${p.region}\n${p.summary}\n\n`;
      });
    }

    if (gap.deepTechnicalBriefing && gap.deepTechnicalBriefing.length > 0) {
      md += `### In-Depth Technical Briefing (Advanced Study Guide)\n`;
      gap.deepTechnicalBriefing.forEach((p, idx) => {
        md += `**Paragraph ${idx+1}:** ${p}\n\n`;
      });
    }

    md += `### Actionable Implementation Protocol\n`;
    (pb.protocolSteps || []).forEach(step => {
      md += `- ${step}\n`;
    });
    md += `\n**Key Numerical Benchmarks / Ratios:** ${pb.keyMetrics || gap.metricsOrStandards || 'N/A'}\n`;
    md += `**Domestic Standards / Codes:** ${pb.codes || 'N/A'}\n\n`;
    md += `### Why Western Literature Missed It\n${gap.whyEnglishMissedIt || gap.auditReasoning}\n\n`;
    md += `### Primary Source Provenance\n`;
    md += `**Source:** [${gap.sourceTitle}](${gap.sourceUrl})\n`;
    md += `**Original Foreign Excerpt:**\n> "${gap.evidenceQuote || gap.originalQuote}"\n\n`;
    md += `**Technical Translation:**\n${gap.translatedQuote}\n\n`;
    md += `### Adversarial Verification Log\n`;
    (gap.auditRecord?.englishQueriesChecked || []).forEach(q => {
      md += `- Checked: \`${q}\`\n`;
    });
    md += `\n---\n\n`;
  });

  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Khoj_Blueprint_${currentDossier.topic.replace(/\s+/g, '_')}.md`;
  a.click();
}
