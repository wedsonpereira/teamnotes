import { NextResponse } from "next/server";
import { Buffer } from "node:buffer";

const DEFAULT_AMOUNT = 5;
const DEFAULT_CURRENCY = "USD";
const PAYPAL_ENDPOINTS = {
    sandbox: "https://api-m.sandbox.paypal.com",
    production: "https://api-m.paypal.com",
};

function getRequestOrigin(request) {
    return (
        request.headers.get("origin")
        || process.env.NEXT_PUBLIC_APP_URL
        || process.env.APP_URL
        || "http://localhost:3000"
    ).replace(/\/$/, "");
}

function getPayPalEnvironment() {
    return process.env.PAYPAL_ENV === "production" ? "production" : "sandbox";
}

function getPositiveAmount(value, fallback) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed.toFixed(2) : fallback.toFixed(2);
}

async function getPayPalAccessToken(baseUrl, clientId, clientSecret) {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ grant_type: "client_credentials" }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.access_token) {
        throw new Error(data.error_description || data.error || "Failed to authenticate with PayPal.");
    }

    return data.access_token;
}

export async function POST(request) {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        return NextResponse.json(
            { error: "PayPal checkout is not configured." },
            { status: 501 }
        );
    }

    try {
        const environment = getPayPalEnvironment();
        const baseUrl = PAYPAL_ENDPOINTS[environment];
        const origin = getRequestOrigin(request);
        const accessToken = await getPayPalAccessToken(baseUrl, clientId, clientSecret);
        const amount = getPositiveAmount(process.env.DONATION_PAYPAL_AMOUNT, DEFAULT_AMOUNT);
        const currency = String(process.env.DONATION_PAYPAL_CURRENCY || DEFAULT_CURRENCY).toUpperCase();

        const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "PayPal-Request-Id": crypto.randomUUID(),
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        reference_id: `meal_${Date.now()}`,
                        description: "Buy Me a Meal donation",
                        amount: {
                            currency_code: currency,
                            value: amount,
                        },
                    },
                ],
                payment_source: {
                    paypal: {
                        experience_context: {
                            payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
                            landing_page: "LOGIN",
                            shipping_preference: "NO_SHIPPING",
                            user_action: "PAY_NOW",
                            return_url: `${origin}/?donation=paypal-success`,
                            cancel_url: `${origin}/?donation=paypal-cancelled`,
                        },
                    },
                },
            }),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const message = data.message || data.details?.[0]?.description || "Failed to create PayPal order.";
            return NextResponse.json({ error: message }, { status: response.status });
        }

        const approveUrl = data.links?.find((link) => link.rel === "approve")?.href;
        if (!approveUrl) {
            return NextResponse.json(
                { error: "PayPal did not return an approval URL." },
                { status: 502 }
            );
        }

        return NextResponse.json({ url: approveUrl, environment });
    } catch (error) {
        console.error("PayPal donation checkout error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create PayPal order." },
            { status: 500 }
        );
    }
}
