import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { readRoomSessionFromRequest } from "@/lib/session";
import { Prisma } from "@prisma/client";

const MAX_PAGE_CREATE_RETRIES = 5;

function isSortOrderConflict(error) {
    return (
        error instanceof Prisma.PrismaClientKnownRequestError
        && error.code === "P2002"
    );
}

// GET /api/rooms/[roomId]/pages — List all pages for a room
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

        // Verify membership
        const member = await prisma.roomMember.findFirst({
            where: { roomId, userId: session.userId, status: "APPROVED" },
        });

        if (!member) {
            return NextResponse.json(
                { error: "Access denied." },
                { status: 403 }
            );
        }

        let pages = await prisma.page.findMany({
            where: { roomId },
            select: {
                id: true,
                title: true,
                sortOrder: true,
                createdAt: true,
            },
            orderBy: { sortOrder: "asc" },
        });

        // If room has no pages yet, create a default one and migrate
        // the room's legacy compressedContent into it.
        if (pages.length === 0) {
            const room = await prisma.room.findUnique({
                where: { id: roomId },
                select: { compressedContent: true },
            });

            try {
                await prisma.page.create({
                    data: {
                        roomId,
                        title: "Page 1",
                        sortOrder: 0,
                        compressedContent: room?.compressedContent || null,
                    },
                });
            } catch (error) {
                // Another request may have created the first page concurrently.
                if (!isSortOrderConflict(error)) {
                    throw error;
                }
            }

            pages = await prisma.page.findMany({
                where: { roomId },
                select: {
                    id: true,
                    title: true,
                    sortOrder: true,
                    createdAt: true,
                },
                orderBy: { sortOrder: "asc" },
            });
        }

        return NextResponse.json({ pages });
    } catch (error) {
        console.error("List pages error:", error);
        return NextResponse.json(
            { error: "Failed to list pages." },
            { status: 500 }
        );
    }
}

// POST /api/rooms/[roomId]/pages — Create a new page
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
        const { title } = await request.json();

        // Verify membership
        const member = await prisma.roomMember.findFirst({
            where: { roomId, userId: session.userId, status: "APPROVED" },
        });

        if (!member) {
            return NextResponse.json(
                { error: "Access denied." },
                { status: 403 }
            );
        }

        const trimmedTitle = typeof title === "string" ? title.trim() : "";

        let page = null;

        for (let attempt = 0; attempt < MAX_PAGE_CREATE_RETRIES; attempt++) {
            try {
                page = await prisma.$transaction(async (tx) => {
                    const [lastPage, count] = await Promise.all([
                        tx.page.findFirst({
                            where: { roomId },
                            orderBy: { sortOrder: "desc" },
                            select: { sortOrder: true },
                        }),
                        tx.page.count({ where: { roomId } }),
                    ]);

                    const nextOrder = (lastPage?.sortOrder ?? -1) + 1;
                    const pageTitle = trimmedTitle || `Page ${count + 1}`;

                    return tx.page.create({
                        data: {
                            roomId,
                            title: pageTitle,
                            sortOrder: nextOrder,
                        },
                    });
                });

                break;
            } catch (error) {
                if (!isSortOrderConflict(error)) {
                    throw error;
                }

                // Concurrent creator won the current sortOrder; retry.
            }
        }

        if (!page) {
            return NextResponse.json(
                { error: "Page creation collided. Please retry." },
                { status: 409 }
            );
        }

        return NextResponse.json({
            page: {
                id: page.id,
                title: page.title,
                sortOrder: page.sortOrder,
                createdAt: page.createdAt,
            },
        });
    } catch (error) {
        console.error("Create page error:", error);
        return NextResponse.json(
            { error: "Failed to create page." },
            { status: 500 }
        );
    }
}
