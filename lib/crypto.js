/**
 * AES-256-GCM Client-Side Encryption Module
 * Zero-knowledge: server never sees plaintext or the room key.
 *
 * Format: base64( salt(16) + iv(12) + ciphertext + authTag(16) )
 *
 * Uses Web Crypto API (works in browsers and Node 20+).
 */

const SALT_LEN = 16;
const IV_LEN = 12;
const PBKDF2_ITERATIONS = 100_000;

/**
 * Derive an AES-256-GCM key from a room key string.
 */
async function deriveKey(roomKey, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(roomKey),
        "PBKDF2",
        false,
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: PBKDF2_ITERATIONS,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

/**
 * Encrypt a Uint8Array (compressed content) with AES-256-GCM.
 * Returns a Uint8Array: salt(16) + iv(12) + ciphertext+tag
 */
export async function encrypt(data, roomKey) {
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN));
    const iv = crypto.getRandomValues(new Uint8Array(IV_LEN));
    const key = await deriveKey(roomKey, salt);

    const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        data
    );

    // Combine: salt + iv + ciphertext (includes auth tag)
    const result = new Uint8Array(SALT_LEN + IV_LEN + ciphertext.byteLength);
    result.set(salt, 0);
    result.set(iv, SALT_LEN);
    result.set(new Uint8Array(ciphertext), SALT_LEN + IV_LEN);
    return result;
}

/**
 * Decrypt a Uint8Array (salt + iv + ciphertext) with AES-256-GCM.
 * Returns the original Uint8Array (compressed content).
 */
export async function decrypt(encryptedData, roomKey) {
    const salt = encryptedData.slice(0, SALT_LEN);
    const iv = encryptedData.slice(SALT_LEN, SALT_LEN + IV_LEN);
    const ciphertext = encryptedData.slice(SALT_LEN + IV_LEN);

    const key = await deriveKey(roomKey, salt);

    const plaintext = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        ciphertext
    );

    return new Uint8Array(plaintext);
}

/**
 * Encrypt compressed bytes → base64 string (ready for API).
 */
export async function encryptToBase64(compressedBytes, roomKey) {
    const encrypted = await encrypt(compressedBytes, roomKey);
    // Convert to base64
    let binary = "";
    for (let i = 0; i < encrypted.length; i++) {
        binary += String.fromCharCode(encrypted[i]);
    }
    return btoa(binary);
}

/**
 * Decrypt base64 string → compressed bytes.
 */
export async function decryptFromBase64(base64String, roomKey) {
    const binary = atob(base64String);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return decrypt(bytes, roomKey);
}
