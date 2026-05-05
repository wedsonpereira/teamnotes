"use client";

const HEIC_EXT_RE = /\.(heic|heif)$/i;
const HEIC_MIME_RE = /^image\/hei[cf](?:-sequence)?$/i;
const DEFAULT_JPEG_QUALITY = 0.9;
const MIN_JPEG_QUALITY = 0.5;
const MAX_IMAGE_DIMENSION = 2560;

export function isImageFile(file) {
    if (!file) return false;
    const type = typeof file.type === "string" ? file.type : "";
    const name = typeof file.name === "string" ? file.name : "";
    return type.startsWith("image/") || HEIC_EXT_RE.test(name);
}

export function isHeicOrHeifFile(file) {
    if (!file) return false;
    const type = typeof file.type === "string" ? file.type : "";
    const name = typeof file.name === "string" ? file.name : "";
    return HEIC_MIME_RE.test(type) || HEIC_EXT_RE.test(name);
}

export function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Failed to read file."));
        reader.readAsDataURL(file);
    });
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Image could not be decoded."));
        image.src = src;
    });
}

function getScaledSize(width, height) {
    const maxSide = Math.max(width, height);
    if (!Number.isFinite(maxSide) || maxSide <= MAX_IMAGE_DIMENSION) {
        return { width, height };
    }

    const scale = MAX_IMAGE_DIMENSION / maxSide;
    return {
        width: Math.max(1, Math.round(width * scale)),
        height: Math.max(1, Math.round(height * scale)),
    };
}

function dataUrlByteLength(dataUrl) {
    const commaIndex = String(dataUrl || "").indexOf(",");
    const payload = commaIndex >= 0 ? dataUrl.slice(commaIndex + 1) : dataUrl;
    return Math.ceil(payload.length * 0.75);
}

function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error("Image conversion failed."));
                }
            },
            type,
            quality
        );
    });
}

function blobToDataUrl(blob) {
    return readFileAsDataUrl(blob);
}

async function convertImageDataUrlToJpeg(dataUrl, maxBytes) {
    const image = await loadImage(dataUrl);
    const intrinsicWidth = image.naturalWidth || image.width;
    const intrinsicHeight = image.naturalHeight || image.height;
    let { width, height } = getScaledSize(intrinsicWidth, intrinsicHeight);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Image conversion is not available in this browser.");
    }

    let quality = DEFAULT_JPEG_QUALITY;
    let blob = null;

    while (true) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);
        blob = await canvasToBlob(canvas, "image/jpeg", quality);

        if (!maxBytes || blob.size <= maxBytes) break;

        if (quality > MIN_JPEG_QUALITY) {
            quality = Math.max(MIN_JPEG_QUALITY, quality - 0.1);
            continue;
        }

        width = Math.max(320, Math.round(width * 0.85));
        height = Math.max(320, Math.round(height * 0.85));
        if (width <= 320 || height <= 320) break;
    }

    if (maxBytes && blob.size > maxBytes) {
        throw new Error("Image could not be compressed below the upload limit.");
    }

    return blobToDataUrl(blob);
}

export async function readImageAsRenderableDataUrl(file, options = {}) {
    const src = await readFileAsDataUrl(file);
    const maxBytes = options.maxBytes || 0;
    if (
        !isHeicOrHeifFile(file) &&
        (!maxBytes || dataUrlByteLength(src) <= maxBytes)
    ) {
        return src;
    }

    return convertImageDataUrlToJpeg(src, maxBytes);
}
