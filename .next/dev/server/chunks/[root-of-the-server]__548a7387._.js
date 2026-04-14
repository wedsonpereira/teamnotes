module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/lib/prisma.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) {
    globalForPrisma.prisma = prisma;
}
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/session.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ROOM_SESSION_COOKIE",
    ()=>ROOM_SESSION_COOKIE,
    "ROOM_SESSION_TTL_HOURS",
    ()=>ROOM_SESSION_TTL_HOURS,
    "clearRoomSessionCookie",
    ()=>clearRoomSessionCookie,
    "createRoomInviteToken",
    ()=>createRoomInviteToken,
    "createRoomSession",
    ()=>createRoomSession,
    "readRoomSessionFromRequest",
    ()=>readRoomSessionFromRequest,
    "setRoomSessionCookie",
    ()=>setRoomSessionCookie,
    "verifyRoomInviteToken",
    ()=>verifyRoomInviteToken,
    "verifyRoomSessionToken",
    ()=>verifyRoomSessionToken
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
const ROOM_SESSION_COOKIE = "teamnote_room_session";
const ROOM_SESSION_TTL_HOURS = 180;
const ROOM_SESSION_TTL_MS = ROOM_SESSION_TTL_HOURS * 60 * 60 * 1000;
const ROOM_SESSION_TTL_SECONDS = ROOM_SESSION_TTL_HOURS * 60 * 60;
const ROOM_INVITE_TTL_DAYS = 7;
const ROOM_INVITE_TTL_MS = ROOM_INVITE_TTL_DAYS * 24 * 60 * 60 * 1000;
const DEFAULT_SESSION_SECRET = "teamnote-dev-session-secret-change-this";
function getSessionSecret() {
    const configured = process.env.ROOM_SESSION_SECRET || process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET;
    if (configured) return configured;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return DEFAULT_SESSION_SECRET;
}
function encodePayload(payload) {
    return Buffer.from(JSON.stringify(payload)).toString("base64url");
}
function decodePayload(encoded) {
    try {
        const raw = Buffer.from(encoded, "base64url").toString("utf8");
        return JSON.parse(raw);
    } catch  {
        return null;
    }
}
function signPayload(encodedPayload) {
    const secret = getSessionSecret();
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}
function signaturesMatch(expected, actual) {
    if (!expected || !actual) return false;
    const expectedBuffer = Buffer.from(expected);
    const actualBuffer = Buffer.from(actual);
    if (expectedBuffer.length !== actualBuffer.length) return false;
    try {
        return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].timingSafeEqual(expectedBuffer, actualBuffer);
    } catch  {
        return false;
    }
}
function createRoomSession({ userId, roomId, isAdmin = false }) {
    const now = Date.now();
    const expiresAtMs = now + ROOM_SESSION_TTL_MS;
    const payload = {
        userId,
        roomId,
        isAdmin: Boolean(isAdmin),
        iat: now,
        exp: expiresAtMs
    };
    const encodedPayload = encodePayload(payload);
    const signature = signPayload(encodedPayload);
    const token = `${encodedPayload}.${signature}`;
    return {
        token,
        expiresAtMs,
        expiresAtIso: new Date(expiresAtMs).toISOString()
    };
}
function createRoomInviteToken({ roomId, email, inviteId = null }) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const now = Date.now();
    const expiresAtMs = now + ROOM_INVITE_TTL_MS;
    const payload = {
        type: "ROOM_INVITE",
        roomId,
        email: normalizedEmail,
        inviteId: inviteId || null,
        iat: now,
        exp: expiresAtMs
    };
    const encodedPayload = encodePayload(payload);
    const signature = signPayload(encodedPayload);
    const token = `${encodedPayload}.${signature}`;
    return {
        token,
        expiresAtMs,
        expiresAtIso: new Date(expiresAtMs).toISOString()
    };
}
function verifyRoomInviteToken(token) {
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
        exp
    };
}
function verifyRoomSessionToken(token) {
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
        exp
    };
}
function readRoomSessionFromRequest(request, expectedRoomId = null) {
    const token = request.cookies.get(ROOM_SESSION_COOKIE)?.value;
    const session = verifyRoomSessionToken(token);
    if (!session) return null;
    if (expectedRoomId && session.roomId !== expectedRoomId) return null;
    return session;
}
function setRoomSessionCookie(response, token) {
    response.cookies.set({
        name: ROOM_SESSION_COOKIE,
        value: token,
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === "production",
        sameSite: "lax",
        path: "/",
        maxAge: ROOM_SESSION_TTL_SECONDS
    });
}
function clearRoomSessionCookie(response) {
    response.cookies.set({
        name: ROOM_SESSION_COOKIE,
        value: "",
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0
    });
}
}),
"[project]/app/api/rooms/[roomId]/save/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session.js [app-route] (ecmascript)");
;
;
;
function parseCompressedContent(content) {
    if (typeof content === "string") {
        const trimmed = content.trim();
        if (!trimmed) {
            throw new Error("Content cannot be empty.");
        }
        // Legacy fallback: stored as comma-separated byte values.
        if (/^\d+(,\d+)*$/.test(trimmed)) {
            const bytes = trimmed.split(",").map((value)=>{
                const parsed = Number(value);
                if (!Number.isInteger(parsed) || parsed < 0 || parsed > 255) {
                    throw new Error("Invalid byte value.");
                }
                return parsed;
            });
            return Uint8Array.from(bytes);
        }
        return Uint8Array.from(Buffer.from(trimmed, "base64"));
    }
    if (Array.isArray(content)) {
        return Uint8Array.from(content);
    }
    if (content && typeof content === "object" && content.type === "Buffer" && Array.isArray(content.data)) {
        return Uint8Array.from(content.data);
    }
    throw new Error("Unsupported content format.");
}
async function POST(request, { params }) {
    try {
        const { roomId } = await params;
        const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readRoomSessionFromRequest"])(request, roomId);
        if (!session) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Session expired. Please re-enter the room."
            }, {
                status: 401
            });
        }
        const { compressedContent, pageId } = await request.json();
        if (!compressedContent) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Content is required."
            }, {
                status: 400
            });
        }
        // Verify membership
        const member = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].roomMember.findFirst({
            where: {
                roomId,
                userId: session.userId,
                status: "APPROVED"
            }
        });
        if (!member) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Access denied."
            }, {
                status: 403
            });
        }
        const encodedBytes = parseCompressedContent(compressedContent);
        if (pageId) {
            const page = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].page.findFirst({
                where: {
                    id: pageId,
                    roomId
                },
                select: {
                    id: true
                }
            });
            if (!page) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Page not found."
                }, {
                    status: 404
                });
            }
            // Save to specific page
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].page.update({
                where: {
                    id: pageId
                },
                data: {
                    compressedContent: encodedBytes
                }
            });
        } else {
            // Legacy: save to room directly
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].room.update({
                where: {
                    id: roomId
                },
                data: {
                    compressedContent: encodedBytes
                }
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Content saved successfully."
        });
    } catch (error) {
        console.error("Save content error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to save content."
        }, {
            status: 500
        });
    }
}
async function GET(request, { params }) {
    try {
        const { roomId } = await params;
        const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readRoomSessionFromRequest"])(request, roomId);
        if (!session) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Session expired. Please re-enter the room."
            }, {
                status: 401
            });
        }
        const { searchParams } = new URL(request.url);
        const pageId = searchParams.get("pageId");
        // Verify membership
        const member = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].roomMember.findFirst({
            where: {
                roomId,
                userId: session.userId,
                status: "APPROVED"
            }
        });
        if (!member) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Access denied."
            }, {
                status: 403
            });
        }
        let compressedContent = null;
        if (pageId) {
            // Load from specific page
            const page = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].page.findFirst({
                where: {
                    id: pageId,
                    roomId
                },
                select: {
                    compressedContent: true
                }
            });
            compressedContent = page?.compressedContent || null;
        } else {
            // Legacy: load from room
            const room = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].room.findUnique({
                where: {
                    id: roomId
                },
                select: {
                    compressedContent: true
                }
            });
            compressedContent = room?.compressedContent || null;
        }
        if (!compressedContent) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                compressedContent: null
            });
        }
        const base64 = Buffer.from(compressedContent).toString("base64");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            compressedContent: base64
        });
    } catch (error) {
        console.error("Load content error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to load content."
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__548a7387._.js.map