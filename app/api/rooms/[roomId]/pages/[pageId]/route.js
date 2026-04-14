import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { readRoomSessionFromRequest } from "@/lib/session";

// PATCH /api/rooms/[roomId]/pages/[pageId] — Rename a page
export async function PATCH(request, { params }) {
    try {
        const { roomId, pageId } = await params;
        const session = readRoomSessionFromRequest(request, roomId);
        if (!session) {
            return NextResponse.json(
                { error: "Session expired. Please re-enter the room." },
                { status: 401 }
            );
        }
        const { title } = await request.json();

        if (!title) {
            return NextResponse.json(
                { error: "title is required." },
                { status: 400 }
            );
        }

        const member = await prisma.roomMember.findFirst({
            where: { roomId, userId: session.userId, status: "APPROVED" },
        });

        if (!member) {
            return NextResponse.json(
                { error: "Access denied." },
                { status: 403 }
            );
        }

        const existingPage = await prisma.page.findFirst({
            where: { id: pageId, roomId },
        });
        if (!existingPage) {
            return NextResponse.json(
                { error: "Page not found." },
                { status: 404 }
            );
        }

        const page = await prisma.page.update({
            where: { id: pageId },
            data: { title },
        });

        return NextResponse.json({
            page: {
                id: page.id,
                title: page.title,
                sortOrder: page.sortOrder,
            },
        });
    } catch (error) {
        console.error("Rename page error:", error);
        return NextResponse.json(
            { error: "Failed to rename page." },
            { status: 500 }
        );
    }
}

// DELETE /api/rooms/[roomId]/pages/[pageId] — Delete a page
export async function DELETE(request, { params }) {
    try {
        const { roomId, pageId } = await params;
        const session = readRoomSessionFromRequest(request, roomId);
        if (!session) {
            return NextResponse.json(
                { error: "Session expired. Please re-enter the room." },
                { status: 401 }
            );
        }

        const member = await prisma.roomMember.findFirst({
            where: { roomId, userId: session.userId, status: "APPROVED" },
        });

        if (!member) {
            return NextResponse.json(
                { error: "Access denied." },
                { status: 403 }
            );
        }

        // Don't allow deleting the last page
        const pageCount = await prisma.page.count({ where: { roomId } });
        if (pageCount <= 1) {
            return NextResponse.json(
                { error: "Cannot delete the last page." },
                { status: 400 }
            );
        }

        const existingPage = await prisma.page.findFirst({
            where: { id: pageId, roomId },
        });
        if (!existingPage) {
            return NextResponse.json(
                { error: "Page not found." },
                { status: 404 }
            );
        }

        await prisma.page.delete({
            where: { id: pageId },
        });

        return NextResponse.json({ message: "Page deleted." });
    } catch (error) {
        console.error("Delete page error:", error);
        return NextResponse.json(
            { error: "Failed to delete page." },
            { status: 500 }
        );
    }
}
