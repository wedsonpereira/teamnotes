/**
 * Structured, safe logging utility for production.
 *
 * Prevents leaking full stack traces and sensitive data into logs.
 * In development mode, outputs verbose information for debugging.
 * In production, logs a concise error summary without internal details.
 */

const isDev = process.env.NODE_ENV !== "production";

/**
 * Log an error with context, sanitizing sensitive details in production.
 *
 * @param {string} context - A short label identifying where the error occurred.
 * @param {unknown} error - The error object or value.
 */
export function logError(context, error) {
    if (isDev) {
        // In development, output everything for debugging.
        console.error(`[${context}]`, error);
        return;
    }

    // In production, only log the error message — no stack traces,
    // no potentially sensitive internals.
    const message =
        error instanceof Error ? error.message : String(error);
    console.error(`[${context}] ${message}`);
}

/**
 * Log an informational message.
 *
 * @param {string} context - A short label.
 * @param {string} message - The message.
 */
export function logInfo(context, message) {
    console.log(`[${context}] ${message}`);
}
