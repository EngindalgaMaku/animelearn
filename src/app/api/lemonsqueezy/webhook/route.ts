import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Webhook signature doğrulama
function verifySignature(body: string, signature: string, secret: string): boolean {
  const hash = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return `sha256=${hash}` === signature;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-signature');
    
    // Signature doğrulama
    if (!signature || !verifySignature(body, signature, process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const eventName = event.meta?.event_name;

    console.log('Lemonsqueezy Webhook:', eventName, event.data?.id);

    switch (eventName) {
      case 'order_created':
        await handleOrderCreated(event.data);
        break;
      
      case 'order_refunded':
        await handleOrderRefunded(event.data);
        break;

      case 'subscription_payment_success':
        await handlePaymentSuccess(event.data);
        break;

      default:
        console.log('Unhandled webhook event:', eventName);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Lemonsqueezy webhook hatası:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleOrderCreated(orderData: any) {
  try {
    const customData = orderData.attributes?.first_order_item?.variant?.product?.custom_data;
    const purchaseId = customData?.purchase_id;
    const userId = customData?.user_id;

    if (!purchaseId || !userId) {
      console.error('Custom data bulunamadı:', customData);
      return;
    }

    // Ödeme durumunu güncelle
    const purchase = await prisma.diamondPurchase.update({
      where: { id: purchaseId },
      data: {
        status: 'COMPLETED',
        shopierOrderId: orderData.id,
        completedAt: new Date(),
      }
    });

    // Kullanıcının elmas bakiyesini güncelle
    await prisma.user.update({
      where: { id: userId },
      data: {
        currentDiamonds: {
          increment: purchase.diamonds
        },
        totalDiamonds: {
          increment: purchase.diamonds
        }
      }
    });

    console.log(`✅ Ödeme tamamlandı: ${purchase.diamonds} elmas ${userId} nolu kullanıcıya eklendi`);

  } catch (error) {
    console.error('Order created işleme hatası:', error);
  }
}

async function handleOrderRefunded(orderData: any) {
  try {
    const customData = orderData.attributes?.first_order_item?.variant?.product?.custom_data;
    const purchaseId = customData?.purchase_id;
    const userId = customData?.user_id;

    if (!purchaseId || !userId) {
      console.error('Custom data bulunamadı:', customData);
      return;
    }

    // Ödeme durumunu güncelle
    const purchase = await prisma.diamondPurchase.update({
      where: { id: purchaseId },
      data: {
        status: 'REFUNDED',
      }
    });

    // Kullanıcının elmas bakiyesini düş
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user && user.currentDiamonds >= purchase.diamonds) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          currentDiamonds: {
            decrement: purchase.diamonds
          }
        }
      });
    }

    console.log(`🔄 Ödeme iade edildi: ${purchase.diamonds} elmas ${userId} nolu kullanıcıdan düşüldü`);

  } catch (error) {
    console.error('Order refunded işleme hatası:', error);
  }
}

async function handlePaymentSuccess(paymentData: any) {
  console.log('💰 Ödeme başarılı:', paymentData.id);
  // Subscription ödemeleri için ek işlemler buraya eklenebilir
}

export async function GET() {
  return NextResponse.json({ message: 'Lemonsqueezy webhook endpoint aktif' });
}
