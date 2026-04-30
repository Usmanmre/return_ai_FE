import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { DEMO_STORAGE_KEYS, saveJson } from "@/lib/demoStorage";
import { normalizeRagResponse } from "@/lib/ragUtils";
import type { RagResponse } from "@/types/api";

export type RagInput = {
  message: string;
  k?: number;
  systemPrompt?: string;
};

export type RagNormalized = ReturnType<typeof normalizeRagResponse> & {
  raw: RagResponse;
};

export function useRag() {
  return useMutation({
    mutationFn: async (input: RagInput) => {
      const raw = await apiClient.postRag({
        message: input.message,
        k: input.k,
        systemPrompt: input.systemPrompt?.trim()
          ? input.systemPrompt
          : undefined,
      });
      const normalized = normalizeRagResponse(raw);
      const payload: RagNormalized = { ...normalized, raw };
      saveJson(DEMO_STORAGE_KEYS.ragResult, payload);
      return payload;
    },
  });
}
