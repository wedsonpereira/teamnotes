import { NextResponse } from "next/server";

const DEFAULT_AMOUNT_CENTS = 500;
const DEFAULT_CURRENCY = "usd";
const DEFAULT_PRODUCT_NAME = "Buy Me a Meal";

function getRequestOrigin(request) {
    return (
        request.headers.get("origin")
        || process.env.NEXT_PUBLIC_APP_URL
        || process.env.APP_URL
        || "http://localhost:3000"
    ).replace(/\/$/, "");
}

function getPositiveInteger(value, fallback) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function POST(request) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
        return NextResponse.json(
            { error: "Stripe checkout is not configured." },
            { status: 501 }
        );
    }

    try {
        const origin = getRequestOrigin(request);
        const amount = getPositiveInteger(
            process.env.DONATION_STRIPE_AMOUNT_CENTS,
            DEFAULT_AMOUNT_CENTS
        );
        const currency = String(process.env.DONATION_STRIPE_CURRENCY || DEFAULT_CURRENCY).toLowerCase();
        const productName = process.env.DONATION_STRIPE_PRODUCT_NAME || DEFAULT_PRODUCT_NAME;

        const body = new URLSearchParams({
            mode: "payment",
            success_url: `${origin}/?donation=stripe-success`,
            cancel_url: `${origin}/?donation=stripe-cancelled`,
            "line_items[0][quantity]": "1",
            "line_items[0][price_data][currency]": currency,
            "line_items[0][price_data][unit_amount]": String(amount),
            "line_items[0][price_data][product_data][name]": productName,
        });

        const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${stripeSecretKey}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error?.message || "Failed to create Stripe checkout session." },
                { status: response.status }
            );
        }

        return NextResponse.json({ url: data.url });
    } catch (error) {
        console.error("Stripe donation checkout error:", error);
        return NextResponse.json(
            { error: "Failed to create Stripe checkout session." },
            { status: 500 }
        );
    }
}
