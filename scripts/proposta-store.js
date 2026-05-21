/* Persistência e compressão de imagens da proposta */
(function (global) {
  const LS_KEY = 'nid-proposta-dados';
  const SS_PREVIEW = 'nid-proposta-preview';

  function compressImage(file, maxWidth = 1400, quality = 0.88) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('Arquivo não é imagem'));
        return;
      }
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        let { width, height } = image;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);
        const outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const q = outType === 'image/png' ? undefined : quality;
        resolve(canvas.toDataURL(outType, q));
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Não foi possível ler a imagem'));
      };
      image.src = url;
    });
  }

  function persistDados(dados) {
    const json = JSON.stringify(dados);
    try {
      localStorage.setItem(LS_KEY, json);
      return { ok: true, where: 'localStorage' };
    } catch (err) {
      try {
        sessionStorage.setItem(LS_KEY, json);
        return { ok: true, where: 'sessionStorage', warn: 'localStorage cheio — usando sessão do navegador' };
      } catch (err2) {
        return { ok: false, error: err2 };
      }
    }
  }

  function setPreviewPayload(dados) {
    const json = JSON.stringify(dados);
    sessionStorage.setItem(SS_PREVIEW, json);
    sessionStorage.setItem(SS_PREVIEW + ':ts', String(Date.now()));
  }

  async function loadDados() {
    const preview = sessionStorage.getItem(SS_PREVIEW);
    if (preview) {
      try {
        return JSON.parse(preview);
      } catch (e) {
        console.warn('Preview inválido', e);
      }
    }
    for (const store of [localStorage, sessionStorage]) {
      const raw = store.getItem(LS_KEY);
      if (!raw) continue;
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.warn('Dados salvos inválidos', e);
      }
    }
    const res = await fetch('proposta-dados.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Não foi possível carregar proposta-dados.json');
    return res.json();
  }

  function waitForImages(root, timeoutMs = 12000) {
    const imgs = [...root.querySelectorAll('img[src]')].filter((img) => img.src && !img.complete);
    if (!imgs.length) return Promise.resolve();
    return new Promise((resolve) => {
      let pending = imgs.length;
      const done = () => {
        pending -= 1;
        if (pending <= 0) resolve();
      };
      const timer = setTimeout(resolve, timeoutMs);
      imgs.forEach((img) => {
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      });
      if (pending <= 0) {
        clearTimeout(timer);
        resolve();
      }
    });
  }

  global.NidPropostaStore = {
    compressImage,
    persistDados,
    setPreviewPayload,
    loadDados,
    waitForImages,
    LS_KEY,
    SS_PREVIEW,
  };
})(window);
