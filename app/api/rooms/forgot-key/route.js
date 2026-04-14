import { prisma } from "@/lib/prisma";
import { sendResetKeyEmail } from "@/lib/email";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { email, roomCode } = await request.json();
        const normalizedEmail = String(email || "").trim().toLowerCase();

        if (!normalizedEmail || !roomCode) {
            return NextResponse.json(
                { error: "Email and Room ID are required." },
                { status: 400 }
            );
        }

        const genericResponse = {
            success: true,
            message:
                "If the account and room match an admin, a reset link has been sent to the registered email.",
        };

        // Find user by email (case-insensitive)
        const user = await prisma.user.findFirst({
            where: {
                email: {
                    equals: normalizedEmail,
                    mode: "insensitive",
                },
            },
        });

        // Always return a generic success response to prevent
        // user/room/admin enumeration via this endpoint.
        if (!user) {
            return NextResponse.json(genericResponse);
        }

        // Find room by code
        const room = await prisma.room.findUnique({
            where: { roomCode },
        });

        if (!room) {
            return NextResponse.json(genericResponse);
        }

        // Verify the user is the admin of this room
        if (room.adminId !== user.id) {
            return NextResponse.json(genericResponse);
        }

        // Generate a reset token (valid for 15 min)
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

        // Store the token in the room record
        await prisma.room.update({
            where: { id: room.id },
            data: { resetToken, resetTokenExpiry },
        });

        // Build the reset link
        const appUrl = process.env.APP_URL || "http://localhost:3000";
        const resetLink = `${appUrl}/reset-key/${resetToken}`;

        // Send the email
        await sendResetKeyEmail({
            to: normalizedEmail,
            roomCode,
            resetLink,
        });

        return NextResponse.json(genericResponse);
    } catch (error) {
        console.error("Forgot key error:", error);
        return NextResponse.json(
            { error: "Failed to send reset email. Please try again." },
            { status: 500 }
        );
    }
}
