# 👁️ CodePreview

**Cole o HTML, veja o site.** Ou carregue a pasta do seu projeto e veja ele renderizado **com estrutura de verdade** — `css/`, `js/`, `img/`, caminhos relativos, tudo como no site real.

## Como usa
1. **Cole** seu HTML na caixa → clique **▶ Ver site** (ou `Ctrl+Enter`) → o site ocupa a tela (roda **direto**, sem servidor interno)
2. **📁 Carregue a pasta** do projeto (ou **arraste** ela pra página) → abre pelo `index.html` com tudo no lugar
3. **🗑️ Limpar site** (fica lá em cima) → zera tudo e volta pro editor (pede 2 cliques, sem susto)

- ✏️ No site aberto, o **✏️ Editar** volta pra caixa sem perder nada
- 💾 Projeto único, **salvo no navegador** — fechou, abriu, continua lá
- 🧹 Pula `node_modules` e `.git` automaticamente · até ~40 MB · arquivos até 8 MB

## Como a pasta renderiza de verdade
Um **mini-servidor dentro do navegador** (Service Worker + Cache API) serve seus arquivos nos caminhos certos — quem resolve `css/estilo.css`, `../img/foto.png`, `fetch()` e módulos ES é o **próprio navegador**, igual ao site publicado. Requer navegador moderno (Chrome/Edge/Firefox no PC). No celular, use a caixa de colar.

Limites honestos: é para sites **estáticos** (html/css/js/imagens/fontes). Projeto com build (npm/React sem `dist` pronto) ou backend não renderiza.

Abra: **https://lucasgabrieldevgg.github.io/codepreview/**

Feito por [lucasgabrieldevgg](https://github.com/lucasgabrieldevgg) 💜
