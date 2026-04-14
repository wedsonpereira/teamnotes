"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

/* ------------------------------------------------------------------ */
/*  File icon helper                                                    */
/* ------------------------------------------------------------------ */
function getFileIcon(mimeType, fileName) {
    if (!mimeType && !fileName) return "fa-solid fa-file";

    const ext = (fileName || "").split(".").pop()?.toLowerCase();
    const mime = (mimeType || "").toLowerCase();

    if (mime.startsWith("application/pdf") || ext === "pdf")
        return "fa-solid fa-file-pdf";
    if (
        mime.includes("word") ||
        mime.includes("document") ||
        ext === "doc" ||
        ext === "docx"
    )
        return "fa-solid fa-file-word";
    if (
        mime.includes("sheet") ||
        mime.includes("excel") ||
        ext === "xls" ||
        ext === "xlsx" ||
        ext === "csv"
    )
        return "fa-solid fa-file-excel";
    if (
        mime.includes("presentation") ||
        mime.includes("powerpoint") ||
        ext === "ppt" ||
        ext === "pptx"
    )
        return "fa-solid fa-file-powerpoint";
    if (mime.startsWith("text/") || ext === "txt" || ext === "md")
        return "fa-solid fa-file-lines";
    if (
        mime.includes("zip") ||
        mime.includes("compressed") ||
        mime.includes("archive") ||
        ext === "zip" ||
        ext === "rar" ||
        ext === "7z" ||
        ext === "tar" ||
        ext === "gz"
    )
        return "fa-solid fa-file-zipper";
    if (mime.startsWith("audio/")) return "fa-solid fa-file-audio";
    if (mime.startsWith("video/")) return "fa-solid fa-file-video";
    if (
        ext === "js" ||
        ext === "ts" ||
        ext === "py" ||
        ext === "java" ||
        ext === "html" ||
        ext === "css" ||
        ext === "json" ||
        ext === "xml"
    )
        return "fa-solid fa-file-code";

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

/* ------------------------------------------------------------------ */
/*  FileAttachmentView — React NodeView                                */
/* ------------------------------------------------------------------ */
function FileAttachmentView({ node, selected }) {
    const { src, fileName, fileSize, mimeType, addedBy, addedByColor, addedAt } = node.attrs;
    const icon = getFileIcon(mimeType, fileName);
    const size = formatFileSize(fileSize);
    const addedAtText = formatTimestamp(addedAt);

    const handleDownload = (event) => {
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

    return (
        <NodeViewWrapper
            as="span"
            className={`file-attachment ${selected ? "selected" : ""}`}
            data-drag-handle
        >
            <span className="file-attachment-card">
                <span className="file-attachment-icon">
                    <i className={icon} />
                </span>
                <span className="file-attachment-info">
                    <span className="file-attachment-name">
                        {fileName || "Unknown file"}
                    </span>
                    <span className="file-attachment-meta">
                        {size && <span>{size}</span>}
                        {addedBy && (
                            <span className="file-attachment-author">
                                <span
                                    className="file-attachment-author-dot"
                                    style={addedByColor ? { background: addedByColor } : undefined}
                                />
                                Added by {addedBy}
                                {addedAtText ? ` • ${addedAtText}` : ""}
                            </span>
                        )}
                    </span>
                </span>
                <button
                    type="button"
                    className="file-attachment-download"
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={handleDownload}
                    title={fileName ? `Download ${fileName}` : "Download file"}
                    aria-label={fileName ? `Download ${fileName}` : "Download file"}
                >
                    <i className="fa-solid fa-download" />
                </button>
            </span>
        </NodeViewWrapper>
    );
}

/* ------------------------------------------------------------------ */
/*  FileAttachment — TipTap Node Extension                             */
/* ------------------------------------------------------------------ */
const FileAttachment = Node.create({
    name: "fileAttachment",

    group: "block",
    atom: true,
    draggable: true,
    marks: "",

    addAttributes() {
        return {
            src: { default: null },
            fileName: { default: null },
            fileSize: { default: null },
            mimeType: { default: null },
            addedBy: {
                default: null,
                parseHTML: (el) => el.getAttribute("data-added-by"),
                renderHTML: (attrs) =>
                    attrs.addedBy ? { "data-added-by": attrs.addedBy } : {},
            },
            addedByColor: {
                default: null,
                parseHTML: (el) => el.getAttribute("data-added-by-color"),
                renderHTML: (attrs) =>
                    attrs.addedByColor ? { "data-added-by-color": attrs.addedByColor } : {},
            },
            addedAt: {
                default: null,
                parseHTML: (el) => el.getAttribute("data-added-at"),
                renderHTML: (attrs) =>
                    attrs.addedAt ? { "data-added-at": attrs.addedAt } : {},
            },
        };
    },

    parseHTML() {
        return [
            { tag: 'div[data-file-attachment]' },
            { tag: 'span[data-file-attachment]' },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        const extraAttrs = {};
        if (HTMLAttributes.addedBy) extraAttrs["data-added-by"] = HTMLAttributes.addedBy;
        if (HTMLAttributes.addedByColor) extraAttrs["data-added-by-color"] = HTMLAttributes.addedByColor;
        if (HTMLAttributes.addedAt) extraAttrs["data-added-at"] = HTMLAttributes.addedAt;

        return [
            "span",
            mergeAttributes(HTMLAttributes, {
                "data-file-attachment": "",
                class: "file-attachment-card",
                ...extraAttrs,
            }),
            HTMLAttributes.fileName || "File",
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(FileAttachmentView);
    },

    addCommands() {
        return {
            setFileAttachment:
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

export default FileAttachment;
