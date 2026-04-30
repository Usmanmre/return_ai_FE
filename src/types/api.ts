/** Normalized RAG source for UI (backend may use other keys). */
export type RagSource = {
  score?: number;
  id?: string;
  rating?: number | string;
  asin?: string;
  textPreview?: string;
};

/** Flexible RAG response — map common backend shapes in the hook. */
export type RagResponse = {
  answer?: string;
  response?: string;
  text?: string;
  sources?: RagSource[];
  chunks?: RagSource[];
  matches?: RagSource[];
  [key: string]: unknown;
};

export type HealthResponse = Record<string, unknown>;

export type IngestCsvResponse = {
  rows?: number;
  vectorsPrepared?: number;
  pineconeUpserted?: number;
  skippedEmpty?: number;
  textColumn?: string;
  [key: string]: unknown;
};
