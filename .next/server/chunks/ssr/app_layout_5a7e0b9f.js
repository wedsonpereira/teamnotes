module.exports=[62925,a=>{"use strict";var b=a.i(7997);function c({children:a}){return(0,b.jsxs)("html",{lang:"en",suppressHydrationWarning:!0,"data-scroll-behavior":"smooth",children:[(0,b.jsxs)("head",{children:[(0,b.jsx)("link",{rel:"icon",href:"/favicon.svg",type:"image/svg+xml"}),(0,b.jsx)("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",crossOrigin:"anonymous"}),(0,b.jsx)("link",{rel:"stylesheet",href:"https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined"}),(0,b.jsx)("script",{dangerouslySetInnerHTML:{__html:`
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
                        `}})]}),(0,b.jsx)("body",{suppressHydrationWarning:!0,children:a})]})}a.s(["default",()=>c,"metadata",0,{title:"TeamNotes — Collaborative Text Editor",description:"Real-time collaborative text editor with room-based access. Create or join rooms to edit documents together."}])}];

//# sourceMappingURL=app_layout_5a7e0b9f.js.map