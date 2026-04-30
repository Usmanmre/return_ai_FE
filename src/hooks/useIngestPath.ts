import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { DEMO_STORAGE_KEYS, saveJson } from "@/lib/demoStorage";
import type { IngestCsvResponse } from "@/types/api";
import { queryKeys } from "@/lib/queryKeys";

export type IngestPathPayload = {
  csvPath: string;
  textColumn?: string;
  summaryColumn?: string;
  ratingColumn?: string;
  maxRows?: number;
};

export function useIngestPath() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: IngestPathPayload) => apiClient.postIngestCsv(body),
    onSuccess: (data: IngestCsvResponse) => {
      saveJson(DEMO_STORAGE_KEYS.ingestSummary, data);
      void qc.invalidateQueries({ queryKey: queryKeys.health });
    },
  });
}
