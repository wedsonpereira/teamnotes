import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { pickMemberColor } from "@/lib/colors";
import { createRoomSession, setRoomSessionCookie } from "@/lib/session";
import { createRateLimiter, getClientIp, rateLimitResponse } from "@/lib/rateLimit";
import { logError } from "@/lib/logger";
import { emitJoinRequestNotification, emitRoomMembersRefresh } from "@/lib/realtime";

// Rate limiters — stricter for this brute-force-sensitive endpoint.
const ipLimiter = createRateLimiter({ windowMs: 60_000, maxRequests: 5 });
const roomLimiter = createRateLimiter({ windowMs: 60_000, maxRequests: 10 });

function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
}

function deriveUsernameFromEmail(email) {
    const localPart = normalizeEmail(email).split("@")[0] || "";
    const words = localPart
        .split(/[._+\-]+/)
        .map((part) => part.replace(/[^a-zA-Z]/g, ""))
        .filter(Boolean)
        .map((part) => {
            const lower = part.toLowerCase();
            return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
        });

    if (words.length === 0) {
        return "Member";
    }

    return words.join(" ");
}

function approvedResponse({ room, user, status, color, message }) {
    const session = createRoomSession({
        userId: user.id,
        roomId: room.id,
        isAdmin: room.adminId === user.id,
    });

    const response = NextResponse.json({
        roomId: room.id,
        userId: user.id,
        status,
        isAdmin: room.adminId === user.id,
        color,
        message,
        username: user.firstName,
        sessionExpiresAt: session.expiresAtIso,
    });

    setRoomSessionCookie(response, session.token);
    return response;
}

function pendingResponse({ room, user, membership, message }) {
    const session = createRoomSession({
        userId: user.id,
        roomId: room.id,
        isAdmin: false,
    });

    const response = NextResponse.json({
        roomId: room.id,
        userId: user.id,
        status: membership.status,
        isAdmin: room.adminId === user.id,
        color: membership.color,
        username: user.firstName,
        message,
        sessionExpiresAt: session.expiresAtIso,
    });

    setRoomSessionCookie(response, session.token);
    return response;
}

function emitPendingJoinRequest(room, membership, user) {
    emitRoomMembersRefresh(room.id);
    emitJoinRequestNotification(room.id, {
        memberId: membership.id,
        userId: user.id,
        username: user.firstName,
        email: user.email,
        requestedAt: new Date().toISOString(),
    });
}

export async function POST(request) {
    try {
        const ip = getClientIp(request);
        const ipCheck = ipLimiter.check(`join:${ip}`);
        if (!ipCheck.allowed) return rateLimitResponse(ipCheck.retryAfterMs);

        const { username, firstName, lastName, email, roomCode, roomKey } = await request.json();
        const normalizedUsername = String(
            username || `${firstName || ""} ${lastName || ""}`
        ).trim().replace(/\s+/g, " ");

        // Also rate-limit per roomCode to prevent targeted brute-force.
        if (roomCode) {
            const roomCheck = roomLimiter.check(`join:room:${roomCode}`);
            if (!roomCheck.allowed) return rateLimitResponse(roomCheck.retryAfterMs);
        }

        if (!email || !roomCode || !roomKey) {
            return NextResponse.json(
                { error: "Email, Room ID, and Room Key are required." },
                { status: 400 }
            );
        }

        // Validate email format.
        const normalizedEmail = String(email || "").trim().toLowerCase();
        const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!EMAIL_REGEX.test(normalizedEmail)) {
            return NextResponse.json(
                { error: "Please enter a valid email address." },
                { status: 400 }
            );
        }

        // Find room by code
        const room = await prisma.room.findUnique({
            where: { roomCode },
            include: { admin: true },
        });

        if (!room) {
            return NextResponse.json(
                { error: "Room not found. Check the Room ID and try again." },
                { status: 404 }
            );
        }

        // Verify room key
        const keyValid = await bcrypt.compare(roomKey, room.roomKeyHash);
        if (!keyValid) {
            return NextResponse.json(
                { error: "Invalid Room Key." },
                { status: 403 }
            );
        }

        const invite = await prisma.roomInvite.findUnique({
            where: {
                roomId_email: {
                    roomId: room.id,
                    email: normalizedEmail,
                },
            },
            select: { id: true },
        });
        const isInvited = Boolean(invite);

        const existingMemberByEmail = await prisma.roomMember.findFirst({
            where: {
                roomId: room.id,
                user: {
                    email: {
                        equals: normalizedEmail,
                        mode: "insensitive",
                    },
                },
            },
            include: {
                user: true,
            },
        });

        if (existingMemberByEmail) {
            const memberUser = existingMemberByEmail.user;

            if (existingMemberByEmail.status === "APPROVED") {
                return approvedResponse({
                    room,
                    user: memberUser,
                    status: existingMemberByEmail.status,
                    color: existingMemberByEmail.color,
                    message: "You are already a member.",
                });
            }

            if (existingMemberByEmail.status === "REJECTED") {
                const membership = await prisma.roomMember.update({
                    where: { id: existingMemberByEmail.id },
                    data: {
                        status: "PENDING",
                        access: "VIEW",
                    },
                });

                emitPendingJoinRequest(room, membership, memberUser);
                return pendingResponse({
                    room,
                    user: memberUser,
                    membership,
                    message: "Join request sent. Waiting for admin approval.",
                });
            }

            return pendingResponse({
                room,
                user: memberUser,
                membership: existingMemberByEmail,
                message: "Your request is still pending approval.",
            });
        }

        if (!normalizedUsername && !isInvited) {
            return NextResponse.json(
                { error: "Username is required." },
                { status: 400 }
            );
        }

        // Upsert user
        const derivedUsername = deriveUsernameFromEmail(normalizedEmail);
        const existingUser = await prisma.user.findFirst({
            where: {
                email: {
                    equals: normalizedEmail,
                    mode: "insensitive",
                },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            },
        });

        let user;
        if (existingUser) {
            if (isInvited) {
                const shouldFillDerivedName =
                    !String(existingUser.firstName || "").trim();

                user = shouldFillDerivedName
                    ? await prisma.user.update({
                        where: { id: existingUser.id },
                        data: {
                            firstName: String(existingUser.firstName || "").trim()
                                || derivedUsername,
                            lastName: "",
                        },
                    })
                    : existingUser;
            } else {
                user = await prisma.user.update({
                    where: { id: existingUser.id },
                    data: { firstName: normalizedUsername, lastName: "" },
                });
            }
        } else {
            user = await prisma.user.create({
                data: {
                    firstName: isInvited ? derivedUsername : normalizedUsername,
                    lastName: "",
                    email: normalizedEmail,
                },
            });
        }

        // Create membership request
        const existingCount = await prisma.roomMember.count({
            where: { roomId: room.id, status: "APPROVED" },
        });
        const membership = await prisma.roomMember.create({
            data: {
                userId: user.id,
                roomId: room.id,
                status: "PENDING",
                access: "VIEW",
                color: pickMemberColor(existingCount),
            },
        });

        emitPendingJoinRequest(room, membership, user);
        return pendingResponse({
            room,
            user,
            membership,
            message: "Join request sent. Waiting for admin approval.",
        });
    } catch (error) {
        logError("Join room", error);
        return NextResponse.json(
            { error: "Failed to join room. Please try again." },
            { status: 500 }
        );
    }
}
