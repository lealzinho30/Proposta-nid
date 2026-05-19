# Proposta comercial premium | NID Studio

Material editorial em HTML para apresentação comercial premium da NID Studio — case **GREMP3**.

## Arquivos principais

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Proposta em **HTML normal** (página única, navegação por dots, sem iframe/painel). |
| `proposta-nid-studio.html` | Versão editorial alternativa da proposta (referência / exportação). |
| `NID_Studio_Proposta_GREMP3.pdf` | PDF final gerado da proposta. |

## Como visualizar

1. Abra `index.html` diretamente no navegador (arquivo local ou via GitHub Pages / jsDelivr).
2. Use os **dots** à direita (ou na base, no mobile) para saltar entre seções.
3. Na seção **Encerramento**, use **Abrir PDF** para o arquivo local `NID_Studio_Proposta_GREMP3.pdf` ou **Voltar ao início** para retornar à capa.
4. Para gerar um novo PDF: **Imprimir → Salvar como PDF** no navegador.

## Links públicos

**Proposta HTML (jsDelivr — branch `gh-pages`):**

https://cdn.jsdelivr.net/gh/lealzinho30/Proposta-nid@gh-pages/index.html

**PDF direto (raw GitHub — branch `gh-pages`):**

https://raw.githubusercontent.com/lealzinho30/Proposta-nid/gh-pages/NID_Studio_Proposta_GREMP3.pdf

**GitHub Pages** (após habilitar em *Settings → Pages*, branch `gh-pages`, pasta `/ (root)`):

https://lealzinho30.github.io/Proposta-nid/

## Conteúdo do case GREMP3

- Cliente: GREMP3 — A/C Mariana — São Paulo, 15 de maio de 2026
- Serviços: Fachada/Conceito/Produto, Projeto Executivo do Apartamento Decorado, PDV e Experiência Comercial
- Investimento: R$ 75.000,00 (sinal R$ 5.000 + 7× R$ 10.000)
- Entrega: DWG/CAD + PDF
- Foro: Comarca de São Paulo — SP

## Validação local

```bash
python3 scripts/validate_proposta.py
```

## Personalização

Edite `index.html` para novos clientes (metadados da capa, escopo, investimento e condições). Mantenha a paleta NID (`#704D3F`, `#E2B38F`, `#B49281`, `#F3DCC6`, `#FFF0DF`, `#FAF6F1`) e as fontes IBM Plex Serif / Sans.

## Link visual da proposta

Para visualizar a proposta renderizada no navegador, use:

- https://htmlpreview.github.io/?https://github.com/lealzinho30/Proposta-nid/blob/gh-pages/index.html

Nao use o link direto do jsDelivr para abrir no navegador, pois ele pode exibir o HTML como codigo-fonte em vez de renderizar a proposta visualmente.
