"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import dynamic from "next/dynamic";
import Toolbar from "@/components/Toolbar";
import Sidebar from "@/components/Sidebar";
import PageTabs from "@/components/PageTabs";
import { readClientSession, clearClientSession } from "@/lib/clientSession";
import * as Y from "yjs";

const UI_SETTINGS_STORAGE_PREFIX = "teamnote_ui_settings_";

function hexToRgb(value) {
    const hex = String(value || "").replace("#", "").trim();
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;

    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);
    return `${r}, ${g}, ${b}`;
}

// Dynamically import Editor to avoid SSR issues with Tiptap
const Editor = dynamic(() => import("@/components/Editor"), {
    ssr: false,
    loading: () => (
        <div className="editor-content" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="spinner" style={{ width: 32, height: 32 }} />
        </div>
    ),
});

export default function RoomPage() {
    const params = useParams();
    const router = useRouter();
    const roomId = params.roomId;

    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [saveStatus, setSaveStatus] = useState(false);
    const [roomName, setRoomName] = useState("Loading...");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [accessDenied, setAccessDenied] = useState(false);
    const [pendingApproval, setPendingApproval] = useState(false);
    const [accessChecked, setAccessChecked] = useState(false);
    const [theme, setTheme] = useState("dark");
    const [editorBg, setEditorBg] = useState(null);
    const [fontColor, setFontColor] = useState(null);
    const [accentPrimary, setAccentPrimary] = useState("#6c63ff");
    const [accentSecondary, setAccentSecondary] = useState("#00d4aa");
    const [uiFontFamily, setUiFontFamily] = useState("default");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUserIds, setTypingUserIds] = useState([]);
    const [activePage, setActivePage] = useState(null);
    const expiryTimerRef = useRef(null);
    const ydocCacheRef = useRef(new Map());
    const activePageRef = useRef(null);

    useEffect(() => {
        activePageRef.current = activePage;
    }, [activePage]);

    // Get or create a cached Yjs document for a specific page.
    const getOrCreateYDoc = useCallback((pageId) => {
        if (!pageId) return null;
        const cache = ydocCacheRef.current;
        if (!cache.has(pageId)) {
            cache.set(pageId, new Y.Doc());
        }
        return cache.get(pageId);
    }, []);

    // Apply room-specific visual settings from localStorage once room is known.
    useEffect(() => {
        if (!roomId || typeof window === "undefined") return;

        const storageKey = `${UI_SETTINGS_STORAGE_PREFIX}${roomId}`;
        const savedRaw = localStorage.getItem(storageKey);
        if (!savedRaw) return;

        try {
            const saved = JSON.parse(savedRaw);
            if (saved && typeof saved === "object") {
                if (saved.theme === "light" || saved.theme === "dark") {
                    setTheme(saved.theme);
                }
                if (typeof saved.editorBg === "string" || saved.editorBg === null) {
                    setEditorBg(saved.editorBg);
                }
                if (typeof saved.fontColor === "string" || saved.fontColor === null) {
                    setFontColor(saved.fontColor);
                }
                if (typeof saved.accentPrimary === "string") {
                    setAccentPrimary(saved.accentPrimary);
                }
                if (typeof saved.accentSecondary === "string") {
                    setAccentSecondary(saved.accentSecondary);
                }
                if (typeof saved.uiFontFamily === "string") {
                    setUiFontFamily(saved.uiFontFamily);
                }
                if (typeof saved.sidebarCollapsed === "boolean") {
                    setSidebarCollapsed(saved.sidebarCollapsed);
                }
            }
        } catch (err) {
            console.warn("Failed to parse saved room UI settings:", err);
        }
    }, [roomId]);

    // Persist current visual settings.
    useEffect(() => {
        if (!roomId || typeof window === "undefined") return;

        const storageKey = `${UI_SETTINGS_STORAGE_PREFIX}${roomId}`;
        localStorage.setItem(
            storageKey,
            JSON.stringify({
                theme,
                editorBg,
                fontColor,
                accentPrimary,
                accentSecondary,
                uiFontFamily,
                sidebarCollapsed,
            })
        );
    }, [
        roomId,
        theme,
        editorBg,
        fontColor,
        accentPrimary,
        accentSecondary,
        uiFontFamily,
        sidebarCollapsed,
    ]);

    // Apply theme + custom visual tokens to document root.
    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute("data-theme", theme);

        if (accentPrimary) {
            root.style.setProperty("--accent-primary", accentPrimary);
            const rgb = hexToRgb(accentPrimary);
            if (rgb) {
                root.style.setProperty("--accent-primary-rgb", rgb);
            }
        }

        if (accentSecondary) {
            root.style.setProperty("--accent-secondary", accentSecondary);
            const rgb = hexToRgb(accentSecondary);
            if (rgb) {
                root.style.setProperty("--accent-secondary-rgb", rgb);
            }
        }

        if (uiFontFamily && uiFontFamily !== "default") {
            root.style.setProperty(
                "--font-primary",
                `${uiFontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
            );
        } else {
            root.style.removeProperty("--font-primary");
        }
    }, [theme, accentPrimary, accentSecondary, uiFontFamily]);

    useEffect(() => {
        return () => {
            const root = document.documentElement;
            root.style.removeProperty("--accent-primary");
            root.style.removeProperty("--accent-primary-rgb");
            root.style.removeProperty("--accent-secondary");
            root.style.removeProperty("--accent-secondary-rgb");
            root.style.removeProperty("--font-primary");
        };
    }, []);

    const getRandomColor = (name) => {
        const colors = [
            "#DC2626", "#EA580C", "#CA8A04", "#65A30D",
            "#059669", "#0891B2", "#2563EB", "#7C3AED",
            "#C026D3", "#DB2777", "#BE123C", "#0F766E",
        ];
        let hash = 0;
        for (let i = 0; i < (name || "").length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }, []);

    const handleSidebarToggle = useCallback(() => {
        if (typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches) {
            setSidebarOpen((prev) => !prev);
            return;
        }

        setSidebarCollapsed((prev) => !prev);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia("(max-width: 900px)");
        const handleChange = (event) => {
            if (!event.matches) {
                setSidebarOpen(false);
            }
        };

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }

        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
    }, []);

    const resolvedUserColor = useMemo(() => {
        if (!user) return "#999999";
        return user.color || getRandomColor(`${user.firstName || ""}${user.lastName || ""}`);
    }, [user]);

    const handleSessionExpired = useCallback(() => {
        if (expiryTimerRef.current) {
            clearTimeout(expiryTimerRef.current);
            expiryTimerRef.current = null;
        }
        clearClientSession();
        setSocket((prev) => {
            if (prev) prev.disconnect();
            return null;
        });
        setConnected(false);
        setTypingUserIds([]);
        router.push("/");
    }, [router]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const onExpired = () => {
            handleSessionExpired();
        };

        window.addEventListener("teamnote-session-expired", onExpired);
        return () => window.removeEventListener("teamnote-session-expired", onExpired);
    }, [handleSessionExpired]);

    // Load user session from local storage (with expiration).
    useEffect(() => {
        const stored = readClientSession();
        if (!stored) {
            router.push("/");
            return;
        }

        if (stored.roomId && stored.roomId !== roomId) {
            clearClientSession();
            router.push("/");
            return;
        }

        if (expiryTimerRef.current) {
            clearTimeout(expiryTimerRef.current);
            expiryTimerRef.current = null;
        }

        const remainingMs = stored.expiresAtMs - Date.now();
        if (remainingMs <= 0) {
            handleSessionExpired();
            return;
        }

        expiryTimerRef.current = setTimeout(() => {
            handleSessionExpired();
        }, remainingMs);

        setUser(stored);

        return () => {
            if (expiryTimerRef.current) {
                clearTimeout(expiryTimerRef.current);
                expiryTimerRef.current = null;
            }
        };
    }, [router, roomId, handleSessionExpired]);

    // Check access and fetch room info
    useEffect(() => {
        if (!user || !roomId) return;

        const checkAccess = async () => {
            setAccessChecked(false);
            try {
                const res = await fetch(`/api/rooms/${roomId}/members`);
                const data = await res.json();

                if (res.status === 401) {
                    handleSessionExpired();
                    return;
                }

                if (data.status === "PENDING") {
                    setPendingApproval(true);
                    setAccessChecked(true);
                    return;
                }

                if (data.error) {
                    setAccessDenied(true);
                    setAccessChecked(true);
                    return;
                }

                setRoomName(data.roomName || "Untitled Room");
                setAccessChecked(true);
            } catch (err) {
                console.error("Access check failed:", err);
                setAccessDenied(true);
                setAccessChecked(true);
            }
        };

        checkAccess();
    }, [user, roomId, handleSessionExpired]);

    // Pending users don't join the room socket, so subscribe to approval updates
    // and transition automatically when admin approves/rejects.
    useEffect(() => {
        if (!user || !roomId || !pendingApproval || !accessChecked) return;

        const pendingSocket = io({
            path: "/socket.io",
            transports: ["websocket", "polling"],
        });

        const refreshAccess = async () => {
            try {
                const res = await fetch(`/api/rooms/${roomId}/members`);
                const data = await res.json();

                if (res.status === 401) {
                    handleSessionExpired();
                    return;
                }

                if (data.status === "PENDING") {
                    return;
                }

                if (data.error) {
                    setPendingApproval(false);
                    setAccessDenied(true);
                    setAccessChecked(true);
                    return;
                }

                setRoomName(data.roomName || "Untitled Room");
                setAccessDenied(false);
                setPendingApproval(false);
                setAccessChecked(true);
            } catch (err) {
                console.error("Pending approval refresh failed:", err);
            }
        };

        pendingSocket.on("connect", () => {
            pendingSocket.emit("watch-room-approval", { roomId });
        });
        pendingSocket.on("approval-refresh", refreshAccess);

        return () => {
            pendingSocket.off("approval-refresh", refreshAccess);
            pendingSocket.disconnect();
        };
    }, [user, roomId, pendingApproval, accessChecked, handleSessionExpired]);

    // Initialize Socket.IO
    useEffect(() => {
        if (!user || !roomId || accessDenied || pendingApproval || !accessChecked) return;

        const socketInstance = io({
            path: "/socket.io",
            transports: ["websocket", "polling"],
        });

        socketInstance.on("connect", () => {
            setConnected(true);
            socketInstance.emit("join-room", {
                roomId,
                pageId: activePageRef.current || null,
                user: {
                    userId: user.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    color: resolvedUserColor,
                },
            });
        });

        socketInstance.on("disconnect", () => {
            setConnected(false);
        });

        // Real-time online presence tracking
        socketInstance.on("presence-update", ({ users }) => {
            setOnlineUsers(users || []);
        });

        socketInstance.on("typing-status", ({ userId: typingUserId, isTyping }) => {
            if (!typingUserId) return;
            if (typingUserId === user.userId) return;

            setTypingUserIds((prev) => {
                if (isTyping) {
                    if (prev.includes(typingUserId)) return prev;
                    return [...prev, typingUserId];
                }
                return prev.filter((id) => id !== typingUserId);
            });
        });

        socketInstance.on("access-revoked", ({ roomId: revokedRoomId }) => {
            if (revokedRoomId && revokedRoomId !== roomId) return;
            clearClientSession();
            setConnected(false);
            setAccessDenied(true);
            setPendingApproval(false);
            setAccessChecked(true);
            router.push("/");
        });

        setSocket(socketInstance);

        return () => {
            setTypingUserIds([]);
            socketInstance.disconnect();
        };
    }, [user, roomId, accessDenied, pendingApproval, accessChecked, resolvedUserColor, router]);

    // Keep socket page subscription aligned with the currently selected tab.
    // This also fixes the case where tabs load before socket connect.
    useEffect(() => {
        if (!socket || !roomId || !activePage || !connected) return;
        socket.emit("switch-page", { roomId, pageId: activePage });
    }, [socket, roomId, activePage, connected]);

    const typingUsers = useMemo(() => {
        if (!typingUserIds.length) return [];
        return typingUserIds
            .map((id) => onlineUsers.find((u) => u.userId === id))
            .filter(Boolean)
            .map((u) => `${u.firstName || ""} ${u.lastName || ""}`.trim())
            .filter(Boolean);
    }, [typingUserIds, onlineUsers]);

    const handlePageChange = useCallback((pageId) => {
        setActivePage(pageId);
    }, []);

    const handleContentChange = useCallback((status) => {
        setSaveStatus(status);
    }, []);

    if (!user || !accessChecked) {
        return (
            <div className="landing-container" style={{ textAlign: "center" }}>
                <div className="spinner" style={{ width: 28, height: 28, margin: "0 auto 16px" }} />
                <p style={{ color: "var(--text-secondary)" }}>Checking room access...</p>
            </div>
        );
    }

    // Access denied screen
    if (accessDenied) {
        return (
            <div className="landing-container" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>🔒</div>
                <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
                    Access Denied
                </h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
                    You don&apos;t have access to this room.
                </p>
                <button className="btn btn-primary btn-sm" onClick={() => router.push("/")}>
                    ← Back to Home
                </button>
            </div>
        );
    }

    // Pending approval screen
    if (pendingApproval) {
        return (
            <div className="landing-container" style={{ textAlign: "center" }}>
                <div className="animated-bg" />
                <div className="grid-overlay" />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ fontSize: 64, marginBottom: 20 }}>⏳</div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
                        Waiting for Approval
                    </h1>
                    <p style={{ color: "var(--text-secondary)", marginBottom: 8, maxWidth: 400 }}>
                        Your join request has been sent to the room admin.
                        This page will automatically refresh once you&apos;re approved.
                    </p>
                    <div className="spinner" style={{ width: 24, height: 24, margin: "20px auto", color: "var(--accent-primary)" }} />
                    <button
                        className="btn btn-ghost btn-sm"
                        style={{ marginTop: 16 }}
                        onClick={() => router.push("/")}
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const currentUserName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    return (
        <div className={`editor-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
            <Toolbar
                roomName={roomName}
                saveStatus={saveStatus}
                connected={connected}
                theme={theme}
                onToggleTheme={toggleTheme}
                editorBg={editorBg}
                onChangeBg={setEditorBg}
                fontColor={fontColor}
                onChangeFontColor={setFontColor}
                typingUsers={typingUsers}
                userName={currentUserName}
                userColor={resolvedUserColor}
                accentPrimary={accentPrimary}
                accentSecondary={accentSecondary}
                onChangeAccentPrimary={setAccentPrimary}
                onChangeAccentSecondary={setAccentSecondary}
                uiFontFamily={uiFontFamily}
                onChangeUiFontFamily={setUiFontFamily}
            />

            <PageTabs
                roomId={roomId}
                userId={user.userId}
                socket={socket}
                activePage={activePage}
                onPageChange={handlePageChange}
            />

            {activePage && (
                <Editor
                    key={activePage}
                    socket={socket}
                    roomId={roomId}
                    pageId={activePage}
                    userId={user.userId}
                    userName={currentUserName}
                    userColor={resolvedUserColor}
                    roomKey={user.roomKey}
                    onContentChange={handleContentChange}
                    onSessionExpired={handleSessionExpired}
                    editorBg={editorBg}
                    fontColor={fontColor}
                    externalYDoc={getOrCreateYDoc(activePage)}
                />
            )}

            <Sidebar
                roomId={roomId}
                userId={user.userId}
                isAdmin={user.isAdmin}
                socket={socket}
                isOpen={sidebarOpen}
                isCollapsed={sidebarCollapsed}
                onClose={() => setSidebarOpen(false)}
                onToggle={handleSidebarToggle}
                onlineUsers={onlineUsers}
                onExitRoom={handleSessionExpired}
                onLogout={handleSessionExpired}
                onDeleteRoom={handleSessionExpired}
            />
        </div>
    );
}
