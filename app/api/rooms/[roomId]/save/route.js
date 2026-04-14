import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { readRoomSessionFromRequest } from "@/lib/session";

function parseCompressedContent(content) {
    if (typeof content === "string") {
        const trimmed = content.trim();
        if (!trimmed) {
            throw new Error("Content cannot be empty.");
        }

        // Legacy fallback: stored as comma-separated byte values.
        if (/^\d+(,\d+)*$/.test(trimmed)) {
            const bytes = trimmed.split(",").map((value) => {
                const parsed = Number(value);
                if (!Number.isInteger(parsed) || parsed < 0 || parsed > 255) {
                    throw new Error("Invalid byte value.");
                }
                return parsed;
            });
            return Uint8Array.from(bytes);
        }

        return Uint8Array.from(Buffer.from(trimmed, "base64"));
    }

    if (Array.isArray(content)) {
        return Uint8Array.from(content);
    }

    if (content && typeof content === "object" && content.type === "Buffer" && Array.isArray(content.data)) {
        return Uint8Array.from(content.data);
    }

    throw new Error("Unsupported content format.");
}

// POST /api/rooms/[roomId]/save — Save compressed content
export async function POST(request, { params }) {
    try {
        const { roomId } = await params;
        const session = readRoomSessionFromRequest(request, roomId);
        if (!session) {
            return NextResponse.json(
                { error: "Session expired. Please re-enter the room." },
                { status: 401 }
            );
        }
        const { compressedContent, pageId } = await request.json();

        if (!compressedContent) {
            return NextResponse.json(
                { error: "Content is required." },
                { status: 400 }
            );
        }

        // Verify membership
        const member = await prisma.roomMember.findFirst({
            where: {
                roomId,
                userId: session.userId,
                status: "APPROVED",
            },
        });

        if (!member) {
            return NextResponse.json({ error: "Access denied." }, { status: 403 });
        }

        const encodedBytes = parseCompressedContent(compressedContent);

        if (pageId) {
            const page = await prisma.page.findFirst({
                where: { id: pageId, roomId },
                select: { id: true },
            });
            if (!page) {
                return NextResponse.json(
                    { error: "Page not found." },
                    { status: 404 }
                );
            }

            // Save to specific page
            await prisma.page.update({
                where: { id: pageId },
                data: { compressedContent: encodedBytes },
            });
        } else {
            // Legacy: save to room directly
            await prisma.room.update({
                where: { id: roomId },
                data: { compressedContent: encodedBytes },
            });
        }

        return NextResponse.json({ message: "Content saved successfully." });
    } catch (error) {
        console.error("Save content error:", error);
        return NextResponse.json(
            { error: "Failed to save content." },
            { status: 500 }
        );
    }
}

// GET /api/rooms/[roomId]/save — Load content
export async function GET(request, { params }) {
    try {
        const { roomId } = await params;
        const session = readRoomSessionFromRequest(request, roomId);
        if (!session) {
            return NextResponse.json(
                { error: "Session expired. Please re-enter the room." },
                { status: 401 }
            );
        }
        const { searchParams } = new URL(request.url);
        const pageId = searchParams.get("pageId");

        // Verify membership
        const member = await prisma.roomMember.findFirst({
            where: {
                roomId,
                userId: session.userId,
                status: "APPROVED",
            },
        });

        if (!member) {
            return NextResponse.json({ error: "Access denied." }, { status: 403 });
        }

        let compressedContent = null;

        if (pageId) {
            // Load from specific page
            const page = await prisma.page.findFirst({
                where: { id: pageId, roomId },
                select: { compressedContent: true },
            });
            compressedContent = page?.compressedContent || null;
        } else {
            // Legacy: load from room
            const room = await prisma.room.findUnique({
                where: { id: roomId },
                select: { compressedContent: true },
            });
            compressedContent = room?.compressedContent || null;
        }

        if (!compressedContent) {
            return NextResponse.json({ compressedContent: null });
        }

        const base64 = Buffer.from(compressedContent).toString("base64");
        return NextResponse.json({ compressedContent: base64 });
    } catch (error) {
        console.error("Load content error:", error);
        return NextResponse.json(
            { error: "Failed to load content." },
            { status: 500 }
        );
    }
}
