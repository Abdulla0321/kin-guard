import { NextResponse } from 'next/server'

type ChatRequest = {
  // Free text user message to the AI assistant
  message?: string
  // Optional structured symptom payload forwarded from the client
  symptomReport?: Record<string, unknown>
}

/**
 * System prompt for the sports medicine AI assistant.
 * - Enforces a response framework and strict guardrails to avoid unsafe outputs.
 * - This prompt is intentionally conservative and instructs the model to escalate
 *   to emergency services when red flags are present.
 */
const SYSTEM_PROMPT = `You are KineticGuard's on-field assistant (sports medicine technologist).
Always follow this response framework exactly, using clear, short bullet sections:

1) IMMEDIATE PAUSE: Tell the user to stop activity and ensure scene safety if needed.
2) ACUTE FIELD SELF-ASSESSMENT: Provide 3 rapid checks the user can perform now (weightbearing, neuro screen, visible deformity).
3) EMERGENCY RED-FLAG SCREEN: List specific red-flags that require urgent care (uncontrolled bleeding, loss of consciousness, severe pain >8/10, visible deformity, limb threat, neurological deficit).
4) FIELD FIRST AID: Provide conservative first-aid steps (P.O.L.I.C.E., immobilize if suspected fracture, monitor airway/breathing) but NEVER prescribe medications or dosages.
5) SAFE RETURN CRITERIA: Outline conservative criteria for when the user may consider safe return to activity and when to seek clinician review.
6) DISCLAIMERS: Short mandatory legal/clinical disclaimers.

Guardrails (MUST NOT break these):
- Do NOT diagnose fractures or provide definitive diagnoses. Use language like "possible" and recommend clinical assessment.
- Do NOT prescribe medications or dosages.
- If a red-flag is present, always instruct urgent clinical assessment / emergency services.
- Keep language conservative and action-oriented.
`

/**
 * Build assistant-friendly prompt combining system + user context.
 */
function buildMessages(body: ChatRequest) {
  const userParts: string[] = []
  if (body.message) userParts.push(`User: ${body.message}`)
  if (body.symptomReport) userParts.push(`SymptomReport: ${JSON.stringify(body.symptomReport)}`)

  const user = userParts.length > 0 ? userParts.join('\n\n') : 'User requests general on-field sports medicine advice.'

  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: user }
  ]
}

function createTextStream(text: string) {
  return new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      controller.enqueue(encoder.encode(text))
      controller.close()
    }
  })
}

async function buildProviderText(messages: { role: string; content: string }[]) {
  const openaiKey = process.env.OPENAI_API_KEY?.trim()
  const groqKey = process.env.GROQ_API_KEY?.trim()
  const groqModel = process.env.GROQ_MODEL?.trim() || 'llama-3.1-8b-instant'

  if (!openaiKey && !groqKey) {
    return null
  }

  const provider = openaiKey ? 'openai' : 'groq'
  const providerKey = openaiKey ?? groqKey
  const providerUrl = openaiKey
    ? 'https://api.openai.com/v1/chat/completions'
    : 'https://api.groq.com/openai/v1/chat/completions'

  const res = await fetch(providerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${providerKey}`
    },
    body: JSON.stringify({
      model: openaiKey ? 'gpt-4o-mini' : groqModel,
      messages,
      max_tokens: 800,
      temperature: 0.2
    })
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${provider} provider unavailable: ${text}`)
  }

  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content

  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content.map((part) => (typeof part === 'string' ? part : part?.text ?? '')).join('')
  }

  return null
}

/**
 * POST /api/chat
 * - Expects a JSON body matching ChatRequest.
 * - If `OPENAI_API_KEY` is configured, proxies request to OpenAI Chat Completions.
 * - Otherwise returns a conservative, hardcoded fallback response.
 */
export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body', detail: err?.message ?? String(err) }, { status: 400 })
  }

  const messages: { role: string; content: string }[] = Array.isArray(body?.messages)
    ? body.messages
    : [{ role: 'user', content: body?.message ?? 'General sports medicine guidance requested.' }]

  const lastUserMessage = messages.filter((m) => m.role === 'user').at(-1)?.content ?? 'General sports medicine guidance requested.'
  const systemPrompt = SYSTEM_PROMPT

  // Keep the app usable even if the provider key/model is missing or invalid.
  try {
    const providerText = await buildProviderText([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: lastUserMessage }
    ])

    const text = providerText ?? `IMMEDIATE PAUSE: Stop activity and ensure the environment is safe.\n\nACUTE FIELD SELF-ASSESSMENT:\n- Can you bear weight?\n- Check for visible deformity/swelling.\n- Test sensation and movement distal to the injury.\n\nEMERGENCY RED-FLAG SCREEN:\n- Severe pain >8/10\n- Loss of consciousness\n- Visible deformity or locked joint\n- Numbness, tingling or weakness\n- Uncontrolled bleeding\n\nFIELD FIRST AID:\n- Use P.O.L.I.C.E. or R.I.C.E. as appropriate.\n- Protect and immobilize the area.\n- Seek urgent assessment if symptoms progress.\n\nSAFE RETURN CRITERIA:\n- No return to activity while severe pain, swelling, or instability remains.\n- Consider clinician review before returning if symptoms persist.\n\nDISCLAIMER: This is conservative field guidance and not a diagnosis.`

    return new Response(createTextStream(text), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    })
  } catch (err: any) {
    const safeText = `IMMEDIATE PAUSE: Stop activity and ensure the environment is safe.\n\nACUTE FIELD SELF-ASSESSMENT:\n- Can you bear weight?\n- Check for visible deformity/swelling.\n- Test sensation and movement distal to the injury.\n\nEMERGENCY RED-FLAG SCREEN:\n- Severe pain >8/10\n- Loss of consciousness\n- Visible deformity or locked joint\n- Numbness, tingling or weakness\n- Uncontrolled bleeding\n\nFIELD FIRST AID:\n- Use P.O.L.I.C.E. or R.I.C.E. as appropriate.\n- Protect and immobilize the area.\n- Seek urgent assessment if symptoms progress.\n\nSAFE RETURN CRITERIA:\n- No return to activity while severe pain, swelling, or instability remains.\n- Consider clinician review before returning if symptoms persist.\n\nDISCLAIMER: This is conservative field guidance and not a diagnosis.`

    return new Response(createTextStream(safeText), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    })
  }
}

// Lightweight health-check GET handler for quick debugging
export async function GET() {
  return NextResponse.json({ ok: true, status: 'ready', timestamp: new Date().toISOString() })
}

/*
  Why this approach:
  - Keeps the API surface simple and testable.
  - Uses an explicit system prompt implementing the required response framework and guardrails.
  - Falls back to a safe canned response when no API key is configured so the app remains usable during development.

  Edge cases / improvements:
  - In production, you may want to stream responses, validate/ rate-limit inputs, and log interactions for auditing.
  - Replace direct fetch with the Vercel AI SDK client when available and authorized.
*/
