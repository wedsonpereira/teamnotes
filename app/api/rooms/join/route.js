import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { pickMemberColor } from "@/lib/colors";
import { createRoomSession, setRoomSessionCookie } from "@/lib/session";

function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
}

function deriveNameFromEmail(email) {
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
        return { firstName: "Member", lastName: "" };
    }

    return {
        firstName: words[0],
        lastName: words.slice(1).join(" "),
    };
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
        sessionExpiresAt: session.expiresAtIso,
    });

    setRoomSessionCookie(response, session.token);
    return response;
}

export async function POST(request) {
    try {
        const { firstName, lastName, email, roomCode, roomKey } = await request.json();

        if (!email || !roomCode || !roomKey) {
            return NextResponse.json(
                { error: "Email, Room ID, and Room Key are required." },
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

        const normalizedEmail = normalizeEmail(email);
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

        if ((!firstName || !lastName) && !isInvited) {
            return NextResponse.json(
                { error: "First name and last name are required." },
                { status: 400 }
            );
        }

        // Upsert user
        const derivedName = deriveNameFromEmail(normalizedEmail);
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
                    !String(existingUser.firstName || "").trim() ||
                    !String(existingUser.lastName || "").trim();

                user = shouldFillDerivedName
                    ? await prisma.user.update({
                        where: { id: existingUser.id },
                        data: {
                            firstName: String(existingUser.firstName || "").trim()
                                || derivedName.firstName,
                            lastName: String(existingUser.lastName || "").trim()
                                || derivedName.lastName,
                        },
                    })
                    : existingUser;
            } else {
                user = await prisma.user.update({
                    where: { id: existingUser.id },
                    data: { firstName, lastName },
                });
            }
        } else {
            user = await prisma.user.create({
                data: {
                    firstName: isInvited ? derivedName.firstName : firstName,
                    lastName: isInvited ? derivedName.lastName : lastName,
                    email: normalizedEmail,
                },
            });
        }

        // Check existing membership
        const existingMember = await prisma.roomMember.findUnique({
            where: {
                userId_roomId: {
                    userId: user.id,
                    roomId: room.id,
                },
            },
        });

        if (existingMember) {
            if (existingMember.status === "REJECTED") {
                if (isInvited) {
                    const approvedCount = await prisma.roomMember.count({
                        where: { roomId: room.id, status: "APPROVED" },
                    });
                    const approvedMember = await prisma.roomMember.update({
                        where: { id: existingMember.id },
                        data: {
                            status: "APPROVED",
                            color: existingMember.color || pickMemberColor(approvedCount),
                        },
                    });

                    return approvedResponse({
                        room,
                        user,
                        status: approvedMember.status,
                        color: approvedMember.color,
                        message: "You were invited by the room admin and have been approved.",
                    });
                }
                return NextResponse.json(
                    { error: "Your join request was rejected by the admin." },
                    { status: 403 }
                );
            }

            if (existingMember.status === "APPROVED") {
                return approvedResponse({
                    room,
                    user,
                    status: existingMember.status,
                    color: existingMember.color,
                    message: "You are already a member.",
                });
            }

            if (isInvited && existingMember.status === "PENDING") {
                const approvedMember = await prisma.roomMember.update({
                    where: { id: existingMember.id },
                    data: { status: "APPROVED" },
                });

                return approvedResponse({
                    room,
                    user,
                    status: approvedMember.status,
                    color: approvedMember.color,
                    message: "Your invite was found. Access granted.",
                });
            }

            // Existing pending request.
            return NextResponse.json({
                roomId: room.id,
                userId: user.id,
                status: existingMember.status,
                isAdmin: room.adminId === user.id,
                color: existingMember.color,
                message: "Your request is still pending approval.",
            });
        }

        if (isInvited) {
            const approvedCount = await prisma.roomMember.count({
                where: { roomId: room.id, status: "APPROVED" },
            });
            const membership = await prisma.roomMember.create({
                data: {
                    userId: user.id,
                    roomId: room.id,
                    status: "APPROVED",
                    color: pickMemberColor(approvedCount),
                },
            });

            return approvedResponse({
                room,
                user,
                status: membership.status,
                color: membership.color,
                message: "Invitation matched. You now have access to this room.",
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
                color: pickMemberColor(existingCount),
            },
        });

        return NextResponse.json({
            roomId: room.id,
            userId: user.id,
            status: membership.status,
            isAdmin: room.adminId === user.id,
            color: membership.color,
            message: "Join request sent. Waiting for admin approval.",
        });
    } catch (error) {
        console.error("Join room error:", error);
        return NextResponse.json(
            { error: "Failed to join room. Please try again." },
            { status: 500 }
        );
    }
}
