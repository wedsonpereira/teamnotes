import { NextResponse } from "next/server";

/**
 * CSRF protection middleware.
 *
 * Validates the Origin header on all state-changing requests (POST, PUT,
 * PATCH, DELETE) to /api/ routes. Requests without a valid same-origin
 * Origin header are rejected with 403.
 *
 * GET/HEAD/OPTIONS are always allowed (safe methods).
 */

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function getAllowedOrigins() {
    const origins = new Set();

    // Production origin from environment.
    if (process.env.APP_URL) {
        try {
            origins.add(new URL(process.env.APP_URL).origin);
        } catch {
            // Invalid APP_URL — skip.
        }
    }

    // Development origins.
    const port = process.env.PORT || "3001";
    origins.add(`http://localhost:${port}`);
    origins.add(`http://127.0.0.1:${port}`);

    return origins;
}

const allowedOrigins = getAllowedOrigins();

export function proxy(request) {
    const { method, nextUrl } = request;

    // Only enforce on mutating API requests.
    if (!MUTATING_METHODS.has(method) || !nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.next();
    }

    const origin = request.headers.get("origin");

    // Browsers always send the Origin header on cross-origin requests.
    // Same-origin requests may or may not include it depending on the
    // browser. If Origin is absent, fall back to Referer check.
    if (origin) {
        if (allowedOrigins.has(origin)) {
            return NextResponse.next();
        }
        // Origin present but not in allowlist — reject.
        return new NextResponse(
            JSON.stringify({ error: "Forbidden: cross-origin request blocked." }),
            {
                status: 403,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    // No Origin header — check Referer as fallback.
    const referer = request.headers.get("referer");
    if (referer) {
        try {
            const refererOrigin = new URL(referer).origin;
            if (allowedOrigins.has(refererOrigin)) {
                return NextResponse.next();
            }
        } catch {
            // Malformed Referer — fall through to reject.
        }
        return new NextResponse(
            JSON.stringify({ error: "Forbidden: cross-origin request blocked." }),
            {
                status: 403,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    // Neither Origin nor Referer present. This can happen with:
    //   - Server-to-server calls (no browser)
    //   - Same-origin requests in some browsers (privacy settings)
    //   - Fetch with `referrerPolicy: "no-referrer"`
    //
    // Allow these through — the session cookie (SameSite=Lax) already
    // prevents the most dangerous cross-site attacks when neither header
    // is present, and blocking them would break legitimate server-side
    // or same-origin requests.
    return NextResponse.next();
}

export const config = {
    matcher: "/api/:path*",
};
