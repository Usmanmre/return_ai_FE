import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastTone = "success" | "error" | "info";

export type ToastInput = {
  title: string;
  message?: string;
  tone?: ToastTone;
  durationMs?: number;
};

type ToastItem = ToastInput & { id: string };

type ToastContextValue = {
  push: (t: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const remove = useCallback((id: string) => {
    const t = timers.current.get(id);
    if (t) clearTimeout(t);
    timers.current.delete(id);
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (t: ToastInput) => {
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;
      const item: ToastItem = {
        id,
        tone: t.tone ?? "info",
        durationMs: t.durationMs ?? 4500,
        ...t,
      };
      setItems((prev) => [...prev, item]);
      const timer = setTimeout(() => remove(id), item.durationMs);
      timers.current.set(id, timer);
    },
    [remove]
  );

  useEffect(() => {
    return () => {
      timers.current.forEach((x) => clearTimeout(x));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2"
        aria-live="polite"
        aria-relevant="additions"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-lg border px-4 py-3 text-sm shadow-console ${
              t.tone === "success"
                ? "border-accent/50 bg-card"
                : t.tone === "error"
                  ? "border-destructive/60 bg-card"
                  : "border-border bg-card"
            }`}
            role="status"
          >
            <p className="font-semibold text-foreground">{t.title}</p>
            {t.message ? (
              <p className="mt-1 text-muted-foreground">{t.message}</p>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
