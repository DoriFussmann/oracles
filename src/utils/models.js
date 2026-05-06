// Prices in USD per 1M tokens
export const MODEL_PRICING = {
  'gpt-4o':                     { input: 2.50,  output: 10.00 },
  'gpt-4o-mini':                { input: 0.15,  output: 0.60  },
  'gpt-4-turbo':                { input: 10.00, output: 30.00 },
  'o1-mini':                    { input: 3.00,  output: 12.00 },
  'claude-sonnet-4-5':          { input: 3.00,  output: 15.00 },
  'claude-haiku-4-5-20251001':  { input: 0.80,  output: 4.00  },
  'claude-opus-4-5':            { input: 15.00, output: 75.00 },
  'grok-3-latest':              { input: 3.00,  output: 15.00 },
  'grok-3-mini-latest':         { input: 0.30,  output: 0.50  },
  'gemini-2.5-pro':             { input: 1.25,  output: 10.00 },
  'gemini-2.5-flash':           { input: 0.15,  output: 0.60  },
  'gemini-2.0-flash':           { input: 0.10,  output: 0.40  },
  'mistral-large-latest':       { input: 2.00,  output: 6.00  },
  'mistral-small-latest':       { input: 0.10,  output: 0.30  },
  'open-mixtral-8x7b':          { input: 0.65,  output: 2.00  },
  'sonar-pro':                  { input: 3.00,  output: 15.00 },
  'sonar':                      { input: 1.00,  output: 1.00  },
  'sonar-reasoning':            { input: 1.00,  output: 5.00  },
}

export function calculateCost(model, inputTokens, outputTokens) {
  const pricing = MODEL_PRICING[model]
  if (!pricing || inputTokens == null || outputTokens == null) return null
  return (inputTokens / 1_000_000) * pricing.input + (outputTokens / 1_000_000) * pricing.output
}

export const ORACLE_CONFIGS = [
  {
    id: 'openai',
    name: 'OpenAI',
    envKey: 'VITE_OPENAI_API_KEY',
    color: '#10a37f',
    textColor: '#fff',
    models: [
      { label: 'GPT-4o', value: 'gpt-4o' },
      { label: 'GPT-4o mini', value: 'gpt-4o-mini' },
      { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
      { label: 'o1-mini', value: 'o1-mini' },
    ],
    defaultModel: 'gpt-4o',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>`,
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    envKey: 'VITE_ANTHROPIC_API_KEY',
    color: '#cc785c',
    textColor: '#fff',
    models: [
      { label: 'Claude Sonnet 4.5', value: 'claude-sonnet-4-5' },
      { label: 'Claude Haiku 4.5', value: 'claude-haiku-4-5-20251001' },
      { label: 'Claude Opus 4.5', value: 'claude-opus-4-5' },
    ],
    defaultModel: 'claude-sonnet-4-5',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.304 3.541 12.184 17.67H9.401L4.696 3.541h2.894l3.36 10.411L14.41 3.541h2.894zm2.001 0h-2.667v14.13h2.667V3.541z"/></svg>`,
  },
  {
    id: 'grok',
    name: 'Grok',
    envKey: 'VITE_GROK_API_KEY',
    color: '#1a1a1a',
    textColor: '#fff',
    models: [
      { label: 'Grok 3', value: 'grok-3-latest' },
      { label: 'Grok 3 Mini', value: 'grok-3-mini-latest' },
    ],
    defaultModel: 'grok-3-latest',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  },
  {
    id: 'gemini',
    name: 'Gemini',
    envKey: 'VITE_GEMINI_API_KEY',
    color: '#4285f4',
    textColor: '#fff',
    models: [
      { label: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro' },
      { label: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
      { label: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash' },
    ],
    defaultModel: 'gemini-2.5-flash',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"/></svg>`,
  },
  {
    id: 'mistral',
    name: 'Mistral',
    envKey: 'VITE_MISTRAL_API_KEY',
    color: '#ff7000',
    textColor: '#fff',
    models: [
      { label: 'Mistral Large', value: 'mistral-large-latest' },
      { label: 'Mistral Small', value: 'mistral-small-latest' },
      { label: 'Mixtral 8x7B', value: 'open-mixtral-8x7b' },
    ],
    defaultModel: 'mistral-large-latest',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="0" y="0" width="5.5" height="5.5"/><rect x="9.25" y="0" width="5.5" height="5.5"/><rect x="18.5" y="0" width="5.5" height="5.5"/><rect x="18.5" y="9.25" width="5.5" height="5.5"/><rect x="9.25" y="9.25" width="5.5" height="5.5"/><rect x="0" y="9.25" width="5.5" height="5.5"/><rect x="9.25" y="18.5" width="5.5" height="5.5"/><rect x="0" y="18.5" width="5.5" height="5.5"/></svg>`,
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    envKey: 'VITE_PERPLEXITY_API_KEY',
    color: '#20808d',
    textColor: '#fff',
    models: [
      { label: 'Sonar Pro', value: 'sonar-pro' },
      { label: 'Sonar', value: 'sonar' },
      { label: 'Sonar Reasoning', value: 'sonar-reasoning' },
    ],
    defaultModel: 'sonar-pro',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.793l-8.707 1.414v7.386h-2.586v-7.386L2 12.793v-2.586l8.707 1.414V2.407h2.586v9.214L22 10.207v2.586zM2 12.793l2-0.325V11.08L2 10.756v2.037zm18 0v-2.037l-2 0.325v1.387l2 0.325z"/></svg>`,
  },
]
