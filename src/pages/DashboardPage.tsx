import { Badge } from "@/components/ui/Badge";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useHealth } from "@/hooks/useHealth";
import { getBaseUrl } from "@/lib/api";

export function DashboardPage() {
  const health = useHealth();
  const base = getBaseUrl();
  const online = health.isSuccess;
  const offline = health.isError;
  const pending = health.isPending;

  return (
    <div className="grid grid-cols-12 gap-6 lg:gap-8">
      <section className="col-span-12 lg:col-span-7">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Review Intelligence
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Turn Amazon-style reviews into answers your team can ship on.
        </h2>
        <ul className="mt-8 space-y-4 text-lg text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-mono text-accent">01</span>
            <span>
              <strong className="text-foreground">Support faster</strong> —{" "}
              deflect repeats with grounded replies from real review patterns.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-accent">02</span>
            <span>
              <strong className="text-foreground">Product quality signals</strong>{" "}
              — surface defects, praise, and regressions without manual tagging
              at scale.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-accent">03</span>
            <span>
              <strong className="text-foreground">Listing improvements</strong> —{" "}
              mine objections and FAQs to sharpen PDP copy and policy.
            </span>
          </li>
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <LinkButton to="/ingest">Go to Ingest</LinkButton>
          <LinkButton to="/analyze" variant="ghost">
            Open Analyze
          </LinkButton>
        </div>
      </section>

      <section className="col-span-12 lg:col-span-5">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold">System status</h3>
              <Button
                type="button"
                variant="ghost"
                className="px-2 py-1 text-xs"
                onClick={() => void health.refetch()}
              >
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {pending ? (
                <Badge tone="muted">Checking…</Badge>
              ) : online ? (
                <Badge tone="success">Online</Badge>
              ) : offline ? (
                <Badge tone="warning">Offline</Badge>
              ) : (
                <Badge tone="muted">Unknown</Badge>
              )}
              <span className="font-mono text-xs text-muted-foreground break-all">
                GET /health → {base}
              </span>
            </div>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {pending
                ? "Pinging the API…"
                : online
                  ? "API responded successfully. You can ingest CSVs and run RAG."
                  : offline
                    ? "Could not reach the API. Confirm the server is running and CORS or the dev proxy is configured."
                    : ""}
            </p>
            {health.isSuccess && health.data ? (
              <pre className="max-h-40 overflow-auto rounded-md border border-border bg-muted/30 p-3 font-mono text-xs text-muted-foreground">
                {JSON.stringify(health.data, null, 2)}
              </pre>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
