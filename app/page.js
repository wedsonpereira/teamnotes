"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Badge from "@/components/landing/Badge";
import HeroTitle from "@/components/landing/HeroTitle";
import ActionButtons from "@/components/landing/ActionButtons";
import ThemeToggle from "@/components/landing/ThemeToggle";
import { saveClientSession } from "@/lib/clientSession";

const PENDING_APPROVAL_POLL_MS = 5000;

const FALLBACK_SESSION_TTL_MS = 180 * 60 * 60 * 1000;

function normalizeSessionExpiry(value) {
    const parsed = new Date(value).getTime();
    if (Number.isFinite(parsed) && parsed > Date.now()) {
        return new Date(parsed).toISOString();
    }
    return new Date(Date.now() + FALLBACK_SESSION_TTL_MS).toISOString();
}

export default function LandingPage() {
    const router = useRouter();
    const [modal, setModal] = useState(null); // 'create' | 'join' | 'reenter' | 'forgotkey' | 'forgotroomid' | null
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(null);
    const [theme, setTheme] = useState("light");
    const [acceptingInvite, setAcceptingInvite] = useState(false);
    const [inviteToken, setInviteToken] = useState("");

    // Form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [roomId, setRoomId] = useState("");
    const [roomKey, setRoomKey] = useState("");
    const [createRoomId, setCreateRoomId] = useState("");
    const [createRoomPassword, setCreateRoomPassword] = useState("");
    const [createRoomConfirmPassword, setCreateRoomConfirmPassword] = useState("");
    const [showCreateRoomPassword, setShowCreateRoomPassword] = useState(false);
    const [showCreateRoomConfirmPassword, setShowCreateRoomConfirmPassword] = useState(false);
    const [showJoinRoomKey, setShowJoinRoomKey] = useState(false);
    const [showReenterRoomKey, setShowReenterRoomKey] = useState(false);
    const [showCreatedRoomKey, setShowCreatedRoomKey] = useState(false);

    const persistSessionAndEnter = useCallback(({
        userId,
        roomId: targetRoomId,
        roomKeyValue,
        firstNameValue,
        lastNameValue,
        emailValue,
        isAdminValue = false,
        colorValue = null,
        sessionExpiresAt,
    }) => {
        saveClientSession({
            userId,
            firstName: firstNameValue,
            lastName: lastNameValue,
            email: emailValue,
            isAdmin: Boolean(isAdminValue),
            roomId: targetRoomId,
            roomKey: roomKeyValue,
            color: colorValue,
            sessionExpiresAt: normalizeSessionExpiry(sessionExpiresAt),
        });

        router.push(`/room/${targetRoomId}`);
    }, [router]);

    // Sync theme with document
    useEffect(() => {
        const saved = localStorage.getItem("gs_landing_theme") || "light";
        setTheme(saved);
        document.documentElement.setAttribute("data-theme", saved);
    }, []);

    // Read invite token from query string on client load.
    useEffect(() => {
        if (typeof window === "undefined") return;
        const token = new URLSearchParams(window.location.search).get("invite") || "";
        setInviteToken(token);
    }, []);

    const toggleTheme = () => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("gs_landing_theme", next);
    };

    // Direct invite link support: /?invite=<token>
    useEffect(() => {
        if (!inviteToken) return;

        let cancelled = false;

        const acceptInvite = async () => {
            setAcceptingInvite(true);
            setError("");
            setSuccess(null);

            try {
                const res = await fetch("/api/rooms/invite/accept", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: inviteToken }),
                });
                const data = await res.json();

                if (cancelled) return;

                if (!res.ok) {
                    setAcceptingInvite(false);
                    setModal("join");
                    setError(data.error || "Invite link is invalid or expired.");
                    return;
                }

                persistSessionAndEnter({
                    userId: data.userId,
                    roomId: data.roomId,
                    roomKeyValue: null,
                    firstNameValue: data.firstName,
                    lastNameValue: data.lastName,
                    emailValue: data.email,
                    isAdminValue: data.isAdmin || false,
                    colorValue: data.color,
                    sessionExpiresAt: data.sessionExpiresAt,
                });
            } catch (err) {
                if (cancelled) return;
                setAcceptingInvite(false);
                setModal("join");
                setError("Failed to accept invite link. Please try again.");
            }
        };

        void acceptInvite();

        return () => {
            cancelled = true;
        };
    }, [inviteToken, persistSessionAndEnter]);

    const resetForm = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setRoomId("");
        setRoomKey("");
        setCreateRoomId("");
        setCreateRoomPassword("");
        setCreateRoomConfirmPassword("");
        setShowCreateRoomPassword(false);
        setShowCreateRoomConfirmPassword(false);
        setShowJoinRoomKey(false);
        setShowReenterRoomKey(false);
        setShowCreatedRoomKey(false);
        setError("");
        setSuccess(null);
    };

    const openModal = (type) => {
        resetForm();
        setModal(type);
    };

    const closeModal = () => {
        setModal(null);
        resetForm();
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        setError("");

        if (createRoomPassword.length < 4) {
            setError("Password must be at least 4 characters.");
            return;
        }

        if (createRoomPassword.length > 72) {
            setError("Password cannot be longer than 72 characters.");
            return;
        }

        if (createRoomPassword !== createRoomConfirmPassword) {
            setError("Password and Confirm Password do not match.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/rooms/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    roomCode: createRoomId,
                    roomKey: createRoomPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to create room");
                return;
            }

            setSuccess(data);
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/rooms/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, roomCode: roomId, roomKey }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to join room");
                return;
            }

            // Handle pending status — show message, don't navigate
            if (data.status === "PENDING") {
                setError("");
                setSuccess({
                    pending: true,
                    message: data.message || "Join request sent. Waiting for admin approval.",
                    roomId: data.roomId,
                    roomCode: roomId,
                    userId: data.userId,
                    firstName,
                    lastName,
                    email,
                    roomKey,
                    color: data.color,
                });
                return;
            }

            persistSessionAndEnter({
                userId: data.userId,
                roomId: data.roomId,
                roomKeyValue: roomKey,
                firstNameValue: firstName,
                lastNameValue: lastName,
                emailValue: email,
                isAdminValue: data.isAdmin || false,
                colorValue: data.color,
                sessionExpiresAt: data.sessionExpiresAt,
            });
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Auto-enter room when a pending join request gets approved from the landing modal.
    useEffect(() => {
        if (
            modal !== "join" ||
            !success?.pending ||
            !success?.roomId ||
            !success?.userId
        ) {
            return;
        }

        let cancelled = false;

        const checkApprovalStatus = async () => {
            try {
                const res = await fetch(
                    `/api/rooms/${success.roomId}/members?userId=${success.userId}`,
                    {
                        headers: {
                            "x-room-key": success.roomKey || "",
                        },
                    }
                );
                const data = await res.json();

                if (cancelled) return;

                if (data.status === "PENDING") {
                    return;
                }

                if (data.status !== "APPROVED" && data.error) {
                    setSuccess(null);
                    setError(data.error || "Join request was rejected.");
                    return;
                }

                const reenterRes = await fetch("/api/rooms/reenter", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: success.email,
                        roomCode: success.roomCode,
                        roomKey: success.roomKey,
                    }),
                });

                const reenterData = await reenterRes.json();
                if (!reenterRes.ok) {
                    setSuccess(null);
                    setError(reenterData.error || "Failed to enter room after approval.");
                    return;
                }

                persistSessionAndEnter({
                    userId: reenterData.userId,
                    roomId: reenterData.roomId,
                    roomKeyValue: success.roomKey,
                    firstNameValue: reenterData.firstName || success.firstName,
                    lastNameValue: reenterData.lastName || success.lastName,
                    emailValue: success.email,
                    isAdminValue: reenterData.isAdmin || false,
                    colorValue: reenterData.color || success.color,
                    sessionExpiresAt: reenterData.sessionExpiresAt,
                });
            } catch (err) {
                if (!cancelled) {
                    console.error("Pending approval check failed:", err);
                }
            }
        };

        void checkApprovalStatus();
        const intervalId = setInterval(() => {
            void checkApprovalStatus();
        }, PENDING_APPROVAL_POLL_MS);

        return () => {
            cancelled = true;
            clearInterval(intervalId);
        };
    }, [modal, success, persistSessionAndEnter]);

    const enterRoom = () => {
        if (!success) return;

        persistSessionAndEnter({
            userId: success.userId,
            roomId: success.roomId,
            roomKeyValue: success.roomKey,
            firstNameValue: firstName,
            lastNameValue: lastName,
            emailValue: email,
            isAdminValue: true,
            colorValue: success.color,
            sessionExpiresAt: success.sessionExpiresAt,
        });
    };

    const handleReenter = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/rooms/reenter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, roomCode: roomId, roomKey }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to re-enter room");
                return;
            }

            persistSessionAndEnter({
                userId: data.userId,
                roomId: data.roomId,
                roomKeyValue: roomKey,
                firstNameValue: data.firstName,
                lastNameValue: data.lastName,
                emailValue: email,
                isAdminValue: data.isAdmin || false,
                colorValue: data.color,
                sessionExpiresAt: data.sessionExpiresAt,
            });
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotKey = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/rooms/forgot-key", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, roomCode: roomId }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to reset key");
                return;
            }

            setSuccess({
                message: data.message,
            });
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotRoomId = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/rooms/forgot-roomid", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to process request");
                return;
            }

            setSuccess({
                message: data.message,
            });
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (inviteToken && acceptingInvite) {
        return (
            <>
                <div className="landing-bg" />
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
                <div className="landing-container" style={{ textAlign: "center" }}>
                    <div className="spinner" style={{ width: 28, height: 28, margin: "0 auto 16px" }} />
                    <p style={{ color: "var(--text-secondary)" }}>
                        Opening your invited room...
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="landing-bg" />
            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            <div className="landing-container">
                <Badge />
                <HeroTitle />
                <ActionButtons
                    onCreateRoom={() => openModal("create")}
                    onJoinRoom={() => openModal("join")}
                    onReenter={() => openModal("reenter")}
                />
            </div>

            {/* Modal */}
            {modal && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
                    <div className="modal-content">
                        <button className="modal-close" onClick={closeModal}>
                            <i className="fa-solid fa-xmark" />
                        </button>

                        {/* Create Room Modal */}
                        {modal === "create" && !success && (
                            <>
                                <h2 className="modal-title">
                                    <i className="fa-solid fa-rocket" style={{ color: 'var(--accent-primary)' }} /> Create Room
                                </h2>
                                <p className="modal-subtitle">
                                    Set up your collaborative workspace with your own Room ID and password.
                                </p>

                                {error && (
                                    <div className="message message-error"><i className="fa-solid fa-triangle-exclamation" /> {error}</div>
                                )}

                                <form onSubmit={handleCreateRoom}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">First Name</label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                placeholder="John"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Last Name</label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                placeholder="Doe"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            className="form-input"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Room ID (Optional)</label>
                                        <input
                                            className="form-input"
                                            type="text"
                                            placeholder="e.g. TEAM-ALPHA"
                                            value={createRoomId}
                                            onChange={(e) => setCreateRoomId(e.target.value)}
                                            maxLength={32}
                                        />
                                        <p className="form-help-text">
                                            Use 4-32 characters: letters, numbers, _ or -. Leave blank to auto-generate.
                                        </p>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Password</label>
                                        <div className="form-input-with-action">
                                            <input
                                                className="form-input"
                                                type={showCreateRoomPassword ? "text" : "password"}
                                                placeholder="Set room password"
                                                value={createRoomPassword}
                                                onChange={(e) => setCreateRoomPassword(e.target.value)}
                                                required
                                                minLength={4}
                                                maxLength={72}
                                            />
                                            <button
                                                type="button"
                                                className="form-password-toggle"
                                                onClick={() => setShowCreateRoomPassword((prev) => !prev)}
                                            >
                                                {showCreateRoomPassword ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Confirm Password</label>
                                        <div className="form-input-with-action">
                                            <input
                                                className="form-input"
                                                type={showCreateRoomConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm room password"
                                                value={createRoomConfirmPassword}
                                                onChange={(e) => setCreateRoomConfirmPassword(e.target.value)}
                                                required
                                                minLength={4}
                                                maxLength={72}
                                            />
                                            <button
                                                type="button"
                                                className="form-password-toggle"
                                                onClick={() => setShowCreateRoomConfirmPassword((prev) => !prev)}
                                            >
                                                {showCreateRoomConfirmPassword ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </div>

                                    <button className="btn btn-primary" type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner" /> Creating...
                                            </>
                                        ) : (
                                            "Create Room"
                                        )}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* Success Screen after room creation */}
                        {modal === "create" && success && (
                            <div className="success-screen">
                                <div className="success-icon"><i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-secondary)', fontSize: 36 }} /></div>
                                <h2 className="success-title">Room Created!</h2>
                                <p className="success-subtitle">
                                    Share these credentials with your teammates.
                                </p>

                                <div className="credentials-box">
                                    <div className="credential-row">
                                        <span className="credential-label">Room ID</span>
                                        <span className="credential-value">{success.roomCode}</span>
                                    </div>
                                    <div className="credential-row">
                                        <span className="credential-label">Room Key</span>
                                        <span className="credential-value-wrap">
                                            <span className="credential-value">
                                                {showCreatedRoomKey
                                                    ? success.roomKey
                                                    : "•".repeat(Math.max(String(success.roomKey || "").length, 8))}
                                            </span>
                                            <button
                                                type="button"
                                                className="credential-toggle-btn"
                                                onClick={() => setShowCreatedRoomKey((prev) => !prev)}
                                            >
                                                {showCreatedRoomKey ? "Hide" : "Show"}
                                            </button>
                                        </span>
                                    </div>
                                </div>

                                <button className="btn btn-primary" onClick={enterRoom}>
                                    Enter Room →
                                </button>
                            </div>
                        )}

                        {/* Join Room Modal */}
                        {modal === "join" && !success?.pending && (
                            <>
                                <h2 className="modal-title">
                                    <i className="fa-solid fa-link" style={{ color: 'var(--accent-secondary)' }} /> Join Room
                                </h2>
                                <p className="modal-subtitle">
                                    Enter your details and room credentials to join.
                                </p>

                                {error && (
                                    <div className="message message-error"><i className="fa-solid fa-triangle-exclamation" /> {error}</div>
                                )}

                                <form onSubmit={handleJoinRoom}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">First Name</label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                placeholder="Jane"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Last Name</label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                placeholder="Doe"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            className="form-input"
                                            type="email"
                                            placeholder="jane@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Room ID</label>
                                        <input
                                            className="form-input"
                                            type="text"
                                            placeholder="Enter Room ID"
                                            value={roomId}
                                            onChange={(e) => setRoomId(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Room Key</label>
                                        <div className="form-input-with-action">
                                            <input
                                                className="form-input"
                                                type={showJoinRoomKey ? "text" : "password"}
                                                placeholder="Enter Room Key"
                                                value={roomKey}
                                                onChange={(e) => setRoomKey(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="form-password-toggle"
                                                onClick={() => setShowJoinRoomKey((prev) => !prev)}
                                            >
                                                {showJoinRoomKey ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </div>

                                    <button className="btn btn-secondary" type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner" /> Joining...
                                            </>
                                        ) : (
                                            "Request to Join"
                                        )}
                                    </button>

                                    <p style={{ textAlign: "center", marginTop: 12, fontSize: 13 }}>
                                        <a
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); openModal("forgotroomid"); }}
                                            style={{ color: "var(--text-muted)", textDecoration: "underline", cursor: "pointer" }}
                                        >
                                            <i className="fa-solid fa-hashtag" style={{ marginRight: 4, fontSize: 11 }} />
                                            Forgot your Room ID?
                                        </a>
                                    </p>
                                </form>
                            </>
                        )}

                        {/* Pending Approval Screen (after join request) */}
                        {modal === "join" && success?.pending && (
                            <div style={{ textAlign: "center", padding: "20px 0" }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>
                                    <i className="fa-regular fa-clock" style={{ color: "var(--accent-gold)" }} />
                                </div>
                                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
                                    Waiting for Approval
                                </h2>
                                <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>
                                    {success.message}
                                </p>
                                <div className="spinner" style={{ width: 24, height: 24, margin: "0 auto 20px", color: "var(--accent-primary)" }} />
                                <button className="btn btn-ghost btn-sm" onClick={closeModal}>
                                    <i className="fa-solid fa-arrow-left" style={{ marginRight: 6 }} /> Back to Home
                                </button>
                            </div>
                        )}

                        {/* Re-enter Room Modal */}
                        {modal === "reenter" && (
                            <>
                                <h2 className="modal-title">
                                    <i className="fa-solid fa-right-to-bracket" style={{ color: 'var(--accent-primary)' }} /> Re-enter Room
                                </h2>
                                <p className="modal-subtitle">
                                    Welcome back! Enter your credentials to re-enter your room.
                                </p>

                                {error && (
                                    <div className="message message-error"><i className="fa-solid fa-triangle-exclamation" /> {error}</div>
                                )}

                                <form onSubmit={handleReenter}>
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            className="form-input"
                                            type="email"
                                            placeholder="Your registered email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Room ID</label>
                                        <input
                                            className="form-input"
                                            type="text"
                                            placeholder="Enter Room ID"
                                            value={roomId}
                                            onChange={(e) => setRoomId(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Room Key</label>
                                        <div className="form-input-with-action">
                                            <input
                                                className="form-input"
                                                type={showReenterRoomKey ? "text" : "password"}
                                                placeholder="Enter Room Key"
                                                value={roomKey}
                                                onChange={(e) => setRoomKey(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="form-password-toggle"
                                                onClick={() => setShowReenterRoomKey((prev) => !prev)}
                                            >
                                                {showReenterRoomKey ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </div>

                                    <button className="btn btn-primary" type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner" /> Entering...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-door-open" /> Enter Room
                                            </>
                                        )}
                                    </button>

                                    <p style={{ textAlign: "center", marginTop: 12, fontSize: 13 }}>
                                        <a
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); openModal("forgotkey"); }}
                                            style={{ color: "var(--text-muted)", textDecoration: "underline", cursor: "pointer" }}
                                        >
                                            <i className="fa-solid fa-key" style={{ marginRight: 4, fontSize: 11 }} />
                                            Forgot your Room Key?
                                        </a>
                                        <span style={{ margin: "0 8px", color: "var(--text-muted)" }}>·</span>
                                        <a
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); openModal("forgotroomid"); }}
                                            style={{ color: "var(--text-muted)", textDecoration: "underline", cursor: "pointer" }}
                                        >
                                            <i className="fa-solid fa-hashtag" style={{ marginRight: 4, fontSize: 11 }} />
                                            Forgot your Room ID?
                                        </a>
                                    </p>
                                </form>
                            </>
                        )}

                        {/* Forgot Key Modal */}
                        {modal === "forgotkey" && !success?.message && (
                            <>
                                <h2 className="modal-title">
                                    <i className="fa-solid fa-key" style={{ color: 'var(--accent-gold, #f7dc6f)' }} /> Reset Room Key
                                </h2>
                                <p className="modal-subtitle">
                                    Only the room admin can reset the key. Enter your admin email and Room ID.
                                </p>

                                {error && (
                                    <div className="message message-error"><i className="fa-solid fa-triangle-exclamation" /> {error}</div>
                                )}

                                <form onSubmit={handleForgotKey}>
                                    <div className="form-group">
                                        <label className="form-label">Admin Email</label>
                                        <input
                                            className="form-input"
                                            type="email"
                                            placeholder="Your admin email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Room ID</label>
                                        <input
                                            className="form-input"
                                            type="text"
                                            placeholder="Enter Room ID"
                                            value={roomId}
                                            onChange={(e) => setRoomId(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button className="btn btn-primary" type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner" /> Resetting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-rotate" /> Reset Key
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* Forgot Key — Email Sent */}
                        {modal === "forgotkey" && success?.message && (
                            <div style={{ textAlign: "center", padding: "20px 0" }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>
                                    <i className="fa-solid fa-envelope-circle-check" style={{ color: "var(--accent-secondary)" }} />
                                </div>
                                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                                    Reset Link Sent!
                                </h2>
                                <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>
                                    {success.message}
                                </p>
                                <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 20 }}>
                                    <i className="fa-solid fa-clock" style={{ marginRight: 4 }} />
                                    The link expires in 15 minutes.
                                </p>
                                <button className="btn btn-primary" onClick={closeModal}>
                                    <i className="fa-solid fa-check" /> Got it
                                </button>
                            </div>
                        )}

                        {/* Forgot Room ID Modal */}
                        {modal === "forgotroomid" && !success && (
                            <>
                                <h2 className="modal-title">
                                    <i className="fa-solid fa-hashtag" style={{ color: 'var(--accent-primary)' }} /> Forgot Room ID
                                </h2>
                                <p className="modal-subtitle">
                                    Enter your email and we'll send you a list of all your rooms.
                                </p>

                                {error && (
                                    <div className="message message-error"><i className="fa-solid fa-triangle-exclamation" /> {error}</div>
                                )}

                                <form onSubmit={handleForgotRoomId}>
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            className="form-input"
                                            type="email"
                                            placeholder="Your registered email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button className="btn btn-primary" type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner" /> Sending...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-paper-plane" /> Send Room IDs
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* Forgot Room ID — Email Sent */}
                        {modal === "forgotroomid" && success?.message && (
                            <div style={{ textAlign: "center", padding: "20px 0" }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>
                                    <i className="fa-solid fa-envelope-circle-check" style={{ color: "var(--accent-secondary)" }} />
                                </div>
                                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                                    Check Your Inbox!
                                </h2>
                                <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>
                                    {success.message}
                                </p>
                                <button className="btn btn-primary" onClick={closeModal}>
                                    <i className="fa-solid fa-check" /> Got it
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
