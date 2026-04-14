import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { colorFromName } from "@/lib/colors";
import { createRoomSession, setRoomSessionCookie } from "@/lib/session";

export async function POST(request) {
    try {
        const { email, roomCode, roomKey } = await request.json();
        const normalizedEmail = String(email || "").trim().toLowerCase();

        if (!normalizedEmail || !roomCode || !roomKey) {
            return NextResponse.json(
                { error: "Email, Room ID, and Room Key are required." },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await prisma.user.findFirst({
            where: {
                email: {
                    equals: normalizedEmail,
                    mode: "insensitive",
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "No account found with this email. Use 'Join Room' to create one." },
                { status: 404 }
            );
        }

        // Find room by code
        const room = await prisma.room.findUnique({
            where: { roomCode },
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

        // Check membership
        const membership = await prisma.roomMember.findUnique({
            where: {
                userId_roomId: {
                    userId: user.id,
                    roomId: room.id,
                },
            },
        });

        if (!membership) {
            return NextResponse.json(
                { error: "You are not a member of this room. Use 'Join Room' to request access." },
                { status: 403 }
            );
        }

        if (membership.status === "PENDING") {
            return NextResponse.json(
                { error: "Your join request is still pending admin approval." },
                { status: 403 }
            );
        }

        if (membership.status === "REJECTED") {
            return NextResponse.json(
                { error: "Your join request was rejected by the admin." },
                { status: 403 }
            );
        }

        const session = createRoomSession({
            userId: user.id,
            roomId: room.id,
            isAdmin: room.adminId === user.id,
        });

        const response = NextResponse.json({
            roomId: room.id,
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: room.adminId === user.id,
            color: membership.color || colorFromName(user.firstName + user.lastName),
            sessionExpiresAt: session.expiresAtIso,
        });
        setRoomSessionCookie(response, session.token);
        return response;
    } catch (error) {
        console.error("Re-enter room error:", error);
        return NextResponse.json(
            { error: "Failed to re-enter room. Please try again." },
            { status: 500 }
        );
    }
}
