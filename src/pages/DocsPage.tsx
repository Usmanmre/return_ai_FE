import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { getBaseUrl } from "@/lib/api";

function CurlBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-md border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
      {children}
    </pre>
  );
}

export function DocsPage() {
  const base = getBaseUrl();
  const shellBase =
    base.startsWith("http") && !base.includes(" ")
      ? base
      : "http://localhost:3000";

  return (
    <div className="grid grid-cols-12 gap-6">
      <article className="col-span-12 space-y-8 lg:col-span-10">
        <header>
          <h2 className="text-2xl font-bold tracking-tight">Integration guide</h2>
          {/* <p className="mt-2 text-muted-foreground">
            Copy-paste curls against your API. The UI uses the same contract via{" "}
            <span className="font-mono text-foreground">VITE_API_BASE_URL</span>.
            For CORS-free local dev, point the client at{" "}
            <span className="font-mono text-foreground">/api</span> and use the Vite
            proxy (see README).
          </p> */}
        </header>


        <Card>
          <CardHeader>
            <h3 className="text-base font-semibold">
              POST /ingest-csv/upload (multipart)
            </h3>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Field name for the file must be{" "}
              <span className="font-mono text-foreground">file</span>. Optional
              fields are plain strings:{" "}
              <span className="font-mono">textColumn</span>,{" "}
              <span className="font-mono">summaryColumn</span>,{" "}
              <span className="font-mono">ratingColumn</span>,{" "}
              {/* <span className="font-mono">maxRows</span>. */}
            </p>
            <CurlBlock>{`curl -sS -X POST "${shellBase}/ingest-csv/upload" \\
  -F "file=@./reviews.csv" \\
  -F "textColumn=review_body" \\
  `
  }</CurlBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-base font-semibold">POST /rag (JSON only)</h3>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Must send <span className="font-mono text-foreground">Content-Type: application/json</span>.
              Prefer <span className="font-mono text-foreground">message</span>; the
              server also accepts{" "}
              <span className="font-mono">query</span>,{" "}
              <span className="font-mono">input</span>,{" "}
              <span className="font-mono">prompt</span>,{" "}
              <span className="font-mono">question</span>.
            </p>
            <CurlBlock>{`curl -sS -X POST "${shellBase}/rag" \\
  -H "Content-Type: application/json" \\
  -d '{"message":"What are the top complaints about shipping?","k":8}'`}</CurlBlock>
            <p>
              Optional <span className="font-mono">systemPrompt</span> for tone and
              guardrails.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-base font-semibold">Notes</h3>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Pinecone index vector dimension must match your embedding model
                output; otherwise upserts or queries can fail or return empty
                results.
              </li>
              {/* <li>
                Current UI base URL:{" "}
                <span className="font-mono text-foreground">{base}</span>
              </li> */}
            </ul>
          </CardContent>
        </Card>
      </article>
    </div>
  );
}
