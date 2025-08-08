"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Diamond,
  Sparkles,
  Trophy,
  Gift,
  ArrowRight,
  Home,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const { user, refreshUser } = useAuth();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchPaymentData();
      refreshUser(); // Refresh user data to show updated diamonds
    }
  }, [orderId]);

  const fetchPaymentData = async () => {
    try {
      const response = await fetch(`/api/shopier/payment-status?order=${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setPaymentData(data.payment);
      }
    } catch (error) {
      console.error("Failed to fetch payment data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [0, 1, 0],
              rotate: 360,
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.2,
            }}
          >
            <Sparkles className="h-6 w-6 text-green-300 opacity-20" />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="max-w-2xl w-full bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center border border-green-200"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Icon */}
          <motion.div
            className="mx-auto mb-6 w-24 h-24 bg-green-500 rounded-full flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          >
            <CheckCircle className="h-12 w-12 text-white" />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎉 Payment Successful! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your diamonds have been added to your account instantly!
            </p>
          </motion.div>

          {/* Payment Details */}
          {paymentData && (
            <motion.div
              className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <Diamond className="h-12 w-12 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-bold text-gray-900 text-lg">Diamonds Received</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    💎 {paymentData.diamonds?.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <Gift className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <h3 className="font-bold text-gray-900 text-lg">Package</h3>
                  <p className="text-lg text-green-600 font-medium">
                    {paymentData.packageName}
                  </p>
                  <p className="text-gray-600">${paymentData.price}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Current Balance */}
          {user && (
            <motion.div
              className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <h3 className="font-bold text-gray-900 text-lg mb-2">Your Current Balance</h3>
              <p className="text-4xl font-bold text-purple-600">
                💎 {user.currentDiamonds?.toLocaleString()}
              </p>
              <p className="text-gray-600 mt-2">Ready to spend on amazing cards!</p>
            </motion.div>
          )}

          {/* Achievement Notification */}
          <motion.div
            className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-bold text-gray-900 text-lg">Achievement Unlocked!</h3>
            <p className="text-yellow-700 font-medium">💫 Diamond Collector</p>
            <p className="text-gray-600 text-sm">You've made your first diamond purchase!</p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <Link
              href="/shop"
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Sparkles className="h-5 w-5" />
              <span>Start Shopping</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            
            <Link
              href="/dashboard"
              className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 font-bold py-4 px-8 rounded-xl hover:bg-gray-200 transition-all duration-300 border border-gray-300"
            >
              <Home className="h-5 w-5" />
              <span>Go to Dashboard</span>
            </Link>
          </motion.div>

          {/* Order Info */}
          {orderId && (
            <motion.div
              className="mt-8 pt-6 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <p className="text-gray-500 text-sm">
                Order ID: <span className="font-mono">{orderId}</span>
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}