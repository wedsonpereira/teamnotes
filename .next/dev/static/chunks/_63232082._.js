(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ResizableImage.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/core/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/react/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const DEFAULT_IMAGE_RENDER_WIDTH = 420;
/* ------------------------------------------------------------------ */ /*  ResizableImageView — React NodeView                                */ /*  Renders an <img> with corner drag handles for free-form resizing.  */ /* ------------------------------------------------------------------ */ function ResizableImageView({ node, updateAttributes, selected }) {
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const moveStateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const movePreviewRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [resizing, setResizing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [moving, setMoving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [movePreview, setMovePreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { src, alt, title, width, height, alignment, leadingSpace, offsetX, offsetY } = node.attrs;
    const leadingOffsetPx = Math.max(0, Number(leadingSpace || 0)) * 8;
    const baseOffsetX = Number.isFinite(Number(offsetX)) ? Number(offsetX) : 0;
    const baseOffsetY = Number.isFinite(Number(offsetY)) ? Number(offsetY) : 0;
    const activeOffsetX = movePreview && Number.isFinite(movePreview.x) ? movePreview.x : baseOffsetX;
    const activeOffsetY = movePreview && Number.isFinite(movePreview.y) ? movePreview.y : baseOffsetY;
    const commitMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ResizableImageView.useCallback[commitMove]": ()=>{
            const preview = movePreviewRef.current;
            if (!preview) return;
            updateAttributes({
                offsetX: preview.x,
                offsetY: preview.y
            });
        }
    }["ResizableImageView.useCallback[commitMove]"], [
        updateAttributes
    ]);
    const updateMovePreview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ResizableImageView.useCallback[updateMovePreview]": (x, y)=>{
            const next = {
                x: Math.round(x),
                y: Math.round(y)
            };
            movePreviewRef.current = next;
            setMovePreview(next);
        }
    }["ResizableImageView.useCallback[updateMovePreview]"], []);
    const startMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ResizableImageView.useCallback[startMove]": (clientX, clientY)=>{
            moveStateRef.current = {
                startClientX: clientX,
                startClientY: clientY,
                startOffsetX: baseOffsetX,
                startOffsetY: baseOffsetY
            };
            setMoving(true);
            updateMovePreview(baseOffsetX, baseOffsetY);
            const onMouseMove = {
                "ResizableImageView.useCallback[startMove].onMouseMove": (moveEvent)=>{
                    const state = moveStateRef.current;
                    if (!state) return;
                    updateMovePreview(state.startOffsetX + (moveEvent.clientX - state.startClientX), state.startOffsetY + (moveEvent.clientY - state.startClientY));
                }
            }["ResizableImageView.useCallback[startMove].onMouseMove"];
            const onMouseUp = {
                "ResizableImageView.useCallback[startMove].onMouseUp": ()=>{
                    setMoving(false);
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);
                    moveStateRef.current = null;
                    commitMove();
                }
            }["ResizableImageView.useCallback[startMove].onMouseUp"];
            const onTouchMove = {
                "ResizableImageView.useCallback[startMove].onTouchMove": (moveEvent)=>{
                    if (moveEvent.touches.length !== 1) return;
                    const state = moveStateRef.current;
                    if (!state) return;
                    moveEvent.preventDefault();
                    const t = moveEvent.touches[0];
                    updateMovePreview(state.startOffsetX + (t.clientX - state.startClientX), state.startOffsetY + (t.clientY - state.startClientY));
                }
            }["ResizableImageView.useCallback[startMove].onTouchMove"];
            const onTouchEnd = {
                "ResizableImageView.useCallback[startMove].onTouchEnd": ()=>{
                    setMoving(false);
                    document.removeEventListener("touchmove", onTouchMove);
                    document.removeEventListener("touchend", onTouchEnd);
                    moveStateRef.current = null;
                    commitMove();
                }
            }["ResizableImageView.useCallback[startMove].onTouchEnd"];
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
            document.addEventListener("touchmove", onTouchMove, {
                passive: false
            });
            document.addEventListener("touchend", onTouchEnd);
        }
    }["ResizableImageView.useCallback[startMove]"], [
        baseOffsetX,
        baseOffsetY,
        commitMove,
        updateMovePreview
    ]);
    const onResizeMouseDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ResizableImageView.useCallback[onResizeMouseDown]": (corner, e)=>{
            e.preventDefault();
            e.stopPropagation();
            const img = containerRef.current?.querySelector("img");
            if (!img) return;
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = img.offsetWidth;
            const startHeight = img.offsetHeight;
            const aspectRatio = startWidth / startHeight;
            setResizing(true);
            const onMouseMove = {
                "ResizableImageView.useCallback[onResizeMouseDown].onMouseMove": (moveEvent)=>{
                    let dx = moveEvent.clientX - startX;
                    let dy = moveEvent.clientY - startY;
                    // Flip direction for left-side corners
                    if (corner === "top-left" || corner === "bottom-left") {
                        dx = -dx;
                    }
                    if (corner === "top-left" || corner === "top-right") {
                        dy = -dy;
                    }
                    // Use the larger delta to maintain aspect ratio
                    const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy;
                    let newWidth = Math.max(50, startWidth + delta);
                    let newHeight = Math.round(newWidth / aspectRatio);
                    updateAttributes({
                        width: newWidth,
                        height: newHeight
                    });
                }
            }["ResizableImageView.useCallback[onResizeMouseDown].onMouseMove"];
            const onMouseUp = {
                "ResizableImageView.useCallback[onResizeMouseDown].onMouseUp": ()=>{
                    setResizing(false);
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);
                }
            }["ResizableImageView.useCallback[onResizeMouseDown].onMouseUp"];
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        }
    }["ResizableImageView.useCallback[onResizeMouseDown]"], [
        updateAttributes
    ]);
    // Touch support for mobile
    const onResizeTouchStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ResizableImageView.useCallback[onResizeTouchStart]": (corner, e)=>{
            if (e.touches.length !== 1) return;
            e.preventDefault();
            e.stopPropagation();
            const img = containerRef.current?.querySelector("img");
            if (!img) return;
            const touch = e.touches[0];
            const startX = touch.clientX;
            const startY = touch.clientY;
            const startWidth = img.offsetWidth;
            const startHeight = img.offsetHeight;
            const aspectRatio = startWidth / startHeight;
            setResizing(true);
            const onTouchMove = {
                "ResizableImageView.useCallback[onResizeTouchStart].onTouchMove": (moveEvent)=>{
                    if (moveEvent.touches.length !== 1) return;
                    const t = moveEvent.touches[0];
                    let dx = t.clientX - startX;
                    let dy = t.clientY - startY;
                    if (corner === "top-left" || corner === "bottom-left") dx = -dx;
                    if (corner === "top-left" || corner === "top-right") dy = -dy;
                    const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy;
                    let newWidth = Math.max(50, startWidth + delta);
                    let newHeight = Math.round(newWidth / aspectRatio);
                    updateAttributes({
                        width: newWidth,
                        height: newHeight
                    });
                }
            }["ResizableImageView.useCallback[onResizeTouchStart].onTouchMove"];
            const onTouchEnd = {
                "ResizableImageView.useCallback[onResizeTouchStart].onTouchEnd": ()=>{
                    setResizing(false);
                    document.removeEventListener("touchmove", onTouchMove);
                    document.removeEventListener("touchend", onTouchEnd);
                }
            }["ResizableImageView.useCallback[onResizeTouchStart].onTouchEnd"];
            document.addEventListener("touchmove", onTouchMove, {
                passive: false
            });
            document.addEventListener("touchend", onTouchEnd);
        }
    }["ResizableImageView.useCallback[onResizeTouchStart]"], [
        updateAttributes
    ]);
    const onImageMouseDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ResizableImageView.useCallback[onImageMouseDown]": (e)=>{
            if (!selected || resizing || e.button !== 0) return;
            e.preventDefault();
            e.stopPropagation();
            startMove(e.clientX, e.clientY);
        }
    }["ResizableImageView.useCallback[onImageMouseDown]"], [
        resizing,
        selected,
        startMove
    ]);
    const onImageTouchStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ResizableImageView.useCallback[onImageTouchStart]": (e)=>{
            if (!selected || resizing || e.touches.length !== 1) return;
            e.preventDefault();
            e.stopPropagation();
            const touch = e.touches[0];
            startMove(touch.clientX, touch.clientY);
        }
    }["ResizableImageView.useCallback[onImageTouchStart]"], [
        resizing,
        selected,
        startMove
    ]);
    const corners = [
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right"
    ];
    const wrapperStyle = {
        ...leadingOffsetPx ? {
            marginLeft: `${leadingOffsetPx}px`
        } : {},
        ...activeOffsetX || activeOffsetY ? {
            transform: `translate(${activeOffsetX}px, ${activeOffsetY}px)`
        } : {},
        ...moving ? {
            zIndex: 20
        } : {}
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["NodeViewWrapper"], {
        as: "span",
        className: `resizable-image-wrapper ${alignment || "center"} ${selected ? "selected" : ""} ${resizing ? "resizing" : ""} ${moving ? "moving" : ""}`,
        style: wrapperStyle,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "resizable-image-container",
            ref: containerRef,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: src,
                    alt: alt || "",
                    title: title || "",
                    onMouseDown: onImageMouseDown,
                    onTouchStart: onImageTouchStart,
                    style: {
                        width: width ? `${width}px` : `min(${DEFAULT_IMAGE_RENDER_WIDTH}px, 100%)`,
                        height: height ? `${height}px` : "auto",
                        maxWidth: "100%"
                    },
                    draggable: false
                }, void 0, false, {
                    fileName: "[project]/components/ResizableImage.js",
                    lineNumber: 256,
                    columnNumber: 17
                }, this),
                selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: corners.map((corner)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `resize-handle ${corner}`,
                            onMouseDown: (e)=>onResizeMouseDown(corner, e),
                            onTouchStart: (e)=>onResizeTouchStart(corner, e)
                        }, corner, false, {
                            fileName: "[project]/components/ResizableImage.js",
                            lineNumber: 274,
                            columnNumber: 29
                        }, this))
                }, void 0, false)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ResizableImage.js",
            lineNumber: 255,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ResizableImage.js",
        lineNumber: 250,
        columnNumber: 9
    }, this);
}
_s(ResizableImageView, "kUGKD/gftWtL+sqGONhKCioOimA=");
_c = ResizableImageView;
/* ------------------------------------------------------------------ */ /*  ResizableImage — TipTap Node Extension                             */ /* ------------------------------------------------------------------ */ const ResizableImage = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Node"].create({
    name: "image",
    group: "block",
    atom: true,
    draggable: true,
    marks: "",
    addAttributes () {
        return {
            src: {
                default: null
            },
            alt: {
                default: null
            },
            title: {
                default: null
            },
            width: {
                default: null
            },
            height: {
                default: null
            },
            alignment: {
                default: "center"
            },
            leadingSpace: {
                default: 0,
                parseHTML: (element)=>{
                    const raw = element.getAttribute("data-leading-space");
                    const parsed = Number.parseInt(String(raw || "0"), 10);
                    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
                },
                renderHTML: (attrs)=>attrs.leadingSpace > 0 ? {
                        "data-leading-space": String(attrs.leadingSpace)
                    } : {}
            },
            offsetX: {
                default: 0,
                parseHTML: (element)=>{
                    const raw = element.getAttribute("data-offset-x");
                    const parsed = Number.parseInt(String(raw || "0"), 10);
                    return Number.isFinite(parsed) ? parsed : 0;
                },
                renderHTML: (attrs)=>attrs.offsetX ? {
                        "data-offset-x": String(attrs.offsetX)
                    } : {}
            },
            offsetY: {
                default: 0,
                parseHTML: (element)=>{
                    const raw = element.getAttribute("data-offset-y");
                    const parsed = Number.parseInt(String(raw || "0"), 10);
                    return Number.isFinite(parsed) ? parsed : 0;
                },
                renderHTML: (attrs)=>attrs.offsetY ? {
                        "data-offset-y": String(attrs.offsetY)
                    } : {}
            }
        };
    },
    parseHTML () {
        return [
            {
                tag: "img[src]"
            }
        ];
    },
    renderHTML ({ HTMLAttributes }) {
        return [
            "img",
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeAttributes"])(HTMLAttributes, {
                style: [
                    HTMLAttributes.width ? `width: ${HTMLAttributes.width}px` : "",
                    HTMLAttributes.height ? `height: ${HTMLAttributes.height}px` : "",
                    HTMLAttributes.offsetX || HTMLAttributes.offsetY ? `transform: translate(${Number(HTMLAttributes.offsetX || 0)}px, ${Number(HTMLAttributes.offsetY || 0)}px)` : ""
                ].filter(Boolean).join("; ")
            })
        ];
    },
    addNodeView () {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ReactNodeViewRenderer"])(ResizableImageView);
    },
    addCommands () {
        return {
            setImage: (attrs)=>({ commands })=>{
                    return commands.insertContent({
                        type: this.name,
                        attrs
                    });
                }
        };
    }
});
const __TURBOPACK__default__export__ = ResizableImage;
var _c;
__turbopack_context__.k.register(_c, "ResizableImageView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/FileAttachment.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/core/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/react/dist/index.js [app-client] (ecmascript) <locals>");
"use client";
;
;
;
/* ------------------------------------------------------------------ */ /*  File icon helper                                                    */ /* ------------------------------------------------------------------ */ function getFileIcon(mimeType, fileName) {
    if (!mimeType && !fileName) return "fa-solid fa-file";
    const ext = (fileName || "").split(".").pop()?.toLowerCase();
    const mime = (mimeType || "").toLowerCase();
    if (mime.startsWith("application/pdf") || ext === "pdf") return "fa-solid fa-file-pdf";
    if (mime.includes("word") || mime.includes("document") || ext === "doc" || ext === "docx") return "fa-solid fa-file-word";
    if (mime.includes("sheet") || mime.includes("excel") || ext === "xls" || ext === "xlsx" || ext === "csv") return "fa-solid fa-file-excel";
    if (mime.includes("presentation") || mime.includes("powerpoint") || ext === "ppt" || ext === "pptx") return "fa-solid fa-file-powerpoint";
    if (mime.startsWith("text/") || ext === "txt" || ext === "md") return "fa-solid fa-file-lines";
    if (mime.includes("zip") || mime.includes("compressed") || mime.includes("archive") || ext === "zip" || ext === "rar" || ext === "7z" || ext === "tar" || ext === "gz") return "fa-solid fa-file-zipper";
    if (mime.startsWith("audio/")) return "fa-solid fa-file-audio";
    if (mime.startsWith("video/")) return "fa-solid fa-file-video";
    if (ext === "js" || ext === "ts" || ext === "py" || ext === "java" || ext === "html" || ext === "css" || ext === "json" || ext === "xml") return "fa-solid fa-file-code";
    return "fa-solid fa-file";
}
function formatFileSize(bytes) {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function formatTimestamp(value) {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleString();
}
/* ------------------------------------------------------------------ */ /*  FileAttachmentView — React NodeView                                */ /* ------------------------------------------------------------------ */ function FileAttachmentView({ node, selected }) {
    const { src, fileName, fileSize, mimeType, addedBy, addedByColor, addedAt } = node.attrs;
    const icon = getFileIcon(mimeType, fileName);
    const size = formatFileSize(fileSize);
    const addedAtText = formatTimestamp(addedAt);
    const handleDownload = (event)=>{
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (!src) return;
        const a = document.createElement("a");
        a.href = src;
        a.download = fileName || "download";
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["NodeViewWrapper"], {
        as: "span",
        className: `file-attachment ${selected ? "selected" : ""}`,
        "data-drag-handle": true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "file-attachment-card",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "file-attachment-icon",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: icon
                    }, void 0, false, {
                        fileName: "[project]/components/FileAttachment.js",
                        lineNumber: 116,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/FileAttachment.js",
                    lineNumber: 115,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "file-attachment-info",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "file-attachment-name",
                            children: fileName || "Unknown file"
                        }, void 0, false, {
                            fileName: "[project]/components/FileAttachment.js",
                            lineNumber: 119,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "file-attachment-meta",
                            children: [
                                size && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: size
                                }, void 0, false, {
                                    fileName: "[project]/components/FileAttachment.js",
                                    lineNumber: 123,
                                    columnNumber: 34
                                }, this),
                                addedBy && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "file-attachment-author",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "file-attachment-author-dot",
                                            style: addedByColor ? {
                                                background: addedByColor
                                            } : undefined
                                        }, void 0, false, {
                                            fileName: "[project]/components/FileAttachment.js",
                                            lineNumber: 126,
                                            columnNumber: 33
                                        }, this),
                                        "Added by ",
                                        addedBy,
                                        addedAtText ? ` • ${addedAtText}` : ""
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/FileAttachment.js",
                                    lineNumber: 125,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/FileAttachment.js",
                            lineNumber: 122,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/FileAttachment.js",
                    lineNumber: 118,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    className: "file-attachment-download",
                    onMouseDown: (event)=>event.stopPropagation(),
                    onClick: handleDownload,
                    title: fileName ? `Download ${fileName}` : "Download file",
                    "aria-label": fileName ? `Download ${fileName}` : "Download file",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fa-solid fa-download"
                    }, void 0, false, {
                        fileName: "[project]/components/FileAttachment.js",
                        lineNumber: 144,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/FileAttachment.js",
                    lineNumber: 136,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/FileAttachment.js",
            lineNumber: 114,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/FileAttachment.js",
        lineNumber: 109,
        columnNumber: 9
    }, this);
}
_c = FileAttachmentView;
/* ------------------------------------------------------------------ */ /*  FileAttachment — TipTap Node Extension                             */ /* ------------------------------------------------------------------ */ const FileAttachment = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Node"].create({
    name: "fileAttachment",
    group: "block",
    atom: true,
    draggable: true,
    marks: "",
    addAttributes () {
        return {
            src: {
                default: null
            },
            fileName: {
                default: null
            },
            fileSize: {
                default: null
            },
            mimeType: {
                default: null
            },
            addedBy: {
                default: null,
                parseHTML: (el)=>el.getAttribute("data-added-by"),
                renderHTML: (attrs)=>attrs.addedBy ? {
                        "data-added-by": attrs.addedBy
                    } : {}
            },
            addedByColor: {
                default: null,
                parseHTML: (el)=>el.getAttribute("data-added-by-color"),
                renderHTML: (attrs)=>attrs.addedByColor ? {
                        "data-added-by-color": attrs.addedByColor
                    } : {}
            },
            addedAt: {
                default: null,
                parseHTML: (el)=>el.getAttribute("data-added-at"),
                renderHTML: (attrs)=>attrs.addedAt ? {
                        "data-added-at": attrs.addedAt
                    } : {}
            }
        };
    },
    parseHTML () {
        return [
            {
                tag: 'div[data-file-attachment]'
            },
            {
                tag: 'span[data-file-attachment]'
            }
        ];
    },
    renderHTML ({ HTMLAttributes }) {
        const extraAttrs = {};
        if (HTMLAttributes.addedBy) extraAttrs["data-added-by"] = HTMLAttributes.addedBy;
        if (HTMLAttributes.addedByColor) extraAttrs["data-added-by-color"] = HTMLAttributes.addedByColor;
        if (HTMLAttributes.addedAt) extraAttrs["data-added-at"] = HTMLAttributes.addedAt;
        return [
            "span",
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeAttributes"])(HTMLAttributes, {
                "data-file-attachment": "",
                class: "file-attachment-card",
                ...extraAttrs
            }),
            HTMLAttributes.fileName || "File"
        ];
    },
    addNodeView () {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ReactNodeViewRenderer"])(FileAttachmentView);
    },
    addCommands () {
        return {
            setFileAttachment: (attrs)=>({ commands })=>{
                    return commands.insertContent({
                        type: this.name,
                        attrs
                    });
                }
        };
    }
});
const __TURBOPACK__default__export__ = FileAttachment;
var _c;
__turbopack_context__.k.register(_c, "FileAttachmentView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/crypto.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decrypt",
    ()=>decrypt,
    "decryptFromBase64",
    ()=>decryptFromBase64,
    "encrypt",
    ()=>encrypt,
    "encryptToBase64",
    ()=>encryptToBase64
]);
/**
 * AES-256-GCM Client-Side Encryption Module
 * Zero-knowledge: server never sees plaintext or the room key.
 *
 * Format: base64( salt(16) + iv(12) + ciphertext + authTag(16) )
 *
 * Uses Web Crypto API (works in browsers and Node 20+).
 */ const SALT_LEN = 16;
const IV_LEN = 12;
const PBKDF2_ITERATIONS = 100_000;
/**
 * Derive an AES-256-GCM key from a room key string.
 */ async function deriveKey(roomKey, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(roomKey), "PBKDF2", false, [
        "deriveKey"
    ]);
    return crypto.subtle.deriveKey({
        name: "PBKDF2",
        salt,
        iterations: PBKDF2_ITERATIONS,
        hash: "SHA-256"
    }, keyMaterial, {
        name: "AES-GCM",
        length: 256
    }, false, [
        "encrypt",
        "decrypt"
    ]);
}
async function encrypt(data, roomKey) {
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN));
    const iv = crypto.getRandomValues(new Uint8Array(IV_LEN));
    const key = await deriveKey(roomKey, salt);
    const ciphertext = await crypto.subtle.encrypt({
        name: "AES-GCM",
        iv
    }, key, data);
    // Combine: salt + iv + ciphertext (includes auth tag)
    const result = new Uint8Array(SALT_LEN + IV_LEN + ciphertext.byteLength);
    result.set(salt, 0);
    result.set(iv, SALT_LEN);
    result.set(new Uint8Array(ciphertext), SALT_LEN + IV_LEN);
    return result;
}
async function decrypt(encryptedData, roomKey) {
    const salt = encryptedData.slice(0, SALT_LEN);
    const iv = encryptedData.slice(SALT_LEN, SALT_LEN + IV_LEN);
    const ciphertext = encryptedData.slice(SALT_LEN + IV_LEN);
    const key = await deriveKey(roomKey, salt);
    const plaintext = await crypto.subtle.decrypt({
        name: "AES-GCM",
        iv
    }, key, ciphertext);
    return new Uint8Array(plaintext);
}
async function encryptToBase64(compressedBytes, roomKey) {
    const encrypted = await encrypt(compressedBytes, roomKey);
    // Convert to base64
    let binary = "";
    for(let i = 0; i < encrypted.length; i++){
        binary += String.fromCharCode(encrypted[i]);
    }
    return btoa(binary);
}
async function decryptFromBase64(base64String, roomKey) {
    const binary = atob(base64String);
    const bytes = new Uint8Array(binary.length);
    for(let i = 0; i < binary.length; i++){
        bytes[i] = binary.charCodeAt(i);
    }
    return decrypt(bytes, roomKey);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Editor.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Editor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/react/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/core/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$pm$2f$dist$2f$state$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/pm/dist/state/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/prosemirror-state/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$pm$2f$dist$2f$model$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/pm/dist/model/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/prosemirror-model/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$pm$2f$dist$2f$transform$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/pm/dist/transform/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prosemirror$2d$transform$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/prosemirror-transform/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$starter$2d$kit$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/starter-kit/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResizableImage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ResizableImage.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FileAttachment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/FileAttachment.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$placeholder$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-placeholder/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$collaboration$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-collaboration/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$text$2d$style$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-text-style/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$color$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-color/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$highlight$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-highlight/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$paragraph$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-paragraph/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/yjs/dist/yjs.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pako$2f$dist$2f$pako$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pako/dist/pako.esm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$crypto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/crypto.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
/* ------------------------------------------------------------------ */ /*  AuthorHighlight Mark                                               */ /*  Stores author name + color per text span, rendered as a colored    */ /*  underline with a hover tooltip showing the author name.            */ /* ------------------------------------------------------------------ */ const AuthorHighlight = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mark"].create({
    name: "authorHighlight",
    // Keep multiple author marks from different users side-by-side
    // but only one per text range.
    excludes: "authorHighlight",
    addAttributes () {
        return {
            color: {
                default: null,
                parseHTML: (el)=>el.getAttribute("data-author-color"),
                renderHTML: (attrs)=>attrs.color ? {
                        "data-author-color": attrs.color
                    } : {}
            },
            name: {
                default: null,
                parseHTML: (el)=>el.getAttribute("data-author-name"),
                renderHTML: (attrs)=>attrs.name ? {
                        "data-author-name": attrs.name
                    } : {}
            }
        };
    },
    parseHTML () {
        return [
            {
                tag: "span[data-author-name]"
            }
        ];
    },
    renderHTML ({ HTMLAttributes }) {
        const color = HTMLAttributes["data-author-color"] || "transparent";
        return [
            "span",
            {
                ...HTMLAttributes,
                class: "author-highlight",
                style: `border-bottom-color: ${color}`
            },
            0
        ];
    }
});
const ParagraphWithSpacing = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$paragraph$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].extend({
    addAttributes () {
        return {
            ...this.parent?.() || {},
            lineHeight: {
                default: null,
                parseHTML: (element)=>element.getAttribute("data-line-height"),
                renderHTML: (attrs)=>attrs.lineHeight ? {
                        "data-line-height": String(attrs.lineHeight)
                    } : {}
            },
            noSpaceAfter: {
                default: true,
                parseHTML: (element)=>{
                    const raw = element.getAttribute("data-no-space-after");
                    if (raw === null) return true;
                    return raw === "true";
                },
                renderHTML: (attrs)=>({
                        "data-no-space-after": attrs.noSpaceAfter ? "true" : "false"
                    })
            }
        };
    }
});
/* ------------------------------------------------------------------ */ /*  Author Track Plugin Key                                            */ /* ------------------------------------------------------------------ */ const authorTrackKey = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PluginKey"]("authorTrack");
const REMOTE_SOCKET_ORIGIN = "socket-remote";
const TYPING_STATUS_THROTTLE_MS = 80;
const DEFAULT_HIGHLIGHT_COLOR = "#fff59d";
const IMAGE_DRAG_MIME = "application/x-teamnote-image-pos";
const IMAGE_DRAG_FALLBACK_KEY = "__teamnoteImageDragPos";
const MENU_FONT_SIZES = [
    "default",
    "12",
    "14",
    "16",
    "18",
    "20",
    "24",
    "28",
    "32"
];
const MENU_LINE_SPACING_OPTIONS = [
    {
        label: "Default",
        value: "default"
    },
    {
        label: "Single (1.0)",
        value: "1"
    },
    {
        label: "1.15",
        value: "1.15"
    },
    {
        label: "1.5",
        value: "1.5"
    },
    {
        label: "Double (2.0)",
        value: "2"
    }
];
const MENU_HIGHLIGHT_COLORS = [
    "#fff59d",
    "#ffd54f",
    "#ffccbc",
    "#f8bbd0",
    "#d1c4e9",
    "#b2dfdb",
    "#c5e1a5",
    "#bbdefb"
];
function isLocalEditorDocTransaction(transaction) {
    if (!transaction) return false;
    if (transaction.getMeta("remote")) return false;
    const ySyncMeta = transaction.getMeta("y-sync$");
    const isRemoteYjsOrigin = Boolean(ySyncMeta) && typeof ySyncMeta === "object" && ySyncMeta.isChangeOrigin === true;
    if (isRemoteYjsOrigin) return false;
    return true;
}
function getInsertPosAfterSelectedMediaSelection(selection) {
    const selectedNode = selection?.node;
    if (!selectedNode) return null;
    const selectedNodeType = selectedNode.type?.name;
    if (selectedNodeType !== "image" && selectedNodeType !== "fileAttachment") {
        return null;
    }
    return selection.to;
}
function getInsertPosAfterSelectedMediaNode(editorInstance) {
    return getInsertPosAfterSelectedMediaSelection(editorInstance?.state?.selection);
}
function parseIntSafe(value) {
    const parsed = Number.parseInt(String(value ?? ""), 10);
    return Number.isInteger(parsed) ? parsed : null;
}
function readDraggedImagePosFromEvent(event) {
    const fromTransfer = parseIntSafe(event?.dataTransfer?.getData(IMAGE_DRAG_MIME));
    if (fromTransfer !== null) return fromTransfer;
    if ("TURBOPACK compile-time truthy", 1) {
        const fromWindow = parseIntSafe(window[IMAGE_DRAG_FALLBACK_KEY]);
        if (fromWindow !== null) return fromWindow;
    }
    return null;
}
function clearDraggedImagePos() {
    if ("TURBOPACK compile-time truthy", 1) {
        delete window[IMAGE_DRAG_FALLBACK_KEY];
    }
}
function getDropPosNearTargetImage(view, event) {
    if (!event?.target || typeof view?.posAtDOM !== "function") return null;
    const targetEl = typeof event.target.closest === "function" ? event.target.closest(".resizable-image-wrapper") : null;
    if (!targetEl) return null;
    try {
        const targetPos = view.posAtDOM(targetEl, 0);
        const targetNode = view.state.doc.nodeAt(targetPos);
        if (targetNode?.type?.name !== "image") return null;
        const rect = targetEl.getBoundingClientRect();
        const placeAfter = event.clientX >= rect.left + rect.width / 2;
        return placeAfter ? targetPos + targetNode.nodeSize : targetPos;
    } catch  {
        return null;
    }
}
/* ------------------------------------------------------------------ */ /*  createAuthorTrackExtension                                         */ /*  ProseMirror plugin that automatically marks every locally-typed    */ /*  character with the current user's identity — like Google Docs      */ /*  authorship tracking.                                               */ /*                                                                     */ /*  Strategy:                                                          */ /*   1. appendTransaction detects local doc changes, finds the         */ /*      inserted text ranges via step maps, maps them to the final     */ /*      document, and applies the authorHighlight mark.                */ /*   2. Also keeps storedMarks primed so the NEXT character typed      */ /*      gets the mark even if appendTransaction can't retroactively    */ /*      catch it (e.g. composition/IME input).                         */ /* ------------------------------------------------------------------ */ function createAuthorTrackExtension(authorName, authorColor) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Extension"].create({
        name: "authorTrack",
        addProseMirrorPlugins () {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Plugin"]({
                    key: authorTrackKey,
                    appendTransaction (transactions, oldState, newState) {
                        try {
                            const markType = newState.schema.marks.authorHighlight;
                            if (!markType) return null;
                            /* ---- detect local doc-changing transactions ---- */ const isTrackedLocalTransaction = (tr)=>{
                                const ySyncMeta = tr.getMeta("y-sync$");
                                const isChangeOrigin = Boolean(ySyncMeta) && typeof ySyncMeta === "object" && ySyncMeta.isChangeOrigin === true;
                                if (tr.getMeta("remote") || tr.getMeta("authorTrack")) {
                                    return false;
                                }
                                // Ignore only true Yjs-origin transactions (remote/applyUpdate).
                                // Local user input (including paste) may still carry y-sync$
                                // bookkeeping meta, and should still be attributed.
                                if (isChangeOrigin) {
                                    return false;
                                }
                                return true;
                            };
                            const localDocTrs = transactions.filter((tr)=>tr.docChanged && isTrackedLocalTransaction(tr));
                            /* ---- bail out when inserted slices contain atom nodes ---- */ /* Inserting atom nodes (images/file attachments/etc.) must not */ /* trigger addMark from this plugin, or collaborative state can */ /* occasionally lose that atom insertion under heavy sync load. */ if (localDocTrs.length) {
                                const fragmentHasAtomNode = (fragment)=>{
                                    let hasAtomNode = false;
                                    fragment.forEach((node)=>{
                                        if (hasAtomNode) return;
                                        if (node.isAtom) {
                                            hasAtomNode = true;
                                            return;
                                        }
                                        if (node.content?.size > 0) {
                                            hasAtomNode = fragmentHasAtomNode(node.content);
                                        }
                                    });
                                    return hasAtomNode;
                                };
                                let hasInsertedAtomNode = false;
                                for (const t of localDocTrs){
                                    for(let i = 0; i < t.steps.length; i++){
                                        const step = t.steps[i];
                                        const slice = step.slice;
                                        if (slice && slice.content && slice.content.size > 0) {
                                            hasInsertedAtomNode = fragmentHasAtomNode(slice.content);
                                        }
                                    }
                                    if (hasInsertedAtomNode) break;
                                }
                                if (hasInsertedAtomNode) return null;
                            }
                            const hasLocalActivity = transactions.some((tr)=>isTrackedLocalTransaction(tr));
                            const authorMark = markType.create({
                                color: authorColor,
                                name: authorName
                            });
                            const tr = newState.tr;
                            let changed = false;
                            const addAuthorMarkToRange = (from, to)=>{
                                const docSize = newState.doc.content.size;
                                const safeFrom = Math.max(0, Math.min(from, docSize));
                                const safeTo = Math.max(0, Math.min(to, docSize));
                                if (safeTo <= safeFrom) return;
                                newState.doc.nodesBetween(safeFrom, safeTo, (node, pos)=>{
                                    if (node.isAtom) return false;
                                    if (node.isLeaf && !node.isText) return false;
                                    if (!node.isText) return;
                                    const textFrom = Math.max(safeFrom, pos);
                                    const textTo = Math.min(safeTo, pos + node.nodeSize);
                                    if (textTo <= textFrom) return;
                                    tr.addMark(textFrom, textTo, authorMark);
                                    changed = true;
                                });
                            };
                            /* ---- retroactively mark inserted text ---- */ if (localDocTrs.length) {
                                const allMaps = [];
                                const localStepIndices = new Set();
                                let idx = 0;
                                for (const t of transactions){
                                    const isLocal = localDocTrs.includes(t);
                                    for(let i = 0; i < t.steps.length; i++, idx++){
                                        allMaps.push(t.steps[i].getMap());
                                        if (isLocal) localStepIndices.add(idx);
                                    }
                                }
                                idx = 0;
                                for (const t of transactions){
                                    for(let i = 0; i < t.steps.length; i++, idx++){
                                        if (!localStepIndices.has(idx)) continue;
                                        t.steps[i].getMap().forEach((_oldStart, _oldEnd, newStart, newEnd)=>{
                                            if (newEnd <= newStart) return;
                                            let from = newStart;
                                            let to = newEnd;
                                            for(let j = idx + 1; j < allMaps.length; j++){
                                                from = allMaps[j].map(from, 1);
                                                to = allMaps[j].map(to, -1);
                                            }
                                            addAuthorMarkToRange(from, to);
                                        });
                                    }
                                }
                                // Fallback for paste/import transactions where
                                // step-map range detection can miss inserted
                                // text spans. Diff is calculated in newState
                                // coordinates.
                                if (!changed) {
                                    const diffStart = newState.doc.content.findDiffStart(oldState.doc.content);
                                    if (typeof diffStart === "number") {
                                        const diffEnd = newState.doc.content.findDiffEnd(oldState.doc.content);
                                        const diffTo = diffEnd ? diffEnd.a : newState.doc.content.size;
                                        addAuthorMarkToRange(diffStart, diffTo);
                                    }
                                }
                            }
                            /* ---- keep storedMarks primed for next input ---- */ if (hasLocalActivity && newState.selection.empty) {
                                const currentMarks = newState.storedMarks || newState.selection.$from.marks();
                                const existing = currentMarks.find((m)=>m.type === markType);
                                if (!existing || existing.attrs.color !== authorColor || existing.attrs.name !== authorName) {
                                    const others = currentMarks.filter((m)=>m.type !== markType);
                                    tr.setStoredMarks([
                                        ...others,
                                        authorMark
                                    ]);
                                    changed = true;
                                }
                            }
                            if (!changed) return null;
                            tr.setMeta("authorTrack", true);
                            return tr;
                        } catch (err) {
                            console.warn("[authorTrack] appendTransaction error:", err);
                            return null;
                        }
                    }
                })
            ];
        }
    });
}
function decodeBase64Bytes(input) {
    const binary = atob(input);
    const bytes = new Uint8Array(binary.length);
    for(let i = 0; i < binary.length; i++){
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}
function decodeStoredContent(input) {
    if (typeof input !== "string") {
        throw new Error("Invalid stored content format.");
    }
    const trimmed = input.trim();
    if (!trimmed) {
        throw new Error("Stored content is empty.");
    }
    // Legacy fallback: comma-separated byte values.
    if (/^\d+(,\d+)*$/.test(trimmed)) {
        return Uint8Array.from(trimmed.split(",").map((value)=>{
            const parsed = Number(value);
            if (!Number.isInteger(parsed) || parsed < 0 || parsed > 255) {
                throw new Error("Invalid byte value in legacy payload.");
            }
            return parsed;
        }));
    }
    return decodeBase64Bytes(trimmed);
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
            return Uint8Array.from(trimmed.split(",").map((value)=>Number.parseInt(value, 10)));
        }
        try {
            return decodeBase64Bytes(trimmed);
        } catch  {
            return null;
        }
    }
    if (typeof input === "object") {
        if (Array.isArray(input.data)) {
            return Uint8Array.from(input.data);
        }
        if (typeof input.base64 === "string") {
            try {
                return decodeBase64Bytes(input.base64);
            } catch  {
                return null;
            }
        }
    }
    return null;
}
function isImageFile(file) {
    return Boolean(file && typeof file.type === "string" && file.type.startsWith("image/"));
}
function readFileAsDataUrl(file) {
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onload = ()=>resolve(String(reader.result || ""));
        reader.onerror = ()=>reject(new Error("Failed to read file."));
        reader.readAsDataURL(file);
    });
}
function normalizeFontSize(value) {
    if (!value) return "default";
    const parsed = String(value).replace("px", "").trim();
    return parsed || "default";
}
// Maximum file size: 5 MB (stored as base64 in Yjs doc)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const DEFAULT_IMAGE_INSERT_WIDTH = 420;
function Editor({ socket, roomId, pageId, userId, userName, userColor, roomKey, onContentChange, onSessionExpired, editorBg, fontColor, showLineNumbers = false, onChangeShowLineNumbers, externalYDoc }) {
    _s();
    const saveTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const ydocRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const providerReadyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const initialContentLoadedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const userInteractedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const ydocActivityRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const typingTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const typingRafRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastTypingEmitRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const editorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const savedSelectionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const contextMenuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [showContextMenu, setShowContextMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [contextMenuPosition, setContextMenuPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        top: 0,
        left: 0
    });
    const [activeFontSize, setActiveFontSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("default");
    const [activeLineSpacing, setActiveLineSpacing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("default");
    const [activeNoSpaceAfter, setActiveNoSpaceAfter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [activeHighlightColor, setActiveHighlightColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_HIGHLIGHT_COLOR);
    // Use an externally-cached Yjs document when provided so that
    // switching back to a previously-visited page is instant (the
    // document already contains the full editing state).
    if (!ydocRef.current) {
        ydocRef.current = externalYDoc || new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Doc"]();
    }
    const ydoc = ydocRef.current;
    // Insert files (images + non-image attachments) using TipTap commands
    // so block-node schema constraints are handled automatically.
    const insertFiles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Editor.useCallback[insertFiles]": async (files, dropPos)=>{
            const ed = editorRef.current;
            if (!ed) return;
            const allFiles = Array.from(files || []);
            if (!allFiles.length) return;
            const contentToInsert = [];
            for (const file of allFiles){
                try {
                    if (file.size > MAX_FILE_SIZE) {
                        console.warn(`File "${file.name}" exceeds 5 MB limit, skipped.`);
                        continue;
                    }
                    const src = await readFileAsDataUrl(file);
                    if (!src) continue;
                    if (isImageFile(file)) {
                        contentToInsert.push({
                            type: "image",
                            attrs: {
                                src,
                                width: DEFAULT_IMAGE_INSERT_WIDTH
                            }
                        });
                    } else {
                        const attachmentAttrs = {
                            src,
                            fileName: file.name,
                            fileSize: file.size,
                            mimeType: file.type,
                            addedBy: userName || null,
                            addedByColor: userColor || null,
                            addedAt: new Date().toISOString()
                        };
                        contentToInsert.push({
                            type: "fileAttachment",
                            attrs: attachmentAttrs
                        });
                    }
                } catch (err) {
                    console.warn("Failed to insert dropped/pasted file:", err);
                }
            }
            if (!contentToInsert.length) return;
            const chain = ed.chain().focus();
            if (typeof dropPos === "number") {
                chain.insertContentAt(dropPos, contentToInsert).run();
            } else {
                const insertPos = getInsertPosAfterSelectedMediaNode(ed);
                if (typeof insertPos === "number") {
                    chain.insertContentAt(insertPos, contentToInsert).run();
                } else {
                    chain.insertContent(contentToInsert).run();
                }
            }
        }
    }["Editor.useCallback[insertFiles]"], [
        userName,
        userColor
    ]);
    const authorTrackExt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Editor.useMemo[authorTrackExt]": ()=>userName && userColor ? createAuthorTrackExtension(userName, userColor) : null
    }["Editor.useMemo[authorTrackExt]"], [
        userName,
        userColor
    ]);
    const editorExtensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Editor.useMemo[editorExtensions]": ()=>[
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$starter$2d$kit$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].configure({
                    // Collaboration provides its own undo/redo history manager.
                    undoRedo: false,
                    paragraph: false
                }),
                ParagraphWithSpacing,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$text$2d$style$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextStyle"],
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$color$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"],
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$text$2d$style$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FontFamily"],
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$text$2d$style$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FontSize"],
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$highlight$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].configure({
                    multicolor: true
                }),
                __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResizableImage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
                __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FileAttachment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$placeholder$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].configure({
                    placeholder: "Start writing..."
                }),
                AuthorHighlight,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$collaboration$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].configure({
                    document: ydoc
                }),
                ...authorTrackExt ? [
                    authorTrackExt
                ] : []
            ]
    }["Editor.useMemo[editorExtensions]"], [
        ydoc,
        authorTrackExt
    ]);
    const editor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEditor"])({
        immediatelyRender: false,
        shouldRerenderOnTransaction: false,
        extensions: editorExtensions,
        onTransaction: {
            "Editor.useEditor[editor]": ({ transaction })=>{
                if (transaction.docChanged && isLocalEditorDocTransaction(transaction)) {
                    userInteractedRef.current = true;
                }
            }
        }["Editor.useEditor[editor]"],
        editorProps: {
            attributes: {
                class: "tiptap"
            },
            handleKeyDown: {
                "Editor.useEditor[editor]": (view, event)=>{
                    const selection = view.state.selection;
                    const selectedNode = selection?.node;
                    if (!selectedNode) return false;
                    const selectedNodeType = selectedNode.type?.name;
                    const isUploadNode = selectedNodeType === "image" || selectedNodeType === "fileAttachment";
                    if (!isUploadNode) return false;
                    const isSpace = event.key === " " || event.key === "Spacebar" || event.code === "Space";
                    const isBackspace = event.key === "Backspace";
                    const isDelete = event.key === "Delete";
                    const hasModifierKey = event.ctrlKey || event.metaKey || event.altKey;
                    const isPlainTypingKey = event.key.length === 1 && !hasModifierKey && !isSpace;
                    if ((isBackspace || isDelete) && !hasModifierKey) {
                        event.preventDefault();
                        // Backspace on selected image should reduce visual left gap
                        // first, not remove the image node.
                        if (selectedNodeType === "image") {
                            const pos = selection.from;
                            const currentLeading = Math.max(0, Number(selectedNode.attrs?.leadingSpace || 0));
                            const currentOffsetX = Number(selectedNode.attrs?.offsetX || 0);
                            const step = event.shiftKey ? 20 : 8;
                            if (isBackspace) {
                                const nextLeading = Math.max(currentLeading - 1, 0);
                                const nextOffsetX = nextLeading < currentLeading ? currentOffsetX : Math.max(currentOffsetX - step, 0);
                                if (nextLeading !== currentLeading || nextOffsetX !== currentOffsetX) {
                                    view.dispatch(view.state.tr.setNodeMarkup(pos, undefined, {
                                        ...selectedNode.attrs,
                                        leadingSpace: nextLeading,
                                        offsetX: nextOffsetX
                                    }).scrollIntoView());
                                }
                                return true;
                            }
                            // Delete nudges negatively-shifted images back toward zero.
                            if (isDelete && currentOffsetX < 0) {
                                const nextOffsetX = Math.min(currentOffsetX + step, 0);
                                view.dispatch(view.state.tr.setNodeMarkup(pos, undefined, {
                                    ...selectedNode.attrs,
                                    offsetX: nextOffsetX
                                }).scrollIntoView());
                                return true;
                            }
                        }
                        // If no image nudge happened, remove the selected media node.
                        view.dispatch(view.state.tr.deleteSelection().scrollIntoView());
                        return true;
                    }
                    // Google Docs-like behavior: pressing Space while an image is selected
                    // nudges that image forward, instead of replacing it or typing after it.
                    if (isSpace && selectedNodeType === "image") {
                        event.preventDefault();
                        const pos = selection.from;
                        const currentLeading = Math.max(0, Number(selectedNode.attrs?.leadingSpace || 0));
                        const nextLeading = Math.min(currentLeading + 1, 120);
                        view.dispatch(view.state.tr.setNodeMarkup(pos, undefined, {
                            ...selectedNode.attrs,
                            leadingSpace: nextLeading
                        }).scrollIntoView());
                        return true;
                    }
                    if (!isPlainTypingKey && !isSpace) return false;
                    event.preventDefault();
                    const posAfterNode = selection.to;
                    let tr = view.state.tr.setSelection(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextSelection"].create(view.state.doc, posAfterNode));
                    tr = tr.insertText(isSpace ? " " : event.key);
                    view.dispatch(tr.scrollIntoView());
                    return true;
                }
            }["Editor.useEditor[editor]"],
            handlePaste: {
                "Editor.useEditor[editor]": (view, event)=>{
                    const insertPos = getInsertPosAfterSelectedMediaSelection(view.state.selection);
                    if (typeof insertPos === "number") {
                        view.dispatch(view.state.tr.setSelection(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prosemirror$2d$state$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextSelection"].create(view.state.doc, insertPos)));
                    }
                    const files = Array.from(event?.clipboardData?.files || []);
                    const imageFilesFromItems = Array.from(event?.clipboardData?.items || []).filter({
                        "Editor.useEditor[editor].imageFilesFromItems": (item)=>item && item.kind === "file" && typeof item.type === "string" && item.type.startsWith("image/")
                    }["Editor.useEditor[editor].imageFilesFromItems"]).map({
                        "Editor.useEditor[editor].imageFilesFromItems": (item)=>item.getAsFile()
                    }["Editor.useEditor[editor].imageFilesFromItems"]).filter(Boolean);
                    const allFiles = [
                        ...files,
                        ...imageFilesFromItems.filter({
                            "Editor.useEditor[editor]": (candidate)=>!files.some({
                                    "Editor.useEditor[editor]": (existing)=>existing.name === candidate.name && existing.size === candidate.size && existing.type === candidate.type
                                }["Editor.useEditor[editor]"])
                        }["Editor.useEditor[editor]"])
                    ];
                    if (!allFiles.length) return false;
                    event.preventDefault();
                    void insertFiles(allFiles);
                    return true;
                }
            }["Editor.useEditor[editor]"],
            handleDrop: {
                "Editor.useEditor[editor]": (view, event)=>{
                    const imageDragSourcePos = readDraggedImagePosFromEvent(event);
                    if (Number.isInteger(imageDragSourcePos)) {
                        const sourceNode = view.state.doc.nodeAt(imageDragSourcePos);
                        const sourceNodeIsImage = sourceNode?.type?.name === "image";
                        const dropPosFromCoords = view.posAtCoords({
                            left: event.clientX,
                            top: event.clientY
                        })?.pos;
                        const dropPosFromTarget = getDropPosNearTargetImage(view, event);
                        const dropPos = typeof dropPosFromTarget === "number" ? dropPosFromTarget : dropPosFromCoords;
                        if (sourceNodeIsImage && typeof dropPos === "number") {
                            event.preventDefault();
                            event.stopPropagation();
                            const sourceFrom = imageDragSourcePos;
                            const sourceTo = sourceFrom + sourceNode.nodeSize;
                            if (dropPos >= sourceFrom && dropPos <= sourceTo) {
                                return true;
                            }
                            const imageSlice = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slice"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prosemirror$2d$model$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"].from(sourceNode), 0, 0);
                            let tr = view.state.tr.delete(sourceFrom, sourceTo);
                            const mappedDropPos = tr.mapping.map(dropPos, -1);
                            const insertPos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$prosemirror$2d$transform$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dropPoint"])(tr.doc, mappedDropPos, imageSlice);
                            if (typeof insertPos === "number") {
                                tr = tr.insert(insertPos, sourceNode).scrollIntoView();
                                view.dispatch(tr);
                            }
                            clearDraggedImagePos();
                            return true;
                        }
                        clearDraggedImagePos();
                    }
                    // Let ProseMirror handle internal node drags (image/file moves).
                    if (view.dragging) return false;
                    const files = event?.dataTransfer?.files;
                    if (!files || files.length === 0) return false;
                    event.preventDefault();
                    event.stopPropagation();
                    const dropPos = view.posAtCoords({
                        left: event.clientX,
                        top: event.clientY
                    })?.pos;
                    void insertFiles(files, dropPos);
                    return true;
                }
            }["Editor.useEditor[editor]"]
        }
    });
    // Keep editorRef in sync so insertFiles can use TipTap commands.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Editor.useEffect": ()=>{
            editorRef.current = editor;
        }
    }["Editor.useEffect"], [
        editor
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Editor.useEffect": ()=>{
            if (!editor) {
                setActiveFontSize("default");
                setActiveLineSpacing("default");
                setActiveNoSpaceAfter(true);
                setActiveHighlightColor(DEFAULT_HIGHLIGHT_COLOR);
                return;
            }
            const syncContextTypography = {
                "Editor.useEffect.syncContextTypography": ()=>{
                    const textStyleAttrs = editor.getAttributes("textStyle") || {};
                    const normalizedSize = normalizeFontSize(textStyleAttrs.fontSize);
                    setActiveFontSize(MENU_FONT_SIZES.includes(normalizedSize) ? normalizedSize : "default");
                    const paragraphAttrs = editor.getAttributes("paragraph") || {};
                    const lineHeightValue = String(paragraphAttrs.lineHeight || "default");
                    const knownLineHeight = MENU_LINE_SPACING_OPTIONS.some({
                        "Editor.useEffect.syncContextTypography": (option)=>option.value === lineHeightValue
                    }["Editor.useEffect.syncContextTypography"]) ? lineHeightValue : "default";
                    setActiveLineSpacing(knownLineHeight);
                    setActiveNoSpaceAfter(Boolean(paragraphAttrs.noSpaceAfter));
                    const highlightAttrs = editor.getAttributes("highlight") || {};
                    if (typeof highlightAttrs.color === "string" && highlightAttrs.color) {
                        setActiveHighlightColor(highlightAttrs.color);
                    } else if (editor.isActive("highlight")) {
                        setActiveHighlightColor(DEFAULT_HIGHLIGHT_COLOR);
                    }
                }
            }["Editor.useEffect.syncContextTypography"];
            syncContextTypography();
            editor.on("selectionUpdate", syncContextTypography);
            editor.on("transaction", syncContextTypography);
            return ({
                "Editor.useEffect": ()=>{
                    editor.off("selectionUpdate", syncContextTypography);
                    editor.off("transaction", syncContextTypography);
                }
            })["Editor.useEffect"];
        }
    }["Editor.useEffect"], [
        editor
    ]);
    const closeContextMenu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Editor.useCallback[closeContextMenu]": ()=>{
            setShowContextMenu(false);
        }
    }["Editor.useCallback[closeContextMenu]"], []);
    const getSavedSelectionRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Editor.useCallback[getSavedSelectionRange]": ()=>{
            if (!editor) return null;
            const saved = savedSelectionRef.current;
            if (saved && Number.isInteger(saved.from) && Number.isInteger(saved.to)) {
                return {
                    from: saved.from,
                    to: saved.to
                };
            }
            const { from, to } = editor.state.selection;
            return {
                from,
                to
            };
        }
    }["Editor.useCallback[getSavedSelectionRange]"], [
        editor
    ]);
    const withSavedSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Editor.useCallback[withSavedSelection]": (chain)=>{
            const sel = savedSelectionRef.current;
            if (sel && Number.isInteger(sel.from) && Number.isInteger(sel.to)) {
                chain.setTextSelection(sel);
            }
            return chain;
        }
    }["Editor.useCallback[withSavedSelection]"], []);
    const handleContextMenu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Editor.useCallback[handleContextMenu]": (event)=>{
            if (!editor) return;
            event.preventDefault();
            const { from, to } = editor.state.selection;
            savedSelectionRef.current = {
                from,
                to
            };
            const menuWidth = 320;
            const menuHeight = 620;
            const nextLeft = Math.min(event.clientX, window.innerWidth - menuWidth - 8);
            const nextTop = Math.min(event.clientY, window.innerHeight - menuHeight - 8);
            setContextMenuPosition({
                left: Math.max(8, nextLeft),
                top: Math.max(8, nextTop)
            });
            setShowContextMenu(true);
        }
    }["Editor.useCallback[handleContextMenu]"], [
        editor
    ]);
    const runFormatCommand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Editor.useCallback[runFormatCommand]": (runner)=>{
            if (!editor) return;
            const chain = withSavedSelection(editor.chain().focus());
            runner(chain);
            chain.run();
        }
    }["Editor.useCallback[runFormatCommand]"], [
        editor,
        withSavedSelection
    ]);
    const applyContextFontSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Editor.useCallback[applyContextFontSize]": (fontSizeValue)=>{
            runFormatCommand({
                "Editor.useCallback[applyContextFontSize]": (chain)=>{
                    if (fontSizeValue === "default") {
                        chain.unsetFontSize();
                    } else {
                        chain.setFontSize(`${fontSizeValue}px`);
                    }
                }
            }["Editor.useCallback[applyContextFontSize]"]);
            setActiveFontSize(fontSizeValue);
        }
    }["Editor.useCallback[applyContextFontSize]"], [
        runFormatCommand
    ]);
    const applyContextLineSpacing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Editor.useCallback[applyContextLineSpacing]": (lineSpacingValue)=>{
            runFormatCommand({
                "Editor.useCallback[applyContextLineSpacing]": (chain)=>{
                    chain.updateAttributes("paragraph", {
                        lineHeight: lineSpacingValue === "default" ? null : lineSpacingValue
                    });
                }
            }["Editor.useCallback[applyContextLineSpacing]"]);
            setActiveLineSpacing(lineSpacingValue);
        }
    }["Editor.useCallback[applyContextLineSpacing]"], [
        runFormatCommand
    ]);
    const toggleContextParagraphSpace = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Editor.useCallback[toggleContextParagraphSpace]": ()=>{
            const nextNoSpace = !activeNoSpaceAfter;
            runFormatCommand({
                "Editor.useCallback[toggleContextParagraphSpace]": (chain)=>{
                    chain.updateAttributes("paragraph", {
                        noSpaceAfter: nextNoSpace
                    });
                }
            }["Editor.useCallback[toggleContextParagraphSpace]"]);
            setActiveNoSpaceAfter(nextNoSpace);
        }
    }["Editor.useCallback[toggleContextParagraphSpace]"], [
        activeNoSpaceAfter,
        runFormatCommand
    ]);
    const toggleContextHighlight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Editor.useCallback[toggleContextHighlight]": ()=>{
            if (!editor) return;
            runFormatCommand({
                "Editor.useCallback[toggleContextHighlight]": (chain)=>{
                    if (editor.isActive("highlight")) {
                        chain.unsetHighlight();
                    } else {
                        chain.setHighlight({
                            color: activeHighlightColor || DEFAULT_HIGHLIGHT_COLOR
                        });
                    }
                }
            }["Editor.useCallback[toggleContextHighlight]"]);
        }
    }["Editor.useCallback[toggleContextHighlight]"], [
        editor,
        runFormatCommand,
        activeHighlightColor
    ]);
    const applyContextHighlightColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Editor.useCallback[applyContextHighlightColor]": (colorValue)=>{
            const nextColor = colorValue || DEFAULT_HIGHLIGHT_COLOR;
            setActiveHighlightColor(nextColor);
            runFormatCommand({
                "Editor.useCallback[applyContextHighlightColor]": (chain)=>{
                    chain.setHighlight({
                        color: nextColor
                    });
                }
            }["Editor.useCallback[applyContextHighlightColor]"]);
        }
    }["Editor.useCallback[applyContextHighlightColor]"], [
        runFormatCommand
    ]);
    const clearContextFormatting = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Editor.useCallback[clearContextFormatting]": ()=>{
            if (!editor) return;
            const range = getSavedSelectionRange();
            if (!range) return;
            const from = Math.min(range.from, range.to);
            const to = Math.max(range.from, range.to);
            const { state } = editor;
            const tr = state.tr;
            if (from === to) {
                // Keep authorship metadata while clearing active formatting marks.
                const currentMarks = state.storedMarks || state.selection.$from.marks();
                const preserved = currentMarks.filter({
                    "Editor.useCallback[clearContextFormatting].preserved": (mark)=>mark.type.name === "authorHighlight"
                }["Editor.useCallback[clearContextFormatting].preserved"]);
                tr.setStoredMarks(preserved);
                editor.view.dispatch(tr);
                return;
            }
            // Remove all inline formatting marks from selected text, but preserve
            // authorship metadata used for collaborator attribution.
            Object.values(state.schema.marks).forEach({
                "Editor.useCallback[clearContextFormatting]": (markType)=>{
                    if (markType.name === "authorHighlight") return;
                    tr.removeMark(from, to, markType);
                }
            }["Editor.useCallback[clearContextFormatting]"]);
            editor.view.dispatch(tr.scrollIntoView());
        }
    }["Editor.useCallback[clearContextFormatting]"], [
        editor,
        getSavedSelectionRange
    ]);
    const deleteContextSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Editor.useCallback[deleteContextSelection]": ()=>{
            const range = getSavedSelectionRange();
            if (!range || range.from === range.to) return;
            runFormatCommand({
                "Editor.useCallback[deleteContextSelection]": (chain)=>{
                    chain.deleteSelection();
                }
            }["Editor.useCallback[deleteContextSelection]"]);
        }
    }["Editor.useCallback[deleteContextSelection]"], [
        getSavedSelectionRange,
        runFormatCommand
    ]);
    const handleClipboardAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Editor.useCallback[handleClipboardAction]": async (action)=>{
            if (!editor) return;
            editor.chain().focus().run();
            try {
                if (action === "copy") {
                    document.execCommand("copy");
                } else if (action === "cut") {
                    document.execCommand("cut");
                } else if (action === "paste") {
                    if (navigator?.clipboard?.readText) {
                        const text = await navigator.clipboard.readText();
                        if (text) {
                            editor.chain().focus().insertContent(text).run();
                        }
                    } else {
                        document.execCommand("paste");
                    }
                }
            } catch (err) {
                console.warn(`Clipboard action '${action}' failed:`, err);
            }
            closeContextMenu();
        }
    }["Editor.useCallback[handleClipboardAction]"], [
        editor,
        closeContextMenu
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Editor.useEffect": ()=>{
            if (!showContextMenu) return;
            const handlePointerDown = {
                "Editor.useEffect.handlePointerDown": (event)=>{
                    const target = event.target;
                    if (contextMenuRef.current && !contextMenuRef.current.contains(target)) {
                        setShowContextMenu(false);
                    }
                }
            }["Editor.useEffect.handlePointerDown"];
            const handleEscape = {
                "Editor.useEffect.handleEscape": (event)=>{
                    if (event.key === "Escape") {
                        setShowContextMenu(false);
                    }
                }
            }["Editor.useEffect.handleEscape"];
            const handleWindowResize = {
                "Editor.useEffect.handleWindowResize": ()=>{
                    setShowContextMenu(false);
                }
            }["Editor.useEffect.handleWindowResize"];
            document.addEventListener("mousedown", handlePointerDown, true);
            window.addEventListener("keydown", handleEscape);
            window.addEventListener("resize", handleWindowResize);
            return ({
                "Editor.useEffect": ()=>{
                    document.removeEventListener("mousedown", handlePointerDown, true);
                    window.removeEventListener("keydown", handleEscape);
                    window.removeEventListener("resize", handleWindowResize);
                }
            })["Editor.useEffect"];
        }
    }["Editor.useEffect"], [
        showContextMenu
    ]);
    // Auto-save: encode Yjs state -> compress -> encrypt -> POST
    const autoSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Editor.useCallback[autoSave]": async ()=>{
            try {
                if (onContentChange) onContentChange(true);
                const state = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeStateAsUpdate"](ydoc);
                const compressed = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pako$2f$dist$2f$pako$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].deflate(state);
                let payload;
                if (roomKey) {
                    payload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$crypto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encryptToBase64"])(compressed, roomKey);
                } else {
                    let binary = "";
                    for(let i = 0; i < compressed.length; i++){
                        binary += String.fromCharCode(compressed[i]);
                    }
                    payload = btoa(binary);
                }
                const res = await fetch(`/api/rooms/${roomId}/save`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        compressedContent: payload,
                        userId,
                        pageId: pageId || null
                    })
                });
                if (!res.ok) {
                    if (res.status === 401 && onSessionExpired) {
                        onSessionExpired();
                        return;
                    }
                    throw new Error("Save request failed.");
                }
                if (onContentChange) onContentChange("saved");
            } catch (err) {
                console.error("Auto-save failed:", err);
                if (onContentChange) onContentChange(false);
            }
        }
    }["Editor.useCallback[autoSave]"], [
        roomId,
        userId,
        roomKey,
        onContentChange,
        onSessionExpired,
        ydoc,
        pageId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Editor.useEffect": ()=>{
            const markActivity = {
                "Editor.useEffect.markActivity": ()=>{
                    ydocActivityRef.current = true;
                }
            }["Editor.useEffect.markActivity"];
            ydoc.on("update", markActivity);
            return ({
                "Editor.useEffect": ()=>{
                    ydoc.off("update", markActivity);
                }
            })["Editor.useEffect"];
        }
    }["Editor.useEffect"], [
        ydoc
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Editor.useEffect": ()=>{
            const handler = {
                "Editor.useEffect.handler": (_update, origin)=>{
                    if (!providerReadyRef.current) return;
                    if (origin === REMOTE_SOCKET_ORIGIN) return;
                    if (!userInteractedRef.current) return;
                    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
                    saveTimerRef.current = setTimeout(autoSave, 5000);
                }
            }["Editor.useEffect.handler"];
            ydoc.on("update", handler);
            return ({
                "Editor.useEffect": ()=>ydoc.off("update", handler)
            })["Editor.useEffect"];
        }
    }["Editor.useEffect"], [
        ydoc,
        autoSave
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Editor.useEffect": ()=>{
            if (!socket || !roomId || !userId) return;
            const emitLocalUpdate = {
                "Editor.useEffect.emitLocalUpdate": (update, origin)=>{
                    // Prevent rebroadcast loops for updates applied from socket events.
                    if (origin === REMOTE_SOCKET_ORIGIN) return;
                    // Send Uint8Array directly — Socket.IO handles binary
                    // encoding natively (much smaller than Array.from JSON).
                    socket.emit("yjs-update", {
                        roomId,
                        pageId: pageId || null,
                        update: new Uint8Array(update),
                        user: {
                            userId
                        }
                    });
                }
            }["Editor.useEffect.emitLocalUpdate"];
            const applyRemoteUpdate = {
                "Editor.useEffect.applyRemoteUpdate": (payload)=>{
                    // Only apply updates for the page we're currently on
                    const incomingPageId = payload?.pageId || null;
                    const myPageId = pageId || null;
                    if (incomingPageId !== myPageId) return;
                    // Accept both 'update' (incremental) and 'state' (full sync) keys.
                    const data = payload?.update ?? payload?.state;
                    if (!data) return;
                    try {
                        const normalized = normalizeBinaryUpdatePayload(data);
                        if (!normalized || normalized.length === 0) {
                            console.warn("Ignored malformed remote Yjs payload.");
                            return;
                        }
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyUpdate"](ydoc, normalized, REMOTE_SOCKET_ORIGIN);
                    } catch (err) {
                        console.warn("Failed to apply remote Yjs update:", err);
                    }
                }
            }["Editor.useEffect.applyRemoteUpdate"];
            const requestState = {
                "Editor.useEffect.requestState": ()=>{
                    socket.emit("yjs-request-state", {
                        roomId,
                        pageId: pageId || null
                    });
                }
            }["Editor.useEffect.requestState"];
            ydoc.on("update", emitLocalUpdate);
            socket.on("yjs-update", applyRemoteUpdate);
            socket.on("yjs-sync", applyRemoteUpdate);
            socket.on("connect", requestState);
            if (socket.connected) {
                requestState();
            }
            return ({
                "Editor.useEffect": ()=>{
                    ydoc.off("update", emitLocalUpdate);
                    socket.off("yjs-update", applyRemoteUpdate);
                    socket.off("yjs-sync", applyRemoteUpdate);
                    socket.off("connect", requestState);
                }
            })["Editor.useEffect"];
        }
    }["Editor.useEffect"], [
        socket,
        roomId,
        userId,
        ydoc,
        pageId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Editor.useEffect": ()=>{
            if (!editor || !socket || !roomId || !userId) return;
            const markTyping = {
                "Editor.useEffect.markTyping": ()=>{
                    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
                    if (!lastTypingEmitRef.current || now - lastTypingEmitRef.current >= TYPING_STATUS_THROTTLE_MS) {
                        socket.emit("typing-status", {
                            roomId,
                            userId,
                            isTyping: true
                        });
                        lastTypingEmitRef.current = now;
                    }
                    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
                    typingTimerRef.current = setTimeout({
                        "Editor.useEffect.markTyping": ()=>{
                            socket.emit("typing-status", {
                                roomId,
                                userId,
                                isTyping: false
                            });
                        }
                    }["Editor.useEffect.markTyping"], 1200);
                }
            }["Editor.useEffect.markTyping"];
            const onTransaction = {
                "Editor.useEffect.onTransaction": ({ transaction })=>{
                    if (!transaction.docChanged) return;
                    if (!isLocalEditorDocTransaction(transaction)) return;
                    if (typingRafRef.current) return;
                    typingRafRef.current = requestAnimationFrame({
                        "Editor.useEffect.onTransaction": ()=>{
                            typingRafRef.current = null;
                            markTyping();
                        }
                    }["Editor.useEffect.onTransaction"]);
                }
            }["Editor.useEffect.onTransaction"];
            editor.on("transaction", onTransaction);
            return ({
                "Editor.useEffect": ()=>{
                    editor.off("transaction", onTransaction);
                    if (typingRafRef.current) {
                        cancelAnimationFrame(typingRafRef.current);
                        typingRafRef.current = null;
                    }
                    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
                    socket.emit("typing-status", {
                        roomId,
                        userId,
                        isTyping: false
                    });
                }
            })["Editor.useEffect"];
        }
    }["Editor.useEffect"], [
        editor,
        socket,
        roomId,
        userId
    ]);
    // Load initial content from DB once.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Editor.useEffect": ()=>{
            if (!ydoc || !roomId || !userId || !editor) return;
            if (initialContentLoadedRef.current) return;
            initialContentLoadedRef.current = true;
            // If the Yjs doc already has content (e.g. from cache), mark as
            // ready immediately and skip the network fetch entirely.
            const hasRuntimeState = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeStateAsUpdate"](ydoc).length > 2;
            if (hasRuntimeState) {
                providerReadyRef.current = true;
                return;
            }
            let cancelled = false;
            const loadContent = {
                "Editor.useEffect.loadContent": async ()=>{
                    try {
                        const res = await fetch(`/api/rooms/${roomId}/save${pageId ? `?pageId=${pageId}` : ""}`);
                        if (res.status === 401) {
                            if (onSessionExpired) onSessionExpired();
                            return;
                        }
                        const data = await res.json();
                        if (cancelled) return;
                        // Never overwrite active local runtime state.
                        if (userInteractedRef.current || ydocActivityRef.current) {
                            return;
                        }
                        const hasRuntimeState = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeStateAsUpdate"](ydoc).length > 2;
                        if (hasRuntimeState) {
                            return;
                        }
                        if (data.compressedContent) {
                            let decompressed;
                            if (roomKey) {
                                try {
                                    const decrypted = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$crypto$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decryptFromBase64"])(data.compressedContent, roomKey);
                                    decompressed = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pako$2f$dist$2f$pako$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].inflate(decrypted);
                                } catch  {
                                    // Fallback: previously saved without encryption.
                                    decompressed = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pako$2f$dist$2f$pako$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].inflate(decodeStoredContent(data.compressedContent));
                                }
                            } else {
                                decompressed = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pako$2f$dist$2f$pako$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].inflate(decodeStoredContent(data.compressedContent));
                            }
                            // Apply only valid Yjs content to avoid destructive restores.
                            try {
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$yjs$2f$dist$2f$yjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyUpdate"](ydoc, decompressed);
                            } catch (syncErr) {
                                console.warn("Skipping non-Yjs legacy content restore.", syncErr);
                            }
                        }
                    } catch (err) {
                        console.error("Failed to load content:", err);
                    } finally{
                        if (!cancelled) {
                            providerReadyRef.current = true;
                        }
                    }
                }
            }["Editor.useEffect.loadContent"];
            loadContent();
            return ({
                "Editor.useEffect": ()=>{
                    cancelled = true;
                }
            })["Editor.useEffect"];
        }
    }["Editor.useEffect"], [
        ydoc,
        editor,
        roomId,
        userId,
        roomKey,
        onSessionExpired
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Editor.useEffect": ()=>{
            return ({
                "Editor.useEffect": ()=>{
                    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
                    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
                    if (typingRafRef.current) cancelAnimationFrame(typingRafRef.current);
                }
            })["Editor.useEffect"];
        }
    }["Editor.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Editor.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            if (editor) {
                window.__tiptapEditor = editor;
                window.dispatchEvent(new CustomEvent("teamnote-editor-ready"));
                return;
            }
            if (window.__tiptapEditor) {
                window.__tiptapEditor = null;
                window.dispatchEvent(new CustomEvent("teamnote-editor-ready"));
            }
        }
    }["Editor.useEffect"], [
        editor
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `editor-content ${showLineNumbers ? "show-line-numbers" : ""}`,
                style: {
                    ...editorBg ? {
                        background: editorBg
                    } : {},
                    ...fontColor ? {
                        color: fontColor
                    } : {}
                },
                onContextMenu: handleContextMenu,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["EditorContent"], {
                    editor: editor
                }, void 0, false, {
                    fileName: "[project]/components/Editor.js",
                    lineNumber: 1585,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Editor.js",
                lineNumber: 1577,
                columnNumber: 13
            }, this),
            showContextMenu && typeof document !== "undefined" && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createPortal(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: contextMenuRef,
                className: "editor-context-menu",
                style: {
                    top: contextMenuPosition.top,
                    left: contextMenuPosition.left
                },
                role: "menu",
                "aria-label": "Editor context menu",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "editor-context-topbar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "editor-context-title",
                                children: "Quick Format"
                            }, void 0, false, {
                                fileName: "[project]/components/Editor.js",
                                lineNumber: 1601,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "editor-context-close",
                                onClick: closeContextMenu,
                                title: "Close",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "fa-solid fa-xmark"
                                }, void 0, false, {
                                    fileName: "[project]/components/Editor.js",
                                    lineNumber: 1608,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Editor.js",
                                lineNumber: 1602,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Editor.js",
                        lineNumber: 1600,
                        columnNumber: 25
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "editor-context-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "editor-context-section-label",
                                children: "Clipboard"
                            }, void 0, false, {
                                fileName: "[project]/components/Editor.js",
                                lineNumber: 1613,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "editor-context-actions",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "editor-context-btn",
                                        onClick: ()=>handleClipboardAction("copy"),
                                        title: "Copy",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-regular fa-copy"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1621,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Copy"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1622,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1615,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "editor-context-btn",
                                        onClick: ()=>handleClipboardAction("cut"),
                                        title: "Cut",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-scissors"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1630,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Cut"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1631,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1624,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "editor-context-btn",
                                        onClick: ()=>handleClipboardAction("paste"),
                                        title: "Paste",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-paste"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1639,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Paste"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1640,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1633,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "editor-context-btn",
                                        onClick: ()=>runFormatCommand((chain)=>chain.selectAll()),
                                        title: "Select All",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-object-group"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1650,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Select All"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1651,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1642,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "editor-context-btn",
                                        onClick: ()=>runFormatCommand((chain)=>chain.undo()),
                                        title: "Undo",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-rotate-left"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1661,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Undo"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1662,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1653,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "editor-context-btn",
                                        onClick: ()=>runFormatCommand((chain)=>chain.redo()),
                                        title: "Redo",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-rotate-right"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1672,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Redo"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1673,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1664,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "editor-context-btn",
                                        onClick: deleteContextSelection,
                                        title: "Delete Selection",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-regular fa-trash-can"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1681,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Delete"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1682,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1675,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Editor.js",
                                lineNumber: 1614,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Editor.js",
                        lineNumber: 1612,
                        columnNumber: 25
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "editor-context-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "editor-context-section-label",
                                children: "Text Style"
                            }, void 0, false, {
                                fileName: "[project]/components/Editor.js",
                                lineNumber: 1688,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "editor-context-actions",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `editor-context-btn ${editor?.isActive("bold") ? "active" : ""}`,
                                        onClick: ()=>runFormatCommand((chain)=>chain.toggleBold()),
                                        title: "Bold",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-bold"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1698,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Bold"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1699,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1690,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `editor-context-btn ${editor?.isActive("italic") ? "active" : ""}`,
                                        onClick: ()=>runFormatCommand((chain)=>chain.toggleItalic()),
                                        title: "Italic",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-italic"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1709,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Italic"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1710,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1701,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `editor-context-btn ${editor?.isActive("underline") ? "active" : ""}`,
                                        onClick: ()=>runFormatCommand((chain)=>chain.toggleUnderline()),
                                        title: "Underline",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-underline"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1720,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Underline"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1721,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1712,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `editor-context-btn ${editor?.isActive("strike") ? "active" : ""}`,
                                        onClick: ()=>runFormatCommand((chain)=>chain.toggleStrike()),
                                        title: "Strike",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-strikethrough"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1731,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Strike"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1732,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1723,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `editor-context-btn ${editor?.isActive("highlight") ? "active" : ""}`,
                                        onClick: toggleContextHighlight,
                                        title: "Highlight",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-highlighter"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1740,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Highlight"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1741,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1734,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "editor-context-btn",
                                        onClick: clearContextFormatting,
                                        title: "Clear Selected Formatting",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-eraser"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1749,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Clear"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1750,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1743,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Editor.js",
                                lineNumber: 1689,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "editor-context-swatches",
                                children: MENU_HIGHLIGHT_COLORS.map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `editor-context-swatch ${activeHighlightColor === color ? "active" : ""}`,
                                        style: {
                                            background: color
                                        },
                                        onClick: ()=>applyContextHighlightColor(color),
                                        title: `Highlight ${color}`
                                    }, color, false, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1755,
                                        columnNumber: 37
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/Editor.js",
                                lineNumber: 1753,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "editor-context-row editor-context-row-tight",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "editor-context-label",
                                        children: "Custom Highlight"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1766,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "color",
                                        className: "editor-context-color-input",
                                        value: activeHighlightColor,
                                        onChange: (event)=>applyContextHighlightColor(event.target.value),
                                        title: "Choose highlight color"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1767,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Editor.js",
                                lineNumber: 1765,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Editor.js",
                        lineNumber: 1687,
                        columnNumber: 25
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "editor-context-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "editor-context-section-label",
                                children: "Paragraph"
                            }, void 0, false, {
                                fileName: "[project]/components/Editor.js",
                                lineNumber: 1780,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "editor-context-actions",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `editor-context-btn ${editor?.isActive("heading", {
                                            level: 1
                                        }) ? "active" : ""}`,
                                        onClick: ()=>runFormatCommand((chain)=>chain.toggleHeading({
                                                    level: 1
                                                })),
                                        title: "Heading 1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-heading"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1792,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "H1"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1793,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1782,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `editor-context-btn ${editor?.isActive("heading", {
                                            level: 2
                                        }) ? "active" : ""}`,
                                        onClick: ()=>runFormatCommand((chain)=>chain.toggleHeading({
                                                    level: 2
                                                })),
                                        title: "Heading 2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-heading"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1805,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "H2"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1806,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1795,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `editor-context-btn ${editor?.isActive("bulletList") ? "active" : ""}`,
                                        onClick: ()=>runFormatCommand((chain)=>chain.toggleBulletList()),
                                        title: "Bullet List",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-list-ul"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1818,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Bullets"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1819,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1808,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `editor-context-btn ${editor?.isActive("orderedList") ? "active" : ""}`,
                                        onClick: ()=>runFormatCommand((chain)=>chain.toggleOrderedList()),
                                        title: "Numbered List",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-list-ol"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1831,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Numbers"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1832,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1821,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `editor-context-btn ${editor?.isActive("blockquote") ? "active" : ""}`,
                                        onClick: ()=>runFormatCommand((chain)=>chain.toggleBlockquote()),
                                        title: "Blockquote",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-quote-left"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1844,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Quote"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1845,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1834,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `editor-context-btn ${showLineNumbers ? "active" : ""}`,
                                        onClick: ()=>onChangeShowLineNumbers?.(!showLineNumbers),
                                        title: "Line Numbers",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fa-solid fa-hashtag"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1855,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Lines"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1856,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1847,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Editor.js",
                                lineNumber: 1781,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Editor.js",
                        lineNumber: 1779,
                        columnNumber: 25
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "editor-context-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "editor-context-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "editor-context-label",
                                        children: "Font Size"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1863,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "editor-context-chip-group",
                                        children: MENU_FONT_SIZES.map((size)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: `editor-context-chip ${activeFontSize === size ? "active" : ""}`,
                                                onClick: ()=>applyContextFontSize(size),
                                                children: size === "default" ? "Default" : `${size}px`
                                            }, size, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1866,
                                                columnNumber: 41
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1864,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Editor.js",
                                lineNumber: 1862,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "editor-context-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "editor-context-label",
                                        children: "Line Spacing"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1879,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "editor-context-chip-group",
                                        children: MENU_LINE_SPACING_OPTIONS.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: `editor-context-chip ${activeLineSpacing === option.value ? "active" : ""}`,
                                                onClick: ()=>applyContextLineSpacing(option.value),
                                                children: option.label
                                            }, option.value, false, {
                                                fileName: "[project]/components/Editor.js",
                                                lineNumber: 1882,
                                                columnNumber: 41
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/Editor.js",
                                        lineNumber: 1880,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Editor.js",
                                lineNumber: 1878,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "editor-context-row",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: `editor-context-toggle ${!activeNoSpaceAfter ? "active" : ""}`,
                                    onClick: toggleContextParagraphSpace,
                                    children: "Space After Paragraph"
                                }, void 0, false, {
                                    fileName: "[project]/components/Editor.js",
                                    lineNumber: 1897,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Editor.js",
                                lineNumber: 1896,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Editor.js",
                        lineNumber: 1861,
                        columnNumber: 25
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Editor.js",
                lineNumber: 1590,
                columnNumber: 21
            }, this), document.body)
        ]
    }, void 0, true);
}
_s(Editor, "0WTvdUi2DY2mdE8NwsRRjxEWH+E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEditor"]
    ];
});
_c = Editor;
var _c;
__turbopack_context__.k.register(_c, "Editor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Editor.js [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/Editor.js [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_63232082._.js.map