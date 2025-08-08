import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const SHOPIER_API_SECRET = process.env.SHOPIER_API_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract Shopier callback data
    const orderStatus = formData.get("order_status") as string;
    const platformOrderId = formData.get("platform_order_id") as string;
    const shopierOrderId = formData.get("shopier_order_id") as string;
    const totalOrderValue = formData.get("total_order_value") as string;
    const currency = formData.get("currency") as string;
    const signature = formData.get("signature") as string;
    const paymentMethod = formData.get("payment_method") as string;
    const randomNr = formData.get("random_nr") as string;

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", SHOPIER_API_SECRET)
      .update(`${randomNr}${platformOrderId}${totalOrderValue}${currency}`)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid signature in Shopier callback");
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    // Find the payment record
    const paymentRecord = await prisma.diamondPurchase.findUnique({
      where: { id: platformOrderId },
      include: { user: true },
    });

    if (!paymentRecord) {
      console.error("Payment record not found:", platformOrderId);
      return NextResponse.json({ success: false, error: "Payment not found" }, { status: 404 });
    }

    if (orderStatus === "payment_completed") {
      // Payment successful
      await prisma.$transaction(async (tx) => {
        // Update payment record
        await tx.diamondPurchase.update({
          where: { id: platformOrderId },
          data: {
            status: "COMPLETED",
            shopierPaymentId: shopierOrderId,
            paymentMethod: paymentMethod,
            completedAt: new Date(),
          },
        });

        // Add diamonds to user account
        await tx.user.update({
          where: { id: paymentRecord.userId },
          data: {
            currentDiamonds: {
              increment: paymentRecord.diamonds,
            },
            totalDiamonds: {
              increment: paymentRecord.diamonds,
            },
          },
        });

        // Create diamond transaction record
        await tx.diamondTransaction.create({
          data: {
            userId: paymentRecord.userId,
            amount: paymentRecord.diamonds,
            type: "PURCHASE",
            description: `Diamond purchase: ${paymentRecord.packageName}`,
            relatedId: platformOrderId,
            relatedType: "DIAMOND_PURCHASE",
          },
        });

        // Award XP for purchase (optional)
        const xpReward = Math.floor(paymentRecord.diamonds / 10); // 1 XP per 10 diamonds
        await tx.user.update({
          where: { id: paymentRecord.userId },
          data: {
            experience: {
              increment: xpReward,
            },
          },
        });
      });

      console.log(`Payment completed for order ${platformOrderId}`);
    } else {
      // Payment failed
      await prisma.diamondPurchase.update({
        where: { id: platformOrderId },
        data: {
          status: "FAILED",
          failureReason: orderStatus,
          shopierPaymentId: shopierOrderId,
        },
      });

      console.log(`Payment failed for order ${platformOrderId}: ${orderStatus}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Shopier callback error:", error);
    return NextResponse.json(
      { success: false, error: "Callback processing failed" },
      { status: 500 }
    );
  }
}
