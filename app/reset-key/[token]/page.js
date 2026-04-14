"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function ResetKeyPage({ params }) {
    const { token } = use(params);
    const router = useRouter();
    const [status, setStatus] = useState("loading"); // loading | valid | invalid | success
    const [roomInfo, setRoomInfo] = useState(null);
    const [newKey, setNewKey] = useState("");
    const [confirmKey, setConfirmKey] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Validate token on mount
    useEffect(() => {
        const validateToken = async () => {
            try {
                const res = await fetch(`/api/rooms/reset-key/${token}`);
                const data = await res.json();

                if (!res.ok) {
                    setStatus("invalid");
                    setError(data.error || "Invalid or expired link.");
                    return;
                }

                setRoomInfo(data);
                setStatus("valid");
            } catch (err) {
                setStatus("invalid");
                setError("Failed to validate reset link.");
            }
        };

        validateToken();
    }, [token]);

    const handleReset = async (e) => {
        e.preventDefault();
        setError("");

        if (newKey.length < 4) {
            setError("Key must be at least 4 characters.");
            return;
        }

        if (newKey !== confirmKey) {
            setError("Keys do not match.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/rooms/reset-key/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newKey }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to reset key.");
                return;
            }

            setRoomInfo((prev) => ({ ...prev, roomCode: data.roomCode }));
            setStatus("success");
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="animated-bg" />
            <div className="grid-overlay" />

            <div className="landing-container" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
                <div style={{ width: "100%", maxWidth: 460 }}>
                    <div className="modal-content" style={{ position: "relative" }}>
                        {/* Loading */}
                        {status === "loading" && (
                            <div style={{ textAlign: "center", padding: "40px 0" }}>
                                <div className="spinner" style={{ width: 32, height: 32, margin: "0 auto 16px" }} />
                                <p style={{ color: "var(--text-secondary)" }}>Validating reset link...</p>
                            </div>
                        )}

                        {/* Invalid / expired token */}
                        {status === "invalid" && (
                            <div style={{ textAlign: "center", padding: "20px 0" }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>
                                    <i className="fa-solid fa-circle-xmark" style={{ color: "#e53e3e" }} />
                                </div>
                                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                                    Link Invalid or Expired
                                </h2>
                                <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>
                                    {error}
                                </p>
                                <button className="btn btn-primary" onClick={() => router.push("/")}>
                                    <i className="fa-solid fa-arrow-left" /> Back to Home
                                </button>
                            </div>
                        )}

                        {/* Valid — show reset form */}
                        {status === "valid" && (
                            <>
                                <h2 className="modal-title">
                                    <i className="fa-solid fa-key" style={{ color: "var(--accent-primary)" }} /> Reset Room Key
                                </h2>
                                <p className="modal-subtitle">
                                    Setting a new key for <strong>{roomInfo?.roomName}</strong> ({roomInfo?.roomCode})
                                </p>

                                {error && (
                                    <div className="message message-error">
                                        <i className="fa-solid fa-triangle-exclamation" /> {error}
                                    </div>
                                )}

                                <form onSubmit={handleReset}>
                                    <div className="form-group">
                                        <label className="form-label">New Room Key</label>
                                        <input
                                            className="form-input"
                                            type="password"
                                            placeholder="Enter new key (min 4 chars)"
                                            value={newKey}
                                            onChange={(e) => setNewKey(e.target.value)}
                                            required
                                            minLength={4}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Confirm New Key</label>
                                        <input
                                            className="form-input"
                                            type="password"
                                            placeholder="Confirm new key"
                                            value={confirmKey}
                                            onChange={(e) => setConfirmKey(e.target.value)}
                                            required
                                            minLength={4}
                                        />
                                    </div>

                                    <button className="btn btn-primary" type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner" /> Resetting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-check" /> Set New Key
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* Success */}
                        {status === "success" && (
                            <div className="success-screen">
                                <div className="success-icon">
                                    <i className="fa-solid fa-circle-check" style={{ color: "var(--accent-secondary)", fontSize: 36 }} />
                                </div>
                                <h2 className="success-title">Key Reset Successful!</h2>
                                <p className="success-subtitle">
                                    Your Room Key has been updated. Use your new key to re-enter the room.
                                </p>

                                <div className="credentials-box">
                                    <div className="credential-row">
                                        <span className="credential-label">Room ID</span>
                                        <span className="credential-value">{roomInfo?.roomCode}</span>
                                    </div>
                                </div>

                                <button className="btn btn-primary" onClick={() => router.push("/")}>
                                    <i className="fa-solid fa-right-to-bracket" /> Go to Login
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
