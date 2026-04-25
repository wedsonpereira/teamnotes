"use client";

import { useState, useRef, useEffect, useCallback, useMemo, createPortal } from "react";
import ReactDOM from "react-dom";

const TAB_RENDER_LIMIT = 28;
const PAGE_TAB_DRAG_MIME = "application/x-teamnote-page-tab";

function moveItem(items, fromIndex, toIndex) {
    const nextItems = [...items];
    const [movedItem] = nextItems.splice(fromIndex, 1);
    nextItems.splice(toIndex, 0, movedItem);
    return nextItems;
}

function areArraysEqual(first, second) {
    return first.length === second.length && first.every((item, index) => item === second[index]);
}

export default function PageTabs({
    roomId,
    userId,
    socket,
    activePage,
    onPageChange,
}) {
    const [pages, setPages] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [menuPosition, setMenuPosition] = useState(null);
    const [moreMenuOpen, setMoreMenuOpen] = useState(false);
    const [pinnedIds, setPinnedIds] = useState([]);
    const [deleteConfirmPage, setDeleteConfirmPage] = useState(null);
    const [draggingPageId, setDraggingPageId] = useState(null);
    const [dragOverPageId, setDragOverPageId] = useState(null);

    const editInputRef = useRef(null);
    const menuRef = useRef(null);
    const moreMenuRef = useRef(null);
    const deleteDialogRef = useRef(null);
    const suppressNextClickRef = useRef(false);

    const notifySessionExpired = () => {
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("teamnote-session-expired"));
        }
    };

    useEffect(() => {
        if (!roomId || typeof window === "undefined") return;

        const saved = localStorage.getItem(`teamnote_pinned_tabs_${roomId}`);
        if (!saved) {
            setPinnedIds([]);
            return;
        }

        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                setPinnedIds(parsed.filter((id) => typeof id === "string"));
            }
        } catch (err) {
            console.warn("Failed to parse pinned tabs:", err);
            setPinnedIds([]);
        }
    }, [roomId]);

    useEffect(() => {
        if (!roomId || typeof window === "undefined") return;
        localStorage.setItem(
            `teamnote_pinned_tabs_${roomId}`,
            JSON.stringify(pinnedIds)
        );
    }, [roomId, pinnedIds]);

    const fetchPages = useCallback(async () => {
        if (!roomId || !userId) return;

        try {
            const res = await fetch(`/api/rooms/${roomId}/pages`);
            if (res.status === 401) {
                notifySessionExpired();
                return;
            }
            const data = await res.json();

            if (data.pages) {
                setPages(data.pages);

                // Keep pinned list clean when pages were removed.
                const validIds = new Set(data.pages.map((page) => page.id));
                setPinnedIds((prev) => prev.filter((id) => validIds.has(id)));

                if (!activePage && data.pages.length > 0) {
                    onPageChange(data.pages[0].id);
                }
            }
        } catch (err) {
            console.error("Failed to fetch pages:", err);
        }
    }, [roomId, userId, activePage, onPageChange]);

    useEffect(() => {
        fetchPages();
    }, [fetchPages]);

    useEffect(() => {
        if (!socket) return;

        const handler = () => fetchPages();
        socket.on("pages-refresh", handler);

        return () => socket.off("pages-refresh", handler);
    }, [socket, fetchPages]);

    useEffect(() => {
        const handleClick = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpenId(null);
            }
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
                setMoreMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        if (editingId && editInputRef.current) {
            editInputRef.current.focus();
            editInputRef.current.select();
        }
    }, [editingId]);

    const orderedPages = useMemo(() => {
        if (pages.length === 0) return [];

        const pageById = new Map(pages.map((page) => [page.id, page]));
        const pinnedPages = pinnedIds
            .map((id) => pageById.get(id))
            .filter(Boolean);

        const unpinnedPages = pages.filter((page) => !pinnedIds.includes(page.id));
        return [...pinnedPages, ...unpinnedPages];
    }, [pages, pinnedIds]);

    const { visiblePages, hiddenPages } = useMemo(() => {
        if (orderedPages.length <= TAB_RENDER_LIMIT) {
            return { visiblePages: orderedPages, hiddenPages: [] };
        }

        const visibleIdSet = new Set(
            orderedPages.slice(0, TAB_RENDER_LIMIT).map((page) => page.id)
        );

        [activePage, editingId, menuOpenId].forEach((id) => {
            if (!id) return;
            visibleIdSet.add(id);
        });

        return {
            visiblePages: orderedPages.filter((page) => visibleIdSet.has(page.id)),
            hiddenPages: orderedPages.filter((page) => !visibleIdSet.has(page.id)),
        };
    }, [orderedPages, activePage, editingId, menuOpenId]);

    const createPage = async () => {
        try {
            const res = await fetch(`/api/rooms/${roomId}/pages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });
            if (res.status === 401) {
                notifySessionExpired();
                return;
            }
            const data = await res.json();

            if (data.page) {
                setPages((prev) => [...prev, data.page]);
                onPageChange(data.page.id);
                socket?.emit("pages-changed", { roomId });
            }
        } catch (err) {
            console.error("Failed to create page:", err);
        }
    };

    const renamePage = async (pageId) => {
        const trimmed = editTitle.trim();

        if (!trimmed) {
            setEditingId(null);
            return;
        }

        try {
            const res = await fetch(`/api/rooms/${roomId}/pages/${pageId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: trimmed }),
            });
            if (res.status === 401) {
                notifySessionExpired();
                return;
            }

            if (res.ok) {
                setPages((prev) =>
                    prev.map((page) =>
                        page.id === pageId ? { ...page, title: trimmed } : page
                    )
                );
                socket?.emit("pages-changed", { roomId });
            }
        } catch (err) {
            console.error("Failed to rename page:", err);
        }

        setEditingId(null);
    };

    const requestDeletePage = (page) => {
        setDeleteConfirmPage(page);
        setMenuOpenId(null);
    };

    const confirmDeletePage = async () => {
        if (!deleteConfirmPage || pages.length <= 1) return;
        const pageId = deleteConfirmPage.id;
        setDeleteConfirmPage(null);

        try {
            const res = await fetch(
                `/api/rooms/${roomId}/pages/${pageId}`,
                { method: "DELETE" }
            );
            if (res.status === 401) {
                notifySessionExpired();
                return;
            }

            if (res.ok) {
                const remainingPages = pages.filter((page) => page.id !== pageId);
                setPages(remainingPages);
                setPinnedIds((prev) => prev.filter((id) => id !== pageId));

                if (activePage === pageId && remainingPages.length > 0) {
                    onPageChange(remainingPages[0].id);
                }

                socket?.emit("pages-changed", { roomId });
            }
        } catch (err) {
            console.error("Failed to delete page:", err);
        }
    };

    const closePages = async (pageIds, fallbackPageId) => {
        const targetIds = [...new Set(pageIds)].filter((id) => id !== fallbackPageId);
        if (targetIds.length === 0) {
            setMenuOpenId(null);
            setMenuPosition(null);
            return;
        }

        const targetIdSet = new Set(targetIds);
        const remainingPages = pages.filter((page) => !targetIdSet.has(page.id));
        if (remainingPages.length === 0) return;

        setMenuOpenId(null);
        setMenuPosition(null);
        setMoreMenuOpen(false);

        try {
            const results = await Promise.all(
                targetIds.map((pageId) =>
                    fetch(`/api/rooms/${roomId}/pages/${pageId}`, { method: "DELETE" })
                )
            );

            if (results.some((res) => res.status === 401)) {
                notifySessionExpired();
                return;
            }

            if (results.some((res) => !res.ok)) {
                await fetchPages();
                return;
            }

            setPages(remainingPages);
            setPinnedIds((prev) => prev.filter((id) => !targetIdSet.has(id)));

            if (targetIdSet.has(activePage)) {
                onPageChange(fallbackPageId || remainingPages[0].id);
            }

            socket?.emit("pages-changed", { roomId });
        } catch (err) {
            console.error("Failed to close pages:", err);
            await fetchPages();
        }
    };

    const closePagesAround = (pageId, direction) => {
        const pageIndex = orderedPages.findIndex((page) => page.id === pageId);
        if (pageIndex === -1) return;

        if (direction === "left") {
            closePages(orderedPages.slice(0, pageIndex).map((page) => page.id), pageId);
            return;
        }

        if (direction === "right") {
            closePages(orderedPages.slice(pageIndex + 1).map((page) => page.id), pageId);
            return;
        }

        closePages(
            orderedPages
                .filter((page) => page.id !== pageId)
                .map((page) => page.id),
            pageId
        );
    };

    const togglePinned = (pageId) => {
        setPinnedIds((prev) => {
            if (prev.includes(pageId)) {
                return prev.filter((id) => id !== pageId);
            }
            return [...prev, pageId];
        });
        setMenuOpenId(null);
    };

    const startRename = (page) => {
        setEditingId(page.id);
        setEditTitle(page.title);
        setMenuOpenId(null);
    };

    const handleKeyDown = (event, pageId) => {
        if (event.key === "Enter") {
            renamePage(pageId);
        } else if (event.key === "Escape") {
            setEditingId(null);
        }
    };

    const handleTabClick = (pageId) => {
        if (suppressNextClickRef.current) return;
        if (editingId === pageId) return;
        onPageChange(pageId);
        setMoreMenuOpen(false);
    };

    const openTabMenu = (pageId, position) => {
        setMoreMenuOpen(false);
        setMenuOpenId(pageId);
        setMenuPosition(position);
    };

    const persistPageOrder = useCallback(async (nextOrderedPages) => {
        const nextPinnedIds = nextOrderedPages
            .filter((page) => pinnedIds.includes(page.id))
            .map((page) => page.id);

        if (!areArraysEqual(nextPinnedIds, pinnedIds)) {
            setPinnedIds(nextPinnedIds);
        }

        setPages(nextOrderedPages.map((page, index) => ({ ...page, sortOrder: index })));

        try {
            const res = await fetch(`/api/rooms/${roomId}/pages`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pageIds: nextOrderedPages.map((page) => page.id),
                }),
            });

            if (res.status === 401) {
                notifySessionExpired();
                await fetchPages();
                return;
            }

            if (!res.ok) {
                await fetchPages();
                return;
            }

            const data = await res.json();
            if (data.pages) {
                setPages(data.pages);
            }

            socket?.emit("pages-changed", { roomId });
        } catch (err) {
            console.error("Failed to reorder pages:", err);
            await fetchPages();
        }
    }, [fetchPages, pinnedIds, roomId, socket]);

    const handleTabDragStart = (event, pageId) => {
        if (editingId === pageId) {
            event.preventDefault();
            return;
        }

        suppressNextClickRef.current = true;
        setDraggingPageId(pageId);
        setMenuOpenId(null);
        setMoreMenuOpen(false);
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData(PAGE_TAB_DRAG_MIME, pageId);
    };

    const handleTabDragOver = (event, pageId) => {
        if (!draggingPageId || draggingPageId === pageId) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setDragOverPageId(pageId);
    };

    const handleTabDrop = (event, targetPageId) => {
        event.preventDefault();

        const sourcePageId = draggingPageId || event.dataTransfer.getData(PAGE_TAB_DRAG_MIME);
        setDraggingPageId(null);
        setDragOverPageId(null);

        if (!sourcePageId || sourcePageId === targetPageId) return;

        const fromIndex = orderedPages.findIndex((page) => page.id === sourcePageId);
        const toIndex = orderedPages.findIndex((page) => page.id === targetPageId);
        if (fromIndex === -1 || toIndex === -1) return;

        persistPageOrder(moveItem(orderedPages, fromIndex, toIndex));
    };

    const movePageByOffset = (pageId, offset) => {
        const fromIndex = orderedPages.findIndex((page) => page.id === pageId);
        const toIndex = fromIndex + offset;
        if (fromIndex === -1 || toIndex < 0 || toIndex >= orderedPages.length) return;

        setMenuOpenId(null);
        setMenuPosition(null);
        persistPageOrder(moveItem(orderedPages, fromIndex, toIndex));
    };

    const handleTabDragEnd = () => {
        setDraggingPageId(null);
        setDragOverPageId(null);
        window.setTimeout(() => {
            suppressNextClickRef.current = false;
        }, 0);
    };

    return (
        <div className="page-tabs-bar">
            <div className="page-tabs-scroll">
                {visiblePages.map((page) => {
                    const isPinned = pinnedIds.includes(page.id);

                    return (
                        <div
                            key={page.id}
                            className={`page-tab ${activePage === page.id ? "active" : ""} ${draggingPageId === page.id ? "dragging" : ""} ${dragOverPageId === page.id ? "drag-over" : ""}`}
                            draggable={editingId !== page.id}
                            onClick={() => handleTabClick(page.id)}
                            onDragStart={(event) => handleTabDragStart(event, page.id)}
                            onDragOver={(event) => handleTabDragOver(event, page.id)}
                            onDragLeave={() => setDragOverPageId((currentId) => currentId === page.id ? null : currentId)}
                            onDrop={(event) => handleTabDrop(event, page.id)}
                            onDragEnd={handleTabDragEnd}
                            onContextMenu={(event) => {
                                event.preventDefault();
                                openTabMenu(page.id, {
                                    top: event.clientY,
                                    left: event.clientX,
                                });
                            }}
                        >
                            {isPinned && (
                                <span className="page-tab-pin" title="Pinned">
                                    <i className="fa-solid fa-thumbtack" />
                                </span>
                            )}

                            {editingId === page.id ? (
                                <input
                                    ref={editInputRef}
                                    className="page-tab-rename-input"
                                    value={editTitle}
                                    onChange={(event) => setEditTitle(event.target.value)}
                                    onBlur={() => renamePage(page.id)}
                                    onKeyDown={(event) => handleKeyDown(event, page.id)}
                                    onClick={(event) => event.stopPropagation()}
                                />
                            ) : (
                                <span className="page-tab-title">{page.title}</span>
                            )}

                            <button
                                className="page-tab-menu-btn"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setMoreMenuOpen(false);
	                                    if (menuOpenId === page.id) {
	                                        setMenuOpenId(null);
	                                        setMenuPosition(null);
	                                    } else {
	                                        const rect = event.currentTarget.getBoundingClientRect();
	                                        openTabMenu(page.id, {
	                                            top: rect.bottom + 4,
	                                            left: rect.left,
	                                        });
	                                    }
	                                }}
	                            >
                                <i className="fa-solid fa-ellipsis-vertical" />
                            </button>
                        </div>
                    );
                })}

                {hiddenPages.length > 0 && (
                    <div className="page-tabs-more-wrapper" ref={moreMenuRef}>
                        <button
                            className="page-tabs-more-btn"
                            onClick={() => {
                                setMenuOpenId(null);
                                setMoreMenuOpen((prev) => !prev);
                            }}
                            title="More tabs"
                        >
                            +{hiddenPages.length}
                        </button>

                        {moreMenuOpen && (
                            <div className="page-tabs-more-menu">
                                {hiddenPages.map((page) => (
                                    <button
                                        key={page.id}
                                        className={`page-tabs-more-item ${activePage === page.id ? "active" : ""}`}
                                        onClick={() => handleTabClick(page.id)}
                                    >
                                        {pinnedIds.includes(page.id) && <i className="fa-solid fa-thumbtack" />}
                                        <span>{page.title}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <button className="page-tab-add" onClick={createPage} title="New Page">
                <i className="fa-solid fa-plus" />
            </button>

            {/* Dropdown menu rendered via portal so it's not clipped by overflow:hidden */}
            {menuOpenId && menuPosition && typeof document !== "undefined" && (() => {
                const menuPage = orderedPages.find((p) => p.id === menuOpenId);
                if (!menuPage) return null;
                const isPinned = pinnedIds.includes(menuPage.id);
                const menuPageIndex = orderedPages.findIndex((p) => p.id === menuPage.id);
                const hasLeftPages = menuPageIndex > 0;
                const hasRightPages = menuPageIndex < orderedPages.length - 1;
                const hasOtherPages = orderedPages.length > 1;

                return ReactDOM.createPortal(
                    <div
                        className="page-tab-menu"
                        ref={menuRef}
                        style={{
                            position: "fixed",
                            top: menuPosition.top,
                            left: menuPosition.left,
                        }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            className="page-tab-menu-item"
                            onClick={() => togglePinned(menuPage.id)}
                        >
                            <i className="fa-solid fa-thumbtack" />
                            {isPinned ? "Unpin" : "Pin"}
                        </button>

                        <button
                            className="page-tab-menu-item"
                            onClick={() => startRename(menuPage)}
                        >
                            <i className="fa-solid fa-pen" />
                            Rename
                        </button>

                        {menuPageIndex > 0 && (
                            <button
                                className="page-tab-menu-item"
                                onClick={() => movePageByOffset(menuPage.id, -1)}
                            >
                                <i className="fa-solid fa-arrow-left" />
                                Move left
                            </button>
                        )}

                        {menuPageIndex < orderedPages.length - 1 && (
                            <button
                                className="page-tab-menu-item"
                                onClick={() => movePageByOffset(menuPage.id, 1)}
	                            >
	                                <i className="fa-solid fa-arrow-right" />
	                                Move right
                            </button>
                        )}

                        <div className="page-tab-menu-separator" />

                        <button
                            className="page-tab-menu-item"
                            disabled={!hasOtherPages}
                            onClick={() => closePagesAround(menuPage.id, "all")}
                        >
                            <i className="fa-solid fa-window-restore" />
                            Close all
                        </button>

                        <button
                            className="page-tab-menu-item"
                            disabled={!hasLeftPages}
                            onClick={() => closePagesAround(menuPage.id, "left")}
                        >
                            <i className="fa-solid fa-arrow-left" />
                            Close all to the left
                        </button>

                        <button
                            className="page-tab-menu-item"
                            disabled={!hasRightPages}
                            onClick={() => closePagesAround(menuPage.id, "right")}
                        >
                            <i className="fa-solid fa-arrow-right" />
                            Close all to the right
                        </button>

                        {pages.length > 1 && (
                            <button
                                className="page-tab-menu-item danger"
                                onClick={() => requestDeletePage(menuPage)}
                            >
                                <i className="fa-solid fa-trash" />
                                Delete
                            </button>
                        )}
                    </div>,
                    document.body
                );
            })()}

            {/* Delete Page Confirmation Dialog */}
            {deleteConfirmPage && typeof document !== "undefined" && ReactDOM.createPortal(
                <div
                    className="modal-overlay"
                    ref={deleteDialogRef}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setDeleteConfirmPage(null);
                        }
                    }}
                >
                    <div className="modal-content" style={{ maxWidth: 420, padding: 32 }}>
                        <button className="modal-close" onClick={() => setDeleteConfirmPage(null)}>
                            <i className="fa-solid fa-xmark" />
                        </button>

                        <h2 className="modal-title">
                            <i className="fa-solid fa-trash" />
                            Delete Page
                        </h2>
                        <p className="modal-subtitle" style={{ marginBottom: 20 }}>
                            Are you sure you want to delete{" "}
                            <strong>{deleteConfirmPage.title}</strong>?
                            This action cannot be undone.
                        </p>

                        <div style={{ display: "flex", gap: 10 }}>
                            <button
                                className="btn btn-ghost btn-sm"
                                style={{ flex: 1 }}
                                onClick={() => setDeleteConfirmPage(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary btn-sm"
                                style={{ flex: 1, background: "#DC2626", borderColor: "#DC2626" }}
                                onClick={confirmDeletePage}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
