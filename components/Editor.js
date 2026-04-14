"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { Mark, Extension } from "@tiptap/core";
import { Plugin, PluginKey, TextSelection } from "@tiptap/pm/state";
import { Fragment, Slice } from "@tiptap/pm/model";
import { dropPoint } from "@tiptap/pm/transform";
import StarterKit from "@tiptap/starter-kit";
import ResizableImage from "@/components/ResizableImage";
import FileAttachment from "@/components/FileAttachment";
import Placeholder from "@tiptap/extension-placeholder";
import Collaboration from "@tiptap/extension-collaboration";
import { TextStyle, FontFamily, FontSize } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Paragraph from "@tiptap/extension-paragraph";
import * as Y from "yjs";
import ReactDOM from "react-dom";
import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import pako from "pako";
import { encryptToBase64, decryptFromBase64 } from "@/lib/crypto";

/* ------------------------------------------------------------------ */
/*  AuthorHighlight Mark                                               */
/*  Stores author name + color per text span, rendered as a colored    */
/*  underline with a hover tooltip showing the author name.            */
/* ------------------------------------------------------------------ */
const AuthorHighlight = Mark.create({
    name: "authorHighlight",

    // Keep multiple author marks from different users side-by-side
    // but only one per text range.
    excludes: "authorHighlight",

    addAttributes() {
        return {
            color: {
                default: null,
                parseHTML: (el) => el.getAttribute("data-author-color"),
                renderHTML: (attrs) =>
                    attrs.color ? { "data-author-color": attrs.color } : {},
            },
            name: {
                default: null,
                parseHTML: (el) => el.getAttribute("data-author-name"),
                renderHTML: (attrs) =>
                    attrs.name ? { "data-author-name": attrs.name } : {},
            },
        };
    },

    parseHTML() {
        return [{ tag: "span[data-author-name]" }];
    },

    renderHTML({ HTMLAttributes }) {
        const color = HTMLAttributes["data-author-color"] || "transparent";
        return [
            "span",
            {
                ...HTMLAttributes,
                class: "author-highlight",
                style: `border-bottom-color: ${color}`,
            },
            0,
        ];
    },
});

const ParagraphWithSpacing = Paragraph.extend({
    addAttributes() {
        return {
            ...(this.parent?.() || {}),
            lineHeight: {
                default: null,
                parseHTML: (element) => element.getAttribute("data-line-height"),
                renderHTML: (attrs) =>
                    attrs.lineHeight
                        ? { "data-line-height": String(attrs.lineHeight) }
                        : {},
            },
            noSpaceAfter: {
                default: true,
                parseHTML: (element) => {
                    const raw = element.getAttribute("data-no-space-after");
                    if (raw === null) return true;
                    return raw === "true";
                },
                renderHTML: (attrs) => ({
                    "data-no-space-after": attrs.noSpaceAfter ? "true" : "false",
                }),
            },
        };
    },
});

/* ------------------------------------------------------------------ */
/*  Author Track Plugin Key                                            */
/* ------------------------------------------------------------------ */
const authorTrackKey = new PluginKey("authorTrack");
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
    "32",
];
const MENU_LINE_SPACING_OPTIONS = [
    { label: "Default", value: "default" },
    { label: "Single (1.0)", value: "1" },
    { label: "1.15", value: "1.15" },
    { label: "1.5", value: "1.5" },
    { label: "Double (2.0)", value: "2" },
];
const MENU_HIGHLIGHT_COLORS = [
    "#fff59d",
    "#ffd54f",
    "#ffccbc",
    "#f8bbd0",
    "#d1c4e9",
    "#b2dfdb",
    "#c5e1a5",
    "#bbdefb",
];

function isLocalEditorDocTransaction(transaction) {
    if (!transaction) return false;
    if (transaction.getMeta("remote")) return false;

    const ySyncMeta = transaction.getMeta("y-sync$");
    const isRemoteYjsOrigin =
        Boolean(ySyncMeta) &&
        typeof ySyncMeta === "object" &&
        ySyncMeta.isChangeOrigin === true;

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
    return getInsertPosAfterSelectedMediaSelection(
        editorInstance?.state?.selection
    );
}

function parseIntSafe(value) {
    const parsed = Number.parseInt(String(value ?? ""), 10);
    return Number.isInteger(parsed) ? parsed : null;
}

function readDraggedImagePosFromEvent(event) {
    const fromTransfer = parseIntSafe(
        event?.dataTransfer?.getData(IMAGE_DRAG_MIME)
    );
    if (fromTransfer !== null) return fromTransfer;

    if (typeof window !== "undefined") {
        const fromWindow = parseIntSafe(window[IMAGE_DRAG_FALLBACK_KEY]);
        if (fromWindow !== null) return fromWindow;
    }

    return null;
}

function clearDraggedImagePos() {
    if (typeof window !== "undefined") {
        delete window[IMAGE_DRAG_FALLBACK_KEY];
    }
}

function getDropPosNearTargetImage(view, event) {
    if (!event?.target || typeof view?.posAtDOM !== "function") return null;

    const targetEl =
        typeof event.target.closest === "function"
            ? event.target.closest(".resizable-image-wrapper")
            : null;
    if (!targetEl) return null;

    try {
        const targetPos = view.posAtDOM(targetEl, 0);
        const targetNode = view.state.doc.nodeAt(targetPos);
        if (targetNode?.type?.name !== "image") return null;

        const rect = targetEl.getBoundingClientRect();
        const placeAfter = event.clientX >= rect.left + rect.width / 2;
        return placeAfter ? targetPos + targetNode.nodeSize : targetPos;
    } catch {
        return null;
    }
}

/* ------------------------------------------------------------------ */
/*  createAuthorTrackExtension                                         */
/*  ProseMirror plugin that automatically marks every locally-typed    */
/*  character with the current user's identity — like Google Docs      */
/*  authorship tracking.                                               */
/*                                                                     */
/*  Strategy:                                                          */
/*   1. appendTransaction detects local doc changes, finds the         */
/*      inserted text ranges via step maps, maps them to the final     */
/*      document, and applies the authorHighlight mark.                */
/*   2. Also keeps storedMarks primed so the NEXT character typed      */
/*      gets the mark even if appendTransaction can't retroactively    */
/*      catch it (e.g. composition/IME input).                         */
/* ------------------------------------------------------------------ */
function createAuthorTrackExtension(authorName, authorColor) {
    return Extension.create({
        name: "authorTrack",

        addProseMirrorPlugins() {
            return [
                new Plugin({
                    key: authorTrackKey,

                    appendTransaction(transactions, oldState, newState) {
                        try {
                            const markType =
                                newState.schema.marks.authorHighlight;
                            if (!markType) return null;

                            /* ---- detect local doc-changing transactions ---- */
                            const isTrackedLocalTransaction = (tr) => {
                                const ySyncMeta = tr.getMeta("y-sync$");
                                const isChangeOrigin =
                                    Boolean(ySyncMeta) &&
                                    typeof ySyncMeta === "object" &&
                                    ySyncMeta.isChangeOrigin === true;

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

                            const localDocTrs = transactions.filter(
                                (tr) =>
                                    tr.docChanged &&
                                    isTrackedLocalTransaction(tr)
                            );

                            /* ---- bail out when inserted slices contain atom nodes ---- */
                            /* Inserting atom nodes (images/file attachments/etc.) must not */
                            /* trigger addMark from this plugin, or collaborative state can */
                            /* occasionally lose that atom insertion under heavy sync load. */
                            if (localDocTrs.length) {
                                const fragmentHasAtomNode = (fragment) => {
                                    let hasAtomNode = false;
                                    fragment.forEach((node) => {
                                        if (hasAtomNode) return;
                                        if (node.isAtom) {
                                            hasAtomNode = true;
                                            return;
                                        }
                                        if (node.content?.size > 0) {
                                            hasAtomNode = fragmentHasAtomNode(
                                                node.content
                                            );
                                        }
                                    });
                                    return hasAtomNode;
                                };

                                let hasInsertedAtomNode = false;
                                for (const t of localDocTrs) {
                                    for (let i = 0; i < t.steps.length; i++) {
                                        const step = t.steps[i];
                                        const slice = step.slice;
                                        if (slice && slice.content && slice.content.size > 0) {
                                            hasInsertedAtomNode = fragmentHasAtomNode(
                                                slice.content
                                            );
                                        }
                                    }
                                    if (hasInsertedAtomNode) break;
                                }
                                if (hasInsertedAtomNode) return null;
                            }

                            const hasLocalActivity = transactions.some(
                                (tr) => isTrackedLocalTransaction(tr)
                            );

                            const authorMark = markType.create({
                                color: authorColor,
                                name: authorName,
                            });

                            const tr = newState.tr;
                            let changed = false;
                            const addAuthorMarkToRange = (from, to) => {
                                const docSize = newState.doc.content.size;
                                const safeFrom = Math.max(0, Math.min(from, docSize));
                                const safeTo = Math.max(0, Math.min(to, docSize));
                                if (safeTo <= safeFrom) return;

                                newState.doc.nodesBetween(
                                    safeFrom,
                                    safeTo,
                                    (node, pos) => {
                                        if (node.isAtom) return false;
                                        if (node.isLeaf && !node.isText) return false;
                                        if (!node.isText) return;

                                        const textFrom = Math.max(
                                            safeFrom,
                                            pos
                                        );
                                        const textTo = Math.min(
                                            safeTo,
                                            pos + node.nodeSize
                                        );
                                        if (textTo <= textFrom) return;

                                        tr.addMark(
                                            textFrom,
                                            textTo,
                                            authorMark
                                        );
                                        changed = true;
                                    }
                                );
                            };

                            /* ---- retroactively mark inserted text ---- */
                            if (localDocTrs.length) {
                                const allMaps = [];
                                const localStepIndices = new Set();
                                let idx = 0;

                                for (const t of transactions) {
                                    const isLocal = localDocTrs.includes(t);
                                    for (
                                        let i = 0;
                                        i < t.steps.length;
                                        i++, idx++
                                    ) {
                                        allMaps.push(t.steps[i].getMap());
                                        if (isLocal) localStepIndices.add(idx);
                                    }
                                }

                                idx = 0;
                                for (const t of transactions) {
                                    for (
                                        let i = 0;
                                        i < t.steps.length;
                                        i++, idx++
                                    ) {
                                        if (!localStepIndices.has(idx)) continue;

                                        t.steps[i]
                                            .getMap()
                                            .forEach(
                                                (
                                                    _oldStart,
                                                    _oldEnd,
                                                    newStart,
                                                    newEnd
                                                ) => {
                                                    if (newEnd <= newStart)
                                                        return;

                                                    let from = newStart;
                                                    let to = newEnd;
                                                    for (
                                                        let j = idx + 1;
                                                        j < allMaps.length;
                                                        j++
                                                    ) {
                                                        from = allMaps[j].map(
                                                            from,
                                                            1
                                                        );
                                                        to = allMaps[j].map(
                                                            to,
                                                            -1
                                                        );
                                                    }
                                                    addAuthorMarkToRange(from, to);
                                                }
                                            );
                                    }
                                }

                                // Fallback for paste/import transactions where
                                // step-map range detection can miss inserted
                                // text spans. Diff is calculated in newState
                                // coordinates.
                                if (!changed) {
                                    const diffStart =
                                        newState.doc.content.findDiffStart(
                                            oldState.doc.content
                                        );
                                    if (typeof diffStart === "number") {
                                        const diffEnd =
                                            newState.doc.content.findDiffEnd(
                                                oldState.doc.content
                                            );
                                        const diffTo = diffEnd
                                            ? diffEnd.a
                                            : newState.doc.content.size;
                                        addAuthorMarkToRange(
                                            diffStart,
                                            diffTo
                                        );
                                    }
                                }
                            }

                            /* ---- keep storedMarks primed for next input ---- */
                            if (
                                hasLocalActivity &&
                                newState.selection.empty
                            ) {
                                const currentMarks =
                                    newState.storedMarks ||
                                    newState.selection.$from.marks();
                                const existing = currentMarks.find(
                                    (m) => m.type === markType
                                );
                                if (
                                    !existing ||
                                    existing.attrs.color !== authorColor ||
                                    existing.attrs.name !== authorName
                                ) {
                                    const others = currentMarks.filter(
                                        (m) => m.type !== markType
                                    );
                                    tr.setStoredMarks([
                                        ...others,
                                        authorMark,
                                    ]);
                                    changed = true;
                                }
                            }

                            if (!changed) return null;
                            tr.setMeta("authorTrack", true);
                            return tr;
                        } catch (err) {
                            console.warn(
                                "[authorTrack] appendTransaction error:",
                                err
                            );
                            return null;
                        }
                    },
                }),
            ];
        },
    });
}

function decodeBase64Bytes(input) {
    const binary = atob(input);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
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
        return Uint8Array.from(
            trimmed.split(",").map((value) => {
                const parsed = Number(value);
                if (!Number.isInteger(parsed) || parsed < 0 || parsed > 255) {
                    throw new Error("Invalid byte value in legacy payload.");
                }
                return parsed;
            })
        );
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
            return Uint8Array.from(
                trimmed.split(",").map((value) => Number.parseInt(value, 10))
            );
        }

        try {
            return decodeBase64Bytes(trimmed);
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
                return decodeBase64Bytes(input.base64);
            } catch {
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
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Failed to read file."));
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

export default function Editor({
    socket,
    roomId,
    pageId,
    userId,
    userName,
    userColor,
    roomKey,
    onContentChange,
    onSessionExpired,
    editorBg,
    fontColor,
    showLineNumbers = false,
    onChangeShowLineNumbers,
    externalYDoc,
}) {
    const saveTimerRef = useRef(null);
    const ydocRef = useRef(null);
    const providerReadyRef = useRef(false);
    const initialContentLoadedRef = useRef(false);
    const userInteractedRef = useRef(false);
    const ydocActivityRef = useRef(false);
    const typingTimerRef = useRef(null);
    const typingRafRef = useRef(null);
    const lastTypingEmitRef = useRef(0);
    const editorRef = useRef(null);
    const savedSelectionRef = useRef(null);
    const contextMenuRef = useRef(null);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({
        top: 0,
        left: 0,
    });
    const [activeFontSize, setActiveFontSize] = useState("default");
    const [activeLineSpacing, setActiveLineSpacing] = useState("default");
    const [activeNoSpaceAfter, setActiveNoSpaceAfter] = useState(true);
    const [activeHighlightColor, setActiveHighlightColor] = useState(
        DEFAULT_HIGHLIGHT_COLOR
    );

    // Use an externally-cached Yjs document when provided so that
    // switching back to a previously-visited page is instant (the
    // document already contains the full editing state).
    if (!ydocRef.current) {
        ydocRef.current = externalYDoc || new Y.Doc();
    }
    const ydoc = ydocRef.current;

    // Insert files (images + non-image attachments) using TipTap commands
    // so block-node schema constraints are handled automatically.
    const insertFiles = useCallback(async (files, dropPos) => {
        const ed = editorRef.current;
        if (!ed) return;

        const allFiles = Array.from(files || []);
        if (!allFiles.length) return;

        const contentToInsert = [];

        for (const file of allFiles) {
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
                            width: DEFAULT_IMAGE_INSERT_WIDTH,
                        },
                    });
                } else {
                    const attachmentAttrs = {
                        src,
                        fileName: file.name,
                        fileSize: file.size,
                        mimeType: file.type,
                        addedBy: userName || null,
                        addedByColor: userColor || null,
                        addedAt: new Date().toISOString(),
                    };

                    contentToInsert.push({
                        type: "fileAttachment",
                        attrs: attachmentAttrs,
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
    }, [userName, userColor]);

    const authorTrackExt = useMemo(
        () =>
            userName && userColor
                ? createAuthorTrackExtension(userName, userColor)
                : null,
        [userName, userColor]
    );

    const editorExtensions = useMemo(
        () => [
            StarterKit.configure({
                // Collaboration provides its own undo/redo history manager.
                undoRedo: false,
                paragraph: false,
            }),
            ParagraphWithSpacing,
            TextStyle,
            Color,
            FontFamily,
            FontSize,
            Highlight.configure({
                multicolor: true,
            }),
            ResizableImage,
            FileAttachment,
            Placeholder.configure({
                placeholder:
                    "Start writing...",
            }),
            AuthorHighlight,
            Collaboration.configure({
                document: ydoc,
            }),
            ...(authorTrackExt ? [authorTrackExt] : []),
        ],
        [ydoc, authorTrackExt]
    );

    const editor = useEditor({
        immediatelyRender: false,
        shouldRerenderOnTransaction: false,
        extensions: editorExtensions,
        onTransaction: ({ transaction }) => {
            if (transaction.docChanged && isLocalEditorDocTransaction(transaction)) {
                userInteractedRef.current = true;
            }
        },
        editorProps: {
            attributes: {
                class: "tiptap",
            },
            handleKeyDown: (view, event) => {
                const selection = view.state.selection;
                const selectedNode = selection?.node;
                if (!selectedNode) return false;

                const selectedNodeType = selectedNode.type?.name;
                const isUploadNode =
                    selectedNodeType === "image" ||
                    selectedNodeType === "fileAttachment";

                if (!isUploadNode) return false;

                const isSpace =
                    event.key === " " ||
                    event.key === "Spacebar" ||
                    event.code === "Space";
                const isBackspace = event.key === "Backspace";
                const isDelete = event.key === "Delete";
                const hasModifierKey =
                    event.ctrlKey || event.metaKey || event.altKey;
                const isPlainTypingKey =
                    event.key.length === 1 &&
                    !hasModifierKey &&
                    !isSpace;

                if ((isBackspace || isDelete) && !hasModifierKey) {
                    event.preventDefault();

                    // Backspace on selected image should reduce visual left gap
                    // first, not remove the image node.
                    if (selectedNodeType === "image") {
                        const pos = selection.from;
                        const currentLeading = Math.max(
                            0,
                            Number(selectedNode.attrs?.leadingSpace || 0)
                        );
                        const currentOffsetX = Number(
                            selectedNode.attrs?.offsetX || 0
                        );
                        const step = event.shiftKey ? 20 : 8;

                        if (isBackspace) {
                            const nextLeading = Math.max(currentLeading - 1, 0);
                            const nextOffsetX =
                                nextLeading < currentLeading
                                    ? currentOffsetX
                                    : Math.max(currentOffsetX - step, 0);

                            if (
                                nextLeading !== currentLeading ||
                                nextOffsetX !== currentOffsetX
                            ) {
                                view.dispatch(
                                    view.state.tr
                                        .setNodeMarkup(pos, undefined, {
                                            ...selectedNode.attrs,
                                            leadingSpace: nextLeading,
                                            offsetX: nextOffsetX,
                                        })
                                        .scrollIntoView()
                                );
                            }
                            return true;
                        }

                        // Delete nudges negatively-shifted images back toward zero.
                        if (isDelete && currentOffsetX < 0) {
                            const nextOffsetX = Math.min(currentOffsetX + step, 0);
                            view.dispatch(
                                view.state.tr
                                    .setNodeMarkup(pos, undefined, {
                                        ...selectedNode.attrs,
                                        offsetX: nextOffsetX,
                                    })
                                    .scrollIntoView()
                            );
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
                    const currentLeading = Math.max(
                        0,
                        Number(selectedNode.attrs?.leadingSpace || 0)
                    );
                    const nextLeading = Math.min(currentLeading + 1, 120);

                    view.dispatch(
                        view.state.tr
                            .setNodeMarkup(pos, undefined, {
                                ...selectedNode.attrs,
                                leadingSpace: nextLeading,
                            })
                            .scrollIntoView()
                    );
                    return true;
                }

                if (!isPlainTypingKey && !isSpace) return false;

                event.preventDefault();

                const posAfterNode = selection.to;
                let tr = view.state.tr.setSelection(
                    TextSelection.create(view.state.doc, posAfterNode)
                );

                tr = tr.insertText(isSpace ? " " : event.key);
                view.dispatch(tr.scrollIntoView());
                return true;
            },
            handlePaste: (view, event) => {
                const insertPos = getInsertPosAfterSelectedMediaSelection(
                    view.state.selection
                );
                if (typeof insertPos === "number") {
                    view.dispatch(
                        view.state.tr.setSelection(
                            TextSelection.create(view.state.doc, insertPos)
                        )
                    );
                }

                const files = Array.from(event?.clipboardData?.files || []);
                const imageFilesFromItems = Array.from(
                    event?.clipboardData?.items || []
                )
                    .filter(
                        (item) =>
                            item &&
                            item.kind === "file" &&
                            typeof item.type === "string" &&
                            item.type.startsWith("image/")
                    )
                    .map((item) => item.getAsFile())
                    .filter(Boolean);

                const allFiles = [
                    ...files,
                    ...imageFilesFromItems.filter(
                        (candidate) =>
                            !files.some(
                                (existing) =>
                                    existing.name === candidate.name &&
                                    existing.size === candidate.size &&
                                    existing.type === candidate.type
                            )
                    ),
                ];

                if (!allFiles.length) return false;

                event.preventDefault();
                void insertFiles(allFiles);
                return true;
            },
            handleDrop: (view, event) => {
                const imageDragSourcePos = readDraggedImagePosFromEvent(event);

                if (Number.isInteger(imageDragSourcePos)) {
                    const sourceNode = view.state.doc.nodeAt(imageDragSourcePos);
                    const sourceNodeIsImage =
                        sourceNode?.type?.name === "image";
                    const dropPosFromCoords = view.posAtCoords({
                        left: event.clientX,
                        top: event.clientY,
                    })?.pos;
                    const dropPosFromTarget = getDropPosNearTargetImage(
                        view,
                        event
                    );
                    const dropPos =
                        typeof dropPosFromTarget === "number"
                            ? dropPosFromTarget
                            : dropPosFromCoords;

                    if (
                        sourceNodeIsImage &&
                        typeof dropPos === "number"
                    ) {
                        event.preventDefault();
                        event.stopPropagation();

                        const sourceFrom = imageDragSourcePos;
                        const sourceTo = sourceFrom + sourceNode.nodeSize;
                        if (dropPos >= sourceFrom && dropPos <= sourceTo) {
                            return true;
                        }

                        const imageSlice = new Slice(
                            Fragment.from(sourceNode),
                            0,
                            0
                        );
                        let tr = view.state.tr.delete(sourceFrom, sourceTo);
                        const mappedDropPos = tr.mapping.map(dropPos, -1);
                        const insertPos = dropPoint(
                            tr.doc,
                            mappedDropPos,
                            imageSlice
                        );

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
                    top: event.clientY,
                })?.pos;

                void insertFiles(files, dropPos);
                return true;
            },
        },
    });

    // Keep editorRef in sync so insertFiles can use TipTap commands.
    useEffect(() => {
        editorRef.current = editor;
    }, [editor]);

    useEffect(() => {
        if (!editor) {
            setActiveFontSize("default");
            setActiveLineSpacing("default");
            setActiveNoSpaceAfter(true);
            setActiveHighlightColor(DEFAULT_HIGHLIGHT_COLOR);
            return;
        }

        const syncContextTypography = () => {
            const textStyleAttrs = editor.getAttributes("textStyle") || {};
            const normalizedSize = normalizeFontSize(textStyleAttrs.fontSize);
            setActiveFontSize(
                MENU_FONT_SIZES.includes(normalizedSize)
                    ? normalizedSize
                    : "default"
            );

            const paragraphAttrs = editor.getAttributes("paragraph") || {};
            const lineHeightValue = String(
                paragraphAttrs.lineHeight || "default"
            );
            const knownLineHeight = MENU_LINE_SPACING_OPTIONS.some(
                (option) => option.value === lineHeightValue
            )
                ? lineHeightValue
                : "default";
            setActiveLineSpacing(knownLineHeight);
            setActiveNoSpaceAfter(Boolean(paragraphAttrs.noSpaceAfter));

            const highlightAttrs = editor.getAttributes("highlight") || {};
            if (typeof highlightAttrs.color === "string" && highlightAttrs.color) {
                setActiveHighlightColor(highlightAttrs.color);
            } else if (editor.isActive("highlight")) {
                setActiveHighlightColor(DEFAULT_HIGHLIGHT_COLOR);
            }
        };

        syncContextTypography();
        editor.on("selectionUpdate", syncContextTypography);
        editor.on("transaction", syncContextTypography);

        return () => {
            editor.off("selectionUpdate", syncContextTypography);
            editor.off("transaction", syncContextTypography);
        };
    }, [editor]);

    const closeContextMenu = useCallback(() => {
        setShowContextMenu(false);
    }, []);

    const getSavedSelectionRange = useCallback(() => {
        if (!editor) return null;

        const saved = savedSelectionRef.current;
        if (
            saved &&
            Number.isInteger(saved.from) &&
            Number.isInteger(saved.to)
        ) {
            return { from: saved.from, to: saved.to };
        }

        const { from, to } = editor.state.selection;
        return { from, to };
    }, [editor]);

    const withSavedSelection = useCallback(
        (chain) => {
            const sel = savedSelectionRef.current;
            if (
                sel &&
                Number.isInteger(sel.from) &&
                Number.isInteger(sel.to)
            ) {
                chain.setTextSelection(sel);
            }
            return chain;
        },
        []
    );

    const handleContextMenu = useCallback(
        (event) => {
            if (!editor) return;
            event.preventDefault();

            const { from, to } = editor.state.selection;
            savedSelectionRef.current = { from, to };

            const menuWidth = 320;
            const menuHeight = 620;
            const nextLeft = Math.min(
                event.clientX,
                window.innerWidth - menuWidth - 8
            );
            const nextTop = Math.min(
                event.clientY,
                window.innerHeight - menuHeight - 8
            );

            setContextMenuPosition({
                left: Math.max(8, nextLeft),
                top: Math.max(8, nextTop),
            });
            setShowContextMenu(true);
        },
        [editor]
    );

    const runFormatCommand = useCallback(
        (runner) => {
            if (!editor) return;
            const chain = withSavedSelection(editor.chain().focus());
            runner(chain);
            chain.run();
        },
        [editor, withSavedSelection]
    );

    const applyContextFontSize = useCallback(
        (fontSizeValue) => {
            runFormatCommand((chain) => {
                if (fontSizeValue === "default") {
                    chain.unsetFontSize();
                } else {
                    chain.setFontSize(`${fontSizeValue}px`);
                }
            });
            setActiveFontSize(fontSizeValue);
        },
        [runFormatCommand]
    );

    const applyContextLineSpacing = useCallback(
        (lineSpacingValue) => {
            runFormatCommand((chain) => {
                chain.updateAttributes("paragraph", {
                    lineHeight:
                        lineSpacingValue === "default" ? null : lineSpacingValue,
                });
            });
            setActiveLineSpacing(lineSpacingValue);
        },
        [runFormatCommand]
    );

    const toggleContextParagraphSpace = useCallback(() => {
        const nextNoSpace = !activeNoSpaceAfter;
        runFormatCommand((chain) => {
            chain.updateAttributes("paragraph", {
                noSpaceAfter: nextNoSpace,
            });
        });
        setActiveNoSpaceAfter(nextNoSpace);
    }, [activeNoSpaceAfter, runFormatCommand]);

    const toggleContextHighlight = useCallback(() => {
        if (!editor) return;
        runFormatCommand((chain) => {
            if (editor.isActive("highlight")) {
                chain.unsetHighlight();
            } else {
                chain.setHighlight({
                    color: activeHighlightColor || DEFAULT_HIGHLIGHT_COLOR,
                });
            }
        });
    }, [editor, runFormatCommand, activeHighlightColor]);

    const applyContextHighlightColor = useCallback(
        (colorValue) => {
            const nextColor = colorValue || DEFAULT_HIGHLIGHT_COLOR;
            setActiveHighlightColor(nextColor);

            runFormatCommand((chain) => {
                chain.setHighlight({ color: nextColor });
            });
        },
        [runFormatCommand]
    );

    const clearContextFormatting = useCallback(() => {
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
            const preserved = currentMarks.filter(
                (mark) => mark.type.name === "authorHighlight"
            );
            tr.setStoredMarks(preserved);
            editor.view.dispatch(tr);
            return;
        }

        // Remove all inline formatting marks from selected text, but preserve
        // authorship metadata used for collaborator attribution.
        Object.values(state.schema.marks).forEach((markType) => {
            if (markType.name === "authorHighlight") return;
            tr.removeMark(from, to, markType);
        });

        editor.view.dispatch(tr.scrollIntoView());
    }, [editor, getSavedSelectionRange]);

    const deleteContextSelection = useCallback(() => {
        const range = getSavedSelectionRange();
        if (!range || range.from === range.to) return;

        runFormatCommand((chain) => {
            chain.deleteSelection();
        });
    }, [getSavedSelectionRange, runFormatCommand]);

    const handleClipboardAction = useCallback(
        async (action) => {
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
        },
        [editor, closeContextMenu]
    );

    useEffect(() => {
        if (!showContextMenu) return;

        const handlePointerDown = (event) => {
            const target = event.target;
            if (
                contextMenuRef.current &&
                !contextMenuRef.current.contains(target)
            ) {
                setShowContextMenu(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setShowContextMenu(false);
            }
        };

        const handleWindowResize = () => {
            setShowContextMenu(false);
        };

        document.addEventListener("mousedown", handlePointerDown, true);
        window.addEventListener("keydown", handleEscape);
        window.addEventListener("resize", handleWindowResize);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown, true);
            window.removeEventListener("keydown", handleEscape);
            window.removeEventListener("resize", handleWindowResize);
        };
    }, [showContextMenu]);

    // Auto-save: encode Yjs state -> compress -> encrypt -> POST
    const autoSave = useCallback(async () => {
        try {
            if (onContentChange) onContentChange(true);

            const state = Y.encodeStateAsUpdate(ydoc);
            const compressed = pako.deflate(state);

            let payload;
            if (roomKey) {
                payload = await encryptToBase64(compressed, roomKey);
            } else {
                let binary = "";
                for (let i = 0; i < compressed.length; i++) {
                    binary += String.fromCharCode(compressed[i]);
                }
                payload = btoa(binary);
            }

            const res = await fetch(`/api/rooms/${roomId}/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    compressedContent: payload,
                    userId,
                    pageId: pageId || null,
                }),
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
    }, [roomId, userId, roomKey, onContentChange, onSessionExpired, ydoc, pageId]);

    useEffect(() => {
        const markActivity = () => {
            ydocActivityRef.current = true;
        };
        ydoc.on("update", markActivity);
        return () => {
            ydoc.off("update", markActivity);
        };
    }, [ydoc]);

    useEffect(() => {
        const handler = (_update, origin) => {
            if (!providerReadyRef.current) return;
            if (origin === REMOTE_SOCKET_ORIGIN) return;
            if (!userInteractedRef.current) return;
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
            saveTimerRef.current = setTimeout(autoSave, 5000);
        };
        ydoc.on("update", handler);
        return () => ydoc.off("update", handler);
    }, [ydoc, autoSave]);

    useEffect(() => {
        if (!socket || !roomId || !userId) return;

        const emitLocalUpdate = (update, origin) => {
            // Prevent rebroadcast loops for updates applied from socket events.
            if (origin === REMOTE_SOCKET_ORIGIN) return;

            // Send Uint8Array directly — Socket.IO handles binary
            // encoding natively (much smaller than Array.from JSON).
            socket.emit("yjs-update", {
                roomId,
                pageId: pageId || null,
                update: new Uint8Array(update),
                user: { userId },
            });
        };

        const applyRemoteUpdate = (payload) => {
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
                Y.applyUpdate(
                    ydoc,
                    normalized,
                    REMOTE_SOCKET_ORIGIN
                );
            } catch (err) {
                console.warn("Failed to apply remote Yjs update:", err);
            }
        };

        const requestState = () => {
            socket.emit("yjs-request-state", { roomId, pageId: pageId || null });
        };

        ydoc.on("update", emitLocalUpdate);
        socket.on("yjs-update", applyRemoteUpdate);
        socket.on("yjs-sync", applyRemoteUpdate);
        socket.on("connect", requestState);

        if (socket.connected) {
            requestState();
        }

        return () => {
            ydoc.off("update", emitLocalUpdate);
            socket.off("yjs-update", applyRemoteUpdate);
            socket.off("yjs-sync", applyRemoteUpdate);
            socket.off("connect", requestState);
        };
    }, [socket, roomId, userId, ydoc, pageId]);

    useEffect(() => {
        if (!editor || !socket || !roomId || !userId) return;

        const markTyping = () => {
            const now =
                typeof performance !== "undefined" ? performance.now() : Date.now();
            if (
                !lastTypingEmitRef.current ||
                now - lastTypingEmitRef.current >= TYPING_STATUS_THROTTLE_MS
            ) {
                socket.emit("typing-status", { roomId, userId, isTyping: true });
                lastTypingEmitRef.current = now;
            }

            if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
            typingTimerRef.current = setTimeout(() => {
                socket.emit("typing-status", { roomId, userId, isTyping: false });
            }, 1200);
        };

        const onTransaction = ({ transaction }) => {
            if (!transaction.docChanged) return;
            if (!isLocalEditorDocTransaction(transaction)) return;

            if (typingRafRef.current) return;
            typingRafRef.current = requestAnimationFrame(() => {
                typingRafRef.current = null;
                markTyping();
            });
        };

        editor.on("transaction", onTransaction);

        return () => {
            editor.off("transaction", onTransaction);
            if (typingRafRef.current) {
                cancelAnimationFrame(typingRafRef.current);
                typingRafRef.current = null;
            }
            if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
            socket.emit("typing-status", { roomId, userId, isTyping: false });
        };
    }, [editor, socket, roomId, userId]);

    // Load initial content from DB once.
    useEffect(() => {
        if (!ydoc || !roomId || !userId || !editor) return;
        if (initialContentLoadedRef.current) return;
        initialContentLoadedRef.current = true;

        // If the Yjs doc already has content (e.g. from cache), mark as
        // ready immediately and skip the network fetch entirely.
        const hasRuntimeState = Y.encodeStateAsUpdate(ydoc).length > 2;
        if (hasRuntimeState) {
            providerReadyRef.current = true;
            return;
        }

        let cancelled = false;

        const loadContent = async () => {
            try {
                const res = await fetch(
                    `/api/rooms/${roomId}/save${pageId ? `?pageId=${pageId}` : ""}`
                );
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

                const hasRuntimeState =
                    Y.encodeStateAsUpdate(ydoc).length > 2;
                if (hasRuntimeState) {
                    return;
                }

                if (data.compressedContent) {
                    let decompressed;

                    if (roomKey) {
                        try {
                            const decrypted = await decryptFromBase64(
                                data.compressedContent,
                                roomKey
                            );
                            decompressed = pako.inflate(decrypted);
                        } catch {
                            // Fallback: previously saved without encryption.
                            decompressed = pako.inflate(
                                decodeStoredContent(data.compressedContent)
                            );
                        }
                    } else {
                        decompressed = pako.inflate(
                            decodeStoredContent(data.compressedContent)
                        );
                    }

                    // Apply only valid Yjs content to avoid destructive restores.
                    try {
                        Y.applyUpdate(ydoc, decompressed);
                    } catch (syncErr) {
                        console.warn(
                            "Skipping non-Yjs legacy content restore.",
                            syncErr
                        );
                    }
                }
            } catch (err) {
                console.error("Failed to load content:", err);
            } finally {
                if (!cancelled) {
                    providerReadyRef.current = true;
                }
            }
        };

        loadContent();

        return () => {
            cancelled = true;
        };
    }, [ydoc, editor, roomId, userId, roomKey, onSessionExpired]);

    useEffect(() => {
        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
            if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
            if (typingRafRef.current) cancelAnimationFrame(typingRafRef.current);
        };
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        if (editor) {
            window.__tiptapEditor = editor;
            window.dispatchEvent(new CustomEvent("teamnote-editor-ready"));
            return;
        }

        if (window.__tiptapEditor) {
            window.__tiptapEditor = null;
            window.dispatchEvent(new CustomEvent("teamnote-editor-ready"));
        }
    }, [editor]);

    return (
        <>
            <div
                className={`editor-content ${showLineNumbers ? "show-line-numbers" : ""}`}
                style={{
                    ...(editorBg ? { background: editorBg } : {}),
                    ...(fontColor ? { color: fontColor } : {}),
                }}
                onContextMenu={handleContextMenu}
            >
                <EditorContent editor={editor} />
            </div>

            {showContextMenu && typeof document !== "undefined" &&
                ReactDOM.createPortal(
                    <div
                        ref={contextMenuRef}
                        className="editor-context-menu"
                        style={{
                            top: contextMenuPosition.top,
                            left: contextMenuPosition.left,
                        }}
                        role="menu"
                        aria-label="Editor context menu"
                    >
                        <div className="editor-context-topbar">
                            <span className="editor-context-title">Quick Format</span>
                            <button
                                type="button"
                                className="editor-context-close"
                                onClick={closeContextMenu}
                                title="Close"
                            >
                                <i className="fa-solid fa-xmark" />
                            </button>
                        </div>

                        <div className="editor-context-section">
                            <span className="editor-context-section-label">Clipboard</span>
                            <div className="editor-context-actions">
                                <button
                                    type="button"
                                    className="editor-context-btn"
                                    onClick={() => handleClipboardAction("copy")}
                                    title="Copy"
                                >
                                    <i className="fa-regular fa-copy" />
                                    <span>Copy</span>
                                </button>
                                <button
                                    type="button"
                                    className="editor-context-btn"
                                    onClick={() => handleClipboardAction("cut")}
                                    title="Cut"
                                >
                                    <i className="fa-solid fa-scissors" />
                                    <span>Cut</span>
                                </button>
                                <button
                                    type="button"
                                    className="editor-context-btn"
                                    onClick={() => handleClipboardAction("paste")}
                                    title="Paste"
                                >
                                    <i className="fa-solid fa-paste" />
                                    <span>Paste</span>
                                </button>
                                <button
                                    type="button"
                                    className="editor-context-btn"
                                    onClick={() =>
                                        runFormatCommand((chain) => chain.selectAll())
                                    }
                                    title="Select All"
                                >
                                    <i className="fa-solid fa-object-group" />
                                    <span>Select All</span>
                                </button>
                                <button
                                    type="button"
                                    className="editor-context-btn"
                                    onClick={() =>
                                        runFormatCommand((chain) => chain.undo())
                                    }
                                    title="Undo"
                                >
                                    <i className="fa-solid fa-rotate-left" />
                                    <span>Undo</span>
                                </button>
                                <button
                                    type="button"
                                    className="editor-context-btn"
                                    onClick={() =>
                                        runFormatCommand((chain) => chain.redo())
                                    }
                                    title="Redo"
                                >
                                    <i className="fa-solid fa-rotate-right" />
                                    <span>Redo</span>
                                </button>
                                <button
                                    type="button"
                                    className="editor-context-btn"
                                    onClick={deleteContextSelection}
                                    title="Delete Selection"
                                >
                                    <i className="fa-regular fa-trash-can" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>

                        <div className="editor-context-section">
                            <span className="editor-context-section-label">Text Style</span>
                            <div className="editor-context-actions">
                                <button
                                    type="button"
                                    className={`editor-context-btn ${editor?.isActive("bold") ? "active" : ""}`}
                                    onClick={() =>
                                        runFormatCommand((chain) => chain.toggleBold())
                                    }
                                    title="Bold"
                                >
                                    <i className="fa-solid fa-bold" />
                                    <span>Bold</span>
                                </button>
                                <button
                                    type="button"
                                    className={`editor-context-btn ${editor?.isActive("italic") ? "active" : ""}`}
                                    onClick={() =>
                                        runFormatCommand((chain) => chain.toggleItalic())
                                    }
                                    title="Italic"
                                >
                                    <i className="fa-solid fa-italic" />
                                    <span>Italic</span>
                                </button>
                                <button
                                    type="button"
                                    className={`editor-context-btn ${editor?.isActive("underline") ? "active" : ""}`}
                                    onClick={() =>
                                        runFormatCommand((chain) => chain.toggleUnderline())
                                    }
                                    title="Underline"
                                >
                                    <i className="fa-solid fa-underline" />
                                    <span>Underline</span>
                                </button>
                                <button
                                    type="button"
                                    className={`editor-context-btn ${editor?.isActive("strike") ? "active" : ""}`}
                                    onClick={() =>
                                        runFormatCommand((chain) => chain.toggleStrike())
                                    }
                                    title="Strike"
                                >
                                    <i className="fa-solid fa-strikethrough" />
                                    <span>Strike</span>
                                </button>
                                <button
                                    type="button"
                                    className={`editor-context-btn ${editor?.isActive("highlight") ? "active" : ""}`}
                                    onClick={toggleContextHighlight}
                                    title="Highlight"
                                >
                                    <i className="fa-solid fa-highlighter" />
                                    <span>Highlight</span>
                                </button>
                                <button
                                    type="button"
                                    className="editor-context-btn"
                                    onClick={clearContextFormatting}
                                    title="Clear Selected Formatting"
                                >
                                    <i className="fa-solid fa-eraser" />
                                    <span>Clear</span>
                                </button>
                            </div>
                            <div className="editor-context-swatches">
                                {MENU_HIGHLIGHT_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`editor-context-swatch ${activeHighlightColor === color ? "active" : ""}`}
                                        style={{ background: color }}
                                        onClick={() => applyContextHighlightColor(color)}
                                        title={`Highlight ${color}`}
                                    />
                                ))}
                            </div>
                            <div className="editor-context-row editor-context-row-tight">
                                <span className="editor-context-label">Custom Highlight</span>
                                <input
                                    type="color"
                                    className="editor-context-color-input"
                                    value={activeHighlightColor}
                                    onChange={(event) =>
                                        applyContextHighlightColor(event.target.value)
                                    }
                                    title="Choose highlight color"
                                />
                            </div>
                        </div>

                        <div className="editor-context-section">
                            <span className="editor-context-section-label">Paragraph</span>
                            <div className="editor-context-actions">
                                <button
                                    type="button"
                                    className={`editor-context-btn ${editor?.isActive("heading", { level: 1 }) ? "active" : ""}`}
                                    onClick={() =>
                                        runFormatCommand((chain) =>
                                            chain.toggleHeading({ level: 1 })
                                        )
                                    }
                                    title="Heading 1"
                                >
                                    <i className="fa-solid fa-heading" />
                                    <span>H1</span>
                                </button>
                                <button
                                    type="button"
                                    className={`editor-context-btn ${editor?.isActive("heading", { level: 2 }) ? "active" : ""}`}
                                    onClick={() =>
                                        runFormatCommand((chain) =>
                                            chain.toggleHeading({ level: 2 })
                                        )
                                    }
                                    title="Heading 2"
                                >
                                    <i className="fa-solid fa-heading" />
                                    <span>H2</span>
                                </button>
                                <button
                                    type="button"
                                    className={`editor-context-btn ${editor?.isActive("bulletList") ? "active" : ""}`}
                                    onClick={() =>
                                        runFormatCommand((chain) =>
                                            chain.toggleBulletList()
                                        )
                                    }
                                    title="Bullet List"
                                >
                                    <i className="fa-solid fa-list-ul" />
                                    <span>Bullets</span>
                                </button>
                                <button
                                    type="button"
                                    className={`editor-context-btn ${editor?.isActive("orderedList") ? "active" : ""}`}
                                    onClick={() =>
                                        runFormatCommand((chain) =>
                                            chain.toggleOrderedList()
                                        )
                                    }
                                    title="Numbered List"
                                >
                                    <i className="fa-solid fa-list-ol" />
                                    <span>Numbers</span>
                                </button>
                                <button
                                    type="button"
                                    className={`editor-context-btn ${editor?.isActive("blockquote") ? "active" : ""}`}
                                    onClick={() =>
                                        runFormatCommand((chain) =>
                                            chain.toggleBlockquote()
                                        )
                                    }
                                    title="Blockquote"
                                >
                                    <i className="fa-solid fa-quote-left" />
                                    <span>Quote</span>
                                </button>
                                <button
                                    type="button"
                                    className={`editor-context-btn ${showLineNumbers ? "active" : ""}`}
                                    onClick={() =>
                                        onChangeShowLineNumbers?.(!showLineNumbers)
                                    }
                                    title="Line Numbers"
                                >
                                    <i className="fa-solid fa-hashtag" />
                                    <span>Lines</span>
                                </button>
                            </div>
                        </div>

                        <div className="editor-context-section">
                            <div className="editor-context-row">
                                <span className="editor-context-label">Font Size</span>
                                <div className="editor-context-chip-group">
                                    {MENU_FONT_SIZES.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            className={`editor-context-chip ${activeFontSize === size ? "active" : ""}`}
                                            onClick={() => applyContextFontSize(size)}
                                        >
                                            {size === "default" ? "Default" : `${size}px`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="editor-context-row">
                                <span className="editor-context-label">Line Spacing</span>
                                <div className="editor-context-chip-group">
                                    {MENU_LINE_SPACING_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            className={`editor-context-chip ${activeLineSpacing === option.value ? "active" : ""}`}
                                            onClick={() =>
                                                applyContextLineSpacing(option.value)
                                            }
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="editor-context-row">
                                <button
                                    type="button"
                                    className={`editor-context-toggle ${!activeNoSpaceAfter ? "active" : ""}`}
                                    onClick={toggleContextParagraphSpace}
                                >
                                    Space After Paragraph
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}
