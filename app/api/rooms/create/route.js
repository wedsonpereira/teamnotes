import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { pickMemberColor } from "@/lib/colors";
import { createRoomSession, setRoomSessionCookie } from "@/lib/session";
import { Prisma } from "@prisma/client";

const ROOM_CODE_REGEX = /^[A-Za-z0-9_-]{4,32}$/;
const ROOM_KEY_MIN_LENGTH = 4;
const ROOM_KEY_MAX_LENGTH = 72;
const MAX_ROOM_CODE_GENERATION_ATTEMPTS = 5;

function normalizeRoomCode(value) {
    return String(value || "").trim();
}

function isRoomCodeConflict(error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
    if (error.code !== "P2002") return false;

    const target = error.meta?.target;
    if (Array.isArray(target)) return target.includes("roomCode");
    if (typeof target === "string") return target.includes("roomCode");

    // Fallback when connector omits target details.
    return true;
}

export async function POST(request) {
    try {
        const {
            firstName,
            lastName,
            email,
            roomCode: requestedRoomCode,
            roomKey,
        } = await request.json();
        const normalizedFirstName = String(firstName || "").trim();
        const normalizedLastName = String(lastName || "").trim();
        const normalizedEmail = String(email || "").trim().toLowerCase();
        const normalizedRoomCode = normalizeRoomCode(requestedRoomCode);
        const normalizedRoomKey = String(roomKey || "");

        if (!normalizedFirstName || !normalizedLastName || !normalizedEmail) {
            return NextResponse.json(
                { error: "First name, last name, and email are required." },
                { status: 400 }
            );
        }

        if (normalizedRoomCode && !ROOM_CODE_REGEX.test(normalizedRoomCode)) {
            return NextResponse.json(
                {
                    error:
                        "Room ID must be 4-32 characters and can only include letters, numbers, underscore, or hyphen.",
                },
                { status: 400 }
            );
        }

        if (
            normalizedRoomKey.length < ROOM_KEY_MIN_LENGTH
            || normalizedRoomKey.length > ROOM_KEY_MAX_LENGTH
        ) {
            return NextResponse.json(
                {
                    error: `Password must be ${ROOM_KEY_MIN_LENGTH}-${ROOM_KEY_MAX_LENGTH} characters.`,
                },
                { status: 400 }
            );
        }

        // Upsert user
        const user = await prisma.user.upsert({
            where: { email: normalizedEmail },
            update: { firstName: normalizedFirstName, lastName: normalizedLastName },
            create: {
                firstName: normalizedFirstName,
                lastName: normalizedLastName,
                email: normalizedEmail,
            },
        });

        // Persist only a hash of the user-provided room password.
        const roomKeyHash = await bcrypt.hash(normalizedRoomKey, 10);

        let room = null;

        for (let attempt = 0; attempt < MAX_ROOM_CODE_GENERATION_ATTEMPTS; attempt++) {
            const candidateRoomCode = normalizedRoomCode || nanoid(8);

            try {
                room = await prisma.room.create({
                    data: {
                        roomCode: candidateRoomCode,
                        roomKeyHash,
                        name: `${normalizedFirstName}'s Room`,
                        adminId: user.id,
                        members: {
                            create: {
                                userId: user.id,
                                status: "APPROVED",
                                color: pickMemberColor(0),
                            },
                        },
                    },
                });
                break;
            } catch (error) {
                if (!isRoomCodeConflict(error)) {
                    throw error;
                }

                if (normalizedRoomCode) {
                    return NextResponse.json(
                        { error: "That Room ID is already in use. Please choose another one." },
                        { status: 409 }
                    );
                }
            }
        }

        if (!room) {
            return NextResponse.json(
                { error: "Failed to generate a unique Room ID. Please try again." },
                { status: 503 }
            );
        }

        const session = createRoomSession({
            userId: user.id,
            roomId: room.id,
            isAdmin: true,
        });

        const response = NextResponse.json({
            roomId: room.id,
            roomCode: room.roomCode,
            roomKey: normalizedRoomKey,
            userId: user.id,
            color: pickMemberColor(0),
            sessionExpiresAt: session.expiresAtIso,
        });

        setRoomSessionCookie(response, session.token);
        return response;
    } catch (error) {
        console.error("Create room error:", error);
        return NextResponse.json(
            { error: "Failed to create room. Please try again." },
            { status: 500 }
        );
    }
}
