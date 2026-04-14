export async function GET() {
    // Avoid noisy 404s in environments where no favicon file is provided yet.
    return new Response("", {
        status: 200,
        headers: {
            "Content-Type": "image/x-icon",
            "Cache-Control": "public, max-age=86400",
        },
    });
}
