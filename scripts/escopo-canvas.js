/* Escopo — editor simples em blocos (reordenar + editar inline) */
(function (global) {
  function uid() {
    return 'b-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function elToBloco(el) {
    if (el.tipo === 'card' && el.card) {
      return { id: el.id || uid(), tipo: 'card', card: { ...el.card, entregaveis: [...(el.card.entregaveis || [])] } };
    }
    if (el.tipo === 'imagem') return { id: el.id || uid(), tipo: 'imagem', src: el.src || '' };
    if (el.tipo === 'texto' || el.tipo === 'titulo' || el.tipo === 'rotulo') {
      const html = el.html || '';
      const text = html.replace(/<[^>]+>/g, ' ').trim();
      return { id: el.id || uid(), tipo: 'texto', texto: text };
    }
    return null;
  }

  /** Normaliza dados do escopo para lista de blocos */
  function ensureBlocos(servicos) {
    const s = servicos || {};
    s.editorLivre = true;
    s.modo = 'blocos';

    if (Array.isArray(s.blocos) && s.blocos.length) {
      return s;
    }

    const blocos = [];

    if (s.canvasLivre?.elementos?.length) {
      s.canvasLivre.elementos
        .slice()
        .sort((a, b) => (a.y || 0) - (b.y || 0))
        .forEach((el) => {
          const b = elToBloco(el);
          if (b && b.tipo !== 'texto') blocos.push(b);
          else if (b?.texto && b.texto.length > 3) blocos.push(b);
        });
    } else {
      (s.itens || []).forEach((item) => {
        blocos.push({
          id: uid(),
          tipo: 'card',
          card: {
            categoria: item.categoria || 'Premium',
            titulo: item.titulo || '',
            descricao: item.descricao || '',
            entregaveis: [...(item.entregaveis || [])],
            badge: item.badge || '',
          },
        });
      });
    }

    s.blocos = blocos;
    delete s.canvasLivre;
    return s;
  }

  function syncItensFromBlocos(servicos) {
    const s = ensureBlocos(servicos);
    s.itens = (s.blocos || [])
      .filter((b) => b.tipo === 'card' && b.card)
      .map((b) => ({
        categoria: b.card.categoria || '',
        titulo: b.card.titulo || '',
        descricao: b.card.descricao || '',
        entregaveis: [...(b.card.entregaveis || [])],
        badge: b.card.badge || '',
      }));
    return s;
  }

  const pad2 = (n) => String(n).padStart(2, '0');

  function cardToHtml(card, index) {
    const ent = (card.entregaveis || []).map((e) => `<li>${escapeHtml(e)}</li>`).join('');
    const n = pad2((index ?? 0) + 1);
    return `<article class="svc"><div class="svc-side"><span class="svc-n">${n}</span><span class="svc-k">${escapeHtml(card.categoria)}</span><div class="svc-title">${escapeHtml(card.titulo)}</div></div><div class="svc-body"><p>${escapeHtml(card.descricao)}</p><div class="deliver-title">Entregáveis</div><ul class="deliver">${ent}</ul><span class="badge">${escapeHtml(card.badge)}</span></div></article>`;
  }

  function renderBlocoProposta(b, cardIndex) {
    if (b.tipo === 'card' && b.card) return cardToHtml(b.card, cardIndex);
    if (b.tipo === 'texto') {
      const t = escapeHtml(b.texto || '').replace(/\n/g, '<br>');
      return `<div class="escopo-texto"><p>${t}</p></div>`;
    }
    if (b.tipo === 'imagem' && b.src) {
      return `<figure class="escopo-imagem"><img src="${escapeHtml(b.src)}" alt=""></figure>`;
    }
    return '';
  }

  function renderEscopoSection(dados) {
    const s = ensureBlocos(dados.servicos || {});
    let cardIdx = 0;
    const inner = (s.blocos || [])
      .map((b) => {
        const idx = b.tipo === 'card' ? cardIdx++ : 0;
        return renderBlocoProposta(b, idx);
      })
      .join('');

    return `
      <div class="section escopo-stack-wrap">
        <span class="label">${escapeHtml(s.rotulo || '')}</span>
        <h2>${escapeHtml(s.titulo || '')}</h2>
        <div class="escopo-stack services">${inner}</div>
      </div>`;
  }

  function defaultCard() {
    return {
      id: uid(),
      tipo: 'card',
      card: {
        categoria: 'Premium',
        titulo: 'Novo serviço',
        descricao: '',
        entregaveis: [],
        badge: '',
      },
    };
  }

  class EscopoEditor {
    constructor(root, hooks) {
      this.root = root;
      this.getDados = hooks.getDados;
      this.setDados = hooks.setDados;
      this.onChange = hooks.onChange || (() => {});
      this.openId = null;
      this.dragId = null;
    }

    getServicos() {
      return ensureBlocos(JSON.parse(JSON.stringify(this.getDados().servicos || {})));
    }

    save(servicos) {
      const s = syncItensFromBlocos(servicos);
      const dados = this.getDados();
      dados.servicos = s;
      this.setDados(dados);
      this.onChange();
    }

    mount() {
      const s = this.getServicos();
      const blocos = s.blocos || [];
      this.root.innerHTML = `
        <div class="escopo-simple">
          <div class="escopo-simple__tools">
            <button type="button" data-add="card">+ Serviço</button>
            <button type="button" data-add="texto">+ Texto</button>
            <button type="button" data-add="imagem">+ Imagem</button>
          </div>
          <div class="escopo-simple__page">
            <div class="escopo-simple__head">
              <span class="label">${escapeHtml(s.rotulo || '03 — Escopo')}</span>
              <h2>${escapeHtml(s.titulo || 'Serviços')}</h2>
            </div>
            <div class="escopo-blocks" id="escopo-blocks-list">
              ${blocos.length ? blocos.map((b) => this.renderBlock(b)).join('') : '<p class="escopo-empty">Nenhum bloco ainda. Use os botões acima.</p>'}
            </div>
          </div>
        </div>`;
      this.bind();
    }

    renderBlock(b) {
      const open = this.openId === b.id;
      const handle = '<span class="escopo-block__drag" draggable="true" title="Arrastar">⠿</span>';

      if (b.tipo === 'card' && b.card) {
        const c = b.card;
        return `<div class="escopo-block escopo-block--card${open ? ' is-open' : ''}" data-id="${b.id}">
          ${handle}
          <button type="button" class="escopo-block__toggle" data-toggle="${b.id}">
            <span class="escopo-block__preview">${escapeHtml(c.titulo || 'Serviço sem título')}</span>
          </button>
          <button type="button" class="escopo-block__del" data-del="${b.id}" title="Remover">×</button>
          <div class="escopo-block__edit">
            <label>Categoria</label><input data-f="categoria" value="${escapeHtml(c.categoria)}">
            <label>Título</label><input data-f="titulo" value="${escapeHtml(c.titulo)}">
            <label>Descrição</label><textarea data-f="descricao" rows="2">${escapeHtml(c.descricao)}</textarea>
            <label>Entregáveis (um por linha)</label><textarea data-f="entregaveis" rows="3">${escapeHtml((c.entregaveis || []).join('\n'))}</textarea>
            <label>Badge</label><input data-f="badge" value="${escapeHtml(c.badge)}">
          </div>
        </div>`;
      }

      if (b.tipo === 'imagem') {
        return `<div class="escopo-block escopo-block--img${open ? ' is-open' : ''}" data-id="${b.id}">
          ${handle}
          <button type="button" class="escopo-block__toggle" data-toggle="${b.id}">🖼 Imagem</button>
          <button type="button" class="escopo-block__del" data-del="${b.id}">×</button>
          <div class="escopo-block__edit">
            ${b.src ? `<img src="${escapeHtml(b.src)}" alt="" class="escopo-block__thumb">` : '<p class="hint">Nenhuma imagem</p>'}
            <button type="button" class="add-btn" data-pick-img="${b.id}">Escolher imagem</button>
          </div>
        </div>`;
      }

      return `<div class="escopo-block escopo-block--text${open ? ' is-open' : ''}" data-id="${b.id}">
        ${handle}
        <button type="button" class="escopo-block__toggle" data-toggle="${b.id}">📝 Texto</button>
        <button type="button" class="escopo-block__del" data-del="${b.id}">×</button>
        <div class="escopo-block__edit">
          <label>Texto</label>
          <textarea data-f="texto" rows="3">${escapeHtml(b.texto || '')}</textarea>
        </div>
      </div>`;
    }

    findBloco(id) {
      return this.getServicos().blocos.find((b) => b.id === id);
    }

    updateBloco(id, patch) {
      const s = this.getServicos();
      const b = s.blocos.find((x) => x.id === id);
      if (!b) return;
      Object.assign(b, patch);
      if (patch.card) b.card = { ...b.card, ...patch.card };
      this.save(s);
      this.openId = id;
      this.mount();
    }

    bind() {
      const list = this.root.querySelector('#escopo-blocks-list');
      if (!list) return;

      this.root.querySelectorAll('[data-add]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const s = this.getServicos();
          const tipo = btn.dataset.add;
          let b;
          if (tipo === 'card') b = defaultCard();
          else if (tipo === 'imagem') b = { id: uid(), tipo: 'imagem', src: '' };
          else b = { id: uid(), tipo: 'texto', texto: '' };
          s.blocos.push(b);
          this.openId = b.id;
          this.save(s);
          this.mount();
        });
      });

      list.querySelectorAll('[data-toggle]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.toggle;
          this.openId = this.openId === id ? null : id;
          this.mount();
        });
      });

      list.querySelectorAll('[data-del]').forEach((btn) => {
        btn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          const s = this.getServicos();
          s.blocos = s.blocos.filter((b) => b.id !== btn.dataset.del);
          if (this.openId === btn.dataset.del) this.openId = null;
          this.save(s);
          this.mount();
        });
      });

      list.querySelectorAll('.escopo-block__edit [data-f]').forEach((inp) => {
        const block = inp.closest('.escopo-block');
        const id = block?.dataset.id;
        const apply = () => {
          const b = this.findBloco(id);
          if (!b) return;
          const f = inp.dataset.f;
          if (b.tipo === 'card' && b.card) {
            const card = { ...b.card };
            if (f === 'entregaveis') {
              card.entregaveis = inp.value.split('\n').map((x) => x.trim()).filter(Boolean);
            } else {
              card[f] = inp.value;
            }
            this.updateBloco(id, { card });
            return;
          }
          if (f === 'texto') this.updateBloco(id, { texto: inp.value });
        };
        inp.addEventListener('change', apply);
        inp.addEventListener('input', () => {
          clearTimeout(inp._deb);
          inp._deb = setTimeout(apply, 350);
        });
      });

      list.querySelectorAll('[data-pick-img]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.pickImg;
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            const store = global.NidPropostaStore;
            const src = store?.compressImage
              ? await store.compressImage(file)
              : await new Promise((res, rej) => {
                  const r = new FileReader();
                  r.onload = () => res(r.result);
                  r.onerror = rej;
                  r.readAsDataURL(file);
                });
            this.updateBloco(id, { src });
          };
          input.click();
        });
      });

      list.querySelectorAll('.escopo-block__drag').forEach((handle) => {
        handle.addEventListener('dragstart', (ev) => {
          const block = handle.closest('.escopo-block');
          this.dragId = block?.dataset.id;
          ev.dataTransfer.effectAllowed = 'move';
          block?.classList.add('is-dragging');
        });
        handle.addEventListener('dragend', () => {
          list.querySelectorAll('.escopo-block').forEach((n) => n.classList.remove('is-dragging', 'is-drag-over'));
          this.dragId = null;
        });
      });

      list.querySelectorAll('.escopo-block').forEach((block) => {
        block.addEventListener('dragover', (ev) => {
          ev.preventDefault();
          block.classList.add('is-drag-over');
        });
        block.addEventListener('dragleave', () => block.classList.remove('is-drag-over'));
        block.addEventListener('drop', (ev) => {
          ev.preventDefault();
          block.classList.remove('is-drag-over');
          const targetId = block.dataset.id;
          if (!this.dragId || this.dragId === targetId) return;
          const s = this.getServicos();
          const from = s.blocos.findIndex((b) => b.id === this.dragId);
          const to = s.blocos.findIndex((b) => b.id === targetId);
          if (from < 0 || to < 0) return;
          const [item] = s.blocos.splice(from, 1);
          s.blocos.splice(to, 0, item);
          this.save(s);
          this.mount();
        });
      });
    }
  }

  global.NidEscopoCanvas = {
    ensureCanvas: ensureBlocos,
    ensureBlocos,
    syncItensFromCanvas: syncItensFromBlocos,
    syncItensFromBlocos,
    renderEscopoSection,
    EscopoEditor,
  };
})(window);
