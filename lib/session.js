import crypto from "crypto";

export const ROOM_SESSION_COOKIE = "teamnote_room_session";
export const ROOM_SESSION_TTL_HOURS = 180;
const ROOM_SESSION_TTL_MS = ROOM_SESSION_TTL_HOURS * 60 * 60 * 1000;
const ROOM_SESSION_TTL_SECONDS = ROOM_SESSION_TTL_HOURS * 60 * 60;
const ROOM_INVITE_TTL_DAYS = 7;
const ROOM_INVITE_TTL_MS = ROOM_INVITE_TTL_DAYS * 24 * 60 * 60 * 1000;
const DEFAULT_SESSION_SECRET = "teamnote-dev-session-secret-change-this";

function getSessionSecret() {
    const configured =
        process.env.ROOM_SESSION_SECRET ||
        process.env.SESSION_SECRET ||
        process.env.NEXTAUTH_SECRET;

    if (configured) return configured;
    if (process.env.NODE_ENV === "production") {
        throw new Error("ROOM_SESSION_SECRET (or SESSION_SECRET) must be set in production.");
    }

    return DEFAULT_SESSION_SECRET;
}

function encodePayload(payload) {
    return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(encoded) {
    try {
        const raw = Buffer.from(encoded, "base64url").toString("utf8");
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function signPayload(encodedPayload) {
    const secret = getSessionSecret();
    return crypto
        .createHmac("sha256", secret)
        .update(encodedPayload)
        .digest("base64url");
}

function signaturesMatch(expected, actual) {
    if (!expected || !actual) return false;

    const expectedBuffer = Buffer.from(expected);
    const actualBuffer = Buffer.from(actual);
    if (expectedBuffer.length !== actualBuffer.length) return false;

    try {
        return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
    } catch {
        return false;
    }
}

export function createRoomSession({ userId, roomId, isAdmin = false }) {
    const now = Date.now();
    const expiresAtMs = now + ROOM_SESSION_TTL_MS;
    const payload = {
        userId,
        roomId,
        isAdmin: Boolean(isAdmin),
        iat: now,
        exp: expiresAtMs,
    };

    const encodedPayload = encodePayload(payload);
    const signature = signPayload(encodedPayload);
    const token = `${encodedPayload}.${signature}`;

    return {
        token,
        expiresAtMs,
        expiresAtIso: new Date(expiresAtMs).toISOString(),
    };
}

export function createRoomInviteToken({ roomId, email, inviteId = null }) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const now = Date.now();
    const expiresAtMs = now + ROOM_INVITE_TTL_MS;
    const payload = {
        type: "ROOM_INVITE",
        roomId,
        email: normalizedEmail,
        inviteId: inviteId || null,
        iat: now,
        exp: expiresAtMs,
    };

    const encodedPayload = encodePayload(payload);
    const signature = signPayload(encodedPayload);
    const token = `${encodedPayload}.${signature}`;

    return {
        token,
        expiresAtMs,
        expiresAtIso: new Date(expiresAtMs).toISOString(),
    };
}

export function verifyRoomInviteToken(token) {
    if (!token || typeof token !== "string") return null;

    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return null;

    const expectedSignature = signPayload(encodedPayload);
    if (!signaturesMatch(expectedSignature, signature)) return null;

    const payload = decodePayload(encodedPayload);
    if (!payload || typeof payload !== "object") return null;

    const { type, roomId, email, inviteId, exp } = payload;
    if (type !== "ROOM_INVITE") return null;
    if (!roomId || !email || typeof exp !== "number") return null;
    if (Date.now() >= exp) return null;

    return {
        roomId,
        email: String(email).trim().toLowerCase(),
        inviteId: inviteId || null,
        exp,
    };
}

export function verifyRoomSessionToken(token) {
    if (!token || typeof token !== "string") return null;

    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return null;

    const expectedSignature = signPayload(encodedPayload);
    if (!signaturesMatch(expectedSignature, signature)) return null;

    const payload = decodePayload(encodedPayload);
    if (!payload || typeof payload !== "object") return null;

    const { userId, roomId, isAdmin, exp } = payload;
    if (!userId || !roomId || typeof exp !== "number") return null;
    if (Date.now() >= exp) return null;

    return {
        userId,
        roomId,
        isAdmin: Boolean(isAdmin),
        exp,
    };
}

export function readRoomSessionFromRequest(request, expectedRoomId = null) {
    const token = request.cookies.get(ROOM_SESSION_COOKIE)?.value;
    const session = verifyRoomSessionToken(token);
    if (!session) return null;
    if (expectedRoomId && session.roomId !== expectedRoomId) return null;
    return session;
}

export function setRoomSessionCookie(response, token) {
    response.cookies.set({
        name: ROOM_SESSION_COOKIE,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: ROOM_SESSION_TTL_SECONDS,
    });
}

export function clearRoomSessionCookie(response) {
    response.cookies.set({
        name: ROOM_SESSION_COOKIE,
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
}
