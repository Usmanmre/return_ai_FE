import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ApiError } from "@/lib/api";
import { DEMO_STORAGE_KEYS, loadJson } from "@/lib/demoStorage";
import type { RagNormalized } from "@/hooks/useRag";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Skeleton, SkeletonBlock } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { useRag } from "@/hooks/useRag";

const EXAMPLE_PROMPTS = [
  "What are the top recurring complaints in these reviews?",
  "Summarize battery-related issues and severity.",
  "Are customers reporting shipping delays or damaged packages?",
  "Compare this incoming review to typical sentiment: [paste review]",
  "What listing copy changes would reduce confusion about sizing?",
  "Extract feature requests mentioned more than twice.",
  "What praise themes should we amplify in PDP bullets?",
  "Any safety or overheating mentions we should escalate?",
] as const;

export function AnalyzePage() {
  const toast = useToast();
  const rag = useRag();

  const [message, setMessage] = useState("");
  const [k, setK] = useState(5);
  const [systemPrompt, setSystemPrompt] = useState("");

  const [cached, setCached] = useState<RagNormalized | null>(() =>
    loadJson<RagNormalized>(DEMO_STORAGE_KEYS.ragResult)
  );

  const display = rag.data ?? cached;

  const sortedSources = useMemo(
    () => display?.sources ?? [],
    [display]
  );

  const run = () => {
    if (!message.trim()) {
      toast.push({ title: "Enter a message", tone: "error" });
      return;
    }
    rag.mutate(
      {
        message: message.trim(),
        k,
        systemPrompt: systemPrompt.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          setCached(data);
          toast.push({ title: "Analysis complete", tone: "success" });
        },
        onError: (err) => {
          const msg = err instanceof ApiError ? err.message : String(err);
          toast.push({ title: "RAG request failed", message: msg, tone: "error" });
        },
      }
    );
  };

  const loading = rag.isPending;

  return (
    <div className="grid grid-cols-12 gap-6">
      <section className="col-span-12 space-y-6 xl:col-span-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">RAG workspace</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ask a question or paste an incoming review plus instructions. Retrieval
            uses your Pinecone index populated from ingest.
          </p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold">Input</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              id="rag-message"
              label="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. What are the top complaints about battery life?"
              rows={8}
              disabled={loading}
            />

            <div>
              <label
                htmlFor="rag-k"
                className="text-sm font-medium text-muted-foreground"
              >
                k (chunks): {k}
              </label>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <input
                  id="rag-k"
                  type="range"
                  min={1}
                  max={20}
                  value={k}
                  disabled={loading}
                  onChange={(e) => setK(Number(e.target.value))}
                  className="h-2 w-full max-w-xs cursor-pointer accent-accent"
                />
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={k}
                  disabled={loading}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (!Number.isNaN(n))
                      setK(Math.min(20, Math.max(1, n)));
                  }}
                  className="w-20 rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-sm"
                  aria-label="k numeric"
                />
              </div>
            </div>

            <details className="rounded-md border border-border bg-muted/20 p-3">
              <summary className="cursor-pointer text-sm font-medium text-foreground">
                Advanced: systemPrompt
              </summary>
              <Textarea
                id="rag-sys"
                label="systemPrompt (optional)"
                className="mt-3"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={4}
                disabled={loading}
                placeholder="Optional tone, format, or safety instructions for the model."
              />
            </details>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                disabled={loading}
                onClick={run}
              >
                {loading ? "Running…" : "Run analysis"}
              </Button>
              {loading ? <Badge tone="muted">POST /rag</Badge> : null}
            </div>
          </CardContent>
        </Card>

        <div>
          <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
            Example prompts
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                title={p}
                disabled={loading}
                onClick={() => setMessage(p)}
                className="rounded-full border border-border bg-muted/30 px-3 py-1 text-left text-xs text-foreground transition hover:border-accent/50 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
              >
                {p.length > 48 ? `${p.slice(0, 48)}…` : p}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        className="col-span-12 space-y-6 xl:col-span-7"
        aria-busy={loading}
      >
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold">Answer</h3>
          </CardHeader>
          <CardContent>
            {loading ? (
              <SkeletonBlock lines={6} />
            ) : display?.answer ? (
              <div className="markdown-body text-sm leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {display.answer}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Run an analysis to see a grounded answer here. Cached results load
                from local storage when available.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">Sources</h3>
              {!loading && display ? (
                <Badge tone="muted">{sortedSources.length} items</Badge>
              ) : null}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : sortedSources.length === 0 ? (
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>No sources returned for this run.</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>The index may be empty — ingest a CSV first.</li>
                  <li>
                    CSV column mapping may be wrong — confirm{" "}
                    <span className="font-mono">textColumn</span> matches your file.
                  </li>
                  <li>
                    Embedding dimension mismatch with the Pinecone index will
                    prevent upserts or retrieval from behaving as expected.
                  </li>
                </ul>
              </div>
            ) : (
              <ul className="space-y-3">
                {sortedSources.map((s, idx) => (
                  <li
                    key={s.id ?? idx}
                    className="rounded-md border border-border bg-muted/20 p-3"
                  >
                    <div className="flex flex-wrap gap-2 font-mono text-xs text-muted-foreground">
                      {s.score !== undefined ? (
                        <Badge tone="success">
                          score{" "}
                          {typeof s.score === "number"
                            ? s.score.toFixed(4)
                            : String(s.score)}
                        </Badge>
                      ) : null}
                      {s.id !== undefined ? (
                        <span>
                          id: <span className="text-foreground">{s.id}</span>
                        </span>
                      ) : null}
                      {s.rating !== undefined ? (
                        <span>
                          rating:{" "}
                          <span className="text-foreground">{String(s.rating)}</span>
                        </span>
                      ) : null}
                      {s.asin !== undefined ? (
                        <span>
                          asin:{" "}
                          <span className="text-foreground">{String(s.asin)}</span>
                        </span>
                      ) : null}
                    </div>
                    {s.textPreview !== undefined ? (
                      <p className="mt-2 text-sm text-foreground/90">
                        {s.textPreview}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <details className="rounded-lg border border-border bg-card/40">
          <summary className="cursor-pointer px-4 py-3 font-mono text-xs font-medium text-accent">
            Raw response JSON
          </summary>
          <pre className="max-h-64 overflow-auto border-t border-border p-4 font-mono text-xs text-muted-foreground">
            {display?.raw
              ? JSON.stringify(display.raw, null, 2)
              : "// Run analysis to capture raw payload"}
          </pre>
        </details>
      </section>
    </div>
  );
}
