import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { colorFromName } from "@/lib/colors";
import {
    readRoomSessionFromRequest,
    createRoomInviteToken,
} from "@/lib/session";
import { sendRoomInviteEmail } from "@/lib/email";
import { logError } from "@/lib/logger";
import { emitApprovalRefresh, emitRoomMembersRefresh } from "@/lib/realtime";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MEMBER_ACCESS_VALUES = new Set(["VIEW", "EDIT"]);

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

        if (!session?.userId) {
            return NextResponse.json(
                { error: "Session expired. Please re-enter the room." },
                { status: 401 }
            );
        }

        const userId = session.userId;

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

        const isAdmin = room.adminId === userId;
        const currentMembership = room.members.find(
            (m) => m.userId === userId && m.status === "APPROVED"
        );
        const isMember = Boolean(currentMembership);

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
                username: m.user.firstName,
                firstName: m.user.firstName,
                lastName: "",
                email: m.user.email,
                isAdmin: m.userId === room.adminId,
                access: m.userId === room.adminId ? "EDIT" : (m.access || "VIEW"),
                joinedAt: m.joinedAt,
                color: m.color || colorFromName(m.user.firstName),
            }));

        const pendingMembers = isAdmin
            ? room.members
                .filter((m) => m.status === "PENDING")
                .map((m) => ({
                    id: m.user.id,
                    memberId: m.id,
                    username: m.user.firstName,
                    firstName: m.user.firstName,
                    lastName: "",
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
            access: isAdmin ? "EDIT" : (currentMembership?.access || "VIEW"),
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
                ? adminMember.username
                : "Unknown",
        });
    } catch (error) {
        logError("Get members", error);
        return NextResponse.json(
            { error: "Failed to load members." },
            { status: 500 }
        );
    }
}

// POST /api/rooms/[roomId]/members — Admin invite by email.
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

        const { firstName: derivedFirstName } = deriveNameFromEmail(normalizedEmail);

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
                    lastName: "",
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            });

        let alreadyApproved = false;
        let alreadyPending = false;

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
            } else if (existingMember.status === "PENDING") {
                alreadyPending = true;
            }
        }

        const inviterName = room.admin.firstName
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
            logError("Invite email send", mailError);
            return NextResponse.json(
                {
                    error: "Invite saved, but failed to send email. Please verify SMTP settings and try again.",
                    invite: {
                        id: invite.id,
                        email: invite.email,
                        createdAt: invite.createdAt,
                    },
                    requestRequired: !alreadyApproved,
                    alreadyApproved,
                    alreadyPending,
                    emailSent: false,
                },
                { status: 502 }
            );
        }

        const message = alreadyApproved
            ? "This teammate already has room access. Invite email sent."
            : alreadyPending
                ? "This teammate already has a pending join request. Invite email sent."
                : "Invite email sent. The teammate must request to join before access is granted.";

        return NextResponse.json({
            message,
            invite: {
                id: invite.id,
                email: invite.email,
                createdAt: invite.createdAt,
            },
            requestRequired: !alreadyApproved,
            alreadyApproved,
            alreadyPending,
            emailSent: true,
        });
    } catch (error) {
        logError("Invite member", error);
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
        emitRoomMembersRefresh(roomId);
        emitApprovalRefresh(roomId);

        // Clear the room session cookie
        const response = NextResponse.json({ message: "You have exited the room." });

        const { clearRoomSessionCookie } = await import("@/lib/session");
        clearRoomSessionCookie(response);

        return response;
    } catch (error) {
        logError("Exit room", error);
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
        const { memberId, memberUserId, action, access } = await request.json();

        // Verify admin
        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room || room.adminId !== session.userId) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
        }

        if (!["APPROVED", "REJECTED", "REMOVED", "ACCESS"].includes(action)) {
            return NextResponse.json({ error: "Invalid action." }, { status: 400 });
        }

        if (action === "ACCESS") {
            if (!memberUserId || !MEMBER_ACCESS_VALUES.has(access)) {
                return NextResponse.json(
                    { error: "memberUserId and a valid access value are required." },
                    { status: 400 }
                );
            }

            if (memberUserId === room.adminId) {
                return NextResponse.json(
                    { error: "Room admin access cannot be changed." },
                    { status: 400 }
                );
            }

            const member = await prisma.roomMember.updateMany({
                where: {
                    roomId,
                    userId: memberUserId,
                    status: "APPROVED",
                },
                data: { access },
            });

            if (member.count === 0) {
                return NextResponse.json(
                    { error: "Approved member not found." },
                    { status: 404 }
                );
            }

            emitRoomMembersRefresh(roomId);
            return NextResponse.json({
                message: access === "VIEW" ? "Member set to view only." : "Member can edit.",
                access,
            });
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

            emitRoomMembersRefresh(roomId);
            emitApprovalRefresh(roomId);
            return NextResponse.json({
                message:
                    revokedInvites.count > 0
                        ? "Member removed and invite revoked."
                        : "Member removed.",
                inviteRevoked: revokedInvites.count > 0,
                member: {
                    id: existingMember.user.id,
                    username: existingMember.user.firstName,
                    firstName: existingMember.user.firstName,
                    lastName: "",
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
            data: action === "APPROVED"
                ? { status: action, access: "VIEW" }
                : { status: action },
            include: { user: true },
        });

        emitRoomMembersRefresh(roomId);
        emitApprovalRefresh(roomId);
        return NextResponse.json({
            message: `Member ${action.toLowerCase()}.`,
            member: {
                id: member.user.id,
                username: member.user.firstName,
                firstName: member.user.firstName,
                lastName: "",
                email: member.user.email,
            },
        });
    } catch (error) {
        logError("Update member", error);
        return NextResponse.json(
            { error: "Failed to update member status." },
            { status: 500 }
        );
    }
}
