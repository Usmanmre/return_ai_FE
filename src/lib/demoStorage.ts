const PREFIX = "review-intelligence:v1:";

export const DEMO_STORAGE_KEYS = {
  ingestSummary: `${PREFIX}ingestSummary`,
  ragResult: `${PREFIX}ragResult`,
} as const;

export function loadJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}
