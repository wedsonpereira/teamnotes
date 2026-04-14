export const CLIENT_SESSION_KEY = "gs_user";

export function clearClientSession() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CLIENT_SESSION_KEY);
    sessionStorage.removeItem(CLIENT_SESSION_KEY);
}

export function saveClientSession(sessionPayload) {
    if (typeof window === "undefined") return;
    const serialized = JSON.stringify(sessionPayload);
    localStorage.setItem(CLIENT_SESSION_KEY, serialized);
    sessionStorage.setItem(CLIENT_SESSION_KEY, serialized);
}

export function readClientSession() {
    if (typeof window === "undefined") return null;

    const localRaw = localStorage.getItem(CLIENT_SESSION_KEY);
    const sessionRaw = sessionStorage.getItem(CLIENT_SESSION_KEY);
    const raw = localRaw || sessionRaw;
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object" || !parsed.userId) {
            clearClientSession();
            return null;
        }

        const expiresAtRaw = parsed.sessionExpiresAt || parsed.expiresAt;
        const expiresAtMs = new Date(expiresAtRaw).getTime();
        if (!Number.isFinite(expiresAtMs)) {
            clearClientSession();
            return null;
        }

        if (Date.now() >= expiresAtMs) {
            clearClientSession();
            return null;
        }

        if (!localRaw && sessionRaw) {
            localStorage.setItem(CLIENT_SESSION_KEY, sessionRaw);
        }
        if (!sessionRaw && localRaw) {
            sessionStorage.setItem(CLIENT_SESSION_KEY, localRaw);
        }

        return {
            ...parsed,
            sessionExpiresAt: new Date(expiresAtMs).toISOString(),
            expiresAtMs,
        };
    } catch {
        clearClientSession();
        return null;
    }
}
