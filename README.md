# Proposta comercial premium | NID Studio

Proposta editorial em HTML para apresentação comercial da NID Studio — case **GREMP3**, alinhada ao PDF de referência.

## Visualizar

| Canal | Link |
|-------|------|
| **GitHub Pages** | https://lealzinho30.github.io/Proposta-nid/ |
| **Arquivo local** | Abra `index.html` no navegador |

Use **Gerar PDF** (barra inferior) ou `Ctrl+P` → **Salvar como PDF** para exportar em página contínua, como no documento original.

## Arquivos principais

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Proposta GREMP3 (layout fixo, fiel ao PDF). |
| `assets/gremp3-proposta.css` | Estilos da proposta. |
| `proposta-dados.json` | Conteúdo estruturado (referência para edições futuras). |
| `assets/logo-principal.png`, `assets/logo-clara.png` | Logos NID Studio. |

## Editar conteúdo

Altere textos e valores diretamente em **`index.html`** ou sincronize a partir de **`proposta-dados.json`**. Não há editor visual — o foco é a proposta final estática.

Para publicar no site:

1. Commit na branch de trabalho.
2. Copie `index.html`, `assets/gremp3-proposta.css` e as logos para a branch **`gh-pages`**.
3. Aguarde o deploy do GitHub Pages e atualize com `Ctrl+F5`.

## Case GREMP3

- Cliente: GREMP3 — A/C Mariana — São Paulo, maio de 2026
- Serviços: Fachada/Conceito/Produto, Decorado executivo, PDV e experiência comercial
- Investimento: R$ 75.000 (entrada R$ 5.000 + 7× R$ 10.000)
- Paleta: `#704D3F`, `#E2B38F`, `#B49281`, `#F3DCC6`, `#FFF0DF`, `#FAF6F1`

## Validação local

```bash
python3 scripts/validate_proposta.py
```
