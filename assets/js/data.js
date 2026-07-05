/* Repository Tech Radar — dataset & search layer.
   Works fully offline with curated data. Each adapter in SOURCE_ADAPTERS can
   later be pointed at a live API (GitHub, Hugging Face, npm, PyPI, ...) without
   changing the UI layer. */

const RADAR_SOURCES = [
  "GitHub", "Hugging Face", "Papers with Code", "npm", "PyPI",
  "Docker Hub", "GitLab", "Product Hunt"
];

/* Future integration points. Each entry maps a source to the public API that
   can replace the mock search. The UI only calls RadarData.search(). */
const SOURCE_ADAPTERS = {
  "GitHub":           { api: "https://api.github.com/search/repositories", live: false },
  "Hugging Face":     { api: "https://huggingface.co/api/models", live: false },
  "Papers with Code": { api: "https://paperswithcode.com/api/v1/search/", live: false },
  "npm":              { api: "https://registry.npmjs.org/-/v1/search", live: false },
  "PyPI":             { api: "https://pypi.org/search/", live: false },
  "Docker Hub":       { api: "https://hub.docker.com/api/search/v3/catalog/search", live: false },
  "GitLab":           { api: "https://gitlab.com/api/v4/projects", live: false },
  "Product Hunt":     { api: "https://api.producthunt.com/v2/api/graphql", live: false }
};

const RADAR_ITEMS = [
  {
    id: "privategpt", name: "PrivateGPT", source: "GitHub",
    url: "https://github.com/zylon-ai/private-gpt",
    desc: "Ask questions to your documents with a local LLM. 100% private RAG pipeline that runs without internet access.",
    tags: ["local rag", "rag", "documents", "privacy", "llm", "offline ai"],
    language: "Python", license: "Apache-2.0", updated: "2026-05",
    stars: 55800, difficulty: "Intermediate", status: "Active",
    type: "Application", useCase: "Private document Q&A"
  },
  {
    id: "anythingllm", name: "AnythingLLM", source: "GitHub",
    url: "https://github.com/Mintplex-Labs/anything-llm",
    desc: "All-in-one desktop and Docker AI app with built-in RAG, agents and multi-user support. Point it at any LLM.",
    tags: ["local rag", "rag", "desktop app", "agents", "llm", "chatbot"],
    language: "JavaScript", license: "MIT", updated: "2026-06",
    stars: 47300, difficulty: "Beginner", status: "Active",
    type: "Application", useCase: "Turn-key private AI workspace"
  },
  {
    id: "llamaindex", name: "LlamaIndex", source: "PyPI",
    url: "https://pypi.org/project/llama-index/",
    desc: "Data framework to connect custom data sources to large language models. The standard toolkit for building RAG apps.",
    tags: ["rag", "local rag", "framework", "llm", "data connectors"],
    language: "Python", license: "MIT", updated: "2026-06",
    stars: 41900, difficulty: "Intermediate", status: "Active",
    type: "Framework", useCase: "Build custom RAG pipelines"
  },
  {
    id: "ragflow", name: "RAGFlow", source: "GitHub",
    url: "https://github.com/infiniflow/ragflow",
    desc: "Open-source RAG engine based on deep document understanding, with templated chunking and grounded citations.",
    tags: ["local rag", "rag", "document understanding", "citations"],
    language: "Python", license: "Apache-2.0", updated: "2026-06",
    stars: 52600, difficulty: "Advanced", status: "Active",
    type: "Application", useCase: "Enterprise document retrieval"
  },
  {
    id: "marker", name: "Marker", source: "GitHub",
    url: "https://github.com/datalab-to/marker",
    desc: "Converts PDF to Markdown, JSON and HTML quickly and accurately. Handles tables, equations, code blocks and images.",
    tags: ["pdf to markdown", "pdf", "markdown", "conversion", "ocr"],
    language: "Python", license: "GPL-3.0", updated: "2026-05",
    stars: 24800, difficulty: "Intermediate", status: "Active",
    type: "Tool", useCase: "Document conversion pipelines"
  },
  {
    id: "docling", name: "Docling", source: "GitHub",
    url: "https://github.com/docling-project/docling",
    desc: "IBM's toolkit that parses PDF, DOCX, PPTX and images into structured Markdown/JSON, ready for gen-AI workflows.",
    tags: ["pdf to markdown", "pdf", "document parsing", "markdown", "rag"],
    language: "Python", license: "MIT", updated: "2026-06",
    stars: 31200, difficulty: "Beginner", status: "Active",
    type: "Library", useCase: "Document ingestion for AI"
  },
  {
    id: "pdfplumber", name: "pdfplumber", source: "PyPI",
    url: "https://pypi.org/project/pdfplumber/",
    desc: "Extracts text, tables and metadata from PDFs with fine-grained control. A dependable building block for PDF tooling.",
    tags: ["pdf", "pdf to markdown", "extraction", "tables"],
    language: "Python", license: "MIT", updated: "2026-03",
    stars: 7600, difficulty: "Beginner", status: "Maintained",
    type: "Library", useCase: "PDF data extraction"
  },
  {
    id: "mineru", name: "MinerU", source: "GitHub",
    url: "https://github.com/opendatalab/MinerU",
    desc: "High-quality PDF extraction tool that converts complex scientific and scanned documents into machine-readable Markdown.",
    tags: ["pdf to markdown", "pdf", "extraction", "scientific documents"],
    language: "Python", license: "AGPL-3.0", updated: "2026-06",
    stars: 33500, difficulty: "Intermediate", status: "Active",
    type: "Tool", useCase: "Scientific PDF processing"
  },
  {
    id: "blackstone", name: "Blackstone", source: "GitHub",
    url: "https://github.com/ICLRandD/Blackstone",
    desc: "spaCy pipeline and NLP models for processing long-form unstructured legal text: case names, citations, instruments.",
    tags: ["legal document analyzer", "legal", "nlp", "legal tech"],
    language: "Python", license: "Apache-2.0", updated: "2021-11",
    stars: 680, difficulty: "Advanced", status: "Low activity",
    type: "Library", useCase: "Legal text mining"
  },
  {
    id: "lexnlp", name: "LexNLP", source: "GitHub",
    url: "https://github.com/LexPredict/lexpredict-lexnlp",
    desc: "Information retrieval and extraction for real, unstructured legal text: dates, amounts, citations, definitions, durations.",
    tags: ["legal document analyzer", "legal", "contracts", "extraction", "legal tech"],
    language: "Python", license: "AGPL-3.0", updated: "2023-07",
    stars: 720, difficulty: "Advanced", status: "Low activity",
    type: "Library", useCase: "Contract analytics"
  },
  {
    id: "haystack", name: "Haystack", source: "GitHub",
    url: "https://github.com/deepset-ai/haystack",
    desc: "Orchestration framework for building production-ready LLM applications: document search, Q&A, agents and RAG.",
    tags: ["rag", "legal document analyzer", "search", "framework", "llm"],
    language: "Python", license: "Apache-2.0", updated: "2026-06",
    stars: 21500, difficulty: "Intermediate", status: "Active",
    type: "Framework", useCase: "Production LLM pipelines"
  },
  {
    id: "webllm", name: "WebLLM", source: "npm",
    url: "https://www.npmjs.com/package/@mlc-ai/web-llm",
    desc: "High-performance in-browser LLM inference engine with WebGPU. Run chat models inside a web page or extension, no server.",
    tags: ["ai chrome extension", "browser ai", "webgpu", "llm", "inference"],
    language: "TypeScript", license: "Apache-2.0", updated: "2026-04",
    stars: 15900, difficulty: "Advanced", status: "Active",
    type: "Library", useCase: "In-browser AI features"
  },
  {
    id: "transformersjs", name: "Transformers.js", source: "Hugging Face",
    url: "https://huggingface.co/docs/transformers.js",
    desc: "Run Hugging Face transformer models directly in the browser or Node.js — text, vision and audio tasks without a backend.",
    tags: ["ai chrome extension", "browser ai", "machine learning", "javascript"],
    language: "JavaScript", license: "Apache-2.0", updated: "2026-06",
    stars: 14200, difficulty: "Intermediate", status: "Active",
    type: "Library", useCase: "Client-side ML inference"
  },
  {
    id: "plasmo", name: "Plasmo", source: "npm",
    url: "https://www.npmjs.com/package/plasmo",
    desc: "Battery-packed framework for building modern Chrome extensions with React/TypeScript, live-reload and store deployment.",
    tags: ["ai chrome extension", "chrome extension", "framework", "browser"],
    language: "TypeScript", license: "MIT", updated: "2026-02",
    stars: 12100, difficulty: "Intermediate", status: "Maintained",
    type: "Framework", useCase: "Ship browser extensions fast"
  },
  {
    id: "tesseractjs", name: "Tesseract.js", source: "npm",
    url: "https://www.npmjs.com/package/tesseract.js",
    desc: "Pure-JavaScript OCR for 100+ languages. Runs offline in the browser or Node.js — no cloud service required.",
    tags: ["offline ocr", "ocr", "text recognition", "javascript"],
    language: "JavaScript", license: "Apache-2.0", updated: "2026-01",
    stars: 37200, difficulty: "Beginner", status: "Maintained",
    type: "Library", useCase: "OCR inside web apps"
  },
  {
    id: "easyocr", name: "EasyOCR", source: "PyPI",
    url: "https://pypi.org/project/easyocr/",
    desc: "Ready-to-use OCR with 80+ supported languages, including Latin, Chinese, Arabic and Cyrillic scripts. Works fully offline.",
    tags: ["offline ocr", "ocr", "deep learning", "multilingual"],
    language: "Python", license: "Apache-2.0", updated: "2025-10",
    stars: 26400, difficulty: "Beginner", status: "Maintained",
    type: "Library", useCase: "Offline text extraction"
  },
  {
    id: "paddleocr", name: "PaddleOCR", source: "GitHub",
    url: "https://github.com/PaddlePaddle/PaddleOCR",
    desc: "Industrial-grade multilingual OCR toolkit: ultra-lightweight models, layout analysis, table and formula recognition.",
    tags: ["offline ocr", "ocr", "layout analysis", "production"],
    language: "Python", license: "Apache-2.0", updated: "2026-06",
    stars: 47900, difficulty: "Intermediate", status: "Active",
    type: "Tool", useCase: "Production OCR at scale"
  },
  {
    id: "surya", name: "Surya", source: "GitHub",
    url: "https://github.com/datalab-to/surya",
    desc: "Document OCR in 90+ languages with line-level detection, layout analysis, reading order and table recognition.",
    tags: ["offline ocr", "ocr", "document analysis", "layout"],
    language: "Python", license: "GPL-3.0", updated: "2026-04",
    stars: 17800, difficulty: "Intermediate", status: "Active",
    type: "Tool", useCase: "Modern document OCR"
  },
  {
    id: "sheetjs", name: "SheetJS", source: "npm",
    url: "https://www.npmjs.com/package/xlsx",
    desc: "Read, edit and generate Excel spreadsheets from JavaScript. The de-facto standard for XLSX processing in web apps.",
    tags: ["excel dashboard generator", "excel", "spreadsheets", "export"],
    language: "JavaScript", license: "Apache-2.0", updated: "2026-03",
    stars: 36100, difficulty: "Beginner", status: "Maintained",
    type: "Library", useCase: "Excel import/export in apps"
  },
  {
    id: "streamlit", name: "Streamlit", source: "PyPI",
    url: "https://pypi.org/project/streamlit/",
    desc: "Turn Python scripts into interactive data dashboards and web apps in minutes — charts, tables, filters, file upload.",
    tags: ["excel dashboard generator", "dashboard", "data apps", "visualization"],
    language: "Python", license: "Apache-2.0", updated: "2026-06",
    stars: 38700, difficulty: "Beginner", status: "Active",
    type: "Framework", useCase: "Rapid internal dashboards"
  },
  {
    id: "mito", name: "Mito", source: "GitHub",
    url: "https://github.com/mito-ds/mito",
    desc: "Spreadsheet interface inside Jupyter: edit like Excel, get the equivalent Python generated automatically for each step.",
    tags: ["excel dashboard generator", "excel", "spreadsheets", "python", "automation"],
    language: "Python", license: "AGPL-3.0", updated: "2026-02",
    stars: 2400, difficulty: "Beginner", status: "Maintained",
    type: "Tool", useCase: "Excel-to-Python workflows"
  },
  {
    id: "rasa", name: "Rasa", source: "GitHub",
    url: "https://github.com/RasaHQ/rasa",
    desc: "Open-source machine learning framework to build contextual chat and voice assistants you can self-host and control.",
    tags: ["open-source chatbot", "chatbot", "nlu", "conversational ai"],
    language: "Python", license: "Apache-2.0", updated: "2026-05",
    stars: 19900, difficulty: "Advanced", status: "Active",
    type: "Framework", useCase: "Self-hosted assistants"
  },
  {
    id: "librechat", name: "LibreChat", source: "GitHub",
    url: "https://github.com/danny-avila/LibreChat",
    desc: "Enhanced self-hosted ChatGPT-style interface supporting many AI providers, agents, file chat and multi-user auth.",
    tags: ["open-source chatbot", "chatbot", "chat ui", "self-hosted", "llm"],
    language: "TypeScript", license: "MIT", updated: "2026-06",
    stars: 28400, difficulty: "Intermediate", status: "Active",
    type: "Application", useCase: "Company-internal AI chat"
  },
  {
    id: "botpress", name: "Botpress", source: "GitHub",
    url: "https://github.com/botpress/botpress",
    desc: "Platform for building chatbots and AI agents with a visual studio, integrations, and an open-source core.",
    tags: ["open-source chatbot", "chatbot", "agents", "no-code"],
    language: "TypeScript", license: "MIT", updated: "2026-05",
    stars: 13800, difficulty: "Intermediate", status: "Active",
    type: "Application", useCase: "Customer-facing bots"
  },
  {
    id: "whisper", name: "Whisper", source: "GitHub",
    url: "https://github.com/openai/whisper",
    desc: "Robust general-purpose speech recognition model. Multilingual transcription and translation from audio to text.",
    tags: ["speech to text", "transcription", "audio", "asr"],
    language: "Python", license: "MIT", updated: "2025-12",
    stars: 74600, difficulty: "Intermediate", status: "Maintained",
    type: "Model", useCase: "Audio transcription"
  },
  {
    id: "fasterwhisper", name: "faster-whisper", source: "PyPI",
    url: "https://pypi.org/project/faster-whisper/",
    desc: "Reimplementation of Whisper using CTranslate2 — up to 4x faster with the same accuracy and lower memory use.",
    tags: ["speech to text", "transcription", "performance", "asr"],
    language: "Python", license: "MIT", updated: "2026-04",
    stars: 14700, difficulty: "Intermediate", status: "Active",
    type: "Library", useCase: "Fast production transcription"
  },
  {
    id: "whispercpp", name: "whisper.cpp", source: "GitHub",
    url: "https://github.com/ggml-org/whisper.cpp",
    desc: "Plain C/C++ port of Whisper. Runs speech-to-text on laptops, phones and Raspberry Pi with no Python dependency.",
    tags: ["speech to text", "transcription", "edge", "offline ai"],
    language: "C++", license: "MIT", updated: "2026-06",
    stars: 39800, difficulty: "Advanced", status: "Active",
    type: "Library", useCase: "On-device transcription"
  },
  {
    id: "whisperweb", name: "Whisper Web", source: "Hugging Face",
    url: "https://huggingface.co/spaces/Xenova/whisper-web",
    desc: "Hugging Face Space that runs Whisper speech recognition entirely in your browser via Transformers.js. Try it instantly.",
    tags: ["speech to text", "browser ai", "demo", "hugging face space"],
    language: "JavaScript", license: "MIT", updated: "2025-09",
    stars: 4900, difficulty: "Beginner", status: "Maintained",
    type: "Demo Space", useCase: "Instant browser transcription"
  },
  {
    id: "vosk", name: "Vosk", source: "PyPI",
    url: "https://pypi.org/project/vosk/",
    desc: "Offline speech recognition toolkit for 20+ languages with small models that run on Android, Raspberry Pi and servers.",
    tags: ["speech to text", "offline ai", "asr", "embedded"],
    language: "Python", license: "Apache-2.0", updated: "2025-08",
    stars: 9700, difficulty: "Intermediate", status: "Maintained",
    type: "Library", useCase: "Offline voice interfaces"
  },
  {
    id: "renovate", name: "Renovate", source: "npm",
    url: "https://www.npmjs.com/package/renovate",
    desc: "Automated dependency updates for repositories. Monitors your codebase and opens pull requests when packages change.",
    tags: ["repository monitoring", "dependencies", "automation", "devops"],
    language: "TypeScript", license: "AGPL-3.0", updated: "2026-06",
    stars: 18900, difficulty: "Intermediate", status: "Active",
    type: "Tool", useCase: "Keep dependencies fresh"
  },
  {
    id: "scorecard", name: "OpenSSF Scorecard", source: "GitHub",
    url: "https://github.com/ossf/scorecard",
    desc: "Automated security health checks for open-source repositories: maintenance, vulnerabilities, CI, licensing signals.",
    tags: ["repository monitoring", "security", "risk", "open source health"],
    language: "Go", license: "Apache-2.0", updated: "2026-06",
    stars: 5100, difficulty: "Intermediate", status: "Active",
    type: "Tool", useCase: "Evaluate repo trustworthiness"
  },
  {
    id: "huginn", name: "Huginn", source: "GitHub",
    url: "https://github.com/huginn/huginn",
    desc: "Self-hosted agents that monitor websites, feeds and events for you, then act on them — an open IFTTT you control.",
    tags: ["repository monitoring", "workflow automation", "agents", "monitoring"],
    language: "Ruby", license: "MIT", updated: "2026-03",
    stars: 46200, difficulty: "Advanced", status: "Maintained",
    type: "Application", useCase: "Watch the web for changes"
  },
  {
    id: "n8n", name: "n8n", source: "GitHub",
    url: "https://github.com/n8n-io/n8n",
    desc: "Fair-code workflow automation platform with native AI capabilities and 400+ integrations. Visual builder plus code.",
    tags: ["workflow automation", "automation", "integrations", "ai agents"],
    language: "TypeScript", license: "Sustainable Use", updated: "2026-06",
    stars: 98400, difficulty: "Beginner", status: "Active",
    type: "Application", useCase: "Automate business workflows"
  },
  {
    id: "activepieces", name: "Activepieces", source: "GitHub",
    url: "https://github.com/activepieces/activepieces",
    desc: "Open-source AI automation: no-code flow builder with hundreds of pieces, self-hostable alternative to Zapier.",
    tags: ["workflow automation", "automation", "no-code", "self-hosted"],
    language: "TypeScript", license: "MIT", updated: "2026-06",
    stars: 12600, difficulty: "Beginner", status: "Active",
    type: "Application", useCase: "No-code task automation"
  },
  {
    id: "windmill", name: "Windmill", source: "GitLab",
    url: "https://github.com/windmill-labs/windmill",
    desc: "Developer platform to turn scripts into workflows, internal apps and scheduled jobs. Polyglot: Python, TS, Go, Bash.",
    tags: ["workflow automation", "automation", "internal tools", "scripts"],
    language: "Rust", license: "AGPL-3.0", updated: "2026-06",
    stars: 11900, difficulty: "Intermediate", status: "Active",
    type: "Platform", useCase: "Script-first automation"
  },
  {
    id: "ollama", name: "Ollama", source: "Docker Hub",
    url: "https://hub.docker.com/r/ollama/ollama",
    desc: "Run Llama, Mistral, Gemma and other open models locally with one command. Official Docker image with GPU support.",
    tags: ["local rag", "llm", "offline ai", "docker", "inference"],
    language: "Go", license: "MIT", updated: "2026-06",
    stars: 152000, difficulty: "Beginner", status: "Active",
    type: "Application", useCase: "Local model runtime"
  },
  {
    id: "qdrant", name: "Qdrant", source: "Docker Hub",
    url: "https://hub.docker.com/r/qdrant/qdrant",
    desc: "High-performance vector database and similarity search engine. The retrieval backbone for RAG and recommendation apps.",
    tags: ["local rag", "rag", "vector database", "search", "docker"],
    language: "Rust", license: "Apache-2.0", updated: "2026-05",
    stars: 25300, difficulty: "Intermediate", status: "Active",
    type: "Service", useCase: "Vector search backend"
  },
  {
    id: "sam", name: "Segment Anything (SAM)", source: "Papers with Code",
    url: "https://paperswithcode.com/paper/segment-anything",
    desc: "Foundation model for image segmentation with zero-shot generalization. Paper, benchmarks and official code linked.",
    tags: ["computer vision", "segmentation", "foundation model", "research"],
    language: "Python", license: "Apache-2.0", updated: "2024-07",
    stars: 51700, difficulty: "Advanced", status: "Maintained",
    type: "Model", useCase: "Image segmentation research"
  },
  {
    id: "sentencetransformers", name: "Sentence Transformers", source: "Hugging Face",
    url: "https://huggingface.co/sentence-transformers",
    desc: "State-of-the-art text embeddings for semantic search, clustering and retrieval. Hundreds of ready-to-use models.",
    tags: ["local rag", "embeddings", "semantic search", "nlp"],
    language: "Python", license: "Apache-2.0", updated: "2026-05",
    stars: 16800, difficulty: "Intermediate", status: "Active",
    type: "Library", useCase: "Semantic search embeddings"
  },
  {
    id: "gitlab", name: "GitLab CE", source: "GitLab",
    url: "https://gitlab.com/gitlab-org/gitlab",
    desc: "Complete DevSecOps platform: repositories, CI/CD, issue tracking and monitoring in a single self-hostable package.",
    tags: ["repository monitoring", "devops", "ci/cd", "self-hosted"],
    language: "Ruby", license: "MIT", updated: "2026-06",
    stars: 24600, difficulty: "Advanced", status: "Active",
    type: "Platform", useCase: "Self-hosted DevOps"
  },
  {
    id: "langchain", name: "LangChain", source: "GitHub",
    url: "https://github.com/langchain-ai/langchain",
    desc: "Framework for developing applications powered by language models: chains, agents, tools and retrieval components.",
    tags: ["rag", "local rag", "framework", "agents", "llm"],
    language: "Python", license: "MIT", updated: "2026-06",
    stars: 113000, difficulty: "Intermediate", status: "Active",
    type: "Framework", useCase: "LLM app development"
  }
];

/* ---- search layer (mock adapter, same signature a live adapter will use) ---- */

const RadarData = {
  sources: RADAR_SOURCES,
  adapters: SOURCE_ADAPTERS,
  items: RADAR_ITEMS,

  search(query, filters) {
    filters = filters || {};
    const q = (query || "").trim().toLowerCase();
    const STOP = new Set(["to", "of", "for", "the", "a", "an", "and", "in", "on", "with", "my"]);
    const terms = q.split(/\s+/).filter(t => t && !STOP.has(t));

    let results = RADAR_ITEMS.map(item => {
      let score = 0;
      const hay = (item.name + " " + item.desc + " " + item.tags.join(" ") + " " +
                   item.useCase + " " + item.type).toLowerCase();
      if (item.tags.some(t => t === q)) score += 30;
      terms.forEach(t => {
        if (item.name.toLowerCase().includes(t)) score += 8;
        if (item.tags.some(tag => tag.includes(t))) score += 6;
        if (hay.includes(t)) score += 2;
      });
      // a desc-only brush against one word is noise, not a match
      return { item, score: terms.length && score < 5 ? 0 : (terms.length ? score : 1) };
    }).filter(r => r.score > 0);

    const f = (key, val) => !val || val === "all";
    results = results.filter(({ item }) =>
      (f("source", filters.source) || item.source === filters.source) &&
      (f("language", filters.language) || item.language === filters.language) &&
      (f("license", filters.license) || item.license === filters.license) &&
      (f("status", filters.status) || item.status === filters.status) &&
      (f("difficulty", filters.difficulty) || item.difficulty === filters.difficulty) &&
      (f("type", filters.type) || item.type === filters.type) &&
      (f("useCase", filters.useCase) || item.useCase === filters.useCase)
    );

    results.sort((a, b) => b.score - a.score || b.item.stars - a.item.stars);
    return results.map(r => r.item);
  },

  facets() {
    const collect = key => [...new Set(RADAR_ITEMS.map(i => i[key]))].sort();
    return {
      source: collect("source"),
      language: collect("language"),
      license: collect("license"),
      status: ["Active", "Maintained", "Low activity"],
      difficulty: ["Beginner", "Intermediate", "Advanced"],
      type: collect("type"),
      useCase: collect("useCase")
    };
  },

  formatStars(n) {
    return n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k" : String(n);
  }
};

if (typeof module !== "undefined") module.exports = RadarData;
