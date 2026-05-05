const APPROVAL_CHANNEL_PREFIX = "room-approval:";

export function getApprovalChannel(roomId) {
    return `${APPROVAL_CHANNEL_PREFIX}${roomId}`;
}

export function getRealtimeServer() {
    return globalThis.__teamnoteIo || null;
}

export function setRealtimeServer(io) {
    globalThis.__teamnoteIo = io;
}

export function emitRoomMembersRefresh(roomId) {
    const io = getRealtimeServer();
    if (!io || !roomId) return;
    io.to(roomId).emit("members-refresh");
}

export function emitRoomSettingsRefresh(roomId) {
    const io = getRealtimeServer();
    if (!io || !roomId) return;
    io.to(roomId).emit("settings-refresh");
}

export function emitJoinRequestNotification(roomId, payload = {}) {
    const io = getRealtimeServer();
    if (!io || !roomId) return;
    io.to(roomId).emit("join-request", payload);
}

export function emitApprovalRefresh(roomId) {
    const io = getRealtimeServer();
    if (!io || !roomId) return;
    io.to(getApprovalChannel(roomId)).emit("approval-refresh");
}
