"use client";
import React, { useState, useEffect } from "react";
import "./guide.css";

const NAV = [
    { id: "getting-started", title: "Getting Started", icon: "fa-rocket", subs: [
        { id: "create-room", title: "Creating a Room" },
        { id: "join-room", title: "Joining a Room" },
        { id: "reenter-room", title: "Rejoining a Room" },
        { id: "email-invite", title: "Accepting an Email Invite" },
    ]},
    { id: "recovery", title: "Account Recovery", icon: "fa-key", subs: [
        { id: "forgot-key", title: "Forgot Room Key" },
        { id: "forgot-id", title: "Forgot Room ID" },
    ]},
    { id: "workspace", title: "Editor Workspace", icon: "fa-desktop", subs: [
        { id: "side-panel", title: "Opening the Side Panel" },
        { id: "theme", title: "Changing the Theme" },
        { id: "notepad-bg", title: "Notepad Background" },
        { id: "font-color", title: "Font Color" },
        { id: "accent-colors", title: "Accent Colors" },
        { id: "ui-font", title: "Interface Font" },
        { id: "line-numbers", title: "Line Numbers" },
        { id: "floating-window", title: "Floating Window" },
    ]},
    { id: "pages", title: "Pages Management", icon: "fa-file-lines", subs: [
        { id: "create-page", title: "Creating a Page" },
        { id: "rename-page", title: "Renaming a Page" },
        { id: "delete-page", title: "Deleting a Page" },
        { id: "reorder-pages", title: "Reordering Pages" },
        { id: "pin-pages", title: "Pinning Pages" },
    ]},
    { id: "media", title: "Inserting Media", icon: "fa-image", subs: [
        { id: "insert-images", title: "Inserting Images" },
        { id: "attach-files", title: "Attaching Files" },
        { id: "insert-tables", title: "Inserting Tables" },
        { id: "insert-emojis", title: "Inserting Emojis" },
    ]},
    { id: "export", title: "Exporting Your Work", icon: "fa-file-export", subs: [
        { id: "export-pdf", title: "Export as PDF" },
        { id: "export-docx", title: "Export as DOCX" },
        { id: "export-md", title: "Export as Markdown" },
    ]},
    { id: "team", title: "Team & Room Management", icon: "fa-users-gear", subs: [
        { id: "invite-credentials", title: "Invite (Credentials)" },
        { id: "invite-email", title: "Invite (Email)" },
        { id: "approve-reject", title: "Approve / Reject Requests" },
        { id: "permissions", title: "Change Permissions" },
        { id: "remove-member", title: "Removing a Member" },
        { id: "member-visibility", title: "Member Visibility" },
        { id: "exit-room", title: "Exiting a Room" },
        { id: "delete-room", title: "Deleting a Room" },
        { id: "logout", title: "Logging Out" },
    ]},
];

function Callout({ type, title, icon, children }) {
    return (
        <div className={`guide-callout ${type}`}>
            <div className="guide-callout-title"><i className={`fa-solid ${icon}`} /> {title}</div>
            {children}
        </div>
    );
}

function Steps({ items }) {
    return (
        <ol className="guide-steps">
            {items.map((item, i) => (
                <li className="guide-step" key={i}>
                    <span className="guide-step-num">{i + 1}</span>
                    <span className="guide-step-text" dangerouslySetInnerHTML={{ __html: item }} />
                </li>
            ))}
        </ol>
    );
}

function FieldTable({ fields }) {
    return (
        <div className="guide-table-wrap">
            <table className="guide-table">
                <thead><tr><th>Field</th><th>Required</th><th>Description</th></tr></thead>
                <tbody>{fields.map((f, i) => (
                    <tr key={i}><td><strong>{f[0]}</strong></td><td>{f[1]}</td><td>{f[2]}</td></tr>
                ))}</tbody>
            </table>
        </div>
    );
}

export default function GuidePage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeId, setActiveId] = useState("");

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
            if (visible.length > 0) setActiveId(visible[0].target.id);
        }, { rootMargin: "-20% 0px -60% 0px" });

        document.querySelectorAll(".guide-section, .guide-subsection").forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setSidebarOpen(false);
    };

    return (
        <div className="guide-page">
            <div className={`guide-mobile-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />
            <nav className={`guide-sidebar ${sidebarOpen ? "open" : ""}`}>
                <a href="/" className="guide-sidebar-brand"><i className="fa-solid fa-layer-group" /> TeamNotes</a>
                <div className="guide-sidebar-label">User Guide</div>
                <ul className="guide-nav">
                    {NAV.map(sec => (
                        <React.Fragment key={sec.id}>
                            <li className="guide-nav-section"><i className={`fa-solid ${sec.icon}`} style={{ marginRight: 6 }} />{sec.title}</li>
                            {sec.subs.map(sub => (
                                <li key={sub.id}>
                                    <button className={`guide-nav-link sub ${activeId === sub.id ? "active" : ""}`} onClick={() => scrollTo(sub.id)}>{sub.title}</button>
                                </li>
                            ))}
                        </React.Fragment>
                    ))}
                </ul>
            </nav>

            <main className="guide-main">
                <a href="/" className="guide-back"><i className="fa-solid fa-arrow-left" /> Back to TeamNotes</a>

                <div className="guide-hero">
                    <h1>User Guide</h1>
                    <div className="guide-hero-meta">
                        <span><i className="fa-solid fa-tag" /> Version 1.0</span>
                        <span><i className="fa-regular fa-calendar" /> May 2026</span>
                        <span><i className="fa-solid fa-globe" /> Web (Desktop & Mobile)</span>
                    </div>
                </div>

                {/* ===== 1. GETTING STARTED ===== */}
                <div className="guide-section" id="getting-started">
                    <h2>Getting Started</h2>

                    <div className="guide-subsection" id="create-room">
                        <h3><i className="fa-solid fa-plus" /> Creating a Room</h3>
                        <p className="guide-text">Creating a room makes you the <strong>Room Admin</strong> — you control who joins, member permissions, and can delete the room.</p>
                        <Steps items={[
                            'On the landing page, click the <strong>"Create Room"</strong> button.',
                            'Fill in your <strong>Username</strong>, <strong>Email</strong>, optional <strong>Room ID</strong>, and set a <strong>Room Key</strong> (encryption password).',
                            'Confirm your Room Key and click <strong>"Create Room"</strong>.',
                            'A confirmation modal shows your <strong>Room ID</strong> and <strong>Room Key</strong>. Save them immediately.',
                            'You are automatically redirected into the editor workspace.',
                        ]} />
                        <FieldTable fields={[
                            ["Username", "Yes", "Your display name (max 48 characters)."],
                            ["Email", "Yes", "Used for admin recovery flows."],
                            ["Room ID", "No", "Custom identifier. Auto-generated if blank."],
                            ["Room Key", "Yes", "Encryption password for the room."],
                            ["Confirm Key", "Yes", "Must match Room Key exactly."],
                        ]} />
                        <Callout type="warning" title="Important" icon="fa-triangle-exclamation">Save your Room Key immediately. If lost, encrypted content cannot be recovered without the admin reset flow.</Callout>
                    </div>

                    <div className="guide-subsection" id="join-room">
                        <h3><i className="fa-solid fa-right-to-bracket" /> Joining a Room</h3>
                        <p className="guide-text">Use this when a teammate has shared their Room ID and Room Key with you.</p>
                        <Steps items={[
                            'Click <strong>"Join Room"</strong> on the landing page.',
                            'Enter your <strong>Username</strong>, <strong>Email</strong>, <strong>Room ID</strong>, and <strong>Room Key</strong>.',
                            'Click <strong>"Join Room"</strong>.',
                        ]} />
                        <Callout type="info" title="Approval Flow" icon="fa-circle-info">If your email was pre-approved via invite, you get instant access. Otherwise, your request enters a pending queue. The app auto-checks for approval every 5 seconds.</Callout>
                    </div>

                    <div className="guide-subsection" id="reenter-room">
                        <h3><i className="fa-solid fa-rotate-left" /> Rejoining a Room</h3>
                        <p className="guide-text">If you have a valid session, you&apos;re <strong>automatically redirected</strong> to your room on visit — no login needed. Sessions persist for up to 180 hours.</p>
                        <p className="guide-text">If your session expired, click <strong>&quot;Rejoin Room&quot;</strong> (located in the top navigation bar), provide your credentials, and click <strong>&quot;Enter&quot;</strong>.</p>
                    </div>

                    <div className="guide-subsection" id="email-invite">
                        <h3><i className="fa-solid fa-envelope-open-text" /> Accepting an Email Invite</h3>
                        <Steps items={[
                            'Open the invitation email from the room admin.',
                            'Click the <strong>one-click join link</strong>.',
                            'Enter your <strong>Username</strong> and <strong>Room Key</strong> (shared separately by admin).',
                            'Click <strong>"Accept Invite"</strong> — instant access, no pending approval.',
                        ]} />
                    </div>
                </div>

                {/* ===== 2. RECOVERY ===== */}
                <div className="guide-section" id="recovery">
                    <h2>Account Recovery</h2>

                    <div className="guide-subsection" id="forgot-key">
                        <h3><i className="fa-solid fa-key" /> Forgot Room Key</h3>
                        <Callout type="danger" title="Caution" icon="fa-exclamation-circle">Only the Room Admin can reset the key. Resetting changes the encryption key — previously encrypted content must be re-encrypted.</Callout>
                        <Steps items={[
                            'Click <strong>"Forgot Key?"</strong> in the join/re-enter modal.',
                            'Enter the <strong>Room ID</strong> and your <strong>admin email</strong>.',
                            'Click <strong>"Send Reset Link"</strong> and check your inbox.',
                            'Follow the link to set a new Room Key.',
                        ]} />
                    </div>

                    <div className="guide-subsection" id="forgot-id">
                        <h3><i className="fa-solid fa-hashtag" /> Forgot Room ID</h3>
                        <Steps items={[
                            'Click <strong>"Forgot Room ID?"</strong> in the join modal.',
                            'Enter the <strong>email</strong> you used when joining.',
                            'Click <strong>"Send Recovery Email"</strong>.',
                            'Check your inbox for a list of all Room IDs associated with that email.',
                        ]} />
                    </div>
                </div>

                {/* ===== 3. WORKSPACE ===== */}
                <div className="guide-section" id="workspace">
                    <h2>The Editor Workspace</h2>

                    <div className="guide-subsection" id="side-panel">
                        <h3><i className="fa-solid fa-bars" /> Opening the Side Panel</h3>
                        <p className="guide-text">Click the <strong>hamburger menu icon</strong> (☰) in the toolbar. The panel slides in from the right showing room info, member management, invite tools, and admin controls. Click again or the backdrop to close.</p>
                    </div>

                    <div className="guide-subsection" id="theme">
                        <h3><i className="fa-solid fa-circle-half-stroke" /> Changing the Theme</h3>
                        <p className="guide-text">Click the <strong>moon icon</strong> (🌙) or <strong>sun icon</strong> (☀️) in the toolbar to toggle between light and dark themes. Applies instantly to the entire interface.</p>
                    </div>

                    <div className="guide-subsection" id="notepad-bg">
                        <h3><i className="fa-solid fa-palette" /> Notepad Background Color</h3>
                        <Steps items={[
                            'Click the <strong>gear icon</strong> (⚙️) → <strong>"Advanced Options"</strong>.',
                            'Find <strong>"Notepad Background"</strong>.',
                            'Choose from presets: White, Warm Cream, Mint, Sky, Lavender, Peach, Rose, Slate, Navy, Forest, Charcoal, Midnight, Black.',
                            'Click a swatch — the background changes instantly.',
                        ]} />
                    </div>

                    <div className="guide-subsection" id="font-color">
                        <h3><i className="fa-solid fa-font" /> Font Color</h3>
                        <p className="guide-text">Open <strong>Advanced Options</strong> → <strong>"Font Color"</strong> and choose from presets. For per-selection coloring, use the <strong>Text Color</strong> button directly in the toolbar.</p>
                    </div>

                    <div className="guide-subsection" id="accent-colors">
                        <h3><i className="fa-solid fa-droplet" /> Accent Colors</h3>
                        <p className="guide-text">In <strong>Advanced Options</strong>, use the <strong>Primary Accent</strong> and <strong>Secondary Accent</strong> color pickers to personalize the interface buttons, active states, and highlights.</p>
                    </div>

                    <div className="guide-subsection" id="ui-font">
                        <h3><i className="fa-solid fa-text-height" /> Interface Font</h3>
                        <p className="guide-text">In <strong>Advanced Options</strong> → <strong>"Interface Font"</strong>, choose from: JetBrains Mono (default), Montserrat, Playfair, Georgia, Verdana, Trebuchet, Tahoma, or Times New Roman. This changes the UI font, not the editor text font.</p>
                    </div>

                    <div className="guide-subsection" id="line-numbers">
                        <h3><i className="fa-solid fa-list-ol" /> Line Numbers</h3>
                        <p className="guide-text">In <strong>Advanced Options</strong>, toggle <strong>"Line Numbers"</strong> on/off to show or hide line numbers along the editor&apos;s left edge.</p>
                    </div>

                    <div className="guide-subsection" id="floating-window">
                        <h3><i className="fa-solid fa-up-right-from-square" /> Floating Window</h3>
                        <p className="guide-text">Click the <strong>Float Note Window</strong> button in the toolbar to open a Picture-in-Picture style mini window. Choose placement: Middle, Left Bottom, or Right Bottom. The window stays on top of all other apps.</p>
                    </div>
                </div>

                {/* ===== 4. PAGES ===== */}
                <div className="guide-section" id="pages">
                    <h2>Pages Management</h2>

                    <div className="guide-subsection" id="create-page">
                        <h3><i className="fa-solid fa-file-circle-plus" /> Creating a New Page</h3>
                        <p className="guide-text">Click the <strong>"+" button</strong> at the end of the Page Tabs bar. A new page is created and you&apos;re switched to it automatically. Requires Edit access.</p>
                    </div>
                    <div className="guide-subsection" id="rename-page">
                        <h3><i className="fa-solid fa-pen" /> Renaming a Page</h3>
                        <p className="guide-text"><strong>Right-click</strong> the tab → <strong>"Rename"</strong>. Type the new name and press <strong>Enter</strong>. Press Escape to cancel.</p>
                    </div>
                    <div className="guide-subsection" id="delete-page">
                        <h3><i className="fa-solid fa-trash" /> Deleting a Page</h3>
                        <p className="guide-text"><strong>Right-click</strong> the tab → <strong>"Delete"</strong>. Confirm in the dialog. You cannot delete the last remaining page.</p>
                        <Callout type="danger" title="Warning" icon="fa-exclamation-circle">Deleting a page is permanent — all content on that page is lost.</Callout>
                    </div>
                    <div className="guide-subsection" id="reorder-pages">
                        <h3><i className="fa-solid fa-arrows-left-right" /> Reordering Pages</h3>
                        <p className="guide-text"><strong>Drag and drop</strong> page tabs to reorder. Alternatively, right-click → <strong>"Move Left"</strong> / <strong>"Move Right"</strong>.</p>
                    </div>
                    <div className="guide-subsection" id="pin-pages">
                        <h3><i className="fa-solid fa-thumbtack" /> Pinning Pages</h3>
                        <p className="guide-text">Right-click → <strong>"Pin"</strong>. Pinned pages always appear first. Pinning is local — only affects your view.</p>
                    </div>
                </div>

                {/* ===== 5. MEDIA ===== */}
                <div className="guide-section" id="media">
                    <h2>Inserting Media</h2>
                    <div className="guide-subsection" id="insert-images">
                        <h3><i className="fa-solid fa-image" /> Inserting Images</h3>
                        <Steps items={[
                            'Place your cursor where you want the image.',
                            'Click the <strong>Image button</strong> (🖼️) in the toolbar.',
                            'Select image file(s) from your system.',
                            'Images embed directly — resize by dragging handles, reposition by dragging.',
                        ]} />
                        <Callout type="info" title="Note" icon="fa-circle-info">Images are Base64-encoded and encrypted with the document. No external URLs.</Callout>
                    </div>
                    <div className="guide-subsection" id="attach-files">
                        <h3><i className="fa-solid fa-paperclip" /> Attaching Files</h3>
                        <p className="guide-text">Click the <strong>Paperclip button</strong> (📎). Images appear visually; other files appear as attachment badges with filename and size.</p>
                    </div>
                    <div className="guide-subsection" id="insert-tables">
                        <h3><i className="fa-solid fa-table" /> Inserting Tables</h3>
                        <p className="guide-text">Click the <strong>Table button</strong> → hover the grid picker to select rows/columns → click to insert. Navigate cells with <strong>Tab</strong> / <strong>Shift+Tab</strong>. Resize columns and the whole table by dragging.</p>
                    </div>
                    <div className="guide-subsection" id="insert-emojis">
                        <h3><i className="fa-solid fa-face-smile" /> Inserting Emojis</h3>
                        <p className="guide-text">Click the <strong>Emoji button</strong> (😀) in the toolbar and select from the picker.</p>
                    </div>
                </div>

                {/* ===== 6. EXPORT ===== */}
                <div className="guide-section" id="export">
                    <h2>Exporting Your Work</h2>
                    <p className="guide-text">All exports happen <strong>locally in your browser</strong>. Content is decrypted on-device and converted — the server never sees plaintext.</p>
                    <div className="guide-subsection" id="export-pdf">
                        <h3><i className="fa-regular fa-file-pdf" /> Export as PDF</h3>
                        <p className="guide-text">Right-click page tab → <strong>Export</strong> → <strong>"Export as PDF"</strong>. Downloaded as <code>{"{page-title}.pdf"}</code>.</p>
                    </div>
                    <div className="guide-subsection" id="export-docx">
                        <h3><i className="fa-regular fa-file-word" /> Export as DOCX</h3>
                        <p className="guide-text">Right-click page tab → <strong>Export</strong> → <strong>"Export as DOCX"</strong>. Uses a lightweight built-in DOCX generator.</p>
                    </div>
                    <div className="guide-subsection" id="export-md">
                        <h3><i className="fa-brands fa-markdown" /> Export as Markdown</h3>
                        <p className="guide-text">Right-click page tab → <strong>Export</strong> → <strong>"Export as Markdown"</strong>. Downloaded as <code>.md</code>.</p>
                    </div>
                </div>

                {/* ===== 7. TEAM MANAGEMENT ===== */}
                <div className="guide-section" id="team">
                    <h2>Team & Room Management</h2>

                    <div className="guide-subsection" id="invite-credentials">
                        <h3><i className="fa-solid fa-share-nodes" /> Invite via Credentials</h3>
                        <p className="guide-text">Open Side Panel → <strong>"Share Credentials"</strong>. Copy your Room ID and share it along with the Room Key via a secure channel.</p>
                        <Callout type="warning" title="Security" icon="fa-shield-halved">The Room Key is the encryption password. Only share it through secure, private channels.</Callout>
                    </div>

                    <div className="guide-subsection" id="invite-email">
                        <h3><i className="fa-solid fa-envelope" /> Invite via Email</h3>
                        <Steps items={[
                            'Open Side Panel → <strong>"Grant Access by Email"</strong>.',
                            'Enter the teammate\'s email and click <strong>"Invite"</strong>.',
                            'Their email is auto-approved + an invitation email with a join link is sent.',
                        ]} />
                    </div>

                    <div className="guide-subsection" id="approve-reject">
                        <h3><i className="fa-solid fa-user-check" /> Approve / Reject Requests</h3>
                        <p className="guide-text">Side Panel → <strong>"Pending Requests"</strong>. Click <strong>✓</strong> to approve or <strong>✗</strong> to reject. Changes sync in real-time via WebSocket.</p>
                    </div>

                    <div className="guide-subsection" id="permissions">
                        <h3><i className="fa-solid fa-sliders" /> Changing Permissions</h3>
                        <div className="guide-table-wrap">
                            <table className="guide-table">
                                <thead><tr><th>Permission</th><th>What They Can Do</th></tr></thead>
                                <tbody>
                                    <tr><td><strong>Edit</strong></td><td>Full read/write. Can create pages, type, insert images. Can only edit own content.</td></tr>
                                    <tr><td><strong>View</strong></td><td>Read-only. Can see all content but cannot make changes.</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="guide-text">In the Members list, use the <strong>dropdown</strong> next to each member to switch between Edit and View. Changes apply in real-time.</p>
                    </div>

                    <div className="guide-subsection" id="remove-member">
                        <h3><i className="fa-solid fa-user-minus" /> Removing a Member</h3>
                        <p className="guide-text">Members list → click the <strong>red remove button</strong> → confirm. The member is immediately disconnected and must re-apply to rejoin.</p>
                    </div>

                    <div className="guide-subsection" id="member-visibility">
                        <h3><i className="fa-solid fa-eye" /> Member Visibility</h3>
                        <p className="guide-text">Admin Controls → toggle <strong>"Show members to others"</strong> on/off to control whether non-admin users can see the member list.</p>
                    </div>

                    <div className="guide-subsection" id="exit-room">
                        <h3><i className="fa-solid fa-right-from-bracket" /> Exiting a Room</h3>
                        <p className="guide-text">Non-admins: Side Panel → <strong>"Exit Room"</strong> → confirm. This removes your membership entirely — you&apos;ll need admin re-approval to rejoin.</p>
                    </div>

                    <div className="guide-subsection" id="delete-room">
                        <h3><i className="fa-solid fa-trash-can" /> Deleting a Room</h3>
                        <p className="guide-text">Admin only. You must <strong>remove all other members</strong> first. Then Side Panel → <strong>"Delete Room"</strong> → confirm.</p>
                        <Callout type="danger" title="Irreversible" icon="fa-exclamation-circle">All documents, pages, members, and metadata are permanently deleted. There is no recovery.</Callout>
                    </div>

                    <div className="guide-subsection" id="logout">
                        <h3><i className="fa-solid fa-arrow-right-from-bracket" /> Logging Out</h3>
                        <p className="guide-text">Side Panel → <strong>"Logout"</strong>. Clears your session but keeps your membership active. Use <strong>"Rejoin Room"</strong> to get back in.</p>
                        <Callout type="tip" title="Logout vs Exit" icon="fa-lightbulb"><strong>Logout</strong> keeps your membership — re-enter with just the Room Key. <strong>Exit</strong> removes membership entirely, requiring admin re-approval.</Callout>
                    </div>
                </div>
            </main>

            <button className="guide-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <i className={`fa-solid ${sidebarOpen ? "fa-xmark" : "fa-bars"}`} />
            </button>
        </div>
    );
}
