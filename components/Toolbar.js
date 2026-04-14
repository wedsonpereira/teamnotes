"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";

const BG_COLORS = [
    { name: "Default", value: null },
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
    { name: "Warm Cream", value: "#fdf6e3" },
    { name: "Mint", value: "#e8f5e9" },
    { name: "Sky", value: "#e3f2fd" },
    { name: "Lavender", value: "#f3e5f5" },
    { name: "Peach", value: "#fff3e0" },
    { name: "Rose", value: "#fce4ec" },
    { name: "Slate", value: "#1e1e2e" },
    { name: "Navy", value: "#0d1b2a" },
    { name: "Forest", value: "#1b2e1b" },
    { name: "Charcoal", value: "#2d2d2d" },
    { name: "Midnight", value: "#191930" },
];

const FONT_COLORS = [
    { name: "Default", value: null },
    { name: "Black", value: "#1a1a2e" },
    { name: "White", value: "#f0f0f5" },
    { name: "Dark Gray", value: "#333333" },
    { name: "Red", value: "#e53e3e" },
    { name: "Orange", value: "#dd6b20" },
    { name: "Green", value: "#2f855a" },
    { name: "Blue", value: "#2b6cb0" },
    { name: "Purple", value: "#6b46c1" },
    { name: "Teal", value: "#0d9488" },
    { name: "Brown", value: "#7b341e" },
    { name: "Pink", value: "#d53f8c" },
    { name: "Indigo", value: "#4338ca" },
];

const TEXT_FONT_OPTIONS = [
    { label: "Font", value: "default" },
    { label: "Montserrat", value: "'Montserrat', sans-serif" },
    { label: "Playfair", value: "'Playfair Display', serif" },
    { label: "JetBrains Mono", value: "'JetBrains Mono', monospace" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Verdana", value: "Verdana, sans-serif" },
    { label: "Trebuchet", value: "'Trebuchet MS', sans-serif" },
    { label: "Tahoma", value: "Tahoma, sans-serif" },
    { label: "Times New Roman", value: "'Times New Roman', serif" },
];

const UI_FONT_OPTIONS = [
    { label: "Default UI", value: "default" },
    { label: "Montserrat", value: "'Montserrat', sans-serif" },
    { label: "Playfair", value: "'Playfair Display', serif" },
    { label: "JetBrains Mono", value: "'JetBrains Mono', monospace" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Verdana", value: "Verdana, sans-serif" },
    { label: "Trebuchet", value: "'Trebuchet MS', sans-serif" },
    { label: "Tahoma", value: "Tahoma, sans-serif" },
    { label: "Times New Roman", value: "'Times New Roman', serif" },
];

const FONT_SIZES = ["12", "14", "16", "18", "20", "24", "28", "32"];
const DEFAULT_TEXT_COLOR = "#f0f0f5";
const COMPACT_TOOLBAR_MAX_WIDTH = 1180;
const PARAGRAPH_LINE_SPACING_OPTIONS = [
    { label: "Default", value: "default" },
    { label: "Single (1.0)", value: "1" },
    { label: "1.15", value: "1.15" },
    { label: "1.5", value: "1.5" },
    { label: "Double (2.0)", value: "2" },
];
const DEFAULT_HIGHLIGHT_COLOR = "#fff59d";
const DEFAULT_IMAGE_INSERT_WIDTH = 420;

const EMOJI_LIST = [
    "😀", "😁", "😂", "🤣", "😊", "😍", "🤩", "😎", "🤔", "😴", "😭", "🤯",
    "👍", "👏", "🙌", "🙏", "💡", "🔥", "✅", "❌", "🎉", "🧠", "🚀", "📌",
    "📎", "📁", "📝", "📣", "⚡", "🌟", "💬", "❤️", "🎯", "📊", "⌛", "👀",
];

function TipBtn({ tip, className, onClick, onMouseDown, children, style }) {
    return (
        <button
            className={`${className || ""} has-tooltip`}
            data-tip={tip}
            onClick={onClick}
            onMouseDown={onMouseDown}
            type="button"
            style={style}
        >
            {children}
        </button>
    );
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

function normalizeHexColor(value, fallback = DEFAULT_TEXT_COLOR) {
    if (typeof value !== "string") return fallback;
    const trimmed = value.trim();

    if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
        return trimmed.toLowerCase();
    }
    if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
        const r = trimmed[1];
        const g = trimmed[2];
        const b = trimmed[3];
        return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }
    return fallback;
}

function getInsertPosAfterSelectedMediaNode(editorInstance) {
    const selection = editorInstance?.state?.selection;
    const selectedNode = selection?.node;
    if (!selectedNode) return null;

    const selectedNodeType = selectedNode.type?.name;
    if (selectedNodeType !== "image" && selectedNodeType !== "fileAttachment") {
        return null;
    }

    return selection.to;
}

export default function Toolbar({
    roomName,
    saveStatus,
    connected,
    theme,
    onToggleTheme,
    editorBg,
    onChangeBg,
    fontColor,
    onChangeFontColor,
    showLineNumbers = false,
    onChangeShowLineNumbers,
    typingUsers = [],
    userName,
    userColor,
    accentPrimary,
    accentSecondary,
    onChangeAccentPrimary,
    onChangeAccentSecondary,
    uiFontFamily,
    onChangeUiFontFamily,
}) {
    const [editor, setEditor] = useState(null);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [advancedPosition, setAdvancedPosition] = useState({ top: 0, right: 0 });
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojiPosition, setEmojiPosition] = useState({ top: 0, left: 0 });
    const [activeFontFamily, setActiveFontFamily] = useState("default");
    const [activeFontSize, setActiveFontSize] = useState("default");
    const [activeHighlightColor, setActiveHighlightColor] = useState(DEFAULT_HIGHLIGHT_COLOR);
    const [activeTextColor, setActiveTextColor] = useState(DEFAULT_TEXT_COLOR);
    const [activeParagraphLineSpacing, setActiveParagraphLineSpacing] = useState("default");
    const [paragraphNoSpaceAfter, setParagraphNoSpaceAfter] = useState(false);
    const [isCompactToolbar, setIsCompactToolbar] = useState(false);
    const [showCompactMenu, setShowCompactMenu] = useState(false);

    const dropdownRef = useRef(null);
    const advancedBtnRef = useRef(null);
    const advancedPortalRef = useRef(null);
    const compactMenuWrapRef = useRef(null);
    const primaryToolbarRef = useRef(null);
    const emojiRef = useRef(null);
    const emojiBtnRef = useRef(null);
    const emojiPortalRef = useRef(null);
    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const savedSelectionRef = useRef(null);

    const saveEditorSelection = useCallback(() => {
        if (editor) {
            const { from, to } = editor.state.selection;
            savedSelectionRef.current = { from, to };
        }
    }, [editor]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const syncEditor = () => {
            setEditor(window.__tiptapEditor || null);
        };

        syncEditor();
        window.addEventListener("teamnote-editor-ready", syncEditor);

        return () => {
            window.removeEventListener("teamnote-editor-ready", syncEditor);
        };
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const updateCompactMode = () => {
            const toolbarWidth = primaryToolbarRef.current?.getBoundingClientRect().width;
            const width = Number.isFinite(toolbarWidth) && toolbarWidth > 0
                ? toolbarWidth
                : window.innerWidth;
            setIsCompactToolbar(width <= COMPACT_TOOLBAR_MAX_WIDTH);
        };

        updateCompactMode();
        window.addEventListener("resize", updateCompactMode);
        let resizeObserver = null;
        if (typeof ResizeObserver !== "undefined" && primaryToolbarRef.current) {
            resizeObserver = new ResizeObserver(updateCompactMode);
            resizeObserver.observe(primaryToolbarRef.current);
        }

        return () => {
            window.removeEventListener("resize", updateCompactMode);
            resizeObserver?.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!isCompactToolbar) {
            setShowCompactMenu(false);
        }
    }, [isCompactToolbar]);

    useEffect(() => {
        const handleClick = (event) => {
            const target = event.target;
            if (
                compactMenuWrapRef.current &&
                !compactMenuWrapRef.current.contains(target)
            ) {
                setShowCompactMenu(false);
            }
            if (
                dropdownRef.current && !dropdownRef.current.contains(target) &&
                (!advancedPortalRef.current || !advancedPortalRef.current.contains(target))
            ) {
                setShowAdvanced(false);
            }
            if (
                emojiRef.current && !emojiRef.current.contains(target) &&
                (!emojiPortalRef.current || !emojiPortalRef.current.contains(target))
            ) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        if (!editor) {
            setActiveFontFamily("default");
            setActiveFontSize("default");
            setActiveHighlightColor(DEFAULT_HIGHLIGHT_COLOR);
            setActiveTextColor(DEFAULT_TEXT_COLOR);
            setActiveParagraphLineSpacing("default");
            setParagraphNoSpaceAfter(false);
            return;
        }

        const syncTypography = () => {
            const attrs = editor.getAttributes("textStyle") || {};
            const knownFont = TEXT_FONT_OPTIONS.some(
                (option) => option.value === attrs.fontFamily
            )
                ? attrs.fontFamily
                : "default";
            setActiveFontFamily(knownFont);
            const normalizedTextColor = normalizeHexColor(
                attrs.color,
                DEFAULT_TEXT_COLOR
            );
            setActiveTextColor(normalizedTextColor);
            const normalizedSize = normalizeFontSize(attrs.fontSize);
            setActiveFontSize(
                FONT_SIZES.includes(normalizedSize) ? normalizedSize : "default"
            );

            const highlightAttrs = editor.getAttributes("highlight") || {};
            if (typeof highlightAttrs.color === "string" && highlightAttrs.color) {
                setActiveHighlightColor(highlightAttrs.color);
            } else if (editor.isActive("highlight")) {
                setActiveHighlightColor(DEFAULT_HIGHLIGHT_COLOR);
            }

            const paragraphAttrs = editor.getAttributes("paragraph") || {};
            const lineHeightValue = String(paragraphAttrs.lineHeight || "default");
            const knownLineHeight = PARAGRAPH_LINE_SPACING_OPTIONS.some(
                (option) => option.value === lineHeightValue
            )
                ? lineHeightValue
                : "default";
            setActiveParagraphLineSpacing(knownLineHeight);
            setParagraphNoSpaceAfter(Boolean(paragraphAttrs.noSpaceAfter));
        };

        syncTypography();
        editor.on("selectionUpdate", syncTypography);
        editor.on("transaction", syncTypography);

        return () => {
            editor.off("selectionUpdate", syncTypography);
            editor.off("transaction", syncTypography);
        };
    }, [editor]);

    const btn = useCallback(
        (iconClass, command, isActive, tip) => (
            <TipBtn
                tip={tip}
                className={`toolbar-btn ${isActive ? "active" : ""}`}
                onClick={() => {
                    if (editor) command(editor);
                }}
            >
                <i className={iconClass} />
            </TipBtn>
        ),
        [editor]
    );

    const addImage = () => {
        imageInputRef.current?.click();
    };

    const addFile = () => {
        fileInputRef.current?.click();
    };

    const openEmojiPickerFromAnchor = (anchorElement) => {
        if (!anchorElement) return;
        const rect = anchorElement.getBoundingClientRect();
        setEmojiPosition({ top: rect.bottom + 8, left: rect.left });
        setShowEmojiPicker((prev) => !prev);
    };

    const openAdvancedFromAnchor = (anchorElement) => {
        if (!anchorElement) return;

        if (!showAdvanced) {
            const rect = anchorElement.getBoundingClientRect();
            setAdvancedPosition({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right,
            });
        }
        setShowAdvanced((prev) => !prev);
    };

    const insertEmoji = (emoji) => {
        if (!editor) return;
        editor.chain().focus().insertContent(emoji).run();
        setShowEmojiPicker(false);
    };

    const applyFontFamily = (fontFamilyValue) => {
        if (!editor) return;

        const chain = editor.chain().focus();
        const sel = savedSelectionRef.current;
        if (sel && sel.from !== sel.to) {
            chain.setTextSelection(sel);
        }

        if (fontFamilyValue === "default") {
            chain.unsetFontFamily();
        } else {
            chain.setFontFamily(fontFamilyValue);
        }
        chain.run();

        setActiveFontFamily(fontFamilyValue);
    };

    const applyFontSize = (fontSizeValue) => {
        if (!editor) return;

        const chain = editor.chain().focus();
        const sel = savedSelectionRef.current;
        if (sel && sel.from !== sel.to) {
            chain.setTextSelection(sel);
        }

        if (fontSizeValue === "default") {
            chain.unsetFontSize();
        } else {
            chain.setFontSize(`${fontSizeValue}px`);
        }
        chain.run();

        setActiveFontSize(fontSizeValue);
    };

    const applyTextColor = (textColorValue) => {
        if (!editor) return;

        const nextColor = normalizeHexColor(textColorValue, activeTextColor);
        setActiveTextColor(nextColor);

        const chain = editor.chain().focus();
        const sel = savedSelectionRef.current;
        if (sel && sel.from !== sel.to) {
            chain.setTextSelection(sel);
        }
        chain.setColor(nextColor).run();
    };

    const clearTextColor = () => {
        if (!editor) return;

        const chain = editor.chain().focus();
        const sel = savedSelectionRef.current;
        if (sel && sel.from !== sel.to) {
            chain.setTextSelection(sel);
        }
        chain.unsetColor().run();
        setActiveTextColor(DEFAULT_TEXT_COLOR);
    };

    const applyParagraphLineSpacing = (lineHeightValue) => {
        if (!editor) return;

        const chain = editor.chain().focus();
        const sel = savedSelectionRef.current;
        if (sel && sel.from !== sel.to) {
            chain.setTextSelection(sel);
        }

        chain
            .updateAttributes("paragraph", {
                lineHeight: lineHeightValue === "default" ? null : lineHeightValue,
            })
            .run();

        setActiveParagraphLineSpacing(lineHeightValue);
    };

    const toggleParagraphSpaceAfter = () => {
        if (!editor) return;

        const nextValue = !paragraphNoSpaceAfter;
        const chain = editor.chain().focus();
        const sel = savedSelectionRef.current;
        if (sel && sel.from !== sel.to) {
            chain.setTextSelection(sel);
        }

        chain
            .updateAttributes("paragraph", {
                noSpaceAfter: nextValue,
            })
            .run();

        setParagraphNoSpaceAfter(nextValue);
    };

    const toggleHighlight = () => {
        if (!editor) return;

        const chain = editor.chain().focus();
        const sel = savedSelectionRef.current;
        if (sel && sel.from !== sel.to) {
            chain.setTextSelection(sel);
        }

        if (editor.isActive("highlight")) {
            chain.unsetHighlight();
        } else {
            chain.setHighlight({ color: activeHighlightColor || DEFAULT_HIGHLIGHT_COLOR });
        }
        chain.run();
    };

    const applyHighlightColor = (colorValue) => {
        if (!editor) return;

        setActiveHighlightColor(colorValue || DEFAULT_HIGHLIGHT_COLOR);

        const chain = editor.chain().focus();
        const sel = savedSelectionRef.current;
        if (sel && sel.from !== sel.to) {
            chain
                .setTextSelection(sel)
                .setHighlight({ color: colorValue || DEFAULT_HIGHLIGHT_COLOR })
                .run();
            return;
        }

        if (editor.isActive("highlight")) {
            chain.setHighlight({ color: colorValue || DEFAULT_HIGHLIGHT_COLOR }).run();
        }
    };

    const toggleSingleCodeBlock = () => {
        if (!editor) return;

        const savedSel = savedSelectionRef.current;
        const hasSavedRange =
            savedSel &&
            Number.isInteger(savedSel.from) &&
            Number.isInteger(savedSel.to) &&
            savedSel.from !== savedSel.to;

        const findCodeBlockAroundSelection = () => {
            const { $from, $to } = editor.state.selection;

            const findAncestorCodeBlock = ($pos) => {
                for (let depth = $pos.depth; depth > 0; depth -= 1) {
                    const node = $pos.node(depth);
                    if (node.type.name === "codeBlock") {
                        const from = $pos.before(depth);
                        return { from, to: from + node.nodeSize, node };
                    }
                }
                return null;
            };

            const fromBlock = findAncestorCodeBlock($from);
            if (!fromBlock) return null;

            const toBlock = findAncestorCodeBlock($to);
            if (!toBlock) return null;

            if (fromBlock.from !== toBlock.from || fromBlock.to !== toBlock.to) {
                return null;
            }

            return fromBlock;
        };

        if (editor.isActive("codeBlock")) {
            const codeBlockRange = findCodeBlockAroundSelection();
            if (!codeBlockRange) {
                editor.chain().focus().toggleCodeBlock().run();
                return;
            }

            const rawText = String(codeBlockRange.node.textContent || "").replace(/\r\n?/g, "\n");
            const lines = rawText.split("\n");
            const paragraphContent = lines.length
                ? lines.map((line) =>
                    line
                        ? {
                            type: "paragraph",
                            content: [{ type: "text", text: line }],
                        }
                        : { type: "paragraph" }
                )
                : [{ type: "paragraph" }];

            editor
                .chain()
                .focus()
                .setTextSelection({
                    from: codeBlockRange.from,
                    to: codeBlockRange.to,
                })
                .insertContent(paragraphContent)
                .run();
            return;
        }

        const from = hasSavedRange ? savedSel.from : editor.state.selection.from;
        const to = hasSavedRange ? savedSel.to : editor.state.selection.to;

        if (from === to) {
            editor.chain().focus().toggleCodeBlock().run();
            return;
        }

        const selectedText = editor.state.doc.textBetween(from, to, "\n");
        const codeContent = selectedText
            ? [{ type: "text", text: selectedText }]
            : [];

        editor
            .chain()
            .focus()
            .setTextSelection({ from, to })
            .insertContent({
                type: "codeBlock",
                content: codeContent,
            })
            .run();
    };

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    const handleImageFiles = async (event) => {
        const files = Array.from(event.target.files || []);
        event.target.value = "";

        if (!editor || files.length === 0) return;

        const contentToInsert = [];

        for (const file of files) {
            if (!file.type?.startsWith("image/")) continue;
            if (file.size > MAX_FILE_SIZE) {
                alert(`Image "${file.name}" exceeds the 5 MB limit.`);
                continue;
            }

            try {
                const src = await readFileAsDataUrl(file);
                if (src) {
                    contentToInsert.push({
                        type: "image",
                        attrs: {
                            src,
                            width: DEFAULT_IMAGE_INSERT_WIDTH,
                        },
                    });
                }
            } catch (err) {
                console.warn("Failed to insert selected image:", err);
            }
        }

        if (!contentToInsert.length) return;
        const insertPos = getInsertPosAfterSelectedMediaNode(editor);
        if (typeof insertPos === "number") {
            editor.chain().focus().insertContentAt(insertPos, contentToInsert).run();
        } else {
            editor.chain().focus().insertContent(contentToInsert).run();
        }
    };

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files || []);
        event.target.value = "";

        if (!editor || files.length === 0) return;

        const contentToInsert = [];

        for (const file of files) {
            if (file.size > MAX_FILE_SIZE) {
                alert(`File "${file.name}" exceeds the 5 MB limit.`);
                continue;
            }

            try {
                const src = await readFileAsDataUrl(file);
                if (!src) continue;

                if (file.type?.startsWith("image/")) {
                    contentToInsert.push({
                        type: "image",
                        attrs: {
                            src,
                            width: DEFAULT_IMAGE_INSERT_WIDTH,
                        },
                    });
                } else {
                    contentToInsert.push({
                        type: "fileAttachment",
                        attrs: {
                            src,
                            fileName: file.name,
                            fileSize: file.size,
                            mimeType: file.type,
                            addedBy: userName || null,
                            addedByColor: userColor || null,
                            addedAt: new Date().toISOString(),
                        },
                    });
                }
            } catch (err) {
                console.warn("Failed to insert selected file:", err);
            }
        }

        if (!contentToInsert.length) return;
        const insertPos = getInsertPosAfterSelectedMediaNode(editor);
        if (typeof insertPos === "number") {
            editor.chain().focus().insertContentAt(insertPos, contentToInsert).run();
        } else {
            editor.chain().focus().insertContent(contentToInsert).run();
        }
    };

    return (
        <div className="editor-toolbar">
            <div
                ref={primaryToolbarRef}
                className={`toolbar-primary ${isCompactToolbar ? "toolbar-primary-compact" : ""}`}
            >
                <div className="toolbar-group">
                    {btn("fa-solid fa-bold", (e) => e.chain().focus().toggleBold().run(), editor?.isActive("bold"), "Bold")}
                    {btn("fa-solid fa-italic", (e) => e.chain().focus().toggleItalic().run(), editor?.isActive("italic"), "Italic")}
                    {btn("fa-solid fa-underline", (e) => e.chain().focus().toggleUnderline().run(), editor?.isActive("underline"), "Underline")}
                    {btn("fa-solid fa-strikethrough", (e) => e.chain().focus().toggleStrike().run(), editor?.isActive("strike"), "Strikethrough")}
                    <TipBtn
                        tip={editor?.isActive("highlight") ? "Remove Highlight" : "Highlight Text"}
                        className={`toolbar-btn ${editor?.isActive("highlight") ? "active" : ""}`}
                        onMouseDown={saveEditorSelection}
                        onClick={toggleHighlight}
                    >
                        <i className="fa-solid fa-highlighter" />
                    </TipBtn>
                    <input
                        type="color"
                        className="toolbar-color-input toolbar-highlight-color"
                        value={activeHighlightColor}
                        onMouseDown={saveEditorSelection}
                        onFocus={saveEditorSelection}
                        onChange={(e) => applyHighlightColor(e.target.value)}
                        title="Highlight color"
                    />
                    <TipBtn
                        tip="Reset Text Color"
                        className="toolbar-btn"
                        onMouseDown={saveEditorSelection}
                        onClick={clearTextColor}
                    >
                        <span
                            className="toolbar-text-color-indicator"
                            style={{ "--toolbar-text-color": activeTextColor }}
                        >
                            A
                        </span>
                    </TipBtn>
                    <input
                        type="color"
                        className="toolbar-color-input toolbar-text-color"
                        value={activeTextColor}
                        onMouseDown={saveEditorSelection}
                        onFocus={saveEditorSelection}
                        onChange={(e) => applyTextColor(e.target.value)}
                        title="Text color"
                    />
                </div>

                <div className="toolbar-divider" />

                <div className="toolbar-group">
                    <select
                        className="toolbar-select"
                        value={activeFontFamily}
                        onMouseDown={saveEditorSelection}
                        onFocus={saveEditorSelection}
                        onChange={(e) => applyFontFamily(e.target.value)}
                        title="Font family"
                    >
                        {TEXT_FONT_OPTIONS.map((option) => (
                            <option key={option.label} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <select
                        className="toolbar-select toolbar-select-size"
                        value={activeFontSize}
                        onMouseDown={saveEditorSelection}
                        onFocus={saveEditorSelection}
                        onChange={(e) => applyFontSize(e.target.value)}
                        title="Font size"
                    >
                        <option value="default">Size</option>
                        {FONT_SIZES.map((size) => (
                            <option key={size} value={size}>
                                {size}px
                            </option>
                        ))}
                    </select>

                    {!isCompactToolbar && (
                        <>
                            <select
                                className="toolbar-select toolbar-select-spacing"
                                value={activeParagraphLineSpacing}
                                onMouseDown={saveEditorSelection}
                                onFocus={saveEditorSelection}
                                onChange={(e) => applyParagraphLineSpacing(e.target.value)}
                                title="Paragraph line spacing"
                            >
                                {PARAGRAPH_LINE_SPACING_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            <TipBtn
                                tip={paragraphNoSpaceAfter ? "Add Space After Paragraph" : "Remove Space After Paragraph"}
                                className={`toolbar-btn ${paragraphNoSpaceAfter ? "active" : ""}`}
                                onMouseDown={saveEditorSelection}
                                onClick={toggleParagraphSpaceAfter}
                            >
                                <i className="fa-solid fa-text-height" />
                            </TipBtn>
                        </>
                    )}
                </div>

                {!isCompactToolbar && (
                    <>
                        <div className="toolbar-divider" />

                        <div className="toolbar-group">
                            <TipBtn
                                tip="Heading 1"
                                className={`toolbar-btn ${editor?.isActive("heading", { level: 1 }) ? "active" : ""}`}
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                            >
                                <span style={{ fontSize: 13, fontWeight: 700 }}>H1</span>
                            </TipBtn>
                            <TipBtn
                                tip="Heading 2"
                                className={`toolbar-btn ${editor?.isActive("heading", { level: 2 }) ? "active" : ""}`}
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                            >
                                <span style={{ fontSize: 12, fontWeight: 700 }}>H2</span>
                            </TipBtn>
                            <TipBtn
                                tip="Heading 3"
                                className={`toolbar-btn ${editor?.isActive("heading", { level: 3 }) ? "active" : ""}`}
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                            >
                                <span style={{ fontSize: 11, fontWeight: 700 }}>H3</span>
                            </TipBtn>
                        </div>

                        <div className="toolbar-divider" />

                        <div className="toolbar-group">
                            {btn("fa-solid fa-list-ul", (e) => e.chain().focus().toggleBulletList().run(), editor?.isActive("bulletList"), "Bullet List")}
                            {btn("fa-solid fa-list-ol", (e) => e.chain().focus().toggleOrderedList().run(), editor?.isActive("orderedList"), "Ordered List")}
                            {btn("fa-solid fa-quote-left", (e) => e.chain().focus().toggleBlockquote().run(), editor?.isActive("blockquote"), "Blockquote")}
                            <TipBtn
                                tip="Code Block"
                                className={`toolbar-btn ${editor?.isActive("codeBlock") ? "active" : ""}`}
                                onMouseDown={saveEditorSelection}
                                onClick={toggleSingleCodeBlock}
                            >
                                <i className="fa-solid fa-code" />
                            </TipBtn>
                        </div>

                        <div className="toolbar-divider" />

                        <div className="toolbar-group">
                            <TipBtn tip="Insert Image" className="toolbar-btn" onClick={addImage}>
                                <i className="fa-regular fa-image" />
                            </TipBtn>

                            <TipBtn tip="Attach File" className="toolbar-btn" onClick={addFile}>
                                <i className="fa-solid fa-paperclip" />
                            </TipBtn>

                            <div className="emoji-picker-wrapper" ref={emojiRef}>
                                <span ref={emojiBtnRef} style={{ display: "inline-flex" }}>
                                    <TipBtn
                                        tip="Insert Emoji"
                                        className="toolbar-btn"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            openEmojiPickerFromAnchor(event.currentTarget);
                                        }}
                                    >
                                        <i className="fa-regular fa-face-smile" />
                                    </TipBtn>
                                </span>
                            </div>

                            <TipBtn
                                tip="Horizontal Rule"
                                className="toolbar-btn"
                                onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                            >
                                <i className="fa-solid fa-minus" />
                            </TipBtn>
                        </div>

                        <div className="toolbar-divider" />

                        <div className="toolbar-group">
                            <TipBtn tip="Undo" className="toolbar-btn" onClick={() => editor?.chain().focus().undo().run()}>
                                <i className="fa-solid fa-rotate-left" />
                            </TipBtn>
                            <TipBtn tip="Redo" className="toolbar-btn" onClick={() => editor?.chain().focus().redo().run()}>
                                <i className="fa-solid fa-rotate-right" />
                            </TipBtn>
                        </div>

                        <div className="toolbar-divider" />

                        <div className="toolbar-group">
                            <TipBtn
                                tip={theme === "dark" ? "Light Mode" : "Dark Mode"}
                                className="theme-toggle-btn"
                                onClick={onToggleTheme}
                            >
                                <i className={theme === "dark" ? "fa-regular fa-sun" : "fa-regular fa-moon"} />
                            </TipBtn>
                        </div>
                    </>
                )}

                {isCompactToolbar && (
                    <div className="toolbar-group toolbar-compact-more" ref={compactMenuWrapRef}>
                        <TipBtn
                            tip="More Tools"
                            className={`toolbar-btn ${showCompactMenu ? "active" : ""}`}
                            onClick={(event) => {
                                event.stopPropagation();
                                setShowCompactMenu((prev) => !prev);
                            }}
                        >
                            <i className="fa-solid fa-ellipsis" />
                        </TipBtn>

                        {showCompactMenu && (
                            <div className="toolbar-compact-menu">
                                <div className="toolbar-compact-row">
                                    <select
                                        className="toolbar-select toolbar-select-spacing"
                                        value={activeParagraphLineSpacing}
                                        onMouseDown={saveEditorSelection}
                                        onFocus={saveEditorSelection}
                                        onChange={(e) => applyParagraphLineSpacing(e.target.value)}
                                        title="Paragraph line spacing"
                                    >
                                        {PARAGRAPH_LINE_SPACING_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <TipBtn
                                        tip={paragraphNoSpaceAfter ? "Add Space After Paragraph" : "Remove Space After Paragraph"}
                                        className={`toolbar-btn ${paragraphNoSpaceAfter ? "active" : ""}`}
                                        onMouseDown={saveEditorSelection}
                                        onClick={toggleParagraphSpaceAfter}
                                    >
                                        <i className="fa-solid fa-text-height" />
                                    </TipBtn>
                                </div>

                                <div className="toolbar-compact-row">
                                    <TipBtn
                                        tip="Heading 1"
                                        className={`toolbar-btn ${editor?.isActive("heading", { level: 1 }) ? "active" : ""}`}
                                        onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                                    >
                                        <span style={{ fontSize: 13, fontWeight: 700 }}>H1</span>
                                    </TipBtn>
                                    <TipBtn
                                        tip="Heading 2"
                                        className={`toolbar-btn ${editor?.isActive("heading", { level: 2 }) ? "active" : ""}`}
                                        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                                    >
                                        <span style={{ fontSize: 12, fontWeight: 700 }}>H2</span>
                                    </TipBtn>
                                    <TipBtn
                                        tip="Heading 3"
                                        className={`toolbar-btn ${editor?.isActive("heading", { level: 3 }) ? "active" : ""}`}
                                        onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                                    >
                                        <span style={{ fontSize: 11, fontWeight: 700 }}>H3</span>
                                    </TipBtn>
                                </div>

                                <div className="toolbar-compact-row">
                                    {btn("fa-solid fa-list-ul", (e) => e.chain().focus().toggleBulletList().run(), editor?.isActive("bulletList"), "Bullet List")}
                                    {btn("fa-solid fa-list-ol", (e) => e.chain().focus().toggleOrderedList().run(), editor?.isActive("orderedList"), "Ordered List")}
                                    {btn("fa-solid fa-quote-left", (e) => e.chain().focus().toggleBlockquote().run(), editor?.isActive("blockquote"), "Blockquote")}
                                    <TipBtn
                                        tip="Code Block"
                                        className={`toolbar-btn ${editor?.isActive("codeBlock") ? "active" : ""}`}
                                        onMouseDown={saveEditorSelection}
                                        onClick={toggleSingleCodeBlock}
                                    >
                                        <i className="fa-solid fa-code" />
                                    </TipBtn>
                                </div>

                                <div className="toolbar-compact-row">
                                    <TipBtn tip="Insert Image" className="toolbar-btn" onClick={addImage}>
                                        <i className="fa-regular fa-image" />
                                    </TipBtn>
                                    <TipBtn tip="Attach File" className="toolbar-btn" onClick={addFile}>
                                        <i className="fa-solid fa-paperclip" />
                                    </TipBtn>
                                    <div className="emoji-picker-wrapper" ref={emojiRef}>
                                        <span ref={emojiBtnRef} style={{ display: "inline-flex" }}>
                                            <TipBtn
                                                tip="Insert Emoji"
                                                className="toolbar-btn"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    openEmojiPickerFromAnchor(event.currentTarget);
                                                }}
                                            >
                                                <i className="fa-regular fa-face-smile" />
                                            </TipBtn>
                                        </span>
                                    </div>
                                    <TipBtn
                                        tip="Horizontal Rule"
                                        className="toolbar-btn"
                                        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                                    >
                                        <i className="fa-solid fa-minus" />
                                    </TipBtn>
                                </div>

                                <div className="toolbar-compact-row">
                                    <TipBtn tip="Undo" className="toolbar-btn" onClick={() => editor?.chain().focus().undo().run()}>
                                        <i className="fa-solid fa-rotate-left" />
                                    </TipBtn>
                                    <TipBtn tip="Redo" className="toolbar-btn" onClick={() => editor?.chain().focus().redo().run()}>
                                        <i className="fa-solid fa-rotate-right" />
                                    </TipBtn>
                                    <TipBtn
                                        tip={theme === "dark" ? "Light Mode" : "Dark Mode"}
                                        className="theme-toggle-btn"
                                        onClick={onToggleTheme}
                                    >
                                        <i className={theme === "dark" ? "fa-regular fa-sun" : "fa-regular fa-moon"} />
                                    </TipBtn>
                                    <TipBtn
                                        tip="Advanced Options"
                                        className="toolbar-btn"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            openAdvancedFromAnchor(event.currentTarget);
                                            setShowCompactMenu(false);
                                        }}
                                    >
                                        <i className="fa-solid fa-gear" />
                                    </TipBtn>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageFiles}
                    style={{ display: "none" }}
                />
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                />

                {showEmojiPicker && ReactDOM.createPortal(
                    <div
                        className="emoji-picker"
                        role="menu"
                        aria-label="Emoji picker"
                        ref={emojiPortalRef}
                        style={{ top: emojiPosition.top, left: emojiPosition.left }}
                    >
                        {EMOJI_LIST.map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                className="emoji-item"
                                onClick={() => insertEmoji(emoji)}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>,
                    document.body
                )}

                <div className="advanced-dropdown-wrapper" ref={dropdownRef}>
                    {!isCompactToolbar && (
                        <span ref={advancedBtnRef} style={{ display: "inline-flex" }}>
                            <TipBtn
                                tip="Advanced Options"
                                className="toolbar-btn"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    openAdvancedFromAnchor(event.currentTarget);
                                }}
                            >
                                <i className="fa-solid fa-gear" />
                            </TipBtn>
                        </span>
                    )}

                    {showAdvanced && ReactDOM.createPortal(
                        <div
                            className="advanced-dropdown"
                            ref={advancedPortalRef}
                            style={{ top: advancedPosition.top, right: advancedPosition.right }}
                        >
                            <div className="advanced-dropdown-title">
                                <i className="fa-solid fa-sliders" style={{ marginRight: 6 }} />
                                Advanced Options
                            </div>

                            <div className="toolbar-input-row">
                                <label className="advanced-label" htmlFor="accentPrimaryPicker">Primary Accent</label>
                                <input
                                    id="accentPrimaryPicker"
                                    type="color"
                                    className="toolbar-color-input"
                                    value={accentPrimary || "#6c63ff"}
                                    onChange={(e) => onChangeAccentPrimary?.(e.target.value)}
                                />
                            </div>

                            <div className="toolbar-input-row">
                                <label className="advanced-label" htmlFor="accentSecondaryPicker">Secondary Accent</label>
                                <input
                                    id="accentSecondaryPicker"
                                    type="color"
                                    className="toolbar-color-input"
                                    value={accentSecondary || "#00d4aa"}
                                    onChange={(e) => onChangeAccentSecondary?.(e.target.value)}
                                />
                            </div>

                            <div className="toolbar-input-row">
                                <label className="advanced-label" htmlFor="uiFontPicker">Interface Font</label>
                                <select
                                    id="uiFontPicker"
                                    className="toolbar-select toolbar-select-advanced"
                                    value={uiFontFamily || "default"}
                                    onChange={(e) => onChangeUiFontFamily?.(e.target.value)}
                                >
                                    {UI_FONT_OPTIONS.map((option) => (
                                        <option key={option.label} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="toggle-container" style={{ padding: "8px 4px" }}>
                                <span className="toggle-label">Line Numbers</span>
                                <button
                                    type="button"
                                    className={`toggle-switch ${showLineNumbers ? "active" : ""}`}
                                    onClick={() => onChangeShowLineNumbers?.(!showLineNumbers)}
                                    aria-label="Toggle line numbers"
                                    aria-pressed={showLineNumbers}
                                />
                            </div>

                            <div style={{ padding: "6px 4px 2px" }}>
                                <span className="advanced-label">
                                    <i className="fa-solid fa-fill-drip" style={{ marginRight: 6, fontSize: 12 }} />
                                    Notepad Background
                                </span>
                            </div>
                            <div className="color-swatches">
                                {BG_COLORS.map((c) => (
                                    <div
                                        key={c.name}
                                        className={`color-swatch ${c.value === null ? "default-swatch" : ""} ${editorBg === c.value ? "active" : ""}`}
                                        style={c.value ? { background: c.value } : undefined}
                                        title={c.name}
                                        onClick={() => onChangeBg(c.value)}
                                    />
                                ))}
                            </div>

                            <div style={{ padding: "10px 4px 2px" }}>
                                <span className="advanced-label">
                                    <i className="fa-solid fa-font" style={{ marginRight: 6, fontSize: 12 }} />
                                    Font Color
                                </span>
                            </div>
                            <div className="color-swatches">
                                {FONT_COLORS.map((c) => (
                                    <div
                                        key={c.name}
                                        className={`color-swatch ${c.value === null ? "default-swatch" : ""} ${fontColor === c.value ? "active" : ""}`}
                                        style={c.value ? { background: c.value } : undefined}
                                        title={c.name}
                                        onClick={() => onChangeFontColor(c.value)}
                                    />
                                ))}
                            </div>
                        </div>,
                        document.body
                    )}
                </div>
            </div>

            <div className="toolbar-room-info">
                <span className="room-name">{roomName || "Untitled Room"}</span>

                <span className="save-status">
                    <span className={`save-dot ${saveStatus === true ? "saving" : ""}`} />
                    {saveStatus === true ? "Saving..." : saveStatus === "saved" ? "Saved" : "Ready"}
                </span>

                <span className={`connection-badge ${connected ? "connected" : "disconnected"}`}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
                    {connected ? "Live" : "Offline"}
                </span>

                {typingUsers.length > 0 && (
                    <span className="typing-indicator">
                        {typingUsers[0]}
                        {typingUsers.length > 1 ? ` +${typingUsers.length - 1} more` : ""} typing...
                    </span>
                )}
            </div>
        </div>
    );
}
