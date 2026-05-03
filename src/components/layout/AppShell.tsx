import { NavLink, Outlet, useLocation } from "react-router-dom";

const nav = [
  { to: "/", label: "Dashboard" },
  { to: "/ingest", label: "Ingest" },
  { to: "/analyze", label: "Analyze" },
  { to: "/docs", label: "Docs" },
] as const;

export function AppShell() {
  const location = useLocation();
  const isAnalyze = location.pathname === "/analyze";

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-foreground"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-12 gap-4 px-4 py-3 lg:px-6">
          <div className="col-span-12 flex flex-wrap items-center justify-between gap-3 lg:col-span-8">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Review Intelligence
              </p>
              <h1 className="text-lg font-semibold text-foreground">
                Ops console
              </h1>
            </div>
            {/* <Badge tone="muted" className="max-w-[min(100%,20rem)] truncate" title={base}>
              API: {base}
            </Badge> */}
          </div>
          <nav
            className="col-span-12 flex flex-wrap gap-2 lg:col-span-4 lg:justify-end"
            aria-label="Primary"
          >
            {nav.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `rounded-md border px-3 py-1.5 text-sm font-medium transition focus-visible:ring-offset-background ${
                    isActive
                      ? "border-accent/60 bg-accent/10 text-accent"
                      : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main
        id="main"
        className={`px-4 py-8 lg:px-6 ${
          isAnalyze ? "w-full max-w-none" : "mx-auto max-w-7xl"
        }`}
      >
        {isAnalyze ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            {/* <aside className="lg:col-span-3 lg:sticky lg:top-24">
              <div className="rounded-lg border border-border bg-card/60 p-4 text-sm text-muted-foreground">
                <p className="font-mono text-xs uppercase tracking-wide text-accent">
                  Analyze
                </p>
                <p className="mt-2 leading-relaxed">
                  Grounded answers from your review index. Tune{" "}
                  <span className="font-mono text-foreground">k</span> for recall
                  vs. noise; optional system prompt for tone and guardrails.
                </p>
              </div>
            </aside> */}
            <div className="lg:col-span-12">
              <Outlet />
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
