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

  window.NidProposta.applyLogos(document, dados.logos);
  window.NidProposta.initNav(document);
})();
