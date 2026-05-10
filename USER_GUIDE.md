# TeamNotes — User Guide

> **Version**: 1.0  
> **Last Updated**: May 2026  
> **Platform**: Web (Desktop & Mobile)

---

## Table of Contents

1. [Getting Started](#1-getting-started)
   - [Creating a Room](#11-creating-a-room)
   - [Joining a Room](#12-joining-a-room)
   - [Rejoining a Room](#13-rejoining-a-room)
   - [Accepting an Email Invite](#14-accepting-an-email-invite)
2. [Account Recovery](#2-account-recovery)
   - [Forgot Room Key](#21-forgot-room-key)
   - [Forgot Room ID](#22-forgot-room-id)
3. [The Editor Workspace](#3-the-editor-workspace)
   - [Opening the Side Panel](#31-opening-the-side-panel)
   - [Changing the Theme (Light / Dark)](#32-changing-the-theme-light--dark)
   - [Changing the Notepad Background Color](#33-changing-the-notepad-background-color)
   - [Changing the Font Color](#34-changing-the-font-color)
   - [Customizing Accent Colors](#35-customizing-accent-colors)
   - [Changing the Interface Font](#36-changing-the-interface-font)
   - [Toggling Line Numbers](#37-toggling-line-numbers)
   - [Opening the Floating Window](#38-opening-the-floating-window)
4. [Pages Management](#4-pages-management)
   - [Creating a New Page](#41-creating-a-new-page)
   - [Renaming a Page](#42-renaming-a-page)
   - [Deleting a Page](#43-deleting-a-page)
   - [Reordering Pages](#44-reordering-pages)
   - [Pinning Pages](#45-pinning-pages)
5. [Inserting Media](#5-inserting-media)
   - [Inserting Images](#51-inserting-images)
   - [Attaching Files](#52-attaching-files)
   - [Inserting Tables](#53-inserting-tables)
   - [Inserting Emojis](#54-inserting-emojis)
6. [Exporting Your Work](#6-exporting-your-work)
   - [Export as PDF](#61-export-as-pdf)
   - [Export as DOCX](#62-export-as-docx)
   - [Export as Markdown](#63-export-as-markdown)
7. [Team & Room Management](#7-team--room-management)
   - [Inviting Teammates (Share Credentials)](#71-inviting-teammates-share-credentials)
   - [Inviting Teammates (Email Invite)](#72-inviting-teammates-email-invite)
   - [Approving or Rejecting Join Requests](#73-approving-or-rejecting-join-requests)
   - [Changing Member Permissions](#74-changing-member-permissions)
   - [Removing a Member](#75-removing-a-member)
   - [Toggling Member Visibility](#76-toggling-member-visibility)
   - [Exiting a Room (Non-Admin)](#77-exiting-a-room-non-admin)
   - [Deleting a Room (Admin)](#78-deleting-a-room-admin)
   - [Logging Out](#79-logging-out)

---

## 1. Getting Started

### 1.1 Creating a Room

Creating a room makes you the **Room Admin** — you control who joins, member permissions, and can delete the room.

**Steps:**

1. On the landing page, click the **"Create Room"** button.
2. Fill in the following fields:

| Field | Required | Description |
|---|---|---|
| **Username** | Yes | Your display name inside the room (max 48 characters). |
| **Email** | Yes | Your email address. Used for admin recovery flows. |
| **Room ID** | No | A custom room identifier. If left blank, the system auto-generates one. |
| **Room Key** | Yes | The encryption password for the room. All content is encrypted using this key. |
| **Confirm Room Key** | Yes | Must match the Room Key field exactly. |

3. Click **"Create Room"**.
4. On success, a confirmation modal appears showing your **Room ID** and **Room Key**. 

> [!IMPORTANT]
> **Save your Room Key immediately.** This key is used to encrypt and decrypt all content. If you lose it, previously encrypted content cannot be recovered without the admin reset flow.

5. You are automatically redirected into the editor workspace.

---

### 1.2 Joining a Room

Use this when a teammate has shared their Room ID and Room Key with you and you're joining for the first time.

**Steps:**

1. On the landing page, click **"Join Room"**.
2. Fill in the following fields:

| Field | Required | Description |
|---|---|---|
| **Username** | Yes | Your display name inside the room. |
| **Email** | Yes | Your email address. |
| **Room ID** | Yes | The room identifier shared by the admin. |
| **Room Key** | Yes | The encryption password shared by the admin. |

3. Click **"Join Room"**.

**What happens next depends on the room's configuration:**

- **If the admin has pre-approved your email** (via the invite system): You are granted access immediately and redirected to the editor.
- **If your email is not pre-approved**: Your join request is placed in a **"Pending Approval"** queue. The admin will see your request in the side panel and must approve it before you can access the room.

> [!NOTE]
> While your request is pending, you'll see a "Pending Approval" message. The app automatically polls the server every 5 seconds to check if you've been approved. Once approved, you're redirected into the editor automatically.

---

### 1.3 Rejoining a Room

If you've previously created or joined a room and your session is still valid, you don't need to go through the full join flow again.

**Automatic Re-entry:**
- When you visit TeamNotes, if a valid session exists in your browser, you are **automatically redirected** to your room — no login needed.

**Manual Re-entry (session expired):**
1. On the landing page, click **"Rejoin Room"** (located in the top navigation bar).
2. Enter your **Username**, **Email**, **Room ID**, and **Room Key**.
3. Click **"Enter"**.
4. If your credentials match, you're taken directly into the editor.

> [!TIP]
> Your session persists for a long time (up to 180 hours). You typically only need to re-enter if you manually logged out or cleared your browser data.

---

### 1.4 Accepting an Email Invite

If an admin sent you an email invite:

1. Open the invitation email.
2. Click the **one-click join link** in the email.
3. You'll be taken to the TeamNotes landing page with the invite token pre-filled.
4. Enter your **Username** and **Room Key** (the admin should have shared the key separately).
5. Click **"Accept Invite"**.
6. You are immediately granted access — no pending approval required.

---

## 2. Account Recovery

### 2.1 Forgot Room Key

If you've forgotten the Room Key (encryption password):

> [!WARNING]
> Only the **Room Admin** can reset the Room Key. Resetting the key changes the encryption key, meaning all previously encrypted content must be re-encrypted. This is a destructive action.

**Steps:**

1. On the landing page, click **"Join Room"** or **"Rejoin Room"**.
2. Click the **"Forgot Key?"** link below the Room Key field.
3. Enter the **Room ID** and your **admin email address**.
4. Click **"Send Reset Link"**.
5. Check your email inbox for the reset link.
6. Follow the link to set a new Room Key.

---

### 2.2 Forgot Room ID

If you've forgotten which Room ID you belong to:

**Steps:**

1. On the landing page, click **"Join Room"** or **"Rejoin Room"**.
2. Click the **"Forgot Room ID?"** link.
3. Enter the **email address** you used when joining.
4. Click **"Send Recovery Email"**.
5. Check your inbox — you'll receive an email listing all Room IDs associated with that email address.

---

## 3. The Editor Workspace

Once inside a room, you'll see the full editor interface: a **Toolbar** at the top, **Page Tabs** below the toolbar, the **Editor** canvas in the center, and an optional **Side Panel** on the right.

---

### 3.1 Opening the Side Panel

The side panel shows room information, member management, invite tools, and admin controls.

**Steps:**

1. Look for the **hamburger menu icon** (☰) or the **sidebar toggle button** in the toolbar area.
2. Click it to **open** the side panel. It slides in from the right.
3. Click the toggle again, or click the **overlay backdrop**, to close it.

**The side panel contains:**
- **Room Info** — Room name, admin name
- **Invite Teammates** — Share credentials or send email invites
- **Admin Controls** — Toggle member visibility (admin only)
- **Members List** — See all members, their roles, online status
- **Pending Requests** — Approve/reject new join requests (admin only)
- **Room Actions** — Exit room, delete room, logout

---

### 3.2 Changing the Theme (Light / Dark)

TeamNotes supports both light and dark themes across the entire interface.

**Steps:**

1. In the toolbar, locate the **moon icon** (🌙) for dark mode or **sun icon** (☀️) for light mode.
2. Click the icon to toggle between themes.
3. The change applies instantly to the entire interface — toolbar, editor, side panel, and page tabs.

---

### 3.3 Changing the Notepad Background Color

You can customize the editor's page background to suit your preference.

**Steps:**

1. In the toolbar, click the **"Advanced Options"** button (gear icon ⚙️).
2. In the advanced panel that appears, find **"Notepad Background"**.
3. Browse the available color presets:

| Category | Colors |
|---|---|
| **Light** | Default, White, Warm Cream, Mint, Sky, Lavender, Peach, Rose |
| **Dark** | Slate, Navy, Forest, Charcoal, Midnight, Black |

4. Click any color swatch to apply it immediately.
5. The editor background changes instantly — your text color may also auto-adjust for readability.

---

### 3.4 Changing the Font Color

**Steps:**

1. Open **"Advanced Options"** (gear icon ⚙️) in the toolbar.
2. Find the **"Font Color"** section.
3. Choose from presets: Black, White, Dark Gray, Red, Orange, Green, Blue, Purple, Teal, Brown, Pink, Indigo.
4. Click a color to set it as the default text color for the editor.

> [!TIP]
> You can also apply per-selection text colors using the **Text Color** button directly in the toolbar (paint bucket icon). This lets you color individual words or paragraphs differently.

---

### 3.5 Customizing Accent Colors

TeamNotes lets you personalize the interface accent colors (buttons, highlights, active states).

**Steps:**

1. Open **"Advanced Options"** (gear icon ⚙️).
2. Find **"Primary Accent"** — this controls the main interface color (buttons, active tabs, links).
3. Find **"Secondary Accent"** — this controls the secondary highlights.
4. Use the color picker to choose your preferred accent colors.
5. Changes apply immediately across the entire UI.

---

### 3.6 Changing the Interface Font

**Steps:**

1. Open **"Advanced Options"** (gear icon ⚙️).
2. Find **"Interface Font"**.
3. Choose from available fonts:
   - Default (JetBrains Mono)
   - Montserrat
   - Playfair Display
   - Georgia
   - Verdana
   - Trebuchet MS
   - Tahoma
   - Times New Roman
4. The selected font applies to the entire app interface (toolbar, side panel, tabs).

> [!NOTE]
> This changes the **UI font**, not the text font in the editor. To change the editor's text font, use the **Font Family** dropdown in the toolbar.

---

### 3.7 Toggling Line Numbers

**Steps:**

1. Open **"Advanced Options"** (gear icon ⚙️).
2. Find the **"Line Numbers"** toggle.
3. Switch it **on** to display line numbers along the left edge of the editor.
4. Switch it **off** to hide them.

---

### 3.8 Opening the Floating Window

The floating window feature lets you open your note in a browser-level Picture-in-Picture style mini window that **stays on top** of all other windows — perfect for referencing notes while working in another application.

**Steps:**

1. In the toolbar, find the **"Float Note Window"** button (window/pip icon).
2. Click it to open the current note in a floating mini-window.
3. The floating window stays visible even when you switch to other apps or browser tabs.
4. You can choose the **placement** of the floating window:
   - **Middle** — centered on screen
   - **Left Bottom** — docked to the bottom-left
   - **Right Bottom** — docked to the bottom-right
5. To **close** the floating window, click the **"Close Floating Note"** button in the toolbar, or close the floating panel directly.

---

## 4. Pages Management

TeamNotes supports **multi-page workspaces**. Each room can have multiple pages, similar to tabs in a browser or sheets in a spreadsheet.

---

### 4.1 Creating a New Page

**Steps:**

1. Look at the **Page Tabs bar** below the toolbar.
2. Click the **"+" button** at the end of the tab row.
3. A new page is created with a default title (e.g., "Page 2").
4. You're automatically switched to the new page.
5. All teammates in the room see the new page appear in real-time.

> [!NOTE]
> You need **Edit** access to create pages. View-only members cannot create pages.

---

### 4.2 Renaming a Page

**Steps:**

1. **Right-click** on a page tab to open the context menu.
2. Click **"Rename"**.
3. The tab title becomes an editable text input.
4. Type the new name and press **Enter** to confirm.
5. Press **Escape** to cancel.

**Alternative:** You can also double-click on a page tab to start renaming.

---

### 4.3 Deleting a Page

**Steps:**

1. **Right-click** on the page tab you want to delete.
2. Click **"Delete"** in the context menu.
3. A **confirmation dialog** appears: *"Are you sure you want to delete this page?"*
4. Click **"Delete"** to confirm, or **"Cancel"** to abort.

> [!CAUTION]
> Deleting a page is **permanent** — all content on that page is lost. You cannot delete the last remaining page in a room; there must always be at least one page.

---

### 4.4 Reordering Pages

**Steps:**

1. **Click and hold** on a page tab.
2. **Drag** the tab left or right to the desired position.
3. **Release** to drop it in its new position.
4. The new order is saved automatically and synced to all room members.

**Alternative (via context menu):**
- Right-click a tab → **"Move Left"** or **"Move Right"** to shift it one position.

---

### 4.5 Pinning Pages

Pinned pages always appear at the **beginning** of the tab row, regardless of order changes.

**Steps:**

1. **Right-click** on a page tab.
2. Click **"Pin"** to pin it, or **"Unpin"** to remove the pin.
3. Pinned pages show a pin indicator and move to the front of the tab row.

> [!NOTE]
> Pinning is a **local preference** — it only affects your view, not other teammates.

---

## 5. Inserting Media

### 5.1 Inserting Images

**Steps:**

1. Place your cursor in the editor where you want the image to appear.
2. In the toolbar, click the **"Insert Image"** button (image icon 🖼️).
3. Your system's file picker opens.
4. Select one or more image files (JPEG, PNG, GIF, WebP, SVG, BMP, ICO, TIFF, AVIF).
5. The images are embedded directly into the editor.

**Image Features Once Inserted:**
- **Resize** — Click the image to select it, then drag the resize handles on the corners/edges.
- **Drag & Reposition** — Click and drag an image to move it to a different location in the document.
- **Delete** — Select the image and press **Delete** or **Backspace**. You can only delete images you inserted (unless you're an admin).

> [!IMPORTANT]
> Images are converted to Base64 data URLs and encrypted along with the document content. There are no external image URLs — everything stays encrypted and self-contained.

---

### 5.2 Attaching Files

**Steps:**

1. In the toolbar, click the **"Attach File"** button (paperclip icon 📎).
2. Select a file from your system.
3. If the file is an image, it's inserted as a visible image in the editor.
4. If it's any other file type, it appears as a **file attachment badge** showing the filename and size.

---

### 5.3 Inserting Tables

**Steps:**

1. In the toolbar, click the **"Insert Table"** button (table grid icon).
2. A **table picker grid** appears (up to 8×8 preview).
3. Hover over the grid to select the number of rows and columns.
4. Click to insert the table at the cursor position.

**Table Features:**
- **Resize columns** — Hover over column borders and drag.
- **Resize the whole table** — Drag the right edge of the table.
- **Move the table** — Drag the table from its left edge to reposition it horizontally.
- **Navigate cells** — Press **Tab** to move to the next cell, **Shift+Tab** for the previous cell.
- **Delete table** — Click on the table to select it, then click the **"Delete Table"** button in the toolbar, or select the entire table and press **Delete**.

---

### 5.4 Inserting Emojis

**Steps:**

1. In the toolbar, click the **"Insert Emoji"** button (smiley face icon 😀).
2. An emoji picker panel appears with commonly-used emojis.
3. Click any emoji to insert it at the cursor position.

---

## 6. Exporting Your Work

All exports happen **locally in your browser**. The encrypted content is decrypted on-device, converted to the chosen format, and downloaded directly — the server never sees your plaintext content.

---

### 6.1 Export as PDF

**Steps:**

1. **Right-click** on the page tab you want to export.
2. Hover over **"Export"** in the context menu.
3. Click **"Export as PDF"**.
4. A PDF file is generated and downloaded to your device.
5. The filename follows the pattern: `{page-title}.pdf`.

---

### 6.2 Export as DOCX

**Steps:**

1. **Right-click** on the page tab.
2. Hover over **"Export"** → Click **"Export as DOCX"**.
3. A DOCX (Microsoft Word) file is generated and downloaded.

> [!NOTE]
> The DOCX export uses a lightweight .docx generator built into the app. Complex formatting (images, tables) may appear simplified in the Word document.

---

### 6.3 Export as Markdown

**Steps:**

1. **Right-click** on the page tab.
2. Hover over **"Export"** → Click **"Export as Markdown"**.
3. A `.md` file is generated and downloaded.

---

## 7. Team & Room Management

### 7.1 Inviting Teammates (Share Credentials)

The simplest way to invite teammates is by sharing the Room ID and Room Key directly.

**Steps:**

1. Open the **Side Panel**.
2. In the **"Invite Teammates"** section, find **"Share Credentials"**.
3. Your **Room ID** is displayed with a **copy button** next to it.
4. Click the copy button to copy the Room ID to your clipboard.
5. Share the **Room ID** and the **Room Key** (from when you created the room) with your teammate via any secure channel (DM, email, etc.).
6. The teammate can then use the **"Join Room"** flow on the landing page.

> [!WARNING]
> The Room Key is the encryption password. Share it only through a secure, private channel. Anyone with the Room ID and Room Key can access and decrypt the room's content.

---

### 7.2 Inviting Teammates (Email Invite)

Email invites **pre-approve** a teammate so they don't have to wait for manual approval.

**Steps (Admin Only):**

1. Open the **Side Panel**.
2. In the **"Invite Teammates"** section, find **"Grant Access by Email"**.
3. Enter the teammate's email address in the input field.
4. Click **"Invite"**.
5. If successful:
   - The teammate's email is added to the **auto-approved list**.
   - An invitation email is sent with a **one-click join link**.
6. When the teammate clicks the link and enters the Room Key, they're granted immediate access without needing admin approval.

**Auto-approved emails** are displayed as chips below the invite form so you can see who has been pre-approved.

---

### 7.3 Approving or Rejecting Join Requests

When a non-invited user tries to join your room, their request appears in the **"Pending Requests"** section.

**Steps (Admin Only):**

1. Open the **Side Panel**.
2. Scroll to **"Pending Requests"**. It shows a count badge (e.g., "Pending Requests (3)").
3. For each pending request, you see the member's name and avatar.
4. Click the **green checkmark** (✓) to **approve** the member.
5. Click the **red X** (✗) to **reject** the member.
6. Approved members get immediate access. Rejected members are denied.

> [!NOTE]
> All member status changes are pushed to connected users in real-time via WebSocket — there's no need to refresh the page.

---

### 7.4 Changing Member Permissions

Each non-admin member can have one of two permission levels:

| Permission | What They Can Do |
|---|---|
| **Edit** | Full read/write access. Can create pages, type, insert images, etc. Can only edit/delete their own content. |
| **View** | Read-only access. Can see all pages and content but cannot make any changes. |

**Steps (Admin Only):**

1. Open the **Side Panel**.
2. In the **"Members"** section, find the member whose permission you want to change.
3. Next to their name, you'll see a **dropdown selector** showing their current access level ("Edit" or "View").
4. Click the dropdown and select the new permission level.
5. The change takes effect immediately — if a member is online, their editor switches to read-only or editable mode in real-time.

---

### 7.5 Removing a Member

**Steps (Admin Only):**

1. Open the **Side Panel**.
2. In the **"Members"** section, find the member you want to remove.
3. Click the **red "Remove" button** (person-minus icon) next to their name.
4. A **confirmation dialog** appears: *"Are you sure you want to remove this member?"*
5. Click **"Remove"** to confirm.
6. The member is immediately disconnected from the room. If they are online, they receive a real-time notification that they've been removed.
7. If they try to rejoin, they will need to go through the approval process again (or be re-invited via email).

---

### 7.6 Toggling Member Visibility

By default, all members can see the list of other members in the room. The admin can hide this.

**Steps (Admin Only):**

1. Open the **Side Panel**.
2. In **"Admin Controls"**, find the toggle labeled **"Show members to others"**.
3. Toggle it **off** to hide the member list from non-admin users.
4. Toggle it **on** to make the member list visible to everyone.

---

### 7.7 Exiting a Room (Non-Admin)

If you're not the admin and want to leave a room permanently:

**Steps:**

1. Open the **Side Panel**.
2. Scroll to the bottom, find the **"Exit Room"** button (red, with a door icon).
3. Click it.
4. A confirmation dialog appears: *"Are you sure you want to exit this room? You will need to rejoin and be approved by the admin again."*
5. Click **"Exit Room"** to confirm.
6. Your session is cleared and you're redirected to the landing page.

> [!WARNING]
> Exiting a room removes your membership. You'll need to rejoin from scratch and wait for admin approval again.

---

### 7.8 Deleting a Room (Admin)

**Prerequisites:** You must **remove all other members** (including pending requests) before the delete button becomes available.

**Steps (Admin Only):**

1. Open the **Side Panel**.
2. If other members exist, the **"Delete Room"** button will be grayed out with a message: *"Remove all other users (including pending requests) before deleting this room."*
3. Remove all other members first (see [Section 7.5](#75-removing-a-member)).
4. Once no other members exist, click the **"Delete Room"** button (red trash icon).
5. A warning confirmation dialog appears explaining that this action is **permanent and irreversible**.
6. Click **"Delete"** to permanently destroy the room and all its encrypted content.
7. All connected users (if any remain) are notified via WebSocket.
8. You are redirected to the landing page.

> [!CAUTION]
> **This action is irreversible.** All encrypted documents, pages, member records, and room metadata are permanently deleted from the server. There is no recovery mechanism.

---

### 7.9 Logging Out

Logging out clears your local session but does **not** remove your membership from the room.

**Steps:**

1. Open the **Side Panel**.
2. Click the **"Logout"** button at the bottom.
3. A confirmation dialog appears: *"Are you sure you want to logout? You will need to re-enter the room key to access this room again."*
4. Click **"Logout"** to confirm.
5. Your session is cleared and you're redirected to the landing page.
6. To get back in, use **"Rejoin Room"** and provide your Room ID and Room Key.

> [!TIP]
> **Logout vs. Exit Room**: Logging out keeps your membership active — you can re-enter with just the Room Key. Exiting removes your membership entirely, requiring re-approval from the admin.

---

## Quick Reference Card

| Action | Where | Who Can Do It |
|---|---|---|
| Create room | Landing page → "Create Room" | Anyone |
| Join room | Landing page → "Join Room" | Anyone |
| Rejoin room | Navbar / Landing page → "Rejoin Room" | Previous members |
| Invite by email | Side Panel → Invite section | Admin |
| Approve/reject requests | Side Panel → Pending Requests | Admin |
| Change permissions | Side Panel → Members → Dropdown | Admin |
| Remove member | Side Panel → Members → Remove button | Admin |
| Toggle member visibility | Side Panel → Admin Controls | Admin |
| Delete room | Side Panel → Delete Room | Admin (no other members) |
| Exit room | Side Panel → Exit Room | Non-admin members |
| Logout | Side Panel → Logout | Anyone |
| Create page | Page Tabs → "+" button | Edit-access members |
| Rename page | Right-click tab → Rename | Edit-access members |
| Delete page | Right-click tab → Delete | Edit-access members |
| Reorder pages | Drag & drop tabs | Edit-access members |
| Export page | Right-click tab → Export | Anyone |
| Insert image | Toolbar → Image button | Edit-access members |
| Attach file | Toolbar → Paperclip button | Edit-access members |
| Insert table | Toolbar → Table button | Edit-access members |
| Change theme | Toolbar → Sun/Moon icon | Anyone |
| Change notepad bg | Toolbar → Advanced → Notepad Background | Anyone (local) |
| Change font color | Toolbar → Advanced → Font Color | Anyone (local) |
| Float window | Toolbar → Float button | Anyone |

---

*TeamNotes — Where teams think together, securely.*
