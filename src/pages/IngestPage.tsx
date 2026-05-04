import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { DEMO_STORAGE_KEYS, loadJson } from "@/lib/demoStorage";
import type { IngestCsvResponse } from "@/types/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { useIngestPath, type IngestPathPayload } from "@/hooks/useIngestPath";
import {
  useIngestUpload,
} from "@/hooks/useIngestUpload";

function formatSummary(data: IngestCsvResponse) {
  return (
    <ul className="mt-2 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
      {data.rows !== undefined ? (
        <li>
          <span className="font-mono text-foreground">rows</span>: {data.rows}
        </li>
      ) : null}
      {data.vectorsPrepared !== undefined ? (
        <li>
          <span className="font-mono text-foreground">vectorsPrepared</span>:{" "}
          {data.vectorsPrepared}
        </li>
      ) : null}
      {data.pineconeUpserted !== undefined ? (
        <li>
          <span className="font-mono text-foreground">pineconeUpserted</span>:{" "}
          {data.pineconeUpserted}
        </li>
      ) : null}
      {data.skippedEmpty !== undefined ? (
        <li>
          <span className="font-mono text-foreground">skippedEmpty</span>:{" "}
          {data.skippedEmpty}
        </li>
      ) : null}
      {data.textColumn !== undefined ? (
        <li className="sm:col-span-2">
          <span className="font-mono text-foreground">textColumn</span>:{" "}
          {String(data.textColumn)}
        </li>
      ) : null}
    </ul>
  );
}

export function IngestPage() {
  const toast = useToast();
  const upload = useIngestUpload();
  const pathIngest = useIngestPath();

  const [file, setFile] = useState<File | null>(null);
  // const [uploadFields, setUploadFields] = useState<IngestUploadFields>({});
  const [pathForm, setPathForm] = useState<IngestPathPayload>({
    csvPath: "",
  });

  const [summary, setSummary] = useState<IngestCsvResponse | null>(() =>
    loadJson<IngestCsvResponse>(DEMO_STORAGE_KEYS.ingestSummary)
  );
  const [devPayload, setDevPayload] = useState<unknown>(() =>
    loadJson<IngestCsvResponse>(DEMO_STORAGE_KEYS.ingestSummary)
  );
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadJson<IngestCsvResponse>(DEMO_STORAGE_KEYS.ingestSummary);
    if (saved) {
      setSummary(saved);
      setDevPayload(saved);
    }
  }, []);

  const busy = upload.isPending || pathIngest.isPending;

  const onUploadSubmit = () => {
    if (!file) {
      toast.push({ title: "Choose a file", tone: "error" });
      return;
    }
    setLastErrorMessage(null);
    upload.mutate(
      { file, fields: {} },
      {
        onSuccess: (data) => {
          setSummary(data);
          setDevPayload(data);
          toast.push({
            title: "Upload ingested",
            message: "Vectors prepared and upserted per server response.",
            tone: "success",
          });
        },
        onError: (err) => {
          const msg = err instanceof ApiError ? err.message : String(err);
          setLastErrorMessage(msg);
          setDevPayload(
            err instanceof ApiError ? err.body ?? { error: msg } : { error: msg }
          );
          toast.push({ title: "Ingest failed", message: msg, tone: "error" });
        },
      }
    );
  };

  const onPathSubmit = () => {
    if (!pathForm.csvPath.trim()) {
      toast.push({ title: "csvPath required", tone: "error" });
      return;
    }
    const maxRows =
      pathForm.maxRows === undefined || pathForm.maxRows === null
        ? undefined
        : Number(pathForm.maxRows);
    setLastErrorMessage(null);
    pathIngest.mutate(
      {
        csvPath: pathForm.csvPath.trim(),
        textColumn: pathForm.textColumn || undefined,
        summaryColumn: pathForm.summaryColumn || undefined,
        ratingColumn: pathForm.ratingColumn || undefined,
        maxRows:
          maxRows !== undefined && !Number.isNaN(maxRows) ? maxRows : undefined,
      },
      {
        onSuccess: (data) => {
          setSummary(data);
          setDevPayload(data);
          toast.push({
            title: "Path ingest complete",
            tone: "success",
          });
        },
        onError: (err) => {
          const msg = err instanceof ApiError ? err.message : String(err);
          setLastErrorMessage(msg);
          setDevPayload(
            err instanceof ApiError ? err.body ?? { error: msg } : { error: msg }
          );
          toast.push({ title: "Ingest failed", message: msg, tone: "error" });
        },
      }
    );
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8">
        <h2 className="text-2xl font-bold tracking-tight">Data ingestion</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Upload a CSV from your machine or point the API at a CSV path on the
          server. Column overrides help when headers are nonstandard.
        </p>

        <Card className="mt-8">
          <CardHeader>
            <h3 className="text-base font-semibold">Ingestion</h3>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload">
              <TabsList>
                <TabsTrigger value="upload">Upload CSV</TabsTrigger>
                {/* <TabsTrigger value="path">Ingest from server path</TabsTrigger> */}
              </TabsList>

              <TabsContent value="upload">
                <FileDropzone
                  onFile={setFile}
                  disabled={busy}
                  className="mt-2"
                >
                  <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-10 text-center transition hover:border-accent/50">
                    <p className="font-medium text-foreground">
                      {file ? file.name : "Drop CSV here or click to browse"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Multipart field name <span className="font-mono">file</span>
                    </p>
                  </div>
                </FileDropzone>

                {/* <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Input
                    id="u-text"
                    label="textColumn (optional)"
                    value={uploadFields.textColumn ?? ""}
                    onChange={(e) =>
                      setUploadFields((s) => ({
                        ...s,
                        textColumn: e.target.value,
                      }))
                    }
                    placeholder="e.g. review_body"
                  />
                  <Input
                    id="u-sum"
                    label="summaryColumn (optional)"
                    value={uploadFields.summaryColumn ?? ""}
                    onChange={(e) =>
                      setUploadFields((s) => ({
                        ...s,
                        summaryColumn: e.target.value,
                      }))
                    }
                  />
                  <Input
                    id="u-rat"
                    label="ratingColumn (optional)"
                    value={uploadFields.ratingColumn ?? ""}
                    onChange={(e) =>
                      setUploadFields((s) => ({
                        ...s,
                        ratingColumn: e.target.value,
                      }))
                    }
                  />
                  <Input
                    id="u-max"
                    label="maxRows (optional)"
                    value={uploadFields.maxRows ?? ""}
                    onChange={(e) =>
                      setUploadFields((s) => ({
                        ...s,
                        maxRows: e.target.value,
                      }))
                    }
                    inputMode="numeric"
                  />
                </div> */}

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    disabled={busy}
                    onClick={onUploadSubmit}
                  >
                    {upload.isPending ? "Uploading…" : "Upload & ingest"}
                  </Button>
                  {upload.isPending ? (
                    <Badge tone="muted">POST /ingest-csv/upload</Badge>
                  ) : null}
                </div>
              </TabsContent>

              <TabsContent value="path">
                <div className="grid gap-4">
                  <Input
                    id="p-path"
                    label="csvPath"
                    required
                    value={pathForm.csvPath}
                    onChange={(e) =>
                      setPathForm((s) => ({ ...s, csvPath: e.target.value }))
                    }
                    placeholder="/data/reviews.csv"
                    className="font-mono text-sm"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      id="p-text"
                      label="textColumn (optional)"
                      value={pathForm.textColumn ?? ""}
                      onChange={(e) =>
                        setPathForm((s) => ({
                          ...s,
                          textColumn: e.target.value || undefined,
                        }))
                      }
                    />
                    <Input
                      id="p-sum"
                      label="summaryColumn (optional)"
                      value={pathForm.summaryColumn ?? ""}
                      onChange={(e) =>
                        setPathForm((s) => ({
                          ...s,
                          summaryColumn: e.target.value || undefined,
                        }))
                      }
                    />
                    <Input
                      id="p-rat"
                      label="ratingColumn (optional)"
                      value={pathForm.ratingColumn ?? ""}
                      onChange={(e) =>
                        setPathForm((s) => ({
                          ...s,
                          ratingColumn: e.target.value || undefined,
                        }))
                      }
                    />
                    <Input
                      id="p-max"
                      label="maxRows (optional)"
                      type="number"
                      min={1}
                      value={pathForm.maxRows ?? ""}
                      onChange={(e) =>
                        setPathForm((s) => ({
                          ...s,
                          maxRows: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    disabled={busy}
                    onClick={onPathSubmit}
                  >
                    {pathIngest.isPending ? "Ingesting…" : "Ingest from path"}
                  </Button>
                  {pathIngest.isPending ? (
                    <Badge tone="muted">POST /ingest-csv</Badge>
                  ) : null}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardContent className="border-t border-border pt-4">
            {lastErrorMessage ? (
              <p className="text-sm text-destructive">{lastErrorMessage}</p>
            ) : null}
            {summary ? (
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Last successful summary
                </p>
                {formatSummary(summary)}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No successful ingest in this session yet.
              </p>
            )}
          </CardContent>
        </Card>

        <details className="mt-6 rounded-lg border border-border bg-card/40">
          <summary className="cursor-pointer select-none px-4 py-3 font-mono text-sm font-medium text-accent">
            Developer details (last response JSON)
          </summary>
          <pre className="max-h-80 overflow-auto border-t border-border p-4 font-mono text-xs text-muted-foreground">
            {devPayload
              ? JSON.stringify(devPayload, null, 2)
              : "// No response yet"}
          </pre>
        </details>
      </div>

      <aside className="col-span-12 space-y-4 lg:col-span-4">
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold">Persistence</h3>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Last successful ingest summary is stored in{" "}
            <span className="font-mono text-foreground">
              {DEMO_STORAGE_KEYS.ingestSummary}
            </span>{" "}
            for demo continuity across reloads.
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
