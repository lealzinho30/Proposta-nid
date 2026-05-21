(function () {
  const embedded = document.getElementById('dados-embutidos');
  if (!embedded || !window.NidProposta) return;

  let dados;
  try {
    dados = JSON.parse(embedded.textContent);
  } catch (err) {
    console.error(err);
    return;
  }

  window.NidProposta.applyImagens(document, dados);
  window.NidProposta.initNav(document);
  document.querySelectorAll('[data-print-pdf]').forEach((btn) => {
    btn.addEventListener('click', () => window.print());
  });
})();
