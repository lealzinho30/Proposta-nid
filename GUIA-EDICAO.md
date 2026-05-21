# Como editar a proposta sem código

Você não precisa abrir HTML nem usar terminal. Tudo é feito no **Editor visual** no navegador.

## Passo a passo (3 minutos)

### 1. Abrir o editor

No computador ou pelo link publicado:

- **Editor:** `editor.html`  
- Exemplo online: https://lealzinho30.github.io/Proposta-nid/editor.html

### 2. Alterar textos

Use o menu à esquerda (Capa, Logos, Serviços, etc.) e preencha os campos:

- **Capa** — nome do cliente, destinatário, resumo, data, tags  
- **Serviços** — título, descrição, entregáveis (um por linha)  
- **Investimento** — valores e parcelas  
- **Condições** e **Encerramento** — textos e assinaturas  

Botões **+ Adicionar** criam novos serviços, condições ou parágrafos. **Remover** apaga o bloco.

### 3. Trocar logos e símbolos (upload)

No editor há duas seções:

- **Logos NID Studio** — marca na capa e no encerramento
- **Símbolos NID** — decorativos no Sobre, Filosofia (arco + rodapé), **8 etapas do Processo** e rodapé do encerramento

Em cada espaço, clique em **Escolher imagem** e envie PNG ou JPG (fundo transparente funciona melhor). Enquanto vazio, a proposta mostra o texto *Upload · …* indicando onde a imagem vai aparecer.

### 4. Ver o resultado

Clique em **Ver proposta**. Abre a visualização final (`modelo.html`) com o mesmo layout premium.

### 5. Salvar o seu trabalho

| Botão | O que faz |
|--------|-----------|
| **Salvar no navegador** | Guarda na memória do navegador (útil para continuar depois no mesmo PC) |
| **Baixar dados** | Gera `proposta-dados.json` — arquivo de backup ou para enviar a alguém |
| **Carregar dados** | Restaura um `proposta-dados.json` que você baixou antes |
| **Baixar proposta pronta (HTML)** | Um único arquivo `.html` com textos e imagens embutidos — abre em qualquer navegador, envia por e-mail ou gera PDF com *Imprimir → Salvar como PDF* |

## Nova proposta para outro cliente

1. Abra o editor.  
2. Clique em **Restaurar modelo GREMP3** só se quiser recomeçar do exemplo.  
3. Altere capa, serviços, valores e logos.  
4. **Baixar proposta pronta (HTML)** — pronto para enviar.  

Opcional: renomeie o arquivo baixado (ex.: `Proposta-ClienteX.html`).

## Publicar no site (GitHub)

Se você usa o repositório no GitHub:

1. **Baixar dados** no editor.  
2. No GitHub, branch `gh-pages`, substitua o arquivo `proposta-dados.json` pelo que você baixou.  
3. Aguarde alguns minutos e abra https://lealzinho30.github.io/Proposta-nid/modelo.html  

As logos no site continuam em `assets/`; no editor, imagens enviadas pelo upload ficam embutidas no HTML exportado ou no JSON se forem em base64.

## Dúvidas frequentes

**Preciso saber programar?**  
Não. Só preencher formulários e escolher imagens.

**Como gero PDF em uma página contínua?**  
No editor, clique em **Gerar PDF**. Ou na proposta aberta use **Gerar PDF (página contínua)** / `Ctrl+P` → **Salvar como PDF**. O layout evita quebras forçadas entre seções.

**Perdi o que editei**  
Use **Carregar dados** com o `proposta-dados.json` que você baixou, ou **Salvar no navegador** com frequência.

**O case GREMP3 original**  
Continua em `index.html`, fixo. O **modelo editável** é `modelo.html` + `editor.html`.
