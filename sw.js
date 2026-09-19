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
      .then(r => r || new Response('não encontrado no projeto carregado (limpou ou não carregou a pasta?)', {
        status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      }))
  );
});
