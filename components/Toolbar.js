"use client";

import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
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
    { label: "Default (JetBrains)", value: "default" },
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
    { label: "Default UI (JetBrains)", value: "default" },
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
const MAX_TABLE_ROWS = 20;
const MAX_TABLE_COLUMNS = 12;
const TABLE_PICKER_ROWS = 8;
const TABLE_PICKER_COLUMNS = 8;
const CASHFREE_SDK_SRC = "https://sdk.cashfree.com/js/v3/cashfree.js";

const TOOLTIP_DESCRIPTIONS = {
    "Delete Table": "Remove the selected table from the page.",
    "Font Family": "Choose the typeface for selected text.",
    "Font Size": "Change the size of selected text.",
    "Heading 1": "Make selected text a large section title.",
    "Heading 2": "Make selected text a medium section title.",
    "Heading 3": "Make selected text a smaller section title.",
    Bold: "Make selected text thicker.",
    Italic: "Slant selected text for emphasis.",
    Underline: "Add a line under selected text.",
    Strikethrough: "Draw a line through selected text.",
    "Reset Text Color": "Remove the custom text color.",
    "Text Color": "Pick a color for selected text.",
    "Highlight Text": "Add highlight color behind selected text.",
    "Remove Highlight": "Remove highlight from selected text.",
    "Highlight Color": "Choose the color used for text highlighting.",
    "Paragraph Line Spacing": "Adjust spacing between lines in the paragraph.",
    "Remove Space After Paragraph": "Keep paragraphs closer together.",
    "Add Space After Paragraph": "Restore space after paragraphs.",
    "Bullet List": "Turn selected lines into a bulleted list.",
    "Ordered List": "Turn selected lines into a numbered list.",
    Blockquote: "Format selected text as a quotation.",
    "Code Block": "Format selected text as a code block.",
    "Insert Image": "Add one or more images to the note.",
    "Attach File": "Attach a file or image to the note.",
    "Insert Table": "Create a table with custom rows and columns.",
    "Insert Emoji": "Add an emoji at the cursor.",
    "Horizontal Rule": "Insert a divider line.",
    Undo: "Reverse the last editor change.",
    Redo: "Restore the last undone change.",
    "Light Mode": "Switch the interface to light theme.",
    "Dark Mode": "Switch the interface to dark theme.",
    "More Tools": "Open extra toolbar controls on small screens.",
    "Advanced Options": "Open theme, font, and notepad settings.",
    "Float Note Window": "Open the current note in a browser-floating mini window that stays visible while you work elsewhere.",
    "Close Floating Note": "Close the browser-floating note window.",
    "Buy Me a Meal": "Open secure checkout options.",
    "Primary Accent": "Change the main interface accent color.",
    "Secondary Accent": "Change the secondary accent color.",
    "Interface Font": "Change the font used by the app interface.",
    "Line Numbers": "Show or hide line numbers in the editor.",
    "Notepad Background": "Change the editor page background color.",
    "Font Color": "Set the default note text color.",
};

const EMOJI_LIST = [
    "😀", "😁", "😂", "🤣", "😊", "😍", "🤩", "😎", "🤔", "😴", "😭", "🤯",
    "👍", "👏", "🙌", "🙏", "💡", "🔥", "✅", "❌", "🎉", "🧠", "🚀", "📌",
    "📎", "📁", "📝", "📣", "⚡", "🌟", "💬", "❤️", "🎯", "📊", "⌛", "👀",
];

const FLOATING_PLACEMENT_OPTIONS = [
    { value: "middle", label: "Middle", row: 2, column: 2 },
    { value: "left-bottom", label: "Left bottom", row: 3, column: 1 },
    { value: "right-bottom", label: "Right bottom", row: 3, column: 3 },
];

function clampNumber(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function describeTool(tip) {
    if (!tip) return "";
    const description = TOOLTIP_DESCRIPTIONS[tip];
    return description ? `${tip}: ${description}` : tip;
}

function loadCashfreeSdk() {
    if (typeof window === "undefined") {
        return Promise.reject(new Error("Cashfree checkout is unavailable on the server."));
    }

    if (window.Cashfree) {
        return Promise.resolve(window.Cashfree);
    }

    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${CASHFREE_SDK_SRC}"]`);
        if (existingScript) {
            existingScript.addEventListener("load", () => resolve(window.Cashfree), { once: true });
            existingScript.addEventListener("error", () => reject(new Error("Failed to load Cashfree checkout.")), { once: true });
            return;
        }

        const script = document.createElement("script");
        script.src = CASHFREE_SDK_SRC;
        script.async = true;
        script.onload = () => resolve(window.Cashfree);
        script.onerror = () => reject(new Error("Failed to load Cashfree checkout."));
        document.head.appendChild(script);
    });
}

function getTooltipParts(tip) {
    if (!tip) return { title: "", description: "" };
    return {
        title: tip,
        description: TOOLTIP_DESCRIPTIONS[tip] || "",
    };
}

function RichTooltipBody({ tip }) {
    const { title, description } = getTooltipParts(tip);

    if (!title) return null;

    return (
        <>
            <span className="rich-tooltip-title">{title}</span>
            {description && (
                <span className="rich-tooltip-text">{description}</span>
            )}
        </>
    );
}

function TipBtn({ tip, className, onClick, onMouseDown, onMouseEnter, children, style, showTooltip = true }) {
    const describedTip = describeTool(tip);
    const tooltipAnchorRef = useRef(null);
    const [showPortalTooltip, setShowPortalTooltip] = useState(false);

    return (
        <>
            <button
                ref={tooltipAnchorRef}
                className={className || ""}
                data-tip={describedTip}
                aria-label={describedTip}
                onClick={(event) => {
                    setShowPortalTooltip(false);
                    onClick?.(event);
                }}
                onMouseDown={(event) => {
                    setShowPortalTooltip(false);
                    onMouseDown?.(event);
                }}
                onMouseEnter={(event) => {
                    if (showTooltip) setShowPortalTooltip(true);
                    onMouseEnter?.(event);
                }}
                onMouseLeave={() => setShowPortalTooltip(false)}
                type="button"
                style={style}
            >
                {children}
            </button>
            {showTooltip && (
                <PortalTooltip
                    tip={tip}
                    anchorRef={tooltipAnchorRef}
                    visible={showPortalTooltip}
                />
            )}
        </>
    );
}

function RichTipWrap({ tip, children }) {
    const describedTip = describeTool(tip);
    const tooltipAnchorRef = useRef(null);
    const [showPortalTooltip, setShowPortalTooltip] = useState(false);

    return (
        <span
            ref={tooltipAnchorRef}
            className="toolbar-tooltip-wrap"
            aria-label={describedTip}
            onMouseEnter={() => setShowPortalTooltip(true)}
            onMouseLeave={() => setShowPortalTooltip(false)}
            onPointerDown={() => setShowPortalTooltip(false)}
        >
            {children}
            <PortalTooltip
                tip={tip}
                anchorRef={tooltipAnchorRef}
                visible={showPortalTooltip}
            />
        </span>
    );
}

function PortalTooltip({ tip, anchorRef, visible }) {
    const [position, setPosition] = useState(null);

    const updatePosition = useCallback(() => {
        const anchor = anchorRef.current;
        if (!anchor) return;

        const rect = anchor.getBoundingClientRect();
        const tooltipHalfWidth = 132;
        setPosition({
            top: rect.bottom + 10,
            left: Math.max(
                tooltipHalfWidth + 8,
                Math.min(rect.left + rect.width / 2, window.innerWidth - tooltipHalfWidth - 8)
            ),
        });
    }, [anchorRef]);

    useEffect(() => {
        if (!visible) return undefined;

        updatePosition();
        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);

        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [updatePosition, visible]);

    if (!visible || !position || typeof document === "undefined") return null;

    return ReactDOM.createPortal(
        <span
            className="rich-tooltip rich-tooltip-portal"
            role="tooltip"
            style={{ top: position.top, left: position.left }}
        >
            <RichTooltipBody tip={tip} />
        </span>,
        document.body
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
    floatingPlacement = "right-bottom",
    onChangeFloatingPlacement,
    isFloatingWindow = false,
    isEmbeddedFloating = false,
    onToggleFloatingWindow,
    sidebarCollapsed = false,
    sidebarOpen = false,
    onToggleSidebar,
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
    const [isMobileToolbar, setIsMobileToolbar] = useState(false);
    const [isMobileToolsHidden, setIsMobileToolsHidden] = useState(false);
    const [showCompactMenu, setShowCompactMenu] = useState(false);
    const [showFloatingPlacementPicker, setShowFloatingPlacementPicker] = useState(false);
    const [floatingPlacementPosition, setFloatingPlacementPosition] = useState({ top: 0, left: 0 });
    const [hoveredFloatingPlacement, setHoveredFloatingPlacement] = useState(null);
    const [showTablePicker, setShowTablePicker] = useState(false);
    const [tablePosition, setTablePosition] = useState({ top: 0, left: 0 });
    const [tableRows, setTableRows] = useState(3);
    const [tableColumns, setTableColumns] = useState(3);
    const [activeTableRange, setActiveTableRange] = useState(null);
    const [showDonateModal, setShowDonateModal] = useState(false);
    const [donationProvider, setDonationProvider] = useState(null);
    const [donationError, setDonationError] = useState("");

    const dropdownRef = useRef(null);
    const advancedBtnRef = useRef(null);
    const advancedPortalRef = useRef(null);
    const compactMenuWrapRef = useRef(null);
    const toolbarShellRef = useRef(null);
    const toolbarRoomInfoRef = useRef(null);
    const emojiRef = useRef(null);
    const emojiBtnRef = useRef(null);
    const emojiPortalRef = useRef(null);
    const tableRef = useRef(null);
    const tableBtnRef = useRef(null);
    const tablePortalRef = useRef(null);
    const floatingPlacementPortalRef = useRef(null);
    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const savedSelectionRef = useRef(null);
    const floatingPlacementWrapRef = useRef(null);

    const saveEditorSelection = useCallback(() => {
        if (editor) {
            const { from, to } = editor.state.selection;
            savedSelectionRef.current = { from, to };
        }
    }, [editor]);

    const startDonationCheckout = useCallback(async (provider) => {
        setDonationProvider(provider);
        setDonationError("");

        try {
            const response = await fetch(`/api/donations/${provider}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.error || "Unable to start checkout. Please try again.");
            }

            if (provider === "stripe") {
                if (!data.url) {
                    throw new Error("Stripe did not return a checkout URL.");
                }
                window.location.assign(data.url);
                return;
            }

            if (provider === "paypal") {
                if (!data.url) {
                    throw new Error("PayPal did not return a checkout URL.");
                }
                window.location.assign(data.url);
                return;
            }

            if (provider === "cashfree") {
                if (!data.paymentSessionId) {
                    throw new Error("Cashfree did not return a payment session.");
                }

                const Cashfree = await loadCashfreeSdk();
                if (!Cashfree) {
                    throw new Error("Cashfree checkout is unavailable.");
                }

                const cashfree = Cashfree({
                    mode: data.environment === "production" ? "production" : "sandbox",
                });
                await cashfree.checkout({
                    paymentSessionId: data.paymentSessionId,
                    redirectTarget: "_modal",
                });
                return;
            }

            throw new Error("Unknown checkout provider.");
        } catch (error) {
            setDonationError(error.message || "Unable to start checkout. Please try again.");
        } finally {
            setDonationProvider(null);
        }
    }, []);

    const getActiveTableRange = useCallback((editorInstance = editor) => {
        const selection = editorInstance?.state?.selection;
        if (!selection) return null;

        if (selection.node?.type?.name === "table") {
            return { from: selection.from, to: selection.to };
        }

        const $from = selection.$from;
        for (let depth = $from.depth; depth > 0; depth -= 1) {
            if ($from.node(depth)?.type?.name === "table") {
                return {
                    from: $from.before(depth),
                    to: $from.after(depth),
                };
            }
        }

        return null;
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

        const mediaQuery = window.matchMedia("(max-width: 900px)");
        const updateMobileToolbar = () => setIsMobileToolbar(mediaQuery.matches);

        updateMobileToolbar();
        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", updateMobileToolbar);
            return () => mediaQuery.removeEventListener("change", updateMobileToolbar);
        }

        mediaQuery.addListener(updateMobileToolbar);
        return () => mediaQuery.removeListener(updateMobileToolbar);
    }, []);

    useEffect(() => {
        if (!isMobileToolbar) {
            setIsMobileToolsHidden(false);
        }
    }, [isMobileToolbar]);

    useEffect(() => {
        if (typeof document === "undefined") return undefined;

        const root = document.documentElement;
        if (isMobileToolbar && isMobileToolsHidden) {
            root.setAttribute("data-mobile-tools-hidden", "true");
        } else {
            root.removeAttribute("data-mobile-tools-hidden");
        }

        return () => {
            root.removeAttribute("data-mobile-tools-hidden");
        };
    }, [isMobileToolbar, isMobileToolsHidden]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const updateCompactMode = () => {
            const toolbarShell = toolbarShellRef.current;
            const toolbarWidth = toolbarShell?.getBoundingClientRect().width;
            const roomInfoWidth = toolbarRoomInfoRef.current?.getBoundingClientRect().width || 0;
            const toolbarGap = toolbarShell
                ? Number.parseFloat(window.getComputedStyle(toolbarShell).columnGap || "0") || 0
                : 0;
            const reservedWidth = roomInfoWidth + toolbarGap;
            const width = Number.isFinite(toolbarWidth) && toolbarWidth > 0
                ? Math.max(toolbarWidth - reservedWidth, 0)
                : window.innerWidth;
            setIsCompactToolbar(width <= COMPACT_TOOLBAR_MAX_WIDTH);
        };

        updateCompactMode();
        window.addEventListener("resize", updateCompactMode);
        let resizeObserver = null;
        if (typeof ResizeObserver !== "undefined" && toolbarShellRef.current) {
            resizeObserver = new ResizeObserver(updateCompactMode);
            resizeObserver.observe(toolbarShellRef.current);
            if (toolbarRoomInfoRef.current) {
                resizeObserver.observe(toolbarRoomInfoRef.current);
            }
        }

        return () => {
            window.removeEventListener("resize", updateCompactMode);
            resizeObserver?.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!isCompactToolbar || isMobileToolbar) {
            setShowCompactMenu(false);
        }
    }, [isCompactToolbar, isMobileToolbar]);

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
            if (
                tableRef.current && !tableRef.current.contains(target) &&
                (!tablePortalRef.current || !tablePortalRef.current.contains(target))
            ) {
                setShowTablePicker(false);
            }
            if (
                floatingPlacementWrapRef.current &&
                !floatingPlacementWrapRef.current.contains(target) &&
                (!floatingPlacementPortalRef.current || !floatingPlacementPortalRef.current.contains(target))
            ) {
                setShowFloatingPlacementPicker(false);
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
            setActiveTableRange(null);
            return;
        }

        const syncTypography = () => {
            setActiveTableRange(getActiveTableRange(editor));
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
    }, [editor, getActiveTableRange]);

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

    const shouldUseCompactToolbar = isCompactToolbar && !isMobileToolbar;

    const openEmojiPickerFromAnchor = (anchorElement) => {
        if (!anchorElement) return;
        const rect = anchorElement.getBoundingClientRect();
        setEmojiPosition({
            top: isMobileToolbar ? rect.top : rect.bottom + 8,
            left: isMobileToolbar
                ? clampNumber(rect.right + 8, 8, Math.max(8, window.innerWidth - 248))
                : rect.left,
        });
        setShowEmojiPicker((prev) => !prev);
    };

    const openTablePickerFromAnchor = (anchorElement) => {
        if (!anchorElement) return;
        const rect = anchorElement.getBoundingClientRect();
        setTablePosition({
            top: isMobileToolbar ? rect.top : rect.bottom + 8,
            left: isMobileToolbar
                ? clampNumber(rect.right + 8, 8, Math.max(8, window.innerWidth - 292))
                : Math.min(rect.left, window.innerWidth - 292),
        });
        setShowTablePicker((prev) => !prev);
        setShowEmojiPicker(false);
    };

    const openAdvancedFromAnchor = (anchorElement) => {
        if (!anchorElement) return;

        if (!showAdvanced) {
            const rect = anchorElement.getBoundingClientRect();
            const dropdownWidth = 260;
            const estimatedDropdownHeight = 520;
            const viewportPadding = 12;
            const triggerGap = 12;
            const maxTop = Math.max(
                viewportPadding,
                window.innerHeight - Math.min(estimatedDropdownHeight, window.innerHeight - viewportPadding * 2) - viewportPadding
            );
            const canOpenAbove = rect.top - estimatedDropdownHeight - triggerGap >= viewportPadding;
            setAdvancedPosition({
                top: clampNumber(
                    canOpenAbove ? rect.top - estimatedDropdownHeight - triggerGap : rect.bottom + triggerGap,
                    viewportPadding,
                    maxTop
                ),
                right: "auto",
                left: clampNumber(
                    rect.right - dropdownWidth,
                    viewportPadding,
                    Math.max(viewportPadding, window.innerWidth - dropdownWidth - viewportPadding)
                ),
            });
        }
        setShowAdvanced((prev) => !prev);
    };

    const getFloatingPlacementPosition = useCallback((anchorElement, popoverElement = null) => {
        if (!anchorElement) return;

        const rect = anchorElement.getBoundingClientRect();
        const viewportPadding = 12;
        const triggerGap = 12;
        const popoverRect = popoverElement?.getBoundingClientRect();
        const popoverWidth = popoverRect?.width || 188;
        const popoverHeight = popoverRect?.height || 220;
        const left = clampNumber(
            rect.right - popoverWidth,
            viewportPadding,
            Math.max(viewportPadding, window.innerWidth - popoverWidth - viewportPadding)
        );

        const topAbove = rect.top - popoverHeight - triggerGap;
        const topBelow = rect.bottom + triggerGap;
        const canOpenAbove = topAbove >= viewportPadding;
        const preferredTop = canOpenAbove ? topAbove : topBelow;
        const top = clampNumber(
            preferredTop,
            viewportPadding,
            Math.max(viewportPadding, window.innerHeight - popoverHeight - viewportPadding)
        );

        return { top, left };
    }, []);

    const openFloatingPlacementFromAnchor = (anchorElement) => {
        const nextPosition = getFloatingPlacementPosition(anchorElement);
        if (!nextPosition) return;

        setFloatingPlacementPosition(nextPosition);
        setShowFloatingPlacementPicker(true);
    };

    const updateFloatingPlacementPosition = useCallback(() => {
        const anchorElement = floatingPlacementWrapRef.current;
        const popoverElement = floatingPlacementPortalRef.current;
        const nextPosition = getFloatingPlacementPosition(anchorElement, popoverElement);
        if (!nextPosition) return;

        setFloatingPlacementPosition((currentPosition) => (
            currentPosition.top === nextPosition.top && currentPosition.left === nextPosition.left
                ? currentPosition
                : nextPosition
        ));
    }, [getFloatingPlacementPosition]);

    useLayoutEffect(() => {
        if (!showFloatingPlacementPicker) return;
        updateFloatingPlacementPosition();
    }, [showFloatingPlacementPicker, updateFloatingPlacementPosition]);

    useEffect(() => {
        if (!showFloatingPlacementPicker) return undefined;

        window.addEventListener("resize", updateFloatingPlacementPosition);
        window.addEventListener("scroll", updateFloatingPlacementPosition, true);

        return () => {
            window.removeEventListener("resize", updateFloatingPlacementPosition);
            window.removeEventListener("scroll", updateFloatingPlacementPosition, true);
        };
    }, [showFloatingPlacementPicker, updateFloatingPlacementPosition]);

    useEffect(() => {
        if (!showFloatingPlacementPicker || typeof ResizeObserver === "undefined") return undefined;
        const anchorElement = floatingPlacementWrapRef.current;
        const popoverElement = floatingPlacementPortalRef.current;
        if (!anchorElement && !popoverElement) return undefined;

        const resizeObserver = new ResizeObserver(updateFloatingPlacementPosition);
        if (anchorElement) resizeObserver.observe(anchorElement);
        if (popoverElement) resizeObserver.observe(popoverElement);

        return () => resizeObserver.disconnect();
    }, [showFloatingPlacementPicker, updateFloatingPlacementPosition]);

    const insertEmoji = (emoji) => {
        if (!editor) return;
        editor.chain().focus().insertContent(emoji).run();
        setShowEmojiPicker(false);
    };

    const clampTableSize = (value, max) => {
        const parsed = Number.parseInt(String(value), 10);
        if (!Number.isFinite(parsed)) return 1;
        return Math.min(Math.max(parsed, 1), max);
    };

    const selectedFloatingPlacementLabel =
        FLOATING_PLACEMENT_OPTIONS.find((option) => option.value === floatingPlacement)?.label ||
        "Right bottom";
    const previewFloatingPlacement =
        FLOATING_PLACEMENT_OPTIONS.find((option) => option.value === hoveredFloatingPlacement) ||
        FLOATING_PLACEMENT_OPTIONS.find((option) => option.value === floatingPlacement) ||
        FLOATING_PLACEMENT_OPTIONS[2];

    const insertTable = (rows = tableRows, columns = tableColumns) => {
        if (!editor) return;

        const rowCount = clampTableSize(rows, MAX_TABLE_ROWS);
        const columnCount = clampTableSize(columns, MAX_TABLE_COLUMNS);
        const tableContent = {
            type: "table",
            content: Array.from({ length: rowCount }, () => ({
                type: "tableRow",
                content: Array.from({ length: columnCount }, () => ({
                    type: "tableCell",
                    content: [{ type: "paragraph" }],
                })),
            })),
        };
        const contentToInsert = [tableContent, { type: "paragraph" }];
        const insertPos = getInsertPosAfterSelectedMediaNode(editor);
        const chain = editor.chain().focus();

        if (typeof insertPos === "number") {
            chain.insertContentAt(insertPos, contentToInsert).run();
        } else {
            chain.insertContent(contentToInsert).run();
        }

        setTableRows(rowCount);
        setTableColumns(columnCount);
        setShowTablePicker(false);
        setShowCompactMenu(false);
    };

    const deleteActiveTable = () => {
        if (!editor) return;
        const tableRange = getActiveTableRange(editor);
        if (!tableRange) return;

        editor
            .chain()
            .focus()
            .deleteRange(tableRange)
            .run();
        setActiveTableRange(null);
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
        <>
            <div
                className={`editor-toolbar ${isMobileToolbar ? "editor-toolbar-mobile-tools" : ""} ${isMobileToolsHidden ? "mobile-tools-hidden" : ""}`}
                ref={toolbarShellRef}
            >
            <div
                className={`toolbar-primary ${shouldUseCompactToolbar ? "toolbar-primary-compact" : ""}`}
            >
                {activeTableRange && (
                    <>
                        <div className="toolbar-group">
                            <TipBtn
                                tip="Delete Table"
                                className="toolbar-btn danger"
                                onClick={deleteActiveTable}
                            >
                                <i className="fa-solid fa-table-cells-large" />
                            </TipBtn>
                        </div>

                        <div className="toolbar-divider" />
                    </>
                )}

	                <div className="toolbar-group toolbar-group-font">
	                    <RichTipWrap tip="Font Family">
	                        <select
	                            className="toolbar-select toolbar-select-font"
	                            value={activeFontFamily}
	                            onMouseDown={saveEditorSelection}
	                            onFocus={saveEditorSelection}
	                            onChange={(e) => applyFontFamily(e.target.value)}
	                            aria-label={describeTool("Font Family")}
	                        >
	                            {TEXT_FONT_OPTIONS.map((option) => (
	                                <option key={option.label} value={option.value}>
	                                    {option.label}
	                                </option>
	                            ))}
	                        </select>
	                    </RichTipWrap>

	                    <RichTipWrap tip="Font Size">
	                        <select
	                            className="toolbar-select toolbar-select-size"
	                            value={activeFontSize}
	                            onMouseDown={saveEditorSelection}
	                            onFocus={saveEditorSelection}
	                            onChange={(e) => applyFontSize(e.target.value)}
	                            aria-label={describeTool("Font Size")}
	                        >
	                            <option value="default">Size</option>
	                            {FONT_SIZES.map((size) => (
	                                <option key={size} value={size}>
	                                    {size}px
	                                </option>
	                            ))}
	                        </select>
	                    </RichTipWrap>
	                </div>

                {!shouldUseCompactToolbar && (
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
                            {btn("fa-solid fa-bold", (e) => e.chain().focus().toggleBold().run(), editor?.isActive("bold"), "Bold")}
                            {btn("fa-solid fa-italic", (e) => e.chain().focus().toggleItalic().run(), editor?.isActive("italic"), "Italic")}
                            {btn("fa-solid fa-underline", (e) => e.chain().focus().toggleUnderline().run(), editor?.isActive("underline"), "Underline")}
                            {btn("fa-solid fa-strikethrough", (e) => e.chain().focus().toggleStrike().run(), editor?.isActive("strike"), "Strikethrough")}
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
	                            <RichTipWrap tip="Text Color">
	                                <input
	                                    type="color"
	                                    className="toolbar-color-input toolbar-text-color"
	                                    value={activeTextColor}
	                                    onMouseDown={saveEditorSelection}
	                                    onFocus={saveEditorSelection}
	                                    onChange={(e) => applyTextColor(e.target.value)}
	                                    aria-label={describeTool("Text Color")}
	                                />
	                            </RichTipWrap>
                            <TipBtn
                                tip={editor?.isActive("highlight") ? "Remove Highlight" : "Highlight Text"}
                                className={`toolbar-btn ${editor?.isActive("highlight") ? "active" : ""}`}
                                onMouseDown={saveEditorSelection}
                                onClick={toggleHighlight}
                            >
                                <i className="fa-solid fa-highlighter" />
                            </TipBtn>
	                            <RichTipWrap tip="Highlight Color">
	                                <input
	                                    type="color"
	                                    className="toolbar-color-input toolbar-highlight-color"
	                                    value={activeHighlightColor}
	                                    onMouseDown={saveEditorSelection}
	                                    onFocus={saveEditorSelection}
	                                    onChange={(e) => applyHighlightColor(e.target.value)}
	                                    aria-label={describeTool("Highlight Color")}
	                                />
	                            </RichTipWrap>
                        </div>

                        <div className="toolbar-divider" />

                        <div className="toolbar-group">
	                            <RichTipWrap tip="Paragraph Line Spacing">
	                                <select
	                                    className="toolbar-select toolbar-select-spacing"
	                                    value={activeParagraphLineSpacing}
	                                    onMouseDown={saveEditorSelection}
	                                    onFocus={saveEditorSelection}
	                                    onChange={(e) => applyParagraphLineSpacing(e.target.value)}
	                                    aria-label={describeTool("Paragraph Line Spacing")}
	                                >
	                                    {PARAGRAPH_LINE_SPACING_OPTIONS.map((option) => (
	                                        <option key={option.value} value={option.value}>
	                                            {option.label}
	                                        </option>
	                                    ))}
	                                </select>
	                            </RichTipWrap>
                            <TipBtn
                                tip={paragraphNoSpaceAfter ? "Add Space After Paragraph" : "Remove Space After Paragraph"}
                                className={`toolbar-btn ${paragraphNoSpaceAfter ? "active" : ""}`}
                                onMouseDown={saveEditorSelection}
                                onClick={toggleParagraphSpaceAfter}
                            >
                                <i className="fa-solid fa-text-height" />
                            </TipBtn>
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

                            <div className="table-picker-wrapper" ref={tableRef}>
                                <span ref={tableBtnRef} style={{ display: "inline-flex" }}>
                                    <TipBtn
                                        tip="Insert Table"
                                        className={`toolbar-btn ${showTablePicker ? "active" : ""}`}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            openTablePickerFromAnchor(event.currentTarget);
                                        }}
                                    >
                                        <i className="fa-solid fa-table-cells" />
                                    </TipBtn>
                                </span>
                            </div>

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
                    </>
                )}

                {shouldUseCompactToolbar && (
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
	                                    <RichTipWrap tip="Paragraph Line Spacing">
	                                        <select
	                                            className="toolbar-select toolbar-select-spacing"
	                                            value={activeParagraphLineSpacing}
	                                            onMouseDown={saveEditorSelection}
	                                            onFocus={saveEditorSelection}
	                                            onChange={(e) => applyParagraphLineSpacing(e.target.value)}
	                                            aria-label={describeTool("Paragraph Line Spacing")}
	                                        >
	                                            {PARAGRAPH_LINE_SPACING_OPTIONS.map((option) => (
	                                                <option key={option.value} value={option.value}>
	                                                    {option.label}
	                                                </option>
	                                            ))}
	                                        </select>
	                                    </RichTipWrap>
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
                                    {btn("fa-solid fa-bold", (e) => e.chain().focus().toggleBold().run(), editor?.isActive("bold"), "Bold")}
                                    {btn("fa-solid fa-italic", (e) => e.chain().focus().toggleItalic().run(), editor?.isActive("italic"), "Italic")}
                                    {btn("fa-solid fa-underline", (e) => e.chain().focus().toggleUnderline().run(), editor?.isActive("underline"), "Underline")}
                                    {btn("fa-solid fa-strikethrough", (e) => e.chain().focus().toggleStrike().run(), editor?.isActive("strike"), "Strikethrough")}
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
	                                    <RichTipWrap tip="Text Color">
	                                        <input
	                                            type="color"
	                                            className="toolbar-color-input toolbar-text-color"
	                                            value={activeTextColor}
	                                            onMouseDown={saveEditorSelection}
	                                            onFocus={saveEditorSelection}
	                                            onChange={(e) => applyTextColor(e.target.value)}
	                                            aria-label={describeTool("Text Color")}
	                                        />
	                                    </RichTipWrap>
                                    <TipBtn
                                        tip={editor?.isActive("highlight") ? "Remove Highlight" : "Highlight Text"}
                                        className={`toolbar-btn ${editor?.isActive("highlight") ? "active" : ""}`}
                                        onMouseDown={saveEditorSelection}
                                        onClick={toggleHighlight}
                                    >
                                        <i className="fa-solid fa-highlighter" />
                                    </TipBtn>
	                                    <RichTipWrap tip="Highlight Color">
	                                        <input
	                                            type="color"
	                                            className="toolbar-color-input toolbar-highlight-color"
	                                            value={activeHighlightColor}
	                                            onMouseDown={saveEditorSelection}
	                                            onFocus={saveEditorSelection}
	                                            onChange={(e) => applyHighlightColor(e.target.value)}
	                                            aria-label={describeTool("Highlight Color")}
	                                        />
	                                    </RichTipWrap>
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
                                    <div className="table-picker-wrapper" ref={tableRef}>
                                        <span ref={tableBtnRef} style={{ display: "inline-flex" }}>
                                            <TipBtn
                                                tip="Insert Table"
                                                className={`toolbar-btn ${showTablePicker ? "active" : ""}`}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    openTablePickerFromAnchor(event.currentTarget);
                                                }}
                                            >
                                                <i className="fa-solid fa-table-cells" />
                                            </TipBtn>
                                        </span>
                                    </div>
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
	                                title={`Insert emoji: ${emoji}`}
	                                aria-label={`Insert emoji: ${emoji}`}
	                                onClick={() => insertEmoji(emoji)}
	                            >
                                {emoji}
                            </button>
                        ))}
                    </div>,
                    document.body
                )}

                {showTablePicker && ReactDOM.createPortal(
                    <div
                        className="table-picker-popover"
                        ref={tablePortalRef}
                        style={{ top: tablePosition.top, left: tablePosition.left }}
                    >
                        <div className="table-picker-title">
                            <span>Insert table</span>
                            <strong>{tableRows} x {tableColumns}</strong>
                        </div>

                        <div className="table-picker-grid" aria-label="Choose table size">
                            {Array.from({ length: TABLE_PICKER_ROWS }, (_, rowIndex) =>
                                Array.from({ length: TABLE_PICKER_COLUMNS }, (_, columnIndex) => {
                                    const rows = rowIndex + 1;
                                    const columns = columnIndex + 1;
                                    const isSelected = rows <= tableRows && columns <= tableColumns;

                                    return (
	                                        <button
	                                            type="button"
	                                            key={`${rows}-${columns}`}
	                                            className={`table-picker-cell ${isSelected ? "selected" : ""}`}
                                            onMouseEnter={() => {
                                                setTableRows(rows);
                                                setTableColumns(columns);
                                            }}
                                            onFocus={() => {
                                                setTableRows(rows);
                                                setTableColumns(columns);
	                                            }}
	                                            onClick={() => insertTable(rows, columns)}
	                                            aria-label={`Insert ${rows} row by ${columns} column table`}
	                                            title={`Insert ${rows} row by ${columns} column table`}
	                                        />
                                    );
                                })
                            )}
                        </div>

                        <div className="table-picker-custom">
                            <label>
                                <span>Rows</span>
                                <input
                                    type="number"
                                    min="1"
                                    max={MAX_TABLE_ROWS}
	                                    value={tableRows}
	                                    title="Rows: Set how many table rows to insert."
	                                    aria-label="Rows: Set how many table rows to insert."
	                                    onChange={(event) => setTableRows(
                                        clampTableSize(event.target.value, MAX_TABLE_ROWS)
                                    )}
                                />
                            </label>
                            <label>
                                <span>Columns</span>
                                <input
                                    type="number"
                                    min="1"
                                    max={MAX_TABLE_COLUMNS}
	                                    value={tableColumns}
	                                    title="Columns: Set how many table columns to insert."
	                                    aria-label="Columns: Set how many table columns to insert."
	                                    onChange={(event) => setTableColumns(
                                        clampTableSize(event.target.value, MAX_TABLE_COLUMNS)
                                    )}
                                />
                            </label>
                            <button
	                                type="button"
	                                className="table-picker-insert"
	                                title="Insert table: Add the selected table size to the note."
	                                aria-label="Insert table: Add the selected table size to the note."
	                                onClick={() => insertTable()}
                            >
                                Insert
                            </button>
                        </div>
                    </div>,
                    document.body
                )}

                {showAdvanced && ReactDOM.createPortal(
                        <div
                            className="advanced-dropdown"
                            ref={advancedPortalRef}
                            style={{
                                top: advancedPosition.top,
                                right: advancedPosition.right,
                                left: advancedPosition.left,
                            }}
                        >
                            <div className="advanced-dropdown-title">
                                <i className="fa-solid fa-sliders" style={{ marginRight: 6 }} />
                                Advanced Options
                            </div>

                            <div className="toolbar-input-row">
                                <label className="advanced-label" htmlFor="accentPrimaryPicker">Primary Accent</label>
	                                <RichTipWrap tip="Primary Accent">
	                                    <input
	                                        id="accentPrimaryPicker"
	                                        type="color"
	                                        className="toolbar-color-input"
	                                        value={accentPrimary || "#6c63ff"}
	                                        aria-label={describeTool("Primary Accent")}
	                                        onChange={(e) => onChangeAccentPrimary?.(e.target.value)}
	                                    />
	                                </RichTipWrap>
                            </div>

                            <div className="toolbar-input-row">
                                <label className="advanced-label" htmlFor="accentSecondaryPicker">Secondary Accent</label>
	                                <RichTipWrap tip="Secondary Accent">
	                                    <input
	                                        id="accentSecondaryPicker"
	                                        type="color"
	                                        className="toolbar-color-input"
	                                        value={accentSecondary || "#00d4aa"}
	                                        aria-label={describeTool("Secondary Accent")}
	                                        onChange={(e) => onChangeAccentSecondary?.(e.target.value)}
	                                    />
	                                </RichTipWrap>
                            </div>

                            <div className="toolbar-input-row">
                                <label className="advanced-label" htmlFor="uiFontPicker">Interface Font</label>
	                                <RichTipWrap tip="Interface Font">
	                                    <select
	                                        id="uiFontPicker"
	                                        className="toolbar-select toolbar-select-advanced"
	                                        value={uiFontFamily || "default"}
	                                        aria-label={describeTool("Interface Font")}
	                                        onChange={(e) => onChangeUiFontFamily?.(e.target.value)}
	                                    >
	                                        {UI_FONT_OPTIONS.map((option) => (
	                                            <option key={option.label} value={option.value}>
	                                                {option.label}
	                                            </option>
	                                        ))}
	                                    </select>
	                                </RichTipWrap>
                            </div>

                            <div className="toggle-container" style={{ padding: "8px 4px" }}>
                                <span className="toggle-label">Line Numbers</span>
                                <button
                                    type="button"
                                    className={`toggle-switch ${showLineNumbers ? "active" : ""}`}
	                                    onClick={() => onChangeShowLineNumbers?.(!showLineNumbers)}
	                                    title={describeTool("Line Numbers")}
	                                    aria-label={describeTool("Line Numbers")}
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
	                                        title={`Notepad Background: ${c.name}. ${TOOLTIP_DESCRIPTIONS["Notepad Background"]}`}
	                                        aria-label={`Notepad Background: ${c.name}. ${TOOLTIP_DESCRIPTIONS["Notepad Background"]}`}
	                                        role="button"
	                                        tabIndex={0}
	                                        onClick={() => onChangeBg(c.value)}
	                                        onKeyDown={(event) => {
	                                            if (event.key === "Enter" || event.key === " ") {
	                                                event.preventDefault();
	                                                onChangeBg(c.value);
	                                            }
	                                        }}
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
	                                        title={`Font Color: ${c.name}. ${TOOLTIP_DESCRIPTIONS["Font Color"]}`}
	                                        aria-label={`Font Color: ${c.name}. ${TOOLTIP_DESCRIPTIONS["Font Color"]}`}
	                                        role="button"
	                                        tabIndex={0}
	                                        onClick={() => onChangeFontColor(c.value)}
	                                        onKeyDown={(event) => {
	                                            if (event.key === "Enter" || event.key === " ") {
	                                                event.preventDefault();
	                                                onChangeFontColor(c.value);
	                                            }
	                                        }}
	                                    />
                                ))}
                            </div>
                        </div>,
                        document.body
                    )}
            </div>

            <span className="toolbar-donate-wrap toolbar-donate-top">
                <TipBtn
                    tip="Buy Me a Meal"
                    className="toolbar-donate-btn"
                    onClick={() => {
                        setDonationError("");
                        setShowDonateModal(true);
                    }}
                >
                    <i className="fa-solid fa-heart" />
                    <span>Donate us</span>
                </TipBtn>
            </span>

            <div className="toolbar-room-info" ref={toolbarRoomInfoRef}>
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

            <nav className="bottom-navigation-panel" aria-label="Room actions">
                {isMobileToolbar && (
                    <TipBtn
                        tip={isMobileToolsHidden ? "Show Tools" : "Hide Tools"}
                        className={`bottom-nav-btn bottom-nav-tools-btn ${!isMobileToolsHidden ? "active" : ""}`}
                        onClick={() => setIsMobileToolsHidden((prev) => !prev)}
                    >
                        <i className="fa-solid fa-screwdriver-wrench" />
                    </TipBtn>
                )}

                <TipBtn
                    tip={sidebarOpen || !sidebarCollapsed ? "Hide Sidebar" : "Open Sidebar"}
                    className={`bottom-nav-btn bottom-nav-sidebar-btn ${!sidebarCollapsed || sidebarOpen ? "active" : ""}`}
                    onClick={() => onToggleSidebar?.()}
                >
                    <i className="fa-solid fa-table-columns" />
                </TipBtn>

                <TipBtn
                    tip={theme === "dark" ? "Light Mode" : "Dark Mode"}
                    className="bottom-nav-btn theme-toggle-btn"
                    onClick={onToggleTheme}
                >
                    <i className={theme === "dark" ? "fa-regular fa-sun" : "fa-regular fa-moon"} />
                </TipBtn>

                <div className="advanced-dropdown-wrapper toolbar-settings-action" ref={dropdownRef}>
                    <span ref={advancedBtnRef} style={{ display: "inline-flex" }}>
                        <TipBtn
                            tip="Advanced Options"
                            className={`bottom-nav-btn ${showAdvanced ? "active" : ""}`}
                            onClick={(event) => {
                                event.stopPropagation();
                                openAdvancedFromAnchor(event.currentTarget);
                            }}
                        >
                            <i className="fa-solid fa-gear" />
                        </TipBtn>
                    </span>
                </div>

                <div
                    className="floating-placement-wrap"
                    ref={floatingPlacementWrapRef}
                    onMouseLeave={(event) => {
                        if (
                            floatingPlacementPortalRef.current &&
                            event.relatedTarget instanceof Node &&
                            floatingPlacementPortalRef.current.contains(event.relatedTarget)
                        ) {
                            return;
                        }
                        setHoveredFloatingPlacement(null);
                        setShowFloatingPlacementPicker(false);
                    }}
                >
                    <TipBtn
                        tip={isFloatingWindow ? "Close Floating Note" : "Float Note Window"}
                        className={`bottom-nav-btn ${isFloatingWindow ? "active" : ""}`}
                        onClick={onToggleFloatingWindow}
                        showTooltip={isFloatingWindow}
                        onMouseDown={(event) => {
                            if (isFloatingWindow) return;
                            event.stopPropagation();
                        }}
                        onMouseEnter={(event) => {
                            if (isFloatingWindow) return;
                            openFloatingPlacementFromAnchor(event.currentTarget);
                        }}
                    >
                        <i className={isFloatingWindow || isEmbeddedFloating ? "fa-solid fa-xmark" : "fa-regular fa-window-restore"} />
                    </TipBtn>
                </div>

                {isMobileToolbar && (
                    <span className="toolbar-donate-wrap toolbar-donate-nav">
                        <TipBtn
                            tip="Buy Me a Meal"
                            className="toolbar-donate-btn"
                            onClick={() => {
                                setDonationError("");
                                setShowDonateModal(true);
                            }}
                        >
                            <i className="fa-solid fa-heart" />
                            <span>Donate us</span>
                        </TipBtn>
                    </span>
                )}
            </nav>

            {showDonateModal && ReactDOM.createPortal(
                <div
                    className="modal-overlay donate-modal-overlay"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            setShowDonateModal(false);
                            setDonationError("");
                        }
                    }}
                >
                    <div className="modal-content donate-modal-content">
                        <button
                            className="modal-close"
                            type="button"
                            onClick={() => {
                                setShowDonateModal(false);
                                setDonationError("");
                            }}
                            aria-label="Close donation popup"
                        >
                            ×
                        </button>
                        <h2 className="modal-title">Buy Me a Meal</h2>
                        <p className="modal-subtitle">
                            Choose a secure checkout provider to support Teamnote.
                        </p>

                        <div className="donate-provider-actions">
                            <button
                                type="button"
                                className="donate-provider-btn stripe"
                                disabled={donationProvider !== null}
                                onClick={() => startDonationCheckout("stripe")}
                            >
                                <i className="fa-brands fa-stripe-s" />
                                <span>{donationProvider === "stripe" ? "Opening Stripe..." : "Pay with Stripe"}</span>
                            </button>
                            <button
                                type="button"
                                className="donate-provider-btn paypal"
                                disabled={donationProvider !== null}
                                onClick={() => startDonationCheckout("paypal")}
                            >
                                <i className="fa-brands fa-paypal" />
                                <span>{donationProvider === "paypal" ? "Opening PayPal..." : "Pay with PayPal"}</span>
                            </button>
                            <button
                                type="button"
                                className="donate-provider-btn cashfree"
                                disabled={donationProvider !== null}
                                onClick={() => startDonationCheckout("cashfree")}
                            >
                                <i className="fa-solid fa-credit-card" />
                                <span>{donationProvider === "cashfree" ? "Opening Cashfree..." : "Pay with Cashfree"}</span>
                            </button>
                        </div>

                        {donationError && (
                            <div className="donate-error" role="alert">
                                {donationError}
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
            {!isFloatingWindow && showFloatingPlacementPicker && ReactDOM.createPortal(
                <div
                    className="floating-placement-popover"
                    ref={floatingPlacementPortalRef}
                    role="dialog"
                    aria-label="Floating window placement"
                    style={{ top: floatingPlacementPosition.top, left: floatingPlacementPosition.left }}
                    onMouseEnter={() => setShowFloatingPlacementPicker(true)}
                    onMouseLeave={(event) => {
                        if (
                            floatingPlacementWrapRef.current &&
                            event.relatedTarget instanceof Node &&
                            floatingPlacementWrapRef.current.contains(event.relatedTarget)
                        ) {
                            return;
                        }
                        setHoveredFloatingPlacement(null);
                        setShowFloatingPlacementPicker(false);
                    }}
                >
                    <div className="floating-placement-title">Floating window position</div>
                    <div className="floating-placement-description">
                        {TOOLTIP_DESCRIPTIONS["Float Note Window"]}
                    </div>
	                    <div className="floating-placement-preview">
	                        <div className="floating-placement-screen">
	                            {FLOATING_PLACEMENT_OPTIONS.map((option) => (
	                                <button
	                                    key={option.value}
                                    type="button"
                                    className={`floating-placement-node ${floatingPlacement === option.value ? "active" : ""}`}
                                    style={{
                                        gridRow: option.row,
                                        gridColumn: option.column,
                                    }}
                                    onMouseEnter={() => setHoveredFloatingPlacement(option.value)}
                                    onMouseLeave={() => setHoveredFloatingPlacement(null)}
                                    onPointerDown={() => setHoveredFloatingPlacement(null)}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        setHoveredFloatingPlacement(null);
                                        setShowFloatingPlacementPicker(false);
                                        onChangeFloatingPlacement?.(option.value);
                                        onToggleFloatingWindow?.(option.value);
                                    }}
                                    aria-label={`Place floating window at ${option.label}`}
                                >
                                    <span />
                                </button>
                            ))}
                        </div>
                    </div>
	                    <div className="floating-placement-current">{selectedFloatingPlacementLabel}</div>
                </div>,
                document.body
            )}
            {!isFloatingWindow && showFloatingPlacementPicker && hoveredFloatingPlacement && previewFloatingPlacement && ReactDOM.createPortal(
                <div
                    className={`floating-placement-browser-ghost placement-${previewFloatingPlacement.value}`}
                    aria-hidden="true"
                />,
                document.body
            )}
        </>
    );
}
