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
      ? `${currentResults.length} proyecto${currentResults.length === 1 ? "" : "s"} encontrado${currentResults.length === 1 ? "" : "s"}` +
        (currentQuery ? ` para «${currentQuery}»` : " (índice curado)")
      : "Sin resultados para esta combinación.";
    currentResults.forEach(item => grid.appendChild(card(item)));
  }

  const STATUS_CLASS = { "Activo": "status-active", "Mantenido": "status-maintained", "Poca actividad": "status-low" };
  const DIFF_DOTS = { "Principiante": "●○○", "Intermedio": "●●○", "Avanzado": "●●●" };

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
        <span title="Dificultad: ${item.difficulty}">Dificultad <span class="diff-dots"></span></span>
      </div>
      <div class="result-actions">
        <a class="btn btn-ghost" target="_blank" rel="noopener">Abrir fuente ↗</a>
        <button class="btn btn-premium btn-analyze" type="button">🔒 Análisis IA</button>
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
      openModal("Análisis IA: " + item.name,
        `La capa premium de IA explica qué hace ${item.name}, si tiene mantenimiento activo, ` +
        `sus riesgos, las implicaciones de su licencia (${item.license}), la complejidad de instalación y cómo podría ` +
        `encajar en tu producto o flujo de trabajo. Activa premium para desbloquear el análisis completo.`));
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
    let md = `# Repository Tech Radar — exportación\n\nBúsqueda: ${currentQuery || "(índice curado)"} · ${items.length} proyectos · ${new Date().toISOString().slice(0, 10)}\n\n`;
    items.forEach(i => {
      md += `## ${i.name} (${i.source})\n\n${i.desc}\n\n` +
        `- **Lenguaje:** ${i.language} · **Licencia:** ${i.license} · **Estrellas:** ${RadarData.formatStars(i.stars)}\n` +
        `- **Estado:** ${i.status} · **Dificultad:** ${i.difficulty} · **Actualizado:** ${i.updated}\n` +
        `- **Caso de uso:** ${i.useCase}\n- **Enlace:** ${i.url}\n\n`;
    });
    return md;
  }

  function pdfReport(items) {
    const w = window.open("", "_blank");
    if (!w) { openModal("Informe bloqueado", "Tu navegador bloqueó la ventana del informe. Permite las ventanas emergentes para esta página e inténtalo de nuevo."); return; }
    const rows = items.map(i =>
      `<tr><td><strong>${i.name}</strong><br><small>${i.source}</small></td><td>${i.desc}</td>` +
      `<td>${i.language}<br>${i.license}</td><td>${i.status}<br>★ ${RadarData.formatStars(i.stars)}</td></tr>`).join("");
    w.document.write(`<!DOCTYPE html><html><head><title>Informe Tech Radar</title><style>
      body{font-family:Segoe UI,Arial,sans-serif;margin:2rem;color:#111}
      h1{font-size:1.4rem} table{border-collapse:collapse;width:100%;font-size:.85rem}
      td,th{border:1px solid #ccc;padding:.5rem;text-align:left;vertical-align:top}
      th{background:#f1f5f9} small{color:#555}
      @media print{button{display:none}}</style></head><body>
      <h1>Repository Tech Radar — Informe</h1>
      <p>Búsqueda: <strong>${currentQuery || "índice curado"}</strong> · ${items.length} proyectos · ${new Date().toLocaleDateString()}</p>
      <table><tr><th>Proyecto</th><th>Descripción</th><th>Stack / Licencia</th><th>Salud</th></tr>${rows}</table>
      <p><button onclick="window.print()">Imprimir / Guardar como PDF</button></p></body></html>`);
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
        " Esta función forma parte de la capa premium de IA — actívala con un código de licencia o tu propia clave de API."));
  });

  /* ---- initial render: curated highlights ---- */
  currentResults = RadarData.search("", {}).slice(0, 6);
  render();
  countEl.textContent = "Mostrando 6 proyectos destacados — ejecuta una búsqueda para explorar todo el índice.";
})();
