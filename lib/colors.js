/**
 * Unique member colors — vivid, high-contrast palette that works on both
 * dark and light themes. Avoids white, black, and near-gray tones.
 */
const MEMBER_COLORS = [
    "#DC2626", // Red
    "#EA580C", // Orange
    "#CA8A04", // Amber
    "#65A30D", // Lime
    "#059669", // Emerald
    "#0891B2", // Cyan
    "#2563EB", // Blue
    "#7C3AED", // Violet
    "#C026D3", // Fuchsia
    "#DB2777", // Pink
    "#BE123C", // Rose
    "#0F766E", // Teal
];

/**
 * Pick a color for a new member based on the count of existing members
 * in the room. Each member gets the next color in the palette, cycling
 * if there are more members than colors.
 *
 * @param {number} existingMemberCount - how many members already exist
 * @returns {string} hex color
 */
export function pickMemberColor(existingMemberCount = 0) {
    return MEMBER_COLORS[existingMemberCount % MEMBER_COLORS.length];
}

/**
 * Deterministic fallback — used when we need a color from a name string
 * (e.g. for users who joined before the color field was added).
 *
 * @param {string} name
 * @returns {string} hex color
 */
export function colorFromName(name) {
    let hash = 0;
    for (let i = 0; i < (name || "").length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return MEMBER_COLORS[Math.abs(hash) % MEMBER_COLORS.length];
}
