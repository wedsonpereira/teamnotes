import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { colorFromName, pickMemberColor } from "@/lib/colors";
import bcrypt from "bcryptjs";
import {
    readRoomSessionFromRequest,
    createRoomInviteToken,
} from "@/lib/session";
import { sendRoomInviteEmail } from "@/lib/email";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
}

function deriveNameFromEmail(email) {
    const localPart = normalizeEmail(email).split("@")[0] || "";
    const words = localPart
        .split(/[._+\-]+/)
        .map((part) => part.replace(/[^a-zA-Z]/g, ""))
        .filter(Boolean)
        .map((part) => {
            const lower = part.toLowerCase();
            return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
        });

    if (words.length === 0) {
        return { firstName: "Member", lastName: "" };
    }

    return {
        firstName: words[0],
        lastName: words.slice(1).join(" "),
    };
}

// GET /api/rooms/[roomId]/members — List members
export async function GET(request, { params }) {
    try {
        const { roomId } = await params;
        const session = readRoomSessionFromRequest(request, roomId);
        const { searchParams } = new URL(request.url);
        const fallbackUserId = searchParams.get("userId");
        const fallbackRoomKey =
            request.headers.get("x-room-key") || searchParams.get("roomKey");
        const userId = session?.userId || fallbackUserId;

        if (!userId) {
            return NextResponse.json(
                { error: "Session expired. Please re-enter the room." },
                { status: 401 }
            );
        }

        const room = await prisma.room.findUnique({
            where: { id: roomId },
            include: {
                members: {
                    include: { user: true },
                    orderBy: { joinedAt: "asc" },
                },
                invites: {
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!room) {
            return NextResponse.json({ error: "Room not found." }, { status: 404 });
        }

        if (!session) {
            if (!fallbackRoomKey) {
                return NextResponse.json(
                    { error: "Session expired. Please re-enter the room." },
                    { status: 401 }
                );
            }

            const keyValid = await bcrypt.compare(
                String(fallbackRoomKey),
                room.roomKeyHash
            );
            if (!keyValid) {
                return NextResponse.json(
                    { error: "Invalid room credentials." },
                    { status: 403 }
                );
            }

            const pending = room.members.find(
                (m) => m.userId === userId && m.status === "PENDING"
            );
            if (pending) {
                return NextResponse.json({
                    status: "PENDING",
                    message: "Your join request is pending admin approval.",
                });
            }

            const rejected = room.members.find(
                (m) => m.userId === userId && m.status === "REJECTED"
            );
            if (rejected) {
                return NextResponse.json(
                    { error: "Your join request was rejected by the admin." },
                    { status: 403 }
                );
            }

            const approved = room.members.find(
                (m) => m.userId === userId && m.status === "APPROVED"
            );
            if (approved) {
                return NextResponse.json({
                    status: "APPROVED",
                    message: "Membership approved.",
                });
            }

            return NextResponse.json(
                { error: "Session expired. Please re-enter the room." },
                { status: 401 }
            );
        }

        const isAdmin = room.adminId === userId;
        const isMember = room.members.some(
            (m) => m.userId === userId && m.status === "APPROVED"
        );

        if (!isMember && !isAdmin) {
            // Check if pending
            const pending = room.members.find(
                (m) => m.userId === userId && m.status === "PENDING"
            );
            if (pending) {
                return NextResponse.json({
                    status: "PENDING",
                    message: "Your join request is pending admin approval.",
                });
            }
            return NextResponse.json({ error: "Access denied." }, { status: 403 });
        }

        // Filter members based on admin settings
        const approvedMembers = room.members
            .filter((m) => m.status === "APPROVED")
            .map((m) => ({
                id: m.user.id,
                firstName: m.user.firstName,
                lastName: m.user.lastName,
                email: m.user.email,
                isAdmin: m.userId === room.adminId,
                joinedAt: m.joinedAt,
                color: m.color || colorFromName(m.user.firstName + m.user.lastName),
            }));

        const pendingMembers = isAdmin
            ? room.members
                .filter((m) => m.status === "PENDING")
                .map((m) => ({
                    id: m.user.id,
                    memberId: m.id,
                    firstName: m.user.firstName,
                    lastName: m.user.lastName,
                    email: m.user.email,
                    joinedAt: m.joinedAt,
                }))
            : [];

        const adminMember = approvedMembers.find((m) => m.isAdmin);

        return NextResponse.json({
            roomName: room.name,
            roomCode: room.roomCode,
            showMembers: room.showMembers,
            isAdmin,
            members: room.showMembers || isAdmin ? approvedMembers : [],
            pendingMembers,
            invitedEmails: isAdmin
                ? room.invites.map((invite) => ({
                    id: invite.id,
                    email: invite.email,
                    createdAt: invite.createdAt,
                }))
                : [],
            adminName: adminMember
                ? `${adminMember.firstName} ${adminMember.lastName}`
                : "Unknown",
        });
    } catch (error) {
        console.error("Get members error:", error);
        return NextResponse.json(
            { error: "Failed to load members." },
            { status: 500 }
        );
    }
}

// POST /api/rooms/[roomId]/members — Admin invite by email (auto-approve)
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

        const { email } = await request.json();
        const normalizedEmail = normalizeEmail(email);

        if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
            return NextResponse.json(
                { error: "A valid teammate email is required." },
                { status: 400 }
            );
        }

        const room = await prisma.room.findUnique({
            where: { id: roomId },
            select: {
                id: true,
                name: true,
                roomCode: true,
                adminId: true,
                admin: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        if (!room) {
            return NextResponse.json({ error: "Room not found." }, { status: 404 });
        }

        if (room.adminId !== session.userId) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
        }

        const { firstName: derivedFirstName, lastName: derivedLastName } =
            deriveNameFromEmail(normalizedEmail);

        const invite = await prisma.roomInvite.upsert({
            where: {
                roomId_email: {
                    roomId,
                    email: normalizedEmail,
                },
            },
            update: {},
            create: {
                roomId,
                email: normalizedEmail,
            },
        });

        const existingUser = await prisma.user.findFirst({
            where: {
                email: {
                    equals: normalizedEmail,
                    mode: "insensitive",
                },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
            },
        });

        const invitedUser = existingUser
            ? existingUser
            : await prisma.user.create({
                data: {
                    email: normalizedEmail,
                    firstName: derivedFirstName,
                    lastName: derivedLastName,
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            });

        let accessGrantedNow = false;
        let alreadyApproved = false;

        const existingMember = await prisma.roomMember.findUnique({
            where: {
                userId_roomId: {
                    userId: invitedUser.id,
                    roomId,
                },
            },
            select: {
                id: true,
                status: true,
                color: true,
            },
        });

        if (existingMember) {
            if (existingMember.status === "APPROVED") {
                alreadyApproved = true;
            } else {
                const approvedCount = await prisma.roomMember.count({
                    where: { roomId, status: "APPROVED" },
                });

                await prisma.roomMember.update({
                    where: { id: existingMember.id },
                    data: {
                        status: "APPROVED",
                        color: existingMember.color || pickMemberColor(approvedCount),
                    },
                });
                accessGrantedNow = true;
            }
        } else {
            const approvedCount = await prisma.roomMember.count({
                where: { roomId, status: "APPROVED" },
            });

            await prisma.roomMember.create({
                data: {
                    roomId,
                    userId: invitedUser.id,
                    status: "APPROVED",
                    color: pickMemberColor(approvedCount),
                },
            });
            accessGrantedNow = true;
        }

        const inviterName = `${room.admin.firstName || ""} ${room.admin.lastName || ""}`.trim()
            || room.admin.email
            || "A teammate";
        const appUrl = (process.env.APP_URL || "http://localhost:3001").replace(/\/$/, "");
        const inviteTokenPayload = createRoomInviteToken({
            roomId,
            email: normalizedEmail,
            inviteId: invite.id,
        });
        const inviteLink = `${appUrl}/?invite=${encodeURIComponent(inviteTokenPayload.token)}`;

        try {
            await sendRoomInviteEmail({
                to: normalizedEmail,
                invitedName: invitedUser.firstName || derivedFirstName,
                roomName: room.name,
                roomCode: room.roomCode,
                inviterName,
                inviteLink,
            });
        } catch (mailError) {
            console.error("Invite email send error:", mailError);
            return NextResponse.json(
                {
                    error: "Invite saved, but failed to send email. Please verify SMTP settings and try again.",
                    invite: {
                        id: invite.id,
                        email: invite.email,
                        createdAt: invite.createdAt,
                    },
                    accessGrantedNow,
                    alreadyApproved,
                    emailSent: false,
                },
                { status: 502 }
            );
        }

        const message = alreadyApproved
            ? "This teammate already has room access. Invite email sent."
            : accessGrantedNow
                ? "Teammate invited, approved, and email sent."
                : "Invite saved. Access will be granted automatically when they join. Email sent.";

        return NextResponse.json({
            message,
            invite: {
                id: invite.id,
                email: invite.email,
                createdAt: invite.createdAt,
            },
            accessGrantedNow,
            alreadyApproved,
            emailSent: true,
        });
    } catch (error) {
        console.error("Invite member error:", error);
        return NextResponse.json(
            { error: "Failed to invite teammate." },
            { status: 500 }
        );
    }
}

// DELETE /api/rooms/[roomId]/members — Self-exit from room
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

        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room) {
            return NextResponse.json({ error: "Room not found." }, { status: 404 });
        }

        // Admin cannot exit their own room
        if (room.adminId === session.userId) {
            return NextResponse.json(
                { error: "Room admin cannot exit the room. Transfer ownership or delete the room instead." },
                { status: 400 }
            );
        }

        const member = await prisma.roomMember.findFirst({
            where: {
                roomId,
                userId: session.userId,
            },
        });

        if (!member) {
            return NextResponse.json(
                { error: "You are not a member of this room." },
                { status: 404 }
            );
        }

        await prisma.roomMember.delete({ where: { id: member.id } });

        // Clear the room session cookie
        const response = NextResponse.json({ message: "You have exited the room." });

        const { clearRoomSessionCookie } = await import("@/lib/session");
        clearRoomSessionCookie(response);

        return response;
    } catch (error) {
        console.error("Exit room error:", error);
        return NextResponse.json(
            { error: "Failed to exit room." },
            { status: 500 }
        );
    }
}

// PATCH /api/rooms/[roomId]/members — Approve/Reject/Remove
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
        const { memberId, memberUserId, action } = await request.json();

        // Verify admin
        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room || room.adminId !== session.userId) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
        }

        if (!["APPROVED", "REJECTED", "REMOVED"].includes(action)) {
            return NextResponse.json({ error: "Invalid action." }, { status: 400 });
        }

        // Admin removes an already approved member from the room.
        if (action === "REMOVED") {
            if (!memberUserId) {
                return NextResponse.json(
                    { error: "memberUserId is required for remove action." },
                    { status: 400 }
                );
            }

            if (memberUserId === room.adminId) {
                return NextResponse.json(
                    { error: "Room admin cannot be removed." },
                    { status: 400 }
                );
            }

            const existingMember = await prisma.roomMember.findFirst({
                where: {
                    roomId,
                    userId: memberUserId,
                    status: "APPROVED",
                },
                include: { user: true },
            });

            if (!existingMember) {
                return NextResponse.json(
                    { error: "Approved member not found." },
                    { status: 404 }
                );
            }

            await prisma.roomMember.delete({
                where: { id: existingMember.id },
            });

            const revokedInvites = await prisma.roomInvite.deleteMany({
                where: {
                    roomId,
                    email: normalizeEmail(existingMember.user.email),
                },
            });

            return NextResponse.json({
                message:
                    revokedInvites.count > 0
                        ? "Member removed and invite revoked."
                        : "Member removed.",
                inviteRevoked: revokedInvites.count > 0,
                member: {
                    id: existingMember.user.id,
                    firstName: existingMember.user.firstName,
                    lastName: existingMember.user.lastName,
                    email: existingMember.user.email,
                },
            });
        }

        if (!memberId) {
            return NextResponse.json(
                { error: "memberId is required for this action." },
                { status: 400 }
            );
        }

        const existingMember = await prisma.roomMember.findUnique({
            where: { id: memberId },
            include: { user: true },
        });

        if (!existingMember || existingMember.roomId !== roomId) {
            return NextResponse.json({ error: "Member not found." }, { status: 404 });
        }

        if (existingMember.userId === room.adminId) {
            return NextResponse.json(
                { error: "Room admin cannot be modified." },
                { status: 400 }
            );
        }

        const member = await prisma.roomMember.update({
            where: { id: memberId },
            data: { status: action },
            include: { user: true },
        });

        return NextResponse.json({
            message: `Member ${action.toLowerCase()}.`,
            member: {
                id: member.user.id,
                firstName: member.user.firstName,
                lastName: member.user.lastName,
                email: member.user.email,
            },
        });
    } catch (error) {
        console.error("Update member error:", error);
        return NextResponse.json(
            { error: "Failed to update member status." },
            { status: 500 }
        );
    }
}
