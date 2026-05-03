# Review Intelligence — frontend

Production-style marketing and ops demo UI for the Review Intelligence Node API (RAG over ingested reviews / Pinecone). Built with **Vite**, **React 18**, **TypeScript**, **Tailwind CSS**, and **TanStack React Query** (`apiClient` + typed hooks).

## Prerequisites

- Node.js 18+ (recommended 20+)
- API running (default `http://localhost:3000`)

## Setup

```bash
npm install
cp .env.example .env
# edit .env if your API is not on localhost:3000
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Environment

| Variable                  | Description                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| `VITE_API_BASE_URL`     | Base URL for API calls (no trailing slash). Default:`http://localhost:3000`              |
| `VITE_DEV_PROXY_TARGET` | Target for the Vite dev proxy when forwarding `/api` (default `http://localhost:3000`) |

## CORS troubleshooting

Browsers enforce CORS on `fetch`. If your API does not send permissive CORS headers:

1. Set **`VITE_API_BASE_URL=/api`** in `.env`.
2. Ensure [`vite.config.ts`](vite.config.ts) proxies `/api` to your API (default `http://localhost:3000`).
3. Restart `npm run dev`.

The client will call `/api/health`, `/api/rag`, etc.; Vite rewrites them to `/health`, `/rag` on the backend.

Prefer fixing CORS on the server for production; the proxy is for **local development** only.

## Scripts

- `npm run dev` — Vite dev server
- `npm run build` — Typecheck + production bundle
- `npm run preview` — Serve the production build locally

## Routes

| Path         | Purpose                                      |
| ------------ | -------------------------------------------- |
| `/`        | Dashboard, health, CTAs                      |
| `/ingest`  | CSV upload (multipart) or server path (JSON) |
| `/analyze` | RAG workspace                                |
| `/docs`    | Curl examples and integration notes          |

## Project layout

- [`src/lib/api.ts`](src/lib/api.ts) — `getBaseUrl`, `apiFetch`, `ApiError`, **`apiClient`**
- [`src/hooks/`](src/hooks/) — React Query–backed `useHealth`, `useIngestUpload`, `useIngestPath`, `useRag`
- [`src/components/ui/`](src/components/ui/) — Reusable primitives and toasts
- [`src/lib/demoStorage.ts`](src/lib/demoStorage.ts) — Namespaced `localStorage` for last ingest / RAG results

## API contract (reference)

- `GET /health`
- `GET /routes` (optional)
- `POST /ingest-csv/upload` — multipart, field `file`
- `POST /rag` — **JSON only**, `Content-Type: application/json`, body includes `message` (prefer), optional `k`, `systemPrompt`
