/* Editor visual do escopo (arrastar, redimensionar, editar — estilo Canva) */
(function (global) {
  const CANVAS_W = 1016;

  function uid() {
    return 'el-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function ensureCanvas(servicos) {
    const s = servicos || {};
    if (s.canvasLivre?.elementos?.length) {
      s.editorLivre = true;
      return s;
    }
    const elementos = [];
    let y = 100;
    const rotulo = s.rotulo || '03 — Escopo';
    const titulo = s.titulo || 'Serviços Contratados';

    elementos.push({
      id: uid(),
      tipo: 'rotulo',
      x: 0,
      y: 24,
      w: 400,
      h: 28,
      z: 1,
      html: `<span class="label">${escapeHtml(rotulo)}</span>`,
    });
    elementos.push({
      id: uid(),
      tipo: 'titulo',
      x: 0,
      y: 52,
      w: 720,
      h: 56,
      z: 2,
      html: `<h2>${escapeHtml(titulo)}</h2>`,
    });
    y = 130;

    (s.itens || []).forEach((item, i) => {
      elementos.push({
        id: uid(),
        tipo: 'card',
        x: 0,
        y,
        w: CANVAS_W,
        h: 300,
        z: 10 + i,
        card: {
          categoria: item.categoria || 'Premium',
          titulo: item.titulo || '',
          descricao: item.descricao || '',
          entregaveis: [...(item.entregaveis || [])],
          badge: item.badge || '',
        },
      });
      y += 320;
    });

    s.editorLivre = true;
    s.canvasLivre = {
      altura: Math.max(800, y + 80),
      elementos,
    };
    return s;
  }

  function syncItensFromCanvas(servicos) {
    const s = ensureCanvas(servicos);
    s.itens = (s.canvasLivre.elementos || [])
      .filter((e) => e.tipo === 'card' && e.card)
      .map((e) => ({
        categoria: e.card.categoria || '',
        titulo: e.card.titulo || '',
        descricao: e.card.descricao || '',
        entregaveis: [...(e.card.entregaveis || [])],
        badge: e.card.badge || '',
      }));
    return s;
  }

  function cardToHtml(card, index) {
    const ent = (card.entregaveis || []).map((e) => `<li>${e}</li>`).join('');
    const n = String(index + 1).padStart(2, '0');
    return `<article class="svc svc--canvas"><div class="svc-side"><span class="svc-n">${n}</span><span class="svc-k">${escapeHtml(card.categoria)}</span><div class="svc-title">${escapeHtml(card.titulo)}</div></div><div class="svc-body"><p>${escapeHtml(card.descricao)}</p><div class="deliver-title">Entregáveis</div><ul class="deliver">${ent}</ul><span class="badge">${escapeHtml(card.badge)}</span></div></article>`;
  }

  function renderElemento(el, index) {
    const style = `left:${el.x}px;top:${el.y}px;width:${el.w}px;height:${el.h}px;z-index:${el.z || 1}`;
    if (el.tipo === 'card' && el.card) {
      return `<div class="escopo-el escopo-el--card" style="${style}" data-el-id="${el.id}">${cardToHtml(el.card, index)}</div>`;
    }
    const html = el.html || '';
    return `<div class="escopo-el escopo-el--${el.tipo}" style="${style}" data-el-id="${el.id}">${html}</div>`;
  }

  function renderEscopoSection(dados) {
    const s = ensureCanvas(dados.servicos || {});
    const cv = s.canvasLivre;
    let cardIdx = 0;
    const inner = (cv.elementos || [])
      .map((el) => {
        const idx = el.tipo === 'card' ? cardIdx++ : 0;
        return renderElemento(el, idx);
      })
      .join('');
    const hasTitulo = (cv.elementos || []).some((e) => e.tipo === 'titulo');
    const hasRotulo = (cv.elementos || []).some((e) => e.tipo === 'rotulo');

    return `
      <div class="section escopo-livre-wrap">
        ${!hasRotulo ? `<span class="label">${escapeHtml(s.rotulo || '')}</span>` : ''}
        ${!hasTitulo ? `<h2>${escapeHtml(s.titulo || '')}</h2>` : ''}
        <div class="escopo-canvas" style="height:${cv.altura}px">
          ${inner}
        </div>
      </div>`;
  }

  function defaultCard(y) {
    return {
      id: uid(),
      tipo: 'card',
      x: 0,
      y,
      w: CANVAS_W,
      h: 280,
      z: Date.now() % 10000,
      card: {
        categoria: 'Premium',
        titulo: 'Novo serviço',
        descricao: 'Descreva o escopo deste serviço.',
        entregaveis: ['Entregável 1'],
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
      this.selectedId = null;
      this.interactReady = false;
    }

    getServicos() {
      return ensureCanvas(JSON.parse(JSON.stringify(this.getDados().servicos || {})));
    }

    saveServicos(servicos) {
      const s = syncItensFromCanvas(servicos);
      const dados = this.getDados();
      dados.servicos = s;
      this.setDados(dados);
      this.onChange();
    }

    computeAltura(elementos) {
      let max = 600;
      elementos.forEach((e) => {
        max = Math.max(max, e.y + e.h + 60);
      });
      return max;
    }

    mount() {
      const servicos = this.getServicos();
      const cv = servicos.canvasLivre;
      this.root.innerHTML = `
        <div class="escopo-editor">
          <div class="escopo-toolbar">
            <span class="escopo-toolbar-label">Adicionar:</span>
            <button type="button" data-add-el="texto">Texto</button>
            <button type="button" data-add-el="titulo">Título</button>
            <button type="button" data-add-el="card">Card de serviço</button>
            <button type="button" data-add-el="imagem">Imagem</button>
            <span class="escopo-toolbar-sep"></span>
            <button type="button" data-layer="front" title="Trazer à frente">▲</button>
            <button type="button" data-layer="back" title="Enviar atrás">▼</button>
            <button type="button" data-del-el class="danger">Remover seleção</button>
          </div>
          <div class="escopo-workspace">
            <div class="escopo-canvas escopo-canvas--edit" id="escopo-canvas-edit" style="height:${cv.altura}px">
              ${(cv.elementos || []).map((el, i) => this.renderEditElement(el, i)).join('')}
            </div>
            <aside class="escopo-inspector" id="escopo-inspector">
              <p class="hint">Clique em um elemento. Arraste para mover, use as alças para redimensionar. Duplo clique em textos para editar.</p>
              <div id="escopo-inspector-body"></div>
            </aside>
          </div>
        </div>`;
      this.bindToolbar();
      this.bindCanvas();
      this.initInteract();
    }

    renderEditElement(el, index) {
      const sel = el.id === this.selectedId ? ' is-selected' : '';
      const style = `left:${el.x}px;top:${el.y}px;width:${el.w}px;height:${el.h}px;z-index:${el.z || 1}`;
      const handles = `<span class="escopo-handle" data-resize="se"></span>`;
      if (el.tipo === 'card' && el.card) {
        return `<div class="escopo-el escopo-el--card${sel}" data-el-id="${el.id}" style="${style}">${handles}${cardToHtml(el.card, index)}</div>`;
      }
      if (el.tipo === 'imagem') {
        const src = el.src || '';
        const img = src ? `<img src="${escapeHtml(src)}" alt="">` : '<span class="escopo-img-placeholder">+ Imagem</span>';
        return `<div class="escopo-el escopo-el--imagem${sel}" data-el-id="${el.id}" style="${style}">${handles}${img}</div>`;
      }
      const editable = el.tipo === 'texto' || el.tipo === 'titulo' || el.tipo === 'rotulo';
      const content = el.html || '<p>Novo texto</p>';
      return `<div class="escopo-el escopo-el--${el.tipo}${sel}" data-el-id="${el.id}" style="${style}" ${editable ? 'data-editable="1"' : ''}>${handles}<div class="escopo-el__inner">${content}</div></div>`;
    }

    findElement(id) {
      return this.getServicos().canvasLivre.elementos.find((e) => e.id === id);
    }

    updateElement(id, patch) {
      const servicos = this.getServicos();
      const el = servicos.canvasLivre.elementos.find((e) => e.id === id);
      if (!el) return;
      Object.assign(el, patch);
      servicos.canvasLivre.altura = this.computeAltura(servicos.canvasLivre.elementos);
      this.saveServicos(servicos);
      this.remountPreserveSelection(id);
    }

    remountPreserveSelection(id) {
      this.selectedId = id;
      this.mount();
    }

    bindToolbar() {
      this.root.querySelectorAll('[data-add-el]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const servicos = this.getServicos();
          const elementos = servicos.canvasLivre.elementos;
          const y = this.computeAltura(elementos) - 40;
          const tipo = btn.dataset.addEl;
          let el;
          if (tipo === 'card') el = defaultCard(y);
          else if (tipo === 'imagem') {
            el = { id: uid(), tipo: 'imagem', x: 80, y, w: 320, h: 200, z: 50, src: '' };
          } else if (tipo === 'titulo') {
            el = { id: uid(), tipo: 'titulo', x: 0, y, w: 600, h: 56, z: 50, html: '<h2>Novo título</h2>' };
          } else {
            el = { id: uid(), tipo: 'texto', x: 40, y, w: 400, h: 80, z: 50, html: '<p>Novo texto</p>' };
          }
          elementos.push(el);
          servicos.canvasLivre.altura = this.computeAltura(elementos);
          this.selectedId = el.id;
          this.saveServicos(servicos);
          this.mount();
        });
      });

      this.root.querySelector('[data-del-el]')?.addEventListener('click', () => {
        if (!this.selectedId) return;
        const servicos = this.getServicos();
        servicos.canvasLivre.elementos = servicos.canvasLivre.elementos.filter((e) => e.id !== this.selectedId);
        servicos.canvasLivre.altura = this.computeAltura(servicos.canvasLivre.elementos);
        this.selectedId = null;
        this.saveServicos(servicos);
        this.mount();
      });

      this.root.querySelector('[data-layer="front"]')?.addEventListener('click', () => this.bumpLayer(1));
      this.root.querySelector('[data-layer="back"]')?.addEventListener('click', () => this.bumpLayer(-1));
    }

    bumpLayer(dir) {
      if (!this.selectedId) return;
      const el = this.findElement(this.selectedId);
      if (!el) return;
      this.updateElement(el.id, { z: Math.max(1, (el.z || 1) + dir) });
    }

    bindCanvas() {
      const canvas = this.root.querySelector('#escopo-canvas-edit');
      if (!canvas) return;

      canvas.addEventListener('click', (ev) => {
        const elNode = ev.target.closest('.escopo-el');
        if (!elNode || !canvas.contains(elNode)) {
          this.selectedId = null;
          this.refreshSelection();
          return;
        }
        ev.stopPropagation();
        this.selectedId = elNode.dataset.elId;
        this.refreshSelection();
        this.renderInspector();
      });

      canvas.querySelectorAll('[data-editable="1"] .escopo-el__inner').forEach((inner) => {
        inner.addEventListener('dblclick', (ev) => {
          ev.stopPropagation();
          inner.setAttribute('contenteditable', 'true');
          inner.focus();
        });
        inner.addEventListener('blur', () => {
          inner.removeAttribute('contenteditable');
          const wrap = inner.closest('.escopo-el');
          const id = wrap?.dataset.elId;
          if (!id) return;
          this.updateElement(id, { html: inner.innerHTML });
        });
      });

      canvas.querySelectorAll('.escopo-el--imagem').forEach((node) => {
        node.addEventListener('dblclick', () => {
          const id = node.dataset.elId;
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
            this.updateElement(id, { src });
          };
          input.click();
        });
      });
    }

    renderInspector() {
      const body = this.root.querySelector('#escopo-inspector-body');
      if (!body) return;
      const el = this.selectedId ? this.findElement(this.selectedId) : null;
      if (!el) {
        body.innerHTML = '<p class="hint">Nenhum elemento selecionado.</p>';
        return;
      }
      if (el.tipo === 'card' && el.card) {
        const c = el.card;
        const ent = (c.entregaveis || []).join('\n');
        body.innerHTML = `
          <label>Categoria</label><input type="text" data-insp="categoria" value="${escapeHtml(c.categoria)}">
          <label>Título</label><input type="text" data-insp="titulo" value="${escapeHtml(c.titulo)}">
          <label>Descrição</label><textarea data-insp="descricao" rows="3">${escapeHtml(c.descricao)}</textarea>
          <label>Entregáveis (um por linha)</label><textarea data-insp="entregaveis" rows="4">${escapeHtml(ent)}</textarea>
          <label>Badge</label><input type="text" data-insp="badge" value="${escapeHtml(c.badge)}">`;
        body.querySelectorAll('[data-insp]').forEach((inp) => {
          const key = inp.dataset.insp;
          const apply = () => {
            const card = { ...el.card };
            if (key === 'entregaveis') {
              card.entregaveis = inp.value.split('\n').map((s) => s.trim()).filter(Boolean);
            } else {
              card[key] = inp.value;
            }
            this.updateElement(el.id, { card });
          };
          inp.addEventListener('change', apply);
          inp.addEventListener('input', () => {
            clearTimeout(inp._t);
            inp._t = setTimeout(apply, 400);
          });
        });
        return;
      }
      body.innerHTML = `
        <label>Posição X</label><input type="number" data-pos="x" value="${el.x}">
        <label>Posição Y</label><input type="number" data-pos="y" value="${el.y}">
        <label>Largura</label><input type="number" data-pos="w" value="${el.w}" min="40">
        <label>Altura</label><input type="number" data-pos="h" value="${el.h}" min="24">`;
      body.querySelectorAll('[data-pos]').forEach((inp) => {
        inp.addEventListener('change', () => {
          const patch = {};
          patch[inp.dataset.pos] = Number(inp.value);
          this.updateElement(el.id, patch);
        });
      });
    }

    refreshSelection() {
      this.root.querySelectorAll('.escopo-el').forEach((n) => {
        n.classList.toggle('is-selected', n.dataset.elId === this.selectedId);
      });
      this.renderInspector();
    }

    initInteract() {
      const canvas = this.root.querySelector('#escopo-canvas-edit');
      if (!canvas || !global.interact) {
        this.fallbackPointerDrag(canvas);
        return;
      }
      global.interact('.escopo-canvas--edit .escopo-el').draggable({
        listeners: {
          move: (ev) => {
            const t = ev.target;
            const x = (parseFloat(t.dataset.x) || 0) + ev.dx;
            const y = (parseFloat(t.dataset.y) || 0) + ev.dy;
            t.style.transform = `translate(${x}px, ${y}px)`;
            t.dataset.x = x;
            t.dataset.y = y;
          },
          end: (ev) => {
            const t = ev.target;
            const id = t.dataset.elId;
            const el = this.findElement(id);
            if (!el) return;
            const nx = (parseFloat(t.dataset.x) || 0) + el.x;
            const ny = (parseFloat(t.dataset.y) || 0) + el.y;
            t.style.transform = '';
            t.dataset.x = 0;
            t.dataset.y = 0;
            this.updateElement(id, { x: Math.round(Math.max(0, nx)), y: Math.round(Math.max(0, ny)) });
          },
        },
      }).resizable({
        edges: { right: true, bottom: true },
        listeners: {
          move: (ev) => {
            const t = ev.target;
            t.style.width = `${ev.rect.width}px`;
            t.style.height = `${ev.rect.height}px`;
          },
          end: (ev) => {
            const id = ev.target.dataset.elId;
            this.updateElement(id, {
              w: Math.round(ev.rect.width),
              h: Math.round(ev.rect.height),
            });
          },
        },
        modifiers:
          global.interact?.modifiers?.restrictSize
            ? [global.interact.modifiers.restrictSize({ min: { width: 60, height: 40 } })]
            : [],
      });
    }

    fallbackPointerDrag(canvas) {
      if (!canvas) return;
      let drag = null;
      canvas.addEventListener('pointerdown', (ev) => {
        const handle = ev.target.closest('[data-resize]');
        const elNode = ev.target.closest('.escopo-el');
        if (!elNode) return;
        if (ev.target.closest('[contenteditable="true"]')) return;
        const id = elNode.dataset.elId;
        const el = this.findElement(id);
        if (!el) return;
        this.selectedId = id;
        this.refreshSelection();
        drag = {
          id,
          resize: !!handle,
          startX: ev.clientX,
          startY: ev.clientY,
          ox: el.x,
          oy: el.y,
          ow: el.w,
          oh: el.h,
        };
        elNode.setPointerCapture(ev.pointerId);
      });
      canvas.addEventListener('pointermove', (ev) => {
        if (!drag) return;
        const node = canvas.querySelector(`[data-el-id="${drag.id}"]`);
        if (!node) return;
        const dx = ev.clientX - drag.startX;
        const dy = ev.clientY - drag.startY;
        if (drag.resize) {
          node.style.width = `${Math.max(60, drag.ow + dx)}px`;
          node.style.height = `${Math.max(40, drag.oh + dy)}px`;
        } else {
          node.style.left = `${drag.ox + dx}px`;
          node.style.top = `${drag.oy + dy}px`;
        }
      });
      canvas.addEventListener('pointerup', (ev) => {
        if (!drag) return;
        const node = canvas.querySelector(`[data-el-id="${drag.id}"]`);
        if (node) {
          if (drag.resize) {
            this.updateElement(drag.id, {
              w: Math.round(parseFloat(node.style.width)),
              h: Math.round(parseFloat(node.style.height)),
            });
          } else {
            this.updateElement(drag.id, {
              x: Math.round(parseFloat(node.style.left)),
              y: Math.round(parseFloat(node.style.top)),
            });
          }
        }
        drag = null;
      });
    }
  }

  global.NidEscopoCanvas = {
    CANVAS_W,
    ensureCanvas,
    syncItensFromCanvas,
    renderEscopoSection,
    EscopoEditor,
  };
})(window);
