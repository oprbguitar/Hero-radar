# Repository Tech Radar

**Encuentra, compara, entiende y reutiliza tecnología open source más rápido.**

🌐 **Sitio en vivo:** <https://oprbguitar.github.io/Hero-radar/>

Repository Tech Radar es una demo comercial: una herramienta de búsqueda multi-fuente y
análisis con IA para repositorios de GitHub, proyectos de IA, bibliotecas de código
abierto, frameworks, datasets, spaces de Hugging Face, paquetes de npm/PyPI, imágenes
Docker y otros recursos públicos para desarrolladores.

---

## 📑 Índice

1. [Enlaces rápidos](#-enlaces-rápidos)
2. [Modelo de negocio](#-modelo-de-negocio)
3. [Estructura del proyecto](#-estructura-del-proyecto)
4. [Ejecutar en local](#-ejecutar-en-local)
5. [Instalar la extensión de Chrome](#-instalar-la-extensión-de-chrome)
6. [Fuentes de datos e integración futura](#-fuentes-de-datos-e-integración-futura)
7. [Despliegue en GitHub Pages](#-despliegue-en-github-pages)
8. [Contacto y activación premium](#-contacto-y-activación-premium)

---

## 🔗 Enlaces rápidos

| Recurso | Enlace |
|---------|--------|
| Página pública (landing + demo) | <https://oprbguitar.github.io/Hero-radar/> |
| Demo de búsqueda gratuita | <https://oprbguitar.github.io/Hero-radar/#demo> |
| Sección premium (IA) | <https://oprbguitar.github.io/Hero-radar/#premium> |
| Descarga de la extensión (ZIP) | <https://oprbguitar.github.io/Hero-radar/downloads/repository-tech-radar-extension.zip> |
| Contacto y activación | <https://oprbguitar.github.io/Hero-radar/#contact> |

## 💼 Modelo de negocio

- **Modo gratis** — búsqueda multi-fuente por palabra clave con filtros (fuente,
  lenguaje, licencia, estado, dificultad, tipo, caso de uso), tarjetas de resultados
  organizadas, enlaces a la fuente y exportación a CSV / JSON / Markdown / informe PDF.
- **Modo premium** — la capa de análisis con IA: resúmenes del repositorio en lenguaje
  claro, viabilidad técnica, revisión de riesgo y mantenimiento, alertas de licencia,
  comparaciones entre repositorios, casos de uso de negocio, hojas de ruta de
  instalación y recomendación de «la mejor herramienta para mi caso». Se activa con un
  código de licencia o con la clave de API de IA del propio usuario.

## 📁 Estructura del proyecto

| Ruta | Descripción |
|------|-------------|
| `index.html` | Página pública con la demo interactiva gratuita, la sección premium de IA, la descarga de la extensión y el área de contacto/activación |
| `assets/css/style.css` | Estilos del panel (tema oscuro, responsive) |
| `assets/js/data.js` | Índice curado de proyectos + capa de búsqueda simulada |
| `assets/js/app.js` | Lógica de la página: búsqueda, filtros, exportaciones, modal premium |
| `extension/` | Extensión de Chrome (Manifest V3): buscar, guardar, clasificar, favoritos, exportar y panel premium de IA |
| `downloads/repository-tech-radar-extension.zip` | Paquete de la extensión listo para descargar, enlazado desde la página |

## 🖥 Ejecutar en local

Es un sitio 100% estático — abre `index.html` en el navegador, o sírvelo:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000
```

## 🧩 Instalar la extensión de Chrome

1. Descarga [`repository-tech-radar-extension.zip`](https://oprbguitar.github.io/Hero-radar/downloads/repository-tech-radar-extension.zip) (o usa la carpeta `extension/` directamente).
2. Descomprímelo, abre `chrome://extensions` y activa el **Modo de desarrollador**.
3. Haz clic en **Cargar descomprimida** y selecciona la carpeta `extension`.
4. Fija **Repository Tech Radar** en la barra de herramientas.

Funciona en Chrome, Edge, Brave y otros navegadores Chromium. El modo gratuito no requiere cuenta.

## 🔌 Fuentes de datos e integración futura

La demo funciona con un índice curado sin conexión, por lo que corre en cualquier parte
(incluido GitHub Pages) sin claves. La capa de búsqueda (`assets/js/data.js` /
`extension/data.js`) expone un único punto de entrada `RadarData.search(query, filters)`
más un mapa `SOURCE_ADAPTERS` con el endpoint de API pública de cada fuente, para activar
adaptadores en vivo fuente por fuente sin tocar la interfaz:

- GitHub · Hugging Face · Papers with Code · npm · PyPI · Docker Hub · GitLab · Product Hunt

## 🚀 Despliegue en GitHub Pages

El sitio ya está publicado en <https://oprbguitar.github.io/Hero-radar/> desde la rama
`main` (carpeta raíz). No requiere backend ni paso de compilación: cada push a `main`
vuelve a desplegar automáticamente.

## 📬 Contacto y activación premium

- ✉️ **Email:** [peru.labs.pe@gmail.com](mailto:peru.labs.pe@gmail.com)
- 🔑 **Código de licencia:** se ingresa en la pestaña Premium de la extensión
- El análisis premium funciona con tu propia clave de API o con una configuración premium activada para ti.

---

Los resultados de la demo son un índice curado de proyectos públicos de código abierto;
los nombres y enlaces pertenecen a sus respectivos dueños.
