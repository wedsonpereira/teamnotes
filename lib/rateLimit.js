/**
 * In-memory sliding-window rate limiter.
 *
 * Each limiter instance tracks request timestamps per key (usually IP or
 * IP+resource). When the number of requests within the window exceeds the
 * limit, subsequent requests are rejected until enough old entries expire.
 *
 * Stale entries are garbage-collected lazily on every check and via a
 * periodic sweep to prevent unbounded memory growth.
 */

const DEFAULT_WINDOW_MS = 60 * 1000;   // 1 minute
const DEFAULT_MAX_REQUESTS = 10;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // sweep every 5 minutes

/**
 * Create a rate limiter instance.
 *
 * @param {object} options
 * @param {number} options.windowMs   - Sliding window duration in ms (default 60 000).
 * @param {number} options.maxRequests - Max requests allowed within the window (default 10).
 * @returns {{ check(key: string): { allowed: boolean, remaining: number, retryAfterMs: number } }}
 */
export function createRateLimiter({
    windowMs = DEFAULT_WINDOW_MS,
    maxRequests = DEFAULT_MAX_REQUESTS,
} = {}) {
    /** @type {Map<string, number[]>} key → sorted array of timestamps */
    const store = new Map();

    // Periodic sweep to evict fully-expired keys.
    const sweepTimer = setInterval(() => {
        const now = Date.now();
        for (const [key, timestamps] of store) {
            const fresh = timestamps.filter((t) => now - t < windowMs);
            if (fresh.length === 0) {
                store.delete(key);
            } else {
                store.set(key, fresh);
            }
        }
    }, CLEANUP_INTERVAL_MS);

    // Allow the process to exit without waiting for the timer.
    if (sweepTimer.unref) {
        sweepTimer.unref();
    }

    return {
        /**
         * Check whether a request identified by `key` is allowed.
         *
         * @param {string} key - Unique identifier (e.g. IP address, IP+roomCode).
         * @returns {{ allowed: boolean, remaining: number, retryAfterMs: number }}
         */
        check(key) {
            const now = Date.now();
            const cutoff = now - windowMs;

            // Get existing timestamps and prune expired ones.
            const existing = store.get(key);
            const timestamps = existing
                ? existing.filter((t) => t > cutoff)
                : [];

            if (timestamps.length >= maxRequests) {
                // Rejected — calculate when the oldest entry expires.
                const oldestInWindow = timestamps[0];
                const retryAfterMs = oldestInWindow + windowMs - now;
                store.set(key, timestamps);
                return {
                    allowed: false,
                    remaining: 0,
                    retryAfterMs: Math.max(retryAfterMs, 1000),
                };
            }

            // Allowed — record this request.
            timestamps.push(now);
            store.set(key, timestamps);

            return {
                allowed: true,
                remaining: maxRequests - timestamps.length,
                retryAfterMs: 0,
            };
        },
    };
}

/**
 * Extract the client IP address from a Next.js request.
 * Checks standard proxy headers, falling back to a generic key.
 *
 * @param {Request} request
 * @returns {string}
 */
export function getClientIp(request) {
    // x-forwarded-for is the most common proxy header.
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        // May contain multiple IPs: "client, proxy1, proxy2"
        const first = forwarded.split(",")[0].trim();
        if (first) return first;
    }

    // x-real-ip is used by Nginx and some cloud providers.
    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp.trim();

    return "unknown";
}

/**
 * Build a standard 429 JSON response.
 *
 * @param {number} retryAfterMs
 * @returns {Response}
 */
export function rateLimitResponse(retryAfterMs) {
    const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);
    return new Response(
        JSON.stringify({
            error: "Too many requests. Please try again later.",
            retryAfterSeconds,
        }),
        {
            status: 429,
            headers: {
                "Content-Type": "application/json",
                "Retry-After": String(retryAfterSeconds),
            },
        }
    );
}
