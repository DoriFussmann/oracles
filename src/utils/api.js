const SYSTEM_PROMPT = `You are a helpful AI assistant in a multi-model comparison tool.
You MUST begin your response with a <summary> tag containing exactly 1-3 short bullet points summarizing your answer.
Then, provide your full response outside and below the <summary> tag.

Example format:
<summary>
• Point 1
• Point 2
</summary>
Your full answer here...`

// ─── OpenAI ──────────────────────────────────────────────────────────────────
export async function callOpenAI(messages, model) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) throw new Error('VITE_OPENAI_API_KEY not set in .env')

  const startTime = Date.now()
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 1000,
    }),
  })
  const ttft = Date.now() - startTime
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `OpenAI error ${res.status}`)
  }
  const data = await res.json()
  return {
    text: data.choices[0].message.content,
    inputTokens: data.usage?.prompt_tokens ?? null,
    outputTokens: data.usage?.completion_tokens ?? null,
    totalTime: Date.now() - startTime,
    ttft,
  }
}

// ─── Anthropic ───────────────────────────────────────────────────────────────
export async function callAnthropic(messages, model) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY not set in .env')

  const startTime = Date.now()
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages,
    }),
  })
  const ttft = Date.now() - startTime
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Anthropic error ${res.status}`)
  }
  const data = await res.json()
  return {
    text: data.content[0].text,
    inputTokens: data.usage?.input_tokens ?? null,
    outputTokens: data.usage?.output_tokens ?? null,
    totalTime: Date.now() - startTime,
    ttft,
  }
}

// ─── Grok (xAI — OpenAI-compatible) ──────────────────────────────────────────
export async function callGrok(messages, model) {
  const apiKey = import.meta.env.VITE_GROK_API_KEY
  if (!apiKey) throw new Error('VITE_GROK_API_KEY not set in .env')

  const startTime = Date.now()
  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 1000,
    }),
  })
  const ttft = Date.now() - startTime
  if (!res.ok) {
    const raw = await res.text().catch(() => '')
    let message = ''
    try {
      const parsed = JSON.parse(raw)
      message = parsed?.error?.message || parsed?.message || ''
    } catch {
      message = raw.trim()
    }
    throw new Error(message || `Grok error ${res.status}`)
  }
  const data = await res.json()
  return {
    text: data.choices[0].message.content,
    inputTokens: data.usage?.prompt_tokens ?? null,
    outputTokens: data.usage?.completion_tokens ?? null,
    totalTime: Date.now() - startTime,
    ttft,
  }
}

// ─── Google Gemini ───────────────────────────────────────────────────────────
export async function callGemini(messages, model) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) throw new Error('VITE_GEMINI_API_KEY not set in .env')

  const modelPath = model.startsWith('models/') ? model : `models/${model}`
  
  const geminiContents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }))

  const payload = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: geminiContents,
    generationConfig: { maxOutputTokens: 1000 },
  }

  const startTime = Date.now()

  const callGeminiVersion = async (version) => fetch(
    `https://generativelanguage.googleapis.com/${version}/${modelPath}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  )

  let res = await callGeminiVersion('v1')
  if (!res.ok && (res.status === 404 || res.status === 400)) {
    const maybeErr = await res.json().catch(() => ({}))
    const msg = maybeErr?.error?.message || ''
    if (msg.includes('not found') || msg.includes('not supported')) {
      res = await callGeminiVersion('v1beta')
    }
  }
  const ttft = Date.now() - startTime

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Gemini error ${res.status}`)
  }

  const data = await res.json()
  return {
    text: data.candidates[0].content.parts[0].text,
    inputTokens: data.usageMetadata?.promptTokenCount ?? null,
    outputTokens: data.usageMetadata?.candidatesTokenCount ?? null,
    totalTime: Date.now() - startTime,
    ttft,
  }
}

// ─── Mistral ─────────────────────────────────────────────────────────────────
export async function callMistral(messages, model) {
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY
  if (!apiKey) throw new Error('VITE_MISTRAL_API_KEY not set in .env')

  const startTime = Date.now()
  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 1000,
    }),
  })
  const ttft = Date.now() - startTime
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Mistral error ${res.status}`)
  }
  const data = await res.json()
  return {
    text: data.choices[0].message.content,
    inputTokens: data.usage?.prompt_tokens ?? null,
    outputTokens: data.usage?.completion_tokens ?? null,
    totalTime: Date.now() - startTime,
    ttft,
  }
}

// ─── Perplexity ───────────────────────────────────────────────────────────────
export async function callPerplexity(messages, model) {
  const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY
  if (!apiKey) throw new Error('VITE_PERPLEXITY_API_KEY not set in .env')

  const startTime = Date.now()
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 1000,
    }),
  })
  const ttft = Date.now() - startTime
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Perplexity error ${res.status}`)
  }
  const data = await res.json()
  return {
    text: data.choices[0].message.content,
    inputTokens: data.usage?.prompt_tokens ?? null,
    outputTokens: data.usage?.completion_tokens ?? null,
    totalTime: Date.now() - startTime,
    ttft,
  }
}

// ─── Router ──────────────────────────────────────────────────────────────────
export async function callOracle(providerId, messages, model) {
  switch (providerId) {
    case 'openai':      return callOpenAI(messages, model)
    case 'anthropic':   return callAnthropic(messages, model)
    case 'grok':        return callGrok(messages, model)
    case 'gemini':      return callGemini(messages, model)
    case 'mistral':     return callMistral(messages, model)
    case 'perplexity':  return callPerplexity(messages, model)
    default: throw new Error(`Unknown provider: ${providerId}`)
  }
}

// ─── Synthesizer (Formerly Judge) ────────────────────────────────────────────
export async function callJudge(messages, responses) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY not set in .env')

  const latestMessage = messages[messages.length - 1]?.content || ''

  const responsesText = responses
    .filter(r => r.status === 'success')
    .map(r => `### ${r.name} (${r.model})\n${r.text}`)
    .join('\n\n---\n\n')

  const prompt = `You are a Synthesizer in a multi-model AI comparison tool. The user asked this question to multiple AI models:

**LATEST QUESTION:** ${latestMessage}

Here are all the responses from the different models:

${responsesText}

Your task is to create a "Working Draft Synthesis" that aggregates the best points from all models into a single, cohesive answer that the user can use to continue the conversation.

Format your response exactly like this:

## Model Summaries
• **[Model Name]**: [1 short bullet point on their unique take]
• **[Model Name]**: [1 short bullet point on their unique take]

## Synthesis Draft
[Your combined, finalized response that the user can take forward as the truth or working draft.]`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Judge error ${res.status}`)
  }
  const data = await res.json()
  return data.content[0].text
}
