"use client";

import { useState, useEffect, useCallback } from "react";

export default function Sidebar({
    roomId,
    userId,
    isAdmin,
    socket,
    isOpen,
    isCollapsed = false,
    onClose,
    onToggle,
    onlineUsers = [],
    onExitRoom,
    onLogout,
    onDeleteRoom,
}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showMembers, setShowMembers] = useState(true);
    const [copiedField, setCopiedField] = useState(null);
    const [removeDialogMember, setRemoveDialogMember] = useState(null);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [exitLoading, setExitLoading] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteError, setInviteError] = useState("");
    const [inviteSuccess, setInviteSuccess] = useState("");

    const notifySessionExpired = () => {
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("teamnote-session-expired"));
        }
    };

    const fetchMembers = useCallback(async () => {
        try {
            const res = await fetch(`/api/rooms/${roomId}/members`);
            if (res.status === 401) {
                notifySessionExpired();
                return;
            }
            const json = await res.json();
            if (json.status === "PENDING") {
                setData({ pending: true, message: json.message });
            } else {
                setData(json);
                setShowMembers(json.showMembers);
            }
        } catch (err) {
            console.error("Failed to fetch members:", err);
        } finally {
            setLoading(false);
        }
    }, [roomId, userId]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    // Socket listeners for real-time updates
    useEffect(() => {
        if (!socket) return;

        const refreshHandler = () => fetchMembers();
        socket.on("members-refresh", refreshHandler);
        socket.on("settings-refresh", refreshHandler);

        return () => {
            socket.off("members-refresh", refreshHandler);
            socket.off("settings-refresh", refreshHandler);
        };
    }, [socket, fetchMembers]);

    const handleMemberAction = async ({ action, memberId, memberUserId }) => {
        try {
            const res = await fetch(`/api/rooms/${roomId}/members`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action,
                    memberId,
                    memberUserId,
                    adminUserId: userId,
                }),
            });

            if (!res.ok) {
                if (res.status === 401) {
                    notifySessionExpired();
                    return;
                }
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Failed to update member.");
            }

            // Refresh & notify
            fetchMembers();
            if (socket) {
                if (action === "REMOVED" && memberUserId) {
                    socket.emit("member-removed", { roomId, userId: memberUserId });
                } else {
                    socket.emit("member-status-changed", { roomId });
                }
            }
        } catch (err) {
            console.error("Failed to update member:", err);
        }
    };

    const toggleShowMembers = async () => {
        const newVal = !showMembers;
        setShowMembers(newVal);

        try {
            const res = await fetch(`/api/rooms/${roomId}/settings`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adminUserId: userId, showMembers: newVal }),
            });
            if (res.status === 401) {
                notifySessionExpired();
                return;
            }
            if (!res.ok) {
                throw new Error("Failed to update settings.");
            }

            if (socket) {
                socket.emit("settings-changed", { roomId });
            }
        } catch (err) {
            console.error("Failed to update settings:", err);
            setShowMembers(!newVal);
        }
    };

    const handleInviteTeammate = async (e) => {
        e.preventDefault();

        const normalizedEmail = inviteEmail.trim().toLowerCase();
        if (!normalizedEmail) {
            setInviteError("Please enter a teammate email.");
            setInviteSuccess("");
            return;
        }

        setInviteLoading(true);
        setInviteError("");
        setInviteSuccess("");

        try {
            const res = await fetch(`/api/rooms/${roomId}/members`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: normalizedEmail }),
            });

            if (res.status === 401) {
                notifySessionExpired();
                return;
            }

            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(json.error || "Failed to invite teammate.");
            }

            setInviteEmail("");
            setInviteSuccess(json.message || "Invite saved.");
            fetchMembers();

            if (socket) {
                socket.emit("member-status-changed", { roomId });
            }
        } catch (err) {
            console.error("Failed to invite teammate:", err);
            setInviteError(err.message || "Failed to invite teammate.");
        } finally {
            setInviteLoading(false);
        }
    };

    const copyToClipboard = async (text, field) => {
        if (!text) return;

        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                const textarea = document.createElement("textarea");
                textarea.value = text;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
            }

            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.warn("Clipboard copy failed:", err);
        }
    };

    const closeRemoveDialog = () => {
        setRemoveDialogMember(null);
    };

    const confirmRemoveMember = () => {
        if (!removeDialogMember) return;
        handleMemberAction({
            action: "REMOVED",
            memberUserId: removeDialogMember.id,
        });
        closeRemoveDialog();
    };

    const handleExitRoom = async () => {
        setExitLoading(true);
        try {
            const res = await fetch(`/api/rooms/${roomId}/members`, {
                method: "DELETE",
            });
            if (res.status === 401) {
                notifySessionExpired();
                return;
            }
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Failed to exit room.");
            }
            // Notify other members
            if (socket) {
                socket.emit("member-status-changed", { roomId });
            }
            if (onExitRoom) {
                onExitRoom();
            }
        } catch (err) {
            console.error("Failed to exit room:", err);
            setExitLoading(false);
            setShowExitDialog(false);
        }
    };

    const handleDeleteRoom = async () => {
        setDeleteLoading(true);
        setDeleteError("");

        try {
            const res = await fetch(`/api/rooms/${roomId}`, {
                method: "DELETE",
            });

            if (res.status === 401) {
                notifySessionExpired();
                return;
            }

            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(
                    json.error || "Failed to delete room."
                );
            }

            if (socket) {
                socket.emit("room-deleted", { roomId });
            }

            setShowDeleteDialog(false);
            if (onDeleteRoom) {
                onDeleteRoom();
            }
        } catch (err) {
            console.error("Failed to delete room:", err);
            setDeleteError(err.message || "Failed to delete room.");
        } finally {
            setDeleteLoading(false);
        }
    };

    const getInitials = (firstName, lastName) => {
        return `${(firstName || "")[0] || ""}${(lastName || "")[0] || ""}`.toUpperCase();
    };

    const getAvatarColor = (name) => {
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

    const sidebarClassName = `sidebar ${isOpen ? "open" : ""} ${isCollapsed ? "collapsed" : ""}`.trim();
    const hasOtherUsers = Boolean(
        isAdmin && (
            data?.members?.some((member) => !member.isAdmin)
            || (data?.pendingMembers?.length || 0) > 0
        )
    );

    if (loading) {
        return (
            <aside className={sidebarClassName}>
                <div className="sidebar-header">
                    <div className="sidebar-title">Loading...</div>
                </div>
            </aside>
        );
    }

    if (data?.pending) {
        return (
            <aside className={sidebarClassName}>
                <div className="sidebar-header">
                    <div className="sidebar-title">Pending Approval</div>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>
                        {data.message}
                    </p>
                </div>
            </aside>
        );
    }

    return (
        <>
            {isOpen && <div className="sidebar-overlay open" onClick={onClose} />}

            {/* Floating toggle button when sidebar is collapsed */}
            {isCollapsed && !isOpen && (
                <button
                    className="sidebar-float-toggle collapsed"
                    onClick={onToggle}
                    title="Open Sidebar"
                >
                    <i className="fa-solid fa-angles-left" />
                </button>
            )}

            <aside className={sidebarClassName}>
                {/* Collapse / Close button inside sidebar */}
                <div className="sidebar-toggle-header">
                    <button
                        className="sidebar-collapse-btn"
                        onClick={onToggle}
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        <i className={"fa-solid fa-angles-right"} />
                        <span>Hide</span>
                    </button>
                </div>

                {/* Room Info */}
                <div className="sidebar-header">
                    <div className="sidebar-title">Room Info</div>
                    <p style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                        {data?.roomName || "Untitled Room"}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                        Admin: {data?.adminName}
                    </p>
                </div>

                {/* Invite */}
                {isAdmin && (
                    <div className="sidebar-section">
                        <div className="sidebar-section-title">
                            <i className="fa-solid fa-user-plus" style={{ marginRight: 6 }} />
                            Invite Teammates
                        </div>
                        <div className="invite-panel">
                            <div className="invite-panel-title">
                                <i className="fa-solid fa-share-nodes" />
                                Share Credentials
                            </div>
                            <div className="invite-row">
                                <span className="invite-label">Room ID</span>
                                <span className="invite-value">{data?.roomCode}</span>
                                <button
                                    className={`invite-copy-btn ${copiedField === "code" ? "copied" : ""}`}
                                    onClick={() => copyToClipboard(data?.roomCode, "code")}
                                    title="Copy Room ID"
                                >
                                    <i className={copiedField === "code" ? "fa-solid fa-check" : "fa-regular fa-copy"} />
                                </button>
                            </div>
                            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.4 }}>
                                <i className="fa-solid fa-circle-info" style={{ marginRight: 4 }} />
                                Share the Room ID and the Room Key (from creation) with teammates so they can join.
                            </p>

                            <div className="invite-panel-title" style={{ marginTop: 14 }}>
                                <i className="fa-solid fa-envelope" />
                                Grant Access by Email
                            </div>
                            <form className="invite-email-form" onSubmit={handleInviteTeammate}>
                                <input
                                    type="email"
                                    className="invite-email-input"
                                    placeholder="teammate@example.com"
                                    value={inviteEmail}
                                    onChange={(e) => {
                                        setInviteEmail(e.target.value);
                                        if (inviteError) setInviteError("");
                                        if (inviteSuccess) setInviteSuccess("");
                                    }}
                                    disabled={inviteLoading}
                                />
                                <button
                                    type="submit"
                                    className="invite-email-btn"
                                    disabled={inviteLoading}
                                >
                                    {inviteLoading ? "Inviting..." : "Invite"}
                                </button>
                            </form>
                            {inviteError && <p className="invite-feedback error">{inviteError}</p>}
                            {inviteSuccess && <p className="invite-feedback success">{inviteSuccess}</p>}

                            {data?.invitedEmails?.length > 0 && (
                                <div className="invite-list">
                                    <div className="invite-list-title">Auto-approved emails</div>
                                    <div className="invite-list-items">
                                        {data.invitedEmails.map((invite) => (
                                            <span className="invite-chip" key={invite.id || invite.email}>
                                                {invite.email}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Admin Controls */}
                {isAdmin && (
                    <div className="sidebar-section">
                        <div className="sidebar-section-title">Admin Controls</div>
                        <div className="toggle-container">
                            <span className="toggle-label">Show members to others</span>
                            <div
                                className={`toggle-switch ${showMembers ? "active" : ""}`}
                                onClick={toggleShowMembers}
                            />
                        </div>
                    </div>
                )}

                {/* Members */}
                {(data?.members?.length > 0 || isAdmin) && (
                    <div className="sidebar-section">
                        <div className="sidebar-section-title">
                            Members ({data?.members?.length || 0})
                        </div>
                        {data?.members?.map((member) => (
                            <div className="member-item" key={member.id}>
                                <div
                                    className="member-avatar"
                                    style={{
                                        background: member.color || getAvatarColor(
                                            member.firstName + member.lastName
                                        ),
                                    }}
                                >
                                    {getInitials(member.firstName, member.lastName)}
                                </div>
                                <div className="member-info">
                                    <div className="member-name">
                                        {member.firstName} {member.lastName}
                                    </div>
                                    <div className="member-role">
                                        {member.isAdmin ? "Admin" : "Member"}
                                    </div>
                                </div>
                                <div
                                    className={`member-status ${onlineUsers.some((u) => u.userId === member.id) ? "online" : "offline"}`}
                                    title={onlineUsers.some((u) => u.userId === member.id) ? "Online" : "Offline"}
                                />
                                {isAdmin && !member.isAdmin && (
                                    <button
                                        className="request-btn reject member-remove-btn"
                                        title="Remove member from room"
                                        onClick={() => setRemoveDialogMember(member)}
                                    >
                                        <i className="fa-solid fa-user-minus" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Room actions */}
                <div className="sidebar-section" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {isAdmin && (
                        <>
                            <button
                                className="btn btn-ghost btn-sm"
                                style={{
                                    width: "100%",
                                    color: "#DC2626",
                                    borderColor: "rgba(220, 38, 38, 0.35)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                    opacity: hasOtherUsers ? 0.5 : 1,
                                }}
                                onClick={() => {
                                    setDeleteError("");
                                    setShowDeleteDialog(true);
                                }}
                                disabled={deleteLoading || hasOtherUsers}
                                title={hasOtherUsers ? "Remove all other users first" : "Delete this room"}
                            >
                                <i className="fa-solid fa-trash" />
                                Delete Room
                            </button>
                            {hasOtherUsers && (
                                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: -2, marginBottom: 2 }}>
                                    Remove all other users (including pending requests) before deleting this room.
                                </p>
                            )}
                        </>
                    )}

                    {!isAdmin && (
                        <button
                            className="btn btn-ghost btn-sm"
                            style={{
                                width: "100%",
                                color: "#DC2626",
                                borderColor: "rgba(220, 38, 38, 0.3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                            }}
                            onClick={() => setShowExitDialog(true)}
                        >
                            <i className="fa-solid fa-right-from-bracket" />
                            Exit Room
                        </button>
                    )}
                    <button
                        className="btn btn-ghost btn-sm"
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                        }}
                        onClick={() => setShowLogoutDialog(true)}
                    >
                        <i className="fa-solid fa-arrow-right-from-bracket" />
                        Logout
                    </button>
                </div>

                {/* Pending Requests (Admin only) */}
                {isAdmin && data?.pendingMembers?.length > 0 && (
                    <div className="sidebar-section">
                        <div className="sidebar-section-title">
                            Pending Requests ({data.pendingMembers.length})
                        </div>
                        {data.pendingMembers.map((member) => (
                            <div className="request-item" key={member.memberId}>
                                <div
                                    className="member-avatar"
                                    style={{
                                        background: getAvatarColor(
                                            member.firstName + member.lastName
                                        ),
                                        width: 28,
                                        height: 28,
                                        fontSize: 11,
                                    }}
                                >
                                    {getInitials(member.firstName, member.lastName)}
                                </div>
                                <div className="member-info">
                                    <div className="member-name" style={{ fontSize: 13 }}>
                                        {member.firstName} {member.lastName}
                                    </div>
                                </div>
                                <div className="request-actions">
                                    <button
                                        className="request-btn approve"
                                        onClick={() =>
                                            handleMemberAction({
                                                action: "APPROVED",
                                                memberId: member.memberId,
                                            })
                                        }
                                    >
                                        <i className="fa-solid fa-check" />
                                    </button>
                                    <button
                                        className="request-btn reject"
                                        onClick={() =>
                                            handleMemberAction({
                                                action: "REJECTED",
                                                memberId: member.memberId,
                                            })
                                        }
                                    >
                                        <i className="fa-solid fa-xmark" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </aside>

            {showLogoutDialog && (
                <div
                    className="modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowLogoutDialog(false);
                        }
                    }}
                >
                    <div className="modal-content" style={{ maxWidth: 420, padding: 32 }}>
                        <button className="modal-close" onClick={() => setShowLogoutDialog(false)}>
                            <i className="fa-solid fa-xmark" />
                        </button>

                        <h2 className="modal-title">
                            <i className="fa-solid fa-arrow-right-from-bracket" />
                            Logout
                        </h2>
                        <p className="modal-subtitle" style={{ marginBottom: 20 }}>
                            Are you sure you want to logout? You will need to re-enter the room key to access this room again.
                        </p>

                        <div style={{ display: "flex", gap: 10 }}>
                            <button
                                className="btn btn-ghost btn-sm"
                                style={{ flex: 1 }}
                                onClick={() => setShowLogoutDialog(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary btn-sm"
                                style={{ flex: 1 }}
                                onClick={() => {
                                    setShowLogoutDialog(false);
                                    if (onLogout) onLogout();
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showExitDialog && (
                <div
                    className="modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowExitDialog(false);
                        }
                    }}
                >
                    <div className="modal-content" style={{ maxWidth: 420, padding: 32 }}>
                        <button className="modal-close" onClick={() => setShowExitDialog(false)}>
                            <i className="fa-solid fa-xmark" />
                        </button>

                        <h2 className="modal-title">
                            <i className="fa-solid fa-right-from-bracket" />
                            Exit Room
                        </h2>
                        <p className="modal-subtitle" style={{ marginBottom: 20 }}>
                            Are you sure you want to exit this room? You will need to rejoin and be approved by the admin again.
                        </p>

                        <div style={{ display: "flex", gap: 10 }}>
                            <button
                                className="btn btn-ghost btn-sm"
                                style={{ flex: 1 }}
                                onClick={() => setShowExitDialog(false)}
                                disabled={exitLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary btn-sm"
                                style={{ flex: 1, background: "#DC2626", borderColor: "#DC2626" }}
                                onClick={handleExitRoom}
                                disabled={exitLoading}
                            >
                                {exitLoading ? "Exiting..." : "Exit Room"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteDialog && (
                <div
                    className="modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget && !deleteLoading) {
                            setShowDeleteDialog(false);
                            setDeleteError("");
                        }
                    }}
                >
                    <div className="modal-content" style={{ maxWidth: 440, padding: 32 }}>
                        <button
                            className="modal-close"
                            onClick={() => {
                                if (deleteLoading) return;
                                setShowDeleteDialog(false);
                                setDeleteError("");
                            }}
                        >
                            <i className="fa-solid fa-xmark" />
                        </button>

                        <h2 className="modal-title" style={{ color: "#DC2626" }}>
                            <i className="fa-solid fa-triangle-exclamation" />
                            Delete Room
                        </h2>
                        <p className="modal-subtitle" style={{ marginBottom: 14 }}>
                            This will permanently delete
                            {" "}
                            <strong>{data?.roomName || "this room"}</strong>
                            {" "}
                            and all its pages.
                        </p>

                        <p className="modal-subtitle" style={{ marginTop: 0, marginBottom: 14 }}>
                            You must remove all other users first.
                        </p>

                        {deleteError && (
                            <div className="message message-error" style={{ marginBottom: 14 }}>
                                <i className="fa-solid fa-triangle-exclamation" />
                                {" "}
                                {deleteError}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: 10 }}>
                            <button
                                className="btn btn-ghost btn-sm"
                                style={{ flex: 1 }}
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                    setDeleteError("");
                                }}
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary btn-sm"
                                style={{ flex: 1, background: "#DC2626", borderColor: "#DC2626" }}
                                onClick={handleDeleteRoom}
                                disabled={deleteLoading || hasOtherUsers}
                            >
                                {deleteLoading ? "Deleting..." : "Delete Room"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {removeDialogMember && (
                <div
                    className="modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            closeRemoveDialog();
                        }
                    }}
                >
                    <div className="modal-content" style={{ maxWidth: 420, padding: 32 }}>
                        <button className="modal-close" onClick={closeRemoveDialog}>
                            <i className="fa-solid fa-xmark" />
                        </button>

                        <h2 className="modal-title">
                            <i className="fa-solid fa-user-minus" />
                            Remove Member
                        </h2>
                        <p className="modal-subtitle" style={{ marginBottom: 20 }}>
                            Remove{" "}
                            <strong>
                                {removeDialogMember.firstName} {removeDialogMember.lastName}
                            </strong>{" "}
                            from this room?
                        </p>

                        <div style={{ display: "flex", gap: 10 }}>
                            <button
                                className="btn btn-ghost btn-sm"
                                style={{ flex: 1 }}
                                onClick={closeRemoveDialog}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary btn-sm"
                                style={{ flex: 1 }}
                                onClick={confirmRemoveMember}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
