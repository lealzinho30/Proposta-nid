/* Renderiza a proposta a partir de proposta-dados.json */
(function (global) {
  const pad2 = (n) => String(n).padStart(2, '0');

  function mediaSlot(key, label, className = '') {
    return `<div class="media-slot ${className} is-empty" data-label="${label}"><img data-img-key="${key}" alt=""></div>`;
  }

  function resolveImagens(dados) {
    const img = dados.imagens || {};
    const leg = dados.logos || {};
    const proc = Array.isArray(img.simbolosProcesso) ? img.simbolosProcesso : [];
    const map = {
      logoCapa: img.logoCapa || leg.principal || '',
      logoEncerramento: img.logoEncerramento || leg.logoClara || '',
      simboloSobreTopo: img.simboloSobreTopo || '',
      simboloSobreBase: img.simboloSobreBase || '',
      simboloFilosofiaArco: img.simboloFilosofiaArco || '',
      simboloFilosofiaRodape: img.simboloFilosofiaRodape || '',
      simboloEncerramentoRodape: img.simboloEncerramentoRodape || '',
    };
    for (let i = 0; i < 8; i++) map[`processo${i}`] = proc[i] || '';
    return map;
  }

  function renderProposta(dados) {
    const c = dados.capa || {};
    const tags = (c.tags || []).map((t) => `<span class="tag">${t}</span>`).join('');
    const paragrafos = (dados.sobre?.paragrafos || []).map((p) => `<p>${p}</p>`).join('');

    const pilares = (dados.filosofia?.pilares || dados.filosofia?.etapas || [])
      .map(
        (p) => `<article class="pillar"><h3>${p.titulo}</h3><p>${p.texto}</p></article>`
      )
      .join('');

    const servicos = (dados.servicos?.itens || [])
      .map((s, i) => {
        const ent = (s.entregaveis || []).map((e) => `<li>${e}</li>`).join('');
        return `<article class="svc"><div class="svc-side"><span class="svc-n">${pad2(i + 1)}</span><span class="svc-k">${s.categoria || ''}</span><div class="svc-title">${s.titulo}</div></div><div class="svc-body"><p>${s.descricao}</p><div class="deliver-title">Entregáveis</div><ul class="deliver">${ent}</ul><span class="badge">${s.badge || ''}</span></div></article>`;
      })
      .join('');

    const processoEtapas = (dados.processo?.etapas || [])
      .map(
        (e, i) =>
          `<article class="step${e.marco ? ' mark' : ''}"><div class="step-symbol">${mediaSlot(`processo${i}`, `Upload símbolo · etapa ${e.numero}`, 'media-slot--step')}</div><span class="step-n">${e.numero}</span><strong>${e.titulo}</strong><p>${e.texto}</p></article>`
      )
      .join('');

    const entregaItens = (dados.processo?.entregaFinal?.itens || [])
      .map((e) => `<span>${e}</span>`)
      .join('');

    const diferenciais = (dados.processo?.diferenciais || [])
      .map((d, i) => `<article class="diff"><span>${pad2(i + 1)}</span><strong>${d.titulo}</strong><p>${d.texto}</p></article>`)
      .join('');

    const escopoResumo = (dados.financeiro?.escopoResumo || [])
      .map((e, i) => `<div><span>${pad2(i + 1)}</span>${e}</div>`)
      .join('');

    const pagamentos = (dados.financeiro?.pagamentos || [])
      .map((p) => `<div class="pay"><small>${p.rotulo}</small><strong>${p.valor}</strong><p>${p.nota}</p></div>`)
      .join('');

    const infos = (dados.financeiro?.infos || [])
      .map((i) => `<div class="info"><strong>${i.titulo}</strong><p>${i.texto}</p></div>`)
      .join('');

    const condicoes = (dados.condicoes?.itens || [])
      .map((x) => `<article class="cond"><span class="cond-letter">${x.letra}</span><p><strong>${x.titulo}</strong> ${x.texto}</p></article>`)
      .join('');

    const assinaturas = (dados.encerramento?.assinaturas || [])
      .map((a) => `<div><div class="sig-line"></div><div class="sig-name">${a.nome}</div><div class="sig-role">${a.cargo}</div></div>`)
      .join('');

    return `
  <nav class="nav" aria-label="Navegação">
    <a class="on" href="#capa">Capa</a><a href="#sobre">Sobre</a><a href="#filosofia">Filosofia</a><a href="#escopo">Escopo</a><a href="#processo">Processo</a><a href="#diferenciais">Diferenciais</a><a href="#investimento">Investimento</a><a href="#condicoes">Condições</a><a href="#encerramento">Encerramento</a>
  </nav>
  <main class="doc">
    <section id="capa" class="sheet cover">
      <div class="cover-hero">
        <div class="cover-hero__logo">
          ${mediaSlot('logoCapa', 'Upload · Logo NID Studio', 'media-slot--logo-cover')}
        </div>
        <div class="cover-hero__text">
          <span class="label">${c.rotulo || 'Proposta Comercial'}</span>
          <h1>${c.cliente || ''}</h1>
          <div class="ac"><em>${c.destinatarioRotulo || 'A/C'}</em>${c.destinatario || ''}</div>
          <div class="cover-line"></div>
        </div>
      </div>
      <p class="cover-copy">${c.resumo || ''}</p>
      <div class="cover-foot">
        <span class="date">${c.dataLocal || ''}</span>
        <div class="tags">${tags}</div>
      </div>
    </section>

    <section id="sobre" class="sheet sheet--pattern">
      ${mediaSlot('simboloSobreTopo', 'Upload · Símbolo decorativo (canto superior)', 'media-slot--deco media-slot--deco-tr')}
      ${mediaSlot('simboloSobreBase', 'Upload · Símbolo decorativo (canto inferior)', 'media-slot--deco media-slot--deco-bl')}
      <div class="section intro-grid">
        <span class="label">${dados.sobre?.rotulo || ''}</span>
        <h2>${dados.sobre?.titulo || ''}</h2>
        <div class="copy">${paragrafos}</div>
      </div>
    </section>

    <section id="filosofia" class="sheet sheet--filosofia">
      <div class="philosophy-intro">
        <span class="label">${dados.filosofia?.rotulo || ''}</span>
        <h2>${dados.filosofia?.titulo || ''}</h2>
      </div>
      <div class="philosophy-arc-wrap">
        ${mediaSlot('simboloFilosofiaArco', 'Upload · Símbolo Metodologia NID', 'media-slot--arc')}
        <p class="philosophy-arc-title">${dados.filosofia?.tituloArco || 'Metodologia NID.'}</p>
      </div>
      <div class="pillars">${pilares}</div>
      <div class="manifesto"><strong>${dados.filosofia?.manifestoDestaque || ''}</strong> ${dados.filosofia?.manifesto || ''}</div>
      <div class="philosophy-footer-symbol">
        ${mediaSlot('simboloFilosofiaRodape', 'Upload · Símbolo rodapé da filosofia', 'media-slot--pill')}
      </div>
    </section>

    <section id="escopo" class="sheet sheet--pattern">
      <div class="section">
        <span class="label">${dados.servicos?.rotulo || ''}</span>
        <h2>${dados.servicos?.titulo || ''}</h2>
        <div class="services">${servicos}</div>
      </div>
    </section>

    <section class="sheet cream">
      <div id="processo" class="section process-wrap">
        <div class="process-head">
          <span class="label">${dados.processo?.rotulo || ''}</span>
          <h2>${dados.processo?.titulo || ''}</h2>
          <p class="process-intro">${dados.processo?.intro || ''}</p>
        </div>
        <div class="steps">${processoEtapas}</div>
        <div class="delivery">
          <span class="label">${dados.processo?.entregaFinal?.rotulo || 'Entrega Final'}</span>
          <div class="delivery-items">${entregaItens}</div>
        </div>
        <div id="diferenciais" class="diff-section">
          <span class="label">Nossos diferenciais</span>
          <div class="diff-grid">${diferenciais}</div>
        </div>
      </div>

      <div id="investimento" class="finance section">
        <span class="label">${dados.financeiro?.rotulo || ''}</span>
        <h2>${dados.financeiro?.titulo || ''}</h2>
        <div class="finance-layout">
          <div class="finance-pay">${pagamentos}</div>
          <div class="finance-scope">
            <span class="label">Escopo contemplado</span>
            <div class="scope-list">${escopoResumo}</div>
          </div>
          <div class="info-grid">${infos}</div>
          <div class="finance-total-block">
            <div class="total-label">${dados.financeiro?.totalRotulo || ''}</div>
            <div class="total">${dados.financeiro?.total || ''}</div>
            <p class="total-note">${dados.financeiro?.totalNota || ''}</p>
          </div>
        </div>
      </div>

      <div id="condicoes" class="section">
        <span class="label">${dados.condicoes?.rotulo || ''}</span>
        <h2>${dados.condicoes?.titulo || ''}</h2>
        <div class="conditions">${condicoes}</div>
      </div>
    </section>

    <section id="encerramento" class="sheet closing">
      <div class="closing-inner">
        ${mediaSlot('logoEncerramento', 'Upload · Logo NID (versão clara)', 'media-slot--logo-closing')}
        <span class="label">${dados.encerramento?.rotulo || ''}</span>
        <h2>${dados.encerramento?.titulo || ''}</h2>
        <p class="closing-phrase">${dados.encerramento?.frase || ''} <em>${dados.encerramento?.fraseDestaque || ''}</em></p>
        <div class="signatures">${assinaturas}</div>
        <div class="closing-footer-symbol">
          ${mediaSlot('simboloEncerramentoRodape', 'Upload · Símbolo rodapé', 'media-slot--pill media-slot--pill-light')}
        </div>
        <div class="actions">
          <button type="button" class="btn" data-print-pdf>Gerar PDF (página contínua)</button>
          <a class="btn" href="#capa">Voltar ao início</a>
        </div>
      </div>
    </section>
  </main>`;
  }

  function buildStandaloneHtml(dados, css, layoutCss, bootJs) {
    const c = dados.capa || {};
    const meta = dados.meta || {};
    const tituloPagina = `${meta.tituloPagina || 'NID Studio — Proposta'} · ${c.cliente || ''}`.trim();
    const json = JSON.stringify(dados).replace(/</g, '\\u003c');
    const markup = renderProposta(dados);
    const boot = (bootJs || '').replace(/<\/script>/gi, '<\\/script>');
    return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${tituloPagina}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>${css || ''}\n${layoutCss || ''}</style>
</head>
<body>
${markup}
<script id="dados-embutidos" type="application/json">${json}</script>
<script>${boot}</script>
<script>
(function(){
  var d=document.getElementById('dados-embutidos');
  if(!d||!window.NidProposta)return;
  var dados=JSON.parse(d.textContent);
  NidProposta.applyImagens(document,dados);
  NidProposta.initNav(document);
  document.querySelectorAll('[data-print-pdf]').forEach(function(b){
    b.addEventListener('click',function(){window.print();});
  });
  if(/[?&]print=1/.test(location.search)){
    function doPrint(){setTimeout(function(){window.print();},350);}
    var wait=window.NidPropostaStore&&window.NidPropostaStore.waitForImages;
    var p=wait?wait(document,15000):Promise.resolve();
    p.then(function(){
      if(document.fonts&&document.fonts.ready)return document.fonts.ready;
    }).then(doPrint).catch(doPrint);
  }
})();
</script>
</body>
</html>`;
  }

  function renderExportDocument(dados) {
    return buildStandaloneHtml(dados, null, null, null);
  }

  function renderExportDocumentLegacy(dados) {
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
  <link rel="stylesheet" href="assets/proposta-layout.css">
</head>
<body>
${renderProposta(dados)}
<script id="dados-embutidos" type="application/json">${json}</script>
<script src="scripts/proposta-boot.js"><\/script>
</body>
</html>`;
  }

  function applyImagens(root, dados) {
    const map = resolveImagens(dados);
    root.querySelectorAll('img[data-img-key]').forEach((img) => {
      const key = img.dataset.imgKey;
      const src = map[key];
      const slot = img.closest('.media-slot');
      if (!src) {
        slot?.classList.add('is-empty');
        img.removeAttribute('src');
        return;
      }
      const onOk = () => slot?.classList.remove('is-empty');
      const onFail = () => {
        slot?.classList.add('is-empty');
        img.removeAttribute('src');
      };
      img.onload = onOk;
      img.onerror = onFail;
      img.src = src;
      if (img.complete) {
        if (img.naturalWidth > 0) onOk();
        else onFail();
      }
    });
    root.querySelectorAll('img[data-logo-key]').forEach((img) => {
      const key = img.dataset.logoKey;
      const legacy = key === 'principal' ? map.logoCapa : key === 'logoClara' ? map.logoEncerramento : '';
      const slot = img.closest('.logo-slot, .media-slot');
      if (!legacy) {
        slot?.classList.add('is-empty');
        return;
      }
      img.src = legacy;
      img.onload = () => slot?.classList.remove('is-empty');
    });
  }

  function applyLogos(root, logos) {
    applyImagens(root, { logos, imagens: {} });
  }

  function mountProposta(dados, container) {
    container.innerHTML = renderProposta(dados);
    applyImagens(container, dados);
    initNav(container);
    return container;
  }

  function initNav(root) {
    const sections = root.querySelectorAll('section[id]');
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
    if (global.NidPropostaStore?.loadDados) {
      return global.NidPropostaStore.loadDados();
    }
    const saved = localStorage.getItem('nid-proposta-dados');
    if (saved) {
      return JSON.parse(saved);
    }
    const res = await fetch('proposta-dados.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Não foi possível carregar proposta-dados.json');
    return res.json();
  }

  global.NidProposta = {
    renderProposta,
    renderExportDocument,
    buildStandaloneHtml,
    mountProposta,
    applyImagens,
    applyLogos,
    resolveImagens,
    loadDados,
    initNav,
  };
})(window);
