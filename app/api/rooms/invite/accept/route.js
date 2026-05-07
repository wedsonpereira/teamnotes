import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { pickMemberColor, colorFromName } from "@/lib/colors";
import {
    verifyRoomInviteToken,
    createRoomSession,
    setRoomSessionCookie,
} from "@/lib/session";
import { logError } from "@/lib/logger";
import { emitJoinRequestNotification, emitRoomMembersRefresh } from "@/lib/realtime";

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

export async function POST(request) {
    try {
        const { token } = await request.json();
        const decoded = verifyRoomInviteToken(token);

        if (!decoded) {
            return NextResponse.json(
                { error: "Invite link is invalid or expired." },
                { status: 400 }
            );
        }

        const room = await prisma.room.findUnique({
            where: { id: decoded.roomId },
            select: {
                id: true,
                roomCode: true,
                adminId: true,
                invites: {
                    where: { email: decoded.email },
                    select: { id: true, email: true },
                    take: 1,
                },
            },
        });

        if (!room) {
            return NextResponse.json({ error: "Room not found." }, { status: 404 });
        }

        if (!room.invites.length) {
            return NextResponse.json(
                { error: "This invite is no longer active." },
                { status: 403 }
            );
        }

        const derivedName = deriveNameFromEmail(decoded.email);
        const existingUser = await prisma.user.findFirst({
            where: {
                email: {
                    equals: decoded.email,
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

        const user = existingUser
            ? existingUser
            : await prisma.user.create({
                data: {
                    email: decoded.email,
                    firstName: derivedName.firstName,
                    lastName: derivedName.lastName,
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            });

        const membership = await prisma.roomMember.findUnique({
            where: {
                userId_roomId: {
                    userId: user.id,
                    roomId: room.id,
                },
            },
            select: {
                id: true,
                status: true,
                color: true,
            },
        });

        let finalColor = membership?.color || null;
        let finalMembership = membership;
        let shouldNotifyAdmins = false;

        if (membership) {
            if (membership.status === "REJECTED") {
                finalMembership = await prisma.roomMember.update({
                    where: { id: membership.id },
                    data: {
                        status: "PENDING",
                        access: "VIEW",
                    },
                });
                finalColor = finalMembership.color;
                shouldNotifyAdmins = true;
            }
        } else {
            const approvedCount = await prisma.roomMember.count({
                where: { roomId: room.id, status: "APPROVED" },
            });

            finalMembership = await prisma.roomMember.create({
                data: {
                    roomId: room.id,
                    userId: user.id,
                    status: "PENDING",
                    access: "VIEW",
                    color: pickMemberColor(approvedCount),
                },
            });
            finalColor = finalMembership.color;
            shouldNotifyAdmins = true;
        }

        if (shouldNotifyAdmins && finalMembership) {
            emitRoomMembersRefresh(room.id);
            emitJoinRequestNotification(room.id, {
                memberId: finalMembership.id,
                userId: user.id,
                username: user.firstName || derivedName.firstName,
                email: user.email,
                requestedAt: new Date().toISOString(),
            });
        }

        const session = createRoomSession({
            userId: user.id,
            roomId: room.id,
            isAdmin: room.adminId === user.id,
        });

        const response = NextResponse.json({
            roomId: room.id,
            roomCode: room.roomCode,
            userId: user.id,
            status: finalMembership?.status || "PENDING",
            pending: finalMembership?.status !== "APPROVED",
            username: user.firstName || derivedName.firstName,
            firstName: user.firstName || derivedName.firstName,
            lastName: "",
            email: user.email,
            isAdmin: room.adminId === user.id,
            color:
                finalColor
                || colorFromName(user.firstName || derivedName.firstName),
            message: finalMembership?.status === "APPROVED"
                ? "Your membership is approved. Entering room."
                : "Join request sent. Waiting for admin approval.",
            sessionExpiresAt: session.expiresAtIso,
        });
        setRoomSessionCookie(response, session.token);
        return response;
    } catch (error) {
        logError("Accept invite", error);
        return NextResponse.json(
            { error: "Failed to accept invite." },
            { status: 500 }
        );
    }
}
