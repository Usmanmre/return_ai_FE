import type { RagResponse, RagSource } from "@/types/api";

function collectSources(data: RagResponse): RagSource[] {
  if (Array.isArray(data.sources)) return data.sources;
  if (Array.isArray(data.chunks)) return data.chunks;
  if (Array.isArray(data.matches)) return data.matches;
  return [];
}

export function normalizeRagResponse(data: RagResponse): {
  answer: string;
  sources: RagSource[];
} {
  const answer =
    (typeof data.answer === "string" && data.answer) ||
    (typeof data.response === "string" && data.response) ||
    (typeof data.text === "string" && data.text) ||
    "";

  const sources = [...collectSources(data)].sort((a, b) => {
    const sa = typeof a.score === "number" ? a.score : -Infinity;
    const sb = typeof b.score === "number" ? b.score : -Infinity;
    return sb - sa;
  });

  return { answer, sources };
}
