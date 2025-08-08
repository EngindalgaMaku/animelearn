import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("order");

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID required" },
        { status: 400 }
      );
    }

    // Find the payment record (temporarily using DiamondTransaction until Prisma is regenerated)
    const payment = await prisma.diamondTransaction.findFirst({
      where: { 
        relatedId: orderId,
        relatedType: "DIAMOND_PURCHASE"
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            currentDiamonds: true
          }
        }
      }
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      );
    }

    // For now, return basic payment info
    const paymentData = {
      id: orderId,
      packageName: payment.description.replace("Diamond purchase: ", ""),
      diamonds: payment.amount,
      price: 0, // Will be available once DiamondPurchase model is properly created
      status: "COMPLETED",
      completedAt: payment.createdAt
    };

    return NextResponse.json({
      success: true,
      payment: paymentData
    });

  } catch (error) {
    console.error("Payment status check failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check payment status" },
      { status: 500 }
    );
  }
}
