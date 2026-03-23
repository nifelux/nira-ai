// src/lib/basic/cache.ts

import { Mode, EngineResponse } from "@/types/chat";

// -------------------------
// Cache entry shape
// -------------------------

interface CacheEntry {
  response: EngineResponse;
    createdAt: number;
      expiresAt: number;
      }

      // -------------------------
      // Cache config
      // -------------------------

      const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour
      const MAX_CACHE_SIZE = 500;           // max entries before oldest are pruned

      // -------------------------
      // In-memory cache store
      // -------------------------

      const store = new Map<string, CacheEntry>();

      // -------------------------
      // Key builder
      // -------------------------

      function buildKey(query: string, mode: Mode): string {
        const normalized = query.trim().toLowerCase().replace(/\s+/g, " ");
          return `${mode}::${normalized}`;
          }

          // -------------------------
          // Prune expired + overflow entries
          // -------------------------

          function prune(): void {
            const now = Date.now();

              // Remove expired entries
                for (const [key, entry] of store.entries()) {
                    if (now > entry.expiresAt) {
                          store.delete(key);
                              }
                                }

                                  // If still over limit, remove oldest entries first
                                    if (store.size > MAX_CACHE_SIZE) {
                                        const sorted = [...store.entries()].sort(
                                              (a, b) => a[1].createdAt - b[1].createdAt
                                                  );
                                                      const overflow = store.size - MAX_CACHE_SIZE;
                                                          sorted.slice(0, overflow).forEach(([key]) => store.delete(key));
                                                            }
                                                            }

                                                            // -------------------------
                                                            // Public API
                                                            // -------------------------

                                                            export function getFromCache(
                                                              query: string,
                                                                mode: Mode
                                                                ): EngineResponse | null {
                                                                  const key = buildKey(query, mode);
                                                                    const entry = store.get(key);

                                                                      if (!entry) return null;

                                                                        // Return null if expired
                                                                          if (Date.now() > entry.expiresAt) {
                                                                              store.delete(key);
                                                                                  return null;
                                                                                    }

                                                                                      return {
                                                                                          ...entry.response,
                                                                                              cached: true,
                                                                                                  source: "cache",
                                                                                                    };
                                                                                                    }

                                                                                                    export function setInCache(
                                                                                                      query: string,
                                                                                                        mode: Mode,
                                                                                                          response: EngineResponse
                                                                                                          ): void {
                                                                                                            prune();

                                                                                                              const key = buildKey(query, mode);
                                                                                                                const now = Date.now();

                                                                                                                  store.set(key, {
                                                                                                                      response,
                                                                                                                          createdAt: now,
                                                                                                                              expiresAt: now + CACHE_TTL_MS,
                                                                                                                                });
                                                                                                                                }

                                                                                                                                export function clearCache(): void {
                                                                                                                                  store.clear();
                                                                                                                                  }

                                                                                                                                  export function getCacheStats(): {
                                                                                                                                    size: number;
                                                                                                                                      maxSize: number;
                                                                                                                                        ttlMs: number;
                                                                                                                                        } {
                                                                                                                                          return {
                                                                                                                                              size: store.size,
                                                                                                                                                  maxSize: MAX_CACHE_SIZE,
                                                                                                                                                      ttlMs: CACHE_TTL_MS,
                                                                                                                                                        };
                                                                                                                                                        }