import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
    readRoomSessionFromRequest,
    clearRoomSessionCookie,
} from "@/lib/session";

// DELETE /api/rooms/[roomId] — Admin-only room deletion.
// Rule: all non-admin users must be removed first.
export async function DELETE(request, { params }) {
    try {
        const { roomId } = await params;
        const session = readRoomSessionFromRequest(request, roomId);

        if (!session) {
            return NextResponse.json(
                { error: "Session expired. Please re-enter the room." },
                { status: 401 }
            );
        }

        const room = await prisma.room.findUnique({
            where: { id: roomId },
            select: {
                id: true,
                adminId: true,
            },
        });

        if (!room) {
            return NextResponse.json({ error: "Room not found." }, { status: 404 });
        }

        if (room.adminId !== session.userId) {
            return NextResponse.json(
                { error: "Only the room admin can delete this room." },
                { status: 403 }
            );
        }

        const remainingMembers = await prisma.roomMember.count({
            where: {
                roomId,
                userId: { not: room.adminId },
                status: { in: ["APPROVED", "PENDING"] },
            },
        });

        if (remainingMembers > 0) {
            return NextResponse.json(
                {
                    error:
                        "Remove all other users (including pending requests) before deleting the room.",
                    remainingMembers,
                },
                { status: 400 }
            );
        }

        await prisma.$transaction([
            prisma.roomMember.deleteMany({ where: { roomId } }),
            prisma.room.delete({ where: { id: roomId } }),
        ]);

        const response = NextResponse.json({
            message: "Room deleted successfully.",
        });
        clearRoomSessionCookie(response);
        return response;
    } catch (error) {
        console.error("Delete room error:", error);
        return NextResponse.json(
            { error: "Failed to delete room." },
            { status: 500 }
        );
    }
}
