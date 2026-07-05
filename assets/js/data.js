/* Repository Tech Radar — datos y capa de búsqueda.
   Funciona 100% sin conexión con un índice curado. Cada adaptador de
   SOURCE_ADAPTERS puede apuntarse más adelante a una API real (GitHub,
   Hugging Face, npm, PyPI, ...) sin cambiar la capa de interfaz. */

const RADAR_SOURCES = [
  "GitHub", "Hugging Face", "Papers with Code", "npm", "PyPI",
  "Docker Hub", "GitLab", "Product Hunt"
];

/* Puntos de integración futura. Cada entrada asocia una fuente con la API
   pública que puede sustituir la búsqueda simulada. La interfaz solo llama
   a RadarData.search(). */
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
    desc: "Haz preguntas a tus documentos con un LLM local. Pipeline RAG 100% privado que funciona sin conexión a internet.",
    tags: ["rag local", "app rag local", "rag", "documentos", "privacidad", "llm", "ia sin conexión"],
    language: "Python", license: "Apache-2.0", updated: "2026-05",
    stars: 55800, difficulty: "Intermedio", status: "Activo",
    type: "Aplicación", useCase: "Preguntas privadas a documentos"
  },
  {
    id: "anythingllm", name: "AnythingLLM", source: "GitHub",
    url: "https://github.com/Mintplex-Labs/anything-llm",
    desc: "App de IA todo en uno (escritorio y Docker) con RAG integrado, agentes y soporte multiusuario. Conéctala a cualquier LLM.",
    tags: ["rag local", "app rag local", "rag", "app de escritorio", "agentes", "llm", "chatbot"],
    language: "JavaScript", license: "MIT", updated: "2026-06",
    stars: 47300, difficulty: "Principiante", status: "Activo",
    type: "Aplicación", useCase: "Espacio de IA privado llave en mano"
  },
  {
    id: "llamaindex", name: "LlamaIndex", source: "PyPI",
    url: "https://pypi.org/project/llama-index/",
    desc: "Framework de datos para conectar fuentes propias a modelos de lenguaje. El kit estándar para construir apps RAG.",
    tags: ["rag", "rag local", "framework", "llm", "conectores de datos"],
    language: "Python", license: "MIT", updated: "2026-06",
    stars: 41900, difficulty: "Intermedio", status: "Activo",
    type: "Framework", useCase: "Construir pipelines RAG a medida"
  },
  {
    id: "ragflow", name: "RAGFlow", source: "GitHub",
    url: "https://github.com/infiniflow/ragflow",
    desc: "Motor RAG de código abierto basado en comprensión profunda de documentos, con troceado por plantillas y citas verificables.",
    tags: ["rag local", "app rag local", "rag", "comprensión de documentos", "citas"],
    language: "Python", license: "Apache-2.0", updated: "2026-06",
    stars: 52600, difficulty: "Avanzado", status: "Activo",
    type: "Aplicación", useCase: "Recuperación documental empresarial"
  },
  {
    id: "marker", name: "Marker", source: "GitHub",
    url: "https://github.com/datalab-to/marker",
    desc: "Convierte PDF a Markdown, JSON y HTML con rapidez y precisión. Maneja tablas, fórmulas, bloques de código e imágenes.",
    tags: ["pdf a markdown", "pdf", "markdown", "conversión", "ocr"],
    language: "Python", license: "GPL-3.0", updated: "2026-05",
    stars: 24800, difficulty: "Intermedio", status: "Activo",
    type: "Herramienta", useCase: "Pipelines de conversión de documentos"
  },
  {
    id: "docling", name: "Docling", source: "GitHub",
    url: "https://github.com/docling-project/docling",
    desc: "Kit de IBM que convierte PDF, DOCX, PPTX e imágenes en Markdown/JSON estructurado, listo para flujos de IA generativa.",
    tags: ["pdf a markdown", "pdf", "análisis de documentos", "markdown", "rag"],
    language: "Python", license: "MIT", updated: "2026-06",
    stars: 31200, difficulty: "Principiante", status: "Activo",
    type: "Biblioteca", useCase: "Ingesta de documentos para IA"
  },
  {
    id: "pdfplumber", name: "pdfplumber", source: "PyPI",
    url: "https://pypi.org/project/pdfplumber/",
    desc: "Extrae texto, tablas y metadatos de PDF con control fino. Un bloque de construcción fiable para herramientas PDF.",
    tags: ["pdf", "pdf a markdown", "extracción", "tablas"],
    language: "Python", license: "MIT", updated: "2026-03",
    stars: 7600, difficulty: "Principiante", status: "Mantenido",
    type: "Biblioteca", useCase: "Extracción de datos de PDF"
  },
  {
    id: "mineru", name: "MinerU", source: "GitHub",
    url: "https://github.com/opendatalab/MinerU",
    desc: "Herramienta de extracción de PDF de alta calidad que convierte documentos científicos y escaneados complejos en Markdown legible por máquina.",
    tags: ["pdf a markdown", "pdf", "extracción", "documentos científicos"],
    language: "Python", license: "AGPL-3.0", updated: "2026-06",
    stars: 33500, difficulty: "Intermedio", status: "Activo",
    type: "Herramienta", useCase: "Procesado de PDF científicos"
  },
  {
    id: "blackstone", name: "Blackstone", source: "GitHub",
    url: "https://github.com/ICLRandD/Blackstone",
    desc: "Pipeline de spaCy y modelos de PLN para procesar texto legal largo y no estructurado: nombres de casos, citas, instrumentos.",
    tags: ["analizador de documentos legales", "legal", "pln", "legal tech"],
    language: "Python", license: "Apache-2.0", updated: "2021-11",
    stars: 680, difficulty: "Avanzado", status: "Poca actividad",
    type: "Biblioteca", useCase: "Minería de textos legales"
  },
  {
    id: "lexnlp", name: "LexNLP", source: "GitHub",
    url: "https://github.com/LexPredict/lexpredict-lexnlp",
    desc: "Recuperación y extracción de información en texto legal real: fechas, importes, citas, definiciones y plazos.",
    tags: ["analizador de documentos legales", "legal", "contratos", "extracción", "legal tech"],
    language: "Python", license: "AGPL-3.0", updated: "2023-07",
    stars: 720, difficulty: "Avanzado", status: "Poca actividad",
    type: "Biblioteca", useCase: "Analítica de contratos"
  },
  {
    id: "haystack", name: "Haystack", source: "GitHub",
    url: "https://github.com/deepset-ai/haystack",
    desc: "Framework de orquestación para construir aplicaciones LLM listas para producción: búsqueda documental, Q&A, agentes y RAG.",
    tags: ["rag", "analizador de documentos legales", "búsqueda", "framework", "llm"],
    language: "Python", license: "Apache-2.0", updated: "2026-06",
    stars: 21500, difficulty: "Intermedio", status: "Activo",
    type: "Framework", useCase: "Pipelines LLM en producción"
  },
  {
    id: "webllm", name: "WebLLM", source: "npm",
    url: "https://www.npmjs.com/package/@mlc-ai/web-llm",
    desc: "Motor de inferencia LLM de alto rendimiento en el navegador con WebGPU. Ejecuta modelos de chat dentro de una web o extensión, sin servidor.",
    tags: ["extensión chrome ia", "ia en el navegador", "webgpu", "llm", "inferencia"],
    language: "TypeScript", license: "Apache-2.0", updated: "2026-04",
    stars: 15900, difficulty: "Avanzado", status: "Activo",
    type: "Biblioteca", useCase: "Funciones de IA en el navegador"
  },
  {
    id: "transformersjs", name: "Transformers.js", source: "Hugging Face",
    url: "https://huggingface.co/docs/transformers.js",
    desc: "Ejecuta modelos transformer de Hugging Face directamente en el navegador o Node.js — texto, visión y audio sin backend.",
    tags: ["extensión chrome ia", "ia en el navegador", "machine learning", "javascript"],
    language: "JavaScript", license: "Apache-2.0", updated: "2026-06",
    stars: 14200, difficulty: "Intermedio", status: "Activo",
    type: "Biblioteca", useCase: "Inferencia ML en el cliente"
  },
  {
    id: "plasmo", name: "Plasmo", source: "npm",
    url: "https://www.npmjs.com/package/plasmo",
    desc: "Framework completo para crear extensiones de Chrome modernas con React/TypeScript, recarga en vivo y despliegue a la tienda.",
    tags: ["extensión chrome ia", "extensión chrome", "framework", "navegador"],
    language: "TypeScript", license: "MIT", updated: "2026-02",
    stars: 12100, difficulty: "Intermedio", status: "Mantenido",
    type: "Framework", useCase: "Publicar extensiones rápido"
  },
  {
    id: "tesseractjs", name: "Tesseract.js", source: "npm",
    url: "https://www.npmjs.com/package/tesseract.js",
    desc: "OCR en JavaScript puro para más de 100 idiomas. Funciona sin conexión en el navegador o Node.js — sin servicios en la nube.",
    tags: ["ocr sin conexión", "ocr", "reconocimiento de texto", "javascript"],
    language: "JavaScript", license: "Apache-2.0", updated: "2026-01",
    stars: 37200, difficulty: "Principiante", status: "Mantenido",
    type: "Biblioteca", useCase: "OCR dentro de apps web"
  },
  {
    id: "easyocr", name: "EasyOCR", source: "PyPI",
    url: "https://pypi.org/project/easyocr/",
    desc: "OCR listo para usar con más de 80 idiomas, incluidos alfabetos latino, chino, árabe y cirílico. Funciona totalmente sin conexión.",
    tags: ["ocr sin conexión", "ocr", "deep learning", "multilingüe"],
    language: "Python", license: "Apache-2.0", updated: "2025-10",
    stars: 26400, difficulty: "Principiante", status: "Mantenido",
    type: "Biblioteca", useCase: "Extracción de texto sin conexión"
  },
  {
    id: "paddleocr", name: "PaddleOCR", source: "GitHub",
    url: "https://github.com/PaddlePaddle/PaddleOCR",
    desc: "Kit OCR multilingüe de nivel industrial: modelos ultraligeros, análisis de layout, reconocimiento de tablas y fórmulas.",
    tags: ["ocr sin conexión", "ocr", "análisis de layout", "producción"],
    language: "Python", license: "Apache-2.0", updated: "2026-06",
    stars: 47900, difficulty: "Intermedio", status: "Activo",
    type: "Herramienta", useCase: "OCR de producción a escala"
  },
  {
    id: "surya", name: "Surya", source: "GitHub",
    url: "https://github.com/datalab-to/surya",
    desc: "OCR de documentos en más de 90 idiomas con detección por líneas, análisis de layout, orden de lectura y reconocimiento de tablas.",
    tags: ["ocr sin conexión", "ocr", "análisis de documentos", "layout"],
    language: "Python", license: "GPL-3.0", updated: "2026-04",
    stars: 17800, difficulty: "Intermedio", status: "Activo",
    type: "Herramienta", useCase: "OCR documental moderno"
  },
  {
    id: "sheetjs", name: "SheetJS", source: "npm",
    url: "https://www.npmjs.com/package/xlsx",
    desc: "Lee, edita y genera hojas de cálculo Excel desde JavaScript. El estándar de facto para procesar XLSX en aplicaciones web.",
    tags: ["dashboard excel", "generador de dashboards excel", "excel", "hojas de cálculo", "exportación"],
    language: "JavaScript", license: "Apache-2.0", updated: "2026-03",
    stars: 36100, difficulty: "Principiante", status: "Mantenido",
    type: "Biblioteca", useCase: "Importar/exportar Excel en apps"
  },
  {
    id: "streamlit", name: "Streamlit", source: "PyPI",
    url: "https://pypi.org/project/streamlit/",
    desc: "Convierte scripts de Python en dashboards y apps web interactivas en minutos — gráficos, tablas, filtros y carga de archivos.",
    tags: ["dashboard excel", "generador de dashboards excel", "dashboard", "apps de datos", "visualización"],
    language: "Python", license: "Apache-2.0", updated: "2026-06",
    stars: 38700, difficulty: "Principiante", status: "Activo",
    type: "Framework", useCase: "Dashboards internos rápidos"
  },
  {
    id: "mito", name: "Mito", source: "GitHub",
    url: "https://github.com/mito-ds/mito",
    desc: "Interfaz de hoja de cálculo dentro de Jupyter: edita como en Excel y obtén automáticamente el Python equivalente de cada paso.",
    tags: ["dashboard excel", "generador de dashboards excel", "excel", "hojas de cálculo", "python", "automatización"],
    language: "Python", license: "AGPL-3.0", updated: "2026-02",
    stars: 2400, difficulty: "Principiante", status: "Mantenido",
    type: "Herramienta", useCase: "Flujos de Excel a Python"
  },
  {
    id: "rasa", name: "Rasa", source: "GitHub",
    url: "https://github.com/RasaHQ/rasa",
    desc: "Framework de machine learning de código abierto para crear asistentes de chat y voz contextuales que puedes autoalojar y controlar.",
    tags: ["chatbot open source", "chatbot", "nlu", "ia conversacional"],
    language: "Python", license: "Apache-2.0", updated: "2026-05",
    stars: 19900, difficulty: "Avanzado", status: "Activo",
    type: "Framework", useCase: "Asistentes autoalojados"
  },
  {
    id: "librechat", name: "LibreChat", source: "GitHub",
    url: "https://github.com/danny-avila/LibreChat",
    desc: "Interfaz autoalojada estilo ChatGPT mejorada, compatible con múltiples proveedores de IA, agentes, chat con archivos y autenticación multiusuario.",
    tags: ["chatbot open source", "chatbot", "interfaz de chat", "autoalojado", "llm"],
    language: "TypeScript", license: "MIT", updated: "2026-06",
    stars: 28400, difficulty: "Intermedio", status: "Activo",
    type: "Aplicación", useCase: "Chat de IA interno de empresa"
  },
  {
    id: "botpress", name: "Botpress", source: "GitHub",
    url: "https://github.com/botpress/botpress",
    desc: "Plataforma para construir chatbots y agentes de IA con un estudio visual, integraciones y núcleo de código abierto.",
    tags: ["chatbot open source", "chatbot", "agentes", "no-code"],
    language: "TypeScript", license: "MIT", updated: "2026-05",
    stars: 13800, difficulty: "Intermedio", status: "Activo",
    type: "Aplicación", useCase: "Bots de atención al cliente"
  },
  {
    id: "whisper", name: "Whisper", source: "GitHub",
    url: "https://github.com/openai/whisper",
    desc: "Modelo robusto de reconocimiento de voz de propósito general. Transcripción y traducción multilingüe de audio a texto.",
    tags: ["voz a texto", "transcripción", "audio", "asr"],
    language: "Python", license: "MIT", updated: "2025-12",
    stars: 74600, difficulty: "Intermedio", status: "Mantenido",
    type: "Modelo", useCase: "Transcripción de audio"
  },
  {
    id: "fasterwhisper", name: "faster-whisper", source: "PyPI",
    url: "https://pypi.org/project/faster-whisper/",
    desc: "Reimplementación de Whisper con CTranslate2 — hasta 4 veces más rápido con la misma precisión y menos memoria.",
    tags: ["voz a texto", "transcripción", "rendimiento", "asr"],
    language: "Python", license: "MIT", updated: "2026-04",
    stars: 14700, difficulty: "Intermedio", status: "Activo",
    type: "Biblioteca", useCase: "Transcripción rápida en producción"
  },
  {
    id: "whispercpp", name: "whisper.cpp", source: "GitHub",
    url: "https://github.com/ggml-org/whisper.cpp",
    desc: "Port de Whisper en C/C++ puro. Voz a texto en portátiles, móviles y Raspberry Pi sin depender de Python.",
    tags: ["voz a texto", "transcripción", "edge", "ia sin conexión"],
    language: "C++", license: "MIT", updated: "2026-06",
    stars: 39800, difficulty: "Avanzado", status: "Activo",
    type: "Biblioteca", useCase: "Transcripción en el dispositivo"
  },
  {
    id: "whisperweb", name: "Whisper Web", source: "Hugging Face",
    url: "https://huggingface.co/spaces/Xenova/whisper-web",
    desc: "Space de Hugging Face que ejecuta el reconocimiento de voz Whisper íntegramente en tu navegador con Transformers.js. Pruébalo al instante.",
    tags: ["voz a texto", "ia en el navegador", "demo", "space de hugging face"],
    language: "JavaScript", license: "MIT", updated: "2025-09",
    stars: 4900, difficulty: "Principiante", status: "Mantenido",
    type: "Space demo", useCase: "Transcripción instantánea en el navegador"
  },
  {
    id: "vosk", name: "Vosk", source: "PyPI",
    url: "https://pypi.org/project/vosk/",
    desc: "Kit de reconocimiento de voz sin conexión para más de 20 idiomas, con modelos pequeños que corren en Android, Raspberry Pi y servidores.",
    tags: ["voz a texto", "ia sin conexión", "asr", "embebido"],
    language: "Python", license: "Apache-2.0", updated: "2025-08",
    stars: 9700, difficulty: "Intermedio", status: "Mantenido",
    type: "Biblioteca", useCase: "Interfaces de voz sin conexión"
  },
  {
    id: "renovate", name: "Renovate", source: "npm",
    url: "https://www.npmjs.com/package/renovate",
    desc: "Actualización automática de dependencias. Monitorea tu código y abre pull requests cuando los paquetes cambian.",
    tags: ["monitoreo de repositorios", "dependencias", "automatización", "devops"],
    language: "TypeScript", license: "AGPL-3.0", updated: "2026-06",
    stars: 18900, difficulty: "Intermedio", status: "Activo",
    type: "Herramienta", useCase: "Mantener dependencias al día"
  },
  {
    id: "scorecard", name: "OpenSSF Scorecard", source: "GitHub",
    url: "https://github.com/ossf/scorecard",
    desc: "Chequeos automáticos de salud y seguridad para repositorios de código abierto: mantenimiento, vulnerabilidades, CI y licencias.",
    tags: ["monitoreo de repositorios", "seguridad", "riesgo", "salud open source"],
    language: "Go", license: "Apache-2.0", updated: "2026-06",
    stars: 5100, difficulty: "Intermedio", status: "Activo",
    type: "Herramienta", useCase: "Evaluar la confiabilidad de un repo"
  },
  {
    id: "huginn", name: "Huginn", source: "GitHub",
    url: "https://github.com/huginn/huginn",
    desc: "Agentes autoalojados que vigilan webs, feeds y eventos por ti, y luego actúan — un IFTTT abierto que tú controlas.",
    tags: ["monitoreo de repositorios", "automatización de flujos", "agentes", "monitoreo"],
    language: "Ruby", license: "MIT", updated: "2026-03",
    stars: 46200, difficulty: "Avanzado", status: "Mantenido",
    type: "Aplicación", useCase: "Vigilar cambios en la web"
  },
  {
    id: "n8n", name: "n8n", source: "GitHub",
    url: "https://github.com/n8n-io/n8n",
    desc: "Plataforma fair-code de automatización de flujos con capacidades nativas de IA y más de 400 integraciones. Editor visual más código.",
    tags: ["automatización de flujos", "automatización", "integraciones", "agentes de ia"],
    language: "TypeScript", license: "Sustainable Use", updated: "2026-06",
    stars: 98400, difficulty: "Principiante", status: "Activo",
    type: "Aplicación", useCase: "Automatizar flujos de negocio"
  },
  {
    id: "activepieces", name: "Activepieces", source: "GitHub",
    url: "https://github.com/activepieces/activepieces",
    desc: "Automatización con IA de código abierto: editor de flujos sin código con cientos de piezas, alternativa autoalojable a Zapier.",
    tags: ["automatización de flujos", "automatización", "no-code", "autoalojado"],
    language: "TypeScript", license: "MIT", updated: "2026-06",
    stars: 12600, difficulty: "Principiante", status: "Activo",
    type: "Aplicación", useCase: "Automatización sin código"
  },
  {
    id: "windmill", name: "Windmill", source: "GitLab",
    url: "https://github.com/windmill-labs/windmill",
    desc: "Plataforma para convertir scripts en flujos de trabajo, apps internas y tareas programadas. Políglota: Python, TS, Go, Bash.",
    tags: ["automatización de flujos", "automatización", "herramientas internas", "scripts"],
    language: "Rust", license: "AGPL-3.0", updated: "2026-06",
    stars: 11900, difficulty: "Intermedio", status: "Activo",
    type: "Plataforma", useCase: "Automatización basada en scripts"
  },
  {
    id: "ollama", name: "Ollama", source: "Docker Hub",
    url: "https://hub.docker.com/r/ollama/ollama",
    desc: "Ejecuta Llama, Mistral, Gemma y otros modelos abiertos en local con un solo comando. Imagen Docker oficial con soporte GPU.",
    tags: ["rag local", "llm", "ia sin conexión", "docker", "inferencia"],
    language: "Go", license: "MIT", updated: "2026-06",
    stars: 152000, difficulty: "Principiante", status: "Activo",
    type: "Aplicación", useCase: "Runtime de modelos en local"
  },
  {
    id: "qdrant", name: "Qdrant", source: "Docker Hub",
    url: "https://hub.docker.com/r/qdrant/qdrant",
    desc: "Base de datos vectorial y motor de búsqueda por similitud de alto rendimiento. La columna vertebral de recuperación para apps RAG.",
    tags: ["rag local", "rag", "base de datos vectorial", "búsqueda", "docker"],
    language: "Rust", license: "Apache-2.0", updated: "2026-05",
    stars: 25300, difficulty: "Intermedio", status: "Activo",
    type: "Servicio", useCase: "Backend de búsqueda vectorial"
  },
  {
    id: "sam", name: "Segment Anything (SAM)", source: "Papers with Code",
    url: "https://paperswithcode.com/paper/segment-anything",
    desc: "Modelo fundacional de segmentación de imágenes con generalización zero-shot. Paper, benchmarks y código oficial enlazados.",
    tags: ["visión por computador", "segmentación", "modelo fundacional", "investigación"],
    language: "Python", license: "Apache-2.0", updated: "2024-07",
    stars: 51700, difficulty: "Avanzado", status: "Mantenido",
    type: "Modelo", useCase: "Investigación en segmentación"
  },
  {
    id: "sentencetransformers", name: "Sentence Transformers", source: "Hugging Face",
    url: "https://huggingface.co/sentence-transformers",
    desc: "Embeddings de texto de última generación para búsqueda semántica, clustering y recuperación. Cientos de modelos listos para usar.",
    tags: ["rag local", "embeddings", "búsqueda semántica", "pln"],
    language: "Python", license: "Apache-2.0", updated: "2026-05",
    stars: 16800, difficulty: "Intermedio", status: "Activo",
    type: "Biblioteca", useCase: "Embeddings para búsqueda semántica"
  },
  {
    id: "gitlab", name: "GitLab CE", source: "GitLab",
    url: "https://gitlab.com/gitlab-org/gitlab",
    desc: "Plataforma DevSecOps completa: repositorios, CI/CD, gestión de incidencias y monitoreo en un solo paquete autoalojable.",
    tags: ["monitoreo de repositorios", "devops", "ci/cd", "autoalojado"],
    language: "Ruby", license: "MIT", updated: "2026-06",
    stars: 24600, difficulty: "Avanzado", status: "Activo",
    type: "Plataforma", useCase: "DevOps autoalojado"
  },
  {
    id: "langchain", name: "LangChain", source: "GitHub",
    url: "https://github.com/langchain-ai/langchain",
    desc: "Framework para desarrollar aplicaciones impulsadas por modelos de lenguaje: cadenas, agentes, herramientas y componentes de recuperación.",
    tags: ["rag", "rag local", "framework", "agentes", "llm"],
    language: "Python", license: "MIT", updated: "2026-06",
    stars: 113000, difficulty: "Intermedio", status: "Activo",
    type: "Framework", useCase: "Desarrollo de apps con LLM"
  }
];

/* ---- capa de búsqueda (adaptador simulado, misma firma que uno real) ---- */

const RadarData = {
  sources: RADAR_SOURCES,
  adapters: SOURCE_ADAPTERS,
  items: RADAR_ITEMS,

  search(query, filters) {
    filters = filters || {};
    const q = (query || "").trim().toLowerCase();
    const STOP = new Set([
      "to", "of", "for", "the", "a", "an", "and", "in", "on", "with", "my",
      "de", "la", "el", "los", "las", "un", "una", "para", "con", "en", "y", "o", "que", "es", "mi"
    ]);
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
      // un roce de una sola palabra en la descripción es ruido, no una coincidencia
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
      status: ["Activo", "Mantenido", "Poca actividad"],
      difficulty: ["Principiante", "Intermedio", "Avanzado"],
      type: collect("type"),
      useCase: collect("useCase")
    };
  },

  formatStars(n) {
    return n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k" : String(n);
  }
};

if (typeof module !== "undefined") module.exports = RadarData;
