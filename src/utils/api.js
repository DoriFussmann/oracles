// ─── OpenAI ──────────────────────────────────────────────────────────────────
export async function callOpenAI(question, model) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) throw new Error('VITE_OPENAI_API_KEY not set in .env')

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: question }],
      max_tokens: 1000,
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `OpenAI error ${res.status}`)
  }
  const data = await res.json()
  return data.choices[0].message.content
}

// ─── Anthropic ───────────────────────────────────────────────────────────────
export async function callAnthropic(question, model) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY not set in .env')

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
      messages: [{ role: 'user', content: question }],
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Anthropic error ${res.status}`)
  }
  const data = await res.json()
  return data.content[0].text
}

// ─── Grok (xAI — OpenAI-compatible) ──────────────────────────────────────────
export async function callGrok(question, model) {
  const apiKey = import.meta.env.VITE_GROK_API_KEY
  if (!apiKey) throw new Error('VITE_GROK_API_KEY not set in .env')

  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: question }],
      max_tokens: 1000,
    }),
  })
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
  return data.choices[0].message.content
}

// ─── Google Gemini ───────────────────────────────────────────────────────────
export async function callGemini(question, model) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) throw new Error('VITE_GEMINI_API_KEY not set in .env')

  const modelPath = model.startsWith('models/') ? model : `models/${model}`
  const payload = {
    contents: [{ parts: [{ text: question }] }],
    generationConfig: { maxOutputTokens: 1000 },
  }

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

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Gemini error ${res.status}`)
  }

  const data = await res.json()
  return data.candidates[0].content.parts[0].text
}

// ─── Mistral ─────────────────────────────────────────────────────────────────
export async function callMistral(question, model) {
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY
  if (!apiKey) throw new Error('VITE_MISTRAL_API_KEY not set in .env')

  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: question }],
      max_tokens: 1000,
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Mistral error ${res.status}`)
  }
  const data = await res.json()
  return data.choices[0].message.content
}

// ─── Perplexity ───────────────────────────────────────────────────────────────
export async function callPerplexity(question, model) {
  const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY
  if (!apiKey) throw new Error('VITE_PERPLEXITY_API_KEY not set in .env')

  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: question }],
      max_tokens: 1000,
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Perplexity error ${res.status}`)
  }
  const data = await res.json()
  return data.choices[0].message.content
}

// ─── Router ──────────────────────────────────────────────────────────────────
export async function callOracle(providerId, question, model) {
  switch (providerId) {
    case 'openai':      return callOpenAI(question, model)
    case 'anthropic':   return callAnthropic(question, model)
    case 'grok':        return callGrok(question, model)
    case 'gemini':      return callGemini(question, model)
    case 'mistral':     return callMistral(question, model)
    case 'perplexity':  return callPerplexity(question, model)
    default: throw new Error(`Unknown provider: ${providerId}`)
  }
}

// ─── Judge (Anthropic) ───────────────────────────────────────────────────────
export async function callJudge(question, responses) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY not set in .env (needed for Judge)')

  const responsesText = responses
    .filter(r => r.status === 'success')
    .map(r => `### ${r.name} (${r.model})\n${r.text}`)
    .join('\n\n---\n\n')

  const prompt = `You are The Judge. The user asked this question to multiple AI models:

**QUESTION:** ${question}

Here are all the responses:

${responsesText}

Your task:
1. Write a brief bullet-point summary of what each model said (1-2 bullets per model, lead with the model name in bold)
2. Write a "Judge's Summary" section that:
   - States the final recommendation/answer
   - Notes which models influenced it and why
   - Highlights any meaningful disagreements between models
   - Is direct and decisive — no hedging

Format your response exactly like this:

## What Each Oracle Said
• **[Model Name]**: [their main point]
• **[Model Name]**: [their main point]
(etc.)

## Judge's Summary
[Your synthesis and final recommendation. Be direct. State which models you weight most heavily and why.]`

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
