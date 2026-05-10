const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");
const Y = require("yjs");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const zlib = require("zlib");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

// Force webpack in development for stability. Turbopack's persisted dev cache
// has been panicking in this environment, while production remains unchanged.
const app = next({ dev, hostname, port, webpack: dev });
const handle = app.getRequestHandler();
const prisma = new PrismaClient();

// In-memory store for Yjs documents and user presence per room
const roomYDocs = new Map();
const roomUsers = new Map();
const roomCleanupTimers = new Map();
const roomYDocLoadedFromDB = new Set();
const roomSaveTimers = new Map();
const nextStaticRoot = path.join(process.cwd(), ".next", "static");
const nextStaticCssRoot = path.join(nextStaticRoot, "css");
const nextStaticChunksRoot = path.join(nextStaticRoot, "chunks");
const getApprovalChannel = (roomId) => `room-approval:${roomId}`;
const ROOM_DOC_CLEANUP_DELAY_MS = 10 * 60 * 1000;
const SOCKET_MAX_BUFFER_SIZE = 12 * 1024 * 1024;
const YJS_SOCKET_CHUNK_BYTES = 256 * 1024;
const ROOM_DB_SAVE_DELAY_MS = 30 * 1000;

const STATIC_CONTENT_TYPES = {
    ".css": "text/css; charset=UTF-8",
    ".js": "application/javascript; charset=UTF-8",
    ".json": "application/json; charset=UTF-8",
    ".map": "application/json; charset=UTF-8",
    ".txt": "text/plain; charset=UTF-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
};

const ROOM_SESSION_COOKIE = "teamnote_room_session";
const DEFAULT_SESSION_SECRET = "teamnote-dev-session-secret-change-this";
const LEGACY_CSS_PATH = /\/([^/?#]+\.css)$/i;
const STALE_CSS_PATH = /^(?:chunks|css)\/.+\.css$/i;
const STALE_JS_PATH =
    /^(?:chunks\/.+\.js|[^/]+\/_(?:buildManifest|ssgManifest)\.js)$/i;

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

function parseCookieHeader(cookieHeader) {
    const cookies = {};
    if (!cookieHeader || typeof cookieHeader !== "string") {
        return cookies;
    }

    for (const part of cookieHeader.split(";")) {
        const [rawName, ...rawValueParts] = part.split("=");
        const name = String(rawName || "").trim();
        if (!name) continue;
        const value = rawValueParts.join("=");
        try {
            cookies[name] = decodeURIComponent(String(value || "").trim());
        } catch {
            cookies[name] = String(value || "").trim();
        }
    }
    return cookies;
}

function verifySocketRoomSession(token) {
    if (!token || typeof token !== "string") return null;

    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return null;

    const expectedSignature = crypto
        .createHmac("sha256", getSessionSecret())
        .update(encodedPayload)
        .digest("base64url");

    const expectedBuffer = Buffer.from(expectedSignature);
    const actualBuffer = Buffer.from(signature);
    if (expectedBuffer.length !== actualBuffer.length) return null;
    if (!crypto.timingSafeEqual(expectedBuffer, actualBuffer)) return null;

    let payload = null;
    try {
        payload = JSON.parse(
            Buffer.from(encodedPayload, "base64url").toString("utf8")
        );
    } catch {
        return null;
    }

    if (!payload || typeof payload !== "object") return null;
    if (!payload.userId || !payload.roomId || typeof payload.exp !== "number") {
        return null;
    }
    if (Date.now() >= payload.exp) return null;

    return {
        userId: payload.userId,
        roomId: payload.roomId,
        isAdmin: Boolean(payload.isAdmin),
        exp: payload.exp,
    };
}

function getSocketSession(socket) {
    const cookieHeader = socket?.handshake?.headers?.cookie || "";
    const cookies = parseCookieHeader(cookieHeader);
    return verifySocketRoomSession(cookies[ROOM_SESSION_COOKIE]);
}

function socketHasRoomAccess(socket, roomId) {
    return Boolean(
        socket?.session &&
        socket?.roomAuthorized &&
        socket?.roomId === roomId &&
        roomId &&
        socket.session.roomId === roomId
    );
}

function normalizePageId(pageId) {
    if (pageId == null || pageId === "") return null;
    if (typeof pageId !== "string") return null;

    const trimmed = pageId.trim();
    if (!trimmed) return null;
    if (trimmed.length > 128) return null;
    return trimmed;
}

function clearRoomYDocs(roomId) {
    for (const key of roomYDocs.keys()) {
        if (key === roomId || key.startsWith(`${roomId}:`)) {
            roomYDocs.delete(key);
            roomYDocLoadedFromDB.delete(key);
            const saveTimer = roomSaveTimers.get(key);
            if (saveTimer) {
                clearTimeout(saveTimer);
                roomSaveTimers.delete(key);
            }
        }
    }
}

function cancelRoomCleanup(roomId) {
    const existing = roomCleanupTimers.get(roomId);
    if (existing) {
        clearTimeout(existing);
        roomCleanupTimers.delete(roomId);
    }
}

function scheduleRoomCleanup(roomId) {
    if (!roomId) return;
    cancelRoomCleanup(roomId);

    const timer = setTimeout(async () => {
        roomCleanupTimers.delete(roomId);
        const usersMap = roomUsers.get(roomId);
        if (usersMap && usersMap.size > 0) return;
        // Persist in-memory state to DB before clearing
        await saveAllRoomDocsToDB(roomId);
        clearRoomYDocs(roomId);
    }, ROOM_DOC_CLEANUP_DELAY_MS);

    roomCleanupTimers.set(roomId, timer);
}

function getRoomPresenceUsers(roomId) {
    const roomUserMap = roomUsers.get(roomId);
    if (!roomUserMap) return [];

    const dedupedUsers = new Map();
    for (const userData of roomUserMap.values()) {
        const dedupeKey = userData?.userId || userData?.socketId;
        if (!dedupeKey) continue;
        dedupedUsers.set(dedupeKey, userData);
    }

    return Array.from(dedupedUsers.values());
}

async function hasApprovedRoomAccess(roomId, userId) {
    const room = await prisma.room.findUnique({
        where: { id: roomId },
        select: { adminId: true },
    });
    if (!room) {
        return { allowed: false, isAdmin: false };
    }

    if (room.adminId === userId) {
        return { allowed: true, isAdmin: true, access: "EDIT" };
    }

    const membership = await prisma.roomMember.findFirst({
        where: {
            roomId,
            userId,
            status: "APPROVED",
        },
        select: { id: true, access: true },
    });

    return {
        allowed: Boolean(membership),
        isAdmin: false,
        access: membership?.access || "VIEW",
    };
}

async function canWatchRoomApproval(roomId, userId) {
    const room = await prisma.room.findUnique({
        where: { id: roomId },
        select: { adminId: true },
    });

    if (!room) return false;
    if (room.adminId === userId) return true;

    const membership = await prisma.roomMember.findFirst({
        where: {
            roomId,
            userId,
            status: { in: ["PENDING", "APPROVED"] },
        },
        select: { id: true },
    });

    return Boolean(membership);
}

async function roomHasPage(roomId, pageId) {
    if (!pageId) return true;

    const page = await prisma.page.findFirst({
        where: { id: pageId, roomId },
        select: { id: true },
    });

    return Boolean(page);
}

function getOrCreateYDoc(key) {
    if (!roomYDocs.has(key)) {
        roomYDocs.set(key, new Y.Doc());
    }
    return roomYDocs.get(key);
}

function yjsKey(roomId, pageId) {
    return pageId ? `${roomId}:${pageId}` : roomId;
}

function parseYjsKey(key) {
    const colonIndex = key.indexOf(":");
    if (colonIndex === -1) return { roomId: key, pageId: null };
    return { roomId: key.substring(0, colonIndex), pageId: key.substring(colonIndex + 1) };
}

/**
 * Load persisted content from the database into a Yjs document.
 * Handles both encrypted (client-saved) and unencrypted content.
 * Encrypted content will fail decompression silently — the client
 * will load and sync it instead.
 */
async function ensureYDocLoadedFromDB(key, roomId, pageId) {
    if (roomYDocLoadedFromDB.has(key)) return getOrCreateYDoc(key);
    roomYDocLoadedFromDB.add(key);

    const ydoc = getOrCreateYDoc(key);

    // Skip if doc already has content from a live session
    try {
        if (ydoc.getXmlFragment("default").length > 0) return ydoc;
    } catch { }

    try {
        let record = null;
        if (pageId) {
            record = await prisma.page.findFirst({
                where: { id: pageId, roomId },
                select: { compressedContent: true },
            });
        } else {
            record = await prisma.room.findUnique({
                where: { id: roomId },
                select: { compressedContent: true },
            });
        }

        const raw = record?.compressedContent;
        if (raw && raw.length > 0) {
            const decompressed = zlib.inflateSync(Buffer.from(raw));
            Y.applyUpdate(ydoc, new Uint8Array(decompressed));
            console.log(`[YDoc] Loaded persisted state for ${key} (${raw.length} bytes compressed)`);
        }
    } catch (err) {
        // Content may be client-side encrypted — only the client can decode it.
        // The client will load from DB via the save API and sync via socket.
        console.warn(`[YDoc] Could not restore persisted state for ${key} (may be encrypted):`, err.message);
    }

    return ydoc;
}

/**
 * Save the current Yjs document state to the database (unencrypted, compressed).
 */
async function saveYDocToDB(key, roomId, pageId) {
    const ydoc = roomYDocs.get(key);
    if (!ydoc) return;

    try {
        const state = Y.encodeStateAsUpdate(ydoc);
        if (state.length <= 2) return; // Empty doc

        const compressed = zlib.deflateSync(Buffer.from(state));

        if (pageId) {
            await prisma.page.updateMany({
                where: { id: pageId, roomId },
                data: { compressedContent: compressed },
            });
        } else {
            await prisma.room.update({
                where: { id: roomId },
                data: { compressedContent: compressed },
            });
        }

        console.log(`[YDoc] Saved state to DB for ${key} (${compressed.length} bytes)`);
    } catch (err) {
        console.error(`[YDoc] Failed to save state for ${key}:`, err);
    }
}

function scheduleDebouncedSave(key, roomId, pageId) {
    const existing = roomSaveTimers.get(key);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(() => {
        roomSaveTimers.delete(key);
        saveYDocToDB(key, roomId, pageId).catch((err) => {
            console.error(`[YDoc] Debounced save failed for ${key}:`, err);
        });
    }, ROOM_DB_SAVE_DELAY_MS);

    roomSaveTimers.set(key, timer);
}

async function saveAllRoomDocsToDB(roomId) {
    const promises = [];
    for (const key of roomYDocs.keys()) {
        if (key === roomId || key.startsWith(`${roomId}:`)) {
            const parsed = parseYjsKey(key);
            promises.push(saveYDocToDB(key, parsed.roomId, parsed.pageId));
        }
    }
    await Promise.allSettled(promises);
}

function normalizeBinaryUpdatePayload(input) {
    if (!input) return null;

    if (input instanceof Uint8Array) {
        return input;
    }

    if (ArrayBuffer.isView(input)) {
        return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    }

    if (input instanceof ArrayBuffer) {
        return new Uint8Array(input);
    }

    if (Array.isArray(input)) {
        return Uint8Array.from(input);
    }

    if (typeof input === "string") {
        const trimmed = input.trim();
        if (!trimmed) return null;

        if (/^\d+(,\d+)*$/.test(trimmed)) {
            return Uint8Array.from(
                trimmed.split(",").map((value) => Number.parseInt(value, 10))
            );
        }

        try {
            const decoded = Buffer.from(trimmed, "base64");
            return decoded.length ? new Uint8Array(decoded) : null;
        } catch {
            return null;
        }
    }

    if (typeof input === "object") {
        if (Array.isArray(input.data)) {
            return Uint8Array.from(input.data);
        }

        if (typeof input.base64 === "string") {
            try {
                const decoded = Buffer.from(input.base64, "base64");
                return decoded.length ? new Uint8Array(decoded) : null;
            } catch {
                return null;
            }
        }
    }

    return null;
}

function emitYjsSocketPayload(target, eventName, payload) {
    const update = normalizeBinaryUpdatePayload(payload?.update);
    if (!update) return;

    if (update.byteLength <= YJS_SOCKET_CHUNK_BYTES) {
        target.emit(eventName, {
            ...payload,
            update,
        });
        return;
    }

    const updateId = crypto.randomUUID();
    const total = Math.ceil(update.byteLength / YJS_SOCKET_CHUNK_BYTES);
    const { update: _update, ...rest } = payload;

    for (let index = 0; index < total; index += 1) {
        const start = index * YJS_SOCKET_CHUNK_BYTES;
        const end = Math.min(start + YJS_SOCKET_CHUNK_BYTES, update.byteLength);
        target.emit(`${eventName}-chunk`, {
            ...rest,
            updateId,
            index,
            total,
            chunk: update.slice(start, end),
        });
    }
}

function contentTypeForFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return STATIC_CONTENT_TYPES[ext] || "application/octet-stream";
}

function resolvePathWithinRoot(rootPath, relativePath) {
    const resolvedPath = path.resolve(rootPath, relativePath);
    const allowedRoot = rootPath.endsWith(path.sep)
        ? rootPath
        : `${rootPath}${path.sep}`;
    return resolvedPath.startsWith(allowedRoot) ? resolvedPath : null;
}

async function sendStaticFile(req, res, filePath, cacheControl) {
    const stats = await fs.promises.stat(filePath);
    if (!stats.isFile()) return false;

    res.statusCode = 200;
    res.setHeader("Content-Type", contentTypeForFile(filePath));
    res.setHeader("Content-Length", stats.size);
    res.setHeader("Cache-Control", cacheControl);
    res.setHeader("Accept-Ranges", "bytes");

    if (req.method === "HEAD") {
        res.end();
        return true;
    }

    const stream = fs.createReadStream(filePath);
    stream.on("error", (err) => {
        console.error("[Static] Stream error:", err);
        if (!res.headersSent) {
            res.statusCode = 500;
        }
        if (!res.writableEnded) {
            res.end("Internal Server Error");
        }
    });
    stream.pipe(res);
    return true;
}

function sendChunkRecoveryScript(req, res, missingPathname) {
    const payload = `(function () {
    var RELOAD_GUARD_KEY = "__teamnoteChunkReloadInProgress";

    function hardReloadWithCacheBust() {
        var nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set("_r", Date.now().toString());
        var nextHref = nextUrl.toString();
        var didNavigate = false;
        var navigate = function () {
            if (didNavigate) return;
            didNavigate = true;
            window.location.replace(nextHref);
        };

        try {
            var tasks = [];
            if (
                window.caches &&
                typeof window.caches.keys === "function" &&
                typeof window.caches.delete === "function"
            ) {
                tasks.push(
                    window.caches.keys().then(function (keys) {
                        return Promise.all(
                            keys.map(function (key) {
                                return window.caches.delete(key);
                            })
                        );
                    })
                );
            }
            if (
                window.navigator &&
                window.navigator.serviceWorker &&
                typeof window.navigator.serviceWorker.getRegistrations === "function"
            ) {
                tasks.push(
                    window.navigator.serviceWorker.getRegistrations().then(function (registrations) {
                        return Promise.all(
                            registrations.map(function (registration) {
                                return registration.unregister();
                            })
                        );
                    })
                );
            }

            if (tasks.length) {
                Promise.allSettled(tasks).finally(navigate);
                setTimeout(navigate, 1500);
                return;
            }

            navigate();
        } catch {
            navigate();
        }
    }

    try {
        if (window[RELOAD_GUARD_KEY]) {
            return;
        }

        window[RELOAD_GUARD_KEY] = true;
        hardReloadWithCacheBust();
    } catch {
        window.location.reload();
    }
})();`;
    const body = Buffer.from(payload, "utf8");

    console.warn(
        `[Static] Missing JS asset "${missingPathname}", serving chunk recovery script.`
    );
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
    res.setHeader("Content-Length", body.length);
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    if (req.method === "HEAD") {
        res.end();
        return true;
    }

    res.end(body);
    return true;
}

async function findNewestCssFile() {
    try {
        let newestFile = null;

        async function walk(dirPath) {
            let entries = [];
            try {
                entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
            } catch {
                return;
            }

            for (const entry of entries) {
                const entryPath = path.join(dirPath, entry.name);
                if (entry.isDirectory()) {
                    await walk(entryPath);
                    continue;
                }
                if (!entry.isFile() || !entry.name.endsWith(".css")) continue;

                const stats = await fs.promises.stat(entryPath);
                if (!newestFile || stats.mtimeMs > newestFile.mtimeMs) {
                    newestFile = { filePath: entryPath, mtimeMs: stats.mtimeMs };
                }
            }
        }

        await walk(nextStaticCssRoot);
        await walk(nextStaticChunksRoot);

        return newestFile ? newestFile.filePath : null;
    } catch {
        return null;
    }
}

async function tryServeNextStatic(req, res, pathname) {
    // In dev, Next/Turbopack serves many assets from its own pipeline.
    // Bypassing it with disk reads causes false chunk 404s.
    if (dev) return false;
    if (req.method !== "GET" && req.method !== "HEAD") return false;

    const STATIC_PREFIXES = ["/_next/static/", "/next/static/"];
    const matchedPrefix = STATIC_PREFIXES.find((prefix) =>
        pathname && pathname.startsWith(prefix)
    );
    let relativePath = "";
    if (matchedPrefix) {
        try {
            relativePath = decodeURIComponent(pathname.slice(matchedPrefix.length));
        } catch {
            res.statusCode = 400;
            res.end("Bad Request");
            return true;
        }
    } else {
        const legacyCssMatch = pathname && pathname.match(LEGACY_CSS_PATH);
        if (!legacyCssMatch) return false;
        relativePath = `chunks/${legacyCssMatch[1]}`;
    }

    if (!relativePath) {
        res.statusCode = 404;
        res.end("Not Found");
        return true;
    }

    const requestedPath = resolvePathWithinRoot(nextStaticRoot, relativePath);
    if (!requestedPath) {
        res.statusCode = 403;
        res.end("Forbidden");
        return true;
    }

    try {
        const served = await sendStaticFile(
            req,
            res,
            requestedPath,
            "public, max-age=31536000, immutable"
        );
        if (!served) {
            res.statusCode = 404;
            res.end("Not Found");
            return true;
        }
        return true;
    } catch (err) {
        if (err && err.code === "ENOENT") {
            if (STALE_CSS_PATH.test(relativePath)) {
                const fallbackCssPath = await findNewestCssFile();
                if (fallbackCssPath) {
                    console.warn(
                        `[Static] Missing CSS asset "${pathname}", serving fallback "${path.basename(fallbackCssPath)}".`
                    );
                    try {
                        await sendStaticFile(
                            req,
                            res,
                            fallbackCssPath,
                            "no-store, max-age=0"
                        );
                        return true;
                    } catch (fallbackErr) {
                        console.error("[Static] CSS fallback failed:", fallbackErr);
                    }
                }
            }
            if (STALE_JS_PATH.test(relativePath)) {
                return sendChunkRecoveryScript(req, res, pathname);
            }
            res.statusCode = 404;
            res.end("Not Found");
            return true;
        }
        console.error(`[Static] Failed to serve ${pathname}:`, err);
        res.statusCode = 500;
        res.end("Internal Server Error");
        return true;
    }
}

function isStaticChunkScriptPath(pathname) {
    if (!pathname || typeof pathname !== "string") return false;
    return (
        /^\/_next\/static\/chunks\/.+\.js$/i.test(pathname) ||
        /^\/next\/static\/chunks\/.+\.js$/i.test(pathname)
    );
}

async function handleWithChunk404Fallback(req, res, parsedUrl, pathname, nextHandle) {
    if (!isStaticChunkScriptPath(pathname)) {
        return nextHandle(req, res, parsedUrl);
    }

    const originalWriteHead = res.writeHead.bind(res);
    const originalWrite = res.write.bind(res);
    const originalEnd = res.end.bind(res);
    let fallbackSent = false;

    const sendFallback = () => {
        if (fallbackSent) return true;
        fallbackSent = true;
        // Restore original methods before writing fallback response.
        res.writeHead = originalWriteHead;
        res.write = originalWrite;
        res.end = originalEnd;
        return sendChunkRecoveryScript(req, res, pathname);
    };

    res.writeHead = function patchedWriteHead(statusCode, ...args) {
        if (!res.headersSent && Number(statusCode) === 404) {
            sendFallback();
            return res;
        }
        return originalWriteHead(statusCode, ...args);
    };

    res.write = function patchedWrite(chunk, encoding, cb) {
        if (fallbackSent) return true;
        return originalWrite(chunk, encoding, cb);
    };

    res.end = function patchedEnd(chunk, encoding, cb) {
        if (fallbackSent) {
            return originalEnd(null, encoding, cb);
        }
        if (res.statusCode === 404) {
            return sendFallback();
        }
        return originalEnd(chunk, encoding, cb);
    };

    return nextHandle(req, res, parsedUrl);
}

app.prepare().then(() => {
    const server = createServer(async (req, res) => {
        const parsedUrl = parse(req.url, true);

        if (!res.headersSent) {
            res.setHeader("X-Content-Type-Options", "nosniff");
            // Allow same-origin embedding so the floating note window can
            // render the current page inside a browser-managed mini window.
            res.setHeader("X-Frame-Options", "SAMEORIGIN");
            res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
            res.setHeader(
                "Permissions-Policy",
                "camera=(), microphone=(), geolocation=()"
            );
            // Content Security Policy — restrict script/style/connect sources.
            res.setHeader(
                "Content-Security-Policy",
                [
                    "default-src 'self'",
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                    "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com",
                    "font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com",
                    "connect-src 'self' wss: ws:",
                    "img-src 'self' data: blob:",
                    "frame-ancestors 'self'",
                ].join("; ")
            );
            if (
                !dev &&
                String(req.headers["x-forwarded-proto"] || "").includes("https")
            ) {
                res.setHeader(
                    "Strict-Transport-Security",
                    "max-age=31536000; includeSubDomains"
                );
            }
        }

        // Avoid stale HTML / RSC payloads referencing old chunk hashes after deploy.
        // Keep immutable caching only for /_next/static assets.
        if (!dev) {
            const pathname = parsedUrl.pathname || "";
            const accept = String(req.headers.accept || "");
            const isStaticAssetRequest =
                pathname.startsWith("/_next/static/") ||
                pathname.startsWith("/next/static/");
            const isRscFlightRequest =
                Object.prototype.hasOwnProperty.call(parsedUrl.query || {}, "_rsc") ||
                accept.includes("text/x-component");
            const wantsDocumentOrFlight =
                accept.includes("text/html") || isRscFlightRequest;
            const isGetLike = req.method === "GET" || req.method === "HEAD";

            if (
                isGetLike &&
                wantsDocumentOrFlight &&
                !isStaticAssetRequest &&
                !res.headersSent
            ) {
                res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
                res.setHeader("Pragma", "no-cache");
                res.setHeader("Expires", "0");
            }
        }

        const handled = await tryServeNextStatic(req, res, parsedUrl.pathname);
        if (handled) return;
        await handleWithChunk404Fallback(
            req,
            res,
            parsedUrl,
            parsedUrl.pathname || "",
            handle
        );
    });

    const allowedOrigins = new Set([
        `http://localhost:${port}`,
        `http://127.0.0.1:${port}`,
    ]);
    if (process.env.APP_URL) {
        try {
            allowedOrigins.add(new URL(process.env.APP_URL).origin);
        } catch {
            console.warn("[Socket] Invalid APP_URL for CORS origin:", process.env.APP_URL);
        }
    }

    const io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.has(origin)) {
                    callback(null, true);
                    return;
                }
                callback(new Error("Socket CORS blocked"));
            },
            methods: ["GET", "POST"],
            credentials: true,
        },
        path: "/socket.io",
        // Uploaded files are embedded as data URLs inside Yjs updates.
        // A 5 MB file expands to ~6.7 MB base64 before Yjs/Socket.IO overhead.
        maxHttpBufferSize: SOCKET_MAX_BUFFER_SIZE,
    });
    globalThis.__teamnoteIo = io;

    io.use((socket, next) => {
        socket.session = getSocketSession(socket);
        next();
    });

    io.on("connection", (socket) => {
        socket.roomAuthorized = false;
        const yjsChunkBuffers = new Map();
        console.log(`[Socket] Connected: ${socket.id}`);

        // Join a room
        socket.on("join-room", async ({ roomId, user, pageId }) => {
            const normalizedPageId = normalizePageId(pageId);

            try {
                if (!socket.session || !roomId) {
                    socket.emit("access-revoked", { roomId: roomId || null });
                    return;
                }
                if (socket.session.roomId !== roomId) {
                    socket.emit("access-revoked", { roomId });
                    return;
                }
                if (pageId != null && pageId !== "" && !normalizedPageId) {
                    socket.emit("access-revoked", { roomId });
                    return;
                }
                if (user?.userId && user.userId !== socket.session.userId) {
                    socket.emit("access-revoked", { roomId });
                    return;
                }

                const roomAccess = await hasApprovedRoomAccess(
                    roomId,
                    socket.session.userId
                );
                if (!roomAccess.allowed) {
                    socket.emit("access-revoked", { roomId });
                    return;
                }

                if (normalizedPageId) {
                    const pageExists = await roomHasPage(roomId, normalizedPageId);
                    if (!pageExists) {
                        socket.emit("access-revoked", { roomId });
                        return;
                    }
                }

                cancelRoomCleanup(roomId);

                const safeUser = {
                    ...user,
                    userId: socket.session.userId,
                };

                socket.join(roomId);
                socket.roomId = roomId;
                socket.roomAuthorized = true;
                socket.session.isAdmin = roomAccess.isAdmin;
                socket.session.access = roomAccess.access || "VIEW";
                socket.userData = safeUser;
                socket.pageId = normalizedPageId;

                // Also join a page-specific channel for Yjs
                if (normalizedPageId) {
                    socket.join(`${roomId}:${normalizedPageId}`);
                }

                // Track online users
                if (!roomUsers.has(roomId)) {
                    roomUsers.set(roomId, new Map());
                }
                roomUsers.get(roomId).set(socket.id, {
                    ...safeUser,
                    socketId: socket.id,
                    color: safeUser?.color || getRandomColor(),
                    pageId: normalizedPageId,
                });

                // Broadcast presence update
                io.to(roomId).emit("presence-update", {
                    users: getRoomPresenceUsers(roomId),
                });

                // Send full Yjs state for the current page
                const key = yjsKey(roomId, normalizedPageId);
                const ydoc = await ensureYDocLoadedFromDB(key, roomId, normalizedPageId);
                const state = Y.encodeStateAsUpdate(ydoc);
                if (state.length > 2) {
                    emitYjsSocketPayload(socket, "yjs-sync", {
                        update: state,
                        pageId: normalizedPageId || null,
                    });
                }

                console.log(`[Socket] ${(safeUser && (safeUser.username || safeUser.firstName)) || "User"} joined room ${roomId}${normalizedPageId ? ` page ${normalizedPageId}` : ""}`);

                io.to(roomId).emit("members-refresh");
            } catch (err) {
                console.error("[Socket] join-room failed:", err);
                socket.emit("access-revoked", { roomId: roomId || null });
            }
        });

        // Switch to a different page within the same room
        socket.on("switch-page", async ({ roomId, pageId }) => {
            const normalizedPageId = normalizePageId(pageId);
            if (!roomId || !normalizedPageId) return;
            if (!socketHasRoomAccess(socket, roomId)) return;

            try {
                const pageExists = await roomHasPage(roomId, normalizedPageId);
                if (!pageExists) return;

                // Leave old page channel
                if (socket.pageId) {
                    socket.leave(`${roomId}:${socket.pageId}`);
                }

                socket.pageId = normalizedPageId;
                socket.join(`${roomId}:${normalizedPageId}`);

                // Update presence with new pageId
                if (roomUsers.has(roomId) && roomUsers.get(roomId).has(socket.id)) {
                    const userData = roomUsers.get(roomId).get(socket.id);
                    userData.pageId = normalizedPageId;
                    io.to(roomId).emit("presence-update", {
                        users: getRoomPresenceUsers(roomId),
                    });
                }

                // Send full Yjs state for the new page
                const key = yjsKey(roomId, normalizedPageId);
                const ydoc = await ensureYDocLoadedFromDB(key, roomId, normalizedPageId);
                const state = Y.encodeStateAsUpdate(ydoc);
                if (state.length > 2) {
                    emitYjsSocketPayload(socket, "yjs-sync", {
                        update: state,
                        pageId: normalizedPageId,
                    });
                }
            } catch (err) {
                console.error("[Socket] switch-page failed:", err);
            }
        });

        const ensureSocketPage = async (roomId, pageId) => {
            const normalizedPageId = normalizePageId(pageId);
            if (!normalizedPageId) return socket.pageId || null;
            if (socket.pageId === normalizedPageId) return normalizedPageId;

            const pageExists = await roomHasPage(roomId, normalizedPageId);
            if (!pageExists) return null;

            if (socket.pageId) {
                socket.leave(`${roomId}:${socket.pageId}`);
            }

            socket.pageId = normalizedPageId;
            socket.join(`${roomId}:${normalizedPageId}`);

            if (roomUsers.has(roomId) && roomUsers.get(roomId).has(socket.id)) {
                const userData = roomUsers.get(roomId).get(socket.id);
                userData.pageId = normalizedPageId;
                io.to(roomId).emit("presence-update", {
                    users: getRoomPresenceUsers(roomId),
                });
            }

            return normalizedPageId;
        };

        // Notify all clients in a room that pages changed (created/renamed/deleted)
        socket.on("pages-changed", ({ roomId }) => {
            if (!roomId) return;
            if (!socketHasRoomAccess(socket, roomId)) return;
            io.to(roomId).emit("pages-refresh");
        });

        // Admin-only manual refresh trigger.
        socket.on("new-join-request", ({ roomId: targetRoomId }) => {
            if (!targetRoomId) return;
            if (!socketHasRoomAccess(socket, targetRoomId)) return;
            if (!socket.session?.isAdmin) return;
            io.to(targetRoomId).emit("members-refresh");
        });

        // Pending users subscribe here so they can be notified when approved/rejected.
        socket.on("watch-room-approval", async ({ roomId }) => {
            if (
                typeof roomId !== "string" ||
                roomId.length === 0 ||
                roomId.length > 64
            ) {
                return;
            }

            if (!socket.session || socket.session.roomId !== roomId) {
                return;
            }

            try {
                const canWatch = await canWatchRoomApproval(
                    roomId,
                    socket.session.userId
                );
                if (!canWatch) return;

                const approvalChannel = getApprovalChannel(roomId);

                if (
                    socket.approvalChannel &&
                    socket.approvalChannel !== approvalChannel
                ) {
                    socket.leave(socket.approvalChannel);
                }

                socket.approvalChannel = approvalChannel;
                socket.join(approvalChannel);
            } catch (err) {
                console.error("[Socket] watch-room-approval failed:", err);
            }
        });

        const handleYjsUpdate = async ({ roomId, update, user, pageId }) => {
            if (!update || !roomId) return;
            if (!socketHasRoomAccess(socket, roomId)) return;
            if (!socket.session?.isAdmin && socket.session?.access === "VIEW") return;

            let activePageId;
            try {
                activePageId = await ensureSocketPage(roomId, pageId);
            } catch (err) {
                console.warn("[Socket] Failed to resolve yjs-update page:", err);
                return;
            }
            if (!activePageId) return;

            const uint8 = normalizeBinaryUpdatePayload(update);
            if (!uint8 || uint8.length === 0) {
                console.warn(
                    `[Socket] Ignored malformed yjs-update payload for room ${roomId}.`
                );
                return;
            }

            const key = yjsKey(roomId, activePageId);
            const ydoc = getOrCreateYDoc(key);

            try {
                // Apply update to server-side Yjs doc
                Y.applyUpdate(ydoc, uint8);
            } catch (err) {
                console.warn("[Socket] Failed to apply yjs-update:", err);
                return;
            }

            // Schedule debounced save to database
            scheduleDebouncedSave(key, roomId, activePageId);

            // Broadcast to all OTHER clients on the same page
            const channel = activePageId ? `${roomId}:${activePageId}` : roomId;
            emitYjsSocketPayload(socket.to(channel), "yjs-update", {
                update: uint8,
                user: (user && user.userId === socket.session?.userId)
                    ? user
                    : (socket.userData || null),
                pageId: activePageId,
            });
        };

        // Yjs incremental update from a client
        socket.on("yjs-update", handleYjsUpdate);

        socket.on("yjs-update-chunk", async (payload) => {
            const updateId = String(payload?.updateId || "");
            const index = Number(payload?.index);
            const total = Number(payload?.total);
            const chunk = normalizeBinaryUpdatePayload(payload?.chunk);

            if (!updateId || !Number.isInteger(index) || !Number.isInteger(total)) return;
            if (total <= 0 || total > 128 || index < 0 || index >= total) return;
            if (!chunk || chunk.byteLength === 0) return;

            const key = `${socket.id}:${updateId}`;
            let entry = yjsChunkBuffers.get(key);
            if (!entry) {
                entry = {
                    roomId: payload?.roomId,
                    pageId: payload?.pageId || null,
                    user: payload?.user || null,
                    total,
                    chunks: new Array(total),
                    received: 0,
                    bytes: 0,
                    createdAt: Date.now(),
                };
                yjsChunkBuffers.set(key, entry);
            }

            if (entry.total !== total || entry.chunks[index]) return;

            entry.chunks[index] = chunk;
            entry.received += 1;
            entry.bytes += chunk.byteLength;

            if (entry.bytes > SOCKET_MAX_BUFFER_SIZE) {
                yjsChunkBuffers.delete(key);
                console.warn("[Socket] Dropped oversized chunked yjs-update.");
                return;
            }

            if (entry.received !== entry.total) return;

            yjsChunkBuffers.delete(key);
            const merged = new Uint8Array(entry.bytes);
            let offset = 0;
            for (const part of entry.chunks) {
                if (!part) return;
                merged.set(part, offset);
                offset += part.byteLength;
            }

            await handleYjsUpdate({
                roomId: entry.roomId,
                pageId: entry.pageId,
                user: entry.user,
                update: merged,
            });
        });

        // Client requests full Yjs state (on reconnect or late join)
        socket.on("yjs-request-state", async ({ roomId, pageId }) => {
            if (!socketHasRoomAccess(socket, roomId)) return;
            let activePageId;
            try {
                activePageId = await ensureSocketPage(roomId, pageId);
            } catch (err) {
                console.warn("[Socket] Failed to resolve yjs-request-state page:", err);
                return;
            }
            if (!activePageId) return;

            const key = yjsKey(roomId, activePageId);
            const ydoc = await ensureYDocLoadedFromDB(key, roomId, activePageId);
            const state = Y.encodeStateAsUpdate(ydoc);
            emitYjsSocketPayload(socket, "yjs-sync", {
                update: state,
                pageId: activePageId,
            });
        });

        // Awareness update (cursor positions, user presence)
        socket.on("awareness-update", ({ roomId, update }) => {
            if (!update || !roomId) return;
            if (!socketHasRoomAccess(socket, roomId)) return;
            // Broadcast to all OTHER clients in the room
            socket.to(roomId).emit("awareness-update", {
                update,
            });
        });

        // Cursor position update (keep for backward compat)
        socket.on("cursor-update", ({ roomId, cursor }) => {
            if (!socketHasRoomAccess(socket, roomId)) return;
            socket.to(roomId).emit("cursor-update", {
                socketId: socket.id,
                user: socket.userData,
                cursor,
            });
        });

        // Lightweight typing indicator events.
        socket.on("typing-status", ({ roomId, userId, isTyping }) => {
            if (!roomId || !userId) return;
            if (!socketHasRoomAccess(socket, roomId)) return;
            if (!socket.session || socket.session.userId !== userId) return;
            socket.to(roomId).emit("typing-status", {
                userId,
                isTyping: Boolean(isTyping),
            });
        });

        // Member status changed (admin approved/rejected)
        socket.on("member-status-changed", ({ roomId }) => {
            if (!roomId) return;
            if (!socketHasRoomAccess(socket, roomId)) return;
            if (!socket.session?.isAdmin) return;
            io.to(roomId).emit("members-refresh");
            io.to(getApprovalChannel(roomId)).emit("approval-refresh");
        });

        socket.on("member-access-changed", async ({ roomId, userId }) => {
            if (!roomId || !userId) return;
            if (!socketHasRoomAccess(socket, roomId)) return;
            if (!socket.session?.isAdmin) return;

            const membership = await prisma.roomMember.findFirst({
                where: { roomId, userId, status: "APPROVED" },
                select: { access: true },
            });
            const nextAccess = membership?.access || "VIEW";

            io.to(roomId).emit("members-refresh");

            const roomSocketIds = io.sockets.adapter.rooms.get(roomId);
            if (!roomSocketIds) return;

            for (const socketId of roomSocketIds) {
                const roomSocket = io.sockets.sockets.get(socketId);
                if (!roomSocket || roomSocket.userData?.userId !== userId) continue;
                roomSocket.session.access = nextAccess;
                roomSocket.emit("access-refresh", { roomId, access: nextAccess });
            }
        });

        // Admin removed an approved member; revoke access in real time.
        socket.on("member-removed", ({ roomId, userId }) => {
            if (!roomId || !userId) return;
            if (!socketHasRoomAccess(socket, roomId)) return;
            if (!socket.session?.isAdmin) return;

            io.to(roomId).emit("members-refresh");
            io.to(getApprovalChannel(roomId)).emit("approval-refresh");

            const roomSocketIds = io.sockets.adapter.rooms.get(roomId);
            if (roomSocketIds) {
                for (const socketId of roomSocketIds) {
                    const roomSocket = io.sockets.sockets.get(socketId);
                    if (!roomSocket) continue;
                    if (roomSocket.userData?.userId !== userId) continue;

                    roomSocket.emit("access-revoked", { roomId });
                    if (roomSocket.pageId) {
                        roomSocket.leave(`${roomId}:${roomSocket.pageId}`);
                    }
                    roomSocket.leave(roomId);
                    roomSocket.roomAuthorized = false;
                    roomSocket.roomId = null;
                    roomSocket.pageId = null;

                    if (roomUsers.has(roomId)) {
                        roomUsers.get(roomId).delete(roomSocket.id);
                    }
                }
            }

            if (roomUsers.has(roomId)) {
                const usersMap = roomUsers.get(roomId);
                if (usersMap.size === 0) {
                    roomUsers.delete(roomId);
                    scheduleRoomCleanup(roomId);
                } else {
                    io.to(roomId).emit("presence-update", {
                        users: Array.from(usersMap.values()),
                    });
                }
            }
        });

        // Admin deleted the room; revoke all active sockets in that room.
        socket.on("room-deleted", ({ roomId }) => {
            if (!roomId) return;
            if (!socketHasRoomAccess(socket, roomId)) return;
            if (!socket.session?.isAdmin) return;

            io.to(roomId).emit("access-revoked", { roomId });
            io.to(getApprovalChannel(roomId)).emit("approval-refresh");

            const roomSocketIds = io.sockets.adapter.rooms.get(roomId);
            if (roomSocketIds) {
                for (const socketId of roomSocketIds) {
                    const roomSocket = io.sockets.sockets.get(socketId);
                    if (!roomSocket) continue;

                    if (roomSocket.pageId) {
                        roomSocket.leave(`${roomId}:${roomSocket.pageId}`);
                    }
                    roomSocket.leave(roomId);
                    roomSocket.roomAuthorized = false;
                    roomSocket.roomId = null;
                    roomSocket.pageId = null;
                }
            }

            if (roomUsers.has(roomId)) {
                roomUsers.delete(roomId);
            }
            scheduleRoomCleanup(roomId);
        });

        // Settings changed
        socket.on("settings-changed", ({ roomId }) => {
            if (!socketHasRoomAccess(socket, roomId)) return;
            if (!socket.session?.isAdmin) return;
            io.to(roomId).emit("settings-refresh");
        });

        // Disconnect
        socket.on("disconnect", () => {
            const { roomId } = socket;
            if (roomId && roomUsers.has(roomId)) {
                roomUsers.get(roomId).delete(socket.id);
                if (roomUsers.get(roomId).size === 0) {
                    roomUsers.delete(roomId);
                    // Save all docs for this room before scheduling cleanup
                    saveAllRoomDocsToDB(roomId).catch((err) => {
                        console.error(`[YDoc] Save on last disconnect failed for ${roomId}:`, err);
                    });
                    scheduleRoomCleanup(roomId);
                } else {
                    io.to(roomId).emit("presence-update", {
                        users: getRoomPresenceUsers(roomId),
                    });
                }
            }
            console.log(`[Socket] Disconnected: ${socket.id}`);
        });
    });

    server.listen(port, () => {
        console.log(`\n  ✅ TeamNotes ready at http://${hostname}:${port}\n`);
    });
});

function getRandomColor() {
    const colors = [
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
        "#0F766E",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Graceful shutdown — persist all in-memory Yjs documents to the database.
async function saveAllDocsBeforeShutdown() {
    console.log("[YDoc] Saving all in-memory documents before shutdown...");
    const promises = [];
    for (const key of roomYDocs.keys()) {
        const parsed = parseYjsKey(key);
        promises.push(saveYDocToDB(key, parsed.roomId, parsed.pageId));
    }
    await Promise.allSettled(promises);
    console.log("[YDoc] All documents saved.");
}

process.on("SIGTERM", async () => {
    await saveAllDocsBeforeShutdown();
    process.exit(0);
});

process.on("SIGINT", async () => {
    await saveAllDocsBeforeShutdown();
    process.exit(0);
});
