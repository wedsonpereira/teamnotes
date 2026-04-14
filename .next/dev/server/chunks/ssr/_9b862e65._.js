module.exports = [
"[project]/app/layout.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RootLayout,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
;
const metadata = {
    title: "TeamNotes — Collaborative Text Editor",
    description: "Real-time collaborative text editor with room-based access. Create or join rooms to edit documents together."
};
function RootLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "en",
        suppressHydrationWarning: true,
        "data-scroll-behavior": "smooth",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("head", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "icon",
                        href: "/favicon.svg",
                        type: "image/svg+xml"
                    }, void 0, false, {
                        fileName: "[project]/app/layout.js",
                        lineNumber: 13,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "stylesheet",
                        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
                        crossOrigin: "anonymous"
                    }, void 0, false, {
                        fileName: "[project]/app/layout.js",
                        lineNumber: 14,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "stylesheet",
                        href: "https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined"
                    }, void 0, false, {
                        fileName: "[project]/app/layout.js",
                        lineNumber: 19,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                        dangerouslySetInnerHTML: {
                            __html: `
                            (function () {
                                var RELOAD_GUARD_KEY = "__teamnoteChunkReloadInProgress";

                                function isLikelyHashedAssetFile(fileName) {
                                    return /^[a-f0-9]{8,}\\.(css|js)$/i.test(String(fileName || ""));
                                }

                                function isRecoverableAsset(url) {
                                    if (typeof url !== "string" || !url) return false;

                                    try {
                                        var parsed = new URL(url, window.location.origin);
                                        var pathname = parsed.pathname || "";

                                        if (
                                            pathname.indexOf("/_next/static/") !== -1 ||
                                            pathname.indexOf("/next/static/") !== -1
                                        ) {
                                            return true;
                                        }

                                        var parts = pathname.split("/");
                                        var fileName = parts[parts.length - 1] || "";
                                        return isLikelyHashedAssetFile(fileName);
                                    } catch {
                                        return false;
                                    }
                                }

                                function hardReloadWithCacheBust() {
                                    var url = new URL(window.location.href);
                                    url.searchParams.set("_r", Date.now().toString());
                                    var nextHref = url.toString();
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
                                            return true;
                                        }

                                        navigate();
                                        return true;
                                    } catch {
                                        navigate();
                                        return true;
                                    }
                                }

                                function triggerChunkRecovery() {
                                    if (window[RELOAD_GUARD_KEY]) return false;

                                    window[RELOAD_GUARD_KEY] = true;
                                    return hardReloadWithCacheBust();
                                }

                                window.addEventListener(
                                    "error",
                                    function (event) {
                                        var target = event && event.target;
                                        if (!target || (target.tagName !== "SCRIPT" && target.tagName !== "LINK")) return;

                                        var assetUrl =
                                            target.getAttribute("src") ||
                                            target.getAttribute("href") ||
                                            "";

                                        if (!isRecoverableAsset(assetUrl)) return;
                                        triggerChunkRecovery();
                                    },
                                    true
                                );

                                window.addEventListener("unhandledrejection", function (event) {
                                    var reason = event && event.reason;
                                    var message =
                                        (reason && (reason.message || reason.toString && reason.toString())) || "";

                                    if (typeof message !== "string") return;
                                    var normalized = message.toLowerCase();
                                    if (
                                        normalized.indexOf("chunkloaderror") === -1 &&
                                        normalized.indexOf("loading chunk") === -1 &&
                                        normalized.indexOf("failed to fetch dynamically imported module") === -1 &&
                                        normalized.indexOf("importing a module script failed") === -1 &&
                                        normalized.indexOf("/_next/static/") === -1 &&
                                        normalized.indexOf("/next/static/") === -1
                                    ) {
                                        return;
                                    }

                                    triggerChunkRecovery();
                                });

                                window.addEventListener("load", function () {
                                    var rootStyles = getComputedStyle(document.documentElement);
                                    var hasGlobalCss = String(
                                        rootStyles.getPropertyValue("--bg-primary") || ""
                                    ).trim().length > 0;

                                    if (!hasGlobalCss) {
                                        if (triggerChunkRecovery()) return;
                                    }
                                });
                            })();
                        `
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/layout.js",
                        lineNumber: 23,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/layout.js",
                lineNumber: 12,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
                suppressHydrationWarning: true,
                children: children
            }, void 0, false, {
                fileName: "[project]/app/layout.js",
                lineNumber: 173,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/layout.js",
        lineNumber: 11,
        columnNumber: 9
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-rsc] (ecmascript)").vendored['react-rsc'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
];

//# sourceMappingURL=_9b862e65._.js.map