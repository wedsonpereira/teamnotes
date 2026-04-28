import { NextResponse } from "next/server";

const DEFAULT_AMOUNT = 100;
const DEFAULT_CURRENCY = "INR";
const DEFAULT_API_VERSION = "2025-01-01";
const CASHFREE_ENDPOINTS = {
    sandbox: "https://sandbox.cashfree.com/pg/orders",
    production: "https://api.cashfree.com/pg/orders",
};

function getRequestOrigin(request) {
    return (
        request.headers.get("origin")
        || process.env.NEXT_PUBLIC_APP_URL
        || process.env.APP_URL
        || "http://localhost:3000"
    ).replace(/\/$/, "");
}

function getPositiveAmount(value, fallback) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) && parsed >= 1 ? Number(parsed.toFixed(2)) : fallback;
}

function getCashfreeEnvironment() {
    return process.env.CASHFREE_ENV === "production" ? "production" : "sandbox";
}

export async function POST(request) {
    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        return NextResponse.json(
            { error: "Cashfree checkout is not configured." },
            { status: 501 }
        );
    }

    try {
        const environment = getCashfreeEnvironment();
        const origin = getRequestOrigin(request);
        const orderId = `meal_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;
        const orderAmount = getPositiveAmount(process.env.DONATION_CASHFREE_AMOUNT, DEFAULT_AMOUNT);
        const orderCurrency = String(process.env.DONATION_CASHFREE_CURRENCY || DEFAULT_CURRENCY).toUpperCase();
        const apiVersion = process.env.CASHFREE_API_VERSION || DEFAULT_API_VERSION;
        const customerPhone = process.env.CASHFREE_CUSTOMER_PHONE || "9999999999";
        const customerEmail = process.env.CASHFREE_CUSTOMER_EMAIL || "supporter@example.com";
        const customerName = process.env.CASHFREE_CUSTOMER_NAME || "Teamnote Supporter";

        const response = await fetch(CASHFREE_ENDPOINTS[environment], {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-version": apiVersion,
                "x-client-id": clientId,
                "x-client-secret": clientSecret,
                "x-idempotency-key": crypto.randomUUID(),
            },
            body: JSON.stringify({
                order_id: orderId,
                order_amount: orderAmount,
                order_currency: orderCurrency,
                order_note: "Buy Me a Meal donation",
                customer_details: {
                    customer_id: `supporter_${orderId}`,
                    customer_name: customerName,
                    customer_email: customerEmail,
                    customer_phone: customerPhone,
                },
                order_meta: {
                    return_url: `${origin}/?donation=cashfree&order_id=${orderId}`,
                },
            }),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || data.error || "Failed to create Cashfree order." },
                { status: response.status }
            );
        }

        return NextResponse.json({
            paymentSessionId: data.payment_session_id,
            environment,
        });
    } catch (error) {
        console.error("Cashfree donation checkout error:", error);
        return NextResponse.json(
            { error: "Failed to create Cashfree order." },
            { status: 500 }
        );
    }
}
