import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";

// Initialize Stripe only when needed to avoid build-time errors
function getStripeClient() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not configured");
  }
  return new Stripe(apiKey, {
    apiVersion: "2025-07-30.basil",
  });
}

interface StripePaymentRequest {
  packageId: string;
  packageName: string;
  diamonds: number;
  price: number;
  currency: string;
  userId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: StripePaymentRequest = await request.json();
    const { packageId, packageName, diamonds, price, currency, userId } = body;

    // Verify user authentication via NextAuth
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Ensure the request user matches the authenticated session user
    if (userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Generate unique order ID
    const orderId = `STRIPE_${Date.now()}_${userId.substring(0, 8)}`;

    // Create pending payment record in database
    const paymentRecord = await prisma.diamondTransaction.create({
      data: {
        userId: userId,
        amount: diamonds,
        type: "PENDING_PURCHASE",
        description: `Pending: ${packageName} - ${diamonds} Diamonds`,
        relatedId: orderId,
        relatedType: "STRIPE_PURCHASE",
      },
    });

    // Create Stripe Checkout Session
    const stripe = getStripeClient();
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `${packageName} - Premium Diamonds`,
              description: `${diamonds} premium diamonds for your gaming experience`,
              images: ["https://your-domain.com/diamond-icon.png"], // Add your diamond icon URL
              metadata: {
                package_id: packageId,
                diamonds: diamonds.toString(),
              },
            },
            unit_amount: Math.round(price * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/store/success?session_id={CHECKOUT_SESSION_ID}&order=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/store/failure?order=${orderId}&reason=cancelled`,
      metadata: {
        order_id: orderId,
        user_id: userId,
        package_id: packageId,
        diamonds: diamonds.toString(),
        payment_record_id: paymentRecord.id,
      },
      customer_email: user.email,
      billing_address_collection: "auto",
      payment_intent_data: {
        metadata: {
          order_id: orderId,
          user_id: userId,
          package_id: packageId,
          diamonds: diamonds.toString(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: stripeSession.url,
      sessionId: stripeSession.id,
      orderId: orderId,
    });
  } catch (error) {
    console.error("Stripe payment creation failed:", error);
    return NextResponse.json(
      { success: false, error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
