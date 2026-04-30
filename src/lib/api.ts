import type { HealthResponse, IngestCsvResponse, RagResponse } from "@/types/api";

const DEFAULT_BASE = "http://localhost:3000";

export function getBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (raw === undefined || raw === "") return DEFAULT_BASE;
  return raw.replace(/\/$/, "");
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function parseErrorBody(res: Response): Promise<unknown> {
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return undefined;
    }
  }
  try {
    return await res.text();
  } catch {
    return undefined;
  }
}

function messageFromBody(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && "message" in body) {
    const m = (body as { message: unknown }).message;
    if (typeof m === "string") return m;
  }
  if (typeof body === "string" && body.trim()) return body;
  return fallback;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { parseJson?: boolean }
): Promise<T> {
  const base = getBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const { parseJson = true, ...rest } = init ?? {};
  const res = await fetch(url, rest);
  if (!res.ok) {
    const body = await parseErrorBody(res);
    const msg = messageFromBody(body, res.statusText || `HTTP ${res.status}`);
    throw new ApiError(msg, res.status, body);
  }
  if (res.status === 204 || !parseJson) {
    return undefined as T;
  }
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    const text = await res.text();
    return text as unknown as T;
  }
  return (await res.json()) as T;
}

/** Typed API surface used by React Query hooks. */
export const apiClient = {
  getHealth: () => apiFetch<HealthResponse>("/health"),

  getRoutes: () => apiFetch<unknown>("/routes"),

  postIngestCsv: (body: {
    csvPath: string;
    textColumn?: string;
    summaryColumn?: string;
    ratingColumn?: string;
    maxRows?: number;
  }) =>
    apiFetch<IngestCsvResponse>("/ingest-csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  postIngestCsvUpload: (formData: FormData) =>
    apiFetch<IngestCsvResponse>("/ingest-csv/upload", {
      method: "POST",
      body: formData,
    }),

  postRag: (body: { message: string; k?: number; systemPrompt?: string }) =>
    apiFetch<RagResponse>("/rag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
};
