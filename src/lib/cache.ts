// Client-side cache utility with Stale-While-Revalidate pattern

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes cache validity

export const clientCache = {
    get<T>(key: string, maxAgeMs = DEFAULT_TTL_MS): T | null {
        // 1. Check memory cache first
        if (memoryCache.has(key)) {
            const entry = memoryCache.get(key)!;
            if (Date.now() - entry.timestamp < maxAgeMs) {
                return entry.data as T;
            }
        }

        // 2. Check localStorage in browser
        if (typeof window !== "undefined") {
            try {
                const stored = localStorage.getItem(`akod_cache_${key}`);
                if (stored) {
                    const parsed: CacheEntry<T> = JSON.parse(stored);
                    // Populate memory cache
                    memoryCache.set(key, parsed);
                    return parsed.data;
                }
            } catch {
                // Ignore storage errors
            }
        }

        return null;
    },

    set<T>(key: string, data: T): void {
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now()
        };

        memoryCache.set(key, entry);

        if (typeof window !== "undefined") {
            try {
                localStorage.setItem(`akod_cache_${key}`, JSON.stringify(entry));
            } catch {
                // Storage quota might be exceeded, ignore
            }
        }
    },

    clear(key?: string): void {
        if (key) {
            memoryCache.delete(key);
            if (typeof window !== "undefined") {
                try {
                    localStorage.removeItem(`akod_cache_${key}`);
                } catch {}
            }
        } else {
            memoryCache.clear();
            if (typeof window !== "undefined") {
                try {
                    Object.keys(localStorage)
                        .filter(k => k.startsWith("akod_cache_"))
                        .forEach(k => localStorage.removeItem(k));
                } catch {}
            }
        }
    }
};
