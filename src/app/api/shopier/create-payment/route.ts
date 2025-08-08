import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import crypto from "crypto";

interface ShopierPaymentRequest {
  packageId: string;
  packageName: string;
  diamonds: number;
  price: number;
  userId: string;
}

// Shopier configuration - Bu bilgileri environment variable'lardan alacağız
const SHOPIER_API_KEY = process.env.SHOPIER_API_KEY || "";
const SHOPIER_API_SECRET = process.env.SHOPIER_API_SECRET || "";
const SHOPIER_WEBSITE_ID = process.env.SHOPIER_WEBSITE_ID || "";
const SHOPIER_API_URL = "https://www.shopier.com/api/payment";

export async function POST(request: NextRequest) {
  try {
    const body: ShopierPaymentRequest = await request.json();
    const { packageId, packageName, diamonds, price, userId } = body;

    // Verify user authentication
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("auth-token");

    if (!authCookie) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
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
    const orderId = `DMD_${Date.now()}_${userId.substring(0, 8)}`;
    
    // Create pending payment record in database
    const paymentRecord = await prisma.diamondPurchase.create({
      data: {
        id: orderId,
        userId: userId,
        packageId: packageId,
        packageName: packageName,
        diamonds: diamonds,
        price: price,
        currency: "TRY",
        status: "PENDING",
        shopierOrderId: orderId,
        createdAt: new Date(),
      },
    });

    // Prepare Shopier payment data
    const shopierData = {
      API_key: SHOPIER_API_KEY,
      website_id: SHOPIER_WEBSITE_ID,
      platform_order_id: orderId,
      product_name: `${packageName} - ${diamonds} Diamonds`,
      product_type: 1, // Digital product
      buyer_name: user.firstName || user.username,
      buyer_phone: user.phone || "5551234567",
      buyer_email: user.email,
      buyer_account_age: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)), // Days
      total_order_value: price,
      currency: "TRY",
      platform: "web",
      is_in_frame: 0,
      current_language: "tr",
      modul_version: "1.0",
      random_nr: Math.floor(Math.random() * 1000000),
      // Return URLs
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/store/success?order=${orderId}`,
      fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/store/failure?order=${orderId}`,
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/shopier/callback`,
    };

    // Generate signature for Shopier
    const signatureString = `${shopierData.random_nr}${shopierData.platform_order_id}${shopierData.total_order_value}${shopierData.currency}`;
    const signature = crypto
      .createHmac("sha256", SHOPIER_API_SECRET)
      .update(signatureString)
      .digest("hex");

    // Add signature to data
    const finalData = {
      ...shopierData,
      signature: signature,
    };

    // Create form data for Shopier API
    const formData = new FormData();
    Object.entries(finalData).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    // Send request to Shopier
    const shopierResponse = await fetch(SHOPIER_API_URL, {
      method: "POST",
      body: formData,
    });

    if (!shopierResponse.ok) {
      throw new Error(`Shopier API error: ${shopierResponse.status}`);
    }

    const shopierResult = await shopierResponse.text();
    
    // Shopier returns HTML redirect page or JSON with payment URL
    // For simplicity, we'll construct the payment URL manually
    const paymentUrl = `https://www.shopier.com/payment/${SHOPIER_WEBSITE_ID}/${orderId}`;

    return NextResponse.json({
      success: true,
      paymentUrl: paymentUrl,
      orderId: orderId,
    });

  } catch (error) {
    console.error("Shopier payment creation failed:", error);
    return NextResponse.json(
      { success: false, error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
