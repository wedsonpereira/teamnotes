import { prisma } from "@/lib/prisma";
import { sendForgotRoomIdEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { email } = await request.json();
        const normalizedEmail = String(email || "").trim().toLowerCase();

        if (!normalizedEmail) {
            return NextResponse.json(
                { error: "Email is required." },
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

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                success: true,
                message:
                    "If an account exists with that email, we've sent the Room IDs to your inbox.",
            });
        }

        // Get all rooms where the user is admin
        const adminRooms = await prisma.room.findMany({
            where: { adminId: user.id },
            select: { roomCode: true, name: true },
        });

        // Get all rooms where the user is an approved member (but not admin)
        const memberRooms = await prisma.roomMember.findMany({
            where: {
                userId: user.id,
                status: "APPROVED",
                room: {
                    adminId: { not: user.id },
                },
            },
            select: {
                room: {
                    select: { roomCode: true, name: true },
                },
            },
        });

        // Build the rooms list
        const rooms = [
            ...adminRooms.map((r) => ({
                roomCode: r.roomCode,
                roomName: r.name,
                role: "Admin",
            })),
            ...memberRooms.map((m) => ({
                roomCode: m.room.roomCode,
                roomName: m.room.name,
                role: "Member",
            })),
        ];

        if (rooms.length > 0) {
            await sendForgotRoomIdEmail({ to: normalizedEmail, rooms });
        }

        return NextResponse.json({
            success: true,
            message:
                "If an account exists with that email, we've sent the Room IDs to your inbox.",
        });
    } catch (error) {
        console.error("Forgot room ID error:", error);
        return NextResponse.json(
            { error: "Failed to process request. Please try again." },
            { status: 500 }
        );
    }
}
