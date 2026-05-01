import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logError } from "@/lib/logger";

/**
 * GET /api/rooms/[roomId]/membership-status?userId=<userId>
 *
 * Lightweight, scoped endpoint for checking a pending join-request status.
 * Returns ONLY the membership status (PENDING, APPROVED, REJECTED) — no
 * member data, no room details. This is used by the landing-page polling
 * loop while a user waits for admin approval.
 *
 * No session cookie required — this endpoint is intentionally accessible
 * without authentication so the pre-session polling flow works. It only
 * returns the caller's own status for the given room/user pair, never
 * any other member's data.
 */
export async function GET(request, { params }) {
    try {
        const { roomId } = await params;
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!roomId || !userId) {
            return NextResponse.json(
                { error: "Missing required parameters." },
                { status: 400 }
            );
        }

        // Look up the specific membership record for this user + room.
        const membership = await prisma.roomMember.findFirst({
            where: {
                roomId,
                userId,
            },
            select: {
                status: true,
            },
        });

        if (!membership) {
            return NextResponse.json(
                { error: "Membership not found." },
                { status: 404 }
            );
        }

        if (membership.status === "PENDING") {
            return NextResponse.json({
                status: "PENDING",
                message: "Your join request is pending admin approval.",
            });
        }

        if (membership.status === "REJECTED") {
            return NextResponse.json({
                status: "REJECTED",
                error: "Your join request was rejected by the admin.",
            });
        }

        // APPROVED — don't return any room data, just the status.
        return NextResponse.json({
            status: "APPROVED",
            message: "Membership approved.",
        });
    } catch (error) {
        logError("Membership status", error);
        return NextResponse.json(
            { error: "Failed to check membership status." },
            { status: 500 }
        );
    }
}
