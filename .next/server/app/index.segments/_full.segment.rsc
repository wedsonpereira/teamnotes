1:"$Sreact.fragment"
6:I[91731,["/_next/static/chunks/fe7cfb51055d8dd9.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"default"]
:HL["/_next/static/chunks/eba609184e1ce3d6.css","style"]
:HL["https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css","style",{"crossOrigin":"anonymous"}]
:HL["https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined","style"]
2:T1fa0,
                            (function () {
                                var RELOAD_GUARD_KEY = "__teamnoteChunkReloadInProgress";

                                function isLikelyHashedAssetFile(fileName) {
                                    return /^[a-f0-9]{8,}\.(css|js)$/i.test(String(fileName || ""));
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
                        0:{"P":null,"b":"gomAUTUTWW-Un1b45WgVx","c":["",""],"q":"","i":false,"f":[[["",{"children":["__PAGE__",{}]},"$undefined","$undefined",true],[["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/eba609184e1ce3d6.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","html",null,{"lang":"en","suppressHydrationWarning":true,"data-scroll-behavior":"smooth","children":[["$","head",null,{"children":[["$","link",null,{"rel":"icon","href":"/favicon.svg","type":"image/svg+xml"}],["$","link",null,{"rel":"stylesheet","href":"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css","crossOrigin":"anonymous"}],["$","link",null,{"rel":"stylesheet","href":"https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined"}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"$2"}}]]}],"$L3"]}]]}],{"children":["$L4",{},null,false,false]},null,false,false],"$L5",false]],"m":"$undefined","G":["$6",[]],"S":true}
7:I[39756,["/_next/static/chunks/fe7cfb51055d8dd9.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"default"]
8:I[37457,["/_next/static/chunks/fe7cfb51055d8dd9.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"default"]
9:I[47257,["/_next/static/chunks/fe7cfb51055d8dd9.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"ClientPageRoot"]
a:I[81694,["/_next/static/chunks/283f6a8f13227563.js"],"default"]
d:I[97367,["/_next/static/chunks/fe7cfb51055d8dd9.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"OutletBoundary"]
e:"$Sreact.suspense"
10:I[97367,["/_next/static/chunks/fe7cfb51055d8dd9.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"ViewportBoundary"]
12:I[97367,["/_next/static/chunks/fe7cfb51055d8dd9.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"MetadataBoundary"]
3:["$","body",null,{"suppressHydrationWarning":true,"children":["$","$L7",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L8",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}]
4:["$","$1","c",{"children":[["$","$L9",null,{"Component":"$a","serverProvidedParams":{"searchParams":{},"params":{},"promises":["$@b","$@c"]}}],[["$","script","script-0",{"src":"/_next/static/chunks/283f6a8f13227563.js","async":true,"nonce":"$undefined"}]],["$","$Ld",null,{"children":["$","$e",null,{"name":"Next.MetadataOutlet","children":"$@f"}]}]]}]
5:["$","$1","h",{"children":[null,["$","$L10",null,{"children":"$L11"}],["$","div",null,{"hidden":true,"children":["$","$L12",null,{"children":["$","$e",null,{"name":"Next.Metadata","children":"$L13"}]}]}],null]}]
b:{}
c:"$4:props:children:0:props:serverProvidedParams:params"
11:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
f:null
13:[["$","title","0",{"children":"TeamNotes — Collaborative Text Editor"}],["$","meta","1",{"name":"description","content":"Real-time collaborative text editor with room-based access. Create or join rooms to edit documents together."}]]
