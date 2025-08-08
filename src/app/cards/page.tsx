"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CardsPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          router.push("/shop");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center animate-pulse">
            <ShoppingBag className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎌 Card Collection Moved!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            The card browsing feature has been moved to our premium shop.
            Discover amazing anime cards and purchase them with diamonds!
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/shop"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 w-full justify-center"
          >
            <ShoppingBag className="h-6 w-6" />
            <span>Go to Card Shop</span>
            <ArrowRight className="h-5 w-5" />
          </Link>

          <div className="bg-gray-100 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              ⏱️ Redirecting automatically in{" "}
              <strong className="text-purple-600">{countdown}</strong>{" "}
              seconds...
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            ✨ What's New in Shop?
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Browse cards without login required</li>
            <li>• Advanced filtering and search</li>
            <li>• Purchase with diamonds</li>
            <li>• Preview card details</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
