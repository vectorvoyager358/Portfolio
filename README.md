# Jeethesh Reddy — Signal Desk Portfolio

 portfolio for a Software / AI Engineer. Includes **Ask Jeethesh**, a grounded streaming assistant powered by **NVIDIA NIM** (`https://integrate.api.nvidia.com/v1`).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Motion + Lenis for interaction
- Vercel AI SDK + `@ai-sdk/openai-compatible` → NVIDIA NIM
- Vitest for grounding / rate-limit / config tests

## Setup

```bash
npm install
cp .env.example .env.local
```

Add your NVIDIA key:

```bash
NVIDIA_API_KEY=nvapi-...
NVIDIA_MODEL=z-ai/glm-5.2
```

Any OpenAI-compatible model ID available on your NVIDIA account works via `NVIDIA_MODEL`.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest |

## Ask Jeethesh

- UI: floating dock + `/#ask` section
- API: `POST /api/chat` streams grounded answers
- Speech-to-text: mic button → `POST /api/transcribe` → NVIDIA Parakeet ASR
- Grounding: `src/data/profile.ts` (resume + pinned projects)
- Without `NVIDIA_API_KEY`, the UI shows an offline state and chat/ASR routes return `503`

Optional ASR endpoint override:

```bash
NVIDIA_ASR_URL=https://….invocation.api.nvcf.nvidia.com/v1/audio/transcriptions
```

## Deploy (Vercel)

Connect this repository to Vercel using Vercel's Git integration. Vercel then
builds and deploys the frontend and the Next.js API routes together:

- Pushes to the configured production branch (normally `main`) create production
  deployments.
- Pushes to other branches and pull requests create preview deployments.
- Vercel reports deployment status and preview URLs back to GitHub.

### Initial setup

1. In Vercel, choose **Add New → Project**, import this GitHub repository, and
   configure `main` as its production branch.
2. Add `NVIDIA_API_KEY`, `NVIDIA_MODEL`, and optional `NVIDIA_ASR_URL` to the
   appropriate Preview and Production environments in Vercel.
3. Deploy the imported project. Future pushes are deployed automatically by
   Vercel, so no `VERCEL_TOKEN`, `VERCEL_ORG_ID`, or `VERCEL_PROJECT_ID` GitHub
   secrets are required.

Do not add a separate GitHub Actions workflow that runs `vercel deploy` while
the Git integration is enabled, because both paths would deploy the same commit.

## Projects featured

- [resilience-hub](https://github.com/vectorvoyager358/resilience-hub)
- [voxwire](https://github.com/vectorvoyager358/voxwire)
- [Local-LLM-Inference-Benchmarking-System](https://github.com/vectorvoyager358/Local-LLM-Inference-Benchmarking-System)
- [moment-keeper](https://github.com/vectorvoyager358/moment-keeper)
