#!/usr/bin/env node
/**
 * Gera proposta-static.html com conteúdo já renderizado (para PDF/impressão).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dados = JSON.parse(fs.readFileSync(path.join(root, 'proposta-dados.json'), 'utf8'));
const css = fs.readFileSync(path.join(root, 'assets', 'proposta.css'), 'utf8');
const renderPath = path.join(root, 'scripts', 'proposta-render.js');

const renderCode = fs.readFileSync(renderPath, 'utf8').replace(/\)\(window\)/, ')(global)');
const global = {};
const fn = new Function('global', `${renderCode}; return global.NidProposta;`);
const NidProposta = fn(global);
const markup = NidProposta.renderProposta(dados);
const json = JSON.stringify(dados).replace(/</g, '\\u003c');
const boot = fs.readFileSync(path.join(root, 'scripts', 'proposta-boot.js'), 'utf8');
const c = dados.capa || {};
const meta = dados.meta || {};
const title = `${meta.tituloPagina || 'Proposta'} · ${c.cliente || ''}`;

const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>${css}</style>
</head>
<body>
${markup}
<script id="dados-embutidos" type="application/json">${json}</script>
<script>${boot}</script>
</body>
</html>`;

fs.writeFileSync(path.join(root, 'proposta-static.html'), html);
console.log('OK: proposta-static.html');
