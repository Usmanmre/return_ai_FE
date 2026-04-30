import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { DEMO_STORAGE_KEYS, saveJson } from "@/lib/demoStorage";
import { queryKeys } from "@/lib/queryKeys";
import type { IngestCsvResponse } from "@/types/api";

export type IngestUploadFields = {
  textColumn?: string;
  summaryColumn?: string;
  ratingColumn?: string;
  maxRows?: string;
};

function buildFormData(file: File, fields: IngestUploadFields): FormData {
  const fd = new FormData();
  fd.append("file", file);
  if (fields.textColumn) fd.append("textColumn", fields.textColumn);
  if (fields.summaryColumn) fd.append("summaryColumn", fields.summaryColumn);
  if (fields.ratingColumn) fd.append("ratingColumn", fields.ratingColumn);
  if (fields.maxRows) fd.append("maxRows", fields.maxRows);
  return fd;
}

export function useIngestUpload() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      file,
      fields,
    }: {
      file: File;
      fields: IngestUploadFields;
    }) => {
      const fd = buildFormData(file, fields);
      return apiClient.postIngestCsvUpload(fd);
    },
    onSuccess: (data: IngestCsvResponse) => {
      saveJson(DEMO_STORAGE_KEYS.ingestSummary, data);
      void qc.invalidateQueries({ queryKey: queryKeys.health });
    },
  });
}
