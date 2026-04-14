import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// GET — validate token and return room info
export async function GET(request, { params }) {
    try {
        const { token } = await params;

        const room = await prisma.room.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
            },
            include: { admin: { select: { firstName: true, lastName: true, email: true } } },
        });

        if (!room) {
            return NextResponse.json(
                { error: "Invalid or expired reset link." },
                { status: 400 }
            );
        }

        return NextResponse.json({
            valid: true,
            roomCode: room.roomCode,
            roomName: room.name,
            adminName: `${room.admin.firstName} ${room.admin.lastName}`,
        });
    } catch (error) {
        console.error("Token validation error:", error);
        return NextResponse.json(
            { error: "Failed to validate token." },
            { status: 500 }
        );
    }
}

// POST — reset the key using the token
export async function POST(request, { params }) {
    try {
        const { token } = await params;
        const { newKey } = await request.json();

        if (!newKey || newKey.length < 4) {
            return NextResponse.json(
                { error: "New key must be at least 4 characters." },
                { status: 400 }
            );
        }

        const room = await prisma.room.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
            },
        });

        if (!room) {
            return NextResponse.json(
                { error: "Invalid or expired reset link." },
                { status: 400 }
            );
        }

        // Hash the new key and save, clear the token
        const newKeyHash = await bcrypt.hash(newKey, 10);

        await prisma.room.update({
            where: { id: room.id },
            data: {
                roomKeyHash: newKeyHash,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return NextResponse.json({
            success: true,
            roomCode: room.roomCode,
            message: "Room Key has been reset successfully!",
        });
    } catch (error) {
        console.error("Reset key error:", error);
        return NextResponse.json(
            { error: "Failed to reset key. Please try again." },
            { status: 500 }
        );
    }
}
