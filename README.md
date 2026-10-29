# Site NOXUS — infraestrutura de TI e redes

Landing page responsiva em HTML/CSS/JS, com paleta preto/roxo/branco e formulário preparado para Netlify Forms.

## Como colocar no ar
1. Baixe `noxus-site.zip` e extraia o conteúdo.
2. Abra https://app.netlify.com/drop e envie a pasta `noxus-site` (a pasta enviada precisa conter `index.html` na raiz).
3. Copie a URL pública gerada pelo Netlify. Para manter o site sob sua conta e editar/publicar atualizações, reivindique o projeto na sua conta.
4. Para receber os contatos pelo formulário, abra o painel do site no Netlify, habilite **form detection** na área **Forms** e publique/republique. Depois confira se o formulário `solicitacao-noxus` aparece no painel. Configure também as notificações por e-mail no Netlify para receber os novos contatos.
5. Para usar domínio próprio, conecte-o no painel do provedor de hospedagem.

## Assistente de IA (Gemini)
O botão no canto inferior direito abre um chat com uma assistente baseada no Google Gemini. O navegador nunca vê a chave: as perguntas vão para a função `netlify/functions/chat.mts` (rota `/api/chat`), que conversa com o Gemini.

- **Sem configuração:** o site já funciona usando o Netlify AI Gateway (consumo cobrado em créditos da conta Netlify).
- **Com sua própria chave do Gemini:** gere uma chave em https://aistudio.google.com/apikey e cadastre no Netlify em **Project configuration > Environment variables** com o nome `GEMINI_API_KEY`. Depois faça um novo deploy. A partir daí as chamadas vão direto para a API do Google.
- **Trocar o modelo (opcional):** defina `GEMINI_MODEL` (padrão: `gemini-3-flash-preview`).
- **Personalizar o comportamento:** edite o texto `SYSTEM_PROMPT` em `netlify/functions/chat.mts`.
- Para desenvolvimento local, copie `.env.example` para `.env` e rode `netlify dev`.

## Antes de divulgar
- Confira os serviços, textos e áreas de atendimento. A página evita números, endereços, depoimentos e certificações não fornecidos.
- O formulário solicita nome, empresa, e-mail, telefone, serviço e período preferido. As respostas ficam na área Forms da hospedagem depois que a detecção for ativada.
- Troque ou complemente o formulário com WhatsApp, telefone, e-mail real e link de agenda da empresa quando esses canais estiverem definidos.
- Atualize textos legais/Política de Privacidade conforme o tratamento de dados e a operação real da empresa.

## Arquivos
- `index.html`: página completa e responsiva (inclui o chat de IA).
- `netlify/functions/chat.mts`: função que conecta o chat ao Gemini.
- `.env.example`: variáveis de ambiente do Gemini.
- `assets/noxus-symbol.png`: símbolo recortado da imagem fornecida.
- `assets/noxus-wordmark.png`: marca texto recortada da imagem fornecida.
- `assets/noxus-wordmark-black.png`: versão preta para fundos claros.
