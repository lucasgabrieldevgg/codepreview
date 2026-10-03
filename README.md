# 👁️ CodePreview

[![ci](https://github.com/lucasgabrieldevgg/codepreview/actions/workflows/ci.yml/badge.svg)](https://github.com/lucasgabrieldevgg/codepreview/actions/workflows/ci.yml)

**Paste your HTML, see the site.** Or load your project folder and see it rendered **with real structure** — `css/`, `js/`, `img/`, relative paths, just like the real site.

## How to use
1. **Paste** your HTML → **▶ Ver site** (or `Ctrl+Enter`) → fullscreen site (runs **instantly**, no server involved)
2. **📁 Load your project folder** (or **drag & drop** it) → opens from `index.html` with everything in place
3. **🗑️ Limpar site** (always up top) → clears everything (double-click confirm)

- ✏️ **✏️ Editar** goes back to the editor without losing anything
- 💾 Single project, **saved in your browser** — close and reopen, it's still there
- 🧹 Skips `node_modules` and `.git` · up to ~40 MB · 8 MB per file

## How folder rendering actually works
A **mini static server inside your browser** (Service Worker + Cache API) serves your files at the right paths — your **browser itself** resolves `css/estilo.css`, `../img/photo.png`, `fetch()` and ES modules, exactly like a published site. Requires a modern desktop browser. On mobile, use the paste box.

Honest limits: for **static** sites (html/css/js/images/fonts). Projects with a build step or backend won't render.

## Development

```
npm install && npm test
```

**35 checks** (jsdom, no network) over the **CP-CORE** pure functions — MIME map, path skipping, index picking (root `index.html` → shallowest sub-index → first `.html`), the 8 MB/40 MB load plan — plus app boot with a sandboxed iframe and the **anti-vibe guard**: JetBrains Mono everywhere, no gradient-with-transition (the only allowed texture is the hard-stop CRT scanline), no infinite pulse, no secrets.

## Identity — AMBER PHOSPHOR MONITOR (P3)

A dev tool wears a dev typeface: **JetBrains Mono** end to end, solid phosphor amber (`#ffb02e`) on warm black, hard offset shadows, a subtle CRT scanline. No Inter, no gradients, no blinking.

Open: **https://lucasgabrieldevgg.github.io/codepreview/**

Made by [lucasgabrieldevgg](https://github.com/lucasgabrieldevgg) 💜
