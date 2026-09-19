/* CodePreview — mini-servidor estático do preview.
   Serve os arquivos do projeto carregado (escritos no Cache 'cp-v1' pela página)
   nos caminhos sintéticos /p/v1/... — o navegador resolve caminhos relativos nativamente. */
const CACHE = 'cp-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (!u.pathname.includes('/p/v1/')) return; // só o preview
  e.respondWith(
    caches.open(CACHE)
      .then(c => c.match(e.request, { ignoreSearch: true }))
      .then(r => r || new Response(
`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><style>body{background:#0d0f13;color:#eef1f6;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center}p{color:#98a0ad;max-width:420px;padding:24px;line-height:1.65}</style></head><body><p>🫥 esse arquivo não está no projeto carregado — ele foi limpo ou não fez parte da pasta.<br><br>Volta no CodePreview e carrega de novo 😉</p></body></html>`,
        { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }))
  );
});
