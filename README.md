# Repository Tech Radar

**Find, compare, understand and reuse open-source technology faster.**

Repository Tech Radar is a commercial demo: a smart multi-source search and AI analysis
tool for GitHub repositories, AI projects, open-source libraries, frameworks, datasets,
Hugging Face spaces, npm/PyPI packages, Docker images and other public developer resources.

## What's inside

| Path | Description |
|------|-------------|
| `index.html` | Public landing page with the interactive free demo, premium AI section, extension download and contact/activation area |
| `assets/` | Styles, page logic and the curated dataset / mock search layer |
| `extension/` | Chrome extension (Manifest V3): search, save, classify, favorite, export and premium AI panel |
| `downloads/repository-tech-radar-extension.zip` | Ready-to-download extension package linked from the landing page |

## Business model

- **Free mode** — multi-source keyword search with filters (source, language, license,
  status, difficulty, type, use case), organized result cards, source links and
  CSV / JSON / Markdown / PDF-report exports.
- **Premium mode** — the AI analysis layer: plain-language repository summaries,
  feasibility and risk review, license warnings, comparisons, business use cases,
  installation roadmaps and "best tool for my need" recommendations. Activates with a
  license code or the user's own AI API key.

## Run locally

It is a fully static site — open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy on GitHub Pages

Enable GitHub Pages for the repository (Settings → Pages → deploy from the `main` branch,
root folder). No build step or backend is required.

## Install the extension

1. Download `downloads/repository-tech-radar-extension.zip` (or use the `extension/` folder directly).
2. Unzip it, open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the `extension` folder.
4. Pin **Repository Tech Radar** to the toolbar.

## Data sources & future API integration

The demo runs on a curated offline index so it works anywhere, including GitHub Pages,
with no keys. The search layer (`assets/js/data.js` / `extension/data.js`) exposes a
single `RadarData.search(query, filters)` entry point plus a `SOURCE_ADAPTERS` map with
the public API endpoint for each source (GitHub, Hugging Face, Papers with Code, npm,
PyPI, Docker Hub, GitLab, Product Hunt), so live adapters can be switched on per source
without touching the UI.

## Premium activation

Premium is presented as a paid layer. Contact placeholders (email, WhatsApp, license
code) live in the landing page's contact section and in the extension's Premium tab.
