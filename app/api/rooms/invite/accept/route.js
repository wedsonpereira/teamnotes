import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { pickMemberColor, colorFromName } from "@/lib/colors";
import {
    verifyRoomInviteToken,
    createRoomSession,
    setRoomSessionCookie,
} from "@/lib/session";

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

        if (membership) {
            if (membership.status !== "APPROVED") {
                const approvedCount = await prisma.roomMember.count({
                    where: { roomId: room.id, status: "APPROVED" },
                });

                const updatedMembership = await prisma.roomMember.update({
                    where: { id: membership.id },
                    data: {
                        status: "APPROVED",
                        color: membership.color || pickMemberColor(approvedCount),
                    },
                });
                finalColor = updatedMembership.color;
            }
        } else {
            const approvedCount = await prisma.roomMember.count({
                where: { roomId: room.id, status: "APPROVED" },
            });

            const createdMembership = await prisma.roomMember.create({
                data: {
                    roomId: room.id,
                    userId: user.id,
                    status: "APPROVED",
                    color: pickMemberColor(approvedCount),
                },
            });
            finalColor = createdMembership.color;
        }

        const session = createRoomSession({
            userId: user.id,
            roomId: room.id,
            isAdmin: room.adminId === user.id,
        });

        const response = NextResponse.json({
            roomId: room.id,
            userId: user.id,
            firstName: user.firstName || derivedName.firstName,
            lastName: user.lastName || derivedName.lastName,
            email: user.email,
            isAdmin: room.adminId === user.id,
            color:
                finalColor
                || colorFromName(`${user.firstName || ""}${user.lastName || ""}`),
            sessionExpiresAt: session.expiresAtIso,
        });
        setRoomSessionCookie(response, session.token);
        return response;
    } catch (error) {
        console.error("Accept invite error:", error);
        return NextResponse.json(
            { error: "Failed to accept invite." },
            { status: 500 }
        );
    }
}
