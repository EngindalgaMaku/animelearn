import { NextRequest, NextResponse } from 'next/server';
import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lemonsqueezy API anahtarını ayarla
lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY!,
  onError: (error) => console.error('Lemonsqueezy Error:', error),
});

// Elmas paketleri ve fiyatları
const DIAMOND_PACKAGES = {
  'starter': { diamonds: 100, price: 499, variant_id: process.env.LEMONSQUEEZY_STARTER_VARIANT_ID },
  'bronze': { diamonds: 250, price: 999, variant_id: process.env.LEMONSQUEEZY_BRONZE_VARIANT_ID },
  'silver': { diamonds: 500, price: 1899, variant_id: process.env.LEMONSQUEEZY_SILVER_VARIANT_ID },
  'gold': { diamonds: 1200, price: 3999, variant_id: process.env.LEMONSQUEEZY_GOLD_VARIANT_ID },
  'diamond': { diamonds: 2500, price: 7999, variant_id: process.env.LEMONSQUEEZY_DIAMOND_VARIANT_ID }
};

export async function POST(request: NextRequest) {
  try {
    const { packageType, userId, userEmail, userName } = await request.json();

    // Paket kontrolü
    if (!DIAMOND_PACKAGES[packageType as keyof typeof DIAMOND_PACKAGES]) {
      return NextResponse.json(
        { error: 'Geçersiz paket türü' },
        { status: 400 }
      );
    }

    const packageInfo = DIAMOND_PACKAGES[packageType as keyof typeof DIAMOND_PACKAGES];

    // Kullanıcı kontrolü
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Veritabanında ödeme kaydı oluştur
    const diamondPurchase = await prisma.diamondPurchase.create({
      data: {
        userId: user.id,
        packageId: packageType,
        packageName: `${packageInfo.diamonds} Elmas Paketi`,
        diamonds: packageInfo.diamonds,
        price: packageInfo.price,
        currency: 'TRY',
        status: 'PENDING',
        paymentMethod: 'LEMONSQUEEZY',
      }
    });

    // Lemonsqueezy checkout oturumu oluştur
    const checkout = await createCheckout(
      process.env.LEMONSQUEEZY_STORE_ID!,
      packageInfo.variant_id!,
      {
        checkoutOptions: {
          embed: false,
          media: true,
          logo: true,
        },
        checkoutData: {
          email: userEmail,
          name: userName,
          custom: {
            user_id: userId.toString(),
            purchase_id: diamondPurchase.id.toString(),
            package_type: packageType,
          }
        },
        productOptions: {
          name: `${packageInfo.diamonds} Elmas Paketi`,
          description: `${packageType.charAt(0).toUpperCase() + packageType.slice(1)} paket - ${packageInfo.diamonds} elmas`,
          media: [
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
          ],
        },
        expiresAt: null,
        preview: true,
        testMode: process.env.NODE_ENV !== 'production',
      }
    );

    if (!checkout.data) {
      throw new Error('Checkout oluşturulamadı');
    }

    // Checkout response type casting
    const checkoutData = checkout.data as any;

    // Shopier order ID'yi güncelle
    await prisma.diamondPurchase.update({
      where: { id: diamondPurchase.id },
      data: { shopierOrderId: checkoutData.id?.toString() || '' }
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutData.attributes?.url || checkoutData.url,
      purchaseId: diamondPurchase.id
    });

  } catch (error) {
    console.error('Lemonsqueezy ödeme hatası:', error);
    return NextResponse.json(
      { error: 'Ödeme işlemi başlatılamadı' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Lemonsqueezy ödeme API aktif' });
}
