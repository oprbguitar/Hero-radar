/* Repository Tech Radar — landing page behavior */

(function () {
  "use strict";

  const $ = sel => document.querySelector(sel);
  const grid = $("#resultsGrid");
  const emptyMsg = $("#resultsEmpty");
  const countEl = $("#resultsCount");
  const input = $("#searchInput");
  const filtersBox = $("#filters");

  let currentResults = [];
  let currentQuery = "";

  /* ---- nav (mobile) ---- */
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open);
  });
  navLinks.addEventListener("click", e => {
    if (e.target.tagName === "A") navLinks.classList.remove("open");
  });

  /* ---- filters ---- */
  const facets = RadarData.facets();
  filtersBox.querySelectorAll("select").forEach(sel => {
    const key = sel.dataset.filter;
    (facets[key] || []).forEach(v => {
      const opt = document.createElement("option");
      opt.value = v; opt.textContent = v;
      sel.appendChild(opt);
    });
    sel.addEventListener("change", runSearch);
  });
  $("#clearFilters").addEventListener("click", () => {
    filtersBox.querySelectorAll("select").forEach(s => (s.value = "all"));
    runSearch();
  });

  function activeFilters() {
    const f = {};
    filtersBox.querySelectorAll("select").forEach(s => (f[s.dataset.filter] = s.value));
    return f;
  }

  /* ---- search ---- */
  $("#searchForm").addEventListener("submit", e => {
    e.preventDefault();
    runSearch();
  });

  document.querySelectorAll(".query-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".query-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      input.value = chip.dataset.q;
      runSearch();
      grid.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });

  function runSearch() {
    currentQuery = input.value.trim();
    currentResults = RadarData.search(currentQuery, activeFilters());
    render();
  }

  function render() {
    grid.innerHTML = "";
    emptyMsg.hidden = currentResults.length > 0;
    countEl.textContent = currentResults.length
      ? `${currentResults.length} project${currentResults.length === 1 ? "" : "s"} found` +
        (currentQuery ? ` for “${currentQuery}”` : " (curated index)")
      : "No results for this combination.";
    currentResults.forEach(item => grid.appendChild(card(item)));
  }

  const STATUS_CLASS = { "Active": "status-active", "Maintained": "status-maintained", "Low activity": "status-low" };
  const DIFF_DOTS = { "Beginner": "●○○", "Intermediate": "●●○", "Advanced": "●●●" };

  function card(item) {
    const el = document.createElement("article");
    el.className = "result-card";
    el.innerHTML = `
      <div class="result-top">
        <span class="result-name"></span>
        <span class="chip chip-github"></span>
      </div>
      <p class="result-desc"></p>
      <div class="result-tags"></div>
      <div class="result-meta">
        <span><strong class="m-lang"></strong></span>
        <span>⚖ <span class="m-license"></span></span>
        <span>★ <strong class="m-stars"></strong></span>
        <span>⟳ <span class="m-updated"></span></span>
        <span class="status-pill"></span>
        <span title="Difficulty: ${item.difficulty}">Difficulty <span class="diff-dots"></span></span>
      </div>
      <div class="result-actions">
        <a class="btn btn-ghost" target="_blank" rel="noopener">Open source ↗</a>
        <button class="btn btn-premium btn-analyze" type="button">🔒 AI analysis</button>
      </div>`;
    el.querySelector(".result-name").textContent = item.name;
    el.querySelector(".chip").textContent = item.source;
    el.querySelector(".result-desc").textContent = item.desc;
    const tags = el.querySelector(".result-tags");
    item.tags.slice(0, 4).forEach(t => {
      const s = document.createElement("span");
      s.className = "tag"; s.textContent = t;
      tags.appendChild(s);
    });
    el.querySelector(".m-lang").textContent = item.language;
    el.querySelector(".m-license").textContent = item.license;
    el.querySelector(".m-stars").textContent = RadarData.formatStars(item.stars);
    el.querySelector(".m-updated").textContent = item.updated;
    const pill = el.querySelector(".status-pill");
    pill.textContent = item.status;
    pill.classList.add(STATUS_CLASS[item.status] || "status-maintained");
    el.querySelector(".diff-dots").textContent = DIFF_DOTS[item.difficulty] || "●○○";
    el.querySelector("a").href = item.url;
    el.querySelector(".btn-analyze").addEventListener("click", () =>
      openModal("AI analysis: " + item.name,
        `The premium AI layer explains what ${item.name} does, whether it is actively maintained, ` +
        `its risks, license implications (${item.license}), installation complexity and how it could ` +
        `fit your product or workflow. Activate premium to unlock the full analysis.`));
    return el;
  }

  /* ---- exports ---- */
  const EXPORT_FIELDS = ["name", "source", "desc", "language", "license", "updated", "stars", "difficulty", "status", "type", "useCase", "url"];

  function exportData() {
    return currentResults.length ? currentResults : RadarData.items;
  }

  function download(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  }

  function toCSV(items) {
    const esc = v => `"${String(v).replace(/"/g, '""')}"`;
    const rows = [EXPORT_FIELDS.join(",")];
    items.forEach(i => rows.push(EXPORT_FIELDS.map(f => esc(f === "desc" ? i.desc : i[f])).join(",")));
    return rows.join("\n");
  }

  function toMarkdown(items) {
    let md = `# Repository Tech Radar — export\n\nQuery: ${currentQuery || "(curated index)"} · ${items.length} projects · ${new Date().toISOString().slice(0, 10)}\n\n`;
    items.forEach(i => {
      md += `## ${i.name} (${i.source})\n\n${i.desc}\n\n` +
        `- **Language:** ${i.language} · **License:** ${i.license} · **Stars:** ${RadarData.formatStars(i.stars)}\n` +
        `- **Status:** ${i.status} · **Difficulty:** ${i.difficulty} · **Updated:** ${i.updated}\n` +
        `- **Use case:** ${i.useCase}\n- **Link:** ${i.url}\n\n`;
    });
    return md;
  }

  function pdfReport(items) {
    const w = window.open("", "_blank");
    if (!w) { openModal("Report blocked", "Your browser blocked the report window. Allow pop-ups for this page and try again."); return; }
    const rows = items.map(i =>
      `<tr><td><strong>${i.name}</strong><br><small>${i.source}</small></td><td>${i.desc}</td>` +
      `<td>${i.language}<br>${i.license}</td><td>${i.status}<br>★ ${RadarData.formatStars(i.stars)}</td></tr>`).join("");
    w.document.write(`<!DOCTYPE html><html><head><title>Tech Radar Report</title><style>
      body{font-family:Segoe UI,Arial,sans-serif;margin:2rem;color:#111}
      h1{font-size:1.4rem} table{border-collapse:collapse;width:100%;font-size:.85rem}
      td,th{border:1px solid #ccc;padding:.5rem;text-align:left;vertical-align:top}
      th{background:#f1f5f9} small{color:#555}
      @media print{button{display:none}}</style></head><body>
      <h1>Repository Tech Radar — Report</h1>
      <p>Query: <strong>${currentQuery || "curated index"}</strong> · ${items.length} projects · ${new Date().toLocaleDateString()}</p>
      <table><tr><th>Project</th><th>Description</th><th>Stack / License</th><th>Health</th></tr>${rows}</table>
      <p><button onclick="window.print()">Print / Save as PDF</button></p></body></html>`);
    w.document.close();
  }

  $("#exportRow").addEventListener("click", e => {
    const fmt = e.target.dataset.export;
    if (!fmt) return;
    const items = exportData();
    const stamp = new Date().toISOString().slice(0, 10);
    if (fmt === "csv") download(`tech-radar-${stamp}.csv`, toCSV(items), "text/csv");
    else if (fmt === "json") download(`tech-radar-${stamp}.json`, JSON.stringify(items, null, 2), "application/json");
    else if (fmt === "md") download(`tech-radar-${stamp}.md`, toMarkdown(items), "text/markdown");
    else if (fmt === "pdf") pdfReport(items);
  });

  /* ---- premium modal ---- */
  const modal = $("#premiumModal");
  const modalTitle = $("#modalTitle");
  const modalBody = $("#modalBody");

  function openModal(title, body) {
    modalTitle.textContent = title;
    modalBody.textContent = body;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }
  modal.addEventListener("click", e => { if (e.target.hasAttribute("data-close")) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  document.querySelectorAll(".premium-card").forEach(cardEl => {
    cardEl.addEventListener("click", () =>
      openModal(cardEl.dataset.feature,
        cardEl.querySelector("p").textContent +
        " This feature is part of the premium AI layer — activate it with a license code or your own API key."));
  });

  /* ---- initial render: curated highlights ---- */
  currentResults = RadarData.search("", {}).slice(0, 6);
  render();
  countEl.textContent = "Showing 6 curated highlights — run a search to explore the full index.";
})();
