"use client";

import { useEffect } from "react";
import Link from "next/link";

const CHUNK_RELOAD_GUARD_KEY = "__teamnoteChunkReloadInProgress";

function isChunkLoadLikeError(error) {
    if (!error) return false;
    const message = String(error?.message || error).toLowerCase();
    return (
        message.includes("chunkloaderror") ||
        message.includes("loading chunk") ||
        message.includes("/_next/static/") ||
        message.includes("/next/static/") ||
        message.includes("failed to fetch dynamically imported module") ||
        message.includes("importing a module script failed")
    );
}

function tryRecoverChunkLoad() {
    if (typeof window === "undefined") return false;

    try {
        if (window[CHUNK_RELOAD_GUARD_KEY]) return false;
        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set("_r", Date.now().toString());
        const nextHref = nextUrl.toString();
        let didNavigate = false;
        const navigate = () => {
            if (didNavigate) return;
            didNavigate = true;
            window.location.replace(nextHref);
        };

        window[CHUNK_RELOAD_GUARD_KEY] = true;
        const tasks = [];
        if (
            window.caches &&
            typeof window.caches.keys === "function" &&
            typeof window.caches.delete === "function"
        ) {
            tasks.push(
                window.caches.keys().then((keys) =>
                    Promise.all(keys.map((key) => window.caches.delete(key)))
                )
            );
        }
        if (
            window.navigator?.serviceWorker &&
            typeof window.navigator.serviceWorker.getRegistrations === "function"
        ) {
            tasks.push(
                window.navigator.serviceWorker
                    .getRegistrations()
                    .then((registrations) =>
                        Promise.all(
                            registrations.map((registration) =>
                                registration.unregister()
                            )
                        )
                    )
            );
        }

        if (tasks.length) {
            Promise.allSettled(tasks).finally(navigate);
            window.setTimeout(navigate, 1500);
        } else {
            navigate();
        }
        return true;
    } catch {
        window.location.reload();
        return true;
    }
}

export default function GlobalError({ error, reset }) {
    useEffect(() => {
        console.error("Global application error:", error);
        if (isChunkLoadLikeError(error)) {
            tryRecoverChunkLoad();
        }
    }, [error]);

    return (
        <html>
            <body>
                <main
                    className="landing-container"
                    style={{ textAlign: "center", paddingInline: 24 }}
                >
                    <div style={{ fontSize: 52, marginBottom: 12 }}>⚠️</div>
                    <h1 style={{ fontSize: 28, marginBottom: 8 }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>
                        TeamNote hit an unexpected error. You can retry safely.
                    </p>
                    <div style={{ display: "inline-flex", gap: 10 }}>
                        <button className="btn btn-primary btn-sm" onClick={reset}>
                            Retry
                        </button>
                        <Link href="/" className="btn btn-ghost btn-sm">
                            Back to Home
                        </Link>
                    </div>
                </main>
            </body>
        </html>
    );
}
