/* Repository Tech Radar — extension popup logic.
   Uses chrome.storage.local when available, localStorage otherwise (so the
   popup can also be previewed as a plain page). */

(function () {
  "use strict";

  const $ = sel => document.querySelector(sel);
  const $$ = sel => document.querySelectorAll(sel);

  /* ---- storage layer ---- */
  const store = {
    async get(key, fallback) {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        const res = await chrome.storage.local.get(key);
        return res[key] !== undefined ? res[key] : fallback;
      }
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    },
    async set(key, value) {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        return chrome.storage.local.set({ [key]: value });
      }
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  let saved = {};        // id -> { item, category, favorite }
  let premium = false;
  let sourceFilter = "all";

  /* ---- tabs ---- */
  $$(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      $$(".tab").forEach(t => t.classList.remove("active"));
      $$(".panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      $("#panel-" + tab.dataset.tab).classList.add("active");
      if (tab.dataset.tab === "saved") renderSaved();
    });
  });

  /* ---- search ---- */
  $("#searchForm").addEventListener("submit", e => {
    e.preventDefault();
    renderResults();
  });

  $("#sourceChips").addEventListener("click", e => {
    const chip = e.target.closest(".fchip");
    if (!chip) return;
    $$("#sourceChips .fchip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    sourceFilter = chip.dataset.source;
    renderResults();
  });

  $("#suggestChips").addEventListener("click", e => {
    const chip = e.target.closest(".qchip");
    if (!chip) return;
    $("#searchInput").value = chip.dataset.q;
    renderResults();
  });

  function renderResults() {
    const q = $("#searchInput").value.trim();
    const results = RadarData.search(q, { source: sourceFilter }).slice(0, 12);
    const list = $("#resultsList");
    list.innerHTML = "";
    $("#searchHint").textContent = results.length
      ? `${results.length} proyecto${results.length === 1 ? "" : "s"} encontrado${results.length === 1 ? "" : "s"}${q ? ` para «${q}»` : ""}.`
      : "Sin coincidencias — prueba otra palabra clave u otra fuente.";
    results.forEach(item => list.appendChild(resultItem(item)));
  }

  function resultItem(item) {
    const el = document.createElement("div");
    el.className = "item";
    el.innerHTML = `
      <div class="item-top"><span class="item-name"></span><span class="item-src"></span></div>
      <p class="item-desc"></p>
      <div class="item-meta">
        <span class="m-lang"></span><span>⚖ <span class="m-lic"></span></span>
        <span>★ <span class="m-stars"></span></span>
        <span class="status"></span><span class="m-diff"></span>
      </div>
      <div class="item-actions">
        <a class="abtn" target="_blank" rel="noopener">Abrir ↗</a>
        <button class="abtn save-btn">📌 Guardar</button>
        <button class="abtn fav-btn">☆ Fav</button>
        <button class="abtn ai ai-btn">🔒 IA</button>
      </div>`;
    el.querySelector(".item-name").textContent = item.name;
    el.querySelector(".item-src").textContent = item.source;
    el.querySelector(".item-desc").textContent = item.desc;
    el.querySelector(".m-lang").textContent = item.language;
    el.querySelector(".m-lic").textContent = item.license;
    el.querySelector(".m-stars").textContent = RadarData.formatStars(item.stars);
    const st = el.querySelector(".status");
    st.textContent = item.status;
    st.classList.add({ "Activo": "Active", "Mantenido": "Maintained", "Poca actividad": "Low" }[item.status] || "Maintained");
    el.querySelector(".m-diff").textContent = item.difficulty;
    el.querySelector("a").href = item.url;

    const saveBtn = el.querySelector(".save-btn");
    const favBtn = el.querySelector(".fav-btn");
    syncButtons();

    saveBtn.addEventListener("click", async () => {
      if (saved[item.id]) delete saved[item.id];
      else saved[item.id] = { item, category: "Por evaluar", favorite: false };
      await persist();
      syncButtons();
    });
    favBtn.addEventListener("click", async () => {
      if (!saved[item.id]) saved[item.id] = { item, category: "Por evaluar", favorite: true };
      else saved[item.id].favorite = !saved[item.id].favorite;
      await persist();
      syncButtons();
    });
    el.querySelector(".ai-btn").addEventListener("click", () => aiAnalysis(item));

    function syncButtons() {
      const entry = saved[item.id];
      saveBtn.textContent = entry ? "📌 Guardado" : "📌 Guardar";
      saveBtn.classList.toggle("saved", !!entry);
      favBtn.textContent = entry && entry.favorite ? "★ Fav" : "☆ Fav";
      favBtn.classList.toggle("fav", !!(entry && entry.favorite));
    }
    return el;
  }

  function aiAnalysis(item) {
    if (!premium) {
      $$(".tab").forEach(t => t.classList.remove("active"));
      $$(".panel").forEach(p => p.classList.remove("active"));
      document.querySelector('[data-tab="premium"]').classList.add("active");
      $("#panel-premium").classList.add("active");
      setMsg(`El análisis IA de «${item.name}» es una función premium. Actívala abajo para desbloquearla.`, "err");
      return;
    }
    alert(
      `Análisis IA — ${item.name}\n\n` +
      `Resumen: ${item.desc}\n\n` +
      `Salud: ${item.status}, última actualización ${item.updated}.\n` +
      `Licencia: ${item.license} — revisa las condiciones de reutilización antes de integrarlo comercialmente.\n` +
      `Dificultad: ${item.difficulty}. Mejor encaje: ${item.useCase}.\n\n` +
      `(Salida de demostración — conecta un proveedor de IA real para el análisis completo.)`
    );
  }

  /* ---- saved tab ---- */
  async function persist() {
    await store.set("radar_saved", saved);
    $("#savedCount").textContent = Object.keys(saved).length;
  }

  function renderSaved() {
    const list = $("#savedList");
    const filter = $("#savedFilter").value;
    list.innerHTML = "";
    const entries = Object.values(saved).filter(e => filter === "all" || e.category === filter);
    $("#savedEmpty").style.display = entries.length ? "none" : "block";
    entries.sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));
    entries.forEach(entry => {
      const el = document.createElement("div");
      el.className = "item";
      el.innerHTML = `
        <div class="item-top"><span class="item-name"></span><span class="item-src"></span></div>
        <div class="item-meta"><span class="m-lang"></span><span>⚖ <span class="m-lic"></span></span><span class="m-fav"></span></div>
        <select class="cat-select">
          <option>Por evaluar</option><option>Para un proyecto</option>
          <option>Aprendizaje</option><option>Trabajo con clientes</option>
        </select>
        <div class="item-actions">
          <a class="abtn" target="_blank" rel="noopener">Abrir ↗</a>
          <button class="abtn remove-btn">🗑 Quitar</button>
        </div>`;
      el.querySelector(".item-name").textContent = (entry.favorite ? "★ " : "") + entry.item.name;
      el.querySelector(".item-src").textContent = entry.item.source;
      el.querySelector(".m-lang").textContent = entry.item.language;
      el.querySelector(".m-lic").textContent = entry.item.license;
      el.querySelector(".m-fav").textContent = entry.category;
      el.querySelector("a").href = entry.item.url;
      const sel = el.querySelector(".cat-select");
      sel.value = entry.category;
      sel.addEventListener("change", async () => {
        entry.category = sel.value;
        await persist();
        renderSaved();
      });
      el.querySelector(".remove-btn").addEventListener("click", async () => {
        delete saved[entry.item.id];
        await persist();
        renderSaved();
      });
      list.appendChild(el);
    });
  }

  $("#savedFilter").addEventListener("change", renderSaved);

  function download(filename, content, mime) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: mime }));
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  $("#exportSavedJson").addEventListener("click", () => {
    const data = Object.values(saved).map(e => ({ ...e.item, category: e.category, favorite: e.favorite }));
    download("tech-radar-saved.json", JSON.stringify(data, null, 2), "application/json");
  });

  $("#exportSavedCsv").addEventListener("click", () => {
    const fields = ["name", "source", "language", "license", "status", "difficulty", "category", "favorite", "url"];
    const esc = v => `"${String(v).replace(/"/g, '""')}"`;
    const rows = [fields.join(",")];
    Object.values(saved).forEach(e => {
      const flat = { ...e.item, category: e.category, favorite: e.favorite };
      rows.push(fields.map(f => esc(flat[f])).join(","));
    });
    download("tech-radar-saved.csv", rows.join("\n"), "text/csv");
  });

  /* ---- premium tab ---- */
  function setMsg(text, cls) {
    const msg = $("#activateMsg");
    msg.textContent = text;
    msg.className = "hint " + (cls || "");
  }

  $("#activateBtn").addEventListener("click", async () => {
    const code = $("#licenseInput").value.trim();
    const key = $("#apiKeyInput").value.trim();
    if (!code && !key) {
      setMsg("Ingresa un código de licencia o una clave de API para activar premium.", "err");
      return;
    }
    premium = true;
    await store.set("radar_premium", { active: true, method: code ? "license" : "api-key" });
    $("#modeBadge").textContent = "Premium";
    $("#modeBadge").classList.add("premium");
    setMsg("Premium activado ✓ — el análisis con IA ya está disponible en cada resultado.", "ok");
  });

  /* ---- init ---- */
  (async function init() {
    saved = (await store.get("radar_saved", {})) || {};
    const prem = await store.get("radar_premium", null);
    premium = !!(prem && prem.active);
    if (premium) {
      $("#modeBadge").textContent = "Premium";
      $("#modeBadge").classList.add("premium");
      setMsg("Premium está activo en este navegador.", "ok");
    }
    $("#savedCount").textContent = Object.keys(saved).length;
    renderResults();
  })();
})();
