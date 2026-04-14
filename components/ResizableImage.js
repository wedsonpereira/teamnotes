"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useCallback, useRef, useState } from "react";

const DEFAULT_IMAGE_RENDER_WIDTH = 420;

/* ------------------------------------------------------------------ */
/*  ResizableImageView — React NodeView                                */
/*  Renders an <img> with corner drag handles for free-form resizing.  */
/* ------------------------------------------------------------------ */
function ResizableImageView({ node, updateAttributes, selected }) {
    const containerRef = useRef(null);
    const moveStateRef = useRef(null);
    const movePreviewRef = useRef(null);
    const [resizing, setResizing] = useState(false);
    const [moving, setMoving] = useState(false);
    const [movePreview, setMovePreview] = useState(null);

    const {
        src,
        alt,
        title,
        width,
        height,
        alignment,
        leadingSpace,
        offsetX,
        offsetY,
    } = node.attrs;
    const leadingOffsetPx = Math.max(0, Number(leadingSpace || 0)) * 8;
    const baseOffsetX = Number.isFinite(Number(offsetX)) ? Number(offsetX) : 0;
    const baseOffsetY = Number.isFinite(Number(offsetY)) ? Number(offsetY) : 0;
    const activeOffsetX =
        movePreview && Number.isFinite(movePreview.x)
            ? movePreview.x
            : baseOffsetX;
    const activeOffsetY =
        movePreview && Number.isFinite(movePreview.y)
            ? movePreview.y
            : baseOffsetY;

    const commitMove = useCallback(() => {
        const preview = movePreviewRef.current;
        if (!preview) return;

        updateAttributes({
            offsetX: preview.x,
            offsetY: preview.y,
        });
    }, [updateAttributes]);

    const updateMovePreview = useCallback((x, y) => {
        const next = {
            x: Math.round(x),
            y: Math.round(y),
        };
        movePreviewRef.current = next;
        setMovePreview(next);
    }, []);

    const startMove = useCallback(
        (clientX, clientY) => {
            moveStateRef.current = {
                startClientX: clientX,
                startClientY: clientY,
                startOffsetX: baseOffsetX,
                startOffsetY: baseOffsetY,
            };

            setMoving(true);
            updateMovePreview(baseOffsetX, baseOffsetY);

            const onMouseMove = (moveEvent) => {
                const state = moveStateRef.current;
                if (!state) return;

                updateMovePreview(
                    state.startOffsetX + (moveEvent.clientX - state.startClientX),
                    state.startOffsetY + (moveEvent.clientY - state.startClientY)
                );
            };

            const onMouseUp = () => {
                setMoving(false);
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
                moveStateRef.current = null;
                commitMove();
            };

            const onTouchMove = (moveEvent) => {
                if (moveEvent.touches.length !== 1) return;
                const state = moveStateRef.current;
                if (!state) return;
                moveEvent.preventDefault();
                const t = moveEvent.touches[0];
                updateMovePreview(
                    state.startOffsetX + (t.clientX - state.startClientX),
                    state.startOffsetY + (t.clientY - state.startClientY)
                );
            };

            const onTouchEnd = () => {
                setMoving(false);
                document.removeEventListener("touchmove", onTouchMove);
                document.removeEventListener("touchend", onTouchEnd);
                moveStateRef.current = null;
                commitMove();
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
            document.addEventListener("touchmove", onTouchMove, { passive: false });
            document.addEventListener("touchend", onTouchEnd);
        },
        [baseOffsetX, baseOffsetY, commitMove, updateMovePreview]
    );

    const onResizeMouseDown = useCallback(
        (corner, e) => {
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

            const onMouseMove = (moveEvent) => {
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
                    height: newHeight,
                });
            };

            const onMouseUp = () => {
                setResizing(false);
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        },
        [updateAttributes]
    );

    // Touch support for mobile
    const onResizeTouchStart = useCallback(
        (corner, e) => {
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

            const onTouchMove = (moveEvent) => {
                if (moveEvent.touches.length !== 1) return;
                const t = moveEvent.touches[0];
                let dx = t.clientX - startX;
                let dy = t.clientY - startY;

                if (corner === "top-left" || corner === "bottom-left") dx = -dx;
                if (corner === "top-left" || corner === "top-right") dy = -dy;

                const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy;
                let newWidth = Math.max(50, startWidth + delta);
                let newHeight = Math.round(newWidth / aspectRatio);

                updateAttributes({ width: newWidth, height: newHeight });
            };

            const onTouchEnd = () => {
                setResizing(false);
                document.removeEventListener("touchmove", onTouchMove);
                document.removeEventListener("touchend", onTouchEnd);
            };

            document.addEventListener("touchmove", onTouchMove, { passive: false });
            document.addEventListener("touchend", onTouchEnd);
        },
        [updateAttributes]
    );

    const onImageMouseDown = useCallback(
        (e) => {
            if (!selected || resizing || e.button !== 0) return;
            e.preventDefault();
            e.stopPropagation();
            startMove(e.clientX, e.clientY);
        },
        [resizing, selected, startMove]
    );

    const onImageTouchStart = useCallback(
        (e) => {
            if (!selected || resizing || e.touches.length !== 1) return;
            e.preventDefault();
            e.stopPropagation();
            const touch = e.touches[0];
            startMove(touch.clientX, touch.clientY);
        },
        [resizing, selected, startMove]
    );

    const corners = ["top-left", "top-right", "bottom-left", "bottom-right"];
    const wrapperStyle = {
        ...(leadingOffsetPx ? { marginLeft: `${leadingOffsetPx}px` } : {}),
        ...(activeOffsetX || activeOffsetY
            ? { transform: `translate(${activeOffsetX}px, ${activeOffsetY}px)` }
            : {}),
        ...(moving ? { zIndex: 20 } : {}),
    };

    return (
        <NodeViewWrapper
            as="span"
            className={`resizable-image-wrapper ${alignment || "center"} ${selected ? "selected" : ""} ${resizing ? "resizing" : ""} ${moving ? "moving" : ""}`}
            style={wrapperStyle}
        >
            <span className="resizable-image-container" ref={containerRef}>
                <img
                    src={src}
                    alt={alt || ""}
                    title={title || ""}
                    onMouseDown={onImageMouseDown}
                    onTouchStart={onImageTouchStart}
                    style={{
                        width: width
                            ? `${width}px`
                            : `min(${DEFAULT_IMAGE_RENDER_WIDTH}px, 100%)`,
                        height: height ? `${height}px` : "auto",
                        maxWidth: "100%",
                    }}
                    draggable={false}
                />
                {selected && (
                    <>
                        {corners.map((corner) => (
                            <span
                                key={corner}
                                className={`resize-handle ${corner}`}
                                onMouseDown={(e) => onResizeMouseDown(corner, e)}
                                onTouchStart={(e) => onResizeTouchStart(corner, e)}
                            />
                        ))}
                    </>
                )}
            </span>
        </NodeViewWrapper>
    );
}

/* ------------------------------------------------------------------ */
/*  ResizableImage — TipTap Node Extension                             */
/* ------------------------------------------------------------------ */
const ResizableImage = Node.create({
    name: "image",

    group: "block",
    atom: true,
    draggable: true,
    marks: "",

    addAttributes() {
        return {
            src: { default: null },
            alt: { default: null },
            title: { default: null },
            width: { default: null },
            height: { default: null },
            alignment: { default: "center" },
            leadingSpace: {
                default: 0,
                parseHTML: (element) => {
                    const raw = element.getAttribute("data-leading-space");
                    const parsed = Number.parseInt(String(raw || "0"), 10);
                    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
                },
                renderHTML: (attrs) =>
                    attrs.leadingSpace > 0
                        ? { "data-leading-space": String(attrs.leadingSpace) }
                        : {},
            },
            offsetX: {
                default: 0,
                parseHTML: (element) => {
                    const raw = element.getAttribute("data-offset-x");
                    const parsed = Number.parseInt(String(raw || "0"), 10);
                    return Number.isFinite(parsed) ? parsed : 0;
                },
                renderHTML: (attrs) =>
                    attrs.offsetX
                        ? { "data-offset-x": String(attrs.offsetX) }
                        : {},
            },
            offsetY: {
                default: 0,
                parseHTML: (element) => {
                    const raw = element.getAttribute("data-offset-y");
                    const parsed = Number.parseInt(String(raw || "0"), 10);
                    return Number.isFinite(parsed) ? parsed : 0;
                },
                renderHTML: (attrs) =>
                    attrs.offsetY
                        ? { "data-offset-y": String(attrs.offsetY) }
                        : {},
            },
        };
    },

    parseHTML() {
        return [{ tag: "img[src]" }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "img",
            mergeAttributes(HTMLAttributes, {
                style: [
                    HTMLAttributes.width ? `width: ${HTMLAttributes.width}px` : "",
                    HTMLAttributes.height ? `height: ${HTMLAttributes.height}px` : "",
                    HTMLAttributes.offsetX || HTMLAttributes.offsetY
                        ? `transform: translate(${Number(HTMLAttributes.offsetX || 0)}px, ${Number(HTMLAttributes.offsetY || 0)}px)`
                        : "",
                ]
                    .filter(Boolean)
                    .join("; "),
            }),
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ResizableImageView);
    },

    addCommands() {
        return {
            setImage:
                (attrs) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs,
                    });
                },
        };
    },
});

export default ResizableImage;
