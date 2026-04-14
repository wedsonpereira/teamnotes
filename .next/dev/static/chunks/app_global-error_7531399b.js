(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/global-error.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GlobalError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const CHUNK_RELOAD_GUARD_KEY = "__teamnoteChunkReloadInProgress";
function isChunkLoadLikeError(error) {
    if (!error) return false;
    const message = String(error?.message || error).toLowerCase();
    return message.includes("chunkloaderror") || message.includes("loading chunk") || message.includes("/_next/static/") || message.includes("/next/static/") || message.includes("failed to fetch dynamically imported module") || message.includes("importing a module script failed");
}
function tryRecoverChunkLoad() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        if (window[CHUNK_RELOAD_GUARD_KEY]) return false;
        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set("_r", Date.now().toString());
        const nextHref = nextUrl.toString();
        let didNavigate = false;
        const navigate = ()=>{
            if (didNavigate) return;
            didNavigate = true;
            window.location.replace(nextHref);
        };
        window[CHUNK_RELOAD_GUARD_KEY] = true;
        const tasks = [];
        if (window.caches && typeof window.caches.keys === "function" && typeof window.caches.delete === "function") {
            tasks.push(window.caches.keys().then((keys)=>Promise.all(keys.map((key)=>window.caches.delete(key)))));
        }
        if (window.navigator?.serviceWorker && typeof window.navigator.serviceWorker.getRegistrations === "function") {
            tasks.push(window.navigator.serviceWorker.getRegistrations().then((registrations)=>Promise.all(registrations.map((registration)=>registration.unregister()))));
        }
        if (tasks.length) {
            Promise.allSettled(tasks).finally(navigate);
            window.setTimeout(navigate, 1500);
        } else {
            navigate();
        }
        return true;
    } catch  {
        window.location.reload();
        return true;
    }
}
function GlobalError({ error, reset }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GlobalError.useEffect": ()=>{
            console.error("Global application error:", error);
            if (isChunkLoadLikeError(error)) {
                tryRecoverChunkLoad();
            }
        }
    }["GlobalError.useEffect"], [
        error
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "landing-container",
                style: {
                    textAlign: "center",
                    paddingInline: 24
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 52,
                            marginBottom: 12
                        },
                        children: "⚠️"
                    }, void 0, false, {
                        fileName: "[project]/app/global-error.js",
                        lineNumber: 94,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        style: {
                            fontSize: 28,
                            marginBottom: 8
                        },
                        children: "Something went wrong"
                    }, void 0, false, {
                        fileName: "[project]/app/global-error.js",
                        lineNumber: 95,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            color: "var(--text-secondary)",
                            marginBottom: 20
                        },
                        children: "TeamNote hit an unexpected error. You can retry safely."
                    }, void 0, false, {
                        fileName: "[project]/app/global-error.js",
                        lineNumber: 98,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "inline-flex",
                            gap: 10
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn-primary btn-sm",
                                onClick: reset,
                                children: "Retry"
                            }, void 0, false, {
                                fileName: "[project]/app/global-error.js",
                                lineNumber: 102,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "btn btn-ghost btn-sm",
                                children: "Back to Home"
                            }, void 0, false, {
                                fileName: "[project]/app/global-error.js",
                                lineNumber: 105,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/global-error.js",
                        lineNumber: 101,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/global-error.js",
                lineNumber: 90,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/global-error.js",
            lineNumber: 89,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/global-error.js",
        lineNumber: 88,
        columnNumber: 9
    }, this);
}
_s(GlobalError, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = GlobalError;
var _c;
__turbopack_context__.k.register(_c, "GlobalError");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_global-error_7531399b.js.map