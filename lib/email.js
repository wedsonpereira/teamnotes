import nodemailer from "nodemailer";

const smtpTlsRejectUnauthorized =
    String(process.env.SMTP_TLS_REJECT_UNAUTHORIZED || "true").toLowerCase() !== "false";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: smtpTlsRejectUnauthorized,
        ...(process.env.SMTP_HOST ? { servername: process.env.SMTP_HOST } : {}),
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
});

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export async function sendResetKeyEmail({ to, roomCode, resetLink }) {
    const safeRoomCode = escapeHtml(roomCode || "");
    const safeResetLink = escapeHtml(resetLink || "");

    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject: `Reset Room Key for ${safeRoomCode}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333;">Room Key Reset Request</h2>
                <p>You requested to reset the Room Key for room <strong>${safeRoomCode}</strong>.</p>
                <p>Click the button below to reset your Room Key. This link is valid for 15 minutes.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${safeResetLink}"
                       style="background-color: #4F46E5; color: white; padding: 12px 24px;
                              text-decoration: none; border-radius: 6px; font-weight: bold;">
                        Reset Room Key
                    </a>
                </div>
                <p style="color: #666; font-size: 14px;">
                    If you didn't request this, you can safely ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="color: #999; font-size: 12px;">TeamNote — Collaborative Notes</p>
            </div>
        `,
    });
}

export async function sendRoomInviteEmail({
    to,
    invitedName,
    roomName,
    roomCode,
    inviterName,
    inviteLink,
}) {
    const safeInvitedName = escapeHtml(invitedName || "there");
    const safeRoomName = escapeHtml(roomName || "TeamNote Room");
    const safeRoomCode = escapeHtml(roomCode || "");
    const safeInviterName = escapeHtml(inviterName || "A teammate");
    const safeInviteLink = escapeHtml(inviteLink || process.env.APP_URL || "http://localhost:3001");

    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject: `${safeInviterName} invited you to ${safeRoomName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 20px; color: #1f2937;">
                <h2 style="margin: 0 0 14px;">You are invited to TeamNote</h2>
                <p style="margin: 0 0 10px;">Hi ${safeInvitedName},</p>
                <p style="margin: 0 0 12px;">
                    <strong>${safeInviterName}</strong> invited you to join <strong>${safeRoomName}</strong>.
                </p>
                <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; margin: 16px 0;">
                    <p style="margin: 0 0 8px; font-size: 13px; color: #4b5563;">Room ID</p>
                    <p style="margin: 0; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 15px; font-weight: 700;">
                        ${safeRoomCode}
                    </p>
                </div>
                <p style="margin: 0 0 14px;">
                    You have already been approved for this room. Click below to enter directly.
                </p>
                <p style="margin: 0 0 12px; font-size: 13px; color: #4b5563;">
                    This link signs you in and opens the room directly.
                </p>
                <div style="margin: 18px 0 14px;">
                    <a href="${safeInviteLink}"
                       style="display: inline-block; background: #2563eb; color: #fff; text-decoration: none; font-weight: 700; padding: 11px 16px; border-radius: 8px;">
                        Open Room
                    </a>
                </div>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0 12px;" />
                <p style="margin: 0; color: #9ca3af; font-size: 12px;">TeamNote — Collaborative Notes</p>
            </div>
        `,
    });
}

export async function sendForgotRoomIdEmail({ to, rooms }) {
    const roomRows = rooms
        .map(
            (r) =>
                `<tr>
                    <td style="padding: 8px 12px; border: 1px solid #eee;">${escapeHtml(r.roomName || "Unnamed Room")}</td>
                    <td style="padding: 8px 12px; border: 1px solid #eee; font-family: monospace; font-weight: bold;">${escapeHtml(r.roomCode || "")}</td>
                    <td style="padding: 8px 12px; border: 1px solid #eee;">${escapeHtml(r.role || "")}</td>
                </tr>`
        )
        .join("");

    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject: "Your Room IDs — TeamNote",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333;">Your Room IDs</h2>
                <p>Here are the rooms associated with your account:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <thead>
                        <tr style="background-color: #f5f5f5;">
                            <th style="padding: 8px 12px; border: 1px solid #eee; text-align: left;">Room Name</th>
                            <th style="padding: 8px 12px; border: 1px solid #eee; text-align: left;">Room ID</th>
                            <th style="padding: 8px 12px; border: 1px solid #eee; text-align: left;">Role</th>
                        </tr>
                    </thead>
                    <tbody>${roomRows}</tbody>
                </table>
                <p style="color: #666; font-size: 14px;">
                    If you didn't request this, you can safely ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="color: #999; font-size: 12px;">TeamNote — Collaborative Notes</p>
            </div>
        `,
    });
}
