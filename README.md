# Ask The Oracles

Multi-model AI query interface. One question → all LLMs answer in parallel → The Judge synthesizes.

## LLMs Included
- OpenAI (GPT-4o, GPT-4o mini, GPT-4 Turbo, o1-mini)
- Anthropic (Claude Sonnet 4.5, Haiku 4.5, Opus 4.5)
- Grok / xAI (Grok 2, Grok 2 Mini)
- Google Gemini (1.5 Pro, 1.5 Flash, 2.0 Flash)
- Mistral (Large, Small, Mixtral 8x7B)
- Perplexity (Sonar Pro, Sonar, Sonar Reasoning)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env

# 3. Fill in your API keys in .env
# (you only need keys for the models you want to use)

# 4. Run locally
npm run dev
```

## API Keys Required
Add these to `.env`:
```
VITE_OPENAI_API_KEY=...
VITE_ANTHROPIC_API_KEY=...   ← also used for The Judge
VITE_GROK_API_KEY=...
VITE_GEMINI_API_KEY=...
VITE_MISTRAL_API_KEY=...
VITE_PERPLEXITY_API_KEY=...
```

You only need keys for the providers you want active. Cards with missing keys will show an error when queried.

## How It Works
1. Type a question, hit **Ask The Oracles** (or ⌘+Enter)
2. All LLMs are queried in parallel — each card shows a loader then its response
3. Once all resolve, **Judge & Sync** appears
4. The Judge (Anthropic) reads all responses and writes a synthesis + final recommendation
5. Copy any individual response or the full Judge summary

## Notes
- All API calls are made client-side (no server needed for local dev)
- Responses are not saved/persisted — session only
- The Judge always uses `claude-sonnet-4-5` regardless of which Anthropic model you pick in the card
- Max page width: 1280px
