import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { readRoomSessionFromRequest } from "@/lib/session";

// PATCH /api/rooms/[roomId]/settings — Update room settings
export async function PATCH(request, { params }) {
    try {
        const { roomId } = await params;
        const session = readRoomSessionFromRequest(request, roomId);
        if (!session) {
            return NextResponse.json(
                { error: "Session expired. Please re-enter the room." },
                { status: 401 }
            );
        }

        const { showMembers, name } = await request.json();

        // Verify admin
        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room || room.adminId !== session.userId) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
        }

        const updateData = {};
        if (typeof showMembers === "boolean") updateData.showMembers = showMembers;
        if (typeof name === "string" && name.trim()) updateData.name = name.trim();

        const updatedRoom = await prisma.room.update({
            where: { id: roomId },
            data: updateData,
        });

        return NextResponse.json({
            message: "Settings updated.",
            showMembers: updatedRoom.showMembers,
            name: updatedRoom.name,
        });
    } catch (error) {
        console.error("Update settings error:", error);
        return NextResponse.json(
            { error: "Failed to update settings." },
            { status: 500 }
        );
    }
}
