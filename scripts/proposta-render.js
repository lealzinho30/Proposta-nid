/* Renderiza a proposta a partir de proposta-dados.json */
(function (global) {
  const pad2 = (n) => String(n).padStart(2, '0');

  function renderProposta(dados) {
    const c = dados.capa;
    const meta = dados.meta || {};
    const pdf = meta.nomeArquivoPdf || 'proposta.pdf';

    const tags = (c.tags || []).map((t) => `<span class="tag">${t}</span>`).join('');
    const paragrafos = (dados.sobre.paragrafos || []).map((p) => `<p>${p}</p>`).join('');

    const filosofiaEtapas = (dados.filosofia.etapas || [])
      .map((e, i) => `<article class="move"><span class="move-n">${pad2(i + 1)}</span><h3>${e.titulo}</h3><p>${e.texto}</p></article>`)
      .join('');

    const servicos = (dados.servicos.itens || [])
      .map((s, i) => {
        const ent = (s.entregaveis || []).map((e) => `<li>${e}</li>`).join('');
        return `<article class="svc"><div><span class="svc-n">${pad2(i + 1)}</span><span class="svc-k">${s.categoria || ''}</span><div class="svc-title">${s.titulo}</div></div><div><p>${s.descricao}</p><div class="deliver-title">Entregáveis</div><ul class="deliver">${ent}</ul><span class="badge">${s.badge || ''}</span></div></article>`;
      })
      .join('');

    const processoEtapas = (dados.processo.etapas || [])
      .map((e) => `<article class="step${e.marco ? ' mark' : ''}"><span>${e.numero}</span><strong>${e.titulo}</strong><p>${e.texto}</p></article>`)
      .join('');

    const entregaItens = (dados.processo.entregaFinal?.itens || [])
      .map((e) => `<span>${e}</span>`)
      .join('');

    const diferenciais = (dados.processo.diferenciais || [])
      .map((d, i) => `<article class="diff"><span>${pad2(i + 1)}</span><strong>${d.titulo}</strong><p>${d.texto}</p></article>`)
      .join('');

    const escopoResumo = (dados.financeiro.escopoResumo || [])
      .map((e, i) => `<div><span>${pad2(i + 1)}</span>${e}</div>`)
      .join('');

    const pagamentos = (dados.financeiro.pagamentos || [])
      .map((p) => `<div class="pay"><small>${p.rotulo}</small><strong>${p.valor}</strong><p>${p.nota}</p></div>`)
      .join('');

    const infos = (dados.financeiro.infos || [])
      .map((i) => `<div class="info"><strong>${i.titulo}</strong><p>${i.texto}</p></div>`)
      .join('');

    const condicoes = (dados.condicoes.itens || [])
      .map((x) => `<article class="cond"><span class="cond-letter">${x.letra}</span><p><strong>${x.titulo}</strong> ${x.texto}</p></article>`)
      .join('');

    const assinaturas = (dados.encerramento.assinaturas || [])
      .map((a) => `<div><div class="sig-line"></div><div class="sig-name">${a.nome}</div><div class="sig-role">${a.cargo}</div></div>`)
      .join('');

    return `
  <nav class="nav" aria-label="Navegação">
    <a class="on" href="#capa">Capa</a><a href="#sobre">Sobre</a><a href="#filosofia">Filosofia</a><a href="#escopo">Escopo</a><a href="#processo">Processo</a><a href="#diferenciais">Diferenciais</a><a href="#investimento">Investimento</a><a href="#condicoes">Condições</a><a href="#encerramento">Encerramento</a>
  </nav>
  <main class="doc">
    <section id="capa" class="sheet cover">
      <div class="cover-top">
        <a class="logo" href="#capa" aria-label="NID Studio">
          <span class="logo-slot logo-slot--cover" data-label="Adicione a logo NID Studio aqui">
            <img data-logo-key="principal" alt="Logo NID Studio">
          </span>
        </a>
      </div>
      <div class="cover-main">
        <span class="label">${c.rotulo || 'Proposta Comercial'}</span>
        <h1>${c.cliente || ''}</h1>
        <div class="ac"><em>${c.destinatarioRotulo || 'A/C'}</em>${c.destinatario || ''}</div>
        <div class="cover-line"></div>
        <p class="cover-copy">${c.resumo || ''}</p>
      </div>
      <div class="cover-foot">
        <span class="date">${c.dataLocal || ''}</span>
        <div class="tags">${tags}</div>
      </div>
    </section>
    <section id="sobre" class="sheet">
      <div class="section intro-grid">
        <div>
          <span class="label">${dados.sobre.rotulo || ''}</span>
          <h2>${dados.sobre.titulo || ''}</h2>
          <div class="copy">${paragrafos}</div>
        </div>
      </div>
      <div id="filosofia" class="philosophy section">
        <span class="label">${dados.filosofia.rotulo || ''}</span>
        <h2>${dados.filosofia.titulo || ''}</h2>
        <div class="moves">${filosofiaEtapas}</div>
        <div class="manifesto"><strong>${dados.filosofia.manifestoDestaque || ''}</strong> ${dados.filosofia.manifesto || ''}</div>
      </div>
      <div id="escopo" class="section">
        <span class="label">${dados.servicos.rotulo || ''}</span>
        <h2>${dados.servicos.titulo || ''}</h2>
        <div class="services">${servicos}</div>
      </div>
    </section>
    <section class="sheet cream">
      <div id="processo" class="section process-wrap">
        <div>
          <span class="label">${dados.processo.rotulo || ''}</span>
          <h2>${dados.processo.titulo || ''}</h2>
          <p class="process-intro">${dados.processo.intro || ''}</p>
        </div>
        <div class="steps">${processoEtapas}</div>
        <div class="delivery">
          <span class="label">${dados.processo.entregaFinal?.rotulo || 'Entrega Final'}</span>
          <div class="delivery-items">${entregaItens}</div>
        </div>
        <div id="diferenciais" class="diff-grid">${diferenciais}</div>
      </div>
      <div id="investimento" class="finance section">
        <span class="label">${dados.financeiro.rotulo || ''}</span>
        <h2>${dados.financeiro.titulo || ''}</h2>
        <div class="finance-head">
          <div>
            <div class="total-label">${dados.financeiro.totalRotulo || ''}</div>
            <div class="total">${dados.financeiro.total || ''}</div>
            <p class="total-note">${dados.financeiro.totalNota || ''}</p>
          </div>
          <div class="scope-list">${escopoResumo}</div>
        </div>
        <div class="pay-grid">${pagamentos}</div>
        <div class="info-grid">${infos}</div>
      </div>
      <div id="condicoes" class="section">
        <span class="label">${dados.condicoes.rotulo || ''}</span>
        <h2>${dados.condicoes.titulo || ''}</h2>
        <div class="conditions">${condicoes}</div>
      </div>
    </section>
    <section id="encerramento" class="sheet closing">
      <div>
        <div class="logo-slot logo-slot--closing" data-label="Logo NID (versão clara)">
          <img data-logo-key="logoClara" alt="Logo NID Studio">
        </div>
        <span class="label">${dados.encerramento.rotulo || ''}</span>
        <h2>${dados.encerramento.titulo || ''}</h2>
        <p class="closing-phrase">${dados.encerramento.frase || ''} <em>${dados.encerramento.fraseDestaque || ''}</em></p>
        <div class="signatures">${assinaturas}</div>
        <div class="actions">
          <button type="button" class="btn" data-print-pdf>Gerar PDF (1 página)</button>
          <a class="btn" href="#capa">Voltar ao início</a>
        </div>
      </div>
    </section>
  </main>`;
  }

  function renderExportDocument(dados) {
    const c = dados.capa || {};
    const meta = dados.meta || {};
    const tituloPagina = `${meta.tituloPagina || 'NID Studio — Proposta'} · ${c.cliente || ''}`.trim();
    const json = JSON.stringify(dados).replace(/</g, '\\u003c');
    return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${tituloPagina}</title>
  <meta name="description" content="${meta.descricao || ''}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/proposta.css">
</head>
<body>
${renderProposta(dados)}
<script id="dados-embutidos" type="application/json">${json}</script>
<script src="scripts/proposta-boot.js"><\/script>
</body>
</html>`;
  }

  function applyLogos(root, logos) {
    if (!logos) return;
    root.querySelectorAll('img[data-logo-key]').forEach((img) => {
      const key = img.dataset.logoKey;
      const src = logos[key];
      const slot = img.parentElement;
      if (!src) {
        slot?.classList.add('is-empty');
        return;
      }
      img.src = src;
      img.onload = () => slot?.classList.remove('is-empty');
      img.onerror = () => slot?.classList.add('is-empty');
    });
  }

  function mountProposta(dados, container) {
    container.innerHTML = renderProposta(dados);
    const doc = container.querySelector('.doc') || container;
    applyLogos(container, dados.logos);
    initNav(container);
    return container;
  }

  function initNav(root) {
    const sections = root.querySelectorAll('section[id], div[id]');
    const dots = root.querySelectorAll('.nav a');
    if (!sections.length || !dots.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        dots.forEach((d) => d.classList.remove('on'));
        const active = root.querySelector(`.nav a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('on');
      });
    }, { threshold: 0.35 });
    sections.forEach((section) => io.observe(section));
  }

  async function loadDados() {
    const embedded = document.getElementById('dados-embutidos');
    if (embedded?.textContent) {
      return JSON.parse(embedded.textContent);
    }
    const saved = localStorage.getItem('nid-proposta-dados');
    if (saved) {
      return JSON.parse(saved);
    }
    const res = await fetch('proposta-dados.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Não foi possível carregar proposta-dados.json');
    return res.json();
  }

  global.NidProposta = { renderProposta, renderExportDocument, mountProposta, applyLogos, loadDados, initNav };
})(window);
