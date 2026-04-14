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
"[project]/lib/colors.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "colorFromName",
    ()=>colorFromName,
    "pickMemberColor",
    ()=>pickMemberColor
]);
/**
 * Unique member colors — vivid, high-contrast palette that works on both
 * dark and light themes. Avoids white, black, and near-gray tones.
 */ const MEMBER_COLORS = [
    "#DC2626",
    "#EA580C",
    "#CA8A04",
    "#65A30D",
    "#059669",
    "#0891B2",
    "#2563EB",
    "#7C3AED",
    "#C026D3",
    "#DB2777",
    "#BE123C",
    "#0F766E"
];
function pickMemberColor(existingMemberCount = 0) {
    return MEMBER_COLORS[existingMemberCount % MEMBER_COLORS.length];
}
function colorFromName(name) {
    let hash = 0;
    for(let i = 0; i < (name || "").length; i++){
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return MEMBER_COLORS[Math.abs(hash) % MEMBER_COLORS.length];
}
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
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/dns [external] (dns, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("dns", () => require("dns"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[project]/lib/email.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sendForgotRoomIdEmail",
    ()=>sendForgotRoomIdEmail,
    "sendResetKeyEmail",
    ()=>sendResetKeyEmail,
    "sendRoomInviteEmail",
    ()=>sendRoomInviteEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/nodemailer/lib/nodemailer.js [app-route] (ecmascript)");
;
const smtpTlsRejectUnauthorized = String(process.env.SMTP_TLS_REJECT_UNAUTHORIZED || "true").toLowerCase() !== "false";
const transporter = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: smtpTlsRejectUnauthorized,
        ...process.env.SMTP_HOST ? {
            servername: process.env.SMTP_HOST
        } : {}
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
});
function escapeHtml(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
async function sendResetKeyEmail({ to, roomCode, resetLink }) {
    const safeRoomCode = escapeHtml(roomCode || "");
    const safeResetLink = escapeHtml(resetLink || "");
    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject: `Reset Room Key for ${safeRoomCode}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333;">Room Key Reset Request</h2>
                <p>You requested to reset the Room Key for room <strong>${safeRoomCode}</strong>.</p>
                <p>Click the button below to reset your Room Key. This link is valid for 15 minutes.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${safeResetLink}"
                       style="background-color: #4F46E5; color: white; padding: 12px 24px;
                              text-decoration: none; border-radius: 6px; font-weight: bold;">
                        Reset Room Key
                    </a>
                </div>
                <p style="color: #666; font-size: 14px;">
                    If you didn't request this, you can safely ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="color: #999; font-size: 12px;">TeamNote — Collaborative Notes</p>
            </div>
        `
    });
}
async function sendRoomInviteEmail({ to, invitedName, roomName, roomCode, inviterName, inviteLink }) {
    const safeInvitedName = escapeHtml(invitedName || "there");
    const safeRoomName = escapeHtml(roomName || "TeamNote Room");
    const safeRoomCode = escapeHtml(roomCode || "");
    const safeInviterName = escapeHtml(inviterName || "A teammate");
    const safeInviteLink = escapeHtml(inviteLink || process.env.APP_URL || "http://localhost:3001");
    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject: `${safeInviterName} invited you to ${safeRoomName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 20px; color: #1f2937;">
                <h2 style="margin: 0 0 14px;">You are invited to TeamNote</h2>
                <p style="margin: 0 0 10px;">Hi ${safeInvitedName},</p>
                <p style="margin: 0 0 12px;">
                    <strong>${safeInviterName}</strong> invited you to join <strong>${safeRoomName}</strong>.
                </p>
                <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; margin: 16px 0;">
                    <p style="margin: 0 0 8px; font-size: 13px; color: #4b5563;">Room ID</p>
                    <p style="margin: 0; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 15px; font-weight: 700;">
                        ${safeRoomCode}
                    </p>
                </div>
                <p style="margin: 0 0 14px;">
                    You have already been approved for this room. Click below to enter directly.
                </p>
                <p style="margin: 0 0 12px; font-size: 13px; color: #4b5563;">
                    This link signs you in and opens the room directly.
                </p>
                <div style="margin: 18px 0 14px;">
                    <a href="${safeInviteLink}"
                       style="display: inline-block; background: #2563eb; color: #fff; text-decoration: none; font-weight: 700; padding: 11px 16px; border-radius: 8px;">
                        Open Room
                    </a>
                </div>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0 12px;" />
                <p style="margin: 0; color: #9ca3af; font-size: 12px;">TeamNote — Collaborative Notes</p>
            </div>
        `
    });
}
async function sendForgotRoomIdEmail({ to, rooms }) {
    const roomRows = rooms.map((r)=>`<tr>
                    <td style="padding: 8px 12px; border: 1px solid #eee;">${escapeHtml(r.roomName || "Unnamed Room")}</td>
                    <td style="padding: 8px 12px; border: 1px solid #eee; font-family: monospace; font-weight: bold;">${escapeHtml(r.roomCode || "")}</td>
                    <td style="padding: 8px 12px; border: 1px solid #eee;">${escapeHtml(r.role || "")}</td>
                </tr>`).join("");
    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject: "Your Room IDs — TeamNote",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333;">Your Room IDs</h2>
                <p>Here are the rooms associated with your account:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <thead>
                        <tr style="background-color: #f5f5f5;">
                            <th style="padding: 8px 12px; border: 1px solid #eee; text-align: left;">Room Name</th>
                            <th style="padding: 8px 12px; border: 1px solid #eee; text-align: left;">Room ID</th>
                            <th style="padding: 8px 12px; border: 1px solid #eee; text-align: left;">Role</th>
                        </tr>
                    </thead>
                    <tbody>${roomRows}</tbody>
                </table>
                <p style="color: #666; font-size: 14px;">
                    If you didn't request this, you can safely ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="color: #999; font-size: 12px;">TeamNote — Collaborative Notes</p>
            </div>
        `
    });
}
}),
"[project]/app/api/rooms/[roomId]/members/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/colors.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/email.js [app-route] (ecmascript)");
;
;
;
;
;
;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
}
function deriveNameFromEmail(email) {
    const localPart = normalizeEmail(email).split("@")[0] || "";
    const words = localPart.split(/[._+\-]+/).map((part)=>part.replace(/[^a-zA-Z]/g, "")).filter(Boolean).map((part)=>{
        const lower = part.toLowerCase();
        return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
    });
    if (words.length === 0) {
        return {
            firstName: "Member",
            lastName: ""
        };
    }
    return {
        firstName: words[0],
        lastName: words.slice(1).join(" ")
    };
}
async function GET(request, { params }) {
    try {
        const { roomId } = await params;
        const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readRoomSessionFromRequest"])(request, roomId);
        const { searchParams } = new URL(request.url);
        const fallbackUserId = searchParams.get("userId");
        const fallbackRoomKey = request.headers.get("x-room-key") || searchParams.get("roomKey");
        const userId = session?.userId || fallbackUserId;
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Session expired. Please re-enter the room."
            }, {
                status: 401
            });
        }
        const room = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].room.findUnique({
            where: {
                id: roomId
            },
            include: {
                members: {
                    include: {
                        user: true
                    },
                    orderBy: {
                        joinedAt: "asc"
                    }
                },
                invites: {
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        });
        if (!room) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Room not found."
            }, {
                status: 404
            });
        }
        if (!session) {
            if (!fallbackRoomKey) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Session expired. Please re-enter the room."
                }, {
                    status: 401
                });
            }
            const keyValid = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(String(fallbackRoomKey), room.roomKeyHash);
            if (!keyValid) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Invalid room credentials."
                }, {
                    status: 403
                });
            }
            const pending = room.members.find((m)=>m.userId === userId && m.status === "PENDING");
            if (pending) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    status: "PENDING",
                    message: "Your join request is pending admin approval."
                });
            }
            const rejected = room.members.find((m)=>m.userId === userId && m.status === "REJECTED");
            if (rejected) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Your join request was rejected by the admin."
                }, {
                    status: 403
                });
            }
            const approved = room.members.find((m)=>m.userId === userId && m.status === "APPROVED");
            if (approved) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    status: "APPROVED",
                    message: "Membership approved."
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Session expired. Please re-enter the room."
            }, {
                status: 401
            });
        }
        const isAdmin = room.adminId === userId;
        const isMember = room.members.some((m)=>m.userId === userId && m.status === "APPROVED");
        if (!isMember && !isAdmin) {
            // Check if pending
            const pending = room.members.find((m)=>m.userId === userId && m.status === "PENDING");
            if (pending) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    status: "PENDING",
                    message: "Your join request is pending admin approval."
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Access denied."
            }, {
                status: 403
            });
        }
        // Filter members based on admin settings
        const approvedMembers = room.members.filter((m)=>m.status === "APPROVED").map((m)=>({
                id: m.user.id,
                firstName: m.user.firstName,
                lastName: m.user.lastName,
                email: m.user.email,
                isAdmin: m.userId === room.adminId,
                joinedAt: m.joinedAt,
                color: m.color || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["colorFromName"])(m.user.firstName + m.user.lastName)
            }));
        const pendingMembers = isAdmin ? room.members.filter((m)=>m.status === "PENDING").map((m)=>({
                id: m.user.id,
                memberId: m.id,
                firstName: m.user.firstName,
                lastName: m.user.lastName,
                email: m.user.email,
                joinedAt: m.joinedAt
            })) : [];
        const adminMember = approvedMembers.find((m)=>m.isAdmin);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            roomName: room.name,
            roomCode: room.roomCode,
            showMembers: room.showMembers,
            isAdmin,
            members: room.showMembers || isAdmin ? approvedMembers : [],
            pendingMembers,
            invitedEmails: isAdmin ? room.invites.map((invite)=>({
                    id: invite.id,
                    email: invite.email,
                    createdAt: invite.createdAt
                })) : [],
            adminName: adminMember ? `${adminMember.firstName} ${adminMember.lastName}` : "Unknown"
        });
    } catch (error) {
        console.error("Get members error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to load members."
        }, {
            status: 500
        });
    }
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
        const { email } = await request.json();
        const normalizedEmail = normalizeEmail(email);
        if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "A valid teammate email is required."
            }, {
                status: 400
            });
        }
        const room = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].room.findUnique({
            where: {
                id: roomId
            },
            select: {
                id: true,
                name: true,
                roomCode: true,
                adminId: true,
                admin: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });
        if (!room) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Room not found."
            }, {
                status: 404
            });
        }
        if (room.adminId !== session.userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized."
            }, {
                status: 403
            });
        }
        const { firstName: derivedFirstName, lastName: derivedLastName } = deriveNameFromEmail(normalizedEmail);
        const invite = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].roomInvite.upsert({
            where: {
                roomId_email: {
                    roomId,
                    email: normalizedEmail
                }
            },
            update: {},
            create: {
                roomId,
                email: normalizedEmail
            }
        });
        const existingUser = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findFirst({
            where: {
                email: {
                    equals: normalizedEmail,
                    mode: "insensitive"
                }
            },
            select: {
                id: true,
                firstName: true,
                lastName: true
            }
        });
        const invitedUser = existingUser ? existingUser : await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.create({
            data: {
                email: normalizedEmail,
                firstName: derivedFirstName,
                lastName: derivedLastName
            },
            select: {
                id: true,
                firstName: true,
                lastName: true
            }
        });
        let accessGrantedNow = false;
        let alreadyApproved = false;
        const existingMember = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].roomMember.findUnique({
            where: {
                userId_roomId: {
                    userId: invitedUser.id,
                    roomId
                }
            },
            select: {
                id: true,
                status: true,
                color: true
            }
        });
        if (existingMember) {
            if (existingMember.status === "APPROVED") {
                alreadyApproved = true;
            } else {
                const approvedCount = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].roomMember.count({
                    where: {
                        roomId,
                        status: "APPROVED"
                    }
                });
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].roomMember.update({
                    where: {
                        id: existingMember.id
                    },
                    data: {
                        status: "APPROVED",
                        color: existingMember.color || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pickMemberColor"])(approvedCount)
                    }
                });
                accessGrantedNow = true;
            }
        } else {
            const approvedCount = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].roomMember.count({
                where: {
                    roomId,
                    status: "APPROVED"
                }
            });
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].roomMember.create({
                data: {
                    roomId,
                    userId: invitedUser.id,
                    status: "APPROVED",
                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pickMemberColor"])(approvedCount)
                }
            });
            accessGrantedNow = true;
        }
        const inviterName = `${room.admin.firstName || ""} ${room.admin.lastName || ""}`.trim() || room.admin.email || "A teammate";
        const appUrl = (process.env.APP_URL || "http://localhost:3001").replace(/\/$/, "");
        const inviteTokenPayload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createRoomInviteToken"])({
            roomId,
            email: normalizedEmail,
            inviteId: invite.id
        });
        const inviteLink = `${appUrl}/?invite=${encodeURIComponent(inviteTokenPayload.token)}`;
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendRoomInviteEmail"])({
                to: normalizedEmail,
                invitedName: invitedUser.firstName || derivedFirstName,
                roomName: room.name,
                roomCode: room.roomCode,
                inviterName,
                inviteLink
            });
        } catch (mailError) {
            console.error("Invite email send error:", mailError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invite saved, but failed to send email. Please verify SMTP settings and try again.",
                invite: {
                    id: invite.id,
                    email: invite.email,
                    createdAt: invite.createdAt
                },
                accessGrantedNow,
                alreadyApproved,
                emailSent: false
            }, {
                status: 502
            });
        }
        const message = alreadyApproved ? "This teammate already has room access. Invite email sent." : accessGrantedNow ? "Teammate invited, approved, and email sent." : "Invite saved. Access will be granted automatically when they join. Email sent.";
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message,
            invite: {
                id: invite.id,
                email: invite.email,
                createdAt: invite.createdAt
            },
            accessGrantedNow,
            alreadyApproved,
            emailSent: true
        });
    } catch (error) {
        console.error("Invite member error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to invite teammate."
        }, {
            status: 500
        });
    }
}
async function DELETE(request, { params }) {
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
        const room = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].room.findUnique({
            where: {
                id: roomId
            }
        });
        if (!room) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Room not found."
            }, {
                status: 404
            });
        }
        // Admin cannot exit their own room
        if (room.adminId === session.userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Room admin cannot exit the room. Transfer ownership or delete the room instead."
            }, {
                status: 400
            });
        }
        const member = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].roomMember.findFirst({
            where: {
                roomId,
                userId: session.userId
            }
        });
        if (!member) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "You are not a member of this room."
            }, {
                status: 404
            });
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].roomMember.delete({
            where: {
                id: member.id
            }
        });
        // Clear the room session cookie
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "You have exited the room."
        });
        const { clearRoomSessionCookie } = await __turbopack_context__.A("[project]/lib/session.js [app-route] (ecmascript, async loader)");
        clearRoomSessionCookie(response);
        return response;
    } catch (error) {
        console.error("Exit room error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to exit room."
        }, {
            status: 500
        });
    }
}
async function PATCH(request, { params }) {
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
        const { memberId, memberUserId, action } = await request.json();
        // Verify admin
        const room = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].room.findUnique({
            where: {
                id: roomId
            }
        });
        if (!room || room.adminId !== session.userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized."
            }, {
                status: 403
            });
        }
        if (![
            "APPROVED",
            "REJECTED",
            "REMOVED"
        ].includes(action)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid action."
            }, {
                status: 400
            });
        }
        // Admin removes an already approved member from the room.
        if (action === "REMOVED") {
            if (!memberUserId) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "memberUserId is required for remove action."
                }, {
                    status: 400
                });
            }
            if (memberUserId === room.adminId) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Room admin cannot be removed."
                }, {
                    status: 400
                });
            }
            const existingMember = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].roomMember.findFirst({
                where: {
                    roomId,
                    userId: memberUserId,
                    status: "APPROVED"
                },
                include: {
                    user: true
                }
            });
            if (!existingMember) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Approved member not found."
                }, {
                    status: 404
                });
            }
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].roomMember.delete({
                where: {
                    id: existingMember.id
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Member removed.",
                member: {
                    id: existingMember.user.id,
                    firstName: existingMember.user.firstName,
                    lastName: existingMember.user.lastName,
                    email: existingMember.user.email
                }
            });
        }
        if (!memberId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "memberId is required for this action."
            }, {
                status: 400
            });
        }
        const existingMember = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].roomMember.findUnique({
            where: {
                id: memberId
            },
            include: {
                user: true
            }
        });
        if (!existingMember || existingMember.roomId !== roomId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Member not found."
            }, {
                status: 404
            });
        }
        if (existingMember.userId === room.adminId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Room admin cannot be modified."
            }, {
                status: 400
            });
        }
        const member = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].roomMember.update({
            where: {
                id: memberId
            },
            data: {
                status: action
            },
            include: {
                user: true
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: `Member ${action.toLowerCase()}.`,
            member: {
                id: member.user.id,
                firstName: member.user.firstName,
                lastName: member.user.lastName,
                email: member.user.email
            }
        });
    } catch (error) {
        console.error("Update member error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to update member status."
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6fd0db1d._.js.map