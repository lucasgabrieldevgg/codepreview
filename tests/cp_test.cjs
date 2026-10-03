// ============================================================
// 👁️ Suíte CRA — CodePreview (monitor de fósforo âmbar)
// Testa o CP-CORE (funções puras do "servidor imaginário"),
// o boot no jsdom e BLINDA o anti-vibe nos 3 arquivos.
// ============================================================
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const pv1 = fs.readFileSync(path.join(root, 'p', 'v1', 'index.html'), 'utf8');
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n;\n');
const htmlSemScript = html.replace(/<script[\s\S]*?<\/script>/g, '<script src="stub"></script>');

let pass = 0, fail = 0;
function ok(cond, nome) {
  if (cond) { pass++; console.log('  ✓ ' + nome); }
  else { fail++; console.log('  ✗ FALHOU: ' + nome); }
}

function carregar(url) {
  const dom = new JSDOM(htmlSemScript, { url: url || 'https://lucasgabrieldevgg.github.io/codepreview/', runScripts: 'outside-only' });
  dom.window.eval(script + '\n;globalThis.CP = CP;');
  return dom;
}

// arquivo fake com tamanho controlado
function arq(bytes) { return { size: bytes }; }

(async () => {
  console.log('— 🧠 CP-CORE: mime, skip, url —');
  {
    const w = carregar().window, CP = w.CP;
    ok(CP.mime('a.CSS') === 'text/css; charset=utf-8', 'mime: case-insensitive');
    ok(CP.mime('foto.JPEG').startsWith('image/jpeg') && CP.mime('v.webm') === 'video/webm', 'mime: imagens e vídeo');
    ok(CP.mime('fonte.woff2') === 'font/woff2' && CP.mime('app.wasm') === 'application/wasm', 'mime: fontes e wasm');
    ok(CP.mime('semext') === 'application/octet-stream', 'mime: extensão desconhecida → octet-stream');
    ok(CP.skip('node_modules/react/index.js') && CP.skip('.git/config'), 'skip: node_modules e .git');
    ok(!CP.skip('meu projeto/js/app.js'), 'skip: pasta normal passa');
    ok(CP.url('css/estilo.css').includes('p/v1/css/estilo.css'), 'url: caminho sob o servidor interno');
    ok(CP.url('img/meu foto.png').includes('img/meu%20foto.png'), 'url: encodeURIComponent por segmento');
  }

  console.log('— 📂 CP-CORE: índice e plano de carga —');
  {
    const w = carregar().window, CP = w.CP;
    ok(CP.idxDe([{ path: 'app.html' }, { path: 'index.html' }]) === 'index.html', 'índice: index.html na raiz vence');
    ok(CP.idxDe([{ path: 'dist/index.html' }, { path: 'a/b/index.html' }, { path: 'x.html' }]) === 'dist/index.html', 'índice: sub-index mais raso vence');
    ok(CP.idxDe([{ path: 'z.html' }, { path: 'a.html' }]) === 'z.html', 'índice: sem index → primeiro .html da lista');
    ok(CP.idxDe([{ path: 'leia.txt' }]) === undefined, 'índice: sem html nenhum → undefined');
    const bom = CP.plan([{ path: 'index.html', file: arq(100) }, { path: 'css/a.css', file: arq(200) }]);
    ok(bom.ok && bom.list.length === 2 && bom.total === 300 && bom.index === 'index.html', 'plan: projeto ok com índice');
    const grando = CP.plan([{ path: 'index.html', file: arq(9 * 1024 * 1024) }]);
    ok(!grando.ok && grando.list.length === 0 && grando.erros[0].includes('8 MB'), 'plan: arquivo >8 MB é rejeitado');
    const seis = () => arq(6 * 1024 * 1024);
    const estouro = CP.plan([
      { path: 'index.html', file: seis() }, { path: 'a.js', file: seis() },
      { path: 'b.js', file: seis() }, { path: 'c.js', file: seis() },
      { path: 'd.js', file: seis() }, { path: 'e.js', file: seis() },
      { path: 'f.js', file: seis() }
    ]);
    ok(estouro.ok && estouro.list.length === 6 && estouro.erros[0].includes('40 MB'), 'plan: o que coube carrega (6×6MB), o 7º estoura os 40 MB e é reportado');
    const soTxt = CP.plan([{ path: 'leia.txt', file: arq(10) }]);
    ok(!soTxt.ok, 'plan: sem nenhum .html → ok:false');
    const vazio = CP.plan([]);
    ok(!vazio.ok && vazio.index === undefined, 'plan: lista vazia → ok:false');
  }

  console.log('— 🧩 APP: base do caminho e boot —');
  {
    const w = carregar('https://lucasgabrieldevgg.github.io/codepreview/').window, CP = w.CP;
    ok(CP.BASE() === '/codepreview/', 'BASE: pathname menos o arquivo');
    ok(CP.PROOT() === '/codepreview/p/v1/', 'PROOT: base + p/v1/');
    const w2 = carregar('http://localhost:8097/').window, CP2 = w2.CP;
    ok(CP2.BASE() === '/' && CP2.PROOT() === '/p/v1/', 'BASE/PROOT também funcionam na raiz (localhost)');
    const d2 = w2.document;
    ok(d2.getElementById('ed') && d2.getElementById('b-ver'), 'app monta editor e botão Ver');
    ok(d2.getElementById('frame').getAttribute('sandbox').includes('allow-scripts'), 'iframe roda com sandbox');
    ok(d2.getElementById('b-editar') && /b-editar'\)\.onclick=verEditor/.test(fs.readFileSync(path.join(root, 'index.html'), 'utf8')), 'botão ✏️ Editar existe e chama verEditor (promessa do README)');
  }

  console.log('— 🔥 CRA: NADA DE CARA DE IA (3 arquivos) —');
  {
    ok(/fonts.googleapis.com\/css2\?family=JetBrains\+Mono/.test(html) && /'JetBrains Mono'/.test(html), 'JetBrains Mono de ponta a ponta');
    ok(!/font-family:[^;}]*Inter/i.test(html), 'zero Inter na tipografia');
    ok(!/(?<!repeating-)linear-gradient/.test(html), 'index: zero gradiente com transição');
    ok(!/linear-gradient/.test(pv1) && !/linear-gradient/.test(sw), 'página amiga e sw: zero gradiente');
    ok((html.match(/repeating-linear-gradient/g) || []).length === 1, 'exatamente 1 textura (scanline CRT)');
    ok(!/animation:[^;]*infinite/.test(html), 'zero pulso infinito (armado é sólido)');
    ok(!/#f5b73d|#ff8a3d/.test(pv1 + sw), 'página amiga/sw sem as cores-gradiente velhas');
    ok(/#ffb02e/.test(html) && /prefers-reduced-motion/.test(html), 'âmbar P3 no lugar + reduced-motion');
    ok(/rel="icon"/.test(html), 'favicon presente');
    ok(!/ghp_[A-Za-z0-9]{20,}|sk-or-v1-|sk-ant-|vcp_[A-Za-z0-9]{20,}/.test(html + sw + pv1), 'zero segredo real');
    ok(fs.existsSync(path.join(root, 'LICENSE')), 'LICENSE MIT presente');
    ok(/name: Deploy to GitHub Pages/.test(fs.readFileSync(path.join(root, '.github/workflows/deploy.yml'), 'utf8')), 'workflow de deploy preservado');
  }

  console.log(`\n═══ RESULTADO: ${pass} ✓ · ${fail} ✗ ═══`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('CRASH:', e); process.exit(1); });
