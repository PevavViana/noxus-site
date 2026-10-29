import type { Config } from '@netlify/functions'
import { GoogleGenAI } from '@google/genai'

// Modelo padrão; pode ser trocado definindo a variável GEMINI_MODEL no painel do Netlify.
const DEFAULT_MODEL = 'gemini-3-flash-preview'
const MAX_HISTORY = 20
const MAX_CHARS = 2000

const SYSTEM_PROMPT = `Você é a assistente virtual da NOXUS, empresa que projeta, implanta e mantém infraestrutura de TI e redes para empresas.
Serviços: redes estruturadas e cabeamento; Wi-Fi corporativo; servidores e infraestrutura; segurança de rede e firewall; monitoramento e suporte; consultoria e projetos de TI.
Regras:
- Responda sempre em português do Brasil, de forma clara, cordial e objetiva (no máximo 3 parágrafos curtos).
- Tire dúvidas sobre os serviços e sobre conceitos de TI e redes.
- Não invente preços, prazos, endereços, telefones, certificações ou clientes. Quando o assunto exigir orçamento ou análise do ambiente, sugira preencher o formulário de contato da página (seção "Contato").
- Nunca peça senhas ou dados confidenciais.
- Se a pergunta não tiver relação com TI, redes ou a NOXUS, responda brevemente e redirecione a conversa.`

type ChatMessage = { role: 'user' | 'model'; text: string }

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let messages: ChatMessage[]
  try {
    const body = await req.json()
    messages = Array.isArray(body?.messages) ? body.messages : []
  } catch {
    return Response.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const contents = messages
    .filter((m) => (m?.role === 'user' || m?.role === 'model') && typeof m.text === 'string' && m.text.trim())
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, parts: [{ text: m.text.slice(0, MAX_CHARS) }] }))

  if (!contents.length || contents[contents.length - 1].role !== 'user') {
    return Response.json({ error: 'Envie uma pergunta.' }, { status: 400 })
  }

  // Lê GEMINI_API_KEY do ambiente: usa sua chave do Google se estiver definida,
  // ou a chave do Netlify AI Gateway, injetada automaticamente.
  const ai = new GoogleGenAI({})

  try {
    const stream = await ai.models.generateContentStream({
      model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
      contents,
      config: { systemInstruction: SYSTEM_PROMPT, temperature: 0.6 },
    })

    const encoder = new TextEncoder()
    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              if (chunk.text) controller.enqueue(encoder.encode(chunk.text))
            }
          } catch (err) {
            console.error('Gemini stream error', err)
            controller.enqueue(encoder.encode('\n\n[A resposta foi interrompida. Tente novamente.]'))
          }
          controller.close()
        },
      }),
      { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } },
    )
  } catch (err) {
    console.error('Gemini error', err)
    return Response.json({ error: 'Não foi possível falar com a IA agora.' }, { status: 502 })
  }
}

export const config: Config = {
  path: '/api/chat',
}
